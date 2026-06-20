export const badges = [
  {
    id: 'b1', name: 'Embedded Systems Explorer', icon: '🔧', category: 'Skills',
    description: 'Complete 3 embedded systems quizzes', requirement: 'Pass 3 quizzes in Embedded Systems',
    earned: true, earnedDate: '2026-03-15', rarity: 'Common',
  },
  {
    id: 'b2', name: 'PCB Design Beginner', icon: '🎯', category: 'Skills',
    description: 'Pass the PCB Design fundamentals quiz', requirement: 'Score ≥70% on PCB Design quiz',
    earned: true, earnedDate: '2026-02-20', rarity: 'Common',
  },
  {
    id: 'b3', name: 'Power Electronics Pro', icon: '⚡', category: 'Skills',
    description: 'Master power electronics fundamentals', requirement: 'Pass 3 power electronics quizzes with 90%+',
    earned: false, progress: 1, total: 3, rarity: 'Rare',
  },
  {
    id: 'b4', name: 'IoT Architect', icon: '📶', category: 'Skills',
    description: 'Demonstrate IoT design expertise', requirement: 'Pass IoT quiz + submit an IoT project',
    earned: false, progress: 1, total: 2, rarity: 'Rare',
  },
  {
    id: 'b5', name: 'Innovation Challenge Participant', icon: '🏆', category: 'Events',
    description: 'Participate in any WE hackathon', requirement: 'Register and attend a hackathon',
    earned: true, earnedDate: '2025-11-20', rarity: 'Common',
  },
  {
    id: 'b6', name: 'Workshop Warrior', icon: '🛠️', category: 'Events',
    description: 'Attend 5 workshops', requirement: 'Complete attendance at 5 WE workshops',
    earned: false, progress: 3, total: 5, rarity: 'Uncommon',
  },
  {
    id: 'b7', name: 'Career Ready Student', icon: '📚', category: 'Special',
    description: 'Complete your career readiness journey', requirement: 'Complete profile + 3 quizzes + attend 2 events',
    earned: true, earnedDate: '2026-04-10', rarity: 'Rare',
  },
  {
    id: 'b8', name: 'Community Star', icon: '🌟', category: 'Community',
    description: 'Receive 50 upvotes on your posts', requirement: 'Accumulate 50 total upvotes',
    earned: false, progress: 38, total: 50, rarity: 'Uncommon',
  },
  {
    id: 'b9', name: '30-Day Streak', icon: '🔥', category: 'Special',
    description: 'Login for 30 consecutive days', requirement: 'Maintain a 30-day login streak',
    earned: false, progress: 12, total: 30, rarity: 'Rare',
  },
  {
    id: 'b10', name: 'Thesis Explorer', icon: '🎓', category: 'Projects',
    description: 'Save and explore 5 thesis topics', requirement: 'Save 5 thesis opportunities',
    earned: true, earnedDate: '2026-05-01', rarity: 'Common',
  },
  {
    id: 'b11', name: 'Mentor Connection', icon: '🤝', category: 'Community',
    description: 'Complete 3 mentoring sessions', requirement: 'Attend 3 mentor meetings',
    earned: false, progress: 1, total: 3, rarity: 'Uncommon',
  },
  {
    id: 'b12', name: 'Content Creator', icon: '📝', category: 'Community',
    description: 'Write 3 blog posts or tutorials', requirement: 'Publish 3 blogs on the platform',
    earned: false, progress: 1, total: 3, rarity: 'Rare',
  },
  {
    id: 'b13', name: 'Competition Champion', icon: '🏅', category: 'Events',
    description: 'Win any WE challenge or competition', requirement: 'Place 1st in any competition',
    earned: false, progress: 0, total: 1, rarity: 'Legendary',
  },
  {
    id: 'b14', name: 'Component Master', icon: '🔌', category: 'Skills',
    description: 'Complete the Component Selection quiz', requirement: 'Score ≥80% on Component Selection quiz',
    earned: false, progress: 0, total: 1, rarity: 'Uncommon',
  },
  {
    id: 'b15', name: 'First Steps', icon: '👣', category: 'Special',
    description: 'Complete your first day on WE-Connect', requirement: 'Register and complete profile setup',
    earned: true, earnedDate: '2025-09-15', rarity: 'Common',
  },
  {
    id: 'b16', name: 'Helpful Hand', icon: '✋', category: 'Community',
    description: 'Have 10 answers marked as helpful', requirement: 'Get 10 helpful marks from other students',
    earned: false, progress: 7, total: 10, rarity: 'Uncommon',
  },
];

export const badgeCategories = ['All', 'Skills', 'Events', 'Community', 'Projects', 'Special'];
export const rarityColors = {
  Common: { bg: '#F0F0F0', text: '#666' },
  Uncommon: { bg: '#E6F6FD', text: '#009EE0' },
  Rare: { bg: '#FFF0F0', text: '#CC0000' },
  Legendary: { bg: '#FFF8E6', text: '#B45309' },
};
