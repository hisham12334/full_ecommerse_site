// src/pages/admin/AdminPanel.jsx

import React, { useState, useEffect } from 'react';
import { Eye, Package, Users, ShoppingBag, TrendingUp, X, Edit2, Trash2 } from 'lucide-react';
import apiService from '../../services/api';

// Enhanced Modal component for viewing order details with better mobile scaling
const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-2 lg:p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] lg:max-h-[90vh] overflow-hidden flex flex-col">
                {/* Fixed Header */}
                <div className="p-4 lg:p-6 border-b bg-white flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-lg lg:text-xl font-bold text-gray-900">Order #{order.id}</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {new Date(order.created_at).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 active:bg-gray-300 min-h-[48px] min-w-[48px] flex items-center justify-center transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>
                
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-6">
                    {/* Order Status Badge */}
                    <div className="mb-6">
                        <span className={`inline-flex px-3 py-2 text-sm font-semibold rounded-full ${
                            order.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.order_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            order.order_status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                            order.order_status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                            Status: {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold mb-3 text-gray-900 flex items-center">
                                <Users size={18} className="mr-2" />
                                Customer Details
                            </h3>
                            <div className="space-y-2">
                                <p className="font-medium text-gray-900">{order.user_name}</p>
                                <p className="text-sm text-gray-600">{order.user_email}</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold mb-3 text-gray-900 flex items-center">
                                <Package size={18} className="mr-2" />
                                Shipping Address
                            </h3>
                            {order.shipping_address ? (
                                <div className="space-y-1">
                                    <p className="font-medium text-gray-900">{order.shipping_address.firstName} {order.shipping_address.lastName}</p>
                                    <p className="text-sm text-gray-600">{order.shipping_address.address}</p>
                                    <p className="text-sm text-gray-600">{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}</p>
                                    <p className="text-sm text-gray-600">📞 {order.shipping_address.phone}</p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">Address not available</p>
                            )}
                        </div>
                    </div>
                    {/* Items Section */}
                    <div>
                        <h3 className="font-semibold mb-4 text-gray-900 flex items-center">
                            <ShoppingBag size={18} className="mr-2" />
                            Items Ordered ({order.items?.length || 0})
                        </h3>
                        <div className="bg-gray-50 rounded-lg overflow-hidden">
                            {order.items && order.items.length > 0 ? order.items.map((item, index) => (
                                <div key={index} className="flex items-center p-4 border-b border-gray-200 last:border-b-0 bg-white mb-2 last:mb-0 rounded-lg mx-2 first:mt-2 last:mb-2">
                                    <img src={item.image || ''} alt={item.title} className="w-16 h-16 lg:w-20 lg:h-20 object-cover rounded-lg mr-4 flex-shrink-0 shadow-sm" />
                                    <div className="flex-grow min-w-0">
                                        <p className="font-semibold text-sm lg:text-base text-gray-900 mb-1">{item.title}</p>
                                        <div className="space-y-1">
                                            <p className="text-xs lg:text-sm text-gray-600">
                                                <span className="font-medium">SKU:</span> {item.sku || 'N/A'}
                                            </p>
                                            <p className="text-xs lg:text-sm text-gray-600">
                                                <span className="font-medium">Size:</span> {item.size}
                                            </p>
                                            {item.selectedColor && (
                                                <p className="text-xs lg:text-sm text-gray-600">
                                                    <span className="font-medium">Color:</span> {item.selectedColor}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-sm font-medium text-gray-700 mb-1">Qty: {item.quantity}</p>
                                        <p className="font-bold text-lg text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            )) : (
                                <p className="p-6 text-center text-gray-500">No items available</p>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Fixed Footer with Total */}
                <div className="border-t bg-white p-4 lg:p-6 flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-700">Order Total:</span>
                        <span className="text-2xl font-bold text-gray-900">₹{order.total ? order.total.toFixed(2) : '0.00'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalUsers: 0, totalRevenue: 0 });
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // New state for the variant-based form with multiple images support
    const initialFormState = {
        title: '', price: '', description: '', category: '', colors: '', 
        images: [], // Support for 3 images
        variants: [
            { size: 'S', sku: '', quantity: 0 },
            { size: 'M', sku: '', quantity: 0 },
            { size: 'L', sku: '', quantity: 0 },
        ]
    };
    const [productForm, setProductForm] = useState(initialFormState);
    const [editingProduct, setEditingProduct] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
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
            alert("Could not fetch admin data. Please refresh.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductForm(prev => ({ ...prev, [name]: value }));
    };

    const handleVariantChange = (index, field, value) => {
        const updatedVariants = [...productForm.variants];
        updatedVariants[index][field] = field === 'quantity' ? parseInt(value) || 0 : value;
        setProductForm(prev => ({ ...prev, variants: updatedVariants }));
    };
    
    const handleFileChange = (e) => {
        // MODIFIED: This now handles multiple files from a single input
        setProductForm(prev => ({ ...prev, images: Array.from(e.target.files) }));
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        
        if (!productForm.title.trim() || !productForm.price || (productForm.images.length === 0 && !editingProduct)) {
            alert('Title, Price, and at least one Image are required.');
            return;
        }

        const formData = new FormData();
        formData.append('title', productForm.title);
        formData.append('price', productForm.price);
        formData.append('description', productForm.description);
        formData.append('category', productForm.category);
        formData.append('colors', JSON.stringify(productForm.colors.split(',').map(c => c.trim()).filter(Boolean)));
        formData.append('variants', JSON.stringify(productForm.variants));
        
        // MODIFIED: This loop appends all files with the correct field name: "images"
        for (let i = 0; i < productForm.images.length; i++) {
            formData.append('images', productForm.images[i]);
        }

        try {
            const url = editingProduct ? `/admin/products/${editingProduct.id}` : '/admin/products';
            const method = editingProduct ? 'PUT' : 'POST';
            await apiService.request(url, { method, body: formData });
            
            alert(`Product ${editingProduct ? 'updated' : 'created'} successfully!`);
            resetProductForm();
            fetchData();
        } catch (error) {
            console.error('Error saving product:', error);
            alert(`Error: ${error.message}`);
        }
    };

    const resetProductForm = () => {
        setProductForm(initialFormState);
        setEditingProduct(null);
        // Clear all image inputs
        for (let i = 0; i < 3; i++) {
            const fileInput = document.getElementById(`productImageInput_${i}`);
            if (fileInput) fileInput.value = "";
        }
    };

    const editProduct = (product) => {
        setEditingProduct(product);
        setProductForm({
            title: product.title,
            price: product.price,
            description: product.description,
            category: product.category,
            colors: Array.isArray(product.colors) ? product.colors.join(', ') : '',
            images: [null, null, null], // Reset images for editing
            variants: [
                { size: 'S', sku: product.variants.find(v=>v.size === 'S')?.sku || '', quantity: product.variants.find(v=>v.size === 'S')?.quantity || 0 },
                { size: 'M', sku: product.variants.find(v=>v.size === 'M')?.sku || '', quantity: product.variants.find(v=>v.size === 'M')?.quantity || 0 },
                { size: 'L', sku: product.variants.find(v=>v.size === 'L')?.sku || '', quantity: product.variants.find(v=>v.size === 'L')?.quantity || 0 },
            ]
        });
    };

    const deleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await apiService.request(`/admin/products/${id}`, { method: 'DELETE' });
            alert('Product deleted!');
            fetchData();
        } catch (error) { 
            console.error('Error deleting product:', error);
            alert('Error deleting product. Please try again.');
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
            alert('Error updating order status. Please try again.');
        }
    };

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
          <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
          
          {/* Mobile Navigation */}
          <nav className="lg:w-64 bg-white shadow-md lg:flex-shrink-0">
              <div className="p-4">
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">Admin Panel</h1>
                  
                  {/* Mobile: Horizontal scroll navigation */}
                  <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                      {[
                          { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
                          { id: 'products', label: 'Products', icon: Package },
                          { id: 'orders', label: 'Orders', icon: ShoppingBag },
                          { id: 'users', label: 'Users', icon: Users }
                      ].map(tab => (
                          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                              className={`flex items-center px-4 py-3 rounded-lg text-left transition-colors whitespace-nowrap min-w-max lg:w-full ${activeTab === tab.id ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-100 active:bg-gray-200'}`}>
                              <tab.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                              <span className="text-sm lg:text-base">{tab.label}</span>
                          </button>
                      ))}
                  </div>
              </div>
          </nav>

          <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && (
                  <div>
                      <h2 className="text-xl font-semibold mb-6">Dashboard</h2>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-8">
                          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
                              <div className="flex items-center">
                                  <Package className="w-6 h-6 lg:w-8 lg:h-8 text-blue-500 flex-shrink-0" />
                                  <div className="ml-3 lg:ml-4 min-w-0">
                                      <p className="text-xs lg:text-sm text-gray-600 truncate">Total Products</p>
                                      <p className="text-lg lg:text-2xl font-bold">{stats.totalProducts}</p>
                                  </div>
                              </div>
                          </div>
                          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
                              <div className="flex items-center">
                                  <ShoppingBag className="w-6 h-6 lg:w-8 lg:h-8 text-green-500 flex-shrink-0" />
                                  <div className="ml-3 lg:ml-4 min-w-0">
                                      <p className="text-xs lg:text-sm text-gray-600 truncate">Total Orders</p>
                                      <p className="text-lg lg:text-2xl font-bold">{stats.totalOrders}</p>
                                  </div>
                              </div>
                          </div>
                          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
                              <div className="flex items-center">
                                  <Users className="w-6 h-6 lg:w-8 lg:h-8 text-purple-500 flex-shrink-0" />
                                  <div className="ml-3 lg:ml-4 min-w-0">
                                      <p className="text-xs lg:text-sm text-gray-600 truncate">Total Users</p>
                                      <p className="text-lg lg:text-2xl font-bold">{stats.totalUsers}</p>
                                  </div>
                              </div>
                          </div>
                          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
                              <div className="flex items-center">
                                  <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-orange-500 flex-shrink-0" />
                                  <div className="ml-3 lg:ml-4 min-w-0">
                                      <p className="text-xs lg:text-sm text-gray-600 truncate">Total Revenue</p>
                                      <p className="text-lg lg:text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div className="bg-white rounded-lg shadow-sm"><div className="p-6 border-b"><h3 className="text-lg font-semibold">Recent Orders</h3></div><div className="p-6">{loading ? <p>Loading...</p> : orders.slice(0, 5).map(order => (<div key={order.id} className="flex justify-between items-center py-3 border-b last:border-b-0"><div><p className="font-medium">Order #{order.id}</p><p className="text-sm text-gray-600">{order.user_name}</p></div><div className="text-right"><p className="font-medium">₹{order.total.toFixed(2)}</p><span className={`text-xs px-2 py-1 rounded-full ${order.order_status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{order.order_status}</span></div></div>))}</div></div>
                  </div>
              )}
              {/* Products Tab */}
              {activeTab === 'products' && (
                  <div>
                      <h2 className="text-xl font-semibold mb-6">Products Management</h2>
                      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
                          <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 xl:col-span-1">
                              <h3 className="text-base lg:text-lg font-semibold mb-4">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
                              <form onSubmit={handleProductSubmit} className="space-y-4">
                                  <input name="title" value={productForm.title} onChange={handleInputChange} placeholder="Product Title*" required className="w-full px-3 py-2 border rounded-md"/>
                                  <input name="price" value={productForm.price} onChange={handleInputChange} placeholder="Price (₹)*" type="number" step="0.01" min="0" required className="w-full px-3 py-2 border rounded-md"/>
                                  <textarea name="description" value={productForm.description} onChange={handleInputChange} placeholder="Description" rows="3" className="w-full px-3 py-2 border rounded-md"/>
                                  <select name="category" value={productForm.category} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md">
                                      <option value="">Select Category</option><option value="men">Men</option><option value="women">Women</option><option value="shoes">Shoes</option><option value="unisex">Unisex</option>
                                  </select>
                                  <input name="colors" value={productForm.colors} onChange={handleInputChange} placeholder="Colors (e.g., Red, Blue, Green)" className="w-full px-3 py-2 border rounded-md"/>
                                  
                                  <div>
                                      <h4 className="font-medium mb-2">Variants (Size, SKU, Quantity)*</h4>
                                      <p className="text-sm text-gray-500 mb-2">At least one variant must have SKU and quantity</p>
                                      {productForm.variants.map((variant, index) => (
                                          <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                                              <input value={variant.size} readOnly className="px-3 py-2 border rounded-md bg-gray-100"/>
                                              <input value={variant.sku} onChange={e => handleVariantChange(index, 'sku', e.target.value)} placeholder={`SKU for ${variant.size}`} className="px-3 py-2 border rounded-md"/>
                                              <input value={variant.quantity} onChange={e => handleVariantChange(index, 'quantity', e.target.value)} type="number" min="0" placeholder="Qty" className="px-3 py-2 border rounded-md"/>
                                          </div>
                                      ))}
                                  </div>

                                  <div>
                                      <label className="block text-sm font-medium mb-3">Product Images* (Upload up to 3 images)</label>
                                      <div>
                                      <label htmlFor="productImageInput" className="block text-sm font-medium mb-3">Product Images* (Upload up to 3)</label>
                                      <input 
                                          id="productImageInput"
                                          name="images" // This name must match what the backend expects
                                          type="file" 
                                          accept="image/*" 
                                          multiple // This attribute allows multiple files to be selected
                                          onChange={handleFileChange} 
                                          className="w-full text-sm border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                      />
                                      {productForm.images.length > 0 && (
                                          <p className="text-xs text-green-600 font-medium mt-2">
                                              {productForm.images.length} image(s) selected.
                                          </p>
                                      )}
                                      <p className="text-xs text-gray-500 mt-2">First image is required. Additional images are optional.</p>
                                  </div>
                                      <p className="text-xs text-gray-500 mt-2">First image is required. Additional images are optional.</p>
                                  </div>
                                  <div className="flex flex-col sm:flex-row gap-2">
                                      <button type="submit" className="flex-1 bg-blue-600 text-white py-3 sm:py-2 rounded-md hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-400 font-medium min-h-[44px]" disabled={loading}>
                                          {loading ? 'Processing...' : editingProduct ? 'Update' : 'Create'}
                                      </button>
                                      <button type="button" onClick={resetProductForm} className="px-4 py-3 sm:py-2 border rounded-md hover:bg-gray-50 active:bg-gray-100 font-medium min-h-[44px]">
                                          {editingProduct ? 'Cancel' : 'Clear'}
                                      </button>
                                  </div>
                              </form>
                          </div>
                          <div className="bg-white rounded-lg shadow-sm xl:col-span-2">
                              <div className="p-4 lg:p-6 border-b"><h3 className="text-base lg:text-lg font-semibold">All Products ({products.length})</h3></div>
                              <div className="max-h-[70vh] overflow-y-auto">{loading ? <div className="p-6 text-center">Loading...</div> : products.map(p => (
                                  <div key={p.id} className="p-4 border-b flex items-center justify-between hover:bg-gray-50 active:bg-gray-100">
                                      <div className="flex items-center min-w-0 flex-1">
                                          <img src={(p.images && p.images[0]) || p.image || ''} alt={p.title} className="w-12 h-12 lg:w-16 lg:h-16 object-cover rounded flex-shrink-0"/>
                                          <div className="ml-3 lg:ml-4 min-w-0 flex-1">
                                              <p className="font-semibold text-sm lg:text-base truncate">{p.title}</p>
                                              <p className="text-xs lg:text-sm text-gray-500">₹{p.price}</p>
                                          </div>
                                      </div>
                                      <div className="flex gap-1 lg:gap-2 flex-shrink-0 ml-2">
                                          <button onClick={() => editProduct(p)} className="p-2 lg:p-2 text-blue-600 hover:bg-blue-50 active:bg-blue-100 rounded min-h-[44px] min-w-[44px] flex items-center justify-center" title="Edit">
                                              <Edit2 size={16} />
                                          </button>
                                          <button onClick={() => deleteProduct(p.id)} className="p-2 lg:p-2 text-red-600 hover:bg-red-50 active:bg-red-100 rounded min-h-[44px] min-w-[44px] flex items-center justify-center" title="Delete">
                                              <Trash2 size={16} />
                                          </button>
                                      </div>
                                  </div>
                              ))}</div>
                          </div>
                      </div>
                  </div>
              )}
              {/* Orders Tab - Enhanced Mobile Scaling */}
              {activeTab === 'orders' && (
                  <div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                          <h2 className="text-xl font-semibold text-gray-900 mb-2 sm:mb-0">Orders Management</h2>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                                  {orders.length} Total Orders
                              </span>
                              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                                  ₹{orders.reduce((sum, order) => sum + (order.total || 0), 0).toFixed(2)} Revenue
                              </span>
                          </div>
                      </div>
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                          {loading ? (
                              <div className="p-8 text-center">Loading orders...</div>
                          ) : orders.length === 0 ? (
                              <div className="p-8 text-center text-gray-500">No orders found</div>
                          ) : (
                              <>
                                  {/* Desktop Table View */}
                                  <div className="hidden lg:block">
                                      <table className="w-full">
                                          <thead className="bg-gray-50">
                                              <tr>
                                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                              </tr>
                                          </thead>
                                          <tbody className="bg-white divide-y divide-gray-200">
                                              {orders.map(order => (
                                                  <tr key={order.id} className="hover:bg-gray-50">
                                                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">#{order.id}</td>
                                                      <td className="px-6 py-4 whitespace-nowrap">
                                                          <div>
                                                              <p className="font-medium text-gray-900">{order.user_name}</p>
                                                              <p className="text-sm text-gray-500">{order.user_email}</p>
                                                          </div>
                                                      </td>
                                                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">₹{order.total.toFixed(2)}</td>
                                                      <td className="px-6 py-4 whitespace-nowrap">
                                                          <select 
                                                              value={order.order_status} 
                                                              onChange={(e) => updateOrderStatus(order.id, e.target.value)} 
                                                              className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                          >
                                                              <option value="pending">Pending</option>
                                                              <option value="confirmed">Confirmed</option>
                                                              <option value="shipped">Shipped</option>
                                                              <option value="delivered">Delivered</option>
                                                              <option value="cancelled">Cancelled</option>
                                                          </select>
                                                      </td>
                                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                          {new Date(order.created_at).toLocaleDateString('en-IN', {
                                                              year: 'numeric',
                                                              month: 'short',
                                                              day: 'numeric'
                                                          })}
                                                      </td>
                                                      <td className="px-6 py-4 whitespace-nowrap">
                                                          <button 
                                                              onClick={() => setSelectedOrder(order)} 
                                                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                                          >
                                                              <Eye size={14} className="mr-1" />
                                                              View Details
                                                          </button>
                                                      </td>
                                                  </tr>
                                              ))}
                                          </tbody>
                                      </table>
                                  </div>

                                  {/* Mobile Card View - Enhanced Scaling */}
                                  <div className="lg:hidden">
                                      <div className="p-3 bg-gray-50 border-b">
                                          <p className="text-sm font-medium text-gray-700">{orders.length} Orders Total</p>
                                      </div>
                                      <div className="divide-y divide-gray-200 max-h-[70vh] overflow-y-auto">
                                          {orders.map(order => (
                                              <div key={order.id} className="p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors">
                                                  {/* Order Header - Improved spacing and hierarchy */}
                                                  <div className="flex justify-between items-start mb-4">
                                                      <div className="flex-1 min-w-0">
                                                          <div className="flex items-center gap-2 mb-1">
                                                              <p className="font-bold text-base text-gray-900">#{order.id}</p>
                                                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                                  order.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                                  order.order_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                                  order.order_status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                                                                  order.order_status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                                  'bg-gray-100 text-gray-800'
                                                              }`}>
                                                                  {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                                                              </span>
                                                          </div>
                                                          <p className="text-sm font-medium text-gray-700 truncate">{order.user_name}</p>
                                                          <p className="text-xs text-gray-500 truncate">{order.user_email}</p>
                                                      </div>
                                                      <div className="text-right ml-4 flex-shrink-0">
                                                          <p className="font-bold text-lg text-gray-900">₹{order.total.toFixed(2)}</p>
                                                          <p className="text-xs text-gray-500">
                                                              {new Date(order.created_at).toLocaleDateString('en-IN', {
                                                                  year: 'numeric',
                                                                  month: 'short',
                                                                  day: 'numeric'
                                                              })}
                                                          </p>
                                                      </div>
                                                  </div>
                                                  
                                                  {/* Action Section - Better mobile layout */}
                                                  <div className="space-y-3">
                                                      <div>
                                                          <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Update Status</label>
                                                          <select 
                                                              value={order.order_status} 
                                                              onChange={(e) => updateOrderStatus(order.id, e.target.value)} 
                                                              className="w-full text-sm border-2 border-gray-200 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[48px] font-medium"
                                                          >
                                                              <option value="pending">📋 Pending</option>
                                                              <option value="confirmed">✅ Confirmed</option>
                                                              <option value="shipped">🚚 Shipped</option>
                                                              <option value="delivered">📦 Delivered</option>
                                                              <option value="cancelled">❌ Cancelled</option>
                                                          </select>
                                                      </div>
                                                      
                                                      <button 
                                                          onClick={() => setSelectedOrder(order)} 
                                                          className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors min-h-[48px] shadow-sm"
                                                      >
                                                          <Eye size={18} className="mr-2" />
                                                          View Order Details
                                                      </button>
                                                  </div>
                                              </div>
                                          ))}
                                      </div>
                                  </div>
                              </>
                          )}
                      </div>
                  </div>
              )}
              {/* Users Tab */}
              {activeTab === 'users' && (
                   <div>
                      <h2 className="text-xl font-semibold mb-6">Users Management</h2>
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                                          <td className="px-6 py-4 font-medium">#{user.id}</td>
                                          <td className="px-6 py-4">{user.name}</td>
                                          <td className="px-6 py-4">{user.email}</td>
                                          <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>{user.role}</span></td>
                                          <td className="px-6 py-4 text-sm text-gray-600">{new Date(user.created_at).toLocaleDateString()}</td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
              )}
          </main>
      </div>
    );
};

export default AdminPanel;