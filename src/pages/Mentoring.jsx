import { useState } from 'react';
import { mentors } from '../data/mentors';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, Globe, Star, Clock, CheckCircle, X, MessageCircle, Calendar } from 'lucide-react';

export default function Mentoring() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [requestSent, setRequestSent] = useState(new Set());

  const filtered = mentors.filter(m => {
    if (!searchQuery) return true;
    return m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.department.toLowerCase().includes(searchQuery.toLowerCase());
  }).sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Mentoring</h1>
        <p>Connect with experienced Würth Elektronik engineers who can guide your career.</p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 400, marginBottom: 'var(--space-6)' }}>
        <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--we-gray-400)' }} />
        <input className="form-input" style={{ paddingLeft: 40, borderRadius: 'var(--radius-full)' }} placeholder="Search by name, expertise, or department..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
      </div>

      {/* Mentor Grid */}
      <div className="grid-3">
        {filtered.map(mentor => (
          <div key={mentor.id} className="mentor-card" onClick={() => setSelectedMentor(mentor)} style={{ cursor: 'pointer' }}>
            <div className="avatar avatar-xl" style={{ margin: '0 auto var(--space-4)', fontSize: 'var(--text-2xl)' }}>
              {mentor.initials}
            </div>
            <h4 style={{ marginBottom: 'var(--space-1)' }}>{mentor.name}</h4>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)', marginBottom: 'var(--space-3)' }}>{mentor.role}</p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)', flexWrap: 'wrap' }}>
              {mentor.expertise.map(e => (
                <span key={e} className="badge badge-gray">{e}</span>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)', marginBottom: 'var(--space-3)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Star size={14} style={{ color: '#F59E0B' }} /> {mentor.rating}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MessageCircle size={14} /> {mentor.mentees} mentees</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <span className={`mentor-match-score ${mentor.matchScore >= 80 ? 'match-high' : 'match-medium'}`}>
                {mentor.matchScore}% match
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: mentor.availability === 'available' ? 'var(--we-success)' : 'var(--we-warning)' }} />
                {mentor.availability === 'available' ? 'Available' : 'Busy'}
              </span>
            </div>

            <button className={`btn ${requestSent.has(mentor.id) ? 'btn-secondary' : 'btn-primary'}`} style={{ width: '100%' }} onClick={(e) => {
              e.stopPropagation();
              setRequestSent(prev => new Set([...prev, mentor.id]));
            }}>
              {requestSent.has(mentor.id) ? <><CheckCircle size={16} /> Request Sent</> : 'Request Mentoring'}
            </button>
          </div>
        ))}
      </div>

      {/* Mentor Detail Modal */}
      {selectedMentor && (
        <div className="modal-overlay" onClick={() => setSelectedMentor(null)}>
          <div className="modal-content" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Mentor Profile</h3>
              <button className="btn btn-icon btn-ghost" onClick={() => setSelectedMentor(null)}><X size={20} /></button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <div className="avatar avatar-xl" style={{ margin: '0 auto var(--space-4)', fontSize: 'var(--text-2xl)' }}>
                {selectedMentor.initials}
              </div>
              <h3 style={{ marginBottom: 'var(--space-1)' }}>{selectedMentor.name}</h3>
              <p style={{ color: 'var(--we-gray-500)', marginBottom: 'var(--space-1)' }}>{selectedMentor.role}</p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-400)', marginBottom: 'var(--space-4)' }}>{selectedMentor.department}</p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-5)', fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> {selectedMentor.location}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Globe size={14} /> {selectedMentor.languages.join(', ')}</span>
              </div>

              <p style={{ textAlign: 'left', marginBottom: 'var(--space-5)', lineHeight: 1.7, fontSize: 'var(--text-sm)' }}>{selectedMentor.bio}</p>

              <div style={{ textAlign: 'left', marginBottom: 'var(--space-5)' }}>
                <h4 style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>Why This Mentor Matches You</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {selectedMentor.expertise.filter(e => user?.interests?.some(i => e.toLowerCase().includes(i.toLowerCase()) || i.toLowerCase().includes(e.toLowerCase()))).length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--we-success)' }}>
                      <CheckCircle size={16} /> Shared expertise in {selectedMentor.expertise.filter(e => user?.interests?.some(i => e.toLowerCase().includes(i.toLowerCase()))).join(', ')}
                    </div>
                  )}
                  {selectedMentor.location.includes('Munich') && user?.location?.includes('Munich') && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--we-success)' }}>
                      <CheckCircle size={16} /> Same location: Munich
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--we-success)' }}>
                    <CheckCircle size={16} /> Speaks {selectedMentor.languages.filter(l => ['English', 'German'].includes(l)).join(' & ')}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'left', marginBottom: 'var(--space-5)' }}>
                <h4 style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>Available Slots</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {selectedMentor.slots.map((slot, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', padding: 'var(--space-2) var(--space-3)', background: 'var(--we-gray-50)', borderRadius: 'var(--radius-sm)' }}>
                      <Calendar size={14} style={{ color: 'var(--we-cyan)' }} /> {slot}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedMentor(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => { setRequestSent(prev => new Set([...prev, selectedMentor.id])); setSelectedMentor(null); }}>
                Request Mentoring
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
