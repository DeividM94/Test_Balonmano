import React from 'react';

export default function Menu({ onStart, onExam, onChangeBattery }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f7f7f7 0%, #e3e9f7 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: 0,
      margin: 0
    }}>
      <div
        style={{
          background: '#fff',
          borderRadius: 14,
          boxShadow: '0 2px 12px #0001',
          padding: '20px 8px',
          maxWidth: 340,
          minWidth: 0,
          textAlign: 'center',
          margin: '0 8px',
          boxSizing: 'border-box'
        }}
      >
        <h1 style={{ color: '#1a2a4a', fontSize: 18, marginBottom: 8, letterSpacing: 1 }}>Test de Balonmano</h1>
        <p style={{ color: '#444', fontSize: 13, marginBottom: 16 }}>
          Responde a las preguntas y pon a prueba tus conocimientos.<br />
          <span style={{ color: '#217a2b', fontWeight: 600 }}>¡Suerte!</span>
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', marginTop: 10, width: '100%' }}>
          <button
            onClick={onStart}
            style={{ fontSize: 13, padding: '5px 12px', minWidth: 120, maxWidth: 180, width: '100%', borderRadius: 4, background: '#217a2a', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700, letterSpacing: 1, boxSizing: 'border-box' }}
            onMouseOver={e => e.currentTarget.style.background = '#1a2a4a'}
            onMouseOut={e => e.currentTarget.style.background = '#217a2a'}
          >
            Iniciar test
          </button>
          <button
            onClick={onExam}
            style={{ fontSize: 13, padding: '5px 12px', minWidth: 120, maxWidth: 180, width: '100%', borderRadius: 4, background: '#a12a2a', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700, letterSpacing: 1, boxSizing: 'border-box' }}
            onMouseOver={e => e.currentTarget.style.background = '#7a1a1a'}
            onMouseOut={e => e.currentTarget.style.background = '#a12a2a'}
          >
            Examen
          </button>
        </div>
      </div>
    </div>
  );
}
