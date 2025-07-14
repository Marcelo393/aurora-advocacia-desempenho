
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, Users, TrendingUp, Clock, Award, AlertTriangle, 
  Download, Eye, Filter, ArrowUp, ArrowDown, LogOut 
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [evaluationData, setEvaluationData] = useState<any[]>([]);

  const sectors = [
    "Previdenciário - Judicial",
    "Previdenciário - Administrativo", 
    "Previdenciário - Auxílio",
    "Tributário",
    "Securitário",
    "Controladoria"
  ];

  // Mock data for demonstration
  const mockData = [
    { 
      nome: "João Silva", 
      setor: "Previdenciário - Judicial",
      data: "2025-01-15",
      notaGeral: 4.2,
      habilidades: {
        trabalhoEquipe: 4.5,
        entregas: 4.0,
        proatividade: 4.3,
        comunicacao: 3.8,
        lideranca: 3.5
      }
    },
    { 
      nome: "Maria Santos", 
      setor: "Tributário",
      data: "2025-01-14",
      notaGeral: 3.9,
      habilidades: {
        trabalhoEquipe: 4.1,
        entregas: 3.7,
        proatividade: 4.0,
        comunicacao: 3.9,
        lideranca: 3.6
      }
    }
  ];

  useEffect(() => {
    // Load evaluation data from localStorage
    const savedData = localStorage.getItem('evaluation-responses');
    if (savedData) {
      setEvaluationData(JSON.parse(savedData));
    } else {
      setEvaluationData(mockData);
    }
  }, []);

  const handleLogin = () => {
    if (password === 'morestoni2025') {
      setIsAuthenticated(true);
    } else {
      alert('Senha incorreta!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  const calculateGeneralStats = () => {
    const total = evaluationData.length;
    const avgScore = evaluationData.reduce((acc, item) => acc + item.notaGeral, 0) / total || 0;
    const lastResponse = evaluationData.length > 0 ? evaluationData[evaluationData.length - 1].data : '-';
    
    return { total, avgScore: avgScore.toFixed(1), lastResponse };
  };

  const getSectorData = () => {
    const sectorCounts = sectors.map(sector => ({
      name: sector,
      value: evaluationData.filter(item => item.setor === sector).length
    }));
    return sectorCounts;
  };

  const getTopSkills = () => {
    if (evaluationData.length === 0) return [];
    
    const skillAverages: { [key: string]: number[] } = {};
    
    evaluationData.forEach(item => {
      Object.entries(item.habilidades || {}).forEach(([skill, score]) => {
        if (!skillAverages[skill]) skillAverages[skill] = [];
        skillAverages[skill].push(score as number);
      });
    });

    const skillStats = Object.entries(skillAverages).map(([skill, scores]) => ({
      skill: skill.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      average: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
    }));

    return skillStats.sort((a, b) => parseFloat(b.average) - parseFloat(a.average));
  };

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Dashboard Administrativo</CardTitle>
            <p className="text-slate-600">Morestoni Sociedade de Advogados</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Senha de Acesso</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full"
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              Acessar Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = calculateGeneralStats();
  const sectorData = getSectorData();
  const topSkills = getTopSkills();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dashboard Administrativo</h1>
              <p className="text-slate-600">Morestoni Sociedade de Advogados</p>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total de Avaliações</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
                </div>
                <Users className="h-12 w-12 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Nota Média Geral</p>
                  <p className="text-3xl font-bold text-green-600">{stats.avgScore}/5</p>
                </div>
                <Award className="h-12 w-12 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Última Resposta</p>
                  <p className="text-lg font-semibold text-slate-900">{stats.lastResponse}</p>
                </div>
                <Clock className="h-12 w-12 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Setores Ativos</p>
                  <p className="text-3xl font-bold text-purple-600">{sectorData.filter(s => s.value > 0).length}</p>
                </div>
                <BarChart3 className="h-12 w-12 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analysis */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">📊 Visão Geral</TabsTrigger>
            <TabsTrigger value="performance">🎯 Performance</TabsTrigger>
            <TabsTrigger value="sectors">🏢 Por Setor</TabsTrigger>
            <TabsTrigger value="comparison">📈 Comparativo</TabsTrigger>
            <TabsTrigger value="insights">💡 Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Respostas por Setor</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      value: { label: "Respostas", color: "hsl(var(--chart-1))" }
                    }}
                    className="h-80"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sectorData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {sectorData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top 5 Habilidades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topSkills.slice(0, 5).map((skill, index) => (
                      <div key={skill.skill} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline">{index + 1}º</Badge>
                          <span className="text-sm font-medium">{skill.skill}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-green-600">{skill.average}</span>
                          <ArrowUp className="h-4 w-4 text-green-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Performance Geral</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    average: { label: "Média", color: "hsl(var(--chart-2))" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topSkills}>
                      <XAxis dataKey="skill" angle={-45} textAnchor="end" height={100} />
                      <YAxis domain={[0, 5]} />
                      <Bar dataKey="average" fill="#3B82F6" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sectors" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Análise por Setor</CardTitle>
                <Select value={selectedSector} onValueChange={setSelectedSector}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Selecione um setor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Setores</SelectItem>
                    {sectors.map(sector => (
                      <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {sectors.map(sector => {
                    const sectorEvals = evaluationData.filter(item => item.setor === sector);
                    const avgScore = sectorEvals.length > 0 
                      ? (sectorEvals.reduce((acc, item) => acc + item.notaGeral, 0) / sectorEvals.length).toFixed(1)
                      : '0.0';
                    
                    return (
                      <Card key={sector} className="p-4">
                        <h3 className="font-semibold text-sm mb-2">{sector}</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-xs text-slate-600">Funcionários:</span>
                            <span className="text-sm font-medium">{sectorEvals.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-slate-600">Nota Média:</span>
                            <span className="text-sm font-bold text-blue-600">{avgScore}/5</span>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Comparativo entre Setores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-slate-200">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="border border-slate-200 p-3 text-left">Setor</th>
                        <th className="border border-slate-200 p-3 text-center">Funcionários</th>
                        <th className="border border-slate-200 p-3 text-center">Nota Média</th>
                        <th className="border border-slate-200 p-3 text-center">Ranking</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sectors.map((sector, index) => {
                        const sectorEvals = evaluationData.filter(item => item.setor === sector);
                        const avgScore = sectorEvals.length > 0 
                          ? sectorEvals.reduce((acc, item) => acc + item.notaGeral, 0) / sectorEvals.length
                          : 0;
                        
                        return (
                          <tr key={sector} className="hover:bg-slate-50">
                            <td className="border border-slate-200 p-3 font-medium">{sector}</td>
                            <td className="border border-slate-200 p-3 text-center">{sectorEvals.length}</td>
                            <td className="border border-slate-200 p-3 text-center">
                              <Badge variant={avgScore >= 4 ? "default" : avgScore >= 3 ? "secondary" : "destructive"}>
                                {avgScore.toFixed(1)}/5
                              </Badge>
                            </td>
                            <td className="border border-slate-200 p-3 text-center">
                              #{index + 1}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-green-500" />
                    <span>Pontos Fortes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-800">🏆 Melhor Setor</p>
                      <p className="text-xs text-green-600">Previdenciário - Judicial (4.2/5)</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">💪 Habilidade Mais Forte</p>
                      <p className="text-xs text-blue-600">Trabalho em Equipe (4.3/5)</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm font-medium text-purple-800">📈 Tendência Positiva</p>
                      <p className="text-xs text-purple-600">Comunicação melhorou 15% no último mês</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <span>Áreas de Atenção</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm font-medium text-orange-800">⚠️ Precisa de Atenção</p>
                      <p className="text-xs text-orange-600">Tributário (3.9/5 - abaixo da média)</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <p className="text-sm font-medium text-red-800">🎯 Foco de Melhoria</p>
                      <p className="text-xs text-red-600">Liderança (3.5/5 - pontuação mais baixa)</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm font-medium text-yellow-800">📊 Recomendação</p>
                      <p className="text-xs text-yellow-600">Investir em treinamento de gestão de tempo</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Export Actions */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Relatórios e Exportação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Relatório Executivo PDF</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Dados por Setor (Excel)</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>Backup Completo JSON</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
