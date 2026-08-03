import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import BuyerOnboarding from './pages/BuyerOnboarding';
import SupplierOnboarding from './pages/SupplierOnboarding';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';



// Buyer Dashboard Placeholder
const BuyerDashboardPlaceholder = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800">Buyer Dashboard</h2>
      <p className="text-slate-500 text-sm mt-1">Welcome Buyer! (Module 9 will expand this dashboard)</p>
    </div>
  </div>
);

// Supplier Dashboard Placeholder
const SupplierDashboardPlaceholder = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800">Supplier Dashboard</h2>
      <p className="text-slate-500 text-sm mt-1">Welcome Supplier! (Module 10 will expand this dashboard)</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Marketplace />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Buyer Routes */}
              <Route element={<ProtectedRoute allowedRoles={['buyer']} />}>
                <Route path="/buyer/dashboard" element={<BuyerDashboardPlaceholder />} />
                <Route path="/buyer/onboarding" element={<BuyerOnboarding />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
              </Route>

              {/* Protected Supplier Routes */}
              <Route element={<ProtectedRoute allowedRoles={['supplier']} />}>
                <Route path="/supplier/dashboard" element={<SupplierDashboardPlaceholder />} />
                <Route path="/supplier/onboarding" element={<SupplierOnboarding />} />
              </Route>

              {/* Catch-all redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
