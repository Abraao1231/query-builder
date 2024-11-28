import React, { useState } from 'react';
import { schema } from '../queryBuild/schemas/TableShema';
import { useColumnSelection } from '@/context/queryContext';



export default function ListAllColumns() {
    const {  setColumnSelection,  tablesAndSubqueries } = useColumnSelection();

    const tables = Object.keys(schema).map((tableName) => {
        const columns = Object.keys(schema[tableName].subfields).map((item) => `${tableName}.${item}`);
        return {
            id: tableName,
            columns: columns,
            tableName: tableName,
        };
    });

  

    const [columnSelections, setColumnSelections] = useState<{ [key: string]: Set<string> }>(() => {
        const initialSelections: { [key: string]: Set<string> } = {};
        tables.forEach((table) => {
            initialSelections[table.id] = new Set();
        });
        return initialSelections;
    });

    const handleCheckboxChange = (tableId: string, column: string, isChecked: boolean) => {
        setColumnSelections((prev) => {
            const updatedSelections = { ...prev };

            // Garantir que o Set exista para a tabela
            if (!updatedSelections[tableId]) {
                updatedSelections[tableId] = new Set();
            }

            // Adicionar ou remover a coluna com base no checkbox
            if (isChecked) {
                updatedSelections[tableId].add(column);
            } else {
                updatedSelections[tableId].delete(column);
            }
            return updatedSelections;
        });
        setColumnSelection(columnSelections)
    };
    let nConsultas = 1;    
    return (
        <div className="px-4 py-2 space-y-6">
            <h2 className="text-2xl dark:text-gray-100 text-gray-800 text-[12px]-md">Selecione as colunas que devem ter as subconsultas</h2>
            <div className="space-y-2 overflow-y-auto max-h-[300px]">
                {tablesAndSubqueries.map((table, tableIndex) => (
                    <div key={tableIndex} className="border border-gray-300 p-4 rounded-md shadow">
                        <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-100">
                            {
                                !table.tableName ? 
                                (`sub-consulta ${nConsultas++}`) :
                                 (
                                    table.tableName
                                )
                            }
                        </h3>
                        <div className="space-y-2">
                            {table.selectedColumns.map((columnName, columnIndex) => (
                                <div key={columnIndex} className="flex items-center space-x-4">
                                    <input
                                        type="checkbox"
                                        id={`${table.id}-${columnName}`}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        checked={columnSelections[table.id]?.has(columnName) || false}
                                        onChange={(e) =>
                                            handleCheckboxChange(table.id, columnName, e.target.checked)
                                        }
                                    />
                                    <label
                                        htmlFor={`${table.id}-${columnName}`}
                                        className="text-gray-600 cursor-pointer dark:text-gray-100"
                                    >
                                        {columnName}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
