
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Download, Mail, Calendar } from 'lucide-react';

interface ConfirmationPageProps {
  formData: any;
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ formData }) => {
  const handleDownloadSummary = () => {
    // Criar um resumo simples das respostas
    const summary = `
AVALIAÇÃO DE DESEMPENHO - RESUMO
================================

DADOS BÁSICOS:
- Nome: ${formData.nome || 'Não informado'}
- Setor: ${formData.setor || 'Não informado'}

ANÁLISE DE HABILIDADES:
- Trabalho em Equipe: ${formData.trabalhoEquipe ? 'Respondido' : 'Não respondido'}
- Entregas e Prazos: ${formData.entregas ? 'Respondido' : 'Não respondido'}
- Opiniões Divergentes: ${formData.opinioesDivergentes ? 'Respondido' : 'Não respondido'}
- Proatividade: ${formData.proatividade ? 'Respondido' : 'Não respondido'}
- Postura no Trabalho: ${formData.posturaTrabalho ? 'Respondido' : 'Não respondido'}
- Situações Novas: ${formData.situacoesNovas ? 'Respondido' : 'Não respondido'}

CÓDIGO DE CONDUTA:
- Pontualidade: ${formData.pontualidade || 'Não avaliado'}
- Vestimenta: ${formData.vestimenta || 'Não avaliado'}
- Cuidado com Cozinha: ${formData.cuidadoCozinha || 'Não avaliado'}
- Cuidado com Copa: ${formData.cuidadoCopa || 'Não avaliado'}
- Cuidado com Sala: ${formData.cuidadoSala || 'Não avaliado'}

GESTÃO E EQUIPE:
- Cuidado Patrimonial: ${formData.cuidadoPatrimonial ? 'Respondido' : 'Não respondido'}
- Postura com Advogados: ${formData.posturaAdvogados ? 'Respondido' : 'Não respondido'}
- Postura com Estagiários: ${formData.posturaEstagiarios ? 'Respondido' : 'Não respondido'}
- Importância do Trabalho: ${formData.importanciaTrabalho ? 'Respondido' : 'Não respondido'}
- Importância do Cliente: ${formData.importanciaCliente ? 'Respondido' : 'Não respondido'}

AUTO FEEDBACK:
- O que começar a fazer: ${formData.comecar ? 'Respondido' : 'Não respondido'}
- O que continuar fazendo: ${formData.continuar ? 'Respondido' : 'Não respondido'}
- O que parar de fazer: ${formData.parar ? 'Respondido' : 'Não respondido'}

COLETA DE CLIMA:
- Satisfação Geral: ${formData.satisfacaoGeral || 'Não avaliado'}
- Sugestões de Melhoria: ${formData.sugestoesMelhoria ? 'Respondido' : 'Não respondido'}

Data de Conclusão: ${new Date().toLocaleDateString('pt-BR')}
    `;

    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `avaliacao_desempenho_${formData.nome?.replace(/\s+/g, '_') || 'resumo'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Success Header */}
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-green-500 to-green-400 p-6 rounded-full shadow-lg">
            <CheckCircle className="h-16 w-16 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Avaliação Concluída!</h1>
          <p className="text-xl text-slate-600">
            Parabéns, <span className="font-semibold text-slate-900">{formData.nome}</span>! 
            Sua autoavaliação foi enviada com sucesso.
          </p>
        </div>
      </div>

      {/* Success Message */}
      <Card className="shadow-xl border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center space-x-2">
            <Mail className="h-5 w-5 text-green-600" />
            <span>Confirmação de Envio</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-700 leading-relaxed">
            Sua avaliação de desempenho foi registrada com sucesso em nosso sistema. 
            Agradecemos sua dedicação em responder todas as questões de forma detalhada e sincera.
          </p>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">
              <strong>Data de conclusão:</strong> {new Date().toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            <p className="text-sm text-green-800">
              <strong>Setor:</strong> {formData.setor}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-yellow-600" />
            <span>Próximas Etapas</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-slate-900 mb-2">Etapa 2 - Reunião Individual</h4>
              <p className="text-sm text-slate-700">
                Será marcado um horário para reunião individual de feedbacks e parecer com a gestão.
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-slate-900 mb-2">Análise dos Resultados</h4>
              <p className="text-sm text-slate-700">
                Sua avaliação será analisada junto com as demais para identificar pontos de melhoria e desenvolvimento.
              </p>
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border">
            <h4 className="font-semibold text-slate-900 mb-2">Lembre-se:</h4>
            <p className="text-sm text-slate-700">
              Esta avaliação é uma ferramenta de desenvolvimento pessoal e profissional. 
              Use este momento de reflexão para continuar crescendo em sua carreira jurídica.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-slate-900">Resumo da Sua Avaliação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg">
              <div className="text-2xl font-bold">4</div>
              <div className="text-sm opacity-90">Seções Completadas</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg">
              <div className="text-2xl font-bold">25+</div>
              <div className="text-sm opacity-90">Questões Respondidas</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-4 rounded-lg">
              <div className="text-2xl font-bold">100%</div>
              <div className="text-sm opacity-90">Progresso Concluído</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-lg">
              <div className="text-2xl font-bold">✓</div>
              <div className="text-sm opacity-90">Enviado com Sucesso</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          onClick={handleDownloadSummary}
          variant="outline"
          className="border-slate-300 text-slate-700 hover:bg-slate-50"
        >
          <Download className="mr-2 h-4 w-4" />
          Baixar Resumo
        </Button>
        <Button 
          onClick={() => window.location.href = '/'}
          className="bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white"
        >
          Voltar ao Início
        </Button>
      </div>

      {/* Thank You Message */}
      <div className="text-center space-y-2 pt-8 border-t border-slate-200">
        <p className="text-lg font-semibold text-slate-900">
          Obrigado pela sua participação! 🎉
        </p>
        <p className="text-slate-600">
          Sua contribuição é fundamental para o crescimento e melhoria contínua do nosso escritório.
        </p>
      </div>
    </div>
  );
};

export default ConfirmationPage;
