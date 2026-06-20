import { useState } from 'react';
import { alumni } from '../data/content';
import { ExternalLink, X, Quote } from 'lucide-react';

const programFilters = ['All', 'Internship', 'Thesis', 'Trainee', 'Working Student', 'Scholarship', 'Hackathon'];

export default function Alumni() {
  const [filter, setFilter] = useState('All');
  const [selectedAlumni, setSelectedAlumni] = useState(null);

  const filtered = filter === 'All' ? alumni : alumni.filter(a => a.weExperience.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Where Are They Now?</h1>
        <p>Success stories from students who started their journey with Würth Elektronik.</p>
      </div>

      <div className="filter-pills" style={{ marginBottom: 'var(--space-6)' }}>
        {programFilters.map(f => (
          <button key={f} className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      <div className="grid-3">
        {filtered.map(person => (
          <div key={person.id} className="alumni-card" style={{ cursor: 'pointer' }} onClick={() => setSelectedAlumni(person)}>
            <div className="alumni-card-header">
              <div className="avatar avatar-lg" style={{ margin: '0 auto var(--space-3)', border: '3px solid rgba(255,255,255,0.2)' }}>
                {person.initials}
              </div>
              <h4 style={{ color: 'white', marginBottom: 'var(--space-1)' }}>{person.name}</h4>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-sm)' }}>{person.university} · {person.graduationYear}</p>
            </div>
            <div className="alumni-card-body">
              <div style={{ marginBottom: 'var(--space-3)' }}>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--we-gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>At Würth Elektronik</div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--we-rot)' }}>{person.weExperience}</div>
              </div>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--we-gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Now</div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{person.currentRole}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)' }}>{person.currentCompany}</div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {person.tags.slice(0, 3).map(t => <span key={t} className="badge badge-gray">{t}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alumni Detail Modal */}
      {selectedAlumni && (
        <div className="modal-overlay" onClick={() => setSelectedAlumni(null)}>
          <div className="modal-content" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
            <div style={{ background: 'var(--we-gradient-dark)', padding: 'var(--space-8)', textAlign: 'center', color: 'white' }}>
              <div className="avatar avatar-xl" style={{ margin: '0 auto var(--space-3)', border: '3px solid rgba(255,255,255,0.2)', fontSize: '2rem' }}>
                {selectedAlumni.initials}
              </div>
              <h3 style={{ color: 'white', marginBottom: 'var(--space-1)' }}>{selectedAlumni.name}</h3>
              <p style={{ opacity: 0.7, fontSize: 'var(--text-sm)' }}>{selectedAlumni.currentRole} at {selectedAlumni.currentCompany}</p>
            </div>

            <div className="modal-body">
              <div style={{ display: 'flex', gap: 'var(--space-6)', marginBottom: 'var(--space-5)', fontSize: 'var(--text-sm)' }}>
                <div>
                  <div style={{ color: 'var(--we-gray-400)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', marginBottom: 2 }}>University</div>
                  <div style={{ fontWeight: 600 }}>{selectedAlumni.university}</div>
                  <div style={{ color: 'var(--we-gray-500)' }}>{selectedAlumni.program}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--we-gray-400)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', marginBottom: 2 }}>Graduation</div>
                  <div style={{ fontWeight: 600 }}>{selectedAlumni.graduationYear}</div>
                </div>
              </div>

              <div style={{ marginBottom: 'var(--space-5)' }}>
                <div style={{ color: 'var(--we-gray-400)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>At Würth Elektronik</div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--we-rot)', marginBottom: 'var(--space-3)' }}>{selectedAlumni.weExperience}</div>
              </div>

              <div style={{ background: 'var(--we-gray-50)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', marginBottom: 'var(--space-5)', position: 'relative' }}>
                <Quote size={24} style={{ color: 'var(--we-gray-200)', position: 'absolute', top: 12, left: 12 }} />
                <p style={{ fontSize: 'var(--text-sm)', lineHeight: 1.7, paddingLeft: 'var(--space-6)' }}>{selectedAlumni.story}</p>
              </div>

              <div style={{ marginBottom: 'var(--space-5)' }}>
                <h4 style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>💡 Advice for Students</h4>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-600)', lineHeight: 1.6, fontStyle: 'italic' }}>"{selectedAlumni.advice}"</p>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {selectedAlumni.tags.map(t => <span key={t} className="badge badge-gray">{t}</span>)}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedAlumni(null)}>Close</button>
              <button className="btn btn-cyan"><ExternalLink size={14} /> View on LinkedIn</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
