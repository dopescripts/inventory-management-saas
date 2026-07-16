<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $name
 * @property string|null $email
 * @property string|null $phone
 * @property string|null $address
 * @property string|null $contact_person
 * @property string|null $notes
 * @property bool $is_active
 * @property int $created_by
 * @property int $tenant_id
 */
#[Fillable([
    'name',
    'email',
    'phone',
    'address',
    'contact_person',
    'notes',
    'is_active',
    'created_by',
    'tenant_id',
])]
class Vendor extends Model
{
    use BelongsToTenant;
    use HasFactory;

    /**
     * @return BelongsTo<User, $this>
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * @return BelongsTo<Tenant, $this>
     */
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    /**
     * @return HasMany<PurchaseOrder, $this>
     */
    public function purchaseOrders(): HasMany
    {
        return $this->hasMany(PurchaseOrder::class);
    }

    /**
     * @param  Builder<$this>  $query
     * @return Builder<$this>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
