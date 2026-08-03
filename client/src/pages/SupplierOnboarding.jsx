import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Factory, MapPin, Layers, Clock, ShieldCheck, Check, AlertCircle, ArrowRight, Phone, FileText } from 'lucide-react';

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

const MOQ_OPTIONS = [
  '100 meters',
  '250 meters',
  '500 meters',
  '1,000 meters',
  '2,500+ meters',
];

const OPERATING_HOURS_OPTIONS = [
  'Mon - Fri: 8:00 AM - 5:00 PM',
  'Mon - Fri: 9:00 AM - 6:00 PM',
  'Mon - Sat: 8:00 AM - 7:00 PM',
  '24/7 Mill Operations',
];

const SupplierOnboarding = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: '',
    phone: '',
    taxId: '',
    moq: '',
    operatingHours: '',
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

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/supplier/profile');
        if (res.data.success && res.data.data) {
          const p = res.data.data;
          setFormData({
            businessName: p.businessName || '',
            phone: p.phone || '',
            taxId: p.taxId || '',
            moq: p.moq || '',
            operatingHours: p.operatingHours || '',
            description: p.description || '',
            categories: p.categories || [],
            address: p.address || { street: '', city: '', state: '', zipCode: '', country: '' },
          });
        }
      } catch (err) {
        // No profile exists yet
      } finally {
        setLoading(false);
      }
    };

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

    const { businessName, moq, operatingHours, address } = formData;
    if (!businessName || !moq || !operatingHours) {
      setError('Please provide Business Name, Minimum Order Quantity (MOQ), and Operating Hours');
      return;
    }

    if (!address.street || !address.city || !address.state || !address.zipCode || !address.country) {
      setError('Please complete all facility address details (street, city, state, zip, country)');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await API.post('/supplier/profile', formData);
      if (res.data.success) {
        setSuccessMsg('Supplier profile onboarding complete!');
        setTimeout(() => {
          navigate('/supplier/dashboard');
        }, 1200);
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
        <div className="text-slate-500 font-medium animate-pulse">Loading supplier profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          
          {/* Header */}
          <div className="bg-slate-900 p-6 sm:p-8 text-white">
            <div className="flex items-center space-x-3 mb-2">
              <Factory className="w-8 h-8 text-brand-500" />
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Supplier Mill & Business Setup</h1>
            </div>
            <p className="text-slate-400 text-sm">
              Register your manufacturing facilities and supply capacity to start receiving order inquiries.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start space-x-2 text-rose-700 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center space-x-2 text-emerald-700 text-sm font-medium">
                <Check className="w-5 h-5 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Section 1: Basic Business Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 pb-2">
                <Factory className="w-4 h-4 text-brand-600" />
                <span>1. Business & Contact Information</span>
              </h3>

              <div>
                <label className="block text-sm font-medium text-slate-700">Business / Mill Name *</label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="e.g. Apex Textile Mills Pvt. Ltd."
                  className="mt-1 w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Direct Phone Number</span>
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 234-5678"
                    className="mt-1 w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 flex items-center space-x-1">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>Tax ID / Registration Number</span>
                  </label>
                  <input
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                    placeholder="TAX-9988-77"
                    className="mt-1 w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Address */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 pb-2">
                <MapPin className="w-4 h-4 text-brand-600" />
                <span>2. Facility / Factory Address *</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    required
                    name="street"
                    value={formData.address.street}
                    onChange={handleAddressChange}
                    placeholder="Street Address (Factory / Warehouse)"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    name="city"
                    value={formData.address.city}
                    onChange={handleAddressChange}
                    placeholder="City"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    name="state"
                    value={formData.address.state}
                    onChange={handleAddressChange}
                    placeholder="State / Region"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    name="zipCode"
                    value={formData.address.zipCode}
                    onChange={handleAddressChange}
                    placeholder="Zip / Postal Code"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    name="country"
                    value={formData.address.country}
                    onChange={handleAddressChange}
                    placeholder="Country"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Supply Categories */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-3 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-brand-600" />
                <span>3. Manufacturing Categories</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const selected = formData.categories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryToggle(cat)}
                      className={`px-3 py-2 rounded-lg border text-sm transition-all flex items-center space-x-1.5 ${
                        selected
                          ? 'border-brand-600 bg-brand-600 text-white font-medium shadow-sm'
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

            {/* Section 4: Minimum Order Quantity (MOQ) */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-3 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span>4. Minimum Order Quantity (MOQ) *</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {MOQ_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFormData({ ...formData, moq: opt })}
                    className={`p-3 text-center rounded-xl border text-sm transition-all ${
                      formData.moq === opt
                        ? 'border-brand-600 bg-brand-50 text-brand-800 font-semibold ring-1 ring-brand-600'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Section 5: Operating Hours */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-3 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-brand-600" />
                <span>5. Operating Hours *</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {OPERATING_HOURS_OPTIONS.map((hrs) => (
                  <button
                    key={hrs}
                    type="button"
                    onClick={() => setFormData({ ...formData, operatingHours: hrs })}
                    className={`p-3 text-left rounded-xl border text-sm transition-all flex items-center justify-between ${
                      formData.operatingHours === hrs
                        ? 'border-brand-600 bg-brand-50 text-brand-800 font-semibold ring-1 ring-brand-600'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{hrs}</span>
                    {formData.operatingHours === hrs && <Check className="w-4 h-4 text-brand-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Section 6: Business Description */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">6. Business Overview / Specializations</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of your textile manufacturing capacity, certifications (e.g. OEKO-TEX, GOTS), and capabilities..."
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center py-3 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm shadow-md transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  'Saving Supplier Profile...'
                ) : (
                  <>
                    <span>Complete Supplier Setup</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

export default SupplierOnboarding;
