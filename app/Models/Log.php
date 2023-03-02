<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Log extends Model
{
    protected $table = 'syst_logs';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'pole',
        'project',
        'client', 
        'action', 
        'description', 
        'entity_id',
        'user',
    ];

    public function getProject () {
        return $this->belongsTo('App\Models\SystStructureProject', 'project');
    }

    public function getUser () {
        return $this->belongsTo('App\Models\User', 'user');
    }
}
