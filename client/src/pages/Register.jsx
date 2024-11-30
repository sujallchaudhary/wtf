import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Trash2, Loader } from 'lucide-react';

const api = import.meta.env.VITE_API_ENDPOINT;

export default function Register() {
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageURL, setProfileImageURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/profile');
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileImageURL(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setProfileImageURL(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('userName', username);
    if (profileImage) {
      formData.append('file', profileImage);
    }

    try {
      const response = await fetch(api + '/users', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        navigate('/profile');
        localStorage.setItem('userData', JSON.stringify(data.data));
        localStorage.setItem('token', data.token);
      } else {
        console.error('Error:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 pt-4 md:pt-24">
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white neon-text">Create Your Profile</h1>
          <p className="text-lg text-white/70">Start receiving anonymous messages</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader className="w-12 h-12 text-white animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col items-center gap-4">
              {profileImageURL ? (
                <div className="relative">
                  <img
                    src={
                      profileImageURL
                    }
                    alt="Profile preview"
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white/20"
                  />
                  <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-0 right-0 bg-black bg-opacity-50 rounded-full p-1"
                      title="Remove Image"
                    >
                      <Trash2 className="w-5 h-5 text-white" />
                    </button>
                </div>
              ) : (
                <label className="flex flex-col items-center cursor-pointer">
                  <div className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center border-4 border-white/20 rounded-full bg-gray-500">
                    <Camera className="w-12 h-12 text-white/50" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    required={false}
                  />
                  <p className="text-sm md:text-base text-white/60 mt-2">Click to upload profile picture</p>
                </label>
              )}
            </div>

            <div className="space-y-3">
              <label htmlFor="username" className="block text-lg font-medium text-white">
                Username
              </label>
              <input
                type="text"
                id="username"
                required={true}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 glass-morphism border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-neon-purple neon-border"
                placeholder="Choose a username"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-900 w-full py-4 bg-gradient-to-r from-neon-pink to-neon-purple text-white text-lg font-semibold rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 neon-border"
              disabled={loading}
            >
              Create Profile
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
