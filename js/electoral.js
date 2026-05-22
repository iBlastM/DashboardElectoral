/* ── electoral.js ── Dashboard Electoral Querétaro ── */

const ARCHIVOS = {
    ayuntamiento: { '2024': 'data/Ayuntamientos_2024.csv', '2021': 'data/Ayuntamientos_2021.csv', '2018': 'data/Ayuntamientos_2018.csv' },
    gobernatura:  { '2021': 'data/Gubernatura_2021.csv' }
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

const COLORES = {
    'PAN':'#0057B8','PRI':'#C4161C','PRD':'#FFD700','MORENA':'#8B1A1A','PT':'#FF0000',
    'PVEM':'#00A651','MC':'#FF8C00','QI':'#6B3FA0','PES':'#7B2D8B','RSP':'#E91E63',
    'FXM':'#FF69B4','FxM':'#FF69B4','NA':'#00BCD4','ES':'#7B2D8B','CQ':'#795548','QS':'#9C27B0',
    'RHR':'#607D8B',
    'PAN-PRI-PRD':'#0057B8','PAN-PRI':'#0057B8','PAN-PRD':'#0057B8','PRI-PRD':'#C4161C',
    'PVEM-MORENA-PT':'#8B1A1A','PVEM-MORENA':'#8B1A1A','PVEM-PT':'#00A651','MORENA-PT':'#8B1A1A',
    'PAN_PRD_QI':'#0057B8','PAN_PRD':'#0057B8','PAN_QI':'#0057B8','PRD_QI':'#FFD700',
    'PRI_PVEM':'#C4161C','PVEM_PT':'#00A651','PT_QI':'#FF0000',
    'PAN_PRD_MC':'#0057B8','PAN_MC':'#0057B8','PRD_MC':'#FFD700',
    'MORENA_PT_PES':'#8B1A1A','MORENA_PT':'#8B1A1A','MORENA_PES':'#8B1A1A','PT_PES':'#FF0000'
};

// Partidos con imagen disponible
const ICONOS = { 'PAN':'images/partidos/pan.png','PRI':'images/partidos/pri.png','PRD':'images/partidos/prd.png','MORENA':'images/partidos/morena.png','PT':'images/partidos/pt.png','PVEM':'images/partidos/pvem.png','MC':'images/partidos/mc.png' };

let datosActuales = [], colsActuales = null, geoCache = {};

// ── Utilidades ──
const parseNum = v => parseFloat(String(v ?? '').replace(/,/g,'').trim()) || 0;
function fmtNum(n) { return n.toLocaleString('en-US'); }
function normStr(s) { return (s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().trim(); }

// Devuelve HTML de iconos para un partido (simple o coalición)
function iconosPartido(partido, size = 32) {
    const partes = partido.replace(/_/g,'-').split('-').filter(p => ICONOS[p]);
    if (ICONOS[partido]) return `<img src="${ICONOS[partido]}" class="p-icon" style="width:${size}px;height:${size}px;">`;
    if (partes.length) return partes.map(p => `<img src="${ICONOS[p]}" class="p-icon" style="width:${size}px;height:${size}px;">`).join('');
    const color = COLORES[partido] || '#666';
    return `<span class="p-icon-dot" style="background:${color};width:${size}px;height:${size}px;"></span>`;
}

// ── CSV ──
async function cargarCSV(url) {
    const text = await (await fetch(url)).text();
    const lines = text.split('\n').filter(l => l.trim());
    const headers = parseCSVLine(lines[0]);
    return lines.slice(1).map(line => {
        const vals = parseCSVLine(line), obj = {};
        headers.forEach((h,i) => obj[h] = vals[i] || '');
        return obj;
    });
}
function parseCSVLine(line) {
    const r = []; let cur = '', q = false;
    for (const ch of line) {
        if (ch === '"') q = !q;
        else if (ch === ',' && !q) { r.push(cur.trim()); cur = ''; }
        else cur += ch;
    }
    r.push(cur.trim()); return r;
}

// ── Filtros ──
const elAnio = document.getElementById('filtro-anio');
const elElec = document.getElementById('filtro-eleccion');
const elMun  = document.getElementById('filtro-municipio');
const elSec  = document.getElementById('filtro-seccion');

elAnio.addEventListener('change', cargarDatos);
elElec.addEventListener('change', () => { actualizarAnios(); cargarDatos(); });
elMun.addEventListener('change', () => { actualizarSecciones(); renderDashboard(); });
elSec.addEventListener('change', renderDashboard);
document.getElementById('filtro-limpiar').addEventListener('click', () => {
    elElec.value = 'ayuntamiento'; actualizarAnios();
    elMun.value = ''; elSec.value = ''; cargarDatos();
});

function actualizarAnios() {
    const anios = Object.keys(ARCHIVOS[elElec.value]);
    elAnio.innerHTML = anios.map(a => `<option value="${a}">${a}</option>`).join('');
    if (!anios.includes(elAnio.value)) elAnio.value = anios[0];
}
function actualizarMunicipios() {
    const muns = [...new Set(datosActuales.map(r => r[colsActuales.municipio]).filter(Boolean))].sort();
    elMun.innerHTML = '<option value="">Todos</option>' + muns.map(m => `<option value="${m}">${m}</option>`).join('');
    elMun.value = ''; actualizarSecciones();
}
function actualizarSecciones() {
    const secs = [...new Set(getDatosFiltrados(true).map(r => r[colsActuales.seccion]).filter(Boolean))].sort((a,b) => parseNum(a)-parseNum(b));
    elSec.innerHTML = '<option value="">Todas</option>' + secs.map(s => `<option value="${s}">${s}</option>`).join('');
    elSec.value = '';
}
function getDatosFiltrados(soloMun = false) {
    let d = datosActuales;
    if (elMun.value) d = d.filter(r => r[colsActuales.municipio] === elMun.value);
    if (!soloMun && elSec.value) d = d.filter(r => String(r[colsActuales.seccion]) === elSec.value);
    return d;
}

// ── Carga ──
async function cargarDatos() {
    const tipo = elElec.value, anio = elAnio.value;
    colsActuales = COL_MAP[tipo][anio];
    datosActuales = await cargarCSV(ARCHIVOS[tipo][anio]);
    actualizarMunicipios();
    renderDashboard();
    cargarMapa();
}

// ── Render ──
function renderDashboard() {
    const datos = getDatosFiltrados(), cols = colsActuales;
    document.getElementById('dashboard-subtitle').textContent =
        `${elElec.value === 'ayuntamiento' ? 'Ayuntamiento' : 'Gobernatura'} - Querétaro, ${elAnio.value}`;

    const listaNominal  = datos.reduce((s,r) => s + parseNum(r[cols.listaNominal]), 0);
    const votosEmitidos = datos.reduce((s,r) => s + parseNum(r[cols.votosEmitidos]), 0);
    const nulos         = datos.reduce((s,r) => s + parseNum(r[cols.nulos]), 0);
    const participacion = listaNominal > 0 ? (votosEmitidos / listaNominal * 100) : 0;

    document.getElementById('kpi-lista-nominal').textContent  = fmtNum(listaNominal);
    document.getElementById('kpi-votos-emitidos').textContent = fmtNum(votosEmitidos);
    document.getElementById('kpi-votos-nulos').textContent    = fmtNum(nulos);
    document.getElementById('kpi-participacion').textContent  = participacion.toFixed(2) + '%';

    renderTop3(datos, cols);
    renderPartidos(datos, cols);
    renderBarras(datos, cols);
    renderTabla(datos, cols);
    actualizarMapa();
}
window.renderDashboard = renderDashboard;

// ── Top 3 Candidatos ──
function renderTop3(datos, cols) {
    const votosPorPartido = {};
    datos.forEach(r => {
        const p = r[cols.primerLugar]; if (!p) return;
        votosPorPartido[p] = (votosPorPartido[p] || 0) + parseNum(r[cols.votosP]);
    });
    const totalVotos = datos.reduce((s,r) => s + parseNum(r[cols.votosEmitidos]), 0);
    const top3 = Object.entries(votosPorPartido).sort((a,b) => b[1]-a[1]).slice(0,3);

    document.getElementById('top-ganadores').innerHTML = top3.map(([partido, votos], i) => {
        const pct = totalVotos > 0 ? (votos/totalVotos*100).toFixed(0) : 0;
        const color = COLORES[partido] || '#666';
        const iconosHtml = iconosPartido(partido, 40);
        const nombrePartido = partido.replace(/_/g,'-');
        return `<div class="candidato-card">
            <div class="candidato-foto-wrap">
                <div class="candidato-foto-placeholder">
                    <span class="candidato-foto-num">${i+1}°</span>
                </div>
            </div>
            <div class="candidato-partido-icons">${iconosHtml}</div>
            <div class="candidato-partido-label">${nombrePartido}</div>
            <div class="candidato-stat-row">
                <span class="candidato-stat-label">VOTOS:</span>
                <span class="candidato-stat-val">${fmtNum(votos)}</span>
            </div>
            <div class="candidato-stat-row">
                <span class="candidato-stat-label">PORCENTAJE:</span>
                <span class="candidato-stat-val">${pct}%</span>
            </div>
            <div class="candidato-accent" style="background:${color}"></div>
        </div>`;
    }).join('');
}

// ── Partidos ──
function renderPartidos(datos, cols) {
    const totales = {};
    cols.partidos.forEach(p => { totales[p] = 0; });
    datos.forEach(r => cols.partidos.forEach(p => { totales[p] += parseNum(r[p]); }));

    const votosTotal = Object.values(totales).reduce((a,b) => a+b, 0);
    const sorted = Object.entries(totales).filter(([,v]) => v > 0).sort((a,b) => b[1]-a[1]);

    // Separar los que tienen imagen (o son coalición de partidos con imagen) de "Otros"
    const conIcono = [], otros = [];
    sorted.forEach(([p, v]) => {
        const tieneIcono = !!ICONOS[p] || p.replace(/_/g,'-').split('-').some(k => ICONOS[k]);
        if (tieneIcono) conIcono.push([p, v]);
        else otros.push([p, v]);
    });

    const votosOtros = otros.reduce((s,[,v]) => s+v, 0);
    const items = conIcono.slice(0, 8);
    if (votosOtros > 0) items.push(['OTROS', votosOtros]);

    document.getElementById('partidos-grid').innerHTML = items.map(([partido, votos]) => {
        const pct = votosTotal > 0 ? (votos/votosTotal*100).toFixed(1) : 0;
        const color = COLORES[partido] || '#888';
        const iconosHtml = partido === 'OTROS'
            ? `<span class="p-icon-dot" style="background:#888;width:28px;height:28px;"></span>`
            : iconosPartido(partido, 28);
        return `<div class="partido-card-v2">
            <div class="partido-card-header">${iconosHtml}<span class="partido-card-name">${partido.replace(/_/g,'-')}</span></div>
            <div class="partido-card-votos">${fmtNum(votos)}</div>
            <div class="partido-bar-wrap"><div class="partido-bar" style="width:${pct}%;background:${color}"></div></div>
            <span class="partido-pct">${pct}%</span>
        </div>`;
    }).join('');
}

// ── Mapa Plotly ──
let geoData = null, geoMunicipios = null;

document.getElementById('mapa-vista').addEventListener('change', actualizarMapa);

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

function actualizarMapa() {
    if (!geoData || !colsActuales) return;
    const vista = document.getElementById('mapa-vista').value;
    const datos = getDatosFiltrados();
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const bg = isDark ? '#0d0d0d' : '#f4f4f7';

    // Lookup sección -> partido ganador
    const lookupSec = {};
    datos.forEach(r => { lookupSec[String(parseInt(r[colsActuales.seccion]) || 0)] = r[colsActuales.primerLugar]; });

    let geo, locs, colors, texts;

    if (vista === 'municipios' && geoMunicipios) {
        // Agrupar por municipio: partido que ganó más secciones
        const munGanador = {};
        const munDatos = {};
        datosActuales.forEach(r => {
            const mun = normStr(r[colsActuales.municipio]);
            if (!munDatos[mun]) munDatos[mun] = {};
            const p = r[colsActuales.primerLugar];
            if (p) munDatos[mun][p] = (munDatos[mun][p] || 0) + 1;
        });
        Object.entries(munDatos).forEach(([mun, partidos]) => {
            munGanador[mun] = Object.entries(partidos).sort((a,b) => b[1]-a[1])[0]?.[0] || '';
        });

        // Filtrar features si hay municipio seleccionado
        const munFiltro = elMun.value;
        const features = munFiltro
            ? geoMunicipios.features.filter(f => normStr(f.properties.NOM_MUN) === normStr(munFiltro))
            : geoMunicipios.features;

        geo = { type: 'FeatureCollection', features: features.map((f,i) => ({...f, id: String(i)})) };
        locs = geo.features.map(f => f.id);
        colors = geo.features.map(f => {
            const nom = normStr(f.properties.NOM_MUN);
            const ganador = munGanador[nom] || '';
            return COLORES[ganador] || '#333';
        });
        texts = geo.features.map(f => {
            const nom = f.properties.NOM_MUN;
            const ganador = munGanador[normStr(nom)] || 'Sin datos';
            return `${nom}: ${ganador.replace(/_/g,'-')}`;
        });
    } else {
        // Vista secciones - filtrar si hay municipio/sección seleccionada
        const secsFiltradas = new Set(Object.keys(lookupSec));
        const features = secsFiltradas.size < geoData.features.length
            ? geoData.features.filter(f => secsFiltradas.has(f.id))
            : geoData.features;

        geo = { type: 'FeatureCollection', features };
        locs = features.map(f => f.id);
        colors = features.map(f => COLORES[lookupSec[f.id]] || '#333333');
        texts = features.map(f => {
            const g = lookupSec[f.id];
            return g ? `Sección ${f.id}: ${g.replace(/_/g,'-')}` : `Sección ${f.id}`;
        });
    }

    // Colorscale discreto - cada color es una banda exacta sin interpolación
    const uniqueColors = [...new Set(colors)];
    const colorMap = {}; uniqueColors.forEach((c,i) => { colorMap[c] = i; });
    const z = colors.map(c => colorMap[c]);
    const N = uniqueColors.length;
    const cscale = [];
    if (N === 1) {
        cscale.push([0, uniqueColors[0]], [1, uniqueColors[0]]);
    } else {
        uniqueColors.forEach((c, i) => {
            cscale.push([i/(N-1), c]);
        });
    }

    // Centro y zoom
    let minLat=90, maxLat=-90, minLon=180, maxLon=-180;
    geo.features.forEach(f => {
        const coords = f.geometry.type === 'MultiPolygon' ? f.geometry.coordinates.flat(2) : f.geometry.coordinates.flat(1);
        coords.forEach(([lon, lat]) => {
            if (lat < minLat) minLat = lat; if (lat > maxLat) maxLat = lat;
            if (lon < minLon) minLon = lon; if (lon > maxLon) maxLon = lon;
        });
    });
    const centerLat = (minLat+maxLat)/2, centerLon = (minLon+maxLon)/2;
    const span = Math.max(maxLat-minLat, maxLon-minLon);
    const zoom = span > 1.5 ? 6.8 : span > 0.5 ? 8.5 : span > 0.1 ? 10 : 12;

    Plotly.react('mapa-electoral', [{
        type: 'choroplethmapbox',
        geojson: geo,
        locations: locs,
        z: z,
        colorscale: cscale,
        zmin: 0, zmax: Math.max(N-1, 1),
        showscale: false,
        text: texts,
        hoverinfo: 'text',
        marker: { opacity: 0.9, line: { width: 0.3, color: isDark ? '#000' : '#aaa' } }
    }], {
        mapbox: { style: isDark ? 'carto-darkmatter' : 'carto-positron', center: { lat: centerLat, lon: centerLon }, zoom },
        paper_bgcolor: bg,
        margin: { t:0, b:0, l:0, r:0 },
        showlegend: false
    }, { responsive: true, displayModeBar: false });
}

// ── Gráfica barras ──
function renderBarras(datos, cols) {
    const totales = {};
    cols.partidos.forEach(p => { totales[p] = 0; });
    datos.forEach(r => cols.partidos.forEach(p => { totales[p] += parseNum(r[p]); }));
    const sorted = Object.entries(totales).filter(([,v]) => v > 0).sort((a,b) => b[1]-a[1]).slice(0,12);
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    Plotly.react('chart-barras', [{
        x: sorted.map(([p]) => p.replace(/_/g,'-')),
        y: sorted.map(([,v]) => v),
        type: 'bar',
        marker: { color: sorted.map(([p]) => COLORES[p] || '#666') }
    }], {
        paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)',
        font: { color: isDark ? '#fff' : '#333', family:'Barlow' },
        margin: { t:20, b:60, l:60, r:20 },
        xaxis: { tickangle:-45 },
        yaxis: { gridcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }
    }, { responsive:true, displayModeBar:false });
}

// ── Tabla ──
function renderTabla(datos, cols) {
    const el = document.getElementById('tabla-secciones');
    if (!datos.length) { el.innerHTML = '<p style="padding:1rem;color:var(--text-muted)">Sin datos</p>'; return; }
    el.innerHTML = `<table class="electoral-table">
        <thead><tr><th>Sección</th><th>Municipio</th><th>Lista Nominal</th><th>Votos</th><th>Part.</th><th>1er Lugar</th><th>Votos</th><th>2do Lugar</th><th>Votos</th><th>3er Lugar</th><th>Votos</th></tr></thead>
        <tbody>${datos.slice(0,50).map(r => {
            const part = parseNum(r[cols.participacion]);
            return `<tr>
                <td>${r[cols.seccion]}</td><td>${r[cols.municipio]}</td>
                <td>${fmtNum(parseNum(r[cols.listaNominal]))}</td><td>${fmtNum(parseNum(r[cols.votosEmitidos]))}</td>
                <td>${(part<=1?part*100:part).toFixed(1)}%</td>
                <td><span class="lugar-badge" style="background:${COLORES[r[cols.primerLugar]]||'#666'}">${r[cols.primerLugar]||'-'}</span></td><td>${fmtNum(parseNum(r[cols.votosP]))}</td>
                <td><span class="lugar-badge" style="background:${COLORES[r[cols.segundoLugar]]||'#666'}">${r[cols.segundoLugar]||'-'}</span></td><td>${fmtNum(parseNum(r[cols.votos2]))}</td>
                <td><span class="lugar-badge" style="background:${COLORES[r[cols.tercerLugar]]||'#666'}">${r[cols.tercerLugar]||'-'}</span></td><td>${fmtNum(parseNum(r[cols.votos3]))}</td>
            </tr>`;
        }).join('')}</tbody></table>`;
}

// ── Init ──
actualizarAnios();
cargarDatos();
