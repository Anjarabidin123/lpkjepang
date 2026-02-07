import React from "react";
import { DocumentVariableManager } from "@/components/Document/DocumentVariableManager";

export default function DocumentVariables() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Variabel Dokumen
                </h1>
                <p className="text-muted-foreground">
                    Kelola data dinamis (misal: Nama Siswa, Gaji, dll) untuk disisipkan ke dalam template.
                </p>
            </div>

            <DocumentVariableManager />
        </div>
    );
}
