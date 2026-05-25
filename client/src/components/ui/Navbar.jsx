import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LanguageContext } from '../../context/LanguageContext';
import { Menu, X, Globe } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { language, setLanguage, t } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showLang, setShowLang] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-card shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-extrabold text-primary tracking-tight">Rural<span className="text-secondary">Connect</span></span>
            </Link>
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              <Link to="/gigs" className="text-text-muted hover:text-primary px-3 py-2 rounded-md text-sm font-semibold transition-colors">{t('find_talent')}</Link>
              <Link to="/gigs" className="text-text-muted hover:text-primary px-3 py-2 rounded-md text-sm font-semibold transition-colors">{t('find_work')}</Link>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setShowLang(!showLang)} 
                className="flex items-center space-x-2 text-text-muted hover:text-primary font-semibold text-sm focus:outline-none"
              >
                <Globe size={18} />
                <span className="uppercase">{language}</span>
              </button>
              {showLang && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                  <button onClick={() => { setLanguage('en'); setShowLang(false); }} className="w-full text-left px-4 py-2 text-sm text-text-main hover:bg-green-50 font-medium">English</button>
                  <button onClick={() => { setLanguage('hi'); setShowLang(false); }} className="w-full text-left px-4 py-2 text-sm text-text-main hover:bg-green-50 font-medium">हिन्दी</button>
                  <button onClick={() => { setLanguage('pa'); setShowLang(false); }} className="w-full text-left px-4 py-2 text-sm text-text-main hover:bg-green-50 font-medium">ਪੰਜਾਬੀ</button>
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <>
                <Link to={user?.role === 'worker' ? '/dashboard/worker' : '/dashboard/employer'} className="text-text-muted hover:text-primary font-semibold text-sm transition-colors">
                  {t('dashboard')}
                </Link>
                <Link to="/messages" className="text-text-muted hover:text-primary font-semibold text-sm transition-colors">
                  {t('messages')}
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-red-600 hover:text-red-700 font-semibold text-sm transition-colors">
                    Admin
                  </Link>
                )}
                <div className="flex items-center space-x-3 border-l pl-6 border-gray-200">
                  <Link to={`/profile/${user?._id}`}>
                    <img className="h-8 w-8 rounded-full bg-gray-200 border border-primary/20 hover:scale-105 transition-transform" src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=2D6A4F&color=fff`} alt="" />
                  </Link>
                  <span className="font-semibold text-sm text-text-main">{user?.name}</span>
                  <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 font-bold transition-colors">{t('logout')}</button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-primary hover:text-primary-dark font-bold text-sm px-3 py-2 transition-colors">{t('login')}</Link>
                <Link to="/register" className="btn-primary py-2 px-5 text-sm">{t('signup')}</Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden space-x-4">
            {/* Language toggle for mobile */}
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent border-0 font-semibold text-sm text-text-muted outline-none uppercase"
            >
              <option value="en">EN</option>
              <option value="hi">HI</option>
              <option value="pa">PA</option>
            </select>

            <button onClick={() => setIsOpen(!isOpen)} className="text-text-muted hover:text-text-main focus:outline-none">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-card border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/gigs" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-semibold text-text-main hover:text-primary hover:bg-gray-50">{t('find_talent')}</Link>
            <Link to="/gigs" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-semibold text-text-main hover:text-primary hover:bg-gray-50">{t('find_work')}</Link>
            {isAuthenticated ? (
              <>
                <Link to={user?.role === 'worker' ? '/dashboard/worker' : '/dashboard/employer'} onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-semibold text-text-main hover:text-primary hover:bg-gray-50">{t('dashboard')}</Link>
                <Link to="/messages" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-semibold text-text-main hover:text-primary hover:bg-gray-50">{t('messages')}</Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-semibold text-red-600 hover:bg-red-50">Admin</Link>
                )}
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-bold text-red-500 hover:bg-red-50">{t('logout')}</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-semibold text-text-main hover:text-primary hover:bg-gray-50">{t('login')}</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-bold text-primary hover:bg-gray-50">{t('signup')}</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
