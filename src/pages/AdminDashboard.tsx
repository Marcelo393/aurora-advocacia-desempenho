import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
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
  AlertTriangle,
  Filter,
  RefreshCw,
  Eye,
  Star,
  Smile,
  Trophy,
  Target,
  Lightbulb,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart as RechartsLineChart, Line, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedSector, setSelectedSector] = useState('all');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [hasRealData, setHasRealData] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [activeTab, setActiveTab] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  
  const itemsPerPage = 10;
  
  // Cores para gráficos
  const CHART_COLORS = ['#1e40af', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4'];
  
  // Função para obter dados completos dos funcionários
  const getEmployeeData = () => {
    const savedData = localStorage.getItem('evaluationResponses');
    if (savedData) {
      try {
        const evaluations = JSON.parse(savedData);
        return evaluations.map((evaluation: any, index: number) => ({
          id: evaluation.id || `emp-${index}`,
          name: evaluation.name || `Funcionário ${index + 1}`,
          sector: evaluation.sector || 'Não informado',
          date: evaluation.timestamp || evaluation.createdAt || new Date().toISOString(),
          overallRating: calculateIndividualOverallRating(evaluation.skills || {}),
          skills: evaluation.skills || {},
          climateRating: evaluation.climateRating || 0,
          evaluation: evaluation
        }));
      } catch (error) {
        console.error('Erro ao processar dados dos funcionários:', error);
        return [];
      }
    }
    return [];
  };
  
  const calculateIndividualOverallRating = (skills: any) => {
    const ratings = Object.values(skills).filter(Boolean) as number[];
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating, 0);
    return parseFloat((sum / ratings.length).toFixed(1));
  };

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

  // Preparar dados para gráficos
  const prepareChartData = () => {
    const skillsChartData = dashboardData.skillsAnalysis.averages.map((item: any) => ({
      skill: item.skill,
      average: parseFloat(item.average),
      color: parseFloat(item.average) >= 4 ? '#10b981' : parseFloat(item.average) >= 3 ? '#f59e0b' : '#ef4444'
    }));

    const sectorsChartData = dashboardData.sectorsAnalysis.map((sector: any, index: number) => ({
      sector: sector.sector,
      employees: sector.employees,
      average: parseFloat(sector.average),
      fill: CHART_COLORS[index % CHART_COLORS.length]
    }));

    return { skillsChartData, sectorsChartData };
  };

  // Filtrar dados dos funcionários
  const filterEmployees = () => {
    const employees = getEmployeeData();
    let filtered = employees;

    if (activeTab !== 'todos') {
      filtered = filtered.filter(emp => emp.sector === activeTab);
    }

    if (searchTerm) {
      filtered = filtered.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.sector.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  // Preparar insights automáticos
  const generateAutomaticInsights = () => {
    const insights = [];
    
    // Melhor Performance
    const bestSector = dashboardData.sectorsAnalysis.reduce((best: any, current: any) => 
      parseFloat(current.average) > parseFloat(best.average) ? current : best
    );
    insights.push({
      icon: <Trophy className="h-5 w-5 text-yellow-600" />,
      title: "Melhor Performance",
      description: `${bestSector.sector} destaca-se com média ${bestSector.average}`,
      color: "from-yellow-50 to-yellow-100 border-yellow-200"
    });

    // Atenção Necessária
    const criticalSkill = dashboardData.skillsAnalysis.averages.reduce((worst: any, current: any) => 
      parseFloat(current.average) < parseFloat(worst.average) ? current : worst
    );
    insights.push({
      icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      title: "Atenção Necessária",
      description: `${criticalSkill.skill} precisa foco (média ${criticalSkill.average})`,
      color: "from-red-50 to-red-100 border-red-200"
    });

    // Tendência
    const overallTrend = dashboardData.overview.overallAverage > 3.5 ? "Positiva" : "Negativa";
    insights.push({
      icon: <TrendingUp className="h-5 w-5 text-blue-600" />,
      title: "Tendência",
      description: `Performance ${overallTrend} com média ${dashboardData.overview.overallAverage}`,
      color: "from-blue-50 to-blue-100 border-blue-200"
    });

    // Recomendação
    insights.push({
      icon: <Lightbulb className="h-5 w-5 text-green-600" />,
      title: "Recomendação",
      description: dashboardData.insights.recommendation,
      color: "from-green-50 to-green-100 border-green-200"
    });

    return insights;
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

  const { skillsChartData, sectorsChartData } = prepareChartData();
  const filteredEmployees = filterEmployees();
  const automaticInsights = generateAutomaticInsights();
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      {/* Header Profissional */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 text-white py-6 px-4 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-3 rounded-full shadow-lg">
                <BarChart3 className="h-8 w-8 text-slate-900" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
                <p className="text-blue-200">Morestoni Sociedade de Advogados</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Filtros */}
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4" />
                  <span className="text-sm">Período:</span>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 dias</SelectItem>
                      <SelectItem value="30">30 dias</SelectItem>
                      <SelectItem value="90">90 dias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Setor:</span>
                  <Select value={selectedSector} onValueChange={setSelectedSector}>
                    <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {sectors.map(sector => (
                        <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Botões */}
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={() => exportReport('pdf')}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar PDF
                </Button>
                
                <Button 
                  onClick={() => loadDashboardData()}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Atualizar
                </Button>
                
                {hasRealData && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="text-red-200 hover:bg-red-500/20 hover:text-red-100"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Limpar Dados
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center space-x-2">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                          <span>Limpar Dados</span>
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação vai remover permanentemente todos os dados de avaliação. Continuar?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearData} className="bg-red-600 hover:bg-red-700">
                          Sim, limpar dados
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                
                <Button 
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="bg-white border-b border-slate-200 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6">
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

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Cards Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Avaliações</p>
                  <p className="text-3xl font-bold">{dashboardData.overview.totalEvaluations}</p>
                  <p className="text-blue-100 text-xs mt-1">📊 Respostas coletadas</p>
                </div>
                <Users className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Nota Média Geral</p>
                  <p className="text-3xl font-bold flex items-center">
                    ⭐ {dashboardData.overview.overallAverage}
                  </p>
                  <p className="text-green-100 text-xs mt-1">
                    {dashboardData.overview.overallAverage >= 4 ? 'Excelente' : 
                     dashboardData.overview.overallAverage >= 3 ? 'Bom' : 'Atenção'}
                  </p>
                </div>
                <Star className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Melhor Setor</p>
                  <p className="text-lg font-bold">🏆 {dashboardData.insights.bestSector.split(' - ')[0]}</p>
                  <p className="text-yellow-100 text-xs mt-1">Maior performance</p>
                </div>
                <Trophy className="h-12 w-12 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Clima Organizacional</p>
                  <p className="text-3xl font-bold flex items-center">
                    😊 {dashboardData.climateData.generalSatisfaction}
                  </p>
                  <p className="text-purple-100 text-xs mt-1">Satisfação geral</p>
                </div>
                <Smile className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos Interativos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Barras - Habilidades */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span>Análise por Habilidades</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={skillsChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="skill" angle={-45} textAnchor="end" height={100} fontSize={12} />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Bar dataKey="average" fill="#1e40af" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Pizza - Distribuição por Setor */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-blue-600" />
                <span>Distribuição por Setor</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={sectorsChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ sector, employees }) => `${sector}: ${employees}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="employees"
                  >
                    {sectorsChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Análise por Setor com Tabs */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span>Análise Detalhada por Setor</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
                <TabsTrigger value="todos">Todos</TabsTrigger>
                {sectors.map(sector => (
                  <TabsTrigger key={sector} value={sector} className="text-xs">
                    {sector.split(' - ')[0]}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {['todos', ...sectors].map(tabValue => (
                <TabsContent key={tabValue} value={tabValue} className="mt-4">
                  <div className="space-y-4">
                    {/* Resumo do Setor */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                            <p className="text-sm text-blue-700">Funcionários</p>
                            <p className="text-2xl font-bold text-blue-900">
                              {tabValue === 'todos' ? 
                                dashboardData.overview.totalEvaluations : 
                                dashboardData.sectorsAnalysis.find((s: any) => s.sector === tabValue)?.employees || 0
                              }
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gradient-to-br from-green-50 to-green-100">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <Award className="h-6 w-6 text-green-600 mx-auto mb-2" />
                            <p className="text-sm text-green-700">Nota Média</p>
                            <p className="text-2xl font-bold text-green-900">
                              {tabValue === 'todos' ? 
                                dashboardData.overview.overallAverage : 
                                dashboardData.sectorsAnalysis.find((s: any) => s.sector === tabValue)?.average || '0.0'
                              }
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <Trophy className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                            <p className="text-sm text-yellow-700">Ranking</p>
                            <p className="text-2xl font-bold text-yellow-900">
                              {tabValue === 'todos' ? '#1' : 
                                `#${dashboardData.sectorsAnalysis
                                  .sort((a: any, b: any) => parseFloat(b.average) - parseFloat(a.average))
                                  .findIndex((s: any) => s.sector === tabValue) + 1}`
                              }
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Tabela de Funcionários */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Funcionários Avaliados</span>
              </div>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Buscar funcionário..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Nome</th>
                    <th className="text-left py-3 px-4">Setor</th>
                    <th className="text-left py-3 px-4">Data</th>
                    <th className="text-left py-3 px-4">Nota Geral</th>
                    <th className="text-left py-3 px-4">Progresso</th>
                    <th className="text-left py-3 px-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEmployees.map((employee: any, index: number) => (
                    <tr key={index} className="border-b hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium">{employee.name}</td>
                      <td className="py-3 px-4">{employee.sector}</td>
                      <td className="py-3 px-4">{new Date(employee.date).toLocaleDateString('pt-BR')}</td>
                      <td className="py-3 px-4 font-semibold">{employee.overallRating}</td>
                      <td className="py-3 px-4">
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              employee.overallRating >= 4 ? 'bg-green-500' :
                              employee.overallRating >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${(employee.overallRating / 5) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Dialog open={employeeModalOpen} onOpenChange={setEmployeeModalOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedEmployee(employee)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver Detalhes
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>Detalhes da Avaliação - {selectedEmployee?.name}</DialogTitle>
                            </DialogHeader>
                            {selectedEmployee && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <Card>
                                    <CardContent className="p-4">
                                      <div className="text-center">
                                        <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                        <p className="text-sm text-slate-600">Funcionário</p>
                                        <p className="font-semibold">{selectedEmployee.name}</p>
                                      </div>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardContent className="p-4">
                                      <div className="text-center">
                                        <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                        <p className="text-sm text-slate-600">Setor</p>
                                        <p className="font-semibold">{selectedEmployee.sector}</p>
                                      </div>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardContent className="p-4">
                                      <div className="text-center">
                                        <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                                        <p className="text-sm text-slate-600">Data</p>
                                        <p className="font-semibold">{new Date(selectedEmployee.date).toLocaleDateString('pt-BR')}</p>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle>Habilidades Avaliadas</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-3">
                                        {skills.map((skill, index) => (
                                          <div key={index} className="flex items-center justify-between">
                                            <span className="text-sm">{skill}</span>
                                            <div className="flex items-center space-x-2">
                                              <span className="font-medium">{selectedEmployee.skills[skill] || 0}</span>
                                              <div className="w-20 bg-slate-200 rounded-full h-2">
                                                <div 
                                                  className={`h-2 rounded-full ${
                                                    (selectedEmployee.skills[skill] || 0) >= 4 ? 'bg-green-500' :
                                                    (selectedEmployee.skills[skill] || 0) >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                                                  }`}
                                                  style={{ width: `${((selectedEmployee.skills[skill] || 0) / 5) * 100}%` }}
                                                ></div>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </CardContent>
                                  </Card>

                                  <Card>
                                    <CardHeader>
                                      <CardTitle>Conclusão Automática</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <div className="p-3 bg-green-50 rounded-lg">
                                          <p className="text-sm font-medium text-green-800">🎯 Ponto Forte:</p>
                                          <p className="text-sm text-green-700">
                                            {Object.entries(selectedEmployee.skills)
                                              .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'N/A'} 
                                            (nota {Math.max(...Object.values(selectedEmployee.skills) as number[]) || 0})
                                          </p>
                                        </div>
                                        
                                        <div className="p-3 bg-red-50 rounded-lg">
                                          <p className="text-sm font-medium text-red-800">⚠️ Área de Melhoria:</p>
                                          <p className="text-sm text-red-700">
                                            {Object.entries(selectedEmployee.skills)
                                              .sort(([,a], [,b]) => (a as number) - (b as number))[0]?.[0] || 'N/A'} 
                                            (nota {Math.min(...Object.values(selectedEmployee.skills) as number[]) || 0})
                                          </p>
                                        </div>
                                        
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                          <p className="text-sm font-medium text-blue-800">💡 Recomendação:</p>
                                          <p className="text-sm text-blue-700">
                                            {selectedEmployee.overallRating >= 4 ? 
                                              'Manter alto desempenho e considerar liderança' :
                                              selectedEmployee.overallRating >= 3 ?
                                              'Foco em desenvolvimento específico' :
                                              'Plano de melhoria individual necessário'
                                            }
                                          </p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <span className="text-sm">
                  Página {currentPage} de {totalPages}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Insights Automáticos */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-blue-600" />
              <span>Insights Automáticos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {automaticInsights.map((insight, index) => (
                <Card key={index} className={`bg-gradient-to-br ${insight.color} border-0`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      {insight.icon}
                      <div>
                        <p className="font-medium text-sm">{insight.title}</p>
                        <p className="text-xs text-slate-600 mt-1">{insight.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Exportações */}
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
                className="flex flex-col space-y-2 h-20 hover:bg-red-50"
              >
                <FileText className="h-6 w-6 text-red-600" />
                <span className="text-xs">Relatório PDF</span>
              </Button>
              
              <Button 
                onClick={() => exportReport('excel')}
                variant="outline"
                className="flex flex-col space-y-2 h-20 hover:bg-green-50"
              >
                <FileSpreadsheet className="h-6 w-6 text-green-600" />
                <span className="text-xs">Planilha Excel</span>
              </Button>
              
              <Button 
                onClick={() => exportReport('png')}
                variant="outline"
                className="flex flex-col space-y-2 h-20 hover:bg-blue-50"
              >
                <Image className="h-6 w-6 text-blue-600" />
                <span className="text-xs">Gráficos PNG</span>
              </Button>
              
              <Button 
                onClick={() => exportReport('json')}
                variant="outline"
                className="flex flex-col space-y-2 h-20 hover:bg-purple-50"
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