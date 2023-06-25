<?php

namespace App\Http\Controllers;

use App\Models\LogisticsReceipt;
use App\Models\LogisticsOutput;
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
use App\Models\User;
use App\Models\LogisticsInventory;
use Illuminate\Http\Request;
use Ramsey\Uuid\Guid\Fields;
use App\Models\OdooStockPicking;
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
     * Get Users.
     *
     * @return \Illuminate\Http\Response
     */
    public function getUsers()
    {
        $users     = array();
        $qry_users = User::orderBy('first_name', 'ASC')->get();
        foreach ($qry_users as $user) {
            $users[] = array(
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'username' => $user->username,
                'id_pole' => $user->id_pole
            );
        }
        return response()->json($users,200);
    }

    /**
     * Get User Roles.
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function getUserRoles($id)
    {
        $roles = User::find($id)->roles;
        return response()->json($roles,200);
    }

    /**
     * Get User.
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function getUser($id)
    {
        $user = User::find($id);
        return response()->json($user,200);
    }

    /**
     * Get User Systems.
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function getUserSystems($id)
    {
        $systems = User::find($id)->systems;
        return response()->json($systems,200);
    }
    /**
     * Get User Projects.
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function getUserProjects($id)
    {
        $projects = User::find($id)->projects;
        return response()->json($projects,200);
    }
    
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
     * Get Projects by Pole id.
     *
     * @return \Illuminate\Http\Response
     */
    public function getProjectsByPole($id)
    {
        $projects = SystPole::find($id)->projects;
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

    /**
     * Set lote in dispatch.
     *
     * @return \Illuminate\Http\Response
     */
    public function setLotesDispatch()
    {
        try {
            $dispatch = LogisticsReceiptItemDispatch::select('id', 'odoo_id_stock_picking')->get();
            foreach ($dispatch as $item) {
                $lote_oc = OdooStockPicking::leftJoin('stock_move_line', 'stock_move_line.picking_id', 'stock_picking.id')
                                        ->leftJoin('stock_production_lot', 'stock_production_lot.id', 'stock_move_line.lot_id')
                                        ->leftJoin('purchase_order', 'purchase_order.id', 'stock_production_lot.purchase_order_id')
                                        ->select('stock_production_lot.name AS lote', 'purchase_order.name AS oc')
                                        ->where('stock_picking.id', $item->odoo_id_stock_picking)
                                        ->first();
                $row = LogisticsReceiptItemDispatch::find($item->id);
                $row->oc = $lote_oc->oc;
                $row->lote = $lote_oc->lote;
                $row->save();
            }
        } catch (Throwable $th) {
            $response = array('success' => false, 'error' => $th->getMessage());
            return response()->json($response, 200);
        }

        // Response
        $response = array('success' => true);
        return response()->json($response, 200);
    }

    /**
     * Set OC in oc items.
     *
     * @return \Illuminate\Http\Response
     */
    public function setOC()
    {
        try {
            $entries = LogisticsReceipt::select('id', 'oc', 'type')->get();
            foreach ($entries as $entry) {
                if ($entry->type == 'oc') {
                    LogisticsReceiptItemOc::where('id_receipt', $entry->id)->update([
                        'oc' => $entry->oc
                    ]);
                }
            }
        } catch (Throwable $th) {
            $response = array('success' => false, 'error' => $th->getMessage());
            return response()->json($response, 200);
        }

        // Response
        $response = array('success' => true);
        return response()->json($response, 200);
    }

    /**
     * Set inventory data.
     *
     * @return \Illuminate\Http\Response
     */
    public function setInventory()
    {
        try {
            // SET STOCK
            $qry_entries = LogisticsReceipt::with('itemsOc', 'itemsDispatch', 'itemsTransfer', 'getProject', 'getPole', 'getWarehouse')
                                ->whereNull('logistics_receipts.cancel')
                                ->where('logistics_receipts.confirm', 1)
                                ->orderBy('logistics_receipts.id', 'DESC')
                                ->get();
            foreach ($qry_entries as $entry) {
                $items = array();
                if ($entry->type == 'oc') {
                    $items = $entry->itemsOc;
                }
                if ($entry->type == 'dispatch') {
                    $items = $entry->itemsDispatch;
                }
                if ($entry->type == 'transfer') {
                    $items = $entry->itemsTransfer;
                }

                foreach ($items as $product) {

                    // Create product ID
                    if ($entry->type == 'oc') {
                        $inventory_code = 'oc.' . $product->odoo_id_order . '.' . $product->odoo_id_order_line . '.' . $entry->warehouse;
                    }
                    if ($entry->type == 'dispatch') {
                        $inventory_code = 'dispatch.' . $product->odoo_id_stock_picking . '.' . $product->odoo_id_stock_move . '.' . $entry->warehouse;
                    }
                    if ($entry->type == 'transfer') {
                        $arr_inventory = explode('.', $product->id_inventory);
                        $inventory_code = $arr_inventory[0] . '.' . $arr_inventory[1] . '.' . $arr_inventory[2] . '.' . $entry->warehouse;
                    }

                    if (LogisticsInventory::where('inventory_code', $inventory_code)->exists()) {
                        // Update inventory Stock
                        $inventory = LogisticsInventory::where('inventory_code', $inventory_code)->first();
                        $inventory->stock = floatval($inventory->stock) + floatval($product->received_quantity);
                        $inventory->save();

                        // Set inventory ID
                        $product->id_inventory = $inventory->id;
                        $product->save();
                    }
                    else {
                        // Create inventory with stock
                        $inventory = new LogisticsInventory([
                            'inventory_code' => $inventory_code,
                            'stock' => floatval($product->received_quantity),
                            'warehouse' => $entry->warehouse,
                            'project' => $entry->project,
                            'pole' => $entry->pole,
                            'oc' => $product->oc,
                            'product_code' => $product->product_code,
                            'category_name' => $product->category_name,
                            'item_description' => $product->item_description,
                            'um' => $product->um,
                            'price_unit' => $product->price_unit,
                            'price_total' => $product->price_total,
                            'stowage_card' => $product->stowage_card,
                            'type' => $entry->type
                        ]);
                        $inventory->save();

                        // Set inventory ID
                        $product->id_inventory = $inventory->id;
                        $product->save();
                    }
                }
            }

            // SET RESERVED
            $qry_outputs = LogisticsOutput::with('Items', 'getProject', 'getPole', 'getWarehouse')
                                ->whereNull('logistics_outputs.cancel')
                                ->orderBy('id', 'DESC')->get();
            foreach ($qry_outputs as $output) {
                $items = array();
                if (!$output->Items->isEmpty()) {
                    $items = $output->Items;
                }

                foreach ($items as $product) {
                    
                    if ($output->confirm == 1) {
                        $inventory = LogisticsInventory::where('inventory_code', $product->id_inventory)->first();
                        $inventory->stock = floatval($inventory->stock) - floatval($product->quantity);
                        $inventory->save();
                    }
                    else {
                        $inventory = LogisticsInventory::where('inventory_code', $product->id_inventory)->first();
                        $inventory->reserved = floatval($inventory->reserved) + floatval($product->quantity);
                        $inventory->save();
                    }
                }
            }

            // SET AVAILABLE
            $qry_inventory = LogisticsInventory::all();
            foreach ($qry_inventory as $inventory) {
                $item = LogisticsInventory::find($inventory->id);
                $item->available = floatval($inventory->stock) - floatval($inventory->reserved);
                $item->save();
            }

        } catch (Throwable $th) {
            $response = array('success' => false, 'error' => $th->getMessage());
            return response()->json($response, 200);
        }

        // Response
        $response = array('success' => true);
        return response()->json($response, 200);
    }
}
