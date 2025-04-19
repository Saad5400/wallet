<?php

namespace App\Http\Controllers;

use App\Enums\RecordType;
use App\Models\Tenant;
use App\Models\Category;
use Carbon\Carbon;
use DateInterval;
use DatePeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request): \Inertia\Response
    {
        $tenant = tenant();

        // Resolve start and end dates based on request or tenant defaults
        [$startDate, $endDate] = $this->resolveDateRange($request, $tenant);

        // Compute overall totals
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
            
        // Get latest 10 records with account, category, and subcategory info
        $latestRecords = $tenant->records()
            ->with(['account', 'category', 'subCategory'])
            ->orderBy('occurred_at', 'desc')
            ->limit(10)
            ->get();

        // Cache key for expense categories data with subcategories
        $cacheKey = "tenant:{$tenant->id}:expenseCategoriesWithSubs:{$startDate->toDateString()}:{$endDate->toDateString()}";
        
        // Try to get data from cache first
        $expenseCategories = Cache::remember($cacheKey, now()->addMinutes(10), function () use ($tenant, $startDate, $endDate) {
            // Get top expense categories
            return Category::where('tenant_id', $tenant->id)
                ->where('type', RecordType::expense)
                ->has('records')
                ->withSum(['records as total' => function ($query) use ($startDate, $endDate) {
                    $query->whereBetween('occurred_at', [$startDate, $endDate])
                          ->where('type', RecordType::expense);
                }], 'amount')
                ->with(['subCategories' => function ($query) {
                    $query->withSum('records', 'amount')
                          ->orderByDesc('records_sum_amount');
                }])
                ->orderByDesc('total')
                ->limit(6)
                ->get()
                ->map(function ($category) use ($startDate, $endDate) {
                    // Get subcategories with their expense totals for this period
                    $subCategories = $category->subCategories
                        ->map(function ($subCategory) use ($startDate, $endDate) {
                            // Calculate the total for this specific subcategory within the date range
                            $total = $subCategory->records()
                                ->whereBetween('occurred_at', [$startDate, $endDate])
                                ->where('type', RecordType::expense)
                                ->sum('amount');
                            
                            return [
                                'id' => $subCategory->id,
                                'name' => $subCategory->name,
                                'total' => (float) abs($total), // Expense is negative, so we use abs
                            ];
                        })
                        ->filter(function ($subCategory) {
                            return $subCategory['total'] > 0; // Only include subcategories with expenses
                        })
                        ->values();
                    
                    return [
                        'id' => $category->id,
                        'name' => $category->name,
                        'total' => (float) abs($category->total), // Expense is negative, so we use abs
                        'subCategories' => $subCategories,
                    ];
                });
        });

        // Generate cumulative chart data for a 30-day period ending at $endDate
        [$balanceChartData, $incomeChartData, $expenseChartData] = $this->generateChartData($tenant, $startDate, $endDate);

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
            'expenseCategories' => $expenseCategories,
            'latestRecords' => $latestRecords,
        ]);
    }

    /**
     * Determines the start and end dates based on the request parameters or tenant defaults.
     *
     * @param Request $request
     * @param Tenant $tenant
     * @return array [startDate, endDate]
     */
    private function resolveDateRange(Request $request, Tenant $tenant): array
    {
        $startDateParam = $request->get('startDate');
        $endDateParam = $request->get('endDate');

        if ($startDateParam && $endDateParam) {
            $startDate = Carbon::parse($startDateParam)->startOfDay();
            $endDate = Carbon::parse($endDateParam)->endOfDay();
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

        return [$startDate, $endDate];
    }

    private function generateChartData(Tenant $tenant, Carbon $startDate, Carbon $endDate): array
    {
        // Try to load from cache first
        $balanceChartData = Cache::get("tenant:{$tenant->id}:balanceChartData");
        $incomeChartData = Cache::get("tenant:{$tenant->id}:incomeChartData");
        $expenseChartData = Cache::get("tenant:{$tenant->id}:expenseChartData");

        if ($balanceChartData && $incomeChartData && $expenseChartData) {
            // ✅ Cached data found, return it directly
            return [$balanceChartData, $incomeChartData, $expenseChartData];
        }

        $daysCount = $startDate->diffInDays($endDate);

        // Ensure we do not go beyond today's date
        $today = Carbon::today()->endOfDay();
        if ($endDate->greaterThan($today)) {
            $endDate = $today;
        }

        $balanceChartData = [];
        $incomeChartData = [];
        $expenseChartData = [];

        $chartStartDate = $endDate->copy()->subDays($daysCount);

        $period = new DatePeriod($chartStartDate, new DateInterval('P1D'), $endDate);

        foreach ($period as $date) {
            $date = Carbon::parse($date);

            $balanceChartData[] = [
                'month' => $date->toDateString(),
                'balance' => $tenant->records()
                    ->where('occurred_at', '<=', $date->copy()->endOfDay())
                    ->sum('amount'),
            ];

            $incomeChartData[] = [
                'month' => $date->toDateString(),
                'income' => $tenant->records()
                    ->where('type', RecordType::income)
                    ->whereBetween('occurred_at', [$date->copy()->startOfDay(), $date->copy()->endOfDay()])
                    ->sum('amount')
            ];

            $expenseChartData[] = [
                'month' => $date->toDateString(),
                'expense' => $tenant->records()
                    ->where('type', RecordType::expense)
                    ->whereBetween('occurred_at', [$date->copy()->startOfDay(), $date->copy()->endOfDay()])
                    ->sum('amount')
            ];
        }

        Cache::put("tenant:{$tenant->id}:balanceChartData", $balanceChartData, now()->addHour());
        Cache::put("tenant:{$tenant->id}:incomeChartData", $incomeChartData, now()->addHour());
        Cache::put("tenant:{$tenant->id}:expenseChartData", $expenseChartData, now()->addHour());

        return [$balanceChartData, $incomeChartData, $expenseChartData];
    }
}
