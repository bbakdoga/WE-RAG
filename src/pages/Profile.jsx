import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePoints } from '../context/PointsContext';
import { getUserBadges } from '../data/badges';
import { opportunities } from '../data/opportunities';
import { MapPin, Mail, GraduationCap, Calendar, Award, Star, Bookmark, ExternalLink, Edit3, Share2, Printer, Download } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const { points, getTier, streak } = usePoints();
  const tier = getTier();
  const [activeTab, setActiveTab] = useState('overview');
  const allBadges = getUserBadges(user);
  const earnedBadges = allBadges.filter(b => b.earned);
  const savedOpps = opportunities.filter(o => user?.savedOpportunities?.includes(o.id));

  return (
    <div className="animate-fade-in">
      {/* Profile Header */}
      <div className="card card-elevated" style={{ padding: 'var(--space-8)', marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div className="avatar avatar-xl" style={{ fontSize: '2.5rem' }}>{user?.initials}</div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-1)' }}>
              <h2 style={{ margin: 0 }}>{user?.name}</h2>
              <span className="badge badge-red">{tier.icon} {tier.name}</span>
            </div>
            <p style={{ color: 'var(--we-gray-500)', marginBottom: 'var(--space-3)' }}>{user?.program} · {user?.degree}</p>
            <div style={{ display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap', fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)', marginBottom: 'var(--space-3)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><GraduationCap size={14} /> {user?.university}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={14} /> Semester {user?.semester}</span>
              {user?.location && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> {user.location}</span>}
            </div>
            {user?.bio && <p style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>{user.bio}</p>}
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              {user?.skills?.map(s => <span key={s} className="badge badge-cyan">{s}</span>)}
              {(!user?.skills || user.skills.length === 0) && (
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-400)' }}>No skills added yet. Take quizzes to earn skill badges!</span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', alignItems: 'flex-end' }}>
            <button className="btn btn-secondary btn-sm"><Edit3 size={14} /> Edit Profile</button>
            <button className="btn btn-ghost btn-sm"><Share2 size={14} /> Share</button>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'flex', gap: 'var(--space-8)', marginTop: 'var(--space-6)', paddingTop: 'var(--space-5)', borderTop: '1px solid var(--we-gray-200)', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-2xl)', color: 'var(--we-rot)' }}>{points}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--we-gray-500)' }}>Points</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-2xl)' }}>🔥 {streak}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--we-gray-500)' }}>Day Streak</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-2xl)' }}>{earnedBadges.length}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--we-gray-500)' }}>Badges</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-2xl)' }}>{user?.totalPosts || 0}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--we-gray-500)' }}>Posts</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-2xl)' }}>{user?.quizzesPassed || 0}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--we-gray-500)' }}>Quizzes</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`tab-item ${activeTab === 'passport' ? 'active' : ''}`} onClick={() => setActiveTab('passport')}>WE-Passport</button>
        <button className={`tab-item ${activeTab === 'badges' ? 'active' : ''}`} onClick={() => setActiveTab('badges')}>Badges</button>
        <button className={`tab-item ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')}>Saved</button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid-2">
          <div>
            <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
              <h4 style={{ marginBottom: 'var(--space-4)' }}>Career Goals</h4>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {user?.careerGoals?.length > 0
                  ? user.careerGoals.map(g => <span key={g} className="badge badge-red">{g}</span>)
                  : <span style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-400)' }}>Not set yet</span>
                }
              </div>
            </div>
            <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
              <h4 style={{ marginBottom: 'var(--space-4)' }}>Interests</h4>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {user?.interests?.length > 0
                  ? user.interests.map(i => <span key={i} className="chip active">{i}</span>)
                  : <span style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-400)' }}>No interests selected yet</span>
                }
              </div>
            </div>
            <div className="card">
              <h4 style={{ marginBottom: 'var(--space-4)' }}>Preferred Locations</h4>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {user?.preferredLocations?.length > 0
                  ? user.preferredLocations.map(l => <span key={l} className="badge badge-gray"><MapPin size={10} /> {l}</span>)
                  : <span style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-400)' }}>Not set yet</span>
                }
              </div>
            </div>
          </div>
          <div>
            <div className="card">
              <h4 style={{ marginBottom: 'var(--space-4)' }}>Profile Completion</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                <div className="progress-bar" style={{ flex: 1, height: 10 }}>
                  <div className="progress-bar-fill green" style={{ width: `${user?.profileCompletion || 0}%` }} />
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{user?.profileCompletion || 0}%</span>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)' }}>Complete your profile to unlock +20 points and better opportunity matching!</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'passport' && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div>
            <div className="passport-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>WE-Student Passport</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700 }}>Würth Elektronik</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.15)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                  {tier.icon} {tier.name}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-5)', marginBottom: 'var(--space-5)' }}>
                <div className="avatar avatar-lg" style={{ border: '3px solid rgba(255,255,255,0.3)' }}>{user?.initials}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-xl)', marginBottom: 2 }}>{user?.name}</div>
                  <div style={{ opacity: 0.8, fontSize: 'var(--text-sm)' }}>{user?.university}</div>
                  <div style={{ opacity: 0.8, fontSize: 'var(--text-sm)' }}>{user?.program}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
                <div><div style={{ fontSize: 'var(--text-xs)', opacity: 0.6 }}>Member Since</div><div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{user?.joinedDate ? new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}</div></div>
                <div><div style={{ fontSize: 'var(--text-xs)', opacity: 0.6 }}>Points</div><div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)' }}>{points}</div></div>
                <div><div style={{ fontSize: 'var(--text-xs)', opacity: 0.6 }}>Badges</div><div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{earnedBadges.length} earned</div></div>
                <div><div style={{ fontSize: 'var(--text-xs)', opacity: 0.6 }}>Streak</div><div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>🔥 {streak} days</div></div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {earnedBadges.slice(0, 5).map(b => (
                  <span key={b.id} style={{ fontSize: '1.5rem' }} title={b.name}>{b.icon}</span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', marginTop: 'var(--space-5)' }}>
              <button className="btn btn-secondary"><Share2 size={14} /> Share on LinkedIn</button>
              <button className="btn btn-secondary"><Printer size={14} /> Print</button>
              <button className="btn btn-secondary"><Download size={14} /> Download</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'badges' && (
        <div className="grid-4" style={{ gap: 'var(--space-4)' }}>
          {earnedBadges.length > 0 ? earnedBadges.map(b => (
            <div key={b.id} className="card" style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>{b.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>{b.name}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--we-gray-400)' }}>Earned</div>
            </div>
          )) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--space-10)', color: 'var(--we-gray-400)' }}>
              <Award size={48} style={{ marginBottom: 'var(--space-3)', opacity: 0.5 }} />
              <h4>No badges yet</h4>
              <p style={{ fontSize: 'var(--text-sm)' }}>Complete quizzes and events to earn your first badge!</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'saved' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {savedOpps.length === 0 && (
            <div className="empty-state">
              <Bookmark size={48} />
              <h4>No saved opportunities yet</h4>
              <p>Browse opportunities and save the ones you're interested in.</p>
            </div>
          )}
          {savedOpps.map(opp => (
            <div key={opp.id} className="card" style={{ padding: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="badge badge-red" style={{ marginBottom: 'var(--space-1)' }}>{opp.type.replace(/-/g, ' ')}</span>
                <h4 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-1)' }}>{opp.title}</h4>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)' }}>{opp.department} · {opp.location}</span>
              </div>
              <button className="btn btn-primary btn-sm">Apply <ExternalLink size={12} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
