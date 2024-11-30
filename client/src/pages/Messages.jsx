import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import MessageCard from '../components/MessageCard';
import MessageFilter from '../components/MessageFilter';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const api = import.meta.env.VITE_API_ENDPOINT;
const socket = io(api);

const fetchMessages = async () => {
  const response = await fetch(api + '/messages', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
    },
  });
  const data = await response.json();
  return data.data;
};

function timeAgo(isoTimestamp) {
  if (!isoTimestamp) return '';
  const timestamp = new Date(isoTimestamp).getTime();
  const now = Date.now();
  const secondsAgo = Math.floor((now - timestamp) / 1000);

  if (secondsAgo < 60) return `${secondsAgo} seconds ago`;
  else if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} minutes ago`;
  else if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)} hours ago`;
  else return `${Math.floor(secondsAgo / 86400)} days ago`;
}

export default function Messages() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('recent');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
    }
  }, []);

  useEffect(() => {
    // Fetch messages initially via API
    fetchMessages().then((data) => {
      const sortedMessages = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setMessages(sortedMessages);
      setFilteredMessages(sortedMessages);
      setLoading(false);

    });

    // Connect to Socket.IO
    socket.on('connect', () => {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const userId = userData?._id;
      const payload = { token: localStorage.getItem('token'), userId };
      if (userId) {
        socket.emit('register', payload);
        console.log(`Register event emitted for user: ${userId}`);
      }
    });

    socket.on('message', (newMessage) => {
      setMessages((prevMessages) => {
        const updatedMessages = [newMessage, ...prevMessages];
        setFilteredMessages(updatedMessages);
        return updatedMessages;
      });
    });
  }, []);

  useEffect(() => {
    const now = new Date();
    const filtered = messages
      .filter((message) => message.message.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((message) => {
        switch (activeFilter) {
          case 'starred':
            return message.isStarred;
          case 'recent':
            return true;
          case 'week':
            const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
            return new Date(message.createdAt) >= oneWeekAgo;
          case 'month':
            const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            return new Date(message.createdAt) >= oneMonthAgo;
          default:
            return true;
        }
      });

    setFilteredMessages(filtered);
  }, [searchTerm, activeFilter, messages]);

  return (
    <div className="min-h-screen p-4 md:p-8 pt-4 md:pt-24">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-white neon-text">Your Messages</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 text-white placeholder-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon-purple"
          />
        </div>

        {showFilters && (
          <MessageFilter activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
        )}

        <div className="grid gap-4">
          {loading && (
            <div className="animate-pulse">
              <MessageCard message="Loading..." timestamp="Just now" isStarred={false} />
              <MessageCard message="Loading..." timestamp="Just now" isStarred={false} />
              <MessageCard message="Loading..." timestamp="Just now" isStarred={false} />
              <MessageCard message="Loading..." timestamp="Just now" isStarred={false} />
            </div>
          )}
          {filteredMessages.length === 0
            && !loading
            && <p className="text-white text-center">No messages found</p>
          }
          {filteredMessages.map((message) => (
            <MessageCard
              key={message._id}
              messageId={message._id}
              message={message.message}
              timestamp={timeAgo(message.createdAt)}
              isStarred={message.isStarred}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
