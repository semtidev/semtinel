<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StructureController;
use App\Http\Controllers\AppController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\OdooAeiController;
use App\Http\Controllers\LogisticsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('login/auth', [AuthController::class, "login"])->name('api.login.auth');
Route::post('login/ldap', [AuthController::class, "loginLdap"])->name('api.login.ldap');

Route::get('tree_structures', [StructureController::class, "getTreeStructures"])->name('get.treestructures');
Route::put('structure', [StructureController::class, "updateStructure"])->name('update.structure');
Route::post('structure/delete', [StructureController::class, "deleteStructure"])->name('delete.structure');

Route::middleware('auth:sanctum')->group(function () {
    // Data Base
    Route::get('admin/dispatch/lotes', [AdminController::class, "setLotesDispatch"])->name('admin.dispatch.lotes');
    Route::get('admin/inventory', [AdminController::class, "setInventory"])->name('admin.set.inventory');
    Route::get('admin/oc', [AdminController::class, "setOC"])->name('admin.set.oc');

    // System
    Route::get('eop/{project}/{parent?}', [AppController::class, "treeEop"])->name('api.system.get.eop');
    // Poles & Projects
    Route::get('poles', [AdminController::class, "getPoles"])->name('api.admin.get.poles');
    Route::get('projects', [AdminController::class, "getProjects"])->name('api.admin.get.projects');
    Route::get('projectsbypole/{pole_id}', [AdminController::class, "getProjectsByPole"])->name('api.admin.get.projectsbypole');
    // Admin Systems
    Route::get('admin/systems', [AdminController::class, "getSystems"])->name('api.admin.get.system');
    Route::post('admin/system', [AdminController::class, "storeSystem"])->name('api.admin.store.system');
    Route::delete('admin/system/{id}', [AdminController::class, "destroySystem"])->name('api.admin.destroy.system');
    // Admin Roles
    Route::get('admin/roles', [AdminController::class, "getRoles"])->name('api.admin.get.roles');
    Route::post('admin/role', [AdminController::class, "storeRole"])->name('api.admin.store.role');
    Route::delete('admin/role/{id}', [AdminController::class, "destroyRole"])->name('api.admin.destroy.role');
    Route::get('admin/role/permissions/{id}', [AdminController::class, "getRolePermissions"])->name('api.admin.get.role_permissions');
    // Admin Permissions
    Route::get('admin/permissions', [AdminController::class, "getPermissions"])->name('api.admin.get.permissions');
    Route::post('admin/permission', [AdminController::class, "storePermission"])->name('api.admin.store.permission');
    Route::delete('admin/permission/{id}', [AdminController::class, "destroyPermission"])->name('api.admin.destroy.permission');
    Route::get('admin/permission/roles/{id}', [AdminController::class, "getPermissionRoles"])->name('api.admin.get.permission_roles');
    // Admin Users
    Route::get('admin/users', [AdminController::class, "getUsers"])->name('api.admin.get.users');
    Route::post('user/register', [AuthController::class, "createUser"])->name('api.admin.create.user');
    Route::delete('user/{id}', [AuthController::class, "destroyUser"])->name('api.admin.destroy.user');
    Route::put('user', [AuthController::class, "updateUser"])->name('api.admin.update.user');
    Route::get('admin/user/{id}', [AdminController::class, "getUser"])->name('api.admin.get.user');
    Route::get('admin/user/roles/{id}', [AdminController::class, "getUserRoles"])->name('api.admin.get.userroles');
    Route::get('admin/user/systems/{id}', [AdminController::class, "getUserSystems"])->name('api.admin.get.usersystems');
    Route::get('admin/user/projects/{id}', [AdminController::class, "getUserProjects"])->name('api.admin.get.userprojects');
    // Logistics Warehouses
    Route::get('logistics/warehouses/{project?}', [AdminController::class, "getWarehouses"])->name('api.admin.get.warehouses');
    Route::post('logistics/warehouse', [AdminController::class, "storeWarehouse"])->name('api.admin.store.warehouse');
    Route::delete('logistics/warehouse/{id}', [AdminController::class, "destroyWarehouse"])->name('api.admin.destroy.warehouse');
    // Logistics
    Route::get('logistics/entries/{pole}/{project}', [LogisticsController::class, "getEntries"])->name('logistics.api.get.entries');
    Route::get('logistics/products_categories', [AdminController::class, "getProductsCategories"])->name('app.api.admin.get.productcategories');
    Route::post('logistics/entry/data', [OdooAeiController::class, "getEntryData"])->name('app.api.odoo.get.entry');
    Route::post('logistics/entry', [LogisticsController::class, "storeEntry"])->name('logistics.api.store.entry');
    Route::post('logistics/entry/item/stowage_card', [LogisticsController::class, "getStowageCard"])->name('logistics.api.get.stowage_card');
    Route::post('logistics/entry/upload', [LogisticsController::class, 'attachEntryScanning'])->name('logistics.api.upload.entry');
    Route::post('logistics/entry/confirm', [LogisticsController::class, 'confirmEntry'])->name('logistics.api.cofirm.entry');
    Route::post('logistics/entry/cancel', [LogisticsController::class, 'cancelEntry'])->name('logistics.api.cancel.entry');
    Route::post('logistics/inventory/products', [LogisticsController::class, 'getInventoryProducts'])->name('logistics.api.inventory.products');
    Route::post('logistics/inventory/lastproducts', [LogisticsController::class, 'getInventoryLastProducts'])->name('logistics.api.inventory.lastproducts');
    Route::post('logistics/inventory/history/{oc?}', [LogisticsController::class, 'getInventoryHistory'])->name('logistics.api.inventory.history');
    Route::post('logistics/output', [LogisticsController::class, "storeOutput"])->name('logistics.api.store.output');
    Route::get('logistics/outputs/{pole}/{project}', [LogisticsController::class, "getOutputs"])->name('logistics.api.get.outputs');
    Route::post('logistics/output/upload', [LogisticsController::class, 'attachOutputScanning'])->name('logistics.api.upload.output');
    Route::post('logistics/output/confirm', [LogisticsController::class, 'confirmOutput'])->name('logistics.api.cofirm.output');
    Route::post('logistics/output/cancel', [LogisticsController::class, 'cancelOutput'])->name('logistics.api.cancel.output');
});

// PDF routes
Route::get('logistics/pdf/entry/{id}/{watermark?}', [LogisticsController::class, "getEntryPDF"])->name('logistics.api.pdf.entry');
Route::get('logistics/pdf/output/{id}/{watermark?}', [LogisticsController::class, "getOutputPDF"])->name('logistics.api.pdf.output');