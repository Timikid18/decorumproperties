<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Responses\ApiResponse;
use App\Models\Category;
use App\Models\CategoryGroup;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    use ApiResponse;

    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        $withChildren = ! $request->boolean('flat');

        $categories = Category::query()
            ->where('is_active', true)
            ->when($withChildren, fn ($q) => $q->whereNull('parent_id'))
            ->with(['group', 'children' => fn ($q) => $q->where('is_active', true)->orderBy('sort_order')])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return $this->success(CategoryResource::collection($categories), 'Categories retrieved successfully');
    }

    public function groups(): \Illuminate\Http\JsonResponse
    {
        $groups = CategoryGroup::query()
            ->where('is_active', true)
            ->with(['categories' => fn ($q) => $q->where('is_active', true)->orderBy('sort_order')])
            ->orderBy('sort_order')
            ->get();

        return $this->success($groups->map(fn (CategoryGroup $group) => [
            'id' => $group->id,
            'name' => $group->name,
            'slug' => $group->slug,
            'icon' => $group->icon,
            'description' => $group->description,
            'categories' => CategoryResource::collection($group->categories),
        ]), 'Category groups retrieved successfully');
    }
}