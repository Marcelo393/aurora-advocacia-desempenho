
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

  // Cabeçalho profissional
  pdf.setFillColor(25, 36, 63); // Azul escuro corporativo
  pdf.rect(0, 0, pageWidth, 40, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('AVALIAÇÃO DE DESEMPENHO - 2025', pageWidth / 2, 20, { align: 'center' });
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Escritório Morestoni Advocacia', pageWidth / 2, 30, { align: 'center' });
  
  yPosition = 55;

  // Resetar cor do texto
  pdf.setTextColor(0, 0, 0);

  // Data e informações básicas
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DADOS BÁSICOS', margin, yPosition);
  yPosition += 10;

  // Tabela de dados básicos
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  
  const dadosBasicos = [
    ['Nome:', formData.nome],
    ['Setor:', formData.setor],
    ['Data de Preenchimento:', new Date().toLocaleDateString('pt-BR')],
    ['Horário:', new Date().toLocaleTimeString('pt-BR')]
  ];

  dadosBasicos.forEach(([label, value]) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(label, margin, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(value || 'Não informado', margin + 40, yPosition);
    yPosition += 7;
  });

  yPosition += 15;

  // Seção 1 - Habilidades e Competências
  if (yPosition > 250) {
    pdf.addPage();
    yPosition = 20;
  }

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text('1. ANÁLISE DE HABILIDADES E COMPETÊNCIAS', margin, yPosition);
  yPosition += 15;

  const habilidades = [
    { pergunta: 'Trabalho em equipe:', resposta: formData.trabalhoEquipe },
    { pergunta: 'Entregas e prazos:', resposta: formData.entregas },
    { pergunta: 'Opiniões divergentes:', resposta: formData.opinioesDivergentes },
    { pergunta: 'Proatividade:', resposta: formData.proatividade },
    { pergunta: 'Postura no trabalho:', resposta: formData.posturaTrabalho },
    { pergunta: 'Situações novas:', resposta: formData.situacoesNovas }
  ];

  pdf.setFontSize(10);
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

  // Trabalho sob pressão
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

  // Nova página para tabelas de avaliação
  pdf.addPage();
  yPosition = 20;

  // Código de Conduta
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text('CÓDIGO DE CONDUTA', margin, yPosition);
  yPosition += 15;

  const conduta = [
    { item: 'Pontualidade', valor: formData.pontualidade },
    { item: 'Vestimenta', valor: formData.vestimenta },
    { item: 'Cuidado com cozinha', valor: formData.cuidadoCozinha },
    { item: 'Cuidado com copa', valor: formData.cuidadoCopa },
    { item: 'Cuidado com sala', valor: formData.cuidadoSala }
  ];

  // Cabeçalho da tabela
  pdf.setFillColor(240, 240, 240);
  pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 10, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text('COMPETÊNCIA', margin + 2, yPosition);
  pdf.text('AVALIAÇÃO', margin + 100, yPosition);
  yPosition += 8;

  pdf.setFont('helvetica', 'normal');
  conduta.forEach((item, index) => {
    if (index % 2 === 0) {
      pdf.setFillColor(250, 250, 250);
      pdf.rect(margin, yPosition - 3, pageWidth - 2 * margin, 8, 'F');
    }
    pdf.text(item.item, margin + 2, yPosition);
    pdf.text(item.valor || 'Não avaliado', margin + 100, yPosition);
    yPosition += 8;
  });
  yPosition += 10;

  // Competências Técnicas
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
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

  // Cabeçalho da tabela
  pdf.setFillColor(240, 240, 240);
  pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 10, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text('COMPETÊNCIA TÉCNICA', margin + 2, yPosition);
  pdf.text('AVALIAÇÃO', margin + 100, yPosition);
  yPosition += 8;

  pdf.setFont('helvetica', 'normal');
  tecnicas.forEach((item, index) => {
    if (index % 2 === 0) {
      pdf.setFillColor(250, 250, 250);
      pdf.rect(margin, yPosition - 3, pageWidth - 2 * margin, 8, 'F');
    }
    pdf.text(item.item, margin + 2, yPosition);
    pdf.text(item.valor || 'Não avaliado', margin + 100, yPosition);
    yPosition += 8;
  });

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
  pdf.setFontSize(14);
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
  pdf.text('4. COLETA DE CLIMA ORGANIZACIONAL', margin, yPosition);
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

  // Cabeçalho da tabela de clima
  pdf.setFillColor(240, 240, 240);
  pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 10, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text('ASPECTO AVALIADO', margin + 2, yPosition);
  pdf.text('NOTA', margin + 120, yPosition);
  yPosition += 8;

  pdf.setFont('helvetica', 'normal');
  clima.forEach((item, index) => {
    if (index % 2 === 0) {
      pdf.setFillColor(250, 250, 250);
      pdf.rect(margin, yPosition - 3, pageWidth - 2 * margin, 8, 'F');
    }
    pdf.text(item.item, margin + 2, yPosition);
    pdf.text(item.valor || 'Não avaliado', margin + 120, yPosition);
    yPosition += 8;
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

  // Rodapé em todas as páginas
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    pdf.text(
      `Gerado em: ${new Date().toLocaleString('pt-BR')} | Página ${i} de ${totalPages}`,
      pageWidth / 2,
      pdf.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  // Salvar o PDF
  const fileName = `Avaliacao_${formData.nome.replace(/\s+/g, '_')}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`;
  pdf.save(fileName);
};
