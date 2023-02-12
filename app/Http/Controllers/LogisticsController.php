<?php

namespace App\Http\Controllers;

use Throwable;
use App\Models\LogisticsReceipt;
use App\Models\LogisticsReceiptItemOc;
use App\Models\LogisticsReceiptItemDispatch;
use App\Models\SystPole;
use App\Models\SystStructureProject;
use App\Models\SystWarehouse;
use Illuminate\Support\Facades\Cache;
use Barryvdh\DomPDF\PDF as PDF;
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
                        $entry_item = new LogisticsReceiptItemDispatch([
                            'id_receipt' => $id_entry,
                            'odoo_id_stock_move' => $item['id'],
                            'odoo_id_stock_picking' => $item['picking_id'],
                            'product_code' => $item['cod_product'],
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
            'file' => 'required|mimes:pdf|max:2048'   // jpg,jpeg,png,
        ]);
 
        $entryUpload = LogisticsReceipt::find(intval($request->id));

        if($request->file()) {
            $original_name = explode('.', $request->file->getClientOriginalName());
            $file_name = $request->entry . '.' . $original_name[1];
            $file_name = str_replace('/', '_', $file_name);
            $file_path = $request->file('file')->storeAs('uploads', $file_name, 'public');
            $entryUpload->attach_path = $file_path;
            $entryUpload->save();

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
        $entry = LogisticsReceipt::find(intval($request->entry));

        $entry->confirm = 1;
        $entry->save();

        $response = array('success' => true);
        return response()->json($response, 200);
    }

    /**
     * Cancel Entry.
     */
    public function cancelEntry(Request $request)
    { 
        $entry = LogisticsReceipt::find(intval($request->entry));

        if ($entry->confirm == 1) {
            $response = array('success' => false);
            return response()->json($response, 200);
        }
        
        $entry->cancel = 1;
        $entry->cancel_by = $request->user;
        $entry->save();

        $response = array('success' => true);
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
