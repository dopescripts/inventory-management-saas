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

    /**
     * Summary of guard
     * @var string
     * 
     */
    protected $guard = 'super_admin';


    /**
     * Summary of guard_name
     * @var array<string>
     */
    protected $guard_name = ['super_admin'];
}
