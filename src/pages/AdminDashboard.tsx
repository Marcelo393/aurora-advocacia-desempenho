
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import all the new components
import AdminLogin from '@/components/admin/AdminLogin';
import DashboardHeader from '@/components/admin/DashboardHeader';
import StatsCards from '@/components/admin/StatsCards';
import ChartsSection from '@/components/admin/ChartsSection';
import PerformanceChart from '@/components/admin/PerformanceChart';
import SectorAnalysis from '@/components/admin/SectorAnalysis';
import ComparisonTable from '@/components/admin/ComparisonTable';
import InsightsCards from '@/components/admin/InsightsCards';
import ExportSection from '@/components/admin/ExportSection';

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
      <AdminLogin 
        password={password}
        setPassword={setPassword}
        onLogin={handleLogin}
      />
    );
  }

  const stats = calculateGeneralStats();
  const sectorData = getSectorData();
  const topSkills = getTopSkills();
  const activeSectorsCount = sectorData.filter(s => s.value > 0).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <DashboardHeader onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <StatsCards stats={stats} activeSectorsCount={activeSectorsCount} />

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">📊 Visão Geral</TabsTrigger>
            <TabsTrigger value="performance">🎯 Performance</TabsTrigger>
            <TabsTrigger value="sectors">🏢 Por Setor</TabsTrigger>
            <TabsTrigger value="comparison">📈 Comparativo</TabsTrigger>
            <TabsTrigger value="insights">💡 Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <ChartsSection 
              sectorData={sectorData}
              topSkills={topSkills}
              colors={colors}
            />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <PerformanceChart topSkills={topSkills} />
          </TabsContent>

          <TabsContent value="sectors" className="space-y-6">
            <SectorAnalysis 
              sectors={sectors}
              selectedSector={selectedSector}
              setSelectedSector={setSelectedSector}
              evaluationData={evaluationData}
            />
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <ComparisonTable 
              sectors={sectors}
              evaluationData={evaluationData}
            />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <InsightsCards />
          </TabsContent>
        </Tabs>

        <ExportSection />
      </div>
    </div>
  );
};

export default AdminDashboard;
