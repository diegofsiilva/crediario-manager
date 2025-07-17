import { useEffect, useState } from 'react';
import { database, Cliente, Cartao, Compra } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';

export const useDatabase = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initDB = async () => {
      try {
        await database.init();
        setIsInitialized(true);
        console.log('SQLite database initialized successfully');
      } catch (error) {
        console.error('Failed to initialize database:', error);
        toast({
          title: "Erro no Banco de Dados",
          description: "Falha ao inicializar banco SQLite local",
          variant: "destructive"
        });
      }
    };

    initDB();
  }, [toast]);

  return { isInitialized, database };
};

export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const carregarClientes = async (filtro?: { nome?: string; cpf?: string; status?: string }) => {
    setLoading(true);
    try {
      const result = await database.buscarClientes(filtro);
      setClientes(result);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar lista de clientes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const criarCliente = async (dadosCliente: Omit<Cliente, 'id'>) => {
    try {
      const id = await database.criarCliente(dadosCliente);
      toast({
        title: "Sucesso",
        description: `Cliente ${dadosCliente.nome} cadastrado com sucesso!`,
      });
      await carregarClientes(); // Recarregar lista
      return id;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      toast({
        title: "Erro",
        description: "Falha ao cadastrar cliente. Verifique se o CPF já não está cadastrado.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const buscarClientePorId = async (id: number) => {
    try {
      return await database.buscarClientePorId(id);
    } catch (error) {
      console.error('Erro ao buscar cliente por ID:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar dados do cliente",
        variant: "destructive"
      });
      return null;
    }
  };

  const atualizarCliente = async (id: number, dados: Partial<Cliente>) => {
    try {
      await database.atualizarCliente(id, dados);
      toast({
        title: "Sucesso",
        description: "Cliente atualizado com sucesso!",
      });
      await carregarClientes();
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar cliente",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    clientes,
    loading,
    carregarClientes,
    criarCliente,
    atualizarCliente,
    buscarClientePorId
  };
};

export const useCartoes = () => {
  const [cartoes, setCartoes] = useState<Cartao[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const criarCartao = async (dadosCartao: Omit<Cartao, 'id'>) => {
    try {
      const id = await database.criarCartao(dadosCartao);
      toast({
        title: "Sucesso",
        description: `Cartão ${dadosCartao.numero_cartao} criado com sucesso!`,
      });
      return id;
    } catch (error) {
      console.error('Erro ao criar cartão:', error);
      toast({
        title: "Erro",
        description: "Falha ao criar cartão. Verifique se o número já não existe.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const buscarCartoesPorCliente = async (clienteId: number) => {
    setLoading(true);
    try {
      const result = await database.buscarCartoesPorCliente(clienteId);
      setCartoes(result);
      return result;
    } catch (error) {
      console.error('Erro ao buscar cartões:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar cartões do cliente",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    cartoes,
    loading,
    criarCartao,
    buscarCartoesPorCliente
  };
};

export const useCompras = () => {
  const { toast } = useToast();

  const criarCompra = async (dadosCompra: Omit<Compra, 'id'>) => {
    try {
      const compraId = await database.criarCompra(dadosCompra);
      await database.criarPagamentos(compraId, { ...dadosCompra, id: compraId });
      
      toast({
        title: "Sucesso",
        description: `Compra registrada e ${dadosCompra.num_parcelas} parcelas criadas!`,
      });
      return compraId;
    } catch (error) {
      console.error('Erro ao criar compra:', error);
      toast({
        title: "Erro",
        description: "Falha ao registrar compra",
        variant: "destructive"
      });
      throw error;
    }
  };

  return { criarCompra };
};