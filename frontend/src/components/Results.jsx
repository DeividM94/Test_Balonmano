import React from 'react';

export default function Results({ resumen, totalPuntos, totalPosibles, porcentaje, onRestart, onMenu, isExam }) {
  const colorPuntuacion = porcentaje >= 80 ? '#217a2b' : '#a12a2a';
  const bgPuntuacion = porcentaje >= 80 ? '#eafbe7' : '#fbeaea';
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f7f7f7 0%, #e3e9f7 100%)', padding: 0, margin: 0 }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: 32 }}>
        <h1 style={{ textAlign: 'center', marginBottom: 32, color: '#1a2a4a', letterSpacing: 1 }}>{isExam ? '¡Examen finalizado!' : '¡Test finalizado!'}</h1>
        <div style={{
          margin: '0 auto 36px auto',
          background: bgPuntuacion,
          color: colorPuntuacion,
          borderRadius: 16,
          padding: '32px 0',
          fontSize: 44,
          fontWeight: 700,
          textAlign: 'center',
          boxShadow: '0 4px 24px #0001',
          maxWidth: 400
        }}>
          <span>Puntuación:<br />{totalPuntos} / {totalPosibles} <span style={{ fontSize: 28 }}>({porcentaje}%)</span></span>
        </div>
        <h2 style={{ marginBottom: 20, color: '#1a2a4a' }}>Resumen</h2>
        <ul style={{ padding: 0, listStyle: 'none' }}>
          {resumen.map((r, i) => {
            let bg = '#fbeaea', color = '#a12a2a';
            if (r.puntosPregunta === r.totalPregunta) {
              bg = '#eafbe7'; color = '#217a2b';
            } else if (r.puntosPregunta > 0) {
              bg = '#fff7e0'; color = '#b97a00';
            }
            return (
              <li key={i} style={{
                padding: 18,
                border: '1px solid #ddd',
                borderRadius: 8,
                background: bg,
                color: color,
                boxShadow: '0 2px 8px #0001',
                marginBottom: 18
              }}>
                <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>{i + 1}. {r.text}</div>
                <div style={{ marginBottom: 4 }}><strong>Tus respuestas:</strong> {r.userAnswer}</div>
                <div style={{ marginBottom: 4 }}><strong>Respuestas correctas:</strong> {r.correctAnswer}</div>
                <div><strong>Aciertos:</strong> {r.aciertos} | <strong>Fallos:</strong> {r.fallos} | <strong>Puntos:</strong> {r.puntosPregunta} / {r.totalPregunta}</div>
              </li>
            );
          })}
        </ul>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 36 }}>
          <button onClick={onRestart} style={{ fontSize: 18, padding: '14px 40px', borderRadius: 8, background: '#217a2b', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600, letterSpacing: 1 }}>{isExam ? 'Volver al menú' : 'Reiniciar test'}</button>
          {!isExam && <button onClick={onMenu} style={{ fontSize: 18, padding: '14px 40px', borderRadius: 8, background: '#a12a2a', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600, letterSpacing: 1 }}>Cambiar batería</button>}
        </div>
      </div>
    </div>
  );
}
