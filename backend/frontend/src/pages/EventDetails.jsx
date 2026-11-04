import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchEventDetails, registerForEvent, fetchMyRegistrations } from '../services/api';
import { enrichEvent } from '../utils/eventMeta';
import { useAuth } from '../context/AuthContext';
import TicketModal from '../components/TicketModal';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, getHeaders } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [existingRegId, setExistingRegId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [id, currentUser.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch event details
      const eventData = await fetchEventDetails(id, getHeaders());
      const enriched = enrichEvent(eventData);
      setEvent(enriched);

      // Check if current user is already registered for this event
      try {
        const myRegs = await fetchMyRegistrations(getHeaders());
        const match = myRegs.find((r) => r.events && r.events.id === id);
        if (match) {
          setIsRegistered(true);
          setExistingRegId(match.id);
        } else {
          setIsRegistered(false);
          setExistingRegId(null);
        }
      } catch (regErr) {
        console.warn('Could not check user registration status:', regErr);
      }
    } catch (err) {
      console.error('Error loading event:', err);
      setError(err.message || 'Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (isRegistered) {
      setShowTicketModal(true);
      return;
    }

    try {
      setRegistering(true);
      setToastMessage(null);
      const res = await registerForEvent(id, getHeaders());

      setIsRegistered(true);
      setExistingRegId(res.id);

      // Refresh event seat counts
      const updatedEvent = await fetchEventDetails(id, getHeaders());
      setEvent(enrichEvent(updatedEvent));

      // Redirect to confirmation screen with success state
      navigate('/my-registrations', {
        state: {
          justRegistered: true,
          event: enrichEvent(updatedEvent),
          registrationId: res.id
        }
      });
    } catch (err) {
      console.error('Registration failed:', err);
      let msg = err.message;
      if (err.code === 'DUPLICATE_REGISTRATION') {
        msg = 'You are already registered for this event.';
        setIsRegistered(true);
      } else if (err.code === 'EVENT_FULL') {
        msg = 'This event has reached full capacity.';
      }
      setToastMessage({ type: 'error', text: msg });
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <main className="flex-grow max-w-7xl w-full mx-auto px-space-md md:px-margin py-20 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-body-md text-on-surface-variant">Loading event details...</p>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="flex-grow max-w-7xl w-full mx-auto px-space-md md:px-margin py-16">
        <div className="p-8 rounded-xl bg-error-container/40 border border-error/30 text-on-surface">
          <h2 className="text-headline-md font-bold text-error flex items-center gap-2">
            <span className="material-symbols-outlined">error</span>
            Event Not Found
          </h2>
          <p className="mt-2 text-body-md text-on-surface-variant">
            {error || 'Unable to load details for this event.'}
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md font-semibold"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Explore Events
          </Link>
        </div>
      </main>
    );
  }

  const seatsLeft = event.seats_left !== undefined ? event.seats_left : Math.max(0, event.capacity - event.booked_seats);
  const isFull = seatsLeft <= 0 || event.status === 'closed';

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-space-md md:px-margin py-space-md">
      {/* Toast Feedback */}
      {toastMessage && (
        <div
          className={`mb-4 p-4 rounded-xl flex items-center justify-between border ${
            toastMessage.type === 'error'
              ? 'bg-error-container/60 border-error text-on-error-container'
              : 'bg-secondary-container/60 border-secondary text-on-secondary-container'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined">
              {toastMessage.type === 'error' ? 'warning' : 'check_circle'}
            </span>
            <span className="text-label-lg font-medium">{toastMessage.text}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="hover:opacity-75">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-space-sm flex items-center gap-2 text-on-surface-variant text-label-md font-label-md">
        <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
          Explore Events
        </Link>
        <span className="material-symbols-outlined text-sm text-outline">chevron_right</span>
        <span className="text-on-surface font-semibold">{event.title}</span>
      </nav>

      {/* Event Header & Badges Row */}
      <header className="mb-space-lg bg-surface-container-lowest p-space-md rounded-xl border border-outline-variant/40 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container text-primary font-label-badge text-label-badge uppercase tracking-wider mb-2">
              {event.category}
            </div>
            <h1 className="text-headline-lg font-headline-lg text-on-surface tracking-tight font-bold">
              {event.title}
            </h1>
          </div>
          {/* Organization Pill */}
          <div className="flex items-center gap-3 bg-surface-container-low px-3.5 py-2 rounded-xl border border-outline-variant/30">
            <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-xs uppercase">
              {event.title.slice(0, 2)}
            </div>
            <div className="text-left">
              <p className="text-body-sm font-body-sm text-on-surface-variant">Organized by</p>
              <p className="text-label-md font-label-md text-on-surface font-semibold">
                {event.organizer}
              </p>
            </div>
          </div>
        </div>

        {/* Key Facts Badges (Horizontal Row) */}
        <div className="mt-space-md pt-space-sm border-t border-outline-variant/30 flex flex-wrap items-center gap-space-xs md:gap-space-sm">
          {/* Date Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/40 text-on-surface">
            <span className="material-symbols-outlined text-primary text-lg">calendar_today</span>
            <span className="text-label-md font-label-md font-medium">{event.date}</span>
          </div>
          {/* Time Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/40 text-on-surface">
            <span className="material-symbols-outlined text-primary text-lg">schedule</span>
            <span className="text-label-md font-label-md font-medium">{event.time}</span>
          </div>
          {/* Location Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/40 text-on-surface">
            <span className="material-symbols-outlined text-primary text-lg">location_on</span>
            <span className="text-label-md font-label-md font-medium">{event.venue}</span>
          </div>
          {/* Capacity Alert Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-tertiary-container/10 border border-tertiary-container/30 text-tertiary">
            <span className="material-symbols-outlined text-tertiary text-lg animate-pulse">local_fire_department</span>
            <span className="text-label-md font-label-md font-bold">
              {isFull ? 'Event Full' : `${seatsLeft} seats left`}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area: 2-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Left Column: Details & Technical Information */}
        <div className="lg:col-span-7 flex flex-col gap-space-lg">
          {/* Technical Banner Graphic */}
          <div className="rounded-xl overflow-hidden border border-outline-variant/50 relative bg-surface-container aspect-video shadow-sm group">
            <img
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
              src={event.image}
              alt={event.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent flex items-end p-space-md">
              <span className="text-on-primary font-headline-sm text-headline-sm drop-shadow-md font-semibold">
                {event.title} • Hands-on Workshop
              </span>
            </div>
          </div>

          {/* About This Event */}
          <section className="bg-surface-container-lowest p-space-md rounded-xl border border-outline-variant/40 shadow-sm">
            <h2 className="text-headline-sm font-headline-sm text-on-surface mb-space-xs flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-primary">info</span>
              About This Event
            </h2>
            <p className="text-body-lg font-body-lg text-on-surface-variant leading-relaxed mb-space-sm">
              {event.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-xs pt-space-xs">
              {event.amenities && event.amenities.map((item, idx) => (
                <div key={idx} className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/30 flex items-center gap-3">
                  <span className={`material-symbols-outlined ${item.color || 'text-primary'} text-2xl`}>
                    {item.icon}
                  </span>
                  <div>
                    <p className="text-label-md font-label-md text-on-surface font-semibold">{item.title}</p>
                    <p className="text-body-sm font-body-sm text-on-surface-variant">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* What to Bring Bento Section */}
          <section className="bg-surface-container-lowest p-space-md rounded-xl border border-outline-variant/40 shadow-sm">
            <h2 className="text-headline-sm font-headline-sm text-on-surface mb-space-sm flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-primary">inventory_2</span>
              What to Bring
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
              {event.itemsToBring && event.itemsToBring.map((item, idx) => (
                <div key={idx} className="border border-outline-variant/40 rounded-lg p-space-sm bg-surface-container-low flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary mb-2">
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <h3 className="text-title-md font-title-md text-on-surface font-semibold">{item.title}</h3>
                  <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">{item.subtitle}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Agenda Section (Timeline View) */}
          <section className="bg-surface-container-lowest p-space-md rounded-xl border border-outline-variant/40 shadow-sm">
            <h2 className="text-headline-sm font-headline-sm text-on-surface mb-space-md flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-primary">timeline</span>
              Event Agenda
            </h2>
            <div className="relative pl-6 space-y-space-md border-l-2 border-outline-variant/40 ml-3">
              {event.agenda && event.agenda.map((slot, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-background"></div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                    <span className="text-label-lg font-label-lg text-primary font-bold min-w-[70px]">{slot.time}</span>
                    <div>
                      <h3 className="text-title-md font-title-md text-on-surface font-semibold">{slot.title}</h3>
                      <p className="text-body-md font-body-md text-on-surface-variant">{slot.subtitle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Registration & Availability Live Card + 3-State Showcase */}
        <aside className="lg:col-span-5 flex flex-col gap-space-md sticky top-20">
          <div className="bg-surface-container-lowest p-space-md rounded-xl border border-outline-variant/50 shadow-md">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-space-sm mb-space-md">
              <div>
                <h2 className="text-headline-sm font-headline-sm text-on-surface font-bold">
                  Registration &amp; Availability
                </h2>
                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  Live verification with backend guards
                </p>
              </div>
              <span className="material-symbols-outlined text-primary text-2xl">how_to_reg</span>
            </div>

            {/* LIVE ACTIVE REGISTRATION STATE */}
            <div className="space-y-space-md">
              {/* If Current User is already registered -> Render Confirmed State */}
              {isRegistered ? (
                <div className="p-space-sm rounded-lg border-2 border-secondary bg-surface-container-low transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-label-badge font-label-badge bg-secondary text-on-secondary px-2 py-0.5 rounded uppercase">
                      CONFIRMED REGISTRATION
                    </span>
                    <span className="text-body-sm font-body-sm text-secondary font-medium font-mono">
                      {existingRegId ? `#CC-${existingRegId.slice(0, 5).toUpperCase()}` : '#CC-CONFIRMED'}
                    </span>
                  </div>

                  <div className="w-full bg-surface-container-lowest border-2 border-secondary text-secondary font-label-lg text-label-lg py-2.5 px-space-md rounded-lg flex items-center justify-center gap-2 select-none font-semibold">
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                    <span>Registered for Event</span>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-body-sm font-body-sm text-secondary font-medium mt-2">
                    <span className="material-symbols-outlined text-sm">mail</span>
                    <span>Ticket confirmed for {currentUser.email}</span>
                  </div>

                  <button
                    onClick={() => setShowTicketModal(true)}
                    className="mt-3 w-full py-2 px-3 rounded-lg bg-secondary-container text-on-secondary-container font-semibold text-label-md flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-base">confirmation_number</span>
                    View Digital Pass
                  </button>
                </div>
              ) : isFull ? (
                /* If Event is Full -> Render Event Full State */
                <div className="p-space-sm rounded-lg border border-outline-variant/50 bg-surface-container-low">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-label-badge font-label-badge bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded">
                      STATE B: EVENT FULL
                    </span>
                    <span className="text-body-sm font-body-sm text-tertiary font-medium">
                      0 seats remaining
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-tertiary-container/15 text-tertiary border border-tertiary-container/30 mb-3 text-body-sm font-body-sm">
                    <span className="material-symbols-outlined text-base">warning</span>
                    <span>Registration is full - Maximum capacity reached</span>
                  </div>
                  <button
                    disabled
                    className="w-full bg-surface-container-highest text-outline cursor-not-allowed font-label-lg text-label-lg py-2.5 px-space-md rounded-lg flex items-center justify-center gap-2 mb-2 font-semibold"
                  >
                    <span className="material-symbols-outlined text-lg">block</span>
                    <span>Event Full</span>
                  </button>
                  <button
                    onClick={() => alert('Waitlist joined! You will be notified if a seat opens.')}
                    className="w-full bg-surface-container-lowest border border-tertiary text-tertiary hover:bg-tertiary-container/10 font-label-lg text-label-lg py-2 px-space-md rounded-lg flex items-center justify-center gap-1.5 transition-colors font-medium"
                  >
                    <span className="material-symbols-outlined text-base">hourglass_top</span>
                    <span>Join Priority Waitlist</span>
                  </button>
                </div>
              ) : (
                /* Available State -> Register Button */
                <div className="p-space-sm rounded-lg border-2 border-primary/20 bg-surface-container-low transition-all hover:border-primary/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-label-badge font-label-badge bg-primary text-on-primary px-2 py-0.5 rounded">
                      STATE A: AVAILABLE
                    </span>
                    <span className="text-body-sm font-body-sm text-on-surface-variant font-medium">
                      {seatsLeft} seats remaining
                    </span>
                  </div>
                  <button
                    onClick={handleRegister}
                    disabled={registering}
                    className="w-full bg-primary-container text-on-primary-container hover:bg-primary font-label-lg text-label-lg py-2.5 px-space-md rounded-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-sm font-semibold"
                  >
                    {registering ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Registering...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-lg">send</span>
                        <span>Register Now</span>
                      </>
                    )}
                  </button>
                  <p className="text-body-sm font-body-sm text-center text-on-surface-variant mt-2">
                    Quick 1-click campus registration with <strong className="text-on-surface">{currentUser.email}</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Card Meta */}
            <div className="mt-space-md pt-space-sm border-t border-outline-variant/30 flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base text-primary">verified_user</span>
                Campus SSO Protected
              </span>
              <a href="#support" className="text-primary hover:underline font-label-md">Need support?</a>
            </div>
          </div>

          {/* Venue Mini Card */}
          <div className="bg-surface-container-lowest p-space-sm rounded-xl border border-outline-variant/40 shadow-sm flex items-center gap-space-sm">
            <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
              <span className="material-symbols-outlined text-2xl">apartment</span>
            </div>
            <div>
              <h4 className="text-title-md font-title-md text-on-surface font-semibold">{event.venue}</h4>
              <p className="text-body-sm font-body-sm text-on-surface-variant">{event.locationDetail}</p>
            </div>
          </div>
        </aside>
      </div>

      {/* Ticket Modal */}
      {showTicketModal && (
        <TicketModal
          ticket={{
            event,
            registrationId: existingRegId ? `#CC-${existingRegId.slice(0, 5).toUpperCase()}` : '#CC-CONFIRMED',
            userEmail: currentUser.email
          }}
          onClose={() => setShowTicketModal(false)}
        />
      )}
    </main>
  );
}

