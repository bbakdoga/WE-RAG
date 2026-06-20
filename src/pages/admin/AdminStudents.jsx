import { useState } from 'react';
import { students } from '../../data/students';
import { Search, Eye, Mail, Filter } from 'lucide-react';

export default function AdminStudents() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = students.filter(s =>
    !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.university?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 'var(--space-10)' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1>Student CRM</h1>
          <p>Manage and filter all registered students on the platform.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--we-gray-400)' }} />
          <input className="form-input" style={{ paddingLeft: 40, borderRadius: 'var(--radius-full)' }} placeholder="Search students by name or university..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
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
                <th style={{ padding: 'var(--space-3)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id} style={{ borderBottom: '1px solid var(--we-gray-100)' }}>
                  <td style={{ padding: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <div className="avatar avatar-sm">{student.initials}</div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{student.name}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--we-gray-400)' }}>{student.email || student.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>{student.university}</td>
                  <td style={{ padding: 'var(--space-3)', fontSize: 'var(--text-sm)', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{student.program}</td>
                  <td style={{ padding: 'var(--space-3)' }}><span className="badge badge-gray">{student.tierIcon} {student.tier}</span></td>
                  <td style={{ padding: 'var(--space-3)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{student.points}</td>
                  <td style={{ padding: 'var(--space-3)' }}>{student.streak > 0 ? `🔥 ${student.streak}` : '-'}</td>
                  <td style={{ padding: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                      <button className="btn btn-ghost btn-sm" title="View Profile"><Eye size={14} /></button>
                      <button className="btn btn-ghost btn-sm" title="Message Student"><Mail size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
