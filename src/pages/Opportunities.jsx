import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { opportunities, opportunityTypes } from '../data/opportunities';
import { MapPin, Clock, Calendar, Bookmark, BookmarkCheck, ExternalLink, ChevronDown, Filter, X, Search } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Opportunities() {
  const [activeType, setActiveType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [savedIds, setSavedIds] = useState(new Set(opportunities.filter(o => o.saved).map(o => o.id)));

  const filtered = opportunities.filter(o => {
    if (activeType !== 'all' && o.type !== activeType) return false;
    if (searchQuery && !o.title.toLowerCase().includes(searchQuery.toLowerCase()) && !o.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
    return true;
  }).sort((a, b) => b.matchScore - a.matchScore);

  const { addToast } = useToast();

  const toggleSave = (id) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        addToast('Opportunity removed from saved list.', 'info');
      } else {
        next.add(id);
        addToast('Opportunity saved!', 'success');
      }
      return next;
    });
  };

  const daysUntil = (dateStr) => {
    if (!dateStr || dateStr === 'No deadline') return null;
    const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const getTypeColor = (type) => {
    const colors = { internship: 'badge-cyan', thesis: 'badge-red', 'working-student': 'badge-green', scholarship: 'badge-warning', trainee: 'badge-cyan', 'career-starter': 'badge-success', 'free-components': 'badge-green', mentoring: 'badge-cyan' };
    return colors[type] || 'badge-gray';
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Opportunities</h1>
        <p>Discover internships, thesis topics, scholarships, and more — matched to your profile.</p>
      </div>

      {/* Search + Filters */}
      <div className="filter-bar">
        <div style={{ position: 'relative', flex: '1', maxWidth: 400 }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--we-gray-400)' }} />
          <input className="form-input" style={{ paddingLeft: 40, height: 40, borderRadius: 'var(--radius-full)' }} placeholder="Search opportunities..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      </div>
      <div className="filter-pills" style={{ marginBottom: 'var(--space-6)', display: 'flex', gap: 'var(--space-2)' }}>
        {opportunityTypes.map(t => (
          <button 
            key={t.key} 
            className="chip" 
            style={{ 
              position: 'relative', 
              background: activeType === t.key ? 'transparent' : 'var(--we-white)',
              borderColor: activeType === t.key ? 'transparent' : 'var(--we-gray-200)',
              color: activeType === t.key ? 'var(--we-rot)' : 'var(--we-gray-700)',
              overflow: 'hidden'
            }} 
            onClick={() => setActiveType(t.key)}
          >
            {activeType === t.key && (
              <motion.div
                layoutId="activeFilterPill"
                style={{ position: 'absolute', inset: 0, background: 'var(--we-rot-bg)', zIndex: 0, borderRadius: 'var(--radius-2xl)', border: '1px solid var(--we-rot)' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span style={{ position: 'relative', zIndex: 1 }}>{t.label}</span>
          </button>
        ))}
      </div>

      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)', marginBottom: 'var(--space-4)' }}>
        Showing {filtered.length} opportunities {activeType !== 'all' ? `in "${opportunityTypes.find(t => t.key === activeType)?.label}"` : ''}
      </div>

      {/* Opportunity List */}
      <motion.div layout style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <AnimatePresence>
          {filtered.map(opp => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              whileHover={{ scale: 1.01, y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.06)', borderColor: 'var(--we-gray-300)' }}
              whileTap={{ scale: 0.99 }}
              key={opp.id} 
              className="card card-elevated" 
              style={{ padding: 'var(--space-5)', cursor: 'pointer' }} 
              onClick={() => setSelectedOpp(opp)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                  <span className={`badge ${getTypeColor(opp.type)}`}>{opp.type.replace(/-/g, ' ')}</span>
                  {opp.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="badge badge-gray">{tag}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-sm)', color: opp.matchScore >= 90 ? 'var(--we-success)' : opp.matchScore >= 75 ? '#B45309' : 'var(--we-gray-500)', background: opp.matchScore >= 90 ? 'var(--we-success-bg)' : opp.matchScore >= 75 ? 'var(--we-warning-bg)' : 'var(--we-gray-100)', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                    {opp.matchScore}% match
                  </span>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="btn btn-icon btn-ghost" onClick={(e) => { e.stopPropagation(); toggleSave(opp.id); }}>
                    {savedIds.has(opp.id) ? <BookmarkCheck size={20} style={{ color: 'var(--we-rot)' }} /> : <Bookmark size={20} />}
                  </motion.button>
                </div>
              </div>

              <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>{opp.title}</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-600)', marginBottom: 'var(--space-3)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {opp.description}
              </p>

              <div style={{ display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap', fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> {opp.location}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> {opp.duration}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={14} /> Start: {opp.startDate === 'Immediate' ? 'Immediate' : new Date(opp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                {daysUntil(opp.deadline) !== null && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: daysUntil(opp.deadline) <= 7 ? 'var(--we-error)' : daysUntil(opp.deadline) <= 14 ? '#B45309' : 'var(--we-gray-500)', fontWeight: daysUntil(opp.deadline) <= 14 ? 600 : 400 }}>
                    {daysUntil(opp.deadline) <= 7 ? '⚠️' : '📅'} Deadline: {new Date(opp.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    {daysUntil(opp.deadline) <= 30 && ` (${daysUntil(opp.deadline)}d left)`}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Detail Modal */}
      {selectedOpp && (
        <div className="modal-overlay" onClick={() => setSelectedOpp(null)}>
          <div className="modal-content" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className={`badge ${getTypeColor(selectedOpp.type)}`} style={{ marginBottom: 'var(--space-2)' }}>{selectedOpp.type.replace(/-/g, ' ')}</span>
                <h3>{selectedOpp.title}</h3>
              </div>
              <button className="btn btn-icon btn-ghost" onClick={() => setSelectedOpp(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap', marginBottom: 'var(--space-5)', fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> {selectedOpp.location}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> {selectedOpp.duration}</span>
                <span>{selectedOpp.department}</span>
              </div>

              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-lg)', color: selectedOpp.matchScore >= 90 ? 'var(--we-success)' : '#B45309', marginBottom: 'var(--space-5)' }}>
                {selectedOpp.matchScore}% Profile Match
              </div>

              <p style={{ marginBottom: 'var(--space-5)', lineHeight: 1.7 }}>{selectedOpp.description}</p>

              <h4 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-3)' }}>Requirements</h4>
              <ul style={{ marginBottom: 'var(--space-5)', paddingLeft: 'var(--space-5)' }}>
                {selectedOpp.requirements.map((r, i) => <li key={i} style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)', color: 'var(--we-gray-600)' }}>{r}</li>)}
              </ul>

              <h4 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-3)' }}>What You'll Learn</h4>
              <ul style={{ marginBottom: 'var(--space-5)', paddingLeft: 'var(--space-5)' }}>
                {selectedOpp.youllLearn.map((l, i) => <li key={i} style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)', color: 'var(--we-gray-600)' }}>{l}</li>)}
              </ul>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                {selectedOpp.tags.map(tag => <span key={tag} className="badge badge-gray">{tag}</span>)}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => toggleSave(selectedOpp.id)}>
                {savedIds.has(selectedOpp.id) ? <><BookmarkCheck size={16} /> Saved</> : <><Bookmark size={16} /> Save</>}
              </button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-primary" onClick={() => { addToast('Application submitted successfully!', 'success'); setSelectedOpp(null); }}>
                Apply Now <ExternalLink size={16} />
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
