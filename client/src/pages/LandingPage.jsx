import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Tractor, Hammer, Scissors, CheckCircle, Award } from 'lucide-react';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';
import { LanguageContext } from '../context/LanguageContext';

const LandingPage = () => {
  const { t } = useContext(LanguageContext);

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-primary overflow-hidden pt-20 pb-36">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-15"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/95 to-primary/85"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center z-10">
          <div className="w-full md:w-1/2 text-white">
            <motion.h1 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 text-white"
            >
              {t('hero_title').split('.')[0]}.<br />
              <span className="text-accent">{t('hero_title').split('.')[1] || ''}</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-lg md:text-xl mb-10 text-green-50/90 leading-relaxed max-w-lg"
            >
              {t('hero_desc')}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/post-job" className="btn-secondary px-8 py-4 text-lg font-bold bg-accent hover:bg-orange-500 text-white shadow-xl hover:shadow-accent/20 transition-all rounded-xl">{t('post_job')}</Link>
              <Link to="/gigs" className="btn-outline px-8 py-4 text-lg font-bold border-2 border-white text-white hover:bg-white hover:text-primary transition-all rounded-xl">{t('find_talent')}</Link>
            </motion.div>
          </div>
          
          <div className="w-full md:w-1/2 mt-16 md:mt-0 hidden md:block">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="bg-white rounded-3xl p-8 shadow-2xl max-w-md mx-auto border border-white/40"
            >
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center">
                  <Search className="text-primary" size={24} />
                </div>
                <h3 className="text-2xl font-black text-text-main">{t('popular')} Services</h3>
              </div>
              
              <div className="space-y-4">
                {[
                  { name: 'Farming Assistance', icon: <Tractor size={18} /> },
                  { name: 'Carpentry & Woodwork', icon: <Hammer size={18} /> },
                  { name: 'Tailoring & Embroidery', icon: <Scissors size={18} /> }
                ].map((skill, idx) => (
                  <Link to={`/gigs?category=${skill.name.split(' ')[0]}`} key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-primary/30 hover:bg-green-50/80 cursor-pointer transition-all duration-300 group">
                    <span className="font-bold text-text-main flex items-center gap-3">
                      <span className="text-primary group-hover:scale-110 transition-transform">{skill.icon}</span>
                      {skill.name}
                    </span>
                    <span className="bg-green-100 text-primary text-xs px-3 py-1 rounded-full font-extrabold uppercase tracking-wide">Popular</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-100 relative z-20 -mt-12 mx-4 md:mx-auto max-w-5xl rounded-2xl shadow-xl border border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 md:p-10">
          <div className="text-center">
            <h4 className="text-4xl font-extrabold text-primary mb-1">20+</h4>
            <p className="text-text-muted text-sm font-bold tracking-wider uppercase">Verified Workers</p>
          </div>
          <div className="text-center border-l border-gray-100">
            <h4 className="text-4xl font-extrabold text-primary mb-1">50+</h4>
            <p className="text-text-muted text-sm font-bold tracking-wider uppercase">Villages Reach</p>
          </div>
          <div className="text-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0">
            <h4 className="text-4xl font-extrabold text-primary mb-1">30+</h4>
            <p className="text-text-muted text-sm font-bold tracking-wider uppercase">Live Gigs</p>
          </div>
          <div className="text-center border-l border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
            <h4 className="text-4xl font-extrabold text-primary mb-1">₹50K+</h4>
            <p className="text-text-muted text-sm font-bold tracking-wider uppercase">Secured Transactions</p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-4 text-4xl font-extrabold text-text-main">{t('how_it_works')}</h2>
          <p className="text-text-muted max-w-2xl mx-auto mb-20 text-lg font-medium">{t('how_desc')}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            <div className="relative z-10 flex flex-col items-center group">
              <div className="w-24 h-24 rounded-3xl bg-white shadow-md flex items-center justify-center mb-8 border border-gray-100 group-hover:-translate-y-2 transition-transform duration-300">
                <Search className="text-primary w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-3">1. Post or Search</h3>
              <p className="text-text-muted text-center max-w-xs">Post your job requirements or browse through profiles of verified rural workers.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center group">
              <div className="w-24 h-24 rounded-3xl bg-primary shadow-lg shadow-primary/20 flex items-center justify-center mb-8 text-white group-hover:-translate-y-2 transition-transform duration-300">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-3">2. Match & Discuss</h3>
              <p className="text-text-muted text-center max-w-xs">Review proposals, chat directly in real-time, and agree on terms.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center group">
              <div className="w-24 h-24 rounded-3xl bg-accent shadow-lg shadow-accent/20 flex items-center justify-center mb-8 text-white group-hover:-translate-y-2 transition-transform duration-300">
                <Tractor className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-3">3. Work & Pay</h3>
              <p className="text-text-muted text-center max-w-xs">Get the job done. Secure payments ensure trust for both parties.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="mb-2 text-4xl font-extrabold text-text-main">{t('featured_skills')}</h2>
              <p className="text-text-muted font-medium">{t('categories_desc')}</p>
            </div>
            <Link to="/gigs" className="text-primary font-bold hover:underline hidden md:flex items-center gap-1">View all categories &rarr;</Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: 'Farming', icon: <Tractor className="w-8 h-8 text-primary" />, count: '20+ live gigs' },
              { name: 'Carpentry', icon: <Hammer className="w-8 h-8 text-primary" />, count: '5+ live gigs' },
              { name: 'Tailoring', icon: <Scissors className="w-8 h-8 text-primary" />, count: '3+ live gigs' },
              { name: 'Pottery', icon: <Award className="w-8 h-8 text-primary" />, count: '2+ live gigs' },
            ].map((cat, idx) => (
              <Link key={idx} to={`/gigs?category=${cat.name}`} className="group p-8 bg-background rounded-3xl hover:bg-green-50/70 transition-all duration-300 border border-gray-100 hover:border-primary/20 text-center">
                <div className="w-20 h-20 mx-auto bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <h3 className="text-xl font-bold text-text-main mb-2">{cat.name}</h3>
                <p className="text-sm text-text-muted font-semibold">{cat.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-24 text-center px-4">
        <h2 className="text-white mb-6 text-4xl font-extrabold">Ready to get started?</h2>
        <p className="text-green-100 mb-12 max-w-2xl mx-auto text-lg">Join thousands of businesses and rural workers building a better economy together.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/register" className="btn-secondary bg-accent hover:bg-orange-500 text-white font-bold px-10 py-5 text-lg rounded-xl shadow-xl hover:shadow-accent/20">Create Account</Link>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default LandingPage;
