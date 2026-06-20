import { useState } from 'react';
import { events, eventCategories } from '../data/events';
import { Calendar as CalIcon, MapPin, Clock, Users, Video, ChevronLeft, ChevronRight, X, Check } from 'lucide-react';

export default function Events() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [view, setView] = useState('list');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredIds, setRegisteredIds] = useState(new Set(events.filter(e => e.registered).map(e => e.id)));

  const filtered = events.filter(e => activeCategory === 'all' || e.category === activeCategory);

  const toggleRegister = (id) => {
    setRegisteredIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const eventColors = {
    hackathon: 'var(--we-rot)', 'guest-lecture': 'var(--we-cyan)', workshop: 'var(--we-green-dark)',
    'career-fair': '#7C3AED', webinar: 'var(--we-info)', 'company-visit': '#F59E0B'
  };

  // Calendar
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();
  const calDays = [];
  for (let i = 0; i < (firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1); i++) calDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calDays.push(d);

  const getEventsForDay = (day) => {
    if (!day) return [];
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr || (e.endDate && e.date <= dateStr && e.endDate >= dateStr));
  };

  const today = new Date();
  const isToday = (day) => day && calMonth === today.getMonth() && calYear === today.getFullYear() && day === today.getDate();

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1>Events</h1>
          <p>Guest lectures, hackathons, workshops, and more.</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className={`btn btn-sm ${view === 'list' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setView('list')}>List</button>
          <button className={`btn btn-sm ${view === 'calendar' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setView('calendar')}>Calendar</button>
        </div>
      </div>

      <div className="filter-pills" style={{ marginBottom: 'var(--space-6)' }}>
        {eventCategories.map(c => (
          <button key={c.key} className={`chip ${activeCategory === c.key ? 'active' : ''}`} onClick={() => setActiveCategory(c.key)}>
            {c.label}
          </button>
        ))}
      </div>

      {view === 'list' ? (
        <div className="grid-2">
          {filtered.map(evt => (
            <div key={evt.id} className="card card-elevated" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }} onClick={() => setSelectedEvent(evt)}>
              <div style={{ height: 8, background: eventColors[evt.category] || 'var(--we-gray-300)' }} />
              <div style={{ padding: 'var(--space-5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                  <span className={`badge ${evt.isOnline ? 'badge-cyan' : 'badge-green'}`}>
                    {evt.isOnline ? <><Video size={10} /> Online</> : 'In-Person'}
                  </span>
                  <span className="badge badge-gray">{evt.category.replace(/-/g, ' ')}</span>
                </div>
                <h4 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-3)' }}>{evt.title}</h4>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)', marginBottom: 'var(--space-3)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {evt.description}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)', marginBottom: 'var(--space-4)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><CalIcon size={14} /> {new Date(evt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · {evt.time}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={14} /> {evt.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Users size={14} /> {evt.attendees}{evt.maxAttendees ? `/${evt.maxAttendees}` : ''} attendees</span>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
                  {evt.tags.map(t => <span key={t} className="badge badge-gray">{t}</span>)}
                </div>
                <button className={`btn ${registeredIds.has(evt.id) ? 'btn-secondary' : 'btn-primary'}`} style={{ width: '100%' }} onClick={(e) => { e.stopPropagation(); toggleRegister(evt.id); }}>
                  {registeredIds.has(evt.id) ? <><Check size={16} /> Registered</> : 'Register Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Calendar View */
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }}>
              <ChevronLeft size={18} />
            </button>
            <h3>{new Date(calYear, calMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }}>
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="calendar-grid">
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
              <div key={d} className="calendar-header-cell">{d}</div>
            ))}
            {calDays.map((day, i) => {
              const dayEvents = getEventsForDay(day);
              return (
                <div key={i} className={`calendar-cell ${isToday(day) ? 'today' : ''}`}>
                  {day && (
                    <>
                      <div className="date-num">{day}</div>
                      {dayEvents.map(e => (
                        <div key={e.id} style={{ fontSize: 10, padding: '1px 4px', borderRadius: 3, background: eventColors[e.category], color: 'white', marginBottom: 2, cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} onClick={() => setSelectedEvent(e)}>
                          {e.title.slice(0, 20)}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                  <span className={`badge ${selectedEvent.isOnline ? 'badge-cyan' : 'badge-green'}`}>{selectedEvent.isOnline ? 'Online' : 'In-Person'}</span>
                  <span className="badge badge-gray">{selectedEvent.category.replace(/-/g, ' ')}</span>
                </div>
                <h3>{selectedEvent.title}</h3>
              </div>
              <button className="btn btn-icon btn-ghost" onClick={() => setSelectedEvent(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-5)', fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><CalIcon size={16} /> {new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} · {selectedEvent.time}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={16} /> {selectedEvent.location}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Users size={16} /> {selectedEvent.attendees}{selectedEvent.maxAttendees ? ` / ${selectedEvent.maxAttendees} spots` : ''}</span>
              </div>

              <p style={{ marginBottom: 'var(--space-5)', lineHeight: 1.7 }}>{selectedEvent.description}</p>

              {selectedEvent.speakers.length > 0 && (
                <>
                  <h4 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-3)' }}>Speakers</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
                    {selectedEvent.speakers.map((s, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div className="avatar avatar-sm" style={{ background: eventColors[selectedEvent.category] }}>{s[0]}</div>
                        <span style={{ fontSize: 'var(--text-sm)' }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {selectedEvent.agenda.length > 0 && (
                <>
                  <h4 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-3)' }}>Agenda</h4>
                  <div style={{ marginBottom: 'var(--space-5)' }}>
                    {selectedEvent.agenda.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: 'var(--space-3)', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--we-gray-100)' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--we-gray-400)', minWidth: 50 }}>{item.time}</span>
                        <span style={{ fontSize: 'var(--text-sm)' }}>{item.title}</span>
                        {item.day && <span className="badge badge-gray" style={{ fontSize: 10, marginLeft: 'auto' }}>{item.day}</span>}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary">Add to Calendar</button>
              <button className={`btn ${registeredIds.has(selectedEvent.id) ? 'btn-secondary' : 'btn-primary'}`} onClick={() => toggleRegister(selectedEvent.id)}>
                {registeredIds.has(selectedEvent.id) ? <><Check size={16} /> Registered</> : 'Register Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
