import { useState } from 'react';
import { login, signup, setToken } from './api';

export default function AuthForm({ onAuth }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const action = mode === 'login' ? login : signup;
      const { token, user } = await action(email, password);
      setToken(token);
      onAuth(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
  };

  return (
    <main className="app auth">
      <header>
        <h1>Task Manager</h1>
        <p className="subtitle">
          {mode === 'login' ? 'Log in to see your tasks' : 'Create an account to get started'}
        </p>
      </header>

      <form className="card task-form" onSubmit={submit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          minLength={6}
          required
        />
        {error && (
          <div className="error" role="alert" style={{ marginTop: 0 }}>
            {error}
          </div>
        )}
        <button type="submit" className="btn primary" disabled={busy}>
          {busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Sign up'}
        </button>
      </form>

      <p className="switch">
        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
        <button type="button" className="link" onClick={switchMode}>
          {mode === 'login' ? 'Sign up' : 'Log in'}
        </button>
      </p>
    </main>
  );
}
