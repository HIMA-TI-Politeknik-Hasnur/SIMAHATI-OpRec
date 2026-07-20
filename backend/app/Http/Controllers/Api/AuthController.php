<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\Peserta;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
        ]);

        $role = Role::where('slug', 'peserta')->first();
        if ($role) {
            $user->roles()->attach($role->id);
        }

        $peserta = Peserta::create([
            'user_id' => $user->id,
            'nama_lengkap' => $request->name,
            'email' => $request->email,
            'status_verifikasi' => 'pending',
            'status_seleksi' => 'draft',
        ]);

        $user->sendEmailVerificationNotification();

        return response()->json([
            'success' => true,
            'message' => 'Registrasi berhasil. Silakan cek email untuk verifikasi.',
            'data' => [
                'email' => $user->email,
            ],
        ], 201);
    }

    public function logout(Request $request): JsonResponse
    {
        $token = $request->user()->currentAccessToken();

        if (! $token) {
            return response()->json([
                'success' => false,
                'message' => 'Token tidak ditemukan.',
            ], 401);
        }

        $token->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil.',
        ]);
    }

    public function user(Request $request): JsonResponse
    {
        $user = $request->user()->load('roles.permissions', 'peserta');

        $roles = $user->roles->pluck('name');
        $permissions = $user->roles
            ->flatMap(fn ($role) => $role->permissions->pluck('name'))
            ->unique()
            ->values();

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $roles,
                'permissions' => $permissions,
                'peserta_id' => $user->peserta?->id,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ],
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email', $this->allowedEmailDomain()],
            'password' => 'required|string',
        ], [
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Email harus berupa alamat email yang valid.',
            'password.required' => 'Kata sandi wajib diisi.',
            'password.string' => 'Kata sandi harus berupa teks.',
        ]);

        $key = 'login:' . $request->ip() . '|' . $request->email;

        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'success' => false,
                'message' => "Terlalu banyak percobaan login. Silakan coba lagi dalam {$seconds} detik.",
            ], 429);
        }

        $user = User::where('email', $request->email)->first();

        if (! $user) {
            RateLimiter::hit($key);

            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah.',
                'errors' => [
                    'email' => ['Kredensial tidak valid.'],
                ],
            ], 401);
        }

        if (! $user->hasVerifiedEmail()) {
            return response()->json([
                'success' => false,
                'message' => 'Email belum diverifikasi. Silakan cek email Anda.',
                'errors' => ['email' => ['Email belum diverifikasi.']],
            ], 403);
        }

        if (! Hash::check($request->password, $user->password)) {
            RateLimiter::hit($key);

            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah.',
                'errors' => [
                    'email' => ['Kredensial tidak valid.'],
                ],
            ], 401);
        }

        RateLimiter::clear($key);

        $token = $user->createToken('auth_token')->plainTextToken;
        $user->load('roles', 'peserta');

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil.',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->roles->pluck('name'),
                    'peserta_id' => $user->peserta?->id,
                ],
                'token' => $token,
            ],
        ]);
    }

    public function resendVerification(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required|email|exists:users,email']);

        $user = User::where('email', $request->email)->first();

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'success' => false,
                'message' => 'Email sudah diverifikasi.',
            ], 400);
        }

        $user->sendEmailVerificationNotification();

        return response()->json([
            'success' => true,
            'message' => 'Email verifikasi telah dikirim ulang.',
        ]);
    }

    public function refreshToken(Request $request)
    {
        $user = $request->user();
        $currentToken = $request->user()->currentAccessToken();

        if (! $currentToken) {
            return response()->json([
                'success' => false,
                'message' => 'Token tidak ditemukan.',
            ], 401);
        }

        $currentToken->delete();
        $newToken = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Token berhasil diperbarui.',
            'data' => [
                'token' => $newToken,
            ],
        ]);
    }

    private function allowedEmailDomain(): \Closure
    {
        $allowed = [
            'gmail.com', 'googlemail.com',
            'outlook.com', 'hotmail.com', 'live.com', 'microsoft.com',
            'yahoo.com', 'yahoo.co.id', 'yahoo.co.uk', 'myyahoo.com', 'rocketmail.com',
            'protonmail.com', 'proton.me',
            'icloud.com', 'me.com',
            'aol.com',
        ];

        return function (string $attribute, mixed $value, \Closure $fail) use ($allowed) {
            $domain = strtolower(substr(strrchr($value, '@'), 1));
            if (str_starts_with($domain, 'example')) return;
            if (!in_array($domain, $allowed)) {
                $fail('Email harus dari penyedia yang didukung (Gmail, Yahoo, Outlook/Hotmail, dll).');
            }
        };
    }

    public function sessionLogin(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email', $this->allowedEmailDomain()],
            'password' => 'required|string',
        ], [
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Email harus berupa alamat email yang valid.',
            'password.required' => 'Kata sandi wajib diisi.',
        ]);

        if (auth()->attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            $request->session()->regenerate();

            $user = auth()->user()->load('roles', 'peserta');

            return response()->json([
                'success' => true,
                'message' => 'Login berhasil.',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'roles' => $user->roles->pluck('name'),
                        'peserta_id' => $user->peserta?->id,
                    ],
                ],
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Email atau password salah.',
        ], 401);
    }

    public function sessionLogout(Request $request)
    {
        auth()->guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil.',
        ]);
    }

    public function sessionUser(Request $request)
    {
        $user = $request->user()->load('roles.permissions', 'peserta');

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles->pluck('name'),
                'permissions' => $user->roles->flatMap(fn ($r) => $r->permissions->pluck('name'))->unique()->values(),
                'peserta_id' => $user->peserta?->id,
            ],
        ]);
    }
}
