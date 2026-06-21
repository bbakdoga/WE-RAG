import { useState, useEffect, useCallback } from 'react';
import { Users, Calendar, Briefcase, Activity, Download, Mail, Zap, TrendingUp, RefreshCw } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import userStore from '../../services/UserStore';
import { useTranslation } from 'react-i18next';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler);

export default function AdminOverview() {
  const { t } = useTranslation();
  const [students, setStudents] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const loadData = useCallback(() => {
    setStudents(userStore.getAllStudents());
    setActivityLog(userStore.getActivityLog());
    setLastUpdate(new Date());
  }, []);

  useEffect(() => {
    loadData();
    // Subscribe to real-time updates
    const unsub = userStore.subscribe((payload) => {
      if (['user-updated', 'user-created', 'activity-logged', 'data-reset'].includes(payload.type)) {
        loadData();
      }
    });
    return unsub;
  }, [loadData]);

  // Computed stats from real data
  const totalStudents = students.length;
  const totalPoints = students.reduce((sum, s) => sum + (s.points || 0), 0);
  const avgPoints = totalStudents > 0 ? Math.round(totalPoints / totalStudents) : 0;
  const activeStudents = students.filter(s => (s.points || 0) > 0).length;
  const totalBadges = students.reduce((sum, s) => sum + (s.badges?.length || 0), 0);

  // Tier distribution from real data
  const getTierName = (pts) => {
    if (pts >= 2500) return 'Grandmaster';
    if (pts >= 1000) return 'Master';
    if (pts >= 500) return 'Expert';
    if (pts >= 200) return 'Contributor';
    if (pts >= 50) return 'Explorer';
    return 'Novice';
  };

  const tierCounts = {};
  students.forEach(s => {
    const tier = getTierName(s.points || 0);
    tierCounts[tier] = (tierCounts[tier] || 0) + 1;
  });

  const tierDistributionData = {
    labels: Object.keys(tierCounts),
    datasets: [{
      data: Object.values(tierCounts),
      backgroundColor: ['#6B7280', '#009EE0', '#B9C900', '#F59E0B', '#CC0000', '#7C3AED'].slice(0, Object.keys(tierCounts).length),
    }],
  };

  // University distribution from real data
  const uniCounts = {};
  students.forEach(s => {
    const uni = s.university || 'Unknown';
    uniCounts[uni] = (uniCounts[uni] || 0) + 1;
  });

  const universityData = {
    labels: Object.keys(uniCounts),
    datasets: [{
      data: Object.values(uniCounts),
      backgroundColor: ['#CC0000', '#009EE0', '#B9C900', '#F59E0B', '#7C3AED', '#10B981', '#374151', '#CED2D9'],
    }],
  };

  // Points leaderboard from real data
  const topStudents = [...students].sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 6);
  const leaderboardData = {
    labels: topStudents.map(s => s.name.split(' ')[0]),
    datasets: [{
      label: 'Total Points',
      data: topStudents.map(s => s.points || 0),
      backgroundColor: '#CC0000',
      borderRadius: 6,
    }],
  };

  // Mock registration trend (keeping this as simulated since it's historical)
  const registrationData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'New Registrations',
      data: [45, 62, 78, 95, 112, 134 + totalStudents],
      borderColor: '#CC0000',
      backgroundColor: 'rgba(204, 0, 0, 0.1)',
      fill: true,
      tension: 0.4,
    }],
  };

  const funnelStages = [
    { stage: 'Registered on Platform', count: totalStudents, percent: 100, color: 'var(--we-cyan)' },
    { stage: 'Active (>0 points)', count: activeStudents, percent: totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0, color: 'var(--we-green)' },
    { stage: 'Earned Badges', count: students.filter(s => (s.badges?.length || 0) > 0).length, percent: totalStudents > 0 ? Math.round((students.filter(s => (s.badges?.length || 0) > 0).length / totalStudents) * 100) : 0, color: 'var(--we-warning)' },
    { stage: 'Passed Quizzes', count: students.filter(s => (s.quizzesPassed || 0) > 0).length, percent: totalStudents > 0 ? Math.round((students.filter(s => (s.quizzesPassed || 0) > 0).length / totalStudents) * 100) : 0, color: 'var(--we-rot)' },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: '#f0f0f0' }, ticks: { font: { size: 11 } } },
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
    },
  };

  const formatTimeAgo = (ts) => {
    const diff = Date.now() - new Date(ts).getTime();
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(ts).toLocaleDateString();
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 'var(--space-10)' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            {t('admin.overview')}
            {isLive && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '4px 12px', background: '#ECFDF5', borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-xs)', fontWeight: 600, color: '#059669',
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', animation: 'pulse 2s ease-in-out infinite' }} />
                {t('admin.live')}
              </span>
            )}
          </h1>
          <p>{t('admin.overviewSub')}</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className="btn btn-secondary btn-sm" onClick={loadData}><RefreshCw size={14} /> {t('admin.refresh')}</button>
          <button className="btn btn-secondary btn-sm"><Download size={14} /> {t('admin.export')}</button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="admin-stats-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="stat-card card-elevated">
          <div className="stat-icon" style={{ background: 'var(--we-rot-bg)', color: 'var(--we-rot)' }}><Users size={20} /></div>
          <div className="stat-value">{totalStudents}</div>
          <div className="stat-label">Total Students</div>
          <div className="points-delta positive" style={{ fontSize: 'var(--text-xs)' }}>registered accounts</div>
        </div>
        <div className="stat-card card-elevated">
          <div className="stat-icon" style={{ background: 'var(--we-cyan-light)', color: 'var(--we-cyan)' }}><Activity size={20} /></div>
          <div className="stat-value">{activeStudents}</div>
          <div className="stat-label">Active Students</div>
          <div className="points-delta positive" style={{ fontSize: 'var(--text-xs)' }}>{totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0}% active rate</div>
        </div>
        <div className="stat-card card-elevated">
          <div className="stat-icon" style={{ background: 'var(--we-green-light)', color: 'var(--we-green-dark)' }}><Zap size={20} /></div>
          <div className="stat-value">{totalPoints.toLocaleString()}</div>
          <div className="stat-label">Total Points Earned</div>
          <div className="points-delta positive" style={{ fontSize: 'var(--text-xs)' }}>avg {avgPoints} per student</div>
        </div>
        <div className="stat-card card-elevated">
          <div className="stat-icon" style={{ background: 'var(--we-warning-bg)', color: '#B45309' }}><TrendingUp size={20} /></div>
          <div className="stat-value">{totalBadges}</div>
          <div className="stat-label">Badges Earned</div>
          <div className="points-delta positive" style={{ fontSize: 'var(--text-xs)' }}>across all students</div>
        </div>
      </div>

      {/* Live Activity Feed + Charts */}
      <div className="grid-2" style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        {/* Live Activity Feed */}
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            <Activity size={18} style={{ color: 'var(--we-rot)' }} />
            Live Activity Feed
            <span style={{
              width: 8, height: 8, borderRadius: '50%', background: '#10B981',
              animation: 'pulse 2s ease-in-out infinite', marginLeft: 'auto',
            }} />
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', maxHeight: 300, overflowY: 'auto' }}>
            {activityLog.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--we-gray-400)' }}>
                <Activity size={32} style={{ marginBottom: 'var(--space-2)', opacity: 0.5 }} />
                <p style={{ fontSize: 'var(--text-sm)' }}>No activity yet. Student actions will appear here in real-time.</p>
              </div>
            ) : (
              activityLog.slice(0, 15).map(entry => (
                <div key={entry.id} style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                  padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-sm)',
                  background: 'var(--we-gray-50)', fontSize: 'var(--text-sm)',
                }}>
                  <div className="avatar avatar-sm" style={{ width: 28, height: 28, fontSize: '0.65rem', flexShrink: 0 }}>
                    {entry.userInitials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontWeight: 600 }}>{entry.userName}</span>{' '}
                    <span style={{ color: 'var(--we-gray-500)' }}>{entry.action}</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--we-success)', fontSize: 'var(--text-xs)', flexShrink: 0 }}>
                    +{entry.points}
                  </span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--we-gray-400)', flexShrink: 0 }}>
                    {formatTimeAgo(entry.timestamp)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tier Distribution */}
        <div className="admin-chart-container">
          <h4>Student Tier Distribution</h4>
          <div style={{ height: 250, display: 'flex', justifyContent: 'center' }}>
            {Object.keys(tierCounts).length > 0 ? (
              <Pie data={tierDistributionData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { font: { size: 11 }, boxWidth: 12 } } } }} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--we-gray-400)' }}>No data yet</div>
            )}
          </div>
        </div>

        {/* Points Leaderboard */}
        <div className="admin-chart-container">
          <h4>Top Students by Points</h4>
          <div style={{ height: 250 }}>
            {topStudents.length > 0 ? (
              <Bar data={leaderboardData} options={chartOptions} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--we-gray-400)' }}>No data yet</div>
            )}
          </div>
        </div>

        {/* University Distribution */}
        <div className="admin-chart-container">
          <h4>University Distribution</h4>
          <div style={{ height: 250, display: 'flex', justifyContent: 'center' }}>
            {Object.keys(uniCounts).length > 0 ? (
              <Pie data={universityData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { font: { size: 11 }, boxWidth: 12 } } } }} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--we-gray-400)' }}>No data yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Student Engagement Funnel */}
      <div style={{ maxWidth: 800 }}>
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <h3 style={{ marginBottom: 'var(--space-2)' }}>Student Engagement Funnel</h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)', marginBottom: 'var(--space-6)' }}>
            Real-time breakdown of student engagement stages.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {funnelStages.map((stage, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)', fontSize: 'var(--text-sm)' }}>
                  <span style={{ fontWeight: 600 }}>{stage.stage}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{stage.count} <span style={{ color: 'var(--we-gray-400)', fontWeight: 400 }}>({stage.percent}%)</span></span>
                </div>
                <div className="progress-bar" style={{ height: 28, borderRadius: 'var(--radius-md)' }}>
                  <div style={{ height: '100%', width: `${stage.percent}%`, background: stage.color, borderRadius: 'var(--radius-md)', transition: 'width 0.8s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {stage.percent > 15 && <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: i > 0 ? 'white' : 'var(--we-gray-700)' }}>{stage.percent}%</span>}
                  </div>
                </div>
                {i < funnelStages.length - 1 && funnelStages[i + 1] && stage.count > 0 && (
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--we-gray-400)', textAlign: 'right', marginTop: 2 }}>
                    ↓ {Math.round((funnelStages[i + 1].count / stage.count) * 100)}% conversion
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
