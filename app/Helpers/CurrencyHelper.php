<?php

namespace App\Helpers;

use App\Models\Currency;
use Illuminate\Support\Facades\Auth;

class CurrencyHelper
{
    public static function format(float|string $amount, ?Currency $currency = null): string
    {
        if (! $currency) {
            $currency = Auth::user()?->tenant?->currency;
        }

        $decimals = $currency?->decimal_places ?? 2;
        $symbol = $currency?->symbol ?? '$';

        return $symbol.number_format((float) $amount, $decimals);
    }
}
