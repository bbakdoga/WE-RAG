import { useState } from 'react';
import { Link } from 'react-router-dom';
import { quizzes } from '../data/quizzes';
import { getUserBadges, badgeCategories, rarityColors } from '../data/badges';
import { useAuth } from '../context/AuthContext';
import { usePoints } from '../context/PointsContext';
import { Award, Clock, Users, CheckCircle, Lock, Star, ChevronRight, Zap, Target } from 'lucide-react';
import AnimatedNumber from '../components/AnimatedNumber';

export default function Skills() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('quizzes');
  const [badgeFilter, setBadgeFilter] = useState('All');
  const { points, getTier } = usePoints();
  const tier = getTier();

  const allBadges = getUserBadges(user);
  const filteredBadges = badgeFilter === 'All' ? allBadges : allBadges.filter(b => b.category === badgeFilter);
  const earnedCount = allBadges.filter(b => b.earned).length;
  const userQuizzesPassed = user?.quizzesPassed || 0;
  const completedQuizIds = new Set(user?.completedQuizzes || []);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Skills & Badges</h1>
        <p>Verify your skills with quizzes, earn badges, and build your professional profile.</p>
      </div>

      {/* Stats Bar */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--we-rot-bg)', color: 'var(--we-rot)' }}><Zap size={20} /></div>
          <div className="stat-value"><AnimatedNumber value={points} /></div>
          <div className="stat-label">{tier.icon} {tier.name}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--we-cyan-light)', color: 'var(--we-cyan)' }}><Award size={20} /></div>
          <div className="stat-value"><AnimatedNumber value={earnedCount} /></div>
          <div className="stat-label">Badges Earned</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--we-green-light)', color: 'var(--we-green-dark)' }}><CheckCircle size={20} /></div>
          <div className="stat-value"><AnimatedNumber value={userQuizzesPassed} /></div>
          <div className="stat-label">Quizzes Passed</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--we-warning-bg)', color: '#B45309' }}><Target size={20} /></div>
          <div className="stat-value"><AnimatedNumber value={allBadges.filter(b => !b.earned).length} /></div>
          <div className="stat-label">Badges Available</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {['quizzes', 'badges', 'points'].map(tab => (
          <button
            key={tab}
            className={`tab-item ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'quizzes' ? 'Skill Quizzes' : tab === 'badges' ? 'Badge Gallery' : 'How to Earn Points'}
          </button>
        ))}
      </div>

      {activeTab === 'quizzes' && (
        <div className="grid-2">
          {quizzes.map(quiz => {
            const isCompleted = completedQuizIds.has(quiz.id);
            return (
              <div key={quiz.id} className="card card-elevated" style={{ padding: 'var(--space-5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                  <span style={{ fontSize: '2rem' }}>{quiz.icon}</span>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                    {isCompleted && <span className="badge badge-green">✅ Passed</span>}
                    <span className={`badge ${quiz.difficulty === 'Beginner' ? 'badge-green' : quiz.difficulty === 'Intermediate' ? 'badge-warning' : 'badge-red'}`}>
                      {quiz.difficulty}
                    </span>
                  </div>
                </div>
                <h4 style={{ marginBottom: 'var(--space-2)' }}>{quiz.title}</h4>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)', marginBottom: 'var(--space-4)' }}>{quiz.description}</p>
                <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)', marginBottom: 'var(--space-4)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Target size={14} /> {quiz.questions} questions</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> {quiz.duration} min</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={14} /> {quiz.completions}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--we-gray-400)' }}>Avg. score: {quiz.avgScore}% · Pass: {quiz.passScore}%</span>
                  <Link to={`/skills/quiz/${quiz.id}`} className="btn btn-primary btn-sm">
                    {isCompleted ? 'Retake' : 'Start Quiz'} <ChevronRight size={14} />
                  </Link>
                </div>
                {quiz.badgeId && (
                  <div style={{ marginTop: 'var(--space-3)', padding: 'var(--space-2) var(--space-3)', background: 'var(--we-green-light)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', color: 'var(--we-green-dark)' }}>
                    🏅 Passing unlocks a verified badge
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'badges' && (
        <div>
          <div className="filter-pills" style={{ marginBottom: 'var(--space-6)', display: 'flex', gap: 'var(--space-2)' }}>
            {badgeCategories.map(cat => (
              <button
                key={cat}
                className="chip"
                style={{
                  background: badgeFilter === cat ? 'var(--we-rot-bg)' : 'var(--we-white)',
                  borderColor: badgeFilter === cat ? 'var(--we-rot)' : 'var(--we-gray-200)',
                  color: badgeFilter === cat ? 'var(--we-rot)' : 'var(--we-gray-700)',
                }}
                onClick={() => setBadgeFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="grid-3">
            {filteredBadges.map(badge => (
              <div
                key={badge.id}
                className={`card ${badge.earned ? 'card-elevated' : ''}`}
                style={{ padding: 'var(--space-5)', textAlign: 'center', opacity: badge.earned ? 1 : 0.7, position: 'relative' }}
              >
                {badge.earned && <div style={{ position: 'absolute', top: 12, right: 12 }}><CheckCircle size={18} style={{ color: 'var(--we-success)' }} /></div>}
                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)', filter: badge.earned ? 'none' : 'grayscale(0.5)' }}>{badge.icon}</div>
                <h4 style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>{badge.name}</h4>
                <span className="badge" style={{ background: rarityColors[badge.rarity]?.bg, color: rarityColors[badge.rarity]?.text, marginBottom: 'var(--space-2)', display: 'inline-flex' }}>
                  {badge.rarity}
                </span>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--we-gray-500)', marginBottom: 'var(--space-3)' }}>{badge.description}</p>
                {badge.earned ? (
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--we-success)' }}>✅ Earned</span>
                ) : (
                  <div>
                    <div className="progress-bar" style={{ marginBottom: 'var(--space-1)', height: 6 }}>
                      <div className="progress-bar-fill cyan" style={{ width: `${(badge.progress / badge.total) * 100}%` }} />
                    </div>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--we-gray-400)' }}>{badge.progress}/{badge.total} — {badge.requirement}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'points' && (
        <div className="card" style={{ maxWidth: 600 }}>
          <h3 style={{ marginBottom: 'var(--space-5)' }}>How to Earn Points</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            {[
              { action: 'Daily login (streak)', pts: 2, icon: '🔥' },
              { action: 'Post a message', pts: 1, icon: '💬' },
              { action: 'Receive an upvote', pts: 2, icon: '👍' },
              { action: 'Helpful answer (marked)', pts: 5, icon: '✅' },
              { action: 'Complete a skill quiz', pts: 10, icon: '📝' },
              { action: 'Score 80%+ bonus', pts: 5, icon: '⭐' },
              { action: 'Attend an event', pts: 15, icon: '🎪' },
              { action: 'Submit a project', pts: 20, icon: '🚀' },
              { action: 'Win a challenge', pts: 50, icon: '🏅' },
              { action: 'Refer a friend', pts: 10, icon: '🤝' },
              { action: 'Write a blog/tutorial', pts: 25, icon: '📖' },
              { action: 'Star on project', pts: 3, icon: '⭐' },
              { action: 'Comment on a post', pts: 1, icon: '💭' },
              { action: 'Complete profile 100%', pts: 20, icon: '✨' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', background: i % 2 === 0 ? 'var(--we-gray-50)' : 'transparent' }}>
                <span style={{ fontSize: '1.2rem', width: 30, textAlign: 'center' }}>{item.icon}</span>
                <span style={{ flex: 1, fontSize: 'var(--text-sm)' }}>{item.action}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--we-success)' }}>+{item.pts}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
