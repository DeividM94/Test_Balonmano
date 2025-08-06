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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32
    }}>
      <div style={{ 
        maxWidth: 400, 
        width: '100%',
        background: 'rgba(255, 255, 255, 0.98)', 
        backdropFilter: 'blur(20px)', 
        borderRadius: 16, 
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
        padding: '40px 32px',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        margin: '0 16px'
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          color: '#1e293b', 
          marginBottom: 32, 
          fontSize: 28, 
          fontWeight: 700,
          letterSpacing: 0.3
        }}>Iniciar sesión</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ 
              width: '100%', 
              padding: '14px 16px', 
              marginBottom: 20, 
              borderRadius: 8, 
              border: '1px solid rgba(148, 163, 184, 0.3)', 
              fontSize: 16, 
              boxSizing: 'border-box', 
              background: 'rgba(255, 255, 255, 0.7)',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit',
              color: '#1e293b',
              fontWeight: 500
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = '#059669';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.1)';
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.3)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ 
              width: '100%', 
              padding: '14px 16px', 
              marginBottom: 24, 
              borderRadius: 8, 
              border: '1px solid rgba(148, 163, 184, 0.3)', 
              fontSize: 16, 
              boxSizing: 'border-box', 
              background: 'rgba(255, 255, 255, 0.7)',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit',
              color: '#1e293b',
              fontWeight: 500
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = '#059669';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.1)';
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.3)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '16px 24px', 
              borderRadius: 16, 
              background: loading ? '#94a3b8' : '#059669', 
              color: 'white', 
              fontWeight: 700, 
              fontSize: 16, 
              border: 'none', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              marginBottom: 16,
              boxShadow: loading ? 'none' : '0 4px 12px rgba(5, 150, 105, 0.3)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              letterSpacing: 0.5
            }}
            onMouseOver={e => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(5, 150, 105, 0.4)';
              }
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0px)';
              e.currentTarget.style.boxShadow = loading ? 'none' : '0 4px 12px rgba(5, 150, 105, 0.3)';
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <button
          type="button"
          onClick={() => onLogin({ guest: true })}
          style={{ 
            width: '100%', 
            padding: '16px 24px', 
            borderRadius: 16, 
            background: '#64748b', 
            color: 'white', 
            fontWeight: 700, 
            fontSize: 16, 
            border: 'none', 
            cursor: 'pointer', 
            marginBottom: 16,
            boxShadow: '0 4px 12px rgba(100, 116, 139, 0.3)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            letterSpacing: 0.5
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(100, 116, 139, 0.4)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(100, 116, 139, 0.3)';
          }}
        >
          Entrar como invitado
        </button>
        {error && (
          <div style={{ 
            color: '#ef4444', 
            marginTop: 16, 
            textAlign: 'center', 
            fontSize: 14,
            background: 'rgba(239, 68, 68, 0.1)',
            padding: '12px 16px',
            borderRadius: 12,
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            ⚠ {error}
          </div>
        )}
      </div>
    </div>
  );
}
