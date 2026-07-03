<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\CategoryRequest;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        $categories = Category::query()
            ->where('tenant_id', Auth::guard('web')->user()->tenant_id)
            ->withCount('items')
            ->latest()
            ->paginate(10);

        return Inertia::render('inventory/category/index', [
            'categories' => $categories,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('inventory/category/create');
    }

    public function store(CategoryRequest $request): RedirectResponse|JsonResponse
    {
        $category = Category::create([
            ...$request->validated(),
            'tenant_id' => $request->user()->tenant_id,
            'created_by' => $request->user()->id,
            'slug' => $request->validated('slug') ?: Str::slug($request->validated('name')),
            'is_active' => $request->boolean('is_active', true),
        ]);

        if ($request->wantsJson()) {
            return response()->json(['id' => $category->id, 'name' => $category->name]);
        }

        return redirect()->route('categories.index')->with('success', 'Category created successfully.');
    }

    public function show(string $id): never
    {
        abort(404);
    }

    public function edit(Category $category): Response
    {
        $this->ensureTenantOwnership($category);

        return Inertia::render('inventory/category/edit', [
            'category' => $category,
        ]);
    }

    public function update(CategoryRequest $request, Category $category): RedirectResponse
    {
        $this->ensureTenantOwnership($category);

        $category->update([
            ...$request->validated(),
            'slug' => $request->validated('slug') ?: Str::slug($request->validated('name')),
            'is_active' => $request->boolean('is_active', true),
        ]);

        return redirect()->route('categories.index')->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        $this->ensureTenantOwnership($category);
        $category->delete();

        return redirect()->route('categories.index')->with('success', 'Category deleted successfully.');
    }

    private function ensureTenantOwnership(Category $category): void
    {
        abort_unless($category->tenant_id === Auth::guard('web')->user()->tenant_id, 404);
    }
}
