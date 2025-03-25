<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        /** @var Tenant $tenant */
        $tenant = tenant();
        
        return Inertia::render('App/Index', [
            'balance' => 0,
            'income' => 0,
            'expense' => 0,
        ]);
    }
}
