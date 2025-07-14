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
  Database
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [selectedSector, setSelectedSector] = useState('all');
  const [dashboardData, setDashboardData] = useState<any>(null);

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
    const savedData = localStorage.getItem('evaluationData');
    
    if (savedData) {
      // Processar dados reais
      const evaluations = JSON.parse(savedData);
      setDashboardData(processRealData(evaluations));
    } else {
      // Usar dados mock para demonstração
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
    // Implementar cálculo real
    return '12 min';
  };

  const calculateOverallAverage = (evaluations: any[]) => {
    // Implementar cálculo real
    return 4.2;
  };

  const getLastResponse = (evaluations: any[]) => {
    // Implementar busca real
    return '2 horas atrás';
  };

  const calculateSkillsAnalysis = (evaluations: any[]) => {
    // Implementar análise real
    return generateMockData().skillsAnalysis;
  };

  const calculateSectorsAnalysis = (evaluations: any[]) => {
    // Implementar análise real
    return generateMockData().sectorsAnalysis;
  };

  const calculateClimateData = (evaluations: any[]) => {
    // Implementar análise real
    return generateMockData().climateData;
  };

  const generateInsights = (evaluations: any[]) => {
    // Implementar insights reais
    return generateMockData().insights;
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