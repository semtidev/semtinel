<?php

namespace App\Http\Controllers;

use Throwable;
use DateTime;
use App\Models\LogisticsReceipt;
use App\Models\LogisticsReceiptItemOc;
use App\Models\LogisticsReceiptItemDispatch;
use App\Models\LogisticsReceiptItemTransfer;
use App\Models\SystPole;
use App\Models\SystStructureProject;
use App\Models\SystStructureEop;
use App\Models\SystWarehouse;
use App\Models\LogisticsOutput;
use App\Models\LogisticsOutputItem;
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
                $is_transfer = false;
                if (LogisticsReceiptItemOc::where('id_receipt', $entry->id)->exists()) {
                    $items = $entry->itemsOc;
                }
                if (LogisticsReceiptItemDispatch::where('id_receipt', $entry->id)->exists()) {
                    $items = $entry->itemsDispatch;
                    $is_oc = false;
                }
                if (LogisticsReceiptItemTransfer::where('id_receipt', $entry->id)->exists()) {
                    $items = $entry->itemsTransfer;
                    $is_oc = false;
                    $is_transfer = true;
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
                $docum_number = '';
                if ($is_oc) {
                    $docum_number = $entry->document_number;
                }
                else {
                    $docum_number = $project->abbr . "/OUT/" . $entry->document_number;
                }
                if ($is_transfer) {
                    $docum_number = $entry->output;
                }

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
                    'code' => $entry->code,
                    'origin' => $entry->origin,
                    'document_type' => ($entry->document_type != null && $entry->document_type != '') ? $entry->document_type : 'Factura',
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
                    'type' => ($is_oc) ? 'oc' : 'dispatch',
                    'transfer' => ($is_transfer) ? 1 : 0
                );
            }

            Cache::forever('entries', $entries);
        }
        return response()->json($entries, 200);
    }

    /**
     * Get Stowage card.
     *
     * @return \Illuminate\Http\Response
     */
    public function getStowageCard(Request $request)
    {
        $stowage_card    = '';
        $warehouse       = '';
        $warehouse_name  = '';
        $warehouse_owner = '';
        $dates_cards     = array();
        $array_cards     = array();  
        
        $qry_cards_oc = LogisticsReceipt::leftJoin('logistics_receipt_items_oc', 'logistics_receipt_items_oc.id_receipt', 'logistics_receipts.id')
                                    ->select('logistics_receipts.updated_at', 'logistics_receipts.warehouse', 'logistics_receipt_items_oc.stowage_card')
                                    ->where('logistics_receipts.oc', $request->oc)
                                    ->where('logistics_receipt_items_oc.item_description', $request->item_desciption)
                                    ->orderBy('logistics_receipts.updated_at', 'DESC')
                                    ->first();
        if ($qry_cards_oc) {
            // Get warehouse name and owner
            $warehouse = SystWarehouse::find(intval($qry_cards_oc->warehouse));
            $warehouse_name  = $warehouse->name;
            $warehouse_owner = $warehouse->owner;
            
            $dateOnly = $qry_cards_oc->updated_at->toDateString();
            $dateInt  = intval(str_replace('-', '', $dateOnly));
            $dates_cards[] = $dateInt;
            $array_cards[$dateInt] = array(
                "stowage_card" => $qry_cards_oc->stowage_card, 
                "warehouse" => $qry_cards_oc->warehouse,
                "warehouse_name" => $warehouse_name,
                "warehouse_owner" => $warehouse_owner
            );
        }
        
        $qry_cards_dispatch = LogisticsReceipt::leftJoin('logistics_receipt_items_dispatch', 'logistics_receipt_items_dispatch.id_receipt', 'logistics_receipts.id')
                                    ->select('logistics_receipts.updated_at', 'logistics_receipts.warehouse', 'logistics_receipt_items_dispatch.stowage_card')
                                    ->where('logistics_receipts.oc', $request->oc)
                                    ->where('logistics_receipt_items_dispatch.item_description', $request->item_desciption)
                                    ->orderBy('logistics_receipts.updated_at', 'DESC')
                                    ->first();
        if ($qry_cards_dispatch) {
            // Get warehouse name and owner
            $warehouse = SystWarehouse::find(intval($qry_cards_oc->warehouse));
            $warehouse_name  = $warehouse->name;
            $warehouse_owner = $warehouse->owner;
            
            $dateOnly = $qry_cards_dispatch->updated_at->toDateString();
            $dateInt  = intval(str_replace('-', '', $dateOnly));
            $dates_cards[] = $dateInt;
            $array_cards[$dateInt] = array(
                "stowage_card" => $qry_cards_oc->stowage_card, 
                "warehouse" => $qry_cards_oc->warehouse,
                "warehouse_name" => $warehouse_name,
                "warehouse_owner" => $warehouse_owner
            );
        }

        if (count($dates_cards) > 0) {
            rsort($dates_cards);
            $stowage_card    = $array_cards[intval($dates_cards[0])]["stowage_card"];
            $warehouse       = $array_cards[intval($dates_cards[0])]["warehouse"];
            $warehouse_name  = $array_cards[intval($dates_cards[0])]["warehouse_name"];
            $warehouse_owner = $array_cards[intval($dates_cards[0])]["warehouse_owner"];
        }
        
        $response = array(
            'success' => true, 
            'stowage_card' => $stowage_card, 
            'warehouse' => $warehouse,
            'warehouse_name' => $warehouse_name,
            'warehouse_owner' => $warehouse_owner
        );
        return response()->json($response, 200);
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
                // Set code
                $project = SystStructureProject::find(intval($fields['destin']['project']));
                $code = 'IN-' . $project->abbr . '-' . $entry->id;
                $entry->code = $code;
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
                // Set code
                $project = SystStructureProject::find(intval($fields['destin']['project']));
                $code = 'IN-' . $project->abbr . '-' . $entry->id;
                $entry->code = $code;
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
        if (LogisticsReceiptItemTransfer::where('id_receipt', $entry->id)->exists()) {
            $items = $entry->itemsTransfer;
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
            'code' => $entry->code,
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
        return $pdf->download($entry->code . '.pdf');
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
            //$file_name = str_replace('/', '_', $file_name);
            $file_path = $request->file('file')->storeAs('uploads/entries', $file_name, 'public');
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

        if (intval($fields['transfer']) == 1) {
            $output = LogisticsOutput::where('code', $fields['code'])->first();
            $output->confirm = 1;
            $output->status = 'confirmada';
            $output->save();

            // Save log
            $new_log = new Log([
                'pole' => $fields['pole'],
                'project' => $fields['project'],
                'client' => $client,
                'action' => 'confirm-output',
                'description' => 'Salida Confirmada',
                'entity_id' => $output->id,
                'user' => $fields['user']
            ]);
            $new_log->save();
        }

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
        $fields    = $request->all();
        $products  = array();
        $transfers = array();
        
        try {
            $qry_entries = LogisticsReceipt::leftJoin('syst_warehouses', 'syst_warehouses.id', 'logistics_receipts.warehouse')
                            ->select(
                                'logistics_receipts.id',
                                'logistics_receipts.pole',
                                'logistics_receipts.project',
                                'logistics_receipts.oc',
                                'logistics_receipts.confirm',
                                'logistics_receipts.output',
                                'syst_warehouses.id as warehouse_id',
                                'syst_warehouses.name as warehouse_name',
                                'syst_warehouses.owner as warehouse_owner'
                            )
                            ->where('pole', $fields['pole'])
                            ->where('project', intval($fields['project']))
                            ->whereNull('cancel')
                            ->orderBy('id', 'DESC')->get();
            
            foreach ($qry_entries as $entry) {
                $stowage_cards = array();
                $items = array();
                $is_oc = true;
                $is_transfer = false;
                if (LogisticsReceiptItemOc::where('id_receipt', $entry->id)->exists()) {
                    $items = $entry->itemsOc;
                }
                if (LogisticsReceiptItemDispatch::where('id_receipt', $entry->id)->exists()) {
                    $items = $entry->itemsDispatch;
                    $is_oc = false;
                }
                if (LogisticsReceiptItemTransfer::where('id_receipt', $entry->id)->exists()) {
                    $items = $entry->itemsTransfer;
                    $is_oc = false;
                    $is_transfer = true;
                }

                // Type
                $type = ($is_oc) ? 'oc' : 'dispatch';

                // Project
                $project = SystStructureProject::find(intval($entry->project));

                // Pole
                $pole = SystPole::where('abbr', $entry->pole)->first();
                
                foreach ($items as $product) {

                    // Create product ID
                    $product_id = ($type == 'oc') ? 'oc.' . $product->odoo_id_order . '.' . $product->odoo_id_order_line . '.' . $entry->warehouse_id : 'dispatch.' . $product->odoo_id_stock_picking . '.' . $product->odoo_id_stock_move . '.' . $entry->warehouse_id;

                    if (isset($products[$product_id])) {
                        if ($entry->confirm == 1) {
                           $products[$product_id]['quantity'] += $product->received_quantity;
                            $products[$product_id]['quantity'] = number_format($products[$product_id]['quantity'], 2, '.', ' '); 
                        }                        
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
                            'price_unit' => $product->price_unit,
                            'quantity' => ($entry->confirm == 1) ? number_format($product->received_quantity, 2, '.', ' ') : 0,
                            'stowage_card' => $product->stowage_card,
                            'warehouse_id' => $entry->warehouse_id,
                            'warehouse_name' => $entry->warehouse_name,
                            'warehouse_owner' => $entry->warehouse_owner,
                            'stowage_card' => $product->stowage_card,
                            'type' => $type,
                            'output' => $entry->output
                        );
                    }
                }

                foreach ($products as $key => $value) {
                    $quantity = $value['quantity'];
                    // Check transfer
                    $quantity_transfer = 0;
                    if (!array_key_exists($key, $transfers)) {
                        if (LogisticsOutput::leftJoin('logistics_output_items', 'logistics_output_items.id_output', 'logistics_outputs.id')->where('logistics_output_items.id_inventory', $key)->where('logistics_outputs.status', '<>', 'cancelada')->exists()) {
                            $quantity_transfer = LogisticsOutput::leftJoin('logistics_output_items', 'logistics_output_items.id_output', 'logistics_outputs.id')
                                                    ->select(DB::raw('sum(logistics_output_items.quantity) as quantity_transfer'))
                                                    ->where('logistics_output_items.id_inventory', $key)
                                                    ->where('logistics_outputs.status', '<>', 'cancelada')
                                                    ->first()->quantity_transfer;
                            $quantity -= $quantity_transfer;
                            $transfers[$key] = $value['output'];
                        }
                    }
                    $quantity = number_format($quantity, 2, '.', ' ');
                    // Get reserved
                    $reserved = LogisticsOutput::leftJoin('logistics_output_items', 'logistics_output_items.id_output', 'logistics_outputs.id')
                                    ->select(DB::raw('sum(logistics_output_items.quantity) as reserved'))
                                    ->where('logistics_outputs.status', 'creada')
                                    ->where('logistics_output_items.id_inventory', $key)
                                    ->first()->reserved;
                    $reserved = number_format($reserved, 2, '.', ' ');
                    // Get available
                    $rest_inventory = 0;
                    if (!array_key_exists($key, $transfers)) {
                        $rest_inventory = LogisticsOutput::leftJoin('logistics_output_items', 'logistics_output_items.id_output', 'logistics_outputs.id')
                                        ->select(DB::raw('sum(logistics_output_items.quantity) as rest_inventory'))
                                        ->where('logistics_outputs.status', 'confirmada')
                                        ->where('logistics_output_items.id_inventory', $key)
                                        ->first()->rest_inventory;
                    }
                    $available = floatval($value['quantity']) - floatval($rest_inventory) - floatval($reserved);                        
                    $available = number_format($available, 2, '.', ' ');

                    $products[$key]['quantity']  = $quantity;
                    $products[$key]['reserved']  = $reserved;
                    $products[$key]['available'] = $available;
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
                if (LogisticsReceiptItemTransfer::where('id_receipt', $entry->id)->exists()) {
                    $items = $entry->itemsTransfer;
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

                foreach ($products as $key => $value) {
                    $quantity = $value['quantity'];
                    // Get reserved
                    $reserved = LogisticsOutput::leftJoin('logistics_output_items', 'logistics_output_items.id_output', 'logistics_outputs.id')
                                    ->select(DB::raw('sum(logistics_output_items.quantity) as reserved'))
                                    ->where('logistics_outputs.status', 'creada')
                                    ->where('logistics_output_items.id_inventory', $key)
                                    ->first()->reserved;
                    $reserved = number_format($reserved, 2, '.', ' ');
                    // Get available
                    $available = floatval($quantity) - floatval($reserved);                        
                    $available = number_format($available, 2, '.', ' ');

                    $products[$key]['reserved']  = $reserved;
                    $products[$key]['available'] = $available;
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
    public function getInventoryHistory(Request $request, $oc = null)
    {
        $fields   = $request->all();
        $descript = $fields['description'];
        $history  = array();
        
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
                                        'logistics_receipts.warehouse',
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
                    $entry_items = array();
                    $is_oc = true;
                    if (LogisticsReceiptItemOc::where('id_receipt', $entry->id)->exists()) {
                        $entry_items = $entry->itemsOc;
                    }
                    if (LogisticsReceiptItemDispatch::where('id_receipt', $entry->id)->exists()) {
                        $entry_items = $entry->itemsDispatch;
                        $is_oc = false;
                    }
                    if (LogisticsReceiptItemTransfer::where('id_receipt', $entry->id)->exists()) {
                        $items = $entry->itemsTransfer;
                        $is_oc = false;
                    }

                    // categories
                    $categories = array();
                    foreach ($entry_items as $product) {
                        if ($product->category_name != null && $product->category_name != '') {
                            if (array_search($product->category_name, $categories) === false) {
                                $categories[] = $product->category_name;
                            }
                        }
                        
                    }
                    $categories = implode($categories);

                    // warehouse
                    $warehouse = $entry->warehouse;

                    // project
                    $project = $log->getProject;

                    // document_number
                    $docum_number = ($is_oc) ? $entry->document_number : $project->abbr . "/OUT/" . $entry->document_number;

                    // user
                    $log_user = $log->getUser;

                    if ($oc == null && $descript == '') {
                        
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
                                'hour' => $hour,
                                'categories' => $categories,
                                'warehouse' => $warehouse
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
                                'hour' => $hour,
                                'categories' => $categories,
                                'warehouse' => $warehouse
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
                                'hour' => $hour,
                                'categories' => $categories,
                                'warehouse' => $warehouse
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
                                'hour' => $hour,
                                'categories' => $categories,
                                'warehouse' => $warehouse
                            );
                        }
                    }
                    else {
                        // Get entry items
                        $entry_items = ($is_oc) ? $entry->itemsOc : $entry->itemsDispatch;
                        if ($log->action == 'confirm-entry') {                            
                            foreach ($entry_items as $item) {
                                if ($entry->oc == $oc && $item->item_description == $descript) {
                                    $history[$date][] = array(
                                        'node_type' => 'product-add',
                                        'id' => $item->id,
                                        'id_receipt' => $item->id_receipt,
                                        'origin' => $entry->origin,
                                        'oc' => $entry->oc,
                                        'document_number' => $docum_number,
                                        'um' => $item->um,
                                        'received_quantity' => $item->received_quantity,
                                        'warehouse_name' => $entry->warehouse_name,
                                        'warehouse_owner' => $entry->warehouse_owner,
                                        'created_by_name' => $log_user->first_name . ' ' . $log_user->last_name,
                                        'created_by_email' => $log_user->email,
                                        'hour' => $hour,
                                        'categories' => $categories,
                                        'warehouse' => $warehouse
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

    // OUTPUTS

    /**
     * Store a output created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function storeOutput(Request $request)
    {
        $fields = $request->all();
        $client = getIP();
        // Project
        $project = SystStructureProject::find(intval($fields['project']));

        try {
            // Save output
            if ($fields['type'] == 'towork') {
                // If type To Work
                $output = new LogisticsOutput([
                    'created_by' => $fields['user'],
                    'updated_by' => $fields['user'],
                    'pole' => $fields['pole'],
                    'project' => $fields['project'],
                    'warehouse' => $fields['warehouse'],
                    'warehouse_owner' => $fields['warehouse_owner'],
                    'comment' => $fields['comment'],
                    'status' => 'creada',
                    'type' => $fields['type'],
                    'work_object' => intval($fields['destin']),
                    'authorized' => $fields['authorized'],
                    'authorizing' => $fields['authorizing']
                ]);
                $output->save();

                // Register code
                $output->code = 'OUT-' . $project->abbr . '-' .  $output->id;
                $output->save();

            }
            else {
                // If type Transaction
                $output = new LogisticsOutput([
                    'created_by' => $fields['user'],
                    'updated_by' => $fields['user'],
                    'pole' => $fields['pole'],
                    'project' => $fields['project'],
                    'warehouse' => $fields['warehouse'],
                    'warehouse_owner' => $fields['warehouse_owner'],
                    'comment' => $fields['comment'],
                    'status' => 'creada',
                    'type' => $fields['type'],
                    'destin_warehouse' => intval($fields['destin']['id']),
                    'destin_warehouse_owner' => $fields['destin']['owner'],
                    'authorizing' => $fields['authorizing']
                ]);
                $output->save();

                // Register code
                $output->code = 'TRANSFER-' . $project->abbr . '-' .  $output->id;
                $output->save();
                
                // Save entity
                $entry = new LogisticsReceipt([
                    'code' => $output->code,
                    'origin' => 'Transferencia de Pañol',
                    'output' => $output->code,
                    'created_by' => $fields['user'],
                    'updated_by' => $fields['user'],
                    'pole' => $fields['pole'],
                    'project' => $fields['project'],
                    'warehouse' => intval($fields['destin']['id']),
                    'warehouse_owner' => $fields['destin']['owner'],
                    'comment' => $fields['comment'],
                    'status' => 'total'
                ]);
                $entry->save();
            }
            
            // Save output/entity items
            $id_output = $output->id;
            foreach ($fields['cart_items'] as $key => $item) {
                if ($item['quantity'] > 0) {
                    $output_item = new LogisticsOutputItem([
                        'id_output' => $id_output,
                        'id_inventory' => $item['id_inventory'],
                        'product_id' => $item['id'],
                        'product_code' => $item['product_code'],
                        'oc' => $item['oc'],
                        'item_description' => $item['description'],
                        'um' => $item['um'],
                        'quantity' => $item['quantity'],
                        'stowage_card' => $item['stowage_card'],
                        'price_unit' => $item['price_unit'],
                        'price_total' => $item['price_total']
                    ]);
                    $output_item->save();
                    
                    // IF type Transaction
                    if ($fields['type'] == 'transfer') {
                        $id_entry = $entry->id;
                        $entry_item = new LogisticsReceiptItemTransfer([
                            'id_receipt' => $id_entry,
                            'id_inventory' => $item['id_inventory'],
                            'product_id' => $item['id'],
                            'product_code' => $item['product_code'],
                            'oc' => $item['oc'],
                            'item_description' => $item['description'],
                            'um' => $item['um'],
                            'received_quantity' => $item['quantity'],
                            'stowage_card' => $item['stowage_card'],
                            'price_unit' => $item['price_unit'],
                            'price_total' => $item['price_total']
                        ]);
                        $entry_item->save();
                    }
                }
            }
        } catch (Throwable $th) {
            $response = array('success' => false, 'error' => $th->getMessage());
            return response()->json($response, 200);
        }            

        // Save log
        $new_log = new Log([
            'pole' => $fields['pole'],
            'project' => $fields['project'],
            'client' => $client,
            'action' => 'create-output',
            'description' => 'Salida Creada',
            'entity_id' => $output->id,
            'user' => $fields['user']
        ]);
        $new_log->save();

        $response = array('success' => true, 'output' => $output->id);
        return response()->json($response, 200);
    }

    /**
     * Get Outputs.
     *
     * @return \Illuminate\Http\Response
     */
    public function getOutputs(Request $request, $pole, $project, $reload = false)
    {
        session_start();
        $session = $_SESSION['semtinel'];
        $fields  = $request->all();
        $outputs = array();

        if (!$reload && Cache::get('outputs') != null) {
            $outputs = Cache::get('outputs');
        }
        else {
            $qry_outputs = LogisticsOutput::where('pole', $pole)
                                ->where('project', intval($project))
                                ->whereNull('cancel')
                                ->orderBy('id', 'DESC')->get();
            foreach ($qry_outputs as $output) {
                $items = array();
                if (LogisticsOutputItem::where('id_output', $output->id)->exists()) {
                    $items = $output->Items;
                }
                // Formater dates
                $arr_created = explode(' ', $output->created_at);
                $arr_created_date = explode('-', $arr_created[0]);
                $created_at = $arr_created_date[2] . '/' . $arr_created_date[1] . '/' . $arr_created_date[0];
                
                $arr_updated = explode(' ', $output->updated_at);
                $arr_updated_date = explode('-', $arr_updated[0]);
                $updated_at = $arr_updated_date[2] . '/' . $arr_updated_date[1] . '/' . $arr_updated_date[0];

                // Project
                $project = SystStructureProject::find(intval($output->project));

                // Pole
                $pole = SystPole::where('abbr', $output->pole)->first();

                // EOP
                $destin = '';
                if ($output->type == 'towork') {
                    $eop = SystStructureEop::find(intval($output->work_object));
                    if ($eop->parent != 0) {
                        $parent = SystStructureEop::find($eop->parent)->description;
                        $destin = $parent . ' / ' . $eop->description;
                    }
                    else {
                        $destin = $eop->description;
                    }
                }
                else {
                    $warehouse = SystWarehouse::find(intval($output->destin_warehouse));
                    $destin = $warehouse->name;
                }

                // Get attach type
                $attach_type = '';
                if ($output->attach_path != '' && $output->attach_path != null) {
                    $attach_arr = explode('.', $output->attach_path);
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
                
                $outputs[] = array(
                    'id' => $output->id,
                    'code' => $output->code,
                    'created_at' => $created_at,
                    'updated_at' => $updated_at,
                    'created_by' => $output->created_by,
                    'updated_by' => $output->updated_by,
                    'pole' => $pole->abbr,
                    'pole_name' => $pole->name,
                    'project' => $output->project,
                    'project_abbr' => $project->abbr,
                    'project_name' => $project->name,
                    'warehouse' => $output->warehouse,
                    'warehouse_name' => SystWarehouse::find(intval($output->warehouse))->name,
                    'warehouse_owner' => $output->warehouse_owner,
                    'comment' => $output->comment,
                    'status' => ucfirst($output->status),
                    'type' => $output->type,
                    'attach_path' => $output->attach_path,
                    'attach_type' => $attach_type,
                    'confirm' => $output->confirm,
                    'items' => $items,
                    'authorized' => $output->authorized,
                    'authorizing' => $output->authorizing,
                    'destin' => $destin,
                    'type' => ($output->type == 'towork') ? 'Despacho a Obra' : 'Transferencia',
                    'destin_warehouse_owner' => $output->destin_warehouse_owner
                );
            }

            Cache::forever('outputs', $outputs);
        }
        return response()->json($outputs, 200);
    }

    /**
     * Attach output document.
     */
    public function attachOutputScanning(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:jpg,jpeg,png,pdf|max:5020'
        ]);
 
        $fields = $request->all();
        $outputUpload = LogisticsOutput::find(intval($fields['id']));
        $client = getIP();

        if($request->file()) {
            $original_name = explode('.', $request->file->getClientOriginalName());
            $file_name = $request->output . '.' . $original_name[1];
            //$file_name = str_replace('/', '_', $file_name);
            $file_path = $request->file('file')->storeAs('uploads/outputs', $file_name, 'public');
            $outputUpload->attach_path = $file_path;
            $outputUpload->save();

            // Save log
            $new_log = new Log([
                'pole' => $fields['pole'],
                'project' => $fields['project'],
                'client' => $client,
                'action' => 'attach-output',
                'description' => 'Archivo Adjuntado a Salida',
                'entity_id' => $outputUpload->id,
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
     * Confirm Output.
     */
    public function confirmOutput(Request $request)
    { 
        $fields = $request->all();
        $output = LogisticsOutput::find(intval($fields['output']));
        $client = getIP();

        $output->confirm = 1;
        $output->status = 'confirmada';
        $output->save();

        // Save log
        $new_log = new Log([
            'pole' => $fields['pole'],
            'project' => $fields['project'],
            'client' => $client,
            'action' => 'confirm-output',
            'description' => 'Salida Confirmada',
            'entity_id' => $output->id,
            'user' => $fields['user']
        ]);
        $new_log->save();

        $response = array('success' => true);
        return response()->json($response, 200);
    }

    /**
     * Cancel Output.
     */
    public function cancelOutput(Request $request)
    { 
        $fields = $request->all();
        $output  = LogisticsOutput::find(intval($fields['output']));
        $client = getIP();

        if ($output->confirm == 1) {
            $response = array('success' => false);
            return response()->json($response, 200);
        }
        
        $output->cancel = 1;
        $output->status = 'cancelada';
        $output->cancel_by = $request->user;
        $output->save();

        // Delete entry
        LogisticsReceipt::where('output', $output->code)->delete();

        // Save log
        $new_log = new Log([
            'pole' => $fields['pole'],
            'project' => $fields['project'],
            'client' => $client,
            'action' => 'cancel-output',
            'description' => 'Salida Cancelada',
            'entity_id' => $output->id,
            'user' => $fields['user']
        ]);
        $new_log->save();

        $response = array('success' => true);
        return response()->json($response, 200);
    }

    /**
     * Generate PDF documentation of the output.
     *
     * @param  int  $output
     * @return \Illuminate\Http\Response
     */
    public function getOutputPDF($id)
    {
        $items = array();
        $is_oc = true;
        $output = LogisticsOutput::find(intval($id));
        $items = $output->Items;
        
        // Formater dates
        $arr_created = explode(' ', $output->created_at);
        $arr_created_date = explode('-', $arr_created[0]);
        $created_at = $arr_created_date[2] . '/' . $arr_created_date[1] . '/' . $arr_created_date[0];
        
        $arr_updated = explode(' ', $output->updated_at);
        $arr_updated_date = explode('-', $arr_updated[0]);
        $updated_at = $arr_updated_date[2] . '/' . $arr_updated_date[1] . '/' . $arr_updated_date[0];

        // Get Pole and Project name
        $pole    = SystPole::where('abbr', $output->pole)->first();
        $project = SystStructureProject::find(intval($output->project));

        // Get warehouse name and owner
        $warehouse = SystWarehouse::find(intval($output->warehouse));
        $warehouse_name  = $warehouse->name;
        $warehouse_owner = $warehouse->owner;

        // EOP
        $destin = '';
        if ($output->work_object != null && intval($output->work_object) > 0) {
            $eop = SystStructureEop::find(intval($output->work_object));
            if ($eop->parent != 0) {
                $parent = SystStructureEop::find($eop->parent)->description;
                $destin = $parent . ' / ' . $eop->description;
            }
            else {
                $destin = $eop->description;
            }
        }
        else {
            if ($output->destin_warehouse != null) {
                $destin_warehouse = SystWarehouse::find(intval($output->destin_warehouse));
                $destin = $destin_warehouse->name;
            }
        }
        
        
        $data = array(
            'id' => $output->id,
            'code' => $output->code,
            'created_at' => $created_at,
            'updated_at' => $updated_at,
            'created_by' => $output->created_by,
            'updated_by' => $output->updated_by,
            'pole' => $pole,
            'project' => $project,
            'warehouse_name' => $warehouse_name,
            'warehouse_owner' => $warehouse_owner,
            'comment' => $output->comment,
            'status' => ucfirst($output->status),
            'items' => $items,
            'authorized' => $output->authorized,
            'authorizing' => $output->authorizing,
            'destin' => $destin,
            'type' => ($output->type == 'transfer') ? 'Transferencia de pañol' : 'Despacho hacia obra'
        );
        
        $pdf = app('dompdf.wrapper');
        $pdf->loadView('pdf.logistics.output', $data);
        return $pdf->download($output->code . '.pdf');
    }

}
