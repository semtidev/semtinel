<script allowJs="true">
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";
import PageHeader from "../../layouts/HeaderComponent.vue";

export default {
    data: function () {
      return {
        outputs: [],
        loading: true,
        session: JSON.parse(sessionStorage.getItem('semtinel'))
      };
    },
    components: {
        'page-header': PageHeader
    },
    methods: {
        createDataTable: function () {
            let cmp = this
            $("#dt_outputs").DataTable({
                retrieve: true,
                lengthMenu: [
                    [10, 15, 25, 50, -1],
                    [10, 15, 25, 50, "Todos"],
                ],
                pageLength: 10,
                //order: [[5, 'asc']],
                "columnDefs": [{
                    "targets": 'no-sort',
                    "orderable": false,
                    "order": []
                }],
                "columns": [
                    { "width": "5%" },
                    null,
                    { "width": "15%" },
                    { "width": "15%" },
                    { "width": "15%" },
                    { "width": "10%" },
                    { "width": "10%" }
                ],
                language: cmp.$root.dataTableLanguage
            });
        },
        newOutput: function () {
            this.$router.push('/semtinel/public/logistics/output')
        },
        listReload: function () {
            this.getOutputsTable(true)
        },
        outputDetail: function (output) {
            let cmp = this, price_total = 0
            output.items.map(function(value, key) {
                price_total += parseFloat(value.price_total) 
            })
            output.price_total = price_total
            this.$router.push({ 
                name: 'logistics.output.detail', 
                params: { 
                    output: JSON.stringify(output)
                }
            }) //'/semtinel/logistics/entry.detail'
        },
        async getOutputsTable (reload = false) {
            let cmp = this,
                pole = sessionStorage.getItem('stnel_logist_pole'),
                project = sessionStorage.getItem('stnel_logist_project')
            this.loading = true
            let headers = {
                'User-Agent': 'testing/1.0',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + cmp.session.access_token
            }
            await fetch("http://localhost/semtinel/public/api/logistics/outputs/" + pole + "/" + project, {
                        method: 'GET',
                        headers: headers
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        cmp.outputs = data;
                        cmp.loading = false;
                        sessionStorage.setItem('stnel_logist_outputs', JSON.stringify(data));
                        if ($("#dt_outputs").DataTable().destroy()) {
                            setTimeout(() => {
                                cmp.createDataTable();
                            });
                        }
                    })
                    .catch(error => {
                        this.errorMessage = error;
                        toastr.error("Error: " + error);
                    });
        }
    },
    mounted() {
        let cmp = this
        // Verify login active
        if (!JSON.parse(sessionStorage.getItem('semtinel')).access_token) {
            sessionStorage.clear()
            window.document.location.href = 'http://localhost/semtinel/public/login'
        }
        // Load from session storage
        if (sessionStorage.getItem('stnel_logist_outputs') && sessionStorage.getItem('stnel_logist_outputs') != '') {
            cmp.outputs = JSON.parse(sessionStorage.getItem('stnel_logist_outputs'));
            cmp.loading = false;
        }
        else {
            let pole = sessionStorage.getItem('stnel_logist_pole'),
                project = sessionStorage.getItem('stnel_logist_project'),
                headers = {
                'User-Agent': 'testing/1.0',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + cmp.session.access_token
            }
            let user = JSON.parse(sessionStorage.getItem('semtinel'))
            fetch("http://localhost/semtinel/public/api/logistics/outputs/" + pole + "/" + project, {
                    method: 'GET',
                    headers: headers
                })
                .then((response) => response.json())
                .then((data) => {
                    cmp.outputs = data;
                    cmp.loading = false;
                    sessionStorage.setItem('stnel_logist_outputs', JSON.stringify(data));
                    setTimeout(() => {
                        cmp.createDataTable();
                    });
                })
                .catch(error => {
                    this.errorMessage = error;
                    toastr.error("Error: " + error);
                });
        }
    },
};
</script>

<template>
    <page-header 
        :pagetitle="'Listado de Salidas de mercancía de pañoles'">
    </page-header>
    <div class="container-fluid px-0">
        <!-- card -->
        <div class="card">
            <!-- card-header -->
            <div class="card-header">
                <h3 class="card-title">Salidas de mercanc&iacute;a</h3>
                <div class="card-tools">
                    <button type="button" 
                        class="btn btn-tool pr-2"
                        v-tooltip="'Recargar Listado'"
                        v-on:click.stop="listReload()">
                        <i class="mdi mdi-reload mdi-24px text-green"></i>
                    </button>
                    <button type="button" 
                        class="btn btn-tool pl-0"
                        v-tooltip="'Nueva Entrada'" 
                        data-toggle="modal" 
                        data-target="#modal-system-form"
                        v-on:click="newOutput()">
                        <i class="mdi mdi-plus-circle mdi-24px text-green"></i>
                    </button>
                </div>
            </div>
            <!-- /.card-header -->
            <!-- card-body -->
            <div class="card-body">
                <div class="row" :class="loading ? '' : 'hidden'">
                    <div class="col-12 text-center py-5 loading-table">
                        <span class="mdi mdi-loading mdi-spin mdi-36px">&nbsp;Cargando salidas...</span>
                    </div>
                </div>
                <div class="row" :class="loading ? 'hidden' : ''">
                    <div class="col-12">
                        <table id="dt_outputs" class="table table-striped">
                            <thead>
                            <tr>
                                <th width="5%" class="text-center no-sort">No.</th>
                                <th>Documento</th>
                                <th width="15%">Pa&ntilde;ol</th>
                                <th width="15%">Responsable</th>
                                <th width="15%">Autoriz&oacute;</th>
                                <th width="10%" class="text-center">Fecha</th>
                                <th width="10%" class="no-sort text-center">Estado</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(output, idx) in outputs" :key="output.id">
                                <td class="text-center">{{ idx + 1 }}</td>
                                <td>
                                    <span class="fas fa-paperclip"
                                        :class="(output.attach_path == '' || output.attach_path == null) ? 'icon-noexists' : 'icon-exists'"
                                        v-tooltip="(output.attach_path == '' || output.attach_path == null) ? 'Sin arhivo adjunto' : 'Archivo adjunto'">
                                    </span>&nbsp;
                                    <a class="show-lnk" 
                                        href="javascript:void(0);"
                                        v-tooltip="'Click para Mostrar Detalles de esta Salida'"
                                        v-on:click="outputDetail(output)">
                                        {{ output.code }}
                                    </a>                                    
                                </td>
                                <td>{{ output.warehouse_name }}</td>
                                <td>{{ output.warehouse_owner }}</td>
                                <td>{{ output.authorizing }}</td>
                                <td class="text-center">{{ output.created_at }}</td>
                                <td class="text-center">
                                    <span class="badge" :class="(output.status == 'Creada') ? 'badge-warning' : 'badge-dark'">
                                        {{ output.status }}
                                    </span>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>