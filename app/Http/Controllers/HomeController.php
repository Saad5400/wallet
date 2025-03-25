<?php

namespace App\Http\Controllers;

use App\Enums\RecordType;
use App\Models\Tenant;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request): \Inertia\Response
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

        $balance = $tenant->records()
            ->where('occurred_at', '<=', $endDate)
            ->sum('amount');

        $income = $tenant->records()
            ->whereBetween('occurred_at', [$startDate, $endDate])
            ->where('type', RecordType::income)
            ->sum('amount');

        $expense = $tenant->records()
            ->whereBetween('occurred_at', [$startDate, $endDate])
            ->where('type', RecordType::expense)
            ->sum('amount');


        $totalDays = $startDate->diffInDays($endDate);
        $segmentSize = (int) ceil($totalDays / 12);

        $balanceChartData = [];
        $incomeChartData = [];
        $expenseChartData = [];

        $currentDate = $startDate->copy();

        for ($i = 0; $i < 12; $i++) {
            $nextDate = $currentDate->copy()->addDays($segmentSize);

            $balanceChartData[] = [
                'date' => $currentDate->copy()->toDateString(),
                'value' => $tenant->records()
                    ->where('occurred_at', '<=', $nextDate)
                    ->sum('amount'),
            ];

            $incomeChartData[] = [
                'date' => $currentDate->copy()->toDateString(),
                'value' => $tenant->records()
                    ->whereBetween('occurred_at', [$currentDate, $nextDate])
                    ->where('type', RecordType::income)
                    ->sum('amount'),
            ];

            $expenseChartData[] = [
                'date' => $currentDate->copy()->toDateString(),
                'value' => $tenant->records()
                    ->whereBetween('occurred_at', [$currentDate, $nextDate])
                    ->where('type', RecordType::expense)
                    ->sum('amount'),
            ];

            $currentDate = $nextDate;
        }

        return Inertia::render('App/Index', [
            'balance' => [
                'value' => $balance,
                'chartData' => $balanceChartData,
            ],
            'income' => [
                'value' => $income,
                'chartData' => $incomeChartData,
            ],
            'expense' => [
                'value' => $expense,
                'chartData' => $expenseChartData,
            ],
            'defaultPeriod' => [
                'startDate' => $startDate->toISOString(),
                'endDate' => $endDate->toISOString(),
            ],
        ]);
    }
}
