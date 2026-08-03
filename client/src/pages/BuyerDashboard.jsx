import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ShoppingBag, Clock, CheckCircle2, Building2, Package, Layers, MapPin, DollarSign, ArrowRight, RefreshCw, AlertCircle, Eye } from 'lucide-react';

const BuyerDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [profileRes, ordersRes] = await Promise.allSettled([
          API.get('/buyer/profile'),
          API.get('/orders/buyer'),
        ]);

        if (profileRes.status === 'fulfilled' && profileRes.value.data.success) {
          setProfile(profileRes.value.data.data);
        }

        if (ordersRes.status === 'fulfilled' && ordersRes.value.data.success) {
          setOrders(ordersRes.value.data.data);
        }
      } catch (err) {
        console.error('Error loading buyer dashboard:', err);
        setError('Unable to load dashboard details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-bold">Pending Approval</span>;
      case 'Accepted':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full text-xs font-bold">Order Accepted</span>;
      case 'Preparing':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded-full text-xs font-bold">In Production</span>;
      case 'Ready':
        return <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full text-xs font-bold">Ready for Dispatch</span>;
      case 'Completed':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center space-x-1"><CheckCircle2 className="w-3 h-3" /><span>Completed</span></span>;
      case 'Cancelled':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full text-xs font-bold">Cancelled</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'active') {
      return ['Pending', 'Accepted', 'Preparing', 'Ready'].includes(order.status);
    }
    if (activeTab === 'completed') {
      return order.status === 'Completed';
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500 font-medium animate-pulse flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin text-brand-600" />
          <span>Loading Buyer Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border border-brand-200">
                Buyer Account
              </span>
              {user?.companyName && (
                <span className="text-slate-400 text-xs">• {user.companyName}</span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm">
              Manage your textile purchasing orders, track shipment status, and review business preferences.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/"
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-colors flex items-center space-x-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Source Fabrics</span>
            </Link>
            <Link
              to="/buyer/onboarding"
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center space-x-1.5"
            >
              <Building2 className="w-4 h-4" />
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Profile & Business Preferences Card */}
        {profile && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Building2 className="w-5 h-5 text-brand-600" />
              <span>Business Profile & Purchasing Preferences</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-semibold block uppercase">Business Type</span>
                <span className="text-slate-800 font-bold text-sm">{profile.businessType || 'Not specified'}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-semibold block uppercase">Industry Segment</span>
                <span className="text-slate-800 font-bold text-sm">{profile.industry || 'Not specified'}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-semibold block uppercase">Monthly Budget</span>
                <span className="text-slate-800 font-bold text-sm">{profile.budget || 'Not specified'}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-semibold block uppercase">Average Order MOQ</span>
                <span className="text-slate-800 font-bold text-sm">{profile.orderQuantity || 'Not specified'}</span>
              </div>
            </div>

            {profile.preferredFabrics && profile.preferredFabrics.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Preferred Fabric Categories:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.preferredFabrics.map((f, i) => (
                    <span key={i} className="bg-brand-50 text-brand-700 border border-brand-200 px-2.5 py-1 rounded-lg text-xs font-medium">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Orders Section */}
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
              <Package className="w-6 h-6 text-brand-600" />
              <span>Purchase Orders History</span>
            </h2>

            {/* Tabs Filter */}
            <div className="flex items-center space-x-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm text-xs">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'all' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('active')}
                className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'active' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Active ({orders.filter(o => ['Pending', 'Accepted', 'Preparing', 'Ready'].includes(o.status)).length})
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'completed' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Completed ({orders.filter(o => o.status === 'Completed').length})
              </button>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 max-w-md mx-auto">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Purchase Orders</h3>
              <p className="text-xs text-slate-500">
                {activeTab === 'all'
                  ? "You haven't placed any fabric purchase orders yet."
                  : `No ${activeTab} orders found.`}
              </p>
              <Link
                to="/"
                className="inline-flex items-center space-x-2 text-xs font-semibold text-brand-600 bg-brand-50 px-4 py-2.5 rounded-lg hover:bg-brand-100 transition-colors"
              >
                <span>Browse Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 hover:shadow-md transition-shadow"
                >
                  
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-extrabold text-slate-900 text-sm sm:text-base">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4">
                      {getStatusBadge(order.status)}
                      <span className="text-base font-black text-slate-900">
                        ${order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Order Line Items */}
                  <div className="space-y-3">
                    {order.items?.map((item, idx) => {
                      const prod = item.product;
                      return (
                        <div key={idx} className="flex items-center justify-between text-xs py-1">
                          <div className="flex items-center space-x-3">
                            <img
                              src={prod?.images?.[0] || 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80'}
                              alt=""
                              className="w-10 h-10 object-cover rounded-lg border flex-shrink-0"
                            />
                            <div>
                              <div className="font-bold text-slate-800">{prod?.name || 'Fabric Listing'}</div>
                              <div className="text-slate-500">
                                {item.quantity} {prod?.unit || 'meter'}s {item.color && `• Color: ${item.color}`}
                              </div>
                            </div>
                          </div>
                          <div className="text-slate-700 font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Order Footer / Shipping Info */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-600" />
                      <span>
                        Destination: <strong>{order.shippingAddress?.fullName}</strong> ({order.shippingAddress?.city}, {order.shippingAddress?.country})
                      </span>
                    </div>
                    {order.freightFee === 0 ? (
                      <span className="text-emerald-600 font-semibold">Free Mill Shipping</span>
                    ) : (
                      <span>Freight Logistics: ${order.freightFee.toFixed(2)}</span>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default BuyerDashboard;
