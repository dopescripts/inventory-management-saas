<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

#[Fillable(['name', 'email', 'password'])]
class SuperAdmin extends Authenticatable
{
    use HasFactory;
    protected $guard = 'super_admin';
    protected $guard_name = ['super_admin'];
}
