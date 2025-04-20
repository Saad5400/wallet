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
use Illuminate\Support\Facades\Log;

class HomeController extends Controller
{
    public function index(Request $request): \Inertia\Response
    {
        $tenant = tenant();

        // Resolve start and end dates based on request or tenant defaults
        [$startDate, $endDate, $isDefaultPeriod] = $this->resolveDateRange($request, $tenant);

        // Get financial data for the selected period
        $financialData = $this->getFinancialData($tenant, $startDate, $endDate);

        // Get latest 10 records with account, category, and subcategory info
        $latestRecords = $tenant->records()
            ->with(['account', 'category', 'subCategory'])
            ->orderBy('occurred_at', 'desc')
            ->limit(10)
            ->get();

        // Get expense categories data with subcategories
        $expenseCategories = $this->getExpenseCategories($tenant, $startDate, $endDate);

        // Generate chart data for the selected period
        [$balanceChartData, $incomeChartData, $expenseChartData] = $this->generateChartData($tenant, $startDate, $endDate);

        return Inertia::render('App/Index', [
            'balance' => [
                'value' => $financialData['balance'],
                'chartData' => $balanceChartData,
            ],
            'income' => [
                'value' => $financialData['income'],
                'chartData' => $incomeChartData,
            ],
            'expense' => [
                'value' => $financialData['expense'],
                'chartData' => $expenseChartData,
            ],
            'defaultPeriod' => [
                'startDate' => $this->getDefaultStartDate($tenant)->toISOString(),
                'endDate' => $this->getDefaultEndDate($tenant)->toISOString(),
            ],
            'expenseCategories' => $expenseCategories,
            'latestRecords' => $latestRecords,
        ]);
    }

    /**
     * Get financial data (income, expense, balance) for a specific period.
     *
     * @param Tenant $tenant
     * @param Carbon $startDate
     * @param Carbon $endDate
     * @return array
     */
    private function getFinancialData(Tenant $tenant, Carbon $startDate, Carbon $endDate): array
    {
        $income = $tenant->records()
            ->whereBetween('occurred_at', [$startDate, $endDate])
            ->where('type', RecordType::income)
            ->sum('amount');

        $expense = $tenant->records()
            ->whereBetween('occurred_at', [$startDate, $endDate])
            ->where('type', RecordType::expense)
            ->sum('amount');

        $balance = $income - $expense;

        return [
            'income' => $income,
            'expense' => $expense,
            'balance' => $balance,
        ];
    }

    /**
     * Determines the start and end dates based on the request parameters or tenant defaults.
     * Returns whether the selected period is the default period.
     *
     * @param Request $request
     * @param Tenant $tenant
     * @return array [startDate, endDate, isDefaultPeriod]
     */
    private function resolveDateRange(Request $request, Tenant $tenant): array
    {
        $startDateParam = $request->get('startDate');
        $endDateParam = $request->get('endDate');

        $isDefaultPeriod = !($startDateParam && $endDateParam);

        if ($startDateParam && $endDateParam) {
            try {
                $startDate = Carbon::parse($startDateParam)->startOfDay();
                $endDate = Carbon::parse($endDateParam)->endOfDay();
                
                // Validate dates
                if ($startDate->greaterThan($endDate)) {
                    Log::warning('Invalid date range provided. Start date is after end date.', [
                        'startDate' => $startDateParam,
                        'endDate' => $endDateParam,
                    ]);
                    return [$this->getDefaultStartDate($tenant), $this->getDefaultEndDate($tenant), true];
                }
                
                return [$startDate, $endDate, false];
            } catch (\Exception $e) {
                Log::error('Error parsing date parameters', [
                    'startDate' => $startDateParam,
                    'endDate' => $endDateParam,
                    'error' => $e->getMessage(),
                ]);
                return [$this->getDefaultStartDate($tenant), $this->getDefaultEndDate($tenant), true];
            }
        }

        return [$this->getDefaultStartDate($tenant), $this->getDefaultEndDate($tenant), true];
    }
    
    /**
     * Get default start date based on tenant's month start day.
     *
     * @param Tenant $tenant
     * @return Carbon
     */
    private function getDefaultStartDate(Tenant $tenant): Carbon
    {
        $monthStartDay = $tenant->month_start_day ?? 27;
        $today = Carbon::now();

        if ($today->day < $monthStartDay) {
            return $today->copy()->subMonth()->day($monthStartDay)->startOfDay();
        }
        
        return $today->copy()->day($monthStartDay)->startOfDay();
    }
    
    /**
     * Get default end date based on tenant's month start day.
     *
     * @param Tenant $tenant
     * @return Carbon
     */
    private function getDefaultEndDate(Tenant $tenant): Carbon
    {
        return $this->getDefaultStartDate($tenant)->copy()->addMonth()->subSecond();
    }

    /**
     * Get expense categories with their subcategories for a given period.
     * 
     * @param Tenant $tenant
     * @param Carbon $startDate
     * @param Carbon $endDate
     * @return \Illuminate\Database\Eloquent\Collection
     */
    private function getExpenseCategories(Tenant $tenant, Carbon $startDate, Carbon $endDate)
    {
        // Cache key for expense categories data with subcategories
        $cacheKey = "tenant:{$tenant->id}:expenseCategoriesWithSubs:{$startDate->toDateString()}:{$endDate->toDateString()}";

        // Try to get data from cache first
        return Cache::remember($cacheKey, now()->addMinutes(10), function () use ($tenant, $startDate, $endDate) {
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
    }

    /**
     * Generate chart data for balance, income and expense over time.
     * 
     * @param Tenant $tenant
     * @param Carbon $startDate
     * @param Carbon $endDate
     * @return array
     */
    private function generateChartData(Tenant $tenant, Carbon $startDate, Carbon $endDate): array
    {
        // Cache key for chart data
        $cacheKey = "tenant:{$tenant->id}:chartData:{$startDate->toDateString()}:{$endDate->toDateString()}";

        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
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
                'balance' =>
                    $tenant->records()
                        ->where('occurred_at', '<=', $date->copy()->endOfDay())
                        ->where('type', RecordType::income)
                        ->sum('amount')
                    -
                    $tenant->records()
                        ->where('occurred_at', '<=', $date->copy()->endOfDay())
                        ->where('type', RecordType::expense)
                        ->sum('amount')
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

        $result = [$balanceChartData, $incomeChartData, $expenseChartData];

        // Cache results for one hour
        Cache::put($cacheKey, $result, now()->addHour());

        return $result;
    }
}
