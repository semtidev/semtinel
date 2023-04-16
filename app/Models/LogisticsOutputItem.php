<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogisticsOutputItem extends Model
{
    protected $table = 'logistics_output_items';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id_output',
        'id_inventory',
        'product_id',
        'product_code',
        'oc',
        'item_description',
        'um',
        'quantity',
        'stowage_card',
        'price_unit',
        'price_total',
        'created_at',
        'updated_at',
    ];

    public function entry () {
        return $this->belongsTo('App\Models\LogisticsOutput', 'id_output');
    }
}
