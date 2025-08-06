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
          borderRadius: 12,
          boxShadow: '0 4px 16px #0002',
          padding: '24px 16px',
          maxWidth: 360,
          minWidth: 0,
          textAlign: 'center',
          margin: '0 16px',
          boxSizing: 'border-box'
        }}
      >
        <h1 style={{ color: '#1a2a4a', fontSize: 22, marginBottom: 12, letterSpacing: 0.5, fontWeight: 700 }}>Test de Balonmano</h1>
        <p style={{ color: '#555', fontSize: 15, marginBottom: 20 }}>
          Responde a las preguntas y pon a prueba tus conocimientos.<br />
          <span style={{ color: '#217a2b', fontWeight: 600 }}>¡Suerte!</span>
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', marginTop: 16, width: '100%' }}>
          <button
            onClick={onStart}
            style={{ fontSize: 16, padding: '10px 16px', minWidth: 140, maxWidth: 200, width: '100%', borderRadius: 6, background: '#217a2b', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600, letterSpacing: 0.5, boxSizing: 'border-box' }}
            onMouseOver={e => e.currentTarget.style.background = '#1a2a4a'}
            onMouseOut={e => e.currentTarget.style.background = '#217a2b'}
          >
            Iniciar test
          </button>
          <button
            onClick={onExam}
            style={{ fontSize: 16, padding: '10px 16px', minWidth: 140, maxWidth: 200, width: '100%', borderRadius: 6, background: '#a12a2a', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600, letterSpacing: 0.5, boxSizing: 'border-box' }}
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
