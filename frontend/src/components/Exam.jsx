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
        top: 18,
        right: 18,
        zIndex: 100,
        background: timer < 60 ? '#a12a2a' : '#1a2a4a',
        color: 'white',
        padding: '10px 24px',
        borderRadius: 24,
        fontSize: 22,
        fontWeight: 700,
        boxShadow: '0 2px 12px #0002',
        letterSpacing: 1,
        minWidth: 120,
        textAlign: 'center',
        border: timer < 60 ? '2px solid #a12a2a' : '2px solid #1a2a4a',
        transition: 'background 0.2s, border 0.2s',
      }}>
        {min}:{sec}
      </div>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 32, position: 'relative' }}>
        <button
          onClick={onExit}
          style={{
            position: 'absolute',
            top: 24,
            right: 24,
            background: '#a12a2a',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '8px 24px',
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: 1,
            cursor: 'pointer',
            boxShadow: '0 2px 8px #0001',
            zIndex: 2,
            transition: 'background 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.background = '#7a1a1a'}
          onMouseOut={e => e.currentTarget.style.background = '#a12a2a'}
        >
          Salir
        </button>
        <h1 style={{ color: '#1a2a4a', letterSpacing: 1, marginBottom: 24 }}>Examen de Balonmano</h1>
        {/* El temporizador ya es flotante, así que quitamos el de aquí */}
        <form onSubmit={e => { e.preventDefault(); onFinish(); }}>
          <ul style={{ padding: 0, listStyle: 'none' }}>
            {questions.map((q, idx) => (
              <li key={q.id} style={{ marginBottom: 32 }}>
                <Question q={q} answers={answers} onSelect={onSelect} idx={idx} />
              </li>
            ))}
          </ul>
          <button
            type="submit"
            style={{ fontSize: 20, padding: '14px 48px', borderRadius: 10, background: '#217a2b', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700, letterSpacing: 1, boxShadow: '0 2px 12px #0001', transition: 'background 0.2s', margin: '0 auto', display: 'block' }}
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
