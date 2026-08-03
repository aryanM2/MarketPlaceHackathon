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
import BuyerDashboard from './pages/BuyerDashboard';
import SupplierDashboard from './pages/SupplierDashboard';
import InventoryManagement from './pages/InventoryManagement';
import SupplierOrders from './pages/SupplierOrders';
import SupplierProfileView from './pages/SupplierProfileView';
import AIChatWidget from './components/AIChatWidget';







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
                <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
                <Route path="/buyer/onboarding" element={<BuyerOnboarding />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
              </Route>

              {/* Protected Supplier Routes */}
              <Route element={<ProtectedRoute allowedRoles={['supplier']} />}>
                <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
                <Route path="/supplier/orders" element={<SupplierOrders />} />
                <Route path="/supplier/inventory" element={<InventoryManagement />} />
                <Route path="/supplier/profile" element={<SupplierProfileView />} />
                <Route path="/supplier/onboarding" element={<SupplierOnboarding />} />
              </Route>

              {/* Catch-all redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <AIChatWidget />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
