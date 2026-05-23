import React, { useState, useEffect } from 'react';
import { supabase } from '../Supabase/supabase';
import Navbar from '../Components/Navbar';

export default function Dashboard({ session }) {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const user = session?.user;

  const fetchBlogs = async () => {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setBlogs(data || []);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('blogs')
      .insert([
        {
          title,
          content,
          user_id: user.id,
          author_email: user.email,
        },
      ])
      .select();

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setTitle('');
      setContent('');
      if (data) {
        setBlogs([data[0], ...blogs]);
      } else {
        fetchBlogs();
      }
    }
  };

  const handleDeleteBlog = async (id) => {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error(error);
    } else {
      setBlogs(blogs.filter((blog) => blog.id !== id));
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'rgba(248, 250, 252, 0.5)' }}>
      <Navbar email={user?.email} />

      <div className="dashboard-layout">
        
        <div className="create-post-card">
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 className="card-header-title">Create a New Post</h2>
            <p className="card-header-subtitle">Share your knowledge with the world</p>
          </div>

          {error && <div className="error-alert" style={{ marginBottom: '1.25rem' }}>{error}</div>}

          <form onSubmit={handleCreateBlog} className="auth-form">
            <div className="form-group">
              <label className="form-label">Post Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
                placeholder="Give your blog a catchy title..."
              />
            </div>
            <div className="form-group">
              <label className="form-label">Content Space</label>
              <textarea
                required
                rows="5"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="form-textarea"
                placeholder="Write your thoughts down here..."
              />
            </div>
            <div className="flex-end-container">
              <button type="submit" disabled={loading} className="btn-submit-post">
                {loading ? 'Publishing...' : 'Publish Article'}
              </button>
            </div>
          </form>
        </div>

        <div className="feed-section">
          <div className="feed-header-bar">
            <h2 className="card-header-title">Community Feed</h2>
            <span className="feed-count-badge">{blogs.length}</span>
          </div>

          {blogs.length === 0 ? (
            <div className="empty-feed">
              <p className="empty-feed-text">No blog posts found. Be the first to share something!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {blogs.map((blog) => (
                <div key={blog.id} className="blog-post-card">
                  <div className="post-top-row">
                    <div>
                      <h3 className="post-title">{blog.title}</h3>
                      <div className="post-meta-row">
                        <span className="meta-author-badge">{blog.author_email}</span>
                        <span>•</span>
                        <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {user.id === blog.user_id && (
                      <button onClick={() => handleDeleteBlog(blog.id)} className="btn-delete-post">
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="post-content-body">{blog.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}