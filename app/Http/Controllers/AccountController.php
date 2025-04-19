<?php

namespace App\Http\Controllers;

use App\Http\Requests\Account\StoreAccountRequest;
use App\Models\Tenant;
use Illuminate\Http\RedirectResponse;

class AccountController extends Controller
{
    /**
     * Store a new tenant account.
     *
     * @param StoreAccountRequest $request
     * @return RedirectResponse
     */
    public function store(StoreAccountRequest $request): RedirectResponse
    {
        $tenant = tenant();
        $account = $tenant->accounts()->create($request->validated());

        return redirect()->back()->with('flash', [
            'account' => $account,
        ]);
    }
}
