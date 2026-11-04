import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ExploreEvents from './pages/ExploreEvents';
import EventDetails from './pages/EventDetails';
import MyRegistrations from './pages/MyRegistrations';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<ExploreEvents />} />
          <Route path="/events" element={<Navigate to="/" replace />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/my-registrations" element={<MyRegistrations />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

