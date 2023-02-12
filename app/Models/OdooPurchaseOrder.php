<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OdooPurchaseOrder extends Model
{
    /**
     * The database connection used by the model.
     *
     * @var string
     */
    protected $connection = 'odoo_aei';

    protected $table = 'purchase_order';
}
