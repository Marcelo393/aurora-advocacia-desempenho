
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Calendar, 
  Download, 
  FileText, 
  PieChart, 
  Target,
  MessageSquare,
  LogOut,
  Building2,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DashboardData {
  totalEvaluations: number;
  averageTime: string;
  overallRating: number;
  lastResponse: string;
  skillsData: { skill: string; average: number }[];
  sectorsData: { sector: string; employees: number; average: number }[];
  climateData: { question: string; average: number }[];
  feedbackWords: string[];
  objectives: string[];
  suggestions: string[];
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  const sectors = [
    "Previdenciário - Judicial",
    "Previdenciário - Administrativo", 
    "Previdenciário - Auxílio",
    "Tributário",
    "Securitário",
    "Controladoria"
  ];

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('admin-authenticated');
    if (!isAuthenticated) {
      navigate('/admin-login');
      return;
    }

    // Load and process data from localStorage
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = () => {
    // Get evaluation data from localStorage
    const evaluations = getAllEvaluations();
    
    if (evaluations.length === 0) {
      // Mock data for demonstration
      setDashboardData({
        totalEvaluations: 0,
        averageTime: "0 min",
        overallRating: 0,
        lastResponse: "Nenhuma resposta ainda",
        skillsData: [],
        sectorsData: [],
        climateData: [],
        feedbackWords: [],
        objectives: [],
        suggestions: []
      });
      return;
    }

    // Process real data
    const processedData = processEvaluationData(evaluations);
    setDashboardData(processedData);
  };

  const getAllEvaluations = () => {
    // This would collect all evaluation data from localStorage
    // For now, return empty array as we don't have stored evaluations yet
    return [];
  };

  const processEvaluationData = (evaluations: any[]) => {
    // Process evaluation data to generate dashboard metrics
    // This is a placeholder for the actual data processing logic
    return {
      totalEvaluations: evaluations.length,
      averageTime: "12 min",
      overallRating: 4.2,
      lastResponse: "Hoje às 14:30",
      skillsData: [
        { skill: "Trabalho em Equipe", average: 4.5 },
        { skill: "Cumprimento de Entregas", average: 4.2 },
        { skill: "Proatividade", average: 3.8 },
        { skill: "Postura Profissional", average: 4.1 },
        { skill: "Adaptação", average: 3.9 }
      ],
      sectorsData: sectors.map(sector => ({
        sector,
        employees: Math.floor(Math.random() * 10) + 1,
        average: Math.random() * 2 + 3 // 3-5 range
      })),
      climateData: [
        { question: "Satisfação Geral", average: 4.1 },
        { question: "Ambiente de Equipe", average: 4.3 },
        { question: "Comunicação", average: 3.9 },
        { question: "Crescimento", average: 3.7 },
        { question: "Reconhecimento", average: 3.8 }
      ],
      feedbackWords: ["crescimento", "comunicação", "equipe", "desafios", "oportunidades"],
      objectives: ["Crescimento profissional", "Melhoria técnica", "Liderança"],
      suggestions: ["Mais treinamentos", "Melhor comunicação", "Processos otimizados"]
    };
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-authenticated');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
    navigate('/admin-login');
  };

  const exportToPDF = () => {
    toast({
      title: "Relatório sendo gerado",
      description: "O PDF executivo será baixado em breve.",
    });
  };

  const exportToExcel = () => {
    toast({
      title: "Dados sendo exportados",
      description: "O arquivo Excel será baixado em breve.",
    });
  };

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  const getBestSector = () => {
    if (dashboardData.sectorsData.length === 0) return "N/A";
    return dashboardData.sectorsData.reduce((prev, current) => 
      prev.average > current.average ? prev : current
    ).sector;
  };

  const getWorstSector = () => {
    if (dashboardData.sectorsData.length === 0) return "N/A";
    return dashboardData.sectorsData.reduce((prev, current) => 
      prev.average < current.average ? prev : current
    ).sector;
  };

  const getCriticalSkill = () => {
    if (dashboardData.skillsData.length === 0) return "N/A";
    return dashboardData.skillsData.reduce((prev, current) => 
      prev.average < current.average ? prev : current
    ).skill;
  };

  const getSkillColor = (average: number) => {
    if (average >= 4) return "text-green-600 bg-green-100";
    if (average >= 3) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Dashboard Administrativo
              </h1>
              <p className="text-slate-600">
                Morestoni Sociedade de Advogados
              </p>
            </div>
            
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-slate-600 hover:text-slate-800"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="skills">Habilidades</TabsTrigger>
            <TabsTrigger value="sectors">Setores</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Avaliações</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.totalEvaluations}</div>
                  <p className="text-xs text-muted-foreground">
                    Respostas coletadas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.averageTime}</div>
                  <p className="text-xs text-muted-foreground">
                    Para completar avaliação
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Nota Média Geral</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.overallRating.toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground">
                    De 5.0 possíveis
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Última Resposta</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-sm">{dashboardData.lastResponse}</div>
                  <p className="text-xs text-muted-foreground">
                    Resposta mais recente
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Insights Automáticos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">
                    <strong>Setor com melhor performance:</strong> {getBestSector()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">
                    <strong>Setor que precisa atenção:</strong> {getWorstSector()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">
                    <strong>Habilidade mais crítica:</strong> {getCriticalSkill()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">
                    <strong>Recomendação:</strong> Foco em desenvolvimento de liderança
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Análise por Habilidades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.skillsData.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{skill.skill}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(skill.average / 5) * 100}%` }}
                          ></div>
                        </div>
                        <Badge className={getSkillColor(skill.average)}>
                          {skill.average.toFixed(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-700">Top 5 Pontos Fortes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {dashboardData.skillsData
                      .sort((a, b) => b.average - a.average)
                      .slice(0, 5)
                      .map((skill, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{skill.skill}</span>
                          <Badge className="bg-green-100 text-green-700">
                            {skill.average.toFixed(1)}
                          </Badge>
                        </div>
                      ))
                    }
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-700">Áreas de Melhoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {dashboardData.skillsData
                      .sort((a, b) => a.average - b.average)
                      .slice(0, 5)
                      .map((skill, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{skill.skill}</span>
                          <Badge className="bg-red-100 text-red-700">
                            {skill.average.toFixed(1)}
                          </Badge>
                        </div>
                      ))
                    }
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sectors" className="space-y-6">
            {/* Sector Filter */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Análise por Setor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Select value={selectedSector} onValueChange={setSelectedSector}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Filtrar por setor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Setores</SelectItem>
                      {sectors.map((sector) => (
                        <SelectItem key={sector} value={sector}>
                          {sector}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sectors Table */}
                <div className="border rounded-lg">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Setor</th>
                        <th className="px-4 py-2 text-center">Funcionários</th>
                        <th className="px-4 py-2 text-center">Nota Média</th>
                        <th className="px-4 py-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.sectorsData
                        .filter(sector => selectedSector === 'all' || sector.sector === selectedSector)
                        .map((sector, index) => (
                          <tr key={index} className="border-t">
                            <td className="px-4 py-2 font-medium">{sector.sector}</td>
                            <td className="px-4 py-2 text-center">{sector.employees}</td>
                            <td className="px-4 py-2 text-center">{sector.average.toFixed(1)}</td>
                            <td className="px-4 py-2 text-center">
                              <Badge className={getSkillColor(sector.average)}>
                                {sector.average >= 4 ? 'Excelente' : 
                                 sector.average >= 3 ? 'Bom' : 'Atenção'}
                              </Badge>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Climate Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Clima Organizacional por Setor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.climateData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{item.question}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(item.average / 5) * 100}%` }}
                          ></div>
                        </div>
                        <Badge className={getSkillColor(item.average)}>
                          {item.average.toFixed(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            {/* Export Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button onClick={exportToPDF} className="h-24 flex flex-col items-center justify-center">
                <FileText className="h-6 w-6 mb-2" />
                <span>Relatório Executivo</span>
                <span className="text-xs opacity-75">PDF</span>
              </Button>

              <Button onClick={exportToExcel} variant="outline" className="h-24 flex flex-col items-center justify-center">
                <Download className="h-6 w-6 mb-2" />
                <span>Dados Completos</span>
                <span className="text-xs opacity-75">Excel</span>
              </Button>

              <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                <BarChart3 className="h-6 w-6 mb-2" />
                <span>Gráficos</span>
                <span className="text-xs opacity-75">PNG</span>
              </Button>

              <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                <PieChart className="h-6 w-6 mb-2" />
                <span>Backup</span>
                <span className="text-xs opacity-75">JSON</span>
              </Button>
            </div>

            {/* Feedback Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Principais Palavras nos Feedbacks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {dashboardData.feedbackWords.map((word, index) => (
                      <Badge key={index} variant="secondary">
                        {word}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Objetivos Mais Mencionados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {dashboardData.objectives.map((objective, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">{objective}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Sugestões de Melhoria Frequentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dashboardData.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
