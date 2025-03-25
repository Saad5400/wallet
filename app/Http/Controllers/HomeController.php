<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        /** @var Tenant $tenant */
        $tenant = tenant();

        $startDate = $request->get('startDate');
        $endDate = $request->get('endDate');

        if ($startDate && $endDate) {
            $startDate = Carbon::parse($startDate)->startOfDay();
            $endDate = Carbon::parse($endDate)->endOfDay();
        } else {
            $monthStartDay = $tenant->month_start_day ?? 27;
            $today = Carbon::now();

            if ($today->day < $monthStartDay) {
                $startDate = $today->copy()->subMonth()->day($monthStartDay)->startOfDay();
            } else {
                $startDate = $today->copy()->day($monthStartDay)->startOfDay();
            }

            $endDate = $startDate->copy()->addMonth()->subSecond();
        }

        return Inertia::render('App/Index', [
            'balance' => 0,
            'income' => 0,
            'expense' => 0,
            'defaultPeriod' => [
                'startDate' => $startDate->toISOString(),
                'endDate' => $endDate->toISOString(),
            ],
        ]);
    }
}
