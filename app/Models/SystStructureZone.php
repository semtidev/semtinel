<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystStructureZone extends Model
{
    protected $table = 'syst_structure_zones';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id_project', 'name', 'active', 'abbr',
    ];
}
