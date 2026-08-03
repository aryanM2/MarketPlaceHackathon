import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, ArrowLeft, Check, ShieldCheck, Factory, Layers, AlertCircle, Plus, Minus, Info } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isBuyer } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(100);
  
  const [isAdding, setIsAdding] = useState(false);
  const [cartSuccess, setCartSuccess] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await API.get(`/products/${id}`);
        if (res.data.success) {
          const prodData = res.data.data;
          setProduct(prodData);
          setQuantity(prodData.moq || 100);
          if (prodData.colors && prodData.colors.length > 0) {
            setSelectedColor(prodData.colors[0]);
          }
        }
      } catch (err) {
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (val) => {
    const num = Number(val);
    if (isNaN(num) || num < 1) return;
    setQuantity(num);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (product.moq && quantity < product.moq) {
      setError(`Minimum Order Quantity (MOQ) is ${product.moq} ${product.unit}s.`);
      return;
    }

    setError('');
    setIsAdding(true);
    try {
      const res = await API.post('/cart/add', {
        productId: product._id,
        quantity: quantity,
        color: selectedColor,
      });

      if (res.data.success) {
        setCartSuccess(`Added ${quantity} ${product.unit}s to cart!`);
        setTimeout(() => setCartSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item to cart');
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500 font-medium animate-pulse">Loading fabric specifications...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md border border-slate-200 space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-800">Product Not Found</h2>
          <p className="text-sm text-slate-600">{error || 'The requested fabric listing could not be found.'}</p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-brand-600 bg-brand-50 px-4 py-2.5 rounded-lg hover:bg-brand-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Marketplace</span>
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80'];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Back Navigation */}
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>

        {/* Main Product Details Card */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8">
            
            {/* Left Column: Images Gallery */}
            <div className="lg:col-span-6 space-y-4">
              <div className="h-96 sm:h-[450px] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-extrabold uppercase px-3 py-1 rounded-md tracking-wider">
                  {product.category}
                </span>
              </div>

              {images.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                        selectedImage === index
                          ? 'border-brand-600 ring-2 ring-brand-500/30'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Fabric Information & Ordering Form */}
            <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
              
              <div className="space-y-4">
                {/* Mill & Category Header */}
                <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <Factory className="w-4 h-4 text-brand-600" />
                    <span className="font-semibold text-slate-700">
                      {product.supplier?.companyName || product.supplier?.name || 'Verified Mill Supplier'}
                    </span>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
                    In Stock ({product.stock.toLocaleString()} {product.unit}s)
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {product.name}
                </h1>

                {/* Fabric Material Subtitle */}
                <div className="flex items-center space-x-3 text-sm">
                  <span className="font-semibold text-brand-600">{product.fabricType}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 font-medium">Standard Width: {product.specifications?.widthInches || 58}"</span>
                </div>

                {/* Price Display */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold uppercase text-slate-500 block">Wholesale Mill Rate</span>
                    <div className="text-3xl font-black text-slate-900">
                      ${product.price.toFixed(2)}{' '}
                      <span className="text-sm font-normal text-slate-500">/ {product.unit}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200 px-2.5 py-1 rounded-lg block">
                      MOQ: {product.moq} {product.unit}s
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-600 text-sm leading-relaxed">
                  {product.description}
                </p>

                {/* Color Swatch Options */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Select Color Shade: <span className="text-brand-600 font-normal">{selectedColor}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center space-x-1.5 ${
                            selectedColor === color
                              ? 'border-brand-600 bg-brand-50 text-brand-800 ring-1 ring-brand-600 font-semibold'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>{color}</span>
                          {selectedColor === color && <Check className="w-3.5 h-3.5 text-brand-600" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Order Quantity Selector */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Order Quantity ({product.unit}s)
                    </label>
                    <span className="text-xs text-slate-500">
                      Min: {product.moq} {product.unit}s
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white shadow-sm">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(Math.max(product.moq || 100, quantity - 50))}
                        className="px-3 py-2.5 text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(e.target.value)}
                        min={product.moq || 1}
                        className="w-24 text-center text-slate-900 font-bold text-sm border-none focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(quantity + 50)}
                        className="px-3 py-2.5 text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-xs text-slate-500 font-medium">
                      Estimated Subtotal: <strong className="text-slate-900 text-sm">${(quantity * product.price).toFixed(2)}</strong>
                    </div>
                  </div>
                </div>

                {/* Error & Success Feedback */}
                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {cartSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-xs font-semibold flex items-center space-x-2">
                    <Check className="w-4 h-4 flex-shrink-0" />
                    <span>{cartSuccess}</span>
                  </div>
                )}

              </div>

              {/* Add to Cart Action */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="w-full flex items-center justify-center py-3.5 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-colors disabled:opacity-50 space-x-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>{isAdding ? 'Adding to Cart...' : 'Add Fabric to Order Cart'}</span>
                </button>

                <div className="flex items-center justify-center space-x-4 text-xs text-slate-500 pt-1">
                  <div className="flex items-center space-x-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Direct Mill Contract</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span>Lab Dip / Swatch Available</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Specifications Table Section */}
          <div className="bg-slate-50 p-6 sm:p-8 border-t border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Layers className="w-5 h-5 text-brand-600" />
              <span>Technical Fabric Specifications</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-medium block">Weight (GSM)</span>
                <span className="text-base font-bold text-slate-800">
                  {product.specifications?.weightGSM || 180} GSM
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-medium block">Cuttable Width</span>
                <span className="text-base font-bold text-slate-800">
                  {product.specifications?.widthInches || 58} Inches
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-medium block">Weave Pattern</span>
                <span className="text-base font-bold text-slate-800">
                  {product.specifications?.pattern || 'Solid Plain'}
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-medium block">Country of Origin</span>
                <span className="text-base font-bold text-slate-800">
                  {product.specifications?.origin || 'India'}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
