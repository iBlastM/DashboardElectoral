/* ── electoral.js ── Dashboard Electoral ── */

const ARCHIVOS = {
    ayuntamiento: { '2024': 'jsons/Ayuntamientos_2024.json', '2021': 'jsons/Ayuntamientos_2021.json', '2018': 'jsons/Ayuntamientos_2018.json' },
    gobernatura:  { '2021': 'jsons/Gubernatura_2021.json' }
};
const GEOJSON_MAP = {
    ayuntamiento: { '2024': 'geojsons/secciones_2024.geojson', '2021': 'geojsons/secciones_2021.geojson', '2018': 'geojsons/secciones_2018.geojson' },
    gobernatura:  { '2021': 'geojsons/secciones_2021.geojson' }
};
const COL_MAP = {
    ayuntamiento: {
        '2024': { municipio:'Municipio', seccion:'Seccion', listaNominal:'Lista Nominal', votosEmitidos:'Votos Emitidos', participacion:'Participacion (%)', primerLugar:'1er Lugar', votosP:'Votos', segundoLugar:'2do Lugar', votos2:'Votos.1', tercerLugar:'3er Lugar', votos3:'Votos.2', nulos:'Nulos', partidos:['PAN','PRI','PRD','PAN-PRI-PRD','PAN-PRI','PAN-PRD','PRI-PRD','PVEM','MORENA','PT','PVEM-MORENA-PT','PVEM-MORENA','PVEM-PT','MORENA-PT','MC','QS'] },
        '2021': { municipio:'MUNICIPIO', seccion:'SECCION', listaNominal:'LISTA_NOMINAL', votosEmitidos:'VOTOS_EMITIDOS', participacion:'PARTICIPACION_PCN', primerLugar:'1ER_LUGAR', votosP:'1ERO_VOTOS', segundoLugar:'2DO_LUGAR', votos2:'2DO_VOTOS', tercerLugar:'3ER_LUGAR', votos3:'3RO_VOTOS', nulos:'NULOS', partidos:['PAN','PRI','PRD','MC','PVEM','MORENA','PT','QI','PES','RSP','FXM','PAN_PRD_QI','PAN_PRD','PAN_QI','PRD_QI','PRI_PVEM','PVEM_PT','PT_QI'] },
        '2018': { municipio:'MUNICIPIO', seccion:'SECCION', listaNominal:'LISTA_NOMINAL', votosEmitidos:'VOTOS_EMITIDOS', participacion:'PARTICIPACION_PCN', primerLugar:'1ER_LUGAR', votosP:'1ERO_VOTOS', segundoLugar:'2DO_LUGAR', votos2:'2DO_VOTOS', tercerLugar:'3ER_LUGAR', votos3:'3RO_VOTOS', nulos:'NULOS', partidos:['PAN','PRI','PRD','MC','NA','PVEM','ES','MORENA','PT','CQ','QI','PAN_PRD_MC','PAN_PRD','PAN_MC','PRD_MC','PRI_PVEM','MORENA_PT_PES','MORENA_PT','MORENA_PES','PT_PES'] }
    },
    gobernatura: {
        '2021': { municipio:'MUNICIPIO', seccion:'SECCION', listaNominal:'LISTA_NOMINAL', votosEmitidos:'VOTOS_EMITIDOS', participacion:'PARTICIPACION', primerLugar:'1ER_LUGAR', votosP:'1ERO_VOTOS', segundoLugar:'2DO_LUGAR', votos2:'2DO_VOTOS', tercerLugar:'3ER_LUGAR', votos3:'3RO_VOTOS', nulos:'NULOS', partidos:['PAN','PRI','PRD','MC','PVEM','MORENA','PT','QI','PES','RSP','FxM','PAN_QI'] }
    }
};
const ELECCIONES_POR_ANIO = { '2024':['ayuntamiento'], '2021':['ayuntamiento','gobernatura'], '2018':['ayuntamiento'] };
const ESTADOS_MX = ['Aguascalientes','Baja California','Baja California Sur','Campeche','Chiapas','Chihuahua','Ciudad de México','Coahuila','Colima','Durango','Estado de México','Guanajuato','Guerrero','Hidalgo','Jalisco','Michoacán','Morelos','Nayarit','Nuevo León','Oaxaca','Puebla','Querétaro','Quintana Roo','San Luis Potosí','Sinaloa','Sonora','Tabasco','Tamaulipas','Tlaxcala','Veracruz','Yucatán','Zacatecas'];

const COLORES = {
    'PAN':'#0057B8','PRI':'#C4161C','PRD':'#FFD700','MORENA':'#8B1A1A','PT':'#FF0000',
    'PVEM':'#00A651','MC':'#FF8C00','QI':'#E0218A','PES':'#7B2D8B','RSP':'#FF8080',
    'FXM':'#FF69B4','FxM':'#FF69B4','NA':'#00BCD4','ES':'#7B2D8B','CQ':'#E0218A','QS':'#E0218A',
    'PAN-PRI-PRD':'#0057B8','PAN-PRI':'#0057B8','PAN-PRD':'#0057B8','PRI-PRD':'#C4161C',
    'PVEM-MORENA-PT':'#8B1A1A','PVEM-MORENA':'#8B1A1A','PVEM-PT':'#00A651','MORENA-PT':'#8B1A1A',
    'PAN_PRD_QI':'#0057B8','PAN_PRD':'#0057B8','PAN_QI':'#0057B8','PRD_QI':'#FFD700',
    'PRI_PVEM':'#C4161C','PVEM_PT':'#00A651','PT_QI':'#FF0000',
    'PAN_PRD_MC':'#0057B8','PAN_MC':'#0057B8','PRD_MC':'#FFD700',
    'MORENA_PT_PES':'#8B1A1A','MORENA_PT':'#8B1A1A','MORENA_PES':'#8B1A1A','PT_PES':'#FF0000'
};
// Partidos individuales (no coaliciones)
const PARTIDOS_INDIVIDUALES = ['PAN','PRI','MC','MORENA','PVEM','PT'];
const PARTIDOS_IND = ['QI','CQ','QS']; // independientes

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
    const carpeta = MUNICIPIO_CARPETA_2021[municipio] || municipio;
    const archivo = FOTO_EXCEPCIONES_2021[nombre] || `${nombre}.jpg`;
    return `images/candidatos/2021/Ayuntamientos/${carpeta}/${archivo}`;
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
    elElec.innerHTML = elecciones.map(e => `<option value="${e}">${e==='ayuntamiento'?'Ayuntamiento':'Gobernatura'}</option>`).join('');
}

function actualizarMunicipios() {
    selMunicipios.clear(); selSecciones.clear();
    const tipo = elElec.value;
    const munsRaw = [...new Set(datosActuales.map(r => r[colsActuales.municipio]).filter(Boolean))].sort();
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

    // Fallback if no candidatos data
    if (!top3 || !top3.length) {
        const groups = {};
        cols.partidos.forEach(col => {
            const base = col.replace(/-/g,'_').split('_')[0];
            if (!groups[base]) groups[base] = [];
            groups[base].push(col);
        });
        top3 = Object.entries(groups).map(([base, columns]) => {
            const votos = columns.reduce((s, col) => s + datos.reduce((ss, r) => ss + parseNum(r[col]), 0), 0);
            const mainCol = columns.reduce((best, col) => {
                const v = datos.reduce((ss, r) => ss + parseNum(r[col]), 0);
                return v > best[1] ? [col, v] : best;
            }, ['', 0])[0];
            return { nombre: base, votos, mainCol, columnas: columns };
        }).filter(c => c.votos > 0).sort((a, b) => b.votos - a.votos).slice(0, 3);
    }

    document.getElementById('top-ganadores').innerHTML = top3.map((c, i) => {
        const pct = totalVotos > 0 ? (c.votos / totalVotos * 100).toFixed(1) : 0;
        const iconosHtml = iconosPartido(c.mainCol, 40);
        const color = COLORES[c.mainCol] || '#666';
        const foto = anio === '2021' ? getFotoCandidato2021(c.nombre, tipo, c.municipio) : null;
        const fotoHtml = foto
            ? `<div class="candidato-foto-wrap"><img src="${foto}" class="candidato-foto-img" alt="${titleCase(c.nombre)}" onerror="this.parentElement.innerHTML='<div class=\\'candidato-foto-placeholder\\'><span class=\\'candidato-foto-num\\'>${i+1}°</span></div>'"><span class="candidato-foto-num-overlay">${i + 1}°</span></div>`
            : `<div class="candidato-foto-wrap"><div class="candidato-foto-placeholder"><span class="candidato-foto-num">${i + 1}°</span></div></div>`;
        return `<div class="candidato-card">
            ${fotoHtml}
            <div class="candidato-partido-icons">${iconosHtml}</div>
            <div class="candidato-nombre"><b>${titleCase(c.nombre)}</b></div>
            <div class="candidato-partido-label">${(() => { const coaliciones = c.columnas.filter(p => p.includes('_')); const enCoalicion = new Set(coaliciones.flatMap(p => p.split('_'))); return c.columnas.filter(p => p.includes('_') || !enCoalicion.has(p)).map(p => p.replace(/_/g, '-')).join(' + '); })()}</div>
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
let geoData = null, geoMunicipios = null;
document.getElementById('mapa-vista').addEventListener('change', actualizarMapa);

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
            }
        }
    });
}


// ── Distribución de Votos: 3D bars ──
function renderBarras(datos, cols) {
    const totales = {};
    cols.partidos.forEach(p => { totales[p] = 0; });
    datos.forEach(r => cols.partidos.forEach(p => { totales[p] += parseNum(r[p]); }));

    let filtered;
    if (barrasVista === 'individual') {
        filtered = Object.entries(totales).filter(([p,v]) => v > 0 && !esCoalicion(p));
    } else {
        filtered = Object.entries(totales).filter(([p,v]) => v > 0 && esCoalicion(p));
    }

    let sorted;
    if (barrasMode === 'comparativa' && barrasSeleccion.size) {
        sorted = filtered.filter(([p]) => barrasSeleccion.has(p)).sort((a,b) => b[1]-a[1]);
    } else {
        sorted = filtered.sort((a,b) => b[1]-a[1]).slice(0, barrasTop);
    }
    const votosTotal = sorted.reduce((s,[,v]) => s+v, 0);

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const textColor = isDark ? '#fff' : '#222';

    const x = sorted.map(([p]) => p.replace(/_/g,'-'));
    const y = sorted.map(([,v]) => v);
    const pcts = sorted.map(([,v]) => votosTotal > 0 ? (v/votosTotal*100).toFixed(1)+'%' : '0%');

    // Annotations: vote count on top, % in center
    const annotations = sorted.map(([p,v], i) => [
        { x: x[i], y: v, text: `<b>${fmtNum(v)}</b>`, showarrow:false, font:{size:11, color:textColor}, yshift:12 },
        { x: x[i], y: v/2, text: pcts[i], showarrow:false, font:{size:13, color:'#fff', family:'Barlow'} }
    ]).flat();

    // Measurement lines between bars (difference annotations)
    const shapes = [];
    for (let i = 0; i < sorted.length - 1; i++) {
        const diff = sorted[i][1] - sorted[i+1][1];
        const diffPct = votosTotal > 0 ? (diff/votosTotal*100).toFixed(1) : 0;
        annotations.push({
            x: x[i], y: Math.max(sorted[i][1], sorted[i+1][1]) + sorted[0][1]*0.08,
            ax: x[i+1], ay: Math.max(sorted[i][1], sorted[i+1][1]) + sorted[0][1]*0.08,
            xref:'x', yref:'y', axref:'x', ayref:'y',
            showarrow:true, arrowhead:0, arrowsize:1, arrowwidth:1,
            arrowcolor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
            text: `Δ ${fmtNum(diff)} (${diffPct}%)`, font:{size:9, color: isDark?'#aaa':'#555'}
        });
    }

    Plotly.react('chart-barras', [{
        x, y, type:'bar',
        marker:{ color: sorted.map(([p]) => COLORES[p]||'#666'), line:{width:1, color:'rgba(255,255,255,0.2)'} },
        text: pcts, textposition:'none',
        hovertemplate: '<b>%{x}</b><br>Votos: %{y:,}<br>%{text}<extra></extra>'
    }], {
        scene:{ xaxis:{}, yaxis:{}, zaxis:{} },
        paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)',
        font:{ color:textColor, family:'Barlow' },
        margin:{ t:40, b:70, l:60, r:20 },
        xaxis:{ tickangle:-30, tickfont:{size:11, family:'Barlow', color:textColor} },
        yaxis:{ gridcolor: isDark?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.08)' },
        annotations, shapes,
        bargap: 0.3
    }, { responsive:true, displayModeBar:false });
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
    return Object.entries(totales).filter(([p,v]) => v > 0 && (barrasVista==='individual' ? !esCoalicion(p) : esCoalicion(p))).sort((a,b)=>b[1]-a[1]).map(([p])=>p);
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

// ── Tabla ──
function renderTabla(datos, cols) {
    const el = document.getElementById('tabla-secciones');
    if (!datos.length) { el.innerHTML = '<p style="padding:1rem;color:var(--text-muted)">Sin datos</p>'; return; }
    el.innerHTML = `<table class="electoral-table">
        <thead><tr><th>Sección</th><th>Municipio</th><th>Lista Nominal</th><th>Votos</th><th>Part.</th><th>1er Lugar</th><th>Votos</th><th>2do Lugar</th><th>Votos</th><th>3er Lugar</th><th>Votos</th></tr></thead>
        <tbody>${datos.slice(0,50).map(r => {
            const part = parseNum(r[cols.participacion]);
            return `<tr>
                <td>${r[cols.seccion]}</td><td>${titleCase(r[cols.municipio])}</td>
                <td>${fmtNum(parseNum(r[cols.listaNominal]))}</td><td>${fmtNum(parseNum(r[cols.votosEmitidos]))}</td>
                <td>${(part<=1?part*100:part).toFixed(1)}%</td>
                <td><span class="lugar-badge" style="background:${COLORES[r[cols.primerLugar]]||'#666'}">${r[cols.primerLugar]||'-'}</span></td><td>${fmtNum(parseNum(r[cols.votosP]))}</td>
                <td><span class="lugar-badge" style="background:${COLORES[r[cols.segundoLugar]]||'#666'}">${r[cols.segundoLugar]||'-'}</span></td><td>${fmtNum(parseNum(r[cols.votos2]))}</td>
                <td><span class="lugar-badge" style="background:${COLORES[r[cols.tercerLugar]]||'#666'}">${r[cols.tercerLugar]||'-'}</span></td><td>${fmtNum(parseNum(r[cols.votos3]))}</td>
            </tr>`;
        }).join('')}</tbody></table>`;
}

// ── Init ──
initEstados();
actualizarElecciones();
cargarDatos();
