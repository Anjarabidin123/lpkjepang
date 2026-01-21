
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, RefreshCw, AlertTriangle, Database } from "lucide-react";

interface JobOrderErrorStateProps {
  error: Error;
  onRetry?: () => void;
}

export function JobOrderErrorState({ error, onRetry }: JobOrderErrorStateProps) {
  const isTableError = error.message.includes('does not exist') || error.message.includes('belum dibuat') || error.message.includes('belum tersedia');
  const isConnectionError = error.message.includes('connection') || error.message.includes('terhubung');

  return (
    <div className="space-y-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            {isTableError ? 'Database Setup Diperlukan' : isConnectionError ? 'Masalah Koneksi Database' : 'Error Memuat Data'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            {isTableError ? (
              <Database className="w-12 h-12 text-red-400 mx-auto mb-4" />
            ) : (
              <ClipboardList className="w-12 h-12 text-red-400 mx-auto mb-4" />
            )}
            
            {isTableError ? (
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Tabel Job Orders Belum Tersedia
                </h3>
                <p className="text-gray-600">
                  Database belum dikonfigurasi dengan benar. Langkah-langkah untuk mengatasi:
                </p>
                <div className="text-sm text-gray-600 text-left space-y-2 max-w-md mx-auto bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800">Solusi:</h4>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Buka Supabase Dashboard</li>
                    <li>Masuk ke bagian SQL Editor</li>
                    <li>Jalankan migrasi database untuk membuat tabel job_orders</li>
                    <li>Atau gunakan fitur Migration di Supabase</li>
                  </ol>
                </div>
              </div>
            ) : isConnectionError ? (
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Masalah Koneksi Database
                </h3>
                <p className="text-gray-600">
                  Tidak dapat terhubung ke Supabase. Periksa:
                </p>
                <ul className="text-sm text-gray-600 text-left space-y-1 max-w-md mx-auto">
                  <li>• Koneksi internet Anda</li>
                  <li>• Status layanan Supabase</li>
                  <li>• Konfigurasi API keys</li>
                </ul>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Terjadi Kesalahan
                </h3>
                <p className="text-gray-600">
                  {error.message}
                </p>
              </div>
            )}

            <div className="mt-6 space-y-3">
              {onRetry && (
                <Button onClick={onRetry} className="w-full max-w-xs">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Coba Lagi
                </Button>
              )}
              
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="w-full max-w-xs"
              >
                Refresh Halaman
              </Button>
            </div>

            {isTableError && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Untuk Administrator:</strong> Migrasi database yang diperlukan tersedia di folder supabase/migrations. 
                  Jalankan migrasi terbaru untuk membuat tabel job_orders.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
