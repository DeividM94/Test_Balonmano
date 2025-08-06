import React from 'react';
import PreguntasDudosas from './PreguntasDudosas';

export default function BatterySelector({ allQuestions, onSelectBattery, onBack, showDudosas, setShowDudosas, preguntasDudosas, user }) {
  const base = 30;
  const total = allQuestions.length;
  const numBaterias = 14;
  const extra = [12, 13]; // índices 13 y 14 (0-based)

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f7f7f7 0%, #e3e9f7 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: 0,
      margin: 0,
      fontSize: 16
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 4px 20px #0002',
        padding: '24px 16px',
        maxWidth: 420,
        width: '100%',
        textAlign: 'center',
        margin: '0 12px',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ color: '#1a2a4a', fontSize: 20, margin: 0, fontWeight: 700, letterSpacing: 0.5 }}>Selecciona una batería</h2>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                marginLeft: 12,
                fontSize: 14,
                padding: '8px 16px',
                borderRadius: 6,
                background: '#a12a2a',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                letterSpacing: 0.5,
                boxShadow: '0 2px 6px #0002',
                transition: 'background 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.background = '#7a1a1a'}
              onMouseOut={e => e.currentTarget.style.background = '#a12a2a'}
            >
              Atrás
            </button>
          )}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 16 }}>
          {Array.from({ length: numBaterias }).map((_, i) => {
            let ini, fin;
            if (i === 12) { // batería 13 (índice 12)
              ini = 360;
              fin = 390;
            } else if (i === 13) { // batería 14 (índice 13)
              ini = 391;
              fin = 421;
            } else {
              ini = i * base;
              fin = ini + base - 1;
            }
            if (fin >= total) fin = total - 1;
            return (
              <button
                key={i}
                onClick={() => onSelectBattery(i)}
                style={{
                  fontSize: 16,
                  padding: '10px 14px',
                  borderRadius: 6,
                  background: '#217a2b',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  boxShadow: '0 2px 6px #0002',
                  minWidth: 80,
                  maxWidth: 140
                }}
                onMouseOver={e => e.currentTarget.style.background = '#1a2a4a'}
                onMouseOut={e => e.currentTarget.style.background = '#217a2b'}
              >
                {`Batería ${i + 1}`}<br /><span style={{ fontSize: 12, fontWeight: 400 }}>{ini + 1}-{fin + 1}</span>
              </button>
            );
          })}
          {/* Botón de preguntas dudosas como batería extra */}
          {(user && !user.guest && preguntasDudosas && preguntasDudosas.length > 0) && (
            <button
              key="dudosas"
              onClick={() => onSelectBattery('dudosas')}
              style={{
                fontSize: 16,
                padding: '10px 14px',
                borderRadius: 6,
                background: '#1a2a4a',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                letterSpacing: 0.5,
                boxShadow: '0 2px 6px #0002',
                minWidth: 80,
                maxWidth: 140
              }}
            >
              Preguntas dudosas
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
