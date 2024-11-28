import React from "react";

// Tipagem para o componente ColumnSelector
interface ColumnSelectorProps {
  table: { name: string; columns: string[] };
  selectedColumns: string[];
  onColumnSelectChange: (column: string, isChecked: boolean) => void;
}

const ColumnSelector: React.FC<ColumnSelectorProps> = ({ table, selectedColumns, onColumnSelectChange }) => (
  <div className="flex flex-col">
    <h4 className="font-semibold text-md">{table.name}</h4>
    <div className="flex flex-col">
      {table.columns.map((column) => (
        <label key={column} className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selectedColumns.includes(column)}
            onChange={() => onColumnSelectChange(column, !selectedColumns.includes(column))}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span className="text-sm">{column}</span>
        </label>
      ))}
    </div>
  </div>
);

export default ColumnSelector;
