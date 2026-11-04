import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-surface-container-highest bg-surface-container-lowest py-8">
      <div className="max-w-7xl mx-auto px-space-md md:px-margin flex flex-col sm:flex-row items-center justify-between gap-4 text-body-sm font-body-sm text-on-surface-variant">
        <div className="flex items-center gap-2">
          <span className="font-bold text-on-surface">CampusConnect</span>
          <span>•</span>
          <span>University Life &amp; Event Management</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="hover:text-on-surface transition-colors cursor-pointer">Campus Calendar</span>
          <span className="hover:text-on-surface transition-colors cursor-pointer">Privacy Policy</span>
          <span className="hover:text-on-surface transition-colors cursor-pointer">Support Desk</span>
        </div>
      </div>
    </footer>
  );
}

