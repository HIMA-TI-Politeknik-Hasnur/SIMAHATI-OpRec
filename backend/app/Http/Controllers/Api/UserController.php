<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::with('roles')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($u) => [
                'id'                => $u->id,
                'name'              => $u->name,
                'email'             => $u->email,
                'roles'             => $u->roles->pluck('slug'),
                'email_verified_at' => $u->email_verified_at,
                'created_at'        => $u->created_at,
            ]);

        return response()->json([
            'success' => true,
            'data'    => $users,
        ]);
    }

    public function unverified(): JsonResponse
    {
        $users = User::whereNull('email_verified_at')
            ->with('roles')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($u) => [
                'id'            => $u->id,
                'name'          => $u->name,
                'email'         => $u->email,
                'roles'         => $u->roles->pluck('slug'),
                'created_at'    => $u->created_at,
            ]);

        return response()->json([
            'success' => true,
            'data'    => $users,
        ]);
    }

    public function verifyEmail(Request $request, User $user): JsonResponse
    {
        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'success' => false,
                'message' => 'Email user ini sudah diverifikasi.',
            ], 400);
        }

        $user->markEmailAsVerified();

        return response()->json([
            'success' => true,
            'message' => "Email {$user->email} berhasil diverifikasi.",
        ]);
    }
}
