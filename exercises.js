// Biblioteca de exercícios: infográfico (pose inicial → pose final) + passo a passo.
// Poses em viewBox 200x160, vista lateral olhando para a direita (salvo indicação).
// h = cabeça [x,y]; L = membros do lado de frente (polilinhas); B = membros do lado de trás (mais claros);
// P = aparelhos da pose. Props: ['r',x,y,w,h] retângulo, ['l',x1,y1,x2,y2] linha,
// ['c',x,y,r] círculo, ['d',x,y] halter, ['b',x,y] anilha/barra, ['k',x1,y1,x2,y2] cabo.

const STAND = { torso: [[100, 90], [100, 50]], leg: [[100, 90], [100, 120], [100, 150]] };
const BENCH = [['r', 50, 126, 78, 6], ['l', 58, 132, 58, 152], ['l', 120, 132, 120, 152]];
const LYING = { torso: [[74, 121], [114, 122]], leg: [[114, 122], [140, 112], [146, 150]] };
const PULLDOWN_BASE = [['r', 70, 112, 40, 6], ['l', 90, 118, 90, 152], ['r', 116, 96, 14, 7]];

const EXERCISES = {
  aquecimento: {
    nome: 'Aquecimento', grupo: 'Geral', musc: 'Corpo todo',
    labels: ['Passada', 'Alterna'],
    S: { h: [103, 36], L: [[[100, 90], [101, 50]], [[101, 52], [110, 72], [122, 80]], [[100, 90], [112, 118], [120, 148]]], B: [[[101, 52], [92, 72], [86, 92]], [[100, 90], [92, 120], [80, 146]]] },
    E: { h: [103, 36], L: [[[100, 90], [101, 50]], [[101, 52], [92, 72], [86, 92]], [[100, 90], [92, 120], [80, 146]]], B: [[[101, 52], [110, 72], [122, 80]], [[100, 90], [112, 118], [120, 148]]] },
    passos: ['3 a 5 min de caminhada rápida, bike ou elíptico em ritmo leve.', 'Gire ombros e quadril (10 voltas para cada lado).', 'Faça 1 série leve do primeiro exercício de força antes da carga de trabalho.'],
    dicas: ['Objetivo é aquecer, não cansar: dá para conversar durante.'],
  },
  abd_crunch_maquina: {
    nome: 'Abdominal crunch na máquina', grupo: 'Abdômen', musc: 'Reto abdominal',
    props: [['r', 66, 110, 50, 7], ['l', 72, 110, 64, 48], ['l', 90, 117, 90, 152]],
    S: { h: [78, 48], L: [[[90, 108], [80, 62]], [[80, 64], [96, 72], [92, 58]], [[90, 108], [122, 108], [122, 148]]] },
    E: { h: [118, 66], L: [[[90, 108], [108, 74]], [[108, 76], [118, 92], [114, 78]], [[90, 108], [122, 108], [122, 148]]] },
    passos: ['Ajuste o banco para as pegadas ficarem na altura do peito e segure firme.', 'Expire e "enrole" o tronco para frente, aproximando costelas do quadril.', 'Segure 1 segundo contraindo o abdômen.', 'Volte devagar sem deixar o peso encostar.'],
    dicas: ['Quem faz a força é o abdômen, não os braços.', 'Não puxe com o pescoço; queixo levemente recolhido.'],
  },
  agachamento_smith: {
    nome: 'Agachamento no smith', grupo: 'Pernas', musc: 'Quadríceps e glúteos',
    props: [['l', 100, 8, 100, 152]],
    S: { h: [103, 38], L: [[[100, 90], [100, 52]], [[100, 54], [88, 62], [96, 50]], [[100, 90], [106, 120], [108, 150]]], P: [['b', 100, 50]] },
    E: { h: [108, 62], L: [[[80, 110], [102, 76]], [[102, 78], [88, 86], [98, 74]], [[80, 110], [110, 118], [108, 150]]], P: [['b', 100, 74]] },
    passos: ['Barra apoiada no trapézio (não no pescoço), pés um pouco à frente da linha da barra.', 'Destrave a barra e desça empurrando o quadril para trás, como se fosse sentar.', 'Desça até a coxa ficar paralela ao chão, joelhos alinhados com as pontas dos pés.', 'Suba empurrando o chão com o pé inteiro.'],
    dicas: ['Não deixe os joelhos caírem para dentro.', 'Calcanhar sempre no chão; coluna neutra.'],
  },
  puxada_aberta: {
    nome: 'Puxada frontal aberta', grupo: 'Costas', musc: 'Dorsais e bíceps',
    props: PULLDOWN_BASE,
    S: { h: [99, 56], L: [[[95, 110], [97, 70]], [[97, 72], [104, 48], [108, 24]], [[95, 110], [125, 110], [125, 148]]], P: [['l', 86, 22, 130, 22], ['k', 108, 2, 108, 22]] },
    E: { h: [95, 57], L: [[[95, 110], [92, 71]], [[92, 73], [84, 92], [102, 70]], [[95, 110], [125, 110], [125, 148]]], P: [['l', 82, 68, 126, 68], ['k', 108, 2, 104, 68]] },
    passos: ['Pegada aberta (mais larga que os ombros), coxas presas sob o apoio.', 'Peito aberto, tronco levemente inclinado para trás.', 'Puxe a barra até a parte de cima do peito levando os cotovelos para baixo e para trás.', 'Volte controlando até esticar os braços.'],
    dicas: ['Não puxe atrás da nuca.', 'Evite balançar o tronco para ajudar.'],
  },
  supino_reto_halter: {
    nome: 'Supino reto com halteres', grupo: 'Peito', musc: 'Peitoral, ombros e tríceps',
    props: BENCH,
    S: { h: [60, 118], L: [LYING.torso, [[76, 121], [76, 98], [76, 75]], LYING.leg], P: [['d', 76, 72]] },
    E: { h: [60, 118], L: [LYING.torso, [[76, 121], [68, 134], [78, 110]], LYING.leg], P: [['d', 78, 107]] },
    passos: ['Deite no banco com os pés firmes no chão e escápulas "encaixadas" para trás.', 'Comece com os halteres acima do peito, braços estendidos.', 'Desça abrindo os cotovelos a ~45° do corpo até os halteres ficarem na linha do peito.', 'Empurre para cima aproximando os halteres no topo.'],
    dicas: ['Não bata os halteres no topo.', 'Controle a descida (2 segundos).'],
  },
  rosca_direta_barra: {
    nome: 'Rosca direta com barra', grupo: 'Braços', musc: 'Bíceps',
    S: { h: [100, 36], L: [STAND.torso, [[100, 52], [100, 74], [104, 98]], STAND.leg], P: [['b', 106, 98]] },
    E: { h: [100, 36], L: [STAND.torso, [[100, 52], [100, 74], [118, 58]], STAND.leg], P: [['b', 120, 56]] },
    passos: ['Em pé, pés na largura do quadril, pegada supinada (palmas para frente).', 'Cotovelos colados ao lado do corpo.', 'Suba a barra até perto dos ombros contraindo o bíceps.', 'Desça devagar até quase estender os braços.'],
    dicas: ['Não jogue o tronco para trás para subir a barra.', 'Cotovelos parados: só o antebraço se move.'],
  },
  triceps_corda: {
    nome: 'Tríceps corda no pulley', grupo: 'Braços', musc: 'Tríceps',
    props: [['l', 160, 4, 160, 152], ['c', 152, 10, 5]],
    S: { h: [106, 39], L: [[[98, 90], [102, 52]], [[102, 54], [104, 76], [124, 66]], [[98, 90], [98, 120], [98, 150]]], P: [['k', 152, 10, 124, 66]] },
    E: { h: [106, 39], L: [[[98, 90], [102, 52]], [[102, 54], [104, 76], [110, 100]], [[98, 90], [98, 120], [98, 150]]], P: [['k', 152, 10, 110, 100]] },
    passos: ['De frente para o pulley, tronco levemente inclinado à frente.', 'Cotovelos colados ao corpo, corda na altura do peito.', 'Estenda os braços para baixo e abra a corda no final.', 'Volte até 90° nos cotovelos sem tirar os cotovelos do lugar.'],
    dicas: ['Se os ombros se mexem, a carga está alta demais.'],
  },
  cardio: {
    nome: 'Cardio (esteira, bike ou elíptico)', grupo: 'Geral', musc: 'Cardiorrespiratório',
    props: [['c', 70, 134, 16], ['c', 142, 134, 16], ['l', 70, 134, 104, 124], ['l', 104, 124, 142, 134], ['l', 104, 124, 90, 92], ['l', 104, 124, 128, 74], ['l', 82, 92, 96, 92], ['l', 128, 74, 134, 74]],
    S: { h: [121, 48], L: [[[90, 90], [112, 58]], [[112, 60], [124, 70], [132, 74]], [[90, 90], [110, 98], [112, 132]]], B: [[[90, 90], [106, 90], [98, 114]]] },
    E: { h: [121, 48], L: [[[90, 90], [112, 58]], [[112, 60], [124, 70], [132, 74]], [[90, 90], [106, 90], [98, 114]]], B: [[[90, 90], [110, 98], [112, 132]]] },
    passos: ['15 minutos em ritmo moderado (respiração ofegante, mas consegue falar frases curtas).', 'Escolha esteira inclinada, bike ou elíptico.', 'Últimos 2 minutos mais leves para desacelerar.'],
    dicas: ['Feito depois da musculação ajuda na queima de gordura sem atrapalhar a força.'],
  },
  prancha: {
    nome: 'Prancha abdominal', grupo: 'Abdômen', musc: 'Core (abdômen e lombar)',
    labels: ['Correto', 'Evite'],
    S: { h: [48, 122], L: [[[62, 127], [110, 132]], [[62, 128], [62, 150], [40, 150]], [[110, 132], [135, 141], [160, 150]]] },
    E: { h: [48, 122], L: [[[62, 127], [110, 143]], [[62, 128], [62, 150], [40, 150]], [[110, 143], [135, 148], [160, 150]]], P: [['x', 110, 143]] },
    passos: ['Antebraços no chão, cotovelos abaixo dos ombros.', 'Pernas estendidas, apoio na ponta dos pés.', 'Contraia abdômen e glúteos: corpo reto da cabeça aos calcanhares.', 'Segure o tempo indicado respirando normalmente.'],
    dicas: ['Quadril caído sobrecarrega a lombar.', 'Quadril alto demais tira o trabalho do abdômen.'],
  },
  leg_press: {
    nome: 'Leg press', grupo: 'Pernas', musc: 'Quadríceps e glúteos',
    props: [['l', 48, 92, 76, 132], ['l', 76, 132, 100, 132], ['l', 92, 136, 172, 46], ['l', 100, 132, 100, 152]],
    S: { h: [45, 86], L: [[[82, 126], [58, 98]], [[60, 100], [74, 110], [86, 106]], [[82, 126], [110, 100], [130, 76]]], P: [['l', 120, 64, 142, 86]] },
    E: { h: [45, 86], L: [[[82, 126], [58, 98]], [[60, 100], [74, 110], [86, 106]], [[82, 126], [86, 88], [110, 100]]], P: [['l', 100, 88, 122, 110]] },
    passos: ['Costas e quadril totalmente apoiados no encosto.', 'Pés na largura dos ombros no meio da plataforma.', 'Destrave e desça até os joelhos formarem ~90°.', 'Empurre com o pé inteiro sem travar os joelhos no final.'],
    dicas: ['Não deixe o quadril sair do banco na descida.', 'Joelhos seguem a direção das pontas dos pés.'],
  },
  panturrilha_leg: {
    nome: 'Panturrilha no leg press', grupo: 'Pernas', musc: 'Panturrilhas',
    props: [['l', 48, 92, 76, 132], ['l', 76, 132, 100, 132], ['l', 92, 136, 172, 46], ['l', 100, 132, 100, 152]],
    S: { h: [45, 86], L: [[[82, 126], [58, 98]], [[60, 100], [74, 110], [86, 106]], [[82, 126], [110, 100], [128, 80], [134, 70]]], P: [['l', 124, 60, 146, 82]] },
    E: { h: [45, 86], L: [[[82, 126], [58, 98]], [[60, 100], [74, 110], [86, 106]], [[82, 126], [110, 100], [128, 80], [140, 66]]], P: [['l', 130, 56, 152, 78]] },
    passos: ['Pernas estendidas (sem travar), só a ponta dos pés na borda da plataforma.', 'Deixe o calcanhar descer alongando a panturrilha.', 'Empurre com a ponta dos pés o máximo que conseguir.', 'Segure 1 segundo no alto e desça devagar.'],
    dicas: ['Amplitude completa vale mais que carga alta.', 'Mantenha a trava de segurança à mão.'],
  },
  remada_baixa_triangulo: {
    nome: 'Remada baixa com triângulo', grupo: 'Costas', musc: 'Dorsais, romboides e bíceps',
    props: [['r', 55, 128, 50, 6], ['l', 142, 112, 142, 140], ['c', 168, 112, 5]],
    S: { h: [86, 76], L: [[[80, 128], [84, 90]], [[84, 92], [106, 98], [128, 104]], [[80, 128], [110, 112], [140, 128]]], P: [['k', 168, 112, 130, 104]] },
    E: { h: [82, 76], L: [[[80, 128], [80, 90]], [[80, 92], [62, 100], [88, 104]], [[80, 128], [110, 112], [140, 128]]], P: [['k', 168, 112, 90, 104]] },
    passos: ['Sente com os pés no apoio e joelhos levemente flexionados.', 'Coluna reta, peito aberto, braços estendidos.', 'Puxe o triângulo até o abdômen levando os cotovelos para trás e juntando as escápulas.', 'Volte devagar até esticar os braços sem curvar as costas.'],
    dicas: ['O tronco quase não se mexe: não faça "remo" com as costas.'],
  },
  supino_inclinado_maquina: {
    nome: 'Supino inclinado na máquina', grupo: 'Peito', musc: 'Peitoral superior, ombros e tríceps',
    props: [['l', 62, 138, 78, 66], ['r', 66, 126, 40, 6], ['l', 86, 132, 86, 152]],
    S: { h: [70, 73], L: [[[78, 124], [70, 88]], [[70, 90], [60, 104], [84, 92]], [[78, 124], [108, 124], [112, 150]]], P: [['c', 86, 91, 3]] },
    E: { h: [70, 73], L: [[[78, 124], [70, 88]], [[70, 90], [92, 80], [112, 66]], [[78, 124], [108, 124], [112, 150]]], P: [['c', 114, 65, 3]] },
    passos: ['Ajuste o banco para as pegadas ficarem na linha do peito.', 'Costas apoiadas e escápulas encaixadas.', 'Empurre as pegadas para frente e para cima até quase estender.', 'Volte devagar até sentir o alongamento do peito.'],
    dicas: ['Não tire as costas do encosto para empurrar.'],
  },
  elevacao_lateral: {
    nome: 'Elevação lateral com halteres', grupo: 'Ombros', musc: 'Deltoide lateral', vista: 'de frente',
    S: { h: [100, 34], L: [[[100, 46], [100, 90]], [[86, 52], [114, 52]], [[86, 52], [82, 74], [80, 96]], [[114, 52], [118, 74], [120, 96]], [[92, 90], [108, 90]], [[92, 90], [90, 120], [90, 150]], [[108, 90], [110, 120], [110, 150]]], P: [['d', 80, 99], ['d', 120, 99]] },
    E: { h: [100, 34], L: [[[100, 46], [100, 90]], [[86, 52], [114, 52]], [[86, 52], [64, 52], [42, 56]], [[114, 52], [136, 52], [158, 56]], [[92, 90], [108, 90]], [[92, 90], [90, 120], [90, 150]], [[108, 90], [110, 120], [110, 150]]], P: [['d', 40, 56], ['d', 160, 56]] },
    passos: ['Em pé, halteres ao lado do corpo, cotovelos levemente dobrados.', 'Eleve os braços para os lados até a altura dos ombros.', 'Cotovelos lideram o movimento, punhos não passam dos cotovelos.', 'Desça devagar.'],
    dicas: ['Não suba acima da linha dos ombros.', 'Sem impulso com o corpo: carga leve e controle.'],
  },
  abd_perna_esticada: {
    nome: 'Abdominal deitado com perna esticada', grupo: 'Abdômen', musc: 'Abdômen inferior',
    S: { h: [42, 140], L: [[[54, 143], [98, 146]], [[58, 144], [80, 148], [100, 149]], [[98, 146], [130, 146], [160, 145]]] },
    E: { h: [42, 140], L: [[[54, 143], [98, 146]], [[58, 144], [80, 148], [100, 149]], [[98, 146], [102, 116], [106, 86]]] },
    passos: ['Deite de barriga para cima, mãos ao lado do corpo ou sob o quadril.', 'Pernas esticadas e juntas.', 'Suba as pernas até ficarem quase na vertical.', 'Desça devagar sem encostar os pés no chão.'],
    dicas: ['Lombar colada no chão o tempo todo.', 'Se a lombar sair, dobre um pouco os joelhos.'],
  },
  agachamento_unilateral_halter: {
    nome: 'Agachamento unilateral com halter', grupo: 'Pernas', musc: 'Quadríceps e glúteos',
    S: { h: [102, 36], L: [[[100, 90], [100, 50]], [[100, 52], [100, 74], [100, 96]], [[100, 90], [112, 120], [118, 150]]], B: [[[100, 90], [88, 118], [72, 148]]], P: [['d', 100, 99]] },
    E: { h: [102, 60], L: [[[100, 114], [100, 74]], [[100, 76], [100, 98], [100, 120]], [[100, 114], [128, 116], [122, 150]]], B: [[[100, 114], [86, 142], [70, 148]]], P: [['d', 100, 123]] },
    passos: ['Um halter em cada mão, dê um passo longo à frente (pé de trás na ponta).', 'Tronco ereto, peso na perna da frente.', 'Desça até o joelho de trás quase tocar o chão.', 'Suba empurrando com o calcanhar da frente. Faça todas as reps e troque de perna.'],
    dicas: ['Variação mais difícil: pé de trás apoiado num banco (búlgaro).', 'Joelho da frente alinhado com o pé.'],
  },
  puxada_fechada: {
    nome: 'Puxada frontal fechada', grupo: 'Costas', musc: 'Dorsais e bíceps',
    props: PULLDOWN_BASE,
    S: { h: [99, 56], L: [[[95, 110], [97, 70]], [[97, 72], [104, 48], [108, 24]], [[95, 110], [125, 110], [125, 148]]], P: [['l', 102, 22, 114, 22], ['k', 108, 2, 108, 22]] },
    E: { h: [95, 57], L: [[[95, 110], [92, 71]], [[92, 73], [84, 92], [102, 70]], [[95, 110], [125, 110], [125, 148]]], P: [['l', 98, 70, 110, 70], ['k', 108, 2, 104, 70]] },
    passos: ['Use o triângulo ou barra de pegada fechada.', 'Tronco levemente inclinado para trás, peito aberto.', 'Puxe até o alto do peito levando os cotovelos para baixo, rente ao corpo.', 'Suba controlando até estender os braços.'],
    dicas: ['Pense em puxar com os cotovelos, não com as mãos.'],
  },
  crucifixo_maquina: {
    nome: 'Crucifixo na máquina', grupo: 'Peito', musc: 'Peitoral', vista: 'de cima', ground: false,
    S: { h: [100, 100], L: [[[80, 100], [120, 100]], [[80, 100], [52, 94], [26, 100]], [[120, 100], [148, 94], [174, 100]]], P: [['c', 24, 100, 4], ['c', 176, 100, 4]] },
    E: { h: [100, 100], L: [[[80, 100], [120, 100]], [[80, 100], [76, 72], [96, 52]], [[120, 100], [124, 72], [104, 52]]], P: [['c', 95, 50, 4], ['c', 105, 50, 4]] },
    passos: ['Sente com as costas apoiadas e pegadas na altura do peito.', 'Cotovelos levemente dobrados e fixos.', 'Feche os braços à frente do peito como num abraço.', 'Abra devagar até sentir o peito alongar, sem passar da linha do corpo.'],
    dicas: ['Mantenha o ângulo do cotovelo igual do início ao fim.'],
  },
  desenvolvimento_maquina: {
    nome: 'Desenvolvimento na máquina', grupo: 'Ombros', musc: 'Deltoides e tríceps',
    props: [['l', 84, 132, 84, 66], ['r', 80, 126, 40, 6], ['l', 100, 132, 100, 152]],
    S: { h: [92, 72], L: [[[90, 124], [90, 86]], [[90, 88], [96, 108], [100, 86]], [[90, 124], [120, 124], [120, 150]]], P: [['c', 101, 84, 3]] },
    E: { h: [92, 72], L: [[[90, 124], [90, 86]], [[90, 88], [94, 64], [96, 40]], [[90, 124], [120, 124], [120, 150]]], P: [['c', 96, 37, 3]] },
    passos: ['Ajuste o banco para as pegadas ficarem na altura dos ombros.', 'Costas apoiadas, abdômen firme.', 'Empurre para cima até quase estender os braços.', 'Desça controlando até a altura das orelhas.'],
    dicas: ['Não arqueie a lombar para empurrar.'],
  },
  triceps_testa_halter: {
    nome: 'Tríceps testa com halter', grupo: 'Braços', musc: 'Tríceps',
    props: BENCH,
    S: { h: [60, 118], L: [LYING.torso, [[76, 121], [74, 97], [74, 74]], LYING.leg], P: [['d', 74, 71]] },
    E: { h: [60, 118], L: [LYING.torso, [[76, 121], [72, 97], [52, 106]], LYING.leg], P: [['d', 49, 107]] },
    passos: ['Deitado no banco, halteres acima do peito com braços estendidos.', 'Cotovelos apontados para o teto e parados.', 'Dobre os cotovelos levando os halteres para perto da testa/lado da cabeça.', 'Estenda os braços de volta contraindo o tríceps.'],
    dicas: ['Cotovelos não abrem para os lados.', 'Movimento lento perto da cabeça.'],
  },
};

// Recorte automático: enquadra as duas poses do exercício para a figura ocupar o painel.
function exBox(ex) {
  if (ex._box) return ex._box;
  const xs = [], ys = [];
  const add = (x, y, r = 0) => { xs.push(x - r, x + r); ys.push(y - r, y + r); };
  for (const pose of [ex.S, ex.E]) {
    add(pose.h[0], pose.h[1], 10);
    [...pose.L, ...(pose.B || [])].flat().forEach(([x, y]) => add(x, y, 4));
    for (const [t, a, b, c, d] of [...(ex.props || []), ...(pose.P || [])]) {
      if (t === 'r') { add(a, b); add(a + c, b + d); }
      else if (t === 'l' || t === 'k') { add(a, b); add(c, d); }
      else if (t === 'c') add(a, b, c + 2);
      else if (t === 'd' || t === 'v') add(a, b, 9);
      else if (t === 'b') add(a, b, 6);
      else if (t === 'x') add(a, b - 16, 10);
    }
  }
  if (ex.ground !== false) ys.push(153);
  let x0 = Math.min(...xs) - 10, x1 = Math.max(...xs) + 10, y0 = Math.min(...ys) - 10, y1 = Math.max(...ys) + 6;
  // proporção mínima para não ficar achatado nem comprido demais
  const w = x1 - x0, h = y1 - y0;
  if (w < h * 1.1) { const g = (h * 1.1 - w) / 2; x0 -= g; x1 += g; }
  if (h < w * 0.62) { const g = (w * 0.62 - h); y0 -= g; }
  return (ex._box = [x0, y0, x1 - x0, y1 - y0].map(n => Math.round(n)));
}

function poseSVG(pose, ex) {
  const parts = [];
  const props = [...(ex.props || []), ...(pose.P || [])];
  const box = exBox(ex);
  if (ex.ground !== false) parts.push(`<line x1="${box[0]}" y1="152" x2="${box[0] + box[2]}" y2="152" class="ig-ground"/>`);
  for (const p of props) {
    const [t, a, b, c, d] = p;
    if (t === 'r') parts.push(`<rect x="${a}" y="${b}" width="${c}" height="${d}" rx="2" class="ig-prop-fill"/>`);
    else if (t === 'l') parts.push(`<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" class="ig-prop"/>`);
    else if (t === 'c') parts.push(`<circle cx="${a}" cy="${b}" r="${c}" class="ig-prop"/>`);
    else if (t === 'k') parts.push(`<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" class="ig-cable"/>`);
  }
  const poly = (pts, cls) => `<polyline points="${pts.map(q => q.join(',')).join(' ')}" class="${cls}"/>`;
  (pose.B || []).forEach(l => parts.push(poly(l, 'ig-limb-back')));
  pose.L.forEach(l => parts.push(poly(l, 'ig-limb')));
  parts.push(`<circle cx="${pose.h[0]}" cy="${pose.h[1]}" r="10" class="ig-head"/>`);
  for (const p of props) {
    const [t, a, b] = p;
    if (t === 'd') parts.push(`<g class="ig-weight"><rect x="${a - 7}" y="${b - 2}" width="14" height="4" rx="1"/><rect x="${a - 9}" y="${b - 5}" width="4" height="10" rx="1"/><rect x="${a + 5}" y="${b - 5}" width="4" height="10" rx="1"/></g>`);
    else if (t === 'v') parts.push(`<g class="ig-weight"><rect x="${a - 2}" y="${b - 7}" width="4" height="14" rx="1"/><rect x="${a - 5}" y="${b - 9}" width="10" height="4" rx="1"/><rect x="${a - 5}" y="${b + 5}" width="10" height="4" rx="1"/></g>`);
    else if (t === 'b') parts.push(`<circle cx="${a}" cy="${b}" r="6" class="ig-weight"/>`);
    else if (t === 'x') parts.push(`<g class="ig-wrong"><circle cx="${a}" cy="${b - 16}" r="9"/><path d="M${a - 4} ${b - 20}l8 8M${a + 4} ${b - 20}l-8 8"/></g>`);
  }
  return `<svg viewBox="${box.join(' ')}" role="img">${parts.join('')}</svg>`;
}

function infographicHTML(id) {
  const ex = EXERCISES[id];
  if (!ex) return '';
  const [l1, l2] = ex.labels || ['Início', 'Fim'];
  return `
    <div class="ig-panels">
      <figure class="ig-panel"><span class="ig-tag">1 · ${l1}</span>${poseSVG(ex.S, ex)}</figure>
      <div class="ig-arrow" aria-hidden="true">→</div>
      <figure class="ig-panel"><span class="ig-tag">2 · ${l2}</span>${poseSVG(ex.E, ex)}</figure>
    </div>
    ${ex.vista ? `<p class="ig-note">Vista ${ex.vista}</p>` : ''}
    <ol class="ig-steps">${ex.passos.map(p => `<li>${p}</li>`).join('')}</ol>
    ${ex.dicas?.length ? `<div class="ig-tips"><strong>Atenção</strong><ul>${ex.dicas.map(d => `<li>${d}</li>`).join('')}</ul></div>` : ''}`;
}
