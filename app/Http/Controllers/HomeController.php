<?php

namespace App\Http\Controllers;

use App\Enums\RecordType;
use App\Models\Tenant;
use App\Models\Category;
use Carbon\Carbon;
use DateInterval;
use DatePeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Show the home dashboard with financial data.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function index(Request $request): \Inertia\Response
    {
        $tenant = tenant();

        // Resolve start and end dates based on request or tenant defaults
        [$startDate, $endDate] = $this->resolveDateRange($request, $tenant);

        // Get all the data needed for the dashboard
        $financialData = $this->getFinancialData($tenant, $startDate, $endDate);
        $latestRecords = $this->getLatestRecords($tenant);
        $expenseCategories = $this->getExpenseCategories($tenant, $startDate, $endDate);
        $chartData = $this->generateChartData($tenant, $startDate, $endDate);

        return Inertia::render('App/Index', [
            'balance' => [
                'value' => $financialData['balance'],
                'chartData' => $chartData['balance'],
            ],
            'income' => [
                'value' => $financialData['income'],
                'chartData' => $chartData['income'],
            ],
            'expense' => [
                'value' => $financialData['expense'],
                'chartData' => $chartData['expense'],
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
     * Get latest records with their related data.
     *
     * @param Tenant $tenant
     * @return \Illuminate\Database\Eloquent\Collection
     */
    private function getLatestRecords(Tenant $tenant)
    {
        return $tenant->records()
            ->with(['account', 'category', 'subCategory'])
            ->orderBy('occurred_at', 'desc')
            ->limit(10)
            ->get();
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
     *
     * @param Request $request
     * @param Tenant $tenant
     * @return array [Carbon $startDate, Carbon $endDate]
     */
    private function resolveDateRange(Request $request, Tenant $tenant): array
    {
        $startDateParam = $request->get('startDate');
        $endDateParam = $request->get('endDate');

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
                    return [$this->getDefaultStartDate($tenant), $this->getDefaultEndDate($tenant)];
                }
                
                return [$startDate, $endDate];
            } catch (\Exception $e) {
                Log::error('Error parsing date parameters', [
                    'startDate' => $startDateParam,
                    'endDate' => $endDateParam,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return [$this->getDefaultStartDate($tenant), $this->getDefaultEndDate($tenant)];
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
        $period = new DatePeriod($chartStartDate, new DateInterval('P1D'), $endDate->addDay());

        foreach ($period as $date) {
            $date = Carbon::parse($date);
            $dateString = $date->toDateString();

            // Calculate balance up to this date (cumulative)
            $balanceChartData[] = [
                'month' => $dateString,
                'balance' => $this->getBalanceUpToDate($tenant, $date)
            ];

            // Calculate income/expense for this specific day
            $incomeChartData[] = [
                'month' => $dateString,
                'income' => $this->getDailyIncome($tenant, $date)
            ];

            $expenseChartData[] = [
                'month' => $dateString,
                'expense' => $this->getDailyExpense($tenant, $date)
            ];
        }

        return [
            'balance' => $balanceChartData,
            'income' => $incomeChartData,
            'expense' => $expenseChartData
        ];
    }

    /**
     * Get total balance up to a specific date.
     *
     * @param Tenant $tenant
     * @param Carbon $date
     * @return float
     */
    private function getBalanceUpToDate(Tenant $tenant, Carbon $date): float
    {
        $income = $tenant->records()
            ->where('occurred_at', '<=', $date->copy()->endOfDay())
            ->where('type', RecordType::income)
            ->sum('amount');
            
        $expense = $tenant->records()
            ->where('occurred_at', '<=', $date->copy()->endOfDay())
            ->where('type', RecordType::expense)
            ->sum('amount');
            
        return $income - $expense;
    }

    /**
     * Get income for a specific day.
     *
     * @param Tenant $tenant
     * @param Carbon $date
     * @return float
     */
    private function getDailyIncome(Tenant $tenant, Carbon $date): float
    {
        return $tenant->records()
            ->whereBetween('occurred_at', [
                $date->copy()->startOfDay(), 
                $date->copy()->endOfDay()
            ])
            ->where('type', RecordType::income)
            ->sum('amount');
    }

    /**
     * Get expense for a specific day.
     *
     * @param Tenant $tenant
     * @param Carbon $date
     * @return float
     */
    private function getDailyExpense(Tenant $tenant, Carbon $date): float
    {
        return $tenant->records()
            ->whereBetween('occurred_at', [
                $date->copy()->startOfDay(), 
                $date->copy()->endOfDay()
            ])
            ->where('type', RecordType::expense)
            ->sum('amount');
    }
}
