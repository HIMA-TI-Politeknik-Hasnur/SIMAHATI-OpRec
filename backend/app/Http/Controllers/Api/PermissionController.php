<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Permission;

class PermissionController extends Controller
{
    public function index()
    {
        $permissions = Permission::all(['id', 'name', 'guard_name']);

        return response()->json([
            'success' => true,
            'data' => $permissions,
        ]);
    }
}
