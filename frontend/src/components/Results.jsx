import React from 'react';

export default function Results({ resumen, totalPuntos, totalPosibles, porcentaje, onRestart, onMenu, isExam }) {
  const colorPuntuacion = porcentaje >= 80 ? '#059669' : porcentaje >= 60 ? '#d97706' : '#dc2626';
  const bgPuntuacion = porcentaje >= 80 ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : porcentaje >= 60 ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)';
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', 
      padding: 32, 
      margin: 0 
    }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          borderRadius: 16,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          padding: '32px 24px',
          border: '1px solid rgba(148, 163, 184, 0.2)'
        }}>
          <h1 style={{ 
            textAlign: 'center', 
            marginBottom: 24, 
            color: '#1e293b', 
            letterSpacing: 0.5, 
            fontSize: 24, 
            fontWeight: 700 
          }}>
            {isExam ? 'Examen finalizado' : 'Test finalizado'}
          </h1>
          
          <div style={{
            margin: '0 auto 32px auto',
            background: bgPuntuacion,
            color: colorPuntuacion,
            borderRadius: 12,
            padding: '20px',
            fontSize: 18,
            fontWeight: 700,
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            maxWidth: 280,
            border: `1px solid ${colorPuntuacion}30`
          }}>
            <div style={{ fontSize: 14, marginBottom: 8, opacity: 0.8, fontWeight: 500 }}>Puntuación obtenida</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{totalPuntos} / {totalPosibles}</div>
            <div style={{ fontSize: 20, marginTop: 8, fontWeight: 600 }}>
              {porcentaje}%
            </div>
          </div>
          
          <h2 style={{ 
            marginBottom: 20, 
            color: '#374151', 
            fontSize: 18, 
            fontWeight: 600,
            textAlign: 'center'
          }}>Resumen detallado</h2>
          
          <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: 32 }}>
            <ul style={{ padding: 0, listStyle: 'none', margin: 0 }}>
              {resumen.map((r, i) => {
                let bg, color, borderColor;
                if (r.puntosPregunta === r.totalPregunta) {
                  bg = '#f0fdf4';
                  color = '#166534';
                  borderColor = '#bbf7d0';
                } else if (r.puntosPregunta > 0) {
                  bg = '#fffbeb';
                  color = '#92400e';
                  borderColor = '#fde68a';
                } else {
                  bg = '#fef2f2';
                  color = '#991b1b';
                  borderColor = '#fecaca';
                }
                
                return (
                  <li key={i} style={{
                    padding: 16,
                    border: `1px solid ${borderColor}`,
                    borderRadius: 8,
                    background: bg,
                    color: color,
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    marginBottom: 12,
                    transition: 'all 0.2s ease'
                  }}>
                    <div style={{ 
                      fontWeight: 600, 
                      fontSize: 15, 
                      marginBottom: 8,
                      lineHeight: 1.4
                    }}>
                      {i + 1}. {r.text}
                    </div>
                    <div style={{ marginBottom: 6, fontSize: 13, color: '#64748b' }}>
                      <strong>Tus respuestas:</strong> {r.userAnswer}
                    </div>
                    <div style={{ marginBottom: 6, fontSize: 13, color: '#64748b' }}>
                      <strong>Respuestas correctas:</strong> {r.correctAnswer}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>
                      <strong>Puntos:</strong> {r.puntosPregunta} / {r.totalPregunta} 
                      ({r.aciertos} aciertos, {r.fallos} fallos)
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={onRestart} 
              style={{ 
                fontSize: 15, 
                padding: '12px 24px', 
                borderRadius: 8, 
                background: '#059669', 
                color: 'white', 
                border: 'none', 
                cursor: 'pointer', 
                fontWeight: 600, 
                letterSpacing: 0.3,
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                transition: 'all 0.2s ease',
                minWidth: 140
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
              {isExam ? 'Volver al menú' : 'Reiniciar test'}
            </button>
            {!isExam && (
              <button 
                onClick={onMenu} 
                style={{ 
                  fontSize: 15, 
                  padding: '12px 24px', 
                  borderRadius: 8, 
                  background: '#475569', 
                  color: 'white', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontWeight: 600, 
                  letterSpacing: 0.3,
                  boxShadow: '0 4px 12px rgba(71, 85, 105, 0.3)',
                  transition: 'all 0.2s ease',
                  minWidth: 140
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = '#334155';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(71, 85, 105, 0.4)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.background = '#475569';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(71, 85, 105, 0.3)';
                }}
              >
                Cambiar batería
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
