import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchEvents } from '../services/api';
import { enrichEvent } from '../utils/eventMeta';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'AI', 'Robotics', 'Open Source', 'Design', 'Career'];

export default function ExploreEvents() {
  const { getHeaders } = useAuth();
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEvents(search);
  }, [search]);

  const loadEvents = async (query) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchEvents(query, getHeaders());
      const enriched = data.map(enrichEvent);
      setEvents(enriched);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.message || 'Unable to connect to backend');
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering by category
  const filteredEvents = events.filter((e) => {
    if (selectedCategory === 'All') return true;
    const cat = (e.category || '').toLowerCase();
    const tag = (e.tag || '').toLowerCase();
    const target = selectedCategory.toLowerCase();
    return cat.includes(target) || tag.includes(target) || e.title.toLowerCase().includes(target);
  });

  return (
    <main className="flex-grow max-w-7xl w-full mx-auto px-space-md md:px-margin py-space-xl">
      {/* Hero / Catalog Header Section */}
      <section className="max-w-3xl mb-space-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-primary text-label-md font-label-md mb-3 border border-outline-variant/30">
          <span className="material-symbols-outlined text-[16px]">school</span>
          <span>Spring Term 2025 Portal</span>
        </div>
        <h1 className="text-headline-lg font-headline-lg text-on-surface mb-2 tracking-tight">
          Find your next campus experience.
        </h1>
        <p className="text-body-lg font-body-lg text-on-surface-variant leading-relaxed">
          Discover hackathons, guest lectures, robotics workshops, and student tech meetups across campus.
        </p>
      </section>

      {/* Search & Filter Controls */}
      <section className="mb-space-xl space-y-space-md">
        {/* Search Input */}
        <div className="relative w-full max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/60 rounded-lg text-body-md font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm transition-all"
            placeholder="Search events by title..."
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-outline hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Filter Category Chips */}
        <div className="flex flex-wrap items-center gap-space-xs">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-label-md font-label-md active:scale-[0.98] transition-all ${
                  isSelected
                    ? 'bg-primary text-on-primary shadow-sm hover:opacity-95'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface border border-outline-variant/40'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Loading & Error States */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-body-md">Connecting to CampusConnect backend...</p>
        </div>
      )}

      {error && !loading && (
        <div className="p-6 rounded-xl bg-error-container/40 border border-error/30 text-on-surface mb-8">
          <div className="flex items-center gap-3 text-error font-semibold text-headline-sm">
            <span className="material-symbols-outlined">error</span>
            Backend Connection Notice
          </div>
          <p className="mt-2 text-body-md text-on-surface-variant">
            {error}. Ensure your backend server is running at <code className="bg-surface-container px-2 py-0.5 rounded font-mono text-primary">http://localhost:8000</code>.
          </p>
          <button
            onClick={() => loadEvents(search)}
            className="mt-4 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md font-semibold hover:opacity-90 transition-opacity"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Event Cards Grid */}
      {!loading && !error && filteredEvents.length === 0 && (
        <div className="text-center py-16 bg-surface-container-lowest rounded-xl border border-outline-variant/40">
          <span className="material-symbols-outlined text-5xl text-outline mb-3">event_busy</span>
          <h3 className="text-headline-sm font-semibold text-on-surface">No events found</h3>
          <p className="text-body-md text-on-surface-variant mt-1">
            Try adjusting your search query or selected category.
          </p>
        </div>
      )}

      {!loading && !error && filteredEvents.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {filteredEvents.map((event) => {
            const seatsRemaining = event.seats_left !== undefined ? event.seats_left : event.capacity;
            const isFull = seatsRemaining <= 0 || event.status === 'closed';

            return (
              <article
                key={event.id}
                className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 overflow-hidden flex flex-col justify-between hover:shadow-[0px_4px_12px_rgba(17,24,39,0.06)] transition-all duration-200"
              >
                <div>
                  {/* Media Header */}
                  <div className="relative w-full aspect-video bg-surface-container overflow-hidden group">
                    <img
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      src={event.image}
                      alt={event.title}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-label-badge font-label-badge bg-surface-container-lowest/90 backdrop-blur-sm text-primary border border-outline-variant/30">
                        {event.tag || event.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      {isFull ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-label-badge font-label-badge bg-surface-variant text-on-surface-variant border border-outline-variant/30">
                          Event Full
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-label-badge font-label-badge bg-tertiary-fixed text-tertiary border border-tertiary-container/30">
                          {seatsRemaining} seats left
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Area */}
                  <div className="p-space-md space-y-space-xs">
                    <div className="flex items-center gap-1.5 text-primary text-label-md font-label-md">
                      <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                      <span>{event.date} • {event.time}</span>
                    </div>
                    <h2 className="text-headline-sm font-headline-sm text-on-surface font-bold">
                      {event.title}
                    </h2>
                    <div className="flex items-center gap-1.5 text-on-surface-variant text-body-md font-body-md">
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      <span>{event.venue}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-space-md pt-0">
                  <Link
                    to={`/events/${event.id}`}
                    className="w-full py-2.5 px-space-md bg-primary text-on-primary rounded-lg text-label-lg font-label-lg flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm"
                  >
                    <span>View Details</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

