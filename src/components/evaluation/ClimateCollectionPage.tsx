
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, ChevronLeft, BarChart3, Shield, MessageCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ClimateCollectionPageProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
  canGoBack: boolean;
  isLastPage: boolean;
  startTime?: number | null;
}

const ClimateCollectionPage: React.FC<ClimateCollectionPageProps> = ({ 
  formData, 
  updateFormData, 
  onNext, 
  onPrev, 
  canGoBack,
  isLastPage,
  startTime 
}) => {
  const [errors, setErrors] = useState<string[]>([]);

  const scaleOptions = [
    { value: "muito_insatisfeito", label: "Muito Insatisfeito" },
    { value: "insatisfeito", label: "Insatisfeito" },
    { value: "neutro", label: "Neutro" },
    { value: "satisfeito", label: "Satisfeito" },
    { value: "muito_satisfeito", label: "Muito Satisfeito" }
  ];

  const climateQuestions = [
    {
      key: 'satisfacaoGeral',
      question: 'Como você avaliaria seu nível de satisfação geral com o estágio?'
    },
    {
      key: 'acolhimentoSetor',
      question: 'Como você se sente em relação a ser acolhido e bem-vindo no seu setor?'
    },
    {
      key: 'acolhimentoEscritorio',
      question: 'Como você se sente em relação a ser acolhido e bem-vindo na equipe do escritório em geral?'
    },
    {
      key: 'comunicacaoInterna',
      question: 'Como você avaliaria a comunicação interna no escritório?'
    },
    {
      key: 'comunicacaoSetor',
      question: 'Como você avaliaria a comunicação interna no seu setor?'
    },
    {
      key: 'feedbacks',
      question: 'Você recebe feedbacks diretos sobre o seu trabalho e entregas?'
    },
    {
      key: 'apoioTarefas',
      question: 'Você sente que tem apoio suficiente para realizar suas tarefas?'
    },
    {
      key: 'materialTecnico',
      question: 'Você sente que tem o material técnico suficiente para realizar suas tarefas?'
    },
    {
      key: 'colaboracao',
      question: 'Como você avaliaria o ambiente de trabalho em termos de colaboração?'
    },
    {
      key: 'expressarIdeias',
      question: 'Você se sente confortável para expressar suas ideias e opiniões?'
    },
    {
      key: 'equilibrioAcademico',
      question: 'Você consegue equilibrar suas responsabilidades acadêmicas com as do estágio?'
    }
  ];

  const openQuestions = [
    {
      key: 'sugestoesMelhoria',
      question: 'Quais sugestões você daria para melhorar o clima no escritório?',
      explanation: 'Sinta-se a vontade para compartilhar ideias, sugestões de melhoria, feedbacks... é um espaço livre justamente para compartilhar aquilo que no dia a dia passa batido ou que você não sabe onde falar! 😊'
    },
    {
      key: 'experienciaExtra',
      question: 'Há algo mais que você gostaria de compartilhar sobre sua experiência como estagiário?'
    }
  ];

  const validateForm = () => {
    const requiredFields = [
      ...climateQuestions.map(q => q.key),
      ...openQuestions.map(q => q.key)
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
      // SALVAR DADOS NO LOCALSTORAGE antes de prosseguir
      saveFormData();
      onNext();
    } else {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios antes de finalizar.",
        variant: "destructive",
      });
    }
  };

  const saveFormData = () => {
    try {
      const responses = JSON.parse(localStorage.getItem('evaluationResponses') || '[]');
      
      // Calcular tempo de resposta
      const endTime = Date.now();
      const responseTime = startTime ? Math.round((endTime - startTime) / 1000 / 60) : null; // tempo em minutos
      
      // Função para converter respostas do formulário para números
      const convertRating = (value: string): number => {
        const mapping: Record<string, number> = {
          'excelente': 5,
          'satisfatorio': 4,
          'neutro': 3,
          'insatisfatorio': 2,
          'nao_utilizo': 0
        };
        return mapping[value] || 3;
      };

      const newResponse = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        createdAt: new Date().toLocaleDateString('pt-BR'),
        name: formData.nome || 'Anônimo',
        sector: formData.setor || 'Não informado',
        responseTimeMinutes: responseTime,
        skills: {
          'Comunicação': convertRating(formData.comunicacaoCliente),
          'Trabalho em equipe': convertRating(formData.trabalhoEquipe),
          'Resolução de problemas': convertRating(formData.proatividade),
          'Gestão do tempo': convertRating(formData.pontualidade),
          'Adaptabilidade': convertRating(formData.situacoesNovas),
          'Liderança': convertRating(formData.posturaAdvogados),
          'Conhecimento técnico': convertRating(formData.conhecimentoLegislativo),
          'Iniciativa': convertRating(formData.proatividade),
          'Relacionamento interpessoal': convertRating(formData.posturaCliente)
        },
        climateData: {
          satisfacaoGeral: formData.satisfacaoGeral,
          acolhimentoSetor: formData.acolhimentoSetor,
          acolhimentoEscritorio: formData.acolhimentoEscritorio,
          comunicacaoInterna: formData.comunicacaoInterna,
          sugestoesMelhoria: formData.sugestoesMelhoria
        },
        allFormData: formData
      };
      
      responses.push(newResponse);
      localStorage.setItem('evaluationResponses', JSON.stringify(responses));

      toast({
        title: "Avaliação salva!",
        description: `Seus dados foram salvos com sucesso. Total: ${responses.length} avaliações`,
      });
      
    } catch (error) {
      console.error('❌ Erro ao salvar dados:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar os dados. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const mapSatisfactionToRating = (satisfaction: string): number => {
    const mapping: Record<string, number> = {
      'muito_insatisfeito': 1,
      'insatisfeito': 2,
      'neutro': 3,
      'satisfeito': 4,
      'muito_satisfeito': 5
    };
    return mapping[satisfaction] || 3;
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
        <h2 className="text-3xl font-bold text-slate-900">Coleta de Clima</h2>
        <p className="text-slate-600">Página 4 de 4</p>
      </div>

      {/* Introduction */}
      <Card className="shadow-lg border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-900">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span>Sobre a Coleta de Clima</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-700 leading-relaxed">
            Coleta de clima é um processo voltado a obter dados sobre o clima organizacional de uma organização. O objetivo da coleta é buscar compreender como os colaboradores percebem o ambiente de trabalho, as relações interpessoais, o nível de satisfação, entre outros fatores.
          </p>
          <p className="text-slate-700 leading-relaxed">
            Para o escritório, será muito importante entender, a partir de perguntas fechadas, como estão algumas questões que envolvem a todos! A partir disso, projetos poderão ser traçados com mais eficiência.
          </p>
          <p className="text-slate-700 leading-relaxed">
            Ao responder, lembre-se que sua resposta sincera será muito importante para que a pesquisa seja válida!
          </p>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-slate-900">IMPORTANTE:</p>
              <p className="text-sm text-slate-700">
                As respostas da coleta de clima são analisadas em conjunto e não individualmente. Portanto, as respostas individuais não serão apresentadas, serão mantidas anônimas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Climate Questions */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-900">
            <BarChart3 className="h-5 w-5 text-yellow-600" />
            <span>Avaliação do Clima Organizacional</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {climateQuestions.map((item, index) => (
            <div key={item.key}>
              <Label className="text-slate-700 font-medium mb-4 block">
                {index + 1}. {item.question} <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={formData[item.key] || ''}
                onValueChange={(value) => handleInputChange(item.key, value)}
                className={`space-y-3 ${errors.includes(item.key) ? 'p-3 border border-red-500 rounded bg-red-50' : ''}`}
              >
                {scaleOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-3 p-2 rounded hover:bg-slate-50">
                    <RadioGroupItem value={option.value} id={`${item.key}-${option.value}`} />
                    <Label htmlFor={`${item.key}-${option.value}`} className="cursor-pointer flex-1">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Open Questions */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-900">
            <MessageCircle className="h-5 w-5 text-yellow-600" />
            <span>Questões Abertas</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {openQuestions.map((item, index) => (
            <div key={item.key}>
              <Label className="text-slate-700 font-medium text-lg">
                {item.question} <span className="text-red-500">*</span>
              </Label>
              {item.explanation && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-3">
                  <p className="text-sm text-slate-700">{item.explanation}</p>
                </div>
              )}
              <Textarea
                value={formData[item.key] || ''}
                onChange={(e) => handleInputChange(item.key, e.target.value)}
                className={`mt-3 min-h-[120px] ${errors.includes(item.key) ? 'border-red-500' : ''}`}
                placeholder="Compartilhe suas ideias e sugestões..."
              />
            </div>
          ))}
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
          className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-white ml-auto font-semibold px-8"
        >
          {isLastPage ? 'Finalizar Avaliação' : 'Próxima'}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ClimateCollectionPage;
