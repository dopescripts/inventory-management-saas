<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Database\Factories\UnitFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $tenant_id
 * @property string $name
 * @property string $short_name
 * @property string $type
 * @property string|null $description
 * @property bool $is_active
 * @property int|null $created_by
 * @property-read Tenant $tenant
 * @property-read User|null $createdBy
 */
#[Fillable([
    'tenant_id',
    'name',
    'short_name',
    'type',
    'description',
    'is_active',
    'created_by',
])]
class Unit extends Model
{
    /** @use HasFactory<UnitFactory> */
    use BelongsToTenant;

    use HasFactory;

    /**
     * @return BelongsTo<Tenant, Unit>
     */
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    /**
     * @return BelongsTo<User, Unit>
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * @return HasMany<Item, Unit>
     */
    public function items(): HasMany
    {
        return $this->hasMany(Item::class);
    }
}
