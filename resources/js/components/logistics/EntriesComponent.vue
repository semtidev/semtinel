<script>
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";

export default {
    data: function () {
      return {
        entries: [],
        loading: true,
        session: JSON.parse(sessionStorage.getItem('semtinel'))
      };
    },
    methods: {
        newEntry: function () {
            this.$router.push('/semtinel/public/logistics/entry')
        },
        listReload: function () {
            this.getEntriesTable(true)
        },
        entryDetail: function (entry) {
            this.$router.push({ 
                name: 'logistics.entry.detail', 
                params: { 
                    entry: JSON.stringify(entry)
                }
            }) //'/semtinel/public/logistics/entry.detail'
        },
        async getEntriesTable (reload = false) {
            let cmp = this,
                pole = localStorage.getItem('stnel_logist_pole'),
                project = localStorage.getItem('stnel_logist_project')
            this.loading = true
            let headers = {
                'User-Agent': 'testing/1.0',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + cmp.session.access_token
            }
            await fetch("http://localhost/semtinel/public/api/logistics/entries/" + pole + "/" + project + "/" + reload, {
                        method: 'GET',
                        headers: headers
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        cmp.entries = data
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
            window.document.location.href = 'http://localhost/semtinel/public/login'
        }
        let pole = localStorage.getItem('stnel_logist_pole'),
            project = localStorage.getItem('stnel_logist_project'),
            headers = {
            'User-Agent': 'testing/1.0',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + cmp.session.access_token
        }
        let user = JSON.parse(sessionStorage.getItem('semtinel'))
        fetch("http://localhost/semtinel/public/api/logistics/entries/" + pole + "/" + project + "/true", {
                method: 'GET',
                headers: headers
            })
            .then((response) => response.json())
            .then((data) => {
                cmp.entries = data;
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
                <h3 class="card-title">Entradas de mercanc&iacute;a en pa&ntilde;ol</h3>
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
                        v-on:click="newEntry()">
                        <i class="mdi mdi-plus-circle mdi-24px text-green"></i>
                    </button>
                </div>
            </div>
            <!-- /.card-header -->
            <!-- card-body -->
            <div class="card-body">
                <div class="row" :class="loading ? '' : 'hidden'">
                    <div class="col-12 text-center py-5 loading-table">
                        <span class="mdi mdi-loading mdi-spin mdi-36px">&nbsp;Cargando entradas de mercanc&iacute;as en pa&ntilde;ol...</span>
                    </div>
                </div>
                <div class="row" :class="loading ? 'hidden' : ''">
                    <div class="col-12">
                        <table id="datatable" class="table table-striped">
                            <thead>
                            <tr>
                                <th width="5%" class="text-center no-sort">No.</th>
                                <th>Entrada</th>
                                <th width="15%">Origen</th>
                                <th width="15%">Orden Compra</th>
                                <th width="15%">Destino</th>
                                <th width="10%" class="text-center">Fecha</th>
                                <th width="10%" class="no-sort text-center">Estado</th>
                                <th width="8%" class="no-sort text-center">Confirmada</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(entry, idx) in entries" :key="entry.id">
                                <td class="text-center">{{ idx + 1 }}</td>
                                <td>
                                    <span class="fas fa-paperclip"
                                        :class="(entry.attach_path == '' || entry.attach_path == null) ? 'icon-noexists' : 'icon-exists'"
                                        v-tooltip="(entry.attach_path == '' || entry.attach_path == null) ? 'Sin arhivo adjunto' : 'Archivo adjunto'">
                                    </span>&nbsp;
                                    <a class="show-lnk" 
                                        href="javascript:void(0);"
                                        v-tooltip="'Click para Mostrar Detalles de esta Entrada'"
                                        v-on:click="entryDetail(entry)">
                                        {{ entry.code }}
                                    </a>                                    
                                </td>
                                <td>{{ entry.origin }}</td>
                                <td>{{ entry.oc }}</td>
                                <td>{{ entry.warehouse_name }}</td>
                                <td class="text-center">{{ entry.created_at }}</td>
                                <td class="text-center">
                                    <span class="badge" :class="(entry.status == 'Parcial') ? 'badge-warning' : 'badge-dark'">
                                        {{ entry.status }}
                                    </span>
                                </td>
                                <td class="text-center">
                                    <i 
                                        class="mdi mdi-18px" 
                                        :class="(entry.confirm == 1) ? 'mdi-radiobox-marked icon-exists' : 'mdi-checkbox-blank-circle-outline icon-noexists'"
                                        v-tooltip="(entry.confirm == 1) ? 'Confirmada' : 'Sin Confirmar'">
                                    </i>
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