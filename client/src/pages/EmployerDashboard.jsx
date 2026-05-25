import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';
import api from '../services/api';
import { Star, Award, MessageSquare, Plus, PlusCircle, CheckSquare, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

const EmployerDashboard = () => {
  const { user } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Form States
  const [reviewOrderId, setReviewOrderId] = useState(null);
  const [reviewWorkerId, setReviewWorkerId] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const fetchDashboardData = async () => {
    try {
      const ordersRes = await api.get('/orders/my-orders');
      setOrders(ordersRes.data);

      const jobsRes = await api.get('/jobs/my-jobs');
      setJobs(jobsRes.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load dashboard parameters');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [user]);

  const handleHireProposal = async (jobId, proposal) => {
    try {
      const orderPayload = {
        job: jobId,
        worker: proposal.worker._id,
        price: proposal.bidAmount,
        requirements: `Hired via job proposal: "${proposal.coverLetter}"`
      };

      await api.post('/orders/create', orderPayload);
      toast.success(`🎉 Hired ${proposal.worker.name} successfully! Escrow funded.`);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create contract');
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.warning('Please enter a review description.');
      return;
    }

    try {
      await api.post('/reviews', {
        order: reviewOrderId,
        reviewee: reviewWorkerId,
        rating,
        comment
      });
      toast.success('🎉 Feedback submitted successfully!');
      setReviewOrderId(null);
      setComment('');
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const totalSpent = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.price, 0);

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12 flex-grow w-full">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-text-main flex items-center gap-2">
              Employer Dashboard <Sparkles size={24} className="text-primary animate-pulse" />
            </h1>
            <p className="text-text-muted mt-2 font-medium">Post rural tasks, review proposals, fund contracts and leave feedback.</p>
          </div>
          <button 
            onClick={() => navigate('/post-job')}
            className="btn-primary py-3.5 px-6 font-bold shadow-lg shadow-primary/20 flex items-center gap-2 text-sm rounded-xl"
          >
            <Plus size={18} /> {t('post_new_job')}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-text-muted text-xs font-bold uppercase tracking-wider mb-2">Total Spent</h3>
            <p className="text-3xl font-black text-primary">₹{totalSpent}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-text-muted text-xs font-bold uppercase tracking-wider mb-2">Jobs Posted</h3>
            <p className="text-3xl font-black text-blue-700">{jobs.length}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-text-muted text-xs font-bold uppercase tracking-wider mb-2">Active Escrow Contracts</h3>
            <p className="text-3xl font-black text-orange-600">{orders.filter(o => o.status === 'active').length}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-text-muted text-xs font-bold uppercase tracking-wider mb-2">Completed Work</h3>
            <p className="text-3xl font-black text-secondary">{orders.filter(o => o.status === 'completed').length}</p>
          </div>
        </div>

        {/* Dynamic Reviews Modal Trigger */}
        {reviewOrderId && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <form onSubmit={submitReview} className="bg-white max-w-md w-full p-8 rounded-3xl border shadow-2xl relative">
              <h3 className="text-2xl font-extrabold text-text-main mb-6">Leave Feedback & Review</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-bold text-text-main mb-2">Select Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      type="button" 
                      key={star} 
                      onClick={() => setRating(star)} 
                      className={`text-2xl transition-colors ${rating >= star ? 'text-yellow-400' : 'text-gray-200'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-text-main mb-2">Comments</label>
                <textarea 
                  className="input-field w-full h-28 resize-none p-3" 
                  placeholder="Describe your satisfaction with the worker's performance..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <button type="submit" className="flex-1 btn-primary py-3 font-bold rounded-xl">Submit Review</button>
                <button type="button" onClick={() => setReviewOrderId(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-text-main font-bold py-3 rounded-xl">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Dashboard Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contracts Section */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 border-b pb-4 text-text-main">
              Escrow Contracts & Orders
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-text-muted border-b border-gray-100 uppercase text-xs tracking-wider font-extrabold">
                    <th className="pb-4">Worker</th>
                    <th className="pb-4">Contract / Title</th>
                    <th className="pb-4 text-right">Price</th>
                    <th className="pb-4 text-center">Status</th>
                    <th className="pb-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map(order => (
                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 flex items-center">
                        <img 
                          src={order.worker?.avatar || `https://ui-avatars.com/api/?name=${order.worker?.name}`} 
                          className="w-9 h-9 rounded-xl mr-3 object-cover border" 
                          alt="" 
                        />
                        <span className="font-bold text-text-main text-sm">{order.worker?.name}</span>
                      </td>
                      <td className="py-4 text-sm text-text-muted font-semibold max-w-[200px] truncate">{order.gig?.title || order.job?.title}</td>
                      <td className="py-4 text-right font-extrabold text-sm text-text-main">₹{order.price}</td>
                      <td className="py-4 text-center">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider
                          ${order.status === 'active' ? 'bg-blue-50 text-blue-700' : 
                            order.status === 'completed' ? 'bg-green-50 text-primary' : 
                            'bg-yellow-50 text-yellow-700'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        {order.status === 'completed' && (
                          <button 
                            onClick={() => {
                              setReviewOrderId(order._id);
                              setReviewWorkerId(order.worker._id);
                            }}
                            className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md shadow-primary/10 transition-all"
                          >
                            Review Worker
                          </button>
                        )}
                        {order.status === 'active' && (
                          <span className="text-xs text-text-muted font-semibold">Active Escrow</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-12 text-text-muted font-bold">No active escrow orders.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Job Proposals Stream Section */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 border-b pb-4 text-text-main">
              Incoming Job Proposals
            </h2>
            
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
              {jobs.map(job => (
                <div key={job._id} className="space-y-4">
                  <h4 className="font-extrabold text-sm text-primary uppercase tracking-wide border-l-4 border-primary pl-2">{job.title}</h4>
                  
                  {job.proposals?.map((prop, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <img src={prop.worker?.avatar || `https://ui-avatars.com/api/?name=${prop.worker?.name}`} className="w-8 h-8 rounded-lg object-cover" alt="" />
                          <span className="font-bold text-xs text-text-main">{prop.worker?.name}</span>
                        </div>
                        <span className="font-extrabold text-xs text-primary">₹{prop.bidAmount}</span>
                      </div>
                      
                      <p className="text-xs text-text-muted mb-4 font-semibold line-clamp-2 leading-relaxed">"{prop.coverLetter}"</p>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleHireProposal(job._id, prop)}
                          className="flex-1 bg-primary hover:bg-primary-dark text-white text-[10px] font-bold py-2 rounded-xl transition-all"
                        >
                          Hire & Fund
                        </button>
                        <button 
                          onClick={() => navigate('/messages', { state: { startChatWith: prop.worker } })}
                          className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-text-main text-[10px] font-bold py-2 rounded-xl transition-all"
                        >
                          Chat
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {(!job.proposals || job.proposals.length === 0) && (
                    <p className="text-xs text-text-muted font-semibold pl-2">No proposals received yet.</p>
                  )}
                </div>
              ))}
              
              {jobs.length === 0 && (
                <p className="text-sm text-text-muted text-center py-6 font-semibold">Post a custom job to review worker proposals.</p>
              )}
            </div>
          </div>

        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EmployerDashboard;
