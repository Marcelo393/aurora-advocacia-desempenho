export type Setor = {
  id: string;
  nome: string;
  cor_hex: string;
  ativo: boolean;
  ordem: number;
};

export type AgenteRole = "admin" | "agente";
export type AgenteStatus = "online" | "ausente" | "offline";

export type Agente = {
  id: string;
  nome: string;
  email: string;
  setor_id: string;
  status: AgenteStatus;
  ativo: boolean;
  role: AgenteRole;
};

export type Etiqueta = {
  id: string;
  nome: string;
  cor_hex: string;
};

export type RespostaRapida = {
  id: string;
  setor_id: string | null;
  atalho: string;
  corpo: string;
};

export type ConversaStatus = "aberta" | "resolvida";

export type Conversa = {
  id: string;
  nome_contato: string;
  telefone_contato: string;
  setor_id: string;
  agente_responsavel_id: string | null;
  status: ConversaStatus;
  ultima_mensagem: string;
  nao_lidas: number;
  criado_em: string;
  atualizado_em: string;
  resolvida_em: string | null;
  etiqueta_ids: string[];
};

export type TipoRemetente = "agente" | "contato";

export type Mensagem = {
  id: string;
  conversa_id: string;
  tipo_remetente: TipoRemetente;
  remetente_id: string;
  corpo: string;
  e_nota_interna: boolean;
  criado_em: string;
};

export type Transferencia = {
  id: string;
  conversa_id: string;
  setor_origem_id: string;
  setor_destino_id: string;
  transferido_por_id: string;
  observacao: string;
  criado_em: string;
};

export type StoreState = {
  setores: Setor[];
  agentes: Agente[];
  etiquetas: Etiqueta[];
  respostas: RespostaRapida[];
  conversas: Conversa[];
  mensagens: Mensagem[];
  transferencias: Transferencia[];
};
