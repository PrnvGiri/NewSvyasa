const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Fetch list of events with optional search query
 */
export async function fetchEvents(search = '', headers = {}) {
  const url = new URL(`${API_BASE}/events`);
  if (search && search.trim() !== '') {
    url.searchParams.append('search', search.trim());
  }

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.error || errorData.message || 'Failed to fetch events');
  }

  return res.json();
}

/**
 * Fetch detailed event info including booked_seats and seats_left
 */
export async function fetchEventDetails(eventId, headers = {}) {
  const res = await fetch(`${API_BASE}/events/${eventId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.error || errorData.message || 'Failed to fetch event details');
  }

  return res.json();
}

/**
 * Register student for an event
 */
export async function registerForEvent(eventId, headers = {}) {
  const res = await fetch(`${API_BASE}/registrations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify({ event_id: eventId }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const code = data.detail || (typeof data.error === 'string' ? data.error : null);
    const msg = data.message || code || 'Registration failed';
    const err = new Error(msg);
    err.status = res.status;
    err.code = code;
    throw err;
  }

  return data;
}

/**
 * Fetch current user registrations
 */
export async function fetchMyRegistrations(headers = {}) {
  const res = await fetch(`${API_BASE}/me/registrations`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.error || errorData.message || 'Failed to fetch registrations');
  }

  return res.json();
}

/**
 * Fetch attendee list for event (organizer only)
 */
export async function fetchEventAttendees(eventId, headers = {}) {
  const res = await fetch(`${API_BASE}/events/${eventId}/registrations`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.error || errorData.message || 'Failed to fetch attendees');
  }

  return res.json();
}
