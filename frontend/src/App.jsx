import React, { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import Menu from './components/Menu';
import Question from './components/Question';
import Exam from './components/Exam';
import Results from './components/Results';
import BatterySelector from './components/BatterySelector';
// import duplicada eliminada
import PreguntasDudosas from './components/PreguntasDudosas';
import Login from './components/Login';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [allQuestions, setAllQuestions] = useState([]); // Todas las preguntas
  const [questions, setQuestions] = useState([]); // Preguntas de la batería seleccionada
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  // answers: { [questionId]: [array de answerId seleccionados] }
  const [answers, setAnswers] = useState({});
  // preguntas dudosas: Set de IDs
  const [doubtful, setDoubtful] = useState(new Set());
  // Para evitar doble carga
  const [doubtfulLoaded, setDoubtfulLoaded] = useState(false);
  const [finished, setFinished] = useState(false);
  const [battery, setBattery] = useState(null); // Índice de batería seleccionada
  const [examMode, setExamMode] = useState(false); // Si está en modo Examen
  const [timer, setTimer] = useState(720); // Segundos restantes para el examen (12 minutos)
  const timerRef = useRef();
  // Estado para mostrar/ocultar preguntas dudosas
  const [showDudosas, setShowDudosas] = useState(false);


  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + '/questions')
      .then(res => res.json())
      .then(data => {
        setAllQuestions(data);
        setLoading(false);
      });
  }, []);


  // Cargar preguntas dudosas del usuario al iniciar sesión
  useEffect(() => {
    const fetchDoubtful = async () => {
      if (user && !user.guest && !doubtfulLoaded) {
        const { data, error } = await supabase
          .from('doubtful_questions')
          .select('question_id')
          .eq('user_id', user.id);
        if (!error && data) {
          setDoubtful(new Set(data.map(d => d.question_id)));
        }
        setDoubtfulLoaded(true);
      }
    };
    fetchDoubtful();
  }, [user, doubtfulLoaded]);

  // Temporizador examen: hook siempre al tope
  useEffect(() => {
    if (examMode && started && !finished) {
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
    } else {
      // Si no está en modo examen, limpiar timer
      clearInterval(timerRef.current);
    }
    // eslint-disable-next-line
  }, [examMode, started, finished]);

  // --- RENDER ---
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setStarted(false);
    setCurrent(0);
    setAnswers({});
    setFinished(false);
    setBattery(null);
    setQuestions([]);
    setExamMode(false);
    setTimer(720);
    setDoubtful(new Set());
    setDoubtfulLoaded(false);
  };

  if (!user) {
    return <Login onLogin={u => {
      setUser(u);
      localStorage.setItem('user', JSON.stringify(u));
      setDoubtfulLoaded(false);
    }} />;
  }

  // Botón desconectar global
  const logoutButton = (
    <button
      onClick={handleLogout}
      style={{ position: 'fixed', top: 16, right: 16, background: '#a12a2a', color: 'white', border: 'none', borderRadius: 6, padding: '4px 12px', fontSize: 13, fontWeight: 600, cursor: 'pointer', zIndex: 100, boxShadow: '0 2px 8px #0001' }}
    >
      Desconectar
    </button>
  );

  if (loading) return (
    <div>
      {logoutButton}
      <div>Cargando preguntas...</div>
    </div>
  );

  if (!started && !examMode) {
    return (
      <div>
        {logoutButton}
        <Menu
          onStart={() => setStarted(true)}
          onExam={() => {
            const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
            setQuestions(shuffled.slice(0, 30));
            setExamMode(true);
            setStarted(true);
            setCurrent(0);
            setAnswers({});
            setFinished(false);
            setTimer(720);
          }}
        />
      </div>
    );
  }

  // Selector de batería
  if (started && battery === null && !examMode) {
    let preguntasDudosas = [];
    if (user && !user.guest && allQuestions.length > 0 && doubtful.size > 0) {
      preguntasDudosas = allQuestions.filter(q => doubtful.has(q.id));
    }
    return (
      <BatterySelector
        allQuestions={allQuestions}
        onSelectBattery={i => {
          if (i === 'dudosas') {
            setBattery('dudosas');
            setQuestions(preguntasDudosas);
            setCurrent(0);
            setAnswers({});
            setFinished(false);
          } else {
            setBattery(i);
            let ini, fin;
            if (i === 12) { // batería 13 (índice 12)
              ini = 360;
              fin = 390;
            } else if (i === 13) { // batería 14 (índice 13)
              ini = 391;
              fin = 421;
            } else {
              const base = 30;
              ini = i * base;
              fin = ini + base - 1;
            }
            if (fin >= allQuestions.length) fin = allQuestions.length - 1;
            setQuestions(allQuestions.slice(ini, fin + 1));
            setCurrent(0);
            setAnswers({});
            setFinished(false);
          }
        }}
        onBack={() => { setStarted(false); setCurrent(0); setAnswers({}); setFinished(false); setBattery(null); setQuestions([]); }}
        showDudosas={showDudosas}
        setShowDudosas={setShowDudosas}
        preguntasDudosas={preguntasDudosas}
        user={user}
      />
    );
  }

  // --- MODO EXAMEN: mostrar todas las preguntas a la vez con temporizador ---
  if (examMode && started && !finished) {
    const handleSelectExam = (qid, aid) => {
      const prev = answers[qid] || [];
      let updated;
      if (prev.includes(aid)) {
        updated = prev.filter(id => id !== aid);
      } else {
        updated = [...prev, aid];
      }
      setAnswers({ ...answers, [qid]: updated });
    };
    return (
      <Exam
        questions={questions}
        answers={answers}
        onSelect={handleSelectExam}
        timer={timer}
        onFinish={() => setFinished(true)}
        onExit={() => { setExamMode(false); setQuestions([]); setStarted(false); setCurrent(0); setAnswers({}); setFinished(false); setTimer(720); }}
      />
    );
  }

  // Si se acaba el tiempo en modo examen, marcar todas las no contestadas como vacías y mostrar resultado
  if (examMode && finished) {
    // Marcar como sin responder las que no tengan respuesta
    const completedAnswers = { ...answers };
    questions.forEach(q => {
      if (!completedAnswers[q.id]) completedAnswers[q.id] = [];
    });
    let totalPuntos = 0;
    let totalPosibles = 0;
    const resumen = questions.map(q => {
      const userAnswers = completedAnswers[q.id] || [];
      const correctAnswers = q.answers.filter(a => a.is_correct).map(a => a.id);
      totalPosibles += correctAnswers.length;
      let aciertos = 0;
      let fallos = 0;
      correctAnswers.forEach(id => {
        if (userAnswers.includes(id)) aciertos++;
      });
      userAnswers.forEach(id => {
        if (!correctAnswers.includes(id)) fallos++;
      });
      let puntosPregunta = aciertos - fallos;
      if (puntosPregunta < 0) puntosPregunta = 0;
      totalPuntos += puntosPregunta;
      return {
        text: q.text,
        userAnswer: q.answers.filter(a => userAnswers.includes(a.id)).map(a => a.text).join(', ') || 'Sin responder',
        correctAnswer: q.answers.filter(a => a.is_correct).map(a => a.text).join(', ') || 'Sin respuesta correcta',
        aciertos,
        fallos,
        totalPregunta: correctAnswers.length,
        puntosPregunta
      };
    });
    const porcentaje = totalPosibles > 0 ? Math.round((totalPuntos / totalPosibles) * 100) : 0;
    return (
      <Results
        resumen={resumen}
        totalPuntos={totalPuntos}
        totalPosibles={totalPosibles}
        porcentaje={porcentaje}
        onRestart={() => { setExamMode(false); setQuestions([]); setStarted(false); setCurrent(0); setAnswers({}); setFinished(false); setTimer(720); }}
        isExam={true}
      />
    );
  }


  if (finished) {
    let totalPuntos = 0;
    let totalPosibles = 0;
    const resumen = questions.map(q => {
      const userAnswers = answers[q.id] || [];
      const correctAnswers = q.answers.filter(a => a.is_correct).map(a => a.id);
      totalPosibles += correctAnswers.length;
      let aciertos = 0;
      let fallos = 0;
      correctAnswers.forEach(id => {
        if (userAnswers.includes(id)) aciertos++;
      });
      userAnswers.forEach(id => {
        if (!correctAnswers.includes(id)) fallos++;
      });
      let puntosPregunta = aciertos - fallos;
      if (puntosPregunta < 0) puntosPregunta = 0;
      totalPuntos += puntosPregunta;
      return {
        text: q.text,
        userAnswer: q.answers.filter(a => userAnswers.includes(a.id)).map(a => a.text).join(', ') || 'Sin responder',
        correctAnswer: q.answers.filter(a => a.is_correct).map(a => a.text).join(', ') || 'Sin respuesta correcta',
        aciertos,
        fallos,
        totalPregunta: correctAnswers.length,
        puntosPregunta,
        id: q.id // Añadimos el id para filtrar fallos
      };
    });
    const porcentaje = totalPosibles > 0 ? Math.round((totalPuntos / totalPosibles) * 100) : 0;


    return (
      <Results
        resumen={resumen}
        totalPuntos={totalPuntos}
        totalPosibles={totalPosibles}
        porcentaje={porcentaje}
        onRestart={() => {
          // Recargar la misma batería
          if (battery !== null) {
            let ini, fin;
            if (battery === 12) {
              ini = 360;
              fin = 390;
            } else if (battery === 13) {
              ini = 391;
              fin = 421;
            } else {
              const base = 30;
              ini = battery * base;
              fin = ini + base - 1;
            }
            if (fin >= allQuestions.length) fin = allQuestions.length - 1;
            setQuestions(allQuestions.slice(ini, fin + 1));
            setCurrent(0);
            setAnswers({});
            setFinished(false);
          } else {
            setStarted(false);
            setCurrent(0);
            setAnswers({});
            setFinished(false);
            setBattery(null);
          }
        }}
        onMenu={() => { setBattery(null); setQuestions([]); setCurrent(0); setAnswers({}); setFinished(false); setStarted(true); }}
        isExam={false}
      />
    );
  }
  // Render de pregunta individual

  const q = questions[current];
  if (!q) {
    setFinished(true);
    return null;
  }

  const handleSelect = (qid, answerId) => {
    const prev = answers[qid] || [];
    let updated;
    if (prev.includes(answerId)) {
      updated = prev.filter(id => id !== answerId);
    } else {
      updated = [...prev, answerId];
    }
    setAnswers({ ...answers, [qid]: updated });
  };

  // Botón para finalizar test manualmente
  const handleFinishTest = () => {
    // Marcar como sin responder las que no tengan respuesta
    const completedAnswers = { ...answers };
    questions.forEach(q => {
      if (!completedAnswers[q.id]) completedAnswers[q.id] = [];
    });
    setAnswers(completedAnswers);
    setFinished(true);
  };

  // Nueva función para marcar/desmarcar dudosa y persistir en Supabase
  const handleDoubt = async (qid) => {
    if (!user || user.guest) return;
    let updated;
    if (doubtful.has(qid)) {
      setDoubtful(prev => {
        const copy = new Set(prev);
        copy.delete(qid);
        return copy;
      });
      await supabase
        .from('doubtful_questions')
        .delete()
        .eq('user_id', user.id)
        .eq('question_id', qid);
    } else {
      setDoubtful(prev => {
        const copy = new Set(prev);
        copy.add(qid);
        return copy;
      });
      await supabase
        .from('doubtful_questions')
        .insert({ user_id: user.id, question_id: qid });
    }
  };

  const handleNext = () => {
    if (current + 1 === questions.length) {
      setFinished(true);
    } else {
      setCurrent(current + 1);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f7f7f7 0%, #e3e9f7 100%)', padding: 0, margin: 0, fontSize: 12 }}>
      <div style={{ maxWidth: 340, margin: '0 auto', padding: 8, position: 'relative' }}>
        <button
          onClick={() => { setBattery(null); setQuestions([]); setStarted(false); setCurrent(0); setAnswers({}); setFinished(false); }}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: '#a12a2a',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            padding: '4px 12px',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: 1,
            cursor: 'pointer',
            boxShadow: '0 1px 4px #0001',
            zIndex: 2,
            transition: 'background 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.background = '#7a1a1a'}
          onMouseOut={e => e.currentTarget.style.background = '#a12a2a'}
        >
          Salir
        </button>
        <h1 style={{ color: '#1a2a4a', letterSpacing: 1, marginBottom: 10, fontSize: 16 }}>Test de Balonmano</h1>
        <div style={{ marginBottom: 10, fontSize: 12, color: '#1a2a4a' }}>
          <strong>Pregunta {current + 1} de {questions.length}</strong>
        </div>
        {/* ...existing code... */}
        <div style={{position:'relative'}}>
          <Question q={q} answers={answers} onSelect={handleSelect} />
          {(user && !user.guest) && (
            <span
              onClick={() => handleDoubt(q.id)}
              style={{ position: 'absolute', right: 0, bottom: 0, margin: 12, cursor: 'pointer' }}
              title={doubtful.has(q.id) ? 'Quitar marca de duda' : 'Marcar como dudosa'}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="9" stroke={doubtful.has(q.id) ? '#a12a2a' : '#1a2a4a'} strokeWidth="2" fill="none" />
                <path d="M10 6.5C11.1046 6.5 12 7.39543 12 8.5C12 9.60457 11.1046 10.5 10 10.5C9.44772 10.5 9 10.9477 9 11.5V12" stroke={doubtful.has(q.id) ? '#a12a2a' : '#1a2a4a'} strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="10" cy="14" r="1" fill={doubtful.has(q.id) ? '#a12a2a' : '#1a2a4a'} />
              </svg>
            </span>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14, alignItems: 'flex-end' }}>
          <button
            onClick={handleNext}
            disabled={!(answers[q.id] && answers[q.id].length > 0)}
            style={{ fontSize: 12, padding: '5px 8px', minWidth: 80, borderRadius: 4, background: '#217a2b', color: 'white', border: 'none', cursor: !(answers[q.id] && answers[q.id].length > 0) ? 'not-allowed' : 'pointer', fontWeight: 600, letterSpacing: 1 }}
          >
            {current + 1 === questions.length ? 'Finalizar' : 'Siguiente'}
          </button>
          <button
            onClick={handleFinishTest}
            style={{ background: '#1a2a4a', color: 'white', border: 'none', borderRadius: 4, padding: '5px 8px', minWidth: 80, fontSize: 12, fontWeight: 600, cursor: 'pointer', letterSpacing: 1 }}
          >
            Finalizar test
          </button>
        </div>
      </div>
    </div>
  );
}
export default App;
