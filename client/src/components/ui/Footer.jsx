import React from 'react';
import { Link } from 'react-router-dom';
import { Share2, MessageCircle, Camera, Briefcase } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <span className="text-2xl font-bold text-primary">RuralConnect</span>
            <p className="mt-4 text-sm text-text-muted">
              Empowering rural talent by connecting them with opportunities globally.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary">
                <Share2 size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <MessageCircle size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <Camera size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <Briefcase size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-text-main tracking-wider uppercase">For Clients</h3>
            <ul className="mt-4 space-y-4">
              <li><Link to="/gigs" className="text-sm text-text-muted hover:text-primary">Find Talent</Link></li>
              <li><Link to="/post-job" className="text-sm text-text-muted hover:text-primary">Post a Job</Link></li>
              <li><Link to="/" className="text-sm text-text-muted hover:text-primary">How it works</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-text-main tracking-wider uppercase">For Talent</h3>
            <ul className="mt-4 space-y-4">
              <li><Link to="/gigs" className="text-sm text-text-muted hover:text-primary">Find Work</Link></li>
              <li><Link to="/register" className="text-sm text-text-muted hover:text-primary">Create Profile</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text-main tracking-wider uppercase">Subscribe</h3>
            <p className="mt-4 text-sm text-text-muted">
              Get the latest updates and job alerts.
            </p>
            <form className="mt-4 flex">
              <input type="email" placeholder="Email address" className="min-w-0 flex-auto rounded-l-md border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              <button type="button" className="inline-flex justify-center rounded-r-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-8 flex items-center justify-between">
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} RuralConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
