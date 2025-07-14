
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Volume2, VolumeX, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { generatePDF } from '@/services/pdfService';
import { playSuccess, playTransition } from '@/services/soundService';

// Import components
import WelcomePage from '@/components/evaluation/WelcomePage';
import DataSkillsPage from '@/components/evaluation/DataSkillsPage';
import PresentationPage from '@/components/evaluation/PresentationPage';
import ManagementFeedbackPage from '@/components/evaluation/ManagementFeedbackPage';
import ClimateCollectionPage from '@/components/evaluation/ClimateCollectionPage';
import ConfirmationPage from '@/components/evaluation/ConfirmationPage';

export interface FormData {
  nome: string;
  setor: string;
  trabalhoEquipe: string;
  entregas: string;
  opinioesDivergentes: string;
  proatividade: string;
  posturaTrabalho: string;
  situacoesNovas: string;
  pressaoOpcoes: any[];
  pressaoComportamento: string;
  apresentacaoPublico: string;
  apresentacaoSuperior: string;
  apresentacaoCliente: string;
  apresentacaoReuniao: string;
  feedbackSuperior: string;
  feedbackColega: string;
  feedbackCliente: string;
  gestaoEquipe: string;
  gestaoConflito: string;
  gestaoMeta: string;
  gestaoDecisao: string;
  climaGeral: string;
  climaEquipe: string;
  climaComunicacao: string;
  climaCrescimento: string;
  climaReconhecimento: string;
  climaEquilibrio: string;
  objetivosProfissionais: string;
  expectativaEmpresa: string;
  sugestoesMelhorias: string;
  experienciaExtra: string;
}

const Index = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    setor: '',
    trabalhoEquipe: '',
    entregas: '',
    opinioesDivergentes: '',
    proatividade: '',
    posturaTrabalho: '',
    situacoesNovas: '',
    pressaoOpcoes: [],
    pressaoComportamento: '',
    apresentacaoPublico: '',
    apresentacaoSuperior: '',
    apresentacaoCliente: '',
    apresentacaoReuniao: '',
    feedbackSuperior: '',
    feedbackColega: '',
    feedbackCliente: '',
    gestaoEquipe: '',
    gestaoConflito: '',
    gestaoMeta: '',
    gestaoDecisao: '',
    climaGeral: '',
    climaEquipe: '',
    climaComunicacao: '',
    climaCrescimento: '',
    climaReconhecimento: '',
    climaEquilibrio: '',
    objetivosProfissionais: '',
    expectativaEmpresa: '',
    sugestoesMelhorias: '',
    experienciaExtra: ''
  });

  const pageNames = [
    'Boas-vindas',
    'Dados e Habilidades',
    'Habilidades de Apresentação',
    'Gestão e Feedback',
    'Clima Organizacional',
    'Finalização'
  ];

  const progress = ((currentPage + 1) / pageNames.length) * 100;

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (soundEnabled) {
      playTransition();
    }
    setCurrentPage(prev => Math.min(prev + 1, pageNames.length - 1));
  };

  const handlePrevious = () => {
    if (soundEnabled) {
      playTransition();
    }
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  const handleDownloadPDF = async () => {
    try {
      if (soundEnabled) {
        playSuccess();
      }
      
      await generatePDF(formData);
      toast({
        title: "PDF gerado com sucesso!",
        description: "Seu arquivo foi baixado automaticamente.",
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  const renderCurrentPage = () => {
    const commonProps = {
      formData,
      onInputChange: handleInputChange,
      onNext: handleNext,
      onPrevious: handlePrevious,
      canGoNext: currentPage < pageNames.length - 1,
      canGoBack: currentPage > 0,
    };

    switch (currentPage) {
      case 0:
        return <WelcomePage {...commonProps} />;
      case 1:
        return <DataSkillsPage {...commonProps} />;
      case 2:
        return <PresentationPage {...commonProps} />;
      case 3:
        return <ManagementFeedbackPage {...commonProps} />;
      case 4:
        return <ClimateCollectionPage {...commonProps} />;
      case 5:
        return (
          <ConfirmationPage 
            formData={formData}
            onDownloadPDF={handleDownloadPDF}
            canGoBack={true}
            onPrevious={handlePrevious}
          />
        );
      default:
        return <WelcomePage {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Avaliação de Desempenho
              </h1>
              <p className="text-slate-600">
                Morestoni Sociedade de Advogados
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-slate-600 hover:text-slate-800"
            >
              {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-600">
              <span>{pageNames[currentPage]}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between text-xs text-slate-500">
              <span>Etapa {currentPage + 1} de {pageNames.length}</span>
              <span>
                {currentPage === pageNames.length - 1 
                  ? 'Quase lá!' 
                  : `${pageNames.length - currentPage - 1} etapas restantes`
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {renderCurrentPage()}
      </div>
    </div>
  );
};

export default Index;
