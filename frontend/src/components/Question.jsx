import React from 'react';

export default function Question({ q, answers, onSelect, idx }) {
  return (
    <div style={{ 
      background: 'rgba(255, 255, 255, 0.98)', 
      backdropFilter: 'blur(20px)', 
      borderRadius: 16, 
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)', 
      padding: 24, 
      marginBottom: 20,
      border: '1px solid rgba(148, 163, 184, 0.2)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }}>
      <h3 style={{ 
        margin: '0 0 20px 0', 
        color: '#1e293b', 
        fontSize: 18, 
        fontWeight: 700,
        lineHeight: 1.5,
        letterSpacing: 0.3
      }}>
        {idx !== undefined ? (
          <span style={{ 
            display: 'inline-block',
            background: '#059669',
            color: 'white',
            borderRadius: 12,
            padding: '6px 12px',
            fontSize: 14,
            fontWeight: 700,
            marginRight: 12,
            minWidth: 40,
            textAlign: 'center',
            letterSpacing: 0.5
          }}>
            {idx + 1}
          </span>
        ) : ''}{q.text}
      </h3>
      <ul style={{ listStyle: 'none', padding: 0, fontSize: 14 }}>
        {q.answers.map(a => {
          const isSelected = (answers[q.id] || []).includes(a.id);
          return (
            <li key={a.id} style={{ marginBottom: 12 }}>
              <label style={{ 
                cursor: 'pointer', 
                fontSize: 15, 
                display: 'flex', 
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: 12,
                background: isSelected ? 'rgba(5, 150, 105, 0.1)' : 'rgba(255, 255, 255, 0.7)',
                border: isSelected ? '2px solid #059669' : '2px solid rgba(148, 163, 184, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontWeight: isSelected ? 600 : 500,
                color: isSelected ? '#047857' : '#334155'
              }}
              onMouseOver={e => {
                if (!isSelected) {
                  e.currentTarget.style.background = 'rgba(241, 245, 249, 1)';
                  e.currentTarget.style.borderColor = '#94a3b8';
                }
              }}
              onMouseOut={e => {
                if (!isSelected) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.7)';
                  e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.3)';
                }
              }}
              >
                <input
                  type="checkbox"
                  name={`question_${q.id}`}
                  value={a.id}
                  checked={isSelected}
                  onChange={() => onSelect(q.id, a.id)}
                  style={{ 
                    marginRight: 12, 
                    transform: 'scale(1.3)',
                    accentColor: '#059669'
                  }}
                />
                {a.text}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
