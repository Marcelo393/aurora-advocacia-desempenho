
import jsPDF from 'jspdf';

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

export const generatePDF = (formData: FormDataToSend): void => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const margin = 20;
  let yPosition = 20;

  // Função para adicionar texto com quebra de linha
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number): number => {
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, x, y);
    return y + (lines.length * 7);
  };

  // Cabeçalho
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('AVALIAÇÃO DE DESEMPENHO - AUTOAVALIAÇÃO', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;
  
  pdf.setFontSize(12);
  pdf.text('Segundo Semestre 2025', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Data e nome
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, margin, yPosition);
  yPosition += 10;
  pdf.text(`Nome: ${formData.nome}`, margin, yPosition);
  yPosition += 10;
  pdf.text(`Setor: ${formData.setor}`, margin, yPosition);
  yPosition += 20;

  // Seção 1 - Habilidades
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text('1. ANÁLISE DE HABILIDADES E COMPETÊNCIAS', margin, yPosition);
  yPosition += 15;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);

  const habilidades = [
    { pergunta: 'Trabalho em equipe:', resposta: formData.trabalhoEquipe },
    { pergunta: 'Entregas e prazos:', resposta: formData.entregas },
    { pergunta: 'Opiniões divergentes:', resposta: formData.opinioesDivergentes },
    { pergunta: 'Proatividade:', resposta: formData.proatividade },
    { pergunta: 'Postura no trabalho:', resposta: formData.posturaTrabalho },
    { pergunta: 'Situações novas:', resposta: formData.situacoesNovas }
  ];

  habilidades.forEach(item => {
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.setFont('helvetica', 'bold');
    pdf.text(item.pergunta, margin, yPosition);
    yPosition += 7;
    
    pdf.setFont('helvetica', 'normal');
    yPosition = addWrappedText(item.resposta || 'Não respondido', margin, yPosition, pageWidth - 2 * margin);
    yPosition += 10;
  });

  // Pressão no trabalho
  if (yPosition > 230) {
    pdf.addPage();
    yPosition = 20;
  }
  
  pdf.setFont('helvetica', 'bold');
  pdf.text('Trabalho sob pressão:', margin, yPosition);
  yPosition += 7;
  
  pdf.setFont('helvetica', 'normal');
  const pressaoText = Array.isArray(formData.pressaoOpcoes) ? formData.pressaoOpcoes.join(', ') : 'Não selecionado';
  yPosition = addWrappedText(pressaoText, margin, yPosition, pageWidth - 2 * margin);
  
  if (formData.pressaoContexto) {
    yPosition += 5;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Contexto:', margin, yPosition);
    yPosition += 7;
    pdf.setFont('helvetica', 'normal');
    yPosition = addWrappedText(formData.pressaoContexto, margin, yPosition, pageWidth - 2 * margin);
  }
  yPosition += 15;

  // Código de Conduta
  if (yPosition > 200) {
    pdf.addPage();
    yPosition = 20;
  }
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text('CÓDIGO DE CONDUTA', margin, yPosition);
  yPosition += 15;

  const conduta = [
    { item: 'Pontualidade', valor: formData.pontualidade },
    { item: 'Vestimenta', valor: formData.vestimenta },
    { item: 'Cuidado com cozinha', valor: formData.cuidadoCozinha },
    { item: 'Cuidado com copa', valor: formData.cuidadoCopa },
    { item: 'Cuidado com sala', valor: formData.cuidadoSala }
  ];

  pdf.setFontSize(10);
  conduta.forEach(item => {
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${item.item}: ${item.valor || 'Não avaliado'}`, margin, yPosition);
    yPosition += 7;
  });
  yPosition += 10;

  // Competências Técnicas
  if (yPosition > 180) {
    pdf.addPage();
    yPosition = 20;
  }
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text('COMPETÊNCIAS TÉCNICAS', margin, yPosition);
  yPosition += 15;

  const tecnicas = [
    { item: 'Sistema Law Net', valor: formData.lawNet },
    { item: 'Linguagem jurídica', valor: formData.linguagemJuridica },
    { item: 'Conhecimento legislativo', valor: formData.conhecimentoLegislativo },
    { item: 'Sistemas judiciários', valor: formData.sistemasJudiciarios },
    { item: 'Postura com cliente', valor: formData.posturaCliente },
    { item: 'Comunicação com cliente', valor: formData.comunicacaoCliente },
    { item: 'Jurisprudência', valor: formData.jurisprudencia }
  ];

  pdf.setFontSize(10);
  tecnicas.forEach(item => {
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${item.item}: ${item.valor || 'Não avaliado'}`, margin, yPosition);
    yPosition += 7;
  });
  yPosition += 15;

  // Nova página para Gestão
  pdf.addPage();
  yPosition = 20;

  // Seção 2 - Gestão
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text('2. ANÁLISE GESTÃO E EQUIPE', margin, yPosition);
  yPosition += 15;

  const gestao = [
    { pergunta: 'Cuidado patrimonial:', resposta: formData.cuidadoPatrimonial },
    { pergunta: 'Postura com advogados:', resposta: formData.posturaAdvogados },
    { pergunta: 'Postura com estagiários:', resposta: formData.posturaEstagiarios },
    { pergunta: 'Importância do trabalho:', resposta: formData.importanciaTrabalho },
    { pergunta: 'Importância do cliente:', resposta: formData.importanciaCliente },
    { pergunta: 'O que gosta no trabalho:', resposta: formData.gostaTrabaho },
    { pergunta: 'Sugestões:', resposta: formData.sugestoes }
  ];

  pdf.setFontSize(10);
  gestao.forEach(item => {
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.setFont('helvetica', 'bold');
    pdf.text(item.pergunta, margin, yPosition);
    yPosition += 7;
    
    pdf.setFont('helvetica', 'normal');
    yPosition = addWrappedText(item.resposta || 'Não respondido', margin, yPosition, pageWidth - 2 * margin);
    yPosition += 10;
  });

  // Auto Feedback
  if (yPosition > 200) {
    pdf.addPage();
    yPosition = 20;
  }
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text('3. AUTO FEEDBACK', margin, yPosition);
  yPosition += 15;

  const autoFeedback = [
    { pergunta: 'O que começar a fazer:', resposta: formData.comecar },
    { pergunta: 'O que continuar fazendo:', resposta: formData.continuar },
    { pergunta: 'O que parar de fazer:', resposta: formData.parar }
  ];

  pdf.setFontSize(10);
  autoFeedback.forEach(item => {
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.setFont('helvetica', 'bold');
    pdf.text(item.pergunta, margin, yPosition);
    yPosition += 7;
    
    pdf.setFont('helvetica', 'normal');
    yPosition = addWrappedText(item.resposta || 'Não respondido', margin, yPosition, pageWidth - 2 * margin);
    yPosition += 10;
  });

  if (formData.comentarioExtra) {
    if (yPosition > 230) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Comentários extras:', margin, yPosition);
    yPosition += 7;
    
    pdf.setFont('helvetica', 'normal');
    yPosition = addWrappedText(formData.comentarioExtra, margin, yPosition, pageWidth - 2 * margin);
    yPosition += 15;
  }

  // Nova página para Clima
  pdf.addPage();
  yPosition = 20;

  // Coleta de Clima
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text('COLETA DE CLIMA', margin, yPosition);
  yPosition += 15;

  const clima = [
    { item: 'Satisfação geral', valor: formData.satisfacaoGeral },
    { item: 'Acolhimento no setor', valor: formData.acolhimentoSetor },
    { item: 'Acolhimento no escritório', valor: formData.acolhimentoEscritorio },
    { item: 'Comunicação interna', valor: formData.comunicacaoInterna },
    { item: 'Comunicação no setor', valor: formData.comunicacaoSetor },
    { item: 'Feedbacks recebidos', valor: formData.feedbacks },
    { item: 'Apoio nas tarefas', valor: formData.apoioTarefas },
    { item: 'Material técnico', valor: formData.materialTecnico },
    { item: 'Colaboração', valor: formData.colaboracao },
    { item: 'Expressar ideias', valor: formData.expressarIdeias },
    { item: 'Equilíbrio acadêmico', valor: formData.equilibrioAcademico }
  ];

  pdf.setFontSize(10);
  clima.forEach(item => {
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${item.item}: ${item.valor || 'Não avaliado'}`, margin, yPosition);
    yPosition += 7;
  });
  yPosition += 15;

  // Sugestões de melhoria
  if (yPosition > 230) {
    pdf.addPage();
    yPosition = 20;
  }
  
  pdf.setFont('helvetica', 'bold');
  pdf.text('Sugestões para melhorar o clima:', margin, yPosition);
  yPosition += 7;
  
  pdf.setFont('helvetica', 'normal');
  yPosition = addWrappedText(formData.sugestoesMelhoria || 'Não respondido', margin, yPosition, pageWidth - 2 * margin);
  yPosition += 10;

  if (formData.experienciaExtra) {
    pdf.setFont('helvetica', 'bold');
    pdf.text('Experiência adicional:', margin, yPosition);
    yPosition += 7;
    
    pdf.setFont('helvetica', 'normal');
    yPosition = addWrappedText(formData.experienciaExtra, margin, yPosition, pageWidth - 2 * margin);
  }

  // Salvar o PDF
  const fileName = `Avaliacao_${formData.nome.replace(/\s+/g, '_')}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`;
  pdf.save(fileName);
};
