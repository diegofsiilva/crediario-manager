import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Search, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Phone,
  MapPin,
  CreditCard
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDatabase, useClientes } from "@/hooks/useDatabase";
import { Cliente } from "@/lib/database";

const Clientes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const { isInitialized } = useDatabase();
  const { clientes, loading, carregarClientes } = useClientes();

  useEffect(() => {
    if (isInitialized) {
      carregarClientes();
    }
  }, [isInitialized]);

  const handleSearch = () => {
    const filtro: any = {};
    if (searchTerm) filtro.nome = searchTerm;
    if (filterStatus !== "todos") filtro.status = filterStatus;
    carregarClientes(filtro);
  };

  // Dados de exemplo para mostrar enquanto não há dados reais
  const clientesExemplo = [
    {
      id: 1,
      nome: "João Silva",
      cartao: "AUTO-001",
      telefone: "(11) 99999-1111",
      endereco: "Rua das Flores, 123",
      cidade: "São Paulo",
      valor: "R$ 1.250,00",
      parcelas: "5/12",
      status: "em_dia",
      vendedor: "Maria Santos"
    },
    {
      id: 2,
      nome: "Maria Oliveira",
      cartao: "AUTO-002", 
      telefone: "(11) 99999-2222",
      endereco: "Av. Paulista, 456",
      cidade: "São Paulo",
      valor: "R$ 890,00",
      parcelas: "8/10",
      status: "vencido",
      vendedor: "Pedro Costa"
    },
    {
      id: 3,
      nome: "Pedro Santos",
      cartao: "AUTO-003",
      telefone: "(11) 99999-3333", 
      endereco: "Rua da Consolação, 789",
      cidade: "São Paulo",
      valor: "R$ 2.100,00",
      parcelas: "3/15",
      status: "em_dia",
      vendedor: "Ana Silva"
    },
    {
      id: 4,
      nome: "Ana Costa",
      cartao: "AUTO-004",
      telefone: "(11) 99999-4444",
      endereco: "Rua Augusta, 321",
      cidade: "São Paulo", 
      valor: "R$ 650,00",
      parcelas: "12/12",
      status: "quitado",
      vendedor: "João Lima"
    },
    {
      id: 5,
      nome: "Carlos Lima",
      cartao: "AUTO-005",
      telefone: "(11) 99999-5555",
      endereco: "Av. Faria Lima, 654",
      cidade: "São Paulo",
      valor: "R$ 1.800,00", 
      parcelas: "2/8",
      status: "vencer",
      vendedor: "Maria Santos"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "em_dia":
        return <Badge className="bg-success text-success-foreground">Em Dia</Badge>;
      case "vencido":
        return <Badge className="bg-destructive text-destructive-foreground">Vencido</Badge>;
      case "vencer":
        return <Badge className="bg-warning text-warning-foreground">A Vencer</Badge>;
      case "quitado":
        return <Badge className="bg-info text-info-foreground">Quitado</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "em_dia":
        return "border-l-success";
      case "vencido":
        return "border-l-destructive";
      case "vencer":
        return "border-l-warning";
      case "quitado":
        return "border-l-info";
      default:
        return "border-l-muted";
    }
  };

  // Use dados de exemplo se não houver dados reais ainda
  const dadosParaExibir = clientes.length > 0 ? clientes : clientesExemplo;

  const filteredClientes = dadosParaExibir.filter((cliente: any) => {
    const matchesSearch = cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (cliente.cartao || cliente.cpf || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (cliente.telefone || '').includes(searchTerm);
    
    const matchesFilter = filterStatus === "todos" || cliente.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const statusCounts = {
    todos: dadosParaExibir.length,
    em_dia: dadosParaExibir.filter((c: any) => c.status === "em_dia" || c.status === "ativo").length,
    vencido: dadosParaExibir.filter((c: any) => c.status === "vencido" || c.status === "bloqueado").length,
    vencer: dadosParaExibir.filter((c: any) => c.status === "vencer").length,
    quitado: dadosParaExibir.filter((c: any) => c.status === "quitado" || c.status === "inativo").length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Clientes</h1>
          <p className="text-muted-foreground mt-1">
            Visualize e gerencie todos os clientes do sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Link to="/cartoes">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Cliente
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" 
              onClick={() => setFilterStatus("todos")}>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{statusCounts.todos}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setFilterStatus("em_dia")}>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-success">{statusCounts.em_dia}</p>
              <p className="text-sm text-muted-foreground">Em Dia</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setFilterStatus("vencido")}>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-destructive">{statusCounts.vencido}</p>
              <p className="text-sm text-muted-foreground">Vencidos</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setFilterStatus("vencer")}>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-warning">{statusCounts.vencer}</p>
              <p className="text-sm text-muted-foreground">A Vencer</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setFilterStatus("quitado")}>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-info">{statusCounts.quitado}</p>
              <p className="text-sm text-muted-foreground">Quitados</p>
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
                  placeholder="Buscar por nome, cartão ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
              <Button variant="outline" size="sm" onClick={() => {setSearchTerm(""); setFilterStatus("todos");}}>
                Limpar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients List */}
      <div className="space-y-4">
        {filteredClientes.map((cliente) => (
          <Card key={cliente.id} className={`hover:shadow-md transition-shadow border-l-4 ${getStatusColor(cliente.status)}`}>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Client Info */}
                <div className="lg:col-span-2">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{cliente.nome}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <CreditCard className="w-4 h-4" />
                        <span>CPF: {(cliente as any).cpf || (cliente as any).cartao}</span>
                      </div>
                    </div>
                    {getStatusBadge(cliente.status)}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{cliente.telefone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{cliente.endereco}, {cliente.cidade}</span>
                    </div>
                    <div className="text-muted-foreground">
                      <strong>Status:</strong> {cliente.status}
                    </div>
                  </div>
                </div>

                {/* Financial Info */}
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Renda</p>
                    <p className="text-xl font-bold text-foreground">R$ {(cliente as any).renda?.toLocaleString('pt-BR') || (cliente as any).valor || '0,00'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data Cadastro</p>
                    <p className="text-sm font-medium text-foreground">{(cliente as any).data_cadastro || 'Não informado'}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Link to={`/cartoes?id=${cliente.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      Visualizar
                    </Button>
                  </Link>
                  <Link to={`/cartoes?edit=${cliente.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="w-full text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClientes.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-2">Nenhum cliente encontrado</p>
            <p className="text-sm text-muted-foreground mb-4">
              Tente ajustar os filtros de busca ou criar um novo cliente
            </p>
            <Link to="/cartoes">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Primeiro Cliente
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Clientes;