import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DollarSign, 
  Calendar, 
  Search, 
  Filter,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  Edit
} from "lucide-react";

const Cobrancas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriodo, setFilterPeriodo] = useState("hoje");
  const [filterStatus, setFilterStatus] = useState("todos");

  const cobrancas = [
    {
      id: 1,
      cliente: "João Silva",
      cartao: "AUTO-001",
      valor: "R$ 125,00",
      vencimento: "2024-01-15",
      diasAtraso: 0,
      telefone: "(11) 99999-1111",
      endereco: "Rua das Flores, 123",
      cobrador: "Paulo Mendes",
      status: "vencer_hoje",
      observacao: "Cliente prefere cobrança pela manhã"
    },
    {
      id: 2,
      cliente: "Maria Oliveira",
      cartao: "AUTO-002",
      valor: "R$ 89,00",
      vencimento: "2024-01-13",
      diasAtraso: 2,
      telefone: "(11) 99999-2222",
      endereco: "Av. Paulista, 456",
      cobrador: "Lúcia Ferreira",
      status: "vencido",
      observacao: "Tentativa anterior sem sucesso"
    },
    {
      id: 3,
      cliente: "Pedro Santos",
      cartao: "AUTO-003",
      valor: "R$ 210,00",
      vencimento: "2024-01-14",
      diasAtraso: 1,
      telefone: "(11) 99999-3333",
      endereco: "Rua da Consolação, 789",
      cobrador: "Paulo Mendes",
      status: "vencido",
      observacao: "Cliente solicitou negociação"
    },
    {
      id: 4,
      cliente: "Ana Costa",
      cartao: "AUTO-004",
      valor: "R$ 65,00",
      vencimento: "2024-01-15",
      diasAtraso: 0,
      telefone: "(11) 99999-4444",
      endereco: "Rua Augusta, 321",
      cobrador: "Lúcia Ferreira",
      status: "contactado",
      observacao: "Cliente confirmou pagamento"
    },
    {
      id: 5,
      cliente: "Carlos Lima",
      cartao: "AUTO-005",
      valor: "R$ 180,00",
      vencimento: "2024-01-16",
      diasAtraso: -1,
      telefone: "(11) 99999-5555",
      endereco: "Av. Faria Lima, 654",
      cobrador: "Paulo Mendes",
      status: "vencer_amanha",
      observacao: ""
    }
  ];

  const getStatusBadge = (status: string, diasAtraso: number) => {
    switch (status) {
      case "vencer_hoje":
        return <Badge className="bg-warning text-warning-foreground">Vence Hoje</Badge>;
      case "vencer_amanha":
        return <Badge className="bg-info text-info-foreground">Vence Amanhã</Badge>;
      case "vencido":
        return <Badge className="bg-destructive text-destructive-foreground">
          {diasAtraso} {diasAtraso === 1 ? 'dia' : 'dias'} em atraso
        </Badge>;
      case "contactado":
        return <Badge className="bg-success text-success-foreground">Contactado</Badge>;
      case "pago":
        return <Badge variant="secondary">Pago</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "vencer_hoje":
        return <Clock className="w-4 h-4 text-warning" />;
      case "vencer_amanha":
        return <Calendar className="w-4 h-4 text-info" />;
      case "vencido":
        return <XCircle className="w-4 h-4 text-destructive" />;
      case "contactado":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "pago":
        return <CheckCircle className="w-4 h-4 text-success" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "vencer_hoje":
        return "border-l-warning";
      case "vencer_amanha":
        return "border-l-info";
      case "vencido":
        return "border-l-destructive";
      case "contactado":
        return "border-l-success";
      case "pago":
        return "border-l-success";
      default:
        return "border-l-muted";
    }
  };

  const filteredCobrancas = cobrancas.filter(cobranca => {
    const matchesSearch = cobranca.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cobranca.cartao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cobranca.telefone.includes(searchTerm);
    
    const matchesStatus = filterStatus === "todos" || cobranca.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    todos: cobrancas.length,
    vencer_hoje: cobrancas.filter(c => c.status === "vencer_hoje").length,
    vencido: cobrancas.filter(c => c.status === "vencido").length,
    contactado: cobrancas.filter(c => c.status === "contactado").length,
  };

  const totalCobrancas = cobrancas.reduce((acc, curr) => {
    return acc + parseFloat(curr.valor.replace('R$ ', '').replace(',', '.'));
  }, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cobranças</h1>
          <p className="text-muted-foreground mt-1">
            Gestão de cobranças e vencimentos
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total a Cobrar</p>
          <p className="text-2xl font-bold text-foreground">
            R$ {totalCobrancas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" 
              onClick={() => setFilterStatus("todos")}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{statusCounts.todos}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setFilterStatus("vencer_hoje")}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-8 h-8 text-warning" />
              <div>
                <p className="text-2xl font-bold text-warning">{statusCounts.vencer_hoje}</p>
                <p className="text-sm text-muted-foreground">Vence Hoje</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setFilterStatus("vencido")}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="w-8 h-8 text-destructive" />
              <div>
                <p className="text-2xl font-bold text-destructive">{statusCounts.vencido}</p>
                <p className="text-sm text-muted-foreground">Vencidos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setFilterStatus("contactado")}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-8 h-8 text-success" />
              <div>
                <p className="text-2xl font-bold text-success">{statusCounts.contactado}</p>
                <p className="text-sm text-muted-foreground">Contactados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por cliente, cartão ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterPeriodo} onValueChange={setFilterPeriodo}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hoje">Hoje</SelectItem>
                  <SelectItem value="semana">Esta Semana</SelectItem>
                  <SelectItem value="mes">Este Mês</SelectItem>
                  <SelectItem value="vencidos">Vencidos</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cobrancas List */}
      <div className="space-y-4">
        {filteredCobrancas.map((cobranca) => (
          <Card key={cobranca.id} className={`hover:shadow-md transition-shadow border-l-4 ${getStatusColor(cobranca.status)}`}>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Client Info */}
                <div className="lg:col-span-2">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(cobranca.status)}
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{cobranca.cliente}</h3>
                        <p className="text-sm text-muted-foreground">Cartão: {cobranca.cartao}</p>
                      </div>
                    </div>
                    {getStatusBadge(cobranca.status, cobranca.diasAtraso)}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{cobranca.telefone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{cobranca.endereco}</span>
                    </div>
                    <div className="text-muted-foreground">
                      <strong>Cobrador:</strong> {cobranca.cobrador}
                    </div>
                    {cobranca.observacao && (
                      <div className="text-muted-foreground italic">
                        <strong>Obs:</strong> {cobranca.observacao}
                      </div>
                    )}
                  </div>
                </div>

                {/* Financial Info */}
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Valor da Parcela</p>
                    <p className="text-xl font-bold text-foreground">{cobranca.valor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Vencimento</p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(cobranca.vencimento).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  {cobranca.status === "vencido" && (
                    <div>
                      <p className="text-sm text-destructive font-medium">
                        {cobranca.diasAtraso} {cobranca.diasAtraso === 1 ? 'dia' : 'dias'} de atraso
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button size="sm" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Ligar
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalhes
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="w-4 h-4 mr-2" />
                    Registrar Contato
                  </Button>
                  <Button variant="outline" size="sm" className="w-full text-success hover:text-success">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Marcar como Pago
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCobrancas.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-2">Nenhuma cobrança encontrada</p>
            <p className="text-sm text-muted-foreground">
              Tente ajustar os filtros de busca
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Cobrancas;