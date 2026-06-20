import { useState } from 'react';
import { channelCategories, messages, feedHighlights } from '../data/channels';
import { useAuth } from '../context/AuthContext';
import { usePoints } from '../context/PointsContext';
import { Hash, ChevronDown, ChevronRight, Pin, Send, SmilePlus, MessageSquare, Users, Eye, EyeOff, Trophy, Calendar, BookOpen, Megaphone } from 'lucide-react';

export default function Community() {
  const { user } = useAuth();
  const { addPoints } = usePoints();
  const [activeChannel, setActiveChannel] = useState('ch-embedded');
  const [showFeed, setShowFeed] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [localMessages, setLocalMessages] = useState(messages);
  const [collapsedCategories, setCollapsedCategories] = useState(new Set());
  const [anonymous, setAnonymous] = useState(false);

  const activeChannelData = channelCategories.flatMap(c => c.channels).find(ch => ch.id === activeChannel);
  const channelMessages = localMessages.filter(m => m.channelId === activeChannel);

  const toggleCategory = (name) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const msg = {
      id: `m-new-${Date.now()}`,
      channelId: activeChannel,
      userId: anonymous ? 'anon' : user.id,
      userName: anonymous ? 'Anonymous Student' : user.name,
      userInitials: anonymous ? '🎭' : user.initials,
      content: newMessage,
      timestamp: new Date().toISOString(),
      reactions: [],
      replies: 0,
    };
    setLocalMessages(prev => [...prev, msg]);
    setNewMessage('');
    addPoints(1, 'Post a message');
  };

  const toggleReaction = (msgId, emoji) => {
    setLocalMessages(prev => prev.map(m => {
      if (m.id !== msgId) return m;
      const existing = m.reactions.find(r => r.emoji === emoji);
      if (existing) {
        return {
          ...m,
          reactions: m.reactions.map(r => r.emoji === emoji ? { ...r, active: !r.active, count: r.active ? r.count - 1 : r.count + 1 } : r)
        };
      }
      return { ...m, reactions: [...m.reactions, { emoji, count: 1, active: true }] };
    }));
  };

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const feedTypeIcons = { challenge: Trophy, announcement: Megaphone, leaderboard: Trophy, event: Calendar, blog: BookOpen };

  return (
    <div className="animate-fade-in">
      <div className="community-layout">
        {/* Channel Sidebar */}
        <div className="channel-sidebar">
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <button className={`channel-item ${showFeed ? 'active' : ''}`} style={{ fontWeight: 600, width: '100%' }} onClick={() => setShowFeed(true)}>
              <Megaphone size={16} /> Feed & Highlights
            </button>
          </div>

          {channelCategories.map(cat => (
            <div key={cat.name} className="channel-category">
              <div className="channel-category-title" onClick={() => toggleCategory(cat.name)}>
                {collapsedCategories.has(cat.name) ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                {cat.name}
              </div>
              {!collapsedCategories.has(cat.name) && cat.channels.map(ch => (
                <div key={ch.id} className={`channel-item ${activeChannel === ch.id && !showFeed ? 'active' : ''}`} onClick={() => { setActiveChannel(ch.id); setShowFeed(false); }}>
                  <span className="channel-hash">{ch.icon}</span>
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ch.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Main Chat Area */}
        {showFeed ? (
          <div className="chat-area" style={{ overflow: 'auto', padding: 'var(--space-6)' }}>
            <h2 style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <Megaphone size={24} /> Community Feed
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {feedHighlights.map((item, i) => {
                const Icon = feedTypeIcons[item.type] || Megaphone;
                return (
                  <div key={i} className="card card-elevated" style={{ padding: 'var(--space-5)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                      <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--we-rot-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--we-rot)' }}>
                        <Icon size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-1)' }}>{item.title}</h4>
                        {item.description && <p style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)' }}>{item.description}</p>}
                        {item.top3 && (
                          <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
                            {item.top3.map((t, j) => (
                              <span key={j} style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                                {['🥇','🥈','🥉'][j]} {t.name} ({t.points}pts)
                              </span>
                            ))}
                          </div>
                        )}
                        {item.deadline && <span className="badge badge-warning" style={{ marginTop: 'var(--space-2)' }}>Deadline: {new Date(item.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
                        {item.participants && <span className="badge badge-cyan" style={{ marginTop: 'var(--space-2)' }}>{item.participants} participants</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="chat-area">
            {/* Chat Header */}
            <div className="chat-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span style={{ fontSize: 'var(--text-lg)' }}>{activeChannelData?.icon}</span>
                <h4 style={{ margin: 0, fontSize: 'var(--text-base)' }}>{activeChannelData?.name}</h4>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-400)', marginLeft: 'var(--space-2)' }}>{activeChannelData?.description}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <button className={`btn btn-sm ${anonymous ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setAnonymous(!anonymous)} title="Toggle Anonymous Mode">
                  {anonymous ? <EyeOff size={14} /> : <Eye size={14} />}
                  {anonymous ? 'Anon' : ''}
                </button>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-400)' }}>
                  <Users size={14} style={{ marginRight: 4 }} />{activeChannelData?.members}
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {channelMessages.length === 0 && (
                <div className="empty-state">
                  <MessageSquare size={48} />
                  <h4>No messages yet</h4>
                  <p>Be the first to start a conversation in this channel!</p>
                </div>
              )}
              {channelMessages.map(msg => (
                <div key={msg.id} className="chat-message">
                  <div className={`avatar avatar-sm`} style={{ background: msg.isAnnouncement ? 'var(--we-gradient-brand)' : msg.userId === 'anon' ? 'var(--we-gray-400)' : undefined }}>
                    {msg.userInitials}
                  </div>
                  <div className="chat-message-content">
                    <div className="chat-message-header">
                      <span className="chat-message-author" style={{ color: msg.isAnnouncement ? 'var(--we-rot)' : undefined }}>
                        {msg.userName}
                        {msg.isAnnouncement && <span className="badge badge-red" style={{ marginLeft: 6, fontSize: 10 }}>Staff</span>}
                        {msg.isHelpful && <span className="badge badge-success" style={{ marginLeft: 6, fontSize: 10 }}>✅ Helpful</span>}
                      </span>
                      <span className="chat-message-time">{formatTime(msg.timestamp)}</span>
                      {msg.isPinned && <Pin size={12} style={{ color: 'var(--we-rot)', marginLeft: 4 }} />}
                    </div>
                    <div className="chat-message-body">{msg.content}</div>
                    <div className="chat-message-reactions">
                      {msg.reactions.map((r, i) => (
                        <span key={i} className={`reaction-chip ${r.active ? 'active' : ''}`} onClick={() => toggleReaction(msg.id, r.emoji)}>
                          {r.emoji} {r.count}
                        </span>
                      ))}
                      <span className="reaction-chip" onClick={() => toggleReaction(msg.id, '👍')}>
                        <SmilePlus size={12} />
                      </span>
                    </div>
                    {msg.replies > 0 && (
                      <button className="btn btn-ghost btn-sm" style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--we-cyan)' }}>
                        <MessageSquare size={12} /> {msg.replies} replies
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="chat-input-area">
              <div className="chat-input-wrapper">
                <textarea
                  className="chat-input"
                  placeholder={`Message #${activeChannelData?.name}${anonymous ? ' (anonymous)' : ''}...`}
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  rows={1}
                />
                <button className="btn btn-primary btn-icon" onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send size={18} />
                </button>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--we-gray-400)', marginTop: 'var(--space-2)' }}>
                Press Enter to send · Shift+Enter for new line · {anonymous ? '🎭 Posting anonymously' : `Posting as ${user?.name}`}
              </div>
            </div>
          </div>
        )}

        {/* Channel Info Sidebar */}
        {!showFeed && (
          <div className="channel-info-sidebar">
            <h4 style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>About</h4>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)', marginBottom: 'var(--space-5)' }}>
              {activeChannelData?.description}
            </p>
            <h4 style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>Members — {activeChannelData?.members}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {['Anna M.', 'Lukas W.', 'Sofia C.', 'Elena P.'].map(name => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--we-success)' }} />
                  {name}
                </div>
              ))}
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--we-gray-400)' }}>
                +{(activeChannelData?.members || 4) - 4} more
              </div>
            </div>

            <h4 style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-5)', marginBottom: 'var(--space-3)' }}>Pinned Messages</h4>
            {channelMessages.filter(m => m.isPinned).map(m => (
              <div key={m.id} style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-2)', background: 'var(--we-gray-50)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-2)', color: 'var(--we-gray-600)' }}>
                <div style={{ fontWeight: 600 }}>{m.userName}</div>
                <div style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
