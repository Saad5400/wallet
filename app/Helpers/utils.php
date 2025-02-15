<?php

use Illuminate\Http\RedirectResponse;

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

        return redirect()->route('home', ['tenant' => Auth::user()->tenants->first()->id]);
    }
}
