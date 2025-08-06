import React, { useState } from 'react';
import Question from './Question';

export default function Exam({ questions, answers, onSelect, timer, onFinish, onExit }) {
  const [timerPosition, setTimerPosition] = useState({ x: 24, y: 24 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Limitar el movimiento dentro de la ventana
    const maxX = window.innerWidth - 120; // ancho del timer
    const maxY = window.innerHeight - 60; // alto del timer
    
    setTimerPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const min = Math.floor(timer / 60).toString().padStart(2, '0');
  const sec = (timer % 60).toString().padStart(2, '0');
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', padding: 0, margin: 0, position: 'relative' }}>
      {/* Temporizador flotante movible */}
      <div 
        style={{
          position: 'fixed',
          left: timerPosition.x,
          top: timerPosition.y,
          zIndex: 100,
          background: timer < 60 ? '#dc2626' : '#059669',
          color: 'white',
          padding: '8px 16px',
          borderRadius: 12,
          fontSize: 14,
          fontWeight: 700,
          boxShadow: timer < 60 ? '0 4px 12px rgba(220, 38, 38, 0.4)' : '0 4px 12px rgba(5, 150, 105, 0.4)',
          letterSpacing: 0.5,
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          backdropFilter: 'blur(10px)',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          opacity: isDragging ? 0.8 : 1,
          minWidth: 80
        }}
        onMouseDown={handleMouseDown}
        title="Arrastra para mover"
      >
        {min}:{sec}
      </div>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 32, position: 'relative' }}>
        <button
          onClick={onExit}
          style={{
            position: 'absolute',
            top: 24,
            right: 24,
            background: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: 12,
            padding: '10px 20px',
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: 0.5,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
            zIndex: 10,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = '#b91c1c';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(220, 38, 38, 0.4)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = '#dc2626';
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
          }}
        >
          ✕ Salir
        </button>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.98)', 
          backdropFilter: 'blur(20px)', 
          borderRadius: 16, 
          padding: '32px 24px', 
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          marginTop: 60
        }}>
          <h1 style={{ 
            color: '#1e293b', 
            letterSpacing: 0.3, 
            marginBottom: 32, 
            fontSize: 28, 
            fontWeight: 700,
            textAlign: 'center'
          }}>Examen de Balonmano</h1>
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
              style={{ 
                fontSize: 18, 
                padding: '16px 48px', 
                borderRadius: 16, 
                background: '#059669', 
                color: 'white', 
                border: 'none', 
                cursor: 'pointer', 
                fontWeight: 700, 
                letterSpacing: 0.5, 
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)', 
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                margin: '0 auto', 
                display: 'block'
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = '#047857';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(5, 150, 105, 0.4)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = '#059669';
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.3)';
              }}
            >
              Finalizar examen
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
