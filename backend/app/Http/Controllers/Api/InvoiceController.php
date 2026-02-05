<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    public function index()
    {
        return response()->json(Invoice::with(['kumiai', 'invoice_items.siswa_magang.siswa'])->orderBy('tanggal_invoice', 'desc')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'kumiai_id' => 'required|exists:kumiais,id',
            'nomor_invoice' => 'required|string|unique:invoices,nomor_invoice',
            'nominal' => 'required|numeric',
            'tanggal_invoice' => 'required|date',
            'tanggal_jatuh_tempo' => 'required|date',
            'invoice_items' => 'array',
        ]);

        return DB::transaction(function () use ($request) {
            $data = $request->only([
                'kumiai_id', 'nomor_invoice', 'nominal', 'tanggal_invoice', 
                'tanggal_jatuh_tempo', 'keterangan', 'status'
            ]);

            // Auto-calculate nominal from items if items exist
            if ($request->has('invoice_items') && !empty($request->invoice_items)) {
                $total = collect($request->invoice_items)->sum('nominal_fee');
                if ($total > 0) {
                    $data['nominal'] = $total;
                }
            }

            $invoice = Invoice::create($data);

            if ($request->has('invoice_items')) {
                foreach ($request->invoice_items as $item) {
                    $invoice->invoice_items()->create($item);
                }
            }

            return response()->json($invoice->load('invoice_items'), 201);
        });
    }

    public function show($id)
    {
        return response()->json(Invoice::with(['kumiai', 'invoice_items.siswa_magang.siswa'])->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'kumiai_id' => 'sometimes|required|exists:kumiais,id',
            'nomor_invoice' => 'sometimes|required|string|unique:invoices,nomor_invoice,'.$id,
            'nominal' => 'sometimes|required|numeric',
            'tanggal_invoice' => 'sometimes|required|date',
            'tanggal_jatuh_tempo' => 'sometimes|required|date',
            'invoice_items' => 'array',
        ]);

        return DB::transaction(function () use ($request, $id) {
            $invoice = Invoice::findOrFail($id);
            $data = $request->only([
                'kumiai_id', 'nomor_invoice', 'nominal', 'tanggal_invoice', 
                'tanggal_jatuh_tempo', 'keterangan', 'status'
            ]);

            // Auto-calculate nominal from items if items exist
            if ($request->has('invoice_items') && !empty($request->invoice_items)) {
                $total = collect($request->invoice_items)->sum('nominal_fee');
                if ($total > 0) {
                    $data['nominal'] = $total;
                }
            }

            $invoice->update($data);

            if ($request->has('invoice_items')) {
                $invoice->invoice_items()->delete();
                foreach ($request->invoice_items as $item) {
                    $invoice->invoice_items()->create($item);
                }
            }

            return response()->json($invoice->load('invoice_items'));
        });
    }

    public function destroy($id)
    {
        Invoice::destroy($id);
        return response()->json(null, 204);
    }
}
