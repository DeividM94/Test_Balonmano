import React from 'react';

export default function BatterySelector({ allQuestions, batteryProgress, onSelectBattery, onBack, user, preguntasDudosas }) {
  const base = 30;
  const total = allQuestions.length;
  const numBaterias = 14;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: 32,
      margin: 0,
      fontSize: 16
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(20px)',
        borderRadius: 16,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
        padding: '32px 24px',
        maxWidth: 600,
        width: '100%',
        textAlign: 'center',
        margin: '0 16px',
        boxSizing: 'border-box',
        border: '1px solid rgba(148, 163, 184, 0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ 
            color: '#1e293b', 
            fontSize: 24, 
            margin: 0, 
            fontWeight: 700, 
            letterSpacing: 0.3 
          }}>Seleccionar batería de preguntas</h2>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                marginLeft: 16,
                fontSize: 14,
                padding: '10px 20px',
                borderRadius: 12,
                background: '#dc2626',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                letterSpacing: 0.5,
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = '#b91c1c';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = '#dc2626';
                e.currentTarget.style.transform = 'translateY(0px)';
              }}
            >
              ← Atrás
            </button>
          )}
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
          gap: 16, 
          marginTop: 20,
          justifyItems: 'center'
        }}>
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
            
            const progress = batteryProgress[i];
            const isCompleted = progress && progress.completed;
            
            return (
              <button
                key={i}
                onClick={() => onSelectBattery(i)}
                style={{
                  fontSize: 15,
                  padding: '0',
                  borderRadius: 16,
                  background: isCompleted 
                    ? (progress.percentage >= 80 ? '#22c55e' : progress.percentage >= 60 ? '#f59e0b' : '#ef4444')
                    : '#059669',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  boxShadow: isCompleted
                    ? (progress.percentage >= 80 ? '0 4px 12px rgba(34, 197, 94, 0.3)' : progress.percentage >= 60 ? '0 4px 12px rgba(245, 158, 11, 0.3)' : '0 4px 12px rgba(239, 68, 68, 0.3)')
                    : '0 4px 12px rgba(5, 150, 105, 0.3)',
                  width: '130px',
                  height: '90px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative'
                }}
                onMouseOver={e => {
                  if (isCompleted) {
                    e.currentTarget.style.background = progress.percentage >= 80 ? '#16a34a' : progress.percentage >= 60 ? '#d97706' : '#dc2626';
                  } else {
                    e.currentTarget.style.background = '#047857';
                  }
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = isCompleted
                    ? (progress.percentage >= 80 ? '0 6px 16px rgba(34, 197, 94, 0.4)' : progress.percentage >= 60 ? '0 6px 16px rgba(245, 158, 11, 0.4)' : '0 6px 16px rgba(239, 68, 68, 0.4)')
                    : '0 6px 16px rgba(5, 150, 105, 0.4)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = isCompleted 
                    ? (progress.percentage >= 80 ? '#22c55e' : progress.percentage >= 60 ? '#f59e0b' : '#ef4444')
                    : '#059669';
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = isCompleted
                    ? (progress.percentage >= 80 ? '0 4px 12px rgba(34, 197, 94, 0.3)' : progress.percentage >= 60 ? '0 4px 12px rgba(245, 158, 11, 0.3)' : '0 4px 12px rgba(239, 68, 68, 0.3)')
                    : '0 4px 12px rgba(5, 150, 105, 0.3)';
                }}
              >
                {isCompleted && (
                  <div style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: 8,
                    padding: '2px 6px',
                    fontSize: 10,
                    fontWeight: 600,
                    color: progress.percentage >= 80 ? '#22c55e' : progress.percentage >= 60 ? '#f59e0b' : '#ef4444'
                  }}>
                    {progress.percentage}%
                  </div>
                )}
                <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>
                  Batería {i + 1}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 400, opacity: 0.9 }}>
                  {ini + 1}-{fin + 1}
                </div>
                {isCompleted && (
                  <div style={{ fontSize: '10px', fontWeight: 500, opacity: 0.8, marginTop: '2px' }}>
                    {progress.attempts > 1 ? `${progress.attempts} intentos` : 'Completada'}
                  </div>
                )}
              </button>
            );
          })}
          
          {/* Botón de preguntas dudosas como batería extra */}
          {(user && !user.guest && preguntasDudosas && preguntasDudosas.length > 0) && (
            <button
              key="dudosas"
              onClick={() => onSelectBattery('dudosas')}
              style={{
                fontSize: 15,
                padding: '0',
                borderRadius: 16,
                background: '#d97706',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                letterSpacing: 0.5,
                boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)',
                width: '130px',
                height: '90px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = '#b45309';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(217, 119, 6, 0.4)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = '#d97706';
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(217, 119, 6, 0.3)';
              }}
            >
              <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>
                Preguntas
              </div>
              <div style={{ fontSize: '12px', fontWeight: 400, opacity: 0.9 }}>
                dudosas
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
