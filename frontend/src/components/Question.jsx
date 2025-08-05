import React from 'react';

export default function Question({ q, answers, onSelect, idx }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #0001', padding: 24, marginBottom: 24 }}>
      <h3 style={{ margin: '0 0 16px 0', color: '#1a2a4a' }}>{idx !== undefined ? `${idx + 1}. ` : ''}{q.text}</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {q.answers.map(a => (
          <li key={a.id} style={{ marginBottom: 12 }}>
            <label style={{ cursor: 'pointer', fontSize: 17 }}>
              <input
                type="checkbox"
                name={`question_${q.id}`}
                value={a.id}
                checked={(answers[q.id] || []).includes(a.id)}
                onChange={() => onSelect(q.id, a.id)}
                style={{ marginRight: 10, transform: 'scale(1.2)' }}
              />
              {a.text}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
