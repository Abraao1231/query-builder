'use client';
import React, { useState, useCallback, useEffect } from 'react';
import type { JsonGroup, Config, ImmutableTree, BuilderProps } from 'react-awesome-query-builder';
import { Utils as QbUtils, Query, Builder } from 'react-awesome-query-builder';
import config from '../queryBuild/config'; // A configuração contém informações sobre as tabelas e colunas
import { Trash } from '@phosphor-icons/react';
import colors from 'tailwindcss/colors';
import ColumnSelector from './ColumnSelector'; // Importando o novo componente
import { schema } from '../queryBuild/schemas/TableShema';
import SQLQueryBuilder from './ButtonSelectColumns';
import { useColumnSelection } from '@/context/queryContext';
import { Plus } from '@phosphor-icons/react';
// Dados fictícios de exemplo para tabelas e colunas
const tables = Object.keys(schema).map((tableName) => {
  const columns = Object.keys(schema[tableName].subfields).map(item => `${tableName}.${item}`); // Extraímos as chaves de subfields
  return {
    name: tableName,
    columns: columns,
  };
});

const setup = config;

const queryValue: JsonGroup = { id: QbUtils.uuid(), type: 'group' };

export default function DemoQueryBuilder() {

  const { setCondicaoPrincipal, tablesAndSubqueries, addTableOrSubquery, updateTableOrSubquery, removeTableOrSubquery } = useColumnSelection();

  useEffect(() => {
    // Exemplo de interação com o contexto quando a página for carregada
    tables.forEach((table) => {
      if (!tablesAndSubqueries.some(ts => ts.id === table.name))
        addTableOrSubquery({ id: table.name, selectedColumns: table.columns, tableName: table.name });
    });
  });

  const [queries, setQueries] = useState([
    { id: QbUtils.uuid(), tree: QbUtils.loadTree(queryValue), config: setup, selectedColumns: [] } // Adicionando 'selectedColumns' ao estado
  ]);

  const handleAddSubquery = () => {
    const newQuery = {
      id: QbUtils.uuid(),
      tree: QbUtils.loadTree(queryValue),
      config: setup,
      selectedColumns: [] // Colunas selecionadas começam vazias
    };
    addTableOrSubquery(newQuery);
    setQueries([...queries, newQuery]);
  };

  const handleRemoveSubquery = (index: number) => {
    const queryDeleted = queries.filter((_, i) => i === index);
    const updatedQueries = queries.filter((_, i) => i !== index);
    setQueries(updatedQueries);
    removeTableOrSubquery(queryDeleted[0].id);
  };

  useEffect(() => {
    const result = QbUtils.sqlFormat(queries[0].tree, setup);

    // Verifique se o resultado não é undefined ou null
    if (result !== undefined && result !== null) {
      setCondicaoPrincipal(result.slice(1, -1));
    } else {
      // Se o resultado for undefined ou null, defina um valor padrão ou trate o erro
      setCondicaoPrincipal('');
    }
  }, [queries[0]]);

  const handleSubqueryChange = useCallback(
    (index: number, immutableTree: ImmutableTree, config: Config) => {
      setQueries(prevQueries => {
        const updatedQueries = [...prevQueries];
        updatedQueries[index] = { ...updatedQueries[index], tree: immutableTree, config };
        return updatedQueries;
      });
    }
  );

  const handleColumnSelectChange = (index: number, columnName: string, check: boolean) => {
    setQueries(prevQueries => {
      const updatedQueries = [...prevQueries];
      const query = updatedQueries[index];
      let selectedColumns = query.selectedColumns;

      if (check) {
        selectedColumns = [...new Set([...selectedColumns, columnName])];
      } else {
        selectedColumns = selectedColumns.filter(col => col !== columnName);
      }

      query.selectedColumns = selectedColumns;
      updatedQueries[index] = query;
      updateTableOrSubquery(query);

      return updatedQueries;
    });
  };

  let consultas = queries;

  const renderBuilder = useCallback((props: BuilderProps) => (
    <div className='query-builder-container' style={{ padding: '10px' }}>
      <div className='query-builder qb-lite'>
        <Builder {...props} />
      </div>
    </div>
  ), []);

  return (
    <div className='w-full h-full dark:bg-gray-800 dark:text-gray-100 gap-y-2 flex flex-col items-center px-8'>
      <h1 className='text-2xl font-semibold'>Monte suas consultas SQL:</h1>

      <div className='grid grid-cols-1 sm:grid-cols-1 gap-4 w-4/5 overflow-auto max-h-full'>
        <div className='w-full border rounded p-4 bg-gray-50 h-9/10 dark:bg-gray-900 '>
          <h2 className='text-lg font-semibold mb-2'>Consulta Principal</h2>
          <Query
            {...setup}
            value={queries[0].tree}
            onChange={(immutableTree, config) => handleSubqueryChange(0, immutableTree, config)}
            renderBuilder={renderBuilder}
          />
        </div>

        {consultas.slice(1).map((query, index) => (
          <div key={query.id} className='w-full border rounded p-4  bg-gray-50 dark:bg-gray-900'>
            <div className='flex justify-between items-center mb-2'>
              <h2 className='text-lg font-semibold mb-2'>Subconsulta {index + 1}</h2>
              <button
                onClick={() => handleRemoveSubquery(index + 1)}
                className='border-none bg-transparent py-1 px-1'
              >
                <Trash size={18} color={colors.red[600]} />
              </button>
            </div>
            <div className='flex gap-x-4'>
              <Query
                {...query.config}
                value={query.tree}
                onChange={(immutableTree, config) => handleSubqueryChange(index + 1, immutableTree, config)}
                renderBuilder={renderBuilder}
              />

              <div className=''>
                <h3 className='text-md font-semibold mb-2'>Selecione as Colunas para Exibir</h3>
                <div className='flex flex-wrap gap-2 overflow-auto'>
                  {tables.map((table) => (
                    <ColumnSelector
                      key={table.name}
                      table={table}
                      selectedColumns={query.selectedColumns}
                      onColumnSelectChange={(column, isChecked) => handleColumnSelectChange(index + 1, column, isChecked)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='flex gap-x-4'>
        <button
          onClick={handleAddSubquery}
          className='px-4 py-2 bg-gray-200 border-gray-300 dark:bg-gray-600 flex items-center gap-x-2  border  dark:text-white rounded dark:hover:bg-gray-700'
        >
          <Plus size={18} className='dark:text-white' />
          Adicionar Subconsulta
        </button>
        <SQLQueryBuilder />
      </div>
    </div>
  );
}
