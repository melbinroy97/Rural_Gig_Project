import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';
import GigCard from '../components/ui/GigCard';
import { Search, Filter, LayoutGrid, List } from 'lucide-react';

const GigListingPage = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: initialCategory, keyword: '' });
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  const fetchGigs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/gigs', { params: filters });
      setGigs(res.data.gigs);
    } catch (error) {
      console.error('Error fetching gigs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGigs();
  }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchGigs();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Top Search Bar */}
      <div className="bg-primary pt-10 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">Find the perfect rural talent</h1>
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative flex">
            <input 
              type="text" 
              placeholder="What service are you looking for today?" 
              className="w-full px-6 py-4 rounded-l-lg focus:outline-none text-lg"
              value={filters.keyword}
              onChange={(e) => setFilters({...filters, keyword: e.target.value})}
            />
            <button type="submit" className="bg-accent text-white px-8 rounded-r-lg font-bold text-lg hover:bg-orange-500 transition-colors flex items-center">
              <Search className="mr-2" /> Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 w-full flex-grow pb-16">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-4">
            <span className="font-semibold text-text-main">{gigs.length} services available</span>
          </div>
          
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <select 
              className="input-field py-2"
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
            >
              <option value="">All Categories</option>
              <option value="Farming">Farming</option>
              <option value="Carpentry">Carpentry</option>
              <option value="Tailoring">Tailoring</option>
              <option value="Plumbing">Plumbing</option>
            </select>
            
            <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-text-main'}`}
              >
                <LayoutGrid size={20} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-text-main'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-6 hidden md:block">
            <div>
              <h3 className="font-bold text-text-main flex items-center mb-4 pb-2 border-b">
                <Filter size={18} className="mr-2 text-primary" /> Filter Results
              </h3>
            </div>
            
            <div>
              <h4 className="font-semibold text-text-main mb-3">Delivery Time</h4>
              <div className="space-y-2">
                {['Express (24h)', 'Up to 3 days', 'Up to 7 days', 'Anytime'].map((t, i) => (
                  <label key={i} className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" name="delivery" className="text-primary focus:ring-primary h-4 w-4" />
                    <span className="text-sm text-text-muted">{t}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-text-main mb-3">Price Range</h4>
              <input type="range" className="w-full accent-primary" />
              <div className="flex justify-between text-xs text-text-muted mt-2">
                <span>₹0</span>
                <span>₹10,000+</span>
              </div>
            </div>
          </div>

          {/* Gig Grid */}
          <div className="flex-grow">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-80 animate-pulse">
                    <div className="bg-gray-200 h-40 rounded-lg mb-4 w-full"></div>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
                  </div>
                ))}
              </div>
            ) : gigs.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-text-main">No gigs found</h3>
                <p className="text-text-muted mt-2">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {gigs.map((gig) => (
                  <GigCard key={gig._id} gig={gig} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default GigListingPage;
