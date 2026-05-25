import React, { createContext, useState, useEffect } from 'react';

const translations = {
  en: {
    find_talent: "Find Talent",
    find_work: "Find Work",
    dashboard: "Dashboard",
    messages: "Messages",
    logout: "Logout",
    login: "Log in",
    signup: "Sign up",
    hero_title: "Find Rural Talent. Get Work Done.",
    hero_desc: "Bridge the gap with skilled workers from villages. Authentic, reliable, and hardworking talent for your projects.",
    post_job: "Post a Job",
    popular: "Popular",
    featured_skills: "Featured Skills",
    categories_desc: "Discover top talent in specialized rural categories.",
    how_it_works: "How RuralConnect Works",
    how_desc: "Simple, transparent, and built to empower both clients and workers.",
    search_placeholder: "What service are you looking for today?",
    search_btn: "Search",
    hire_me: "Hire Me",
    message_worker: "Message Worker",
    create_gig: "Create New Gig",
    earnings: "Total Earnings",
    my_orders: "My Orders & Contracts",
    post_new_job: "Post New Job",
    proposals_received: "Proposals Received"
  },
  hi: {
    find_talent: "कलाकार खोजें",
    find_work: "काम खोजें",
    dashboard: "डैशबोर्ड",
    messages: "संदेश",
    logout: "लॉगआउट",
    login: "लॉग इन",
    signup: "साइन अप",
    hero_title: "ग्रामीण प्रतिभा खोजें। काम पूरा कराएं।",
    hero_desc: "गांवों के कुशल श्रमिकों के साथ दूरी मिटाएं। आपकी परियोजनाओं के लिए विश्वसनीय, सच्चे और मेहनती लोग।",
    post_job: "काम पोस्ट करें",
    popular: "लोकप्रिय",
    featured_skills: "प्रमुख कौशल",
    categories_desc: "विशेष ग्रामीण श्रेणियों में शीर्ष प्रतिभाओं की खोज करें।",
    how_it_works: "रूरलकनेक्ट कैसे काम करता है",
    how_desc: "सरल, पारदर्शी और दोनों नियोक्ताओं और श्रमिकों को सशक्त बनाने के लिए बनाया गया।",
    search_placeholder: "आज आप किस सेवा की तलाश में हैं?",
    search_btn: "खोजें",
    hire_me: "काम पर रखें",
    message_worker: "संदेश भेजें",
    create_gig: "नया काम जोड़ें",
    earnings: "कुल कमाई",
    my_orders: "मेरे आदेश और अनुबंध",
    post_new_job: "नया काम पोस्ट करें",
    proposals_received: "प्राप्त प्रस्ताव"
  },
  pa: {
    find_talent: "ਹੁਨਰਮੰਦ ਲੱਭੋ",
    find_work: "ਕੰਮ ਲੱਭੋ",
    dashboard: "ਡੈਸ਼ਬੋਰਡ",
    messages: "ਸੁਨੇਹੇ",
    logout: "ਲੌਗਆਊਟ",
    login: "ਲੌਗ ਇਨ",
    signup: "ਸਾਈਨ ਅੱਪ",
    hero_title: "ਪੇਂਡੂ ਪ੍ਰਤਿਭਾ ਲੱਭੋ। ਕੰਮ ਕਰਵਾਓ।",
    hero_desc: "ਪਿੰਡਾਂ ਦੇ ਹੁਨਰਮੰਦ ਕਾਮਿਆਂ ਨਾਲ ਪਾੜਾ ਪੂਰੋ। ਤੁਹਾਡੇ ਕੰਮਾਂ ਲਈ ਭਰੋਸੇਮੰਦ, ਸੱਚੇ ਅਤੇ ਮਿਹਨਤੀ ਲੋਕ।",
    post_job: "ਕੰਮ ਪੋਸਟ ਕਰੋ",
    popular: "ਮਸ਼ਹੂਰ",
    featured_skills: "ਮੁੱਖ ਹੁਨਰ",
    categories_desc: "ਵਿਸ਼ੇਸ਼ ਪੇਂਡੂ ਸ਼੍ਰੇਣੀਆਂ ਵਿੱਚ ਵਧੀਆ ਪ੍ਰਤਿਭਾਵਾਂ ਦੀ ਖੋਜ ਕਰੋ।",
    how_it_works: "ਰੂਰਲਕਨੈਕਟ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ",
    how_desc: "ਸਰਲ, ਪਾਰਦਰਸ਼ੀ ਅਤੇ ਗਾਹਕਾਂ ਅਤੇ ਕਾਮਿਆਂ ਦੋਵਾਂ ਨੂੰ ਮਜ਼ਬੂਤ ਬਣਾਉਣ ਲਈ ਬਣਾਇਆ ਗਿਆ।",
    search_placeholder: "ਅੱਜ ਤੁਸੀਂ ਕਿਹੜੀ ਸੇਵਾ ਲੱਭ ਰਹੇ ਹੋ?",
    search_btn: "ਖੋਜੋ",
    hire_me: "ਕੰਮ ਤੇ ਰੱਖੋ",
    message_worker: "ਸੁਨੇਹਾ ਭੇਜੋ",
    create_gig: "ਨਵਾਂ ਗਿੱਗ ਬਣਾਓ",
    earnings: "ਕੁੱਲ ਕਮਾਈ",
    my_orders: "ਮੇਰੇ ਆਰਡਰ ਅਤੇ ਸਮਝੌਤੇ",
    post_new_job: "ਨਵਾਂ ਕੰਮ ਪੋਸਟ ਕਰੋ",
    proposals_received: "ਮਿਲੇ ਪ੍ਰਸਤਾਵ"
  }
};

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
