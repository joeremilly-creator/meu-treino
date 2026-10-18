// Protocolo e histórico importados do app anterior (Protocolo "Para Crescer e Secar").
// Usados só na primeira abertura; depois tudo fica salvo no aparelho (localStorage).

const SEED_WORKOUTS = [
  {
    id: 't1', nome: 'Treino 1', foco: 'Aquecimento + força + cardio',
    itens: [
      { ex: 'aquecimento', series: 1, reps: '3 a 5 min', descanso: 0 },
      { ex: 'abd_crunch_maquina', series: 3, reps: '15', descanso: 50 },
      { ex: 'agachamento_smith', series: 3, reps: '12', descanso: 50 },
      { ex: 'puxada_aberta', series: 3, reps: '12', descanso: 50 },
      { ex: 'supino_reto_halter', series: 3, reps: '12', descanso: 50 },
      { ex: 'rosca_direta_barra', series: 3, reps: '12', descanso: 50 },
      { ex: 'triceps_corda', series: 3, reps: '12', descanso: 50 },
      { ex: 'cardio', series: 1, reps: '15 min', descanso: 0 },
    ],
  },
  {
    id: 't2', nome: 'Treino 2', foco: 'Aquecimento + força + cardio',
    itens: [
      { ex: 'aquecimento', series: 1, reps: '3 a 5 min', descanso: 0 },
      { ex: 'prancha', series: 3, reps: '30 s', descanso: 50 },
      { ex: 'leg_press', series: 3, reps: '12', descanso: 50 },
      { ex: 'panturrilha_leg', series: 3, reps: '15', descanso: 50 },
      { ex: 'remada_baixa_triangulo', series: 3, reps: '12', descanso: 50 },
      { ex: 'supino_inclinado_maquina', series: 3, reps: '12', descanso: 50 },
      { ex: 'elevacao_lateral', series: 3, reps: '12', descanso: 50 },
      { ex: 'cardio', series: 1, reps: '15 min', descanso: 0 },
    ],
  },
  {
    id: 't3', nome: 'Treino 3', foco: 'Aquecimento + força + cardio',
    itens: [
      { ex: 'aquecimento', series: 1, reps: '3 a 5 min', descanso: 0 },
      { ex: 'abd_perna_esticada', series: 3, reps: 'máx.', descanso: 50 },
      { ex: 'agachamento_unilateral_halter', series: 3, reps: '12', descanso: 50 },
      { ex: 'puxada_fechada', series: 3, reps: '12', descanso: 50 },
      { ex: 'crucifixo_maquina', series: 3, reps: '12', descanso: 50 },
      { ex: 'desenvolvimento_maquina', series: 3, reps: '12', descanso: 50 },
      { ex: 'triceps_testa_halter', series: 3, reps: '12', descanso: 50 },
      { ex: 'cardio', series: 1, reps: '15 min', descanso: 0 },
    ],
  },
];

// O app anterior só guardava a última carga de cada exercício; ela foi atribuída
// à última sessão concluída de cada treino.
const SEED_SESSIONS = [
  { id: 'imp-1', treino: 't1', data: '2026-09-15T09:00:00', duracao: 557, importado: true, cargas: {} },
  { id: 'imp-2', treino: 't2', data: '2026-09-18T09:00:00', duracao: 433, importado: true, cargas: {} },
  { id: 'imp-3', treino: 't1', data: '2026-09-22T09:00:00', duracao: 322, importado: true, cargas: {} },
  { id: 'imp-4', treino: 't2', data: '2026-09-24T09:23:00', duracao: 1444, importado: true,
    cargas: { leg_press: 200, panturrilha_leg: 240, remada_baixa_triangulo: 50, supino_inclinado_maquina: 40, elevacao_lateral: 8 } },
  { id: 'imp-5', treino: 't1', data: '2026-10-08T09:28:00', duracao: 565, importado: true,
    cargas: { agachamento_smith: 60, puxada_aberta: 50, supino_reto_halter: 16, rosca_direta_barra: 25, triceps_corda: 50 } },
  { id: 'imp-6', treino: 't3', data: '2026-10-15T09:07:00', duracao: 1274, importado: true,
    cargas: { crucifixo_maquina: 50, desenvolvimento_maquina: 40, triceps_testa_halter: 15 } },
];

// 13/09 = peso no início (data da avaliação), informado depois pelo Joe
const SEED_BODYWEIGHT = [{ data: '2026-09-13', kg: 114.6 }, { data: '2026-10-08', kg: 104.4 }];

// Avaliação inicial (questionário de 13/09/2026 no app anterior)
const SEED_PERFIL = {
  nome: 'Joe', idade: 39, altura: 177, sexo: 'Homem', objetivo: 'Crescer e Secar', avaliadoEm: '2026-09-13',
  experiencia: 'Intermediário', tecnica: 'Intermediário', metaSemanal: 3,
  motivacao: 'Autoestima',
  sonho: 'Alguém que passa credibilidade no que fala, já que o seu próprio corpo está bem.',
};

// Nota (0–10) e esforço (1 leve, 2 moderado, 3 intenso) das sessões importadas
const SEED_SESSION_META = {
  'imp-1': { nota: 5, esforco: 3 }, 'imp-2': { nota: 10, esforco: 3 }, 'imp-3': { nota: 10, esforco: 3 },
  'imp-4': { nota: 10, esforco: 3 }, 'imp-5': { nota: 10, esforco: 3 }, 'imp-6': { nota: 10, esforco: 3 },
};
