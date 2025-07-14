import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LogOut, 
  Users, 
  TrendingUp, 
  Award, 
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  FileText,
  FileSpreadsheet,
  Image,
  Database,
  Trash2,
  Shield,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedSector, setSelectedSector] = useState('all');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [hasRealData, setHasRealData] = useState(false);

  // Setores disponíveis
  const sectors = [
    'Previdenciário - Judicial',
    'Previdenciário - Administrativo', 
    'Previdenciário - Auxílio',
    'Tributário',
    'Securitário',
    'Controladoria'
  ];

  // Habilidades avaliadas
  const skills = [
    'Comunicação',
    'Trabalho em equipe',
    'Resolução de problemas',
    'Gestão do tempo',
    'Adaptabilidade',
    'Liderança',
    'Conhecimento técnico',
    'Iniciativa',
    'Relacionamento interpessoal'
  ];

  useEffect(() => {
    // Verificar autenticação
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin-login');
      return;
    }

    // Carregar dados do localStorage ou usar dados mock
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = () => {
    // Tentar carregar dados reais do localStorage
    const savedData = localStorage.getItem('evaluationResponses');
    
    if (savedData) {
      // Processar dados reais
      try {
        const evaluations = JSON.parse(savedData);
        if (evaluations && evaluations.length > 0) {
          setHasRealData(true);
          setDashboardData(processRealData(evaluations));
        } else {
          setHasRealData(false);
          setDashboardData(generateMockData());
        }
      } catch (error) {
        console.error('Erro ao processar dados:', error);
        setHasRealData(false);
        setDashboardData(generateMockData());
      }
    } else {
      // Usar dados mock para demonstração
      setHasRealData(false);
      setDashboardData(generateMockData());
    }
  };

  const processRealData = (evaluations: any[]) => {
    // Processar dados reais do formulário
    const totalEvaluations = evaluations.length;
    const averageTime = calculateAverageTime(evaluations);
    const overallAverage = calculateOverallAverage(evaluations);
    const lastResponse = getLastResponse(evaluations);
    
    return {
      overview: {
        totalEvaluations,
        averageTime,
        overallAverage,
        lastResponse
      },
      skillsAnalysis: calculateSkillsAnalysis(evaluations),
      sectorsAnalysis: calculateSectorsAnalysis(evaluations),
      climateData: calculateClimateData(evaluations),
      insights: generateInsights(evaluations)
    };
  };

  const generateMockData = () => {
    return {
      overview: {
        totalEvaluations: 47,
        averageTime: '12 min',
        overallAverage: 4.2,
        lastResponse: '2 horas atrás'
      },
      skillsAnalysis: {
        averages: skills.map(skill => ({
          skill,
          average: (3.5 + Math.random() * 1.5).toFixed(1)
        })),
        topStrengths: [
          'Conhecimento técnico',
          'Comunicação',
          'Relacionamento interpessoal'
        ],
        improvements: [
          'Gestão do tempo',
          'Liderança',
          'Adaptabilidade'
        ]
      },
      sectorsAnalysis: sectors.map(sector => ({
        sector,
        employees: Math.floor(Math.random() * 12) + 3,
        average: (3.5 + Math.random() * 1.5).toFixed(1)
      })),
      climateData: {
        generalSatisfaction: 4.1,
        distribution: [
          { rating: 1, count: 2 },
          { rating: 2, count: 5 },
          { rating: 3, count: 12 },
          { rating: 4, count: 18 },
          { rating: 5, count: 10 }
        ]
      },
      insights: {
        bestSector: 'Previdenciário - Judicial',
        needsAttention: 'Tributário',
        criticalSkill: 'Gestão do tempo',
        recommendation: 'Treinamento em produtividade'
      }
    };
  };

  const calculateAverageTime = (evaluations: any[]) => {
    // Implementar cálculo real baseado em timestamps
    if (evaluations.length === 0) return '0 min';
    const totalTime = evaluations.reduce((sum, evaluation) => sum + (evaluation.duration || 10), 0);
    const average = Math.round(totalTime / evaluations.length);
    return `${average} min`;
  };

  const calculateOverallAverage = (evaluations: any[]) => {
    if (evaluations.length === 0) return 0;
    
    let totalSum = 0;
    let totalCount = 0;
    
    evaluations.forEach(evaluation => {
      // Somar todas as notas das habilidades
      skills.forEach(skill => {
        const rating = evaluation.skills?.[skill];
        if (rating) {
          totalSum += rating;
          totalCount++;
        }
      });
    });
    
    return totalCount > 0 ? parseFloat((totalSum / totalCount).toFixed(1)) : 0;
  };

  const getLastResponse = (evaluations: any[]) => {
    if (evaluations.length === 0) return 'Nenhuma resposta';
    
    const sorted = evaluations.sort((a, b) => new Date(b.timestamp || b.createdAt).getTime() - new Date(a.timestamp || a.createdAt).getTime());
    const lastResponse = sorted[0];
    const lastDate = new Date(lastResponse.timestamp || lastResponse.createdAt || Date.now());
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Há menos de 1 hora';
    if (diffInHours === 1) return 'Há 1 hora';
    if (diffInHours < 24) return `Há ${diffInHours} horas`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Há 1 dia';
    return `Há ${diffInDays} dias`;
  };

  const calculateSkillsAnalysis = (evaluations: any[]) => {
    if (evaluations.length === 0) return generateMockData().skillsAnalysis;
    
    const skillAverages = skills.map(skill => {
      const ratings = evaluations.map(evaluation => evaluation.skills?.[skill]).filter(Boolean);
      const average = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;
      return { skill, average: average.toFixed(1) };
    });
    
    // Ordenar por média para identificar pontos fortes e fracos
    const sortedSkills = skillAverages.sort((a, b) => parseFloat(b.average) - parseFloat(a.average));
    
    return {
      averages: skillAverages,
      topStrengths: sortedSkills.slice(0, 3).map(s => s.skill),
      improvements: sortedSkills.slice(-3).map(s => s.skill)
    };
  };

  const calculateSectorsAnalysis = (evaluations: any[]) => {
    if (evaluations.length === 0) return generateMockData().sectorsAnalysis;
    
    const sectorData = sectors.map(sector => {
      const sectorEvaluations = evaluations.filter(evaluation => evaluation.sector === sector);
      const employees = sectorEvaluations.length;
      
      if (employees === 0) {
        return { sector, employees: 0, average: '0.0' };
      }
      
      let totalSum = 0;
      let totalCount = 0;
      
      sectorEvaluations.forEach(evaluation => {
        skills.forEach(skill => {
          const rating = evaluation.skills?.[skill];
          if (rating) {
            totalSum += rating;
            totalCount++;
          }
        });
      });
      
      const average = totalCount > 0 ? (totalSum / totalCount).toFixed(1) : '0.0';
      return { sector, employees, average };
    });
    
    return sectorData;
  };

  const calculateClimateData = (evaluations: any[]) => {
    if (evaluations.length === 0) return generateMockData().climateData;
    
    const climateRatings = evaluations.map(evaluation => evaluation.climateRating).filter(Boolean);
    
    if (climateRatings.length === 0) {
      return generateMockData().climateData;
    }
    
    const generalSatisfaction = climateRatings.reduce((sum, rating) => sum + rating, 0) / climateRatings.length;
    
    // Criar distribuição das notas
    const distribution = [1, 2, 3, 4, 5].map(rating => ({
      rating,
      count: climateRatings.filter(r => r === rating).length
    }));
    
    return {
      generalSatisfaction: parseFloat(generalSatisfaction.toFixed(1)),
      distribution
    };
  };

  const generateInsights = (evaluations: any[]) => {
    if (evaluations.length === 0) return generateMockData().insights;
    
    const sectorsAnalysis = calculateSectorsAnalysis(evaluations);
    const skillsAnalysis = calculateSkillsAnalysis(evaluations);
    
    // Melhor setor
    const bestSector = sectorsAnalysis.reduce((best, current) => 
      parseFloat(current.average) > parseFloat(best.average) ? current : best
    );
    
    // Setor que precisa atenção
    const needsAttention = sectorsAnalysis.reduce((worst, current) => 
      parseFloat(current.average) < parseFloat(worst.average) && current.employees > 0 ? current : worst
    );
    
    // Habilidade crítica (menor média)
    const criticalSkill = skillsAnalysis.averages.reduce((worst, current) => 
      parseFloat(current.average) < parseFloat(worst.average) ? current : worst
    );
    
    // Recomendação baseada na habilidade crítica
    const skillRecommendations: { [key: string]: string } = {
      'Comunicação': 'Treinamento em comunicação eficaz',
      'Trabalho em equipe': 'Workshop de colaboração',
      'Resolução de problemas': 'Curso de metodologias ágeis',
      'Gestão do tempo': 'Treinamento em produtividade',
      'Adaptabilidade': 'Programa de gestão de mudanças',
      'Liderança': 'Desenvolvimento de liderança',
      'Conhecimento técnico': 'Capacitação técnica especializada',
      'Iniciativa': 'Programa de inovação e proatividade',
      'Relacionamento interpessoal': 'Treinamento em soft skills'
    };
    
    return {
      bestSector: bestSector.sector,
      needsAttention: needsAttention.sector,
      criticalSkill: criticalSkill.skill,
      recommendation: skillRecommendations[criticalSkill.skill] || 'Avaliação individualizada'
    };
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    navigate('/admin-login');
  };

  const exportReport = (type: string) => {
    // Implementar exportação
    console.log(`Exportando relatório: ${type}`);
    // Aqui seria implementada a lógica de exportação real
  };

  const handleClearData = () => {
    localStorage.removeItem('evaluationResponses');
    setHasRealData(false);
    setDashboardData(generateMockData());
    toast({
      title: "Dados limpos",
      description: "Todos os dados de avaliação foram removidos do sistema.",
    });
  };

  const generateTestData = () => {
    const testData = [];
    const names = ['João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Souza'];
    
    for (let i = 0; i < 5; i++) {
      const evaluation = {
        id: `test-${i}`,
        name: names[i],
        sector: sectors[i % sectors.length],
        timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        duration: Math.floor(Math.random() * 10) + 8,
        skills: {},
        climateRating: Math.floor(Math.random() * 5) + 1
      };
      
      skills.forEach(skill => {
        evaluation.skills[skill] = Math.floor(Math.random() * 5) + 1;
      });
      
      testData.push(evaluation);
    }
    
    localStorage.setItem('evaluationResponses', JSON.stringify(testData));
    setHasRealData(true);
    setDashboardData(processRealData(testData));
    toast({
      title: "Dados de teste gerados",
      description: "5 avaliações de teste foram criadas para demonstração.",
    });
  };

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  const filteredSectorData = selectedSector === 'all' 
    ? dashboardData.sectorsAnalysis 
    : dashboardData.sectorsAnalysis.filter((s: any) => s.sector === selectedSector);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 text-white py-6 px-4 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-3 rounded-full shadow-lg">
                <BarChart3 className="h-8 w-8 text-slate-900" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Dashboard Administrativo</h1>
                <p className="text-blue-200">Morestoni Sociedade de Advogados</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {hasRealData && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost"
                      className="text-red-200 hover:bg-red-500/20 hover:text-red-100 border border-red-300/30"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Limpar Dados
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <span>Limpar Dados de Teste</span>
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação vai remover permanentemente todos os dados de avaliação salvos no sistema. 
                        Você tem certeza que deseja continuar?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleClearData}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Sim, limpar dados
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <Button 
                onClick={handleLogout}
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="bg-white border-b border-slate-200 py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-600">
                  {new Date().toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-600">
                  {hasRealData ? 'Dados Reais' : 'Dados de Demonstração'}
                </span>
              </div>
              {!hasRealData && (
                <Button 
                  onClick={generateTestData}
                  size="sm"
                  variant="outline"
                  className="text-blue-600 hover:bg-blue-50 border-blue-200"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Gerar Dados de Teste
                </Button>
              )}
            </div>
            <div className="text-sm text-slate-500">
              Total de respostas: {dashboardData.overview.totalEvaluations}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Seção 1 - Visão Geral */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Total de Avaliações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{dashboardData.overview.totalEvaluations}</span>
                <Users className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Tempo Médio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{dashboardData.overview.averageTime}</span>
                <Calendar className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Nota Média Geral</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{dashboardData.overview.overallAverage}</span>
                <Award className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Última Resposta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold">{dashboardData.overview.lastResponse}</span>
                <TrendingUp className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Seção 2 - Análise por Habilidades */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span>Análise por Habilidades</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Gráfico de barras simulado */}
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900">Média por Habilidade</h4>
                {dashboardData.skillsAnalysis.averages.slice(0, 5).map((item: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{item.skill}</span>
                      <span className="font-medium">{item.average}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          parseFloat(item.average) >= 4 ? 'bg-green-500' :
                          parseFloat(item.average) >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${(parseFloat(item.average) / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">Top 3 Pontos Fortes</h4>
                  {dashboardData.skillsAnalysis.topStrengths.map((skill: string, index: number) => (
                    <Badge key={index} variant="default" className="mr-2 mb-2 bg-green-100 text-green-800">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div>
                  <h4 className="font-semibold text-red-700 mb-2">Áreas para Melhorar</h4>
                  {dashboardData.skillsAnalysis.improvements.map((skill: string, index: number) => (
                    <Badge key={index} variant="destructive" className="mr-2 mb-2 bg-red-100 text-red-800">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seção 3 - Análise por Setor */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-blue-600" />
                <span>Análise por Setor</span>
              </div>
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Filtrar por setor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os setores</SelectItem>
                  {sectors.map(sector => (
                    <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Setor</th>
                    <th className="text-left py-3 px-4">Funcionários</th>
                    <th className="text-left py-3 px-4">Nota Média</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSectorData.map((sector: any, index: number) => (
                    <tr key={index} className="border-b hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium">{sector.sector}</td>
                      <td className="py-3 px-4">{sector.employees}</td>
                      <td className="py-3 px-4 font-semibold">{sector.average}</td>
                      <td className="py-3 px-4">
                        <Badge 
                          variant={parseFloat(sector.average) >= 4 ? "default" : parseFloat(sector.average) >= 3 ? "secondary" : "destructive"}
                          className={
                            parseFloat(sector.average) >= 4 ? "bg-green-100 text-green-800" :
                            parseFloat(sector.average) >= 3 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                          }
                        >
                          {parseFloat(sector.average) >= 4 ? 'Excelente' : parseFloat(sector.average) >= 3 ? 'Bom' : 'Atenção'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Seção 4 - Insights Automáticos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-green-700 font-medium">Melhor Setor</p>
                <p className="text-lg font-bold text-green-900">{dashboardData.insights.bestSector}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-sm text-red-700 font-medium">Precisa Atenção</p>
                <p className="text-lg font-bold text-red-900">{dashboardData.insights.needsAttention}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <BarChart3 className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-sm text-yellow-700 font-medium">Habilidade Crítica</p>
                <p className="text-lg font-bold text-yellow-900">{dashboardData.insights.criticalSkill}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <LineChart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-blue-700 font-medium">Recomendação</p>
                <p className="text-lg font-bold text-blue-900">{dashboardData.insights.recommendation}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Seção 5 - Clima Organizacional */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>Clima Organizacional</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-4">Satisfação Geral: {dashboardData.climateData.generalSatisfaction}/5</h4>
                <div className="w-full bg-slate-200 rounded-full h-4 mb-4">
                  <div 
                    className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-green-500"
                    style={{ width: `${(dashboardData.climateData.generalSatisfaction / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Distribuição das Notas</h4>
                {dashboardData.climateData.distribution.map((item: any) => (
                  <div key={item.rating} className="flex items-center space-x-2 mb-2">
                    <span className="w-8 text-sm">{item.rating}⭐</span>
                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${(item.count / 47) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm w-8">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seção 6 - Exportações */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5 text-blue-600" />
              <span>Exportações</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                onClick={() => exportReport('pdf')}
                variant="outline"
                className="flex flex-col space-y-2 h-20"
              >
                <FileText className="h-6 w-6 text-red-600" />
                <span className="text-xs">Relatório PDF</span>
              </Button>
              
              <Button 
                onClick={() => exportReport('excel')}
                variant="outline"
                className="flex flex-col space-y-2 h-20"
              >
                <FileSpreadsheet className="h-6 w-6 text-green-600" />
                <span className="text-xs">Planilha Excel</span>
              </Button>
              
              <Button 
                onClick={() => exportReport('png')}
                variant="outline"
                className="flex flex-col space-y-2 h-20"
              >
                <Image className="h-6 w-6 text-blue-600" />
                <span className="text-xs">Gráficos PNG</span>
              </Button>
              
              <Button 
                onClick={() => exportReport('json')}
                variant="outline"
                className="flex flex-col space-y-2 h-20"
              >
                <Database className="h-6 w-6 text-purple-600" />
                <span className="text-xs">Backup JSON</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;