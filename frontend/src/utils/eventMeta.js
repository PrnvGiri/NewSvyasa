// Fallback visual metadata mapping to enrich backend events with the design tokens
export const EVENT_METADATA_PRESETS = {
  'AI Build Night': {
    category: 'Hackathon & Workshop',
    tag: 'AI & Data',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDanf3b9p0WOBMFfaUpJBmPJ0jiAScCOQ8lPUvbKbIC87Dg_ctt4XNT2_ZJ8sdJeU9p03L5Qcgj-1vUrO-EvFU4-nhGbU18up07bBYmcAU4IVPNh-5DBSebd_fmUaOSF_T-TbeAbsdHFq7Glo9IN2BBLdt4RhiDbWhetuCrtp-E0OI8nRYTd5-PypYFGrwE5F15FtNSbcr35DxVVTlYUvH_wJXRvYMR2B9R_hrWYcyS',
    date: 'Nov 12, 2025',
    time: '5:00 PM - 9:00 PM',
    venue: 'Main Seminar Hall',
    locationDetail: 'Building B • Level 2, North Wing • Gate 3',
    organizer: 'Campus AI Society & CS Department',
    description: "Join fellow campus builders, student researchers, and developers for an intensive 4-hour hands-on AI sprint. We'll be hacking with local LLMs, multi-agent frameworks, and multimodal APIs. Food, hardware peripherals, and mentorship provided.",
    amenities: [
      { icon: 'restaurant', title: 'Dinner Included', subtitle: 'Pizza & Refreshments', color: 'text-secondary' },
      { icon: 'memory', title: 'Hardware Access', subtitle: 'Edge accelerators & GPUs', color: 'text-primary' },
      { icon: 'school', title: 'Mentorship', subtitle: 'CS Grad Researchers', color: 'text-primary' }
    ],
    itemsToBring: [
      { icon: 'laptop_mac', title: 'Laptop & Charger', subtitle: 'Pre-installed Python 3.10+ or Node.js' },
      { icon: 'badge', title: 'Campus ID', subtitle: 'Required for Seminar Hall security check-in' },
      { icon: 'lightbulb', title: 'Curiosity & Ideas', subtitle: 'Solo or ready to form teams of up to 3' }
    ],
    agenda: [
      { time: '5:00 PM', title: 'Check-in & Networking Dinner', subtitle: 'Badge pick-up, device setup, pizza, and team formation.' },
      { time: '5:30 PM', title: 'Keynote & API Demos', subtitle: 'Quick walkthrough of Ollama, LangChain agents, and multimodal starter kits.' },
      { time: '6:15 PM', title: 'Build Session (Deep Sprint)', subtitle: 'Intensive building with graduate researchers and faculty roaming for technical support.' },
      { time: '8:30 PM', title: 'Lightning Pitches & Awards', subtitle: '2-minute live prototype demonstrations, audience voting, and prize announcements.' }
    ]
  },
  'Robotics Sprint': {
    category: 'Exhibition & Demo',
    tag: 'Robotics',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJGn3LlCmevjFEv2BkYy9Ei-QpQS1DhSV57XoMANT1ipxSH_5pR46UBcwhd8TT2U4Lkxv3CcnMKkBDfaO9-1DkpoJJ1nG3xJWp66ky59pzrN-lUWReBMZGPi9a-yTPCImoatrpMAtjHZy5XH3h2d-xMImNdaf0UQiGki1G--45YwxGzdK1ifRpSglJy21WGDrxWUGG_dEKeJFDKfvHFZ3bfkqQYG5PMtxOR14zeau4',
    date: 'Nov 18, 2025',
    time: '2:00 PM - 6:00 PM',
    venue: 'Engineering Lab 4B',
    locationDetail: 'Engineering Complex • Wing C • Room 402',
    organizer: 'Robotics & Automation Club',
    description: 'An expansive university robotics testing arena featuring sleek autonomous rovers with carbon fiber frames and glowing telemetry navigating obstacle courses.',
    amenities: [
      { icon: 'precision_manufacturing', title: 'Robotics Kits', subtitle: 'Microcontrollers & Sensors', color: 'text-primary' },
      { icon: 'local_cafe', title: 'Snacks & Coffee', subtitle: 'Available throughout event', color: 'text-secondary' },
      { icon: 'workspace_premium', title: 'Certificates', subtitle: 'Issued for all active participants', color: 'text-primary' }
    ],
    itemsToBring: [
      { icon: 'laptop_mac', title: 'Laptop', subtitle: 'With USB-A / USB-C ports for flashing' },
      { icon: 'badge', title: 'Student ID', subtitle: 'For engineering lab security door access' },
      { icon: 'handyman', title: 'Safety Goggles', subtitle: 'Provided on site if needed' }
    ],
    agenda: [
      { time: '2:00 PM', title: 'Lab Briefing & Kit Distribution', subtitle: 'Safety orientation and equipment setup.' },
      { time: '2:45 PM', title: 'Autonomous Navigation Challenge', subtitle: 'Code review and obstacle course calibration.' },
      { time: '5:00 PM', title: 'Time Trials & Showcase', subtitle: 'Live rover demonstrations on testing obstacle track.' }
    ]
  },
  'Open Source Jam': {
    category: 'Coding Sprint',
    tag: 'Open Source',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJL1i28KWrwABFTmmt9eaqPEqn4k5PLFJQVKgq6dK6mIzgR8XwW_2D4Lm7B8o_7OFN1O53vVr1sq6yFGmw3FhFEg02KCSqz2_ek9cohOTTMGI9UlWWGXwzmCtZSrVq_h7MXXBp_S6Oko_Mpyq9s059PSOlGszyBT4dv_MfHTwfKGLWy-KnasKSymKC6WTh4-vQ_1JJdjI6jdGkw7v4GETZ9IsCD7Z0uHFvF3M-kuC-',
    date: 'Nov 25, 2025',
    time: '10:00 AM - 4:00 PM',
    venue: 'Student Innovation Center',
    locationDetail: 'Innovation Commons • Floor 1 • Atrium',
    organizer: 'Open Source Campus Chapter',
    description: 'Collaborate with fellow campus developers to contribute to popular open-source repositories, fix real issues, and submit merged pull requests.',
    amenities: [
      { icon: 'terminal', title: 'Git Workstations', subtitle: 'High-speed gigabit Wi-Fi', color: 'text-primary' },
      { icon: 'lunch_dining', title: 'Catered Lunch', subtitle: 'Sandwiches & Healthy drinks', color: 'text-secondary' },
      { icon: 'card_giftcard', title: 'SWAG & Stickers', subtitle: 'Exclusive open-source badges', color: 'text-primary' }
    ],
    itemsToBring: [
      { icon: 'laptop_mac', title: 'Development Laptop', subtitle: 'Git and GitHub SSH keys configured' },
      { icon: 'badge', title: 'Student Pass', subtitle: 'Access pass for Innovation Center' },
      { icon: 'favorite', title: 'Open Mind', subtitle: 'Beginners warmly welcomed' }
    ],
    agenda: [
      { time: '10:00 AM', title: 'Welcome & Repo Walkthrough', subtitle: 'Good first issues and contribution guidelines.' },
      { time: '11:00 AM', title: 'Pair Programming & Bug Squashing', subtitle: 'Mentors available for pull request reviews.' },
      { time: '3:30 PM', title: 'Merged PR Celebration', subtitle: 'Reviewing impactful contributions made today.' }
    ]
  }
};

export function enrichEvent(event) {
  if (!event) return null;
  const preset = EVENT_METADATA_PRESETS[event.title] || {
    category: 'Campus Workshop',
    tag: 'Technology',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDanf3b9p0WOBMFfaUpJBmPJ0jiAScCOQ8lPUvbKbIC87Dg_ctt4XNT2_ZJ8sdJeU9p03L5Qcgj-1vUrO-EvFU4-nhGbU18up07bBYmcAU4IVPNh-5DBSebd_fmUaOSF_T-TbeAbsdHFq7Glo9IN2BBLdt4RhiDbWhetuCrtp-E0OI8nRYTd5-PypYFGrwE5F15FtNSbcr35DxVVTlYUvH_wJXRvYMR2B9R_hrWYcyS',
    date: 'Spring 2025',
    time: '5:00 PM - 8:00 PM',
    venue: 'Main Seminar Hall',
    locationDetail: 'Campus Center • Hall A',
    organizer: 'University Student Activities',
    description: 'An exciting campus community event open to all university students.',
    amenities: [
      { icon: 'school', title: 'Campus Event', subtitle: 'Verified event', color: 'text-primary' }
    ],
    itemsToBring: [
      { icon: 'badge', title: 'Student ID', subtitle: 'Required for campus entrance' }
    ],
    agenda: [
      { time: '5:00 PM', title: 'Opening & Welcome', subtitle: 'Introductory remarks.' }
    ]
  };

  return {
    ...preset,
    ...event,
    // ensure capacity calculations
    booked_seats: event.booked_seats ?? 0,
    seats_left: event.seats_left !== undefined ? event.seats_left : Math.max(0, (event.capacity || 50) - (event.booked_seats || 0))
  };
}

