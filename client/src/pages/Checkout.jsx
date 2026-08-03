import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Truck, CheckCircle2, ShieldCheck, MapPin, Phone, User, FileText, ArrowLeft, PackageCheck, AlertCircle, RefreshCw } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [createdOrder, setCreatedOrder] = useState(null);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [notes, setNotes] = useState('');

  // Load cart and pre-fill address from buyer profile
  useEffect(() => {
    const loadCheckoutData = async () => {
      setLoading(true);
      try {
        const [cartRes, profileRes] = await Promise.allSettled([
          API.get('/cart'),
          API.get('/buyer/profile'),
        ]);

        if (cartRes.status === 'fulfilled' && cartRes.value.data.success) {
          setCart(cartRes.value.data.data);
        }

        if (profileRes.status === 'fulfilled' && profileRes.value.data.success && profileRes.value.data.data.address) {
          const addr = profileRes.value.data.data.address;
          setShippingAddress((prev) => ({
            ...prev,
            street: addr.street || prev.street,
            city: addr.city || prev.city,
            state: addr.state || prev.state,
            zipCode: addr.zipCode || prev.zipCode,
            country: addr.country || prev.country,
          }));
        }
      } catch (err) {
        console.error('Failed to load checkout data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutData();
  }, [user]);

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    const { fullName, phone, street, city, state, zipCode, country } = shippingAddress;
    if (!fullName || !phone || !street || !city || !state || !zipCode || !country) {
      setError('Please complete all required shipping address fields');
      return;
    }

    if (!cart || !cart.items || cart.items.length === 0) {
      setError('Your shopping cart is empty');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await API.post('/orders', {
        shippingAddress,
        notes,
      });

      if (res.data.success) {
        setCreatedOrder(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place purchase order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500 font-medium animate-pulse flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin text-brand-600" />
          <span>Preparing checkout details...</span>
        </div>
      </div>
    );
  }

  // Order Confirmation Success View
  if (createdOrder) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden text-center p-8 sm:p-12 space-y-6">
            
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Purchase Order Confirmed
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
                Order #{createdOrder._id.slice(-8).toUpperCase()} Saved
              </h1>
              <p className="text-sm text-slate-600 mt-2">
                Your B2B fabric purchase order has been transmitted directly to the mill suppliers.
              </p>
            </div>

            {/* Summary Details */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-left space-y-4 max-w-lg mx-auto text-sm">
              <div className="flex justify-between border-b border-slate-200 pb-3">
                <span className="text-slate-500 font-medium">Order Status</span>
                <span className="font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full text-xs">
                  {createdOrder.status}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-3">
                <span className="text-slate-500 font-medium">Total Fabric Line Items</span>
                <span className="font-semibold text-slate-800">{createdOrder.items?.length || 0} items</span>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-3">
                <span className="text-slate-500 font-medium">Destination Address</span>
                <span className="font-semibold text-slate-800 text-right">
                  {createdOrder.shippingAddress.city}, {createdOrder.shippingAddress.country}
                </span>
              </div>

              <div className="flex justify-between pt-1 text-base font-extrabold text-slate-900">
                <span>Grand Total Amount</span>
                <span className="text-brand-600">${createdOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/buyer/dashboard"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-sm transition-colors"
              >
                Track Orders in Dashboard
              </Link>
              <Link
                to="/"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors"
              >
                Return to Marketplace
              </Link>
            </div>

          </div>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const subtotal = items.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
  const totalMeters = items.reduce((acc, item) => acc + item.quantity, 0);
  const freightFee = subtotal > 1000 ? 0 : subtotal > 0 ? 45.00 : 0;
  const grandTotal = subtotal + freightFee;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-3">
              <Truck className="w-7 h-7 text-brand-600" />
              <span>B2B Purchase Order Checkout</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Confirm your business delivery destination and review wholesale order specifications.
            </p>
          </div>

          <Link
            to="/cart"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Cart</span>
          </Link>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Shipping Address & Purchase Notes */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Address Form Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
                <MapPin className="w-5 h-5 text-brand-600" />
                <span>1. Business Delivery Shipping Address</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Recipient / Business Name *
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={shippingAddress.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Apex Apparel Purchasing Dept."
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Contact Phone Number *
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="phone"
                      required
                      value={shippingAddress.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 234-5678"
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Street Address (Facility / Dock) *
                  </label>
                  <input
                    type="text"
                    name="street"
                    required
                    value={shippingAddress.street}
                    onChange={handleChange}
                    placeholder="100 Mill Industrial Parkway, Dock #4"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={shippingAddress.city}
                    onChange={handleChange}
                    placeholder="Greensboro"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    State / Province *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={shippingAddress.state}
                    onChange={handleChange}
                    placeholder="NC"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Zip / Postal Code *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    required
                    value={shippingAddress.zipCode}
                    onChange={handleChange}
                    placeholder="27401"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    required
                    value={shippingAddress.country}
                    onChange={handleChange}
                    placeholder="United States"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Special Instructions Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
                <FileText className="w-5 h-5 text-brand-600" />
                <span>2. Special Mill Instructions & PO Reference (Optional)</span>
              </h2>

              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Include internal PO numbers, roll packing instructions, or specific delivery dock hours..."
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

          </div>

          {/* Right Column: Order Review & Submit */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-6 sticky top-20">
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
                <PackageCheck className="w-5 h-5 text-brand-600" />
                <span>3. Order Item Review</span>
              </h2>

              {/* Items List */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => {
                  const prod = item.product;
                  if (!prod) return null;
                  return (
                    <div key={item._id || prod._id} className="flex items-center justify-between text-xs py-2 border-b border-slate-100">
                      <div className="flex items-center space-x-3">
                        <img src={prod.images?.[0]} alt="" className="w-10 h-10 object-cover rounded border" />
                        <div>
                          <div className="font-bold text-slate-900 line-clamp-1">{prod.name}</div>
                          <div className="text-slate-500">
                            {item.quantity} {prod.unit}s {item.color && `• ${item.color}`}
                          </div>
                        </div>
                      </div>
                      <div className="font-bold text-slate-900">
                        ${(prod.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="space-y-2 text-xs border-t border-slate-100 pt-4 text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal ({totalMeters.toLocaleString()} meters)</span>
                  <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Wholesale Logistics Freight</span>
                  <span className="font-semibold text-slate-900">{freightFee === 0 ? 'FREE' : `$${freightFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Order Amount</span>
                  <span className="text-brand-600">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || items.length === 0}
                className="w-full flex items-center justify-center py-3.5 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-md transition-colors disabled:opacity-50 space-x-2"
              >
                <span>{isSubmitting ? 'Submitting Purchase Order...' : 'Place B2B Purchase Order'}</span>
              </button>

              <div className="flex items-center justify-center space-x-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Direct Mill Order Dispatch</span>
              </div>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

export default Checkout;
