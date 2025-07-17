import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Save, 
  Search, 
  Plus,
  Trash2,
  Edit,
  User,
  MapPin,
  Phone,
  ShoppingCart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDatabase, useClientes, useCartoes, useCompras } from "@/hooks/useDatabase";
import { Cliente } from "@/lib/database";

const Cartoes = () => {
  const { toast } = useToast();
  const location = useLocation();
  const { isInitialized } = useDatabase();
  const { criarCliente, buscarClientePorId, atualizarCliente } = useClientes();
  const { criarCartao } = useCartoes();
  const { criarCompra } = useCompras();
  
  // Capturar parâmetros da URL para edição
  const searchParams = new URLSearchParams(location.search);
  const editId = searchParams.get('edit');
  const isEditing = !!editId;
  
  const [formData, setFormData] = useState({
    cartaoNum: "AUTO",
    nome: "",
    endereco: "",
    numero: "",
    bairro: "",
    cidade: "",
    vendedor: "",
    supervisor: "",
    cobrador: "",
    estoque: "",
    celular: "",
    telefone: "",
    gpsS: "",
    gpsW: "",
    cpf: "",
    rg: "",
    nascimento: "",
    tipoCliente: "CLIENTES EM GERAL - [1]",
    observacoes: ""
  });

  // Carregar dados do cliente para edição
  useEffect(() => {
    const carregarClienteParaEdicao = async () => {
      if (editId && isInitialized) {
        try {
          const cliente = await buscarClientePorId(Number(editId));
          if (cliente) {
            setFormData({
              cartaoNum: "AUTO",
              nome: cliente.nome,
              endereco: cliente.endereco.split(',')[0] || "",
              numero: cliente.endereco.split(',')[1]?.trim() || "",
              bairro: "",
              cidade: cliente.cidade,
              vendedor: "",
              supervisor: "",
              cobrador: "",
              estoque: "",
              celular: "",
              telefone: cliente.telefone,
              gpsS: "",
              gpsW: "",
              cpf: cliente.cpf,
              rg: cliente.rg,
              nascimento: cliente.data_nascimento,
              tipoCliente: "CLIENTES EM GERAL - [1]",
              observacoes: ""
            });
          }
        } catch (error) {
          console.error('Erro ao carregar cliente:', error);
        }
      }
    };

    carregarClienteParaEdicao();
  }, [editId, isInitialized, buscarClientePorId]);

  const [produtos, setProdutos] = useState([
    { codigo: "", descricao: "", qtde: "", devolucao: "", venda: "", valorTotal: "", tipo: "" }
  ]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProdutoChange = (index: number, field: string, value: string) => {
    const newProdutos = [...produtos];
    newProdutos[index] = { ...newProdutos[index], [field]: value };
    setProdutos(newProdutos);
  };

  const addProduto = () => {
    setProdutos([...produtos, { codigo: "", descricao: "", qtde: "", devolucao: "", venda: "", valorTotal: "", tipo: "" }]);
  };

  const removeProduto = (index: number) => {
    if (produtos.length > 1) {
      setProdutos(produtos.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    if (!isInitialized) {
      toast({
        title: "Erro",
        description: "Banco de dados não inicializado",
        variant: "destructive"
      });
      return;
    }

    // Validação básica
    if (!formData.nome || !formData.cpf) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e CPF são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      const clienteData: Omit<Cliente, 'id'> = {
        nome: formData.nome,
        cpf: formData.cpf,
        rg: formData.rg,
        endereco: `${formData.endereco}, ${formData.numero}`,
        cidade: formData.cidade,
        cep: "00000-000",
        telefone: formData.telefone,
        email: "",
        data_nascimento: formData.nascimento,
        estado_civil: "nao_informado",
        profissao: "nao_informado",
        renda: 0,
        data_cadastro: new Date().toISOString().split('T')[0],
        status: 'ativo'
      };

      if (isEditing) {
        // Atualizar cliente existente
        await atualizarCliente(Number(editId), clienteData);
        
        toast({
          title: "Sucesso!",
          description: "Cliente atualizado com sucesso!"
        });
      } else {
        // Criar novo cliente
        const clienteId = await criarCliente(clienteData);

        // Criar cartão apenas para novos clientes
        const cartaoData = {
          cliente_id: clienteId,
          numero_cartao: formData.cartaoNum === "AUTO" ? `CARD-${Date.now()}` : formData.cartaoNum,
          limite: 5000,
          data_emissao: new Date().toISOString().split('T')[0],
          data_vencimento: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'ativo' as const
        };

        const cartaoId = await criarCartao(cartaoData);

        // Criar compras dos produtos
        for (const produto of produtos) {
          if (produto.descricao && produto.venda) {
            const valorTotal = parseFloat(produto.valorTotal) || parseFloat(produto.venda);
            const numParcelas = 10;
            
            await criarCompra({
              cartao_id: cartaoId,
              descricao: produto.descricao,
              valor_total: valorTotal,
              num_parcelas: numParcelas,
              valor_parcela: valorTotal / numParcelas,
              data_compra: new Date().toISOString().split('T')[0],
              status: 'ativo'
            });
          }
        }

        toast({
          title: "Sucesso!",
          description: "Cliente e cartão criados com sucesso!"
        });

        // Limpar formulário apenas quando criar novo
        setFormData({
          cartaoNum: "AUTO",
          nome: "",
          endereco: "",
          numero: "",
          bairro: "",
          cidade: "",
          vendedor: "",
          supervisor: "",
          cobrador: "",
          estoque: "",
          celular: "",
          telefone: "",
          gpsS: "",
          gpsW: "",
          cpf: "",
          rg: "",
          nascimento: "",
          tipoCliente: "CLIENTES EM GERAL - [1]",
          observacoes: ""
        });

        setProdutos([
          { codigo: "", descricao: "", qtde: "", devolucao: "", venda: "", valorTotal: "", tipo: "" }
        ]);
      }

    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const handleSearch = () => {
    toast({
      title: "Busca realizada",
      description: "Funcionalidade de busca ativada.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isEditing ? 'Editar Cliente' : 'Cadastro de Cartões'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditing ? 'Atualize os dados do cliente' : 'Gestão completa de cartões de crediário'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSearch}>
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="xl:col-span-2 space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Dados do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cartaoNum">Cartão N°</Label>
                  <Input
                    id="cartaoNum"
                    value={formData.cartaoNum}
                    onChange={(e) => handleInputChange("cartaoNum", e.target.value)}
                    placeholder="AUTO"
                  />
                </div>
                <div>
                  <Label htmlFor="tipoCliente">Tipo Cliente</Label>
                  <Select value={formData.tipoCliente} onValueChange={(value) => handleInputChange("tipoCliente", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLIENTES EM GERAL - [1]">CLIENTES EM GERAL - [1]</SelectItem>
                      <SelectItem value="CLIENTE VIP - [2]">CLIENTE VIP - [2]</SelectItem>
                      <SelectItem value="CLIENTE ESPECIAL - [3]">CLIENTE ESPECIAL - [3]</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  placeholder="Nome completo do cliente"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange("cpf", e.target.value)}
                    placeholder="000.000.000-00"
                  />
                </div>
                <div>
                  <Label htmlFor="rg">RG</Label>
                  <Input
                    id="rg"
                    value={formData.rg}
                    onChange={(e) => handleInputChange("rg", e.target.value)}
                    placeholder="00.000.000-0"
                  />
                </div>
                <div>
                  <Label htmlFor="nascimento">Nascimento</Label>
                  <Input
                    id="nascimento"
                    type="date"
                    value={formData.nascimento}
                    onChange={(e) => handleInputChange("nascimento", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Endereço
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => handleInputChange("endereco", e.target.value)}
                    placeholder="Rua, avenida..."
                  />
                </div>
                <div>
                  <Label htmlFor="numero">Número</Label>
                  <Input
                    id="numero"
                    value={formData.numero}
                    onChange={(e) => handleInputChange("numero", e.target.value)}
                    placeholder="Nº"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input
                    id="bairro"
                    value={formData.bairro}
                    onChange={(e) => handleInputChange("bairro", e.target.value)}
                    placeholder="Bairro"
                  />
                </div>
                <div>
                  <Label htmlFor="cidade">Cidade</Label>
                  <Select value={formData.cidade} onValueChange={(value) => handleInputChange("cidade", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a cidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sao-paulo">São Paulo</SelectItem>
                      <SelectItem value="rio-janeiro">Rio de Janeiro</SelectItem>
                      <SelectItem value="belo-horizonte">Belo Horizonte</SelectItem>
                      <SelectItem value="brasilia">Brasília</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="celular">Celular</Label>
                  <Input
                    id="celular"
                    value={formData.celular}
                    onChange={(e) => handleInputChange("celular", e.target.value)}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => handleInputChange("telefone", e.target.value)}
                    placeholder="(00) 0000-0000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gpsS">GPS S</Label>
                  <Input
                    id="gpsS"
                    value={formData.gpsS}
                    onChange={(e) => handleInputChange("gpsS", e.target.value)}
                    placeholder="Coordenada GPS S"
                  />
                </div>
                <div>
                  <Label htmlFor="gpsW">GPS W</Label>
                  <Input
                    id="gpsW"
                    value={formData.gpsW}
                    onChange={(e) => handleInputChange("gpsW", e.target.value)}
                    placeholder="Coordenada GPS W"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Equipe
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="vendedor">Vendedor</Label>
                  <Select value={formData.vendedor} onValueChange={(value) => handleInputChange("vendedor", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o vendedor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="joao">João Silva</SelectItem>
                      <SelectItem value="maria">Maria Santos</SelectItem>
                      <SelectItem value="pedro">Pedro Costa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="supervisor">Supervisor</Label>
                  <Select value={formData.supervisor} onValueChange={(value) => handleInputChange("supervisor", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o supervisor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ana">Ana Oliveira</SelectItem>
                      <SelectItem value="carlos">Carlos Lima</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cobrador">Cobrador</Label>
                  <Select value={formData.cobrador} onValueChange={(value) => handleInputChange("cobrador", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cobrador" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paulo">Paulo Mendes</SelectItem>
                      <SelectItem value="lucia">Lúcia Ferreira</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="estoque">Estoque</Label>
                <Select value={formData.estoque} onValueChange={(value) => handleInputChange("estoque", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estoque" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="principal">Estoque Principal</SelectItem>
                    <SelectItem value="filial">Estoque Filial</SelectItem>
                    <SelectItem value="deposito">Depósito</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange("observacoes", e.target.value)}
                  placeholder="Observações adicionais..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Action Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Novo
              </Button>
              <Button variant="outline" className="w-full">
                <Search className="w-4 h-4 mr-2" />
                Procurar
              </Button>
              <Button variant="outline" className="w-full">
                <Edit className="w-4 h-4 mr-2" />
                Alterar
              </Button>
              <Button variant="outline" className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
              <Button variant="destructive" className="w-full">
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </Button>
            </CardContent>
          </Card>

          {/* Card Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status do Cartão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Tipo:</span>
                <Badge>Mensal</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Vencimento:</span>
                <span className="text-sm font-medium">11/03/2024</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">$ Entrada:</span>
                <span className="text-sm font-medium">R$ 0,00 (F4)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">N Parcs:</span>
                <span className="text-sm font-medium">10 (F5)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">$ Parc:</span>
                <span className="text-sm font-medium">0,00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Devol.:</span>
                <span className="text-sm font-medium">0,00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Desconto:</span>
                <span className="text-sm font-medium">0,00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Resta:</span>
                <span className="text-sm font-medium text-green-600">R$ 0,00</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Pagamento recebido</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Cartão atualizado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Pendência resolvida</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Products Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Produtos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {produtos.map((produto, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-7 gap-4 p-4 border border-border rounded-lg">
                <div>
                  <Label>Código</Label>
                  <Input
                    value={produto.codigo}
                    onChange={(e) => handleProdutoChange(index, "codigo", e.target.value)}
                    placeholder="Código"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Descrição</Label>
                  <Input
                    value={produto.descricao}
                    onChange={(e) => handleProdutoChange(index, "descricao", e.target.value)}
                    placeholder="Descrição do produto"
                  />
                </div>
                <div>
                  <Label>Qtde</Label>
                  <Input
                    value={produto.qtde}
                    onChange={(e) => handleProdutoChange(index, "qtde", e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Devolução</Label>
                  <Input
                    value={produto.devolucao}
                    onChange={(e) => handleProdutoChange(index, "devolucao", e.target.value)}
                    placeholder="0,00"
                  />
                </div>
                <div>
                  <Label>$ Venda</Label>
                  <Input
                    value={produto.venda}
                    onChange={(e) => handleProdutoChange(index, "venda", e.target.value)}
                    placeholder="0,00"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label>Valor Total</Label>
                    <Input
                      value={produto.valorTotal}
                      onChange={(e) => handleProdutoChange(index, "valorTotal", e.target.value)}
                      placeholder="0,00"
                    />
                  </div>
                  {produtos.length > 1 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeProduto(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            <div className="flex justify-between items-center pt-4 border-t border-border">
              <Button variant="outline" onClick={addProduto}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Produto
              </Button>
              <div className="text-right">
                <p className="text-lg font-bold">
                  Total de Itens: {produtos.length} | Valor Total: R$ 0,00
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cartoes;