"use client";
import { schema } from "../queryBuild/schemas/TableShema";
import ButtonSelect from "./ButtonSelect";

export default function (){
    const TabelaDisponiveis = Object.values(schema) 
    return (
        <div className="flex flex-col gap-y-2">
        {
            TabelaDisponiveis.map((item) => {
                return (
                    <div key={item.label}>
                        <h1>{item.label}</h1>
                        <div className="flex flex-col gap-y-2">
                        {
                            Object.values(item.subfields).map(coluna => {
                                return (
                                    <ButtonSelect key={coluna.label} label={coluna.label}/>
                                )
                            }
                            )
                        }
                        </div>
                    </div>
                )
            })
        }
        </div>
    )
}