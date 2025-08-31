<?php

namespace App\Http\Controllers;

use App\Models\User;
use Firebase\JWT\JWT;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    private function issueToken(int $userId): string
    {
        $now = time();
        $payload = [
            'sub' => $userId,
            'iat' => $now,
            'exp' => $now + 3600,  // 1 hour
        ];
        return JWT::encode($payload, env('JWT_SECRET'), 'HS256');
    }

    // POST /api/register
    public function register(Request $request)
    {
        $this->validate($request, [
            'name'     => 'required|string',
            'email'    => 'required|email|unique:users',
            'password' => 'required|min:6',
        ]);

        $user = User::create([
            'name'     => $request->input('name'),
            'email'    => strtolower($request->input('email')),
            'password' => Hash::make($request->input('password')),
        ]);

        return response()->json([
            'user'  => $user,
            'token' => $this->issueToken($user->id),
        ], 201);
    }

    // POST /api/login
    public function login(Request $request)
    {
        $this->validate($request, [
            'email'    => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        $email = mb_strtolower(trim((string) $request->input('email')));
        $plain = trim((string) $request->input('password'));   // <- trim the password too

        $user = User::whereRaw('LOWER(email) = ?', [$email])->first();

        // Extra debug: do we fail on the hash check?
        $hashOk = $user ? \Hash::check($plain, (string) $user->password) : false;
        \Log::info('login_check', [
            'email' => $email,
            'found' => (bool) $user,
            'pass_len' => strlen($plain),
            'hash_ok' => $hashOk,
        ]);

        if (!$user || !$hashOk) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $this->issueToken($user->id);

        return response()->json([
            'user'  => ['id' => $user->id, 'name' => $user->name, 'email' => $user->email],
            'token' => $token,
        ]);
    }
}
