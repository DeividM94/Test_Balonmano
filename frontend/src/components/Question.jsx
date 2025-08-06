import React from 'react';

export default function Question({ q, answers, onSelect, idx }) {
  return (
    <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001', padding: 10, marginBottom: 12 }}>
      <h3 style={{ margin: '0 0 8px 0', color: '#1a2a4a', fontSize: 13 }}>{idx !== undefined ? `${idx + 1}. ` : ''}{q.text}</h3>
      <ul style={{ listStyle: 'none', padding: 0, fontSize: 12 }}>
        {q.answers.map(a => (
          <li key={a.id} style={{ marginBottom: 6 }}>
            <label style={{ cursor: 'pointer', fontSize: 12 }}>
              <input
                type="checkbox"
                name={`question_${q.id}`}
                value={a.id}
                checked={(answers[q.id] || []).includes(a.id)}
                onChange={() => onSelect(q.id, a.id)}
                style={{ marginRight: 6, transform: 'scale(1)' }}
              />
              {a.text}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
