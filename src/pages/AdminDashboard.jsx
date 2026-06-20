import { useState, useEffect, useRef } from 'react';
import { students } from '../data/students';
import { events } from '../data/events';
import { opportunities } from '../data/opportunities';
import { Users, Calendar, Briefcase, TrendingUp, BarChart3, PieChart, Activity, Mail, Eye, Download, Search, Filter } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = students.filter(s =>
    !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.university?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Chart data
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
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage students, events, and track engagement analytics.</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className="btn btn-secondary btn-sm"><Download size={14} /> Export Data</button>
          <button className="btn btn-primary btn-sm"><Mail size={14} /> Send Follow-up</button>
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

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Analytics</button>
        <button className={`tab-item ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}>Students</button>
        <button className={`tab-item ${activeTab === 'funnel' ? 'active' : ''}`} onClick={() => setActiveTab('funnel')}>Engagement Funnel</button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid-2" style={{ gap: 'var(--space-6)' }}>
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
      )}

      {activeTab === 'students' && (
        <div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
              <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--we-gray-400)' }} />
              <input className="form-input" style={{ paddingLeft: 40, borderRadius: 'var(--radius-full)' }} placeholder="Search students..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>University</th>
                  <th>Program</th>
                  <th>Semester</th>
                  <th>Tier</th>
                  <th>Points</th>
                  <th>Streak</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => (
                  <tr key={student.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <div className="avatar avatar-sm">{student.initials}</div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{student.name}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--we-gray-400)' }}>{student.email || student.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>{student.university}</td>
                    <td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{student.program}</td>
                    <td>{student.semester}</td>
                    <td><span className="badge badge-gray">{student.tierIcon} {student.tier}</span></td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{student.points}</td>
                    <td>{student.streak > 0 ? `🔥 ${student.streak}` : '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                        <button className="btn btn-ghost btn-sm"><Eye size={14} /></button>
                        <button className="btn btn-ghost btn-sm"><Mail size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'funnel' && (
        <div style={{ maxWidth: 700 }}>
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <h3 style={{ marginBottom: 'var(--space-2)' }}>Student Engagement Funnel</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)', marginBottom: 'var(--space-6)' }}>
              Track how students progress from initial contact to active engagement. Example: 500 students met at career fair → how many became active contributors?
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

          <div className="card" style={{ padding: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Follow-up Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)', background: 'var(--we-rot-bg)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>180 inactive registrants</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--we-gray-500)' }}>Registered but never returned</div>
                </div>
                <button className="btn btn-primary btn-sm"><Mail size={14} /> Send Re-engagement</button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)', background: 'var(--we-warning-bg)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>87 students near next tier</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--we-gray-500)' }}>Within 20 points of promotion</div>
                </div>
                <button className="btn btn-secondary btn-sm"><Mail size={14} /> Nudge to Level Up</button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)', background: 'var(--we-success-bg)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>45 applications in progress</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--we-gray-500)' }}>Students who clicked "Apply"</div>
                </div>
                <button className="btn btn-secondary btn-sm"><Eye size={14} /> View Pipeline</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
