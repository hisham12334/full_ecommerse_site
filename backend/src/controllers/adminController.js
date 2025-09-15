class AdminController {
  constructor(db) {
    this.db = db;
  }

  // Get dashboard stats
  async getDashboardStats(req, res) {
    try {
      const stats = {
        totalOrders: 0,
        totalProducts: 0,
        totalUsers: 0,
        totalRevenue: 0
      };
      
      const ordersResult = await this.db.query("SELECT COUNT(*) as count FROM orders");
      stats.totalOrders = parseInt(ordersResult.rows[0].count);

      const productsResult = await this.db.query("SELECT COUNT(*) as count FROM products");
      stats.totalProducts = parseInt(productsResult.rows[0].count);

      const usersResult = await this.db.query("SELECT COUNT(*) as count FROM users");
      stats.totalUsers = parseInt(usersResult.rows[0].count);
      
      const revenueResult = await this.db.query("SELECT SUM(total) as revenue FROM orders WHERE payment_status = 'completed'");
      stats.totalRevenue = parseInt(revenueResult.rows[0].revenue) || 0;

      res.json(stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
  }

  // Get all users
  async getAllUsers(req, res) {
    try {
      const result = await this.db.query("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC");
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }

  // Update user role
  async updateUserRole(req, res) {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    try {
      const result = await this.db.query("UPDATE users SET role = $1 WHERE id = $2", [role, id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ success: true, message: 'User role updated successfully' });
    } catch (error) {
      console.error('Error updating user role:', error);
      res.status(500).json({ error: 'Failed to update user role' });
    }
  }

  // Delete user
  async deleteUser(req, res) {
    const { id } = req.params;
    try {
      const result = await this.db.query("DELETE FROM users WHERE id = $1", [id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  }
}

module.exports = AdminController;