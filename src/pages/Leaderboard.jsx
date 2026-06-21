import { useState } from 'react';
import { leaderboardData } from '../data/content';
import { useAuth } from '../context/AuthContext';
import { Trophy, TrendingUp, Medal, Crown, Gem, Zap, Gift } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const timeFilters = ['This Week', 'This Month', 'All Time'];
const categoryFilters = ['Overall', 'Community', 'Skills', 'Events', 'Projects'];

export default function Leaderboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [timeFilter, setTimeFilter] = useState('This Week');
  const [categoryFilter, setCategoryFilter] = useState('Overall');

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>{t('leaderboard.title')}</h1>
        <p>{t('leaderboard.subtitle')}</p>
      </div>

      {/* Incentives Banner */}
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, #FFF0F0, #FFF)', 
        border: '1px solid var(--we-rot)', 
        marginBottom: 'var(--space-6)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)'
      }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--we-rot)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Gift size={24} />
        </div>
        <div>
          <h4 style={{ color: 'var(--we-rot)', marginBottom: 'var(--space-1)' }}>{t('leaderboard.incentivesTitle')}</h4>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-700)', margin: 0, lineHeight: 1.5 }}>
            <strong>1st:</strong> {t('leaderboard.incentives1')} • <strong>2nd:</strong> {t('leaderboard.incentives2')} • <strong>3rd:</strong> {t('leaderboard.incentives3')}<br/>
            <strong>Ranks 1-10:</strong> {t('leaderboard.incentivesAll')}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 'var(--space-6)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
        <div className="filter-pills">
          {timeFilters.map(t => (
            <button key={t} className={`chip ${timeFilter === t ? 'active' : ''}`} onClick={() => setTimeFilter(t)}>{t}</button>
          ))}
        </div>
        <div className="filter-pills">
          {categoryFilters.map(c => (
            <button key={c} className={`chip ${categoryFilter === c ? 'active' : ''}`} onClick={() => setCategoryFilter(c)}>{c}</button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 'var(--space-4)', marginBottom: 'var(--space-8)', padding: 'var(--space-4)' }}>
        {/* 2nd Place */}
        <div style={{ textAlign: 'center', width: 160 }}>
          <div className="avatar avatar-lg" style={{ margin: '0 auto var(--space-2)', background: 'linear-gradient(135deg, #C0C0C0, #E8E8E8)' }}>
            {leaderboardData[1].initials}
          </div>
          <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{leaderboardData[1].name}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--we-gray-500)' }}>{leaderboardData[1].university}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 'var(--text-xl)', color: '#C0C0C0', marginTop: 'var(--space-2)' }}>{leaderboardData[1].points}</div>
          <div style={{ height: 80, background: 'linear-gradient(180deg, #E8E8E8, #F5F5F5)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', marginTop: 'var(--space-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-2xl)' }}>🥈</div>
        </div>

        {/* 1st Place */}
        <div style={{ textAlign: 'center', width: 180 }}>
          <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-1)' }}>👑</div>
          <div className="avatar avatar-xl" style={{ margin: '0 auto var(--space-2)', background: 'linear-gradient(135deg, #FFD700, #FFA500)', border: '3px solid #FFD700' }}>
            {leaderboardData[0].initials}
          </div>
          <div style={{ fontWeight: 700 }}>{leaderboardData[0].name}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--we-gray-500)' }}>{leaderboardData[0].university}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 'var(--text-2xl)', color: '#FFD700', marginTop: 'var(--space-2)' }}>{leaderboardData[0].points}</div>
          <div style={{ height: 120, background: 'linear-gradient(180deg, #FFF8E1, #FFFDE7)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', marginTop: 'var(--space-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-3xl)' }}>🥇</div>
        </div>

        {/* 3rd Place */}
        <div style={{ textAlign: 'center', width: 160 }}>
          <div className="avatar avatar-lg" style={{ margin: '0 auto var(--space-2)', background: 'linear-gradient(135deg, #CD7F32, #DDA15E)' }}>
            {leaderboardData[2].initials}
          </div>
          <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{leaderboardData[2].name}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--we-gray-500)' }}>{leaderboardData[2].university}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 'var(--text-xl)', color: '#CD7F32', marginTop: 'var(--space-2)' }}>{leaderboardData[2].points}</div>
          <div style={{ height: 60, background: 'linear-gradient(180deg, #EFEBE9, #F5F5F5)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', marginTop: 'var(--space-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-2xl)' }}>🥉</div>
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div className="card" style={{ padding: 'var(--space-5)' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-3) var(--space-5)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--we-gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--we-gray-200)' }}>
            <span style={{ width: 40, textAlign: 'center' }}>{t('leaderboard.rank')}</span>
            <span style={{ flex: 1 }}>{t('leaderboard.student')}</span>
            <span style={{ width: 80, textAlign: 'center' }}>{t('leaderboard.tier')}</span>
            <span style={{ width: 80, textAlign: 'right' }}>{t('leaderboard.points')}</span>
            <span style={{ width: 80, textAlign: 'right' }}>{t('leaderboard.weekly')}</span>
          </div>

          {leaderboardData.map((entry, i) => (
            <div key={entry.userId} className={`leaderboard-row ${entry.userId === user?.id ? 'current-user' : ''}`}>
              <span className={`leaderboard-rank ${i === 0 ? 'top-1' : i === 1 ? 'top-2' : i === 2 ? 'top-3' : ''}`}>
                {i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1}
              </span>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minWidth: 0 }}>
                <div className="avatar avatar-sm">{entry.initials}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {entry.name} {entry.userId === user?.id && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--we-rot)' }}>{t('leaderboard.you')}</span>}
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--we-gray-400)' }}>{entry.university}</div>
                </div>
              </div>
              <div style={{ width: 80, textAlign: 'center' }}>
                <span className="badge badge-gray">{entry.tierIcon} {entry.tier}</span>
              </div>
              <div style={{ width: 80, textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-sm)' }}>
                {entry.points.toLocaleString()}
              </div>
              <div style={{ width: 80, textAlign: 'right' }}>
                <span className="points-delta positive">+{entry.weeklyDelta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
