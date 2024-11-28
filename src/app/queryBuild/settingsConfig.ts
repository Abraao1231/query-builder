import { BasicConfig } from "react-awesome-query-builder";

// Crie os settings customizados
const settings = {
  ...BasicConfig.settings,
  addRuleLabel: "+ Adicionar condição",
  addGroupLabel: "+ Adicionar condição composta", 
  locale: {
    placeholderField: "Selecione um campo",
    placeholderOperator: "Selecione um operador",
    placeholderValue: "Digite um valor",
  },
};

export default settings;
