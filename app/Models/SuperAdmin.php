<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

#[Fillable(['name', 'email', 'password'])]
/**
 * @property int $id
 * @property string $name
 * @property string $email
 */
class SuperAdmin extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory;
    protected $guard = 'super_admin';
    protected $guard_name = ['super_admin'];
}
