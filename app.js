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
// v2: perfil da avaliação + nota/esforço das sessões importadas (vale também para quem já usava a v1)
if (!db.perfil) {
  db.perfil = JSON.parse(JSON.stringify(SEED_PERFIL));
  db.sessoes.forEach(s => { const m = SEED_SESSION_META[s.id]; if (m && s.nota == null) Object.assign(s, m); });
  db.versao = 2; save();
}
let active = load(KEY_ACTIVE, null);
let editMode = false;
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
    ${editMode ? '' : `<button class="btn primary big" id="start">${active?.treino === id ? 'Continuar treino' : '▶ Começar treino'}</button>`}
    <h2 class="section">Exercícios do dia <button class="mini" id="edit">${editMode ? '✓ Concluir edição' : '✎ Editar treino'}</button></h2>
    ${t.itens.map((it, i) => {
      const ll = lastLoad(it.ex);
      const info = `<div class="num">${i + 1}</div>
        <div class="grow"><strong>${esc(exName(it.ex))}</strong>
        <small>${esc(EXERCISES[it.ex]?.grupo || '')} · ${it.series} × ${esc(it.reps)}${it.descanso ? ` · ${it.descanso}s` : ''}</small>
        ${ll != null && !editMode ? `<small class="ok">Última carga: ${fmtKg(ll)}</small>` : ''}</div>`;
      return editMode
        ? `<div class="card ex editing">${info}
            <div class="ed-btns">
              <button data-up="${i}" ${i === 0 ? 'disabled' : ''} aria-label="Subir">↑</button>
              <button data-down="${i}" ${i === t.itens.length - 1 ? 'disabled' : ''} aria-label="Descer">↓</button>
              <a class="swap" href="#/exercicios?m=${encodeURIComponent(EXERCISES[it.ex]?.grupo || '')}&troca=${t.id}|${i}" aria-label="Trocar">⇄</a>
              <button data-del="${i}" class="danger" aria-label="Remover">✕</button>
            </div></div>`
        : `<a class="card ex" href="#/ex/${it.ex}">${info}<span class="chev">›</span></a>`;
    }).join('')}
    ${editMode ? `<a class="btn primary" href="#/exercicios?add=${t.id}">＋ Acrescentar exercício</a>
      <p class="muted small">⇄ troca o exercício por outro do mesmo músculo · ✕ remove do treino.</p>` : ''}`;
  $('#edit').onclick = () => { editMode = !editMode; renderTreino(id); };
  const move = (i, d) => { const [x] = t.itens.splice(i, 1); t.itens.splice(i + d, 0, x); save(); renderTreino(id); };
  view.querySelectorAll('[data-up]').forEach(b => b.onclick = () => move(+b.dataset.up, -1));
  view.querySelectorAll('[data-down]').forEach(b => b.onclick = () => move(+b.dataset.down, 1));
  view.querySelectorAll('[data-del]').forEach(b => b.onclick = () => {
    const it = t.itens[+b.dataset.del];
    if (!confirm(`Remover "${exName(it.ex)}" do ${t.nome}?`)) return;
    t.itens.splice(+b.dataset.del, 1); save(); renderTreino(id); toast('Exercício removido');
  });
  if (editMode) return;
  $('#start').onclick = () => {
    if (active && active.treino !== id && !confirm('Há outro treino em andamento. Descartar e começar este?')) return;
    if (!active || active.treino !== id) startSession(t);
    location.hash = '#/sessao';
  };
}

function startSession(t) {
  active = { treino: t.id, inicio: new Date().toISOString(), series: {}, aberto: 0 };
  t.itens.forEach(ensureSeries);
  saveActive();
}
// cria as séries de um exercício na sessão ativa (também cobre exercício trocado durante o treino)
function ensureSeries(it) {
  if (active.series[it.ex]) return;
  const ll = lastLoad(it.ex);
  active.series[it.ex] = Array.from({ length: it.series }, () => ({ kg: usesLoad(it.ex) && ll != null ? ll : '', reps: /^\d+$/.test(it.reps) ? it.reps : '', ok: false }));
}

function renderSessao() {
  if (!active) return (location.hash = '#/');
  const t = treinoById(active.treino);
  setHeader(t.nome, '#/treino/' + t.id); setTab('home');
  t.itens.forEach(ensureSeries);
  const total = t.itens.flatMap(it => active.series[it.ex]);
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
  const sessao = { id: 's' + Date.now(), treino: t.id, data: new Date().toISOString(), duracao, cargas, series };
  db.sessoes.push(sessao);
  save();
  active = null; saveActive(); stopRest();
  view.innerHTML = `<div class="done-screen"><div class="big-emoji">💪</div><h2>Treino concluído!</h2>
    <p>${esc(t.nome)} · ${fmtDur(duracao)}</p>
    ${Object.keys(cargas).length ? `<ul class="plain">${Object.entries(cargas).map(([ex, kg]) => {
      const prev = sortedSessions().slice(0, -1).reverse().find(s => s.cargas?.[ex] != null)?.cargas[ex];
      const diff = prev != null ? kg - prev : null;
      return `<li>${esc(exName(ex))}: <strong>${fmtKg(kg)}</strong>${diff ? ` <span class="${diff > 0 ? 'ok' : 'warn'}">${diff > 0 ? '▲' : '▼'} ${fmtKg(Math.abs(diff))}</span>` : ''}</li>`;
    }).join('')}</ul>` : ''}
    <div class="card rate">
      <span class="kicker">Como foi o treino?</span>
      <div class="seg" id="effSeg">${Object.entries(ESFORCO).map(([v, l]) => `<button data-eff="${v}">${l}</button>`).join('')}</div>
      <small class="muted">Nota de 0 a 10</small>
      <div class="notas" id="notaSeg">${Array.from({ length: 11 }, (_, n) => `<button data-nota="${n}">${n}</button>`).join('')}</div>
    </div>
    <a class="btn primary" href="#/desempenho">Ver desempenho</a><a class="btn ghost" href="#/">Voltar ao início</a></div>`;
  const mark = (sel, attr, val) => view.querySelectorAll(sel + ' button').forEach(b => b.classList.toggle('on', b.dataset[attr] === String(val)));
  view.querySelectorAll('[data-eff]').forEach(b => b.onclick = () => { sessao.esforco = +b.dataset.eff; save(); mark('#effSeg', 'eff', sessao.esforco); });
  view.querySelectorAll('[data-nota]').forEach(b => b.onclick = () => { sessao.nota = +b.dataset.nota; save(); mark('#notaSeg', 'nota', sessao.nota); });
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
const treinosUsing = id => db.treinos.filter(t => t.itens.some(i => i.ex === id));
const exDefaults = id => ({ series: 3, reps: '12', descanso: 50, ...(EXERCISES[id]?.padrao || {}) });
const thumbPose = ex => (ex.labels?.[1] === 'Evite' ? ex.S : ex.E);

// contexto vindo do botão Trocar/Acrescentar da tela do treino: troca=t1|3 ou add=t1
function parseCtx(query) {
  const q = new URLSearchParams(query);
  if (q.get('troca')) { const [treino, i] = q.get('troca').split('|'); return { treino, acao: 'sub', alvo: +i }; }
  if (q.get('add')) return { treino: q.get('add'), acao: 'add' };
  return null;
}
const ctxQuery = ctx => (!ctx ? '' : ctx.acao === 'sub' ? `troca=${ctx.treino}|${ctx.alvo}` : `add=${ctx.treino}`);

function renderExercicio(id, query) {
  const ex = EXERCISES[id];
  if (!ex) return (location.hash = '#/exercicios');
  const ctx = parseCtx(query);
  setHeader(ex.nome, true); setTab('exercicios');
  const ll = lastLoad(id);
  const em = treinosUsing(id);
  view.innerHTML = `
    <div class="chips"><span class="chip">${esc(ex.grupo)}</span><span class="chip">${esc(ex.musc)}</span>${ll != null ? `<span class="chip ok">Última: ${fmtKg(ll)}</span>` : ''}
    ${em.map(t => `<span class="chip on">No ${esc(t.nome)}</span>`).join('')}</div>
    <div class="card ig">${infographicHTML(id)}</div>
    <button class="btn primary big" id="use">${ctx?.acao === 'sub' ? '⇄ Usar na troca' : '＋ Colocar em um treino'}</button>
    ${usesLoad(id) ? `<a class="btn ghost" href="#/desempenho?ex=${id}">Ver evolução de carga ›</a>` : ''}`;
  $('#use').onclick = () => openSheet(id, ctx);
}

let exGroup = null;
function renderExercicios(query) {
  setHeader('Exercícios'); setTab('exercicios');
  const ctx = parseCtx(query);
  const q = new URLSearchParams(query);
  const groups = GROUP_ORDER.filter(g => Object.values(EXERCISES).some(e => e.grupo === g));
  exGroup = q.get('m') || exGroup || groups[0];
  if (!groups.includes(exGroup)) exGroup = groups[0];
  const list = Object.entries(EXERCISES).filter(([, e]) => e.grupo === exGroup).sort((a, b) => a[1].nome.localeCompare(b[1].nome));
  const ct = ctx && treinoById(ctx.treino);
  const banner = !ct ? '' : ctx.acao === 'sub'
    ? `<div class="banner">Escolha o exercício que vai <strong>substituir</strong> “${esc(exName(ct.itens[ctx.alvo]?.ex))}” no <strong>${esc(ct.nome)}</strong>. <a href="#/treino/${ct.id}">Cancelar</a></div>`
    : `<div class="banner">Escolha o exercício para <strong>acrescentar</strong> no <strong>${esc(ct.nome)}</strong>. <a href="#/treino/${ct.id}">Cancelar</a></div>`;
  const cq = ctxQuery(ctx);
  view.innerHTML = `
    ${banner}
    <p class="lead small">Escolha o músculo, toque no exercício para ver o passo a passo e use <strong>＋</strong> para colocar num treino.</p>
    <div class="musc-chips">${groups.map(g => `<button class="mchip ${g === exGroup ? 'on' : ''}" data-g="${esc(g)}">${esc(g)}<span>${Object.values(EXERCISES).filter(e => e.grupo === g).length}</span></button>`).join('')}</div>
    <div class="ex-list">${list.map(([id, ex]) => {
      const em = treinosUsing(id);
      return `<div class="card exrow">
        <a class="exrow-main" href="#/ex/${id}${cq ? '?' + cq : ''}">
          <div class="exrow-img">${poseSVG(thumbPose(ex), ex)}</div>
          <div class="grow"><strong>${esc(ex.nome)}</strong><small>${esc(ex.musc)}</small>
          ${em.length ? `<small class="tags">${em.map(t => `<span>${esc(t.nome)}</span>`).join('')}</small>` : ''}</div>
        </a>
        <button class="add" data-add="${id}" aria-label="Colocar em um treino">${ctx?.acao === 'sub' ? '⇄' : '＋'}</button>
      </div>`;
    }).join('')}</div>`;
  view.querySelectorAll('[data-g]').forEach(b => b.onclick = () => {
    exGroup = b.dataset.g;
    history.replaceState(null, '', `#/exercicios?m=${encodeURIComponent(exGroup)}${cq ? '&' + cq : ''}`);
    renderExercicios(`m=${encodeURIComponent(exGroup)}${cq ? '&' + cq : ''}`);
  });
  view.querySelectorAll('[data-add]').forEach(b => b.onclick = () => openSheet(b.dataset.add, ctx));
  const on = view.querySelector('.mchip.on'); on && on.scrollIntoView({ inline: 'center', block: 'nearest' });
}

// ---------- Folha "colocar no treino" ----------
let sheet = null;
function openSheet(exId, ctx) {
  const t = treinoById(ctx?.treino) || db.treinos[0];
  sheet = { ex: exId, treino: t.id, acao: ctx?.acao || 'add', alvo: ctx?.alvo, pos: null, ...exDefaults(exId) };
  if (sheet.acao === 'sub' && sheet.alvo == null) sheet.alvo = sameGroupIndex(t, exId);
  $('#sheetBg').hidden = false; $('#sheet').hidden = false;
  document.body.classList.add('noscroll');
  renderSheet();
}
function closeSheet() { sheet = null; $('#sheetBg').hidden = true; $('#sheet').hidden = true; document.body.classList.remove('noscroll'); }
$('#sheetBg').onclick = closeSheet;
function sameGroupIndex(t, exId) {
  const i = t.itens.findIndex(it => EXERCISES[it.ex]?.grupo === EXERCISES[exId].grupo && it.ex !== exId);
  return i >= 0 ? i : null;
}
function defaultPos(t) { const n = t.itens.length; return n && t.itens[n - 1].ex === 'cardio' ? n - 1 : n; }

function renderSheet() {
  const s = sheet, ex = EXERCISES[s.ex], t = treinoById(s.treino);
  if (s.pos == null || s.pos > t.itens.length) s.pos = defaultPos(t);
  const dup = t.itens.findIndex(it => it.ex === s.ex);
  const blocked = dup >= 0 && !(s.acao === 'sub' && s.alvo === dup);
  $('#sheet').innerHTML = `
    <div class="sheet-handle"></div>
    <div class="sheet-head">${poseSVG(thumbPose(ex), ex)}<div><small>${esc(ex.grupo)}</small><strong>${esc(ex.nome)}</strong></div></div>

    <label class="lbl">1. Em qual treino?</label>
    <div class="seg">${db.treinos.map(x => `<button data-t="${x.id}" class="${x.id === s.treino ? 'on' : ''}">${esc(x.nome)}</button>`).join('')}</div>

    <label class="lbl">2. O que fazer?</label>
    <div class="seg">
      <button data-a="sub" class="${s.acao === 'sub' ? 'on' : ''}">⇄ Substituir</button>
      <button data-a="add" class="${s.acao === 'add' ? 'on' : ''}">＋ Acrescentar</button>
    </div>

    ${s.acao === 'sub' ? `<label class="lbl">3. Substituir qual exercício?</label>
      <div class="pick">${t.itens.map((it, i) => `<button data-alvo="${i}" class="${s.alvo === i ? 'on' : ''} ${EXERCISES[it.ex]?.grupo === ex.grupo ? 'same' : ''}">
        <span class="n">${i + 1}</span><span class="grow">${esc(exName(it.ex))}<small>${esc(EXERCISES[it.ex]?.grupo || '')}${EXERCISES[it.ex]?.grupo === ex.grupo ? ' · mesmo músculo' : ''}</small></span></button>`).join('')}</div>`
    : `<label class="lbl">3. Em que posição?</label>
      <select id="pos">${Array.from({ length: t.itens.length + 1 }, (_, p) => `<option value="${p}" ${p === s.pos ? 'selected' : ''}>${p === 0 ? 'No início' : `Depois de ${p}. ${esc(exName(t.itens[p - 1].ex))}`}</option>`).join('')}</select>`}

    <label class="lbl">4. Séries, repetições e descanso</label>
    <div class="trio">
      <label>Séries<input id="shS" inputmode="numeric" value="${s.series}"></label>
      <label>Reps<input id="shR" value="${esc(s.reps)}"></label>
      <label>Descanso (s)<input id="shD" inputmode="numeric" value="${s.descanso}"></label>
    </div>

    ${blocked ? `<p class="warn small">Este exercício já está no ${esc(t.nome)} (posição ${dup + 1}).</p>` : ''}
    <button class="btn primary big" id="shOk" ${blocked || (s.acao === 'sub' && s.alvo == null) ? 'disabled' : ''}>
      ${s.acao === 'sub' ? (s.alvo == null ? 'Escolha o exercício a substituir' : `Substituir no ${esc(t.nome)}`) : `Acrescentar ao ${esc(t.nome)}`}</button>
    <button class="btn ghost" id="shCancel">Cancelar</button>`;

  const keep = () => { s.series = Math.max(1, parseInt($('#shS').value) || 1); s.reps = $('#shR').value.trim() || '12'; s.descanso = Math.max(0, parseInt($('#shD').value) || 0); };
  $('#sheet').querySelectorAll('[data-t]').forEach(b => b.onclick = () => {
    keep(); s.treino = b.dataset.t; s.pos = null;
    if (s.acao === 'sub') s.alvo = sameGroupIndex(treinoById(s.treino), s.ex);
    renderSheet();
  });
  $('#sheet').querySelectorAll('[data-a]').forEach(b => b.onclick = () => {
    keep(); s.acao = b.dataset.a;
    if (s.acao === 'sub' && s.alvo == null) s.alvo = sameGroupIndex(t, s.ex);
    renderSheet();
  });
  $('#sheet').querySelectorAll('[data-alvo]').forEach(b => b.onclick = () => { keep(); s.alvo = +b.dataset.alvo; renderSheet(); });
  const pos = $('#pos'); if (pos) pos.onchange = () => { s.pos = +pos.value; };
  $('#shCancel').onclick = closeSheet;
  $('#shOk').onclick = () => {
    keep();
    const item = { ex: s.ex, series: s.series, reps: s.reps, descanso: s.descanso };
    let msg;
    if (s.acao === 'sub') { msg = `${exName(t.itens[s.alvo].ex)} → ${ex.nome}`; t.itens[s.alvo] = item; }
    else { t.itens.splice(s.pos, 0, item); msg = `${ex.nome} acrescentado`; }
    save(); closeSheet(); editMode = true;
    location.hash = '#/treino/' + t.id;
    toast(`${t.nome}: ${msg}`);
  };
}

let toastTimer;
function toast(msg) {
  const el = $('#toast'); el.textContent = msg; el.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => (el.hidden = true), 2600);
}

// ---------- Desempenho ----------
function cssVar(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }

const ESFORCO = { 1: 'Leve', 2: 'Moderado', 3: 'Intenso' };
const NIVEIS = { 'Iniciante': 25, 'Intermediário': 50, 'Avançado': 75, 'Muito avançado': 100 };

function imcInfo(kg, cm) {
  const imc = kg / ((cm / 100) ** 2);
  const faixas = [
    [18.5, 'Abaixo do peso', 50, 'warn'], [25, 'Peso normal', 100, 'ok'], [30, 'Sobrepeso', 60, 'warn'],
    [35, 'Obesidade grau I', 25, 'bad'], [40, 'Obesidade grau II', 15, 'bad'], [Infinity, 'Obesidade grau III', 10, 'bad'],
  ];
  const [, classe, comp, tom] = faixas.find(f => imc < f[0]);
  return { imc, classe, comp, tom };
}
const pesoOrdenado = () => [...db.peso].sort((a, b) => a.data.localeCompare(b.data));
const pesoAtual = () => pesoOrdenado().pop()?.kg;
const fmtNum = (n, d = 1) => n.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });

// Indicadores no mesmo formato da avaliação: experiência, técnica e composição (0–100) + frequência real das últimas 4 semanas
function indicadores() {
  const p = db.perfil;
  const kg = pesoAtual();
  const info = kg ? imcInfo(kg, p.altura) : null;
  const desde = Date.now() - 28 * 864e5;
  const recentes = db.sessoes.filter(s => new Date(s.data) >= desde).length;
  const exp = NIVEIS[p.experiencia] ?? 50, tec = NIVEIS[p.tecnica] ?? 50, comp = info ? info.comp : 50;
  return {
    info, exp, tec, comp, recentes,
    freq: Math.min(100, Math.round(recentes / (p.metaSemanal * 4) * 100)),
    score: Math.round((exp + tec + comp) / 3),
  };
}

let perfTab = 'treinos';
function renderDesempenho(query) {
  setHeader('Desempenho'); setTab('desempenho');
  destroyCharts();
  const q = new URLSearchParams(query);
  if (q.get('ex')) perfTab = 'treinos';
  if (q.get('aba')) perfTab = q.get('aba');
  view.innerHTML = `
    <div class="seg perf-tabs">
      <button data-aba="treinos" class="${perfTab === 'treinos' ? 'on' : ''}">🏋️ Treinos</button>
      <button data-aba="peso" class="${perfTab === 'peso' ? 'on' : ''}">⚖️ Peso</button>
      <button data-aba="perfil" class="${perfTab === 'perfil' ? 'on' : ''}">⭐ Perfil</button>
    </div>
    <div id="perf"></div>`;
  view.querySelectorAll('[data-aba]').forEach(b => b.onclick = () => {
    perfTab = b.dataset.aba; history.replaceState(null, '', '#/desempenho?aba=' + perfTab); renderDesempenho('aba=' + perfTab);
  });
  const opts = chartBase();
  if (perfTab === 'peso') renderPerfPeso(opts);
  else if (perfTab === 'perfil') renderPerfPerfil(opts);
  else renderPerfTreinos(q, opts);
}

function chartBase() {
  const grid = cssVar('--line'), txt = cssVar('--muted');
  Chart.defaults.color = txt; Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
  return {
    grid, acc: cssVar('--accent'), acc2: cssVar('--accent-2'),
    base: {
      responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
      scales: { x: { grid: { display: false } }, y: { grid: { color: grid }, beginAtZero: false } },
    },
  };
}

function renderPerfTreinos(q, { grid, acc, acc2, base }) {
  const ss = sortedSessions();
  const loadEx = [...new Set(db.treinos.flatMap(t => t.itens.map(i => i.ex)))].filter(usesLoad);
  const sel = q.get('ex') || loadEx.find(e => lastLoad(e) != null) || loadEx[0];
  const weeks = {};
  ss.forEach(s => { const k = weekStart(s.data).toISOString().slice(0, 10); weeks[k] = (weeks[k] || 0) + 1; });
  const nWeeks = ss.length ? Math.floor((weekStart(new Date()) - weekStart(ss[0].data)) / 6048e5) + 1 : 0;
  const thisWeek = ss.filter(s => new Date(s.data) >= weekStart(new Date())).length;
  const avgDur = ss.length ? ss.reduce((a, s) => a + (s.duracao || 0), 0) / ss.length : 0;
  const prs = loadEx.map(ex => {
    const pts = ss.filter(s => s.cargas?.[ex] != null).map(s => s.cargas[ex]);
    return pts.length ? { ex, max: Math.max(...pts), first: pts[0], last: pts[pts.length - 1], n: pts.length } : null;
  }).filter(Boolean);

  $('#perf').innerHTML = `
    <section class="stats four">
      <div><strong class="acc">${thisWeek}</strong><small>esta semana</small></div>
      <div><strong>${ss.length}</strong><small>concluídos</small></div>
      <div><strong>${nWeeks ? fmtNum(ss.length / nWeeks) : '0'}</strong><small>por semana</small></div>
      <div><strong>${fmtDur(avgDur)}</strong><small>duração média</small></div>
    </section>

    <div class="card chart-card">
      <div class="card-title"><div><span class="kicker">Frequência semanal</span><small class="muted">Seu ritmo de treinos nas últimas semanas</small></div>
      <div class="badge"><strong>${thisWeek}</strong><small>semana</small></div></div>
      <div class="chart-box short"><canvas id="cFreq"></canvas></div>
      <p class="muted small">Meta: ${db.perfil.metaSemanal} treinos por semana (linha tracejada).</p>
    </div>

    <div class="card chart-card">
      <span class="kicker">Evolução de carga</span>
      <select id="exSel">${loadEx.map(e => `<option value="${e}" ${e === sel ? 'selected' : ''}>${esc(exName(e))}</option>`).join('')}</select>
      <div class="chart-box"><canvas id="cLoad"></canvas></div>
      <p class="muted small" id="loadNote"></p>
    </div>

    <div class="card">
      <span class="kicker">Recordes por exercício</span>
      ${prs.length ? `<table class="prs"><thead><tr><th>Exercício</th><th>Máx.</th><th>Evolução</th></tr></thead><tbody>
      ${prs.map(p => { const d = p.last - p.first; return `<tr><td><a href="#/desempenho?ex=${p.ex}">${esc(exName(p.ex))}</a></td><td>${fmtKg(p.max)}</td><td class="${d > 0 ? 'ok' : 'muted'}">${p.n < 2 ? '—' : (d > 0 ? '+' : '') + fmtKg(d)}</td></tr>`; }).join('')}
      </tbody></table>` : '<p class="muted">Sem cargas registradas ainda.</p>'}
    </div>

    <div class="card">
      <span class="kicker">Histórico de treinos</span>
      <ul class="hist">${[...ss].reverse().map(s => `<li>
        <div class="grow"><strong>${esc(treinoById(s.treino)?.nome || s.treino)}</strong>
        <small>${fmtDateLong(s.data)}${s.duracao ? ' · ' + fmtDur(s.duracao) : ''}${s.esforco ? ` · <span class="eff e${s.esforco}">${ESFORCO[s.esforco]}</span>` : ''}</small></div>
        ${s.nota != null ? `<span class="nota" title="Nota do treino">${s.nota}</span>` : ''}
        ${s.importado ? '' : `<button class="del" data-del="${s.id}" aria-label="Apagar">✕</button>`}
      </li>`).join('')}</ul>
    </div>`;

  const drawLoad = ex => {
    const pts = ss.filter(s => s.cargas?.[ex] != null);
    $('#loadNote').textContent = pts.length < 2
      ? 'Com um só registro o gráfico ainda é um ponto. Cada treino concluído aqui adiciona um novo ponto.'
      : `${pts.length} registros · de ${fmtKg(pts[0].cargas[ex])} para ${fmtKg(pts[pts.length - 1].cargas[ex])}`;
    const c = charts.find(c => c.canvas.id === 'cLoad'); if (c) { c.destroy(); charts.splice(charts.indexOf(c), 1); }
    charts.push(new Chart($('#cLoad'), {
      type: 'line',
      data: { labels: pts.map(s => fmtDate(s.data)), datasets: [{ data: pts.map(s => s.cargas[ex]), borderColor: acc, backgroundColor: acc, pointRadius: 5, tension: 0.25 }] },
      options: { ...base, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => fmtKg(c.parsed.y) } } } },
    }));
  };
  drawLoad(sel);
  $('#exSel').onchange = e => { history.replaceState(null, '', '#/desempenho?ex=' + e.target.value); drawLoad(e.target.value); };

  // semanas contínuas (inclui as semanas sem treino, com zero)
  const wk = [];
  if (ss.length) for (let d = weekStart(ss[0].data); d <= new Date(); d.setDate(d.getDate() + 7)) wk.push(d.toISOString().slice(0, 10));
  wk.forEach(k => (weeks[k] ||= 0));
  const meta = db.perfil.metaSemanal;
  charts.push(new Chart($('#cFreq'), {
    data: {
      labels: wk.map(k => 'Sem ' + fmtDate(k + 'T12:00:00')),
      datasets: [
        { type: 'bar', data: wk.map(k => weeks[k]), backgroundColor: acc, borderRadius: 6, maxBarThickness: 28 },
        { type: 'line', data: wk.map(() => meta), borderColor: acc2, borderDash: [5, 4], borderWidth: 2, pointRadius: 0 },
      ],
    },
    options: { ...base, scales: { x: { grid: { display: false } }, y: { grid: { color: grid }, beginAtZero: true, suggestedMax: meta + 1, ticks: { stepSize: 1 } } } },
  }));

  view.querySelectorAll('[data-del]').forEach(b => b.onclick = () => {
    if (!confirm('Apagar este treino do histórico?')) return;
    db.sessoes = db.sessoes.filter(s => s.id !== b.dataset.del); save(); renderDesempenho('aba=treinos');
  });
}

function renderPerfPeso({ acc2, base }) {
  const peso = pesoOrdenado();
  const atual = peso[peso.length - 1], inicial = peso[0];
  const info = atual ? imcInfo(atual.kg, db.perfil.altura) : null;
  const diff = atual && inicial ? atual.kg - inicial.kg : 0;
  $('#perf').innerHTML = `
    <div class="card">
      <span class="kicker">Registrar peso</span>
      <form class="inline-form" id="pesoForm">
        <input type="date" id="pesoData" value="${new Date().toISOString().slice(0, 10)}">
        <input inputmode="decimal" id="pesoKg" placeholder="kg">
        <button class="btn primary">Salvar</button>
      </form>
    </div>
    ${atual ? `<section class="stats">
      <div><strong>${fmtNum(atual.kg)}</strong><small>kg atual</small></div>
      <div><strong class="${diff < 0 ? 'ok' : diff > 0 ? 'warn' : ''}">${diff ? (diff > 0 ? '+' : '') + fmtNum(diff) : '0'}</strong><small>kg desde ${fmtDate(inicial.data + 'T12:00:00')}</small></div>
      <div><strong class="t-${info.tom}">${fmtNum(info.imc)}</strong><small>IMC</small></div>
    </section>` : ''}
    <div class="card chart-card">
      <span class="kicker">Evolução do peso</span>
      <small class="muted">Acompanhe sua mudança corporal em kg</small>
      <div class="chart-box"><canvas id="cPeso"></canvas></div>
    </div>
    <div class="card">
      <span class="kicker">Histórico de peso</span>
      <ul class="hist">${[...peso].reverse().map((p, i, arr) => {
        const prev = arr[i + 1]; const d = prev ? p.kg - prev.kg : null;
        return `<li><div class="grow"><strong>${fmtNum(p.kg)} kg</strong><small>${new Date(p.data + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</small></div>
          ${d ? `<span class="${d < 0 ? 'ok' : 'warn'} small">${d > 0 ? '▲' : '▼'} ${fmtNum(Math.abs(d))}</span>` : ''}
          <button class="del" data-delp="${p.data}" aria-label="Apagar">✕</button></li>`;
      }).join('') || '<li class="muted">Nenhum registro ainda.</li>'}</ul>
    </div>`;

  if (peso.length) {
    const kgs = peso.map(p => p.kg);
    charts.push(new Chart($('#cPeso'), {
      type: 'line',
      data: { labels: peso.map(p => fmtDate(p.data + 'T12:00:00')), datasets: [{ data: kgs, borderColor: acc2, backgroundColor: acc2, pointRadius: 5, tension: 0.25 }] },
      options: {
        ...base, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => fmtKg(c.parsed.y) } } },
        scales: { ...base.scales, y: { ...base.scales.y, suggestedMin: Math.floor(Math.min(...kgs) - 2), suggestedMax: Math.ceil(Math.max(...kgs) + 2) } },
      },
    }));
  }
  $('#pesoForm').onsubmit = e => {
    e.preventDefault();
    const kg = parseFloat($('#pesoKg').value.replace(',', '.')), data = $('#pesoData').value;
    if (!kg || !data) return;
    db.peso = db.peso.filter(p => p.data !== data).concat({ data, kg }); save(); toast('Peso registrado'); renderDesempenho('aba=peso');
  };
  view.querySelectorAll('[data-delp]').forEach(b => b.onclick = () => {
    if (!confirm('Apagar este registro de peso?')) return;
    db.peso = db.peso.filter(p => p.data !== b.dataset.delp); save(); renderDesempenho('aba=peso');
  });
}

function ring(value, color) {
  const r = 40, c = 2 * Math.PI * r, off = c * (1 - value / 100);
  return `<svg viewBox="0 0 100 100" class="ring"><circle cx="50" cy="50" r="${r}" class="ring-bg"/>
    <circle cx="50" cy="50" r="${r}" class="ring-fg" style="stroke:${color}" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}" transform="rotate(-90 50 50)"/>
    <text x="50" y="52" class="ring-num">${value}</text><text x="50" y="68" class="ring-sub">/100</text></svg>`;
}
const nivelTxt = v => (v >= 100 ? 'Excelente' : v >= 75 ? 'Avançado' : v >= 50 ? 'Intermediário' : v >= 25 ? 'Em construção' : 'Inicial');

function renderPerfPerfil({ grid, acc, acc2, base }) {
  const p = db.perfil, k = indicadores(), ss = sortedSessions();
  const peso = pesoOrdenado();
  const ini = peso[0], atu = peso[peso.length - 1];
  const dias = Math.max(0, Math.floor((Date.now() - new Date(p.avaliadoEm + 'T12:00:00')) / 864e5));
  const subiram = [...new Set(db.treinos.flatMap(t => t.itens.map(i => i.ex)))].filter(ex => {
    const pts = ss.filter(s => s.cargas?.[ex] != null).map(s => s.cargas[ex]);
    return pts.length > 1 && pts[pts.length - 1] > pts[0];
  }).length;
  const bars = [['Experiência', k.exp, p.experiencia, '#2fd3a4'], ['Execução técnica', k.tec, p.tecnica, '#f5b83d'], ['Composição', k.comp, k.info?.classe || '—', '#9b6bff']];

  $('#perf').innerHTML = `
    ${k.info ? `<div class="card imc-card">
      <div class="imc-box t-${k.info.tom}"><strong>${fmtNum(k.info.imc)}</strong><small>IMC</small></div>
      <div class="grow"><strong>${k.info.classe}</strong><small>${fmtNum(atu.kg)} kg · ${p.altura} cm</small>
      <small class="muted">Calculado com o último peso registrado</small></div>
    </div>` : ''}

    <div class="card">
      <span class="kicker">Score geral de performance</span>
      <small class="muted">Leitura do seu perfil de treino (média de experiência, técnica e composição).</small>
      <div class="score">
        ${ring(k.score, acc)}
        <div class="score-bars">${bars.map(([n, v, l, c]) => `
          <div class="sb"><div class="sb-top"><span>${n}</span><strong>${v}/100</strong></div>
          <div class="sb-track"><span style="width:${v}%;background:${c}"></span></div><small class="muted">${esc(l)}</small></div>`).join('')}
        </div>
      </div>
      <p class="muted small">Quanto mais consistente, mais esse score evolui com você.</p>
    </div>

    <div class="card chart-card">
      <span class="kicker">Indicadores de estilo de vida</span>
      <small class="muted">Os pilares que sustentam sua evolução. Frequência = treinos dos últimos 28 dias ÷ meta (${k.recentes} de ${p.metaSemanal * 4}).</small>
      <div class="chart-box short"><canvas id="cInd"></canvas></div>
    </div>

    <div class="card mind">
      <span class="kicker">Mentalidade</span>
      <small class="muted">O combustível emocional por trás da sua transformação.</small>
      <div class="quote"><small>O que te motiva</small><p>“${esc(p.motivacao)}”</p></div>
      <div class="quote"><small>Seu sonho</small><p>“${esc(p.sonho)}”</p></div>
    </div>

    <div class="card">
      <span class="kicker">Sua evolução desde a avaliação</span>
      <small class="muted">Resultados reais registrados desde ${fmtDate(p.avaliadoEm + 'T12:00:00')} (${dias} dias).</small>
      <div class="evo">
        <div><strong>${ss.length}</strong><small>treinos feitos</small></div>
        <div><strong>${ini && atu ? (atu.kg - ini.kg > 0 ? '+' : '') + fmtNum(atu.kg - ini.kg) + ' kg' : '—'}</strong><small>peso</small></div>
        <div><strong>${ini && atu ? fmtNum(imcInfo(ini.kg, p.altura).imc) + ' → ' + fmtNum(k.info.imc) : '—'}</strong><small>IMC</small></div>
        <div><strong>${subiram}</strong><small>exercícios com carga maior</small></div>
      </div>
    </div>

    <details class="card edit-perfil">
      <summary>✎ Editar perfil e avaliação</summary>
      <form id="perfilForm" class="pf">
        <label>Nome<input name="nome" value="${esc(p.nome)}"></label>
        <label>Idade<input name="idade" inputmode="numeric" value="${p.idade}"></label>
        <label>Altura (cm)<input name="altura" inputmode="numeric" value="${p.altura}"></label>
        <label>Meta de treinos/semana<input name="metaSemanal" inputmode="numeric" value="${p.metaSemanal}"></label>
        <label>Experiência<select name="experiencia">${Object.keys(NIVEIS).map(n => `<option ${n === p.experiencia ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
        <label>Execução técnica<select name="tecnica">${Object.keys(NIVEIS).map(n => `<option ${n === p.tecnica ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
        <label class="full">Objetivo<input name="objetivo" value="${esc(p.objetivo)}"></label>
        <label class="full">O que te motiva<input name="motivacao" value="${esc(p.motivacao)}"></label>
        <label class="full">Seu sonho<textarea name="sonho" rows="3">${esc(p.sonho)}</textarea></label>
        <button class="btn primary full">Salvar perfil</button>
      </form>
    </details>`;

  charts.push(new Chart($('#cInd'), {
    type: 'bar',
    data: { labels: ['Frequência', 'Técnica', 'Composição'], datasets: [{ data: [k.freq, k.tec, k.comp], backgroundColor: [acc, '#f5b83d', '#9b6bff'], borderRadius: 8, maxBarThickness: 48 }] },
    options: { ...base, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => c.parsed.y + '/100' } } }, scales: { x: { grid: { display: false } }, y: { grid: { color: grid }, min: 0, max: 100, ticks: { stepSize: 25 } } } },
  }));

  $('#perfilForm').onsubmit = e => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    Object.assign(db.perfil, f, {
      idade: parseInt(f.idade) || p.idade, altura: parseFloat(String(f.altura).replace(',', '.')) || p.altura,
      metaSemanal: Math.max(1, parseInt(f.metaSemanal) || p.metaSemanal),
    });
    save(); toast('Perfil atualizado'); renderDesempenho('aba=perfil');
  };
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
    <button class="btn ghost" id="restore">Restaurar os 3 treinos originais (mantém o histórico)</button>
    <button class="btn ghost danger" id="reset">Apagar tudo e restaurar dados iniciais</button>`;

  $('#restore').onclick = () => {
    if (!confirm('Voltar os Treinos 1, 2 e 3 para o protocolo original? Trocas e acréscimos serão desfeitos; o histórico continua.')) return;
    db.treinos = JSON.parse(JSON.stringify(SEED_WORKOUTS)); save(); toast('Treinos restaurados'); renderAjustes();
  };

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
  if (sheet) closeSheet();
  if (!['treino', 'exercicios', 'ex'].includes(parts[0])) editMode = false;
  if (parts[0] === 'treino') renderTreino(parts[1]);
  else if (parts[0] === 'sessao') renderSessao();
  else if (parts[0] === 'ex') renderExercicio(parts[1], query);
  else if (parts[0] === 'exercicios' || parts[0] === 'guia') renderExercicios(query);
  else if (parts[0] === 'desempenho') renderDesempenho(query);
  else if (parts[0] === 'ajustes') renderAjustes();
  else renderHome();
}
window.addEventListener('hashchange', route);
route();

if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
