<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogisticsReceipt extends Model
{
    protected $table = 'logistics_receipts';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'code',
        'origin', 
        'document_type', 
        'document_number', 
        'output',
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
    ];

    public function itemsOc () {
        return $this->hasMany('App\Models\LogisticsReceiptItemOc', 'id_receipt');
    }

    public function itemsDispatch () {
        return $this->hasMany('App\Models\LogisticsReceiptItemDispatch', 'id_receipt');
    }

    public function itemsTransfer () {
        return $this->hasMany('App\Models\LogisticsReceiptItemTransfer', 'id_receipt');
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
