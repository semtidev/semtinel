<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystStructureEop extends Model
{
    protected $table = 'syst_structure_eop';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id_project', 'description', 'parent', 'active',
    ];
}
