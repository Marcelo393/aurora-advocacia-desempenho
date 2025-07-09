
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, ChevronLeft, Users, MessageSquare, Target } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ManagementFeedbackPageProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
  canGoBack: boolean;
}

const ManagementFeedbackPage: React.FC<ManagementFeedbackPageProps> = ({ 
  formData, 
  updateFormData, 
  onNext, 
  onPrev, 
  canGoBack 
}) => {
  const [errors, setErrors] = useState<string[]>([]);

  const managementQuestions = [
    {
      key: 'cuidadoPatrimonial',
      question: 'Como você enxerga sua postura no cuidado patrimonial do escritório? (cuidado com a infraestrutura e o bem coletivo)'
    },
    {
      key: 'posturaAdvogados',
      question: 'Como você enxerga sua postura perante aos advogados do escritório?',
      example: 'Se você sente abertura para conversar e tirar dúvida com todos'
    },
    {
      key: 'posturaEstagiarios',
      question: 'Como você enxerga sua postura perante aos demais estagiários do escritório?',
      example: 'se você busca interagir com os colegas de trabalho'
    },
    {
      key: 'importanciaTrabalho',
      question: 'Como você entende a importância das etapas do seu trabalho para o resultado final: o êxito do processo para o obtenção do direito ao cliente? Explique seu ponto de vista.',
      explanation: 'A ideia desta pergunta é compreender qual o nível de consciência de cada um sobre a importância e impacto do seu trabalho no todo.'
    },
    {
      key: 'importanciaCliente',
      question: 'Qual a importância do cliente para você?',
      explanation: 'A ideia desta pergunta é compreender qual o nível de consciência de cada um em relação a importância do cliente. Utilize este espaço para escrever de forma completa e detalhada.'
    },
    {
      key: 'gostaTrabaho',
      question: 'Em uma frase, o que te faz gostar do seu trabalho no escritório?'
    },
    {
      key: 'sugestoes',
      question: 'Você tem alguma sugestão voltada a trabalho, equipe ou ambiente para fazer?'
    }
  ];

  const feedbackQuestions = [
    {
      key: 'comecar',
      question: 'O que eu deveria começar a fazer?',
      explanation: 'Algo que você considera importante para melhorar o seu desempenho no trabalho, mas que por algum motivo não o fez ainda. Exemplo: Preciso começar a desenvolver minha comunicação pois pretendo estar preparado para começar a acompanhar atendimentos quando for necessário.'
    },
    {
      key: 'continuar',
      question: 'O que eu deveria continuar fazendo?',
      explanation: 'Algo que você considera que "manda bem", que você se destaca ou até mesmo algo a mais que você entrega e que lhe traz um diferencial. Exemplo: Por ter uma postura proativa eu consigo me desenvolver mais rápido nas minhas ações, sendo algo que devo na minha visão continuar fazendo.'
    },
    {
      key: 'parar',
      question: 'O que eu deveria mudar e/ou parar de fazer?',
      explanation: 'Todos temos algo que em nós mesmos possa incomodar, e nesse caso, seria algum comportamento que você enxerga que ao parar, te ajudaria a alcançar maiores resultados. Exemplo: Me sinto envergonhado em interagir com pessoas de outro setor, vejo que encontrando alguma forma de parar com esse sentimento, poderia criar interações pessoais duradouras e ajudar no trabalho em equipe.'
    }
  ];

  const validateForm = () => {
    const requiredFields = [
      ...managementQuestions.map(q => q.key),
      ...feedbackQuestions.map(q => q.key)
    ];
    
    const newErrors = [];
    
    requiredFields.forEach(field => {
      if (!formData[field]?.trim()) {
        newErrors.push(field);
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    } else {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios antes de continuar.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    updateFormData({ [field]: value });
    if (errors.includes(field)) {
      setErrors(errors.filter(error => error !== field));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Gestão e Feedback</h2>
        <p className="text-slate-600">Página 3 de 4</p>
      </div>

      {/* Análise Gestão e Equipe */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-900">
            <Users className="h-5 w-5 text-yellow-600" />
            <span>2 - Análise Gestão e Equipe</span>
          </CardTitle>
          <p className="text-slate-600 mt-2">Desenvolva as respostas de forma detalhada.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {managementQuestions.map((item, index) => (
            <div key={item.key}>
              <Label className="text-slate-700 font-medium">
                {index + 1}. {item.question} <span className="text-red-500">*</span>
              </Label>
              {item.example && (
                <p className="text-sm text-slate-500 mt-1">
                  Exemplo: {item.example}
                </p>
              )}
              {item.explanation && (
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 mt-2">
                  <p className="text-sm text-slate-700">{item.explanation}</p>
                </div>
              )}
              <Textarea
                value={formData[item.key] || ''}
                onChange={(e) => handleInputChange(item.key, e.target.value)}
                className={`mt-2 min-h-[100px] ${errors.includes(item.key) ? 'border-red-500' : ''}`}
                placeholder="Desenvolva sua resposta de forma detalhada..."
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Auto feedback */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-900">
            <MessageSquare className="h-5 w-5 text-yellow-600" />
            <span>3 - Auto feedback</span>
          </CardTitle>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
            <p className="text-slate-700 text-sm leading-relaxed">
              Autoconhecimento é algo fundamental, e tirar um momento para entender comportamentos e atitudes que te formam enquanto profissional irá resultar em uma maior consciência sobre si. Para esse momento, basta refletir e preencher conforme a metodologia abaixo: Começar, Continuar e Parar.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {feedbackQuestions.map((item, index) => (
            <div key={item.key} className="space-y-3">
              <Label className="text-slate-700 font-medium text-lg">
                {item.question} <span className="text-red-500">*</span>
              </Label>
              <div className="bg-slate-50 p-4 rounded-lg border">
                <p className="text-sm text-slate-600 leading-relaxed">{item.explanation}</p>
              </div>
              <Textarea
                value={formData[item.key] || ''}
                onChange={(e) => handleInputChange(item.key, e.target.value)}
                className={`min-h-[120px] ${errors.includes(item.key) ? 'border-red-500' : ''}`}
                placeholder="Desenvolva sua reflexão de forma detalhada..."
              />
            </div>
          ))}

          {/* Campo Extra */}
          <div className="space-y-3 pt-6 border-t">
            <Label className="text-slate-700 font-medium">
              Espaço aberto - Caso você tenha algum comentário, feedback ou pontuação a fazer que não se encaixou nas perguntas ao longo do formulário, esse espaço é destinado para isso!
            </Label>
            <Textarea
              value={formData.comentarioExtra || ''}
              onChange={(e) => handleInputChange('comentarioExtra', e.target.value)}
              className="min-h-[100px]"
              placeholder="Comentários adicionais (opcional)..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        {canGoBack && (
          <Button 
            onClick={onPrev}
            variant="outline" 
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>
        )}
        <Button 
          onClick={handleNext}
          className="bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white ml-auto"
        >
          Próxima
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ManagementFeedbackPage;
