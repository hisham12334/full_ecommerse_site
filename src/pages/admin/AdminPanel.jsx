import React, { useState, useEffect } from 'react';
import { Eye, Package, Users, ShoppingBag, TrendingUp, X, Edit2, Trash2 } from 'lucide-react';
import apiService from '../../services/api';

// A new, reusable Modal component for viewing order details
const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center border-b pb-3 mb-4">
                        <h2 className="text-xl font-bold">Order Details #{order.id}</h2>
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200"><X size={24} /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold mb-2 border-b">Customer Details</h3>
                            <p>{order.user_name}</p>
                            <p className="text-sm text-gray-600">{order.user_email}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2 border-b">Shipping Address</h3>
                            {order.shipping_address ? (
                                <>
                                    <p>{order.shipping_address.firstName} {order.shipping_address.lastName}</p>
                                    <p className="text-sm text-gray-600">{order.shipping_address.address}</p>
                                    <p className="text-sm text-gray-600">{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}</p>
                                    <p className="text-sm text-gray-600">Phone: {order.shipping_address.phone}</p>
                                </>
                            ) : (
                                <p className="text-sm text-gray-500">Address not available</p>
                            )}
                        </div>
                    </div>
                    <div className="mt-6">
                        <h3 className="font-semibold mb-2 border-b">Items Ordered</h3>
                        <div className="border rounded-lg">
                            {order.items && order.items.length > 0 ? order.items.map((item, index) => (
                                <div key={index} className="flex items-center p-3 border-b last:border-b-0">
                                    <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded mr-4" />
                                    <div className="flex-grow">
                                        <p className="font-semibold">{item.title}</p>
                                        <p className="text-sm text-gray-600">SKU: {item.sku || 'N/A'}</p>
                                        <p className="text-sm text-gray-600">Size: {item.size}</p>
                                    </div>
                                    <div className="text-right">
                                        <p>Qty: {item.quantity}</p>
                                        <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            )) : (
                                <p className="p-4 text-sm text-gray-500">No items available</p>
                            )}
                        </div>
                    </div>
                     <div className="text-right mt-4 font-bold text-lg">
                        Total: ₹{order.total ? order.total.toFixed(2) : '0.00'}
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

    // New state for the variant-based form
    const initialFormState = {
        title: '', price: '', description: '', category: '', colors: '', image: null,
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
        setProductForm(prev => ({...prev, image: e.target.files[0] }));
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!productForm.title.trim() || !productForm.price || !productForm.image) {
            alert('Please fill in all required fields (Title, Price, Image)');
            return;
        }

        // Validate variants
        const hasValidVariants = productForm.variants.some(variant => 
            variant.sku.trim() && variant.quantity > 0
        );
        if (!hasValidVariants) {
            alert('Please provide at least one variant with SKU and quantity');
            return;
        }

        const formData = new FormData();
        // Append basic fields
        formData.append('title', productForm.title.trim());
        formData.append('price', productForm.price);
        formData.append('description', productForm.description.trim());
        formData.append('category', productForm.category);
        
        // Fix: Process colors correctly
        const colorsArray = productForm.colors 
            ? productForm.colors.split(',').map(c => c.trim()).filter(Boolean)
            : [];
        formData.append('colors', JSON.stringify(colorsArray));
        
        // Fix: Filter out empty variants and ensure proper data types
        const validVariants = productForm.variants.filter(variant => 
            variant.sku.trim() && variant.quantity > 0
        ).map(variant => ({
            size: variant.size,
            sku: variant.sku.trim(),
            quantity: parseInt(variant.quantity) || 0
        }));
        
        formData.append('variants', JSON.stringify(validVariants));
        
        if (productForm.image) {
            formData.append('image', productForm.image);
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
            alert(`Error: Failed to create product. ${error.message || 'Please try again.'}`);
        }
    };

    const resetProductForm = () => {
        setProductForm(initialFormState);
        setEditingProduct(null);
        const fileInput = document.getElementById('productImageInput');
        if (fileInput) fileInput.value = "";
    };

    const editProduct = (product) => {
        alert("Editing is disabled in this version. Please delete and recreate the product to update its details.");
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
      <div className="min-h-screen bg-gray-50 flex">
          <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
          <nav className="w-64 bg-white shadow-md flex-shrink-0">
              <div className="p-4">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Panel</h1>
                  {[
                      { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
                      { id: 'products', label: 'Products', icon: Package },
                      { id: 'orders', label: 'Orders', icon: ShoppingBag },
                      { id: 'users', label: 'Users', icon: Users }
                  ].map(tab => (
                      <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center px-4 py-3 mb-2 rounded-lg text-left transition-colors ${activeTab === tab.id ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}>
                          <tab.icon className="w-5 h-5 mr-3" />
                          {tab.label}
                      </button>
                  ))}
              </div>
          </nav>

          <main className="flex-1 p-6 overflow-y-auto">
              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && (
                  <div>
                      <h2 className="text-xl font-semibold mb-6">Dashboard</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                          <div className="bg-white p-6 rounded-lg shadow-sm"><div className="flex items-center"><Package className="w-8 h-8 text-blue-500" /><div className="ml-4"><p className="text-sm text-gray-600">Total Products</p><p className="text-2xl font-bold">{stats.totalProducts}</p></div></div></div>
                          <div className="bg-white p-6 rounded-lg shadow-sm"><div className="flex items-center"><ShoppingBag className="w-8 h-8 text-green-500" /><div className="ml-4"><p className="text-sm text-gray-600">Total Orders</p><p className="text-2xl font-bold">{stats.totalOrders}</p></div></div></div>
                          <div className="bg-white p-6 rounded-lg shadow-sm"><div className="flex items-center"><Users className="w-8 h-8 text-purple-500" /><div className="ml-4"><p className="text-sm text-gray-600">Total Users</p><p className="text-2xl font-bold">{stats.totalUsers}</p></div></div></div>
                          <div className="bg-white p-6 rounded-lg shadow-sm"><div className="flex items-center"><TrendingUp className="w-8 h-8 text-orange-500" /><div className="ml-4"><p className="text-sm text-gray-600">Total Revenue</p><p className="text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</p></div></div></div>
                      </div>
                      <div className="bg-white rounded-lg shadow-sm"><div className="p-6 border-b"><h3 className="text-lg font-semibold">Recent Orders</h3></div><div className="p-6">{loading ? <p>Loading...</p> : orders.slice(0, 5).map(order => (<div key={order.id} className="flex justify-between items-center py-3 border-b last:border-b-0"><div><p className="font-medium">Order #{order.id}</p><p className="text-sm text-gray-600">{order.user_name}</p></div><div className="text-right"><p className="font-medium">₹{order.total.toFixed(2)}</p><span className={`text-xs px-2 py-1 rounded-full ${order.order_status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{order.order_status}</span></div></div>))}</div></div>
                  </div>
              )}
              {/* Products Tab */}
              {activeTab === 'products' && (
                  <div>
                      <h2 className="text-xl font-semibold mb-6">Products Management</h2>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-1">
                              <h3 className="text-lg font-semibold mb-4">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
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
                                          <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                                              <input value={variant.size} readOnly className="px-3 py-2 border rounded-md bg-gray-100"/>
                                              <input value={variant.sku} onChange={e => handleVariantChange(index, 'sku', e.target.value)} placeholder={`SKU for ${variant.size}`} className="px-3 py-2 border rounded-md"/>
                                              <input value={variant.quantity} onChange={e => handleVariantChange(index, 'quantity', e.target.value)} type="number" min="0" placeholder="Qty" className="px-3 py-2 border rounded-md"/>
                                          </div>
                                      ))}
                                  </div>

                                  <div>
                                      <label className="block text-sm font-medium">Product Image*</label>
                                      <input id="productImageInput" type="file" accept="image/*" onChange={handleFileChange} className="w-full" required={!editingProduct} />
                                  </div>
                                  <div className="flex gap-2">
                                      <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400" disabled={loading}>
                                          {loading ? 'Processing...' : editingProduct ? 'Update' : 'Create'}
                                      </button>
                                      <button type="button" onClick={resetProductForm} className="px-4 py-2 border rounded-md hover:bg-gray-50">
                                          {editingProduct ? 'Cancel' : 'Clear'}
                                      </button>
                                  </div>
                              </form>
                          </div>
                          <div className="bg-white rounded-lg shadow-sm lg:col-span-2">
                              <div className="p-6 border-b"><h3 className="text-lg font-semibold">All Products ({products.length})</h3></div>
                              <div className="max-h-[70vh] overflow-y-auto">{loading ? <div className="p-6 text-center">Loading...</div> : products.map(p => (<div key={p.id} className="p-4 border-b flex items-center justify-between hover:bg-gray-50">
                                  <div className="flex items-center"><img src={p.image} alt={p.title} className="w-16 h-16 object-cover rounded"/><div className="ml-4"><p className="font-semibold">{p.title}</p><p className="text-sm text-gray-500">₹{p.price}</p></div></div>
                                  <div className="flex gap-2"><button onClick={() => editProduct(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="Edit"><Edit2 size={16} /></button><button onClick={() => deleteProduct(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Delete"><Trash2 size={16} /></button></div>
                              </div>))}</div>
                          </div>
                      </div>
                  </div>
              )}
              {/* Orders Tab - Updated with Professional Table Layout */}
              {activeTab === 'orders' && (
                  <div>
                      <h2 className="text-xl font-semibold mb-6">Orders Management</h2>
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                          {loading ? (
                              <div className="p-8 text-center">Loading orders...</div>
                          ) : orders.length === 0 ? (
                              <div className="p-8 text-center text-gray-500">No orders found</div>
                          ) : (
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