<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    /**
     * Get the users for the Pole.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class,'id_pole');
    }

    /**
     * Get the projects for the Pole.
     */
    public function projects(): HasMany
    {
        return $this->hasMany(SystStructureProject::class,'id_pole');
    }

}
