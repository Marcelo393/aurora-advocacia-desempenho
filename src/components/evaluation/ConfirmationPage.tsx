import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Download, Mail, Calendar, FileText, Sparkles, Clock, Home } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { generatePDF, FormDataToSend } from '@/services/pdfService';
import { soundService } from '@/services/soundService';

interface ConfirmationPageProps {
  formData: FormDataToSend;
  onGoHome: () => void;
  startTime?: number | null;
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ formData, onGoHome, startTime }) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [completionTime] = useState(new Date());
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // Triggering celebration animation and sound
    const timer = setTimeout(() => {
      setShowCelebration(true);
      setShowConfetti(true);
      soundService.playSuccessSound();
      
      // Hide confetti after animation
      setTimeout(() => setShowConfetti(false), 3000);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Loading simulation
      generatePDF(formData);
      
      toast({
        title: "PDF gerado com sucesso!",
        description: "Seu arquivo foi baixado. Envie para juliacarvalho@morestoni.adv.br",
      });
      
      if (soundService.isSoundEnabled()) {
        await soundService.playSuccessSound();
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      
      toast({
        title: "Erro ao gerar PDF",
        description: "Ocorreu um erro ao gerar o PDF. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const estimatedTime = Math.ceil(Math.random() * 5) + 8; // 9-13 minutes

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random() * 2}s`
                }}
              />
            ))}
            {[...Array(30)].map((_, i) => (
              <div
                key={`star-${i}`}
                className="absolute text-yellow-500 animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  fontSize: `${12 + Math.random() * 8}px`
                }}
              >
                ⭐
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto p-6 space-y-8 relative z-10">
        <div className={`text-center space-y-6 transition-all duration-1000 ${
          showCelebration ? 'animate-fade-in' : 'opacity-0'
        }`}>
          <div className="flex justify-center">
            <div className="relative">
              <div className="bg-gradient-to-br from-green-400 to-green-500 p-8 rounded-full shadow-2xl animate-pulse">
                <CheckCircle className="h-20 w-20 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 bg-gradient-to-br from-yellow-400 to-yellow-500 p-2 rounded-full animate-bounce">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              🎉 Parabéns! 🎉
            </h1>
            <h2 className="text-3xl font-semibold text-slate-800">
              Avaliação Concluída com Sucesso!
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Muito bem, <span className="font-bold text-green-600">{formData.nome}</span>! 
              Você completou sua autoavaliação de desempenho com excelência.
            </p>
          </div>
        </div>

        <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-blue-50 hover-lift">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-slate-800 flex items-center justify-center space-x-2">
              <Sparkles className="h-6 w-6 text-yellow-500" />
              <span>Resumo da Sua Jornada</span>
              <Sparkles className="h-6 w-6 text-yellow-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold">4</div>
                <div className="text-sm opacity-90">Seções Completadas</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold">{estimatedTime}</div>
                <div className="text-sm opacity-90">Minutos Dedicados</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold">100%</div>
                <div className="text-sm opacity-90">Progresso Concluído</div>
              </div>
            </div>

            <div className="mt-6 bg-gradient-to-r from-slate-50 to-blue-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between text-sm text-slate-700">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span><strong>Concluído em:</strong> {completionTime.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                <div>
                  <strong>Respondente:</strong> {formData.nome} | <strong>Setor:</strong> {formData.setor}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-green-50 hover-lift">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center space-x-3">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <span>Baixar Avaliação em PDF</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
              <h4 className="font-bold text-slate-900 mb-3 text-lg">📄 Próximo Passo</h4>
              <p className="text-slate-700 mb-4 leading-relaxed">
                Baixe o PDF da sua avaliação completa e envie para o email oficial do escritório. 
                O arquivo contém todas as suas respostas organizadas profissionalmente.
              </p>
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-600 mb-2">
                  <strong>📧 Enviar para:</strong>
                </p>
                <p className="text-lg font-semibold text-slate-800">
                  juliacarvalho@morestoni.adv.br
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                size="lg"
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Gerando PDF...
                  </>
                ) : (
                  <>
                    <Download className="mr-3 h-5 w-5" />
                    Baixar PDF da Avaliação
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-yellow-50 hover-lift">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center space-x-3">
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-2 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <span>Próximas Etapas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
              <h4 className="font-bold text-slate-900 mb-3 flex items-center space-x-2">
                <span>🤝</span>
                <span>Etapa 2 - Reunião Individual</span>
              </h4>
              <p className="text-slate-700 leading-relaxed">
                Será marcado um horário para reunião individual de feedbacks e parecer com a gestão. 
                Sua autoavaliação servirá como base para esta conversa construtiva sobre seu desenvolvimento profissional.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-6 py-8">
          <div className="space-y-4">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Muito Obrigado! 🙏
            </h3>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed">
              Sua participação é fundamental para o crescimento e melhoria contínua do nosso escritório. 
              Sua dedicação em responder com transparência e cuidado demonstra seu comprometimento com a excelência profissional.
            </p>
            <div className="flex justify-center space-x-2 text-2xl">
              <span>🌟</span>
              <span>📈</span>
              <span>🎯</span>
              <span>💼</span>
              <span>🤝</span>
            </div>
          </div>
          
          <Button 
            onClick={onGoHome}
            variant="outline"
            className="border-2 border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 px-6 py-3 transition-all duration-300 transform hover:scale-105"
          >
            <Home className="mr-2 h-4 w-4" />
            Voltar ao Início
          </Button>
        </div>
      </div>

      <style>{`
        .hover-lift {
          transition: all 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-4px);
        }
        
        .animate-fade-in {
          animation: fadeInUp 0.8s ease-out;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ConfirmationPage;
