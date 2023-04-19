<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserWarehouse extends Model
{
    protected $table = 'users_warehouses';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id', 'warehouse_id',
    ];
}
