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
            'income' => $tenant->records->where('type', 'income')->sum('amount'),
        ]);
    }
}
