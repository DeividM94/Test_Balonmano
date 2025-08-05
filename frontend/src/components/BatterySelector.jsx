import React from 'react';

export default function BatterySelector({ allQuestions, onSelectBattery, onBack }) {
  const base = 30;
  const total = allQuestions.length;
  const numBaterias = Math.ceil(total / base);
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h2 style={{ color: '#1a2a4a', fontSize: 28, margin: 0 }}>Selecciona una batería</h2>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                marginLeft: 16,
                fontSize: 16,
                padding: '8px 24px',
                borderRadius: 8,
                background: '#a12a2a',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                letterSpacing: 1,
                boxShadow: '0 2px 8px #0001',
                transition: 'background 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.background = '#7a1a1a'}
              onMouseOut={e => e.currentTarget.style.background = '#a12a2a'}
            >
              Atrás
            </button>
          )}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
          {Array.from({ length: numBaterias }).map((_, i) => {
            let ini = i * base;
            let fin = ini + base - 1;
            if (extra.includes(i)) fin += 1;
            if (fin >= total) fin = total - 1;
            return (
              <button
                key={i}
                onClick={() => onSelectBattery(i)}
                style={{
                  fontSize: 18,
                  padding: '12px 18px',
                  borderRadius: 8,
                  background: '#217a2b',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  letterSpacing: 1,
                  boxShadow: '0 2px 8px #0001',
                  minWidth: 80
                }}
                onMouseOver={e => e.currentTarget.style.background = '#1a2a4a'}
                onMouseOut={e => e.currentTarget.style.background = '#217a2b'}
              >
                {`Batería ${i + 1}`}<br /><span style={{ fontSize: 13, fontWeight: 400 }}>{ini + 1}-{fin + 1}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
