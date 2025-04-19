<?php

namespace App\Http\Controllers;

use App\Http\Requests\Record\StoreRecordRequest;
use App\Models\Record;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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

    /**
     * Delete a record.
     * 
     * @param Record $record
     * @return RedirectResponse
     */
    public function destroy(Record $record): RedirectResponse
    {
        // Check if the record belongs to the current tenant
        if ($record->tenant_id !== tenant()->id) {
            abort(403);
        }

        $record->delete();

        return redirect()->back()->with('flash', [
            'message' => 'Record deleted successfully',
        ]);
    }
}