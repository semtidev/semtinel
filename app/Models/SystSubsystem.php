<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystSubsystem extends Model
{
    protected $table = 'syst_subsystems';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'active',
    ];
}
