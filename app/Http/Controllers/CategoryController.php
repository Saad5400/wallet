<?php

namespace App\Http\Controllers;

use App\Http\Requests\Category\StoreCategoryRequest;
use Illuminate\Http\RedirectResponse;

class CategoryController extends Controller
{
    /**
     * Store a new category.
     */
    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        $category = tenant()->categories()->create($request->validated());

        return redirect()->back()->with('flash', [
            'category' => $category,
        ]);
    }
}