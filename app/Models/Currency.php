<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Override;

#[Fillable(['code', 'name', 'symbol', 'decimal_places', 'is_active'])]
class Currency extends Model
{
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    #[Override]
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'decimal_places' => 'integer',
        ];
    }
}
