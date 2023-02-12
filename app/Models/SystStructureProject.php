<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystStructureProject extends Model
{
    protected $table = 'syst_structure_projects';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id_pole', 'name', 'active', 'abbr',
    ];
}
