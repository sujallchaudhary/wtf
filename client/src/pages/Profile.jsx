import React, { useEffect, useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { Copy, Share2, Instagram, Twitter, MessageCircle } from 'lucide-react';
import domtoimage from 'dom-to-image';


export default function Profile() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [profileImage, setProfileImage] = useState('');
useEffect(() => {
  if (!localStorage.getItem('token')) {
    navigate('/');
  }
const userData = localStorage.getItem('userData');
if (userData) {
  const user = JSON.parse(userData);
  setUserName(user.userName);
  setProfileImage(user.profileImage)
}
}, []);

  const [copied, setCopied] = useState(false);

  const profileUrl = `${window.location.origin}/${userName}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };



const takeScreenshot = async () => {
  const element = document.getElementById("profile-section");

  try {
    const dataUrl = await domtoimage.toPng(element, {
      bgcolor:"#1f1f1f",
      quality: 1,
      cacheBust: true, 
    });

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${userName}_profile.png`;
    link.click();

  } catch (error) {
    console.error("An error occurred while taking the screenshot:", error);
  }
};

  
  

  return (
    <div id="profile-section" className="min-h-screen p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        {/* Profile Header */}
        <div className="text-center space-y-6">
          <div className="relative w-28 h-28 mx-auto">
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full rounded-full object-cover border-4 border-white/20 neon-border"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white neon-text">@{userName}</h1>
          </div>
        </div>

        {/* Message Box */}
        <div className="glass-morphism rounded-3xl p-6 space-y-6 neon-border">
          <div className="space-y-4 text-center">
            <MessageCircle className="w-12 h-12 text-neon-purple mx-auto" />
            <h2 className="text-xl font-semibold text-white">
              Send me anonymous messages!
            </h2>
            <p className="text-white/70">
              I won't know who sent the message 🤫
            </p>
          </div>

          <Link
            to={`/${userName}`}
            className="block w-full py-4 bg-gradient-to-r from-neon-purple to-neon-pink text-white text-lg font-semibold rounded-2xl text-center hover:opacity-90 transition-all duration-300 transform hover:scale-105 neon-border"
          >
            Send Message ✨
          </Link>
        </div>

        {/* Share Profile */}
        <div className="space-y-4">
          <div className="glass-morphism rounded-2xl p-4 space-y-3 neon-border">
            <div className="flex items-center justify-between gap-4">
              <input
                type="text"
                value={profileUrl}
                readOnly
                className="w-full bg-transparent text-white/90 focus:outline-none text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
            {copied && (
              <div className="text-sm text-neon-green text-center animate-pulse">
                ✨ Link copied to clipboard! ✨
              </div>
            )}
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-4">
            <button
              onClick={takeScreenshot}
              className="p-3 glass-morphism rounded-xl text-white/70 hover:text-neon-pink hover:scale-110 transition-all duration-300 neon-border"
            >
              <Instagram className="w-6 h-6" />
            </button>
            <button
              onClick={copyToClipboard}
              className="p-3 glass-morphism rounded-xl text-white/70 hover:text-neon-blue hover:scale-110 transition-all duration-300 neon-border"
            >
              <Share2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
