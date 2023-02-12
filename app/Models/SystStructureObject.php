<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystStructureObject extends Model
{
    protected $table = 'syst_structure_objects';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id_zone', 'name', 'active', 'abbr',
    ];
}
