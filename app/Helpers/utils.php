<?php

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\URL;

if (!function_exists('homeRedirect')) {
    /**
     * Redirect the user to the appropriate page.
     *
     * If the user is authenticated, they are redirected to the home page.
     * Otherwise, they are redirected to the welcome page.
     *
     * @return RedirectResponse
     */
    function homeRedirect(): RedirectResponse
    {
        if (Auth::guest())
            return redirect()->route('welcome.index');

        $tenant = Auth::user()->tenants->first();
        return redirect()->route('home', ['tenant' => $tenant->id]);
    }

    /**
     * Check if the application is running in local or testing environment.
     *
     * @return bool
     */
    function isLocalOrTesting(): bool
    {
        return in_array(config('app.env'), ['local', 'testing']);
    }
}
