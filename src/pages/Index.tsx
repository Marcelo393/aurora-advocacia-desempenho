import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { soundService } from '@/services/soundService';
import { generatePDF } from '@/services/pdfService';

// Import screen components
import WelcomePage from '@/components/evaluation/WelcomePage';
import PresentationPage from '@/components/evaluation/PresentationPage';
import DataSkillsPage from '@/components/evaluation/DataSkillsPage';
import ManagementFeedbackPage from '@/components/evaluation/ManagementFeedbackPage';
import ClimateCollectionPage from '@/components/evaluation/ClimateCollectionPage';
import ConfirmationPage from '@/components/evaluation/ConfirmationPage';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    setor: '',
    trabalhoEquipe: '',
    entregas: '',
    opinioesDivergentes: '',
    proatividade: '',
    posturaTrabalho: '',
    situacoesNovas: '',
    pressaoOpcoes: [] as any[],
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
  });

  const screens = [
    { component: WelcomePage, title: "Bem-vindo" },
    { component: PresentationPage, title: "Apresentação" },
    { component: DataSkillsPage, title: "Dados e Habilidades" },
    { component: ManagementFeedbackPage, title: "Feedback de Gestão" },
    { component: ClimateCollectionPage, title: "Coleta de Clima" },
    { component: ConfirmationPage, title: "Confirmação" }
  ];

  useEffect(() => {
    soundService.playTransition();
  }, [currentScreen]);

  const updateFormData = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextPage = async () => {
    if (currentScreen === screens.length - 1) {
      // Save data to localStorage
      const savedData = JSON.parse(localStorage.getItem('evaluation-responses') || '[]');
      const newResponse = {
        ...formData,
        data: new Date().toISOString(),
        notaGeral: calculateAverageScore()
      };
      savedData.push(newResponse);
      localStorage.setItem('evaluation-responses', JSON.stringify(savedData));
      
      // Generate PDF
      await generatePDF(formData);
      return;
    }

    setIsTransitioning(true);
    soundService.playTransition();
    
    setTimeout(() => {
      setCurrentScreen(prev => prev + 1);
      setIsTransitioning(false);
    }, 300);
  };

  const prevPage = () => {
    if (currentScreen > 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentScreen(prev => prev - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const calculateAverageScore = () => {
    const numericFields = [
      'trabalhoEquipe', 'entregas', 'opinioesDivergentes', 'proatividade',
      'comunicacao', 'pontualidade', 'metas', 'qualidade', 'adaptabilidade',
      'iniciativa', 'colaboracao', 'flexibilidade', 'responsabilidade'
    ];
    
    const scores = numericFields
      .map(field => parseFloat(formData[field as keyof typeof formData] as string))
      .filter(score => !isNaN(score));
    
    return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  };

  const progress = ((currentScreen - 1) / (screens.length - 1)) * 100;
  const isCompleted = currentScreen === screens.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              Avaliação de Performance
            </h1>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>{currentScreen}</span>
              <span>/</span>
              <span>{screens.length}</span>
            </div>
          </div>
          
          <div className="relative">
            <Progress value={progress} className="h-3 bg-gray-200" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-white">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <Card className={`transition-all duration-500 ${isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              {isCompleted && <CheckCircle className="h-6 w-6 text-green-600" />}
              <span className={isCompleted ? 'text-green-700' : 'text-gray-700'}>
                {screens[currentScreen - 1]?.title || 'Avaliação'}
              </span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="min-h-[600px]">
            <div className={`transition-all duration-300 ${isTransitioning ? 'translate-x-4 opacity-0' : 'translate-x-0 opacity-100'}`}>
              {currentScreen === 1 ? (
                <PresentationPage onNext={nextPage} />
              ) : currentScreen === 2 ? (
                <DataSkillsPage 
                  formData={formData}
                  updateFormData={updateFormData}
                  onNext={nextPage}
                  onPrev={prevPage}
                  canGoBack={currentScreen > 2}
                />
              ) : currentScreen === 3 ? (
                <ManagementFeedbackPage 
                  formData={formData}
                  updateFormData={updateFormData}
                  onNext={nextPage}
                  onPrev={prevPage}
                  canGoBack={currentScreen > 2}
                />
              ) : currentScreen === 4 ? (
                <ClimateCollectionPage 
                  formData={formData}
                  updateFormData={updateFormData}
                  onNext={nextPage}
                  onPrev={prevPage}
                  canGoBack={currentScreen > 2}
                  isLastPage={currentScreen === screens.length - 1}
                />
              ) : currentScreen === 5 ? (
                <ConfirmationPage 
                  formData={formData}
                  onFinish={nextPage}
                  onPrev={prevPage}
                />
              ) : null}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Footer */}
        <div className="mt-8 flex justify-between items-center">
          <Button
            variant="outline"
            onClick={prevPage}
            disabled={currentScreen <= 1 || isTransitioning}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Anterior</span>
          </Button>

          <div className="text-sm text-gray-500">
            Passo {currentScreen} de {screens.length}
          </div>

          <Button
            onClick={nextPage}
            disabled={isTransitioning}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
          >
            <span>{currentScreen === screens.length - 1 ? 'Finalizar' : 'Próximo'}</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
