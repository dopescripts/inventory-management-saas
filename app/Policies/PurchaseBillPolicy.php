<?php

namespace App\Policies;

use App\Models\PurchaseBill;
use App\Models\User;

class PurchaseBillPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_bills');
    }

    public function view(User $user, PurchaseBill $bill): bool
    {
        return $user->hasPermissionTo('view_bills');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_bills');
    }

    public function update(User $user, PurchaseBill $bill): bool
    {
        return $user->hasPermissionTo('update_bills');
    }

    public function delete(User $user, PurchaseBill $bill): bool
    {
        return $user->hasPermissionTo('delete_bills');
    }

    public function download(User $user, PurchaseBill $bill): bool
    {
        return $user->hasPermissionTo('view_bills');
    }
}
