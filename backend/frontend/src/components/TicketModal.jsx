import React from 'react';

export default function TicketModal({ ticket, onClose }) {
  if (!ticket) return null;

  const event = ticket.event || ticket;
  const registrationId = ticket.registrationId || (ticket.id ? `#CC-${ticket.id.slice(0, 5).toUpperCase()}` : '#CC-84920');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-highest shadow-2xl max-w-md w-full overflow-hidden relative">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-primary-container to-primary p-6 text-on-primary">
          <div className="flex items-center justify-between">
            <span className="text-label-badge uppercase tracking-widest font-bold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm">
              Official Campus Pass
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
          <h3 className="text-headline-sm font-bold mt-4 tracking-tight">
            {event.title}
          </h3>
          <p className="text-body-sm opacity-90 mt-1 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">location_on</span>
            {event.venue || 'Main Seminar Hall'}
          </p>
        </div>

        {/* Ticket Body */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-surface-container-highest">
            <div>
              <p className="text-body-sm text-on-surface-variant">Date</p>
              <p className="text-label-lg font-semibold text-on-surface">{event.date || 'Nov 12, 2025'}</p>
            </div>
            <div>
              <p className="text-body-sm text-on-surface-variant">Time</p>
              <p className="text-label-lg font-semibold text-on-surface">{event.time || '5:00 PM'}</p>
            </div>
            <div>
              <p className="text-body-sm text-on-surface-variant">Pass Holder</p>
              <p className="text-label-lg font-semibold text-on-surface truncate">{ticket.userEmail || 'student1@campus.edu'}</p>
            </div>
            <div>
              <p className="text-body-sm text-on-surface-variant">Pass ID</p>
              <p className="text-label-lg font-semibold font-mono text-primary">{registrationId}</p>
            </div>
          </div>

          {/* Barcode & Check-in simulation */}
          <div className="bg-surface-container-low p-4 rounded-xl text-center space-y-2 border border-outline-variant/30">
            <div className="flex justify-center items-center gap-1 h-12 py-1 px-4 bg-white rounded border border-outline-variant/40">
              {/* Simulated barcode bars */}
              {[4, 2, 5, 1, 3, 6, 2, 4, 1, 3, 5, 2, 4, 3, 1, 6, 2, 5, 3, 4, 2].map((height, i) => (
                <div
                  key={i}
                  className="bg-on-surface w-1"
                  style={{ height: `${height * 6 + 12}px` }}
                />
              ))}
            </div>
            <p className="text-body-sm font-mono text-on-surface-variant">
              SCAN AT DOOR • GATE SECURITY VERIFIED
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => window.print()}
              className="flex-1 py-2.5 px-4 rounded-lg bg-primary-container text-on-primary-container font-semibold text-label-lg hover:bg-primary transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">print</span>
              Print Ticket
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-lg bg-surface-container-low text-on-surface font-semibold text-label-lg hover:bg-surface-container transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

