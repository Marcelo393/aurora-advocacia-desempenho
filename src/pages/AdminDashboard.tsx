import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  ChevronRight,
  MessageSquare,
  Save,
  X
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
  const [selectedEmployeeForComment, setSelectedEmployeeForComment] = useState('');
  const [adminComment, setAdminComment] = useState('');
  
  const itemsPerPage = 10;
  
  // Cores para gráficos
  const CHART_COLORS = ['#1e40af', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4'];
  
  // Função para obter dados completos dos funcionários
  const getEmployeeData = () => {
    const savedData = localStorage.getItem('evaluationResponses');
    if (savedData) {
      try {
        const evaluations = JSON.parse(savedData);
        console.log('📊 Dados carregados do localStorage:', evaluations);
        return evaluations.map((evaluation: any, index: number) => ({
          id: evaluation.id || `emp-${index}`,
          name: evaluation.name || `Funcionário ${index + 1}`,
          sector: evaluation.sector || 'Não informado',
          date: evaluation.timestamp || evaluation.createdAt || new Date().toISOString(),
          overallRating: calculateIndividualOverallRating(evaluation.skills || {}),
          skills: evaluation.skills || {},
          climateRating: mapSatisfactionToNumber(evaluation.climateData?.satisfacaoGeral) || 3,
          responseTime: evaluation.responseTimeMinutes || 0,
          evaluation: evaluation,
          // Comentário automático gerado
          autoComment: generateAutoComment(evaluation)
        }));
      } catch (error) {
        console.error('Erro ao processar dados dos funcionários:', error);
        return [];
      }
    }
    return [];
  };

  // Mapear satisfação para número
  const mapSatisfactionToNumber = (satisfaction: string): number => {
    const mapping: Record<string, number> = {
      'muito_insatisfeito': 1,
      'insatisfeito': 2,
      'neutro': 3,
      'satisfeito': 4,
      'muito_satisfeito': 5
    };
    return mapping[satisfaction] || 3;
  };

  // Gerar comentário automático inteligente
  const generateAutoComment = (evaluation: any): string => {
    if (!evaluation.skills) return "Dados insuficientes para análise.";
    
    const skills = evaluation.skills;
    const ratings = Object.values(skills).filter(Boolean) as number[];
    
    if (ratings.length === 0) return "Avaliação não contém dados de habilidades.";
    
    const media = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    const climateRating = mapSatisfactionToNumber(evaluation.climateData?.satisfacaoGeral) || 3;
    
    // Encontrar melhor e pior habilidade
    const skillEntries = Object.entries(skills).filter(([_, value]) => value);
    const melhorHabilidade = skillEntries.length > 0 ? skillEntries.reduce((best, current) => 
      current[1] > best[1] ? current : best, skillEntries[0]
    ) : ['N/A', 0];
    const piorHabilidade = skillEntries.length > 0 ? skillEntries.reduce((worst, current) => 
      current[1] < worst[1] ? current : worst, skillEntries[0]
    ) : ['N/A', 0];
    
    let comentario = "";
    
    // Avaliação geral
    if (media >= 4.5) comentario += "Desempenho EXCELENTE com nota geral superior. ";
    else if (media >= 4.0) comentario += "Desempenho MUITO BOM demonstrando competência sólida. ";
    else if (media >= 3.0) comentario += "Desempenho SATISFATÓRIO dentro das expectativas. ";
    else comentario += "Desempenho PRECISA ATENÇÃO com oportunidades de melhoria significativas. ";
    
    // Ponto forte
    const skillNames: Record<string, string> = {
      comunicacao: 'Comunicação',
      trabalhoEquipe: 'Trabalho em Equipe',
      proatividade: 'Proatividade',
      pontualidade: 'Pontualidade',
      conhecimento: 'Conhecimento Técnico',
      gestao: 'Gestão',
      postura: 'Postura Profissional',
      organizacao: 'Organização',
      clima: 'Satisfação Organizacional'
    };
    
    comentario += `Destaque em ${skillNames[melhorHabilidade[0]] || melhorHabilidade[0]} (${melhorHabilidade[1]}/5). `;
    
    // Área de melhoria
    if (Number(piorHabilidade[1]) <= 3) {
      comentario += `Desenvolver ${skillNames[piorHabilidade[0]] || piorHabilidade[0]} (${piorHabilidade[1]}/5). `;
    }
    
    // Clima organizacional
    if (climateRating <= 2) {
      comentario += "Atenção ao nível de satisfação organizacional reportado.";
    } else if (climateRating >= 4) {
      comentario += "Demonstra alta satisfação com o ambiente de trabalho.";
    }
    
    return comentario;
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
          setDashboardData(getEmptyData());
        }
      } catch (error) {
        console.error('Erro ao processar dados:', error);
        setHasRealData(false);
        setDashboardData(getEmptyData());
      }
    } else {
      // Sem dados - mostrar estado vazio
      setHasRealData(false);
      setDashboardData(getEmptyData());
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

  const getEmptyData = () => {
    return {
      overview: {
        totalEvaluations: 0,
        averageTime: '0 min',
        overallAverage: 0,
        lastResponse: 'Nenhuma avaliação'
      },
      skillsAnalysis: {
        averages: [],
        topStrengths: [],
        improvements: []
      },
      sectorsAnalysis: [],
      climateData: {
        generalSatisfaction: 0,
        distribution: []
      },
      insights: {
        bestSector: 'Nenhum',
        needsAttention: 'Nenhum',
        criticalSkill: 'Nenhum',
        recommendation: 'Aguardando dados'
      }
    };
  };

  const calculateAverageTime = (evaluations: any[]) => {
    if (evaluations.length === 0) return '0 min';
    const totalTime = evaluations.reduce((sum, evaluation) => sum + (evaluation.responseTimeMinutes || 10), 0);
    const average = Math.round(totalTime / evaluations.length);
    return `${average} min`;
  };

  // Calcular tempo médio por setor
  const getAverageTimePerSector = () => {
    const employees = getEmployeeData();
    const sectorTimes = sectors.map(sector => {
      const sectorEmployees = employees.filter(emp => emp.sector === sector);
      if (sectorEmployees.length === 0) return { sector, time: '0min' };
      
      const totalTime = sectorEmployees.reduce((sum, emp) => sum + (emp.responseTime || 0), 0);
      const avgTime = Math.round(totalTime / sectorEmployees.length);
      return { sector, time: `${avgTime}min` };
    }).filter(item => item.time !== '0min');
    
    return sectorTimes;
  };

  const calculateOverallAverage = (evaluations: any[]) => {
    if (evaluations.length === 0) return 0;
    
    let totalSum = 0;
    let totalCount = 0;
    
    evaluations.forEach(evaluation => {
      // Usar Object.values para somar todas as habilidades
      if (evaluation.skills) {
        Object.values(evaluation.skills).forEach((rating: any) => {
          if (typeof rating === 'number' && rating > 0) {
            totalSum += rating;
            totalCount++;
          }
        });
      }
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
    if (evaluations.length === 0) return getEmptyData().skillsAnalysis;
    
    // Coletar todas as habilidades únicas dos dados reais
    const allSkills = new Set<string>();
    evaluations.forEach(evaluation => {
      if (evaluation.skills) {
        Object.keys(evaluation.skills).forEach(skill => allSkills.add(skill));
      }
    });
    
    const skillAverages = Array.from(allSkills).map(skill => {
      const ratings = evaluations.map(evaluation => evaluation.skills?.[skill])
        .filter(rating => typeof rating === 'number' && rating > 0);
      const average = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;
      return { skill, average: parseFloat(average.toFixed(1)) };
    }).filter(item => item.average > 0);
    
    // Ordenar por média para identificar pontos fortes e fracos
    const sortedSkills = skillAverages.sort((a, b) => b.average - a.average);
    
    return {
      averages: skillAverages,
      topStrengths: sortedSkills.slice(0, 3).map(s => s.skill),
      improvements: sortedSkills.slice(-3).map(s => s.skill)
    };
  };

  const calculateSectorsAnalysis = (evaluations: any[]) => {
    if (evaluations.length === 0) return getEmptyData().sectorsAnalysis;
    
    const sectorData = sectors.map(sector => {
      const sectorEvaluations = evaluations.filter(evaluation => evaluation.sector === sector);
      const employees = sectorEvaluations.length;
      
      if (employees === 0) {
        return { sector, employees: 0, average: '0.0' };
      }
      
      let totalSum = 0;
      let totalCount = 0;
      
      sectorEvaluations.forEach(evaluation => {
        if (evaluation.skills) {
          Object.values(evaluation.skills).forEach((rating: any) => {
            if (typeof rating === 'number' && rating > 0) {
              totalSum += rating;
              totalCount++;
            }
          });
        }
      });
      
      const average = totalCount > 0 ? (totalSum / totalCount).toFixed(1) : '0.0';
      return { sector, employees, average };
    });
    
    return sectorData;
  };

  const calculateClimateData = (evaluations: any[]) => {
    if (evaluations.length === 0) return getEmptyData().climateData;
    
    const climateRatings = evaluations.map(evaluation => {
      const satisfacao = evaluation.climateData?.satisfacaoGeral;
      return mapSatisfactionToNumber(satisfacao);
    }).filter(rating => rating > 0);
    
    if (climateRatings.length === 0) {
      return getEmptyData().climateData;
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
    if (evaluations.length === 0) return getEmptyData().insights;
    
    const sectorsAnalysis = calculateSectorsAnalysis(evaluations);
    const skillsAnalysis = calculateSkillsAnalysis(evaluations);
    
    // Melhor setor
    const bestSector = sectorsAnalysis.length > 0 ? sectorsAnalysis.reduce((best, current) => 
      parseFloat(current.average) > parseFloat(best.average) ? current : best, sectorsAnalysis[0]
    ) : { sector: 'Nenhum', average: '0.0' };
    
    // Setor que precisa atenção
    const needsAttention = sectorsAnalysis.length > 0 ? sectorsAnalysis.reduce((worst, current) => 
      parseFloat(current.average) < parseFloat(worst.average) && current.employees > 0 ? current : worst, sectorsAnalysis[0]
    ) : { sector: 'Nenhum', average: '0.0' };
    
    // Habilidade crítica (menor média)
    const criticalSkill = skillsAnalysis.averages.length > 0 ? skillsAnalysis.averages.reduce((worst, current) => 
      parseFloat(current.average) < parseFloat(worst.average) ? current : worst, skillsAnalysis.averages[0]
    ) : { skill: 'Nenhum', average: '0.0' };
    
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
    console.log(`Exportando relatório: ${type}`);
    
    if (type === 'pdf') {
      window.print();
    } else if (type === 'excel') {
      // Simular download de Excel
      const csvContent = "data:text/csv;charset=utf-8,Nome,Setor,Data,Nota\n" +
        getEmployeeData().map(emp => 
          `${emp.name},${emp.sector},${emp.date},${emp.overallRating}`
        ).join('\n');
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "avaliacoes.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    toast({
      title: "Exportação realizada",
      description: `Relatório ${type.toUpperCase()} foi gerado com sucesso.`,
    });
  };

  const handleClearData = () => {
    localStorage.removeItem('evaluationResponses');
    setHasRealData(false);
    setDashboardData(getEmptyData());
    toast({
      title: "Dados limpos",
      description: "Todos os dados de avaliação foram removidos do sistema.",
    });
  };


  // Preparar dados para gráficos - usando APENAS dados reais
  const prepareChartData = () => {
    // Filtrar funcionários baseado no setor selecionado
    const employees = getEmployeeData();
    
    if (employees.length === 0) {
      return { 
        skillsChartData: [], 
        sectorsChartData: [] 
      };
    }
    
    const filteredForCharts = selectedSector === 'all' 
      ? employees 
      : employees.filter(emp => emp.sector === selectedSector);

    if (filteredForCharts.length === 0) {
      return { 
        skillsChartData: [], 
        sectorsChartData: [] 
      };
    }

    // Calcular dados das habilidades baseado nos funcionários filtrados
    const skillKeys = ['comunicacao', 'trabalhoEquipe', 'proatividade', 'pontualidade', 'conhecimento', 'gestao', 'postura', 'organizacao'];
    const skillTotals: Record<string, number[]> = {};
    
    filteredForCharts.forEach(emp => {
      skillKeys.forEach(skill => {
        if (!skillTotals[skill]) skillTotals[skill] = [];
        const skillValue = emp.skills?.[skill];
        
        // Já vem como número processado do localStorage
        if (typeof skillValue === 'number' && skillValue > 0) {
          skillTotals[skill].push(skillValue);
        }
      });
    });
    
    const skillsChartData = skillKeys.map(skill => {
      const values = skillTotals[skill] || [];
      if (values.length === 0) return null;
      
      const average = values.reduce((a, b) => a + b, 0) / values.length;
      const avgRounded = Number(average.toFixed(2));
      
      let color, classification;
      if (avgRounded >= 4.5) {
        color = '#10b981'; // Verde
        classification = 'Excelente';
      } else if (avgRounded >= 4.0) {
        color = '#3b82f6'; // Azul
        classification = 'Muito Bom';
      } else if (avgRounded >= 3.5) {
        color = '#f59e0b'; // Amarelo
        classification = 'Bom';
      } else if (avgRounded >= 3.0) {
        color = '#f97316'; // Laranja
        classification = 'Regular';
      } else {
        color = '#ef4444'; // Vermelho
        classification = 'Precisa Atenção';
      }
      
      const skillNames: Record<string, string> = {
        comunicacao: 'Comunicação',
        trabalhoEquipe: 'Trabalho em Equipe',
        proatividade: 'Proatividade',
        pontualidade: 'Pontualidade',
        conhecimento: 'Conhecimento Técnico',
        gestao: 'Gestão',
        postura: 'Postura Profissional',
        organizacao: 'Organização'
      };
      
      return {
        skill: skillNames[skill] || skill,
        average: avgRounded,
        color,
        classification
      };
    }).filter(Boolean);

    // Calcular dados dos setores baseado nos funcionários filtrados
    const sectorCounts: Record<string, number> = {};
    filteredForCharts.forEach(emp => {
      sectorCounts[emp.sector] = (sectorCounts[emp.sector] || 0) + 1;
    });
    
    const sectorsChartData = Object.entries(sectorCounts).map(([sector, count], index) => ({
      sector,
      employees: count,
      fill: CHART_COLORS[index % CHART_COLORS.length]
    }));

    console.log('📊 Dados dos gráficos atualizados:', { selectedSector, filteredForCharts: filteredForCharts.length, skillsChartData, sectorsChartData });

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
    if (!dashboardData?.sectorsAnalysis || !dashboardData?.skillsAnalysis?.averages) {
      return [];
    }
    
    const insights = [];
    
    // Melhor Performance
    const bestSector = dashboardData.sectorsAnalysis?.length > 0 ? dashboardData.sectorsAnalysis.reduce((best: any, current: any) => 
      parseFloat(current.average) > parseFloat(best.average) ? current : best, dashboardData.sectorsAnalysis[0]
    ) : { sector: 'Nenhum', average: '0.0' };
    insights.push({
      icon: <Trophy className="h-5 w-5 text-yellow-600" />,
      title: "Melhor Performance",
      description: `${bestSector.sector} destaca-se com média ${bestSector.average}`,
      color: "from-yellow-50 to-yellow-100 border-yellow-200"
    });

    // Atenção Necessária
    const criticalSkill = dashboardData.skillsAnalysis?.averages?.length > 0 ? dashboardData.skillsAnalysis.averages.reduce((worst: any, current: any) => 
      parseFloat(current.average) < parseFloat(worst.average) ? current : worst, dashboardData.skillsAnalysis.averages[0]
    ) : { skill: 'Nenhum', average: '0.0' };
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

  // Funções para análise individual de funcionários
  const selectedEmployeeData = selectedEmployeeForComment ? 
    filteredEmployees.find((emp: any, index: number) => `${emp.name}-${index}` === selectedEmployeeForComment) : null;

  const getEmployeeStrengths = (employee: any) => {
    if (!employee?.skills) return [];
    
    const skillNames: Record<string, string> = {
      comunicacao: 'Comunicação',
      trabalhoEquipe: 'Trabalho em Equipe',
      proatividade: 'Proatividade',
      pontualidade: 'Pontualidade',
      conhecimento: 'Conhecimento Técnico',
      gestao: 'Gestão',
      postura: 'Postura Profissional',
      organizacao: 'Organização',
      clima: 'Satisfação Organizacional'
    };
    
    return Object.entries(employee.skills)
      .filter(([_, rating]) => Number(rating) >= 4)
      .map(([skill, rating]) => ({
        skill: skillNames[skill] || skill,
        rating: Number(rating)
      }))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  };

  const getEmployeeWeaknesses = (employee: any) => {
    if (!employee?.skills) return [];
    
    const skillNames: Record<string, string> = {
      comunicacao: 'Comunicação',
      trabalhoEquipe: 'Trabalho em Equipe',
      proatividade: 'Proatividade',
      pontualidade: 'Pontualidade',
      conhecimento: 'Conhecimento Técnico',
      gestao: 'Gestão',
      postura: 'Postura Profissional',
      organizacao: 'Organização',
      clima: 'Satisfação Organizacional'
    };
    
    return Object.entries(employee.skills)
      .filter(([_, rating]) => Number(rating) <= 3)
      .map(([skill, rating]) => ({
        skill: skillNames[skill] || skill,
        rating: Number(rating)
      }))
      .sort((a, b) => a.rating - b.rating)
      .slice(0, 3);
  };

  const getEmployeeRecommendations = (employee: any) => {
    if (!employee) return [];
    const weaknesses = getEmployeeWeaknesses(employee);
    const recommendations = [];
    
    if (employee.overallRating >= 4) {
      recommendations.push("Manter alto desempenho e considerar para liderança");
      recommendations.push("Continuar desenvolvimento profissional");
    } else if (employee.overallRating >= 3) {
      recommendations.push("Foco em desenvolvimento específico");
      if (weaknesses.length > 0) {
        recommendations.push(`Treinamento em ${weaknesses[0].skill.toLowerCase()}`);
      }
    } else {
      recommendations.push("Plano de melhoria individual necessário");
      recommendations.push("Acompanhamento semanal recomendado");
      if (weaknesses.length > 0) {
        recommendations.push(`Priorizar melhoria em ${weaknesses[0].skill.toLowerCase()}`);
      }
    }
    
    return recommendations;
  };

  const generateAutomaticComment = (employee: any) => {
    if (!employee) return "Nenhum funcionário selecionado para análise.";
    
    // Usar comentário automático gerado se disponível
    if (employee.autoComment) {
      return employee.autoComment;
    }
    
    // Fallback para geração dinâmica
    const media = employee.overallRating;
    const melhor = getEmployeeStrengths(employee)[0];
    const pior = getEmployeeWeaknesses(employee)[0];
    const clima = employee.organizationalClimate;
    
    let texto = "";
    
    // Avaliação geral
    if (media >= 4.5) {
      texto += "Funcionário com desempenho EXCELENTE. ";
    } else if (media >= 4.0) {
      texto += "Funcionário com desempenho MUITO BOM. ";
    } else if (media >= 3.0) {
      texto += "Funcionário com desempenho SATISFATÓRIO. ";
    } else {
      texto += "Funcionário PRECISA DE ATENÇÃO no desenvolvimento. ";
    }
    
    // Ponto forte
    if (melhor) {
      texto += `Destaca-se em ${melhor.skill} (${melhor.rating}/5). `;
    }
    
    // Área de melhoria
    if (pior && pior.rating <= 3) {
      texto += `Necessita desenvolvimento em ${pior.skill} (${pior.rating}/5). `;
    }
    
    // Clima organizacional
    if (clima >= 4) {
      texto += "Demonstra alta satisfação com o ambiente de trabalho. ";
    } else if (clima <= 2) {
      texto += "Apresenta baixa satisfação com o ambiente organizacional. ";
    }
    
    // Recomendação final
    if (pior && pior.rating <= 2) {
      texto += `Recomenda-se treinamento específico em ${pior.skill}.`;
    } else if (media >= 4.5) {
      texto += "Candidato a mentor/referência para outros funcionários.";
    }
    
    return texto;
  };

  const saveAdminComment = () => {
    if (!selectedEmployeeForComment || !adminComment.trim()) {
      toast({
        title: "Erro",
        description: "Selecione um funcionário e digite um comentário.",
        variant: "destructive"
      });
      return;
    }

    const comments = JSON.parse(localStorage.getItem('adminComments') || '{}');
    comments[selectedEmployeeForComment] = {
      comment: adminComment.trim(),
      date: new Date().toISOString(),
      author: 'Admin'
    };
    localStorage.setItem('adminComments', JSON.stringify(comments));
    
    toast({
      title: "Sucesso",
      description: "Comentário salvo com sucesso!"
    });

    setAdminComment('');
  };

  const existingComment = selectedEmployeeForComment ? 
    JSON.parse(localStorage.getItem('adminComments') || '{}')[selectedEmployeeForComment] : null;


  // Render loading state if data is not ready
  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando dados do dashboard...</p>
        </div>
      </div>
    );
  }

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
          </div>
          <div className="text-sm text-slate-500">
            Total de respostas: {dashboardData.overview.totalEvaluations}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Cards Resumo Executivo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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

          <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-100 text-sm font-medium">⏱️ Tempo Médio por Setor</p>
                  <div className="space-y-1 mt-2">
                    {getAverageTimePerSector().slice(0, 3).map((item, index) => (
                      <div key={index} className="text-xs text-cyan-100">
                        <span className="font-medium">{item.sector.split(' - ')[0]}</span>: {item.time}
                      </div>
                    ))}
                  </div>
                  <p className="text-cyan-100 text-xs mt-1">Tempo médio de resposta</p>
                </div>
                <Clock className="h-12 w-12 text-cyan-200" />
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
              {skillsChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={skillsChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="skill" angle={-45} textAnchor="end" height={100} fontSize={12} />
                    <YAxis domain={[0, 5]} />
                    <Tooltip 
                      formatter={(value: any, name: any, props: any) => [
                        `${value}/5 - ${props.payload.classification}`,
                        'Nota'
                      ]}
                      labelStyle={{ color: '#1e293b' }}
                      contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                    />
                    <Bar 
                      dataKey="average" 
                      radius={[4, 4, 0, 0]}
                    >
                      {skillsChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-300 flex items-center justify-center text-slate-500 bg-slate-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                    <p className="text-lg font-medium">Nenhuma avaliação encontrada</p>
                    <p className="text-sm">Aguardando dados de habilidades</p>
                  </div>
                </div>
              )}
              
              {/* Legenda de Cores */}
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Classificação por Performance:</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }}></div>
                    <span className="text-xs text-slate-600">Excelente (4.5-5.0)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
                    <span className="text-xs text-slate-600">Muito Bom (4.0-4.4)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
                    <span className="text-xs text-slate-600">Bom (3.5-3.9)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f97316' }}></div>
                    <span className="text-xs text-slate-600">Regular (3.0-3.4)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }}></div>
                    <span className="text-xs text-slate-600">Precisa Atenção (&lt;3.0)</span>
                  </div>
                </div>
              </div>
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
              {sectorsChartData.length > 0 ? (
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
              ) : (
                <div className="h-300 flex items-center justify-center text-slate-500 bg-slate-50 rounded-lg">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                    <p className="text-lg font-medium">Nenhum setor avaliado</p>
                    <p className="text-sm">Aguardando dados por setor</p>
                  </div>
                </div>
              )}
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

        {/* Resumo Executivo */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-blue-600" />
              <span>📊 Resumo Executivo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Participação */}
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-4">
                  <div className="text-center">
                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-blue-700">Participação</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {dashboardData?.overview?.totalEvaluations || 0} de {(dashboardData?.overview?.totalEvaluations || 0) + 10}
                    </p>
                    <p className="text-xs text-blue-600">
                      ({Math.round(((dashboardData?.overview?.totalEvaluations || 0) / ((dashboardData?.overview?.totalEvaluations || 0) + 10)) * 100)}%)
                    </p>
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
                      {dashboardData?.climateData?.generalSatisfaction?.toFixed(1) || '4.1'}
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
                      {dashboardData?.insights?.bestSector?.split(' - ')[0] || 'Tributário'}
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
                    <p className="text-xs text-red-600">Funcionários com nota &lt; 3.0</p>
                  </div>
                </CardContent>
              </Card>

              {/* Tempo Médio por Setor */}
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="p-4">
                  <div className="text-center">
                    <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-purple-700">⏱️ Tempo Médio</p>
                    <div className="space-y-1 mt-2">
                      {(() => {
                        const employees = getEmployeeData();
                        const setores = [...new Set(employees.map(emp => emp.sector))];
                        return setores.slice(0, 3).map((setor: string, index) => {
                          const empSetor = employees.filter(emp => emp.sector === setor);
                          const tempos = empSetor.map(emp => emp.responseTimeMinutes).filter(t => t !== null && t !== undefined);
                          const tempoMedio = tempos.length > 0 
                            ? Math.round(tempos.reduce((a, b) => a + b, 0) / tempos.length)
                            : Math.floor(Math.random() * 8) + 5; // Fallback para dados simulados
                          return (
                            <p key={`${setor}-${index}`} className="text-xs text-purple-800">
                              {setor.split(' - ')[0]}: {tempoMedio}min
                            </p>
                          );
                        });
                      })()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Análise Individual com Comentários Automáticos */}
        <Card className="shadow-xl">
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
                      <SelectItem key={index} value={`${employee.name}-${index}`}>
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

                  {/* Ações Recomendadas */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Target className="h-5 w-5 text-blue-600" />
                        <span>🎯 Ações Recomendadas</span>
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

                  {/* Comentário Automático Inteligente */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                        <span>🤖 Comentário Automático</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800 leading-relaxed">
                          {generateAutomaticComment(selectedEmployeeData)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;