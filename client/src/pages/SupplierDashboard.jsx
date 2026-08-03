import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Factory, DollarSign, Package, AlertTriangle, ShoppingBag, Plus, RefreshCw, CheckCircle2, MapPin, Building2, Eye, ShieldCheck, Layers } from 'lucide-react';

const SupplierDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSupplierData = async () => {
      setLoading(true);
      setError('');
      try {
        const [profileRes, productsRes, ordersRes] = await Promise.allSettled([
          API.get('/supplier/profile'),
          API.get('/products/mine'),
          API.get('/orders/supplier'),
        ]);

        if (profileRes.status === 'fulfilled' && profileRes.value.data.success) {
          setProfile(profileRes.value.data.data);
        }

        if (productsRes.status === 'fulfilled' && productsRes.value.data.success) {
          setProducts(productsRes.value.data.data);
        }

        if (ordersRes.status === 'fulfilled' && ordersRes.value.data.success) {
          setOrders(ordersRes.value.data.data);
        }
      } catch (err) {
        console.error('Failed to load supplier dashboard:', err);
        setError('Failed to load supplier statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierData();
  }, []);

  // Compute Statistics
  const totalSalesRevenue = orders.reduce((sum, order) => {
    if (['Accepted', 'Preparing', 'Ready', 'Completed'].includes(order.status)) {
      return sum + (order.totalAmount || 0);
    }
    return sum;
  }, 0);

  const activeOrdersCount = orders.filter((o) => ['Pending', 'Accepted', 'Preparing', 'Ready'].includes(o.status)).length;
  const lowStockProducts = products.filter((p) => (p.stock || 0) < 1000);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-bold">Pending Review</span>;
      case 'Accepted':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full text-xs font-bold">Accepted</span>;
      case 'Preparing':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded-full text-xs font-bold">In Production</span>;
      case 'Ready':
        return <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full text-xs font-bold">Ready to Ship</span>;
      case 'Completed':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-bold">Completed</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500 font-medium animate-pulse flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin text-brand-600" />
          <span>Loading Supplier Mill Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Banner */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="bg-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border border-brand-500/30">
                Supplier Facility Portal
              </span>
              {profile?.businessName && (
                <span className="text-slate-400 text-xs">• {profile.businessName}</span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {profile?.businessName || user?.companyName || 'Supplier Mill Dashboard'}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm">
              Monitor incoming buyer purchase orders, manage mill roll stock, and review supply metrics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/supplier/onboarding"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors flex items-center space-x-1.5 border border-slate-700"
            >
              <Building2 className="w-4 h-4" />
              <span>Mill Setup</span>
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 4 Statistics Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Sales Revenue</span>
              <div className="text-2xl font-black text-slate-900 mt-1">${totalSalesRevenue.toFixed(2)}</div>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Active Orders</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{activeOrdersCount}</div>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Products Listed</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{products.length}</div>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Package className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Low Stock Alerts</span>
              <div className="text-2xl font-black text-rose-600 mt-1">{lowStockProducts.length}</div>
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* Inventory Alerts Banner */}
        {lowStockProducts.length > 0 && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-rose-800 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>Low Inventory Stock Warning ({lowStockProducts.length} fabrics below 1,000 meters)</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {lowStockProducts.map((p) => (
                <span key={p._id} className="bg-white text-rose-900 border border-rose-200 px-3 py-1 rounded-lg font-medium shadow-sm">
                  {p.name} — Only <strong>{p.stock} {p.unit}s</strong> remaining!
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Two-Column Grid: Incoming Orders & Products Portfolio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Incoming Buyer Orders */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-brand-600" />
                <span>Incoming Buyer Orders</span>
              </h2>
              <span className="text-xs font-semibold text-slate-500">
                {orders.length} total orders
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No buyer purchase orders received yet.
              </div>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div key={order._id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 text-sm">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </span>
                        <div className="text-slate-500 mt-0.5">
                          Buyer: <strong>{order.buyer?.companyName || order.buyer?.name || 'Verified Buyer'}</strong>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(order.status)}
                        <div className="font-black text-slate-900 text-sm mt-1">
                          ${order.totalAmount.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-200/60 pt-2 text-slate-600">
                      {order.items?.map((item, i) => (
                        <div key={i} className="flex justify-between font-medium py-0.5">
                          <span>{item.product?.name || 'Fabric'} ({item.quantity} {item.product?.unit || 'm'})</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Listed Products Portfolio */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Layers className="w-5 h-5 text-brand-600" />
                <span>Listed Fabric Catalog</span>
              </h2>
              <span className="text-xs font-semibold text-slate-500">
                {products.length} fabrics
              </span>
            </div>

            {products.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No products listed yet.
              </div>
            ) : (
              <div className="space-y-3">
                {products.slice(0, 5).map((prod) => (
                  <div key={prod._id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <img
                        src={prod.images?.[0] || 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80'}
                        alt=""
                        className="w-12 h-12 object-cover rounded-lg border flex-shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900 line-clamp-1">{prod.name}</div>
                        <div className="text-slate-500 font-medium">
                          ${prod.price.toFixed(2)} / {prod.unit} • Stock: <strong className={prod.stock < 1000 ? 'text-rose-600' : 'text-slate-800'}>{prod.stock}m</strong>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/products/${prod._id}`}
                      className="p-2 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="View listing"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default SupplierDashboard;
