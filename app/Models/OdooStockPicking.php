<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OdooStockPicking extends Model
{
    /**
     * The database connection used by the model.
     *
     * @var string
     */
    protected $connection = 'odoo_aei';

    protected $table = 'stock_picking';
}
