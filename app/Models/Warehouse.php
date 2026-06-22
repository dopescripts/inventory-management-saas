<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
 *
 * @property-read \App\Models\User $createdBy
 * @property-read \App\Models\Tenant $tenant
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
    /**
     * Summary of createdBy
     * @return BelongsTo<User, Warehouse>
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Summary of tenant
     * @return BelongsTo<Tenant, Warehouse>
     */
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'tenant_id');
    }
}
