import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { quizzes } from '../data/quizzes';
import { badges, badgeCategories, rarityColors } from '../data/badges';
import { usePoints } from '../context/PointsContext';
import { Award, Clock, Users, CheckCircle, Lock, Star, ChevronRight, Zap, Target } from 'lucide-react';
import { staggerContainer, fadeUpVariant, hoverCard, listStagger, listItemFade } from '../utils/animations';
import AnimatedNumber from '../components/AnimatedNumber';

export default function Skills() {
  const [activeTab, setActiveTab] = useState('quizzes');
  const [badgeFilter, setBadgeFilter] = useState('All');
  const { points, getTier } = usePoints();
  const tier = getTier();

  const filteredBadges = badgeFilter === 'All' ? badges : badges.filter(b => b.category === badgeFilter);
  const earnedCount = badges.filter(b => b.earned).length;

  return (
    <motion.div className="animate-fade-in" variants={staggerContainer} initial="hidden" animate="show">
      <motion.div className="page-header" variants={fadeUpVariant}>
        <h1>Skills & Badges</h1>
        <p>Verify your skills with quizzes, earn badges, and build your professional profile.</p>
      </motion.div>

      {/* Stats Bar */}
      <motion.div className="grid-4" variants={staggerContainer} style={{ marginBottom: 'var(--space-8)' }}>
        <motion.div className="stat-card" variants={fadeUpVariant} whileHover={hoverCard.hover}>
          <div className="stat-icon" style={{ background: 'var(--we-rot-bg)', color: 'var(--we-rot)' }}><Zap size={20} /></div>
          <div className="stat-value"><AnimatedNumber value={points} /></div>
          <div className="stat-label">{tier.icon} {tier.name}</div>
        </motion.div>
        <motion.div className="stat-card" variants={fadeUpVariant} whileHover={hoverCard.hover}>
          <div className="stat-icon" style={{ background: 'var(--we-cyan-light)', color: 'var(--we-cyan)' }}><Award size={20} /></div>
          <div className="stat-value"><AnimatedNumber value={earnedCount} /></div>
          <div className="stat-label">Badges Earned</div>
        </motion.div>
        <motion.div className="stat-card" variants={fadeUpVariant} whileHover={hoverCard.hover}>
          <div className="stat-icon" style={{ background: 'var(--we-green-light)', color: 'var(--we-green-dark)' }}><CheckCircle size={20} /></div>
          <div className="stat-value"><AnimatedNumber value={5} /></div>
          <div className="stat-label">Quizzes Passed</div>
        </motion.div>
        <motion.div className="stat-card" variants={fadeUpVariant} whileHover={hoverCard.hover}>
          <div className="stat-icon" style={{ background: 'var(--we-warning-bg)', color: '#B45309' }}><Target size={20} /></div>
          <div className="stat-value"><AnimatedNumber value={badges.filter(b => !b.earned).length} /></div>
          <div className="stat-label">Badges Available</div>
        </motion.div>
      </motion.div>

      {/* Tabs */}
      <motion.div className="tabs" variants={fadeUpVariant}>
        {['quizzes', 'badges', 'points'].map(tab => (
          <button 
            key={tab} 
            className={`tab-item ${activeTab === tab ? 'active' : ''}`} 
            style={{ position: 'relative' }}
            onClick={() => setActiveTab(tab)}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="skillsTabIndicator"
                style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: 2, background: 'var(--we-rot)' }}
              />
            )}
            {tab === 'quizzes' ? 'Skill Quizzes' : tab === 'badges' ? 'Badge Gallery' : 'How to Earn Points'}
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === 'quizzes' && (
          <motion.div key="quizzes" className="grid-2" variants={staggerContainer} initial="hidden" animate="show" exit="hidden">
            {quizzes.map(quiz => (
              <motion.div key={quiz.id} className="card card-elevated" variants={fadeUpVariant} whileHover={hoverCard.hover} style={{ padding: 'var(--space-5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                <span style={{ fontSize: '2rem' }}>{quiz.icon}</span>
                <span className={`badge ${quiz.difficulty === 'Beginner' ? 'badge-green' : quiz.difficulty === 'Intermediate' ? 'badge-warning' : 'badge-red'}`}>
                  {quiz.difficulty}
                </span>
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
                  Start Quiz <ChevronRight size={14} />
                </Link>
              </div>
              {quiz.badgeId && (
                <div style={{ marginTop: 'var(--space-3)', padding: 'var(--space-2) var(--space-3)', background: 'var(--we-green-light)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', color: 'var(--we-green-dark)' }}>
                  🏅 Passing unlocks a verified badge
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

        {activeTab === 'badges' && (
          <motion.div key="badges" variants={staggerContainer} initial="hidden" animate="show" exit="hidden">
            <div className="filter-pills" style={{ marginBottom: 'var(--space-6)', display: 'flex', gap: 'var(--space-2)' }}>
              {badgeCategories.map(cat => (
                <button 
                  key={cat} 
                  className="chip"
                  style={{ 
                    position: 'relative', 
                    background: badgeFilter === cat ? 'transparent' : 'var(--we-white)',
                    borderColor: badgeFilter === cat ? 'transparent' : 'var(--we-gray-200)',
                    color: badgeFilter === cat ? 'var(--we-rot)' : 'var(--we-gray-700)',
                    overflow: 'hidden'
                  }} 
                  onClick={() => setBadgeFilter(cat)}
                >
                  {badgeFilter === cat && (
                    <motion.div
                      layoutId="activeBadgeFilterPill"
                      style={{ position: 'absolute', inset: 0, background: 'var(--we-rot-bg)', zIndex: 0, borderRadius: 'var(--radius-2xl)', border: '1px solid var(--we-rot)' }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span style={{ position: 'relative', zIndex: 1 }}>{cat}</span>
                </button>
              ))}
            </div>
            <motion.div layout className="grid-3">
              <AnimatePresence>
                {filteredBadges.map(badge => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.05 }}
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
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--we-success)' }}>✅ Earned {new Date(badge.earnedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                ) : (
                  <div>
                    <div className="progress-bar" style={{ marginBottom: 'var(--space-1)', height: 6 }}>
                      <div className="progress-bar-fill cyan" style={{ width: `${(badge.progress / badge.total) * 100}%` }} />
                    </div>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--we-gray-400)' }}>{badge.progress}/{badge.total} — {badge.requirement}</span>
                  </div>
                  )}
                </motion.div>
              ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'points' && (
          <motion.div key="points" className="card" style={{ maxWidth: 600 }} variants={staggerContainer} initial="hidden" animate="show" exit="hidden">
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
                <motion.div key={i} variants={listItemFade} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', background: i % 2 === 0 ? 'var(--we-gray-50)' : 'transparent' }}>
                  <span style={{ fontSize: '1.2rem', width: 30, textAlign: 'center' }}>{item.icon}</span>
                  <span style={{ flex: 1, fontSize: 'var(--text-sm)' }}>{item.action}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--we-success)' }}>+{item.pts}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
