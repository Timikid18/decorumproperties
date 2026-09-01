<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Requests\Admin\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Responses\ApiResponse;
use App\Models\Category;
use App\Models\CategoryGroup;
use App\Services\FileUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryAdminController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected FileUploadService $files,
    ) {}

    // -------------------------------------------------------------- category groups

    public function groups(): \Illuminate\Http\JsonResponse
    {
        return $this->success(CategoryGroup::query()
            ->with(['categories' => fn ($q) => $q->with('children')->orderBy('sort_order')])
            ->orderBy('sort_order')
            ->get(),
            'Category groups retrieved successfully');
    }

    public function storeGroup(Request $request): \Illuminate\Http\JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'slug' => ['nullable', 'string', 'max:140', 'unique:category_groups,slug'],
            'icon' => ['nullable', 'string', 'max:80'],
            'description' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $group = CategoryGroup::create([
            ...$data,
            'slug' => $data['slug'] ?? Str::slug($data['name']),
        ]);

        return $this->created($group, 'Category group created successfully');
    }

    public function updateGroup(Request $request, CategoryGroup $group): \Illuminate\Http\JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'icon' => ['nullable', 'string', 'max:80'],
            'description' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $group->update($data);

        return $this->success($group, 'Category group updated successfully');
    }

    public function destroyGroup(CategoryGroup $group): \Illuminate\Http\JsonResponse
    {
        Category::where('group_id', $group->id)->update(['group_id' => null]);
        $group->delete();

        return $this->success(null, 'Category group deleted successfully');
    }

    // -------------------------------------------------------------- categories

    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        $flat = $request->boolean('flat');
        $categories = Category::query()
            ->with(['group', 'children'])
            ->when(! $flat, fn ($q) => $q->whereNull('parent_id'))
            ->orderBy('sort_order')
            ->get();

        return $this->success(CategoryResource::collection($categories), 'Categories retrieved successfully');
    }

    public function store(StoreCategoryRequest $request): \Illuminate\Http\JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $this->files->storeImage($request->file('image'), 'categories')['path'];
        }
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);

        $category = Category::create($data);

        return $this->created(new CategoryResource($category->load('group')), 'Category created successfully');
    }

    public function update(UpdateCategoryRequest $request, Category $category): \Illuminate\Http\JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $this->files->storeImage($request->file('image'), 'categories')['path'];
        }

        $category->update($data);

        return $this->success(new CategoryResource($category->load('group')), 'Category updated successfully');
    }

    public function destroy(Category $category): \Illuminate\Http\JsonResponse
    {
        Category::where('parent_id', $category->id)->update(['parent_id' => null]);
        $category->delete();

        return $this->success(null, 'Category deleted successfully');
    }
}