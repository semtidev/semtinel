<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogisticsReceiptItemDispatch extends Model
{
    protected $table = 'logistics_receipt_items_dispatch';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id_receipt',
        'odoo_id_stock_move',
        'odoo_id_stock_picking',
        'oc',
        'product_code',
        'category_name',
        'category_complete_name', 
        'docnum', 
        'item_description',
        'um',
        'product_quantity',
        'received_quantity',
        'stowage_card',
        'price_unit',
        'price_total',
        'sequence',
        'comment',
        'created_at',
        'updated_at',
        'lote',
        'id_inventory',
    ];

    public function entry () {
        return $this->belongsTo('App\Models\LogisticsReceipt', 'id_receipt');
    }
}
