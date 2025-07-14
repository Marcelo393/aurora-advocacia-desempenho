import React, { useState, useEffect } from 'react';
import { 
  Users, BarChart3, Download, PieChart, TrendingUp, UserCheck, 
  Award, Calendar, Star, MessageSquare, Target, AlertTriangle, 
  Trophy, Lightbulb, AlertCircle, Bot, Smile, Activity 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, PieChart as RechartsPieChart, Cell, LineChart, Line 
} from 'recharts';

const AdminDashboard = () => {
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedEmployeeForComment, setSelectedEmployeeForComment] = useState('');
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Função para gerar comentário automático inteligente
  const gerarComentarioAutomatico = (funcionario: any) => {
    if (!funcionario || !funcionario.ratings) return "Dados insuficientes para análise.";
    
    const media = funcionario.overallRating;
    const ratings = funcionario.ratings;
    const habilidades = Object.keys(ratings);
    const valores = Object.values(ratings) as number[];
    
    const melhor = Math.max(...valores);
    const pior = Math.min(...valores);
    const melhorIndex = valores.indexOf(melhor);
    const piorIndex = valores.indexOf(pior);
    const melhorHabilidade = habilidades[melhorIndex];
    const piorHabilidade = habilidades[piorIndex];
    
    let texto = "";
    
    // Avaliação geral
    if (media >= 4.5) {
      texto += "Desempenho EXCELENTE. ";
    } else if (media >= 4.0) {
      texto += "Desempenho MUITO BOM. ";
    } else if (media >= 3.0) {
      texto += "Desempenho SATISFATÓRIO. ";
    } else {
      texto += "PRECISA ATENÇÃO no desenvolvimento. ";
    }
    
    // Ponto forte
    texto += `Destaca-se em ${melhorHabilidade} (${melhor}/5). `;
    
    // Área de melhoria
    if (pior <= 3) {
      texto += `Necessita desenvolvimento em ${piorHabilidade} (${pior}/5). `;
    }
    
    // Clima organizacional
    if (funcionario.climaOrganizacional >= 4) {
      texto += "Demonstra alta satisfação com o ambiente de trabalho. ";
    } else if (funcionario.climaOrganizacional <= 2) {
      texto += "Apresenta baixa satisfação com o ambiente organizacional. ";
    }
    
    // Recomendação
    if (pior <= 2) {
      texto += `Recomenda-se treinamento específico em ${piorHabilidade}.`;
    } else if (media >= 4.5) {
      texto += "Candidato a mentor/referência para outros funcionários.";
    }
    
    return texto;
  };

  // Função para obter dados dos funcionários do localStorage
  const getEmployeeData = () => {
    const evaluations = JSON.parse(localStorage.getItem('evaluations') || '[]');
    return evaluations.map((evaluation: any, index: number) => ({
      id: index,
      name: evaluation.name,
      sector: evaluation.sector,
      date: evaluation.date,
      ratings: evaluation.ratings,
      climaOrganizacional: evaluation.climaOrganizacional,
      overallRating: parseFloat(
        ((Object.values(evaluation.ratings) as number[]).reduce((a: number, b: number) => a + b, 0) / 
         Object.values(evaluation.ratings).length).toFixed(1)
      )
    }));
  };

  // Função para processar dados do dashboard
  const processDashboardData = () => {
    const employees = getEmployeeData();
    
    if (employees.length === 0) {
      return {
        skillsChartData: [],
        sectorsChartData: [],
        insights: {
          totalEmployees: 0,
          averageScore: 0,
          bestSector: 'N/A',
          criticalSkill: 'N/A'
        },
        climateData: {
          generalSatisfaction: 0
        },
        sectorsAnalysis: []
      };
    }

    // Filtrar por setor se necessário
    const filteredEmployees = selectedSector === 'all' 
      ? employees 
      : employees.filter(emp => emp.sector === selectedSector);

    // Calcular dados dos gráficos de habilidades
    const skillNames = Object.keys(employees[0]?.ratings || {});
    const skillsChartData = skillNames.map(skill => {
      const average = filteredEmployees.reduce((sum, emp) => sum + emp.ratings[skill], 0) / filteredEmployees.length;
      return {
        skill: skill,
        average: parseFloat(average.toFixed(1)),
        color: average >= 4 ? '#10b981' : average >= 3 ? '#f59e0b' : '#ef4444'
      };
    });

    // Calcular dados por setor
    const sectorMap = new Map();
    employees.forEach(emp => {
      if (!sectorMap.has(emp.sector)) {
        sectorMap.set(emp.sector, []);
      }
      sectorMap.get(emp.sector).push(emp);
    });

    const sectorsChartData = Array.from(sectorMap.entries()).map(([sector, emps]: [string, any[]]) => ({
      sector,
      employees: emps.length,
      average: parseFloat((emps.reduce((sum, emp) => sum + emp.overallRating, 0) / emps.length).toFixed(1)),
      fill: '#1e40af'
    }));

    // Insights
    const bestSector = sectorsChartData.reduce((best, current) => 
      current.average > best.average ? current : best
    , sectorsChartData[0])?.sector || 'N/A';

    const worstSkill = skillsChartData.reduce((worst, current) =>
      current.average < worst.average ? current : worst
    , skillsChartData[0])?.skill || 'N/A';

    const generalSatisfaction = employees.reduce((sum, emp) => sum + emp.climaOrganizacional, 0) / employees.length;

    return {
      skillsChartData,
      sectorsChartData,
      insights: {
        totalEmployees: employees.length,
        averageScore: parseFloat((employees.reduce((sum, emp) => sum + emp.overallRating, 0) / employees.length).toFixed(1)),
        bestSector,
        criticalSkill: worstSkill
      },
      climateData: {
        generalSatisfaction: parseFloat(generalSatisfaction.toFixed(1))
      },
      sectorsAnalysis: sectorsChartData
    };
  };

  useEffect(() => {
    const data = processDashboardData();
    setDashboardData(data);
    console.log('📊 Dados dos gráficos atualizados:', {
      selectedSector,
      filteredForCharts: data.skillsChartData.length,
      skillsChartData: data.skillsChartData,
      sectorsChartData: data.sectorsChartData
    });
  }, [selectedSector]);

  const filteredEmployees = getEmployeeData().filter(emp => 
    selectedSector === 'all' || emp.sector === selectedSector
  );

  const selectedEmployeeData = selectedEmployeeForComment ? 
    filteredEmployees.find(emp => `${emp.name}-${emp.id}` === selectedEmployeeForComment) : 
    null;

  const getEmployeeStrengths = (employee: any) => {
    if (!employee?.ratings) return [];
    return Object.entries(employee.ratings)
      .map(([skill, rating]) => ({ skill, rating }))
      .filter(item => (item.rating as number) >= 4)
      .sort((a, b) => (b.rating as number) - (a.rating as number))
      .slice(0, 3);
  };

  const getEmployeeWeaknesses = (employee: any) => {
    if (!employee?.ratings) return [];
    return Object.entries(employee.ratings)
      .map(([skill, rating]) => ({ skill, rating }))
      .filter(item => (item.rating as number) <= 3)
      .sort((a, b) => (a.rating as number) - (b.rating as number))
      .slice(0, 3);
  };

  const getEmployeeRecommendations = (employee: any) => {
    if (!employee) return [];
    const recommendations = [];
    
    const weaknesses = getEmployeeWeaknesses(employee);
    if (weaknesses.length > 0) {
      recommendations.push(`Treinamento em ${weaknesses[0].skill}`);
    }
    
    if (employee.overallRating >= 4.5) {
      recommendations.push('Candidato a mentoria de outros funcionários');
    }
    
    if (employee.climaOrganizacional <= 2) {
      recommendations.push('Conversa individual sobre satisfação no trabalho');
    }
    
    return recommendations;
  };

  const sectors = [...new Set(getEmployeeData().map(emp => emp.sector))];

  if (!dashboardData) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            📊 Dashboard Administrativo
          </h1>
          <p className="text-slate-600">Sistema Inteligente de Análise de Avaliações</p>
        </div>

        {/* Resumo Executivo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              <span>📈 Resumo Executivo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Participação */}
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-4">
                  <div className="text-center">
                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-blue-700">Participação</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {dashboardData.insights.totalEmployees}
                    </p>
                    <p className="text-xs text-blue-600">funcionários avaliados</p>
                  </div>
                </CardContent>
              </Card>

              {/* Satisfação Geral */}
              <Card className="bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="p-4">
                  <div className="text-center">
                    <Smile className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-green-700">Satisfação Geral</p>
                    <p className="text-2xl font-bold text-green-900">
                      {dashboardData.climateData.generalSatisfaction}
                    </p>
                    <p className="text-xs text-green-600">Clima organizacional</p>
                  </div>
                </CardContent>
              </Card>

              {/* Setor Destaque */}
              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
                <CardContent className="p-4">
                  <div className="text-center">
                    <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-sm text-yellow-700">Setor Destaque</p>
                    <p className="text-lg font-bold text-yellow-900">
                      {dashboardData.insights.bestSector.split(' - ')[0] || 'Tributário'}
                    </p>
                    <p className="text-xs text-yellow-600">Melhor performance</p>
                  </div>
                </CardContent>
              </Card>

              {/* Atenção Necessária */}
              <Card className="bg-gradient-to-br from-red-50 to-red-100">
                <CardContent className="p-4">
                  <div className="text-center">
                    <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <p className="text-sm text-red-700">Atenção Necessária</p>
                    <p className="text-2xl font-bold text-red-900">
                      {getEmployeeData().filter(emp => emp.overallRating < 3.0).length}
                    </p>
                    <p className="text-xs text-red-600">funcionários nota &lt; 3.0</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Filtros */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-slate-700">Filtrar por setor:</label>
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os setores</SelectItem>
                  {sectors.map((sector: string, index: number) => (
                    <SelectItem key={index} value={sector}>{sector}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gráfico de Habilidades */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span>Média por Habilidade</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.skillsChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="skill" angle={-45} textAnchor="end" height={100} />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Bar dataKey="average" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico por Setor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-green-600" />
                <span>Performance por Setor</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.sectorsChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sector" angle={-45} textAnchor="end" height={100} />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Bar dataKey="average" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Análise por Setor Melhorada */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-purple-600" />
              <span>📊 Análise Detalhada por Setor</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardData.sectorsAnalysis.map((sector: any, index: number) => (
                <Card key={index} className="border-l-4 border-purple-500">
                  <CardContent className="p-4">
                    <h3 className="font-bold text-slate-800 mb-2">{sector.sector}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Participantes:</span>
                        <span className="font-semibold">{sector.employees}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Nota Média:</span>
                        <span className="font-semibold">{sector.average}/5</span>
                      </div>
                      <Badge 
                        variant={sector.average >= 4 ? "default" : sector.average >= 3 ? "secondary" : "destructive"}
                      >
                        {sector.average >= 4 ? "Excelente" : sector.average >= 3 ? "Bom" : "Atenção"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Análise Individual com Comentários Automáticos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <span>🤖 Análise Individual Inteligente</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Dropdown para selecionar funcionário */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Selecionar Funcionário:
                </label>
                <Select 
                  value={selectedEmployeeForComment} 
                  onValueChange={setSelectedEmployeeForComment}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Escolha um funcionário para análise..." />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredEmployees.map((employee: any, index: number) => (
                      <SelectItem key={index} value={`${employee.name}-${employee.id}`}>
                        {employee.name} - {employee.sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Perfil do funcionário selecionado */}
              {selectedEmployeeData && (
                <div className="space-y-4">
                  {/* Card com perfil */}
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                          <p className="text-sm text-blue-700 font-medium">Nome</p>
                          <p className="text-lg font-bold text-blue-900">{selectedEmployeeData.name}</p>
                        </div>
                        <div className="text-center">
                          <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                          <p className="text-sm text-blue-700 font-medium">Setor</p>
                          <p className="text-lg font-bold text-blue-900">{selectedEmployeeData.sector}</p>
                        </div>
                        <div className="text-center">
                          <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                          <p className="text-sm text-blue-700 font-medium">Data Avaliação</p>
                          <p className="text-lg font-bold text-blue-900">
                            {new Date(selectedEmployeeData.date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="text-center">
                          <Star className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                          <p className="text-sm text-blue-700 font-medium">Nota Geral</p>
                          <p className="text-lg font-bold text-blue-900">{selectedEmployeeData.overallRating}/5 ⭐</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Análise detalhada */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Pontos Fortes */}
                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                      <CardContent className="p-4">
                        <h3 className="flex items-center text-green-800 font-bold mb-3">
                          🎯 Pontos Fortes
                        </h3>
                        <div className="space-y-2">
                          {getEmployeeStrengths(selectedEmployeeData).map((strength: any, index: number) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-sm text-green-700">{strength.skill}</span>
                              <span className="text-sm font-bold text-green-800">({strength.rating}/5)</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Áreas de Melhoria */}
                    <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                      <CardContent className="p-4">
                        <h3 className="flex items-center text-yellow-800 font-bold mb-3">
                          ⚠️ Áreas de Melhoria
                        </h3>
                        <div className="space-y-2">
                          {getEmployeeWeaknesses(selectedEmployeeData).map((weakness: any, index: number) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-sm text-yellow-700">{weakness.skill}</span>
                              <span className="text-sm font-bold text-yellow-800">({weakness.rating}/5)</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recomendações */}
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                      <CardContent className="p-4">
                        <h3 className="flex items-center text-blue-800 font-bold mb-3">
                          💡 Recomendações
                        </h3>
                        <div className="space-y-2">
                          {getEmployeeRecommendations(selectedEmployeeData).map((recommendation: string, index: number) => (
                            <p key={index} className="text-sm text-blue-700">
                              • {recommendation}
                            </p>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Comentário Automático Inteligente */}
                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-purple-800">
                        <Bot className="h-5 w-5" />
                        <span>🤖 Análise Automática Completa</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 bg-white rounded-lg border border-purple-200">
                        <p className="text-gray-800 leading-relaxed">
                          {gerarComentarioAutomatico(selectedEmployeeData)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Ações Recomendadas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-600" />
              <span>🎯 Ações Recomendadas para a Empresa</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(() => {
                const funcionariosBaixaPerf = getEmployeeData().filter(emp => emp.overallRating < 3.0);
                const funcionariosAltos = getEmployeeData().filter(emp => emp.overallRating > 4.5);
                const setoresBaixoClima = dashboardData?.sectorsAnalysis?.filter((s: any) => parseFloat(s.average) < 3.0) || [];
                const habilidadeCritica = dashboardData?.insights?.criticalSkill || 'Gestão do tempo';
                
                return [
                  funcionariosBaixaPerf.length > 0 && {
                    icon: AlertTriangle,
                    color: 'red',
                    title: `Treinamento em ${habilidadeCritica} para ${funcionariosBaixaPerf.length} funcionários`,
                    description: 'Funcionários com performance abaixo de 3.0 precisam de desenvolvimento'
                  },
                  funcionariosAltos.length > 0 && {
                    icon: Trophy,
                    color: 'green',
                    title: `Reconhecimento para ${funcionariosAltos.length} funcionários de alta performance`,
                    description: 'Funcionários com nota superior a 4.5 merecem destaque'
                  },
                  setoresBaixoClima.length > 0 && {
                    icon: Lightbulb,
                    color: 'yellow',
                    title: `Atenção especial para ${setoresBaixoClima.length} setores em ${habilidadeCritica}`,
                    description: 'Setores com baixa performance em habilidade crítica'
                  },
                  dashboardData?.climateData?.generalSatisfaction < 3.0 && {
                    icon: AlertCircle,
                    color: 'red',
                    title: 'Investigar clima organizacional geral',
                    description: 'Satisfação geral abaixo do esperado'
                  }
                ].filter(Boolean);
              })().map((action: any, index) => (
                <Card key={index} className={`border-l-4 ${
                  action.color === 'red' ? 'border-red-500 bg-red-50' :
                  action.color === 'green' ? 'border-green-500 bg-green-50' :
                  action.color === 'yellow' ? 'border-yellow-500 bg-yellow-50' :
                  'border-blue-500 bg-blue-50'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <action.icon className={`h-6 w-6 mt-1 ${
                        action.color === 'red' ? 'text-red-600' :
                        action.color === 'green' ? 'text-green-600' :
                        action.color === 'yellow' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`} />
                      <div>
                        <h4 className={`font-semibold ${
                          action.color === 'red' ? 'text-red-800' :
                          action.color === 'green' ? 'text-green-800' :
                          action.color === 'yellow' ? 'text-yellow-800' :
                          'text-blue-800'
                        }`}>
                          {action.title}
                        </h4>
                        <p className={`text-sm ${
                          action.color === 'red' ? 'text-red-700' :
                          action.color === 'green' ? 'text-green-700' :
                          action.color === 'yellow' ? 'text-yellow-700' :
                          'text-blue-700'
                        }`}>
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;