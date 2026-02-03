<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     * 
     * Usage: ->middleware('role:admin,moderator')
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Check if user is authenticated
        if (!$request->user()) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }

        // Get user with roles
        $user = $request->user()->load('roles');

        // Check if user has any of the required roles
        $userRoles = $user->roles->pluck('name')->toArray();
        
        // Super admin has access to everything
        if (in_array('super_admin', $userRoles)) {
            return $next($request);
        }
        
        foreach ($roles as $role) {
            if (in_array($role, $userRoles)) {
                return $next($request);
            }
        }

        // User doesn't have required role
        return response()->json([
            'message' => 'Forbidden. Required role: ' . implode(' or ', $roles),
            'your_roles' => $userRoles
        ], 403);
    }
}
