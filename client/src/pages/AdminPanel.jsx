import React, { useEffect, useState } from 'react';
import Navbar from '../components/ui/Navbar';
import api from '../services/api';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    // In a real scenario, these would be protected admin routes
    const fetchData = async () => {
       try {
          const workersRes = await api.get('/users/workers');
          setUsers(workersRes.data);
          
          const gigsRes = await api.get('/gigs');
          setGigs(gigsRes.data.gigs);
       } catch (err) {
          console.error(err);
       }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
         <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
         
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <h3 className="text-text-muted text-sm font-semibold uppercase">Total Users</h3>
               <p className="text-3xl font-bold text-primary">{users.length + 10}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <h3 className="text-text-muted text-sm font-semibold uppercase">Total Gigs</h3>
               <p className="text-3xl font-bold text-text-main">{gigs.length}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <h3 className="text-text-muted text-sm font-semibold uppercase">Total Revenue</h3>
               <p className="text-3xl font-bold text-secondary">₹1,50,000</p>
            </div>
         </div>

         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Platform Users</h2>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="border-b">
                        <th className="py-2">Name</th>
                        <th className="py-2">Role</th>
                        <th className="py-2">Location</th>
                        <th className="py-2">Actions</th>
                     </tr>
                  </thead>
                  <tbody>
                     {users.map(u => (
                        <tr key={u._id} className="border-b">
                           <td className="py-2">{u.name}</td>
                           <td className="py-2 capitalize">{u.role}</td>
                           <td className="py-2">{u.location?.village}</td>
                           <td className="py-2">
                              <button className="text-red-500 hover:text-red-700 text-sm">Suspend</button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminPanel;
