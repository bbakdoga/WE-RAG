import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePoints } from '../context/PointsContext';
import { badges } from '../data/badges';
import { Send, Bot, User, Sparkles, Briefcase, BookOpen, FileText, Target, Map } from 'lucide-react';

const careerPaths = [
  { title: 'Hardware Development', icon: '🔧', desc: 'Design circuits, PCBs, and electronic modules for automotive and industrial applications.', match: 92 },
  { title: 'Embedded Software', icon: '💻', desc: 'Develop firmware and software for microcontrollers and embedded systems.', match: 88 },
  { title: 'R&D / Innovation', icon: '🔬', desc: 'Research new technologies and develop next-generation electronic components.', match: 85 },
  { title: 'Applications Engineering', icon: '🎯', desc: 'Support customers in selecting and integrating WE components into their designs.', match: 78 },
  { title: 'Product Management', icon: '📊', desc: 'Lead product strategy and lifecycle management for component families.', match: 65 },
];

const quickReplies = [
  'Explore career paths at WE',
  'Help me choose a thesis topic',
  'What skills should I develop?',
  'Review my CV checklist',
  'Prepare for interview',
];

export default function Journey() {
  const { user } = useAuth();
  const { points, getTier, streak } = usePoints();
  const tier = getTier();
  const [activeTab, setActiveTab] = useState('companion');
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', text: `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm your AI Career Companion. Based on your profile — ${user?.program} at ${user?.university}, with interests in ${user?.interests?.slice(0, 2).join(' & ')} — I can help you navigate your career journey at Würth Elektronik.\n\nWhat would you like to explore?` }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const earnedBadges = badges.filter(b => b.earned);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const simulateResponse = (userMsg) => {
    setIsTyping(true);
    const lowerMsg = userMsg.toLowerCase();
    let response = '';

    if (lowerMsg.includes('career path') || lowerMsg.includes('explore career')) {
      response = `Based on your profile in **${user?.program}** with skills in ${user?.skills?.slice(0, 3).join(', ')}, here are the career paths that match you best at Würth Elektronik:\n\n` +
        careerPaths.map(p => `${p.icon} **${p.title}** (${p.match}% match)\n${p.desc}`).join('\n\n') +
        `\n\nWould you like me to go deeper into any of these paths? I can show you current openings, required skills, and real employee stories.`;
    } else if (lowerMsg.includes('thesis')) {
      response = `Great question! Based on your interests in ${user?.interests?.slice(0, 2).join(' & ')}, here are 3 thesis topics currently available:\n\n` +
        `📝 **1. EMC Analysis of High-Speed PCB Designs Using ML**\nCombine machine learning with EMC simulation — perfect for your signal processing background.\n\n` +
        `📝 **2. Thermal Management in GaN-Based Power Converters**\nInvestigate cooling solutions for next-gen power systems.\n\n` +
        `📝 **3. Low-Power Sensor Networks for Industrial IoT**\nDesign energy-efficient wireless sensor networks using WE components.\n\nAll three come with full lab access and mentoring. Want me to help you prepare an application?`;
    } else if (lowerMsg.includes('skill') || lowerMsg.includes('develop')) {
      response = `Here's a personalized skill gap analysis for your target career path:\n\n` +
        `✅ **Strong in:** ${user?.skills?.slice(0, 3).join(', ')}\n\n` +
        `🔄 **Should strengthen:**\n- RTOS Programming — Take the "Embedded Systems" quiz\n- PCB Design for EMC — Try the "EMC & Signal Integrity" quiz\n- Power Supply Design — Complete the "Power Electronics" quiz\n\n` +
        `📈 **Recommended learning path:**\n1. Complete 2 skill quizzes this week (+20 pts)\n2. Join the #embedded-systems channel for daily tips\n3. Sign up for the KiCad Workshop on Aug 5\n4. Request mentoring from Dr. Thomas Brander (95% match)\n\nShall I help you get started with any of these?`;
    } else if (lowerMsg.includes('cv') || lowerMsg.includes('resume')) {
      response = `Here's a CV review checklist tailored for engineering roles at WE:\n\n` +
        `✅ **Contact info & LinkedIn** — Make sure your WE-Connect profile badge is linked\n` +
        `✅ **Education** — Include relevant coursework and GPA\n` +
        `✅ **Technical skills** — List specific tools (Altium, KiCad, MATLAB, etc.)\n` +
        `⚠️ **Projects** — Add your community contributions and quiz badges\n` +
        `⚠️ **Experience** — Quantify achievements (e.g., "Reduced power consumption by 30%")\n` +
        `❌ **Cover letter** — Customize for each position, mention WE products you've used\n\n` +
        `💡 **Pro tip:** Your WE-Connect badges (${earnedBadges.length} earned!) can be added to your CV as verified certifications.`;
    } else if (lowerMsg.includes('interview') || lowerMsg.includes('prepare')) {
      response = `Here are common interview questions for engineering roles at WE:\n\n` +
        `🎯 **Technical:**\n- Explain how a buck converter works and key design considerations\n- How would you approach EMC issues in a PCB design?\n- Describe a challenging embedded project and how you solved it\n\n` +
        `💼 **Behavioral:**\n- Tell us about a team project where you faced disagreements\n- How do you stay current with new technologies?\n- Why Würth Elektronik specifically?\n\n` +
        `💡 **Tips:**\n- Mention WE components you've used in projects\n- Reference your WE-Connect profile and badges\n- Ask about their R&D roadmap and team culture\n\nWant me to do a mock interview for a specific role?`;
    } else {
      response = `That's a great question! Here are some things I can help you with:\n\n` +
        `🎯 **Career exploration** — Find the right path at WE\n` +
        `📝 **Thesis guidance** — Match with topics and prepare applications\n` +
        `📈 **Skill development** — Personalized learning path\n` +
        `📄 **CV optimization** — Review checklist and tips\n` +
        `🎤 **Interview prep** — Practice questions and strategies\n\nJust ask me about any of these!`;
    }

    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: 'bot', text: response }]);
      setIsTyping(false);
    }, 1200);
  };

  const sendMessage = (text) => {
    const msg = text || inputText;
    if (!msg.trim()) return;
    setChatMessages(prev => [...prev, { role: 'user', text: msg }]);
    setInputText('');
    simulateResponse(msg);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>My Journey</h1>
        <p>Track your progress and get AI-powered career guidance.</p>
      </div>

      <div className="tabs">
        <button className={`tab-item ${activeTab === 'companion' ? 'active' : ''}`} onClick={() => setActiveTab('companion')}>AI Career Companion</button>
        <button className={`tab-item ${activeTab === 'progress' ? 'active' : ''}`} onClick={() => setActiveTab('progress')}>Journey Progress</button>
      </div>

      {activeTab === 'companion' ? (
        <div className="ai-chat-container">
          <div className="ai-chat-messages">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`ai-message ${msg.role}`}>
                {msg.role === 'bot' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                    <Sparkles size={14} style={{ color: 'var(--we-rot)' }} />
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--we-rot)' }}>AI Career Companion</span>
                  </div>
                )}
                <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text.split('**').map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}</div>
                {msg.role === 'bot' && i === 0 && (
                  <div className="ai-quick-replies">
                    {quickReplies.map(qr => (
                      <button key={qr} className="ai-quick-reply" onClick={() => sendMessage(qr)}>
                        {qr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="ai-message bot">
                <div style={{ display: 'flex', gap: 4 }}>
                  <span style={{ animation: 'pulse 1s infinite', animationDelay: '0s' }}>●</span>
                  <span style={{ animation: 'pulse 1s infinite', animationDelay: '0.2s' }}>●</span>
                  <span style={{ animation: 'pulse 1s infinite', animationDelay: '0.4s' }}>●</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <div className="chat-input-wrapper">
              <textarea
                className="chat-input"
                placeholder="Ask me about career paths, thesis topics, skills, or interview prep..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                rows={1}
              />
              <button className="btn btn-primary btn-icon" onClick={() => sendMessage()} disabled={!inputText.trim()}>
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Journey Progress */
        <div style={{ maxWidth: 700 }}>
          <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
            <h3 style={{ marginBottom: 'var(--space-5)' }}>Your Journey at a Glance</h3>
            <div className="grid-3" style={{ gap: 'var(--space-4)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem' }}>{tier.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)' }}>{tier.name}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)' }}>{points} points</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem' }}>🔥</div>
                <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)' }}>{streak} Days</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)' }}>Current Streak</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem' }}>🏅</div>
                <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)' }}>{earnedBadges.length}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)' }}>Badges Earned</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <h3 style={{ marginBottom: 'var(--space-5)' }}>Activity Timeline</h3>
            <div style={{ borderLeft: '2px solid var(--we-gray-200)', paddingLeft: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              {[
                { date: 'Today', title: 'Logged in — Day 12 streak!', icon: '🔥', color: 'var(--we-warning)' },
                { date: 'Yesterday', title: 'Completed PCB Design quiz (87%)', icon: '📝', color: 'var(--we-cyan)' },
                { date: 'Jun 18', title: 'Posted in #embedded-systems', icon: '💬', color: 'var(--we-green)' },
                { date: 'Jun 15', title: 'Earned "Career Ready Student" badge', icon: '🏅', color: 'var(--we-rot)' },
                { date: 'Jun 12', title: 'Registered for Innovation Challenge', icon: '🏆', color: 'var(--we-warning)' },
                { date: 'Jun 10', title: 'Saved 3 thesis opportunities', icon: '📌', color: 'var(--we-cyan)' },
                { date: 'Jun 5', title: 'Joined WE-Connect platform', icon: '🎉', color: 'var(--we-success)' },
              ].map((item, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 'calc(-1 * var(--space-5) - 7px)', width: 12, height: 12, borderRadius: '50%', background: item.color, border: '2px solid white' }} />
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--we-gray-400)', marginBottom: 2 }}>{item.date}</div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{item.icon} {item.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
