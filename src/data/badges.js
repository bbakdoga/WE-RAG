// Badge definitions — the catalog of all possible badges.
// Per-user earned/progress state is stored in UserStore, not here.

export const badgeDefinitions = [
  { id: 'b1', name: 'Embedded Systems Explorer', icon: '🔧', category: 'Skills', description: 'Complete 3 embedded systems quizzes', requirement: 'Pass 3 quizzes in Embedded Systems', rarity: 'Common' },
  { id: 'b2', name: 'PCB Design Beginner', icon: '🎯', category: 'Skills', description: 'Pass the PCB Design fundamentals quiz', requirement: 'Score ≥70% on PCB Design quiz', rarity: 'Common' },
  { id: 'b3', name: 'Power Electronics Pro', icon: '⚡', category: 'Skills', description: 'Master power electronics fundamentals', requirement: 'Pass 3 power electronics quizzes with 90%+', rarity: 'Rare', defaultProgress: { progress: 0, total: 3 } },
  { id: 'b4', name: 'IoT Architect', icon: '📶', category: 'Skills', description: 'Demonstrate IoT design expertise', requirement: 'Pass IoT quiz + submit an IoT project', rarity: 'Rare', defaultProgress: { progress: 0, total: 2 } },
  { id: 'b5', name: 'Innovation Challenge Participant', icon: '🏆', category: 'Events', description: 'Participate in any WE hackathon', requirement: 'Register and attend a hackathon', rarity: 'Common' },
  { id: 'b6', name: 'Workshop Warrior', icon: '🛠️', category: 'Events', description: 'Attend 5 workshops', requirement: 'Complete attendance at 5 WE workshops', rarity: 'Uncommon', defaultProgress: { progress: 0, total: 5 } },
  { id: 'b7', name: 'Career Ready Student', icon: '📚', category: 'Special', description: 'Complete your career readiness journey', requirement: 'Complete profile + 3 quizzes + attend 2 events', rarity: 'Rare' },
  { id: 'b8', name: 'Community Star', icon: '🌟', category: 'Community', description: 'Receive 50 upvotes on your posts', requirement: 'Accumulate 50 total upvotes', rarity: 'Uncommon', defaultProgress: { progress: 0, total: 50 } },
  { id: 'b9', name: '30-Day Streak', icon: '🔥', category: 'Special', description: 'Login for 30 consecutive days', requirement: 'Maintain a 30-day login streak', rarity: 'Rare', defaultProgress: { progress: 0, total: 30 } },
  { id: 'b10', name: 'Thesis Explorer', icon: '🎓', category: 'Projects', description: 'Save and explore 5 thesis topics', requirement: 'Save 5 thesis opportunities', rarity: 'Common' },
  { id: 'b11', name: 'Mentor Connection', icon: '🤝', category: 'Community', description: 'Complete 3 mentoring sessions', requirement: 'Attend 3 mentor meetings', rarity: 'Uncommon', defaultProgress: { progress: 0, total: 3 } },
  { id: 'b12', name: 'Content Creator', icon: '📝', category: 'Community', description: 'Write 3 blog posts or tutorials', requirement: 'Publish 3 blogs on the platform', rarity: 'Rare', defaultProgress: { progress: 0, total: 3 } },
  { id: 'b13', name: 'Competition Champion', icon: '🏅', category: 'Events', description: 'Win any WE challenge or competition', requirement: 'Place 1st in any competition', rarity: 'Legendary', defaultProgress: { progress: 0, total: 1 } },
  { id: 'b14', name: 'Component Master', icon: '🔌', category: 'Skills', description: 'Complete the Component Selection quiz', requirement: 'Score ≥80% on Component Selection quiz', rarity: 'Uncommon', defaultProgress: { progress: 0, total: 1 } },
  { id: 'b15', name: 'First Steps', icon: '👣', category: 'Special', description: 'Complete your first day on WE-Connect', requirement: 'Register and complete profile setup', rarity: 'Common' },
  { id: 'b16', name: 'Helpful Hand', icon: '✋', category: 'Community', description: 'Have 10 answers marked as helpful', requirement: 'Get 10 helpful marks from other students', rarity: 'Uncommon', defaultProgress: { progress: 0, total: 10 } },
];

// Helper: merge badge definitions with a user's earned/progress data
export function getUserBadges(user) {
  if (!user) return badgeDefinitions.map(b => ({ ...b, earned: false, progress: b.defaultProgress?.progress || 0, total: b.defaultProgress?.total || 1 }));

  const earnedIds = new Set(user.badges || []);
  const progressMap = user.badgeProgress || {};

  return badgeDefinitions.map(b => {
    const earned = earnedIds.has(b.id);
    const userProgress = progressMap[b.id];
    return {
      ...b,
      earned,
      earnedDate: earned ? (user.joinedDate || '2026-01-01') : null,
      progress: userProgress?.progress ?? b.defaultProgress?.progress ?? (earned ? 1 : 0),
      total: userProgress?.total ?? b.defaultProgress?.total ?? 1,
    };
  });
}

// Keep backward-compatible exports
export const badges = badgeDefinitions;
export const badgeCategories = ['All', 'Skills', 'Events', 'Community', 'Projects', 'Special'];
export const rarityColors = {
  Common: { bg: '#F0F0F0', text: '#666' },
  Uncommon: { bg: '#E6F6FD', text: '#009EE0' },
  Rare: { bg: '#FFF0F0', text: '#CC0000' },
  Legendary: { bg: '#FFF8E6', text: '#B45309' },
};
