import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../Supabase/Supabase';

const Dashboard = ({ session }) => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const userEmail = session?.user?.email;
  const userId = session?.user?.id;

  const fetchTodos = useCallback(async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTodos(data);
    }
  }, [userId]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    setError('');
    setLoading(true);

    if (!userId) {
      setError('You must be logged in to add tasks. No active user session detected.');
      setLoading(false);
      return;
    }

    const { error: dbError } = await supabase
      .from('todos')
      .insert([{ title: newTodo, user_id: userId, is_completed: false }]);

    if (dbError) {
      setError(dbError.message);
    } else {
      setNewTodo('');
      fetchTodos();
    }
    setLoading(false);
  };

  const handleToggleTodo = async (id, isCompleted) => {
    setError('');
    const { error: dbError } = await supabase
      .from('todos')
      .update({ is_completed: !isCompleted })
      .eq('id', id);

    if (dbError) {
      setError(dbError.message);
    } else {
      fetchTodos();
    }
  };

  const handleDeleteTodo = async (id) => {
    setError('');
    const { error: dbError } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (dbError) {
      setError(dbError.message);
    } else {
      fetchTodos();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="user-info">
          {userEmail ? (
            <>
              <span>Welcome, {userEmail}</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <span>Not Logged In (Viewing Mode)</span>
          )}
        </div>
      </header>

      <main className="todo-section">
        <h3>My To-Do List</h3>
        
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleAddTodo} className="todo-form">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add'}
          </button>
        </form>

        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className={todo.is_completed ? 'completed' : ''}>
              <span onClick={() => handleToggleTodo(todo.id, todo.is_completed)}>
                {todo.title}
              </span>
              <button onClick={() => handleDeleteTodo(todo.id)} className="delete-btn">
                Delete
              </button>
            </li>
          ))}
          {todos.length === 0 && <p className="empty-list">No tasks yet.</p>}
        </ul>
      </main>
    </div>
  );
};

export default Dashboard;