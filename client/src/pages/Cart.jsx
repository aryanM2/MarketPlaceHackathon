import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShieldCheck, Factory, AlertCircle, RefreshCw } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');

  const fetchCart = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get('/cart');
      if (res.data.success) {
        setCart(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load cart:', err);
      setError('Unable to load your shopping cart.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (productId, currentQty, delta, color) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;

    setUpdatingId(productId);
    try {
      const res = await API.put('/cart/item', {
        productId,
        quantity: newQty,
        color: color || '',
      });
      if (res.data.success) {
        setCart(res.data.data);
      }
    } catch (err) {
      console.error('Failed to update quantity:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemoveItem = async (productId) => {
    setUpdatingId(productId);
    try {
      const res = await API.delete(`/cart/item/${productId}`);
      if (res.data.success) {
        setCart(res.data.data);
      }
    } catch (err) {
      console.error('Failed to remove item:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500 font-medium animate-pulse flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin text-brand-600" />
          <span>Loading your B2B order cart...</span>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const subtotal = items.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const totalMeters = items.reduce((acc, item) => acc + item.quantity, 0);
  const estimatedFreight = subtotal > 1000 ? 0 : subtotal > 0 ? 45.00 : 0;
  const grandTotal = subtotal + estimatedFreight;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-3">
              <ShoppingBag className="w-7 h-7 text-brand-600" />
              <span>Wholesale Fabric Order Cart</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Review selected mill listings, manage roll quantities, and calculate wholesale shipping.
            </p>
          </div>

          <Link
            to="/"
            className="hidden sm:inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-5 max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Your Cart is Empty</h2>
            <p className="text-sm text-slate-500">
              Explore our B2B marketplace to source certified organic cottons, technical knits, raw denim, and silks directly from mills.
            </p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-sm transition-colors"
            >
              <span>Explore Marketplace Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Cart Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => {
                const prod = item.product;
                if (!prod) return null;

                const itemSubtotal = prod.price * item.quantity;
                const isUpdating = updatingId === prod._id;

                return (
                  <div
                    key={item._id || prod._id}
                    className={`bg-white rounded-xl border border-slate-200 p-5 shadow-sm transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      isUpdating ? 'opacity-50 pointer-events-none' : ''
                    }`}
                  >
                    {/* Fabric Thumbnail & Details */}
                    <div className="flex items-center space-x-4">
                      <img
                        src={prod.images?.[0] || 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80'}
                        alt={prod.name}
                        className="w-20 h-20 object-cover rounded-lg border border-slate-200 flex-shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] uppercase font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                            {prod.category}
                          </span>
                          {item.color && (
                            <span className="text-xs text-slate-500 font-medium">
                              Color: <strong>{item.color}</strong>
                            </span>
                          )}
                        </div>

                        <Link to={`/products/${prod._id}`} className="font-bold text-slate-900 text-base hover:text-brand-600 transition-colors block line-clamp-1">
                          {prod.name}
                        </Link>

                        <div className="text-xs text-slate-500 flex items-center space-x-2">
                          <Factory className="w-3.5 h-3.5 text-slate-400" />
                          <span>{prod.supplier?.companyName || 'Verified Mill'}</span>
                          <span>•</span>
                          <span className="font-semibold text-slate-700">${prod.price.toFixed(2)} / {prod.unit}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Controls & Line Total */}
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 border border-slate-300 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(prod._id, item.quantity, -50, item.color)}
                          className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-200 transition-colors"
                          title="Decrease Quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-14 text-center font-bold text-slate-800 text-xs">
                          {item.quantity} {prod.unit}s
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(prod._id, item.quantity, 50, item.color)}
                          className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-200 transition-colors"
                          title="Increase Quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-medium">Item Total</span>
                        <span className="text-base font-extrabold text-slate-900">${itemSubtotal.toFixed(2)}</span>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(prod._id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Remove from cart"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>

                  </div>
                );
              })}
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-6 sticky top-20">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Wholesale Order Summary
                </h3>

                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Total Fabric Rolls/Meters</span>
                    <span className="font-semibold text-slate-800">{totalMeters.toLocaleString()} meters</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-800">${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <span>Estimated Freight Freight</span>
                      <span className="block text-[10px] text-slate-400">
                        {subtotal > 1000 ? 'Free Mill Freight (> $1,000)' : 'Flat Rate B2B Logistics'}
                      </span>
                    </div>
                    <span className="font-semibold text-slate-800">
                      {estimatedFreight === 0 ? 'FREE' : `$${estimatedFreight.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
                  <div>
                    <span className="text-xs uppercase font-bold text-slate-500 block">Total Payable</span>
                    <div className="text-2xl font-black text-slate-900">${grandTotal.toFixed(2)}</div>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Excl. Local Taxes</span>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-colors space-x-2"
                >
                  <span>Proceed to B2B Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center space-x-2 text-xs text-slate-500 pt-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Encrypted B2B Purchase Order</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Cart;
