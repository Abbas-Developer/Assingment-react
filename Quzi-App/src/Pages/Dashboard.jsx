import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../Supabase/Supabase';

const Dashboard = ({ session }) => {
  const [name, setName] = useState('');
  const [inputName, setInputName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', session.user.id)
        .single();

      if (!error && data) {
        setName(data.name);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [session]);

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    if (!inputName.trim()) return;

    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .insert([{ id: session.user.id, name: inputName }]);

    if (!error) {
      setName(inputName);
    }
    setSaving(false);
  };

  const selectLevel = (level) => {
    navigate(`/quiz/${level}`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <div className="loading">Loading Profile...</div>;
  }

  if (!name) {
    return (
      <div className="auth-container">
        <h2>Welcome to Trivia Quiz</h2>
        <p>Before you begin, please tell us your name:</p>
        <form onSubmit={handleNameSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Your Name"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Start'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="user-info">
          <span>Hello, {name}!</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="level-selection">
        <h3>Select a Difficulty Level</h3>
        <p>Correct answers award 10 points. Wrong answers end the attempt instantly.</p>
        
        <div className="level-buttons">
          <button onClick={() => selectLevel('easy')} className="level-btn easy">
            Easy (5 Questions)
          </button>
          <button onClick={() => selectLevel('hard')} className="level-btn hard">
            Hard (10 Questions)
          </button>
          <button onClick={() => selectLevel('extreme')} className="level-btn extreme">
            Extreme (20 Questions)
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;