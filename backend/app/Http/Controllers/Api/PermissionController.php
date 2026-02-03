<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Permission;

class PermissionController extends Controller
{
    public function index()
    {
        return response()->json(Permission::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate(['name' => 'required|unique:permissions,name']);
        return response()->json(Permission::create($request->all()), 201);
    }

    public function destroy($id)
    {
        Permission::destroy($id);
        return response()->json(null, 204);
    }
}
