<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $name
 * @property string $code
 * @property string $address_line_1
 * @property string $address_line_2
 * @property string $city
 * @property string $state
 * @property string $zip_code
 * @property string $country
 * @property string $phone
 * @property string $email
 * @property bool $is_active
 * @property int $created_by
 * @property int $tenant_id
 * @property-read User $createdBy
 * @property-read Tenant $tenant
 */
#[Fillable([
    'name',
    'code',
    'address_line_1',
    'address_line_2',
    'city',
    'state',
    'zip_code',
    'country',
    'phone',
    'email',
    'is_active',
    'created_by',
    'tenant_id',
])]
class Warehouse extends Model
{
    use BelongsToTenant;

    /**
     * Summary of createdBy
     *
     * @return BelongsTo<User, Warehouse>
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Summary of locations
     *
     * @return HasMany<Location, Warehouse>
     */
    public function locations(): HasMany
    {
        return $this->hasMany(Location::class, 'warehouse_id');
    }

    /**
     * Summary of inventoryMovements
     *
     * @return HasMany<InventoryMovement, Warehouse>
     */
    public function inventoryMovements(): HasMany
    {
        return $this->hasMany(InventoryMovement::class);
    }

    /**
     * Summary of tenant
     *
     * @return BelongsTo<Tenant, Warehouse>
     */
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'tenant_id');
    }
}
