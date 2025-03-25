<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {

        /** @var Tenant $tenant */
        $tenant = tenant();

        return Inertia::render('App/Index', [
            'balance' => $tenant->balance,
            'income' => 1341,
            'expense' => 123,
        ]);
    }
}
