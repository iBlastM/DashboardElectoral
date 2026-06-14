/* ── auth.js ── Autenticación Dashboard Electoral ── */
/* Se carga ANTES de electoral.js */

const AUTH = (function () {
  const API = '/api/auth';
  const TOKEN_KEY = 'dash_token';
  const USER_KEY = 'dash_user';

  let token = localStorage.getItem(TOKEN_KEY) || null;
  let userData = null;

  try {
    userData = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch (e) {
    userData = null;
  }

  // ── Guardar / recuperar sesión ──
  function guardarSesion(t, u) {
    token = t;
    userData = u;
    localStorage.setItem(TOKEN_KEY, t);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
  }

  function cerrarSesion() {
    token = null;
    userData = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    mostrarLogin();
  }

  function getToken() { return token; }
  function getUser() { return userData; }
  function isAdmin() { return userData && userData.rol === 'admin'; }
  function isInvitado() { return userData && userData.rol === 'invitado'; }

  // ── Verificar token con el servidor ──
  async function verificarSesion() {
    if (!token) return false;
    try {
      const res = await fetch(`${API}/verify`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        cerrarSesion();
        return false;
      }
      const data = await res.json();
      // Actualizar datos de usuario
      if (data.usuario) {
        userData = data.usuario;
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
      }
      return true;
    } catch (e) {
      console.error('Error verificando sesión:', e);
      return !!token; // Si no hay red, confiar en token local
    }
  }

  // ── Login admin ──
  async function loginAdmin(email, password) {
    const res = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión');
    guardarSesion(data.token, data.usuario);
    return data.usuario;
  }

  // ── Validar PIN (invitado) ──
  async function validarPin(codigo) {
    const res = await fetch(`${API}/pin/validar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'PIN inválido');
    guardarSesion(data.token, { rol: 'invitado', pin: codigo });
    return { rol: 'invitado' };
  }

  // ── Generar PINs (admin) ──
  async function generarPins(cantidad = 1) {
    const res = await fetch(`${API}/pin/generar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ cantidad })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al generar PINs');
    return data;
  }

  // ── Historial de PINs (admin) ──
  async function historialPins() {
    const res = await fetch(`${API}/pin/historial`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al obtener historial');
    return data;
  }

  // ── UI: Login overlay ──
  function mostrarLogin() {
    const overlay = document.getElementById('auth-overlay');
    const app = document.getElementById('app-dashboard');
    if (overlay) overlay.hidden = false;
    if (app) app.hidden = true;
  }

  function mostrarDashboard() {
    const overlay = document.getElementById('auth-overlay');
    const app = document.getElementById('app-dashboard');
    if (overlay) overlay.hidden = true;
    if (app) app.hidden = false;
  }

  // ── Init ──
  async function init() {
    setupUI();
    const valido = await verificarSesion();
    if (valido) {
      mostrarDashboard();
      // Disparar carga del dashboard
      if (typeof window.cargarDatos === 'function') {
        window.cargarDatos();
      }
    } else {
      mostrarLogin();
    }
  }

  function setupUI() {
    const tabs = document.querySelectorAll('.auth-tab');
    const panels = document.querySelectorAll('.auth-panel');
    const loginForm = document.getElementById('form-login');
    const pinForm = document.getElementById('form-pin');
    const loginError = document.getElementById('login-error');
    const pinError = document.getElementById('pin-error');

    // ── Tab switching ──
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const target = document.getElementById(`panel-${tab.dataset.tab}`);
        if (target) target.classList.add('active');
        if (loginError) loginError.textContent = '';
        if (pinError) pinError.textContent = '';
      });
    });

    // ── Login Admin ──
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (loginError) loginError.textContent = '';
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        const btn = loginForm.querySelector('button[type="submit"]');
        if (btn) { btn.disabled = true; btn.textContent = 'Ingresando...'; }

        try {
          await loginAdmin(email, password);
          mostrarDashboard();
          if (typeof window.cargarDatos === 'function') {
            window.cargarDatos();
          }
        } catch (err) {
          if (loginError) loginError.textContent = err.message;
        } finally {
          if (btn) { btn.disabled = false; btn.textContent = 'Ingresar'; }
        }
      });
    }

    // ── Validar PIN ──
    if (pinForm) {
      pinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (pinError) pinError.textContent = '';
        const codigo = document.getElementById('pin-input').value.trim();

        const btn = pinForm.querySelector('button[type="submit"]');
        if (btn) { btn.disabled = true; btn.textContent = 'Validando...'; }

        try {
          await validarPin(codigo);
          mostrarDashboard();
          if (typeof window.cargarDatos === 'function') {
            window.cargarDatos();
          }
        } catch (err) {
          if (pinError) pinError.textContent = err.message;
        } finally {
          if (btn) { btn.disabled = false; btn.textContent = 'Ingresar con PIN'; }
        }
      });
    }

    // ── Cerrar sesión ──
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
      btnLogout.addEventListener('click', () => cerrarSesion());
    }

    // ── Admin: generar PIN ──
    const btnGenPin = document.getElementById('btn-generar-pin');
    if (btnGenPin) {
      btnGenPin.addEventListener('click', async () => {
        const cantidad = parseInt(document.getElementById('pin-cantidad')?.value || '1');
        const resultEl = document.getElementById('pin-resultado');
        try {
          const data = await generarPins(cantidad);
          if (resultEl) {
            resultEl.innerHTML = data.pins.map(p =>
              `<div class="pin-card">
                <span class="pin-code">${p.codigo}</span>
                <span class="pin-expira">Expira: ${new Date(p.expiracion).toLocaleTimeString()}</span>
              </div>`
            ).join('');
          }
        } catch (err) {
          if (resultEl) resultEl.innerHTML = `<span class="error-text">${err.message}</span>`;
        }
      });
    }

    // ── Admin: panel de PINs ──
    const btnPanelPin = document.getElementById('btn-toggle-pin-panel');
    const panelPin = document.getElementById('admin-pin-panel');
    if (btnPanelPin && panelPin) {
      btnPanelPin.addEventListener('click', () => {
        const isHidden = panelPin.hidden;
        panelPin.hidden = !isHidden;
        if (!isHidden) return;
        // Cargar historial
        historialPins().then(pins => {
          const tbody = document.getElementById('pin-historial-tbody');
          if (tbody) {
            tbody.innerHTML = pins.map(p => `
              <tr>
                <td><span class="pin-code-small">${p.codigo}</span></td>
                <td>${p.usado ? '✅ Usado' : p.vigente ? '🟢 Vigente' : '⏰ Expirado'}</td>
                <td>${new Date(p.expiracion).toLocaleString()}</td>
                <td>${new Date(p.creado).toLocaleString()}</td>
              </tr>
            `).join('');
          }
        }).catch(err => console.error(err));
      });
    }
  }

  return {
    init, getToken, getUser, isAdmin, isInvitado,
    loginAdmin, validarPin, generarPins, cerrarSesion
  };
})();

// ── Inicializar cuando el DOM esté listo ──
document.addEventListener('DOMContentLoaded', () => AUTH.init());
