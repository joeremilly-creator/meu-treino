// Biblioteca ampliada: opções extras por músculo para montar/trocar exercícios dos treinos.
// Mesmo formato de exercises.js. 'v' = halter na vertical (pegada neutra).

const GROUP_ORDER = ['Peito', 'Costas', 'Ombros', 'Bíceps', 'Tríceps', 'Quadríceps', 'Posterior e glúteos', 'Panturrilha', 'Abdômen', 'Geral'];

const FRONT_BODY = [[[100, 46], [100, 90]], [[92, 90], [108, 90]], [[92, 90], [90, 120], [90, 150]], [[108, 90], [110, 120], [110, 150]]];
const SEATED_SIDE = [['l', 84, 132, 84, 66], ['r', 80, 126, 40, 6], ['l', 100, 132, 100, 152]];
const EXT_MACHINE = [['l', 66, 124, 70, 74], ['r', 66, 118, 44, 6], ['l', 90, 124, 90, 152]];

Object.assign(EXERCISES, {
  // ---------- Peito ----------
  supino_reto_barra: {
    nome: 'Supino reto com barra', grupo: 'Peito', musc: 'Peitoral, ombros e tríceps',
    props: BENCH,
    S: { h: [60, 118], L: [LYING.torso, [[76, 121], [76, 98], [76, 75]], LYING.leg], P: [['b', 76, 72]] },
    E: { h: [60, 118], L: [LYING.torso, [[76, 121], [68, 134], [76, 112]], LYING.leg], P: [['b', 76, 109]] },
    passos: ['Deite com os olhos abaixo da barra, pés firmes no chão.', 'Pegada um pouco mais larga que os ombros, escápulas encaixadas.', 'Desça a barra controlando até tocar levemente a linha do peito.', 'Empurre de volta até estender os braços.'],
    dicas: ['Não quique a barra no peito.', 'Use alguém de apoio em cargas altas.'],
  },
  crucifixo_halter: {
    nome: 'Crucifixo com halteres', grupo: 'Peito', musc: 'Peitoral', vista: 'de cima (deitado no banco)', ground: false,
    S: { h: [100, 100], L: [[[80, 100], [120, 100]], [[80, 100], [84, 74], [96, 56]], [[120, 100], [116, 74], [104, 56]]], P: [['d', 96, 52], ['d', 104, 60]] },
    E: { h: [100, 100], L: [[[80, 100], [120, 100]], [[80, 100], [52, 98], [28, 106]], [[120, 100], [148, 98], [172, 106]]], P: [['d', 26, 108], ['d', 174, 108]] },
    passos: ['Deitado no banco, halteres acima do peito com palmas viradas uma para a outra.', 'Cotovelos levemente dobrados e fixos.', 'Abra os braços em arco até sentir o peito alongar.', 'Feche o arco de volta como num abraço.'],
    dicas: ['Carga moderada: não é supino, os cotovelos não dobram mais.'],
  },
  flexao: {
    nome: 'Flexão de braço', grupo: 'Peito', musc: 'Peitoral, ombros e tríceps', padrao: { series: 3, reps: 'máx.', descanso: 50 },
    S: { h: [45, 104], L: [[[58, 110], [110, 131], [135, 141], [160, 150]], [[58, 110], [58, 130], [58, 150]]] },
    E: { h: [46, 130], L: [[[60, 136], [110, 141], [135, 146], [160, 150]], [[60, 136], [78, 138], [60, 150]]] },
    passos: ['Mãos no chão um pouco mais abertas que os ombros.', 'Corpo reto da cabeça aos pés, abdômen firme.', 'Desça até o peito quase tocar o chão, cotovelos a ~45°.', 'Empurre o chão e volte estendendo os braços.'],
    dicas: ['Para facilitar, apoie os joelhos no chão.', 'Não deixe o quadril cair.'],
  },
  crossover_polia: {
    nome: 'Crossover na polia', grupo: 'Peito', musc: 'Peitoral', vista: 'de frente',
    props: [['l', 18, 4, 18, 152], ['l', 182, 4, 182, 152]],
    S: { h: [100, 34], L: [...FRONT_BODY, [[86, 52], [114, 52]], [[86, 52], [64, 44], [44, 40]], [[114, 52], [136, 44], [156, 40]]], P: [['k', 18, 10, 44, 40], ['k', 182, 10, 156, 40]] },
    E: { h: [100, 34], L: [...FRONT_BODY, [[86, 52], [114, 52]], [[86, 52], [90, 72], [98, 84]], [[114, 52], [110, 72], [102, 84]]], P: [['k', 18, 10, 98, 84], ['k', 182, 10, 102, 84]] },
    passos: ['Fique no meio do crossover segurando as pegadas das polias altas.', 'Um pé à frente, tronco levemente inclinado.', 'Traga as mãos para frente e para baixo até se encontrarem.', 'Volte abrindo devagar até a linha dos ombros.'],
    dicas: ['Cotovelos levemente dobrados o tempo todo.'],
  },

  // ---------- Costas ----------
  remada_curvada_barra: {
    nome: 'Remada curvada com barra', grupo: 'Costas', musc: 'Dorsais, romboides e lombar',
    S: { h: [128, 62], L: [[[86, 92], [118, 70]], [[118, 72], [118, 96], [118, 118]], [[86, 92], [96, 120], [92, 150]]], P: [['b', 118, 121]] },
    E: { h: [128, 62], L: [[[86, 92], [118, 70]], [[118, 72], [100, 80], [102, 102]], [[86, 92], [96, 120], [92, 150]]], P: [['b', 103, 105]] },
    passos: ['Joelhos levemente dobrados, incline o tronco à frente (~45°) com coluna reta.', 'Barra pendurada com os braços estendidos.', 'Puxe a barra em direção ao umbigo levando os cotovelos para trás.', 'Desça controlando sem arredondar as costas.'],
    dicas: ['Coluna neutra sempre; se arredondar, reduza a carga.'],
  },
  remada_unilateral_halter: {
    nome: 'Remada unilateral com halter (serrote)', grupo: 'Costas', musc: 'Dorsais e romboides',
    props: [['r', 56, 118, 76, 6], ['l', 64, 124, 64, 152], ['l', 124, 124, 124, 152]],
    S: { h: [132, 92], L: [[[80, 96], [118, 98]], [[118, 99], [118, 121], [118, 140]], [[80, 96], [86, 116], [62, 116]]], B: [[[120, 98], [122, 118]], [[80, 96], [74, 124], [74, 150]]], P: [['d', 118, 143]] },
    E: { h: [132, 92], L: [[[80, 96], [118, 98]], [[118, 99], [100, 90], [104, 110]], [[80, 96], [86, 116], [62, 116]]], B: [[[120, 98], [122, 118]], [[80, 96], [74, 124], [74, 150]]], P: [['d', 104, 113]] },
    passos: ['Apoie joelho e mão do mesmo lado no banco; o outro pé no chão.', 'Costas retas, paralelas ao chão, halter pendurado.', 'Puxe o halter até a lateral do abdômen, cotovelo rente ao corpo.', 'Desça estendendo o braço. Faça todas as reps e troque o lado.'],
    dicas: ['Não gire o tronco para subir o peso.'],
  },
  pulldown_braco_estendido: {
    nome: 'Pulldown com braços estendidos', grupo: 'Costas', musc: 'Dorsais',
    props: [['l', 165, 4, 165, 152], ['c', 160, 10, 5]],
    S: { h: [106, 39], L: [[[96, 90], [102, 52]], [[102, 54], [118, 40], [132, 28]], [[96, 90], [98, 120], [98, 150]]], P: [['k', 160, 10, 132, 28]] },
    E: { h: [106, 39], L: [[[96, 90], [102, 52]], [[102, 54], [108, 76], [112, 98]], [[96, 90], [98, 120], [98, 150]]], P: [['k', 160, 10, 112, 98]] },
    passos: ['De frente para a polia alta, segure a barra com braços estendidos.', 'Tronco levemente inclinado, joelhos destravados.', 'Leve a barra até as coxas em arco, sem dobrar os cotovelos.', 'Volte devagar até a altura da cabeça.'],
    dicas: ['O movimento é do ombro, não do cotovelo.'],
  },
  remada_maquina: {
    nome: 'Remada na máquina', grupo: 'Costas', musc: 'Dorsais, romboides e bíceps',
    props: [['r', 60, 118, 40, 6], ['l', 80, 124, 80, 152], ['l', 140, 60, 140, 152]],
    S: { h: [88, 64], L: [[[82, 116], [86, 78]], [[86, 80], [108, 84], [130, 86]], [[82, 116], [110, 120], [112, 150]]], P: [['c', 132, 86, 3]] },
    E: { h: [86, 64], L: [[[82, 116], [84, 78]], [[84, 80], [64, 88], [88, 90]], [[82, 116], [110, 120], [112, 150]]], P: [['c', 90, 90, 3]] },
    passos: ['Ajuste o banco para as pegadas ficarem na altura do peito.', 'Peito apoiado/ereto, braços estendidos.', 'Puxe levando os cotovelos para trás e juntando as escápulas.', 'Volte devagar até estender.'],
    dicas: ['Não jogue o tronco para trás.'],
  },

  // ---------- Ombros ----------
  desenvolvimento_halter: {
    nome: 'Desenvolvimento com halteres', grupo: 'Ombros', musc: 'Deltoides e tríceps',
    props: SEATED_SIDE,
    S: { h: [92, 72], L: [[[90, 124], [90, 86]], [[90, 88], [96, 108], [100, 86]], [[90, 124], [120, 124], [120, 150]]], P: [['d', 100, 83]] },
    E: { h: [92, 72], L: [[[90, 124], [90, 86]], [[90, 88], [94, 64], [96, 40]], [[90, 124], [120, 124], [120, 150]]], P: [['d', 96, 37]] },
    passos: ['Sentado com encosto reto, halteres na altura dos ombros.', 'Palmas para frente, abdômen firme.', 'Empurre os halteres para cima até quase estender os braços.', 'Desça até a altura das orelhas.'],
    dicas: ['Não arqueie a lombar.', 'Não bata os halteres no alto.'],
  },
  elevacao_frontal: {
    nome: 'Elevação frontal com halteres', grupo: 'Ombros', musc: 'Deltoide anterior',
    S: { h: [100, 36], L: [STAND.torso, [[100, 52], [102, 74], [104, 96]], STAND.leg], P: [['d', 104, 99]] },
    E: { h: [100, 36], L: [STAND.torso, [[100, 52], [122, 52], [146, 52]], STAND.leg], P: [['d', 149, 52]] },
    passos: ['Em pé, halteres à frente das coxas.', 'Eleve um braço (ou os dois) à frente até a altura dos ombros.', 'Cotovelos quase estendidos.', 'Desça devagar.'],
    dicas: ['Sem balançar o tronco.'],
  },
  crucifixo_inverso_maquina: {
    nome: 'Crucifixo inverso na máquina', grupo: 'Ombros', musc: 'Deltoide posterior e romboides', vista: 'de cima', ground: false,
    S: { h: [100, 100], L: [[[80, 100], [120, 100]], [[80, 100], [76, 72], [96, 52]], [[120, 100], [124, 72], [104, 52]]], P: [['c', 95, 50, 4], ['c', 105, 50, 4]] },
    E: { h: [100, 100], L: [[[80, 100], [120, 100]], [[80, 100], [52, 94], [26, 100]], [[120, 100], [148, 94], [174, 100]]], P: [['c', 24, 100, 4], ['c', 176, 100, 4]] },
    passos: ['Sente de frente para o encosto (peito apoiado).', 'Segure as pegadas à frente com braços quase estendidos.', 'Abra os braços para trás até a linha do corpo.', 'Volte devagar.'],
    dicas: ['Carga leve: quem trabalha é a parte de trás do ombro.'],
  },
  encolhimento_halter: {
    nome: 'Encolhimento com halteres', grupo: 'Ombros', musc: 'Trapézio', vista: 'de frente',
    S: { h: [100, 34], L: [...FRONT_BODY, [[86, 54], [114, 54]], [[86, 54], [84, 78], [82, 102]], [[114, 54], [116, 78], [118, 102]]], P: [['d', 82, 105], ['d', 118, 105]] },
    E: { h: [100, 34], L: [...FRONT_BODY, [[86, 46], [114, 46]], [[86, 46], [84, 70], [82, 94]], [[114, 46], [116, 70], [118, 94]]], P: [['d', 82, 97], ['d', 118, 97]] },
    passos: ['Em pé, halteres ao lado do corpo, braços estendidos.', 'Suba os ombros em direção às orelhas.', 'Segure 1 segundo no alto.', 'Desça devagar.'],
    dicas: ['Não gire os ombros; o movimento é só para cima e para baixo.'],
  },

  // ---------- Bíceps ----------
  rosca_alternada_halter: {
    nome: 'Rosca alternada com halteres', grupo: 'Bíceps', musc: 'Bíceps',
    S: { h: [100, 36], L: [STAND.torso, [[100, 52], [100, 74], [104, 98]], STAND.leg], B: [[[100, 52], [99, 74], [100, 98]]], P: [['d', 104, 100]] },
    E: { h: [100, 36], L: [STAND.torso, [[100, 52], [100, 74], [118, 58]], STAND.leg], B: [[[100, 52], [99, 74], [100, 98]]], P: [['d', 119, 56]] },
    passos: ['Em pé, halteres ao lado do corpo.', 'Suba um halter girando a palma para cima.', 'Desça controlando e repita com o outro braço.'],
    dicas: ['Cotovelos parados ao lado do corpo.'],
  },
  rosca_martelo: {
    nome: 'Rosca martelo', grupo: 'Bíceps', musc: 'Bíceps e antebraço',
    S: { h: [100, 36], L: [STAND.torso, [[100, 52], [100, 74], [104, 98]], STAND.leg], P: [['v', 104, 100]] },
    E: { h: [100, 36], L: [STAND.torso, [[100, 52], [100, 74], [118, 58]], STAND.leg], P: [['v', 119, 57]] },
    passos: ['Halteres ao lado do corpo com as palmas viradas para dentro.', 'Suba sem girar o punho (pegada neutra).', 'Desça devagar.'],
    dicas: ['Ótimo complemento à rosca direta.'],
  },
  rosca_scott: {
    nome: 'Rosca Scott', grupo: 'Bíceps', musc: 'Bíceps',
    props: [['r', 58, 124, 40, 6], ['l', 78, 130, 78, 152], ['l', 92, 82, 120, 110]],
    S: { h: [86, 70], L: [[[80, 124], [84, 84]], [[86, 86], [110, 98], [126, 118]], [[80, 124], [104, 126], [104, 150]]], P: [['b', 127, 121]] },
    E: { h: [86, 70], L: [[[80, 124], [84, 84]], [[86, 86], [110, 98], [96, 78]], [[80, 124], [104, 126], [104, 150]]], P: [['b', 94, 76]] },
    passos: ['Sente e apoie a parte de trás dos braços no banco Scott.', 'Segure a barra com palmas para cima.', 'Suba a barra até perto dos ombros.', 'Desça devagar sem travar os cotovelos embaixo.'],
    dicas: ['A descida lenta é o que mais trabalha aqui.'],
  },
  rosca_polia: {
    nome: 'Rosca na polia baixa', grupo: 'Bíceps', musc: 'Bíceps',
    props: [['l', 165, 4, 165, 152], ['c', 160, 142, 5]],
    S: { h: [100, 36], L: [STAND.torso, [[100, 52], [100, 74], [106, 96]], STAND.leg], P: [['k', 160, 142, 106, 96], ['l', 102, 96, 112, 96]] },
    E: { h: [100, 36], L: [STAND.torso, [[100, 52], [100, 74], [118, 58]], STAND.leg], P: [['k', 160, 142, 118, 58], ['l', 114, 58, 124, 58]] },
    passos: ['De frente para a polia baixa, barra reta ou W.', 'Cotovelos colados ao corpo.', 'Suba a barra até perto do peito.', 'Desça controlando a tensão do cabo.'],
    dicas: ['O cabo mantém tensão o movimento todo: não precisa de muita carga.'],
  },

  // ---------- Tríceps ----------
  triceps_barra_pulley: {
    nome: 'Tríceps barra no pulley', grupo: 'Tríceps', musc: 'Tríceps',
    props: [['l', 160, 4, 160, 152], ['c', 152, 10, 5]],
    S: { h: [106, 39], L: [[[98, 90], [102, 52]], [[102, 54], [104, 76], [124, 66]], [[98, 90], [98, 120], [98, 150]]], P: [['k', 152, 10, 124, 66], ['l', 118, 66, 130, 66]] },
    E: { h: [106, 39], L: [[[98, 90], [102, 52]], [[102, 54], [104, 76], [110, 100]], [[98, 90], [98, 120], [98, 150]]], P: [['k', 152, 10, 110, 100], ['l', 104, 100, 116, 100]] },
    passos: ['De frente para o pulley, barra na altura do peito.', 'Cotovelos colados ao corpo.', 'Empurre a barra para baixo até estender os braços.', 'Volte até 90° sem mexer os cotovelos.'],
    dicas: ['Punhos firmes, sem dobrar.'],
  },
  triceps_frances_halter: {
    nome: 'Tríceps francês com halter', grupo: 'Tríceps', musc: 'Tríceps (cabeça longa)',
    S: { h: [100, 36], L: [STAND.torso, [[100, 52], [102, 28], [104, 6]], STAND.leg], P: [['v', 104, 4]] },
    E: { h: [100, 36], L: [STAND.torso, [[100, 52], [102, 28], [86, 46]], STAND.leg], P: [['v', 84, 48]] },
    passos: ['Em pé ou sentado, segure um halter com as duas mãos acima da cabeça.', 'Cotovelos apontados para cima, perto da cabeça.', 'Desça o halter atrás da cabeça dobrando os cotovelos.', 'Estenda os braços de volta.'],
    dicas: ['Abdômen firme para não arquear a lombar.'],
  },
  mergulho_banco: {
    nome: 'Mergulho no banco', grupo: 'Tríceps', musc: 'Tríceps e peitoral', padrao: { series: 3, reps: 'máx.', descanso: 50 },
    props: [['r', 40, 110, 42, 6], ['l', 46, 116, 46, 152], ['l', 76, 116, 76, 152]],
    S: { h: [85, 50], L: [[[86, 102], [82, 64]], [[82, 64], [80, 87], [78, 110]], [[86, 102], [116, 122], [144, 148]]] },
    E: { h: [87, 70], L: [[[88, 122], [84, 84]], [[84, 84], [64, 92], [78, 110]], [[88, 122], [116, 134], [144, 148]]] },
    passos: ['Mãos na borda do banco atrás do corpo, pernas à frente.', 'Desça dobrando os cotovelos para trás até ~90°.', 'Empurre o banco e suba estendendo os braços.'],
    dicas: ['Mais fácil com joelhos dobrados; mais difícil com pernas esticadas.', 'Se incomodar o ombro, não desça tanto.'],
  },

  // ---------- Quadríceps ----------
  cadeira_extensora: {
    nome: 'Cadeira extensora', grupo: 'Quadríceps', musc: 'Quadríceps',
    props: EXT_MACHINE,
    S: { h: [80, 64], L: [[[80, 116], [78, 78]], [[78, 80], [82, 100], [90, 116]], [[80, 116], [110, 118], [110, 148]]], P: [['c', 112, 144, 4]] },
    E: { h: [80, 64], L: [[[80, 116], [78, 78]], [[78, 80], [82, 100], [90, 116]], [[80, 116], [110, 118], [140, 112]]], P: [['c', 142, 116, 4]] },
    passos: ['Costas apoiadas, joelho alinhado ao eixo da máquina.', 'Apoio da perna acima do tornozelo.', 'Estenda as pernas até quase travar e segure 1 segundo.', 'Desça devagar.'],
    dicas: ['Segure nas pegadas para o quadril não sair do banco.'],
  },
  agachamento_goblet: {
    nome: 'Agachamento goblet (com halter)', grupo: 'Quadríceps', musc: 'Quadríceps e glúteos',
    S: { h: [102, 36], L: [STAND.torso, [[100, 52], [110, 70], [108, 58]], [[100, 90], [102, 120], [104, 150]]], P: [['v', 111, 60]] },
    E: { h: [103, 64], L: [[[82, 114], [98, 78]], [[98, 80], [110, 94], [110, 80]], [[82, 114], [112, 120], [106, 150]]], P: [['v', 113, 82]] },
    passos: ['Segure um halter na vertical junto ao peito.', 'Pés um pouco mais abertos que os ombros, pontas levemente para fora.', 'Desça entre as pernas mantendo o peito aberto.', 'Suba empurrando o chão.'],
    dicas: ['Ótimo para aprender o agachamento com a coluna reta.'],
  },

  // ---------- Posterior e glúteos ----------
  mesa_flexora: {
    nome: 'Mesa flexora', grupo: 'Posterior e glúteos', musc: 'Posteriores da coxa',
    props: [['r', 30, 112, 112, 6], ['l', 50, 118, 50, 152], ['l', 120, 118, 120, 152]],
    S: { h: [38, 100], L: [[[50, 106], [92, 108]], [[52, 107], [40, 112], [30, 108]], [[92, 108], [122, 108], [152, 108]]], P: [['c', 150, 102, 4]] },
    E: { h: [38, 100], L: [[[50, 106], [92, 108]], [[52, 107], [40, 112], [30, 108]], [[92, 108], [122, 108], [110, 80]]], P: [['c', 114, 82, 4]] },
    passos: ['Deite de bruços com o apoio logo acima dos calcanhares.', 'Joelhos um pouco para fora do banco.', 'Dobre os joelhos trazendo os calcanhares em direção ao glúteo.', 'Desça devagar.'],
    dicas: ['Quadril colado no banco durante todo o movimento.'],
  },
  cadeira_flexora: {
    nome: 'Cadeira flexora', grupo: 'Posterior e glúteos', musc: 'Posteriores da coxa',
    props: EXT_MACHINE,
    S: { h: [80, 64], L: [[[80, 116], [78, 78]], [[78, 80], [82, 100], [90, 116]], [[80, 116], [110, 118], [140, 112]]], P: [['c', 142, 118, 4], ['r', 90, 108, 22, 5]] },
    E: { h: [80, 64], L: [[[80, 116], [78, 78]], [[78, 80], [82, 100], [90, 116]], [[80, 116], [110, 118], [100, 146]]], P: [['c', 104, 146, 4], ['r', 90, 108, 22, 5]] },
    passos: ['Sente com as costas apoiadas e trave as coxas com o apoio superior.', 'Apoio inferior logo acima dos calcanhares.', 'Puxe os calcanhares para baixo e para trás.', 'Volte devagar até quase estender.'],
    dicas: ['Não tire o quadril do banco.'],
  },
  stiff_halter: {
    nome: 'Stiff com halteres', grupo: 'Posterior e glúteos', musc: 'Posteriores da coxa, glúteos e lombar',
    S: { h: [101, 36], L: [STAND.torso, [[100, 52], [101, 74], [102, 96]], [[100, 90], [101, 120], [100, 150]]], P: [['d', 102, 99]] },
    E: { h: [140, 70], L: [[[90, 90], [128, 78]], [[128, 78], [128, 100], [128, 122]], [[90, 90], [96, 120], [100, 150]]], P: [['d', 128, 125]] },
    passos: ['Em pé, halteres à frente das coxas, joelhos levemente destravados.', 'Leve o quadril para trás descendo os halteres rente às pernas.', 'Desça até sentir alongar a parte de trás da coxa (meio da canela).', 'Suba contraindo o glúteo.'],
    dicas: ['Coluna reta sempre: o movimento é do quadril.'],
  },
  elevacao_pelvica: {
    nome: 'Elevação pélvica', grupo: 'Posterior e glúteos', musc: 'Glúteos',
    props: [['r', 30, 110, 40, 6], ['l', 50, 116, 50, 152]],
    S: { h: [52, 104], L: [[[64, 108], [96, 138]], [[64, 110], [80, 126], [96, 134]], [[96, 138], [124, 118], [128, 150]]], P: [['b', 98, 132]] },
    E: { h: [52, 104], L: [[[64, 108], [100, 108]], [[64, 110], [82, 112], [98, 103]], [[100, 108], [128, 112], [130, 150]]], P: [['b', 100, 101]] },
    passos: ['Parte de cima das costas apoiada no banco, pés firmes no chão.', 'Barra ou halter sobre o quadril (use uma proteção).', 'Suba o quadril até o tronco ficar alinhado às coxas.', 'Contraia o glúteo 1 segundo e desça.'],
    dicas: ['Queixo levemente recolhido; não arqueie a lombar no alto.'],
  },
  abducao_maquina: {
    nome: 'Cadeira abdutora', grupo: 'Posterior e glúteos', musc: 'Glúteo médio', vista: 'de frente',
    props: [['r', 82, 96, 36, 6]],
    S: { h: [100, 36], L: [[[100, 48], [100, 96]], [[88, 54], [112, 54]], [[88, 54], [84, 76], [86, 96]], [[112, 54], [116, 76], [114, 96]], [[94, 100], [94, 124], [94, 150]], [[106, 100], [106, 124], [106, 150]]], P: [['c', 88, 122, 4], ['c', 112, 122, 4]] },
    E: { h: [100, 36], L: [[[100, 48], [100, 96]], [[88, 54], [112, 54]], [[88, 54], [84, 76], [86, 96]], [[112, 54], [116, 76], [114, 96]], [[94, 100], [76, 122], [78, 150]], [[106, 100], [124, 122], [122, 150]]], P: [['c', 70, 120, 4], ['c', 130, 120, 4]] },
    passos: ['Sente com as costas apoiadas e os apoios na parte de fora dos joelhos.', 'Abra as pernas o máximo que conseguir.', 'Segure 1 segundo e feche devagar.'],
    dicas: ['Inclinar o tronco um pouco à frente aumenta o trabalho do glúteo.'],
  },
  gluteo_polia: {
    nome: 'Glúteo na polia (coice)', grupo: 'Posterior e glúteos', musc: 'Glúteo máximo',
    props: [['l', 150, 40, 150, 152], ['c', 146, 144, 5]],
    S: { h: [114, 38], L: [[[100, 90], [110, 52]], [[110, 54], [126, 66], [148, 70]], [[100, 90], [102, 120], [100, 146]]], B: [[[100, 90], [98, 120], [96, 150]]], P: [['k', 146, 144, 100, 146]] },
    E: { h: [114, 38], L: [[[100, 90], [110, 52]], [[110, 54], [126, 66], [148, 70]], [[100, 90], [80, 112], [62, 132]]], B: [[[100, 90], [98, 120], [96, 150]]], P: [['k', 146, 144, 62, 132]] },
    passos: ['Prenda a tornozeleira na polia baixa e segure no aparelho.', 'Tronco levemente inclinado, abdômen firme.', 'Leve a perna para trás estendendo o quadril.', 'Volte devagar sem apoiar o pé.'],
    dicas: ['Não arqueie a lombar para subir mais a perna.'],
  },

  // ---------- Panturrilha ----------
  panturrilha_em_pe: {
    nome: 'Panturrilha em pé', grupo: 'Panturrilha', musc: 'Panturrilhas', padrao: { series: 3, reps: '15', descanso: 40 },
    props: [['r', 104, 140, 36, 12]],
    S: { h: [100, 34], L: [[[100, 86], [100, 48]], [[100, 50], [100, 72], [102, 94]], [[100, 86], [100, 116], [100, 146], [112, 140]]] },
    E: { h: [100, 18], L: [[[100, 70], [100, 32]], [[100, 34], [100, 56], [102, 78]], [[100, 70], [102, 100], [104, 130], [112, 140]]] },
    passos: ['Ponta dos pés na borda de um degrau ou step, calcanhares para fora.', 'Desça os calcanhares alongando a panturrilha.', 'Suba na ponta dos pés o máximo possível.', 'Segure 1 segundo e desça devagar.'],
    dicas: ['Pode segurar em algo para equilíbrio ou usar halter.'],
  },
  panturrilha_sentado: {
    nome: 'Panturrilha sentado', grupo: 'Panturrilha', musc: 'Sóleo (panturrilha)', padrao: { series: 3, reps: '15', descanso: 40 },
    props: [['r', 60, 110, 40, 6], ['l', 80, 116, 80, 152], ['r', 116, 138, 22, 8]],
    S: { h: [82, 56], L: [[[80, 108], [80, 70]], [[80, 72], [92, 90], [104, 100]], [[80, 108], [110, 108], [110, 142], [120, 136]]], P: [['r', 98, 100, 22, 6]] },
    E: { h: [82, 56], L: [[[80, 108], [80, 70]], [[80, 72], [92, 88], [104, 90]], [[80, 108], [110, 98], [112, 130], [120, 136]]], P: [['r', 98, 90, 22, 6]] },
    passos: ['Sente com o apoio sobre as coxas, perto dos joelhos.', 'Ponta dos pés na plataforma, calcanhares livres.', 'Suba os calcanhares o máximo possível.', 'Desça alongando bem.'],
    dicas: ['Trabalha a parte mais profunda da panturrilha.'],
  },

  // ---------- Abdômen ----------
  abdominal_supra: {
    nome: 'Abdominal supra (no chão)', grupo: 'Abdômen', musc: 'Reto abdominal', padrao: { series: 3, reps: '20', descanso: 40 },
    S: { h: [46, 138], L: [[[58, 144], [96, 146]], [[58, 143], [48, 128], [40, 134]], [[96, 146], [116, 122], [132, 148]]] },
    E: { h: [58, 118], L: [[[96, 146], [66, 126]], [[66, 126], [56, 112], [50, 118]], [[96, 146], [116, 122], [132, 148]]] },
    passos: ['Deitado, joelhos dobrados e pés no chão.', 'Mãos atrás da cabeça ou cruzadas no peito.', 'Suba o tronco tirando as escápulas do chão.', 'Desça devagar sem relaxar totalmente.'],
    dicas: ['Não puxe a cabeça com as mãos.'],
  },
  prancha_lateral: {
    nome: 'Prancha lateral', grupo: 'Abdômen', musc: 'Oblíquos e core', labels: ['Correto', 'Evite'], padrao: { series: 3, reps: '20 s cada lado', descanso: 40 },
    S: { h: [160, 116], L: [[[148, 126], [100, 138], [74, 144], [48, 150]], [[148, 126], [148, 150], [168, 150]]], B: [[[148, 126], [128, 128], [104, 134]]] },
    E: { h: [160, 116], L: [[[148, 126], [100, 148], [74, 150], [48, 150]], [[148, 126], [148, 150], [168, 150]]], B: [[[148, 126], [128, 132], [104, 144]]], P: [['x', 100, 148]] },
    passos: ['Deite de lado, antebraço no chão abaixo do ombro.', 'Pernas estendidas, um pé sobre o outro.', 'Suba o quadril até o corpo ficar reto.', 'Segure o tempo indicado e troque o lado.'],
    dicas: ['Não deixe o quadril cair.'],
  },
});

// Reclassificação dos exercícios do protocolo original por músculo
Object.assign(EXERCISES.agachamento_smith, { grupo: 'Quadríceps' });
Object.assign(EXERCISES.leg_press, { grupo: 'Quadríceps' });
Object.assign(EXERCISES.agachamento_unilateral_halter, { grupo: 'Quadríceps' });
Object.assign(EXERCISES.panturrilha_leg, { grupo: 'Panturrilha', padrao: { series: 3, reps: '15', descanso: 40 } });
Object.assign(EXERCISES.rosca_direta_barra, { grupo: 'Bíceps' });
Object.assign(EXERCISES.triceps_corda, { grupo: 'Tríceps' });
Object.assign(EXERCISES.triceps_testa_halter, { grupo: 'Tríceps' });
Object.assign(EXERCISES.prancha, { padrao: { series: 3, reps: '30 s', descanso: 50 } });
Object.assign(EXERCISES.abd_perna_esticada, { padrao: { series: 3, reps: 'máx.', descanso: 50 } });
Object.assign(EXERCISES.abd_crunch_maquina, { padrao: { series: 3, reps: '15', descanso: 50 } });
Object.assign(EXERCISES.aquecimento, { padrao: { series: 1, reps: '3 a 5 min', descanso: 0 } });
Object.assign(EXERCISES.cardio, { padrao: { series: 1, reps: '15 min', descanso: 0 } });
