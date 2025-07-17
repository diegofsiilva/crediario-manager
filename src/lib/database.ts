// Database abstraction layer para SQLite local
export interface Cliente {
  id?: number;
  nome: string;
  cpf: string;
  rg: string;
  endereco: string;
  cidade: string;
  cep: string;
  telefone: string;
  email?: string;
  data_nascimento: string;
  estado_civil: string;
  profissao: string;
  renda: number;
  data_cadastro: string;
  status: 'ativo' | 'inativo' | 'bloqueado';
}

export interface Cartao {
  id?: number;
  cliente_id: number;
  numero_cartao: string;
  limite: number;
  data_emissao: string;
  data_vencimento: string;
  status: 'ativo' | 'cancelado' | 'bloqueado';
}

export interface Compra {
  id?: number;
  cartao_id: number;
  descricao: string;
  valor_total: number;
  num_parcelas: number;
  valor_parcela: number;
  data_compra: string;
  status: 'ativo' | 'quitado' | 'cancelado';
}

export interface Pagamento {
  id?: number;
  compra_id: number;
  numero_parcela: number;
  valor: number;
  data_vencimento: string;
  data_pagamento?: string;
  status: 'pendente' | 'pago' | 'vencido';
}

class LocalDatabase {
  private dbName = 'crediario_db';
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Tabela Clientes
        if (!db.objectStoreNames.contains('clientes')) {
          const clientesStore = db.createObjectStore('clientes', { keyPath: 'id', autoIncrement: true });
          clientesStore.createIndex('cpf', 'cpf', { unique: true });
          clientesStore.createIndex('nome', 'nome', { unique: false });
        }

        // Tabela Cartões
        if (!db.objectStoreNames.contains('cartoes')) {
          const cartoesStore = db.createObjectStore('cartoes', { keyPath: 'id', autoIncrement: true });
          cartoesStore.createIndex('cliente_id', 'cliente_id', { unique: false });
          cartoesStore.createIndex('numero_cartao', 'numero_cartao', { unique: true });
        }

        // Tabela Compras
        if (!db.objectStoreNames.contains('compras')) {
          const comprasStore = db.createObjectStore('compras', { keyPath: 'id', autoIncrement: true });
          comprasStore.createIndex('cartao_id', 'cartao_id', { unique: false });
        }

        // Tabela Pagamentos
        if (!db.objectStoreNames.contains('pagamentos')) {
          const pagamentosStore = db.createObjectStore('pagamentos', { keyPath: 'id', autoIncrement: true });
          pagamentosStore.createIndex('compra_id', 'compra_id', { unique: false });
        }
      };
    });
  }

  // CRUD Clientes
  async criarCliente(cliente: Omit<Cliente, 'id'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['clientes'], 'readwrite');
      const store = transaction.objectStore('clientes');
      const request = store.add(cliente);

      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async buscarClientes(filtro?: { nome?: string; cpf?: string; status?: string }): Promise<Cliente[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['clientes'], 'readonly');
      const store = transaction.objectStore('clientes');
      const request = store.getAll();

      request.onsuccess = () => {
        let clientes = request.result as Cliente[];
        
        if (filtro) {
          clientes = clientes.filter(cliente => {
            if (filtro.nome && !cliente.nome.toLowerCase().includes(filtro.nome.toLowerCase())) return false;
            if (filtro.cpf && !cliente.cpf.includes(filtro.cpf)) return false;
            if (filtro.status && cliente.status !== filtro.status) return false;
            return true;
          });
        }
        
        resolve(clientes);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async atualizarCliente(id: number, cliente: Partial<Cliente>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['clientes'], 'readwrite');
      const store = transaction.objectStore('clientes');
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const existingCliente = getRequest.result;
        if (!existingCliente) {
          reject(new Error('Cliente não encontrado'));
          return;
        }

        const updatedCliente = { ...existingCliente, ...cliente };
        const putRequest = store.put(updatedCliente);
        
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // CRUD Cartões
  async criarCartao(cartao: Omit<Cartao, 'id'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cartoes'], 'readwrite');
      const store = transaction.objectStore('cartoes');
      const request = store.add(cartao);

      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async buscarCartoesPorCliente(clienteId: number): Promise<Cartao[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cartoes'], 'readonly');
      const store = transaction.objectStore('cartoes');
      const index = store.index('cliente_id');
      const request = index.getAll(clienteId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // CRUD Compras
  async criarCompra(compra: Omit<Compra, 'id'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['compras'], 'readwrite');
      const store = transaction.objectStore('compras');
      const request = store.add(compra);

      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  // CRUD Pagamentos
  async criarPagamentos(compraId: number, compra: Compra): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pagamentos'], 'readwrite');
      const store = transaction.objectStore('pagamentos');
      
      const pagamentos: Omit<Pagamento, 'id'>[] = [];
      const dataBase = new Date(compra.data_compra);
      
      for (let i = 1; i <= compra.num_parcelas; i++) {
        const dataVencimento = new Date(dataBase);
        dataVencimento.setMonth(dataVencimento.getMonth() + i);
        
        pagamentos.push({
          compra_id: compraId,
          numero_parcela: i,
          valor: compra.valor_parcela,
          data_vencimento: dataVencimento.toISOString().split('T')[0],
          status: 'pendente'
        });
      }

      let completed = 0;
      pagamentos.forEach(pagamento => {
        const request = store.add(pagamento);
        request.onsuccess = () => {
          completed++;
          if (completed === pagamentos.length) resolve();
        };
        request.onerror = () => reject(request.error);
      });
    });
  }

  async buscarPagamentosVencidos(): Promise<Pagamento[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pagamentos'], 'readonly');
      const store = transaction.objectStore('pagamentos');
      const request = store.getAll();

      request.onsuccess = () => {
        const hoje = new Date().toISOString().split('T')[0];
        const pagamentos = request.result as Pagamento[];
        const vencidos = pagamentos.filter(p => 
          p.status === 'pendente' && p.data_vencimento < hoje
        );
        resolve(vencidos);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async marcarPagamento(pagamentoId: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pagamentos'], 'readwrite');
      const store = transaction.objectStore('pagamentos');
      const getRequest = store.get(pagamentoId);

      getRequest.onsuccess = () => {
        const pagamento = getRequest.result;
        if (!pagamento) {
          reject(new Error('Pagamento não encontrado'));
          return;
        }

        pagamento.status = 'pago';
        pagamento.data_pagamento = new Date().toISOString().split('T')[0];

        const putRequest = store.put(pagamento);
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // Estatísticas para Dashboard
  async getEstatisticas() {
    if (!this.db) throw new Error('Database not initialized');

    const [clientes, cartoes, pagamentosVencidos] = await Promise.all([
      this.buscarClientes(),
      this.buscarTodosCartoes(),
      this.buscarPagamentosVencidos()
    ]);

    const clientesAtivos = clientes.filter(c => c.status === 'ativo').length;
    const cartoesAtivos = cartoes.filter(c => c.status === 'ativo').length;
    
    return {
      totalClientes: clientes.length,
      clientesAtivos,
      cartoesAtivos,
      pagamentosVencidos: pagamentosVencidos.length,
      valorEmAberto: pagamentosVencidos.reduce((sum, p) => sum + p.valor, 0)
    };
  }

  private async buscarTodosCartoes(): Promise<Cartao[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cartoes'], 'readonly');
      const store = transaction.objectStore('cartoes');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

export const database = new LocalDatabase();