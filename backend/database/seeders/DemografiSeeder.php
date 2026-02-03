<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\DemografiProvince;
use App\Models\DemografiRegency;

class DemografiSeeder extends Seeder
{
    public function run(): void
    {
        $provinces = [
            ['kode' => '11', 'nama' => 'ACEH'],
            ['kode' => '12', 'nama' => 'SUMATERA UTARA'],
            ['kode' => '13', 'nama' => 'SUMATERA BARAT'],
            ['kode' => '14', 'nama' => 'RIAU'],
            ['kode' => '15', 'nama' => 'JAMBI'],
            ['kode' => '16', 'nama' => 'SUMATERA SELATAN'],
            ['kode' => '17', 'nama' => 'BENGKULU'],
            ['kode' => '18', 'nama' => 'LAMPUNG'],
            ['kode' => '19', 'nama' => 'KEPULAUAN BANGKA BELITUNG'],
            ['kode' => '21', 'nama' => 'KEPULAUAN RIAU'],
            ['kode' => '31', 'nama' => 'DKI JAKARTA'],
            ['kode' => '32', 'nama' => 'JAWA BARAT'],
            ['kode' => '33', 'nama' => 'JAWA TENGAH'],
            ['kode' => '34', 'nama' => 'DI YOGYAKARTA'],
            ['kode' => '35', 'nama' => 'JAWA TIMUR'],
            ['kode' => '36', 'nama' => 'BANTEN'],
            ['kode' => '51', 'nama' => 'BALI'],
            ['kode' => '52', 'nama' => 'NUSA TENGGARA BARAT'],
            ['kode' => '53', 'nama' => 'NUSA TENGGARA TIMUR'],
            ['kode' => '61', 'nama' => 'KALIMANTAN BARAT'],
            ['kode' => '62', 'nama' => 'KALIMANTAN TENGAH'],
            ['kode' => '63', 'nama' => 'KALIMANTAN SELATAN'],
            ['kode' => '64', 'nama' => 'KALIMANTAN TIMUR'],
            ['kode' => '65', 'nama' => 'KALIMANTAN UTARA'],
            ['kode' => '71', 'nama' => 'SULAWESI UTARA'],
            ['kode' => '72', 'nama' => 'SULAWESI TENGAH'],
            ['kode' => '73', 'nama' => 'SULAWESI SELATAN'],
            ['kode' => '74', 'nama' => 'SULAWESI TENGGARA'],
            ['kode' => '75', 'nama' => 'GORONTALO'],
            ['kode' => '76', 'nama' => 'SULAWESI BARAT'],
            ['kode' => '81', 'nama' => 'MALUKU'],
            ['kode' => '82', 'nama' => 'MALUKU UTARA'],
            ['kode' => '91', 'nama' => 'PAPUA BARAT'],
            ['kode' => '92', 'nama' => 'PAPUA'],
        ];

        foreach ($provinces as $prov) {
            DemografiProvince::updateOrCreate(
                ['kode' => $prov['kode']],
                ['nama' => $prov['nama'], 'country_id' => 'ID', 'is_active' => true]
            );
        }

        // Data Kabupaten (Sampel diperbanyak)
        $data = [
            '31' => [ // DKI Jakarta
                ['3101', 'KAB. ADM. KEPULAUAN SERIBU'],
                ['3171', 'KOTA ADM. JAKARTA SELATAN'],
                ['3172', 'KOTA ADM. JAKARTA TIMUR'],
                ['3173', 'KOTA ADM. JAKARTA PUSAT'],
                ['3174', 'KOTA ADM. JAKARTA BARAT'],
                ['3175', 'KOTA ADM. JAKARTA UTARA'],
            ],
            '32' => [ // Jawa Barat
                ['3201', 'KABUPATEN BOGOR'],
                ['3204', 'KABUPATEN BANDUNG'],
                ['3205', 'KABUPATEN GARUT'],
                ['3209', 'KABUPATEN CIREBON'],
                ['3216', 'KABUPATEN BEKASI'],
                ['3217', 'KABUPATEN BANDUNG BARAT'],
                ['3271', 'KOTA BOGOR'],
                ['3273', 'KOTA BANDUNG'],
                ['3275', 'KOTA BEKASI'],
                ['3277', 'KOTA CIMAHI'],
                ['3278', 'KOTA TASIKMALAYA'],
                ['3279', 'KOTA BANJAR'],
            ],
            '33' => [ // Jawa Tengah
                ['3301', 'KABUPATEN CILACAP'],
                ['3302', 'KABUPATEN BANYUMAS'],
                ['3310', 'KABUPATEN KLATEN'],
                ['3313', 'KABUPATEN KARANGANYAR'],
                ['3318', 'KABUPATEN PATI'],
                ['3372', 'KOTA SURAKARTA (SOLO)'],
                ['3374', 'KOTA SEMARANG'],
                ['3376', 'KOTA TEGAL'],
            ],
            '35' => [ // Jawa Timur
                ['3507', 'KABUPATEN MALANG'],
                ['3510', 'KABUPATEN BANYUWANGI'],
                ['3515', 'KABUPATEN SIDOARJO'],
                ['3573', 'KOTA MALANG'],
                ['3578', 'KOTA SURABAYA'],
                ['3579', 'KOTA BATU'],
            ],
            '34' => [ // DIY
                ['3401', 'KABUPATEN KULON PROGO'],
                ['3402', 'KABUPATEN BANTUL'],
                ['3403', 'KABUPATEN GUNUNG KIDUL'],
                ['3404', 'KABUPATEN SLEMAN'],
                ['3471', 'KOTA YOGYAKARTA'],
            ],
            '51' => [ // Bali
                ['5103', 'KABUPATEN BADUNG'],
                ['5104', 'KABUPATEN GIANYAR'],
                ['5171', 'KOTA DENPASAR'],
            ]
        ];

        foreach ($data as $provKode => $regencies) {
            $province = DemografiProvince::where('kode', $provKode)->first();
            if ($province) {
                foreach ($regencies as $reg) {
                    DemografiRegency::updateOrCreate(
                        ['kode' => $reg[0]],
                        ['nama' => $reg[1], 'province_id' => $province->id, 'is_active' => true]
                    );
                }
            }
        }
    }
}
