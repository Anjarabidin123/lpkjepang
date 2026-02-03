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
        return response()->json(Invoice::with(['kumiai', 'invoiceItems.siswaMagang.siswa'])->orderBy('tanggal_invoice', 'desc')->get());
    }

    public function store(Request $request)
    {
        return DB::transaction(function () use ($request) {
            $invoice = Invoice::create($request->only([
                'kumiai_id', 'nomor_invoice', 'nominal', 'tanggal_invoice', 
                'tanggal_jatuh_tempo', 'keterangan', 'status'
            ]));

            if ($request->has('invoice_items')) {
                foreach ($request->invoice_items as $item) {
                    $invoice->invoiceItems()->create($item);
                }
            }

            return response()->json($invoice->load('invoiceItems'), 201);
        });
    }

    public function show($id)
    {
        return response()->json(Invoice::with(['kumiai', 'invoiceItems.siswaMagang.siswa'])->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        return DB::transaction(function () use ($request, $id) {
            $invoice = Invoice::findOrFail($id);
            $invoice->update($request->only([
                'kumiai_id', 'nomor_invoice', 'nominal', 'tanggal_invoice', 
                'tanggal_jatuh_tempo', 'keterangan', 'status'
            ]));

            if ($request->has('invoice_items')) {
                $invoice->invoiceItems()->delete();
                foreach ($request->invoice_items as $item) {
                    $invoice->invoiceItems()->create($item);
                }
            }

            return response()->json($invoice->load('invoiceItems'));
        });
    }

    public function destroy($id)
    {
        Invoice::destroy($id);
        return response()->json(null, 204);
    }
}
