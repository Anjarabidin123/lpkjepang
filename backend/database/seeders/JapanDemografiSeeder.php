<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DemografiProvince;
use App\Models\DemografiRegency;

class JapanDemografiSeeder extends Seeder
{
    public function run(): void
    {
        $prefectures = [
            ['kode' => 'JP01', 'nama' => 'HOKKAIDO'],
            ['kode' => 'JP02', 'nama' => 'AOMORI'],
            ['kode' => 'JP03', 'nama' => 'IWATE'],
            ['kode' => 'JP04', 'nama' => 'MIYAGI'],
            ['kode' => 'JP05', 'nama' => 'AKITA'],
            ['kode' => 'JP06', 'nama' => 'YAMAGATA'],
            ['kode' => 'JP07', 'nama' => 'FUKUSHIMA'],
            ['kode' => 'JP08', 'nama' => 'IBARAKI'],
            ['kode' => 'JP09', 'nama' => 'TOCHIGI'],
            ['kode' => 'JP10', 'nama' => 'GUNMA'],
            ['kode' => 'JP11', 'nama' => 'SAITAMA'],
            ['kode' => 'JP12', 'nama' => 'CHIBA'],
            ['kode' => 'JP13', 'nama' => 'TOKYO'],
            ['kode' => 'JP14', 'nama' => 'KANAGAWA'],
            ['kode' => 'JP15', 'nama' => 'NIIGATA'],
            ['kode' => 'JP16', 'nama' => 'TOYAMA'],
            ['kode' => 'JP17', 'nama' => 'ISHIKAWA'],
            ['kode' => 'JP18', 'nama' => 'FUKUI'],
            ['kode' => 'JP19', 'nama' => 'YAMANASHI'],
            ['kode' => 'JP20', 'nama' => 'NAGANO'],
            ['kode' => 'JP21', 'nama' => 'GIFU'],
            ['kode' => 'JP22', 'nama' => 'SHIZUOKA'],
            ['kode' => 'JP23', 'nama' => 'AICHI'],
            ['kode' => 'JP24', 'nama' => 'MIE'],
            ['kode' => 'JP25', 'nama' => 'SHIGA'],
            ['kode' => 'JP26', 'nama' => 'KYOTO'],
            ['kode' => 'JP27', 'nama' => 'OSAKA'],
            ['kode' => 'JP28', 'nama' => 'HYOGO'],
            ['kode' => 'JP29', 'nama' => 'NARA'],
            ['kode' => 'JP30', 'nama' => 'WAKAYAMA'],
            ['kode' => 'JP31', 'nama' => 'TOTTORI'],
            ['kode' => 'JP32', 'nama' => 'SHIMANE'],
            ['kode' => 'JP33', 'nama' => 'OKAYAMA'],
            ['kode' => 'JP34', 'nama' => 'HIROSHIMA'],
            ['kode' => 'JP35', 'nama' => 'YAMAGUCHI'],
            ['kode' => 'JP36', 'nama' => 'TOKUSHIMA'],
            ['kode' => 'JP37', 'nama' => 'KAGAWA'],
            ['kode' => 'JP38', 'nama' => 'EHIME'],
            ['kode' => 'JP39', 'nama' => 'KOCHI'],
            ['kode' => 'JP40', 'nama' => 'FUKUOKA'],
            ['kode' => 'JP41', 'nama' => 'SAGA'],
            ['kode' => 'JP42', 'nama' => 'NAGASAKI'],
            ['kode' => 'JP43', 'nama' => 'KUMAMOTO'],
            ['kode' => 'JP44', 'nama' => 'OITA'],
            ['kode' => 'JP45', 'nama' => 'MIYAZAKI'],
            ['kode' => 'JP46', 'nama' => 'KAGOSHIMA'],
            ['kode' => 'JP47', 'nama' => 'OKINAWA'],
        ];

        // Major Japanese Cities
        $cityData = [
            'JP13' => ['CHIYODA', 'CHUO', 'MINATO', 'SHINJUKU', 'BUNKYO', 'TAITO', 'SETAGAYA', 'SHIBUYA'], // Tokyo
            'JP27' => ['OSAKA CITY', 'SAKAI CITY', 'HIGASHIOSAKA CITY', 'SUITA CITY'], // Osaka
            'JP23' => ['NAGOYA CITY', 'TOYOHASHI CITY', 'OKAZAKI CITY'], // Aichi
            'JP14' => ['YOKOHAMA CITY', 'KAWASAKI CITY', 'SAGAMIHARA CITY'], // Kanagawa
            'JP26' => ['KYOTO CITY', 'UJI CITY', 'KAMEOKA CITY'], // Kyoto
            'JP22' => ['SHIZUOKA CITY', 'HAMAMATSU CITY', 'NUMAZU CITY'], // Shizuoka
            'JP11' => ['SAITAMA CITY', 'KAWAGOE CITY', 'KAWAGUCHI CITY'], // Saitama
            'JP12' => ['CHIBA CITY', 'FUNABASHI CITY', 'MATSUDO CITY'], // Chiba
            'JP40' => ['FUKUOKA CITY', 'KITAKYUSHU CITY', 'KURUME CITY'], // Fukuoka
            'JP01' => ['SAPPORO CITY', 'ASAHIKAWA CITY', 'HAKODATE CITY'], // Hokkaido
        ];

        foreach ($prefectures as $pref) {
            $province = DemografiProvince::updateOrCreate(
                ['kode' => $pref['kode']],
                ['nama' => $pref['nama'], 'country_id' => 'JP', 'is_active' => true]
            );

            if (isset($cityData[$pref['kode']])) {
                foreach ($cityData[$pref['kode']] as $cityName) {
                    DemografiRegency::updateOrCreate(
                        ['kode' => $pref['kode'] . '-' . str_replace(' ', '', $cityName)],
                        ['nama' => $cityName, 'province_id' => $province->id, 'is_active' => true]
                    );
                }
            } else {
                // Fallback dummy for others
                DemografiRegency::updateOrCreate(
                    ['kode' => $pref['kode'] . '-CITY'],
                    ['nama' => $pref['nama'] . ' CITY', 'province_id' => $province->id, 'is_active' => true]
                );
            }
        }
    }
}
