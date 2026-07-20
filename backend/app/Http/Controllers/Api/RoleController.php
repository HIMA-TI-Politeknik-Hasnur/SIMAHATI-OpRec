<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\CreateRoleRequest;
use App\Http\Requests\Api\UpdateRoleRequest;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        $query = Role::query();

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $roles = $query->paginate($request->per_page ?? 10);

        $roles->getCollection()->transform(function ($role) {
            $role->permissions_count = $role->permissions()->count();
            return $role;
        });

        return response()->json([
            'success' => true,
            'data' => $roles->items(),
            'meta' => [
                'current_page' => $roles->currentPage(),
                'last_page' => $roles->lastPage(),
                'per_page' => $roles->perPage(),
                'total' => $roles->total(),
            ],
        ]);
    }

    public function store(CreateRoleRequest $request)
    {
        $role = Role::create([
            'name' => $request->name,
            'guard_name' => 'web',
        ]);

        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }

        return response()->json([
            'success' => true,
            'message' => 'Role berhasil dibuat.',
            'data' => $role,
        ], 201);
    }

    public function show(Role $role)
    {
        $role->load('permissions');

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $role->id,
                'name' => $role->name,
                'guard_name' => $role->guard_name,
                'permissions' => $role->permissions->map(fn($p) => [
                    'id' => $p->id,
                    'name' => $p->name,
                ]),
                'created_at' => $role->created_at,
                'updated_at' => $role->updated_at,
            ],
        ]);
    }

    public function update(UpdateRoleRequest $request, Role $role)
    {
        $role->update([
            'name' => $request->name,
        ]);

        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }

        return response()->json([
            'success' => true,
            'message' => 'Role berhasil diperbarui.',
            'data' => [
                'id' => $role->id,
                'name' => $role->name,
                'guard_name' => $role->guard_name,
                'updated_at' => $role->updated_at,
            ],
        ]);
    }

    public function destroy(Role $role)
    {
        if ($role->name === 'super_admin') {
            return response()->json([
                'message' => 'Role super_admin tidak dapat dihapus.',
            ], 400);
        }

        $role->permissions()->detach();
        $role->users()->detach();
        $role->delete();

        return response()->json([
            'success' => true,
            'message' => 'Role berhasil dihapus.',
        ]);
    }

    public function assignPermissions(Request $request, Role $role)
    {
        $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role->permissions()->syncWithoutDetaching($request->permissions);
        $role->load('permissions');

        return response()->json([
            'success' => true,
            'message' => 'Permission berhasil diberikan ke role.',
            'data' => [
                'role' => $role->name,
                'permissions' => $role->permissions->pluck('name'),
            ],
        ]);
    }

    public function assignRoleToUser(Request $request, User $user)
    {
        $request->validate([
            'roles' => 'required|array',
            'roles.*' => function ($attribute, $value, $fail) {
                if (is_int($value) || ctype_digit($value)) {
                    if (!Role::where('id', $value)->exists()) {
                        $fail("Role dengan ID {$value} tidak ditemukan.");
                    }
                } elseif (is_string($value)) {
                    if (!Role::where('name', $value)->exists()) {
                        $fail("Role \"{$value}\" tidak ditemukan.");
                    }
                } else {
                    $fail('Format role tidak valid.');
                }
            },
        ]);

        $roleIds = collect($request->roles)->map(function ($role) {
            if (is_int($role) || ctype_digit($role)) {
                return (int) $role;
            }
            return Role::where('name', $role)->value('id');
        });

        $user->roles()->sync($roleIds);
        $user->load('roles');

        return response()->json([
            'success' => true,
            'message' => 'Role berhasil diberikan ke user.',
            'data' => [
                'user_id' => $user->id,
                'name' => $user->name,
                'roles' => $user->roles->pluck('name'),
            ],
        ]);
    }
}
