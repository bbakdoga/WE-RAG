// UserStore — localStorage + BroadcastChannel service for multi-user state
// Manages user accounts, sessions, progress, and cross-tab real-time sync

const STORAGE_KEYS = {
  USERS: 'we_users',
  SESSION: 'we_current_session',
  ACTIVITY_LOG: 'we_activity_log',
};

const CHANNEL_NAME = 'we-connect-sync';

// ─── Pre-seeded demo accounts ───────────────────────────────────────
const SEED_USERS = {
  'u1': {
    id: 'u1',
    name: 'Anna Müller',
    email: 'anna.mueller@tum.de',
    password: 'pass123',
    role: 'student',
    initials: 'AM',
    university: 'TU Munich',
    program: 'Electrical Engineering & Information Technology',
    degree: 'Master',
    semester: 4,
    expectedGraduation: '2027',
    location: 'Munich, Germany',
    bio: 'Passionate about embedded systems and IoT. Currently working on my thesis about low-power sensor networks.',
    skills: ['Embedded Systems', 'PCB Design', 'C/C++', 'Python', 'IoT', 'Signal Processing'],
    interests: ['Embedded Systems', 'IoT', 'Power Electronics', 'Automotive'],
    careerGoals: ['Thesis', 'Full-time'],
    preferredLocations: ['Munich', 'Stuttgart', 'Remote'],
    points: 847,
    weeklyPoints: 45,
    streak: 12,
    badges: ['b1', 'b2', 'b5', 'b7', 'b10', 'b15'],
    badgeProgress: {
      'b3': { progress: 1, total: 3 },
      'b4': { progress: 1, total: 2 },
      'b6': { progress: 3, total: 5 },
      'b8': { progress: 38, total: 50 },
      'b9': { progress: 12, total: 30 },
      'b11': { progress: 1, total: 3 },
      'b12': { progress: 1, total: 3 },
      'b13': { progress: 0, total: 1 },
      'b14': { progress: 0, total: 1 },
      'b16': { progress: 7, total: 10 },
    },
    eventsAttended: ['e1', 'e3', 'e5'],
    savedOpportunities: ['o2', 'o5', 'o8'],
    joinedDate: '2025-09-15',
    profileCompletion: 92,
    totalPosts: 34,
    totalHelpful: 12,
    quizzesPassed: 5,
    completedQuizzes: ['q1', 'q2', 'q3', 'q5', 'q6'],
  },
  'u2': {
    id: 'u2',
    name: 'Lukas Weber',
    email: 'lukas.weber@kit.edu',
    password: 'pass123',
    role: 'student',
    initials: 'LW',
    university: 'KIT',
    program: 'Mechatronics',
    degree: 'Bachelor',
    semester: 6,
    expectedGraduation: '2027',
    location: 'Karlsruhe, Germany',
    bio: 'Mechatronics enthusiast with a passion for robotics and CAD design. Love building things that move.',
    skills: ['Robotics', 'CAD', 'MATLAB', 'Embedded C', 'SolidWorks'],
    interests: ['Robotics', 'Automotive', 'Embedded Systems'],
    careerGoals: ['Internship', 'Working Student'],
    preferredLocations: ['Karlsruhe', 'Stuttgart', 'Munich'],
    points: 1243,
    weeklyPoints: 72,
    streak: 28,
    badges: ['b1', 'b2', 'b3', 'b5', 'b6', 'b7', 'b9', 'b10', 'b15'],
    badgeProgress: {
      'b4': { progress: 1, total: 2 },
      'b8': { progress: 45, total: 50 },
      'b11': { progress: 2, total: 3 },
      'b12': { progress: 2, total: 3 },
      'b13': { progress: 0, total: 1 },
      'b14': { progress: 1, total: 1 },
      'b16': { progress: 9, total: 10 },
    },
    eventsAttended: ['e1', 'e2', 'e3', 'e4', 'e5'],
    savedOpportunities: ['o1', 'o3', 'o6'],
    joinedDate: '2025-03-10',
    profileCompletion: 100,
    totalPosts: 67,
    totalHelpful: 28,
    quizzesPassed: 8,
    completedQuizzes: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'],
  },
  'u-fresh': {
    id: 'u-fresh',
    name: 'Max Neumann',
    email: 'max.neumann@tum.de',
    password: 'pass123',
    role: 'student',
    initials: 'MN',
    university: 'TU Munich',
    program: 'Computer Science',
    degree: 'Bachelor',
    semester: 1,
    expectedGraduation: '2029',
    location: 'Munich, Germany',
    bio: '',
    skills: [],
    interests: [],
    careerGoals: [],
    preferredLocations: [],
    points: 0,
    weeklyPoints: 0,
    streak: 0,
    badges: [],
    badgeProgress: {},
    eventsAttended: [],
    savedOpportunities: [],
    joinedDate: new Date().toISOString().split('T')[0],
    profileCompletion: 15,
    totalPosts: 0,
    totalHelpful: 0,
    quizzesPassed: 0,
    completedQuizzes: [],
  },
  'admin-1': {
    id: 'admin-1',
    name: 'WE Admin Team',
    email: 'admin@we-online.com',
    password: 'admin123',
    role: 'admin',
    initials: 'WE',
  },
};

// ─── UserStore singleton ────────────────────────────────────────────

class UserStore {
  constructor() {
    this._listeners = new Set();
    this._channel = null;

    // Initialize BroadcastChannel for cross-tab sync
    if (typeof BroadcastChannel !== 'undefined') {
      this._channel = new BroadcastChannel(CHANNEL_NAME);
      this._channel.onmessage = (event) => {
        if (event.data?.type === 'user-updated' || event.data?.type === 'user-created') {
          // Notify all local subscribers
          this._notifyListeners(event.data);
        }
      };
    }

    // Seed data on first load
    this._seedIfNeeded();
  }

  // ── Seeding ─────────────────────────────────────────────────────

  _seedIfNeeded() {
    const existing = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!existing) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
      localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOG, JSON.stringify([]));
    }
  }

  resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITY_LOG);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOG, JSON.stringify([]));
    this._broadcast({ type: 'data-reset' });
  }

  // ── User CRUD ─────────────────────────────────────────────────

  _getAllUsersRaw() {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : {};
  }

  _saveAllUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  getUser(userId) {
    const users = this._getAllUsersRaw();
    return users[userId] || null;
  }

  getAllStudents() {
    const users = this._getAllUsersRaw();
    return Object.values(users).filter(u => u.role === 'student');
  }

  getAllUsers() {
    const users = this._getAllUsersRaw();
    return Object.values(users);
  }

  updateUser(userId, updates) {
    const users = this._getAllUsersRaw();
    if (!users[userId]) return null;
    users[userId] = { ...users[userId], ...updates };
    this._saveAllUsers(users);

    const payload = { type: 'user-updated', userId, updates, user: users[userId] };
    this._broadcast(payload);
    this._notifyListeners(payload);

    return users[userId];
  }

  updateUserProgress(userId, updates) {
    return this.updateUser(userId, updates);
  }

  createUser(userData) {
    const users = this._getAllUsersRaw();
    const id = `u-${Date.now()}`;
    const newUser = {
      id,
      role: 'student',
      points: 0,
      weeklyPoints: 0,
      streak: 0,
      badges: [],
      badgeProgress: {},
      eventsAttended: [],
      savedOpportunities: [],
      joinedDate: new Date().toISOString().split('T')[0],
      profileCompletion: 15,
      totalPosts: 0,
      totalHelpful: 0,
      quizzesPassed: 0,
      completedQuizzes: [],
      ...userData,
      id, // Ensure id isn't overwritten
    };
    users[id] = newUser;
    this._saveAllUsers(users);

    const payload = { type: 'user-created', userId: id, user: newUser };
    this._broadcast(payload);
    this._notifyListeners(payload);

    return newUser;
  }

  // ── Authentication ────────────────────────────────────────────

  login(email, password) {
    const users = this._getAllUsersRaw();
    const user = Object.values(users).find(
      u => u.email === email && u.password === password
    );
    if (!user) return null;

    // Save session
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({
      userId: user.id,
      loginTime: Date.now(),
    }));

    return user;
  }

  logout() {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  }

  getSession() {
    const session = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!session) return null;
    const parsed = JSON.parse(session);
    const user = this.getUser(parsed.userId);
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
      return null;
    }
    return { ...parsed, user };
  }

  register(userData) {
    // Check if email already exists
    const users = this._getAllUsersRaw();
    const existing = Object.values(users).find(u => u.email === userData.email);
    if (existing) return { error: 'Email already registered' };

    const newUser = this.createUser(userData);

    // Auto-login
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({
      userId: newUser.id,
      loginTime: Date.now(),
    }));

    return newUser;
  }

  // ── Activity Log ──────────────────────────────────────────────

  logActivity(userId, action, points, details = {}) {
    const log = this.getActivityLog();
    const user = this.getUser(userId);
    const entry = {
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      userId,
      userName: user?.name || 'Unknown',
      userInitials: user?.initials || '??',
      action,
      points,
      timestamp: new Date().toISOString(),
      ...details,
    };
    log.unshift(entry);
    // Keep last 100 entries
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOG, JSON.stringify(log.slice(0, 100)));

    const payload = { type: 'activity-logged', entry };
    this._broadcast(payload);
    this._notifyListeners(payload);

    return entry;
  }

  getActivityLog() {
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOG);
    return data ? JSON.parse(data) : [];
  }

  // ── Cross-tab Sync ────────────────────────────────────────────

  _broadcast(payload) {
    if (this._channel) {
      try {
        this._channel.postMessage(payload);
      } catch (e) {
        // BroadcastChannel may fail in some contexts
      }
    }
  }

  _notifyListeners(payload) {
    this._listeners.forEach(cb => {
      try { cb(payload); } catch (e) { /* ignore */ }
    });
  }

  subscribe(callback) {
    this._listeners.add(callback);
    return () => this._listeners.delete(callback);
  }
}

// Export singleton
const userStore = new UserStore();
export default userStore;
