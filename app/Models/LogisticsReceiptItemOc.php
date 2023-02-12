<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogisticsReceiptItemOc extends Model
{
    protected $table = 'logistics_receipt_items_oc';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id_receipt',
        'odoo_id_order_line',
        'odoo_id_order',
        'product_code', 
        'product_description', 
        'item_description',
        'um',
        'received_quantity',
        'stowage_card',
        'price_unit',
        'price_total',
        'sequence',
        'comment',
        'created_at',
        'updated_at',
    ];

    public function entry () {
        return $this->belongsTo('App\Models\LogisticsReceipt', 'id_receipt');
    }
}
