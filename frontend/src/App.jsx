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
  // Estado para el modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  // Estado para el progreso de baterías
  const [batteryProgress, setBatteryProgress] = useState({});

  // Cargar progreso de baterías desde Supabase
  useEffect(() => {
    const fetchBatteryProgress = async () => {
      if (user && !user.guest) {
        try {
          const { data, error } = await supabase
            .from('battery_progress')
            .select('*')
            .eq('user_id', user.id);
          
          if (!error && data) {
            const progressMap = {};
            data.forEach(item => {
              progressMap[item.battery_id] = {
                completed: item.completed,
                score: item.score,
                percentage: item.percentage,
                completed_at: item.completed_at,
                attempts: item.attempts || 1
              };
            });
            setBatteryProgress(progressMap);
          } else if (error) {
            console.warn('Error al cargar progreso de baterías:', error.message);
            // Si la tabla no existe, continúa sin progreso
            setBatteryProgress({});
          }
        } catch (err) {
          console.warn('Error al conectar con la base de datos:', err);
          setBatteryProgress({});
        }
      }
    };
    fetchBatteryProgress();
  }, [user]);

  // Guardar progreso de batería en Supabase
  const saveBatteryProgress = async (batteryId, score, totalPossible, percentage) => {
    if (!user || user.guest) return;
    
    try {
      const progressData = {
        user_id: user.id,
        battery_id: batteryId,
        completed: true,
        score: score,
        total_possible: totalPossible,
        percentage: percentage,
        completed_at: new Date().toISOString()
      };

      // Verificar si ya existe un registro
      const { data: existing } = await supabase
        .from('battery_progress')
        .select('attempts')
        .eq('user_id', user.id)
        .eq('battery_id', batteryId)
        .single();

      if (existing) {
        // Actualizar registro existente
        await supabase
          .from('battery_progress')
          .update({
            ...progressData,
            attempts: (existing.attempts || 1) + 1
          })
          .eq('user_id', user.id)
          .eq('battery_id', batteryId);
      } else {
        // Crear nuevo registro
        await supabase
          .from('battery_progress')
          .insert({
            ...progressData,
            attempts: 1
          });
      }

      // Actualizar estado local
      setBatteryProgress(prev => ({
        ...prev,
        [batteryId]: {
          completed: true,
          score: score,
          percentage: percentage,
          completed_at: new Date().toISOString(),
          attempts: existing ? (existing.attempts || 1) + 1 : 1
        }
      }));
    } catch (error) {
      console.warn('Error al guardar progreso de batería:', error.message);
      // La aplicación continúa funcionando sin guardar progreso
    }
  };


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

  // Hook para guardar progreso cuando se finaliza un test
  useEffect(() => {
    const saveProgress = async () => {
      if (finished && battery !== null && battery !== 'dudosas') {
        // Calcular resultados
        let totalPuntos = 0;
        let totalPosibles = 0;
        questions.forEach(q => {
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
        });
        const porcentaje = totalPosibles > 0 ? Math.round((totalPuntos / totalPosibles) * 100) : 0;
        
        await saveBatteryProgress(battery, totalPuntos, totalPosibles, porcentaje);
      }
    };
    saveProgress();
  }, [finished, battery, questions, answers]);

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
        batteryProgress={batteryProgress}
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
    setShowConfirmModal(true);
  };

  const confirmFinishTest = () => {
    // Marcar como sin responder las que no tengan respuesta
    const completedAnswers = { ...answers };
    questions.forEach(q => {
      if (!completedAnswers[q.id]) completedAnswers[q.id] = [];
    });
    setAnswers(completedAnswers);
    setFinished(true);
    setShowConfirmModal(false);
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', padding: 32, margin: 0, fontSize: 16 }}>
      {/* Modal de confirmación */}
      {showConfirmModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            borderRadius: 16,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            padding: '32px 24px',
            maxWidth: 400,
            width: '90%',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            textAlign: 'center'
          }}>
            <h3 style={{
              color: '#1e293b',
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 16,
              letterSpacing: 0.3
            }}>
              Confirmar finalización
            </h3>
            <p style={{
              color: '#64748b',
              fontSize: 16,
              lineHeight: 1.5,
              marginBottom: 24,
              fontWeight: 500
            }}>
              ¿Estás seguro de que quieres finalizar el test? Se evaluarán las respuestas que hayas dado hasta ahora.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={() => setShowConfirmModal(false)}
                style={{
                  padding: '12px 24px',
                  borderRadius: 12,
                  background: '#64748b',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 15,
                  letterSpacing: 0.5,
                  boxShadow: '0 4px 12px rgba(100, 116, 139, 0.3)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  minWidth: 100
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = '#475569';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(100, 116, 139, 0.4)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = '#64748b';
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(100, 116, 139, 0.3)';
                }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmFinishTest}
                style={{
                  padding: '12px 24px',
                  borderRadius: 12,
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 15,
                  letterSpacing: 0.5,
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  minWidth: 100
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
                Finalizar
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}>
        <button
          onClick={() => { setBattery(null); setQuestions([]); setStarted(false); setCurrent(0); setAnswers({}); setFinished(false); }}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
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
            zIndex: 2,
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
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          padding: '32px 24px',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          marginTop: 60
        }}>
          <h1 style={{ 
            color: '#1e293b', 
            letterSpacing: 0.3, 
            marginBottom: 20, 
            fontSize: 24, 
            fontWeight: 700,
            textAlign: 'center'
          }}>Test de Balonmano</h1>
          <div style={{ marginBottom: 24, fontSize: 16, color: '#64748b', fontWeight: 600, textAlign: 'center' }}>
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
                  <circle cx="10" cy="10" r="9" stroke={doubtful.has(q.id) ? '#dc2626' : '#64748b'} strokeWidth="2" fill="none" />
                  <path d="M10 6.5C11.1046 6.5 12 7.39543 12 8.5C12 9.60457 11.1046 10.5 10 10.5C9.44772 10.5 9 10.9477 9 11.5V12" stroke={doubtful.has(q.id) ? '#dc2626' : '#64748b'} strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="10" cy="14" r="1" fill={doubtful.has(q.id) ? '#dc2626' : '#64748b'} />
                </svg>
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'space-between' }}>
            <button
              onClick={handleFinishTest}
              style={{ 
                background: '#64748b', 
                color: 'white', 
                border: 'none', 
                borderRadius: 12, 
                padding: '12px 20px', 
                flex: 1,
                fontSize: 15, 
                fontWeight: 600, 
                cursor: 'pointer', 
                letterSpacing: 0.5,
                boxShadow: '0 4px 12px rgba(100, 116, 139, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = '#475569';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(100, 116, 139, 0.4)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = '#64748b';
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(100, 116, 139, 0.3)';
              }}
            >
              Finalizar test
            </button>
            <button
              onClick={handleNext}
              disabled={!(answers[q.id] && answers[q.id].length > 0)}
              style={{ 
                fontSize: 15, 
                padding: '12px 20px', 
                flex: 1,
                borderRadius: 12, 
                background: (answers[q.id] && answers[q.id].length > 0) ? '#059669' : '#94a3b8', 
                color: 'white', 
                border: 'none', 
                cursor: !(answers[q.id] && answers[q.id].length > 0) ? 'not-allowed' : 'pointer', 
                fontWeight: 600, 
                letterSpacing: 0.5,
                boxShadow: (answers[q.id] && answers[q.id].length > 0) ? '0 4px 12px rgba(5, 150, 105, 0.3)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseOver={e => {
                if (answers[q.id] && answers[q.id].length > 0) {
                  e.currentTarget.style.background = '#047857';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(5, 150, 105, 0.4)';
                }
              }}
              onMouseOut={e => {
                if (answers[q.id] && answers[q.id].length > 0) {
                  e.currentTarget.style.background = '#059669';
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.3)';
                }
              }}
            >
              {current + 1 === questions.length ? 'Finalizar' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
