import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, ChevronLeft, User, Star, Target, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DataSkillsPageProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
  canGoBack: boolean;
}

const DataSkillsPage: React.FC<DataSkillsPageProps> = ({ 
  formData, 
  updateFormData, 
  onNext, 
  onPrev, 
  canGoBack 
}) => {
  const [errors, setErrors] = useState<string[]>([]);

  const setores = [
    "Previdenciário - Judicial",
    "Previdenciário - Administrativo", 
    "Previdenciário - Auxílio",
    "Tributário",
    "Securitário",
    "Controladoria"
  ];

  const pressaoOptions = [
    "Travar e não sair do lugar",
    "Precisar de ajuda externa para encontrar uma saída",
    "Ir atrás de uma solução antes de consultar um advogado",
    "Postergar até o limite da situação e fazer da forma que restar",
    "Outro"
  ];

  const scaleOptions = [
    { value: "insatisfatorio", label: "Insatisfatório" },
    { value: "neutro", label: "Neutro" },
    { value: "satisfatorio", label: "Satisfatório" },
    { value: "excelente", label: "Excelente" }
  ];

  const technicalScaleOptions = [
    { value: "insatisfatorio", label: "Insatisfatório" },
    { value: "neutro", label: "Neutro" },
    { value: "satisfatorio", label: "Satisfatório" },
    { value: "excelente", label: "Excelente" },
    { value: "nao_utilizo", label: "Não utilizo" }
  ];

  const conductItems = [
    { key: "pontualidade", label: "Pontualidade" },
    { key: "vestimenta", label: "Vestimenta" },
    { key: "cuidadoCozinha", label: "Cuidado com a cozinha" },
    { key: "cuidadoCopa", label: "Cuidado com a copa" },
    { key: "cuidadoSala", label: "Cuidado com a sala de trabalho" }
  ];

  const technicalItems = [
    { key: "lawNet", label: "Sistema Law Net (conhecer bem e dominar a ferramenta)" },
    { key: "linguagemJuridica", label: "Linguagem técnica jurídica" },
    { key: "conhecimentoLegislativo", label: "Conhecimento legislativo" },
    { key: "sistemasJudiciarios", label: "Saber utilizar os sistemas judiciários" },
    { key: "posturaCliente", label: "Postura profissional necessária para atendimento ao cliente" },
    { key: "comunicacaoCliente", label: "Comunicação excelente para atendimento ao cliente" },
    { key: "jurisprudencia", label: "Conhecimento jurisprudência (pesquisas e termos necessários)" }
  ];

  const validateForm = () => {
    const requiredFields = [
      'nome', 'setor', 'trabalhoEquipe', 'entregas', 'opinioesDivergentes',
      'proatividade', 'posturaTrabalho', 'situacoesNovas'
    ];
    
    const newErrors = [];
    
    requiredFields.forEach(field => {
      if (!formData[field]?.trim()) {
        newErrors.push(field);
      }
    });

    // Validar pressão - pelo menos uma opção deve ser selecionada
    if (!formData.pressaoOpcoes || formData.pressaoOpcoes.length === 0) {
      newErrors.push('pressaoOpcoes');
    }

    // Validar tabelas
    conductItems.forEach(item => {
      if (!formData[item.key]) {
        newErrors.push(item.key);
      }
    });

    technicalItems.forEach(item => {
      if (!formData[item.key]) {
        newErrors.push(item.key);
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

  const handlePressaoChange = (option: string, checked: boolean) => {
    const currentOptions = formData.pressaoOpcoes || [];
    if (checked) {
      updateFormData({ pressaoOpcoes: [...currentOptions, option] });
    } else {
      updateFormData({ pressaoOpcoes: currentOptions.filter((o: string) => o !== option) });
    }
    if (errors.includes('pressaoOpcoes')) {
      setErrors(errors.filter(error => error !== 'pressaoOpcoes'));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Dados e Habilidades</h2>
        <p className="text-slate-600">Página 2 de 4</p>
      </div>

      {/* Dados Básicos */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-900">
            <User className="h-5 w-5 text-yellow-600" />
            <span>Dados Básicos</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="nome" className="text-slate-700 font-medium">
              Qual é o seu nome? <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nome"
              value={formData.nome || ''}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              className={`mt-1 ${errors.includes('nome') ? 'border-red-500' : ''}`}
              placeholder="Digite seu nome completo"
            />
          </div>
          <div>
            <Label htmlFor="setor" className="text-slate-700 font-medium">
              Qual seu setor? <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.setor || ''}
              onValueChange={(value) => handleInputChange('setor', value)}
            >
              <SelectTrigger className={`mt-1 ${errors.includes('setor') ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Selecione seu setor..." />
              </SelectTrigger>
              <SelectContent>
                {setores.map((setor) => (
                  <SelectItem key={setor} value={setor}>
                    {setor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Análise de Habilidades */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-900">
            <Star className="h-5 w-5 text-yellow-600" />
            <span>1 - Análise de Habilidades e Competências</span>
          </CardTitle>
          <p className="text-slate-600 mt-2">Desenvolva as respostas de forma detalhada.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            { key: 'trabalhoEquipe', label: 'Quanto a trabalho em equipe, como você considera essa habilidade em você?' },
            { key: 'entregas', label: 'Quanto a entregas, como você avalia sua postura perante a prazos ("prazo" neste caso refere-se a datas acordadas com o advogado do setor para a entrega de algo requisitado)?' },
            { key: 'opinioesDivergentes', label: 'Em momentos de opiniões divergentes, como é seu comportamento?' },
            { key: 'proatividade', label: 'Quanto a proatividade, você costuma se antecipar em relação ao que deve ser feito no setor? Ou aguarda demandas chegarem?' },
            { key: 'posturaTrabalho', label: 'Como você avalia a sua postura no ambiente de trabalho?' },
            { key: 'situacoesNovas', label: 'Como você lida com algo diferente que surge durante o dia a dia no trabalho? Quando as atividades "saem do script" e você precisa lidar com algo novo.' }
          ].map((item, index) => (
            <div key={item.key}>
              <Label className="text-slate-700 font-medium">
                {index + 1}. {item.label} <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={formData[item.key] || ''}
                onChange={(e) => handleInputChange(item.key, e.target.value)}
                className={`mt-2 min-h-[100px] ${errors.includes(item.key) ? 'border-red-500' : ''}`}
                placeholder="Desenvolva sua resposta de forma detalhada..."
              />
            </div>
          ))}

          {/* Pergunta Múltipla Escolha */}
          <div>
            <Label className="text-slate-700 font-medium">
              Selecione o que melhor se encaixa para você a partir da seguinte frase: "Quando as coisas não saem conforme planejado e preciso trabalhar sob pressão, eu tendo a:" <span className="text-red-500">*</span>
            </Label>
            <div className={`mt-3 space-y-3 p-4 rounded-lg border ${errors.includes('pressaoOpcoes') ? 'border-red-500 bg-red-50' : 'bg-slate-50'}`}>
              {pressaoOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={option}
                    checked={formData.pressaoOpcoes?.includes(option) || false}
                    onCheckedChange={(checked) => handlePressaoChange(option, checked as boolean)}
                  />
                  <Label htmlFor={option} className="text-sm text-slate-700 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
            {formData.pressaoOpcoes?.includes("Outro") && (
              <Textarea
                value={formData.pressaoOutro || ''}
                onChange={(e) => handleInputChange('pressaoOutro', e.target.value)}
                className="mt-3"
                placeholder="Especifique sua resposta..."
              />
            )}
          </div>

          {/* Campo Contextualização */}
          <div>
            <Label className="text-slate-700 font-medium">
              Espaço para contextualizar as seleções feitas acima, caso queira
            </Label>
            <Textarea
              value={formData.pressaoContexto || ''}
              onChange={(e) => handleInputChange('pressaoContexto', e.target.value)}
              className="mt-2"
              placeholder="Contextualize suas escolhas se desejar..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Código de Conduta */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-900">
            <CheckCircle className="h-5 w-5 text-yellow-600" />
            <span>Código de Conduta</span>
          </CardTitle>
          <div className="space-y-2 text-sm text-slate-600">
            <p>Para cada habilidade assinale a opção que mais se encaixa na sua autoavaliação, de forma a medir como está seu alinhamento com o Código de Conduta do escritório. O importante dessa autoavaliação abaixo é justamente entender em quais aspectos há a necessidade de desenvolvimento e em quais tem-se um domínio.</p>
            <div className="bg-yellow-50 p-3 rounded border">
              <p className="font-medium">Legenda:</p>
              <ul className="text-xs space-y-1 mt-2">
                <li><strong>Excelente:</strong> O desempenho excede as expectativas da competência</li>
                <li><strong>Satisfatório:</strong> Apresenta desempenho que atende às expectativas da competência</li>
                <li><strong>Insatisfatório:</strong> O desempenho é consistentemente abaixo das expectativas da competência</li>
                <li><strong>Neutro:</strong> Não consigo avaliar meu desempenho nessa competência</li>
              </ul>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {conductItems.map((item) => (
              <div key={item.key}>
                <Label className="text-slate-700 font-medium mb-3 block">
                  {item.label} <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={formData[item.key] || ''}
                  onValueChange={(value) => handleInputChange(item.key, value)}
                  className={`flex flex-wrap gap-4 ${errors.includes(item.key) ? 'p-2 border border-red-500 rounded bg-red-50' : ''}`}
                >
                  {scaleOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`${item.key}-${option.value}`} />
                      <Label htmlFor={`${item.key}-${option.value}`} className="text-sm cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Competências Técnicas */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-900">
            <Target className="h-5 w-5 text-yellow-600" />
            <span>Competências Técnicas</span>
          </CardTitle>
          <div className="space-y-2 text-sm text-slate-600">
            <p>Para cada competência assinale a opção que mais se encaixa na sua autoavaliação, de forma a medir como está o seu conhecimento. Observação: Tenha em vista que as pontuações devem considerar o seu tempo de escritório e o tempo na referida área, ou seja, as pontuações devem</p>
            <div className="bg-yellow-50 p-3 rounded border">
              <p className="font-medium">Legenda:</p>
              <ul className="text-xs space-y-1 mt-2">
                <li><strong>Excelente:</strong> O desempenho excede as expectativas da competência</li>
                <li><strong>Satisfatório:</strong> Apresenta desempenho que atende às expectativas da competência</li>
                <li><strong>Insatisfatório:</strong> O desempenho é consistentemente abaixo das expectativas da competência</li>
                <li><strong>Neutro:</strong> Não consigo avaliar meu desempenho nessa competência</li>
                <li><strong>Não utilizo:</strong> Caso a competência não seja utilizada no seu setor, assinale essa opção</li>
              </ul>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {technicalItems.map((item) => (
              <div key={item.key}>
                <Label className="text-slate-700 font-medium mb-3 block">
                  {item.label} <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={formData[item.key] || ''}
                  onValueChange={(value) => handleInputChange(item.key, value)}
                  className={`flex flex-wrap gap-4 ${errors.includes(item.key) ? 'p-2 border border-red-500 rounded bg-red-50' : ''}`}
                >
                  {technicalScaleOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`${item.key}-${option.value}`} />
                      <Label htmlFor={`${item.key}-${option.value}`} className="text-sm cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
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

export default DataSkillsPage;
