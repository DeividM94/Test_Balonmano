import React from 'react';

// Recibe un array de preguntas dudosas: [{ pregunta, respuestaCorrecta }]
const PreguntasDudosas = ({ preguntas }) => {
  return (
    <div style={{
      maxWidth: 340,
      margin: '18px auto',
      padding: 10,
      background: '#fff',
      borderRadius: 7,
      boxShadow: '0 2px 6px rgba(0,0,0,0.07)',
    }}>
      <h2 style={{ fontSize: 15, marginBottom: 10, textAlign: 'center', fontWeight: 600 }}>Preguntas dudosas</h2>
      {preguntas.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888', fontSize: 12 }}>No hay preguntas dudosas.</div>
      ) : (
        preguntas.map((p, i) => (
          <div key={i} style={{ marginBottom: 10, borderBottom: '1px solid #eee', paddingBottom: 6 }}>
            <div style={{ fontWeight: 500, marginBottom: 4, fontSize: 13 }}>{p.pregunta}</div>
            <div style={{ fontSize: 12, color: '#2a7', fontWeight: 400 }}>
              Respuesta correcta: <span style={{ fontWeight: 600 }}>{p.respuestaCorrecta}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PreguntasDudosas;
