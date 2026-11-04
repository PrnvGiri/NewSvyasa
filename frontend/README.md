# CampusConnect - Frontend

Modern React application built with **Vite**, **Tailwind CSS**, and **React Router**, faithfully implementing the CampusConnect Event Discovery platform design system and connecting directly to the FastAPI + Supabase backend.

---

## 🚀 Features

- **Explore Events Catalog (`/`)**:
  - Live search connected to `GET /api/events?search=`
  - Category filters: *All, AI, Robotics, Open Source, Design, Career*
  - Responsive Bento card grid (3 columns desktop, 2 columns tablet, 1 column mobile)
  - Real-time seat availability calculation and status badges (`X seats left` or `Event Full`)
- **Event Details & Registration (`/events/:id`)**:
  - Breadcrumb navigation
  - Full workshop details, technical overview, perks (*Dinner Included, Hardware Access, Mentorship*), what to bring, and timeline agenda
  - **Dynamic 3-State Registration Box**:
    - **State A (Available)**: One-click "Register Now" button with immediate feedback
    - **State B (Event Full)**: Alert banner with disabled CTA and priority waitlist option
    - **State C (Confirmed)**: Emerald confirmation ribbon, registered badge, ticket delivery notice, and digital ticket modal
  - Real-time error handling: handles duplicate registrations (`409 Conflict`), capacity exhaustion (`409 Conflict`), or closed events (`400 Bad Request`)
- **My Registrations (`/my-registrations`)**:
  - Hero registration confirmation card with registration ID and quick calendar / ticket actions
  - Grid of registered events for the authenticated student (`GET /api/me/registrations`)
  - "Upcoming" and "Past Events" filter tabs
  - Digital Ticket modal with simulated scan barcode and print support
- **Test Context Switcher (Top Navbar)**:
  - Quickly switch between **Student 1** (`student1@campus.edu`), **Student 2** (`student2@campus.edu`), and **Organizer** (`organizer@campus.edu`) to test user isolation, duplicate registration guards, and attendee permissions.

---

## 🛠️ Getting Started

### 1. Start the Backend
From the root directory:
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```
Backend will be available at: `http://localhost:8000` (Docs at `/docs`)

### 2. Start the Frontend
From the root directory:
```bash
cd frontend
npm install
npm run dev
```
Frontend will be running at: `http://localhost:3000`

---

## 📁 Project Structure

```
frontend/
├── index.html               # Inter & Material Symbols Outlined fonts
├── package.json
├── tailwind.config.js       # Design system tokens (colors, typography, radii, spacing)
├── vite.config.js           # Vite dev server + proxy to http://localhost:8000
├── src/
│   ├── main.jsx             # React entry point with BrowserRouter & AuthProvider
│   ├── App.jsx              # Application routes & layout
│   ├── index.css            # Tailwind directives + symbol styles
│   ├── context/
│   │   └── AuthContext.jsx  # Student/Organizer switcher & x-user-id header management
│   ├── services/
│   │   └── api.js           # FastAPI backend integration (events, register, my registrations)
│   ├── utils/
│   │   └── eventMeta.js     # Design system presets, imagery, and event enrichment
│   ├── components/
│   │   ├── Navbar.jsx       # Top navigation bar with active states & user switcher
│   │   ├── Footer.jsx       # Standard platform footer
│   │   └── TicketModal.jsx  # Official campus pass modal with barcode
│   └── pages/
│       ├── ExploreEvents.jsx     # Event catalog & search
│       ├── EventDetails.jsx      # Event details & interactive 3-state registration
│       └── MyRegistrations.jsx   # Registrations list & confirmation card
```

