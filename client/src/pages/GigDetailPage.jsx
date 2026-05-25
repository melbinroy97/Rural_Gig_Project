import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { Star, Clock, Check, MessageCircle, ShoppingBag, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';

const GigDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);

  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchGigDetails = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/gigs/${id}`);
        setGig(res.data);

        // Fetch reviews for this worker
        const reviewsRes = await api.get(`/reviews/user/${res.data.seller._id}`);
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error('Error fetching gig details:', error);
        toast.error('Failed to load gig details');
      } finally {
        setLoading(false);
      }
    };
    fetchGigDetails();
  }, [id]);

  const handleCreateOrder = async () => {
    if (!currentUser) {
      toast.warning('Please log in to purchase services!');
      return navigate('/login');
    }

    if (currentUser._id === gig.seller._id) {
      toast.error('You cannot purchase your own gig!');
      return;
    }

    const currentPkg = gig.packages[selectedPackage];

    try {
      const orderPayload = {
        gig: gig._id,
        worker: gig.seller._id,
        package: {
          name: currentPkg.name,
          price: currentPkg.price,
          deliveryDays: currentPkg.deliveryDays,
          features: currentPkg.features
        },
        price: currentPkg.price,
        requirements: `Purchased ${currentPkg.name} package from RuralConnect listing.`
      };

      await api.post('/orders/create', orderPayload);
      toast.success('🎉 Contract created successfully! Redirecting...');
      navigate('/dashboard/employer');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to place order.');
    }
  };

  const handleContactSeller = () => {
    if (!currentUser) {
      toast.warning('Please log in to contact the worker!');
      return navigate('/login');
    }
    navigate('/messages', { state: { startChatWith: gig.seller } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold">Gig details not found</h2>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-grow flex flex-col lg:flex-row gap-10">
        {/* Left Column */}
        <div className="w-full lg:w-2/3 space-y-8">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <span className="inline-flex items-center text-sm text-primary font-bold bg-green-50 px-4 py-2 rounded-2xl mb-6">
              {gig.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-text-main leading-tight mb-6">{gig.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-100">
              <Link to={`/profile/${gig.seller?._id}`} className="flex items-center group">
                <img src={gig.seller?.avatar || `https://ui-avatars.com/api/?name=${gig.seller?.name}`} className="w-12 h-12 rounded-full mr-3 object-cover border" alt="" />
                <div>
                  <p className="font-bold text-text-main group-hover:text-primary transition-colors">{gig.seller?.name}</p>
                  <p className="text-xs text-text-muted font-bold tracking-wide uppercase mt-0.5">{gig.seller?.location?.village}, {gig.seller?.location?.state}</p>
                </div>
              </Link>
              <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
              <div className="flex items-center text-yellow-400">
                <Star fill="currentColor" size={20} className="mr-1" />
                <span className="font-extrabold text-lg text-text-main">{gig.rating?.toFixed(1)}</span>
                <span className="text-text-muted ml-1">({gig.totalOrders} total orders)</span>
              </div>
            </div>

            {/* Showcase Image */}
            <div className="mb-8 rounded-3xl overflow-hidden bg-gray-100 aspect-video relative border border-gray-100">
              <img src={gig.images?.[0] || 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'} alt="" className="absolute inset-0 w-full h-full object-cover" />
            </div>

            <h2 className="text-2xl font-bold text-text-main mb-4">About This Gig</h2>
            <div className="prose max-w-none text-text-muted leading-relaxed font-medium">
              {gig.description?.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Client Reviews Section */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-text-main mb-6">Recent Reviews ({reviews.length})</h2>
            <div className="space-y-6">
              {reviews.map((rev) => (
                <div key={rev._id} className="border-b last:border-b-0 pb-6 last:pb-0 flex flex-col md:flex-row gap-4">
                  <img src={rev.reviewer?.avatar || `https://ui-avatars.com/api/?name=${rev.reviewer?.name}`} className="w-10 h-10 rounded-xl bg-gray-100 flex-shrink-0" alt="" />
                  <div>
                    <div className="flex justify-between items-start md:w-[500px]">
                      <div>
                        <h4 className="font-bold text-text-main">{rev.reviewer?.name}</h4>
                        <p className="text-text-muted text-xs font-bold uppercase">{rev.reviewer?.location?.village}</p>
                      </div>
                      <div className="flex items-center space-x-0.5 text-yellow-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={14} className="fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-text-muted mt-3 font-semibold leading-relaxed">{rev.comment}</p>
                  </div>
                </div>
              ))}
              {reviews.length === 0 && (
                <p className="text-text-muted text-center py-6">No reviews available for this gig yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column Package Tiers */}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-card overflow-hidden">
              
              {/* Tabs */}
              <div className="flex border-b border-gray-100 bg-gray-50/50 p-2">
                {gig.packages?.map((pkg, idx) => (
                  <button 
                    key={idx}
                    className={`flex-1 py-3 font-bold text-center rounded-xl transition-all ${selectedPackage === idx ? 'bg-white text-primary shadow-sm' : 'text-text-muted hover:bg-gray-100'}`}
                    onClick={() => setSelectedPackage(idx)}
                  >
                    {pkg.name}
                  </button>
                ))}
              </div>

              {gig.packages && gig.packages.length > 0 && (
                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-extrabold text-xl text-text-main">{gig.packages[selectedPackage].name} Package</h3>
                    <span className="text-3xl font-black text-text-main">₹{gig.packages[selectedPackage].price}</span>
                  </div>
                  
                  <p className="text-text-muted mb-6 text-sm font-semibold">Ready to book this verified rural package? Includes all services mentioned below.</p>
                  
                  <div className="flex items-center font-bold text-text-main mb-6 bg-green-50/50 px-4 py-3 rounded-2xl border border-green-100/30">
                    <Clock size={18} className="mr-2 text-primary" />
                    {gig.packages[selectedPackage].deliveryDays} Days Delivery
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {gig.packages[selectedPackage].features?.map((feature, i) => (
                      <li key={i} className="flex items-start text-sm text-text-muted font-semibold">
                        <Check size={18} className="text-secondary mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button 
                    onClick={handleCreateOrder}
                    className="w-full btn-primary py-4 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all rounded-xl mb-4"
                  >
                    <ShoppingBag size={18} className="inline mr-2" /> Book Package (₹{gig.packages[selectedPackage].price})
                  </button>
                  
                  <button 
                    onClick={handleContactSeller}
                    className="w-full btn-outline flex items-center justify-center py-3 border-2 border-primary hover:bg-primary hover:text-white rounded-xl text-primary font-bold transition-all"
                  >
                    <MessageCircle size={18} className="mr-2" /> Contact Seller
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 p-6 flex items-start space-x-3 shadow-sm">
              <ShieldCheck className="text-primary flex-shrink-0 mt-0.5" size={24} />
              <div>
                <h5 className="font-bold text-text-main text-sm">RuralConnect Safety Pledge</h5>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">Payments are locked in escrow and only released to the worker once you approve final project deliveries.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default GigDetailPage;
