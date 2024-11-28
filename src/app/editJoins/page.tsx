"use client";
import React, { useState, useEffect } from "react";
import { useColumnSelection } from "@/context/queryContext";
import { Utils as QbUtils } from "react-awesome-query-builder";
import config from "../queryBuild/config";
import { ListPlus, Trash } from "@phosphor-icons/react";
import OrderByManager from "../components/OrderByManage";


const SQLQueryGenerator = () => {
    const { columnSelection, tablesAndSubqueries, condicaoPrincipal } = useColumnSelection();
    const [sqlQuery, setSqlQuery] = useState("");
    const [orderBy, setOrderBy] = useState([]);

    const nTables = tablesAndSubqueries.filter((table) => !table.tree).length;

    const generateSQLQuery = () => {
        const findTableByColumn = (column) => {
            for (const table of tablesAndSubqueries) {
                if (table.selectedColumns.includes(column)) {
                    if (table.tree) {
                        return `subconsulta_${tablesAndSubqueries.indexOf(table)}`;
                    }
                    return table.tableName || `consulta_${tablesAndSubqueries.indexOf(table)}`;
                }
            }
            return null;
        };
    
        const subqueries = tablesAndSubqueries
            .filter((table) => table.tree)
            .map((table, index) => {
                const selectedColumns = table.selectedColumns.filter(
                    (col) => columnSelection[table.id]?.has(col)
                );
    
                const usedTables = Array.from(
                    new Set(selectedColumns.map(findTableByColumn).filter(Boolean))
                );
    
                const fromClause = usedTables.reduce((query, currentTable, tableIndex) => {
                    if (tableIndex === 0) {
                        return `FROM ${currentTable}`;
                    } else {
                        return `${query}
                        INNER JOIN ${currentTable} ON ${currentTable}.id = ${usedTables[tableIndex - 1]}.id`;
                    }
                }, "");
    
                const stringCondicao = JSON.stringify(QbUtils.sqlFormat(table.tree, config));
                const whereClause = stringCondicao
                    ? `WHERE ${stringCondicao.replace(/^"|"$/g, "")}`
                    : "";
    
                return `
                    subconsulta_${index} AS (
                        SELECT ${selectedColumns.join(", ")}
                        ${fromClause}
                        ${whereClause}
                    )
                `;
            })
            .join(",\n");
    
        const withClause = subqueries ? `WITH ${subqueries}` : "";
    
        const selectColumns = Object.keys(columnSelection)
            .map((key) => {
                const tableIndex = tablesAndSubqueries.findIndex((t) => t.id === key);
                const table = tablesAndSubqueries[tableIndex];
                if (table) {
                    return table.selectedColumns
                        .filter((col) => columnSelection[key]?.has(col))
                        .map((col) => {
                            const tableAlias = table.tree
                                ? `subconsulta_${tableIndex - nTables}`
                                : table.tableName;
                            return `${tableAlias}.${col.split(".").pop()}`;
                        })
                        .join(", ");
                }
                return "";
            })
            .filter(Boolean)
            .join(", ");
    
        const mainFromClause = tablesAndSubqueries.reduce((query, table, index) => {
            if (index === 0) {
                return `FROM ${table.tableName}`;
            } else {
                const previousTable = tablesAndSubqueries[index - 1];
                const currentAlias = table.tree
                    ? `subconsulta_${index - nTables}`
                    : table.tableName;
                const previousAlias = previousTable.tree
                    ? `subconsulta_${index - 1 - nTables}`
                    : previousTable.tableName;
    
                return `${query}
                INNER JOIN ${currentAlias} ON ${previousAlias}.id = ${currentAlias}.id`;
            }
        }, "");
    
        const mainWhereClause = condicaoPrincipal
            ? `WHERE ${condicaoPrincipal}`
            : "";
    
        const orderByClause = orderBy
            .map(({ column, direction }) => `${column} ${direction}`)
            .join(", ");
    
        return `${withClause}
                SELECT ${selectColumns}
                ${mainFromClause}
                ${mainWhereClause}
                ${orderByClause ? `ORDER BY ${orderByClause}` : ""};`;
    };
    

    useEffect(() => {
        const query = generateSQLQuery();
        setSqlQuery(query);
    }, [orderBy, columnSelection, tablesAndSubqueries]); // Atualiza ao mudar ordenação ou colunas selecionadas


    const handleAddOrderBy = () => {
        setOrderBy([...orderBy, { column: "", direction: "ASC" }]);
    };

    const handleUpdateOrderBy = (index, key, value) => {
        const updatedOrderBy = [...orderBy];
        updatedOrderBy[index][key] = value;
        setOrderBy(updatedOrderBy);
    };

    const handleRemoveOrderBy = (index) => {
        const updatedOrderBy = orderBy.filter((_, i) => i !== index);
        setOrderBy(updatedOrderBy);
    };

    return (
        <div className="p-6 flex flex-col items-center justify-start w-full">
            <h1 className="text-xl font-bold mb-4">SQL gerado</h1>
            <div className="relative w-1/2">
                <textarea
                    value={sqlQuery}
                    readOnly
                    className="w-full h-[500px] p-4 border border-gray-300 rounded-lg bg-gray-100 text-sm font-mono overflow-y-auto dark:bg-gray-900 dark:text-gray-100"
                />
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(sqlQuery);
                    }}
                    className="absolute top-4 right-4  dark:text-white px-4 py-2 rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    Copiar
                </button>
            </div>
           
            <OrderByManager
                orderBy={orderBy}
                handleAddOrderBy={handleAddOrderBy}
                handleUpdateOrderBy={handleUpdateOrderBy}
                handleRemoveOrderBy={handleRemoveOrderBy}
                tablesAndSubqueries={tablesAndSubqueries}
                nTables={nTables}
            />    
              
            </div>
        
    );
};

export default SQLQueryGenerator;
