import React from 'react';
import { supabase } from '../Supabase/supabase';

export default function Navbar({ email }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const initial = email ? email.charAt(0).toUpperCase() : 'U';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        <div className="nav-brand">
          <div className="brand-logo-box" style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.6rem' }}>
            <span className="brand-logo-text" style={{ fontSize: '1.1rem' }}>B</span>
          </div>
          <span className="nav-brand-title">
            Blog<span className="nav-brand-accent">Verse</span>
          </span>
        </div>

        <div className="nav-actions">
          <div className="user-badge">
            <div className="user-avatar">{initial}</div>
            <span className="user-email-text">{email}</span>
          </div>

          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>

      </div>
    </nav>
  );
}