<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OdooProductTemplate extends Model
{
    /**
     * The database connection used by the model.
     *
     * @var string
     */
    protected $connection = 'odoo_aei';

    protected $table = 'product_template';
}
