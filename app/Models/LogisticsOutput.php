<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogisticsOutput extends Model
{
    protected $table = 'logistics_outputs';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'code',
        'created_at',
        'updated_at',
        'created_by',
        'updated_by',
        'pole',
        'project',
        'warehouse',
        'warehouse_owner',
        'comment',
        'status',
        'attach_path',
        'confirm',
        'cancel',
        'cancel_by',
        'type',
        'destin',
        'work_object',
        'destin_warehouse',
        'destin_warehouse_owner',
        'authorized',
        'authorizing',
    ];

    public function Items () {
        return $this->hasMany('App\Models\LogisticsOutputItem', 'id_output');
    }

    public function getProject () {
        return $this->belongsTo('App\Models\SystStructureProject', 'project');
    }

    public function getPole () {
        return $this->belongsTo('App\Models\SystPole', 'pole');
    }

    public function getWarehouse () {
        return $this->belongsTo('App\Models\SystWarehouse', 'warehouse');
    }
}
