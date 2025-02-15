<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Symfony\Component\HttpFoundation\Response;

class AuthorizeUserToTenant
{
    /**
     * Authorize the tenant.
     * 
     * This middleware ensures that the current user is authorized to access the current tenant.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $tenant = tenant();

        if (is_null($user) || !$user->tenants->contains($tenant)) {
            return redirect()->route('welcome.index');
        }

        return $next($request);
    }
}
