import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Tractor, Hammer, Scissors, CheckCircle } from 'lucide-react';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';

const LandingPage = () => {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-primary overflow-hidden pt-16 pb-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 to-primary/80"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center z-10">
          <div className="w-full md:w-1/2 text-white">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold leading-tight mb-4 text-white"
            >
              Find Rural Talent. <br />
              <span className="text-accent">Get Work Done.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl mb-8 text-green-50 max-w-lg"
            >
              Bridge the gap with skilled workers from villages. Authentic, reliable, and hardworking talent for your projects.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/post-job" className="btn-secondary px-8 py-4 text-lg bg-accent hover:bg-orange-500 text-white shadow-lg">Post a Job</Link>
              <Link to="/gigs" className="btn-outline px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-primary">Find Talent</Link>
            </motion.div>
          </div>
          
          <div className="w-full md:w-1/2 mt-12 md:mt-0 hidden md:block">
            {/* Abstract visual or search box illustration */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-6 shadow-2xl max-w-md mx-auto"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Search className="text-primary" size={20} />
                </div>
                <h3 className="text-xl font-bold text-text-main">What are you looking for?</h3>
              </div>
              
              <div className="space-y-3">
                {['Farming Assistance', 'Carpentry & Woodwork', 'Tailoring & Weaving'].map((skill, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-green-50 cursor-pointer transition-colors">
                    <span className="font-medium text-text-main">{skill}</span>
                    <span className="bg-green-100 text-primary text-xs px-2 py-1 rounded-full font-semibold">Popular</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-100 relative z-20 -mt-10 mx-4 md:mx-auto max-w-5xl rounded-xl shadow-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8">
          <div className="text-center">
            <h4 className="text-3xl font-bold text-primary mb-1">10,000+</h4>
            <p className="text-text-muted text-sm font-medium">Workers</p>
          </div>
          <div className="text-center border-l border-gray-100">
            <h4 className="text-3xl font-bold text-primary mb-1">500+</h4>
            <p className="text-text-muted text-sm font-medium">Villages</p>
          </div>
          <div className="text-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0">
            <h4 className="text-3xl font-bold text-primary mb-1">50+</h4>
            <p className="text-text-muted text-sm font-medium">Skill Categories</p>
          </div>
          <div className="text-center border-l border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
            <h4 className="text-3xl font-bold text-primary mb-1">₹2Cr+</h4>
            <p className="text-text-muted text-sm font-medium">Earned</p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-4">How RuralConnect Works</h2>
          <p className="text-text-muted max-w-2xl mx-auto mb-16 text-lg">Simple, transparent, and built to empower both clients and workers.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gray-200 w-2/3 mx-auto z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-white shadow-card flex items-center justify-center mb-6 border-4 border-background">
                <Search className="text-primary w-10 h-10" />
              </div>
              <h3 className="text-xl mb-3">1. Post or Search</h3>
              <p className="text-text-muted text-center">Post your job requirements or browse through profiles of verified rural workers.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-primary shadow-card flex items-center justify-center mb-6 border-4 border-background text-white">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-xl mb-3">2. Match & Discuss</h3>
              <p className="text-text-muted text-center">Review proposals, chat directly in real-time, and agree on terms.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-accent shadow-card flex items-center justify-center mb-6 border-4 border-background text-white">
                <Tractor className="w-10 h-10" />
              </div>
              <h3 className="text-xl mb-3">3. Work & Pay</h3>
              <p className="text-text-muted text-center">Get the job done. Secure payments ensure trust for both parties.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="mb-2">Featured Skills</h2>
              <p className="text-text-muted">Discover top talent in specialized rural categories.</p>
            </div>
            <Link to="/gigs" className="text-primary font-medium hover:underline hidden md:block">View all categories &rarr;</Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Farming', icon: <Tractor className="w-8 h-8 text-primary" />, count: '2.5k+' },
              { name: 'Carpentry', icon: <Hammer className="w-8 h-8 text-primary" />, count: '1.2k+' },
              { name: 'Tailoring', icon: <Scissors className="w-8 h-8 text-primary" />, count: '800+' },
              { name: 'Handicrafts', icon: <CheckCircle className="w-8 h-8 text-primary" />, count: '1.5k+' },
            ].map((cat, idx) => (
              <Link key={idx} to={`/gigs?category=${cat.name}`} className="group p-6 bg-background rounded-2xl hover:bg-green-50 transition-colors border border-gray-100 hover:border-primary/20 text-center">
                <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <h3 className="text-lg font-semibold text-text-main mb-1">{cat.name}</h3>
                <p className="text-sm text-text-muted">{cat.count} workers</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-20 text-center px-4">
        <h2 className="text-white mb-6 text-3xl md:text-4xl">Ready to get started?</h2>
        <p className="text-green-100 mb-10 max-w-2xl mx-auto text-lg">Join thousands of businesses and rural workers building a better economy together.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/register" className="btn-secondary bg-accent hover:bg-orange-500 text-white px-8 py-4 text-lg">Create Account</Link>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default LandingPage;
