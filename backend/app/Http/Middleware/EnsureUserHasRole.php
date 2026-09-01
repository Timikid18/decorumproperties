<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request. Signature: role:super-admin|admin
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        foreach ($roles as $role) {
            foreach (explode('|', $role) as $slug) {
                if ($user->hasRole(trim($slug))) {
                    return $next($request);
                }
            }
        }

        return response()->json([
            'success' => false,
            'message' => 'You are not authorized to access this area.',
        ], 403);
    }
}