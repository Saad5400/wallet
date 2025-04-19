<?php

namespace App\Http\Controllers;

use App\Http\Requests\SubCategory\StoreSubCategoryRequest;
use Illuminate\Http\RedirectResponse;

class SubCategoryController extends Controller
{
    /**
     * Store a new subcategory.
     */
    public function store(StoreSubCategoryRequest $request): RedirectResponse
    {
        $subCategory = tenant()->subCategories()->create($request->validated());

        return redirect()->back()->with('flash', [
            'subCategory' => $subCategory,
        ]);
    }
}