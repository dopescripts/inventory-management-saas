<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use App\Services\Inventory\InventoryMovementService;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Auth;

/**
 * @property string $code
 * @property string|null $zone
 * @property string|null $aisle
 * @property string|null $rack
 * @property string|null $shelf
 * @property string|null $bin
 * @property string|null $description
 * @property bool $is_active
 * @property int $created_by
 * @property int $tenant_id
 * @property int $warehouse_id
 * @property-read User $createdBy
 * @property-read Tenant $tenant
 * @property-read Warehouse $warehouse
 */
#[Fillable([
    'code',
    'zone',
    'aisle',
    'rack',
    'shelf',
    'bin',
    'description',
    'is_active',
    'created_by',
    'tenant_id',
    'warehouse_id',
])]
class Location extends Model
{
    use BelongsToTenant;

    protected $appends = ['balance'];

    /**
     * Summary of createdBy
     *
     * @return BelongsTo<User, $this>
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Summary of tenant
     *
     * @return BelongsTo<Tenant, $this>
     */
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'tenant_id');
    }

    /**
     * Summary of warehouse
     *
     * @return BelongsTo<Warehouse, $this>
     */
    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'warehouse_id');
    }

    /**
     * Summary of inventoryMovements
     *
     * @return HasMany<InventoryMovement, $this>
     */
    public function inventoryMovements(): HasMany
    {
        return $this->hasMany(InventoryMovement::class);
    }

    /**
     * Summary of getBalanceAttribute
     *
     * @return string
     */
    public function getBalanceAttribute()
    {
        return app(InventoryMovementService::class)->locationBalance(Auth::guard('web')->user()->tenant_id, $this->id);
    }

    /**
     * Summary of scopeActive
     *
     * @param  Builder<$this>  $query
     * @return Builder<$this>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
