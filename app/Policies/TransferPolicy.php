<?php

namespace App\Policies;

use App\Models\Transfers;
use App\Models\User;

class TransferPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('view_transfers');
    }

    public function view(User $user, Transfers $transfers): bool
    {
        return $user->can('view_transfers');
    }

    public function create(User $user): bool
    {
        return $user->can('create_transfers');
    }

    public function update(User $user, Transfers $transfers): bool
    {
        return $user->can('update_transfers');
    }

    public function delete(User $user, Transfers $transfers): bool
    {
        return $user->can('delete_transfers');
    }

    public function submit(User $user, Transfers $transfers): bool
    {
        return $user->can('submit_transfers');
    }

    public function approve(User $user, Transfers $transfers): bool
    {
        return $user->can('approve_transfers');
    }

    public function cancel(User $user, Transfers $transfers): bool
    {
        return $user->can('cancel_transfers');
    }

    public function ship(User $user, Transfers $transfers): bool
    {
        return $user->can('ship_transfers');
    }

    public function receive(User $user, Transfers $transfers): bool
    {
        return $user->can('receive_transfers');
    }
}
