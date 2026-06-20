import { Users, Calendar, Briefcase, Activity, Download, Mail } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler);

export default function AdminOverview() {
  const registrationData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'New Registrations',
      data: [45, 62, 78, 95, 112, 134],
      borderColor: '#CC0000',
      backgroundColor: 'rgba(204, 0, 0, 0.1)',
      fill: true,
      tension: 0.4,
    }],
  };

  const universityData = {
    labels: ['TU Munich', 'KIT', 'RWTH Aachen', 'ETH Zürich', 'TU Darmstadt', 'Uni Stuttgart', 'TU Berlin', 'Other'],
    datasets: [{
      data: [234, 189, 156, 134, 112, 98, 87, 190],
      backgroundColor: ['#CC0000', '#009EE0', '#B9C900', '#F59E0B', '#7C3AED', '#10B981', '#374151', '#CED2D9'],
    }],
  };

  const channelData = {
    labels: ['embedded-systems', 'raspberry-pi', 'q-and-a', 'career-advice', 'pcb-design', 'introductions'],
    datasets: [{
      label: 'Active Members',
      data: [456, 523, 678, 567, 389, 890],
      backgroundColor: '#CC0000',
      borderRadius: 6,
    }],
  };

  const funnelStages = [
    { stage: 'Career Fair Contacts', count: 500, percent: 100, color: 'var(--we-gray-300)' },
    { stage: 'Registered on Platform', count: 320, percent: 64, color: 'var(--we-cyan)' },
    { stage: 'Active (>3 actions)', count: 185, percent: 37, color: 'var(--we-green)' },
    { stage: 'Contributed Content', count: 98, percent: 19.6, color: 'var(--we-warning)' },
    { stage: 'Applied to Opportunity', count: 45, percent: 9, color: 'var(--we-rot)' },
    { stage: 'Hired / Ongoing', count: 12, percent: 2.4, color: '#7C3AED' },
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

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 'var(--space-10)' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1>Admin Overview</h1>
          <p>Track student engagement, funnel metrics, and platform health.</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className="btn btn-secondary btn-sm"><Download size={14} /> Export Data</button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="admin-stats-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="stat-card card-elevated">
          <div className="stat-icon" style={{ background: 'var(--we-rot-bg)', color: 'var(--we-rot)' }}><Users size={20} /></div>
          <div className="stat-value">1,200</div>
          <div className="stat-label">Total Students</div>
          <div className="points-delta positive" style={{ fontSize: 'var(--text-xs)' }}>+134 this month</div>
        </div>
        <div className="stat-card card-elevated">
          <div className="stat-icon" style={{ background: 'var(--we-cyan-light)', color: 'var(--we-cyan)' }}><Activity size={20} /></div>
          <div className="stat-value">456</div>
          <div className="stat-label">Active This Month</div>
          <div className="points-delta positive" style={{ fontSize: 'var(--text-xs)' }}>38% active rate</div>
        </div>
        <div className="stat-card card-elevated">
          <div className="stat-icon" style={{ background: 'var(--we-green-light)', color: 'var(--we-green-dark)' }}><Calendar size={20} /></div>
          <div className="stat-value">8</div>
          <div className="stat-label">Events This Quarter</div>
          <div className="points-delta positive" style={{ fontSize: 'var(--text-xs)' }}>645 total attendees</div>
        </div>
        <div className="stat-card card-elevated">
          <div className="stat-icon" style={{ background: 'var(--we-warning-bg)', color: '#B45309' }}><Briefcase size={20} /></div>
          <div className="stat-value">45</div>
          <div className="stat-label">Applications</div>
          <div className="points-delta positive" style={{ fontSize: 'var(--text-xs)' }}>12 in pipeline</div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        <div className="admin-chart-container">
          <h4>Registration Trend</h4>
          <div style={{ height: 250 }}>
            <Line data={registrationData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { display: false } } }} />
          </div>
        </div>
        <div className="admin-chart-container">
          <h4>University Distribution</h4>
          <div style={{ height: 250, display: 'flex', justifyContent: 'center' }}>
            <Pie data={universityData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { font: { size: 11 }, boxWidth: 12 } } } }} />
          </div>
        </div>
        <div className="admin-chart-container" style={{ gridColumn: '1 / -1' }}>
          <h4>Most Active Community Channels</h4>
          <div style={{ height: 250 }}>
            <Bar data={channelData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800 }}>
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <h3 style={{ marginBottom: 'var(--space-2)' }}>Student Engagement Funnel</h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)', marginBottom: 'var(--space-6)' }}>
            Track how students progress from initial contact to active engagement.
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
                {i < funnelStages.length - 1 && (
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
