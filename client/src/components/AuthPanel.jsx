import { Lock, LogIn, UserPlus } from 'lucide-react';
import { useState } from 'react';

export function AuthPanel({ user, onAuth, onLogout, authError }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  function submit(event) {
    event.preventDefault();
    onAuth(mode, form);
  }

  if (user) {
    return (
      <div className="auth-card">
        <div>
          <span className="eyebrow">Signed in</span>
          <strong>{user.name}</strong>
          <small>{user.email}</small>
        </div>
        <button className="secondary-button" onClick={onLogout}>Sign out</button>
      </div>
    );
  }

  return (
    <form className="auth-card" onSubmit={submit}>
      <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
        <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>
          <LogIn size={16} /> Login
        </button>
        <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>
          <UserPlus size={16} /> Register
        </button>
      </div>

      {mode === 'register' && (
        <label>
          Name
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ayesha Khan" />
        </label>
      )}

      <label>
        Email
        <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" />
      </label>

      <label>
        Password
        <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="At least 8 characters" />
      </label>

      {authError && <p className="form-error">{authError}</p>}

      <button className="primary-button" type="submit">
        <Lock size={16} /> {mode === 'login' ? 'Login' : 'Create account'}
      </button>
    </form>
  );
}
