import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { MapPin, Star, MessageSquare, Briefcase, User, Calendar, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';

const WorkerProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);

  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [gigs, setGigs] = useState([]);
  const [activeTab, setActiveTab] = useState('gigs'); // gigs, reviews, about
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const profileRes = await api.get(`/users/profile/${id}`);
        setProfile(profileRes.data);

        const reviewsRes = await api.get(`/reviews/user/${id}`);
        setReviews(reviewsRes.data);

        // Fetch gigs matching this seller id
        const gigsRes = await api.get('/gigs', { params: { isActive: true } });
        // Filter gigs where seller id equals profile id
        const sellerGigs = gigsRes.data.gigs.filter(g => g.seller._id === id);
        setGigs(sellerGigs);
      } catch (error) {
        console.error('Failed to fetch profile statistics', error);
        toast.error('Failed to fetch profile statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [id]);

  const handleStartChat = async () => {
    if (!currentUser) {
      toast.warning('Please login to message workers.');
      return navigate('/login');
    }
    
    if (currentUser._id === id) {
      toast.error('You cannot message yourself!');
      return;
    }

    try {
      // Just send a dummy message to initialize the conversation or navigate directly
      // Messaging page will initialize it based on receiverId in state
      navigate('/messages', { state: { startChatWith: profile } });
    } catch (err) {
      console.error(err);
      toast.error('Failed to initialize messaging channel');
    }
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold">Worker profile not found</h2>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="max-w-7xl mx-auto w-full px-4 py-12 flex-grow">
        {/* Banner Section */}
        <div className="relative bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 mb-8">
          <div className="h-48 md:h-64 bg-gradient-to-r from-primary to-primary-dark"></div>
          
          <div className="relative px-6 pb-8 md:px-12 flex flex-col md:flex-row md:items-end md:space-x-8 -mt-20 md:-mt-24 z-10">
            <img 
              src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.name}&background=2D6A4F&color=fff&size=200`} 
              className="w-36 h-36 md:w-48 md:h-48 rounded-3xl border-4 border-white bg-white shadow-md object-cover" 
              alt={profile.name} 
            />
            
            <div className="flex-grow mt-6 md:mt-0 pb-2">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl md:text-4xl font-extrabold text-text-main">{profile.name}</h1>
                {profile.isVerified && (
                  <span className="bg-green-100 text-primary text-xs px-3 py-1 rounded-full font-black flex items-center gap-1">
                    <CheckCircle2 size={14} /> Verified
                  </span>
                )}
              </div>
              
              <p className="text-text-muted flex items-center mt-2 font-semibold">
                <MapPin size={18} className="mr-1 text-primary" />
                {profile.location?.village}, {profile.location?.district}, {profile.location?.state}
              </p>

              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-1">
                  <Star className="text-yellow-400 fill-current" size={18} />
                  <span className="font-bold text-text-main text-lg">{profile.rating}</span>
                  <span className="text-text-muted">({profile.totalReviews} reviews)</span>
                </div>
                <div className="flex items-center space-x-1 text-text-muted">
                  <Briefcase size={18} className="text-primary" />
                  <span className="font-bold">{gigs.length} Active Gigs</span>
                </div>
              </div>
            </div>

            <div className="mt-8 md:mt-0 flex gap-4 w-full md:w-auto">
              <button 
                onClick={handleStartChat} 
                className="btn-outline flex items-center justify-center flex-grow md:flex-grow-0 py-3 px-6 border-2 border-primary hover:bg-primary hover:text-white rounded-xl text-primary font-bold transition-all"
              >
                <MessageSquare size={18} className="mr-2" /> {t('message_worker')}
              </button>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-bold text-text-main mb-6 flex items-center gap-2 border-b pb-3">
                <User size={20} className="text-primary" /> Skills & Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills?.map((skill, idx) => (
                  <span key={idx} className="bg-green-50 text-primary border border-primary/10 px-4 py-2 rounded-2xl text-sm font-extrabold transition-all hover:bg-green-100/50">{skill}</span>
                ))}
                {(!profile.skills || profile.skills.length === 0) && (
                  <p className="text-text-muted text-sm">No skills added yet.</p>
                )}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-bold text-text-main mb-6 flex items-center gap-2 border-b pb-3">
                <Calendar size={20} className="text-primary" /> Bio & Overview
              </h3>
              <p className="text-text-muted leading-relaxed font-medium">
                {profile.bio || "No biography added yet. This worker is ready for rural gig assignments."}
              </p>
            </div>
          </div>

          {/* Right Main Panel */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
              {['gigs', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 text-center py-4 rounded-xl font-bold text-lg transition-all capitalize
                    ${activeTab === tab 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-text-muted hover:text-primary hover:bg-green-50/50'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="space-y-6">
              {activeTab === 'gigs' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {gigs.map((gig) => (
                    <motion.div 
                      key={gig._id}
                      onClick={() => navigate(`/gigs/${gig._id}`)}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300"
                    >
                      <div className="h-44 bg-gray-100 overflow-hidden relative">
                        <img 
                          src={gig.images?.[0] || 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          alt={gig.title} 
                        />
                        <span className="absolute top-4 right-4 bg-primary text-white text-xs px-3 py-1.5 rounded-full font-black uppercase tracking-wider">
                          {gig.category}
                        </span>
                      </div>
                      
                      <div className="p-6">
                        <h4 className="font-bold text-lg text-text-main group-hover:text-primary transition-colors line-clamp-2 mb-4">
                          {gig.title}
                        </h4>
                        
                        <div className="flex justify-between items-center border-t pt-4 border-gray-100">
                          <div className="flex items-center space-x-1 text-yellow-400">
                            <Star size={16} className="fill-current" />
                            <span className="text-text-main font-extrabold text-sm">{gig.rating}</span>
                          </div>
                          <p className="text-text-muted text-sm font-semibold">
                            Starting: <span className="text-primary font-black text-lg">₹{gig.packages?.[0]?.price}</span>
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {gigs.length === 0 && (
                    <div className="col-span-2 text-center py-16 bg-white rounded-3xl border border-gray-100">
                      <p className="text-text-muted font-semibold text-lg">No active gigs listed at the moment.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {reviews.map((rev) => (
                    <div key={rev._id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6">
                      <img 
                        src={rev.reviewer?.avatar || `https://ui-avatars.com/api/?name=${rev.reviewer?.name}`} 
                        className="w-12 h-12 rounded-2xl object-cover bg-gray-200 border border-gray-100 flex-shrink-0" 
                        alt="" 
                      />
                      
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-bold text-lg text-text-main">{rev.reviewer?.name}</h5>
                            <p className="text-text-muted text-xs font-semibold uppercase mt-0.5">{rev.reviewer?.location?.village || 'Employer'}</p>
                          </div>
                          <div className="flex items-center space-x-1 text-yellow-400">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} size={16} className="fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="mt-4 text-text-muted leading-relaxed font-medium">{rev.comment}</p>
                      </div>
                    </div>
                  ))}
                  {reviews.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
                      <p className="text-text-muted font-semibold text-lg">No reviews yet for this worker profile.</p>
                    </div>
                  )}
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

export default WorkerProfilePage;
