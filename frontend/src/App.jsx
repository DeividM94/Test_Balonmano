

import React, { useEffect, useState, useRef } from 'react';
import Menu from './components/Menu';
import Question from './components/Question';
import Exam from './components/Exam';
import Results from './components/Results';
import BatterySelector from './components/BatterySelector';

function App() {
  const [allQuestions, setAllQuestions] = useState([]); // Todas las preguntas
  const [questions, setQuestions] = useState([]); // Preguntas de la batería seleccionada
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  // answers: { [questionId]: [array de answerId seleccionados] }
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [battery, setBattery] = useState(null); // Índice de batería seleccionada
  const [examMode, setExamMode] = useState(false); // Si está en modo Examen
  const [timer, setTimer] = useState(720); // Segundos restantes para el examen (12 minutos)
  const timerRef = useRef();


  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + '/questions')
      .then(res => res.json())
      .then(data => {
        setAllQuestions(data);
        setLoading(false);
      });
  }, []);


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
  if (loading) return <div>Cargando preguntas...</div>;

  if (!started && !examMode) {
    return (
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
    );
  }

  // Selector de batería
  if (started && battery === null && !examMode) {
    return (
      <BatterySelector
        allQuestions={allQuestions}
        onSelectBattery={i => {
          setBattery(i);
          // Calcular preguntas de la batería seleccionada con excepción para la 13 y 14
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
        }}
        onBack={() => { setStarted(false); setCurrent(0); setAnswers({}); setFinished(false); setBattery(null); setQuestions([]); }}
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
        onRestart={() => { setStarted(false); setCurrent(0); setAnswers({}); setFinished(false); setBattery(null); }}
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

  const handleNext = () => {
    if (current + 1 === questions.length) {
      setFinished(true);
    } else {
      setCurrent(current + 1);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f7f7f7 0%, #e3e9f7 100%)', padding: 0, margin: 0 }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: 32, position: 'relative' }}>
        <button
          onClick={() => { setBattery(null); setQuestions([]); setStarted(false); setCurrent(0); setAnswers({}); setFinished(false); }}
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
        <h1 style={{ color: '#1a2a4a', letterSpacing: 1, marginBottom: 24 }}>Test de Balonmano</h1>
        <div style={{ marginBottom: 24, fontSize: 18, color: '#1a2a4a' }}>
          <strong>Pregunta {current + 1} de {questions.length}</strong>
        </div>
        <Question q={q} answers={answers} onSelect={handleSelect} />
        <button
          onClick={handleNext}
          disabled={!(answers[q.id] && answers[q.id].length > 0)}
          style={{ fontSize: 18, padding: '12px 36px', borderRadius: 8, background: '#217a2b', color: 'white', border: 'none', cursor: !(answers[q.id] && answers[q.id].length > 0) ? 'not-allowed' : 'pointer', fontWeight: 600, letterSpacing: 1 }}
        >
          {current + 1 === questions.length ? 'Finalizar' : 'Siguiente'}
        </button>
      </div>
    </div>
  );
}
export default App;
