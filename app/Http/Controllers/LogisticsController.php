<?php

namespace App\Http\Controllers;

use Throwable;
use DateTime;
use App\Models\LogisticsReceipt;
use App\Models\LogisticsReceiptItemOc;
use App\Models\LogisticsReceiptItemDispatch;
use App\Models\SystPole;
use App\Models\SystStructureProject;
use App\Models\SystWarehouse;
use App\Models\User;
use App\Models\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\PDF as PDF;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;

class LogisticsController extends Controller
{
    /**
     * Display the Logistics view.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('logistics', []);
    }

    /**
     * Get Entries.
     *
     * @return \Illuminate\Http\Response
     */
    public function getEntries(Request $request, $pole, $project, $reload = false)
    {
        session_start();
        $session = $_SESSION['semtinel'];
        $fields  = $request->all();
        $entries = array();

        if (!$reload && Cache::get('entries') != null) {
            $entries = Cache::get('entries');
        }
        else {
            $qry_entries = LogisticsReceipt::where('pole', $pole)
                                ->where('project', intval($project))
                                ->whereNull('cancel')
                                ->orderBy('id', 'DESC')->get();
            foreach ($qry_entries as $entry) {
                $items = array();
                $is_oc = true;
                if (LogisticsReceiptItemOc::where('id_receipt', $entry->id)->exists()) {
                    $items = $entry->itemsOc;
                }
                if (LogisticsReceiptItemDispatch::where('id_receipt', $entry->id)->exists()) {
                    $items = $entry->itemsDispatch;
                    $is_oc = false;
                }
                // Formater dates
                $arr_created = explode(' ', $entry->created_at);
                $arr_created_date = explode('-', $arr_created[0]);
                $created_at = $arr_created_date[2] . '/' . $arr_created_date[1] . '/' . $arr_created_date[0];
                
                $arr_updated = explode(' ', $entry->updated_at);
                $arr_updated_date = explode('-', $arr_updated[0]);
                $updated_at = $arr_updated_date[2] . '/' . $arr_updated_date[1] . '/' . $arr_updated_date[0];

                // Project
                $project = SystStructureProject::find(intval($entry->project));

                // Pole
                $pole = SystPole::where('abbr', $entry->pole)->first();

                // document_number
                $docum_number = ($is_oc) ? $entry->document_number : $project->abbr . "/OUT/" . $entry->document_number;

                // Get attach type
                $attach_type = '';
                if ($entry->attach_path != '' && $entry->attach_path != null) {
                    $attach_arr = explode('.', $entry->attach_path);
                    switch ($attach_arr[1]) {
                        case 'pdf':
                            $attach_type = 'pdf';
                            break;
                        case 'png':
                            $attach_type = 'png';
                            break;
                        default:
                            $attach_type = 'jpg';
                            break;
                    }
                }
                
                $entries[] = array(
                    'id' => $entry->id,
                    'origin' => $entry->origin,
                    'document_type' => ($entry->document_type != null && $entry->document_type != '') ? $entry->document_type : '- Ninguna -',
                    'document_number' => $docum_number,
                    'oc' => ($entry->oc != null && $entry->oc != '') ? $entry->oc : '- Ninguna -',
                    'created_at' => $created_at,
                    'updated_at' => $updated_at,
                    'created_by' => $entry->created_by,
                    'updated_by' => $entry->updated_by,
                    'pole' => $pole->abbr,
                    'pole_name' => $pole->name,
                    'project' => $entry->project,
                    'project_abbr' => $project->abbr,
                    'project_name' => $project->name,
                    'warehouse' => $entry->warehouse,
                    'warehouse_name' => SystWarehouse::find(intval($entry->warehouse))->name,
                    'warehouse_owner' => $entry->warehouse_owner,
                    'comment' => $entry->comment,
                    'status' => ucfirst($entry->status),
                    'attach_path' => $entry->attach_path,
                    'attach_type' => $attach_type,
                    'confirm' => $entry->confirm,
                    'items' => $items,
                    'type' => ($is_oc) ? 'oc' : 'dispatch'
                );
            }

            Cache::forever('entries', $entries);
        }
        return response()->json($entries, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function storeEntry(Request $request)
    {
        $fields = $request->all();
        $client = getIP();

        if ($fields['origin']['doctype_value'] == 'Conduce' || $fields['origin']['doctype_value'] == null || $fields['origin']['doctype_value'] == '') {
            try {
                // Save entry
                $entry = new LogisticsReceipt([
                    'origin' => $fields['origin']['origin'],
                    'document_type' => $fields['origin']['doctype_value'],
                    'document_number' => $fields['origin']['docnum_value'],
                    'oc' => $fields['origin']['ocnumber'],
                    'created_by' => $fields['user'],
                    'updated_by' => $fields['user'],
                    'pole' => $fields['destin']['pole'],
                    'project' => $fields['destin']['project'],
                    'warehouse' => $fields['destin']['warehouse'],
                    'warehouse_owner' => $fields['destin']['warehouse_owner'],
                    'comment' => $fields['destin']['comment'],
                    'status' => $fields['status']
                ]);
                $entry->save();
                // Save entry items
                $id_entry = $entry->id;
                foreach ($fields['items'] as $key => $item) {
                    if ($item['received_quantity'] > 0) {
                        $entry_item = new LogisticsReceiptItemOc([
                            'id_receipt' => $id_entry,
                            'odoo_id_order_line' => $item['id'],
                            'odoo_id_order' => $item['order_id'],
                            'product_code' => $item['cod_product'],
                            'category_name' => $item['category_name'],
                            'category_complete_name' => $item['category_complete_name'],
                            'product_description' => $item['generic_descript'],
                            'item_description' => $item['item_description'],
                            'um' => $item['um'],
                            'received_quantity' => $item['received_quantity'],
                            'stowage_card' => $item['stowage_card'],
                            'price_unit' => $item['price_unit'],
                            'price_total' => $item['price_total'],
                            'sequence' => $item['sequence'],
                            'comment' => $item['comment']
                        ]);
                        $entry_item->save();
                    }
                }
            } catch (Throwable $th) {
                $response = array('success' => false, 'error' => $th->getMessage());
                return response()->json($response, 200);
            }            
        }
        else {
            try {
                // Save entry
                $entry = new LogisticsReceipt([
                    'origin' => $fields['origin']['origin'],
                    'document_type' => $fields['origin']['doctype_value'],
                    'document_number' => $fields['origin']['docnum_value'],
                    'created_by' => $fields['user'],
                    'updated_by' => $fields['user'],
                    'pole' => $fields['destin']['pole'],
                    'project' => $fields['destin']['project'],
                    'warehouse' => $fields['destin']['warehouse'],
                    'warehouse_owner' => $fields['destin']['warehouse_owner'],
                    'comment' => $fields['destin']['comment'],
                    'status' => $fields['status']
                ]);
                $entry->save();
                // Save entry items
                $id_entry = $entry->id;
                foreach ($fields['items'] as $key => $item) {
                    if ($item['received_quantity'] > 0) {
                        $entry_item = new LogisticsReceiptItemDispatch([
                            'id_receipt' => $id_entry,
                            'odoo_id_stock_move' => $item['id'],
                            'odoo_id_stock_picking' => $item['picking_id'],
                            'oc' => $item['oc'],
                            'product_code' => $item['cod_product'],
                            'category_name' => $item['category_name'],
                            'category_complete_name' => $item['category_complete_name'],
                            'docnum' => $item['docnum'],
                            'item_description' => $item['item_description'],
                            'um' => $item['um'],
                            'product_quantity' => floatval($item['product_quantity']),
                            'received_quantity' => floatval($item['received_quantity']),
                            'stowage_card' => $item['stowage_card'],
                            'price_unit' => floor($item['price_unit'] * 100)/100,
                            'price_total' => $item['price_total'],
                            'comment' => $item['comment']
                        ]);
                        $entry_item->save();
                    }
                }
            } catch (Throwable $th) {
                $response = array('success' => false, 'error' => $th->getMessage());
                return response()->json($response, 200);
            }
        }

        // Save log
        $new_log = new Log([
            'pole' => $fields['destin']['pole'],
            'project' => $fields['destin']['project'],
            'client' => $client,
            'action' => 'create-entry',
            'description' => 'Entrada Creada',
            'entity_id' => $entry->id,
            'user' => $fields['user']
        ]);
        $new_log->save();

        $response = array('success' => true, 'entry' => $entry->id);
        return response()->json($response, 200);
    }

    /**
     * Generate PDF documentation of the entry.
     *
     * @param  int  $entry
     * @return \Illuminate\Http\Response
     */
    public function getEntryPDF($id)
    {
        $items = array();
        $is_oc = true;
        $entry = LogisticsReceipt::find(intval($id));
        
        if (LogisticsReceiptItemOc::where('id_receipt', $entry->id)->exists()) {
            $items = $entry->itemsOc;
        }
        if (LogisticsReceiptItemDispatch::where('id_receipt', $entry->id)->exists()) {
            $items = $entry->itemsDispatch;
            $is_oc = false;
        }
        
        // Formater dates
        $arr_created = explode(' ', $entry->created_at);
        $arr_created_date = explode('-', $arr_created[0]);
        $created_at = $arr_created_date[2] . '/' . $arr_created_date[1] . '/' . $arr_created_date[0];
        
        $arr_updated = explode(' ', $entry->updated_at);
        $arr_updated_date = explode('-', $arr_updated[0]);
        $updated_at = $arr_updated_date[2] . '/' . $arr_updated_date[1] . '/' . $arr_updated_date[0];

        // Get Pole and Project name
        $pole    = SystPole::where('abbr', $entry->pole)->first();
        $project = SystStructureProject::find(intval($entry->project));

        // Get warehouse name and owner
        $warehouse = SystWarehouse::find(intval($entry->warehouse));
        $warehouse_name  = $warehouse->name;
        $warehouse_owner = $warehouse->owner;

        // document_number
        $docum_number = ($is_oc) ? $entry->document_number : $project->abbr . '/OUT/' . $entry->document_number;
        
        $data = array(
            'id' => $entry->id,
            'origin' => $entry->origin,
            'document_type' => ($entry->document_type != '' || $entry->document_type != null) ? $entry->document_type : '-',
            'document_number' => $docum_number,
            'oc' => ($entry->oc != '' || $entry->oc != null) ? $entry->oc : '-',
            'created_at' => $created_at,
            'updated_at' => $updated_at,
            'created_by' => $entry->created_by,
            'updated_by' => $entry->updated_by,
            'pole' => $pole,
            'project' => $project,
            'warehouse_name' => $warehouse_name,
            'warehouse_owner' => $warehouse_owner,
            'comment' => $entry->comment,
            'status' => ucfirst($entry->status),
            'items' => $items
        );
        
        $pdf = app('dompdf.wrapper');
        $pdf->loadView('pdf.logistics.entry', $data);
        return $pdf->download($entry->document_number . '.pdf');
    }

    /**
     * Attach entry document.
     */
    public function attachEntryScanning(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:jpg,jpeg,png,pdf|max:5020'   // jpg,jpeg,png,
        ]);
 
        $fields = $request->all();
        $entryUpload = LogisticsReceipt::find(intval($fields['id']));
        $client = getIP();

        if($request->file()) {
            $original_name = explode('.', $request->file->getClientOriginalName());
            $file_name = $request->entry . '.' . $original_name[1];
            $file_name = str_replace('/', '_', $file_name);
            $file_path = $request->file('file')->storeAs('uploads', $file_name, 'public');
            $entryUpload->attach_path = $file_path;
            $entryUpload->save();

            // Save log
            $new_log = new Log([
                'pole' => $fields['pole'],
                'project' => $fields['project'],
                'client' => $client,
                'action' => 'attach-entry',
                'description' => 'Archivo Adjuntado a Entrada',
                'entity_id' => $entryUpload->id,
                'user' => $fields['user']
            ]);
            $new_log->save();

            $response = array('success' => true, 'path' => $file_path);
            return response()->json($response, 200);
        }

        $response = array('success' => false);
        return response()->json($response, 200);
    }

    /**
     * Confirm Entry.
     */
    public function confirmEntry(Request $request)
    { 
        $fields = $request->all();
        $entry  = LogisticsReceipt::find(intval($fields['entry']));
        $client = getIP();

        $entry->confirm = 1;
        $entry->save();

        // Save log
        $new_log = new Log([
            'pole' => $fields['pole'],
            'project' => $fields['project'],
            'client' => $client,
            'action' => 'confirm-entry',
            'description' => 'Entrada Confirmada',
            'entity_id' => $entry->id,
            'user' => $fields['user']
        ]);
        $new_log->save();

        $response = array('success' => true);
        return response()->json($response, 200);
    }

    /**
     * Cancel Entry.
     */
    public function cancelEntry(Request $request)
    { 
        $fields = $request->all();
        $entry  = LogisticsReceipt::find(intval($fields['entry']));
        $client = getIP();

        if ($entry->confirm == 1) {
            $response = array('success' => false);
            return response()->json($response, 200);
        }
        
        $entry->cancel = 1;
        $entry->cancel_by = $request->user;
        $entry->save();

        // Save log
        $new_log = new Log([
            'pole' => $fields['pole'],
            'project' => $fields['project'],
            'client' => $client,
            'action' => 'cancel-entry',
            'description' => 'Entrada Cancelada',
            'entity_id' => $entry->id,
            'user' => $fields['user']
        ]);
        $new_log->save();

        $response = array('success' => true);
        return response()->json($response, 200);
    }

    //   INVENTORY

    /**
     * Get Inventory products.
     *
     * @return \Illuminate\Http\Response
     */
    public function getInventoryProducts(Request $request)
    {
        $fields   = $request->all();
        $products = array();
        
        try {
            $qry_entries = LogisticsReceipt::leftJoin('syst_warehouses', 'syst_warehouses.id', 'logistics_receipts.warehouse')
                            ->select(
                                'logistics_receipts.id',
                                'logistics_receipts.pole',
                                'logistics_receipts.project',
                                'logistics_receipts.oc',
                                'syst_warehouses.id as warehouse_id',
                                'syst_warehouses.name as warehouse_name',
                                'syst_warehouses.owner as warehouse_owner'
                            )
                            ->where('pole', $fields['pole'])
                            ->where('project', intval($fields['project']))
                            ->whereNull('cancel')
                            ->orderBy('id', 'DESC')->get();
            
            foreach ($qry_entries as $entry) {
                $items = array();
                $is_oc = true;
                if (LogisticsReceiptItemOc::where('id_receipt', $entry->id)->exists()) {
                    $items = $entry->itemsOc;
                }
                if (LogisticsReceiptItemDispatch::where('id_receipt', $entry->id)->exists()) {
                    $items = $entry->itemsDispatch;
                    $is_oc = false;
                }

                // Type
                $type = ($is_oc) ? 'oc' : 'dispatch';

                // Project
                $project = SystStructureProject::find(intval($entry->project));

                // Pole
                $pole = SystPole::where('abbr', $entry->pole)->first();
                
                foreach ($items as $product) {
                    // Formater dates
                    $arr_created = explode(' ', $product->created_at);
                    $arr_created_date = explode('-', $arr_created[0]);
                    $created_at = $arr_created_date[2] . '/' . $arr_created_date[1] . '/' . $arr_created_date[0];
                    
                    $arr_updated = explode(' ', $product->updated_at);
                    $arr_updated_date = explode('-', $arr_updated[0]);
                    $updated_at = $arr_updated_date[2] . '/' . $arr_updated_date[1] . '/' . $arr_updated_date[0];

                    // Create product ID
                    $product_id = ($type == 'oc') ? 'oc.' . $product->odoo_id_order . '.' . $product->odoo_id_order_line : 'dispatch.' . $product->odoo_id_stock_picking . '.' . $product->odoo_id_stock_move;

                    if (isset($products[$product_id])) {
                        $products[$product_id]['quantity'] += $product->received_quantity;
                        $products[$product_id]['quantity'] = number_format($products[$product_id]['quantity'], 3, '.', ' ');
                    }
                    else {
                        $products[$product_id] = array(
                            'id' => $product->id,
                            'id_receipt' => $entry->id,
                            'pole' => $pole,
                            'project' => $project,
                            'oc' => ($type == 'oc') ? $entry->oc : $product->oc,
                            'product_code' => $product->product_code,
                            'category_name' => $product->category_name,
                            'category_complete_name' => $product->category_complete_name,
                            'description' => $product->item_description,
                            'um' => $product->um,
                            'quantity' => number_format($product->received_quantity, 3, '.', ' '),
                            'warehouse_id' => $entry->warehouse_id,
                            'warehouse_name' => $entry->warehouse_name,
                            'warehouse_owner' => $entry->warehouse_owner,
                            'stowage_card' => $product->stowage_card,
                            'type' => $type
                        );
                    }                    
                }
            }
        } catch (Throwable $th) {
            $response = array('success' => false, 'error' => $th->getMessage());
            return response()->json($response, 200);
        }

        $response = array('success' => true, 'products' => $products);
        return response()->json($response, 200);
    }

    /**
     * Get Inventory last products.
     *
     * @return \Illuminate\Http\Response
     */
    public function getInventoryLastProducts(Request $request)
    {
        $fields   = $request->all();
        $products = array();
        
        try {
            if ($fields['period'] == 'today') {
                $qry_entries = LogisticsReceipt::leftJoin('syst_warehouses', 'syst_warehouses.id', 'logistics_receipts.warehouse')
                                ->select(
                                    'logistics_receipts.id',
                                    'logistics_receipts.pole',
                                    'logistics_receipts.project',
                                    'logistics_receipts.oc',
                                    'syst_warehouses.id as warehouse_id',
                                    'syst_warehouses.name as warehouse_name',
                                    'syst_warehouses.owner as warehouse_owner'
                                )
                                ->where('pole', $fields['pole'])
                                ->where('project', intval($fields['project']))
                                ->whereDay('created_at' , date('d'))
                                ->whereNull('cancel')
                                ->orderBy('id', 'DESC')->get();
            }
            elseif ($fields['period'] == 'currentmonth') {
                $qry_entries = LogisticsReceipt::leftJoin('syst_warehouses', 'syst_warehouses.id', 'logistics_receipts.warehouse')
                                ->select(
                                    'logistics_receipts.id',
                                    'logistics_receipts.pole',
                                    'logistics_receipts.project',
                                    'logistics_receipts.oc',
                                    'syst_warehouses.id as warehouse_id',
                                    'syst_warehouses.name as warehouse_name',
                                    'syst_warehouses.owner as warehouse_owner'
                                )
                                ->where('pole', $fields['pole'])
                                ->where('project', intval($fields['project']))
                                ->whereMonth('created_at' , date('m'))
                                ->whereNull('cancel')
                                ->orderBy('id', 'DESC')->get();
            }
            elseif ($fields['period'] == 'currentyear') {
                $qry_entries = LogisticsReceipt::leftJoin('syst_warehouses', 'syst_warehouses.id', 'logistics_receipts.warehouse')
                                ->select(
                                    'logistics_receipts.id',
                                    'logistics_receipts.pole',
                                    'logistics_receipts.project',
                                    'logistics_receipts.oc',
                                    'syst_warehouses.id as warehouse_id',
                                    'syst_warehouses.name as warehouse_name',
                                    'syst_warehouses.owner as warehouse_owner'
                                )
                                ->where('pole', $fields['pole'])
                                ->where('project', intval($fields['project']))
                                ->whereYear('created_at' , date('Y'))
                                ->whereNull('cancel')
                                ->orderBy('id', 'DESC')->get();
            }
            elseif ($fields['period'] == 'currentweek') {
                $qry_entries = LogisticsReceipt::leftJoin('syst_warehouses', 'syst_warehouses.id', 'logistics_receipts.warehouse')
                                ->select(
                                    'logistics_receipts.id',
                                    'logistics_receipts.pole',
                                    'logistics_receipts.project',
                                    'logistics_receipts.oc',
                                    'syst_warehouses.id as warehouse_id',
                                    'syst_warehouses.name as warehouse_name',
                                    'syst_warehouses.owner as warehouse_owner'
                                )
                                ->where('pole', $fields['pole'])
                                ->where('project', intval($fields['project']))
                                ->whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
                                ->whereNull('cancel')
                                ->orderBy('id', 'DESC')->get();
            }
            
            foreach ($qry_entries as $entry) {
                $items = array();
                $is_oc = true;
                if (LogisticsReceiptItemOc::where('id_receipt', $entry->id)->exists()) {
                    $items = $entry->itemsOc;
                }
                if (LogisticsReceiptItemDispatch::where('id_receipt', $entry->id)->exists()) {
                    $items = $entry->itemsDispatch;
                    $is_oc = false;
                }

                // Type
                $type = ($is_oc) ? 'oc' : 'dispatch';

                // Project
                $project = SystStructureProject::find(intval($entry->project));

                // Pole
                $pole = SystPole::where('abbr', $entry->pole)->first();
                
                foreach ($items as $product) {
                    // Formater dates
                    $arr_created = explode(' ', $product->created_at);
                    $arr_created_date = explode('-', $arr_created[0]);
                    $created_at = $arr_created_date[2] . '/' . $arr_created_date[1] . '/' . $arr_created_date[0];
                    
                    $arr_updated = explode(' ', $product->updated_at);
                    $arr_updated_date = explode('-', $arr_updated[0]);
                    $updated_at = $arr_updated_date[2] . '/' . $arr_updated_date[1] . '/' . $arr_updated_date[0];

                    // Create product ID
                    $product_id = ($type == 'oc') ? 'oc.' . $product->odoo_id_order . '.' . $product->odoo_id_order_line : 'dispatch.' . $product->odoo_id_stock_picking . '.' . $product->odoo_id_stock_move;

                    if (isset($products[$product_id])) {
                        $products[$product_id]['quantity'] += $product->received_quantity;
                        $products[$product_id]['quantity'] = number_format($products[$product_id]['quantity'], 3, '.', ' ');
                    }
                    else {
                        $products[$product_id] = array(
                            'id' => $product->id,
                            'id_receipt' => $entry->id,
                            'pole' => $pole,
                            'project' => $project,
                            'oc' => ($type == 'oc') ? $entry->oc : $product->oc,
                            'product_code' => $product->product_code,
                            'category_name' => $product->category_name,
                            'category_complete_name' => $product->category_complete_name,
                            'description' => $product->item_description,
                            'um' => $product->um,
                            'quantity' => number_format($product->received_quantity, 3, '.', ' '),
                            'warehouse_id' => $entry->warehouse_id,
                            'warehouse_name' => $entry->warehouse_name,
                            'warehouse_owner' => $entry->warehouse_owner,
                            'stowage_card' => $product->stowage_card,
                            'type' => $type
                        );
                    }                    
                }
            }
        } catch (Throwable $th) {
            $response = array('success' => false, 'error' => $th->getMessage());
            return response()->json($response, 200);
        }

        $response = array('success' => true, 'products' => $products);
        return response()->json($response, 200);
    }

    /**
     * Get Inventory history.
     *
     * @return \Illuminate\Http\Response
     */
    public function getInventoryHistory(Request $request, $id_receipt = 0, $id_product = 0)
    {
        $fields  = $request->all();
        $history = array();
        
        try {
            if ($fields['period'] == 'today') {
                $qry_logs = Log::where('pole', $fields['pole'])
                                ->where('project', intval($fields['project']))
                                ->whereDay('created_at' , date('d'))
                                ->orderBy('id', 'DESC')->get();
            }
            elseif ($fields['period'] == 'currentmonth') {
                $qry_logs = Log::where('pole', $fields['pole'])
                                ->where('project', intval($fields['project']))
                                ->whereMonth('created_at' , date('m'))
                                ->orderBy('id', 'DESC')->get();
            }
            elseif ($fields['period'] == 'currentyear') {
                $qry_logs = Log::where('pole', $fields['pole'])
                                ->where('project', intval($fields['project']))
                                ->whereYear('created_at' , date('Y'))
                                ->orderBy('id', 'DESC')->get();
            }
            elseif ($fields['period'] == 'currentweek') {
                $qry_logs = Log::where('pole', $fields['pole'])
                                ->where('project', intval($fields['project']))
                                ->whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
                                ->orderBy('id', 'DESC')->get();
            }
            else {
                $qry_logs = Log::where('pole', $fields['pole'])
                                ->where('project', intval($fields['project']))
                                ->orderBy('id', 'DESC')->get();
            }
            
            foreach ($qry_logs as $log) {
                
                // Get date
                $arr_created = explode(' ', $log->created_at);
                $date = $arr_created[0];
                $hour_arr = explode(':', $arr_created[1]);
                $hour = $hour_arr[0] . ':' . $hour_arr[1];
                
                // History entry type
                if (strpos($log->action, 'entry') !== false) {
                    $entry = LogisticsReceipt::leftJoin('syst_warehouses', 'syst_warehouses.id', 'logistics_receipts.warehouse')
                                    ->select(
                                        'logistics_receipts.id',
                                        'logistics_receipts.origin',
                                        'logistics_receipts.document_number',
                                        'logistics_receipts.oc',
                                        'logistics_receipts.created_at',
                                        'logistics_receipts.created_by',
                                        'logistics_receipts.warehouse_owner',
                                        'logistics_receipts.status',
                                        'logistics_receipts.attach_path',
                                        'logistics_receipts.confirm',
                                        'logistics_receipts.cancel',
                                        'logistics_receipts.cancel_by',
                                        'syst_warehouses.name as warehouse_name'
                                    )
                                    ->where('logistics_receipts.id', $log->entity_id)
                                    ->first();
                    
                    $is_oc = true;
                    if (LogisticsReceiptItemDispatch::where('id_receipt', $entry->id)->exists()) {
                        $is_oc = false;
                    }

                    // project
                    $project = $log->getProject;

                    // document_number
                    $docum_number = ($is_oc) ? $entry->document_number : $project->abbr . "/OUT/" . $entry->document_number;

                    // user
                    $log_user = $log->getUser;

                    if ($id_receipt == 0 && $id_product == 0) {
                        
                        // Entry created
                        if ($log->action == 'create-entry') {
                            $history[$date][] = array(
                                'node_type' => $log->action,
                                'id' => $entry->id,
                                'origin' => $entry->origin,
                                'document_number' => $docum_number,
                                'oc' => ($entry->oc != null && $entry->oc != '') ? $entry->oc : '- Ninguna -',
                                'warehouse_owner' => $entry->warehouse_owner,
                                'status' => $entry->status,
                                'attach_path' => $entry->attach_path,
                                'confirm' => ($entry->confirm == 1) ? 'SI' : 'NO',
                                'warehouse_name' => $entry->warehouse_name,
                                'created_by_name' => $log_user->first_name . ' ' . $log_user->last_name,
                                'created_by_email' => $log_user->email,
                                'hour' => $hour
                            );
                        }                    
                        
                        // Entry canceled
                        if ($log->action == 'cancel-entry') {
                            $history[$date][] = array(
                                'node_type' => $log->action,
                                'id' => $entry->id,
                                'document_number' => $docum_number,
                                'attach_path' => $entry->attach_path,
                                'cancel_by_name' => $log_user->first_name . ' ' . $log_user->last_name,
                                'cancel_by_email' => $log_user->email,
                                'hour' => $hour
                            );
                        }

                        // Entry confirm
                        if ($log->action == 'confirm-entry') {
                            $history[$date][] = array(
                                'node_type' => $log->action,
                                'id' => $entry->id,
                                'document_number' => $docum_number,
                                'attach_path' => $entry->attach_path,
                                'confirm_by_name' => $log_user->first_name . ' ' . $log_user->last_name,
                                'confirm_by_email' => $log_user->email,
                                'hour' => $hour
                            );
                        }

                        // Entry attach
                        if ($log->action == 'attach-entry') {
                            $filename_arr = explode('.', $entry->attach_path);
                            $attach_type = $filename_arr[1];
                            $history[$date][] = array(
                                'node_type' => $log->action,
                                'id' => $entry->id,
                                'document_number' => $docum_number,
                                'attach_path' => $entry->attach_path,
                                'attach_type' => $attach_type,
                                'attach_by_name' => $log_user->first_name . ' ' . $log_user->last_name,
                                'attach_by_email' => $log_user->email,
                                'hour' => $hour
                            );
                        }
                    }
                    else {
                        if ($log->action == 'confirm-entry') {
                            // Get entry items
                            $entry_items = ($is_oc) ? $entry->itemsOc : $entry->itemsDispatch;
                            foreach ($entry_items as $item) {
                                if ($item->id == intval($id_product) && $item->id_receipt == intval($id_receipt)) {
                                    $history[$date][] = array(
                                        'node_type' => 'product-add',
                                        'id' => $item->id,
                                        'id_receipt' => $item->id_receipt,
                                        'origin' => $entry->origin,
                                        'oc' => ($entry->oc != null && $entry->oc != '') ? $entry->oc : '- Ninguna -',
                                        'document_number' => $docum_number,
                                        'um' => $item->um,
                                        'received_quantity' => $item->received_quantity,
                                        'warehouse_name' => $entry->warehouse_name,
                                        'warehouse_owner' => $entry->warehouse_owner,
                                        'created_by_name' => $log_user->first_name . ' ' . $log_user->last_name,
                                        'created_by_email' => $log_user->email,
                                        'hour' => $hour
                                    );
                                }
                            }
                        }
                    }
                }
            }
        } catch (Throwable $th) {
            $response = array('success' => false, 'error' => $th->getMessage());
            return response()->json($response, 200);
        }

        $response = array('success' => true, 'history' => $history);
        return response()->json($response, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
