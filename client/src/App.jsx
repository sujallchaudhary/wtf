import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Register from './pages/Register';
import SendMessage from './pages/SendMessage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="messages" element={<Messages />} />
        <Route path="profile" element={<Profile />} />
        <Route path="register" element={<Register />} />
        <Route path="/:username" element={<SendMessage />} />
      </Route>
    </Routes>
  );
}

export default App;