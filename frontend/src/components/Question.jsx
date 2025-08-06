import React from 'react';

export default function Question({ q, answers, onSelect, idx }) {
  return (
    <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001', padding: 16, marginBottom: 16 }}>
      <h3 style={{ margin: '0 0 12px 0', color: '#1a2a4a', fontSize: 16, fontWeight: 600 }}>{idx !== undefined ? `${idx + 1}. ` : ''}{q.text}</h3>
      <ul style={{ listStyle: 'none', padding: 0, fontSize: 14 }}>
        {q.answers.map(a => (
          <li key={a.id} style={{ marginBottom: 8 }}>
            <label style={{ cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                name={`question_${q.id}`}
                value={a.id}
                checked={(answers[q.id] || []).includes(a.id)}
                onChange={() => onSelect(q.id, a.id)}
                style={{ marginRight: 8, transform: 'scale(1.2)' }}
              />
              {a.text}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
