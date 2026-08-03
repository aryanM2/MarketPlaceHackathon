import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Factory, MapPin, Layers, Clock, ShieldCheck, Phone, FileText, Check, AlertCircle, Edit2, ArrowLeft, RefreshCw, Save } from 'lucide-react';

const CATEGORIES = [
  'Woven Fabrics',
  'Knitted Fabrics',
  'Sustainable & Organic',
  'Synthetic & Technical',
  'Luxury Silk & Wool',
  'Custom Printed & Dyed',
  'Denim & Heavy Duty',
  'Non-Woven & Industrial',
];

const SupplierProfileView = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    businessName: '',
    phone: '',
    taxId: '',
    moq: '100 meters',
    operatingHours: 'Mon - Fri: 9:00 AM - 6:00 PM',
    description: '',
    categories: [],
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  });

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get('/supplier/profile');
      if (res.data.success && res.data.data) {
        const p = res.data.data;
        setProfile(p);
        setFormData({
          businessName: p.businessName || '',
          phone: p.phone || '',
          taxId: p.taxId || '',
          moq: p.moq || '100 meters',
          operatingHours: p.operatingHours || 'Mon - Fri: 9:00 AM - 6:00 PM',
          description: p.description || '',
          categories: p.categories || [],
          address: p.address || { street: '', city: '', state: '', zipCode: '', country: '' },
        });
      }
    } catch (err) {
      console.error('Failed to fetch supplier profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleCategoryToggle = (cat) => {
    setFormData((prev) => {
      const exists = prev.categories.includes(cat);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((c) => c !== cat)
          : [...prev.categories, cat],
      };
    });
  };

  const handleAddressChange = (e) => {
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.businessName || !formData.moq || !formData.operatingHours) {
      setError('Please provide Business Name, MOQ, and Operating Hours');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await API.post('/supplier/profile', formData);
      if (res.data.success) {
        setSuccessMsg('Supplier mill profile saved successfully!');
        setProfile(res.data.data);
        setIsEditing(false);
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save supplier profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500 font-medium animate-pulse flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin text-brand-600" />
          <span>Loading Supplier Profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-3">
              <Factory className="w-7 h-7 text-brand-600" />
              <span>Supplier Mill Profile</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage your textile manufacturing business details, plant address, and supply capabilities.
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
              onClick={() => setIsEditing(!isEditing)}
              className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-colors ${
                isEditing
                  ? 'bg-slate-800 text-white'
                  : 'bg-brand-600 hover:bg-brand-700 text-white'
              }`}
            >
              <Edit2 className="w-4 h-4" />
              <span>{isEditing ? 'Cancel Editing' : 'Edit Business Profile'}</span>
            </button>
          </div>
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
            <Check className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Profile Card / Edit Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border border-emerald-500/30">
                  Verified Textile Supplier
                </span>
              </div>
              <h2 className="text-2xl font-black">{formData.businessName || user?.companyName || user?.name}</h2>
              <p className="text-xs text-slate-400">Account Owner: {user?.name} ({user?.email})</p>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-300 space-y-1">
              <div>Phone: <strong>{formData.phone || user?.phone || 'N/A'}</strong></div>
              <div>Tax ID: <strong>{formData.taxId || 'N/A'}</strong></div>
            </div>
          </div>

          {isEditing ? (
            /* Editable Form */
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 text-xs">
              
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                  1. Business Name & Contact
                </h3>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mill / Business Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="e.g. Apex Textile Mills Pvt. Ltd."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Direct Phone</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 234-5678"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tax ID / Business Reg</label>
                    <input
                      type="text"
                      value={formData.taxId}
                      onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                      placeholder="TAX-9900-11"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Address Form */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                  2. Facility Address
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      name="street"
                      value={formData.address.street}
                      onChange={handleAddressChange}
                      placeholder="Street Address (Factory / Warehouse)"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="city"
                      value={formData.address.city}
                      onChange={handleAddressChange}
                      placeholder="City"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="state"
                      value={formData.address.state}
                      onChange={handleAddressChange}
                      placeholder="State / Region"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.address.zipCode}
                      onChange={handleAddressChange}
                      placeholder="Zip / Postal Code"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="country"
                      value={formData.address.country}
                      onChange={handleAddressChange}
                      placeholder="Country"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Operations & Categories */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                  3. Capabilities & Operations
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Standard MOQ *</label>
                    <input
                      type="text"
                      required
                      value={formData.moq}
                      onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
                      placeholder="e.g. 100 meters"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Operating Hours *</label>
                    <input
                      type="text"
                      required
                      value={formData.operatingHours}
                      onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                      placeholder="Mon - Fri: 9:00 AM - 6:00 PM"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-2">Manufacturing Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => {
                      const selected = formData.categories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleCategoryToggle(cat)}
                          className={`px-3 py-1.5 rounded-lg border text-xs transition-all flex items-center space-x-1 ${
                            selected
                              ? 'border-brand-600 bg-brand-600 text-white font-semibold'
                              : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span>{cat}</span>
                          {selected && <Check className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mill Overview & Certifications</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of manufacturing capacity, OEKO-TEX or GOTS certifications..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSubmitting ? 'Saving Profile...' : 'Save Profile Changes'}</span>
                </button>
              </div>

            </form>
          ) : (
            /* Read-Only Profile View */
            <div className="p-6 sm:p-8 space-y-6 text-sm text-slate-700">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center space-x-2 text-brand-600 font-bold text-xs uppercase">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Minimum Order Quantity</span>
                  </div>
                  <div className="text-base font-extrabold text-slate-900">{formData.moq || '100 meters'}</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center space-x-2 text-brand-600 font-bold text-xs uppercase">
                    <Clock className="w-4 h-4" />
                    <span>Operating Hours</span>
                  </div>
                  <div className="text-base font-extrabold text-slate-900">{formData.operatingHours}</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1 sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center space-x-2 text-brand-600 font-bold text-xs uppercase">
                    <MapPin className="w-4 h-4" />
                    <span>Plant Location</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {formData.address.city ? `${formData.address.city}, ${formData.address.country}` : 'Address not configured'}
                  </div>
                </div>

              </div>

              {/* Full Address */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Full Facility Address</span>
                <p className="font-semibold text-slate-800">
                  {formData.address.street
                    ? `${formData.address.street}, ${formData.address.city}, ${formData.address.state} ${formData.address.zipCode}, ${formData.address.country}`
                    : 'Facility address pending configuration.'}
                </p>
              </div>

              {/* Categories */}
              {formData.categories && formData.categories.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Manufacturing Categories</span>
                  <div className="flex flex-wrap gap-2">
                    {formData.categories.map((cat, i) => (
                      <span key={i} className="bg-brand-50 text-brand-700 border border-brand-200 px-3 py-1 rounded-lg text-xs font-semibold">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {formData.description && (
                <div className="space-y-1 pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Mill Specializations & Overview</span>
                  <p className="text-slate-600 leading-relaxed text-xs">{formData.description}</p>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default SupplierProfileView;
