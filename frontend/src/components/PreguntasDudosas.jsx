import React from 'react';

// Recibe un array de preguntas dudosas: [{ pregunta, respuestaCorrecta }]
const PreguntasDudosas = ({ preguntas }) => {
  return (
    <div style={{
      maxWidth: 400,
      margin: '20px auto',
      padding: 16,
      background: '#fff',
      borderRadius: 10,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }}>
      <h2 style={{ fontSize: 18, marginBottom: 16, textAlign: 'center', fontWeight: 600, color: '#1a2a4a' }}>Preguntas dudosas</h2>
      {preguntas.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#666', fontSize: 14 }}>No hay preguntas dudosas.</div>
      ) : (
        preguntas.map((p, i) => (
          <div key={i} style={{ marginBottom: 12, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
            <div style={{ fontWeight: 500, marginBottom: 6, fontSize: 15, color: '#333' }}>{p.pregunta}</div>
            <div style={{ fontSize: 14, color: '#217a2b', fontWeight: 400 }}>
              Respuesta correcta: <span style={{ fontWeight: 600 }}>{p.respuestaCorrecta}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PreguntasDudosas;
