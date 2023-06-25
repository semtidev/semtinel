<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogisticsInventory extends Model
{
    protected $table = 'logistics_inventory';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'inventory_code',
        'stock',
        'reserved',
        'available',
        'created_at',
        'updated_at',
        'warehouse',
        'project',
        'pole',
        'oc',
        'product_code',
        'category_name',
        'item_description',
        'um',
        'price_unit',
        'price_total',
        'stowage_card',
        'type',
    ];
}
