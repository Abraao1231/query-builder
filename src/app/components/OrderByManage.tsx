"use client";
import React from "react";
import { ListPlus, Trash } from "@phosphor-icons/react";

const OrderByManager = ({ orderBy, handleAddOrderBy, handleUpdateOrderBy, handleRemoveOrderBy, tablesAndSubqueries, nTables }) => {
    return (
        <div className="w-full mt-6 flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-2">Ordenar Por</h2>
            <div className="space-y-4">
                {orderBy.map((order, index) => (
                    <div key={index} className="flex items-center gap-x-4">
                        <select
                            value={order.column}
                            onChange={(e) =>
                                handleUpdateOrderBy(index, "column", e.target.value)
                            }
                            className="p-2 border border-gray-300 rounded-lg dark:bg-gray-900 dark:text-gray-100"
                        >
                            <option value="">Selecione uma coluna</option>
                            {tablesAndSubqueries.map((table, idx) =>
                                table.selectedColumns.map((col) => (
                                    <option key={col} value={col}>
                                        {table.tableName ? col : `subconsulta_${idx - nTables}.${col.split(".").shift()}`}
                                    </option>
                                ))
                            )}
                        </select>
                        <select
                            value={order.direction}
                            onChange={(e) =>
                                handleUpdateOrderBy(index, "direction", e.target.value)
                            }
                            className="p-2 border border-gray-300 rounded-md dark:bg-gray-900 dark:text-gray-100"
                        >
                            <option value="ASC">ASC</option>
                            <option value="DESC">DESC</option>
                        </select>
                        <button
                            onClick={() => handleRemoveOrderBy(index)}
                            className="p-2 text-red-500 rounded-md"
                        >
                            <Trash size={24} />
                        </button>
                    </div>
                ))}
            </div>
            <button
                onClick={handleAddOrderBy}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex gap-x-2"
            >
                <ListPlus size={24} />
                Adicionar Ordenação
            </button>
        </div>
    );
};

export default OrderByManager;
