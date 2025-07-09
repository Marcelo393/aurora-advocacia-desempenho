
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, Scale, Users, Target, Award } from 'lucide-react';

interface PresentationPageProps {
  onNext: () => void;
}

const PresentationPage: React.FC<PresentationPageProps> = ({ onNext }) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-slate-900 to-slate-700 p-4 rounded-full">
            <Scale className="h-12 w-12 text-yellow-400" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-slate-900">Avaliação de Desempenho</h1>
        <h2 className="text-2xl font-semibold text-yellow-600">Autoavaliação</h2>
      </div>

      {/* Content Cards */}
      <div className="grid gap-6">
        {/* Welcome Card */}
        <Card className="border-l-4 border-l-yellow-400 shadow-lg">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center space-x-2">
              <Users className="h-5 w-5 text-yellow-600" />
              <span>Bem-vindos!</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 leading-relaxed">
              Olá pessoal! Estamos chegando ao final do segundo semestre de 2024. Portanto, será aplicada a Avaliação de Desempenho com todos os estagiários do escritório! Para quem irá participar pela primeira vez, abaixo temos uma explicação detalhada, desde a importância até as etapas que serão realizadas.
            </p>
          </CardContent>
        </Card>

        {/* Process Card */}
        <Card className="border-l-4 border-l-slate-900 shadow-lg">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center space-x-2">
              <Target className="h-5 w-5 text-slate-600" />
              <span>Como funcionará a Avaliação?</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-700 leading-relaxed">
              De 03/07 até 09/07 o formulário para a coleta de autoavaliação + coleta de clima (etapa 1) estará aberto. Posteriormente a essa data, será marcado um horário de reunião individual de feedbacks e parecer (etapa 2).
            </p>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-slate-900 mb-2">Como devo responder?</h4>
              <p className="text-slate-700 text-sm leading-relaxed">
                O mais importante ao responder é compreender que ela servirá como um norte para você aqui dentro e será utilizada para a avaliação semestral, então sinta-se a vontade para expressar verdadeiramente o que cada pergunta representa, não existindo uma resposta ideal ou perfeita, mas sim aquela que conta sobre você e seu processo de crescimento e aprendizado. O formulário é intuitivo e qualquer dúvida ao responder basta entrar em contato com a Gestora!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Definition Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center space-x-2">
                <Award className="h-5 w-5 text-yellow-600" />
                <span>O que é uma avaliação de desempenho?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 text-sm leading-relaxed">
                Trata-se de uma ferramenta fundamental para a valorização do capital humano, utilizada para coletar dados e mensurar a performance de colaboradores ou equipes dentro de uma organização em determinado período. Nesse sentido, ela fornece dados essenciais para uma gestão de pessoas mais estratégica, além de promover o desenvolvimento pessoal e profissional individual dos colaboradores, impactando o coletivo.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center space-x-2">
                <Users className="h-5 w-5 text-yellow-600" />
                <span>O que é uma autoavaliação?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 text-sm leading-relaxed">
                É uma ferramenta que permite aos respondentes um momento de reflexão e análise acerca da sua própria performance no trabalho, saindo de uma visão automático do dia a dia e possibilitando um maior entendimento sobre suas ações, desafios, conquistas e pontos a melhorar.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Self-Assessment Explanation */}
        <Card className="border-l-4 border-l-yellow-400 shadow-lg">
          <CardContent className="pt-6">
            <p className="text-slate-700 leading-relaxed mb-4">
              A etapa de autoavaliação, é o momento de olharmos para nós mesmos. É uma prática que permite tecer uma análise sobre si mesmo do ponto de vista profissional, apontando pontos positivos, melhorias a serem feitas e problemas a serem corrigidos.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Além de ser um processo de muito autoconhecimento, também possibilita que cada um seja analisado conforme a própria regra, conforme sua própria "curva de crescimento", atrelado claro, ao que é esperado do respectivo cargo.
            </p>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center space-y-4">
          <p className="text-xl font-semibold text-slate-900">Boa autoavaliação! 😊</p>
          <Button 
            onClick={onNext}
            size="lg"
            className="bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Iniciar Avaliação
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PresentationPage;
