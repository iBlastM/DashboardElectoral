const jwt = require('jsonwebtoken');
const { Admin } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'metrix_secret_key';

// ── Verificar token JWT (admin autenticado) ──
function verificarAdmin(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.tipo !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado: se requiere rol administrador' });
    }
    req.adminId = payload.id;
    req.adminEmail = payload.email;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

// ── Verificar sesión de invitado (PIN validado) ──
function verificarInvitado(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.tipo !== 'invitado' && payload.tipo !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    req.userId = payload.id;
    req.userTipo = payload.tipo;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

// ── Verificar sesión (admin o invitado) ──
function verificarSesion(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.id;
    req.userTipo = payload.tipo;
    req.userEmail = payload.email;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = { verificarAdmin, verificarInvitado, verificarSesion };
