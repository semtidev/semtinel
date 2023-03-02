<script allowJs="true">
import PageHeader from "../layouts/HeaderComponent.vue"

export default {
    data: function () {
      return {
        entry: {},
        pagetitle: '',
        upload_id: '',
        upload_entry: '',
        upload_file: '',
        upload_form_error: {
            error_text: ''
        },
        upload_form_loading: false,
        upload_form_okbtn_text: 'Adjuntar',
        upload_entry: '',
        table_oc: true,
        show_details: false,
        item_details: {
            docnum: '',
            product_quantity: '',
            cod_product: '',
            oc: '',
            generic_descript: '',
            item_description: '',
            um: '',
            received_quantity: 0,
            stowage_card: '-',
            price_unit: '',
            price_total: 0,
            comment: ''
        },
        confirm_loading: false,
        cancel_loading: false,
        confirm_text: 'Confirmar',
        session: JSON.parse(sessionStorage.getItem('semtinel')),
        pole: localStorage.getItem('stnel_logist_pole'),
        project: localStorage.getItem('stnel_logist_project')
      };
    },
    created() {
        this.entry = JSON.parse(this.$route.params.entry)
        this.pagetitle = this.entry['document_number']
        if (this.entry['type'] == 'oc')
            this.table_oc = true
        else
            this.table_oc = false
        if (this.entry['confirm'] == 1)
            this.confirm_text = 'Confirmada'
        else
            this.confirm_text = 'Confirmar'
    },
    watch: {
        upload_form_loading: function (val) {
            if (val)
                this.upload_form_okbtn_text = 'Procesando...'
            else
                this.upload_form_okbtn_text = 'Adjuntar'
        }
    },
    components: {
        'page-header': PageHeader
    },
    methods: {
        openScanner: function (path) {
            window.open('http://localhost/semtinel/storage/app/public/' + path, '_blank', 'noreferrer')
        },
        docPdf: function(entry) {
            window.open('http://localhost/semtinel/public/api/logistics/pdf/entry/' + entry, '_blank', 'noreferrer')
        },
        show: function (idx) {
            let cmp = this
            if (cmp.table_oc) {
                cmp.item_details = {
                    cod_product: cmp.entry['items'][idx].product_code,
                    oc: cmp.entry['oc'],
                    generic_descript: cmp.entry['items'][idx].product_description,
                    item_description: cmp.entry['items'][idx].item_description,
                    um: cmp.entry['items'][idx].um,
                    received_quantity: cmp.entry['items'][idx].received_quantity,
                    stowage_card: cmp.entry['items'][idx].stowage_card,
                    price_unit: cmp.entry['items'][idx].price_unit,
                    price_total: cmp.entry['items'][idx].price_total,
                    comment: (cmp.entry['items'][idx].comment == '') ? '-' : cmp.entry['items'][idx].comment
                }
            }
            else {
                cmp.item_details = {
                    cod_product: cmp.entry['items'][idx].product_code,
                    oc: cmp.entry['items'][idx].oc,
                    docnum: cmp.entry['items'][idx].docnum,
                    item_description: cmp.entry['items'][idx].item_description,
                    um: cmp.entry['items'][idx].um,
                    product_quantity: cmp.entry['items'][idx].product_quantity,
                    received_quantity: cmp.entry['items'][idx].received_quantity,
                    stowage_card: cmp.entry['items'][idx].stowage_card,
                    price_unit: cmp.entry['items'][idx].price_unit,
                    price_total: cmp.entry['items'][idx].price_total,
                    comment: (cmp.entry['items'][idx].comment == '') ? '-' : cmp.entry['items'][idx].comment
                }
            }
            cmp.show_details = true
        },
        attachFile: function (id, entry) {
            this.$refs.uploadFile.value = null
            this.upload_form_error.error_text = ''
            this.upload_id = id
            this.upload_entry = entry
        },
        onChangeFile(e) {
            this.upload_file = e.target.files[0];
            this.upload_form_error.error_text = ''
        },
        uploadDoc: function () {
            let cmp = this
            cmp.upload_form_loading = true
            if (cmp.$refs.uploadFile.value == '') {
                cmp.upload_form_error.error_text = 'Debe seleccionar el archivo que desea adjuntar.'
                cmp.upload_form_loading = false
                return
            }
            cmp.upload_form_error.error_text = ''
            let data = new FormData(),
                headers = {
                'content-type': 'multipart/form-data',
                'Authorization': 'Bearer ' + cmp.session.access_token
            }
            data.append('id', cmp.upload_id)
            data.append('entry', cmp.upload_entry)
            data.append('file', cmp.upload_file)
            data.append('user', cmp.session.id)
            data.append('pole', cmp.pole)
            data.append('project', cmp.project)

            axios.post('http://localhost/semtinel/public/api/logistics/entry/upload', data, {
                    headers: headers
                }).then(function (response) {
                    if (response.data.success) {
                        // Hide modal
                        cmp.$refs.CloseUpload.click()
                        cmp.upload_form_loading = false
                        cmp.entry.attach_path = response.data.path
                        let path_arr = cmp.entry.attach_path.split('.')
                        cmp.entry.attach_type = path_arr[1]
                        toastr.success('El archivo fue adjuntado con éxito.')
                    }
                    else {
                        // Hide modal
                        cmp.$refs.CloseUpload.click()
                        cmp.upload_form_loading = false
                        toastr.error('Error al intentar realizar la operación.')
                    }
                }).catch(function (error) {
                    // Hide modal
                    cmp.$refs.CloseUpload.click();
                    cmp.upload_form_loading = false
                    toastr.error('Error al intentar realizar la operación.')
                    return;
                })
        },
        confirmEntry: function () {
            let cmp = this
            cmp.confirm_loading = true
            let headers = {
                'User-Agent': 'testing/1.0',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + cmp.session.access_token
            }
            axios.post('http://localhost/semtinel/public/api/logistics/entry/confirm', {
                    'entry' : cmp.entry.id,
                    'user': cmp.session.id,
                    'pole': cmp.pole,
                    'project': cmp.project
                }, {
                    headers: headers
                }).then(function (response) {
                    if (response.data.success) {
                        cmp.confirm_loading = false
                        cmp.entry.confirm = 1
                        cmp.confirm_text = 'Confirmada'
                        toastr.success('La Entrada fue Confirmada con éxito.')
                    }
                    else {
                        cmp.confirm_loading = false
                        toastr.error('Error al intentar realizar la operación.')
                    }
                }).catch(function (error) {
                    cmp.confirm_loading = false
                    toastr.error('Error al intentar realizar la operación.')
                    return;
                })
        },
        cancelEntry: function () {
            let cmp = this
            cmp.cancel_loading = true
            let headers = {
                'User-Agent': 'testing/1.0',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + cmp.session.access_token
            }
            axios.post('http://localhost/semtinel/public/api/logistics/entry/cancel', {
                    'entry' : cmp.entry.id,
                    'user': cmp.session.id,
                    'pole': cmp.pole,
                    'project': cmp.project
                }, {
                    headers: headers
                }).then(function (response) {
                    if (response.data.success) {
                        cmp.cancel_loading = false
                        toastr.success('La Entrada fue Cancelada con éxito.')
                        cmp.$router.push('/semtinel/logistics/entries')
                    }
                    else {
                        cmp.cancel_loading = false
                        toastr.error('Error al intentar realizar la operación.')
                    }
                }).catch(function (error) {
                    cmp.cancel_loading = false
                    toastr.error('Error al intentar realizar la operación.')
                    return;
                })
        }
    }
}
</script>

<template>
    <page-header 
        :pagetitle="'Detalle de la entrada ' + pagetitle"
        :breadcrumbs="true"
        :navbar="[
            {
                page: 'Entradas',
                link: '/semtinel/logistics/entries',
                tooltip: 'Click para regresar al listado de Entradas',
                active: false
            },
            {
                page: 'Detalle de entrada',
                link: '',
                tooltip: '',
                active: true
            }
        ]">
    </page-header>

    <div class="invoice p-3 mb-3">
        <!-- title row -->
        <div class="row">
            <div class="col-sm-6">
                <h5>
                    <i class="mdi mdi-truck-check-outline mdi-36px align-middle"></i>&nbsp;&nbsp;Fecha de la entrada: {{ entry.created_at }}
                </h5>
            </div>
            <div class="col-sm-6 text-right">
                <a href="javascript:void(0);"
                    class="btn btn-app system"
                    v-tooltip="'Generar documento PDF'"
                    v-on:click="docPdf(entry.id)">
                  <i class="fas fa-file-pdf"></i> Exportar
                </a>
                <a href="javascript:void(0);"
                    class="btn btn-app system"
                    data-toggle="modal" 
                    data-target="#modal-upload-form"
                    v-tooltip="'Adjuntar documento escaneado'"
                    v-on:click="attachFile(entry.id, entry.document_number)">
                  <i class="fas fa-paperclip"></i> Adjuntar
                </a>
                <a href="javascript:void(0);" 
                    class="btn btn-app success"
                    :class="(entry.confirm == 1) ? 'disabled' : ''"
                    v-tooltip="'Confirmar entrada'"
                    v-on:click.stop="confirmEntry()">
                  <i class="fas" :class="(confirm_loading) ? 'fa-spinner fa-pulse' : 'fa-check'"></i> {{ confirm_text }}
                </a>
                <a href="javascript:void(0);" 
                    class="btn btn-app danger"
                    :class="(entry.confirm == 1) ? 'disabled' : ''"
                    v-tooltip="'Cancelar entrada'"
                    v-on:click.stop="cancelEntry()">
                  <i class="fas" :class="(cancel_loading) ? 'fa-spinner fa-pulse' : 'fa-times'"></i> Cancelar
                </a>
            </div>
        <!-- /.col -->
        </div>
        <!-- info row -->
        <div class="row invoice-info">
            <div class="col-sm-3 invoice-col">
                <div class="form-group">
                    <label class="mb-1">Origen</label>
                    <h6 class="p-0"><strong>{{ entry.origin }}</strong></h6>
                </div>
                <div class="form-group">
                    <label class="mb-1">Tipo de documento</label>
                    <h6 class="p-0"><strong>{{ entry.document_type }}</strong></h6>
                </div>
                <div class="form-group">
                    <label class="mb-1">No. documento</label>
                    <h6 class="p-0"><strong>{{ entry.document_number }}</strong></h6>
                </div>
                <div class="form-group">
                    <label class="mb-1">Orden de Compra</label>
                    <h6 class="p-0"><strong>{{ entry.oc }}</strong></h6>
                </div>
            </div>
            <!-- /.col -->
            <div class="col-sm-3 invoice-col">
                <div class="form-group">
                    <label class="mb-1">Destino</label>
                    <h6 class="p-0"><strong>{{ entry.warehouse_name }}</strong></h6>
                </div>
                <div class="form-group">
                    <label class="mb-1">Responsable</label>
                    <h6 class="p-0"><strong>{{ entry.warehouse_owner }}</strong></h6>
                </div>
                <div class="form-group">
                    <label class="mb-1">Polo</label>
                    <h6 class="p-0"><strong>{{ entry.pole_name }}</strong></h6>
                </div>
                <div class="form-group">
                    <label class="mb-1">Proyecto</label>
                    <h6 class="p-0"><strong>{{ entry.project_name }}</strong></h6>
                </div>
            </div>
            <!-- /.col -->
            <div class="col-sm-3 invoice-col">
                <div class="form-group">
                    <label class="mb-1">Estado</label><br>
                    <span class="badge" :class="(entry.status == 'Parcial') ? 'badge-warning' : 'badge-dark'">
                        Entrega {{ entry.status }}
                    </span>
                </div>
                <div class="form-group" >
                    <label class="mb-1">Documento escaneado</label><br>
                    <a href="javascript:void(0);" 
                        v-if="entry.attach_path != '' && entry.attach_path != null && entry.attach_type == 'pdf'"
                        v-on:click.stop="openScanner(entry.attach_path)">
                        <img src="../../../../public/themes/semtinel/img/icon-pdf2.png" alt="Documento Escaneado" v-tooltip="'Click para abrir'"/>
                    </a>
                    <a href="javascript:void(0);" 
                        v-else-if="entry.attach_path != '' && entry.attach_path != null && entry.attach_type == 'png'"
                        v-on:click.stop="openScanner(entry.attach_path)">
                        <img src="../../../../public/themes/semtinel/img/icon-png.png" alt="Documento Escaneado" v-tooltip="'Click para abrir'"/>
                    </a>
                    <a href="javascript:void(0);" 
                        v-else-if="entry.attach_path != '' && entry.attach_path != null && entry.attach_type == 'jpg'"
                        v-on:click.stop="openScanner(entry.attach_path)">
                        <img src="../../../../public/themes/semtinel/img/icon-jpg.png" alt="Documento Escaneado" v-tooltip="'Click para abrir'"/>
                    </a>
                    <span v-else class="badge badge-danger" v-if="entry.attach_path == '' || entry.attach_path == null">
                        No se ha adjuntado el documento escaneado aún.
                    </span>
                </div>
            </div>
            <!-- /.col -->
        </div>
        <!-- /.row -->

        <!-- Table OC row -->
        <div class="row pt-4" :class="(!table_oc) ? 'hidden' : ''">
            <div class="col-12 table-responsive">
                <table class="table table-striped">
                    <thead>
                    <tr>
                        <th width="50" class="text-center no-sort">No.</th>
                        <th>Descripción</th>
                        <th width="100" class="text-center no-sort">UM</th>
                        <th width="100" class="text-center no-sort">Ctdad Recibida</th>
                        <th width="100" class="text-right no-sort">Precio Unitario</th>
                        <th width="130" class="text-right no-sort">Importe Total</th>
                        <th width="150" class="text-center no-sort">Tarjeta Estiba</th>
                        <th width="300" class="no-sort">Comentario</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, idx) in entry['items']" :key="item['id']">
                        <td class="text-center">{{ idx + 1 }}</td>
                        <td>
                            <a class="show-lnk" 
                                href="javascript:void(0);"
                                v-tooltip="'Click para Mostrar Detalles de este producto'"
                                data-toggle="modal" 
                                data-target="#modal-item-details"
                                v-on:click="show(idx)">
                                {{ item['item_description'] }}
                            </a>
                        </td>
                        <td class="text-center">{{ item['um'] }}</td>
                        <td :id="'item-' + (idx + 1) + '-received'" class="text-center">{{ item['received_quantity'] }}</td>
                        <td class="text-right">{{ item['price_unit'] }}</td>
                        <td :id="'item-' + (idx + 1) + '-pricetotal'" class="text-right">{{ item['price_total'] }}</td>
                        <td :id="'item-' + (idx + 1) + '-stowagecard'" class="text-center">{{ item['stowage_card'] }}</td>
                        <td :id="'item-' + (idx + 1) + '-comment'">{{ item['comment'] }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <!-- /.col -->
        </div>
        <!-- /.row -->
        
        <!-- Table picking row -->
        <div class="row pt-4" :class="(table_oc) ? 'hidden' : ''">
            <div class="col-12 table-responsive">
                <table class="table table-striped">
                    <thead>
                    <tr>
                        <th width="50" class="text-center no-sort">No.</th>
                        <th>Descripción</th>
                        <th width="100" class="text-center no-sort">UM</th>
                        <th width="100" class="text-center no-sort">Ctdad Despachada</th>
                        <th width="100" class="text-center no-sort">Ctdad Recibida</th>
                        <th width="100" class="text-right no-sort">Precio Unitario</th>
                        <th width="130" class="text-right no-sort">Importe Total</th>
                        <th width="150" class="text-center no-sort">Tarjeta Estiba</th>
                        <th width="300" class="no-sort">Comentario</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, idx) in entry['items']" :key="item['id']">
                        <td class="text-center">{{ idx + 1 }}</td>
                        <td>
                            <a class="show-lnk" 
                                href="javascript:void(0);"
                                v-tooltip="'Click para Mostrar Detalles de este producto'"
                                data-toggle="modal" 
                                data-target="#modal-item-details"
                                v-on:click="show(idx)">
                                {{ item['item_description'] }}
                            </a>
                        </td>
                        <td class="text-center">{{ item['um'] }}</td>
                        <td class="text-center">{{ item['product_quantity'] }}</td>
                        <td :id="'item-' + (idx + 1) + '-received'" class="text-center">{{ item['received_quantity'] }}</td>
                        <td class="text-right">{{ item['price_unit'] }}</td>
                        <td :id="'item-' + (idx + 1) + '-pricetotal'" class="text-right">{{ item['price_total'] }}</td>
                        <td :id="'item-' + (idx + 1) + '-stowagecard'" class="text-center">{{ item['stowage_card'] }}</td>
                        <td :id="'item-' + (idx + 1) + '-comment'">{{ item['comment'] }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!-- /.row -->
    </div>

    <!-- Modal Form -->
    <div class="modal fade" id="modal-upload-form" aria-hidden="true" role="dialog" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header header-green">
                    <h4 class="modal-title">Adjuntar documento escaneado</h4>
                    <button type="button" 
                        ref="CloseUpload" 
                        class="close"
                        data-dismiss="modal" 
                        aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body px-4">
                    <form enctype="multipart/form-data">
                        <input type="hidden" 
                            name="upload_id_entry" 
                            id="upload_id_entry"
                            v-model="upload_id">
                        <div class="row pt-3 pb-1">
                            <div class="col-md-12">
                                <h6 class="text-green">
                                    Entrada No. <strong>{{ upload_entry }}</strong>
                                </h6>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <input 
                                        id="uploadFile" 
                                        ref="uploadFile" 
                                        class="form-control" 
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.pdf" 
                                        v-on:change="onChangeFile">
                                    <span class="info-container">
                                        <span class="text-sm text-muted">Seleccione solo archivos con extensiones PDF, JPG, JPEG, PNG</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="row pt-2" v-if="upload_form_error.error_text != ''">
                            <div class="col-12 text-center">
                                <h6 class="form_error">{{ upload_form_error.error_text }}</h6>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer justify-content-between">
                    <button type="button" class="btn btn-default ripple" data-dismiss="modal">Cancelar</button>
                    <button type="button" 
                        class="btn btn-primary btn-green ripple"
                        :disabled="upload_form_loading"
                        v-on:click.stop="uploadDoc()">
                        <i class="mdi mdi-paperclip" v-if="!upload_form_loading"></i>
                        <i class="mdi mdi-loading mdi-spin" v-else></i>
                        {{ upload_form_okbtn_text }}
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!-- /.Modal Form -->

    <!-- Modal Details -->
    <div class="modal fade" id="modal-item-details" aria-hidden="true" role="dialog" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header header-info">
                    <h4 class="modal-title">Detalles Producto</h4>
                    <button type="button" 
                        ref="Close" 
                        class="close"
                        data-dismiss="modal" 
                        aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body px-4 rounded-bottom">
                    <div class="row py-1">
                        <div class="col-md-12">
                            <span class="detail-title">Código del Producto</span>
                            <h6 class="detail-desc">{{ item_details.cod_product }}</h6>
                        </div>
                    </div>
                    <div class="row py-1">
                        <div class="col-md-12">
                            <span class="detail-title">Orden de Compra</span>
                            <h6 class="detail-desc">{{ item_details.oc }}</h6>
                        </div>
                    </div>
                    <div class="row py-1" v-if="table_oc && show_details">
                        <div class="col-md-12">
                            <span class="detail-title">Descripción del Producto</span>
                            <h6 class="detail-desc">{{ item_details.generic_descript.toUpperCase() }}</h6>
                        </div>
                    </div>
                    <div class="row py-1" v-if="!table_oc && show_details">
                        <div class="col-md-12">
                            <span class="detail-title">Documento</span>
                            <h6 class="detail-desc">{{ item_details.docnum }}</h6>
                        </div>
                    </div>
                    <div class="row py-1">
                        <div class="col-md-12">
                            <span class="detail-title">Descripción del Item</span>
                            <h6 class="detail-desc">{{ item_details.item_description.toUpperCase() }}</h6>
                        </div>
                    </div>
                    <div class="row py-1 mt-2">
                        <div :class="table_oc ? 'col-md-6' : 'col-md-4'">
                            <div class="text-center"><span class="detail-title">UM</span></div>
                            <h6 class="detail-desc text-center">{{ item_details.um }}</h6>
                        </div>
                        <div :class="table_oc ? 'col-md-6' : 'col-md-4'" v-if="!table_oc">
                            <div class="text-center"><span class="detail-title">Ctdad Despachada</span></div>
                            <h6 class="detail-desc text-center">{{ item_details.product_quantity }}</h6>
                        </div>
                        <div :class="table_oc ? 'col-md-6' : 'col-md-4'">
                            <div class="text-center"><span class="detail-title">Ctdad Recibida</span></div>
                            <h6 class="detail-desc text-center">{{ item_details.received_quantity }}</h6>
                        </div>
                    </div>
                    <div class="row py-1">
                        <div class="col-md-4">
                            <div class="text-center"><span class="detail-title">Precio Unitario</span></div>
                            <h6 class="detail-desc text-center">{{ item_details.price_unit }}</h6>
                        </div>
                        <div class="col-md-4">
                            <div class="text-center"><span class="detail-title">Importe Total</span></div>
                            <h6 class="detail-desc text-center">{{ item_details.price_total }}</h6>
                        </div>
                        <div class="col-md-4">
                            <div class="text-center"><span class="detail-title">Tarjeta de Estiba</span></div>
                            <h6 class="detail-desc text-center">{{ item_details.stowage_card }}</h6>
                        </div>
                    </div>
                    <div class="row py-1" v-if="item_details.comment != '' && item_details.comment != null">
                        <div class="col-md-12">
                            <span class="detail-title">Comentario</span>
                            <h6 class="detail-desc">{{ item_details.comment }}</h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- /.Modal Details -->
</template>