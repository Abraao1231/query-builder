'use client';

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Dna } from "@phosphor-icons/react";
import ListAllColumns from "./ListAllColumns";
import { X } from "@phosphor-icons/react";
import { FloppyDisk } from "@phosphor-icons/react";
import { useColumnSelection } from "@/context/queryContext";
import { useRouter } from "next/navigation";

export default function SQLQueryBuilder() {
    const { columnSelection } = useColumnSelection();
    const [validationError, setValidationError] = useState("");
    const router = useRouter(); // Hook do Next.js para navegação

    const handleGenerateQuery = () => {
        // Validação: verificar se ao menos uma coluna foi selecionada
        const hasSelectedColumns = Object.values(columnSelection).some(
            (columns) => columns && columns.size > 0
        );

        if (!hasSelectedColumns) {
            setValidationError("Selecione ao menos uma coluna para gerar a consulta.");
            return false;
        }

        setValidationError(""); // Limpar erro se a validação passar
        return true;
    };

    const handleProceed = () => {
        if (handleGenerateQuery()) {
            // Navegar para outra página usando o router
            router.push("/editJoins"); // Substitua "/result-page" pelo caminho da página de destino
        }
    };

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button className="px-4 py-2 bg-green-600 flex items-center gap-x-2 text-white rounded dark:hover:bg-green-700">
                    <FloppyDisk size={24} />
                    Finalizar consulta
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-blackA6 data-[state=open]:animate-overlayShow bg-gray-800/90" />
                <Dialog.Content className="fixed left-1/2 top-1/2 min-w-[60vw] max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 dark:bg-gray-700 rounded-md bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow">
                    <Dialog.Title className="m-0 text-[17px] text-xl font-bold dark:text-gray-100 text-mauve12">
                        Finalizar consulta
                    </Dialog.Title>
                    <Dialog.Description className="mb-2 mt-2.5 text-[15px] leading-normal text-mauve11 dark:text-gray-100">
                        Selecione as colunas que devem conter na consulta principal.
                    </Dialog.Description>
                    <ListAllColumns />
                    {validationError && (
                        <p className="text-red-500 text-sm mt-2">{validationError}</p>
                    )}
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleProceed}
                            className="inline-flex gap-x-2 dark:text-gray-100 border h-[35px] items-center justify-center rounded bg-green4 px-[15px] font-medium leading-none text-green11 hover:bg-green5 focus:shadow-[0_0_0_2px] focus:shadow-green7 focus:outline-none"
                        >
                            <Dna size={20} className="dark:text-gray-100" />
                            Gerar consulta
                        </button>
                    </div>
                    <Dialog.Close asChild>
                        <button
                            className="absolute right-2.5 top-2.5"
                            aria-label="Close"
                        >
                            <X size={20} className="dark:text-gray-100 text-gray-800" />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
