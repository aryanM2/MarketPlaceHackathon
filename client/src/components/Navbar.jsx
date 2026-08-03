import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layers, LogOut, User, Menu, X, ShoppingBag, LayoutDashboard, Building2 } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, isBuyer, isSupplier } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-2 bg-brand-600 text-white rounded-lg shadow-sm">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">TexTrade</span>
              <span className="hidden sm:inline-block text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium ml-2 border border-slate-200">
                B2B Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-slate-600 hover:text-brand-600 font-medium text-sm transition-colors">
              Marketplace
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to={isSupplier ? "/supplier/dashboard" : "/buyer/dashboard"}
                  className="text-slate-600 hover:text-brand-600 font-medium text-sm flex items-center space-x-1 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                {isSupplier && (
                  <>
                    <Link
                      to="/supplier/orders"
                      className="text-slate-600 hover:text-brand-600 font-medium text-sm flex items-center space-x-1 transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Orders</span>
                    </Link>
                    <Link
                      to="/supplier/inventory"
                      className="text-slate-600 hover:text-brand-600 font-medium text-sm flex items-center space-x-1 transition-colors"
                    >
                      <Layers className="w-4 h-4" />
                      <span>Inventory</span>
                    </Link>
                  </>
                )}

                <Link
                  to={isSupplier ? "/supplier/onboarding" : "/buyer/onboarding"}
                  className="text-slate-600 hover:text-brand-600 font-medium text-sm flex items-center space-x-1 transition-colors"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Setup Profile</span>
                </Link>

                {isBuyer && (
                  <Link
                    to="/cart"
                    className="text-slate-600 hover:text-brand-600 font-medium text-sm flex items-center space-x-1 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Cart</span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right Action Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                  <User className="w-4 h-4 text-slate-500" />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-800 block leading-none">{user.name}</span>
                    <span className="text-[10px] uppercase font-bold text-brand-600 tracking-wider">
                      {user.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-brand-600 px-3 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-lg shadow-sm transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-700 font-medium py-2 hover:text-brand-600"
          >
            Marketplace
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to={isSupplier ? "/supplier/dashboard" : "/buyer/dashboard"}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-700 font-medium py-2 hover:text-brand-600"
              >
                Dashboard
              </Link>
              <Link
                to={isSupplier ? "/supplier/onboarding" : "/buyer/onboarding"}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-700 font-medium py-2 hover:text-brand-600"
              >
                Setup Profile
              </Link>
              {isBuyer && (
                <Link
                  to="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-slate-700 font-medium py-2 hover:text-brand-600"
                >
                  Cart
                </Link>
              )}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800 text-sm">{user.name}</div>
                  <div className="text-xs uppercase text-brand-600 font-bold">{user.role}</div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-md"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center text-slate-700 font-semibold py-2 rounded-lg bg-slate-100"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center text-white font-medium py-2 rounded-lg bg-brand-600"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
