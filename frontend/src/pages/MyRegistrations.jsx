import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { fetchMyRegistrations } from '../services/api';
import { enrichEvent } from '../utils/eventMeta';
import { useAuth } from '../context/AuthContext';
import TicketModal from '../components/TicketModal';

export default function MyRegistrations() {
  const location = useLocation();
  const { currentUser, getHeaders } = useAuth();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');

  // Check if redirected from a fresh registration
  const recentSuccess = location.state?.justRegistered ? location.state : null;

  useEffect(() => {
    loadRegistrations();
  }, [currentUser.id]);

  const loadRegistrations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMyRegistrations(getHeaders());
      setRegistrations(data);
    } catch (err) {
      console.error('Error fetching registrations:', err);
      setError(err.message || 'Unable to fetch your registered events');
    } finally {
      setLoading(false);
    }
  };

  // The latest registered event or hero highlight
  const heroEvent = recentSuccess?.event
    ? recentSuccess.event
    : registrations.length > 0 && registrations[0].events
    ? enrichEvent(registrations[0].events)
    : null;

  const heroRegId = recentSuccess?.registrationId
    ? `#CC-${recentSuccess.registrationId.slice(0, 5).toUpperCase()}`
    : registrations.length > 0
    ? `#CC-${registrations[0].id.slice(0, 5).toUpperCase()}`
    : '#CC-84920';

  return (
    <main className="flex-grow max-w-7xl mx-auto w-full px-space-md md:px-margin py-space-lg space-y-space-xl">
      {/* Section 1: Registration Success Hero Card */}
      {heroEvent && (
        <section className="w-full">
          <div className="bg-surface-container-lowest rounded-xl border border-surface-container-highest shadow-sm relative overflow-hidden p-space-md md:p-space-lg">
            {/* Subtle Decorative Accent Background Glow */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-secondary-fixed-dim/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md relative z-10">
              <div className="flex items-start gap-space-sm md:gap-space-md">
                {/* Emerald Success Icon Badge */}
                <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full bg-secondary-container/30 border border-secondary/20 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[32px] md:text-[36px] material-symbols-fill">
                    check_circle
                  </span>
                </div>

                {/* Header Content */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-label-badge font-label-badge bg-secondary-container/40 text-on-secondary-container font-bold border border-secondary/20 uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Confirmed
                    </span>
                    <span className="text-label-md font-label-md text-on-surface-variant font-mono">
                      Registration ID: {heroRegId}
                    </span>
                  </div>
                  <h1 className="text-headline-md md:text-headline-lg font-headline-lg text-on-surface font-bold tracking-tight">
                    {recentSuccess ? `You're Registered for ${heroEvent.title}!` : `Upcoming: ${heroEvent.title}`}
                  </h1>
                  <p className="text-body-md font-body-md text-on-surface-variant flex items-center gap-1.5 pt-0.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">mark_email_read</span>
                    Ticket delivered to <strong className="text-on-surface font-semibold">{currentUser.email}</strong>
                  </p>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 pt-2 lg:pt-0 self-start lg:self-center">
                <button
                  onClick={() =>
                    setSelectedTicket({
                      event: heroEvent,
                      registrationId: heroRegId,
                      userEmail: currentUser.email
                    })
                  }
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary-container text-label-lg font-label-lg font-semibold active:scale-[0.98] transition-all duration-150 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
                  View Ticket
                </button>
                <button
                  onClick={() => alert(`Added ${heroEvent.title} to your calendar!`)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant hover:bg-surface-container hover:border-outline text-on-surface text-label-lg font-label-lg font-medium active:scale-[0.98] transition-all duration-150"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">calendar_add_on</span>
                  Add to Calendar
                </button>
              </div>
            </div>

            {/* Inline Event Meta Bar */}
            <div className="mt-space-md pt-space-sm border-t border-surface-container-highest grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 text-on-surface">
              <div className="flex items-center gap-2.5 py-1 px-2.5 rounded-lg bg-surface-container-low/60">
                <span className="material-symbols-outlined text-primary text-[20px]">event</span>
                <div>
                  <div className="text-body-sm font-body-sm text-on-surface-variant">Date &amp; Time</div>
                  <div className="text-label-lg font-label-lg font-semibold">{heroEvent.date} • {heroEvent.time}</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 py-1 px-2.5 rounded-lg bg-surface-container-low/60">
                <span className="material-symbols-outlined text-primary text-[20px]">pin_drop</span>
                <div>
                  <div className="text-body-sm font-body-sm text-on-surface-variant">Venue</div>
                  <div className="text-label-lg font-label-lg font-semibold">{heroEvent.venue}</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 py-1 px-2.5 rounded-lg bg-surface-container-low/60">
                <span className="material-symbols-outlined text-primary text-[20px]">confirmation_number</span>
                <div>
                  <div className="text-body-sm font-body-sm text-on-surface-variant">Access Pass</div>
                  <div className="text-label-lg font-label-lg font-semibold">Standard Seat • Hall Pass A</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section 2: "My Registrations" List Section */}
      <section className="space-y-space-md" id="my-registrations">
        {/* Section Header & Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-container-highest pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-headline-md font-headline-md text-on-surface font-bold tracking-tight">
                My Registered Events
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-label-badge font-label-badge font-bold">
                {registrations.length} Active
              </span>
            </div>
            <p className="text-body-md font-body-md text-on-surface-variant">
              Keep track of your schedule, access digital tickets, and review check-in details.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-surface-container border border-surface-container-highest self-start sm:self-center">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-1.5 rounded-lg text-label-lg font-label-lg font-semibold transition-all duration-150 ${
                activeTab === 'upcoming'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-4 py-1.5 rounded-lg text-label-lg font-label-lg font-semibold transition-all duration-150 ${
                activeTab === 'past'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Past Events
            </button>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="py-16 text-center text-on-surface-variant">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-body-md">Fetching registrations for {currentUser.email}...</p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="p-4 rounded-xl bg-error-container/40 border border-error/30 text-on-surface">
            <p className="text-body-md font-medium">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && (activeTab === 'past' || registrations.length === 0) && (
          <div className="text-center py-16 bg-surface-container-lowest rounded-xl border border-outline-variant/40">
            <span className="material-symbols-outlined text-5xl text-outline mb-3">
              {activeTab === 'past' ? 'history' : 'event_available'}
            </span>
            <h3 className="text-headline-sm font-semibold text-on-surface">
              {activeTab === 'past' ? 'No past events found' : 'No registrations yet'}
            </h3>
            <p className="text-body-md text-on-surface-variant mt-1">
              {activeTab === 'past'
                ? 'Your completed events will show up here.'
                : 'Browse our catalog and register for upcoming campus hackathons and workshops!'}
            </p>
            {activeTab !== 'past' && (
              <Link
                to="/"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md font-semibold hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined text-sm">search</span>
                Explore Campus Events
              </Link>
            )}
          </div>
        )}

        {/* Bento-style Event Cards Grid */}
        {!loading && !error && activeTab === 'upcoming' && registrations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {registrations.map((reg) => {
              const event = enrichEvent(reg.events);
              if (!event) return null;
              const regId = `#CC-${reg.id.slice(0, 5).toUpperCase()}`;

              return (
                <article
                  key={reg.id}
                  className="bg-surface-container-lowest rounded-xl border border-surface-container-highest overflow-hidden flex flex-col hover:border-outline-variant hover:shadow-[0px_4px_12px_rgba(17,24,39,0.06)] transition-all duration-200"
                >
                  {/* Card Media Header */}
                  <div className="relative aspect-video w-full bg-surface-container-low overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={event.image}
                      alt={event.title}
                    />
                    {/* Floating Category Pill */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary-container/90 text-on-primary-container text-label-badge font-label-badge backdrop-blur-sm">
                      {event.category}
                    </span>
                    {/* Status Badge floating top right */}
                    <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-container/95 text-on-secondary-container text-label-badge font-label-badge font-bold shadow-sm backdrop-blur-sm">
                      <span className="material-symbols-outlined text-[14px]">check</span> Registered
                    </span>
                  </div>

                  {/* Card Body Area */}
                  <div className="p-space-md flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-primary text-label-md font-label-md font-semibold">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        {event.date} • {event.time}
                      </div>
                      <Link
                        to={`/events/${event.id}`}
                        className="text-headline-sm font-headline-sm text-on-surface font-bold hover:text-primary transition-colors block"
                      >
                        {event.title}
                      </Link>
                      <div className="flex items-center gap-2 text-on-surface-variant text-body-sm font-body-sm pt-1">
                        <span className="material-symbols-outlined text-[16px] text-outline shrink-0">
                          location_on
                        </span>
                        <span className="truncate font-medium">{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-2 text-on-surface-variant text-body-sm font-body-sm">
                        <span className="material-symbols-outlined text-[16px] text-outline shrink-0">
                          group
                        </span>
                        <span>Pass {regId} • Registered {new Date(reg.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-space-sm border-t border-surface-container flex items-center justify-between gap-2">
                      <button
                        onClick={() =>
                          setSelectedTicket({
                            event,
                            registrationId: regId,
                            userEmail: currentUser.email
                          })
                        }
                        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-label-lg font-label-lg font-semibold border border-surface-container-highest transition-colors active:scale-[0.98]"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px] text-primary">
                          confirmation_number
                        </span>
                        View Ticket
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Support & Campus Info Callout */}
      <aside className="bg-surface-container-low rounded-xl border border-surface-container-highest p-space-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-container-lowest border border-surface-container-highest flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-[22px]">info</span>
          </div>
          <div>
            <div className="text-label-lg font-label-lg text-on-surface font-semibold">
              Need to transfer or cancel a registration?
            </div>
            <div className="text-body-sm font-body-sm text-on-surface-variant">
              Changes are permitted up to 24 hours prior to event start time through your Student Life Portal.
            </div>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-primary hover:text-primary-container text-label-lg font-label-lg font-semibold whitespace-nowrap cursor-pointer">
          Read Event Policies
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </span>
      </aside>

      {/* Digital Ticket Modal */}
      {selectedTicket && (
        <TicketModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </main>
  );
}

