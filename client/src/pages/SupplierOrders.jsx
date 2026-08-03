import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { ShoppingBag, CheckCircle2, Clock, Truck, PackageCheck, AlertCircle, ArrowLeft, RefreshCw, MapPin, Phone, Building2, User, ChevronRight } from 'lucide-react';

const SupplierOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchSupplierOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get('/orders/supplier');
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load supplier orders:', err);
      setError('Unable to load incoming buyer orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplierOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    setError('');
    setSuccessMsg('');
    try {
      const res = await API.put(`/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        setSuccessMsg(`Order #${orderId.slice(-8).toUpperCase()} updated to '${newStatus}'`);
        setOrders((prevOrders) =>
          prevOrders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="bg-amber-50 text-amber-800 border border-amber-300 px-3 py-1 rounded-full text-xs font-bold">Pending Review</span>;
      case 'Accepted':
        return <span className="bg-blue-50 text-blue-800 border border-blue-300 px-3 py-1 rounded-full text-xs font-bold">Accepted</span>;
      case 'Preparing':
        return <span className="bg-purple-50 text-purple-800 border border-purple-300 px-3 py-1 rounded-full text-xs font-bold">In Production</span>;
      case 'Ready':
        return <span className="bg-indigo-50 text-indigo-800 border border-indigo-300 px-3 py-1 rounded-full text-xs font-bold">Ready to Dispatch</span>;
      case 'Completed':
        return <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1"><CheckCircle2 className="w-3.5 h-3.5" /><span>Completed</span></span>;
      case 'Cancelled':
        return <span className="bg-rose-50 text-rose-800 border border-rose-300 px-3 py-1 rounded-full text-xs font-bold">Cancelled</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'pending') return o.status === 'Pending';
    if (activeTab === 'production') return ['Accepted', 'Preparing'].includes(o.status);
    if (activeTab === 'ready') return ['Ready', 'Completed'].includes(o.status);
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500 font-medium animate-pulse flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin text-brand-600" />
          <span>Loading Incoming Orders...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-3">
              <ShoppingBag className="w-7 h-7 text-brand-600" />
              <span>Mill Purchase Order Operations</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Process incoming buyer orders through mill production stages: Accept → Prepare → Ready → Complete.
            </p>
          </div>

          <Link
            to="/supplier/dashboard"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
        </div>

        {/* Notifications */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tabs Filter Bar */}
        <div className="flex items-center space-x-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'all' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'pending' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Pending Approval ({orders.filter((o) => o.status === 'Pending').length})
          </button>
          <button
            onClick={() => setActiveTab('production')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'production' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            In Production ({orders.filter((o) => ['Accepted', 'Preparing'].includes(o.status)).length})
          </button>
          <button
            onClick={() => setActiveTab('ready')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'ready' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Ready & Completed ({orders.filter((o) => ['Ready', 'Completed'].includes(o.status)).length})
          </button>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Orders in this Stage</h3>
            <p className="text-xs text-slate-500">
              {activeTab === 'all'
                ? 'No buyer purchase orders have been received yet.'
                : `There are currently no orders under the '${activeTab}' filter stage.`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const isUpdating = updatingId === order._id;

              return (
                <div
                  key={order._id}
                  className={`bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 transition-all ${
                    isUpdating ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-black text-slate-900 text-base">
                          PO #{order._id.slice(-8).toUpperCase()}
                        </span>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="text-xs text-slate-400">
                        Received on {new Date(order.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">Total PO Value</span>
                      <span className="text-2xl font-black text-slate-900">${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Two Columns: Buyer Info & Fabric Items */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
                    
                    {/* Buyer & Destination Address */}
                    <div className="md:col-span-5 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <h4 className="font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5 border-b border-slate-200 pb-2">
                        <Building2 className="w-3.5 h-3.5 text-brand-600" />
                        <span>Buyer & Delivery Destination</span>
                      </h4>

                      <div className="space-y-1 text-slate-700">
                        <div className="font-bold text-slate-900 text-sm">
                          {order.buyer?.companyName || order.buyer?.name || 'Verified Buyer'}
                        </div>
                        <div className="flex items-center space-x-1 text-slate-500">
                          <User className="w-3.5 h-3.5" />
                          <span>Contact: {order.shippingAddress?.fullName}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-slate-500">
                          <Phone className="w-3.5 h-3.5" />
                          <span>Phone: {order.shippingAddress?.phone}</span>
                        </div>
                        <div className="flex items-start space-x-1 text-slate-500 pt-1 border-t border-slate-200/60 mt-1">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                          <span>
                            {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}, {order.shippingAddress?.country}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Fabric Line Items */}
                    <div className="md:col-span-7 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <h4 className="font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5 border-b border-slate-200 pb-2">
                        <PackageCheck className="w-3.5 h-3.5 text-brand-600" />
                        <span>Ordered Fabric Rolls / Meters</span>
                      </h4>

                      <div className="space-y-2">
                        {order.items?.map((item, idx) => {
                          const prod = item.product;
                          return (
                            <div key={idx} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={prod?.images?.[0] || 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80'}
                                  alt=""
                                  className="w-10 h-10 object-cover rounded border flex-shrink-0"
                                />
                                <div>
                                  <div className="font-bold text-slate-900">{prod?.name || 'Fabric Listing'}</div>
                                  <div className="text-slate-500 text-[11px]">
                                    {item.quantity} {prod?.unit || 'meter'}s {item.color && `• Color: ${item.color}`}
                                  </div>
                                </div>
                              </div>
                              <div className="font-bold text-slate-900 text-sm">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>

                  {/* Status Action Workflow Bar */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 -mx-6 -mb-6 p-4 sm:px-6 rounded-b-2xl">
                    <div className="text-xs text-slate-500">
                      Current Order Stage: <strong className="text-slate-900">{order.status}</strong>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {order.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(order._id, 'Accepted')}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors"
                          >
                            Accept Order
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(order._id, 'Cancelled')}
                            className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs border border-rose-200 transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {order.status === 'Accepted' && (
                        <button
                          onClick={() => handleUpdateStatus(order._id, 'Preparing')}
                          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center space-x-1"
                        >
                          <span>Mark as In Production</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {order.status === 'Preparing' && (
                        <button
                          onClick={() => handleUpdateStatus(order._id, 'Ready')}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center space-x-1"
                        >
                          <span>Mark Ready for Dispatch</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {order.status === 'Ready' && (
                        <button
                          onClick={() => handleUpdateStatus(order._id, 'Completed')}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center space-x-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Order Completed</span>
                        </button>
                      )}

                      {order.status === 'Completed' && (
                        <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center space-x-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Order Fulfilled</span>
                        </span>
                      )}

                      {order.status === 'Cancelled' && (
                        <span className="text-xs text-rose-700 font-bold bg-rose-50 px-3 py-1 rounded-lg border border-rose-200">
                          Order Cancelled
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default SupplierOrders;
