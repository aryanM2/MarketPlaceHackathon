import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Building2, Layers, DollarSign, PackageCheck, MapPin, Check, AlertCircle, ArrowRight } from 'lucide-react';

const BUSINESS_TYPES = [
  'Garment Manufacturer',
  'Wholesaler & Distributor',
  'Retailer / Boutique',
  'Fashion Brand',
  'Independent Designer',
  'Other',
];

const INDUSTRIES = [
  'Apparel & Fashion',
  'Home Textiles & Furnishings',
  'Technical Textiles',
  'Automotive & Industrial',
  'Medical & Healthcare',
];

const BUDGET_RANGES = [
  'Under $10,000 / month',
  '$10,000 - $50,000 / month',
  '$50,000 - $200,000 / month',
  '$200,000+ / month',
];

const FABRIC_OPTIONS = [
  'Cotton',
  'Polyester',
  'Silk',
  'Denim',
  'Wool',
  'Linen',
  'Rayon / Viscose',
  'Spandex / Elastane',
  'Blends (Poly-Cotton, etc.)',
];

const ORDER_QUANTITIES = [
  'Small Batches (< 500 meters)',
  'Medium Batches (500 - 2,000 meters)',
  'Large Production (2,000 - 10,000 meters)',
  'Bulk Industrial (10,000+ meters)',
];

const BuyerOnboarding = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessType: '',
    industry: '',
    budget: '',
    preferredFabrics: [],
    orderQuantity: '',
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

  // Fetch existing profile if available
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/buyer/profile');
        if (res.data.success && res.data.data) {
          const profile = res.data.data;
          setFormData({
            businessType: profile.businessType || '',
            industry: profile.industry || '',
            budget: profile.budget || '',
            preferredFabrics: profile.preferredFabrics || [],
            orderQuantity: profile.orderQuantity || '',
            address: profile.address || { street: '', city: '', state: '', zipCode: '', country: '' },
          });
        }
      } catch (err) {
        // Profile doesn't exist yet, clean form
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleFabricToggle = (fabric) => {
    setFormData((prev) => {
      const exists = prev.preferredFabrics.includes(fabric);
      return {
        ...prev,
        preferredFabrics: exists
          ? prev.preferredFabrics.filter((f) => f !== fabric)
          : [...prev.preferredFabrics, fabric],
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

    if (!formData.businessType || !formData.industry || !formData.budget || !formData.orderQuantity) {
      setError('Please select Business Type, Industry, Budget Range, and Order Quantity');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await API.post('/buyer/profile', formData);
      if (res.data.success) {
        setSuccessMsg('Buyer onboarding details saved successfully!');
        setTimeout(() => {
          navigate('/buyer/dashboard');
        }, 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save buyer onboarding profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500 font-medium animate-pulse">Loading buyer profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          
          {/* Header */}
          <div className="bg-brand-600 p-6 sm:p-8 text-white">
            <div className="flex items-center space-x-3 mb-2">
              <Building2 className="w-8 h-8 text-brand-100" />
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Buyer Profile & Preferences</h1>
            </div>
            <p className="text-brand-100 text-sm">
              Complete your profile to receive tailored fabric recommendations and wholesale quotes.
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

            {/* Step 1: Business Type */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-3 flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-brand-600" />
                <span>1. What is your Business Type? *</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BUSINESS_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, businessType: type })}
                    className={`p-3 text-left rounded-xl border text-sm transition-all flex items-center justify-between ${
                      formData.businessType === type
                        ? 'border-brand-600 bg-brand-50/70 text-brand-800 font-semibold ring-1 ring-brand-600'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{type}</span>
                    {formData.businessType === type && <Check className="w-4 h-4 text-brand-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Industry */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-3 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-brand-600" />
                <span>2. Industry Category *</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind}
                    type="button"
                    onClick={() => setFormData({ ...formData, industry: ind })}
                    className={`p-3 text-left rounded-xl border text-sm transition-all flex items-center justify-between ${
                      formData.industry === ind
                        ? 'border-brand-600 bg-brand-50/70 text-brand-800 font-semibold ring-1 ring-brand-600'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{ind}</span>
                    {formData.industry === ind && <Check className="w-4 h-4 text-brand-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Budget Range */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-3 flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-brand-600" />
                <span>3. Monthly Purchasing Budget *</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BUDGET_RANGES.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setFormData({ ...formData, budget: b })}
                    className={`p-3 text-left rounded-xl border text-sm transition-all flex items-center justify-between ${
                      formData.budget === b
                        ? 'border-brand-600 bg-brand-50/70 text-brand-800 font-semibold ring-1 ring-brand-600'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{b}</span>
                    {formData.budget === b && <Check className="w-4 h-4 text-brand-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Preferred Fabrics */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-3 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-brand-600" />
                <span>4. Preferred Fabric Types (Select all that apply)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {FABRIC_OPTIONS.map((fabric) => {
                  const selected = formData.preferredFabrics.includes(fabric);
                  return (
                    <button
                      key={fabric}
                      type="button"
                      onClick={() => handleFabricToggle(fabric)}
                      className={`px-3 py-2 rounded-lg border text-sm transition-all flex items-center space-x-1.5 ${
                        selected
                          ? 'border-brand-600 bg-brand-600 text-white font-medium shadow-sm'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{fabric}</span>
                      {selected && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 5: Average Order Quantity */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-3 flex items-center space-x-2">
                <PackageCheck className="w-4 h-4 text-brand-600" />
                <span>5. Average Order Volume (MOQ Preference) *</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ORDER_QUANTITIES.map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setFormData({ ...formData, orderQuantity: qty })}
                    className={`p-3 text-left rounded-xl border text-sm transition-all flex items-center justify-between ${
                      formData.orderQuantity === qty
                        ? 'border-brand-600 bg-brand-50/70 text-brand-800 font-semibold ring-1 ring-brand-600'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{qty}</span>
                    {formData.orderQuantity === qty && <Check className="w-4 h-4 text-brand-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 6: Shipping Address (Optional) */}
            <div className="border-t border-slate-100 pt-6">
              <label className="block text-sm font-bold text-slate-800 mb-3 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-brand-600" />
                <span>6. Business Shipping Address (Optional)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    name="street"
                    value={formData.address.street}
                    onChange={handleAddressChange}
                    placeholder="Street Address"
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
                    placeholder="State / Province"
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

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center py-3 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm shadow-md transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  'Saving Profile...'
                ) : (
                  <>
                    <span>Complete Buyer Setup</span>
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

export default BuyerOnboarding;
