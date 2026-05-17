import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/ui/Navbar';
import api from '../services/api';

const EmployerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // In a real app, we'd fetch actual jobs posted by the employer.
    // For now, let's just fetch orders.
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
           <h1 className="text-3xl font-bold">Employer Dashboard</h1>
           <a href="/post-job" className="btn-primary">Post New Job</a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="text-text-muted text-sm font-semibold uppercase tracking-wider mb-2">Total Spent</h3>
             <p className="text-3xl font-bold text-primary">₹12,450</p>
           </div>
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="text-text-muted text-sm font-semibold uppercase tracking-wider mb-2">Jobs Posted</h3>
             <p className="text-3xl font-bold text-text-main">{jobs.length || 0}</p>
           </div>
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="text-text-muted text-sm font-semibold uppercase tracking-wider mb-2">Active Contracts</h3>
             <p className="text-3xl font-bold text-accent">{orders.filter(o => o.status === 'active').length || 0}</p>
           </div>
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="text-text-muted text-sm font-semibold uppercase tracking-wider mb-2">Proposals Received</h3>
             <p className="text-3xl font-bold text-secondary">0</p>
           </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Recent Orders & Contracts</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="text-text-muted border-b">
                     <th className="py-3 font-semibold text-sm">Worker</th>
                     <th className="py-3 font-semibold text-sm">Gig / Job</th>
                     <th className="py-3 font-semibold text-sm">Amount</th>
                     <th className="py-3 font-semibold text-sm">Status</th>
                  </tr>
               </thead>
               <tbody>
                  {orders.map(order => (
                     <tr key={order._id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                        <td className="py-4 flex items-center">
                           <img src={order.worker?.avatar || `https://ui-avatars.com/api/?name=${order.worker?.name}`} className="w-8 h-8 rounded-full mr-3" alt="" />
                           <span className="font-medium text-text-main">{order.worker?.name}</span>
                        </td>
                        <td className="py-4 text-text-muted">{order.gig?.title || order.job?.title}</td>
                        <td className="py-4 font-bold text-text-main">₹{order.price}</td>
                        <td className="py-4">
                           <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                              ${order.status === 'active' ? 'bg-blue-100 text-blue-700' : 
                                order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                                'bg-yellow-100 text-yellow-700'}`}>
                              {order.status}
                           </span>
                        </td>
                     </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan="4" className="text-center py-4 text-text-muted">No contracts found.</td></tr>
                  )}
               </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
