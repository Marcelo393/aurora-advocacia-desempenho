
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

export const generatePDF = async (formData: FormDataToSend) => {
  try {
    // Save evaluation data for dashboard
    saveEvaluationData(formData);

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;
    let currentY = 20;

    // Header
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('AVALIAÇÃO DE DESEMPENHO - 2025', pageWidth / 2, currentY, { align: 'center' });
    
    currentY += 10;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Morestoni Sociedade de Advogados', pageWidth / 2, currentY, { align: 'center' });
    
    currentY += 20;
    
    // Dados Básicos
    addSection(pdf, 'DADOS BÁSICOS', currentY);
    currentY += 15;
    
    addField(pdf, 'Nome:', formData.nome || 'Não informado', currentY);
    currentY += 8;
    addField(pdf, 'Setor:', formData.setor || 'Não informado', currentY);
    currentY += 15;

    // Check if we need a new page
    if (currentY > 250) {
      pdf.addPage();
      currentY = 20;
    }

    // Habilidades e Competências
    addSection(pdf, 'ANÁLISE DE HABILIDADES E COMPETÊNCIAS', currentY);
    currentY += 15;

    const skillQuestions = [
      { key: 'trabalhoEquipe', label: 'Trabalho em equipe' },
      { key: 'entregas', label: 'Entregas e prazos' },
      { key: 'opinioesDivergentes', label: 'Opiniões divergentes' },
      { key: 'proatividade', label: 'Proatividade' },
      { key: 'posturaTrabalho', label: 'Postura no trabalho' },
      { key: 'situacoesNovas', label: 'Situações novas' }
    ];

    skillQuestions.forEach(question => {
      const response = formData[question.key as keyof FormDataToSend] || 'Não respondido';
      addMultilineField(pdf, question.label + ':', String(response), currentY);
      currentY += Math.max(20, Math.ceil(String(response).length / 80) * 6);
      
      if (currentY > 250) {
        pdf.addPage();
        currentY = 20;
      }
    });

    // Pressão
    if (formData.pressaoOpcoes && formData.pressaoOpcoes.length > 0) {
      addField(pdf, 'Sob pressão:', formData.pressaoOpcoes.join(', '), currentY);
      currentY += 10;
      if (formData.pressaoContexto) {
        addMultilineField(pdf, 'Contexto:', formData.pressaoContexto, currentY);
        currentY += Math.max(15, Math.ceil(formData.pressaoContexto.length / 80) * 6);
      }
    }

    // New page for evaluations
    pdf.addPage();
    currentY = 20;

    // Código de Conduta
    addSection(pdf, 'CÓDIGO DE CONDUTA', currentY);
    currentY += 15;

    const conductItems = [
      { key: 'pontualidade', label: 'Pontualidade' },
      { key: 'vestimenta', label: 'Vestimenta' },
      { key: 'cuidadoCozinha', label: 'Cuidado com a cozinha' },
      { key: 'cuidadoCopa', label: 'Cuidado com a copa' },
      { key: 'cuidadoSala', label: 'Cuidado com a sala de trabalho' }
    ];

    conductItems.forEach(item => {
      const value = formData[item.key as keyof FormDataToSend] || 'Não avaliado';
      addField(pdf, item.label + ':', String(value), currentY);
      currentY += 8;
    });

    currentY += 10;

    // Competências Técnicas
    addSection(pdf, 'COMPETÊNCIAS TÉCNICAS', currentY);
    currentY += 15;

    const technicalItems = [
      { key: 'lawNet', label: 'Sistema Law Net' },
      { key: 'linguagemJuridica', label: 'Linguagem técnica jurídica' },
      { key: 'conhecimentoLegislativo', label: 'Conhecimento legislativo' },
      { key: 'sistemasJudiciarios', label: 'Sistemas judiciários' },
      { key: 'posturaCliente', label: 'Postura profissional - cliente' },
      { key: 'comunicacaoCliente', label: 'Comunicação - cliente' },
      { key: 'jurisprudencia', label: 'Conhecimento jurisprudência' }
    ];

    technicalItems.forEach(item => {
      const value = formData[item.key as keyof FormDataToSend] || 'Não avaliado';
      addField(pdf, item.label + ':', String(value), currentY);
      currentY += 8;
      
      if (currentY > 260) {
        pdf.addPage();
        currentY = 20;
      }
    });

    // Add other sections if they exist
    if (formData.satisfacaoGeral) {
      if (currentY > 200) {
        pdf.addPage();
        currentY = 20;
      }
      
      addSection(pdf, 'CLIMA ORGANIZACIONAL', currentY);
      currentY += 15;
      
      const climateFields = [
        { key: 'satisfacaoGeral', label: 'Satisfação Geral' },
        { key: 'acolhimentoSetor', label: 'Acolhimento - Setor' },
        { key: 'comunicacaoInterna', label: 'Comunicação Interna' }
      ];
      
      climateFields.forEach(field => {
        if (formData[field.key as keyof FormDataToSend]) {
          addField(pdf, field.label + ':', String(formData[field.key as keyof FormDataToSend]), currentY);
          currentY += 8;
        }
      });
    }

    // Footer
    const timestamp = new Date().toLocaleString('pt-BR');
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.text(`Gerado em: ${timestamp}`, 20, pageHeight - 10);

    // Download
    const fileName = `Avaliacao_${formData.nome?.replace(/\s+/g, '_') || 'Usuario'}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);

    return true;
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw new Error('Erro ao gerar PDF. Tente novamente.');
  }
};

function addSection(pdf: jsPDF, title: string, y: number) {
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text(title, 20, y);
  
  // Add underline
  const textWidth = pdf.getTextWidth(title);
  pdf.line(20, y + 2, 20 + textWidth, y + 2);
}

function addField(pdf: jsPDF, label: string, value: string, y: number) {
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text(label, 20, y);
  
  pdf.setFont('helvetica', 'normal');
  const labelWidth = pdf.getTextWidth(label);
  
  // Split long text
  const maxWidth = 170 - labelWidth;
  const lines = pdf.splitTextToSize(value, maxWidth);
  pdf.text(lines[0] || '', 25 + labelWidth, y);
}

function addMultilineField(pdf: jsPDF, label: string, value: string, y: number) {
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text(label, 20, y);
  
  pdf.setFont('helvetica', 'normal');
  const lines = pdf.splitTextToSize(value, 170);
  
  lines.forEach((line: string, index: number) => {
    pdf.text(line, 20, y + 6 + (index * 6));
  });
}

function saveEvaluationData(formData: FormDataToSend) {
  try {
    const existingData = localStorage.getItem('evaluation-responses');
    const evaluations = existingData ? JSON.parse(existingData) : [];
    
    // Calculate general score from form data
    const scores: number[] = [];
    
    // Add conduct scores
    const conductItems = ['pontualidade', 'vestimenta', 'cuidadoCozinha', 'cuidadoCopa', 'cuidadoSala'];
    conductItems.forEach(item => {
      const value = formData[item as keyof FormDataToSend];
      if (value === 'excelente') scores.push(5);
      else if (value === 'satisfatorio') scores.push(4);
      else if (value === 'neutro') scores.push(3);
      else if (value === 'insatisfatorio') scores.push(2);
    });
    
    // Add technical scores
    const technicalItems = ['lawNet', 'linguagemJuridica', 'conhecimentoLegislativo', 'sistemasJudiciarios', 'posturaCliente', 'comunicacaoCliente', 'jurisprudencia'];
    technicalItems.forEach(item => {
      const value = formData[item as keyof FormDataToSend];
      if (value === 'excelente') scores.push(5);
      else if (value === 'satisfatorio') scores.push(4);
      else if (value === 'neutro') scores.push(3);
      else if (value === 'insatisfatorio') scores.push(2);
      else if (value === 'nao_utilizo') scores.push(3);
    });
    
    const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 3.5;
    
    const newEvaluation = {
      nome: formData.nome || 'Usuário',
      setor: formData.setor || 'Não informado',
      data: new Date().toISOString().split('T')[0],
      notaGeral: Number(averageScore.toFixed(1)),
      habilidades: {
        trabalhoEquipe: Math.random() * 2 + 3, // Mock for demo
        entregas: Math.random() * 2 + 3,
        proatividade: Math.random() * 2 + 3,
        comunicacao: Math.random() * 2 + 3,
        lideranca: Math.random() * 2 + 3
      },
      dadosCompletos: formData
    };
    
    evaluations.push(newEvaluation);
    localStorage.setItem('evaluation-responses', JSON.stringify(evaluations));
    
    console.log('Dados da avaliação salvos para o dashboard:', newEvaluation);
  } catch (error) {
    console.error('Erro ao salvar dados da avaliação:', error);
  }
}
