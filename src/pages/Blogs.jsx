import { useState } from 'react';
import { blogs } from '../data/content';
import { Clock, Star, MessageCircle, Share2, ChevronRight, X, ExternalLink } from 'lucide-react';

const blogCategories = ['All', 'Technical Deep Dive', 'Career Story', 'Tutorial'];
const categoryColors = { 'Technical Deep Dive': 'badge-cyan', 'Career Story': 'badge-red', 'Tutorial': 'badge-green' };
const bgGradients = {
  emc: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
  career: 'linear-gradient(135deg, #CC0000 0%, #FF4444 100%)',
  project: 'linear-gradient(135deg, #1B5E20 0%, #43A047 100%)',
  power: 'linear-gradient(135deg, #E65100 0%, #FF6D00 100%)',
  thesis: 'linear-gradient(135deg, #4A148C 0%, #7B1FA2 100%)',
  tool: 'linear-gradient(135deg, #009EE0 0%, #00BCD4 100%)',
};

export default function Blogs() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedBlog, setSelectedBlog] = useState(null);

  const filtered = activeCategory === 'All' ? blogs : blogs.filter(b => b.category === activeCategory);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Blogs & Tutorials</h1>
        <p>Technical deep dives, career stories, and step-by-step tutorials from WE engineers and students.</p>
      </div>

      <div className="filter-pills" style={{ marginBottom: 'var(--space-6)' }}>
        {blogCategories.map(cat => (
          <button key={cat} className={`chip ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Blog */}
      {activeCategory === 'All' && (
        <div className="card card-elevated" style={{ padding: 0, overflow: 'hidden', marginBottom: 'var(--space-8)', cursor: 'pointer' }} onClick={() => setSelectedBlog(blogs[0])}>
          <div style={{ display: 'flex', minHeight: 220 }}>
            <div style={{ flex: 1, background: bgGradients[blogs[0].image], display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '4rem', minWidth: 300 }}>
              📖
            </div>
            <div style={{ flex: 2, padding: 'var(--space-8)' }}>
              <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                <span className={`badge ${categoryColors[blogs[0].category] || 'badge-gray'}`}>{blogs[0].category}</span>
                <span className="badge badge-gray">Featured</span>
              </div>
              <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-3)' }}>{blogs[0].title}</h2>
              <p style={{ color: 'var(--we-gray-500)', marginBottom: 'var(--space-4)', lineHeight: 1.6 }}>{blogs[0].excerpt}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <div className="avatar avatar-sm">{blogs[0].authorInitials}</div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--we-black)' }}>{blogs[0].author}</div>
                    <div style={{ fontSize: 'var(--text-xs)' }}>{blogs[0].authorRole}</div>
                  </div>
                </div>
                <span><Clock size={14} /> {blogs[0].readTime}</span>
                <span><Star size={14} /> {blogs[0].stars}</span>
                <span><MessageCircle size={14} /> {blogs[0].comments}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog Grid */}
      <div className="grid-3">
        {(activeCategory === 'All' ? filtered.slice(1) : filtered).map(blog => (
          <div key={blog.id} className="blog-card" onClick={() => setSelectedBlog(blog)}>
            <div className="blog-card-image" style={{ background: bgGradients[blog.image], display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '3rem' }}>
              {blog.category === 'Technical Deep Dive' ? '⚡' : blog.category === 'Career Story' ? '👤' : '📝'}
            </div>
            <div className="blog-card-content">
              <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                <span className={`badge ${categoryColors[blog.category] || 'badge-gray'}`}>{blog.category}</span>
              </div>
              <h4 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-2)' }}>{blog.title}</h4>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)', marginBottom: 'var(--space-4)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {blog.excerpt}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-xs)', color: 'var(--we-gray-400)' }}>
                <span>{blog.author} · {blog.readTime}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <span>⭐ {blog.stars}</span>
                  <span>💬 {blog.comments}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Blog Detail Modal */}
      {selectedBlog && (
        <div className="modal-overlay" onClick={() => setSelectedBlog(null)}>
          <div className="modal-content" style={{ maxWidth: 700, maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
            <div style={{ height: 200, background: bgGradients[selectedBlog.image], display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '4rem', position: 'relative' }}>
              {selectedBlog.category === 'Technical Deep Dive' ? '⚡' : selectedBlog.category === 'Career Story' ? '👤' : '📝'}
              <button className="btn btn-icon" style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.3)', color: 'white' }} onClick={() => setSelectedBlog(null)}><X size={20} /></button>
            </div>
            <div style={{ padding: 'var(--space-8)' }}>
              <span className={`badge ${categoryColors[selectedBlog.category] || 'badge-gray'}`} style={{ marginBottom: 'var(--space-3)' }}>{selectedBlog.category}</span>
              <h2 style={{ marginBottom: 'var(--space-4)' }}>{selectedBlog.title}</h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', paddingBottom: 'var(--space-5)', borderBottom: '1px solid var(--we-gray-200)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <div className="avatar avatar-sm">{selectedBlog.authorInitials}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{selectedBlog.author}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--we-gray-400)' }}>{selectedBlog.authorRole}</div>
                  </div>
                </div>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-400)' }}>{new Date(selectedBlog.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-400)' }}><Clock size={14} /> {selectedBlog.readTime}</span>
              </div>

              <p style={{ lineHeight: 1.8, marginBottom: 'var(--space-5)' }}>{selectedBlog.excerpt}</p>
              <p style={{ lineHeight: 1.8, color: 'var(--we-gray-600)' }}>
                This is a preview of the full article. In the production version, this would contain the complete blog post with rich formatting, images, code blocks, and embedded component references from the Würth Elektronik catalog.
              </p>

              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginTop: 'var(--space-5)', marginBottom: 'var(--space-5)' }}>
                {selectedBlog.tags.map(t => <span key={t} className="badge badge-gray">{t}</span>)}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--we-gray-200)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                  <button className="btn btn-ghost btn-sm">⭐ {selectedBlog.stars} Stars</button>
                  <button className="btn btn-ghost btn-sm">💬 {selectedBlog.comments} Comments</button>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button className="btn btn-secondary btn-sm"><Share2 size={14} /> LinkedIn</button>
                  <button className="btn btn-secondary btn-sm"><ExternalLink size={14} /> Twitter</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
