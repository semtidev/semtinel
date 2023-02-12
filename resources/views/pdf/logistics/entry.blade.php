@extends('layouts.logistics.pdf_vertical')

@section('title', 'Entrada de productos en obra')

@section('content')

{{--  DOC TITLE  --}}
<table width="100%" border="0" cellpadding="0" cellspacing="0">
    <tr>
        <td class="pole" valign="bottom">
            Entrada de productos en obra
        </td>
        <td width="50%" align="right">
            <span class="doc-label">Proyecto:</span><br>
            <span class="doc-value">{{ $project->name }}</span>
        </td>
    </tr>
</table>
{{--  ORIGIN  --}}
<table width="100%" border="1" cellpadding="0" cellspacing="0" style="margin-top: 20px">
    <tr>
        <td width="25%" class="table-params">
            <span class="doc-label">Origen:</span><br>
            <span class="doc-value">{{ $origin }}</span>
        </td>
        <td width="25%" class="table-params">
            <span class="doc-label">Tipo de Documento:</span><br>
            <span class="doc-value">{{ $document_type }}</span>
        </td>
        <td width="25%" class="table-params">
            <span class="doc-label">No. Documento:</span><br>
            <span class="doc-value">{{ $document_number }}</span>
        </td>
        <td width="25%" class="table-params">
            <span class="doc-label">Orden de Compra:</span><br>
            <span class="doc-value">{{ $oc }}</span>
        </td>
    </tr>
</table>
{{--  PRODUCTS  --}}
<table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top: 20px">
    <tr>
        <td colspan="6" class="table-title">
            <span class="doc-value">PRODUCTOS</span>
        </td>
    </tr>
    <tr>
        <td width="20" class="table-cell" style="text-align: center">
            <span class="doc-value">No.</span>
        </td>
        <td width="80" class="table-cell">
            <span class="doc-value">Código</span>
        </td>
        <td class="table-cell">
            <span class="doc-value">Descripción</span>
        </td>
        <td width="40" class="table-cell" style="text-align: center">
            <span class="doc-value">UM</span>
        </td>
        <td width="40" class="table-cell" style="text-align: right">
            <span class="doc-value">Ctdad</span>
        </td>
        <td width="80" class="table-cell" style="text-align: center">
            <span class="doc-value">Tarjeta Estiba</span>
        </td>
    </tr>
    @php
        $item = 0;
    @endphp
    @foreach ($items as $product)
        @php
            $item++;
        @endphp
        <tr @if($item%2 != 0) bgcolor="#EFF2F9" @endif>
            <td valign="top" width="20" class="table-cell" style="text-align: center">
                <span style="font-size: 12px; font-family: Verdana, Arial, Helvetica, sans-serif; color: rgb(57, 64, 75);">
                    {{ $item }}
                </span>
            </td>
            <td valign="top" width="80" class="table-cell">
                <span style="font-size: 12px; font-family: Verdana, Arial, Helvetica, sans-serif; color: rgb(57, 64, 75);">
                    {{ $product->product_code }}
                </span>
            </td>
            <td valign="top" class="table-cell">
                <span style="font-size: 12px; font-family: Verdana, Arial, Helvetica, sans-serif; color: rgb(57, 64, 75);">
                    {{ $product->item_description }}
                </span>
            </td>
            <td valign="top" width="40" class="table-cell" style="text-align: center">
                <span style="font-size: 12px; font-family: Verdana, Arial, Helvetica, sans-serif; color: rgb(57, 64, 75);">
                    {{ $product->um }}
                </span>
            </td>
            <td valign="top" width="40" class="table-cell" style="text-align: right">
                <span style="font-size: 12px; font-family: Verdana, Arial, Helvetica, sans-serif; color: rgb(57, 64, 75);">
                    {{ $product->received_quantity }}
                </span>
            </td>
            <td valign="top" width="80" class="table-cell" style="text-align: center">
                <span style="font-size: 12px; font-family: Verdana, Arial, Helvetica, sans-serif; color: rgb(57, 64, 75);">
                    {{ $product->stowage_card }}
                </span>
            </td>
        </tr>
    @endforeach
</table>
{{--  DESTIN  --}}
<table width="100%" border="1" cellpadding="0" cellspacing="0" style="margin-top: 30px">
    <tr>
        <td width="35%" class="table-params">
            <span class="doc-label">Destino:</span><br>
            <span class="doc-value">{{ $warehouse_name }}</span>
        </td>
        <td width="35%" class="table-params">
            <span class="doc-label">Responsable de Pañol:</span><br>
            <span class="doc-value">{{ $warehouse_owner }}</span>
        </td>
        <td class="table-params">
            <span class="doc-label">Firma:</span><br>
            <span class="doc-value">&nbsp;</span>
        </td>
    </tr>
</table>
@stop