<?php

namespace App\Policies;

use App\Models\PurchaseOrder;
use App\Models\User;

class PurchaseOrderPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('view_purchases');
    }

    public function view(User $user, PurchaseOrder $purchaseOrder): bool
    {
        return $user->can('view_purchases');
    }

    public function create(User $user): bool
    {
        return $user->can('create_purchases');
    }

    public function update(User $user, PurchaseOrder $purchaseOrder): bool
    {
        return $user->can('update_purchases');
    }

    public function delete(User $user, PurchaseOrder $purchaseOrder): bool
    {
        return $user->can('delete_purchases');
    }

    public function submit(User $user, PurchaseOrder $purchaseOrder): bool
    {
        return $user->can('submit_purchases');
    }

    public function approve(User $user, PurchaseOrder $purchaseOrder): bool
    {
        return $user->can('approve_purchases');
    }

    public function cancel(User $user, PurchaseOrder $purchaseOrder): bool
    {
        return $user->can('cancel_purchases');
    }

    public function receive(User $user, PurchaseOrder $purchaseOrder): bool
    {
        return $user->can('receive_purchases');
    }

    public function close(User $user, PurchaseOrder $purchaseOrder): bool
    {
        return $user->can('close_purchases');
    }
}
