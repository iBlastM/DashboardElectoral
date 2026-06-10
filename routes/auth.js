const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { Admin, Pin } = require('../models');
const { verificarAdmin, verificarSesion } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'metrix_secret_key';

// ═══════════════════════════════════════════
//  POST /api/auth/login  —  Admin login
// ═══════════════════════════════════════════
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const valido = await bcrypt.compare(password, admin.password_hash);
    if (!valido) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, tipo: 'admin' },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      usuario: {
        id: admin.id,
        email: admin.email,
        nombre: admin.nombre,
        rol: 'admin'
      }
    });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ═══════════════════════════════════════════
//  POST /api/auth/pin/generar  —  Admin genera PINs
// ═══════════════════════════════════════════
router.post('/pin/generar', verificarAdmin, async (req, res) => {
  try {
    const { cantidad = 1 } = req.body;
    const count = Math.min(Math.max(parseInt(cantidad) || 1, 1), 50);

    const pins = [];
    for (let i = 0; i < count; i++) {
      // Generar PIN numérico de 6 dígitos
      const codigo = crypto.randomInt(100000, 999999).toString();
      const expiracion = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

      const pin = await Pin.create({
        codigo,
        admin_id: req.adminId,
        expiracion,
        usado: false
      });
      pins.push({ codigo: pin.codigo, expiracion: pin.expiracion });
    }

    res.json({
      mensaje: `${count} PIN(s) generado(s) exitosamente`,
      pins
    });
  } catch (err) {
    console.error('Error generando PIN:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ═══════════════════════════════════════════
//  POST /api/auth/pin/validar  —  Invitado valida PIN
// ═══════════════════════════════════════════
router.post('/pin/validar', async (req, res) => {
  try {
    const { codigo } = req.body;
    if (!codigo || !/^\d{6}$/.test(codigo)) {
      return res.status(400).json({ error: 'PIN inválido: debe ser un código de 6 dígitos' });
    }

    const pin = await Pin.findOne({
      where: {
        codigo,
        usado: false,
        expiracion: { [Op.gt]: new Date() }
      }
    });

    if (!pin) {
      return res.status(401).json({ error: 'PIN inválido o expirado' });
    }

    // Marcar PIN como usado
    pin.usado = true;
    await pin.save();

    const token = jwt.sign(
      { id: pin.id, pin: pin.codigo, tipo: 'invitado' },
      JWT_SECRET,
      { expiresIn: '4h' }
    );

    res.json({
      token,
      mensaje: 'PIN validado correctamente',
      expira_sesion: new Date(Date.now() + 4 * 60 * 60 * 1000)
    });
  } catch (err) {
    console.error('Error validando PIN:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ═══════════════════════════════════════════
//  GET /api/auth/verify  —  Verificar sesión actual
// ═══════════════════════════════════════════
router.get('/verify', verificarSesion, async (req, res) => {
  const data = {
    autenticado: true,
    tipo: req.userTipo,
    email: req.userEmail || null
  };

  if (req.userTipo === 'admin') {
    const admin = await Admin.findByPk(req.userId, { attributes: ['id', 'email', 'nombre'] });
    if (admin) {
      data.usuario = { id: admin.id, email: admin.email, nombre: admin.nombre, rol: 'admin' };
    }
  }

  res.json(data);
});

// ═══════════════════════════════════════════
//  GET /api/auth/pin/historial  —  Admin ve PINs generados
// ═══════════════════════════════════════════
router.get('/pin/historial', verificarAdmin, async (req, res) => {
  try {
    const pins = await Pin.findAll({
      where: { admin_id: req.adminId },
      order: [['created_at', 'DESC']],
      limit: 100
    });
    res.json(pins.map(p => ({
      codigo: p.codigo,
      usado: p.usado,
      expiracion: p.expiracion,
      creado: p.createdAt,
      vigente: !p.usado && new Date(p.expiracion) > new Date()
    })));
  } catch (err) {
    console.error('Error obteniendo historial:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
