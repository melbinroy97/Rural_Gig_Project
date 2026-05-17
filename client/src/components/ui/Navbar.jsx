import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-card shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary">RuralConnect</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link to="/gigs" className="text-text-muted hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Find Talent</Link>
              <Link to="/gigs" className="text-text-muted hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Find Work</Link>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to={user?.role === 'worker' ? '/dashboard/worker' : '/dashboard/employer'} className="text-text-muted hover:text-primary font-medium">
                  Dashboard
                </Link>
                <Link to="/messages" className="text-text-muted hover:text-primary font-medium">
                  Messages
                </Link>
                <div className="relative ml-3">
                  <div className="flex items-center space-x-3 cursor-pointer">
                    <img className="h-8 w-8 rounded-full bg-gray-200" src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=2D6A4F&color=fff`} alt="" />
                    <span className="font-medium text-sm text-text-main">{user?.name}</span>
                    <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 font-medium">Logout</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-primary hover:text-primary-dark font-medium px-3 py-2">Log in</Link>
                <Link to="/register" className="btn-primary">Sign up</Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-text-muted hover:text-text-main focus:outline-none">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-card border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/gigs" className="block px-3 py-2 rounded-md text-base font-medium text-text-main hover:text-primary hover:bg-gray-50">Find Talent</Link>
            <Link to="/gigs" className="block px-3 py-2 rounded-md text-base font-medium text-text-main hover:text-primary hover:bg-gray-50">Find Work</Link>
            {isAuthenticated ? (
              <>
                <Link to={user?.role === 'worker' ? '/dashboard/worker' : '/dashboard/employer'} className="block px-3 py-2 rounded-md text-base font-medium text-text-main hover:text-primary hover:bg-gray-50">Dashboard</Link>
                <Link to="/messages" className="block px-3 py-2 rounded-md text-base font-medium text-text-main hover:text-primary hover:bg-gray-50">Messages</Link>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-50">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-text-main hover:text-primary hover:bg-gray-50">Log in</Link>
                <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-gray-50">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
