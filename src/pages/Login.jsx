import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ChevronRight, Zap } from 'lucide-react';

const interestOptions = ['Embedded Systems', 'PCB Design', 'IoT', 'Automotive', 'Power Electronics', 'Software Engineering', 'Data Science', 'Robotics', 'AI/ML', 'Renewable Energy', 'Signal Processing', 'Maker Projects'];
const goalOptions = ['Internship', 'Working Student', 'Thesis', 'Scholarship', 'Full-time', 'Mentoring', 'Free Components'];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState('login'); // login | register
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', university: '', program: '',
    degree: 'Bachelor', semester: 1, interests: [], goals: [],
  });

  const handleQuickLogin = () => {
    login();
    navigate('/');
  };

  const handleRegister = () => {
    if (step < 4) { setStep(s => s + 1); return; }
    login({ ...formData, initials: formData.name.split(' ').map(n => n[0]).join('').toUpperCase() });
    navigate('/');
  };

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const toggleGoal = (goal) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-left">
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.15)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-6)', fontSize: '2rem', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
            W
          </div>
          <h1 style={{ color: 'white', fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-4)' }}>WE-Connect</h1>
          <p style={{ opacity: 0.85, fontSize: 'var(--text-lg)', maxWidth: 400, lineHeight: 1.6 }}>
            Your gateway to opportunities, mentoring, and community at Würth Elektronik.
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-10)', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { num: '10K+', label: 'Components' },
              { num: '1.2K', label: 'Students' },
              { num: '50+', label: 'Workshops' },
              { num: '118', label: 'Initiatives' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3) var(--space-5)', backdropFilter: 'blur(8px)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 'var(--text-xl)' }}>{s.num}</div>
                <div style={{ fontSize: 'var(--text-xs)', opacity: 0.7 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-form">
          {mode === 'login' ? (
            <>
              <h1>Welcome back</h1>
              <p className="auth-subtitle">Sign in to your WE-Connect account</p>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" placeholder="anna.mueller@tum.de" />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input className="form-input" type={showPassword ? 'text' : 'password'} placeholder="••••••••" />
                  <button style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--we-gray-400)' }} onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button className="btn btn-primary btn-lg" style={{ width: '100%', marginBottom: 'var(--space-4)' }} onClick={handleQuickLogin}>
                Sign In
              </button>

              <div style={{ textAlign: 'center', margin: 'var(--space-4) 0', color: 'var(--we-gray-400)', fontSize: 'var(--text-sm)' }}>or</div>

              <button className="btn btn-outline btn-lg" style={{ width: '100%', marginBottom: 'var(--space-6)' }} onClick={handleQuickLogin}>
                <Zap size={18} /> Quick Demo Login (as Anna Müller)
              </button>

              <p style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)' }}>
                Don't have an account?{' '}
                <button style={{ background: 'none', border: 'none', color: 'var(--we-rot)', cursor: 'pointer', fontWeight: 600, fontSize: 'var(--text-sm)' }} onClick={() => setMode('register')}>
                  Register now
                </button>
              </p>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                <h1 style={{ fontSize: 'var(--text-2xl)' }}>Create Account</h1>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-400)' }}>Step {step} of 4</span>
              </div>
              <p className="auth-subtitle">
                {step === 1 && 'Let\'s start with the basics'}
                {step === 2 && 'Tell us about your studies'}
                {step === 3 && 'What are you interested in?'}
                {step === 4 && 'What are your career goals?'}
              </p>

              {/* Step Indicator */}
              <div className="step-indicator">
                {[1, 2, 3, 4].map(s => (
                  <div key={s} className={`step-dot ${s === step ? 'active' : s < step ? 'completed' : ''}`} />
                ))}
              </div>

              {step === 1 && (
                <>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input className="form-input" placeholder="Anna Müller" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">University Email</label>
                    <input className="form-input" type="email" placeholder="anna.mueller@tum.de" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input className="form-input" type="password" placeholder="Min. 8 characters" value={formData.password} onChange={e => setFormData(p => ({ ...p, password: e.target.value }))} />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="form-group">
                    <label className="form-label">University</label>
                    <select className="form-input form-select" value={formData.university} onChange={e => setFormData(p => ({ ...p, university: e.target.value }))}>
                      <option value="">Select university...</option>
                      {['TU Munich', 'KIT', 'RWTH Aachen', 'ETH Zürich', 'TU Darmstadt', 'Uni Stuttgart', 'TU Berlin', 'Other'].map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Study Program</label>
                    <input className="form-input" placeholder="e.g. Electrical Engineering" value={formData.program} onChange={e => setFormData(p => ({ ...p, program: e.target.value }))} />
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Degree</label>
                      <select className="form-input form-select" value={formData.degree} onChange={e => setFormData(p => ({ ...p, degree: e.target.value }))}>
                        {['Bachelor', 'Master', 'PhD'].map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Semester</label>
                      <select className="form-input form-select" value={formData.semester} onChange={e => setFormData(p => ({ ...p, semester: Number(e.target.value) }))}>
                        {[1,2,3,4,5,6,7,8,9,10].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)', marginBottom: 'var(--space-4)' }}>Select all topics that interest you (choose at least 2)</p>
                  <div className="interests-grid">
                    {interestOptions.map(interest => (
                      <div key={interest} className={`chip ${formData.interests.includes(interest) ? 'active' : ''}`} onClick={() => toggleInterest(interest)} style={{ justifyContent: 'center', textAlign: 'center' }}>
                        {interest}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)', marginBottom: 'var(--space-4)' }}>What are you looking for?</p>
                  <div className="interests-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))' }}>
                    {goalOptions.map(goal => (
                      <div key={goal} className={`chip ${formData.goals.includes(goal) ? 'active' : ''}`} onClick={() => toggleGoal(goal)} style={{ justifyContent: 'center', textAlign: 'center' }}>
                        {goal}
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
                {step > 1 && (
                  <button className="btn btn-secondary btn-lg" style={{ flex: 1 }} onClick={() => setStep(s => s - 1)}>Back</button>
                )}
                <button className="btn btn-primary btn-lg" style={{ flex: 2 }} onClick={handleRegister}>
                  {step < 4 ? <>Continue <ChevronRight size={18} /></> : '🚀 Create Account'}
                </button>
              </div>

              <p style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)', marginTop: 'var(--space-5)' }}>
                Already have an account?{' '}
                <button style={{ background: 'none', border: 'none', color: 'var(--we-rot)', cursor: 'pointer', fontWeight: 600, fontSize: 'var(--text-sm)' }} onClick={() => { setMode('login'); setStep(1); }}>
                  Sign in
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
