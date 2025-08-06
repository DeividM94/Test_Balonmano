import React from 'react';
import Question from './Question';

export default function Exam({ questions, answers, onSelect, timer, onFinish, onExit }) {
  const min = Math.floor(timer / 60).toString().padStart(2, '0');
  const sec = (timer % 60).toString().padStart(2, '0');
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f7f7f7 0%, #e3e9f7 100%)', padding: 0, margin: 0, position: 'relative' }}>
      {/* Temporizador flotante */}
      <div style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 100,
        background: timer < 60 ? '#a12a2a' : '#1a2a4a',
        color: 'white',
        padding: '12px 20px',
        borderRadius: 20,
        fontSize: 18,
        fontWeight: 700,
        boxShadow: '0 4px 12px #0003',
        letterSpacing: 0.5,
        minWidth: 100,
        textAlign: 'center',
        border: timer < 60 ? '2px solid #a12a2a' : '2px solid #1a2a4a',
        transition: 'background 0.2s, border 0.2s',
      }}>
        {min}:{sec}
      </div>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: 24, position: 'relative' }}>
        <button
          onClick={onExit}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: '#a12a2a',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            padding: '8px 16px',
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: 0.5,
            cursor: 'pointer',
            boxShadow: '0 2px 6px #0002',
            zIndex: 2,
            transition: 'background 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.background = '#7a1a1a'}
          onMouseOut={e => e.currentTarget.style.background = '#a12a2a'}
        >
          Salir
        </button>
        <h1 style={{ color: '#1a2a4a', letterSpacing: 0.5, marginBottom: 24, fontSize: 24, fontWeight: 700 }}>Examen de Balonmano</h1>
        {/* El temporizador ya es flotante, así que quitamos el de aquí */}
        <form onSubmit={e => { e.preventDefault(); onFinish(); }}>
          <ul style={{ padding: 0, listStyle: 'none' }}>
            {questions.map((q, idx) => (
              <li key={q.id} style={{ marginBottom: 24 }}>
                <Question q={q} answers={answers} onSelect={onSelect} idx={idx} />
              </li>
            ))}
          </ul>
          <button
            type="submit"
            style={{ fontSize: 18, padding: '12px 32px', borderRadius: 8, background: '#217a2b', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700, letterSpacing: 0.5, boxShadow: '0 4px 12px #0002', transition: 'background 0.2s', margin: '0 auto', display: 'block' }}
            onMouseOver={e => e.currentTarget.style.background = '#1a2a4a'}
            onMouseOut={e => e.currentTarget.style.background = '#217a2b'}
          >
            Finalizar examen
          </button>
        </form>
      </div>
    </div>
  );
}
