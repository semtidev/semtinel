<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystWarehouse extends Model
{
    protected $table = 'syst_warehouses';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id_project', 'name', 'owner', 'active',
    ];
}
