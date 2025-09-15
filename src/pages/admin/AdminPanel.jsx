import React, { useState, useEffect } from 'react';
import { Upload, Edit2, Trash2, Eye, Package, Users, ShoppingBag, TrendingUp } from 'lucide-react';
import apiService from "../../services/api";

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(false);

    // Product form state
    const [productForm, setProductForm] = useState({
        title: '',
        price: '',
        description: '',
        category: '',
        sizes: [],
        colors: [],
        stock_quantity: '',
        sku: '',
        image: null
    });
    const [editingProduct, setEditingProduct] = useState(null);

    const API_BASE = '/api'; // Use relative path for proxy

    // Fetch data using apiService
    const fetchData = async () => {
        try {
            setLoading(true);
            const [productsData, ordersData, usersData, statsData] = await Promise.all([
                apiService.request('/admin/products'),
                apiService.request('/admin/orders'),
                apiService.request('/admin/users'),
                apiService.request('/admin/dashboard/stats')
            ]);
            setProducts(productsData);
            setOrders(ordersData);
            setUsers(usersData);
            setStats(statsData);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Product management
    const handleProductSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', productForm.title);
        formData.append('price', productForm.price);
        formData.append('description', productForm.description);
        formData.append('category', productForm.category);
        formData.append('sizes', JSON.stringify(productForm.sizes));
        formData.append('colors', JSON.stringify(productForm.colors));
        formData.append('stock_quantity', productForm.stock_quantity);
        formData.append('sku', productForm.sku);

        if (productForm.image) {
            formData.append('image', productForm.image);
        }

        try {
            const url = editingProduct 
                ? `${API_BASE}/admin/products/${editingProduct.id}`
                : `${API_BASE}/admin/products`;

            const method = editingProduct ? 'PUT' : 'POST';

            const response = await fetch(url, { // Using fetch directly for FormData
                method,
                headers: { ...apiService.getAuthHeaders(), 'Content-Type': null }, // Let browser set Content-Type for FormData
                body: formData
            });

            if (response.ok) {
                alert(editingProduct ? 'Product updated!' : 'Product created!');
                resetProductForm();
                fetchData();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save product');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert(`Error: ${error.message}`);
        }
    };

    const resetProductForm = () => {
        setProductForm({
            title: '', price: '', description: '', category: '',
            sizes: [], colors: [], stock_quantity: '', sku: '', image: null
        });
        setEditingProduct(null);
    };

    const editProduct = (product) => {
        setProductForm({
            title: product.title,
            price: product.price,
            description: product.description,
            category: product.category,
            sizes: product.sizes || [],
            colors: product.colors || [],
            stock_quantity: product.stock_quantity,
            sku: product.sku,
            image: null
        });
        setEditingProduct(product);
        setActiveTab('products');
    };

    const deleteProduct = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await apiService.request(`/admin/products/${id}`, { method: 'DELETE' });
            alert('Product deleted!');
            fetchData();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await apiService.request(`/admin/orders/${orderId}/status`, {
                method: 'PUT',
                body: JSON.stringify({ order_status: newStatus })
            });
            alert('Order status updated!');
            fetchData();
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="px-6 py-4">
                    <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <nav className="w-64 bg-white shadow-sm min-h-screen">
                    <div className="p-4">
                        {[
                            { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
                            { id: 'products', label: 'Products', icon: Package },
                            { id: 'orders', label: 'Orders', icon: ShoppingBag },
                            { id: 'users', label: 'Users', icon: Users }
                        ].map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center px-4 py-3 mb-2 rounded-lg text-left transition-colors ${
                                        activeTab === tab.id 
                                            ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500' 
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <Icon className="w-5 h-5 mr-3" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </nav>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    {/* Dashboard Tab */}
                    {activeTab === 'dashboard' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-6">Dashboard</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                {/* Stats Cards */}
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <div className="flex items-center">
                                        <Package className="w-8 h-8 text-blue-500" />
                                        <div className="ml-4">
                                            <p className="text-sm text-gray-600">Total Products</p>
                                            <p className="text-2xl font-bold">{stats.totalProducts}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <div className="flex items-center">
                                        <ShoppingBag className="w-8 h-8 text-green-500" />
                                        <div className="ml-4">
                                            <p className="text-sm text-gray-600">Total Orders</p>
                                            <p className="text-2xl font-bold">{stats.totalOrders}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <div className="flex items-center">
                                        <Users className="w-8 h-8 text-purple-500" />
                                        <div className="ml-4">
                                            <p className="text-sm text-gray-600">Total Users</p>
                                            <p className="text-2xl font-bold">{stats.totalUsers}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <div className="flex items-center">
                                        <TrendingUp className="w-8 h-8 text-orange-500" />
                                        <div className="ml-4">
                                            <p className="text-sm text-gray-600">Total Revenue</p>
                                            <p className="text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm">
                                <div className="p-6 border-b">
                                    <h3 className="text-lg font-semibold">Recent Orders</h3>
                                </div>
                                <div className="p-6">
                                    {orders.slice(0, 5).map(order => (
                                        <div key={order.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                                            <div>
                                                <p className="font-medium">Order #{order.id}</p>
                                                <p className="text-sm text-gray-600">{order.user_name} - {order.user_email}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">₹{(order.total / 100).toFixed(2)}</p>
                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                    order.order_status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    order.order_status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {order.order_status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Products Tab */}
                    {activeTab === 'products' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Products Management</h2>
                                <button
                                    onClick={resetProductForm}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    Add New Product
                                </button>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Product Form */}
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h3 className="text-lg font-semibold mb-4">
                                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                                    </h3>
                                    <form onSubmit={handleProductSubmit} className="space-y-4">
                                        {/* Form Inputs */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                            <input
                                                type="text"
                                                required
                                                value={productForm.title}
                                                onChange={(e) => setProductForm({...productForm, title: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                                <input
                                                    type="number"
                                                    required
                                                    value={productForm.price}
                                                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                                <input
                                                    type="number"
                                                    required
                                                    value={productForm.stock_quantity}
                                                    onChange={(e) => setProductForm({...productForm, stock_quantity: e.target.value})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                                            <input
                                                type="text"
                                                required
                                                value={productForm.sku}
                                                onChange={(e) => setProductForm({...productForm, sku: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                            <select
                                                value={productForm.category}
                                                onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select Category</option>
                                                <option value="men">Men</option>
                                                <option value="women">Women</option>
                                                <option value="shoes">Shoes</option>
                                                <option value="unisex">Unisex</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                            <textarea
                                                rows="3"
                                                value={productForm.description}
                                                onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Sizes (comma separated)
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="S,M,L,XL"
                                                value={productForm.sizes.join(',')}
                                                onChange={(e) => setProductForm({...productForm, sizes: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Colors (comma separated)
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Red,Blue,Green"
                                                value={productForm.colors.join(',')}
                                                onChange={(e) => setProductForm({...productForm, colors: e.target.value.split(',').map(c => c.trim()).filter(Boolean)})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setProductForm({...productForm, image: e.target.files[0]})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                type="submit"
                                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                                            >
                                                {editingProduct ? 'Update Product' : 'Add Product'}
                                            </button>
                                            {editingProduct && (
                                                <button
                                                    type="button"
                                                    onClick={resetProductForm}
                                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>

                                {/* Products List */}
                                <div className="bg-white rounded-lg shadow-sm">
                                    <div className="p-6 border-b">
                                        <h3 className="text-lg font-semibold">All Products</h3>
                                    </div>
                                    <div className="max-h-[600px] overflow-y-auto">
                                        {loading ? (
                                            <div className="p-6 text-center">Loading products...</div>
                                        ) : (
                                            products.map(product => (
                                                <div key={product.id} className="p-4 border-b last:border-b-0 hover:bg-gray-50">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <img
                                                                src={product.image} // Cloudinary URL
                                                                alt={product.title}
                                                                className="w-12 h-12 object-cover rounded"
                                                            />
                                                            <div className="ml-3">
                                                                <p className="font-medium">{product.title}</p>
                                                                <p className="text-sm text-gray-600">
                                                                    ₹{product.price} • Stock: {product.stock_quantity}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => editProduct(product)}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => deleteProduct(product.id)}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Orders and Users Tabs (similar structure) */}
                    {activeTab === 'orders' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-6">Orders Management</h2>
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        {/* Table Head */}
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                            </tr>
                                        </thead>
                                        {/* Table Body */}
                                        <tbody className="divide-y divide-gray-200">
                                            {orders.map(order => (
                                                <tr key={order.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap font-medium">#{order.id}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <p className="font-medium">{order.user_name}</p>
                                                            <p className="text-sm text-gray-600">{order.user_email}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">₹{(order.total).toFixed(2)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                                            order.payment_status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {order.payment_status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <select
                                                            value={order.order_status}
                                                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                            className="text-sm border border-gray-300 rounded px-2 py-1"
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="confirmed">Confirmed</option>
                                                            <option value="processing">Processing</option>
                                                            <option value="shipped">Shipped</option>
                                                            <option value="delivered">Delivered</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <button className="text-blue-600 hover:text-blue-800">
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-6">Users Management</h2>
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {users.map(user => (
                                                <tr key={user.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap font-medium">#{user.id}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        {new Date(user.created_at).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;