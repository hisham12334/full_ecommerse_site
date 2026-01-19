import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../hooks/useOrders';
import { formatDate, formatDateTime } from '../services/utils/formatting';
import { Navigate, Link } from 'react-router-dom';
import { LogOut, Home, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

// A simple loading spinner component
const Spinner = () => (
  <div className="flex justify-center items-center p-8">
    <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
  </div>
);

export default function UserDashboard() {
  const { user, isInitializing, logout } = useAuth();
  const { orders, loading: ordersLoading, error: ordersError } = useOrders();
  const [activeTab, setActiveTab] = useState('orders');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Show loading while checking authentication
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // Redirect to home if not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (

    <div className="min-h-screen bg-warm-white">
      {/* Header Section */}
      <div className="bg-charcoal text-white py-12 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-medium mb-2">My Account</h1>
          <p className="font-sans text-warm-grey">Manage your orders and account details</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-warm-grey/10">
              <div className="mb-6 pb-6 border-b border-warm-grey/10">
                <h2 className="font-serif text-xl text-charcoal mb-1">{user?.name}</h2>
                <p className="font-sans text-sm text-warm-grey">{user?.email}</p>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-3 text-sm font-medium rounded-md transition-all duration-300 font-sans ${activeTab === 'orders'
                    ? 'bg-charcoal text-white shadow-md'
                    : 'text-warm-grey hover:bg-warm-grey/10 hover:text-charcoal'
                    }`}
                >
                  Order History
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 text-sm font-medium rounded-md transition-all duration-300 font-sans ${activeTab === 'profile'
                    ? 'bg-charcoal text-white shadow-md'
                    : 'text-warm-grey hover:bg-warm-grey/10 hover:text-charcoal'
                    }`}
                >
                  Profile Settings
                </button>
                <Link
                  to="/"
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md text-warm-grey hover:bg-warm-grey/10 hover:text-charcoal transition-all duration-300 font-sans"
                >
                  <Home className="w-4 h-4" />
                  Back to Home
                </Link>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md text-red-500 hover:bg-red-50 hover:text-red-700 transition-all duration-300 font-sans mt-4 border-t border-warm-grey/10"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="md:col-span-3">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-warm-grey/10 min-h-[500px]">
              {activeTab === 'orders' && (
                <div>
                  <h2 className="font-serif text-2xl text-charcoal mb-6">Order History</h2>
                  {ordersLoading ? (
                    <Spinner />
                  ) : ordersError ? (
                    <div className="text-red-600 p-4 bg-red-50 rounded-md border border-red-100 font-sans">
                      <p>Error loading orders: {ordersError}</p>
                    </div>
                  ) : orders && orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map(order => {
                        const isCancelled = order.order_status === 'cancelled';
                        const isExpanded = expandedOrderId === order.id;
                        return (
                          <div
                            key={order.id}
                            className={`border rounded-lg transition-all duration-300 ${isExpanded ? 'border-charcoal shadow-md' : 'border-warm-grey/20 hover:border-warm-grey/40'
                              } ${isCancelled ? 'opacity-75 bg-gray-50' : 'bg-white'}`}
                          >
                            {/* Order Header */}
                            <div
                              className="flex flex-col sm:flex-row justify-between sm:items-center p-5 cursor-pointer"
                              onClick={() => toggleOrderDetails(order.id)}
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                  <p className="font-serif text-lg font-medium text-charcoal">
                                    Order #{order.id}
                                  </p>
                                  <span
                                    className={`text-xs px-3 py-1 rounded-full font-medium font-sans uppercase tracking-wider ${isCancelled
                                      ? 'bg-red-100 text-red-600'
                                      : order.order_status === 'paid' || order.order_status === 'delivered'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-orange-100 text-orange-700'
                                      }`}
                                  >
                                    {order.order_status || 'pending'}
                                  </span>
                                </div>
                                <p className="text-sm font-sans text-warm-grey">Placed on {formatDate(order.created_at)}</p>
                              </div>

                              <div className="flex items-center justify-between sm:justify-end gap-6 mt-4 sm:mt-0">
                                <p className="font-serif text-xl text-charcoal">
                                  ₹{order.total?.toLocaleString() || '0'}
                                </p>
                                {isExpanded ? (
                                  <ChevronUp className="w-5 h-5 text-charcoal" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-warm-grey" />
                                )}
                              </div>
                            </div>

                            {/* Expanded Order Details */}
                            {isExpanded && (
                              <div className="px-5 pb-6 pt-2 border-t border-warm-grey/10">

                                {/* Cancellation Alert */}
                                {isCancelled && order.cancellation_reason && (
                                  <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-md flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                      <p className="font-medium text-red-700 font-sans text-sm">Order Cancelled</p>
                                      <p className="text-sm text-red-600/80 font-sans mt-1">{order.cancellation_reason}</p>
                                      {order.cancelled_at && (
                                        <p className="text-xs text-red-600/60 mt-1">
                                          On {formatDateTime(order.cancelled_at)}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                )}

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
                                  {/* Items Column */}
                                  <div className="lg:col-span-2 space-y-4">
                                    <h4 className="font-mono text-xs text-warm-grey uppercase tracking-widest border-b border-warm-grey/10 pb-2">Items</h4>
                                    {order.items && order.items.map((item, idx) => (
                                      <div key={idx} className="flex justify-between items-start py-2">
                                        <div className="flex-1">
                                          <p className="font-sans text-charcoal font-medium">{item.title}</p>
                                          <p className="text-sm text-warm-grey font-sans mt-0.5">
                                            {item.size && <span className="mr-3">Size: {item.size}</span>}
                                            {item.selectedColor && <span className="mr-3">Color: {item.selectedColor}</span>}
                                            <span>Qty: {item.quantity}</span>
                                          </p>
                                        </div>
                                        <p className="font-sans text-charcoal">₹{(item.price * item.quantity).toLocaleString()}</p>
                                      </div>
                                    ))}

                                    <div className="flex justify-between items-center pt-4 mt-4 border-t border-warm-grey/10">
                                      <p className="font-serif text-lg text-charcoal">Total Amount</p>
                                      <p className="font-serif text-xl font-semibold text-charcoal">₹{order.total?.toLocaleString()}</p>
                                    </div>
                                  </div>

                                  {/* Info Column */}
                                  <div className="space-y-6">
                                    {/* Shipping */}
                                    {order.shipping_address && (
                                      <div>
                                        <h4 className="font-mono text-xs text-warm-grey uppercase tracking-widest border-b border-warm-grey/10 pb-2 mb-3">Shipping Details</h4>
                                        <div className="text-sm font-sans text-charcoal space-y-1">
                                          <p className="font-medium">{order.shipping_address.name}</p>
                                          <p>{order.shipping_address.address}</p>
                                          <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.pincode}</p>
                                          <p className="text-warm-grey mt-2">{order.shipping_address.phone}</p>
                                        </div>
                                      </div>
                                    )}

                                    {/* Payment */}
                                    <div>
                                      <h4 className="font-mono text-xs text-warm-grey uppercase tracking-widest border-b border-warm-grey/10 pb-2 mb-3">Payment Info</h4>
                                      <div className="text-sm font-sans space-y-2">
                                        <div className="flex justify-between">
                                          <span className="text-warm-grey">Status</span>
                                          <span className={`font-medium ${order.payment_status === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                                            {order.payment_status || 'pending'}
                                          </span>
                                        </div>
                                        {order.payment_id && (
                                          <div className="flex justify-between flex-wrap gap-2">
                                            <span className="text-warm-grey">ID</span>
                                            <span className="text-charcoal font-mono text-xs break-all">{order.payment_id}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-warm-white/50 rounded-lg border border-warm-grey/10">
                      <p className="font-sans text-warm-grey mb-4">You haven't placed any orders yet.</p>
                      <Link to="/" className="inline-block bg-charcoal text-white px-6 py-2 rounded shadow-sm hover:bg-black transition-colors font-sans text-sm">
                        Start Shopping
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'profile' && (
                <div>
                  <h2 className="font-serif text-2xl text-charcoal mb-8">Profile Settings</h2>

                  <div className="space-y-8">
                    {/* Personal Information */}
                    <div className="bg-warm-white/50 p-6 rounded-lg border border-warm-grey/10">
                      <h3 className="font-serif text-lg text-charcoal mb-4">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-mono font-medium text-warm-grey uppercase tracking-wider mb-2">Full Name</label>
                          <input
                            type="text"
                            value={user?.name || ''}
                            readOnly
                            className="w-full px-4 py-3 bg-white border border-warm-grey/20 rounded-md text-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono font-medium text-warm-grey uppercase tracking-wider mb-2">Email Address</label>
                          <input
                            type="email"
                            value={user?.email || ''}
                            readOnly
                            className="w-full px-4 py-3 bg-white border border-warm-grey/20 rounded-md text-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal font-sans"
                          />
                        </div>
                      </div>
                      <div className="mt-6">
                        <label className="block text-xs font-mono font-medium text-warm-grey uppercase tracking-wider mb-2">Account Type</label>
                        <span className="inline-block px-3 py-1 bg-charcoal text-white rounded-full text-xs font-medium font-sans border border-charcoal/10">
                          {user?.role || 'User'}
                        </span>
                      </div>
                    </div>

                    {/* Account Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-warm-white/50 p-6 rounded-lg border border-warm-grey/10 text-center">
                        <div className="text-3xl font-serif font-medium text-charcoal mb-1">{orders?.length || 0}</div>
                        <div className="text-xs font-mono text-warm-grey uppercase tracking-wider">Total Orders</div>
                      </div>
                      <div className="bg-warm-white/50 p-6 rounded-lg border border-warm-grey/10 text-center">
                        <div className="text-3xl font-serif font-medium text-charcoal mb-1">
                          ₹{orders?.reduce((total, order) => total + (order.total || 0), 0).toLocaleString() || '0'}
                        </div>
                        <div className="text-xs font-mono text-warm-grey uppercase tracking-wider">Total Spent</div>
                      </div>
                      <div className="bg-warm-white/50 p-6 rounded-lg border border-warm-grey/10 text-center">
                        <div className="text-3xl font-serif font-medium text-charcoal mb-1">
                          {new Date(user?.created_at || Date.now()).getFullYear()}
                        </div>
                        <div className="text-xs font-mono text-warm-grey uppercase tracking-wider">Member Since</div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div>
                      <h3 className="font-serif text-lg text-charcoal mb-4">Quick Actions</h3>
                      <div className="flex gap-4">
                        <button
                          onClick={() => setActiveTab('orders')}
                          className="bg-charcoal text-white px-6 py-3 rounded-md hover:bg-black transition-all font-sans text-sm font-medium shadow-sm hover:shadow-md"
                        >
                          View Order History
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );

}