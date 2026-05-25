import React, { useEffect, useState } from 'react';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';
import api from '../services/api';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShieldCheck, UserMinus, ShieldAlert, Award, Sparkles, TrendingUp } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const usersRes = await api.get('/users');
      setUsers(usersRes.data);

      const ordersRes = await api.get('/orders');
      setOrders(ordersRes.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load admin parameters');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleVerification = async (userId) => {
    try {
      await api.put(`/users/${userId}/suspend`);
      toast.success('🎉 User standing updated successfully!');
      fetchAdminData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update user standing');
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

  // Aggregate stats
  const totalVolume = orders.reduce((sum, o) => sum + o.price, 0);
  const activeEscrow = orders.filter(o => o.status === 'active').reduce((sum, o) => sum + o.price, 0);
  
  // Recharts aggregates
  const chartData = [
    { name: 'Total Users', count: users.length, fill: '#2D6A4F' },
    { name: 'Total Orders', count: orders.length, fill: '#FF9F1C' },
    { name: 'Completed Orders', count: orders.filter(o => o.status === 'completed').length, fill: '#4CAF50' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12 flex-grow w-full">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-text-main flex items-center gap-2">
            SuperAdmin Platform Console <ShieldCheck size={32} className="text-primary" />
          </h1>
          <p className="text-text-muted mt-2 font-medium">Verify profiles, review global transactions, and inspect platform health.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-text-muted text-xs font-bold uppercase tracking-wider mb-2">Global Transacted Volume</h3>
            <p className="text-3xl font-black text-primary">₹{totalVolume}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-text-muted text-xs font-bold uppercase tracking-wider mb-2">Escrow Funds Locked</h3>
            <p className="text-3xl font-black text-orange-600">₹{activeEscrow}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-text-muted text-xs font-bold uppercase tracking-wider mb-2">Platform Users</h3>
            <p className="text-3xl font-black text-blue-700">{users.length}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-text-muted text-xs font-bold uppercase tracking-wider mb-2">Total Orders Placed</h3>
            <p className="text-3xl font-black text-secondary">{orders.length}</p>
          </div>
        </div>

        {/* Visual Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Bar Chart Overview */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-text-main">Platform Performance Metrics</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs font-bold text-text-muted" />
                  <YAxis axisLine={false} tickLine={false} className="text-xs font-bold text-text-muted" />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="count" radius={[12, 12, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Platform Health Quick Checklist */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-text-main flex items-center gap-2">
                System Status <Sparkles className="text-primary animate-pulse" />
              </h2>
              <p className="text-xs text-text-muted font-semibold mb-6">Database, connections and socket services are fully operational.</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-green-50 border border-green-100/30 text-primary font-bold text-sm">
                <span>Escrow Contracts Engine</span>
                <span className="bg-primary text-white text-[9px] px-2.5 py-1 rounded-full font-black uppercase">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-green-50 border border-green-100/30 text-primary font-bold text-sm">
                <span>Socket real-time channels</span>
                <span className="bg-primary text-white text-[9px] px-2.5 py-1 rounded-full font-black uppercase">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Moderations Table */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 border-b pb-4 text-text-main flex items-center gap-2">
            User Standings & Verification Moderation
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-text-muted border-b border-gray-100 uppercase text-xs tracking-wider font-extrabold">
                  <th className="pb-4">User</th>
                  <th className="pb-4">Email</th>
                  <th className="pb-4">Role</th>
                  <th className="pb-4">Location</th>
                  <th className="pb-4 text-center">Standing</th>
                  <th className="pb-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 flex items-center">
                      <img 
                        src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}`} 
                        className="w-9 h-9 rounded-xl mr-3 object-cover border" 
                        alt="" 
                      />
                      <span className="font-bold text-text-main text-sm">{u.name}</span>
                    </td>
                    <td className="py-4 text-sm text-text-muted font-semibold">{u.email}</td>
                    <td className="py-4 text-sm text-text-main font-bold capitalize">{u.role}</td>
                    <td className="py-4 text-sm text-text-muted font-semibold">{u.location?.village}, {u.location?.state}</td>
                    <td className="py-4 text-center">
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider
                        ${u.isVerified ? 'bg-green-50 text-primary' : 'bg-red-50 text-red-600'}`}>
                        {u.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td className="py-4 text-center">
                      <button 
                        onClick={() => handleToggleVerification(u._id)}
                        className={`text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1 mx-auto
                          ${u.isVerified 
                            ? 'bg-red-50 text-red-600 hover:bg-red-100/50' 
                            : 'bg-green-50 text-primary hover:bg-green-100/50'}`}
                      >
                        {u.isVerified ? (
                          <>
                            <ShieldAlert size={14} /> Revoke
                          </>
                        ) : (
                          <>
                            <Award size={14} /> Verify
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminPanel;
