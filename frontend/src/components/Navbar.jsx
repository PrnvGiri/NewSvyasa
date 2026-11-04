import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { currentUser, switchUser, users } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header class="w-full bg-surface-container-lowest border-b border-surface-container-highest shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-space-md md:px-margin flex items-center justify-between h-16 w-full">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-space-xs hover:opacity-90 transition-opacity">
          <div className="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container shadow-sm">
            <span className="material-symbols-outlined text-[22px]">hub</span>
          </div>
          <span className="text-headline-sm font-headline-sm font-bold text-on-surface tracking-tight">
            CampusConnect
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-space-lg h-full pt-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `font-semibold pb-1 text-label-lg font-label-lg flex items-center h-full transition-colors ${
                isActive
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`
            }
          >
            Explore Events
          </NavLink>
          <NavLink
            to="/my-registrations"
            className={({ isActive }) =>
              `font-semibold pb-1 text-label-lg font-label-lg flex items-center h-full transition-colors ${
                isActive
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`
            }
          >
            My Registrations
          </NavLink>
        </nav>

        {/* Trailing Action: User Profile Pill & Context Switcher */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-space-xs bg-surface-container-low hover:bg-surface-container transition-colors py-1.5 px-3 rounded-full border border-surface-container-highest text-left"
            title="Click to switch student / organizer profile for testing"
          >
            <span className="material-symbols-outlined text-primary text-[20px] material-symbols-fill">
              account_circle
            </span>
            <span className="text-label-md font-label-md text-on-surface-variant font-medium">
              {currentUser.email}
            </span>
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="material-symbols-outlined text-xs text-outline">
              arrow_drop_down
            </span>
          </button>

          {/* User Switcher Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-surface-container-lowest rounded-xl border border-surface-container-highest shadow-xl py-2 z-50">
              <div className="px-3 py-1.5 border-b border-surface-container-highest text-body-sm text-on-surface-variant">
                Switch Test Account (<code className="text-primary font-mono text-[11px]">x-user-id</code>)
              </div>
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    switchUser(u.id);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between text-body-sm hover:bg-surface-container transition-colors ${
                    u.id === currentUser.id
                      ? 'bg-surface-container font-semibold text-primary'
                      : 'text-on-surface'
                  }`}
                >
                  <div>
                    <div className="font-medium">{u.name}</div>
                    <div className="text-xs text-on-surface-variant">{u.email}</div>
                  </div>
                  {u.id === currentUser.id && (
                    <span className="material-symbols-outlined text-primary text-sm">
                      check
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

