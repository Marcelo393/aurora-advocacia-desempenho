
import { useState } from 'react';
import { FormData } from '@/types/formData';

const initialFormData: FormData = {
  nome: '',
  setor: '',
  trabalhoEquipe: '',
  entregas: '',
  opinioesDivergentes: '',
  proatividade: '',
  posturaTrabalho: '',
  situacoesNovas: '',
  pressaoOpcoes: [],
  pressaoOutros: '',
  comunicacao: '',
  pontualidade: '',
  metas: '',
  qualidade: '',
  adaptabilidade: '',
  iniciativa: '',
  colaboracao: '',
  flexibilidade: '',
  responsabilidade: '',
  atencaoDetalhes: '',
  resolucaoProblemas: '',
  lideranca: '',
  criatividade: '',
  organizacao: '',
  eticaProfissional: '',
  aprendizagem: '',
  relacionamentoInterpessoal: '',
  gestaoTempo: '',
  tomadaDecisao: '',
  visaoEstrategica: '',
  satisfacaoGeral: '',
  aspectosPositivos: '',
  aspectosMelhorar: '',
  sugestoesMelhorias: '',
  recursos: '',
  treinamentos: '',
  comunicacaoInterna: '',
  reconhecimento: '',
  equilibrioVida: '',
  crescimentoProfissional: '',
  autonomia: '',
  feedbackRegular: '',
  colaboracaoEquipes: '',
  inovacao: '',
  diversidadeInclusao: '',
  sustentabilidade: '',
  transparencia: '',
  apoioGestao: '',
  objetivosProfissionais: '',
  habilidadesDesenvolv: '',
  interesseTreinamento: '',
  carreira: '',
  contribuicaoEmpresa: '',
  melhoriaProcessos: '',
  feedbackGestao: '',
  expectativasFuturas: '',
  comentarios: '',
  experienciaExtra: ''
};

export const useEvaluationState = () => {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const calculateAverageScore = () => {
    const numericFields = [
      'trabalhoEquipe', 'entregas', 'opinioesDivergentes', 'proatividade',
      'comunicacao', 'pontualidade', 'metas', 'qualidade', 'adaptabilidade',
      'iniciativa', 'colaboracao', 'flexibilidade', 'responsabilidade'
    ];
    
    const scores = numericFields
      .map(field => parseFloat(formData[field as keyof FormData] as string))
      .filter(score => !isNaN(score));
    
    return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  };

  return {
    currentScreen,
    setCurrentScreen,
    isTransitioning,
    setIsTransitioning,
    formData,
    updateFormData,
    calculateAverageScore
  };
};
