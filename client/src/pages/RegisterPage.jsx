import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const { register: registerUser, isAuthenticated, error, clearError } = useContext(AuthContext);
  const navigate = useNavigate();
  const [role, setRole] = useState('worker');
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const password = watch('password');

  useEffect(() => {
    clearError();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    if (error) {
      toast.error(error);
    }
  }, [isAuthenticated, error, navigate]);

  const onSubmit = async (data) => {
    const userData = {
      ...data,
      role,
      skills: role === 'worker' && data.skills ? data.skills.split(',').map(s => s.trim()) : []
    };
    
    const success = await registerUser(userData);
    if (success) {
      toast.success('Registration successful!');
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <div className="max-w-xl w-full space-y-8 my-8">
          <div className="text-center">
            <Link to="/" className="text-3xl font-bold text-primary mb-6 block">RuralConnect</Link>
            <h2 className="text-2xl font-bold text-text-main">Create an account</h2>
            <p className="mt-2 text-text-muted">Join our community of rural workers and employers.</p>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${role === 'worker' ? 'bg-white shadow-sm text-primary' : 'text-text-muted'}`}
              onClick={() => setRole('worker')}
            >
              I'm looking for work
            </button>
            <button
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${role === 'employer' ? 'bg-white shadow-sm text-primary' : 'text-text-muted'}`}
              onClick={() => setRole('employer')}
            >
              I want to hire
            </button>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">Full Name</label>
                <input type="text" {...register('name', { required: 'Name is required' })} className="input-field" placeholder="John Doe" />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">Phone Number</label>
                <input type="tel" {...register('phone', { required: 'Phone is required' })} className="input-field" placeholder="+91 9876543210" />
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main mb-1">Email address</label>
              <input type="email" {...register('email', { required: 'Email is required' })} className="input-field" placeholder="john@example.com" />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">Password</label>
                <input type="password" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} className="input-field" placeholder="••••••••" />
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">Confirm Password</label>
                <input type="password" {...register('confirmPassword', { validate: value => value === password || 'Passwords do not match' })} className="input-field" placeholder="••••••••" />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">State</label>
                <input type="text" {...register('state', { required: 'State is required' })} className="input-field" placeholder="e.g. Maharashtra" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">District</label>
                <input type="text" {...register('district', { required: 'District is required' })} className="input-field" placeholder="e.g. Pune" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">Village/Town</label>
                <input type="text" {...register('village', { required: 'Village is required' })} className="input-field" placeholder="e.g. Shirur" />
              </div>
            </div>

            {role === 'worker' && (
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">Skills (comma separated)</label>
                <input type="text" {...register('skills', { required: 'At least one skill is required' })} className="input-field" placeholder="Farming, Driving, Carpentry" />
                {errors.skills && <p className="mt-1 text-sm text-red-500">{errors.skills.message}</p>}
              </div>
            )}

            <button type="submit" className="w-full btn-primary py-3 mt-6">
              Create Account
            </button>
          </form>

          <p className="text-center text-sm text-text-muted mt-4">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right side illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 items-center justify-center relative border-l border-gray-200">
         <div className="absolute inset-0 bg-secondary/10"></div>
         <div className="z-10 p-12 max-w-lg text-center">
            <h3 className="text-3xl font-bold text-text-main mb-4">Empower Your Rural Livelihood</h3>
            <p className="text-text-muted text-lg mb-8">Connect directly with clients, secure fair wages, and build your digital portfolio with RuralConnect.</p>
            <div className="grid grid-cols-2 gap-6 text-left">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <span className="text-2xl mb-2 block">🔒</span>
                <h4 className="font-bold text-text-main">Secure Payments</h4>
                <p className="text-sm text-text-muted mt-1">Guaranteed payments upon job completion.</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <span className="text-2xl mb-2 block">🌟</span>
                <h4 className="font-bold text-text-main">Build Reputation</h4>
                <p className="text-sm text-text-muted mt-1">Get reviews and earn more trust.</p>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default RegisterPage;
