<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserRol extends Model
{
    protected $table = 'model_has_roles';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'role_id', 'model_type', 'model_id',
    ];
}
