import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else if (data.user) onLogin(data.user);
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 360, margin: '40px auto', padding: 20, background: '#fff', borderRadius: 12, boxShadow: '0 4px 16px #0002' }}>
      <h2 style={{ textAlign: 'center', color: '#1a2a4a', marginBottom: 20, fontSize: 22, fontWeight: 700 }}>Iniciar sesión</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: 12, marginBottom: 16, borderRadius: 8, border: '1px solid #ccc', fontSize: 16, boxSizing: 'border-box', maxWidth: '100%' }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: 12, marginBottom: 16, borderRadius: 8, border: '1px solid #ccc', fontSize: 16, boxSizing: 'border-box', maxWidth: '100%' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: 12, borderRadius: 8, background: '#217a2b', color: 'white', fontWeight: 600, fontSize: 16, border: 'none', cursor: 'pointer', marginBottom: 12 }}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <button
        type="button"
        onClick={() => onLogin({ guest: true })}
        style={{ width: '100%', padding: 12, borderRadius: 8, background: '#1a2a4a', color: 'white', fontWeight: 600, fontSize: 16, border: 'none', cursor: 'pointer', marginBottom: 12 }}
      >
        Entrar como invitado
      </button>
      {error && <div style={{ color: '#a12a2a', marginTop: 12, textAlign: 'center', fontSize: 14 }}>{error}</div>}
    </div>
  );
}
