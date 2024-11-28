"use client"
import { createContext, useContext, useState, ReactNode } from 'react';

// Definindo os tipos dos dados
interface TableConfig {
    id: string;
    tree? : any; // A estrutura de árvore para representar a consulta, tipo a ser ajustado conforme sua necessidade
    config? : any; // Configuração adicional, pode ser um objeto ou outro tipo
    selectedColumns?: string[]; // Colunas selecionadas
    tableName?: string; // Nome da tabela, se aplicável
}

interface ColumnSelectionContextType {
    columnSelection: { [key: string]: Set<string> };
    tablesAndSubqueries: TableConfig[]; // Lista de tabelas e subconsultas
    condicaoPrincipal: string;
    setCondicaoPrincipal: (condicaoPrincipal: string) => void;
    setColumnSelection: (columnSelection: { [key: string]: Set<string> }) => void;
    updateColumnSelection: (key: string, value: string) => void;
    addTableOrSubquery: (table: TableConfig) => void; // Função para adicionar uma nova tabela ou subconsulta
    updateTableOrSubquery: (table: TableConfig) => void;
    removeTableOrSubquery: (id: string) => void;
}

// Criando o contexto
const ColumnSelectionContext = createContext<ColumnSelectionContextType | undefined>(undefined);

interface ColumnSelectionProviderProps {
    children: ReactNode;
}

export const ColumnSelectionProvider = ({ children }: ColumnSelectionProviderProps) => {
    const [columnSelection, setColumnSelection] = useState<{ [key: string]: Set<string> }>({});
    const [tablesAndSubqueries, setTablesAndSubqueries] = useState<TableConfig[]>([]);
    const [condicaoPrincipal, setCondicaoPrincipal] = useState('');

    // Função para atualizar a seleção de colunas
    const updateColumnSelection = (key: string, value: string) => {
        setColumnSelection((prev) => {
            const updated = { ...prev };
            if (!updated[key]) {
                updated[key] = new Set();
            }
            updated[key].add(value);
            return updated;
        });
    };
    const updateTableOrSubquery = (table: TableConfig) => {
        setTablesAndSubqueries((prev) => {
            const updated = prev.map(t => t.id === table.id ? table : t);
            return updated;
        });
    };
    const removeTableOrSubquery = (id: string) => {
        setTablesAndSubqueries((prev) => {
            const updated = prev.filter((table) => table.id !== id);
            return updated;
        });
    };
    // Função para adicionar uma nova tabela ou subconsulta
    const addTableOrSubquery = (table: TableConfig) => {
        setTablesAndSubqueries((prev) => [...prev, table]);
    };
   
    return (
        <ColumnSelectionContext.Provider value={{ 
            columnSelection, 
            setColumnSelection, 
            updateColumnSelection, 
            tablesAndSubqueries,
            addTableOrSubquery,
            updateTableOrSubquery,
            removeTableOrSubquery,
            condicaoPrincipal,
            setCondicaoPrincipal
        }}>
            {children}
        </ColumnSelectionContext.Provider>
    );
};

// Hook para acessar o contexto
export const useColumnSelection = () => {
    const context = useContext(ColumnSelectionContext);
    if (!context) {
        throw new Error('useColumnSelection must be used within a ColumnSelectionProvider');
    }
    return context;
};
