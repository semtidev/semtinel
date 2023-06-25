<script allowJs="true">
import PageHeader from "../../layouts/HeaderComponent.vue"

export default {
    data: function () {
      return {
        output: {},
        pagetitle: '',
        upload_id: '',
        upload_output: '',
        upload_file: '',
        upload_form_error: {
            error_text: ''
        },
        upload_form_loading: false,
        upload_form_okbtn_text: 'Adjuntar',
        table_oc: true,
        show_details: false,
        item_details: {
            pole: '',
            project: '',
            warehouse: '',
            warehouse_owner: '',
            cod_product: '',
            item_description: '',
            um: '',
            quantity: 0,
            price_unit: 0,
            price_total: 0
        },
        confirm_loading: false,
        cancel_loading: false,
        confirm_text: 'Confirmar',
        session: JSON.parse(sessionStorage.getItem('semtinel')),
        pole: sessionStorage.getItem('stnel_logist_pole'),
        project: sessionStorage.getItem('stnel_logist_project')
      };
    },
    created() {
        this.output = JSON.parse(this.$route.params.output)
        this.pagetitle = this.output['code']
        if (this.output['confirm'] == 1)
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
        docPdf: function(output) {
            window.open('http://localhost/semtinel/public/api/logistics/pdf/output/' + output, '_blank', 'noreferrer')
        },
        show: function (idx) {
            let cmp = this
            cmp.item_details = {
                pole: cmp.output['pole_name'],
                project: cmp.output['project_name'],
                warehouse: cmp.output['warehouse_name'],
                warehouse_owner: cmp.output['warehouse_owner'],
                cod_product: cmp.output['items'][idx].product_code,
                item_description: cmp.output['items'][idx].item_description,
                um: cmp.output['items'][idx].um,
                quantity: cmp.output['items'][idx].quantity,
                price_unit: cmp.output['items'][idx].price_unit,
                price_total: cmp.output['items'][idx].price_total,
            }
            cmp.show_details = true
        },
        attachFile: function (id, code) {
            this.$refs.uploadFile.value = null
            this.upload_form_error.error_text = ''
            this.upload_id = id
            this.upload_output = code
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
            data.append('output', cmp.upload_output)
            data.append('file', cmp.upload_file)
            data.append('user', cmp.session.id)
            data.append('pole', cmp.pole)
            data.append('project', cmp.project)

            axios.post('http://localhost/semtinel/public/api/logistics/output/upload', data, {
                    headers: headers
                }).then(function (response) {
                    if (response.data.success) {
                        // Hide modal
                        cmp.$refs.CloseUpload.click()
                        cmp.upload_form_loading = false
                        cmp.output.attach_path = response.data.path
                        let path_arr = cmp.output.attach_path.split('.')
                        cmp.output.attach_type = path_arr[1]
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
        confirmOutput: function () {
            let cmp = this
            cmp.confirm_loading = true
            let headers = {
                'User-Agent': 'testing/1.0',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + cmp.session.access_token
            }
            axios.post('http://localhost/semtinel/public/api/logistics/output/confirm', {
                    'output' : cmp.output.id,
                    'user': cmp.session.id,
                    'pole': cmp.pole,
                    'project': cmp.project
                }, {
                    headers: headers
                }).then(function (response) {
                    if (response.data.success) {
                        cmp.confirm_loading = false
                        cmp.output.confirm = 1
                        cmp.confirm_text = 'Confirmada'
                        toastr.success('La Salida fue Confirmada con éxito.')
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
        cancelOutput: function () {
            let cmp = this
            cmp.cancel_loading = true
            let headers = {
                'User-Agent': 'testing/1.0',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + cmp.session.access_token
            }
            axios.post('http://localhost/semtinel/public/api/logistics/output/cancel', {
                    'output' : cmp.output.id,
                    'user': cmp.session.id,
                    'pole': cmp.pole,
                    'project': cmp.project
                }, {
                    headers: headers
                }).then(function (response) {
                    if (response.data.success) {
                        cmp.cancel_loading = false
                        toastr.success('La Salida fue Cancelada con éxito.')
                        cmp.$router.push('/semtinel/public/logistics/outputs')
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
        :pagetitle="'Detalle de la Salida No. ' + pagetitle"
        :breadcrumbs="true"
        :navbar="[
            {
                page: 'Salidas',
                link: '/semtinel/public/logistics/outputs',
                tooltip: 'Click para regresar al listado de Salidas',
                active: false
            },
            {
                page: 'Detalle de Salida',
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
                    <i class="mdi mdi-cart-arrow-right mdi-36px align-middle"></i>&nbsp;&nbsp;Fecha de la salida: {{ output.created_at }}
                </h5>
            </div>
            <div class="col-sm-6 text-right">
                <a href="javascript:void(0);"
                    class="btn btn-app system"
                    v-tooltip="'Generar documento PDF'"
                    v-on:click="docPdf(output.id)">
                  <i class="fas fa-file-pdf"></i> Documento
                </a>
                <a href="javascript:void(0);" v-if="('logistics.api.upload.output' in $root.session.permissions)"
                    class="btn btn-app system"
                    data-toggle="modal" 
                    data-target="#modal-upload-form"
                    v-tooltip="'Adjuntar documento escaneado'"
                    v-on:click="attachFile(output.id, output.code)">
                  <i class="fas fa-paperclip"></i> Adjuntar
                </a>
                <a href="javascript:void(0);" 
                    v-if="(output.type == 'Despacho a Obra') && ('logistics.api.cofirm.output' in $root.session.permissions)"
                    class="btn btn-app success"
                    :class="(output.confirm == 1) ? 'disabled' : ''"
                    v-tooltip="'Confirmar salida'"
                    v-on:click.stop="confirmOutput()">
                  <i class="fas" :class="(confirm_loading) ? 'fa-spinner fa-pulse' : 'fa-check'"></i> {{ confirm_text }}
                </a>
                <a href="javascript:void(0);" 
                    class="btn btn-app danger"
                    v-if="(output.confirm != 1) && (session.id == output.created_by || ('Responsable de Especialidad' in $root.session.roles && output.warehouse in session.warehouses))"
                    v-tooltip="'Cancelar salida'"
                    v-on:click.stop="cancelOutput()">
                  <i class="fas" :class="(cancel_loading) ? 'fa-spinner fa-pulse' : 'fa-times'"></i> Cancelar
                </a>
            </div>
        <!-- /.col -->
        </div>
        <!-- info row -->
        <div class="row invoice-info">
            <div class="col-sm-3 invoice-col">
                <div class="form-group">
                    <label class="mb-1">Polo</label>
                    <h6 class="p-0"><strong>{{ output.pole_name }}</strong></h6>
                </div>
                <div class="form-group">
                    <label class="mb-1">Proyecto</label>
                    <h6 class="p-0"><strong>{{ output.project_name }}</strong></h6>
                </div>
                <div class="form-group">
                    <label class="mb-1">Origen</label>
                    <h6 class="p-0"><strong>{{ output.warehouse_name }}</strong></h6>
                </div>
                <div class="form-group">
                    <label class="mb-1">Responsable</label>
                    <h6 class="p-0"><strong>{{ output.warehouse_owner }}</strong></h6>
                </div>
            </div>
            <!-- /.col -->
            <div class="col-sm-3 invoice-col">
                <div class="form-group">
                    <label class="mb-1">Tipo</label>
                    <h6 class="p-0"><strong>{{ output.type }}</strong></h6>
                </div>
                <div class="form-group">
                    <label class="mb-1">Destino</label>
                    <h6 class="p-0"><strong>{{ output.destin }}</strong></h6>
                </div>
                <div class="form-group" v-if="output.type == 'Despacho a Obra'">
                    <label class="mb-1">Autorizado</label>
                    <h6 class="p-0"><strong>{{ output.authorized }}</strong></h6>
                </div>
                <div class="form-group" v-else>
                    <label class="mb-1">Responsable</label>
                    <h6 class="p-0"><strong>{{ output.destin_warehouse_owner }}</strong></h6>
                </div>
                <div class="form-group">
                    <label class="mb-1">Autoriza</label>
                    <h6 class="p-0"><strong>{{ output.authorizing }}</strong></h6>
                </div>
                
            </div>
            <!-- /.col -->
            <div class="col-sm-3 invoice-col">
                <div class="form-group">
                    <label class="mb-1">Estado</label><br>
                    <span class="badge" :class="(output.status == 'Creada') ? 'badge-warning' : 'badge-dark'">
                        Salida {{ output.status }}
                    </span>
                </div>
                <div class="form-group" >
                    <label class="mb-1">Documento escaneado</label><br>
                    <a href="javascript:void(0);" 
                        v-if="output.attach_path != '' && output.attach_path != null && output.attach_type == 'pdf'"
                        v-on:click.stop="openScanner(output.attach_path)">
                        <img src="http://localhost/semtinel/public/themes/semtinel/img/icon-pdf2.png" alt="Documento Escaneado" v-tooltip="'Click para abrir'"/>
                    </a>
                    <a href="javascript:void(0);" 
                        v-else-if="output.attach_path != '' && output.attach_path != null && output.attach_type == 'png'"
                        v-on:click.stop="openScanner(output.attach_path)">
                        <img src="http://localhost/semtinel/public/themes/semtinel/img/icon-png.png" alt="Documento Escaneado" v-tooltip="'Click para abrir'"/>
                    </a>
                    <a href="javascript:void(0);" 
                        v-else-if="output.attach_path != '' && output.attach_path != null && output.attach_type == 'jpg'"
                        v-on:click.stop="openScanner(output.attach_path)">
                        <img src="http://localhost/semtinel/public/themes/semtinel/img/icon-jpg.png" alt="Documento Escaneado" v-tooltip="'Click para abrir'"/>
                    </a>
                    <span v-else class="badge badge-danger" v-if="output.attach_path == '' || output.attach_path == null">
                        No se ha adjuntado el documento escaneado aún.
                    </span>
                </div>
            </div>
            <!-- /.col -->
        </div>
        <!-- /.row -->

        <!-- Table Products -->
        <div class="row pt-4">
            <div class="col-12 table-responsive">
                <table class="table table-striped">
                    <thead>
                    <tr>
                        <th width="150" class="text-center">C&oacute;digo</th>
                        <th>Descripción</th>
                        <th width="100" class="text-center">UM</th>
                        <th width="100" class="text-center">Ctdad</th>
                        <th width="100" class="text-right">Precio Unitario</th>
                        <th width="130" class="text-right">Precio Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, idx) in output['items']" :key="item['id']">
                        <td class="text-center">{{ item['product_code'] }}</td>
                        <td>
                            {{ item['item_description'] }}
                        </td>
                        <td class="text-center">{{ item['um'] }}</td>
                        <td class="text-center">{{ item['quantity'] }}</td>
                        <td class="text-right">{{ item['price_unit'] }}</td>
                        <td class="text-right">{{ item['price_total'] }}</td>
                    </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="5" class="text-right"><strong>Costo Total:</strong></td>
                            <td class="text-right"><strong>{{ output.price_total }}</strong></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <!-- /.col -->
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
                            name="upload_id_output" 
                            id="upload_id_output"
                            v-model="upload_id">
                        <div class="row pt-3 pb-1">
                            <div class="col-md-12">
                                <h6 class="text-green">
                                    Salida No. <strong>{{ upload_output }}</strong>
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

    <!-- Modal Details
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
    </div> -->
    <!-- /.Modal Details -->
</template>