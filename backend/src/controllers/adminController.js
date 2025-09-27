// backend/src/controllers/adminController.js

class AdminController {
    constructor(db) {
        this.db = db;
    }

    async createProduct(req, res) {
        // Log the raw incoming data for debugging
        console.log('Received new product request. Body:', req.body);
        console.log('Received file:', req.file);

        const { title, price, description, category, colors, variants } = req.body;
        const imagePath = req.file ? req.file.path : '';

        if (!title || !price || !imagePath) {
            return res.status(400).json({ error: 'Title, price, and a main image are required.' });
        }

        let parsedVariants = [];
        let parsedColors = [];
        try {
            // Robustly parse variants and colors, providing defaults if they are missing
            if (variants) {
                parsedVariants = JSON.parse(variants);
            }
            if (colors) {
                parsedColors = JSON.parse(colors);
            }
        } catch (e) {
            console.error('JSON Parsing Error:', e);
            return res.status(400).json({ error: 'Invalid format for variants or colors. Please check your data.' });
        }

        const client = await this.db.connect();
        try {
            await client.query('BEGIN');
            console.log('Database transaction started.');

            const productQuery = `
                INSERT INTO products (title, price, images, description, category, colors, status) 
                VALUES ($1, $2, $3, $4, $5, $6, 'active') RETURNING id
            `;
            const productValues = [
                title.trim(),
                parseFloat(price),
                JSON.stringify([imagePath]), // Save the uploaded image URL in an array
                description || null,
                category || null,
                JSON.stringify(parsedColors)
            ];
            
            const productResult = await client.query(productQuery, productValues);
            const productId = productResult.rows[0].id;
            console.log(`Product created with ID: ${productId}`);

            if (Array.isArray(parsedVariants) && parsedVariants.length > 0) {
                for (const variant of parsedVariants) {
                    if (variant.sku && variant.size) {
                        await client.query(
                            'INSERT INTO product_variants (product_id, size, sku, quantity) VALUES ($1, $2, $3, $4)',
                            [productId, variant.size, variant.sku, parseInt(variant.quantity) || 0]
                        );
                    }
                }
                console.log(`${parsedVariants.length} variants inserted.`);
            }

            await client.query('COMMIT');
            console.log('Transaction committed successfully.');
            
            // Send the final success response
            return res.status(201).json({ success: true, message: 'Product created successfully!' });

        } catch (error) {
            // This will now catch ANY error during the transaction
            await client.query('ROLLBACK');
            console.error('🔴 FATAL ERROR during product creation:', error);
            return res.status(500).json({ error: 'A critical server error occurred. Please check the backend logs for details.' });
        } finally {
            // This ensures the database client is always released
            client.release();
        }
    }

    // --- All other functions (getAllProducts, deleteProduct, etc.) remain below ---
    async getAllProducts(req, res) { try { const query = ` SELECT p.*, json_agg(json_build_object('id', pv.id, 'size', pv.size, 'sku', pv.sku, 'quantity', pv.quantity)) as variants FROM products p LEFT JOIN product_variants pv ON p.id = pv.product_id GROUP BY p.id ORDER BY p.created_at DESC; `; const result = await this.db.query(query); res.json(result.rows); } catch (error) { console.error('Error fetching admin products:', error); res.status(500).json({ error: 'Failed to fetch products' }); } }
    async deleteProduct(req, res) { const client = await this.db.connect(); try { await client.query('BEGIN'); await client.query('DELETE FROM product_variants WHERE product_id = $1', [req.params.id]); await client.query('DELETE FROM products WHERE id = $1', [req.params.id]); await client.query('COMMIT'); res.json({ success: true, message: 'Product deleted successfully' }); } catch (error) { await client.query('ROLLBACK'); console.error('Failed to delete product:', error); res.status(500).json({ error: 'Failed to delete product' }); } finally { client.release(); } }
    async getDashboardStats(req, res) { try { const [ordersResult, productsResult, usersResult, revenueResult] = await Promise.all([ this.db.query("SELECT COUNT(*) as count FROM orders"), this.db.query("SELECT COUNT(*) as count FROM products"), this.db.query("SELECT COUNT(*) as count FROM users"), this.db.query("SELECT SUM(total) as revenue FROM orders WHERE payment_status = 'paid'") ]); const stats = { totalOrders: parseInt(ordersResult.rows[0].count), totalProducts: parseInt(productsResult.rows[0].count), totalUsers: parseInt(usersResult.rows[0].count), totalRevenue: parseFloat(revenueResult.rows[0].revenue) || 0 }; res.json(stats); } catch (error) { console.error('Error fetching dashboard stats:', error); res.status(500).json({ error: 'Failed to fetch dashboard stats' }); } }
    async getAllUsers(req, res) { try { const result = await this.db.query("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC"); res.json(result.rows); } catch (error) { console.error('Error fetching users:', error); res.status(500).json({ error: 'Failed to fetch users' }); } }
    async updateUserRole(req, res) { const { id } = req.params; const { role } = req.body; if (!role || !['user', 'admin'].includes(role)) { return res.status(400).json({ error: 'Invalid role' }); } try { const result = await this.db.query("UPDATE users SET role = $1 WHERE id = $2", [role, id]); if (result.rowCount === 0) return res.status(404).json({ error: 'User not found' }); res.json({ success: true, message: 'User role updated' }); } catch (error) { console.error('Error updating user role:', error); res.status(500).json({ error: 'Failed to update user role' }); } }
    async deleteUser(req, res) { const { id } = req.params; try { const result = await this.db.query("DELETE FROM users WHERE id = $1", [id]); if (result.rowCount === 0) return res.status(404).json({ error: 'User not found' }); res.json({ success: true, message: 'User deleted' }); } catch (error) { console.error('Error deleting user:', error); res.status(500).json({ error: 'Failed to delete user' }); } }
    async getAllOrders(req, res) { try { const result = await this.db.query(` SELECT o.*, u.name as user_name, u.email as user_email FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC `); res.json(result.rows); } catch (error) { console.error('Error fetching all orders:', error); res.status(500).json({ error: 'Failed to fetch orders' }); } }
    async updateOrderStatus(req, res) { const { id } = req.params; const { order_status } = req.body; const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']; if (!order_status || !validStatuses.includes(order_status)) { return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }); } try { const result = await this.db.query("UPDATE orders SET order_status = $1 WHERE id = $2 RETURNING *", [order_status, id]); if (result.rowCount === 0) { return res.status(404).json({ error: 'Order not found' }); } res.json({ success: true, message: 'Order status updated successfully', order: result.rows[0] }); } catch (error) { console.error('Error updating order status:', error); res.status(500).json({ error: 'Failed to update order status' }); } }
    async updateProduct(req, res) { const { id } = req.params; const { title, price, description, category, colors, variants, status } = req.body; const imagePath = req.file ? req.file.path : null; let parsedVariants, parsedColors; try { parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : (variants || []); parsedColors = colors ? (typeof colors === 'string' ? JSON.parse(colors) : colors) : []; } catch (e) { return res.status(400).json({ error: 'Invalid JSON format for variants or colors.' }); } const client = await this.db.connect(); try { await client.query('BEGIN'); const productFields = { title, price, description, category, status, colors: JSON.stringify(parsedColors) }; if (imagePath) { productFields.images = JSON.stringify([imagePath]); } const setClauses = Object.keys(productFields) .filter(key => productFields[key] !== undefined) .map((key, i) => `"${key}" = $${i + 1}`) .join(', '); if (setClauses) { const values = Object.values(productFields).filter(v => v !== undefined); values.push(id); const productUpdateQuery = `UPDATE products SET ${setClauses} WHERE id = $${values.length}`; await client.query(productUpdateQuery, values); } if(Array.isArray(parsedVariants)) { await client.query('DELETE FROM product_variants WHERE product_id = $1', [id]); const variantInsertQuery = ` INSERT INTO product_variants (product_id, size, sku, quantity) VALUES ($1, $2, $3, $4) `; for (const variant of parsedVariants) { if (variant.sku && variant.sku.trim()) { await client.query(variantInsertQuery, [id, variant.size, variant.sku.trim(), variant.quantity || 0]); } } } await client.query('COMMIT'); res.json({ success: true, message: 'Product updated successfully' }); } catch (error) { await client.query('ROLLBACK'); console.error('Failed to update product:', error); res.status(500).json({ error: 'Failed to update product' }); } finally { client.release(); } }
}

module.exports = AdminController;