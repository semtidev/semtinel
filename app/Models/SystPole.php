<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystPole extends Model
{
    protected $table = 'syst_poles';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'abbr', 'active',
    ];
}
