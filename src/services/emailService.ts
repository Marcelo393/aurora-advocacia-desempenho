
import emailjs from '@emailjs/browser';

// Configurações do EmailJS
const SERVICE_ID = 'service_morestoni'; // Você precisará criar este service
const TEMPLATE_ID = 'template_avaliacao'; // Você precisará criar este template
const PUBLIC_KEY = 'YOUR_EMAILJS_PUBLIC_KEY'; // Você precisará adicionar sua chave pública

export interface FormDataToSend {
  nome: string;
  setor: string;
  trabalhoEquipe: string;
  entregas: string;
  opinioesDivergentes: string;
  proatividade: string;
  posturaTrabalho: string;
  situacoesNovas: string;
  pressaoOpcoes: any[];
  pressaoContexto: string;
  pontualidade: string;
  vestimenta: string;
  cuidadoCozinha: string;
  cuidadoCopa: string;
  cuidadoSala: string;
  lawNet: string;
  linguagemJuridica: string;
  conhecimentoLegislativo: string;
  sistemasJudiciarios: string;
  posturaCliente: string;
  comunicacaoCliente: string;
  jurisprudencia: string;
  cuidadoPatrimonial: string;
  posturaAdvogados: string;
  posturaEstagiarios: string;
  importanciaTrabalho: string;
  importanciaCliente: string;
  gostaTrabaho: string;
  sugestoes: string;
  comecar: string;
  continuar: string;
  parar: string;
  comentarioExtra: string;
  satisfacaoGeral: string;
  acolhimentoSetor: string;
  acolhimentoEscritorio: string;
  comunicacaoInterna: string;
  comunicacaoSetor: string;
  feedbacks: string;
  apoioTarefas: string;
  materialTecnico: string;
  colaboracao: string;
  expressarIdeias: string;
  equilibrioAcademico: string;
  sugestoesMelhoria: string;
  experienciaExtra: string;
}

const formatFormData = (formData: FormDataToSend) => {
  const currentDate = new Date().toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const pressaoOpcoesText = Array.isArray(formData.pressaoOpcoes) 
    ? formData.pressaoOpcoes.join(', ') 
    : 'Nenhuma opção selecionada';

  return {
    to_email_1: 'marcelomorestoni@gmail.com',
    to_email_2: 'juliacarvalho@morestoni.adv.br',
    subject: `Nova Avaliação de Desempenho - ${formData.nome} - ${currentDate}`,
    respondente_nome: formData.nome,
    respondente_setor: formData.setor,
    data_envio: currentDate,
    
    // Dados Básicos
    nome: formData.nome,
    setor: formData.setor,
    
    // Habilidades e Competências
    trabalho_equipe: formData.trabalhoEquipe,
    entregas: formData.entregas,
    opinioes_divergentes: formData.opinioesDivergentes,
    proatividade: formData.proatividade,
    postura_trabalho: formData.posturaTrabalho,
    situacoes_novas: formData.situacoesNovas,
    pressao_opcoes: pressaoOpcoesText,
    pressao_contexto: formData.pressaoContexto,
    
    // Código de Conduta
    pontualidade: formData.pontualidade,
    vestimenta: formData.vestimenta,
    cuidado_cozinha: formData.cuidadoCozinha,
    cuidado_copa: formData.cuidadoCopa,
    cuidado_sala: formData.cuidadoSala,
    
    // Competências Técnicas
    law_net: formData.lawNet,
    linguagem_juridica: formData.linguagemJuridica,
    conhecimento_legislativo: formData.conhecimentoLegislativo,
    sistemas_judiciarios: formData.sistemasJudiciarios,
    postura_cliente: formData.posturaCliente,
    comunicacao_cliente: formData.comunicacaoCliente,
    jurisprudencia: formData.jurisprudencia,
    
    // Gestão e Equipe
    cuidado_patrimonial: formData.cuidadoPatrimonial,
    postura_advogados: formData.posturaAdvogados,
    postura_estagiarios: formData.posturaEstagiarios,
    importancia_trabalho: formData.importanciaTrabalho,
    importancia_cliente: formData.importanciaCliente,
    gosta_trabalho: formData.gostaTrabaho,
    sugestoes_gerais: formData.sugestoes,
    
    // Auto Feedback
    comecar_fazer: formData.comecar,
    continuar_fazendo: formData.continuar,
    parar_fazer: formData.parar,
    comentario_extra: formData.comentarioExtra,
    
    // Coleta de Clima
    satisfacao_geral: formData.satisfacaoGeral,
    acolhimento_setor: formData.acolhimentoSetor,
    acolhimento_escritorio: formData.acolhimentoEscritorio,
    comunicacao_interna: formData.comunicacaoInterna,
    comunicacao_setor: formData.comunicacaoSetor,
    feedbacks_recebidos: formData.feedbacks,
    apoio_tarefas: formData.apoioTarefas,
    material_tecnico: formData.materialTecnico,
    colaboracao: formData.colaboracao,
    expressar_ideias: formData.expressarIdeias,
    equilibrio_academico: formData.equilibrioAcademico,
    sugestoes_melhoria: formData.sugestoesMelhoria,
    experiencia_extra: formData.experienciaExtra
  };
};

export const sendEvaluationEmail = async (formData: FormDataToSend): Promise<void> => {
  try {
    console.log('Iniciando envio de email...', formData);
    
    const templateParams = formatFormData(formData);
    
    console.log('Dados formatados:', templateParams);
    
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );
    
    console.log('Email enviado com sucesso:', result);
    
    if (result.status !== 200) {
      throw new Error(`Falha no envio: ${result.text}`);
    }
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw error;
  }
};

export const validateEmailConfig = () => {
  if (!SERVICE_ID || SERVICE_ID === 'service_morestoni') {
    console.warn('SERVICE_ID do EmailJS não configurado');
    return false;
  }
  if (!TEMPLATE_ID || TEMPLATE_ID === 'template_avaliacao') {
    console.warn('TEMPLATE_ID do EmailJS não configurado');
    return false;
  }
  if (!PUBLIC_KEY || PUBLIC_KEY === 'YOUR_EMAILJS_PUBLIC_KEY') {
    console.warn('PUBLIC_KEY do EmailJS não configurado');
    return false;
  }
  return true;
};
