import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';

const WorkerProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/users/profile/${id}`);
        setProfile(res.data);
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };
    fetchProfile();
  }, [id]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="bg-white p-8 rounded-xl shadow-card relative">
          <div className="h-32 bg-primary absolute top-0 left-0 w-full rounded-t-xl z-0"></div>
          <div className="relative z-10 flex flex-col items-center mt-10">
             <img src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.name}`} className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-sm" alt="Avatar" />
             <h1 className="text-3xl font-bold mt-4">{profile.name}</h1>
             <p className="text-text-muted">{profile.location?.village}, {profile.location?.state}</p>
             <div className="flex flex-wrap justify-center gap-2 mt-4">
                {profile.skills?.map((skill, idx) => (
                   <span key={idx} className="bg-green-100 text-primary px-3 py-1 rounded-full text-sm font-semibold">{skill}</span>
                ))}
             </div>
             <p className="mt-6 text-center max-w-2xl text-text-muted">{profile.bio || "This worker hasn't added a bio yet."}</p>
             <button className="btn-primary mt-6">Hire Me</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WorkerProfilePage;
