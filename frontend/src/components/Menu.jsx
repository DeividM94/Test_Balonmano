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
      <div style={{
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 4px 24px #0002',
        padding: '48px 36px',
        maxWidth: 480,
        width: '100%',
        textAlign: 'center',
      }}>
        <h1 style={{ color: '#1a2a4a', fontSize: 38, marginBottom: 18, letterSpacing: 1 }}>Test de Balonmano</h1>
        <p style={{ color: '#444', fontSize: 20, marginBottom: 36 }}>
          Responde a las preguntas y pon a prueba tus conocimientos.<br />
          <span style={{ color: '#217a2b', fontWeight: 600 }}>¡Suerte!</span>
        </p>
        <button
          onClick={onStart}
          style={{
            fontSize: 22,
            padding: '18px 48px',
            borderRadius: 10,
            background: '#217a2a',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 700,
            letterSpacing: 1,
            boxShadow: '0 2px 12px #0001',
            transition: 'background 0.2s',
            marginBottom: 18
          }}
          onMouseOver={e => e.currentTarget.style.background = '#1a2a4a'}
          onMouseOut={e => e.currentTarget.style.background = '#217a2b'}
        >
          Iniciar test
        </button>
        <button
          onClick={onExam}
          style={{
            fontSize: 20,
            padding: '14px 0',
            borderRadius: 10,
            background: '#1a2a4a',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 700,
            letterSpacing: 1,
            boxShadow: '0 2px 12px #0001',
            transition: 'background 0.2s',
            width: '100%',
            marginTop: 16
          }}
          onMouseOver={e => e.currentTarget.style.background = '#217a2b'}
          onMouseOut={e => e.currentTarget.style.background = '#1a2a4a'}
        >
          Examen
        </button>
      </div>
    </div>
  );
}
