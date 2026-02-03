
import React from 'react';
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface JobOrderErrorStateProps {
    error: any;
    onRetry?: () => void;
}

export function JobOrderErrorState({ error, onRetry }: JobOrderErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 bg-card rounded-lg border border-destructive/20 shadow-sm animate-in fade-in zoom-in duration-300">
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Terjadi Kesalahan</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
                {error?.message || "Gagal memuat data Job Order. Silakan coba lagi nanti."}
            </p>
            {onRetry && (
                <Button onClick={onRetry} variant="outline">
                    Muat Ulang
                </Button>
            )}
        </div>
    );
}
