
export const schema = {
    imovel: {
        label: 'imovel',
        type: '!struct',
        subfields: {
            id: {
                label: 'ID',
                type: 'number',
                unique: true,
                fieldSettings: {
                    customProps: {
                      placeholder: "Digite um número",
                    },
                  },
            },
            nome: {
                label: 'Nome',
                type: 'text',
                fieldSettings: {
                    customProps: {
                      placeholder: "Digite um nome",
                    },
                  },
            },
            endereco: {
                label: 'Endereço',
                type: 'text',  
                fieldSettings: {
                    customProps: {
                      placeholder: "Digite um endereço",
                    },
                  },
            },
            price: {
                label: 'Preço',
                type: 'number',
                fieldSettings: {
                    customProps: {
                      placeholder: "Digite um número",
                    },
                  },
            },
            dono_id: {
                label: 'Proprietário',
                type: 'text',  
                fieldSettings: {
                    customProps: {
                      placeholder: "Digite um número",
                    },
                  },
            },
            cep: {
                label: 'CEP',
                type: 'number',
                fieldSettings: {
                    customProps: {
                      placeholder: "Digite um número",
                    },
                  },
            },
            tipo: {
                label: 'Tipo',
                type: "select", // Define como dropdown (equivalente ao enum)
                valueSources: ["value"], // O valor pode ser fixo
                fieldSettings: {
                  listValues: [
                    { value: "ap", title: "Apartamento" },
                    { value: "casa", title: "Casa" },
                  ],
                },
            }
        }
    },
    dono: {
        type: '!struct',
        label: 'Proprietário',
        subfields: {
            id: {
                label: 'ID',
                type: 'number',
                unique: true,
                fieldSettings: {
                    customProps: {
                      placeholder: "Digite um número",
                    },
                  },
            },
            nome: {
                label: 'Nome',
                type: 'text',
                fieldSettings: {
                    customProps: {
                      placeholder: "Digite um nome",
                    },
                  },
            },
            cpf: {
                label: 'CPF',
                type: 'number',
                fieldSettings: {
                    customProps: {
                      placeholder: "Digite um número",
                    },
                  },  
            }, 
            email: {
                label: 'Email',
                type: 'text',
                fieldSettings: {
                    customProps: {
                      placeholder: "Digite um email",
                    },
                  },
            }
        }
    }
    
}