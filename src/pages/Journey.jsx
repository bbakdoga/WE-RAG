import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { usePoints } from '../context/PointsContext';
import { badges } from '../data/badges';
import { sendToGemini, resetConversation, isGeminiConfigured } from '../utils/geminiService';
import { isProductQuery, generateProductResponse } from '../utils/productSearch';
import { Send, Sparkles, Map, Zap, AlertCircle, RefreshCw, Bot } from 'lucide-react';
import { staggerContainer, fadeUpVariant, listStagger, listItemFade } from '../utils/animations';
import AnimatedNumber from '../components/AnimatedNumber';

const quickReplies = [
  'What WE components should I use for a buck converter?',
  'Explore career paths at Würth Elektronik',
  'Help me choose a thesis topic',
  'Recommend components for an IoT sensor node',
  'How do I get free components for my project?',
  'What skills should I develop for hardware engineering?',
  'Prepare me for a WE internship interview',
];

// Simple markdown renderer: bold, bullets, links
function renderMarkdown(text) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Bullet points
    if (line.match(/^[\s]*[-•*]\s/)) {
      const content = line.replace(/^[\s]*[-•*]\s/, '');
      return <li key={i} style={{ marginLeft: 'var(--space-4)', listStyle: 'disc' }}>{renderInline(content)}</li>;
    }
    // Numbered lists
    if (line.match(/^[\s]*\d+\.\s/)) {
      const content = line.replace(/^[\s]*\d+\.\s/, '');
      return <li key={i} style={{ marginLeft: 'var(--space-4)', listStyle: 'decimal' }}>{renderInline(content)}</li>;
    }
    // Headers
    if (line.startsWith('### ')) return <h4 key={i} style={{ fontWeight: 700, marginTop: 'var(--space-3)' }}>{renderInline(line.slice(4))}</h4>;
    if (line.startsWith('## ')) return <h3 key={i} style={{ fontWeight: 700, marginTop: 'var(--space-3)' }}>{renderInline(line.slice(3))}</h3>;
    // Empty lines
    if (!line.trim()) return <br key={i} />;
    // Regular paragraph
    return <p key={i} style={{ margin: '2px 0' }}>{renderInline(line)}</p>;
  });
}

function renderInline(text) {
  // Bold, italic, links, inline code
  const parts = [];
  const regex = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(\[(.+?)\]\((.+?)\))|(`(.+?)`)/g;
  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    if (match[1]) parts.push(<strong key={key++}>{match[2]}</strong>);
    else if (match[3]) parts.push(<em key={key++}>{match[4]}</em>);
    else if (match[5]) parts.push(<a key={key++} href={match[7]} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--we-rot)', textDecoration: 'underline' }}>{match[6]}</a>);
    else if (match[8]) parts.push(<code key={key++} style={{ background: 'var(--we-gray-100)', padding: '1px 4px', borderRadius: 4, fontSize: '0.9em' }}>{match[9]}</code>);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

export default function Journey() {
  const { user } = useAuth();
  const { points, getTier, streak } = usePoints();
  const tier = getTier();
  const [activeTab, setActiveTab] = useState('companion');
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', text: `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm your AI Career & Product Companion, powered by Gemini.\n\nI can help you with:\n🔌 **Product recommendations** — Find the right Würth Elektronik components for your project\n🎯 **Career guidance** — Explore paths, thesis topics, and interview prep\n📈 **Skill development** — Personalized learning recommendations\n\nWhat would you like to explore?` }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const earnedBadges = badges.filter(b => b.earned);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleNewChat = () => {
    resetConversation();
    setChatMessages([
      { role: 'bot', text: `Fresh start! 👋 What would you like to explore?\n\n🔌 Components & products\n🎯 Career paths\n📝 Thesis topics\n📈 Skill development` }
    ]);
    setError(null);
  };

  const sendMessage = async (text) => {
    const msg = text || inputText;
    if (!msg.trim() || isLoading) return;

    setChatMessages(prev => [...prev, { role: 'user', text: msg }]);
    setInputText('');
    setIsLoading(true);
    setError(null);

    try {
      if (!isGeminiConfigured()) throw new Error('API key not configured');

      const aiResponse = await sendToGemini(msg, {
        name: user?.name,
        program: user?.program,
        university: user?.university,
        interests: user?.interests,
        skills: user?.skills,
      });

      setChatMessages(prev => [...prev, { role: 'bot', text: aiResponse }]);
    } catch (err) {
      console.error('Gemini error:', err);

      // Fallback to local product search
      let fallbackResponse;
      if (isProductQuery(msg)) {
        const productResult = generateProductResponse(msg);
        fallbackResponse = `*Note: The AI service is currently busy (${err.message}). Falling back to local catalog search:*\n\n${productResult}`;
      } else {
        fallbackResponse = `I'm having trouble connecting to the AI service right now. Here are some things you can try:\n\n` +
          `🔌 Ask me about **components** — "What inductor for a buck converter?"\n` +
          `🎯 Ask about **career paths** — "Explore careers at Würth Elektronik"\n` +
          `📝 Ask about **thesis topics** — "Help me choose a thesis topic"\n\n` +
          `*Error: ${err.message}*`;
      }
      setChatMessages(prev => [...prev, { role: 'bot', text: fallbackResponse }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div className="animate-fade-in" initial="hidden" animate="show" variants={staggerContainer}>
      <motion.div className="page-header" variants={fadeUpVariant}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1>My Journey</h1>
            <p>Track your progress and get AI-powered career guidance.</p>
          </div>
          {/* Gemini badge */}
          <div className="gemini-badge">
            <Sparkles size={13} />
            Gemini 2.5
          </div>
        </div>
      </motion.div>

      <motion.div className="tabs" variants={fadeUpVariant}>
        {['companion', 'progress'].map(tab => (
          <button 
            key={tab} 
            className={`tab-item ${activeTab === tab ? 'active' : ''}`} 
            style={{ position: 'relative' }}
            onClick={() => setActiveTab(tab)}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="journeyTabIndicator"
                style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: 2, background: 'var(--we-rot)' }}
              />
            )}
            {tab === 'companion' ? 'AI Career Companion' : 'Journey Progress'}
          </button>
        ))}
      </motion.div>

      {activeTab === 'companion' ? (
        <motion.div className="ai-chat-container" variants={fadeUpVariant} key="companion">
          {/* Chat header */}
          <div className="ai-chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div className="ai-avatar">
                <Sparkles size={18} />
              </div>
              <div>
                <strong>AI Career & Product Companion</strong>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--we-gray-400)' }}>
                  Powered by Gemini 2.5 · Google Search Grounding
                </div>
              </div>
            </div>
            <button className="btn btn-ghost" onClick={handleNewChat} title="New Chat" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <RefreshCw size={16} />
              <span style={{ fontSize: 'var(--text-sm)' }}>New Chat</span>
            </button>
          </div>

          <div className="ai-chat-messages">
            <AnimatePresence initial={false}>
              {chatMessages.map((msg, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }} 
                  className={`ai-message ${msg.role}`}
                >
                {msg.role === 'bot' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                    <Sparkles size={13} style={{ color: 'var(--we-rot)' }} />
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--we-rot)' }}>AI Companion</span>
                  </div>
                )}
                <div style={{ whiteSpace: 'pre-wrap' }}>{renderMarkdown(msg.text)}</div>
                {msg.role === 'bot' && i === 0 && (
                  <div className="ai-quick-replies">
                    {quickReplies.map(qr => (
                      <button key={qr} className="ai-quick-reply" onClick={() => sendMessage(qr)}>
                        {qr}
                      </button>
                    ))}
                  </div>
                )}
                </motion.div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="ai-message bot">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                    <Sparkles size={13} style={{ color: 'var(--we-rot)' }} />
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--we-rot)' }}>AI Companion</span>
                  </div>
                  <div className="ai-thinking">
                    <span />
                    <span />
                    <span />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <div className="chat-input-wrapper">
              <textarea
                className="chat-input"
                placeholder="Ask about components, career paths, thesis topics, or anything..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                rows={1}
                disabled={isLoading}
              />
              <button className="btn btn-primary btn-icon" onClick={() => sendMessage()} disabled={!inputText.trim() || isLoading}>
                <Send size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        /* Journey Progress */
        <motion.div style={{ maxWidth: 700 }} key="progress" variants={staggerContainer} initial="hidden" animate="show" exit="hidden">
          <motion.div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }} variants={fadeUpVariant}>
            <h3 style={{ marginBottom: 'var(--space-5)' }}>Your Journey at a Glance</h3>
            <div className="grid-3" style={{ gap: 'var(--space-4)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem' }}>{tier.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)' }}>{tier.name}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)' }}><AnimatedNumber value={points} /> points</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem' }}>🔥</div>
                <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)' }}><AnimatedNumber value={streak} /> Days</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)' }}>Current Streak</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem' }}>🏅</div>
                <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)' }}><AnimatedNumber value={earnedBadges.length} /></div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)' }}>Badges Earned</div>
              </div>
            </div>
          </motion.div>

          <motion.div className="card" style={{ padding: 'var(--space-6)' }} variants={listStagger} initial="hidden" animate="show">
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
                <motion.div key={i} variants={listItemFade} style={{ position: 'relative' }}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }} style={{ position: 'absolute', left: 'calc(-1 * var(--space-5) - 7px)', width: 12, height: 12, borderRadius: '50%', background: item.color, border: '2px solid white' }} />
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--we-gray-400)', marginBottom: 2 }}>{item.date}</div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{item.icon} {item.title}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
