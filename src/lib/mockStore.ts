import type {
  Agente,
  Conversa,
  Etiqueta,
  Mensagem,
  RespostaRapida,
  Setor,
  StoreState,
  Transferencia,
} from "./types";

const SEED_EPOCH = Date.parse("2026-05-05T15:00:00.000-03:00");

function ago(minutes: number): string {
  return new Date(SEED_EPOCH - minutes * 60_000).toISOString();
}

function makeSeed(): StoreState {
  const setores: Setor[] = [
    { id: "s-recepcao", nome: "Recepção", cor_hex: "#3b82f6", ativo: true, ordem: 1 },
    { id: "s-trabalhista", nome: "Trabalhista", cor_hex: "#f97316", ativo: true, ordem: 2 },
    { id: "s-previdenciario", nome: "Previdenciário", cor_hex: "#10b981", ativo: true, ordem: 3 },
    { id: "s-financeiro", nome: "Financeiro", cor_hex: "#8b5cf6", ativo: true, ordem: 4 },
  ];

  const agentes: Agente[] = [
    { id: "a-ana", nome: "Ana Beatriz Souza", email: "ana@flowdesk.adv", setor_id: "s-recepcao", status: "online", ativo: true, role: "admin" },
    { id: "a-bruno", nome: "Bruno Carvalho", email: "bruno@flowdesk.adv", setor_id: "s-trabalhista", status: "online", ativo: true, role: "agente" },
    { id: "a-carla", nome: "Carla Mendes", email: "carla@flowdesk.adv", setor_id: "s-trabalhista", status: "ausente", ativo: true, role: "agente" },
    { id: "a-diego", nome: "Diego Ramos", email: "diego@flowdesk.adv", setor_id: "s-previdenciario", status: "online", ativo: true, role: "agente" },
    { id: "a-eduarda", nome: "Eduarda Lima", email: "eduarda@flowdesk.adv", setor_id: "s-previdenciario", status: "offline", ativo: true, role: "agente" },
    { id: "a-felipe", nome: "Felipe Andrade", email: "felipe@flowdesk.adv", setor_id: "s-financeiro", status: "online", ativo: true, role: "agente" },
  ];

  const etiquetas: Etiqueta[] = [
    { id: "e-urgente", nome: "Urgente", cor_hex: "#ef4444" },
    { id: "e-vip", nome: "VIP", cor_hex: "#a855f7" },
    { id: "e-docs", nome: "Aguardando docs", cor_hex: "#eab308" },
    { id: "e-audiencia", nome: "Audiência", cor_hex: "#0ea5e9" },
    { id: "e-pago", nome: "Pago", cor_hex: "#22c55e" },
  ];

  const respostas: RespostaRapida[] = [
    { id: "r-oi", setor_id: null, atalho: "/oi", corpo: "Olá! Aqui é o escritório FlowDesk Advocacia. Em que posso ajudar?" },
    { id: "r-aguarde", setor_id: null, atalho: "/aguarde", corpo: "Só um momento, por favor. Vou verificar essa informação para você." },
    { id: "r-horario", setor_id: null, atalho: "/horario", corpo: "Nosso horário de atendimento é de segunda a sexta, das 9h às 18h." },
    { id: "r-whats", setor_id: null, atalho: "/whats", corpo: "Você pode nos enviar os documentos por aqui mesmo. Aceitamos PDF e imagens." },
    { id: "r-agradecimento", setor_id: null, atalho: "/agradecimento", corpo: "Agradecemos o contato! Qualquer dúvida, estamos à disposição." },
    { id: "r-encerrar", setor_id: null, atalho: "/encerrar", corpo: "Vou encerrar este atendimento por aqui. Tenha um ótimo dia!" },
    { id: "r-docs", setor_id: "s-trabalhista", atalho: "/docs", corpo: "Para iniciar o caso trabalhista preciso de: CTPS, holerites dos últimos 6 meses, contrato e RG/CPF." },
    { id: "r-audiencia", setor_id: "s-trabalhista", atalho: "/audiencia", corpo: "Sua audiência foi confirmada. Lembre-se de chegar com 30 minutos de antecedência e trazer documento com foto." },
    { id: "r-proposta", setor_id: "s-previdenciario", atalho: "/proposta", corpo: "Após análise do CNIS, elaboramos a proposta de aposentadoria mais vantajosa. Posso enviar agora?" },
    { id: "r-financeiro", setor_id: "s-financeiro", atalho: "/financeiro", corpo: "O pagamento pode ser feito via Pix, boleto ou cartão em até 12x. Qual prefere?" },
  ];

  const conversas: Conversa[] = [
    {
      id: "c-1",
      nome_contato: "Marcos Pereira",
      telefone_contato: "+55 11 99812-4421",
      setor_id: "s-recepcao",
      agente_responsavel_id: "a-ana",
      status: "aberta",
      ultima_mensagem: "Perfeito, vou aguardar o retorno.",
      nao_lidas: 0,
      criado_em: ago(180),
      atualizado_em: ago(4),
      resolvida_em: null,
      etiqueta_ids: ["e-vip"],
    },
    {
      id: "c-2",
      nome_contato: "Juliana Castro",
      telefone_contato: "+55 11 98221-7733",
      setor_id: "s-trabalhista",
      agente_responsavel_id: "a-bruno",
      status: "aberta",
      ultima_mensagem: "Já enviei a CTPS no e-mail.",
      nao_lidas: 2,
      criado_em: ago(420),
      atualizado_em: ago(11),
      resolvida_em: null,
      etiqueta_ids: ["e-urgente", "e-docs"],
    },
    {
      id: "c-3",
      nome_contato: "Roberto Nascimento",
      telefone_contato: "+55 21 99654-3120",
      setor_id: "s-previdenciario",
      agente_responsavel_id: "a-diego",
      status: "aberta",
      ultima_mensagem: "Quando consigo agendar a perícia?",
      nao_lidas: 1,
      criado_em: ago(1500),
      atualizado_em: ago(28),
      resolvida_em: null,
      etiqueta_ids: ["e-urgente"],
    },
    {
      id: "c-4",
      nome_contato: "Patrícia Almeida",
      telefone_contato: "+55 11 97123-8856",
      setor_id: "s-financeiro",
      agente_responsavel_id: "a-felipe",
      status: "aberta",
      ultima_mensagem: "Pode me mandar o boleto novamente?",
      nao_lidas: 0,
      criado_em: ago(2880),
      atualizado_em: ago(95),
      resolvida_em: null,
      etiqueta_ids: [],
    },
    {
      id: "c-5",
      nome_contato: "Henrique Tavares",
      telefone_contato: "+55 11 95567-1133",
      setor_id: "s-trabalhista",
      agente_responsavel_id: "a-carla",
      status: "aberta",
      ultima_mensagem: "Está marcada para terça às 14h.",
      nao_lidas: 0,
      criado_em: ago(720),
      atualizado_em: ago(140),
      resolvida_em: null,
      etiqueta_ids: ["e-audiencia"],
    },
    {
      id: "c-6",
      nome_contato: "Larissa Ferreira",
      telefone_contato: "+55 31 98876-5544",
      setor_id: "s-previdenciario",
      agente_responsavel_id: null,
      status: "aberta",
      ultima_mensagem: "Olá, gostaria de tirar uma dúvida sobre BPC.",
      nao_lidas: 3,
      criado_em: ago(60),
      atualizado_em: ago(18),
      resolvida_em: null,
      etiqueta_ids: [],
    },
    {
      id: "c-7",
      nome_contato: "André Salles",
      telefone_contato: "+55 11 97765-4321",
      setor_id: "s-recepcao",
      agente_responsavel_id: "a-ana",
      status: "resolvida",
      ultima_mensagem: "Obrigado pelo atendimento!",
      nao_lidas: 0,
      criado_em: ago(4320),
      atualizado_em: ago(1440),
      resolvida_em: ago(1440),
      etiqueta_ids: [],
    },
    {
      id: "c-8",
      nome_contato: "Beatriz Rocha",
      telefone_contato: "+55 11 96655-3322",
      setor_id: "s-financeiro",
      agente_responsavel_id: "a-felipe",
      status: "resolvida",
      ultima_mensagem: "Pagamento confirmado, obrigado.",
      nao_lidas: 0,
      criado_em: ago(2160),
      atualizado_em: ago(540),
      resolvida_em: ago(540),
      etiqueta_ids: ["e-pago"],
    },
    {
      id: "c-9",
      nome_contato: "Caio Brandão",
      telefone_contato: "+55 11 98112-9090",
      setor_id: "s-trabalhista",
      agente_responsavel_id: "a-bruno",
      status: "aberta",
      ultima_mensagem: "Recebi a intimação hoje.",
      nao_lidas: 1,
      criado_em: ago(345),
      atualizado_em: ago(67),
      resolvida_em: null,
      etiqueta_ids: ["e-audiencia", "e-urgente"],
    },
    {
      id: "c-10",
      nome_contato: "Fernanda Costa",
      telefone_contato: "+55 11 99001-2233",
      setor_id: "s-previdenciario",
      agente_responsavel_id: "a-diego",
      status: "aberta",
      ultima_mensagem: "Mandei o CNIS como pediu.",
      nao_lidas: 0,
      criado_em: ago(1080),
      atualizado_em: ago(220),
      resolvida_em: null,
      etiqueta_ids: ["e-vip", "e-docs"],
    },
  ];

  const mensagens: Mensagem[] = [];
  let mid = 1;
  function pushMsg(
    conversa_id: string,
    tipo_remetente: "agente" | "contato",
    remetente_id: string,
    corpo: string,
    minutosAtras: number,
    e_nota_interna = false,
  ) {
    mensagens.push({
      id: `m-${mid++}`,
      conversa_id,
      tipo_remetente,
      remetente_id,
      corpo,
      e_nota_interna,
      criado_em: ago(minutosAtras),
    });
  }

  pushMsg("c-1", "contato", "c-1", "Bom dia, gostaria de saber sobre o andamento do meu processo.", 180);
  pushMsg("c-1", "agente", "a-ana", "Olá Sr. Marcos! Vou verificar agora mesmo.", 178);
  pushMsg("c-1", "agente", "a-ana", "Encontrei aqui — está aguardando juntada da contestação.", 176);
  pushMsg("c-1", "contato", "c-1", "Tem prazo para isso?", 170);
  pushMsg("c-1", "agente", "a-ana", "Mais ou menos 15 dias úteis. Te aviso assim que houver movimentação.", 168);
  pushMsg("c-1", "contato", "c-1", "Perfeito, vou aguardar o retorno.", 4);

  pushMsg("c-2", "contato", "c-2", "Olá, fui demitida sem justa causa e gostaria de orientação.", 420);
  pushMsg("c-2", "agente", "a-bruno", "Olá Juliana, sinto muito. Para começar preciso de alguns documentos.", 418);
  pushMsg("c-2", "agente", "a-bruno", "Carteira de trabalho, holerites e termo de rescisão.", 417);
  pushMsg("c-2", "contato", "c-2", "Entendi, posso enviar agora?", 400);
  pushMsg("c-2", "agente", "a-bruno", "Pode sim, por aqui mesmo.", 398);
  pushMsg("c-2", "agente", "a-carla", "Cliente VIP — atenção redobrada com prazos.", 380, true);
  pushMsg("c-2", "contato", "c-2", "Mandei a foto da CTPS aqui.", 60);
  pushMsg("c-2", "contato", "c-2", "Já enviei a CTPS no e-mail.", 11);

  pushMsg("c-3", "contato", "c-3", "Quero entrar com pedido de auxílio-doença.", 1500);
  pushMsg("c-3", "agente", "a-diego", "Olá Sr. Roberto, vamos te ajudar.", 1498);
  pushMsg("c-3", "agente", "a-diego", "Você já agendou perícia no INSS?", 1490);
  pushMsg("c-3", "contato", "c-3", "Ainda não.", 1480);
  pushMsg("c-3", "agente", "a-diego", "Posso fazer o agendamento pelo Meu INSS para você.", 1478);
  pushMsg("c-3", "contato", "c-3", "Por favor!", 1400);
  pushMsg("c-3", "agente", "a-diego", "Pronto, agendei para o dia 22 às 10h30.", 60);
  pushMsg("c-3", "contato", "c-3", "Quando consigo agendar a perícia?", 28);

  pushMsg("c-4", "contato", "c-4", "Quero quitar os honorários antecipadamente.", 2880);
  pushMsg("c-4", "agente", "a-felipe", "Excelente! Posso te dar 5% de desconto à vista.", 2870);
  pushMsg("c-4", "contato", "c-4", "Fechado, manda o boleto.", 2860);
  pushMsg("c-4", "agente", "a-felipe", "Enviado. Vence dia 30.", 2840);
  pushMsg("c-4", "contato", "c-4", "Pode me mandar o boleto novamente?", 95);

  pushMsg("c-5", "contato", "c-5", "Quando é minha audiência?", 720);
  pushMsg("c-5", "agente", "a-carla", "Olá Sr. Henrique, deixa eu confirmar.", 718);
  pushMsg("c-5", "agente", "a-carla", "Está marcada para terça às 14h.", 140);

  pushMsg("c-6", "contato", "c-6", "Olá, gostaria de tirar uma dúvida sobre BPC.", 60);
  pushMsg("c-6", "contato", "c-6", "Minha mãe tem 67 anos e renda baixa.", 50);
  pushMsg("c-6", "contato", "c-6", "Vocês atendem esse tipo de caso?", 18);

  pushMsg("c-7", "contato", "c-7", "Olá, recebi a intimação. O que faço?", 4320);
  pushMsg("c-7", "agente", "a-ana", "Não se preocupe, vou orientar.", 4310);
  pushMsg("c-7", "agente", "a-ana", "Apenas comparecer na data com documento.", 4300);
  pushMsg("c-7", "contato", "c-7", "Beleza, compareci hoje. Foi tranquilo.", 1450);
  pushMsg("c-7", "contato", "c-7", "Obrigado pelo atendimento!", 1440);

  pushMsg("c-8", "contato", "c-8", "Vim por indicação da Dra. Renata.", 2160);
  pushMsg("c-8", "agente", "a-felipe", "Bem-vinda! Como posso ajudar?", 2155);
  pushMsg("c-8", "contato", "c-8", "Quero contratar o serviço.", 2150);
  pushMsg("c-8", "agente", "a-felipe", "Vou enviar o contrato e o boleto.", 2140);
  pushMsg("c-8", "contato", "c-8", "Pagamento confirmado, obrigado.", 540);

  pushMsg("c-9", "contato", "c-9", "Recebi citação trabalhista, sou empregador.", 345);
  pushMsg("c-9", "agente", "a-bruno", "Olá Caio, precisamos preparar a defesa rapidamente.", 340);
  pushMsg("c-9", "agente", "a-bruno", "Tem o cartão de ponto e contracheques desse colaborador?", 320);
  pushMsg("c-9", "contato", "c-9", "Tenho sim, mando hoje à tarde.", 310);
  pushMsg("c-9", "agente", "a-bruno", "Perfeito. Audiência foi marcada para 18/06.", 200, false);
  pushMsg("c-9", "agente", "a-bruno", "Cliente preocupado — manter informado a cada movimentação.", 198, true);
  pushMsg("c-9", "contato", "c-9", "Recebi a intimação hoje.", 67);

  pushMsg("c-10", "contato", "c-10", "Quero revisar minha aposentadoria.", 1080);
  pushMsg("c-10", "agente", "a-diego", "Posso te ajudar. Tem o CNIS?", 1078);
  pushMsg("c-10", "contato", "c-10", "Tenho, vou tirar agora.", 1070);
  pushMsg("c-10", "contato", "c-10", "Pronto, mandei.", 800);
  pushMsg("c-10", "agente", "a-diego", "Recebi, vou analisar até amanhã.", 790);
  pushMsg("c-10", "agente", "a-diego", "Sua média deu R$ 3.480, dá pra recalcular.", 400);
  pushMsg("c-10", "contato", "c-10", "Mandei o CNIS como pediu.", 220);

  const transferencias: Transferencia[] = [
    {
      id: "t-1",
      conversa_id: "c-2",
      setor_origem_id: "s-recepcao",
      setor_destino_id: "s-trabalhista",
      transferido_por_id: "a-ana",
      observacao: "Caso de demissão sem justa causa.",
      criado_em: ago(415),
    },
    {
      id: "t-2",
      conversa_id: "c-3",
      setor_origem_id: "s-recepcao",
      setor_destino_id: "s-previdenciario",
      transferido_por_id: "a-ana",
      observacao: "Auxílio-doença, encaminhar para Diego.",
      criado_em: ago(1495),
    },
    {
      id: "t-3",
      conversa_id: "c-9",
      setor_origem_id: "s-recepcao",
      setor_destino_id: "s-trabalhista",
      transferido_por_id: "a-ana",
      observacao: "Empregador citado em ação trabalhista.",
      criado_em: ago(343),
    },
  ];

  return {
    setores,
    agentes,
    etiquetas,
    respostas,
    conversas,
    mensagens,
    transferencias,
  };
}

let state: StoreState = makeSeed();
const listeners = new Set<() => void>();

function emit() {
  msgCache.clear();
  agSetorCache.clear();
  respCache.clear();
  for (const l of listeners) l();
}

function mutate(fn: (s: StoreState) => StoreState | void) {
  const next = fn(state);
  state = next ?? { ...state };
  emit();
}

export function subscribe(l: () => void): () => void {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function getSnapshot(): StoreState {
  return state;
}

export function getServerSnapshot(): StoreState {
  return state;
}

const msgCache = new Map<string, Mensagem[]>();
export function mensagensByConversa(conversaId: string): Mensagem[] {
  const cached = msgCache.get(conversaId);
  if (cached) return cached;
  const list = state.mensagens
    .filter((m) => m.conversa_id === conversaId)
    .sort((a, b) => a.criado_em.localeCompare(b.criado_em));
  msgCache.set(conversaId, list);
  return list;
}

const agSetorCache = new Map<string, Agente[]>();
export function agentesAtivosBySetor(setorId: string): Agente[] {
  const cached = agSetorCache.get(setorId);
  if (cached) return cached;
  const list = state.agentes.filter((a) => a.ativo && a.setor_id === setorId);
  agSetorCache.set(setorId, list);
  return list;
}

const respCache = new Map<string, RespostaRapida[]>();
export function respostasParaSetor(setorId: string | null): RespostaRapida[] {
  const key = setorId ?? "__null__";
  const cached = respCache.get(key);
  if (cached) return cached;
  const list = state.respostas.filter(
    (r) => r.setor_id === null || r.setor_id === setorId,
  );
  respCache.set(key, list);
  return list;
}

function nowIso() {
  if (typeof window === "undefined") return new Date(SEED_EPOCH).toISOString();
  return new Date().toISOString();
}

let nextId = 1000;
function genId(prefix: string) {
  return `${prefix}-${nextId++}`;
}

export function enviarMensagem(
  conversaId: string,
  remetenteId: string,
  corpo: string,
  eNotaInterna: boolean,
) {
  const trimmed = corpo.trim();
  if (!trimmed) return;
  const ts = nowIso();
  mutate((s) => ({
    ...s,
    mensagens: [
      ...s.mensagens,
      {
        id: genId("m"),
        conversa_id: conversaId,
        tipo_remetente: "agente",
        remetente_id: remetenteId,
        corpo: trimmed,
        e_nota_interna: eNotaInterna,
        criado_em: ts,
      },
    ],
    conversas: s.conversas.map((c) =>
      c.id === conversaId
        ? {
            ...c,
            ultima_mensagem: eNotaInterna ? `📝 ${trimmed}` : trimmed,
            atualizado_em: ts,
          }
        : c,
    ),
  }));
}

export function resolverConversa(id: string) {
  const ts = nowIso();
  mutate((s) => ({
    ...s,
    conversas: s.conversas.map((c) =>
      c.id === id ? { ...c, status: "resolvida", resolvida_em: ts, atualizado_em: ts } : c,
    ),
  }));
}

export function reabrirConversa(id: string) {
  const ts = nowIso();
  mutate((s) => ({
    ...s,
    conversas: s.conversas.map((c) =>
      c.id === id ? { ...c, status: "aberta", resolvida_em: null, atualizado_em: ts } : c,
    ),
  }));
}

export function transferir(
  conversaId: string,
  setorDestinoId: string,
  observacao: string,
  agenteOrigemId: string,
  agenteDestinoId?: string | null,
): { ok: boolean; erro?: string } {
  const conv = state.conversas.find((c) => c.id === conversaId);
  if (!conv) return { ok: false, erro: "Conversa não encontrada." };
  if (agenteDestinoId) {
    const ag = state.agentes.find((a) => a.id === agenteDestinoId);
    if (!ag) return { ok: false, erro: "Agente não encontrado." };
    if (ag.setor_id !== setorDestinoId)
      return { ok: false, erro: "Agente não pertence ao setor de destino." };
  }
  const ts = nowIso();
  mutate((s) => ({
    ...s,
    conversas: s.conversas.map((c) =>
      c.id === conversaId
        ? {
            ...c,
            setor_id: setorDestinoId,
            agente_responsavel_id: agenteDestinoId ?? null,
            atualizado_em: ts,
          }
        : c,
    ),
    transferencias: [
      ...s.transferencias,
      {
        id: genId("t"),
        conversa_id: conversaId,
        setor_origem_id: conv.setor_id,
        setor_destino_id: setorDestinoId,
        transferido_por_id: agenteOrigemId,
        observacao: observacao.trim(),
        criado_em: ts,
      },
    ],
  }));
  return { ok: true };
}

export function atribuirAMim(conversaId: string, agenteId: string) {
  const ts = nowIso();
  mutate((s) => ({
    ...s,
    conversas: s.conversas.map((c) =>
      c.id === conversaId ? { ...c, agente_responsavel_id: agenteId, atualizado_em: ts } : c,
    ),
  }));
}

export function toggleEtiqueta(conversaId: string, etiquetaId: string) {
  mutate((s) => ({
    ...s,
    conversas: s.conversas.map((c) => {
      if (c.id !== conversaId) return c;
      const tem = c.etiqueta_ids.includes(etiquetaId);
      return {
        ...c,
        etiqueta_ids: tem
          ? c.etiqueta_ids.filter((e) => e !== etiquetaId)
          : [...c.etiqueta_ids, etiquetaId],
      };
    }),
  }));
}

export function marcarComoLida(conversaId: string) {
  mutate((s) => ({
    ...s,
    conversas: s.conversas.map((c) =>
      c.id === conversaId && c.nao_lidas > 0 ? { ...c, nao_lidas: 0 } : c,
    ),
  }));
}

export function criarConversa(input: {
  nome_contato: string;
  telefone_contato: string;
  setor_id: string;
  primeira_mensagem: string;
  agente_id: string | null;
}): string {
  const ts = nowIso();
  const id = genId("c");
  mutate((s) => ({
    ...s,
    conversas: [
      {
        id,
        nome_contato: input.nome_contato.trim(),
        telefone_contato: input.telefone_contato.trim(),
        setor_id: input.setor_id,
        agente_responsavel_id: input.agente_id,
        status: "aberta",
        ultima_mensagem: input.primeira_mensagem.trim(),
        nao_lidas: 0,
        criado_em: ts,
        atualizado_em: ts,
        resolvida_em: null,
        etiqueta_ids: [],
      },
      ...s.conversas,
    ],
    mensagens: [
      ...s.mensagens,
      {
        id: genId("m"),
        conversa_id: id,
        tipo_remetente: "agente",
        remetente_id: input.agente_id ?? "system",
        corpo: input.primeira_mensagem.trim(),
        e_nota_interna: false,
        criado_em: ts,
      },
    ],
  }));
  return id;
}

export function upsertSetor(setor: Setor) {
  mutate((s) => {
    const idx = s.setores.findIndex((x) => x.id === setor.id);
    const setores = [...s.setores];
    if (idx === -1) setores.push(setor);
    else setores[idx] = setor;
    return { ...s, setores };
  });
}

export function removerSetor(id: string) {
  mutate((s) => ({ ...s, setores: s.setores.filter((x) => x.id !== id) }));
}

export function upsertAgente(ag: Agente) {
  mutate((s) => {
    const idx = s.agentes.findIndex((x) => x.id === ag.id);
    const agentes = [...s.agentes];
    if (idx === -1) agentes.push(ag);
    else agentes[idx] = ag;
    return { ...s, agentes };
  });
}

export function removerAgente(id: string) {
  mutate((s) => ({ ...s, agentes: s.agentes.filter((x) => x.id !== id) }));
}

export function upsertEtiqueta(et: Etiqueta) {
  mutate((s) => {
    const idx = s.etiquetas.findIndex((x) => x.id === et.id);
    const etiquetas = [...s.etiquetas];
    if (idx === -1) etiquetas.push(et);
    else etiquetas[idx] = et;
    return { ...s, etiquetas };
  });
}

export function removerEtiqueta(id: string) {
  mutate((s) => ({
    ...s,
    etiquetas: s.etiquetas.filter((x) => x.id !== id),
    conversas: s.conversas.map((c) => ({
      ...c,
      etiqueta_ids: c.etiqueta_ids.filter((e) => e !== id),
    })),
  }));
}

export function upsertResposta(r: RespostaRapida) {
  mutate((s) => {
    const idx = s.respostas.findIndex((x) => x.id === r.id);
    const respostas = [...s.respostas];
    if (idx === -1) respostas.push(r);
    else respostas[idx] = r;
    return { ...s, respostas };
  });
}

export function removerResposta(id: string) {
  mutate((s) => ({ ...s, respostas: s.respostas.filter((x) => x.id !== id) }));
}

export function novoId(prefix: string) {
  return genId(prefix);
}

export const SEED_EPOCH_MS = SEED_EPOCH;
