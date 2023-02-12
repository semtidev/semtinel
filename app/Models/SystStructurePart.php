<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystStructurePart extends Model
{
    protected $table = 'syst_structure_parts';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id_object', 'name', 'parent', 'node_order', 'abbr', 'active',
    ];
}
