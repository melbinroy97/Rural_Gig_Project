import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Star, CheckCircle, TrendingUp, DollarSign, ListOrdered, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';

const data = [
  { name: 'Jan', earnings: 4000 },
  { name: 'Feb', earnings: 6000 },
  { name: 'Mar', earnings: 9000 },
  { name: 'Apr', earnings: 14000 },
  { name: 'May', earnings: 19000 },
  { name: 'Jun', earnings: 26000 },
];

const WorkerDashboard = () => {
  const { user } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/my-orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load orders stream');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user]);

  const handleMarkAsCompleted = async (orderId) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: 'completed' });
      toast.success('🎉 Order successfully marked as completed!');
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update order status');
    }
  };

  const completedOrders = orders.filter(o => o.status === 'completed');
  const activeOrders = orders.filter(o => o.status === 'active');
  const totalEarnings = completedOrders.reduce((sum, o) => sum + o.price, 0);

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
        {/* Welcome Section */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-extrabold text-text-main">
              Ram Ram, <span className="text-primary">{user?.name}</span>!
            </h1>
            <p className="text-text-muted mt-2 font-medium">Welcome to your RuralConnect control center. Review active contracts and manage earnings.</p>
          </div>
          <div className="bg-green-50/50 border border-green-100/30 rounded-2xl p-4 flex items-center space-x-3">
            <CheckCircle className="text-primary" size={24} />
            <div>
              <p className="text-xs text-text-muted font-bold uppercase">Profile Standing</p>
              <p className="text-sm font-black text-text-main">Verified Worker Badge</p>
            </div>
          </div>
        </div>
        
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-primary flex items-center justify-center mb-4">
              <DollarSign size={20} />
            </div>
            <h3 className="text-text-muted text-xs font-bold uppercase tracking-wider mb-2">{t('earnings')}</h3>
            <p className="text-3xl font-black text-primary">₹{totalEarnings || '0'}</p>
          </div>
          
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <ListOrdered size={20} />
            </div>
            <h3 className="text-text-muted text-xs font-bold uppercase tracking-wider mb-2">Active Contracts</h3>
            <p className="text-3xl font-black text-blue-700">{activeOrders.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Star size={20} />
            </div>
            <h3 className="text-text-muted text-xs font-bold uppercase tracking-wider mb-2">Average Rating</h3>
            <p className="text-3xl font-black text-purple-700">{user?.rating || '4.8'}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-accent flex items-center justify-center mb-4">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-text-muted text-xs font-bold uppercase tracking-wider mb-2">Completed Gigs</h3>
            <p className="text-3xl font-black text-accent">{completedOrders.length}</p>
          </div>
        </div>

        {/* Charts & Contracts Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contracts Table */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 border-b pb-4 text-text-main flex items-center gap-2">
              <Calendar className="text-primary" /> Active Orders & Contracts
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-text-muted border-b border-gray-100 uppercase text-xs tracking-wider font-extrabold">
                    <th className="pb-4">Client</th>
                    <th className="pb-4">Contract / Title</th>
                    <th className="pb-4 text-right">Escrow Amount</th>
                    <th className="pb-4 text-center">Status</th>
                    <th className="pb-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map(order => (
                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 flex items-center">
                        <img 
                          src={order.employer?.avatar || `https://ui-avatars.com/api/?name=${order.employer?.name}`} 
                          className="w-9 h-9 rounded-xl mr-3 object-cover border" 
                          alt="" 
                        />
                        <span className="font-bold text-text-main text-sm">{order.employer?.name}</span>
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
                        {order.status === 'active' && (
                          <button 
                            onClick={() => handleMarkAsCompleted(order._id)}
                            className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md shadow-primary/10 transition-all"
                          >
                            Mark Complete
                          </button>
                        )}
                        {order.status === 'completed' && (
                          <span className="text-xs text-text-muted font-bold">Closed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-12 text-text-muted font-bold">No rural contracts found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Earnings Analytics Card */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-text-main">Performance Trends</h2>
              <p className="text-xs text-text-muted font-semibold mb-6">Visual overview of your accumulated contract values.</p>
            </div>
            
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs font-bold text-text-muted" />
                  <YAxis axisLine={false} tickLine={false} className="text-xs font-bold text-text-muted" />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }} />
                  <Line type="monotone" dataKey="earnings" stroke="#2D6A4F" strokeWidth={4} dot={{ r: 4, stroke: '#2D6A4F', strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default WorkerDashboard;
