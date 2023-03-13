<?php

namespace App\Http\Controllers;

use Throwable;
use App\Models\SystPole;
use App\Models\SystStructureProject;
use App\Models\SystConfig;
use App\Models\SystSubsystem;
use App\Models\SystWarehouse;
use App\Models\RolePermission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\LogisticsReceiptItemOc;
use App\Models\LogisticsReceiptItemDispatch;
use Illuminate\Http\Request;
use Ramsey\Uuid\Guid\Fields;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Display the Admin app.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $server_name = SystConfig::where('config', 'server_name')->first()->value;
        return view('admin', ['server_name' => $server_name]);
    }

    //////////////////////////////
    /////      GETTERS      //////
    //////////////////////////////

    /**
     * Get Poles.
     *
     * @return \Illuminate\Http\Response
     */
    public function getPoles()
    {
        $poles     = array();
        $qry_poles = SystPole::orderBy('id', 'ASC')->get();
        foreach ($qry_poles as $pole) {
            $poles[] = array(
                'id' => $pole->id,
                'name' => $pole->name,
                'abbr' => $pole->abbr,
                'active' => $pole->active
            );
        }
        return response()->json($poles,200);
    }

    /**
     * Get Projects.
     *
     * @return \Illuminate\Http\Response
     */
    public function getProjects()
    {
        $projects     = array();
        $qry_projects = SystStructureProject::orderBy('id_pole', 'ASC')->get();
        foreach ($qry_projects as $project) {
            $projects[] = array(
                'id' => $project->id,
                'id_pole' => $project->id_pole,
                'name' => $project->name,
                'abbr' => $project->abbr,
                'active' => $project->active
            );
        }
        return response()->json($projects,200);
    }

    /**
     * Get Warehouses.
     *
     * @return \Illuminate\Http\Response
     */
    public function getWarehouses()
    {
        $warehouses     = array();
        $qry_warehouses = SystWarehouse::orderBy('id_project', 'ASC')->orderBy('name', 'ASC')->get();
        foreach ($qry_warehouses as $warehouse) {
            $warehouses[] = array(
                'id' => $warehouse->id,
                'id_project' => $warehouse->id_project,
                'name' => $warehouse->name,
                'owner' => $warehouse->owner,
                'active' => $warehouse->active
            );
        }
        return response()->json($warehouses,200);
    }

    /**
     * Get Products Categories.
     *
     * @return \Illuminate\Http\Response
     */
    public function getProductsCategories()
    {
        $categories = array();

        $qry_categories_oc = LogisticsReceiptItemOc::select(DB::raw('DISTINCT(category_name)'))
                                ->select('category_name', 'category_complete_name')
                                ->get();
        foreach ($qry_categories_oc as $categorie) {
            if (array_key_exists($categorie->category_name, $categories) === false && $categorie->category_name != null && $categorie->category_complete_name != null) {
                $categories[$categorie->category_name] = $categorie->category_complete_name;
            }            
        }

        $qry_categories_disp = LogisticsReceiptItemDispatch::select(DB::raw('DISTINCT(category_name)'))
                                ->select('category_name', 'category_complete_name')
                                ->get();
        foreach ($qry_categories_disp as $categorie) {
            if (array_key_exists($categorie->category_name, $categories) === false && $categorie->category_name != null && $categorie->category_complete_name != null) {
                $categories[$categorie->category_name] = $categorie->category_complete_name;
            }            
        }

        return response()->json($categories,200);
    }
    
    /**
     * Get Systems.
     *
     * @return \Illuminate\Http\Response
     */
    public function getSystems()
    {
        $systems     = array();
        $qry_system  = SystSubsystem::orderBy('name', 'ASC')->get();
        foreach ($qry_system as $system) {
            $systems[] = array(
                'id' => $system->id,
                'name' => $system->name,
                'active' => $system->active
            );
        }
        return response()->json($systems, 200);
    }

    /**
     * Get Roles.
     *
     * @return \Illuminate\Http\Response
     */
    public function getRoles()
    {
        $roles     = array();
        $qry_roles = Role::orderBy('name', 'ASC')->get();
        foreach ($qry_roles as $rol) {
            $roles[] = array(
                'id' => $rol->id,
                'name' => $rol->name
            );
        }
        return response()->json($roles, 200);
    }

    /**
     * Get Permissions.
     *
     * @return \Illuminate\Http\Response
     */
    public function getPermissions()
    {
        $permissions     = array();
        $qry_permissions = Permission::orderBy('name', 'ASC')->get();
        foreach ($qry_permissions as $permission) {
            $permissions[] = array(
                'id' => $permission->id,
                'name' => $permission->name
            );
        }
        return response()->json($permissions, 200);
    }

    /**
     * Get Role's permissions.
     *
     * @return \Illuminate\Http\Response
     */
    public function getRolePermissions($role)
    {
        $permissions     = array();
        $qry_permissions = Permission::orderBy('name', 'ASC')->get();
        foreach ($qry_permissions as $permission) {
            $active = false;
            if (RolePermission::where('permission_id', $permission->id)->where('role_id', $role)->exists()) {
                $active = true;
            }
            $permissions[] = array(
                'id' => $permission->id,
                'name' => $permission->name,
                'active' => $active
            );
        }
        return response()->json($permissions, 200);
    }

    /**
     * Get Permission's roles.
     *
     * @return \Illuminate\Http\Response
     */
    public function getPermissionRoles($permission)
    {
        $roles     = array();
        $qry_roles = Role::orderBy('name', 'ASC')->get();
        foreach ($qry_roles as $role) {
            $active = false;
            if (RolePermission::where('permission_id', $permission)->where('role_id', $role->id)->exists()) {
                $active = true;
            }
            $roles[] = array(
                'id' => $role->id,
                'name' => $role->name,
                'active' => $active
            );
        }
        return response()->json($roles, 200);
    }

    /////////////////////////////////////
    /////      STORES/UPDATES      //////
    /////////////////////////////////////

    /**
     * Store/Update a system.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function storeSystem(Request $request)
    {
        // Validations
        try {
            $fields = $request->validate([
                'name' => 'required|string|max:255',
                'active' => 'required'
            ]);
        } catch (Throwable $th) {
            $response = array('success' => false, 'error' => $th->getMessage());
            return response()->json($response, 200);
        }
        
        // Prepare data
        $active = ($fields['active']) ? 1 : 0;

        try {
            // INSERT MODE
            if ($request->id == null || $request->id == '') {
                // Store in DB
                $system = new SystSubsystem([
                    'name' => $fields['name'],
                    'active' => $active
                ]);
                $system->save();
            }
            // UPDATE MODE
            else {
                // Store in DB
                $system = SystSubsystem::find(intval($request->id));
                $system->name = $fields['name'];
                $system->active = $active;
                $system->save();            
            }
        } catch (Throwable $th) {
            $response = array('success' => false, 'error' => $th->getMessage());
            return response()->json($response, 200);
        }
            

        // Response
        $response = array('success' => true, 'system' => $system);
        return response()->json($response, 200);
    }

    /**
     * Store/Update a role.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function storeRole(Request $request)
    {
        // Validations
        try {
            $fields = $request->validate([
                'name' => 'required|string|max:255'
            ]);
        } catch (Throwable $th) {
            $response = array('success' => false, 'error' => $th->getMessage());
            return response()->json($response, 200);
        }
        
        try {
            // INSERT MODE
            if ($request->id == null || $request->id == '') {
                // Store in DB
                $role = new Role([
                    'name' => $fields['name'],
                    'guard_name' => 'web'
                ]);
                $role->save();
            }
            // UPDATE MODE
            else {
                // Store in DB
                $role = Role::find(intval($request->id));
                $role->name = $fields['name'];
                $role->save();            
            }
            // Sync permissions
            foreach ($request->permissions as $role_permission) {
                $permission = Permission::find($role_permission['id']);
                if ($role_permission['active']) {                        
                    $role->givePermissionTo($permission);
                }
                else {
                    $role->revokePermissionTo($permission);
                }
            }
        } catch (Throwable $th) {
            $response = array('success' => false, 'error' => $th->getMessage());
            return response()->json($response, 200);
        }
            

        // Response
        $response = array('success' => true, 'role' => $role);
        return response()->json($response, 200);
    }

    /**
     * Store/Update a permission.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function storePermission(Request $request)
    {
        // Validations
        try {
            $fields = $request->validate([
                'name' => 'required|string|max:255'
            ]);
        } catch (Throwable $th) {
            $response = array('success' => false, 'error' => $th->getMessage());
            return response()->json($response, 200);
        }
        
        try {
            // INSERT MODE
            if ($request->id == null || $request->id == '') {
                // Store in DB
                $permission = new Permission([
                    'name' => $fields['name'],
                    'guard_name' => 'web'
                ]);
                $permission->save();
            }
            // UPDATE MODE
            else {
                // Store in DB
                $permission = Permission::find(intval($request->id));
                $permission->name = $fields['name'];
                $permission->save();            
            }
            // Sync roles
            foreach ($request->roles as $permission_role) {
                $role = Role::find($permission_role['id']);
                if ($permission_role['active']) {                        
                    $permission->assignRole($role);
                }
                else {
                    $permission->removeRole($role);
                }
            }
        } catch (Throwable $th) {
            $response = array('success' => false, 'error' => $th->getMessage());
            return response()->json($response, 200);
        }
            

        // Response
        $response = array('success' => true, 'permission' => $permission);
        return response()->json($response, 200);
    }

    /**
     * Store/Update a warehouse.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function storeWarehouse(Request $request)
    {
        // Validations
        try {
            $fields = $request->validate([
                'name' => 'required|string|max:255',
                'project' => 'required|integer',
                'owner' => 'required|string|max:255',
                'active' => 'required'
            ]);
        } catch (Throwable $th) {
            $response = array('success' => false, 'error' => $th->getMessage());
            return response()->json($response, 200);
        }
        
        // Prepare data
        $active = ($fields['active']) ? 1 : 0;

        try {
            // INSERT MODE
            if ($request->id == null || $request->id == '') {
                // Store in DB
                $warehouse = new SystWarehouse([
                    'id_project' => $fields['project'],
                    'name'       => $fields['name'],
                    'owner'      => $fields['owner'],
                    'active'     => $active
                ]);
                $warehouse->save();
            }
            // UPDATE MODE
            else {
                // Store in DB
                $warehouse = SystWarehouse::find(intval($request->id));
                $warehouse->name   = $fields['name'];
                $warehouse->owner  = $fields['owner'];
                $warehouse->active = $active;
                $warehouse->save();            
            }
        } catch (Throwable $th) {
            $response = array('success' => false, 'error' => $th->getMessage());
            return response()->json($response, 200);
        }
            

        // Response
        $response = array('success' => true, 'warehouse' => $warehouse);
        return response()->json($response, 200);
    }

    //////////////////////////////
    /////      REMOVES      //////
    //////////////////////////////

    /**
     * Remove the specified system.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroySystem($id)
    {
        try {
            // Delete system
            SystSubsystem::find(intval($id))->delete();
        } catch (Throwable $th) {
            $response = array('success' => false, 'error' => $th->getMessage());
            return response()->json($response, 200);
        }

        // Response
        $response = array('success' => true);
        return response()->json($response, 200);
    }

    /**
     * Remove the specified role.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroyRole($id)
    {
        try {
            // Delete role
            Role::find(intval($id))->delete();
        } catch (Throwable $th) {
            $response = array('success' => false, 'error' => $th->getMessage());
            return response()->json($response, 200);
        }

        // Response
        $response = array('success' => true);
        return response()->json($response, 200);
    }

    /**
     * Remove the specified permission.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroyPermission($id)
    {
        try {
            // Delete permission
            Permission::find(intval($id))->delete();
        } catch (Throwable $th) {
            $response = array('success' => false, 'error' => $th->getMessage());
            return response()->json($response, 200);
        }

        // Response
        $response = array('success' => true);
        return response()->json($response, 200);
    }

    /**
     * Remove the specified warehouse.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroyWarehouse($id)
    {
        try {
            // Delete system
            SystWarehouse::find(intval($id))->delete();
        } catch (Throwable $th) {
            $response = array('success' => false, 'error' => $th->getMessage());
            return response()->json($response, 200);
        }

        // Response
        $response = array('success' => true);
        return response()->json($response, 200);
    }
}
