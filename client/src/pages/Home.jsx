import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle, Share2, Sparkles } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPopup, setShowInstallPopup] = useState(false);

  useEffect(() => {
    document.title = 'TF = True Feedback';

    if (localStorage.getItem('token')) {
      navigate('/profile');
    }
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setShowInstallPopup(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [navigate]);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null)
      setShowInstallPopup(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-8 pt-8 md:pt-24">
      <div className="max-w-4xl mx-auto space-y-12">
    {showInstallPopup && (
  <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-900 text-white p-4 rounded-lg shadow-lg flex items-center space-x-4 z-50">
    <p className="text-sm md:text-lg">
      Install the app for a better experience!
    </p>
    <button
      onClick={handleInstallApp}
      className="bg-gradient-to-r from-neon-pink to-neon-purple px-4 py-2 text-white text-sm md:text-lg font-semibold rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105"
    >
      Install
    </button>
  </div>
)}
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold neon-text animate-pulse-slow">
            <span className="text-3xl md:text-5xl">WTF</span> =
            <span className="line-through text-3xl md:text-5xl">what the fuck</span>
            <br />
            What A True Feedback
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold neon-text animate-pulse-slow">
            Share Your Thoughts
          </h2>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Send and receive anonymous messages in style ✨
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-morphism rounded-3xl p-8 space-y-4 transform hover:scale-105 transition-all duration-300 neon-border">
            <MessageCircle className="w-12 h-12 text-neon-blue animate-bounce-slow" />
            <h2 className="text-2xl font-bold text-white neon-text">
              Anonymous Messages
            </h2>
            <p className="text-lg text-white/80 leading-relaxed">
              Express yourself freely without revealing your identity
            </p>
            <Link
              to="/register"
              className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-neon-pink to-neon-purple text-white text-md font-semibold rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 neon-border"
            >
              Register
            </Link>
          </div>
          <div className="glass-morphism rounded-3xl p-8 space-y-4 transform hover:scale-105 transition-all duration-300 neon-border">
            <Share2 className="w-12 h-12 text-neon-green animate-bounce-slow" />
            <h2 className="text-2xl font-bold text-white neon-text">Share Anywhere</h2>
            <p className="text-lg text-white/80 leading-relaxed">
              Share your profile across all social platforms
            </p>
            <Link
              to="/register"
              className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-neon-pink to-neon-purple text-white text-md font-semibold rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 neon-border"
            >
              Register
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <Link
            to="/register"
            className="bg-blue-900 w-full sm:w-auto px-12 py-4 bg-gradient-to-r from-neon-pink to-neon-purple text-white text-lg font-semibold rounded-2xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 neon-border"
          >
            <Sparkles className="w-6 h-6" />
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
