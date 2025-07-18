import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  CreditCard,
  FileText,
  Filter,
  Eye
} from "lucide-react";

const Relatorios = () => {
  const relatoriosDisponiveis = [
    {
      titulo: "Relatório de Vendas",
      descricao: "Vendas por período, vendedor e produto",
      icone: TrendingUp,
      cor: "text-success"
    },
    {
      titulo: "Relatório de Cobranças",
      descricao: "Status de pagamentos e inadimplência",
      icone: DollarSign,
      cor: "text-primary"
    },
    {
      titulo: "Relatório de Clientes",
      descricao: "Lista completa de clientes e status",
      icone: Users,
      cor: "text-info"
    },
    {
      titulo: "Relatório de Cartões",
      descricao: "Cartões ativos, inativos e pendentes",
      icone: CreditCard,
      cor: "text-warning"
    },
    {
      titulo: "Relatório Financeiro",
      descricao: "Análise financeira completa",
      icone: BarChart3,
      cor: "text-purple-600"
    },
    {
      titulo: "Relatório de Inadimplência",
      descricao: "Clientes em atraso e valores",
      icone: TrendingDown,
      cor: "text-destructive"
    }
  ];

  const dadosResumo = {
    vendasMes: "R$ 125.430,00",
    crescimento: "+12,5%",
    clientesAtivos: 892,
    inadimplencia: "3,2%",
    ticketMedio: "R$ 145,60",
    conversao: "68,4%"
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground mt-1">
            Análises e relatórios do sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Exportar Tudo
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-lg font-bold text-success">{dadosResumo.vendasMes}</p>
              <p className="text-xs text-muted-foreground">Vendas do Mês</p>
              <p className="text-xs text-success">{dadosResumo.crescimento}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-lg font-bold text-primary">{dadosResumo.clientesAtivos}</p>
              <p className="text-xs text-muted-foreground">Clientes Ativos</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-lg font-bold text-warning">{dadosResumo.ticketMedio}</p>
              <p className="text-xs text-muted-foreground">Ticket Médio</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-lg font-bold text-info">{dadosResumo.conversao}</p>
              <p className="text-xs text-muted-foreground">Taxa Conversão</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-lg font-bold text-destructive">{dadosResumo.inadimplencia}</p>
              <p className="text-xs text-muted-foreground">Inadimplência</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Calendar className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Último Update</p>
              <p className="text-xs font-medium">Hoje, 14:30</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Período</label>
              <Select defaultValue="mes-atual">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hoje">Hoje</SelectItem>
                  <SelectItem value="semana">Esta Semana</SelectItem>
                  <SelectItem value="mes-atual">Mês Atual</SelectItem>
                  <SelectItem value="mes-anterior">Mês Anterior</SelectItem>
                  <SelectItem value="trimestre">Trimestre</SelectItem>
                  <SelectItem value="ano">Ano</SelectItem>
                  <SelectItem value="personalizado">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Vendedor</label>
              <Select defaultValue="todos">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="maria">Maria Santos</SelectItem>
                  <SelectItem value="pedro">Pedro Costa</SelectItem>
                  <SelectItem value="ana">Ana Silva</SelectItem>
                  <SelectItem value="joao">João Lima</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
              <Select defaultValue="todos">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="ativo">Ativos</SelectItem>
                  <SelectItem value="pendente">Pendentes</SelectItem>
                  <SelectItem value="vencido">Vencidos</SelectItem>
                  <SelectItem value="quitado">Quitados</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Formato</label>
              <Select defaultValue="pdf">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatoriosDisponiveis.map((relatorio, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-accent`}>
                  <relatorio.icone className={`w-6 h-6 ${relatorio.cor}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{relatorio.titulo}</h3>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {relatorio.descricao}
              </p>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  Visualizar
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Relatórios Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                nome: "Relatório de Vendas - Janeiro 2024",
                data: "15/01/2024 14:30",
                tipo: "PDF",
                tamanho: "2.3 MB"
              },
              {
                nome: "Inadimplência - Semana 02",
                data: "14/01/2024 10:15",
                tipo: "Excel",
                tamanho: "1.8 MB"
              },
              {
                nome: "Clientes Ativos - Mensal", 
                data: "13/01/2024 16:45",
                tipo: "PDF",
                tamanho: "3.1 MB"
              },
              {
                nome: "Análise Financeira - Q4",
                data: "12/01/2024 09:20",
                tipo: "PDF",
                tamanho: "4.7 MB"
              }
            ].map((relatorio, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{relatorio.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      {relatorio.data} • {relatorio.tipo} • {relatorio.tamanho}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Relatorios;