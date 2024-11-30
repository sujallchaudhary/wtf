import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Send, Lock } from 'lucide-react';

const api = import.meta.env.VITE_API_ENDPOINT;

const fetchUser = async (username) => {
  const response = await fetch(api + '/users/' + username, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data.data;
};

const SendMessageCall = async (username, message) => {
  const response = await fetch(api + '/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userName: username,
      message: message,
    }),
  });
  const data = await response.json();
  return data;
};

export default function SendMessage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(`https://ui-avatars.com/api/?name=` + username);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchUser(username);
        setProfile(userData.profileImage);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);
    SendMessageCall(username, message).then((data) => {
      if (data.success) {
        setIsSending(false);
        setSent(true);
        setMessage('');
        setTimeout(() => {
          setSent(false);
        }, 2000);
      } else {
        alert('Failed to send message');
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-6">
          {loading ? (
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto border-4 border-white/20 bg-gray-300 animate-pulse" />
          ) : (
            <img
              src={profile}
              alt="Profile"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto border-4 border-white/20 neon-border"
            />
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-white neon-text">
            Send message to @{username}
          </h1>
          <p className="text-lg text-white/80">
            Your message will be sent anonymously
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-morphism rounded-xl p-6 neon-border">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your anonymous message..."
              className="w-full h-32 md:h-40 bg-transparent text-white placeholder-white/50 resize-none focus:outline-none text-lg"
              maxLength={1000}
              required
            />
            <div className="flex items-center justify-between text-sm md:text-base text-white/60 mt-4">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                100% Anonymous
              </div>
              <span>{message.length}/1000</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSending || sent}
            className="w-full bg-gradient-to-r from-neon-purple to-neon-pink text-white py-4 rounded-xl font-medium hover:opacity-90 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 neon-border"
          >
            {sent ? (
              'Message Sent! ✨'
            ) : (
              <>
                <Send onClick={(e) => {}} className="w-5 h-5" />
                {isSending ? 'Sending...' : 'Send Message'}
              </>
            )}
          </button>
        </form>

        <div className="text-center text-sm md:text-base text-white/60">
          This message will be sent anonymously and cannot be traced back to you
        </div>
        <div className="text-center text-lg text-gray-200">
          Want to receive messages? <span className='text-blue-300'><Link to="/">Register</Link></span>
        </div>
      </div>
    </div>
  );
}
