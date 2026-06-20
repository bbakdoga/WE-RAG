import { useAuth } from '../context/AuthContext';
import { usePoints } from '../context/PointsContext';
import { opportunities } from '../data/opportunities';
import { events } from '../data/events';
import { mentors } from '../data/mentors';
import { leaderboardData, dailySnippet } from '../data/content';
import { Link } from 'react-router-dom';
import { Briefcase, Calendar, MessageCircle, Users, TrendingUp, Zap, ChevronRight, Clock, MapPin, Star, Flame, BookOpen, Trophy, Award } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { points, streak, getTier, getNextTier, weeklyPoints } = usePoints();
  const tier = getTier();
  const nextTier = getNextTier();

  const topOpportunities = opportunities.filter(o => o.matchScore >= 80).slice(0, 3);
  const upcomingEvents = events.filter(e => new Date(e.date) > new Date()).slice(0, 3);
  const topMentors = mentors.filter(m => m.matchScore >= 85).slice(0, 2);
  const top5 = leaderboardData.slice(0, 5);

  const daysUntil = (dateStr) => {
    const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  return (
    <div className="animate-fade-in">
      {/* Welcome Banner */}
      <div className="welcome-banner" style={{ marginBottom: 'var(--space-8)' }}>
        <h2>Hi {user?.name?.split(' ')[0]} 👋</h2>
        <p>Based on your interest in <strong>{user?.interests?.slice(0, 2).join(' & ')}</strong>, we found <strong>{topOpportunities.length} new opportunities</strong> and <strong>{upcomingEvents.length} upcoming events</strong> for you.</p>
        <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-5)' }}>
          <Link to="/opportunities" className="btn btn-secondary" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', backdropFilter: 'blur(8px)' }}>
            View Opportunities <ChevronRight size={16} />
          </Link>
          <Link to="/events" className="btn btn-secondary" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
            Browse Events
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--we-rot-bg)', color: 'var(--we-rot)' }}>
            <Zap size={20} />
          </div>
          <div className="stat-value">{points}</div>
          <div className="stat-label">Total Points <span className="points-delta positive">+{weeklyPoints} this week</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #FF6B35, #F7931E)', color: 'white' }}>
            <Flame size={20} />
          </div>
          <div className="stat-value">{streak}</div>
          <div className="stat-label">Day Streak 🔥</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--we-cyan-light)', color: 'var(--we-cyan)' }}>
            <Trophy size={20} />
          </div>
          <div className="stat-value" style={{ fontSize: 'var(--text-2xl)' }}>{tier.icon} {tier.name}</div>
          <div style={{ marginTop: 'var(--space-2)' }}>
            {nextTier && (
              <>
                <div className="progress-bar" style={{ height: 6 }}>
                  <div className="progress-bar-fill" style={{ width: `${((points - (nextTier.threshold - (nextTier.threshold <= 200 ? 50 : nextTier.threshold <= 500 ? 200 : nextTier.threshold <= 1000 ? 500 : 1000))) / (nextTier.threshold - (nextTier.threshold <= 200 ? 50 : nextTier.threshold <= 500 ? 200 : nextTier.threshold <= 1000 ? 500 : 1000))) * 100}%` }} />
                </div>
                <div className="stat-label" style={{ marginTop: 4 }}>{nextTier.remaining} pts to next tier</div>
              </>
            )}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--we-green-light)', color: 'var(--we-green-dark)' }}>
            <Star size={20} />
          </div>
          <div className="stat-value">{user?.badges?.length || 0}</div>
          <div className="stat-label">Badges Earned</div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Daily Knowledge Snippet */}
          <div className="snippet-card">
            <div className="snippet-tag">
              <BookOpen size={12} /> Daily Spark
            </div>
            <h4 style={{ marginBottom: 'var(--space-2)', fontSize: 'var(--text-base)' }}>{dailySnippet.title}</h4>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-600)', lineHeight: 1.6 }}>{dailySnippet.content}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
              <span className="badge badge-cyan">{dailySnippet.component}</span>
            </div>
          </div>

          {/* Recommended Opportunities */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Briefcase size={20} /> Recommended for You
              </h4>
              <Link to="/opportunities" className="btn btn-ghost btn-sm">
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {topOpportunities.map(opp => (
                <div key={opp.id} className="card card-elevated" style={{ padding: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                    <span className={`badge ${opp.type === 'thesis' ? 'badge-red' : opp.type === 'internship' ? 'badge-cyan' : 'badge-green'}`}>
                      {opp.type.replace('-', ' ')}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-sm)', color: opp.matchScore >= 90 ? 'var(--we-success)' : opp.matchScore >= 75 ? 'var(--we-warning)' : 'var(--we-gray-500)' }}>
                      {opp.matchScore}% match
                    </span>
                  </div>
                  <h5 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-1)' }}>{opp.title}</h5>
                  <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> {opp.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> {opp.duration}</span>
                  </div>
                  {opp.deadline && (
                    <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: daysUntil(opp.deadline) <= 7 ? 'var(--we-error)' : 'var(--we-gray-500)' }}>
                      {daysUntil(opp.deadline) <= 7 ? '⚠️' : '📅'} Deadline: {new Date(opp.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      {daysUntil(opp.deadline) <= 14 && ` (${daysUntil(opp.deadline)} days left)`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Calendar size={20} /> Upcoming Events
              </h4>
              <Link to="/events" className="btn btn-ghost btn-sm">
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {upcomingEvents.map(evt => (
                <div key={evt.id} className="card" style={{ padding: 'var(--space-4)', display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                  <div style={{ width: 50, height: 50, borderRadius: 'var(--radius-md)', background: 'var(--we-gradient-brand)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase' }}>{new Date(evt.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                    <span style={{ fontSize: 'var(--text-lg)', fontWeight: 800, lineHeight: 1 }}>{new Date(evt.date).getDate()}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h5 style={{ fontSize: 'var(--text-sm)', marginBottom: 2 }}>{evt.title}</h5>
                    <div style={{ display: 'flex', gap: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--we-gray-500)' }}>
                      <span>{evt.time}</span>
                      <span className={`badge ${evt.isOnline ? 'badge-cyan' : 'badge-green'}`} style={{ fontSize: 10 }}>{evt.isOnline ? 'Online' : 'In-Person'}</span>
                    </div>
                  </div>
                  <button className={`btn btn-sm ${evt.registered ? 'btn-secondary' : 'btn-primary'}`}>
                    {evt.registered ? '✓ Registered' : 'Register'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Weekly Leaderboard */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h4 style={{ fontSize: 'var(--text-base)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Trophy size={18} /> Weekly Top 5
              </h4>
              <Link to="/leaderboard" className="btn btn-ghost btn-sm" style={{ fontSize: 'var(--text-xs)' }}>
                Full Board <ChevronRight size={12} />
              </Link>
            </div>
            {top5.map((entry, i) => (
              <div key={entry.userId} className={`leaderboard-row ${entry.userId === 'u1' ? 'current-user' : ''}`} style={{ padding: 'var(--space-2) var(--space-3)' }}>
                <span className={`leaderboard-rank ${i === 0 ? 'top-1' : i === 1 ? 'top-2' : i === 2 ? 'top-3' : ''}`} style={{ width: 24, fontSize: 'var(--text-sm)' }}>
                  {i < 3 ? ['🥇','🥈','🥉'][i] : i + 1}
                </span>
                <div className="avatar avatar-sm">{entry.initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--we-black)' }}>{entry.name}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--we-gray-500)' }}>{entry.university}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--we-black)' }}>{entry.points}</div>
                  <div className="points-delta positive" style={{ fontSize: 'var(--text-xs)' }}>+{entry.weeklyDelta}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Suggested Mentors */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h4 style={{ fontSize: 'var(--text-base)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Users size={18} /> Suggested Mentors
              </h4>
              <Link to="/mentoring" className="btn btn-ghost btn-sm" style={{ fontSize: 'var(--text-xs)' }}>
                All Mentors <ChevronRight size={12} />
              </Link>
            </div>
            {topMentors.map(m => (
              <div key={m.id} style={{ display: 'flex', gap: 'var(--space-3)', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--we-gray-100)' }}>
                <div className="avatar">{m.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{m.name}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--we-gray-500)' }}>{m.role}</div>
                  <div style={{ display: 'flex', gap: 'var(--space-1)', marginTop: 'var(--space-1)', flexWrap: 'wrap' }}>
                    {m.expertise.slice(0, 2).map(e => (
                      <span key={e} className="badge badge-gray" style={{ fontSize: 10 }}>{e}</span>
                    ))}
                  </div>
                </div>
                <span className="mentor-match-score match-high" style={{ alignSelf: 'flex-start' }}>
                  {m.matchScore}%
                </span>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="card" style={{ background: 'var(--we-gray-100)' }}>
            <h4 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-4)' }}>Quick Actions</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <Link to="/skills" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <Award size={16} /> Take a Skill Quiz
              </Link>
              <Link to="/community" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <MessageCircle size={16} /> Join a Discussion
              </Link>
              <Link to="/journey" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <TrendingUp size={16} /> AI Career Companion
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
