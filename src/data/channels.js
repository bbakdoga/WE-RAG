export const channelCategories = [
  {
    name: 'Products',
    channels: [
      { id: 'ch-inductors', name: 'inductors', icon: '🔌', members: 234, description: 'Discuss WE inductor families — WE-PD, WE-HCI, WE-MAPI and more' },
      { id: 'ch-capacitors', name: 'capacitors', icon: '⚡', members: 189, description: 'Ceramic, electrolytic, film capacitors — selection and application tips' },
      { id: 'ch-connectors', name: 'connectors', icon: '🔗', members: 156, description: 'Board-to-board, wire-to-board, and USB connectors' },
      { id: 'ch-emc', name: 'emc-components', icon: '🛡️', members: 312, description: 'Common mode chokes, ferrites, and EMC filtering solutions' },
      { id: 'ch-leds', name: 'leds-optoelectronics', icon: '💡', members: 98, description: 'LED drivers, indicator LEDs, and optoelectronic solutions' },
      { id: 'ch-sensors', name: 'sensors', icon: '📡', members: 145, description: 'Current sensors, pressure sensors, and sensing solutions' },
    ],
  },
  {
    name: 'Topics',
    channels: [
      { id: 'ch-embedded', name: 'embedded-systems', icon: '🔧', members: 456, description: 'Microcontrollers, firmware, RTOS, and embedded development' },
      { id: 'ch-pcb', name: 'pcb-design', icon: '🎯', members: 389, description: 'PCB layout, design rules, and manufacturing tips' },
      { id: 'ch-iot', name: 'iot-connectivity', icon: '📶', members: 278, description: 'IoT protocols, wireless connectivity, and smart devices' },
      { id: 'ch-power', name: 'power-electronics', icon: '⚙️', members: 345, description: 'Power supply design, DC-DC converters, and energy efficiency' },
      { id: 'ch-auto', name: 'automotive', icon: '🚗', members: 234, description: 'Automotive electronics, ADAS, and EV systems' },
      { id: 'ch-data', name: 'data-science', icon: '📊', members: 167, description: 'Data analysis, ML for engineering, and visualization' },
    ],
  },
  {
    name: 'Projects',
    channels: [
      { id: 'ch-rpi', name: 'raspberry-pi', icon: '🍓', members: 523, description: 'Raspberry Pi projects, tutorials, and troubleshooting' },
      { id: 'ch-arduino', name: 'arduino', icon: '🤖', members: 412, description: 'Arduino projects and maker community' },
      { id: 'ch-formula', name: 'formula-student', icon: '🏎️', members: 89, description: 'Formula Student teams and racing projects' },
      { id: 'ch-thesis', name: 'thesis-projects', icon: '📝', members: 234, description: 'Share and discuss thesis topics and progress' },
    ],
  },
  {
    name: 'Events',
    channels: [
      { id: 'ch-hack26', name: 'hackathon-2026', icon: '🏆', members: 87, description: 'WE Innovation Challenge 2026 discussion and updates' },
      { id: 'ch-seminar', name: 'upcoming-seminars', icon: '🎤', members: 156, description: 'Upcoming seminar announcements and discussions' },
    ],
  },
  {
    name: 'General',
    channels: [
      { id: 'ch-intro', name: 'introductions', icon: '👋', members: 890, description: 'Say hello and introduce yourself to the community' },
      { id: 'ch-career', name: 'career-advice', icon: '💼', members: 567, description: 'Career tips, CV reviews, and job search advice' },
      { id: 'ch-qa', name: 'q-and-a', icon: '❓', members: 678, description: 'Ask technical questions and get help from the community' },
      { id: 'ch-offtopic', name: 'off-topic', icon: '☕', members: 445, description: 'Anything goes — share memes, music, or weekend plans' },
    ],
  },
  {
    name: 'University Groups',
    channels: [
      { id: 'ch-tum', name: 'tu-munich', icon: '🏫', members: 234, description: 'TU Munich student group' },
      { id: 'ch-kit', name: 'kit', icon: '🏫', members: 189, description: 'KIT student group' },
      { id: 'ch-rwth', name: 'rwth-aachen', icon: '🏫', members: 156, description: 'RWTH Aachen student group' },
      { id: 'ch-eth', name: 'eth-zurich', icon: '🏫', members: 134, description: 'ETH Zürich student group' },
    ],
  },
];

export const messages = [
  {
    id: 'm1', channelId: 'ch-embedded', userId: 'u3', userName: 'Sofia Chen', userInitials: 'SC',
    content: 'Has anyone tried the new WE-MAPI series for a compact DC-DC converter? I need something under 3mm height for my wearable project.',
    timestamp: '2026-06-20T08:30:00', reactions: [{ emoji: '👍', count: 5, active: true }, { emoji: '💡', count: 2, active: false }],
    replies: 3, isPinned: false, isQuestion: true,
  },
  {
    id: 'm2', channelId: 'ch-embedded', userId: 'u7', userName: 'Aisha Patel', userInitials: 'AP',
    content: 'Yes! I used the WE-MAPI 4020 in my AUTOSAR project. Excellent thermal performance. Check out the REDEXPERT tool for selecting the right value — it saved me hours.',
    timestamp: '2026-06-20T08:45:00', reactions: [{ emoji: '🔥', count: 8, active: false }, { emoji: '✅', count: 3, active: true }],
    replies: 0, isPinned: false, isHelpful: true,
  },
  {
    id: 'm3', channelId: 'ch-embedded', userId: 'u5', userName: 'Elena Petrova', userInitials: 'EP',
    content: '🚀 Just published my benchmark results comparing WE inductors vs competitors for high-frequency applications. TL;DR: WE-HCI series wins on efficiency above 500kHz. Full write-up in the blogs section!',
    timestamp: '2026-06-20T09:15:00', reactions: [{ emoji: '🔥', count: 15, active: true }, { emoji: '👍', count: 12, active: false }, { emoji: '🎯', count: 4, active: false }],
    replies: 7, isPinned: true,
  },
  {
    id: 'm4', channelId: 'ch-embedded', userId: 'u2', userName: 'Lukas Weber', userInitials: 'LW',
    content: 'Quick tip for anyone doing STM32 development: the new STM32CubeMX has a Würth Elektronik component library built in. Makes BOM generation so much easier.',
    timestamp: '2026-06-20T10:00:00', reactions: [{ emoji: '💡', count: 9, active: false }, { emoji: '👍', count: 6, active: true }],
    replies: 2, isPinned: false,
  },
  {
    id: 'm5', channelId: 'ch-embedded', userId: 'u8', userName: 'Felix Braun', userInitials: 'FB',
    content: 'Hi everyone! 👋 I\'m new here and just starting with embedded systems. Can anyone recommend a good beginner project using WE components? I have an Arduino and basic electronics knowledge.',
    timestamp: '2026-06-20T10:30:00', reactions: [{ emoji: '👋', count: 4, active: false }],
    replies: 5, isPinned: false, isQuestion: true,
  },
  {
    id: 'm6', channelId: 'ch-pcb', userId: 'u1', userName: 'Anna Müller', userInitials: 'AM',
    content: 'Just finished my first 4-layer PCB design! Used WE connectors and EMC components throughout. Would love some feedback from the community — posting the layout in the thread.',
    timestamp: '2026-06-20T07:00:00', reactions: [{ emoji: '🔥', count: 7, active: false }, { emoji: '🎯', count: 3, active: false }],
    replies: 4, isPinned: false,
  },
  {
    id: 'm7', channelId: 'ch-hack26', userId: 'admin', userName: 'WE Team', userInitials: 'WE',
    content: '📢 **HACKATHON UPDATE**: Registration is now open for the WE Innovation Challenge 2026! This year\'s theme: "Wireless Power for a Connected World". Teams of 3-5, prizes worth €10,000+. Register through the Events page!',
    timestamp: '2026-06-19T12:00:00', reactions: [{ emoji: '🔥', count: 34, active: true }, { emoji: '🏆', count: 18, active: false }, { emoji: '🚀', count: 12, active: false }],
    replies: 23, isPinned: true, isAnnouncement: true,
  },
  {
    id: 'm8', channelId: 'ch-career', userId: 'u9', userName: 'Marie Dubois', userInitials: 'MD',
    content: 'Just got offered a working student position at WE in the power electronics team! 🎉 Thanks to everyone here who helped me prepare. The community quiz badges on my profile definitely helped during the interview.',
    timestamp: '2026-06-20T11:00:00', reactions: [{ emoji: '🎉', count: 28, active: true }, { emoji: '👏', count: 15, active: false }, { emoji: '🔥', count: 8, active: false }],
    replies: 12, isPinned: false,
  },
  {
    id: 'm9', channelId: 'ch-intro', userId: 'u10', userName: 'Raj Sharma', userInitials: 'RS',
    content: 'Hey everyone! I\'m Raj, a Computer Science Master student at RWTH Aachen. Interested in applying ML to electronics design problems. Excited to be part of this community! 🙌',
    timestamp: '2026-06-20T09:00:00', reactions: [{ emoji: '👋', count: 11, active: false }, { emoji: '🎉', count: 5, active: false }],
    replies: 3, isPinned: false,
  },
  {
    id: 'm10', channelId: 'ch-rpi', userId: 'u4', userName: 'Max Fischer', userInitials: 'MF',
    content: 'Built a home energy monitor using a Raspberry Pi and WE current sensors! Tracks power consumption in real-time and sends alerts via MQTT. Full tutorial coming to the blog section soon.',
    timestamp: '2026-06-19T15:00:00', reactions: [{ emoji: '🔥', count: 22, active: false }, { emoji: '💡', count: 9, active: false }, { emoji: '⭐', count: 6, active: true }],
    replies: 8, isPinned: true,
  },
];

export const feedHighlights = [
  { type: 'challenge', title: '🏆 Weekly Challenge: Design a 5V/3A Buck Converter', description: 'Use WE components to design the most efficient buck converter. Submit your schematic by Friday!', participants: 34, deadline: '2026-06-27' },
  { type: 'announcement', title: '📢 New Product: WE-MCRI Molded Coupled Inductor', description: 'Check out our latest coupled inductor for multi-phase power supplies. Samples available now!', date: '2026-06-19' },
  { type: 'leaderboard', title: '🏅 This Week\'s Top Contributors', top3: [{ name: 'Elena P.', points: 85 }, { name: 'Lukas W.', points: 72 }, { name: 'Aisha P.', points: 61 }] },
  { type: 'event', title: '🎪 Upcoming: WE Innovation Challenge 2026', description: 'Register now! Only 33 spots remaining.', date: '2026-07-15' },
  { type: 'blog', title: '📖 New Tutorial: EMC Filtering 101', description: 'By Dr. Stefan Gierl — Learn the fundamentals of EMC filter design', author: 'WE Engineering', readTime: '8 min' },
];
