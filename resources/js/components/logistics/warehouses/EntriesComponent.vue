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
        entries: [],
        loading: true,
        session: JSON.parse(sessionStorage.getItem('semtinel'))
      };
    },
    methods: {
        createDataTable: function () {
            let cmp = this
            $("#dt_entries").DataTable({
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
                    { "width": "10%" },
                    { "width": "15%" },
                    { "width": "10%" },
                    { "width": "10%" },
                    { "width": "5%" }
                ],
                language: cmp.$root.dataTableLanguage
            });
        },
        newEntry: function () {
            this.$router.push('/semtinel/public/logistics/entry')
        },
        listReload: function () {
            this.getEntriesTable()
        },
        entryDetail: function (entry) {
            this.$router.push({ 
                name: 'logistics.entry.detail', 
                params: { 
                    entry: JSON.stringify(entry)
                }
            }) //'/semtinel/logistics/entry.detail'
        },
        async getEntriesTable () {
            let cmp = this,
                pole = sessionStorage.getItem('stnel_logist_pole'),
                project = sessionStorage.getItem('stnel_logist_project')
            this.loading = true
            let headers = {
                'User-Agent': 'testing/1.0',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + cmp.session.access_token
            }
            await fetch("http://localhost/semtinel/public/api/logistics/entries/" + pole + "/" + project, {
                        method: 'GET',
                        headers: headers
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        cmp.entries = data
                        cmp.loading = false
                        sessionStorage.setItem('stnel_logist_entries', JSON.stringify(data));
                        if ($("#dt_entries").DataTable().destroy()) {
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
    components: {
        'page-header': PageHeader
    },
    mounted() {
        let cmp = this
        // Verify login active
        if (!JSON.parse(sessionStorage.getItem('semtinel')).access_token) {
            sessionStorage.clear()
            window.document.location.href = 'http://localhost/semtinel/public/login'
        }
        // Load from session storage
        if (sessionStorage.getItem('stnel_logist_entries') && sessionStorage.getItem('stnel_logist_entries') != '') {
            cmp.entries = JSON.parse(sessionStorage.getItem('stnel_logist_entries'));
            if ($("#dt_entries").DataTable().destroy()) {
                setTimeout(() => {
                    cmp.createDataTable();
                });
            }
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
            fetch("http://localhost/semtinel/public/api/logistics/entries/" + pole + "/" + project, {
                    method: 'GET',
                    headers: headers
                })
                .then((response) => response.json())
                .then((data) => {
                    cmp.entries = data;
                    cmp.loading = false;
                    sessionStorage.setItem('stnel_logist_entries', JSON.stringify(data));
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
        :pagetitle="'Listado de Entradas de mercancía'">
    </page-header>
    <div class="container-fluid px-0">
        <!-- card -->
        <div class="card">
            <!-- card-header -->
            <div class="card-header">
                <h3 class="card-title">Entradas de mercanc&iacute;a</h3>
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
                        <span class="mdi mdi-loading mdi-spin mdi-36px">&nbsp;Cargando entradas...</span>
                    </div>
                </div>
                <div class="row" :class="loading ? 'hidden' : ''">
                    <div class="col-12">
                        <table id="dt_entries" class="table table-striped">
                            <thead>
                            <tr>
                                <th width="5%" class="text-center no-sort">No.</th>
                                <th>Entrada</th>
                                <th width="15%">Origen</th>
                                <th width="10%">Orden Compra</th>
                                <th width="15%">Destino</th>
                                <th width="10%" class="text-center">Fecha</th>
                                <th width="10%" class="no-sort text-center">Estado</th>
                                <th width="5%" class="no-sort text-center">Confirm.</th>
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