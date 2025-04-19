<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        /** @var User $user */
        $user = $request->user();

        /** @var Tenant $tenant */
        $tenant = tenant();

        return [
            ...parent::share($request),
            'flash' => $request->session()->get('flash'),
            'auth' => [
                'user' => is_null($user) ? null : [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'lastRecord' => $user->records()->latest()->first(),
                ],
                'tenant' => is_null($tenant) ? null : [
                    'id' => $tenant->id,
                    'name' => $tenant->name,
                    'month_start_day' => (int) $tenant->month_start_day,
                    'accounts' => $tenant->accounts()->get(),
                    'categories' => $tenant->categories()->with('subCategories')->get(),
                ]
            ],
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }
}
