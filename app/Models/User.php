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
     * Get Poles.
     *
     * @return \Illuminate\Http\Response
     */
    public function getPoles()
    {
        $poles     = array();
        if ($this->id_pole == 9) {
            $qry_poles = SystPole::where('active', 1)->orderBy('id', 'ASC')->get();
            foreach ($qry_poles as $pole) {
                $poles[] = array(
                    'id' => $pole->id,
                    'name' => $pole->name,
                    'abbr' => $pole->abbr,
                    'active' => $pole->active
                );
            }
        }
        else {
            $qry_poles = SystPole::where('id', $this->id_pole)->where('active', 1)->first();
            $poles[] = array(
                'id' => $qry_poles->id,
                'name' => $qry_poles->name,
                'abbr' => $qry_poles->abbr,
                'active' => $qry_poles->active
            );
        }

        return $poles;
    }

    /**
     * Get Projects.
     *
     * @return \Illuminate\Http\Response
     */
    public function getProjects()
    {
        $projects     = array();
        $qry_projects = UserProject::leftJoin('syst_structure_projects', 'syst_structure_projects.id', 'users_projects.project_id')
                                    ->select(
                                        'syst_structure_projects.id',
                                        'syst_structure_projects.id_pole',
                                        'syst_structure_projects.name',
                                        'syst_structure_projects.abbr',
                                        'syst_structure_projects.active'
                                    )
                                    ->where('syst_structure_projects.active', 1)
                                    ->orderBy('syst_structure_projects.id', 'ASC')->get();
        foreach ($qry_projects as $project) {
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
     * The roles that belong to the user.
     */
    public function getRoles()
    {
        $roles = array();
        $user_roles = UserRol::where('model_id', $this->id)->get();
        foreach ($user_roles as $user_rol) {
            $qry_roles = Role::find($user_rol->role_id);
            $roles[$qry_roles->name] = $qry_roles->id;         
        }
        return $roles;
    }

    /**
     * The warehouses that belong to the user.
     */
    public function getWarehouses()
    {
        $warehouses = array();
        $user_warehouses = UserWarehouse::where('user_id', $this->id)->get();
        foreach ($user_warehouses as $user_warehouse) {
            if (SystWarehouse::where('id', $user_warehouse->warehouse_id)->where('active', 1)->exists()) {
               $qry_warehouses = SystWarehouse::where('id', $user_warehouse->warehouse_id)
                                                ->where('active', 1)->first();
                $warehouses[$qry_warehouses->id] = [
                    'id_project' => $qry_warehouses->id_project,
                    'name' => $qry_warehouses->name,
                    'owner' => $qry_warehouses->owner
                ]; 
            }            
        }
        return $warehouses;
    }
    
    /**
     * The projects that belong to the user.
     */
    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(SystStructureProject::class, 'users_projects','user_id','project_id');
    }
    
}
