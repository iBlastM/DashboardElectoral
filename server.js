require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./db');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares ──
app.use(cors());
app.use(express.json());

// ── API Routes ──
app.use('/api/auth', authRoutes);

// ── Servir archivos estáticos (dashboard) ──
app.use(express.static(__dirname));

// ── SPA fallback: todas las rutas no-API sirven index.html ──
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Ruta no encontrada' });
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ── Iniciar servidor ──
async function iniciar() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL establecida correctamente.');

    // Sincronizar modelos (crea tablas si no existen)
    await sequelize.sync({ alter: false });
    console.log('✅ Modelos sincronizados con la base de datos.');

    app.listen(PORT, () => {
      console.log(`🚀 Dashboard Electoral corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error al conectar con MySQL:', err.message);
    console.error('Asegúrate de que MySQL esté corriendo y las credenciales en .env sean correctas.');
    process.exit(1);
  }
}

iniciar();
