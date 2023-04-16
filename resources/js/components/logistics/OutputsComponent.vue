<script>
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";

export default {
    data: function () {
      return {
        outputs: [],
        loading: true,
        session: JSON.parse(sessionStorage.getItem('semtinel'))
      };
    },
    methods: {
        newOutput: function () {
            this.$router.push('/semtinel/logistics/output')
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
                pole = localStorage.getItem('stnel_logist_pole'),
                project = localStorage.getItem('stnel_logist_project')
            this.loading = true
            let headers = {
                'User-Agent': 'testing/1.0',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + cmp.session.access_token
            }
            await fetch("http://localhost/semtinel/public/api/logistics/outputs/" + pole + "/" + project + "/" + reload, {
                        method: 'GET',
                        headers: headers
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        cmp.outputs = data
                        cmp.loading = false
                        if ($("#datatable").DataTable().destroy()) {
                            setTimeout(() => {
                                $("#datatable").DataTable({
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
                                        { "width": "10%" },
                                        { "width": "8%" }
                                    ],
                                    language: {
                                        "decimal": "",
                                        "emptyTable": "No hay información",
                                        "info": "Mostrando _START_ a _END_ de _TOTAL_ Registros",
                                        "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
                                        "infoFiltered": "(Filtrado de _MAX_ total registros)",
                                        "infoPostFix": "",
                                        "thousands": ",",
                                        "lengthMenu": "Mostrar _MENU_ Registros",
                                        "loadingRecords": "Cargando...",
                                        "processing": "Procesando...",
                                        "search": "Buscar: ",
                                        "zeroRecords": "Sin resultados encontrados",
                                        "paginate": {
                                            "first": "Primero",
                                            "last": "Ultimo",
                                            "next": "Siguiente",
                                            "previous": "Anterior"
                                        }
                                    }
                                });
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
            window.document.location.href = 'http://localhost/semtinel/login'
        }
        let pole = localStorage.getItem('stnel_logist_pole'),
            project = localStorage.getItem('stnel_logist_project'),
            headers = {
            'User-Agent': 'testing/1.0',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + cmp.session.access_token
        }
        let user = JSON.parse(sessionStorage.getItem('semtinel'))
        fetch("http://localhost/semtinel/public/api/logistics/outputs/" + pole + "/" + project + "/true", {
                method: 'GET',
                headers: headers
            })
            .then((response) => response.json())
            .then((data) => {
                cmp.outputs = data;
                cmp.loading = false;
                setTimeout(() => {
                    $("#datatable").DataTable({
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
                        language: {
                            "decimal": "",
                            "emptyTable": "No hay información",
                            "info": "Mostrando _START_ a _END_ de _TOTAL_ Registros",
                            "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
                            "infoFiltered": "(Filtrado de _MAX_ total registros)",
                            "infoPostFix": "",
                            "thousands": ",",
                            "lengthMenu": "Mostrar _MENU_ Registros",
                            "loadingRecords": "Cargando...",
                            "processing": "Procesando...",
                            "search": "Buscar: ",
                            "zeroRecords": "Sin resultados encontrados",
                            "paginate": {
                                "first": "Primero",
                                "last": "Ultimo",
                                "next": "Siguiente",
                                "previous": "Anterior"
                            }
                        }
                    });
                });
            })
            .catch(error => {
                this.errorMessage = error;
                toastr.error("Error: " + error);
            });
    },
};
</script>

<template>
    <div class="container-fluid px-0">
        <!-- card -->
        <div class="card">
            <!-- card-header -->
            <div class="card-header">
                <h3 class="card-title">Salidas de mercanc&iacute;as desde Pa&ntilde;oles</h3>
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
                        <span class="mdi mdi-loading mdi-spin mdi-36px">&nbsp;Cargando salidas de mercanc&iacute;as...</span>
                    </div>
                </div>
                <div class="row" :class="loading ? 'hidden' : ''">
                    <div class="col-12">
                        <table id="datatable" class="table table-striped">
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