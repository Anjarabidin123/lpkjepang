<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Siswa;

class SiswaController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Siswa::with(['user', 'province', 'regency', 'program', 'posisiKerja', 'lpkMitra']);

            if ($request->has('search')) {
                $search = $request->query('search');
                $query->where('nama', 'like', "%{$search}%")
                      ->orWhere('nik', 'like', "%{$search}%");
            }

            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            return response()->json($query->orderBy('nama')->get());
        } catch (\Exception $e) {
            return response()->json(['message' => 'Query Error', 'details' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        return \DB::transaction(function () use ($request) {
            try {
                $validated = $request->validate([
                    'user_id' => 'nullable|exists:users,id',
                    'nama' => 'required|string|max:255',
                    'nik' => 'required|string|max:20|unique:siswas,nik',
                    'email' => 'nullable|email|max:255',
                    'telepon' => 'nullable|string|max:20',
                    'status' => 'nullable|string',
                    
                    // Foreign Keys
                    'demografi_province_id' => 'nullable|exists:demografi_provinces,id',
                    'demografi_regency_id' => 'nullable|exists:demografi_regencies,id',
                    'program_id' => 'nullable|exists:programs,id',
                    'posisi_kerja_id' => 'nullable|exists:posisi_kerjas,id',
                    'lpk_mitra_id' => 'nullable|exists:lpk_mitras,id',

                    // Personal Info
                    'tempat_lahir' => 'nullable|string',
                    'tanggal_lahir' => 'nullable|date',
                    'jenis_kelamin' => 'nullable|string',
                    'alamat' => 'nullable|string',
                    'foto_siswa' => 'nullable|string',
                    
                    // Physical Bio
                    'tinggi_badan' => 'nullable|integer',
                    'berat_badan' => 'nullable|integer',
                    'ukuran_sepatu' => 'nullable|integer',
                    'ukuran_kepala' => 'nullable|integer',
                    'ukuran_pinggang' => 'nullable|integer',
                    'golongan_darah' => 'nullable|string',
                    'mata_kanan' => 'nullable|string',
                    'mata_kiri' => 'nullable|string',
                    'buta_warna' => 'boolean',
                    'warna_buta' => 'nullable|string',
                    'penggunaan_tangan' => 'nullable|string',

                    // Social & Habits
                    'status_pernikahan' => 'nullable|string',
                    'agama' => 'nullable|string',
                    'merokok_sekarang' => 'nullable|string',
                    'merokok_jepang' => 'nullable|string',
                    'minum_sake' => 'nullable|string',

                    // Additional Profile
                    'hobi' => 'nullable|string',
                    'visi' => 'nullable|string',
                    'target_gaji' => 'nullable|string',
                    'minat' => 'nullable|string',
                    'kelebihan' => 'nullable|string',
                    'kekurangan' => 'nullable|string',
                    'bakat_khusus' => 'nullable|string',
                    'pengalaman' => 'nullable|string',
                    'tujuan_jepang' => 'nullable|string',
                    'target_menabung' => 'nullable|string',
                    'catatan' => 'nullable|string',

                    // Japan & Language Skills
                    'pengalaman_jepang' => 'nullable|string',
                    'skill_bahasa_jepang' => 'nullable|string',

                    // Education
                    'nama_sekolah' => 'nullable|string',
                    'tahun_masuk_sekolah' => 'nullable|integer',
                    'tahun_lulus_sekolah' => 'nullable|integer',
                    'jurusan' => 'nullable|string',

                    // Program Info
                    'tanggal_daftar' => 'nullable|date',
                    'tanggal_masuk_lpk' => 'nullable|date',
                    'lama_belajar' => 'nullable|string',
                ]);

                $siswa = Siswa::create($validated);

                // Handle Hubungan
                if ($request->has('keluarga_indonesia')) {
                    $siswa->keluargaIndonesia()->createMany($request->keluarga_indonesia);
                }
                if ($request->has('keluarga_jepang')) {
                    $siswa->keluargaJepang()->createMany($request->keluarga_jepang);
                }
                if ($request->has('kontak_keluarga')) {
                    $siswa->kontakKeluarga()->createMany($request->kontak_keluarga);
                }
                if ($request->has('pengalaman_kerja')) {
                    $siswa->pengalamanKerja()->createMany($request->pengalaman_kerja);
                }
                if ($request->has('pendidikan')) {
                    $siswa->pendidikan()->createMany($request->pendidikan);
                }

                return response()->json($siswa->load(['user', 'province', 'regency', 'program', 'posisiKerja', 'lpkMitra', 'keluargaIndonesia', 'keluargaJepang', 'kontakKeluarga', 'pengalamanKerja', 'pendidikan']), 201);
            } catch (\Illuminate\Validation\ValidationException $e) {
                return response()->json(['message' => 'Validation Error', 'errors' => $e->errors()], 422);
            } catch (\Exception $e) {
                return response()->json(['message' => 'Server Error', 'details' => $e->getMessage()], 500);
            }
        });
    }

    public function show($id)
    {
        try {
            $siswa = Siswa::with([
                'user', 'province', 'regency', 'program', 'posisiKerja', 'lpkMitra',
                'keluargaIndonesia', 'keluargaJepang', 'kontakKeluarga', 'pengalamanKerja'
            ])->findOrFail($id);
            return response()->json($siswa);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Not Found', 'details' => $e->getMessage()], 404);
        }
    }

    public function update(Request $request, $id)
    {
        return \DB::transaction(function () use ($request, $id) {
            try {
                $siswa = Siswa::findOrFail($id);
                
                $validated = $request->validate([
                    'user_id' => 'nullable|exists:users,id',
                    'nama' => 'sometimes|required|string|max:255',
                    'nik' => 'sometimes|required|string|max:20|unique:siswas,nik,'.$id,
                    'email' => 'nullable|email|max:255',
                    'telepon' => 'nullable|string|max:20',
                    'status' => 'nullable|string',
                    
                    // Foreign Keys
                    'demografi_province_id' => 'nullable|exists:demografi_provinces,id',
                    'demografi_regency_id' => 'nullable|exists:demografi_regencies,id',
                    'program_id' => 'nullable|exists:programs,id',
                    'posisi_kerja_id' => 'nullable|exists:posisi_kerjas,id',
                    'lpk_mitra_id' => 'nullable|exists:lpk_mitras,id',

                    // Personal Info
                    'tempat_lahir' => 'nullable|string',
                    'tanggal_lahir' => 'nullable|date',
                    'jenis_kelamin' => 'nullable|string',
                    'alamat' => 'nullable|string',
                    'foto_siswa' => 'nullable|string',
                    
                    // Physical Bio
                    'tinggi_badan' => 'nullable|integer',
                    'berat_badan' => 'nullable|integer',
                    'ukuran_sepatu' => 'nullable|integer',
                    'ukuran_kepala' => 'nullable|integer',
                    'ukuran_pinggang' => 'nullable|integer',
                    'golongan_darah' => 'nullable|string',
                    'mata_kanan' => 'nullable|string',
                    'mata_kiri' => 'nullable|string',
                    'buta_warna' => 'boolean',
                    'warna_buta' => 'nullable|string',
                    'penggunaan_tangan' => 'nullable|string',

                    // Social & Habits
                    'status_pernikahan' => 'nullable|string',
                    'agama' => 'nullable|string',
                    'merokok_sekarang' => 'nullable|string',
                    'merokok_jepang' => 'nullable|string',
                    'minum_sake' => 'nullable|string',

                    // Additional Profile
                    'hobi' => 'nullable|string',
                    'visi' => 'nullable|string',
                    'target_gaji' => 'nullable|string',
                    'minat' => 'nullable|string',
                    'kelebihan' => 'nullable|string',
                    'kekurangan' => 'nullable|string',
                    'bakat_khusus' => 'nullable|string',
                    'pengalaman' => 'nullable|string',
                    'tujuan_jepang' => 'nullable|string',
                    'target_menabung' => 'nullable|string',
                    'catatan' => 'nullable|string',

                    // Japan & Language Skills
                    'pengalaman_jepang' => 'nullable|string',
                    'skill_bahasa_jepang' => 'nullable|string',

                    // Education
                    'nama_sekolah' => 'nullable|string',
                    'tahun_masuk_sekolah' => 'nullable|integer',
                    'tahun_lulus_sekolah' => 'nullable|integer',
                    'jurusan' => 'nullable|string',

                    // Program Info
                    'tanggal_daftar' => 'nullable|date',
                    'tanggal_masuk_lpk' => 'nullable|date',
                    'lama_belajar' => 'nullable|string',
                ]);
                
                $siswa->update($validated);

                // Update Hubungan (Sync)
                if ($request->has('keluarga_indonesia')) {
                    $siswa->keluargaIndonesia()->delete();
                    $siswa->keluargaIndonesia()->createMany($request->keluarga_indonesia);
                }
                if ($request->has('keluarga_jepang')) {
                    $siswa->keluargaJepang()->delete();
                    $siswa->keluargaJepang()->createMany($request->keluarga_jepang);
                }
                if ($request->has('kontak_keluarga')) {
                    $siswa->kontakKeluarga()->delete();
                    $siswa->kontakKeluarga()->createMany($request->kontak_keluarga);
                }
                if ($request->has('pengalaman_kerja')) {
                    $siswa->pengalamanKerja()->delete();
                    $siswa->pengalamanKerja()->createMany($request->pengalaman_kerja);
                }
                if ($request->has('pendidikan')) {
                    $siswa->pendidikan()->delete();
                    $siswa->pendidikan()->createMany($request->pendidikan);
                }

                return response()->json($siswa->load(['user', 'province', 'regency', 'program', 'posisiKerja', 'lpkMitra', 'keluargaIndonesia', 'keluargaJepang', 'kontakKeluarga', 'pengalamanKerja', 'pendidikan']));
            } catch (\Illuminate\Validation\ValidationException $e) {
                return response()->json(['message' => 'Validation Error', 'errors' => $e->errors()], 422);
            } catch (\Exception $e) {
                return response()->json(['message' => 'Server Error', 'details' => $e->getMessage()], 500);
            }
        });
    }

    public function destroy($id)
    {
        Siswa::destroy($id);
        return response()->json(null, 204);
    }
}

