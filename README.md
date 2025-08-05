# Test Balonmano - Fullstack

Este proyecto contiene:

- `/frontend`: Aplicación React creada con Vite para mostrar preguntas tipo test y consumir la API.
- `/backend`: API REST en Node.js + Express conectada a Supabase.

## Primeros pasos

1. Instala dependencias en ambos proyectos:
   - `cd frontend && npm install`
   - `cd backend && npm install`
2. Configura las variables de entorno en `/backend` para la conexión a Supabase.
3. Inicia el backend: `cd backend && node index.js` (o usa nodemon).
4. Inicia el frontend: `cd frontend && npm run dev`

## Estructura recomendada
- El backend expone endpoints para obtener preguntas, enviar respuestas, etc.
- El frontend consume estos endpoints y muestra la interfaz de usuario.

## Personalización
- Puedes añadir autenticación, ranking, estadísticas, etc.

---

¿Dudas? ¡Pide ayuda aquí!
