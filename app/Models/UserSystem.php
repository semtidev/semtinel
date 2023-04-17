<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserSystem extends Model
{
    protected $table = 'users_systems';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id', 'system_id',
    ];
}
