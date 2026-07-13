<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Database\Factories\ItemFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $tenant_id
 * @property string $name
 * @property string $sku
 * @property string|null $barcode
 * @property int|null $category_id
 * @property int|null $brand_id
 * @property int $unit_id
 * @property string $type
 * @property bool $track_inventory
 * @property bool $is_active
 * @property string|null $description
 * @property int|null $created_by
 * @property-read Tenant $tenant
 * @property-read Category|null $category
 * @property-read Brand|null $brand
 * @property-read Unit $unit
 * @property-read User|null $createdBy
 */
#[Fillable([
    'tenant_id',
    'name',
    'sku',
    'barcode',
    'category_id',
    'brand_id',
    'unit_id',
    'type',
    'track_inventory',
    'is_active',
    'description',
    'created_by',
])]
class Item extends Model
{
    /** @use HasFactory<ItemFactory> */
    use BelongsToTenant;

    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'track_inventory' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<Tenant, Item>
     */
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    /**
     * @return BelongsTo<Category, Item>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * @return BelongsTo<Brand, Item>
     */
    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    /**
     * @return BelongsTo<Unit, Item>
     */
    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    /**
     * @return BelongsTo<User, Item>
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * @return HasMany<InventoryMovement, Item>
     */
    public function inventoryMovements(): HasMany
    {
        return $this->hasMany(InventoryMovement::class);
    }
}
