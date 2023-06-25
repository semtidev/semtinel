<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    protected $table = 'roles';

    /**
     * The roles that belong to the user. Relation many to many
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany('App\Models\Permission', 'role_has_permissions', 'role_id', 'permission_id');
    }
}
