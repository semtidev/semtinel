<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogisticsReceiptItemTransfer extends Model
{
    protected $table = 'logistics_receipt_items_transfer';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id_receipt',
        'product_id',
        'product_code',
        'oc',
        'item_description',
        'um',
        'received_quantity',
        'stowage_card',
        'price_unit',
        'price_total',
        'created_at',
        'updated_at',
        'id_inventory',
    ];

    public function entry () {
        return $this->belongsTo('App\Models\LogisticsOutput', 'id_output');
    }
}
