import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Plus, Clock, Users, Zap, CheckCircle, ChevronRight, Play, Pause, Trash2, ArrowRight } from 'lucide-react';
import { staggerContainer, fadeUpVariant, pageVariants } from '../../utils/animations';

const initialCampaigns = [
  { id: 'c1', name: 'Welcome & Onboarding Series', status: 'active', audience: 'New Registrations', openRate: '68%', clickRate: '42%', sent: 1250 },
  { id: 'c2', name: 'Innovation Challenge Follow-up', status: 'paused', audience: 'Event Attendees (Hack26)', openRate: '82%', clickRate: '56%', sent: 320 },
  { id: 'c3', name: 'Level Up Nudge', status: 'active', audience: 'Students 10pts away from Level 2', openRate: '55%', clickRate: '28%', sent: 87 },
];

const triggers = [
  { id: 't1', icon: Clock, name: 'Time-based', desc: 'E.g., 3 days after signup, inactive for 14 days' },
  { id: 't2', icon: Zap, name: 'Event-based', desc: 'E.g., completed a quiz, earned a badge, registered for event' },
  { id: 't3', icon: Users, name: 'Segment-based', desc: 'E.g., entered new Tier, changed program' },
];

const audiences = [
  { id: 'a1', name: 'All Active Students' },
  { id: 'a2', name: 'Inactive Students (>14 days)' },
  { id: 'a3', name: 'Top Tier (Level 4+)' },
  { id: 'a4', name: 'Specific University' },
];

const templates = [
  { id: 'tp1', name: 'Welcome to WE-Connect', subject: 'Your journey starts here! 🚀' },
  { id: 'tp2', name: 'Nudge to Complete Profile', subject: 'Unlock more opportunities...' },
  { id: 'tp3', name: 'New Jobs Match', subject: 'We found roles matching your skills 💼' },
  { id: 'tp4', name: 'Event Reminder', subject: 'Don\'t forget tomorrow\'s seminar!' },
];

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [builderStep, setBuilderStep] = useState(1);
  const [newCampaign, setNewCampaign] = useState({ name: '', trigger: '', audience: '', template: '' });

  const toggleStatus = (id) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) return { ...c, status: c.status === 'active' ? 'paused' : 'active' };
      return c;
    }));
  };

  const deleteCampaign = (id) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  const handleNextStep = () => {
    if (builderStep < 4) setBuilderStep(prev => prev + 1);
    else {
      // Finish building
      const created = {
        id: `c${Date.now()}`,
        name: newCampaign.name || 'Untitled Campaign',
        status: 'active',
        audience: audiences.find(a => a.id === newCampaign.audience)?.name || 'Custom Audience',
        openRate: '0%',
        clickRate: '0%',
        sent: 0
      };
      setCampaigns([created, ...campaigns]);
      setIsBuilderOpen(false);
      setBuilderStep(1);
      setNewCampaign({ name: '', trigger: '', audience: '', template: '' });
    }
  };

  return (
    <motion.div className="animate-fade-in" variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ paddingBottom: 'var(--space-10)' }}>
      {!isBuilderOpen ? (
        <>
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
            <div>
              <h1>Campaigns & Automation</h1>
              <p>Roll out email automations for onboarding, nudges, and follow-ups.</p>
            </div>
            <button className="btn btn-primary" onClick={() => setIsBuilderOpen(true)}>
              <Plus size={18} /> Create Automation
            </button>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--we-gray-200)', background: 'var(--we-gray-50)' }}>
                  <th style={{ padding: 'var(--space-3)' }}>Campaign Name</th>
                  <th style={{ padding: 'var(--space-3)' }}>Status</th>
                  <th style={{ padding: 'var(--space-3)' }}>Target Audience</th>
                  <th style={{ padding: 'var(--space-3)' }}>Sent</th>
                  <th style={{ padding: 'var(--space-3)' }}>Open Rate</th>
                  <th style={{ padding: 'var(--space-3)' }}>Click Rate</th>
                  <th style={{ padding: 'var(--space-3)', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {campaigns.map(c => (
                    <motion.tr 
                      key={c.id} 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
                      style={{ borderBottom: '1px solid var(--we-gray-100)' }}
                    >
                      <td style={{ padding: 'var(--space-3)', fontWeight: 600 }}>{c.name}</td>
                      <td style={{ padding: 'var(--space-3)' }}>
                        <span className={`badge ${c.status === 'active' ? 'badge-green' : 'badge-gray'}`}>
                          {c.status === 'active' ? '● Active' : '⏸ Paused'}
                        </span>
                      </td>
                      <td style={{ padding: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)' }}>{c.audience}</td>
                      <td style={{ padding: 'var(--space-3)', fontFamily: 'var(--font-mono)' }}>{c.sent.toLocaleString()}</td>
                      <td style={{ padding: 'var(--space-3)', fontFamily: 'var(--font-mono)', color: 'var(--we-success)', fontWeight: 600 }}>{c.openRate}</td>
                      <td style={{ padding: 'var(--space-3)', fontFamily: 'var(--font-mono)', color: 'var(--we-cyan)', fontWeight: 600 }}>{c.clickRate}</td>
                      <td style={{ padding: 'var(--space-3)', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 'var(--space-1)', justifyContent: 'flex-end' }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => toggleStatus(c.id)} title={c.status === 'active' ? 'Pause' : 'Resume'}>
                            {c.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                          </button>
                          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--we-rot)' }} onClick={() => deleteCampaign(c.id)} title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {campaigns.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--we-gray-500)' }}>
                      <Mail size={48} style={{ margin: '0 auto var(--space-4)', opacity: 0.5 }} />
                      <p>No active campaigns found. Create one to get started!</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* Automation Builder UI */
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Zap style={{ color: 'var(--we-rot)' }} /> Automation Builder
            </h2>
            <button className="btn btn-ghost" onClick={() => { setIsBuilderOpen(false); setBuilderStep(1); }}>Cancel</button>
          </div>

          {/* Stepper */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-8)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 15, left: 0, right: 0, height: 2, background: 'var(--we-gray-200)', zIndex: 0 }} />
            {[
              { num: 1, label: 'Trigger' },
              { num: 2, label: 'Audience' },
              { num: 3, label: 'Template' },
              { num: 4, label: 'Review' }
            ].map(step => (
              <div key={step.num} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
                <motion.div 
                  animate={{ 
                    background: builderStep >= step.num ? 'var(--we-rot)' : 'var(--we-gray-100)',
                    color: builderStep >= step.num ? 'white' : 'var(--we-gray-500)',
                    borderColor: builderStep >= step.num ? 'var(--we-rot)' : 'var(--we-gray-200)'
                  }}
                  style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid', fontWeight: 600, transition: 'all 0.3s ease' }}
                >
                  {builderStep > step.num ? <CheckCircle size={16} /> : step.num}
                </motion.div>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: builderStep === step.num ? 700 : 500, color: builderStep >= step.num ? 'var(--we-black)' : 'var(--we-gray-400)' }}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          {/* Builder Steps Content */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={builderStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card"
              style={{ padding: 'var(--space-6)', minHeight: 300 }}
            >
              {builderStep === 1 && (
                <div>
                  <h3 style={{ marginBottom: 'var(--space-4)' }}>1. What triggers this automation?</h3>
                  <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                    {triggers.map(t => (
                      <div 
                        key={t.id} 
                        className={`card card-hover ${newCampaign.trigger === t.id ? 'active' : ''}`}
                        style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-4)', cursor: 'pointer', border: newCampaign.trigger === t.id ? '2px solid var(--we-rot)' : '2px solid transparent' }}
                        onClick={() => setNewCampaign({ ...newCampaign, trigger: t.id })}
                      >
                        <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--we-gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--we-gray-600)' }}>
                          <t.icon size={20} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{t.name}</div>
                          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)' }}>{t.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {builderStep === 2 && (
                <div>
                  <h3 style={{ marginBottom: 'var(--space-4)' }}>2. Who should receive this?</h3>
                  <div style={{ display: 'grid', gap: 'var(--space-3)', gridTemplateColumns: '1fr 1fr' }}>
                    {audiences.map(a => (
                      <div 
                        key={a.id} 
                        className={`card card-hover`}
                        style={{ padding: 'var(--space-4)', cursor: 'pointer', border: newCampaign.audience === a.id ? '2px solid var(--we-rot)' : '2px solid transparent', textAlign: 'center' }}
                        onClick={() => setNewCampaign({ ...newCampaign, audience: a.id })}
                      >
                        <div style={{ fontWeight: 600 }}>{a.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {builderStep === 3 && (
                <div>
                  <h3 style={{ marginBottom: 'var(--space-4)' }}>3. Choose an Email Template</h3>
                  <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                    {templates.map(t => (
                      <div 
                        key={t.id} 
                        className={`card card-hover`}
                        style={{ padding: 'var(--space-4)', cursor: 'pointer', border: newCampaign.template === t.id ? '2px solid var(--we-rot)' : '2px solid transparent' }}
                        onClick={() => setNewCampaign({ ...newCampaign, template: t.id })}
                      >
                        <div style={{ fontWeight: 600, marginBottom: 'var(--space-1)' }}>{t.name}</div>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)' }}>Subject: "{t.subject}"</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {builderStep === 4 && (
                <div>
                  <h3 style={{ marginBottom: 'var(--space-4)' }}>4. Review & Launch</h3>
                  <div style={{ marginBottom: 'var(--space-4)' }}>
                    <label className="form-label">Campaign Name</label>
                    <input className="form-input" placeholder="e.g., Q3 Onboarding Sequence" value={newCampaign.name} onChange={e => setNewCampaign({ ...newCampaign, name: e.target.value })} />
                  </div>
                  <div style={{ background: 'var(--we-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                      <Zap size={16} style={{ color: 'var(--we-rot)' }} /> 
                      <span style={{ fontWeight: 600 }}>Trigger:</span> {triggers.find(t => t.id === newCampaign.trigger)?.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                      <Users size={16} style={{ color: 'var(--we-rot)' }} /> 
                      <span style={{ fontWeight: 600 }}>Audience:</span> {audiences.find(a => a.id === newCampaign.audience)?.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <Mail size={16} style={{ color: 'var(--we-rot)' }} /> 
                      <span style={{ fontWeight: 600 }}>Template:</span> {templates.find(t => t.id === newCampaign.template)?.name}
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--we-gray-100)' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={handleNextStep}
                  disabled={
                    (builderStep === 1 && !newCampaign.trigger) ||
                    (builderStep === 2 && !newCampaign.audience) ||
                    (builderStep === 3 && !newCampaign.template) ||
                    (builderStep === 4 && !newCampaign.name.trim())
                  }
                >
                  {builderStep === 4 ? 'Launch Campaign 🚀' : <><ArrowRight size={18} /> Continue</>}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}
