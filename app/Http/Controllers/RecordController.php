<?php

namespace App\Http\Controllers;

use App\Http\Requests\Record\StoreRecordRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class RecordController extends Controller
{
    /**
     * Store a new record.
     */
    public function store(StoreRecordRequest $request): RedirectResponse
    {
        $tenant = tenant();
        $data = $request->validated();
        $record = $tenant->records()->create(array_merge($data, [
            'user_id' => Auth::id(),
        ]));

        return redirect()->back()->with('flash', [
            'record' => $record,
        ]);
    }
}