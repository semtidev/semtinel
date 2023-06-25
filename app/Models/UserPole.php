<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPole extends Model
{
    protected $table = 'users_poles';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id', 'pole_id',
    ];
}
