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
use App\Models\UserWarehouse;
use App\Models\UserProject;
use App\Models\Role;
use App\Models\RolePermission;
use App\Models\SystWarehouse;
use App\Models\SystPole;
use App\Models\SystStructureProject;

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
    public function poles(): BelongsToMany
    {
        return $this->belongsToMany(SystPole::class, 'users_poles','user_id','pole_id');
    }

    /**
     * Get Poles.
     *
     * @return \Illuminate\Http\Response
     */
    public function getPolesArray()
    {
        $poles = array();
        foreach ($this->poles as $pole) {
            if ($pole->active == 1) {
                $poles[] = array(
                    'id' => $pole->id,
                    'name' => $pole->name,
                    'abbr' => $pole->abbr,
                    'active' => $pole->active
                );
            }            
        }
        return $poles;
    }
    
    /**
     * The projects that belong to the user.
     */
    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(SystStructureProject::class, 'users_projects','user_id','project_id');
    }

    /**
     * Get Projects array.
     *
     * @return \Illuminate\Http\Response
     */
    public function getProjectsArray()
    {
        $projects     = array();
<<<<<<< HEAD
        foreach ($this->projects as $project) {
=======
        $qry_projects = UserProject::leftJoin('syst_structure_projects', 'syst_structure_projects.id', 'users_projects.project_id')
                                    ->select(
                                        'syst_structure_projects.id',
                                        'syst_structure_projects.id_pole',
                                        'syst_structure_projects.name',
                                        'syst_structure_projects.abbr',
                                        'syst_structure_projects.active'
                                    )
                                    ->where('users_projects.user_id', $this->id)
                                    ->where('syst_structure_projects.active', 1)
                                    ->orderBy('syst_structure_projects.id', 'ASC')->get();
        foreach ($qry_projects as $project) {
>>>>>>> 83270e2175dbb7c560aae0254ff43869c130eb8f
            $projects[] = array(
                'id' => $project->id,
                'id_pole' => $project->id_pole,
                'name' => $project->name,
                'abbr' => $project->abbr,
                'active' => $project->active
            );
        }
        return $projects;
    }

    /**
     * The roles that belong to the user. Relation many to many
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany('App\Models\Role', 'model_has_roles', 'model_id', 'role_id')->with('permissions');
    }

    /**
     * The roles that belong to the user as array.
     */
    public function getRolesArray()
    {
        $roles = array();
        foreach ($this->roles as $rol) {
            $roles[$rol->name] = $rol->id;       
        }
        return $roles;
    }

    /**
     * The permissions that belong to the user.
     */
    public function getPermissionsArray()
    {
        $permissions = array();
        foreach ($this->roles as $rol) {
            foreach ($rol->permissions as $permission) {
                $permissions[$permission->name] = $permission->id;
            }            
        }
        return $permissions;
    }

    /**
     * The warehouse that belong to the user. Relation many to many
     */
    public function warehouses(): BelongsToMany
    {
        return $this->belongsToMany('App\Models\SystWarehouse', 'users_warehouses', 'user_id', 'warehouse_id');
    }

    /**
     * The warehouses that belong to the user as array.
     */
    public function getWarehousesArray()
    {
        $warehouses = array();
        foreach ($this->warehouses as $warehouse) {
            if ($warehouse->active == 1) {
                $warehouses[$warehouse->id] = [
                    'id_project' => $warehouse->id_project,
                    'name' => $warehouse->name,
                    'owner' => $warehouse->owner
                ]; 
            }            
        }
        return $warehouses;
    }

    /**
     * The subsystem that belong to the user. Relation many to many
     */
    public function systems(): BelongsToMany
    {
        return $this->belongsToMany('App\Models\SystSubsystem', 'users_systems', 'user_id', 'system_id');
    }

    /**
     * The systems that belong to the user.
     */
    public function getSystemsArray()
    {
        $systems = array();
        foreach ($this->systems as $system) {
            if ($system->active == 1) {
                $systems[$system->name] = $system->id;
            }            
        }
        return $systems;
    }
    
}
