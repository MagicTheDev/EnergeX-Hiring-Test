<?php

namespace App\Http\Middleware;

use Closure;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Models\User;

class JwtMiddleware
{
    public function handle($request, Closure $next)
    {
        $auth = $request->header('Authorization');
        if (!$auth || !preg_match('/^Bearer\s+(.+)$/i', $auth, $m)) {
            return response()->json(['message' => 'Missing or invalid Authorization header'], 401);
        }

        $token = $m[1];

        try {
            $decoded = JWT::decode($token, new Key(env('JWT_SECRET'), 'HS256'));
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Invalid token'], 401);
        }

        $userId = $decoded->sub ?? null;
        if (!$userId) {
            return response()->json(['message' => 'Invalid token payload'], 401);
        }

        $user = User::find($userId);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 401);
        }

        $request->attributes->set('auth_user', $user);

        return $next($request);
    }
}
