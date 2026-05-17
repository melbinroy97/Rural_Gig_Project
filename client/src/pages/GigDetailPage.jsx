import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';
import { Star, Clock, Check, ChevronDown, MessageCircle } from 'lucide-react';

const GigDetailPage = () => {
  const { id } = useParams();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(0);

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const res = await api.get(`/gigs/${id}`);
        setGig(res.data);
      } catch (error) {
        console.error('Error fetching gig details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGig();
  }, [id]);

  if (loading) return <div className="min-h-screen pt-20 text-center">Loading...</div>;
  if (!gig) return <div className="min-h-screen pt-20 text-center">Gig not found.</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex flex-col lg:flex-row gap-10">
        {/* Left Column - 70% */}
        <div className="w-full lg:w-2/3 space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center text-sm text-primary font-semibold mb-4 bg-green-50 w-max px-3 py-1 rounded-full">
              {gig.category}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-text-main leading-tight mb-6">{gig.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-gray-100">
              <Link to={`/profile/${gig.seller?._id}`} className="flex items-center group">
                <img src={gig.seller?.avatar || `https://ui-avatars.com/api/?name=${gig.seller?.name}&background=2D6A4F&color=fff`} className="w-12 h-12 rounded-full mr-3" alt="" />
                <div>
                  <p className="font-bold text-text-main group-hover:text-primary transition-colors">{gig.seller?.name}</p>
                  <p className="text-sm text-text-muted">{gig.seller?.location?.village || 'Unknown location'}</p>
                </div>
              </Link>
              <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
              <div className="flex items-center text-accent">
                <Star fill="currentColor" size={20} className="mr-1" />
                <span className="font-bold text-lg text-text-main">{gig.rating?.toFixed(1) || '5.0'}</span>
                <span className="text-text-muted ml-1">({gig.totalOrders} reviews)</span>
              </div>
            </div>

            {/* Images Gallery */}
            <div className="mb-8 rounded-xl overflow-hidden bg-gray-100 aspect-video relative">
              {gig.images && gig.images.length > 0 ? (
                <img src={gig.images[0]} alt="Gig Image" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-text-muted">No Image Available</div>
              )}
            </div>

            <h2 className="text-2xl font-bold text-text-main mb-4">About This Gig</h2>
            <div className="prose max-w-none text-text-muted">
              {gig.description.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - 30% */}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-24">
            <div className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden">
              
              {/* Package Selector */}
              <div className="flex border-b border-gray-100 bg-gray-50">
                {gig.packages?.map((pkg, idx) => (
                  <button 
                    key={idx}
                    className={`flex-1 py-4 font-bold text-center transition-colors ${selectedPackage === idx ? 'bg-white text-primary border-t-2 border-primary border-b-0 -mb-px' : 'text-text-muted hover:bg-gray-100'}`}
                    onClick={() => setSelectedPackage(idx)}
                  >
                    {pkg.name}
                  </button>
                ))}
              </div>

              {gig.packages && gig.packages.length > 0 && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl text-text-main">{gig.packages[selectedPackage].name} Package</h3>
                    <span className="text-3xl font-bold text-text-main">₹{gig.packages[selectedPackage].price}</span>
                  </div>
                  
                  <p className="text-text-muted mb-6 text-sm">Includes everything needed to get the job done right.</p>
                  
                  <div className="flex items-center font-semibold text-text-main mb-6 bg-gray-50 px-4 py-3 rounded-lg border border-gray-100">
                    <Clock size={18} className="mr-2 text-primary" />
                    {gig.packages[selectedPackage].deliveryDays} Days Delivery
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {gig.packages[selectedPackage].features?.map((feature, i) => (
                      <li key={i} className="flex items-start text-sm text-text-muted">
                        <Check size={18} className="text-secondary mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button className="w-full btn-primary py-4 text-lg font-bold shadow-lg shadow-primary/30 mb-4 hover:shadow-primary/50 transition-all">
                    Continue (₹{gig.packages[selectedPackage].price})
                  </button>
                  <button className="w-full btn-outline flex items-center justify-center py-3 font-semibold">
                    <MessageCircle size={18} className="mr-2" /> Contact Seller
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default GigDetailPage;
