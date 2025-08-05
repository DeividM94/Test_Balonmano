require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);


app.get('/api/questions', async (req, res) => {
  const { data: questions, error: qError } = await supabase.from('questions').select('*');
  if (qError) return res.status(500).json({ error: qError.message });

  // Paginación automática para obtener todas las respuestas
  const pageSize = 1000;
  let allAnswers = [];
  let from = 0;
  let to = pageSize - 1;
  let keepFetching = true;

  while (keepFetching) {
    const { data: answersChunk, error: aError } = await supabase
      .from('answers')
      .select('*')
      .range(from, to);
    if (aError) return res.status(500).json({ error: aError.message });
    if (answersChunk && answersChunk.length > 0) {
      allAnswers = allAnswers.concat(answersChunk);
      if (answersChunk.length < pageSize) {
        keepFetching = false;
      } else {
        from += pageSize;
        to += pageSize;
      }
    } else {
      keepFetching = false;
    }
  }


  const questionsWithAnswers = questions.map(q => ({
    ...q,
    answers: allAnswers.filter(a => a.question_id === q.id)
  }));
  res.json(questionsWithAnswers);
});

// Puerto
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend escuchando en puerto ${PORT}`);
});
