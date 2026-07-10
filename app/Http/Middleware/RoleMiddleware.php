<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        // Trim tiap role agar "role:Admin, AdminSD" (dengan spasi) tetap cocok.
        $roles = array_map('trim', $roles);

        if (!$user || !in_array($user->role, $roles, true)) {
            // Kalau belum login atau role tidak sesuai
            abort(403, 'Unauthorized');
        }
        return $next($request);
    }
}
