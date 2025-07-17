import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  CreditCard, 
  DollarSign, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  FileText,
  Plus
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDatabase } from "@/hooks/useDatabase";
import { database } from "@/lib/database";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { isInitialized } = useDatabase();
  const [estatisticas, setEstatisticas] = useState({
    totalClientes: 0,
    clientesAtivos: 0,
    cartoesAtivos: 0,
    pagamentosVencidos: 0,
    valorEmAberto: 0
  });

  useEffect(() => {
    const carregarEstatisticas = async () => {
      if (!isInitialized) return;
      
      try {
        const stats = await database.getEstatisticas();
        setEstatisticas(stats);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      }
    };

    carregarEstatisticas();
  }, [isInitialized]);

  const stats = [
    {
      title: "Total de Clientes",
      value: estatisticas.totalClientes.toString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Cartões Ativos",
      value: estatisticas.cartoesAtivos.toString(),
      icon: CreditCard,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Valor em Aberto",
      value: `R$ ${estatisticas.valorEmAberto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Vencidos Hoje",
      value: estatisticas.pagamentosVencidos.toString(),
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50"
    }
  ];

  const recentClients = [
    { id: 1, name: "João Silva", card: "AUTO-001", value: "R$ 1.250,00", status: "em_dia" },
    { id: 2, name: "Maria Santos", card: "AUTO-002", value: "R$ 890,00", status: "vencido" },
    { id: 3, name: "Pedro Costa", card: "AUTO-003", value: "R$ 2.100,00", status: "em_dia" },
    { id: 4, name: "Ana Oliveira", card: "AUTO-004", value: "R$ 650,00", status: "vencer" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "em_dia":
        return <Badge className="bg-success text-success-foreground">Em Dia</Badge>;
      case "vencido":
        return <Badge className="bg-destructive text-destructive-foreground">Vencido</Badge>;
      case "vencer":
        return <Badge className="bg-warning text-warning-foreground">A Vencer</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Visão geral do sistema de crediário
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/cartoes">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Cartão
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Clients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Clientes Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentClients.map((client) => (
                <div
                  key={client.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-foreground">{client.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Cartão: {client.card}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{client.value}</p>
                    {getStatusBadge(client.status)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <Link to="/clientes">
                <Button variant="outline" className="w-full">
                  Ver Todos os Clientes
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <Link to="/cartoes">
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="w-4 h-4 mr-3" />
                  Cadastrar Novo Cartão
                </Button>
              </Link>
              <Link to="/clientes">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-3" />
                  Gerenciar Clientes
                </Button>
              </Link>
              <Link to="/cobrancas">
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="w-4 h-4 mr-3" />
                  Cobranças do Dia
                </Button>
              </Link>
              <Link to="/relatorios">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-3" />
                  Relatórios
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Resumo de Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-accent/30 rounded-lg">
              <p className="text-2xl font-bold text-success">R$ 12.450,00</p>
              <p className="text-sm text-muted-foreground">Recebido</p>
            </div>
            <div className="text-center p-4 bg-accent/30 rounded-lg">
              <p className="text-2xl font-bold text-warning">R$ 8.230,00</p>
              <p className="text-sm text-muted-foreground">A Receber</p>
            </div>
            <div className="text-center p-4 bg-accent/30 rounded-lg">
              <p className="text-2xl font-bold text-destructive">R$ 3.120,00</p>
              <p className="text-sm text-muted-foreground">Em Atraso</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;