<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use LdapRecord\Laravel\Auth\AuthenticatesWithLdap;
use LdapRecord\Laravel\Auth\LdapAuthenticatable;
use Spatie\Permission\Traits\HasRoles;
use App\Models\UserSystem;
use App\Models\UserRol;
use App\Models\Role;
use App\Models\RolePermission;
use App\Models\Permission;

class User extends Authenticatable implements LdapAuthenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;
    use AuthenticatesWithLdap;

    protected $table = 'users';
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'username',
        'password',
        'id_pole',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Get the pole that the user belong.
     */
    public function pole(): BelongsTo
    {
        return $this->belongsTo(SystPole::class, 'id_pole');
    }

    /**
     * The systems that belong to the user.
     */
    public function getSystems()
    {
        $systems = array();
        $qry_systems = UserSystem::leftJoin('syst_subsystems', 'syst_subsystems.id', 'users_systems.user_id')
                                    ->select('syst_subsystems.id', 'syst_subsystems.name')
                                    ->where('users_systems.user_id', $this->id)
                                    ->orderBy('syst_subsystems.name', 'ASC')->get();
        foreach ($qry_systems as $system) {
            $systems[$system->name] = $system->id;
        }
        return $systems;
    }

    /**
     * The permissions that belong to the user.
     */
    public function getPermissions()
    {
        $permissions = array();
        $user_roles = UserRol::where('model_id', $this->id)->get();
        foreach ($user_roles as $user_rol) {
            $qry_permissions = RolePermission::leftJoin('permissions', 'permissions.id', 'role_has_permissions.permission_id')
                                            ->select('permissions.id', 'permissions.name')
                                            ->where('role_has_permissions.role_id', $user_rol->role_id)
                                            ->get();
            foreach ($qry_permissions as $permission) {
                if (!array_key_exists($permission->name, $permissions))
                    $permissions[$permission->name] = $permission->id;
            }
            
        }
        return $permissions;
    }
    
    /**
     * The projects that belong to the user.
     */
    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(SystStructureProject::class, 'users_projects','user_id','project_id');
    }
    
}
