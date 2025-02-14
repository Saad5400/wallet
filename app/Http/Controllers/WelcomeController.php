<?php

namespace App\Http\Controllers;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function index()
    {
        return Inertia::render('Welcome/Page');
    }

    public function email()
    {
        return Inertia::render('Welcome/Email/Page');
    }
}
