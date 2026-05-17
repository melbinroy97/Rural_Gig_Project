import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/ui/Navbar';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', earnings: 4000 },
  { name: 'Feb', earnings: 3000 },
  { name: 'Mar', earnings: 5000 },
  { name: 'Apr', earnings: 2780 },
  { name: 'May', earnings: 8900 },
  { name: 'Jun', earnings: 6000 },
];

const WorkerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
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
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="text-text-muted text-sm font-semibold uppercase tracking-wider mb-2">Total Earnings</h3>
             <p className="text-3xl font-bold text-primary">₹24,680</p>
           </div>
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="text-text-muted text-sm font-semibold uppercase tracking-wider mb-2">Active Orders</h3>
             <p className="text-3xl font-bold text-text-main">{orders.filter(o => o.status === 'active').length || 0}</p>
           </div>
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="text-text-muted text-sm font-semibold uppercase tracking-wider mb-2">Pending Orders</h3>
             <p className="text-3xl font-bold text-accent">{orders.filter(o => o.status === 'pending').length || 0}</p>
           </div>
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="text-text-muted text-sm font-semibold uppercase tracking-wider mb-2">Completed</h3>
             <p className="text-3xl font-bold text-secondary">{orders.filter(o => o.status === 'completed').length || 0}</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h2 className="text-xl font-bold mb-4 border-b pb-2">Recent Orders</h2>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                      <tr className="text-text-muted border-b">
                         <th className="py-3 font-semibold text-sm">Client</th>
                         <th className="py-3 font-semibold text-sm">Gig / Job</th>
                         <th className="py-3 font-semibold text-sm">Amount</th>
                         <th className="py-3 font-semibold text-sm">Status</th>
                      </tr>
                   </thead>
                   <tbody>
                      {orders.map(order => (
                         <tr key={order._id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                            <td className="py-4 flex items-center">
                               <img src={order.employer?.avatar || `https://ui-avatars.com/api/?name=${order.employer?.name}`} className="w-8 h-8 rounded-full mr-3" alt="" />
                               <span className="font-medium text-text-main">{order.employer?.name}</span>
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
                        <tr><td colSpan="4" className="text-center py-4 text-text-muted">No orders found.</td></tr>
                      )}
                   </tbody>
                </table>
             </div>
           </div>

           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h2 className="text-xl font-bold mb-4 border-b pb-2">Earnings Overview</h2>
             <div className="h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="earnings" stroke="#2D6A4F" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                   </LineChart>
                </ResponsiveContainer>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
