import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';

const PostJobPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ title: '', category: '', description: '', budget: { type: 'fixed', min: 0 }, duration: '', locationRequired: '', skills: '' });
  const navigate = useNavigate();

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim());
      await api.post('/jobs/create', { ...formData, skills: skillsArray });
      navigate('/dashboard/employer');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4">
         <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-card">
            <h1 className="text-2xl font-bold mb-6 text-text-main">Post a Job</h1>
            
            <div className="w-full bg-gray-200 h-2 rounded-full mb-8">
               <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${(step/4)*100}%`}}></div>
            </div>

            <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
              {step === 1 && (
                 <div className="space-y-4">
                    <h2 className="font-bold text-lg">Step 1: Details</h2>
                    <input type="text" placeholder="Job Title" className="input-field" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                    <input type="text" placeholder="Category" className="input-field" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
                    <textarea placeholder="Description" className="input-field min-h-[150px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                 </div>
              )}
              {step === 2 && (
                 <div className="space-y-4">
                    <h2 className="font-bold text-lg">Step 2: Scope & Budget</h2>
                    <select className="input-field" value={formData.budget.type} onChange={e => setFormData({...formData, budget: { ...formData.budget, type: e.target.value}})}>
                       <option value="fixed">Fixed Price</option>
                       <option value="hourly">Hourly Rate</option>
                    </select>
                    <input type="number" placeholder="Budget Amount (₹)" className="input-field" value={formData.budget.min} onChange={e => setFormData({...formData, budget: { ...formData.budget, min: e.target.value}})} required />
                    <input type="text" placeholder="Duration (e.g. 1 month)" className="input-field" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
                 </div>
              )}
              {step === 3 && (
                 <div className="space-y-4">
                    <h2 className="font-bold text-lg">Step 3: Requirements</h2>
                    <input type="text" placeholder="Location Requirements (or 'Any')" className="input-field" value={formData.locationRequired} onChange={e => setFormData({...formData, locationRequired: e.target.value})} />
                    <input type="text" placeholder="Skills (comma separated)" className="input-field" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} />
                 </div>
              )}
              {step === 4 && (
                 <div className="space-y-4">
                    <h2 className="font-bold text-lg">Step 4: Review</h2>
                    <div className="p-4 bg-gray-50 rounded border">
                       <p><strong>Title:</strong> {formData.title}</p>
                       <p><strong>Category:</strong> {formData.category}</p>
                       <p><strong>Budget:</strong> ₹{formData.budget.min}</p>
                       <p><strong>Skills:</strong> {formData.skills}</p>
                    </div>
                 </div>
              )}

              <div className="flex justify-between mt-8">
                 {step > 1 ? <button type="button" onClick={handlePrev} className="btn-outline">Back</button> : <div></div>}
                 <button type="submit" className="btn-primary">{step === 4 ? 'Publish Job' : 'Next Step'}</button>
              </div>
            </form>
         </div>
      </div>
      <Footer />
    </div>
  );
};

export default PostJobPage;
