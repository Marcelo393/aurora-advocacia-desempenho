
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, ChevronLeft, Scale, Users, ClipboardCheck, BarChart3 } from 'lucide-react';
import PresentationPage from '@/components/evaluation/PresentationPage';
import DataSkillsPage from '@/components/evaluation/DataSkillsPage';
import ManagementFeedbackPage from '@/components/evaluation/ManagementFeedbackPage';
import ClimateCollectionPage from '@/components/evaluation/ClimateCollectionPage';
import ConfirmationPage from '@/components/evaluation/ConfirmationPage';

const Index = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [formData, setFormData] = useState({
    // Dados básicos
    nome: '',
    setor: '',
    
    // Habilidades e Competências
    trabalhoEquipe: '',
    entregas: '',
    opinioesDivergentes: '',
    proatividade: '',
    posturaTrabalho: '',
    situacoesNovas: '',
    pressaoOpcoes: [],
    pressaoContexto: '',
    
    // Código de Conduta
    pontualidade: '',
    vestimenta: '',
    cuidadoCozinha: '',
    cuidadoCopa: '',
    cuidadoSala: '',
    
    // Competências Técnicas
    lawNet: '',
    linguagemJuridica: '',
    conhecimentoLegislativo: '',
    sistemasJudiciarios: '',
    posturaCliente: '',
    comunicacaoCliente: '',
    jurisprudencia: '',
    
    // Gestão e Equipe
    cuidadoPatrimonial: '',
    posturaAdvogados: '',
    posturaEstagiarios: '',
    importanciaTrabalho: '',
    importanciaCliente: '',
    gostaTrabaho: '',
    sugestoes: '',
    
    // Auto feedback
    comecar: '',
    continuar: '',
    parar: '',
    comentarioExtra: '',
    
    // Coleta de Clima
    satisfacaoGeral: '',
    acolhimentoSetor: '',
    acolhimentoEscritorio: '',
    comunicacaoInterna: '',
    comunicacaoSetor: '',
    feedbacks: '',
    apoioTarefas: '',
    materialTecnico: '',
    colaboracao: '',
    expressarIdeias: '',
    equilibrioAcademico: '',
    sugestoesMelhoria: '',
    experienciaExtra: ''
  });

  const pages = [
    { component: PresentationPage, title: "Apresentação", icon: Scale },
    { component: DataSkillsPage, title: "Dados e Habilidades", icon: Users },
    { component: ManagementFeedbackPage, title: "Gestão e Feedback", icon: ClipboardCheck },
    { component: ClimateCollectionPage, title: "Coleta de Clima", icon: BarChart3 }
  ];

  const progress = ((currentPage + 1) / pages.length) * 100;

  const nextPage = () => {
    if (currentPage < pages.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const updateFormData = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  if (currentPage >= pages.length) {
    return <ConfirmationPage formData={formData} />;
  }

  const CurrentPageComponent = pages[currentPage].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-slate-900 text-white py-6 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Scale className="h-8 w-8 text-yellow-400" />
              <div>
                <h1 className="text-2xl font-bold">Sistema de Avaliação de Desempenho</h1>
                <p className="text-slate-300">Escritório de Advocacia</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-300">Página {currentPage + 1} de {pages.length}</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-300">
              <span>Progresso da Avaliação</span>
              <span>{Math.round(progress)}% completo</span>
            </div>
            <Progress value={progress} className="h-2 bg-slate-700" />
          </div>
          
          {/* Page Navigation */}
          <div className="flex justify-between mt-4">
            {pages.map((page, index) => {
              const Icon = page.icon;
              return (
                <div 
                  key={index}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                    index === currentPage 
                      ? 'bg-yellow-400 text-slate-900' 
                      : index < currentPage 
                        ? 'bg-slate-700 text-slate-300' 
                        : 'text-slate-400'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs font-medium hidden sm:block">{page.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
          <CardContent className="p-8">
            <CurrentPageComponent 
              formData={formData}
              updateFormData={updateFormData}
              onNext={nextPage}
              onPrev={prevPage}
              canGoBack={currentPage > 0}
              isLastPage={currentPage === pages.length - 1}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
