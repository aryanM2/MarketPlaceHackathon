import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { Search, Filter, Layers, ArrowUpDown, Sparkles, Tag, ShoppingBag, Eye, ShieldCheck, Factory, CheckCircle } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Sustainable',
  'Denim',
  'Woven',
  'Synthetic',
  'Silk & Wool',
  'Custom Print',
];

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [error, setError] = useState('');

  // Fetch products based on filters
  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
      if (sort) params.append('sort', sort);

      const res = await API.get(`/products?${params.toString()}`);
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching marketplace products:', err);
      setError('Unable to load products. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch featured products for Hero highlight
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await API.get('/products/featured');
        if (res.data.success) {
          setFeaturedProducts(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching featured products:', err);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, sort]);

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-brand-500/20 border border-brand-400/30 px-3 py-1 rounded-full text-xs font-semibold text-brand-300">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Direct Mill Wholesale B2B Sourcing</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Source Premium Wholesale Fabrics Directly From Verifiable Mills
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Connect with global textile manufacturers. Browse certified organic cottons, technical knits, raw denim, pure silks, and custom prints with transparent bulk pricing.
            </p>

            {/* Hero Search Box */}
            <div className="relative max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by fabric name, material (e.g., Organic Cotton, Silk, Denim)..."
                className="w-full pl-11 pr-4 py-3.5 bg-white text-slate-900 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm placeholder-slate-400 font-medium"
              />
            </div>

            {/* Quick Stat Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Suppliers</span>
              </div>
              <div className="flex items-center space-x-2">
                <Factory className="w-4 h-4 text-brand-400" />
                <span>Transparent Wholesale MOQs</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                <span>Direct Mill Quotes</span>
              </div>
            </div>
          </div>

          {/* Hero Featured Highlight Card */}
          <div className="lg:col-span-5 hidden lg:block">
            {featuredProducts.length > 0 && (
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 shadow-2xl text-white">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-300">Featured Mill Pick</span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-semibold border border-emerald-400/30">
                    Verified Stock
                  </span>
                </div>
                <img
                  src={featuredProducts[0].images[0]}
                  alt={featuredProducts[0].name}
                  className="w-full h-44 object-cover rounded-xl mb-4 border border-white/10"
                />
                <h3 className="font-bold text-base line-clamp-1">{featuredProducts[0].name}</h3>
                <p className="text-xs text-slate-300 mt-1 flex items-center space-x-2">
                  <span>{featuredProducts[0].fabricType}</span>
                  <span>•</span>
                  <span>MOQ: {featuredProducts[0].moq} {featuredProducts[0].unit}s</span>
                </p>
                <div className="mt-3 flex items-center justify-between pt-3 border-t border-white/10">
                  <div>
                    <span className="text-xs text-slate-400">Wholesale Price</span>
                    <div className="text-lg font-extrabold text-brand-400">
                      ${featuredProducts[0].price.toFixed(2)} <span className="text-xs text-slate-300 font-normal">/ {featuredProducts[0].unit}</span>
                    </div>
                  </div>
                  <Link
                    to={`/products/${featuredProducts[0]._id}`}
                    className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow transition-colors flex items-center space-x-1"
                  >
                    <span>Inspect Fabric</span>
                    <Eye className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Main Marketplace Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Category Pills Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 overflow-x-auto gap-3 scrollbar-none">
          <div className="flex items-center space-x-2 min-w-max">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2 flex items-center space-x-1">
              <Layers className="w-3.5 h-3.5 text-brand-600" />
              <span>Categories:</span>
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 min-w-max">
            <ArrowUpDown className="w-4 h-4 text-slate-500" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="newest">Sort by: Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-700">
            Showing <span className="text-brand-600 font-bold">{products.length}</span> fabric listings
            {selectedCategory !== 'All' && <span> in <strong>{selectedCategory}</strong></span>}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 animate-pulse space-y-3">
                <div className="h-48 bg-slate-200 rounded-lg"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 bg-rose-50 border border-rose-200 rounded-xl text-center text-rose-700 font-medium text-sm">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No Fabrics Found</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your search criteria or category filter to discover available mill inventories.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
              }}
              className="text-xs font-semibold text-brand-600 bg-brand-50 px-4 py-2 rounded-lg hover:bg-brand-100 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          /* Products Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={product.images[0] || 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="bg-slate-900/80 backdrop-blur-sm text-white text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md tracking-wider">
                      {product.category}
                    </span>
                    {product.isFeatured && (
                      <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-brand-600">{product.fabricType}</span>
                      <span>MOQ: {product.moq} {product.unit}s</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1 group-hover:text-brand-600 transition-colors">
                      {product.name}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Color Swatch Badges */}
                    {product.colors && product.colors.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {product.colors.slice(0, 3).map((col, idx) => (
                          <span
                            key={idx}
                            className="inline-block text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium border border-slate-200"
                          >
                            {col}
                          </span>
                        ))}
                        {product.colors.length > 3 && (
                          <span className="text-[10px] text-slate-400 font-medium self-center">
                            +{product.colors.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Supplier & Price Bar */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block font-medium">Wholesale Price</span>
                      <div className="text-lg font-extrabold text-slate-900">
                        ${product.price.toFixed(2)}{' '}
                        <span className="text-xs text-slate-500 font-normal">/ {product.unit}</span>
                      </div>
                    </div>

                    <Link
                      to={`/products/${product._id}`}
                      className="px-3.5 py-2 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-semibold transition-colors flex items-center space-x-1"
                    >
                      <span>View</span>
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Marketplace;
