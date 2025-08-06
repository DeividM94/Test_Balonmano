import React from 'react';

export default function Menu({ onStart, onExam, onChangeBattery }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: 32,
      margin: 0
    }}>
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          borderRadius: 16,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          padding: '40px 32px',
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
          margin: '0 16px',
          boxSizing: 'border-box',
          border: '1px solid rgba(148, 163, 184, 0.2)'
        }}
      >
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ 
            color: '#1e293b', 
            fontSize: 28, 
            marginBottom: 16, 
            letterSpacing: 0.3, 
            fontWeight: 700,
            lineHeight: 1.2
          }}>Test de Balonmano</h1>
          <p style={{ 
            color: '#64748b', 
            fontSize: 16, 
            marginBottom: 0,
            lineHeight: 1.6,
            fontWeight: 500
          }}>
            Evalúa tus conocimientos sobre las reglas y técnicas del balonmano.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', width: '100%' }}>
          <button
            onClick={onStart}
            style={{ 
              fontSize: 16, 
              padding: '14px 24px', 
              width: '100%', 
              maxWidth: 280, 
              borderRadius: 8, 
              background: '#059669', 
              color: 'white', 
              border: 'none', 
              cursor: 'pointer', 
              fontWeight: 600, 
              letterSpacing: 0.3, 
              boxSizing: 'border-box',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = '#047857';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(5, 150, 105, 0.4)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = '#059669';
              e.currentTarget.style.transform = 'translateY(0px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.3)';
            }}
          >
            Iniciar test
          </button>
          <button
            onClick={onExam}
            style={{ 
              fontSize: 16, 
              padding: '14px 24px', 
              width: '100%', 
              maxWidth: 280, 
              borderRadius: 8, 
              background: '#d97706', 
              color: 'white', 
              border: 'none', 
              cursor: 'pointer', 
              fontWeight: 600, 
              letterSpacing: 0.3, 
              boxSizing: 'border-box',
              boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = '#b45309';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(217, 119, 6, 0.4)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = '#d97706';
              e.currentTarget.style.transform = 'translateY(0px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(217, 119, 6, 0.3)';
            }}
          >
            Modo examen
          </button>
        </div>
      </div>
    </div>
  );
}
