import { useState, useEffect, useCallback } from 'react';
import { Search, Eye, Mail, Filter, RefreshCw } from 'lucide-react';
import userStore from '../../services/UserStore';

export default function AdminStudents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]);

  const loadStudents = useCallback(() => {
    setStudents(userStore.getAllStudents());
  }, []);

  useEffect(() => {
    loadStudents();
    const unsub = userStore.subscribe((payload) => {
      if (['user-updated', 'user-created', 'data-reset'].includes(payload.type)) {
        loadStudents();
      }
    });
    return unsub;
  }, [loadStudents]);

  const getTierInfo = (pts) => {
    const p = pts || 0;
    if (p >= 2500) return { name: 'Grandmaster', icon: '👑' };
    if (p >= 1000) return { name: 'Master', icon: '💎' };
    if (p >= 500) return { name: 'Expert', icon: '🏆' };
    if (p >= 200) return { name: 'Contributor', icon: '⚡' };
    if (p >= 50) return { name: 'Explorer', icon: '🔍' };
    return { name: 'Novice', icon: '🌱' };
  };

  const filteredStudents = students.filter(s =>
    !searchQuery || s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.university?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 'var(--space-10)' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1>Student CRM</h1>
          <p>Manage and monitor all registered students on the platform. <span style={{ fontSize: 'var(--text-xs)', color: 'var(--we-gray-400)' }}>Data updates in real-time</span></p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={loadStudents}><RefreshCw size={14} /> Refresh</button>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--we-gray-400)' }} />
          <input className="form-input" style={{ paddingLeft: 40, borderRadius: 'var(--radius-full)' }} placeholder="Search students by name, university, or email..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <button className="btn btn-secondary"><Filter size={18} /> Filters</button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--we-gray-200)', background: 'var(--we-gray-50)' }}>
                <th style={{ padding: 'var(--space-3)' }}>Student</th>
                <th style={{ padding: 'var(--space-3)' }}>University</th>
                <th style={{ padding: 'var(--space-3)' }}>Program</th>
                <th style={{ padding: 'var(--space-3)' }}>Tier</th>
                <th style={{ padding: 'var(--space-3)' }}>Points</th>
                <th style={{ padding: 'var(--space-3)' }}>Streak</th>
                <th style={{ padding: 'var(--space-3)' }}>Badges</th>
                <th style={{ padding: 'var(--space-3)' }}>Joined</th>
                <th style={{ padding: 'var(--space-3)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => {
                const tier = getTierInfo(student.points);
                return (
                  <tr key={student.id} style={{ borderBottom: '1px solid var(--we-gray-100)' }}>
                    <td style={{ padding: 'var(--space-3)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <div className="avatar avatar-sm">{student.initials}</div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{student.name}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--we-gray-400)' }}>{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>{student.university || '—'}</td>
                    <td style={{ padding: 'var(--space-3)', fontSize: 'var(--text-sm)', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{student.program || '—'}</td>
                    <td style={{ padding: 'var(--space-3)' }}><span className="badge badge-gray">{tier.icon} {tier.name}</span></td>
                    <td style={{ padding: 'var(--space-3)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{(student.points || 0).toLocaleString()}</td>
                    <td style={{ padding: 'var(--space-3)' }}>{(student.streak || 0) > 0 ? `🔥 ${student.streak}` : '—'}</td>
                    <td style={{ padding: 'var(--space-3)', fontFamily: 'var(--font-mono)' }}>{student.badges?.length || 0}</td>
                    <td style={{ padding: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--we-gray-400)' }}>{student.joinedDate ? new Date(student.joinedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}</td>
                    <td style={{ padding: 'var(--space-3)' }}>
                      <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                        <button className="btn btn-ghost btn-sm" title="View Profile"><Eye size={14} /></button>
                        <button className="btn btn-ghost btn-sm" title="Message Student"><Mail size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--we-gray-400)' }}>
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
