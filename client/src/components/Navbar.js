import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-primary-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center" onClick={closeMenu}>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <div>
                  <span className="text-2xl font-bold text-primary-600">Fitness</span>
                  <span className="text-2xl font-bold text-secondary-600">MA</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/coaches" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              {t('nav.browseCoaches')}
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                  {t('nav.dashboard')}
                </Link>
                <Link to="/my-appointments" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                  {t('nav.myAppointments')}
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                    {t('nav.adminPanel')}
                  </Link>
                )}

                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <User size={16} className="text-primary-600" />
                    </div>
                    <span className="font-medium">{user.firstName}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                    >
                      <LogOut size={16} />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="btn-primary">
                  {t('nav.signUp')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/coaches"
              className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium"
              onClick={closeMenu}
            >
              {t('nav.browseCoaches')}
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium"
                  onClick={closeMenu}
                >
                  {t('nav.dashboard')}
                </Link>
                <Link
                  to="/my-appointments"
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium"
                  onClick={closeMenu}
                >
                  {t('nav.myAppointments')}
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium"
                    onClick={closeMenu}
                  >
                    {t('nav.adminPanel')}
                  </Link>
                )}
                
                <div className="border-t border-gray-200 pt-2">
                  <div className="px-3 py-2 text-sm text-gray-600">
                    {t('nav.signedInAs')} {user.firstName}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors w-full text-left"
                  >
                    <LogOut size={16} />
                    <span>{t('nav.logout')}</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium"
                  onClick={closeMenu}
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  onClick={closeMenu}
                >
                  {t('nav.signUp')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 