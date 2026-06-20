import { useState } from 'react';
import { opportunities } from '../../data/opportunities';
import { events } from '../../data/events';
import { Briefcase, Calendar, Plus, Edit2, Trash2, Eye } from 'lucide-react';

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState('opportunities');

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 'var(--space-10)' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1>Content Management</h1>
          <p>Manage job opportunities, thesis topics, and upcoming events.</p>
        </div>
        <button className="btn btn-primary"><Plus size={18} /> Add New {activeTab === 'opportunities' ? 'Opportunity' : 'Event'}</button>
      </div>

      <div className="tabs">
        <button className={`tab-item ${activeTab === 'opportunities' ? 'active' : ''}`} onClick={() => setActiveTab('opportunities')}><Briefcase size={16} /> Opportunities</button>
        <button className={`tab-item ${activeTab === 'events' ? 'active' : ''}`} onClick={() => setActiveTab('events')}><Calendar size={16} /> Events</button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {activeTab === 'opportunities' && (
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--we-gray-200)', background: 'var(--we-gray-50)' }}>
                <th style={{ padding: 'var(--space-3)' }}>Title</th>
                <th style={{ padding: 'var(--space-3)' }}>Type</th>
                <th style={{ padding: 'var(--space-3)' }}>Location</th>
                <th style={{ padding: 'var(--space-3)' }}>Applications</th>
                <th style={{ padding: 'var(--space-3)' }}>Status</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map(opp => (
                <tr key={opp.id} style={{ borderBottom: '1px solid var(--we-gray-100)' }}>
                  <td style={{ padding: 'var(--space-3)', fontWeight: 600 }}>{opp.title}</td>
                  <td style={{ padding: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>{opp.type}</td>
                  <td style={{ padding: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>{opp.location}</td>
                  <td style={{ padding: 'var(--space-3)', fontFamily: 'var(--font-mono)' }}>{Math.floor(Math.random() * 20)}</td>
                  <td style={{ padding: 'var(--space-3)' }}><span className="badge badge-green">Active</span></td>
                  <td style={{ padding: 'var(--space-3)', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-1)', justifyContent: 'flex-end' }}>
                      <button className="btn btn-ghost btn-sm"><Eye size={16} /></button>
                      <button className="btn btn-ghost btn-sm"><Edit2 size={16} /></button>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--we-rot)' }}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'events' && (
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--we-gray-200)', background: 'var(--we-gray-50)' }}>
                <th style={{ padding: 'var(--space-3)' }}>Event Title</th>
                <th style={{ padding: 'var(--space-3)' }}>Date</th>
                <th style={{ padding: 'var(--space-3)' }}>Type</th>
                <th style={{ padding: 'var(--space-3)' }}>Registrations</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id} style={{ borderBottom: '1px solid var(--we-gray-100)' }}>
                  <td style={{ padding: 'var(--space-3)', fontWeight: 600 }}>{event.title}</td>
                  <td style={{ padding: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>{event.date}</td>
                  <td style={{ padding: 'var(--space-3)' }}>
                    <span className={`badge ${event.type === 'Online' ? 'badge-blue' : 'badge-orange'}`}>{event.type}</span>
                  </td>
                  <td style={{ padding: 'var(--space-3)', fontFamily: 'var(--font-mono)' }}>{event.attendees}/{event.capacity || '∞'}</td>
                  <td style={{ padding: 'var(--space-3)', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-1)', justifyContent: 'flex-end' }}>
                      <button className="btn btn-ghost btn-sm"><Eye size={16} /></button>
                      <button className="btn btn-ghost btn-sm"><Edit2 size={16} /></button>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--we-rot)' }}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
