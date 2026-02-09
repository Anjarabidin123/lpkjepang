<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\InternalPayment;

class InternalPaymentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $canManage = $user->hasPermission('finance_access') || $user->roles->contains('name', 'super_admin');
        
        $query = InternalPayment::with(['siswa', 'itemPembayaran']);

        // PRIVACY LOCK: Students only see their own payments
        if (!$canManage && $user->roles->contains('name', 'student')) {
            $siswa = $user->siswa;
            if (!$siswa) return response()->json([]);
            $query->where('siswa_id', $siswa->id);
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswas,id',
            'item_pembayaran_id' => 'required|exists:item_pembayaran,id',
            'nominal' => 'required|numeric|min:1',
            'tanggal_pembayaran' => 'required|date',
            'metode_pembayaran' => 'nullable|string',
            'referensi_transaksi' => 'nullable|string',
            'keterangan' => 'nullable|string',
            'status' => 'nullable|string',
        ]);

        // TRANSACTION START (Prevent Race Condition Overpayment)
        $data = \Illuminate\Support\Facades\DB::transaction(function () use ($validated) {
            
            // 1. Lock the student's specific obligation
            $kewajiban = \App\Models\KewajibanPembayaran::where('siswa_id', $validated['siswa_id'])
                ->where('item_pembayaran_id', $validated['item_pembayaran_id'])
                ->lockForUpdate()
                ->first();

            if (!$kewajiban) {
                throw new \Exception("Tagihan untuk siswa ini belum diinisialisasi.");
            }
            
            // 2. Prevent Overpayment
            if ($validated['nominal'] > $kewajiban->sisa_kewajiban) {
                return response()->json([
                    'message' => 'Pembayaran melebihi sisa tagihan! Sisa tagihan: Rp ' . number_format($kewajiban->sisa_kewajiban, 0, ',', '.'),
                    'remaining' => $kewajiban->sisa_kewajiban
                ], 422)->throwResponse();
            }

            // 3. Create Payment Record
            $payment = InternalPayment::create($validated);

            // 4. Update Obligation State
            $kewajiban->nominal_terbayar += $validated['nominal'];
            $kewajiban->sisa_kewajiban = $kewajiban->nominal_wajib - $kewajiban->nominal_terbayar;
            $kewajiban->status = $kewajiban->sisa_kewajiban <= 0 ? 'Lunas' : 'Cicilan';
            $kewajiban->save();

            return $payment;
        });
        
        return response()->json($data->load(['siswa', 'itemPembayaran']), 201);
    }

    public function show($id)
    {
        return response()->json(InternalPayment::with(['siswa', 'itemPembayaran'])->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $data = InternalPayment::findOrFail($id);
        
        // FINANCIAL INTEGRITY: Prevent changing amount or target if value is different
        // Allow sending same value (idempotent), but reject different value.
        if (
            ($request->has('nominal') && (float)$request->nominal != (float)$data->nominal) ||
            ($request->has('siswa_id') && (int)$request->siswa_id != (int)$data->siswa_id) ||
            ($request->has('item_pembayaran_id') && (int)$request->item_pembayaran_id != (int)$data->item_pembayaran_id)
        ) {
             return response()->json([
                 'message' => 'Integritas Keuangan: Nominal, Siswa, dan Item Pembayaran tidak dapat diubah (Nilai berbeda terdeteksi). Silakan hapus & buat baru jika terjadi kesalahan input.'
             ], 403);
        }
        
        $validated = $request->validate([
            'tanggal_pembayaran' => 'sometimes|required|date',
            'metode_pembayaran' => 'nullable|string',
            'referensi_transaksi' => 'nullable|string',
            'keterangan' => 'nullable|string',
            'status' => 'nullable|string', // Status update allowed? Maybe just auto calculcated. But manual override okay.
        ]);

        $data->update($validated);
        
        // Log update
        \Illuminate\Support\Facades\Log::info("Payment ID {$id} updated by user " . $request->user()->id);

        return response()->json($data->load(['siswa', 'itemPembayaran']));
    }

    public function destroy(Request $request, $id)
    {
        $data = InternalPayment::findOrFail($id);
        
        // SECURITY: Only Super Admin can delete financial records
        $user = $request->user();
        if (!$user->roles->contains('name', 'super_admin')) {
             return response()->json(['message' => 'Hanya Super Admin yang dapat menghapus data pembayaran.'], 403);
        }

        // AUDIT TRAIL
        \Illuminate\Support\Facades\Log::warning("FINANCIAL ALERT: Payment ID {$id} (Nominal: {$data->nominal}) deleted by Super Admin {$user->email}");

        $data->delete();
        return response()->json(null, 204);
    }
}
