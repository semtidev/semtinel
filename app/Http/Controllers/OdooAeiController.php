<?php

namespace App\Http\Controllers;

use App\Models\OdooProduct;
use App\Models\OdooProductTemplate;
use App\Models\OdooPurchaseOrder;
use App\Models\OdooPurchaseOrderLine;
use App\Models\OdooPurchaseOrderStockPicking;
use App\Models\OdooStockMove;
use App\Models\OdooStockPicking;
use App\Models\SystStructureProject;
use Illuminate\Http\Request;

class OdooAeiController extends Controller
{
    // Get entry data
    public function getEntryData (Request $request) {
        
        $fields  = $request->all();
        $items   = array();
        $project = SystStructureProject::find(intval($fields['project']));
        
        if ($fields['doctype'] == 'Conduce' || $fields['doctype'] == null || $fields['doctype'] == '') {
            $oc_items = OdooPurchaseOrder::leftJoin('purchase_order_line', 'purchase_order_line.order_id', 'purchase_order.id')
                            ->leftJoin('product_product', 'product_product.id', 'purchase_order_line.product_id')                            
                            ->leftJoin('product_template', 'product_template.id', 'product_product.product_tmpl_id')
                            ->leftJoin('product_category', 'product_category.id', 'product_template.categ_id')
                            ->leftJoin('uom_uom', 'uom_uom.id', 'purchase_order_line.product_uom')
                            ->select(
                                'purchase_order_line.id',
                                'purchase_order_line.order_id',
                                'purchase_order.name AS oc',
                                'purchase_order_line.name AS item_descript',
                                'purchase_order_line.sequence',
                                'product_template.default_code AS cod_product',
                                'product_template.name AS generic_descript',
                                'product_category.name as category_name',
                                'product_category.complete_name as category_complete_name',
                                'uom_uom.name AS um',
                                'purchase_order_line.price_unit'
                            )
                            ->where('purchase_order.name', $fields['ocnumber'])
                            ->orderBy('purchase_order_line.sequence', 'ASC')
                            ->get();

            foreach ($oc_items as $item) {
                $items[] = array(
                    'id' => $item->id,
                    'order_id' => $item->order_id,
                    'oc' => $item->oc,
                    'cod_product' => $item->cod_product,
                    'category_name' => $item->category_name,
                    'category_complete_name' => $item->category_complete_name,
                    'generic_descript' => $item->generic_descript,
                    'item_description' => $item->item_descript,
                    'sequence' => $item->sequence,
                    'um' => $item->um,
                    'received_quantity' => 0,
                    'stowage_card' => '-',
                    'price_unit' => $item->price_unit,
                    'price_total' => 0,
                    'comment' => ''
                );
            }
        }
        else {
            // Build picking name filter
            $picking_name  = $project->abbr . '/OUT/' . $fields['docnum'];
            $picking_items = OdooStockPicking::leftJoin('stock_move', 'stock_move.picking_id', 'stock_picking.id')
                                ->leftJoin('product_product', 'stock_move.product_id', 'product_product.id')
                                ->leftJoin('product_template', 'product_product.product_tmpl_id', 'product_template.id')
                                ->leftJoin('product_category', 'product_category.id', 'product_template.categ_id')
                                ->leftJoin('uom_uom', 'uom_uom.id', 'stock_move.product_uom')
                                ->select(
                                    'stock_picking.name AS document',
                                    'stock_move.id',
                                    'stock_move.picking_id',
                                    'stock_move.name AS item_descript',
                                    'stock_move.product_qty AS product_quantity',
                                    'uom_uom.name AS um',
                                    'stock_move.price_unit',
                                    'product_template.default_code',
                                    'product_category.name as category_name',
                                    'product_category.complete_name as category_complete_name'
                                )
                                ->where('stock_picking.name', $picking_name)
                                ->orderBy('stock_move.name', 'ASC')
                                ->get();

            foreach ($picking_items as $item) {
                // Get OC
                $picking_oc = OdooStockMove::leftJoin('purchase_order_line', 'purchase_order_line.product_id', 'stock_move.product_id')
                                            ->leftJoin('purchase_order', 'purchase_order.id', 'purchase_order_line.order_id')
                                            ->select(
                                                'purchase_order.name AS oc'
                                            )
                                            ->where('stock_move.id', $item->id)
                                            ->first();

                $items[] = array(
                    'id' => $item->id,
                    'picking_id' => $item->picking_id,
                    'oc' => $picking_oc->oc,
                    'docnum' => $item->document,
                    'cod_product' => $item->default_code,
                    'category_name' => $item->category_name,
                    'category_complete_name' => $item->category_complete_name,
                    'item_description' => $item->item_descript,
                    'um' => $item->um,
                    'product_quantity' => $item->product_quantity,
                    'received_quantity' => 0,
                    'stowage_card' => '-',
                    'price_unit' => $item->price_unit,
                    'price_total' => 0,
                    'comment' => ''
                );
            }
        }

        // Response
        $response = array('success' => true, 'items' => $items);
        return response()->json($response, 200);
    }
}
