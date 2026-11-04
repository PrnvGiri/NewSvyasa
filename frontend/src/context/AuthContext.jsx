import React, { createContext, useContext, useState, useEffect } from 'react';

export const USERS = [
  {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'student1@campus.edu',
    name: 'Student 1',
    role: 'student'
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    email: 'student2@campus.edu',
    name: 'Student 2',
    role: 'student'
  },
  {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'organizer@campus.edu',
    name: 'Campus Organizer',
    role: 'organizer'
  }
];

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('cc_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return USERS[0];
  });

  useEffect(() => {
    localStorage.setItem('cc_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const switchUser = (userId) => {
    const found = USERS.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
    }
  };

  const getHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'x-user-id': currentUser.id
    };
  };

  return (
    <AuthContext.Provider value={{ currentUser, switchUser, users: USERS, getHeaders }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

