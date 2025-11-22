import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../hooks/useOrders';
import { formatDate } from '../services/utils/formatting';
import { Navigate, Link } from 'react-router-dom';
import { LogOut, Home } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-white mb-8 uppercase tracking-wider">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="md:col-span-1">
            <div className="bg-gray-900 p-4 border border-red-500/30 rounded-lg">
              <h2 className="text-lg font-semibold mb-2 text-white">{user?.name}</h2>
              <p className="text-sm text-gray-400 mb-4">{user?.email}</p>
              <nav className="space-y-1">
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'orders' ? 'bg-red-500 text-white' : 'text-gray-300 hover:bg-red-500/20 hover:text-white'}`}
                >
                  Order History
                </button>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'profile' ? 'bg-red-500 text-white' : 'text-gray-300 hover:bg-red-500/20 hover:text-white'}`}
                >
                  Profile
                </button>
                <Link
                  to="/"
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-red-500/20 hover:text-white transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Back to Home
                </Link>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="md:col-span-3">
            <div className="bg-gray-900 p-6 border border-red-500/30 rounded-lg min-h-[300px]">
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-white uppercase tracking-wider">Order History</h2>
                  {ordersLoading ? (
                    <Spinner />
                  ) : ordersError ? (
                    <div className="text-red-400 p-4 bg-red-500/20 rounded-md border border-red-500/30">
                      <p>Error loading orders: {ordersError}</p>
                    </div>
                  ) : orders && orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map(order => (
                        <div key={order.id} className="border-b border-red-500/20 pb-4 last:border-b-0">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold text-white">Order #{order.id}</p>
                              <p className="text-sm text-gray-400">Date: {formatDate(order.created_at)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-white">₹{order.total?.toLocaleString() || '0'}</p>
                              <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400 capitalize border border-red-500/30">{order.order_status || 'pending'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">You haven't placed any orders yet.</p>
                  )}
                </div>
              )}

              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6 text-white uppercase tracking-wider">Profile Settings</h2>
                  
                  <div className="space-y-6">
                    {/* Profile Information */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-red-500/20">
                      <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wider">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-white mb-2 uppercase tracking-wider">Full Name</label>
                          <input
                            type="text"
                            value={user?.name || ''}
                            readOnly
                            className="w-full px-4 py-3 bg-gray-900 border border-red-500/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-white mb-2 uppercase tracking-wider">Email Address</label>
                          <input
                            type="email"
                            value={user?.email || ''}
                            readOnly
                            className="w-full px-4 py-3 bg-gray-900 border border-red-500/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-bold text-white mb-2 uppercase tracking-wider">Account Type</label>
                        <span className="inline-block px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-bold uppercase tracking-wider border border-red-500/30">
                          {user?.role || 'User'}
                        </span>
                      </div>
                    </div>

                    {/* Account Statistics */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-red-500/20">
                      <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wider">Account Statistics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-400">{orders?.length || 0}</div>
                          <div className="text-sm text-gray-400 uppercase tracking-wider">Total Orders</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-400">
                            ₹{orders?.reduce((total, order) => total + (order.total || 0), 0).toLocaleString() || '0'}
                          </div>
                          <div className="text-sm text-gray-400 uppercase tracking-wider">Total Spent</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-400">
                            {new Date(user?.created_at || Date.now()).getFullYear()}
                          </div>
                          <div className="text-sm text-gray-400 uppercase tracking-wider">Member Since</div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-red-500/20">
                      <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wider">Quick Actions</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button 
                          onClick={() => setActiveTab('orders')}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg uppercase tracking-wider transition-all transform hover:scale-105 shadow-lg"
                        >
                          View Orders
                        </button>
                        <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg uppercase tracking-wider transition-all transform hover:scale-105 shadow-lg">
                          Download Data
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