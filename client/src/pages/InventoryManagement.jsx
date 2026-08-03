import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { Layers, Plus, Edit2, Trash2, AlertTriangle, Check, X, ArrowLeft, RefreshCw, Image, DollarSign, Package } from 'lucide-react';

const CATEGORIES = [
  'Sustainable',
  'Denim',
  'Woven',
  'Knitted',
  'Synthetic',
  'Silk & Wool',
  'Custom Print',
];

const InventoryManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Woven',
    fabricType: '',
    price: '',
    stock: '',
    moq: '100',
    unit: 'meter',
    colorsInput: '',
    imageUrl: '',
    weightGSM: '180',
    widthInches: '58',
    pattern: 'Solid Plain',
    origin: 'India',
  });

  const fetchSupplierProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get('/products/mine');
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching supplier inventory:', err);
      setError('Unable to load inventory products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplierProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      category: 'Woven',
      fabricType: '',
      price: '',
      stock: '',
      moq: '100',
      unit: 'meter',
      colorsInput: 'Navy, Off-White, Charcoal',
      imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80',
      weightGSM: '180',
      widthInches: '58',
      pattern: 'Solid Plain',
      origin: 'India',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name || '',
      description: prod.description || '',
      category: prod.category || 'Woven',
      fabricType: prod.fabricType || '',
      price: prod.price ? String(prod.price) : '',
      stock: prod.stock ? String(prod.stock) : '',
      moq: prod.moq ? String(prod.moq) : '100',
      unit: prod.unit || 'meter',
      colorsInput: prod.colors ? prod.colors.join(', ') : '',
      imageUrl: prod.images?.[0] || '',
      weightGSM: prod.specifications?.weightGSM ? String(prod.specifications.weightGSM) : '180',
      widthInches: prod.specifications?.widthInches ? String(prod.specifications.widthInches) : '58',
      pattern: prod.specifications?.pattern || 'Solid Plain',
      origin: prod.specifications?.origin || 'India',
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.name || !formData.description || !formData.category || !formData.fabricType || !formData.price || !formData.stock) {
      setError('Please fill in required fields: Name, Description, Category, Material, Price, Stock');
      return;
    }

    const colorsArray = formData.colorsInput
      ? formData.colorsInput.split(',').map((c) => c.trim()).filter(Boolean)
      : [];

    const payload = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      fabricType: formData.fabricType,
      price: Number(formData.price),
      stock: Number(formData.stock),
      moq: Number(formData.moq) || 100,
      unit: formData.unit || 'meter',
      colors: colorsArray,
      images: formData.imageUrl ? [formData.imageUrl] : ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80'],
      specifications: {
        weightGSM: Number(formData.weightGSM) || 180,
        widthInches: Number(formData.widthInches) || 58,
        pattern: formData.pattern || 'Solid Plain',
        origin: formData.origin || 'India',
      },
    };

    setIsSubmitting(true);
    try {
      if (editingProduct) {
        // Update product
        const res = await API.put(`/products/${editingProduct._id}`, payload);
        if (res.data.success) {
          setSuccessMsg('Product updated successfully!');
          fetchSupplierProducts();
          setIsModalOpen(false);
        }
      } else {
        // Create product
        const res = await API.post('/products', payload);
        if (res.data.success) {
          setSuccessMsg('New fabric listing added successfully!');
          fetchSupplierProducts();
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this fabric listing from your inventory?')) return;

    setIsDeletingId(productId);
    try {
      const res = await API.delete(`/products/${productId}`);
      if (res.data.success) {
        setSuccessMsg('Product listing deleted successfully');
        setProducts(products.filter((p) => p._id !== productId));
      }
    } catch (err) {
      setError('Failed to delete product listing');
    } finally {
      setIsDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500 font-medium animate-pulse flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin text-brand-600" />
          <span>Loading Inventory Management...</span>
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
              <Layers className="w-7 h-7 text-brand-600" />
              <span>Fabric Inventory & Product Catalog</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Add new fabric rolls, edit stock availability, update wholesale prices, and manage product listings.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/supplier/dashboard"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            <button
              onClick={openAddModal}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Fabric Listing</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-semibold flex items-center space-x-2">
            <Check className="w-5 h-5 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Product Inventory Table / Card Grid */}
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Fabric Products Listed</h3>
            <p className="text-xs text-slate-500">
              Start by creating your first wholesale fabric product listing for buyers on TexTrade.
            </p>
            <button
              onClick={openAddModal}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Fabric Listing</span>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <th className="py-3.5 px-4">Fabric Product</th>
                    <th className="py-3.5 px-4">Category / Material</th>
                    <th className="py-3.5 px-4">Wholesale Price</th>
                    <th className="py-3.5 px-4">Roll Stock</th>
                    <th className="py-3.5 px-4">MOQ</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {products.map((prod) => (
                    <tr key={prod._id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* Product Thumbnail & Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={prod.images?.[0] || 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80'}
                            alt=""
                            className="w-12 h-12 object-cover rounded-lg border border-slate-200 flex-shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 text-sm line-clamp-1">{prod.name}</div>
                            <div className="text-slate-400 text-[11px] line-clamp-1">{prod.description}</div>
                          </div>
                        </div>
                      </td>

                      {/* Category / Material */}
                      <td className="py-3.5 px-4">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-semibold text-[10px] uppercase block w-max">
                          {prod.category}
                        </span>
                        <span className="text-slate-500 font-medium mt-1 block">
                          {prod.fabricType}
                        </span>
                      </td>

                      {/* Wholesale Price */}
                      <td className="py-3.5 px-4 font-extrabold text-slate-900">
                        ${prod.price?.toFixed(2)} <span className="text-[10px] text-slate-400 font-normal">/ {prod.unit}</span>
                      </td>

                      {/* Roll Stock */}
                      <td className="py-3.5 px-4">
                        <span className={`font-bold ${prod.stock < 1000 ? 'text-rose-600 font-black' : 'text-slate-800'}`}>
                          {prod.stock?.toLocaleString()} {prod.unit}s
                        </span>
                        {prod.stock < 1000 && (
                          <span className="block text-[10px] text-rose-500 font-semibold">Low Stock!</span>
                        )}
                      </td>

                      {/* MOQ */}
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {prod.moq} {prod.unit}s
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openEditModal(prod)}
                            className="p-2 text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                            title="Edit listing"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod._id)}
                            disabled={isDeletingId === prod._id}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add / Edit Product Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
              
              {/* Modal Header */}
              <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
                <h3 className="font-bold text-base flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-brand-400" />
                  <span>{editingProduct ? 'Edit Fabric Product Listing' : 'Add New Fabric Product Listing'}</span>
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmitForm} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
                
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. 100% Organic Comb Cotton Jersey"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Fabric Material Type *</label>
                    <input
                      type="text"
                      required
                      value={formData.fabricType}
                      onChange={(e) => setFormData({ ...formData, fabricType: e.target.value })}
                      placeholder="e.g. Organic Cotton, Belgian Linen"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Wholesale Price ($ / unit) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="4.80"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Available Stock (meters) *</label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      placeholder="12500"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Minimum Order Quantity (MOQ) *</label>
                    <input
                      type="number"
                      required
                      value={formData.moq}
                      onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
                      placeholder="100"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Available Colors (Comma separated)</label>
                    <input
                      type="text"
                      value={formData.colorsInput}
                      onChange={(e) => setFormData({ ...formData, colorsInput: e.target.value })}
                      placeholder="Navy, Emerald, Charcoal"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Fabric Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed description of fabric weight, weave, softness, and recommended apparel applications..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                {/* Technical Specifications */}
                <div className="border-t border-slate-100 pt-3">
                  <label className="block font-bold text-slate-800 mb-2">Technical Specifications</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <span className="text-slate-500 block mb-1">Weight (GSM)</span>
                      <input
                        type="number"
                        value={formData.weightGSM}
                        onChange={(e) => setFormData({ ...formData, weightGSM: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">Width (Inches)</span>
                      <input
                        type="number"
                        value={formData.widthInches}
                        onChange={(e) => setFormData({ ...formData, widthInches: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">Weave Pattern</span>
                      <input
                        type="text"
                        value={formData.pattern}
                        onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">Country Origin</span>
                      <input
                        type="text"
                        value={formData.origin}
                        onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving Listing...' : editingProduct ? 'Save Changes' : 'Publish Fabric Listing'}
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default InventoryManagement;
