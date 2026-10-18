// Meu Treino — app sem login; dados ficam no próprio aparelho (localStorage).
const KEY = 'meutreino_v1';
const KEY_ACTIVE = 'meutreino_ativo';
const $ = (s, el = document) => el.querySelector(s);
const view = $('#view');

// ---------- Estado ----------
function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch {} }
function saveActive() { try { active ? localStorage.setItem(KEY_ACTIVE, JSON.stringify(active)) : localStorage.removeItem(KEY_ACTIVE); } catch {} }

let db = load(KEY, null);
if (!db) {
  db = { versao: 1, treinos: SEED_WORKOUTS, sessoes: SEED_SESSIONS, peso: SEED_BODYWEIGHT };
  save();
}
let active = load(KEY_ACTIVE, null);
const charts = [];

// ---------- Utilidades ----------
const fmtDate = iso => new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
const fmtDateLong = iso => new Date(iso).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
const fmtDur = s => { const m = Math.round(s / 60); return m >= 60 ? `${Math.floor(m / 60)}h${String(m % 60).padStart(2, '0')}` : `${m} min`; };
const fmtKg = n => (Math.round(n * 10) / 10).toLocaleString('pt-BR') + ' kg';
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const treinoById = id => db.treinos.find(t => t.id === id);
const exName = id => EXERCISES[id]?.nome || id;
const usesLoad = id => !['aquecimento', 'cardio', 'prancha', 'abd_perna_esticada'].includes(id);

function sortedSessions() { return [...db.sessoes].sort((a, b) => a.data.localeCompare(b.data)); }
function lastLoad(exId) {
  const s = sortedSessions().reverse().find(x => x.cargas?.[exId] != null);
  return s ? s.cargas[exId] : null;
}
function nextWorkout() {
  const last = sortedSessions().pop();
  if (!last) return db.treinos[0];
  const i = db.treinos.findIndex(t => t.id === last.treino);
  return db.treinos[(i + 1) % db.treinos.length];
}
function weekStart(d) { const x = new Date(d); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; }

function setHeader(title, back) {
  $('#title').textContent = title;
  const b = $('#back');
  b.hidden = !back;
  b.onclick = () => (back === true ? history.back() : (location.hash = back));
}
function setTab(tab) { document.querySelectorAll('.tabs a').forEach(a => a.classList.toggle('on', a.dataset.tab === tab)); }
function destroyCharts() { while (charts.length) charts.pop().destroy(); }

// ---------- Telas ----------
function renderHome() {
  setHeader('Meu Treino'); setTab('home');
  const next = nextWorkout();
  const ss = sortedSessions();
  const thisWeek = ss.filter(s => new Date(s.data) >= weekStart(new Date())).length;
  const last = ss[ss.length - 1];
  view.innerHTML = `
    ${active ? `<a class="card resume" href="#/sessao"><div><small>Treino em andamento</small><strong>${esc(treinoById(active.treino)?.nome)}</strong></div><span class="pill">Continuar ›</span></a>` : ''}
    <section class="stats">
      <div><strong>${ss.length}</strong><small>treinos feitos</small></div>
      <div><strong>${thisWeek}</strong><small>esta semana</small></div>
      <div><strong>${last ? fmtDate(last.data) : '—'}</strong><small>último treino</small></div>
    </section>
    <h2 class="section">Seu protocolo</h2>
    ${db.treinos.map(t => {
      const done = ss.filter(s => s.treino === t.id);
      const lastT = done[done.length - 1];
      return `<a class="card workout ${t.id === next.id ? 'next' : ''}" href="#/treino/${t.id}">
        <div class="num">${t.nome.replace(/\D/g, '') || '•'}</div>
        <div class="grow"><strong>${esc(t.nome)}</strong><small>${t.itens.length} exercícios · ${esc(t.foco)}</small>
        <small class="muted">${lastT ? `Último: ${fmtDateLong(lastT.data)} · feito ${done.length}x` : 'Ainda não feito'}</small></div>
        ${t.id === next.id ? '<span class="pill">Próximo</span>' : '<span class="chev">›</span>'}
      </a>`;
    }).join('')}`;
}

function renderTreino(id) {
  const t = treinoById(id);
  if (!t) return (location.hash = '#/');
  setHeader(t.nome, '#/'); setTab('home');
  view.innerHTML = `
    <p class="lead">${esc(t.foco)}</p>
    <button class="btn primary big" id="start">${active?.treino === id ? 'Continuar treino' : '▶ Começar treino'}</button>
    <h2 class="section">Exercícios do dia <small>${t.itens.length} no total</small></h2>
    ${t.itens.map((it, i) => {
      const ll = lastLoad(it.ex);
      return `<a class="card ex" href="#/ex/${it.ex}">
        <div class="num">${i + 1}</div>
        <div class="grow"><strong>${esc(exName(it.ex))}</strong>
        <small>${it.series} × ${esc(it.reps)}${it.descanso ? ` · ${it.descanso}s descanso` : ''}</small>
        ${ll != null ? `<small class="ok">Última carga: ${fmtKg(ll)}</small>` : ''}</div>
        <span class="chev">›</span></a>`;
    }).join('')}`;
  $('#start').onclick = () => {
    if (active && active.treino !== id && !confirm('Há outro treino em andamento. Descartar e começar este?')) return;
    if (!active || active.treino !== id) startSession(t);
    location.hash = '#/sessao';
  };
}

function startSession(t) {
  active = { treino: t.id, inicio: new Date().toISOString(), series: {}, aberto: 0 };
  t.itens.forEach(it => {
    const ll = lastLoad(it.ex);
    active.series[it.ex] = Array.from({ length: it.series }, () => ({ kg: usesLoad(it.ex) && ll != null ? ll : '', reps: /^\d+$/.test(it.reps) ? it.reps : '', ok: false }));
  });
  saveActive();
}

function renderSessao() {
  if (!active) return (location.hash = '#/');
  const t = treinoById(active.treino);
  setHeader(t.nome, '#/treino/' + t.id); setTab('home');
  const total = Object.values(active.series).flat();
  const done = total.filter(s => s.ok).length;
  view.innerHTML = `
    <div class="session-head">
      <div><small>Tempo</small><strong id="clock">0:00</strong></div>
      <div><small>Séries</small><strong>${done}/${total.length}</strong></div>
      <div class="bar"><span style="width:${Math.round(done / total.length * 100)}%"></span></div>
    </div>
    ${t.itens.map((it, i) => {
      const rows = active.series[it.ex] || [];
      const allOk = rows.every(r => r.ok);
      const open = active.aberto === i;
      const load = usesLoad(it.ex);
      return `<section class="card sx ${allOk ? 'done' : ''} ${open ? 'open' : ''}" data-i="${i}">
        <header class="sx-head" data-toggle="${i}">
          <div class="num">${allOk ? '✓' : i + 1}</div>
          <div class="grow"><strong>${esc(exName(it.ex))}</strong><small>${it.series} × ${esc(it.reps)}${it.descanso ? ` · ${it.descanso}s` : ''}</small></div>
          <span class="chev">${open ? '⌃' : '⌄'}</span>
        </header>
        ${open ? `<div class="sx-body">
          <div class="sx-ig">${poseSVG(EXERCISES[it.ex].S, EXERCISES[it.ex])}${poseSVG(EXERCISES[it.ex].E, EXERCISES[it.ex])}</div>
          <a class="link" href="#/ex/${it.ex}">Ver passo a passo completo ›</a>
          <div class="sets">
            <div class="set-row head"><span>Série</span>${load ? '<span>Carga (kg)</span>' : ''}<span>${load ? 'Reps' : 'Feito'}</span><span></span></div>
            ${rows.map((r, j) => `<div class="set-row ${r.ok ? 'ok' : ''}">
              <span>${j + 1}</span>
              ${load ? `<input inputmode="decimal" data-kg="${it.ex}|${j}" value="${r.kg}" placeholder="0">` : ''}
              ${load ? `<input inputmode="numeric" data-reps="${it.ex}|${j}" value="${r.reps}" placeholder="${esc(it.reps)}">` : `<span class="muted">${esc(it.reps)}</span>`}
              <button class="check" data-check="${it.ex}|${j}|${it.descanso}" aria-label="Concluir série">${r.ok ? '✓' : ''}</button>
            </div>`).join('')}
          </div>
        </div>` : ''}
      </section>`;
    }).join('')}
    <button class="btn primary big" id="finish">Finalizar treino</button>
    <button class="btn ghost" id="discard">Descartar treino</button>`;

  view.querySelectorAll('[data-toggle]').forEach(h => h.onclick = () => {
    const i = +h.dataset.toggle; active.aberto = active.aberto === i ? -1 : i; saveActive(); renderSessao();
    const el = view.querySelector(`[data-i="${i}"]`); el && el.scrollIntoView({ block: 'start', behavior: 'smooth' });
  });
  view.querySelectorAll('[data-kg]').forEach(inp => inp.oninput = () => {
    const [ex, j] = inp.dataset.kg.split('|');
    const v = inp.value.replace(',', '.');
    active.series[ex][j].kg = v;
    // replica a carga para as séries seguintes ainda não feitas
    active.series[ex].forEach((r, k) => { if (k > j && !r.ok) { r.kg = v; const o = view.querySelector(`[data-kg="${ex}|${k}"]`); if (o) o.value = v; } });
    saveActive();
  });
  view.querySelectorAll('[data-reps]').forEach(inp => inp.oninput = () => {
    const [ex, j] = inp.dataset.reps.split('|'); active.series[ex][j].reps = inp.value; saveActive();
  });
  view.querySelectorAll('[data-check]').forEach(b => b.onclick = () => {
    const [ex, j, rest] = b.dataset.check.split('|');
    const r = active.series[ex][j];
    r.ok = !r.ok;
    if (r.ok && navigator.vibrate) navigator.vibrate(30);
    const rows = active.series[ex];
    if (r.ok && rows.every(x => x.ok)) {
      const idx = t.itens.findIndex(it => it.ex === ex);
      const nxt = t.itens.findIndex((it, k) => k > idx && !active.series[it.ex].every(x => x.ok));
      active.aberto = nxt;
    }
    saveActive(); renderSessao();
    if (r.ok && +rest > 0) startRest(+rest);
  });
  $('#finish').onclick = finishSession;
  $('#discard').onclick = () => { if (confirm('Descartar este treino? Nada será salvo.')) { active = null; saveActive(); stopRest(); location.hash = '#/'; } };
  tickClock();
}

let clockTimer;
function tickClock() {
  clearInterval(clockTimer);
  const upd = () => {
    const el = $('#clock'); if (!el || !active) return clearInterval(clockTimer);
    const s = Math.floor((Date.now() - new Date(active.inicio)) / 1000);
    el.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  };
  upd(); clockTimer = setInterval(upd, 1000);
}

function finishSession() {
  const t = treinoById(active.treino);
  const anyDone = Object.values(active.series).flat().some(r => r.ok);
  if (!anyDone && !confirm('Nenhuma série marcada. Salvar mesmo assim?')) return;
  const cargas = {}, series = {};
  for (const [ex, rows] of Object.entries(active.series)) {
    const okRows = rows.filter(r => r.ok);
    series[ex] = okRows.map(r => ({ kg: parseFloat(r.kg) || 0, reps: parseInt(r.reps) || 0 }));
    const kgs = okRows.map(r => parseFloat(r.kg)).filter(n => n > 0);
    if (kgs.length) cargas[ex] = Math.max(...kgs);
  }
  const duracao = Math.round((Date.now() - new Date(active.inicio)) / 1000);
  db.sessoes.push({ id: 's' + Date.now(), treino: t.id, data: new Date().toISOString(), duracao, cargas, series });
  save();
  active = null; saveActive(); stopRest();
  view.innerHTML = `<div class="done-screen"><div class="big-emoji">💪</div><h2>Treino concluído!</h2>
    <p>${esc(t.nome)} · ${fmtDur(duracao)}</p>
    ${Object.keys(cargas).length ? `<ul class="plain">${Object.entries(cargas).map(([ex, kg]) => {
      const prev = sortedSessions().slice(0, -1).reverse().find(s => s.cargas?.[ex] != null)?.cargas[ex];
      const diff = prev != null ? kg - prev : null;
      return `<li>${esc(exName(ex))}: <strong>${fmtKg(kg)}</strong>${diff ? ` <span class="${diff > 0 ? 'ok' : 'warn'}">${diff > 0 ? '▲' : '▼'} ${fmtKg(Math.abs(diff))}</span>` : ''}</li>`;
    }).join('')}</ul>` : ''}
    <a class="btn primary" href="#/desempenho">Ver desempenho</a><a class="btn ghost" href="#/">Voltar ao início</a></div>`;
}

// ---------- Descanso ----------
let restEnd = 0, restTimer;
function startRest(sec) {
  restEnd = Date.now() + sec * 1000;
  $('#rest').hidden = false; document.body.classList.add('resting');
  clearInterval(restTimer);
  const upd = () => {
    const left = Math.max(0, Math.round((restEnd - Date.now()) / 1000));
    $('#restTime').textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
    if (left <= 0) { stopRest(); beep(); navigator.vibrate && navigator.vibrate([200, 100, 200]); }
  };
  upd(); restTimer = setInterval(upd, 250);
}
function stopRest() { clearInterval(restTimer); $('#rest').hidden = true; document.body.classList.remove('resting'); }
$('#restPlus').onclick = () => { restEnd += 10000; };
$('#restMinus').onclick = () => { restEnd -= 10000; };
$('#restSkip').onclick = stopRest;
function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination); o.frequency.value = 880; g.gain.value = 0.15;
    o.start(); o.stop(ctx.currentTime + 0.35);
  } catch {}
}

// ---------- Guia / infográfico ----------
function renderExercicio(id) {
  const ex = EXERCISES[id];
  if (!ex) return (location.hash = '#/guia');
  setHeader(ex.nome, true);
  const ll = lastLoad(id);
  view.innerHTML = `
    <div class="chips"><span class="chip">${esc(ex.grupo)}</span><span class="chip">${esc(ex.musc)}</span>${ll != null ? `<span class="chip ok">Última: ${fmtKg(ll)}</span>` : ''}</div>
    <div class="card ig">${infographicHTML(id)}</div>
    ${usesLoad(id) ? `<a class="btn ghost" href="#/desempenho?ex=${id}">Ver evolução de carga ›</a>` : ''}`;
}

function renderGuia() {
  setHeader('Guia de exercícios'); setTab('guia');
  const groups = {};
  Object.entries(EXERCISES).forEach(([id, ex]) => (groups[ex.grupo] ||= []).push([id, ex]));
  view.innerHTML = Object.entries(groups).map(([g, list]) => `
    <h2 class="section">${esc(g)}</h2>
    <div class="grid">${list.map(([id, ex]) => `<a class="card thumb" href="#/ex/${id}">${poseSVG(ex.labels?.[1] === 'Evite' ? ex.S : ex.E, ex)}<span>${esc(ex.nome)}</span></a>`).join('')}</div>`).join('');
}

// ---------- Desempenho ----------
function cssVar(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }

function renderDesempenho(query) {
  setHeader('Desempenho'); setTab('desempenho');
  destroyCharts();
  const ss = sortedSessions();
  const loadEx = [...new Set(db.treinos.flatMap(t => t.itens.map(i => i.ex)))].filter(usesLoad);
  const sel = new URLSearchParams(query).get('ex') || loadEx.find(e => lastLoad(e) != null) || loadEx[0];
  const weeks = {};
  ss.forEach(s => { const k = weekStart(s.data).toISOString().slice(0, 10); weeks[k] = (weeks[k] || 0) + 1; });
  const nWeeks = ss.length ? Math.floor((weekStart(new Date()) - weekStart(ss[0].data)) / 6048e5) + 1 : 0;
  const avgDur = ss.length ? ss.reduce((a, s) => a + (s.duracao || 0), 0) / ss.length : 0;
  const prs = loadEx.map(ex => {
    const pts = ss.filter(s => s.cargas?.[ex] != null).map(s => s.cargas[ex]);
    return pts.length ? { ex, max: Math.max(...pts), first: pts[0], last: pts[pts.length - 1], n: pts.length } : null;
  }).filter(Boolean);
  const peso = [...db.peso].sort((a, b) => a.data.localeCompare(b.data));

  view.innerHTML = `
    <section class="stats">
      <div><strong>${ss.length}</strong><small>treinos</small></div>
      <div><strong>${nWeeks ? (ss.length / nWeeks).toFixed(1).replace('.', ',') : '0'}</strong><small>por semana</small></div>
      <div><strong>${fmtDur(avgDur)}</strong><small>duração média</small></div>
    </section>

    <div class="card chart-card">
      <h3>Evolução de carga</h3>
      <select id="exSel">${loadEx.map(e => `<option value="${e}" ${e === sel ? 'selected' : ''}>${esc(exName(e))}</option>`).join('')}</select>
      <div class="chart-box"><canvas id="cLoad"></canvas></div>
      <p class="muted small" id="loadNote"></p>
    </div>

    <div class="card chart-card">
      <h3>Treinos por semana</h3>
      <div class="chart-box short"><canvas id="cFreq"></canvas></div>
    </div>

    <div class="card chart-card">
      <h3>Peso corporal</h3>
      <div class="chart-box short"><canvas id="cPeso"></canvas></div>
      <form class="inline-form" id="pesoForm">
        <input type="date" id="pesoData" value="${new Date().toISOString().slice(0, 10)}">
        <input inputmode="decimal" id="pesoKg" placeholder="kg">
        <button class="btn primary">Registrar</button>
      </form>
    </div>

    <div class="card">
      <h3>Recordes por exercício</h3>
      ${prs.length ? `<table class="prs"><thead><tr><th>Exercício</th><th>Máx.</th><th>Evolução</th></tr></thead><tbody>
      ${prs.map(p => { const d = p.last - p.first; return `<tr><td><a href="#/desempenho?ex=${p.ex}">${esc(exName(p.ex))}</a></td><td>${fmtKg(p.max)}</td><td class="${d > 0 ? 'ok' : 'muted'}">${p.n < 2 ? '—' : (d > 0 ? '+' : '') + fmtKg(d)}</td></tr>`; }).join('')}
      </tbody></table>` : '<p class="muted">Sem cargas registradas ainda.</p>'}
    </div>

    <div class="card">
      <h3>Histórico</h3>
      <ul class="history">${[...ss].reverse().map(s => `<li><span>${fmtDateLong(s.data)}</span><strong>${esc(treinoById(s.treino)?.nome || s.treino)}</strong><span class="muted">${s.duracao ? fmtDur(s.duracao) : ''}</span>${s.importado ? '' : `<button class="del" data-del="${s.id}" aria-label="Apagar">✕</button>`}</li>`).join('')}</ul>
    </div>`;

  const grid = cssVar('--line'), txt = cssVar('--muted'), acc = cssVar('--accent'), acc2 = cssVar('--accent-2');
  Chart.defaults.color = txt; Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
  const baseOpts = {
    responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
    scales: { x: { grid: { display: false } }, y: { grid: { color: grid }, beginAtZero: false } },
  };

  const drawLoad = ex => {
    const pts = ss.filter(s => s.cargas?.[ex] != null);
    $('#loadNote').textContent = pts.length < 2
      ? 'Com um só registro o gráfico ainda é um ponto. Cada treino concluído aqui adiciona um novo ponto.'
      : `${pts.length} registros · de ${fmtKg(pts[0].cargas[ex])} para ${fmtKg(pts[pts.length - 1].cargas[ex])}`;
    const c = charts.find(c => c.canvas.id === 'cLoad'); if (c) { c.destroy(); charts.splice(charts.indexOf(c), 1); }
    charts.push(new Chart($('#cLoad'), {
      type: 'line',
      data: { labels: pts.map(s => fmtDate(s.data)), datasets: [{ data: pts.map(s => s.cargas[ex]), borderColor: acc, backgroundColor: acc, pointRadius: 5, tension: 0.25 }] },
      options: { ...baseOpts, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => fmtKg(c.parsed.y) } } } },
    }));
  };
  drawLoad(sel);
  $('#exSel').onchange = e => { history.replaceState(null, '', '#/desempenho?ex=' + e.target.value); drawLoad(e.target.value); };

  // semanas contínuas (inclui as semanas sem treino, com zero)
  const wk = [];
  if (ss.length) for (let d = weekStart(ss[0].data); d <= new Date(); d.setDate(d.getDate() + 7)) wk.push(d.toISOString().slice(0, 10));
  wk.forEach(k => (weeks[k] ||= 0));
  charts.push(new Chart($('#cFreq'), {
    type: 'bar',
    data: { labels: wk.map(k => fmtDate(k + 'T12:00:00')), datasets: [{ data: wk.map(k => weeks[k]), backgroundColor: acc2, borderRadius: 6, maxBarThickness: 28 }] },
    options: { ...baseOpts, scales: { x: { grid: { display: false } }, y: { grid: { color: grid }, beginAtZero: true, ticks: { stepSize: 1 } } } },
  }));
  charts.push(new Chart($('#cPeso'), {
    type: 'line',
    data: { labels: peso.map(p => fmtDate(p.data + 'T12:00:00')), datasets: [{ data: peso.map(p => p.kg), borderColor: acc2, backgroundColor: acc2, pointRadius: 5, tension: 0.25 }] },
    options: { ...baseOpts, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => fmtKg(c.parsed.y) } } } },
  }));

  $('#pesoForm').onsubmit = e => {
    e.preventDefault();
    const kg = parseFloat($('#pesoKg').value.replace(',', '.')), data = $('#pesoData').value;
    if (!kg || !data) return;
    db.peso = db.peso.filter(p => p.data !== data).concat({ data, kg }); save(); renderDesempenho(query);
  };
  view.querySelectorAll('[data-del]').forEach(b => b.onclick = () => {
    if (!confirm('Apagar este treino do histórico?')) return;
    db.sessoes = db.sessoes.filter(s => s.id !== b.dataset.del); save(); renderDesempenho(query);
  });
}

// ---------- Ajustes / backup ----------
function renderAjustes() {
  setHeader('Ajustes'); setTab('ajustes');
  view.innerHTML = `
    <div class="card">
      <h3>Backup dos dados</h3>
      <p class="muted">Seus treinos ficam salvos só neste aparelho/navegador. Exporte de vez em quando para não perder nada (troca de celular, limpeza do navegador).</p>
      <button class="btn primary" id="exp">Exportar backup (.json)</button>
      <label class="btn ghost file">Importar backup<input type="file" id="imp" accept="application/json" hidden></label>
    </div>
    <div class="card">
      <h3>Editar séries e repetições</h3>
      ${db.treinos.map(t => `<details><summary>${esc(t.nome)}</summary>
        ${t.itens.map((it, i) => `<div class="edit-row"><span>${esc(exName(it.ex))}</span>
          <input data-ed="${t.id}|${i}|series" inputmode="numeric" value="${it.series}" aria-label="Séries">×
          <input data-ed="${t.id}|${i}|reps" value="${esc(it.reps)}" aria-label="Repetições">
          <input data-ed="${t.id}|${i}|descanso" inputmode="numeric" value="${it.descanso}" aria-label="Descanso (s)">s</div>`).join('')}
      </details>`).join('')}
    </div>
    <div class="card">
      <h3>Instalar no celular</h3>
      <p class="muted">iPhone: Safari → Compartilhar → "Adicionar à Tela de Início".<br>Android: Chrome → menu ⋮ → "Instalar app" ou "Adicionar à tela inicial".</p>
    </div>
    <button class="btn ghost danger" id="reset">Apagar tudo e restaurar dados iniciais</button>`;

  $('#exp').onclick = () => {
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = `meu-treino-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click();
  };
  $('#imp').onchange = async e => {
    try {
      const data = JSON.parse(await e.target.files[0].text());
      if (!data.treinos || !data.sessoes) throw new Error();
      if (!confirm(`Substituir os dados atuais por este backup (${data.sessoes.length} treinos)?`)) return;
      db = data; save(); alert('Backup importado.'); renderAjustes();
    } catch { alert('Arquivo inválido.'); }
  };
  view.querySelectorAll('[data-ed]').forEach(inp => inp.onchange = () => {
    const [tid, i, f] = inp.dataset.ed.split('|');
    const it = treinoById(tid).itens[i];
    it[f] = f === 'reps' ? inp.value : Math.max(0, parseInt(inp.value) || 0);
    save();
  });
  $('#reset').onclick = () => {
    if (!confirm('Isso apaga todos os treinos registrados neste aparelho. Continuar?')) return;
    localStorage.removeItem(KEY); localStorage.removeItem(KEY_ACTIVE); location.hash = '#/'; location.reload();
  };
}

// ---------- Roteador ----------
function route() {
  destroyCharts();
  const [path, query = ''] = location.hash.slice(1).split('?');
  const parts = path.split('/').filter(Boolean);
  window.scrollTo(0, 0);
  if (parts[0] === 'treino') renderTreino(parts[1]);
  else if (parts[0] === 'sessao') renderSessao();
  else if (parts[0] === 'ex') renderExercicio(parts[1]);
  else if (parts[0] === 'guia') renderGuia();
  else if (parts[0] === 'desempenho') renderDesempenho(query);
  else if (parts[0] === 'ajustes') renderAjustes();
  else renderHome();
}
window.addEventListener('hashchange', route);
route();

if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
