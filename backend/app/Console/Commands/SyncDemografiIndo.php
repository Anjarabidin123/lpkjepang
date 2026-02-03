<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use App\Models\DemografiProvince;
use App\Models\DemografiRegency;

class SyncDemografiIndo extends Command
{
    protected $signature = 'demografi:sync';
    protected $description = 'Sync all Indonesian Provinces and Regencies from public API';

    public function handle()
    {
        $this->info('Fetching provinces...');
        
        $response = Http::get('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json');
        
        if (!$response->successful()) {
            $this->error('Failed to fetch provinces from API');
            return;
        }

        $provinces = $response->json();
        $total = count($provinces);
        
        $progressBar = $this->output->createProgressBar($total);
        $progressBar->start();

        foreach ($provinces as $prov) {
            $province = DemografiProvince::updateOrCreate(
                ['kode' => $prov['id']],
                [
                    'nama' => strtoupper($prov['name']),
                    'country_id' => 'ID',
                    'is_active' => true
                ]
            );

            // Fetch Regencies for this province
            $regResponse = Http::get("https://www.emsifa.com/api-wilayah-indonesia/api/regencies/{$prov['id']}.json");
            
            if ($regResponse->successful()) {
                $regencies = $regResponse->json();
                foreach ($regencies as $reg) {
                    DemografiRegency::updateOrCreate(
                        ['kode' => $reg['id']],
                        [
                            'nama' => strtoupper($reg['name']),
                            'province_id' => $province->id,
                            'is_active' => true
                        ]
                    );
                }
            }
            
            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine();
        $this->info('Demografi sync completed successfully!');
    }
}
