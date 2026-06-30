/* ── electoral.js ── Dashboard Electoral ── */

const ARCHIVOS = {
    ayuntamiento: { '2024': 'jsons/Ayuntamientos_2024.json', '2021': 'jsons/Ayuntamientos_2021.json', '2018': 'jsons/Ayuntamientos_2018.json' },
    gobernatura:  { '2021': 'jsons/Gubernatura_2021.json' },
    diputacion_local: { '2024': 'jsons/DiputacionLocal_2024.json', '2021': 'jsons/DiputacionLocal_2021.json', '2018': 'jsons/DiputacionLocal_2018.json' },
    diputacion_federal: { '2024': 'jsons/DiputacionFederal_2024.json', '2021': 'jsons/DiputacionFederal_2021.json', '2018': 'jsons/DiputacionFederal_2018.json' }
};
const GEOJSON_MAP = {
    ayuntamiento: { '2024': 'geojsons/secciones_2024.geojson', '2021': 'geojsons/secciones_2021.geojson', '2018': 'geojsons/secciones_2018.geojson' },
    gobernatura:  { '2021': 'geojsons/secciones_2021.geojson' },
    diputacion_local: { '2024': 'geojsons/secciones_2024.geojson', '2021': 'geojsons/secciones_2021.geojson', '2018': 'geojsons/secciones_2018.geojson' },
    diputacion_federal: { '2024': 'geojsons/secciones_2024.geojson', '2021': 'geojsons/secciones_2021.geojson', '2018': 'geojsons/secciones_2018.geojson' }
};
const COL_MAP = {
    ayuntamiento: {
        '2024': { municipio:'Municipio', seccion:'Seccion', listaNominal:'Lista Nominal', votosEmitidos:'Votos Emitidos', participacion:'Participacion (%)', primerLugar:'1er Lugar', votosP:'Votos', segundoLugar:'2do Lugar', votos2:'Votos.1', tercerLugar:'3er Lugar', votos3:'Votos.2', nulos:'Nulos', partidos:['PAN','PRI','PRD','PAN-PRI-PRD','PAN-PRI','PAN-PRD','PRI-PRD','PVEM','MORENA','PT','PVEM-MORENA-PT','PVEM-MORENA','PVEM-PT','MORENA-PT','MC','QS'] },
        '2021': { municipio:'MUNICIPIO', seccion:'SECCION', listaNominal:'LISTA_NOMINAL', votosEmitidos:'VOTOS_EMITIDOS', participacion:'PARTICIPACION_PCN', primerLugar:'1ER_LUGAR', votosP:'1ERO_VOTOS', segundoLugar:'2DO_LUGAR', votos2:'2DO_VOTOS', tercerLugar:'3ER_LUGAR', votos3:'3RO_VOTOS', nulos:'NULOS', partidos:['PAN','PRI','PRD','MC','PVEM','MORENA','PT','QI','PES','RSP','FXM','PAN_PRD_QI','PAN_PRD','PAN_QI','PRD_QI','PRI_PVEM','PVEM_PT','PT_QI'] },
        '2018': { municipio:'MUNICIPIO', seccion:'SECCION', listaNominal:'LISTA_NOMINAL', votosEmitidos:'VOTOS_EMITIDOS', participacion:'PARTICIPACION_PCN', primerLugar:'1ER_LUGAR', votosP:'1ERO_VOTOS', segundoLugar:'2DO_LUGAR', votos2:'2DO_VOTOS', tercerLugar:'3ER_LUGAR', votos3:'3RO_VOTOS', nulos:'NULOS', partidos:['PAN','PRI','PRD','MC','NA','PVEM','ES','MORENA','PT','CQ','QI','PAN_PRD_MC','PAN_PRD','PAN_MC','PRD_MC','PRI_PVEM','MORENA_PT_PES','MORENA_PT','MORENA_PES','PT_PES'] }
    },
    gobernatura: {
        '2021': { municipio:'MUNICIPIO', seccion:'SECCION', listaNominal:'LISTA_NOMINAL', votosEmitidos:'VOTOS_EMITIDOS', participacion:'PARTICIPACION', primerLugar:'1ER_LUGAR', votosP:'1ERO_VOTOS', segundoLugar:'2DO_LUGAR', votos2:'2DO_VOTOS', tercerLugar:'3ER_LUGAR', votos3:'3RO_VOTOS', nulos:'NULOS', partidos:['PAN','PRI','PRD','MC','PVEM','MORENA','PT','QI','PES','RSP','FxM','PAN_QI'] }
    },
    diputacion_local: {
        '2024': { municipio:'DISTRITO', seccion:'SECCION', listaNominal:'LISTA_NOMINAL', votosEmitidos:'VOTOS_EMITIDOS', participacion:'PARTICIPACION', primerLugar:'1ER_LUGAR', votosP:'1ERO_VOTOS', segundoLugar:'2DO_LUGAR', votos2:'2DO_VOTOS', tercerLugar:'3ER_LUGAR', votos3:'3RO_VOTOS', nulos:'NULOS', partidos:['PAN','PRI','PRD','PAN-PRI-PRD','PAN-PRI','PAN-PRD','PRI-PRD','PVEM','MORENA','PT','PVEM-MORENA-PT','PVEM-MORENA','PVEM-PT','MORENA-PT','MC','QS'] },
        '2021': { municipio:'DISTRITO', seccion:'SECCION', listaNominal:'LISTA_NOMINAL', votosEmitidos:'VOTOS_EMITIDOS', participacion:'PARTICIPACION', primerLugar:'1ER_LUGAR', votosP:'1ERO_VOTOS', segundoLugar:'2DO_LUGAR', votos2:'2DO_VOTOS', tercerLugar:'3ER_LUGAR', votos3:'3RO_VOTOS', nulos:'NULOS', partidos:['PAN','PRI','PRD','MC','PVEM','MORENA','PT','QI','PES','RSP','FM','PAN_QI','PRI_PVEM','PVEM-PT'] },
        '2018': { municipio:'DISTRITO', seccion:'SECCION', listaNominal:'LISTA_NOMINAL', votosEmitidos:'VOTOS_EMITIDOS', participacion:'PARTICIPACION', primerLugar:'1ER_LUGAR', votosP:'1ERO_VOTOS', segundoLugar:'2DO_LUGAR', votos2:'2DO_VOTOS', tercerLugar:'3ER_LUGAR', votos3:'3RO_VOTOS', nulos:'NULOS', partidos:['PAN','PRI','PRD','PVEM','PT','MC','NA','MORENA','ES','CQ','QI','MORENA-PT-PES','P_MORENA-PT','P_MORENA-PES','P_PT-PES','PRI-PVEM','CC_PAN-PRD-MC','P_PAN-PRD','P_PAN-MC','P_PRD-MC'] }
    },
    diputacion_federal: {
        '2024': { municipio:'DISTRITO', seccion:'SECCION', listaNominal:'LISTA_NOMINAL', votosEmitidos:'VOTOS_EMITIDOS', participacion:'PARTICIPACION', primerLugar:'1ER_LUGAR', votosP:'1ERO_VOTOS', segundoLugar:'2DO_LUGAR', votos2:'2DO_VOTOS', tercerLugar:'3ER_LUGAR', votos3:'3RO_VOTOS', nulos:'NULOS', partidos:['PAN','PRI','PRD','MC','PVEM','MORENA','PT','PVEM-MORENA-PT','PVEM-MORENA','PVEM-PT','MORENA-PT','PAN-PRI-PRD','PAN-PRI','PAN-PRD','PRI-PRD'] },
        '2021': { municipio:'DISTRITO', seccion:'SECCION', listaNominal:'LISTA_NOMINAL', votosEmitidos:'VOTOS_EMITIDOS', participacion:'PARTICIPACION', primerLugar:'1ER_LUGAR', votosP:'1ERO_VOTOS', segundoLugar:'2DO_LUGAR', votos2:'2DO_VOTOS', tercerLugar:'3ER_LUGAR', votos3:'3RO_VOTOS', nulos:'NULOS', partidos:['PAN','PRI','PRD','MC','PVEM','MORENA','PT','PES','RSP','FXM','CI','PVEM-MORENA-PT','PVEM-MORENA','PVEM-PT','MORENA-PT','PAN-PRI-PRD','PAN-PRI','PAN-PRD','PRI-PRD'] },
        '2018': { municipio:'DISTRITO', seccion:'SECCION', listaNominal:'LISTA_NOMINAL', votosEmitidos:'VOTOS_EMITIDOS', participacion:'PARTICIPACION', primerLugar:'1ER_LUGAR', votosP:'1ERO_VOTOS', segundoLugar:'2DO_LUGAR', votos2:'2DO_VOTOS', tercerLugar:'3ER_LUGAR', votos3:'3RO_VOTOS', nulos:'NULOS', partidos:['PAN','PRI','PRD','MC','PVEM','NA','ES','MORENA','PT-MORENA-PES','MORENA-PES','PT-PES','MORENA-PT','PT','PAN-PRD-MC','PAN-MC','PAN-PRD','PRD-MC','PRI-PVEM-NA','PRI-PVEM','PRI-NA','PVEM-NA','CI01','CI02'] }
    }
};
const ELECCIONES_POR_ANIO = { '2024':['ayuntamiento','diputacion_local','diputacion_federal'], '2021':['ayuntamiento','gobernatura','diputacion_local','diputacion_federal'], '2018':['ayuntamiento','diputacion_local','diputacion_federal'] };
const ESTADOS_MX = ['Aguascalientes','Baja California','Baja California Sur','Campeche','Chiapas','Chihuahua','Ciudad de México','Coahuila','Colima','Durango','Estado de México','Guanajuato','Guerrero','Hidalgo','Jalisco','Michoacán','Morelos','Nayarit','Nuevo León','Oaxaca','Puebla','Querétaro','Quintana Roo','San Luis Potosí','Sinaloa','Sonora','Tabasco','Tamaulipas','Tlaxcala','Veracruz','Yucatán','Zacatecas'];

const COLORES = {
    'PAN':'#0057B8','PRI':'#C4161C','PRD':'#FFD700','MORENA':'#8B1A1A','PT':'#FF0000',
    'PVEM':'#00A651','MC':'#FF8C00','QI':'#E0218A','PES':'#7B2D8B','RSP':'#FF8080',
    'FXM':'#FF69B4','FxM':'#FF69B4','FM':'#FF69B4','NA':'#00BCD4','ES':'#7B2D8B','CQ':'#E0218A','QS':'#E0218A',
    'CI':'#999999','CI01':'#999999','CI02':'#999999',
    'PAN-PRI-PRD':'#0057B8','PAN-PRI':'#0057B8','PAN-PRD':'#0057B8','PRI-PRD':'#C4161C',
    'PVEM-MORENA-PT':'#8B1A1A','PVEM-MORENA':'#8B1A1A','PVEM-PT':'#00A651','MORENA-PT':'#8B1A1A',
    'PAN-PRD-MC':'#0057B8','PAN-MC':'#0057B8','PRD-MC':'#FFD700',
    'PT-MORENA-PES':'#8B1A1A','MORENA-PES':'#8B1A1A','PT-PES':'#FF0000',
    'PRI-PVEM-NA':'#C4161C','PRI-PVEM':'#C4161C','PRI-NA':'#C4161C','PVEM-NA':'#00A651',
    'PAN_PRD_QI':'#0057B8','PAN_PRD':'#0057B8','PAN_QI':'#0057B8','PRD_QI':'#FFD700',
    'PRI_PVEM':'#C4161C','PVEM_PT':'#00A651','PT_QI':'#FF0000',
    'PAN_PRD_MC':'#0057B8','PAN_MC':'#0057B8','PRD_MC':'#FFD700',
    'MORENA_PT_PES':'#8B1A1A','MORENA_PT':'#8B1A1A','MORENA_PES':'#8B1A1A','PT_PES':'#FF0000',
    'MORENA-PT-PES':'#8B1A1A','P_MORENA-PT':'#8B1A1A','P_MORENA-PES':'#8B1A1A','P_PT-PES':'#FF0000',
    'CC_PAN-PRD-MC':'#0057B8','P_PAN-PRD':'#0057B8','P_PAN-MC':'#0057B8','P_PRD-MC':'#FFD700'
};
// Partidos individuales (no coaliciones)
const PARTIDOS_INDIVIDUALES = ['PAN','PRI','MC','MORENA','PVEM','PT'];
const PARTIDOS_IND = ['QI','CQ','QS','CI','CI01','CI02']; // independientes

const ICONOS = { 'PAN':'images/partidos/pan.png','PRI':'images/partidos/pri.png','PRD':'images/partidos/prd.png','MORENA':'images/partidos/morena.png','PT':'images/partidos/pt.png','PVEM':'images/partidos/pvem.png','MC':'images/partidos/mc.png' };

let datosActuales = [], colsActuales = null, geoCache = {}, candidatosData = null;
let barrasTop = 3, barrasVista = 'individual'; // chart state

// ── Fotos candidatos 2021 ──
const FOTOS_GUBERNATURA_2021 = {
    'ABIGAIL ARREDONDO RAMOS':'abigail_ramos.jpg','MAURICIO KURI GONZALEZ':'mauricio_gonzalez.jpg',
    'RAQUEL RUIZ DE SANTIAGO ALVAREZ':'raquel_alvarez.jpg','BEATRIZ MAGDALENA LEON SOTELO':'beatriz_sotelo.jpg',
    'KATIA RESENDIZ JAIME':'katia_jaime.jpg','CELIA MAYA GARCIA':'celia_garcia.jpg',
    'PENELOPE RAMIREZ MANRIQUEZ':'penelope_manriquez.jpg','MA. DE JESUS IBARRA SILVA':'maria_silva.jpg',
    'MIGUEL NAVA ALVARADO':'miguel_alvarado.jpg','JUAN CARLOS MARTINEZ CECIAS RODRIGUEZ':'juan_rodriguez.jpg'
};
const MUNICIPIO_CARPETA_2021 = {
    'AMEALCO DE BONFIL':'AMEALCO','COLON':'COLÓN','EL MARQUES':'EL MARQUÉS',
    'JALPAN DE SERRA':'JALPÁN DE SERRA','PENAMILLER':'PEÑA MILLER','QUERETARO':'QUERÉTARO',
    'SAN JOAQUIN':'SAN JOAQUÍN','SAN JUAN DEL RIO':'SAN JUAN DEL RÍO','TOLIMAN':'TOLIMÁN'
};
const FOTO_EXCEPCIONES_2021 = { 'RENE MEJIA MONTOYA':'rene_montoya.jpg' };

function getFotoCandidato2021(nombre, tipo, municipio) {
    if (tipo === 'gobernatura') {
        const archivo = FOTOS_GUBERNATURA_2021[nombre];
        return archivo ? `images/candidatos/2021/Gubernatura/${archivo}` : null;
    }
    if (tipo === 'diputacion_federal') {
        const num = (municipio || '').match(/\d+/)?.[0];
        const archivo = nombre.replace(/ /g, '_') + '.jpg';
        return num ? `images/candidatos/2021/Diputados Federales/Distr ${num}/${archivo}` : null;
    }
    if (tipo === 'diputacion_local') {
        const num = (municipio || '').match(/\d+/)?.[0];
        return num ? `images/candidatos/2021/Distritos/Distrito ${num}/${nombre}.jpg` : null;
    }
    const carpeta = MUNICIPIO_CARPETA_2021[municipio] || municipio;
    const archivo = FOTO_EXCEPCIONES_2021[nombre] || `${nombre}.jpg`;
    return `images/candidatos/2021/Ayuntamientos/${carpeta}/${archivo}`;
}

// ── Fotos candidatos 2024 ──
const MUNICIPIO_CARPETA_2024 = {
    'COLON':'COLÓN','EL MARQUES':'EL MARQUÉS','JALPAN DE SERRA':'JALPÁN DE SERRA',
    'LANDA DE MATAMOROS':'LANDA DE MATÁMOROS','PENAMILLER':'PEÑA MILLER','QUERETARO':'QUERÉTARO',
    'SAN JOAQUIN':'SAN JOAQUÍN','SAN JUAN DEL RIO':'SAN JUAN DEL RÍO',
    'TEQUISQUIAPAN':'TEQUISQUIAPÁN','TOLIMAN':'TOLIMÁN'
};

function getFotoCandidato2024(nombre, tipo, municipio) {
    if (tipo === 'diputacion_federal') {
        const num = (municipio || '').match(/\d+/)?.[0];
        const archivo = nombre.toUpperCase().replace(/ /g, '_') + '.jpg';
        return num ? `images/candidatos/2024/DIPUTACIÓN FEDERAL/Distrito ${num}/${archivo}` : null;
    }
    if (tipo === 'diputacion_local') {
        const num = (municipio || '').match(/\d+/)?.[0];
        return num ? `images/candidatos/2024/DIPUTACIÓN LOCAL/Distrito ${num}/${nombre}.jpg` : null;
    }
    if (tipo === 'ayuntamiento') {
        const carpeta = MUNICIPIO_CARPETA_2024[municipio] || municipio;
        return `images/candidatos/2024/AYUNTAMIENTOS/${carpeta}/${nombre}.jpg`;
    }
    return null;
}


// ── Utilidades ──
const parseNum = v => parseFloat(String(v ?? '').replace(/,/g,'').trim()) || 0;
function fmtNum(n) { return n.toLocaleString('en-US'); }
function normStr(s) { return (s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().trim(); }
function titleCase(s) { return (s||'').toLowerCase().replace(/(^|\s)\S/g, c => c.toUpperCase()); }

function iconosPartido(partido, size = 32) {
    const partes = partido.replace(/_/g,'-').split('-').filter(p => ICONOS[p]);
    if (ICONOS[partido]) return `<img src="${ICONOS[partido]}" class="p-icon-square" style="width:${size}px;height:${size}px;">`;
    if (partes.length) return partes.map(p => `<img src="${ICONOS[p]}" class="p-icon-square" style="width:${size}px;height:${size}px;">`).join('');
    const color = COLORES[partido] || '#666';
    return `<span class="p-icon-dot" style="background:${color};width:${size}px;height:${size}px;"></span>`;
}

function esCoalicion(p) { return p.includes('-') || p.includes('_'); }
function esIndependiente(p) { return PARTIDOS_IND.includes(p); }

function getParticipacionColor(pct) {
    if (pct < 50) return '#ef4444';
    if (pct < 65) return '#f97316';
    if (pct < 80) return '#eab308';
    return '#7bc11d';
}

async function cargarCSV(url) { return (await fetch(url)).json(); }
async function cargarCandidatos() { if (!candidatosData) candidatosData = await (await fetch('jsons/candidatos.json')).json(); }
function getCandidatoInfo(partido) {
    if (!candidatosData) return null;
    const tipo = elElec.value, anio = elAnio.value;
    const data = candidatosData[tipo]?.[anio];
    if (!data) return null;
    if (tipo === 'gobernatura') return data[partido] || null;
    // Para ayuntamiento: si hay un solo municipio seleccionado, buscar por municipio
    if (selMunicipios.size === 1) {
        const munKey = [...selMunicipios][0];
        const munData = data[munKey];
        if (munData?.[partido]) return munData[partido];
    }
    // Buscar en _default
    return data._default?.[partido] || null;
}

// ── DOM refs ──
const elEstado = document.getElementById('filtro-estado');
const elAnio   = document.getElementById('filtro-anio');
const elElec   = document.getElementById('filtro-eleccion');

let selMunicipios = new Set(), selSecciones = new Set();

function msToggle(wrap, panel) {
    const open = !panel.hidden;
    document.querySelectorAll('.ms-panel').forEach(p => { p.hidden = true; p.closest('.ms-wrap')?.classList.remove('open'); });
    if (!open) { panel.hidden = false; wrap.classList.add('open'); }
}
function msLabel(sel, def) { return !sel.size ? def : sel.size === 1 ? [...sel][0] : `${sel.size} seleccionados`; }

function buildMsList(containerId, items, sel, onSelect, searchId, groupName) {
    const list = document.getElementById(containerId), search = document.getElementById(searchId);
    search.value = '';
    function render(q) {
        const filtered = q ? items.filter(v => v.toLowerCase().includes(q)) : items;
        list.innerHTML = filtered.map(v => `<label class="ms-opt"><input type="radio" name="${groupName}" value="${v}" ${sel.has(v)||sel.has(normStr(v))?'checked':''}> ${v}</label>`).join('');
        list.querySelectorAll('input[type=radio]').forEach(rb => rb.addEventListener('change', () => { if (rb.checked) onSelect(rb.value); }));
    }
    search.oninput = () => render(search.value.toLowerCase());
    render('');
}

function initEstados() { elEstado.innerHTML = ESTADOS_MX.map(e => `<option value="${e}"${e==='Querétaro'?' selected':''}>${e}</option>`).join(''); }
function actualizarElecciones() {
    const elecciones = ELECCIONES_POR_ANIO[elAnio.value] || ['ayuntamiento'];
    const labels = { ayuntamiento:'Ayuntamiento', gobernatura:'Gobernatura', diputacion_local:'Diputación Local', diputacion_federal:'Diputación Federal' };
    elElec.innerHTML = elecciones.map(e => `<option value="${e}">${labels[e]||e}</option>`).join('');
}

function actualizarMunicipios() {
    selMunicipios.clear(); selSecciones.clear();
    const tipo = elElec.value;
    const esDL = tipo === 'diputacion_local' || tipo === 'diputacion_federal';
    document.getElementById('label-municipio').textContent = esDL ? 'Distrito' : 'Municipio';
    let munsRaw = [...new Set(datosActuales.map(r => r[colsActuales.municipio]).filter(Boolean))];
    munsRaw = esDL ? munsRaw.sort((a,b) => (parseInt(String(a).match(/\d+/))||0) - (parseInt(String(b).match(/\d+/))||0)) : munsRaw.sort();
    const muns = munsRaw.map(m => titleCase(m));
    const munBtnEl = document.getElementById('ms-municipio-btn');
    const items = tipo === 'gobernatura' ? ['Todos', ...muns] : muns;
    if (tipo === 'gobernatura') {
        munBtnEl.firstChild.textContent = 'Todos ';
    } else if (muns.length) {
        selMunicipios.add(normStr(muns[0]));
        munBtnEl.firstChild.textContent = muns[0] + ' ';
    }
    const defaultSel = tipo === 'gobernatura' ? new Set(['Todos']) : selMunicipios;
    buildMsList('ms-municipio-list', items, defaultSel, (val) => {
        selMunicipios.clear();
        if (val !== 'Todos') selMunicipios.add(normStr(val));
        munBtnEl.firstChild.textContent = val + ' ';
        document.getElementById('ms-municipio-panel').hidden = true;
        document.getElementById('ms-municipio-wrap').classList.remove('open');
        actualizarSecciones(); renderDashboard();
    }, 'buscar-municipio', 'radio-municipio');
    actualizarSecciones();
}

function actualizarSecciones() {
    selSecciones.clear();
    const secs = [...new Set(getDatosFiltrados(true).map(r => r[colsActuales.seccion]).filter(Boolean))].sort((a,b)=>parseNum(a)-parseNum(b)).map(String);
    const items = ['Todas', ...secs];
    buildMsList('ms-seccion-list', items, new Set(['Todas']), (val) => {
        selSecciones.clear();
        if (val !== 'Todas') selSecciones.add(val);
        document.getElementById('ms-seccion-btn').firstChild.textContent = (val === 'Todas' ? 'Todas' : val) + ' ';
        document.getElementById('ms-seccion-panel').hidden = true;
        document.getElementById('ms-seccion-wrap').classList.remove('open');
        renderDashboard();
    }, 'buscar-seccion', 'radio-seccion');
    document.getElementById('ms-seccion-btn').firstChild.textContent = 'Todas ';
}

function getDatosFiltrados(soloMun = false) {
    let d = datosActuales;
    if (selMunicipios.size) d = d.filter(r => selMunicipios.has(normStr(r[colsActuales.municipio])));
    if (!soloMun && selSecciones.size) d = d.filter(r => selSecciones.has(String(r[colsActuales.seccion])));
    return d;
}

// Dropdown open/close
document.getElementById('ms-municipio-btn').addEventListener('click', () => msToggle(document.getElementById('ms-municipio-wrap'), document.getElementById('ms-municipio-panel')));
document.getElementById('ms-seccion-btn').addEventListener('click', () => msToggle(document.getElementById('ms-seccion-wrap'), document.getElementById('ms-seccion-panel')));
document.addEventListener('click', e => { if (!e.target.closest('.ms-wrap')) document.querySelectorAll('.ms-panel').forEach(p => { p.hidden = true; p.closest('.ms-wrap')?.classList.remove('open'); }); });

// Event listeners
elEstado.addEventListener('change', cargarDatos);
elAnio.addEventListener('change', () => { actualizarElecciones(); cargarDatos(); });
elElec.addEventListener('change', cargarDatos);
document.getElementById('filtro-limpiar').addEventListener('click', () => { elEstado.value='Querétaro'; elAnio.value='2024'; actualizarElecciones(); selMunicipios.clear(); selSecciones.clear(); cargarDatos(); });


// ── Carga ──
async function cargarDatos() {
    const tipo = elElec.value, anio = elAnio.value;
    if (!ARCHIVOS[tipo]?.[anio]) return;
    colsActuales = COL_MAP[tipo][anio];
    datosActuales = await cargarCSV(ARCHIVOS[tipo][anio]);
    await cargarCandidatos();
    actualizarMunicipios();
    renderDashboard();
    cargarMapa();
}

// ── Animación de conteo ──
function animateCount(elId, target, isPct = false) {
    const el = document.getElementById(elId);
    const duration = 1200;
    const start = performance.now();
    const from = 0;
    function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const current = from + (target - from) * eased;
        el.textContent = isPct ? current.toFixed(2) + '%' : fmtNum(Math.round(current));
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

// ── Render ──
function renderDashboard() {
    const datos = getDatosFiltrados(), cols = colsActuales;
    if (!cols) return;
    const listaNominal  = datos.reduce((s,r) => s + parseNum(r[cols.listaNominal]), 0);
    const votosEmitidos = datos.reduce((s,r) => s + parseNum(r[cols.votosEmitidos]), 0);
    const nulos         = datos.reduce((s,r) => s + parseNum(r[cols.nulos]), 0);
    const participacion = listaNominal > 0 ? (votosEmitidos / listaNominal * 100) : 0;

    animateCount('kpi-lista-nominal', listaNominal);
    animateCount('kpi-votos-emitidos', votosEmitidos);
    animateCount('kpi-votos-nulos', nulos);
    animateCount('kpi-participacion', participacion, true);
    document.getElementById('kpi-participacion').style.color  = getParticipacionColor(participacion);

    renderTop3(datos, cols);
    renderPartidos(datos, cols);
    renderBarras(datos, cols);
    renderHistorico();
    renderTabla(datos, cols);
    actualizarMapa();
}
window.renderDashboard = renderDashboard;

// ── Top 3 Candidatos (coalición: agrupa votos por candidato) ──
function renderTop3(datos, cols) {
    const tipo = elElec.value, anio = elAnio.value;
    const totalVotos = datos.reduce((s, r) => s + parseNum(r[cols.votosEmitidos]), 0);

    let top3 = null;
    if (candidatosData?.[tipo]?.[anio]) {
        const data = candidatosData[tipo][anio];
        if (tipo === 'gobernatura') {
            // Single candidate list
            top3 = buildTop3FromCandData(data, datos);
        } else if (selMunicipios.size === 1) {
            const munKey = [...selMunicipios][0];
            if (data[munKey]) top3 = buildTop3FromCandData(data[munKey], datos, munKey);
        } else {
            // All/multiple municipios: compute each candidate's votes in their municipio rows
            const allResults = [];
            const munCol = cols.municipio;
            Object.entries(data).forEach(([munKey, munCands]) => {
                const munRows = datos.filter(r => normStr(r[munCol]) === munKey);
                if (!munRows.length) return;
                Object.entries(munCands).forEach(([nombre, columnas]) => {
                    if (!columnas.length) return;
                    const votos = columnas.reduce((s, col) => s + munRows.reduce((ss, r) => ss + parseNum(r[col]), 0), 0);
                    if (votos <= 0) return;
                    const mainCol = columnas.reduce((best, col) => {
                        const v = munRows.reduce((ss, r) => ss + parseNum(r[col]), 0);
                        return v > best[1] ? [col, v] : best;
                    }, ['', 0])[0];
                    allResults.push({ nombre, votos, mainCol, columnas, municipio: munKey });
                });
            });
            top3 = allResults.sort((a, b) => b.votos - a.votos).slice(0, 3);
        }
    }

    // Fallback: fill with party-based top if candidatos data is missing or incomplete
    if (!top3 || top3.length < 3) {
        const usedCols = new Set((top3 || []).flatMap(c => c.columnas));
        const availCols = cols.partidos.filter(col => !usedCols.has(col));
        const indiv = availCols.filter(c => !c.includes('-') && !c.includes('_'));
        const coalitionCols = availCols.filter(c => c.includes('-') || c.includes('_'))
            .map(col => {
                let name = col;
                if (name.startsWith('P_')) name = name.slice(2);
                else if (name.startsWith('CC_')) name = name.slice(3);
                const tokens = name.replace(/_/g, '-').split('-');
                const comps = new Set(tokens.filter(t => indiv.includes(t) || (t === 'PES' && indiv.includes('ES'))).map(t => t === 'PES' ? 'ES' : t));
                return { col, comps };
            })
            .sort((a, b) => b.comps.size - a.comps.size);
        const anchors = [];
        const assigned = {};
        coalitionCols.forEach(({ col, comps }) => {
            if (comps.size < 2) return;
            const parent = anchors.find(a => [...comps].every(c => a.members.has(c)));
            if (parent) { assigned[col] = parent.key; }
            else { anchors.push({ key: col, members: comps }); assigned[col] = col; }
        });
        indiv.forEach(p => {
            const a = anchors.find(a => a.members.has(p));
            assigned[p] = a ? a.key : p;
        });
        coalitionCols.forEach(({ col, comps }) => {
            if (!assigned[col]) assigned[col] = col;
        });
        const groups = {};
        availCols.forEach(col => {
            const key = assigned[col] || col;
            if (!groups[key]) groups[key] = [];
            groups[key].push(col);
        });
        const fallback = Object.entries(groups).map(([key, columns]) => {
            const votos = columns.reduce((s, col) => s + datos.reduce((ss, r) => ss + parseNum(r[col]), 0), 0);
            const mainCol = columns.reduce((best, col) => {
                const v = datos.reduce((ss, r) => ss + parseNum(r[col]), 0);
                return v > best[1] ? [col, v] : best;
            }, ['', 0])[0];
            return { nombre: key.replace(/[-_]/g, ' '), votos, mainCol, columnas: columns };
        }).filter(c => c.votos > 0).sort((a, b) => b.votos - a.votos);
        top3 = [...(top3 || []), ...fallback].sort((a, b) => b.votos - a.votos).slice(0, 3);
    }

    document.getElementById('top-ganadores').innerHTML = top3.map((c, i) => {
        const pct = totalVotos > 0 ? (c.votos / totalVotos * 100).toFixed(1) : 0;
        const partidosUnicos = [...new Set(c.columnas.flatMap(col => {
            let name = col;
            if (name.startsWith('P_')) name = name.slice(2);
            else if (name.startsWith('CC_')) name = name.slice(3);
            return name.replace(/_/g, '-').split('-');
        }))].filter(p => ICONOS[p]);
        const iconosHtml = partidosUnicos.length
            ? partidosUnicos.map(p => `<img src="${ICONOS[p]}" class="p-icon-square" style="width:40px;height:40px;">`).join('')
            : iconosPartido(c.mainCol, 40);
        const color = COLORES[c.mainCol] || '#666';
        const foto = anio === '2021' ? getFotoCandidato2021(c.nombre, tipo, c.municipio)
                   : anio === '2024' ? getFotoCandidato2024(c.nombre, tipo, c.municipio)
                   : null;
        const fotoHtml = foto
            ? `<div class="candidato-foto-wrap"><img src="${foto}" class="candidato-foto-img" alt="${titleCase(c.nombre)}" onerror="this.parentElement.innerHTML='<div class=\\'candidato-foto-placeholder\\'><span class=\\'candidato-foto-num\\'>${i+1}°</span></div>'"><span class="candidato-foto-num-overlay">${i + 1}°</span></div>`
            : `<div class="candidato-foto-wrap"><div class="candidato-foto-placeholder"><span class="candidato-foto-num">${i + 1}°</span></div></div>`;
        return `<div class="candidato-card">
            ${fotoHtml}
            <div class="candidato-partido-icons">${iconosHtml}</div>
            <div class="candidato-nombre"><b>${titleCase(c.nombre)}</b></div>
            <div class="candidato-partido-label">${[...new Set(c.columnas.flatMap(p => p.replace(/_/g,'-').split('-')))].join(' + ')}</div>
            <div class="candidato-stat-row"><b class="candidato-stat-label">Votos:</b> <span class="candidato-stat-val">${fmtNum(c.votos)}</span></div>
            <div class="candidato-stat-row"><b class="candidato-stat-label">Porcentaje:</b> <span class="candidato-stat-val">${pct}%</span></div>
            <div class="candidato-accent" style="background:${color}"></div>
        </div>`;
    }).join('');
}

function buildTop3FromCandData(candData, datos, municipio) {
    return Object.entries(candData).map(([nombre, columnas]) => {
        if (!columnas.length) return null;
        const votos = columnas.reduce((s, col) => s + datos.reduce((ss, r) => ss + parseNum(r[col]), 0), 0);
        const mainCol = columnas.reduce((best, col) => {
            const v = datos.reduce((ss, r) => ss + parseNum(r[col]), 0);
            return v > best[1] ? [col, v] : best;
        }, ['', 0])[0];
        return { nombre, votos, mainCol, columnas, municipio };
    }).filter(c => c && c.votos > 0).sort((a, b) => b.votos - a.votos).slice(0, 3);
}

// ── Partidos: only individual parties in 2x4 grid ──
function renderPartidos(datos, cols) {
    const totales = {};
    cols.partidos.forEach(p => { totales[p] = 0; });
    datos.forEach(r => cols.partidos.forEach(p => { totales[p] += parseNum(r[p]); }));
    const votosTotal = Object.values(totales).reduce((a,b) => a+b, 0);

    // Sum individual parties
    const panelPartidos = {};
    PARTIDOS_INDIVIDUALES.forEach(p => { panelPartidos[p] = totales[p] || 0; });
    // IND = sum of independent parties
    let votosInd = 0;
    PARTIDOS_IND.forEach(p => { votosInd += (totales[p] || 0); });
    panelPartidos['IND'] = votosInd;
    // OTROS = everything else not in individual or ind
    const usados = new Set([...PARTIDOS_INDIVIDUALES, ...PARTIDOS_IND]);
    let votosOtros = 0;
    Object.entries(totales).forEach(([p,v]) => { if (!usados.has(p)) votosOtros += v; });
    panelPartidos['OTROS'] = votosOtros;

    // Sort by votes, keep OTROS at end
    const entries = Object.entries(panelPartidos).filter(([p]) => p !== 'OTROS').sort((a,b) => b[1]-a[1]);
    entries.push(['OTROS', panelPartidos['OTROS']]);

    document.getElementById('partidos-grid').innerHTML = entries.map(([partido, votos]) => {
        const pct = votosTotal > 0 ? (votos/votosTotal*100).toFixed(1) : 0;
        const color = COLORES[partido] || '#888';
        let iconosHtml;
        if (partido === 'OTROS') iconosHtml = `<span class="p-icon-dot" style="background:#888;width:28px;height:28px;"></span>`;
        else if (partido === 'IND') iconosHtml = `<span class="p-icon-dot" style="background:#aaa;width:28px;height:28px;"></span>`;
        else iconosHtml = iconosPartido(partido, 28);
        return `<div class="partido-card-v2">
            <div class="partido-card-header">${iconosHtml}<span class="partido-card-name"><b>${partido}</b></span></div>
            <div class="partido-card-votos">${fmtNum(votos)}</div>
            <div class="partido-bar-wrap"><div class="partido-bar" style="width:${pct}%;background:${color}"></div></div>
            <span class="partido-pct">${pct}%</span>
        </div>`;
    }).join('');
}


// ── Mapa ──
let geoData = null, geoMunicipios = null, geoDistritos = null;
document.getElementById('mapa-vista').addEventListener('change', actualizarMapa);

function actualizarMapaVista() {
    const sel = document.getElementById('mapa-vista');
    const tipo = elElec.value;
    if (tipo === 'diputacion_local') {
        sel.innerHTML = '<option value="secciones">Secciones</option><option value="distritos">Distritos</option>';
    } else if (tipo === 'diputacion_federal') {
        sel.innerHTML = '<option value="secciones">Secciones</option>';
    } else {
        sel.innerHTML = '<option value="secciones">Secciones</option><option value="municipios">Municipios</option>';
    }
}

// Fullscreen
document.getElementById('mapa-fullscreen').addEventListener('click', () => {
    const el = document.querySelector('.col-mapa');
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen();
});

async function cargarMapa() {
    const tipo = elElec.value, anio = elAnio.value;
    const url = GEOJSON_MAP[tipo]?.[anio];
    if (!url) return;
    const key = `${tipo}_${anio}`;
    if (!geoCache[key]) geoCache[key] = await (await fetch(url)).json();
    geoData = geoCache[key];
    if (!geoMunicipios) geoMunicipios = await (await fetch('geojsons/municipios.geojson')).json();
    if (!geoDistritos && tipo === 'diputacion_local') geoDistritos = await (await fetch('geojsons/DISTRITOS_LOCALES_24.geojson')).json();
    actualizarMapaVista();
    actualizarMapa();
}

// Build lookup: seccion -> {municipio, partido}
function buildSecLookup(datos) {
    const lookup = {};
    datos.forEach(r => {
        lookup[String(parseInt(r[colsActuales.seccion]) || 0)] = {
            partido: r[colsActuales.primerLugar],
            municipio: titleCase(r[colsActuales.municipio])
        };
    });
    return lookup;
}

function actualizarMapa() {
    if (!geoData || !colsActuales) return;
    const vista = document.getElementById('mapa-vista').value;
    const datos = getDatosFiltrados();
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const bg = isDark ? '#0d0d0d' : '#f4f4f7';
    const secLookup = buildSecLookup(datos);

    let geo, locs, colors, texts;

    if (vista === 'municipios' && geoMunicipios) {
        const munGanador = {}, munDatos = {};
        datosActuales.forEach(r => {
            const mun = normStr(r[colsActuales.municipio]);
            if (!munDatos[mun]) munDatos[mun] = {};
            const p = r[colsActuales.primerLugar];
            if (p) munDatos[mun][p] = (munDatos[mun][p] || 0) + 1;
        });
        Object.entries(munDatos).forEach(([mun, partidos]) => { munGanador[mun] = Object.entries(partidos).sort((a,b)=>b[1]-a[1])[0]?.[0]||''; });

        const features = selMunicipios.size
            ? geoMunicipios.features.filter(f => selMunicipios.has(normStr(f.properties.NOM_MUN)))
            : geoMunicipios.features;
        geo = { type:'FeatureCollection', features: features.map((f,i)=>({...f, id:String(i)})) };
        locs = geo.features.map(f => f.id);
        colors = geo.features.map(f => { const g = munGanador[normStr(f.properties.NOM_MUN)]||''; return esIndependiente(g) ? '#aaaaaa' : (COLORES[g]||'#333'); });
        texts = geo.features.map(f => `${f.properties.NOM_MUN}: ${(munGanador[normStr(f.properties.NOM_MUN)]||'Sin datos').replace(/_/g,'-')}`);
    } else if (vista === 'distritos' && geoDistritos) {
        const distGanador = {};
        datosActuales.forEach(r => {
            const dist = normStr(r[colsActuales.municipio]);
            if (!distGanador[dist]) distGanador[dist] = {};
            const p = r[colsActuales.primerLugar];
            if (p) distGanador[dist][p] = (distGanador[dist][p] || 0) + 1;
        });
        const ganadorPorDist = {};
        Object.entries(distGanador).forEach(([d, partidos]) => { ganadorPorDist[d] = Object.entries(partidos).sort((a,b)=>b[1]-a[1])[0]?.[0]||''; });

        let features = geoDistritos.features.filter(f => normStr(f.properties.NOM_ENT) === 'QUERETARO');
        if (selMunicipios.size) features = features.filter(f => selMunicipios.has(normStr(`DISTRITO ${f.properties.DISTRITO_L}`)));
        geo = { type:'FeatureCollection', features: features.map((f,i)=>({...f, id:String(i)})) };
        locs = geo.features.map(f => f.id);
        colors = geo.features.map(f => {
            const distNum = f.properties.DISTRITO_L;
            const key = normStr(`DISTRITO ${distNum}`);
            const g = ganadorPorDist[key] || '';
            return esIndependiente(g) ? '#aaaaaa' : (COLORES[g]||'#333');
        });
        texts = geo.features.map(f => {
            const distNum = f.properties.DISTRITO_L;
            const key = normStr(`DISTRITO ${distNum}`);
            return `Distrito ${distNum}: ${(ganadorPorDist[key]||'Sin datos').replace(/_/g,'-')}`;
        });
    } else {
        const secsFiltradas = new Set(Object.keys(secLookup));
        const features = secsFiltradas.size < geoData.features.length
            ? geoData.features.filter(f => secsFiltradas.has(f.id)) : geoData.features;
        geo = { type:'FeatureCollection', features };
        locs = features.map(f => f.id);
        colors = features.map(f => { const p = secLookup[f.id]?.partido||''; return esIndependiente(p) ? '#aaaaaa' : (COLORES[p]||'#333333'); });
        // Hover: Municipio + Sección
        texts = features.map(f => { const info = secLookup[f.id]; return info ? `${info.municipio} · Sección ${f.id}\n${(info.partido||'').replace(/_/g,'-')}` : `Sección ${f.id}`; });
    }

    const uniqueColors = [...new Set(colors)];
    const colorMap = {}; uniqueColors.forEach((c,i) => { colorMap[c] = i; });
    const z = colors.map(c => colorMap[c]);
    const N = uniqueColors.length;
    const cscale = N === 1 ? [[0,uniqueColors[0]],[1,uniqueColors[0]]] : uniqueColors.map((c,i)=>[i/(N-1),c]);

    let minLat=90,maxLat=-90,minLon=180,maxLon=-180;
    geo.features.forEach(f => {
        const coords = f.geometry.type==='MultiPolygon' ? f.geometry.coordinates.flat(2) : f.geometry.coordinates.flat(1);
        coords.forEach(([lon,lat]) => { if(lat<minLat)minLat=lat; if(lat>maxLat)maxLat=lat; if(lon<minLon)minLon=lon; if(lon>maxLon)maxLon=lon; });
    });
    const centerLat=(minLat+maxLat)/2, centerLon=(minLon+maxLon)/2;
    const span = Math.max(maxLat-minLat, maxLon-minLon);
    // More zoom when filtering
    const hasFilter = selMunicipios.size || selSecciones.size;
    const zoom = hasFilter ? (span > 0.5 ? 8.5 : span > 0.1 ? 10 : 10.5) : (span > 1.5 ? 6.8 : span > 0.5 ? 2.5 : 10);

    Plotly.react('mapa-electoral', [{
        type:'choroplethmapbox', geojson:geo, locations:locs, z:z,
        colorscale:cscale, zmin:0, zmax:Math.max(N-1,1),
        showscale:false, text:texts, hoverinfo:'text',
        marker:{ opacity:0.9, line:{ width:0.8, color:'#000000' } }
    }], {
        mapbox:{ style: isDark?'carto-darkmatter':'carto-positron', center:{lat:centerLat,lon:centerLon}, zoom },
        paper_bgcolor:bg, margin:{t:0,b:0,l:0,r:0}, showlegend:false
    }, { responsive:true, displayModeBar:false });

    // Click to select section
    const mapaEl = document.getElementById('mapa-electoral');
    mapaEl.removeAllListeners?.('plotly_click');
    mapaEl.on('plotly_click', (evData) => {
        if (!evData.points.length) return;
        const pt = evData.points[0];
        if (vista === 'secciones') {
            const secId = pt.location;
            if (secId) {
                selSecciones.clear(); selSecciones.add(secId);
                document.getElementById('ms-seccion-btn').firstChild.textContent = secId + ' ';
                renderDashboard();
            }
        } else if (vista === 'municipios') {
            const idx = pt.pointIndex;
            const feat = geo.features[idx];
            if (feat) {
                const munKey = normStr(feat.properties.NOM_MUN);
                const munDisplay = titleCase(feat.properties.NOM_MUN);
                selMunicipios.clear(); selMunicipios.add(munKey);
                document.getElementById('ms-municipio-btn').firstChild.textContent = munDisplay + ' ';
                actualizarSecciones();
                renderDashboard();
                actualizarMapa();
            }
        } else if (vista === 'distritos') {
            const idx = pt.pointIndex;
            const feat = geo.features[idx];
            if (feat) {
                const distKey = normStr(`DISTRITO ${feat.properties.DISTRITO_L}`);
                const distDisplay = titleCase(`Distrito ${feat.properties.DISTRITO_L}`);
                selMunicipios.clear(); selMunicipios.add(distKey);
                document.getElementById('ms-municipio-btn').firstChild.textContent = distDisplay + ' ';
                actualizarSecciones();
                renderDashboard();
                actualizarMapa();
            }
        }
    });
}


// ── Distribución de Votos: 3D bars ──
function buildCoalitionGroups(cols) {
    const indiv = cols.partidos.filter(c => !c.includes('-') && !c.includes('_'));
    const coalitionCols = cols.partidos.filter(c => c.includes('-') || c.includes('_'))
        .map(col => {
            let name = col;
            if (name.startsWith('P_')) name = name.slice(2);
            else if (name.startsWith('CC_')) name = name.slice(3);
            const tokens = name.replace(/_/g, '-').split('-');
            const comps = new Set(tokens.filter(t => indiv.includes(t) || (t === 'PES' && indiv.includes('ES'))).map(t => t === 'PES' ? 'ES' : t));
            return { col, comps };
        })
        .sort((a, b) => b.comps.size - a.comps.size);
    const anchors = [];
    const assigned = {};
    coalitionCols.forEach(({ col, comps }) => {
        if (comps.size < 2) return;
        const parent = anchors.find(a => [...comps].every(c => a.members.has(c)));
        if (parent) { assigned[col] = parent.key; }
        else { anchors.push({ key: col, members: comps }); assigned[col] = col; }
    });
    indiv.forEach(p => {
        const a = anchors.find(a => a.members.has(p));
        assigned[p] = a ? a.key : p;
    });
    coalitionCols.forEach(({ col }) => { if (!assigned[col]) assigned[col] = col; });
    const groups = {};
    cols.partidos.forEach(col => {
        const key = assigned[col] || col;
        if (!groups[key]) groups[key] = [];
        groups[key].push(col);
    });
    return groups;
}

let _barrasHitAreas = [];
let _barrasTooltip = null;

function _initBarrasTooltip(container, canvas) {
    if (canvas._barrasTooltipInit) return;
    canvas._barrasTooltipInit = true;
    _barrasTooltip = document.createElement('div');
    _barrasTooltip.style.cssText = 'position:absolute;pointer-events:none;background:rgba(30,30,30,0.92);color:#fff;padding:6px 10px;border-radius:6px;font:600 12px Barlow,sans-serif;white-space:nowrap;opacity:0;transition:opacity 0.15s;z-index:100;';
    container.style.position = 'relative';
    container.appendChild(_barrasTooltip);

    canvas.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        let hit = null;
        for (const area of _barrasHitAreas) {
            if (mx >= area.x && mx <= area.x + area.w && my >= area.y && my <= area.y + area.h) {
                hit = area; break;
            }
        }
        if (hit) {
            const label = hit.partido.replace(/^P_|^CC_/, '').replace(/_/g,'-');
            _barrasTooltip.textContent = `${fmtNum(hit.votos)} — ${label} (${hit.pct}%)`;
            _barrasTooltip.style.left = (mx + 12) + 'px';
            _barrasTooltip.style.top = (my - 30) + 'px';
            _barrasTooltip.style.opacity = '1';
        } else {
            _barrasTooltip.style.opacity = '0';
        }
    });
    canvas.addEventListener('mouseleave', function() {
        _barrasTooltip.style.opacity = '0';
    });
}

function renderBarras(datos, cols) {
    const totales = {};
    cols.partidos.forEach(p => { totales[p] = 0; });
    datos.forEach(r => cols.partidos.forEach(p => { totales[p] += parseNum(r[p]); }));

    const container = document.getElementById('chart-barras');
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const textColor = isDark ? '#fff' : '#222';

    let canvas = container.querySelector('canvas.barras3d-canvas');
    if (!canvas) { container.innerHTML = ''; canvas = document.createElement('canvas'); canvas.className = 'barras3d-canvas'; canvas.style.cssText = 'width:100%;height:100%;display:block;'; container.appendChild(canvas); }
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    const W = rect.width, H = rect.height;
    ctx.clearRect(0, 0, W, H);

    _initBarrasTooltip(container, canvas);

    function darken(hex, amt) {
        let c = hex.replace('#','');
        if (c.length===3) c = c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
        const num = parseInt(c,16);
        let r = Math.max(0,(num>>16)-amt), g = Math.max(0,((num>>8)&0xff)-amt), b = Math.max(0,(num&0xff)-amt);
        return `rgb(${r},${g},${b})`;
    }

    if (barrasVista === 'coalicion') {
        renderBarrasCoalicion(datos, cols, totales, ctx, W, H, isDark, textColor, darken);
    } else {
        renderBarrasSimple(totales, ctx, W, H, isDark, textColor, darken);
    }
}

function renderBarrasSimple(totales, ctx, W, H, isDark, textColor, darken) {
    let filtered = Object.entries(totales).filter(([p,v]) => v > 0 && !esCoalicion(p));

    let sorted;
    if (barrasMode === 'comparativa' && barrasSeleccion.size) {
        sorted = filtered.filter(([p]) => barrasSeleccion.has(p)).sort((a,b) => b[1]-a[1]);
    } else {
        sorted = filtered.sort((a,b) => b[1]-a[1]).slice(0, barrasTop);
    }
    if (!sorted.length) return;

    const votosTotal = sorted.reduce((s,[,v]) => s+v, 0);
    const maxVal = votosTotal || 1;
    const padTop = 20, padBot = 20, padL = 130, padR = 100;
    const chartW = W - padL - padR;
    const n = sorted.length;
    const barAreaH = (H - padTop - padBot) / n;
    const barH = Math.min(barAreaH * 0.55, 60);
    const depth3d = barH * 0.22;

    _barrasHitAreas = [];

    sorted.forEach(([p, v], i) => {
        const color = COLORES[p] || '#666';
        const pct = votosTotal > 0 ? (v/votosTotal*100).toFixed(1) : '0.0';
        const barW = (v / maxVal) * chartW;
        const cy = padTop + barAreaH * i + barAreaH / 2;
        const y0 = cy - barH/2;
        const x0 = padL;
        const xEnd = padL + barW;

        const bgColor = isDark ? '#1a1a1a' : '#e8e8e8';
        const bgSide = isDark ? '#111' : '#d0d0d0';
        const bgTop = isDark ? '#222' : '#ccc';
        ctx.fillStyle = bgColor;
        ctx.fillRect(x0, y0, chartW, barH);
        ctx.fillStyle = bgTop;
        ctx.beginPath();
        ctx.moveTo(x0, y0); ctx.lineTo(x0+depth3d, y0-depth3d);
        ctx.lineTo(x0+chartW+depth3d, y0-depth3d); ctx.lineTo(x0+chartW, y0);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = bgSide;
        ctx.beginPath();
        ctx.moveTo(x0+chartW, y0); ctx.lineTo(x0+chartW+depth3d, y0-depth3d);
        ctx.lineTo(x0+chartW+depth3d, y0+barH-depth3d); ctx.lineTo(x0+chartW, y0+barH);
        ctx.closePath(); ctx.fill();

        ctx.fillStyle = color;
        ctx.fillRect(x0, y0, barW, barH);

        ctx.fillStyle = darken(color, 60);
        ctx.beginPath();
        ctx.moveTo(x0+barW, y0); ctx.lineTo(x0+barW+depth3d, y0-depth3d);
        ctx.lineTo(x0+barW+depth3d, y0+barH-depth3d); ctx.lineTo(x0+barW, y0+barH);
        ctx.closePath(); ctx.fill();

        const topColor = isDark ? '#2a2d3a' : '#3a3d4a';
        ctx.fillStyle = topColor;
        ctx.beginPath();
        ctx.moveTo(x0, y0); ctx.lineTo(x0+depth3d, y0-depth3d);
        ctx.lineTo(x0+barW+depth3d, y0-depth3d); ctx.lineTo(x0+barW, y0);
        ctx.closePath(); ctx.fill();

        if (barW > 80) {
            ctx.font = `bold ${Math.max(12, barH*0.35)}px Barlow, sans-serif`;
            ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
            ctx.fillStyle = '#fff';
            ctx.fillText(pct + '%', x0 + 10, cy);
        }

        ctx.fillStyle = textColor;
        ctx.font = `600 ${Math.max(10, barH*0.22)}px Barlow, sans-serif`;
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(fmtNum(v), xEnd + depth3d + 6, cy - depth3d/2);

        ctx.fillStyle = textColor;
        ctx.font = `500 ${Math.max(10, barH*0.28)}px Barlow, sans-serif`;
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(p.replace(/_/g,'-'), padL - 8, cy);

        _barrasHitAreas.push({ x: x0, y: y0, w: barW, h: barH, partido: p, votos: v, pct });
    });
}

function renderBarrasCoalicion(datos, cols, totales, ctx, W, H, isDark, textColor, darken) {
    const groups = buildCoalitionGroups(cols);
    let coalitionData = Object.entries(groups)
        .filter(([key, columns]) => columns.length > 1)
        .map(([key, columns]) => {
            const segments = columns.map(col => ({ col, votos: totales[col] || 0 }))
                .filter(s => s.votos > 0)
                .sort((a, b) => b.votos - a.votos);
            const total = segments.reduce((s, seg) => s + seg.votos, 0);
            return { key, segments, total };
        })
        .filter(g => g.total > 0)
        .sort((a, b) => b.total - a.total);

    if (barrasMode === 'comparativa' && barrasSeleccion.size) {
        coalitionData = coalitionData.filter(g => barrasSeleccion.has(g.key));
    } else {
        coalitionData = coalitionData.slice(0, barrasTop);
    }
    if (!coalitionData.length) return;

    const maxVal = Object.values(totales).reduce((a, b) => a + b, 0) || 1;
    const padTop = 20, padBot = 20, padL = 150, padR = 100;
    const chartW = W - padL - padR;
    const n = coalitionData.length;
    const barAreaH = (H - padTop - padBot) / n;
    const barH = Math.min(barAreaH * 0.55, 60);
    const depth3d = barH * 0.22;

    const legendItems = [];
    const legendSeen = new Set();

    _barrasHitAreas = [];

    coalitionData.forEach((group, i) => {
        const cy = padTop + barAreaH * i + barAreaH / 2;
        const y0 = cy - barH / 2;
        const x0 = padL;
        const totalBarW = (group.total / maxVal) * chartW;

        const bgColor = isDark ? '#1a1a1a' : '#e8e8e8';
        const bgSide = isDark ? '#111' : '#d0d0d0';
        const bgTop = isDark ? '#222' : '#ccc';
        ctx.fillStyle = bgColor;
        ctx.fillRect(x0, y0, chartW, barH);
        ctx.fillStyle = bgTop;
        ctx.beginPath();
        ctx.moveTo(x0, y0); ctx.lineTo(x0+depth3d, y0-depth3d);
        ctx.lineTo(x0+chartW+depth3d, y0-depth3d); ctx.lineTo(x0+chartW, y0);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = bgSide;
        ctx.beginPath();
        ctx.moveTo(x0+chartW, y0); ctx.lineTo(x0+chartW+depth3d, y0-depth3d);
        ctx.lineTo(x0+chartW+depth3d, y0+barH-depth3d); ctx.lineTo(x0+chartW, y0+barH);
        ctx.closePath(); ctx.fill();

        let xOffset = x0;
        group.segments.forEach((seg, si) => {
            const segW = (seg.votos / maxVal) * chartW;
            const color = COLORES[seg.col] || '#666';

            ctx.fillStyle = color;
            ctx.fillRect(xOffset, y0, segW, barH);

            ctx.fillStyle = darken(color, 60);
            ctx.beginPath();
            ctx.moveTo(xOffset+segW, y0); ctx.lineTo(xOffset+segW+depth3d, y0-depth3d);
            ctx.lineTo(xOffset+segW+depth3d, y0+barH-depth3d); ctx.lineTo(xOffset+segW, y0+barH);
            ctx.closePath(); ctx.fill();

            if (si === 0 && segW > 30) {
                const label = seg.col.replace(/^P_|^CC_/, '').replace(/_/g,'-');
                ctx.fillStyle = '#fff';
                ctx.font = `bold ${Math.max(9, Math.min(12, barH * 0.35))}px Barlow, sans-serif`;
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.fillText(label, xOffset + segW / 2, cy);
            }

            if (!legendSeen.has(seg.col)) {
                legendSeen.add(seg.col);
                legendItems.push({ col: seg.col, color });
            }

            _barrasHitAreas.push({ x: xOffset, y: y0, w: segW, h: barH, partido: seg.col, votos: seg.votos, pct: (seg.votos/group.total*100).toFixed(1), coalition: group.key });

            xOffset += segW;
        });

        const topColor = isDark ? '#2a2d3a' : '#3a3d4a';
        ctx.fillStyle = topColor;
        ctx.beginPath();
        ctx.moveTo(x0, y0); ctx.lineTo(x0+depth3d, y0-depth3d);
        ctx.lineTo(x0+totalBarW+depth3d, y0-depth3d); ctx.lineTo(x0+totalBarW, y0);
        ctx.closePath(); ctx.fill();

        ctx.fillStyle = textColor;
        ctx.font = `600 ${Math.max(10, barH*0.22)}px Barlow, sans-serif`;
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(fmtNum(group.total), x0 + totalBarW + depth3d + 6, cy - depth3d/2);

        ctx.fillStyle = textColor;
        ctx.font = `500 ${Math.max(10, barH*0.28)}px Barlow, sans-serif`;
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        const displayName = group.key.replace(/^P_|^CC_/, '').replace(/_/g, '-');
        ctx.fillText(displayName, padL - 8, cy);
    });
}

// Chart controls - Top / Comparativa pattern
let barrasMode = 'top';
let barrasSeleccion = new Set();
let barrasSelTmp = new Set();

const barrasTopN = document.getElementById('barras-top-n');
const barrasModal = document.getElementById('modal-barras-partidos');
const barrasChecks = document.getElementById('modal-barras-checks');

function setActiveBtn(btn, parentClass) {
    btn.closest('.'+parentClass)?.querySelectorAll('.vt-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// Individual / Coalición toggle
document.getElementById('btn-vista-individual').addEventListener('click', function() { barrasVista='individual'; setActiveBtn(this,'chart-controls-left'); renderBarras(getDatosFiltrados(), colsActuales); });
document.getElementById('btn-vista-coalicion').addEventListener('click', function() { barrasVista='coalicion'; setActiveBtn(this,'chart-controls-left'); renderBarras(getDatosFiltrados(), colsActuales); });

// Top button
document.getElementById('btn-barras-top').addEventListener('click', function() {
    barrasMode = 'top'; setActiveBtn(this,'chart-controls-right');
    barrasTopN.style.display = '';
    barrasTop = +barrasTopN.value;
    renderBarras(getDatosFiltrados(), colsActuales);
});
barrasTopN.addEventListener('change', () => { if (barrasMode==='top') { barrasTop=+barrasTopN.value; renderBarras(getDatosFiltrados(), colsActuales); } });

// Comparativa button -> open modal
document.getElementById('btn-barras-comp').addEventListener('click', function() {
    barrasMode = 'comparativa'; setActiveBtn(this,'chart-controls-right');
    barrasTopN.style.display = 'none';
    openBarrasModal();
});

function getBarrasKeys() {
    const datos = getDatosFiltrados(), cols = colsActuales;
    const totales = {};
    cols.partidos.forEach(p => { totales[p] = 0; });
    datos.forEach(r => cols.partidos.forEach(p => { totales[p] += parseNum(r[p]); }));
    if (barrasVista === 'individual') {
        return Object.entries(totales).filter(([p,v]) => v > 0 && !esCoalicion(p)).sort((a,b)=>b[1]-a[1]).map(([p])=>p);
    }
    // Coalición mode: return coalition group keys
    const groups = buildCoalitionGroups(cols);
    return Object.entries(groups)
        .filter(([key, columns]) => columns.length > 1)
        .map(([key, columns]) => ({ key, total: columns.reduce((s, col) => s + (totales[col] || 0), 0) }))
        .filter(g => g.total > 0)
        .sort((a, b) => b.total - a.total)
        .map(g => g.key);
}

function openBarrasModal() {
    const allKeys = getBarrasKeys();
    barrasSelTmp = new Set(barrasSeleccion.size ? barrasSeleccion : allKeys.slice(0,5));
    buildBarrasChecks(allKeys);
    barrasModal.removeAttribute('hidden');
}
function closeBarrasModal() { barrasModal.setAttribute('hidden',''); }

function buildBarrasChecks(allKeys) {
    barrasChecks.innerHTML = allKeys.map(k => `<label class="rng-opt"><input type="checkbox" value="${k}" ${barrasSelTmp.has(k)?'checked':''}><span>${k.replace(/_/g,'-')}</span></label>`).join('');
    barrasChecks.querySelectorAll('input[type=checkbox]').forEach(cb => cb.addEventListener('change', () => { cb.checked ? barrasSelTmp.add(cb.value) : barrasSelTmp.delete(cb.value); }));
}

barrasModal?.addEventListener('click', e => { if (e.target === barrasModal) closeBarrasModal(); });
barrasModal?.querySelector('.rng-modal-close')?.addEventListener('click', closeBarrasModal);
barrasModal?.querySelector('.rng-cancel-btn')?.addEventListener('click', closeBarrasModal);
barrasModal?.querySelector('[data-action="all"]')?.addEventListener('click', () => { const allKeys = getBarrasKeys(); allKeys.forEach(k => barrasSelTmp.add(k)); barrasChecks.querySelectorAll('input').forEach(cb => cb.checked=true); });
barrasModal?.querySelector('[data-action="none"]')?.addEventListener('click', () => { barrasSelTmp.clear(); barrasChecks.querySelectorAll('input').forEach(cb => cb.checked=false); });
barrasModal?.querySelector('.rng-apply-btn')?.addEventListener('click', () => {
    barrasSeleccion = new Set(barrasSelTmp);
    closeBarrasModal();
    barrasTop = barrasSeleccion.size || 5;
    renderBarras(getDatosFiltrados(), colsActuales);
});

// ── Comparativo Histórico ──
const historicoCache = {};
async function renderHistorico() {
    const container = document.getElementById('chart-historico');
    if (!container) return;
    Plotly.purge(container);
    container.innerHTML = '';
    const tipo = elElec.value;
    const anioActual = elAnio.value;
    const aniosDisponibles = Object.keys(ARCHIVOS[tipo] || {}).sort();
    if (aniosDisponibles.length < 2) {
        container.innerHTML = '<p style="padding:1rem;color:var(--text-muted)">No hay datos históricos disponibles para este tipo de elección.</p>';
        return;
    }

    // Partidos individuales que existen en al menos un año
    const partidosComunes = ['PAN', 'PRI', 'PRD', 'PVEM', 'PT', 'MC', 'MORENA'];

    // Load data for all years (reuse current year from datosActuales)
    const datosPorAnio = {};
    for (const anio of aniosDisponibles) {
        if (anio === anioActual) {
            datosPorAnio[anio] = datosActuales;
        } else {
            const cacheKey = `${tipo}_${anio}`;
            if (!historicoCache[cacheKey]) {
                historicoCache[cacheKey] = await cargarCSV(ARCHIVOS[tipo][anio]);
            }
            datosPorAnio[anio] = historicoCache[cacheKey];
        }
    }

    // For each year, filter by municipio/distrito and sección
    const series = {};
    partidosComunes.forEach(p => { series[p] = []; });

    aniosDisponibles.forEach(anio => {
        const cols = COL_MAP[tipo][anio];
        let datos = datosPorAnio[anio];

        // Filter by municipio/distrito
        if (selMunicipios.size) {
            datos = datos.filter(r => selMunicipios.has(normStr(r[cols.municipio])));
        }
        // Filter by sección
        if (selSecciones.size) {
            datos = datos.filter(r => selSecciones.has(String(r[cols.seccion])));
        }

        partidosComunes.forEach(p => {
            const colName = cols.partidos.find(c => c === p);
            if (colName && datos.length) {
                const total = datos.reduce((s, r) => s + parseNum(r[colName]), 0);
                series[p].push(total);
            } else {
                series[p].push(null);
            }
        });
    });

    // Build Plotly traces
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const aniosNum = aniosDisponibles.map(Number);
    const traces = partidosComunes
        .filter(p => series[p].some(v => v !== null && v > 0))
        .map(p => ({
            x: aniosNum,
            y: series[p],
            name: p,
            type: 'scatter',
            mode: 'lines+markers',
            line: { color: COLORES[p] || '#666', width: 3 },
            marker: { size: aniosNum.map(a => a === +anioActual ? 14 : 7), color: COLORES[p] || '#666' },
            connectgaps: true,
            hovertemplate: '%{customdata}<extra></extra>',
            customdata: series[p].map((v, idx) => v !== null ? `${v.toLocaleString('en-US')} ${p} ${aniosDisponibles[idx]}` : '')
        }));

    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { family: 'Barlow, sans-serif', color: isDark ? '#fff' : '#222' },
        margin: { t: 30, b: 50, l: 80, r: 20 },
        xaxis: {
            tickvals: aniosNum,
            ticktext: aniosDisponibles,
            gridcolor: isDark ? '#333' : '#ddd',
            dtick: 1,
            range: [aniosNum[0] - 0.5, aniosNum[aniosNum.length - 1] + 0.5]
        },
        yaxis: {
            gridcolor: isDark ? '#333' : '#ddd',
            title: 'Votos',
            tickformat: ','
        },
        legend: { orientation: 'h', y: -0.2, x: 0.5, xanchor: 'center' },
        shapes: [{
            type: 'line',
            x0: +anioActual, x1: +anioActual,
            y0: 0, y1: 1,
            yref: 'paper',
            line: { color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)', width: 2, dash: 'dash' }
        }],
        annotations: [{
            x: +anioActual, y: 1, yref: 'paper',
            text: `${anioActual} (seleccionado)`,
            showarrow: false,
            font: { size: 11, color: isDark ? '#aaa' : '#555' },
            yshift: 10
        }]
    };

    Plotly.newPlot(container, traces, layout, { responsive: true, displayModeBar: false });
}

// ── Tabla ──
let tablaVista = 'individual';

function renderTabla(datos, cols) {
    const el = document.getElementById('tabla-secciones');
    if (!datos.length) { el.innerHTML = '<p style="padding:1rem;color:var(--text-muted)">Sin datos</p>'; return; }

    const locHeader = (elElec.value === 'diputacion_local' || elElec.value === 'diputacion_federal') ? 'Distrito' : 'Municipio';
    const thead = `<thead><tr><th>Sección</th><th>${locHeader}</th><th>Lista Nominal</th><th>Votos</th><th>Part.</th><th>1er Lugar</th><th>Votos</th><th>2do Lugar</th><th>Votos</th><th>3er Lugar</th><th>Votos</th></tr></thead>`;

    if (tablaVista === 'coalicion') {
        const groups = buildCoalitionGroups(cols);
        const coalitionGroups = Object.entries(groups).filter(([, columns]) => columns.length > 1);
        el.innerHTML = `<table class="electoral-table">
            ${thead}
            <tbody>${datos.slice(0,50).map(r => {
                const part = parseNum(r[cols.participacion]);
                const groupTotals = {};
                coalitionGroups.forEach(([key, columns]) => {
                    const total = columns.reduce((s, c) => s + parseNum(r[c]), 0);
                    if (total > 0) groupTotals[key] = total;
                });
                const top3 = Object.entries(groupTotals).sort((a,b) => b[1]-a[1]).slice(0, 3);
                const displayName = k => k.replace(/^P_|^CC_/, '').replace(/_/g,'-');
                return `<tr>
                    <td>${r[cols.seccion]}</td><td>${titleCase(r[cols.municipio])}</td>
                    <td>${fmtNum(parseNum(r[cols.listaNominal]))}</td><td>${fmtNum(parseNum(r[cols.votosEmitidos]))}</td>
                    <td>${(part<=1?part*100:part).toFixed(1)}%</td>
                    <td>${top3[0] ? `<span class="lugar-badge" style="background:${COLORES[top3[0][0]]||'#666'}">${displayName(top3[0][0])}</span>` : '-'}</td><td>${top3[0] ? fmtNum(top3[0][1]) : '-'}</td>
                    <td>${top3[1] ? `<span class="lugar-badge" style="background:${COLORES[top3[1][0]]||'#666'}">${displayName(top3[1][0])}</span>` : '-'}</td><td>${top3[1] ? fmtNum(top3[1][1]) : '-'}</td>
                    <td>${top3[2] ? `<span class="lugar-badge" style="background:${COLORES[top3[2][0]]||'#666'}">${displayName(top3[2][0])}</span>` : '-'}</td><td>${top3[2] ? fmtNum(top3[2][1]) : '-'}</td>
                </tr>`;
            }).join('')}</tbody></table>`;
    } else {
        const indivCols = cols.partidos.filter(p => !esCoalicion(p));
        el.innerHTML = `<table class="electoral-table">
            ${thead}
            <tbody>${datos.slice(0,50).map(r => {
                const part = parseNum(r[cols.participacion]);
                const top3 = indivCols.map(p => [p, parseNum(r[p])]).filter(([,v]) => v > 0).sort((a,b) => b[1]-a[1]).slice(0, 3);
                return `<tr>
                    <td>${r[cols.seccion]}</td><td>${titleCase(r[cols.municipio])}</td>
                    <td>${fmtNum(parseNum(r[cols.listaNominal]))}</td><td>${fmtNum(parseNum(r[cols.votosEmitidos]))}</td>
                    <td>${(part<=1?part*100:part).toFixed(1)}%</td>
                    <td>${top3[0] ? `<span class="lugar-badge" style="background:${COLORES[top3[0][0]]||'#666'}">${top3[0][0]}</span>` : '-'}</td><td>${top3[0] ? fmtNum(top3[0][1]) : '-'}</td>
                    <td>${top3[1] ? `<span class="lugar-badge" style="background:${COLORES[top3[1][0]]||'#666'}">${top3[1][0]}</span>` : '-'}</td><td>${top3[1] ? fmtNum(top3[1][1]) : '-'}</td>
                    <td>${top3[2] ? `<span class="lugar-badge" style="background:${COLORES[top3[2][0]]||'#666'}">${top3[2][0]}</span>` : '-'}</td><td>${top3[2] ? fmtNum(top3[2][1]) : '-'}</td>
                </tr>`;
            }).join('')}</tbody></table>`;
    }
}

document.getElementById('btn-tabla-individual').addEventListener('click', function() {
    tablaVista = 'individual';
    this.classList.add('active');
    document.getElementById('btn-tabla-coalicion').classList.remove('active');
    if (datosActuales.length && colsActuales) renderTabla(datosActuales, colsActuales);
});
document.getElementById('btn-tabla-coalicion').addEventListener('click', function() {
    tablaVista = 'coalicion';
    this.classList.add('active');
    document.getElementById('btn-tabla-individual').classList.remove('active');
    if (datosActuales.length && colsActuales) renderTabla(datosActuales, colsActuales);
});

// ── Init ──
// Mostrar botón de PINs solo para admin
(function checkAdminUI() {
    if (typeof AUTH !== 'undefined' && AUTH.isAdmin && AUTH.isAdmin()) {
        const btn = document.getElementById('btn-toggle-pin-panel');
        if (btn) btn.style.display = '';
    }
})();

initEstados();
actualizarElecciones();
cargarDatos();
