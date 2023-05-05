<script>
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";

export default {
    data: function () {
      return {
        systems: [],
        loading: true,
        form_title: 'Nuevo Sistema',
        form_data: {
            id: '',
            name: '',
            active: 1
        },
        form_action: '',
        form_error: '',
        form_okbtn_text: 'Aceptar',
        form_color: 'green',
        form_loading: false,
        delete_text: 'Eliminar',
        delete_id: '',
        delete_system: '',
        delete_error: '',
        delete_loading: false,
        session: JSON.parse(sessionStorage.getItem('semtinel'))
      };
    },
    watch: {
        form_okbtn_text: function (val) {
            if (val == 'Aceptar')
                this.form_loading = false
            else
                this.form_loading = true
        },
        form_action: function (val) {
            switch (val) {
                case 'create':
                    this.form_color = 'green';
                    break;
                case 'edit':
                    this.form_color = 'orange';
                    break;
                default:
                    this.form_color = 'danger';
                    break;
            }
        },
    },
    methods: {
        listReload: function () {
            this.getSystemsTable()
        },
        isValidForm: function () {
            if (this.form_data.name == null || this.form_data.name == '') {
                this.form_error = 'Debe escribir un Nombre para el sistema.'
                return false
            }
            return true
        },
        async getSystemsTable () {
            let cmp = this
            this.loading = true
            let headers = {
                'User-Agent': 'testing/1.0',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + cmp.session.access_token
            }
            await fetch("http://localhost/semtinel/public/api/admin/systems", {
                        method: 'GET',
                        headers: headers
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        cmp.systems = data
                        cmp.loading = false
                        if ($("#datatable").DataTable().destroy()) {
                            setTimeout(() => {
                                $("#datatable").DataTable({
                                    lengthMenu: [
                                        [10, 15, 25, 50, -1],
                                        [10, 15, 25, 50, "Todos"],
                                    ],
                                    pageLength: 10,
                                    order: [[1, 'asc']],
                                    "columnDefs": [{
                                        "targets": 'no-sort',
                                        "orderable": false,
                                        "order": []
                                    }],
                                    "columns": [
                                        { "width": "5%" },
                                        null,
                                        { "width": "10%" },
                                        { "width": "10%" },
                                        { "width": "10%" }
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
        },
        create: function () {
            this.form_action      = 'create'
            this.form_error       = ''
            this.form_title       = 'Nuevo Sistema'
            this.form_data.id     = ''
            this.form_data.name   = ''
            this.form_data.active = 1
        },
        edit: function (id, name, active) {
            this.form_action      = 'edit'
            this.form_error       = ''
            this.form_title       = 'Editar Sistema'
            this.form_data.id     = id
            this.form_data.name   = name
            this.form_data.active = active
        },
        activeSystem: function () {
            if (this.form_data.active == 1)
                this.form_data.active = 0
            else
                this.form_data.active = 1
        },
        deleteDialog: function (id, system) {
            this.delete_id     = id 
            this.delete_system = system
        },
        async store () {
            let cmp = this;
            if (!cmp.isValidForm()) {
                return
            }
            cmp.form_error = ''
            cmp.form_okbtn_text = 'Procesando...'
            let headers = {
                'User-Agent': 'testing/1.0',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + cmp.session.access_token
            }
            await axios.post('http://localhost/semtinel/public/api/admin/system',{
                    'id' : cmp.form_data.id,
                    'name': cmp.form_data.name,
                    'active': cmp.form_data.active
                }, {
                    headers: headers
                }).then(function (response) {
                    if (response.data.success) {
                        cmp.form_error = ''
                        cmp.form_okbtn_text = 'Aceptar'
                        // Hide modal
                        cmp.$refs.Close.click();
                        // Notification
                        if (cmp.form_action == 'create') {
                            toastr.success('El Sistema fue Agregado con éxito.')
                        }
                        else if (cmp.form_action == 'edit') {
                            toastr.success('El Sistema fue Actualizado con éxito.')
                        }
                        // Reload table
                        cmp.listReload()
                    }
                    else {
                        cmp.form_error = ''
                        cmp.form_okbtn_text = 'Aceptar'
                        toastr.error('Error al intentar realizar la operación.')
                    }
                }).catch(function (error) {
                    cmp.form_error = 'Ha ocurrido un error. Por favor, prueba nuevamente.'
                    cmp.form_okbtn_text = 'Aceptar'
                    return;
                })
        },
        async destroy () {
            let cmp = this;
            cmp.delete_error = ''
            cmp.delete_loading = true
            cmp.delete_text = 'Procesando...'
            let headers = {
                'User-Agent': 'testing/1.0',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + cmp.session.access_token
            }
            await axios.delete('http://localhost/semtinel/public/api/admin/system/' + cmp.delete_id, {
                    headers: headers
                }, {}).then(function (response) {
                    if (response.data.success) {
                        cmp.delete_error = ''
                        cmp.delete_loading = false
                        cmp.delete_text = 'Eliminar'
                        // Hide modal
                        cmp.$refs.delClose.click();
                        // Notification
                        toastr.success('El Sistema fue Eliminado con éxito.')
                        // Reload table
                        cmp.listReload()
                    }
                    else {
                        cmp.delete_error = ''
                        cmp.delete_loading = false
                        cmp.delete_text = 'Eliminar'
                        toastr.error('Error al intentar realizar la operación.')
                    }
                }).catch(function (error) {
                    cmp.delete_error = 'Ha ocurrido un error. Por favor, prueba nuevamente.'
                    cmp.form_okbtn_text = 'Eliminar'
                    cmp.delete_loading = false
                    return;
                })
        }
    },
    mounted() {
        // Start bootstrap tooltips
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        });
        
        let cmp = this
        // Verify login active
        if (!JSON.parse(sessionStorage.getItem('semtinel')).access_token) {
            sessionStorage.clear()
            window.document.location.href = 'http://localhost/semtinel/public/login'
        }
        let headers = {
            'User-Agent': 'testing/1.0',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + cmp.session.access_token
        }
        fetch("http://localhost/semtinel/public/api/admin/systems", {
                method: 'GET',
                headers: headers
            })
            .then((response) => response.json())
            .then((data) => {
                cmp.systems = data;
                cmp.loading = false;
                setTimeout(() => {
                    $("#datatable").DataTable({
                        retrieve: true,
                        lengthMenu: [
                            [10, 15, 25, 50, -1],
                            [10, 15, 25, 50, "Todos"],
                        ],
                        pageLength: 10,
                        order: [[1, 'asc']],
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
                <h3 class="card-title">Semtinel Apps</h3>
                <div class="card-tools">
                    <button type="button" 
                        class="btn btn-tool pr-2"
                        data-bs-toggle="tooltip" 
                        title="Recargar Listado"
                        v-on:click.stop="listReload()">
                        <i class="mdi mdi-reload mdi-24px text-green"></i>
                    </button>
                    <button type="button" 
                        class="btn btn-tool pl-0"
                        data-bs-toggle="tooltip" 
                        title="Nuevo Sistema" 
                        data-toggle="modal" 
                        data-target="#modal-system-form"
                        v-on:click="create()">
                        <i class="mdi mdi-plus-circle mdi-24px text-green"></i>
                    </button>
                </div>
            </div>
            <!-- /.card-header -->
            <!-- card-body -->
            <div class="card-body">
                <div class="row" :class="loading ? '' : 'hidden'">
                    <div class="col-12 text-center py-5 loading-table">
                        <span class="mdi mdi-loading mdi-spin mdi-36px">&nbsp;Cargando sistemas...</span>
                    </div>
                </div>
                <div class="row" :class="loading ? 'hidden' : ''">
                    <div class="col-12">
                        <table id="datatable" class="table table-striped">
                            <thead>
                            <tr>
                                <th width="5%" class="text-center no-sort">No.</th>
                                <th>Nombre</th>
                                <th width="10%" class="text-center no-sort">Activo</th>
                                <th width="10%" class="text-center no-sort">Modificar</th>
                                <th width="10%" class="text-center no-sort">Eliminar</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(system, idx) in systems" :key="system.id">
                                <td class="text-center">{{ idx + 1 }}</td>
                                <td>{{ system.name }}</td>
                                <td class="text-center">
                                    <span 
                                        class="mdi mdi-18px" 
                                        :class="(system.active) ? 'mdi-checkbox-marked-circle' : 'mdi-checkbox-blank-circle-outline'">
                                    </span>
                                </td>
                                <td class="text-center">
                                    <a title="Editar registro" 
                                        href="javascript:void(0);"
                                        class="btn-semti-tool"
                                        style="padding: 4px 5px;"
                                        data-toggle="modal" 
                                        data-target="#modal-system-form"
                                        v-on:click="edit(system.id, system.name, system.active)">
                                        <span class="mdi mdi-pencil mdi-18px text-orange"></span>
                                    </a>
                                </td>
                                <td class="text-center">
                                    <a title="Eliminar registro" 
                                        href="javascript:void(0);"
                                        class="btn-semti-tool"
                                        style="padding: 4px 5px;"
                                        data-toggle="modal" 
                                        data-target="#modal-system-delete"
                                        v-on:click="deleteDialog(system.id, system.name)">
                                        <span class="mdi mdi-trash-can-outline mdi-18px text-danger"></span>
                                    </a>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Form -->
    <div class="modal fade" id="modal-system-form" aria-hidden="true" role="dialog" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header"
                    :class="'header-' + form_color">
                    <h4 class="modal-title">{{ form_title }}</h4>
                    <button type="button" 
                        ref="Close" 
                        class="close"
                        data-dismiss="modal" 
                        aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body px-4">
                    <form>
                        <input type="hidden" 
                            name="id_system" 
                            id="id_system"
                            v-model="form_data.id">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label for="name">Nombre:</label>
                                    <input type="text" 
                                    class="form-control"
                                    id="name"
                                    name="name"
                                    placeholder="Nombre del sistema"
                                    v-model="form_data.name">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-check ml-1">
                                    <input 
                                        type="checkbox" 
                                        class="form-check-input" 
                                        id="syst_active" 
                                        name="syst_active" 
                                        :checked="form_data.active"
                                        v-on:change="activeSystem()">
                                    <label class="form-check-label" for="syst_active">Activo</label>
                                </div>
                            </div>                                
                        </div>
                        <div class="row pt-2" v-if="form_error != ''">
                            <div class="col-12 text-center">
                                <h6 class="form_error">{{ form_error }}</h6>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer justify-content-between">
                    <button type="button" class="btn btn-default ripple" data-dismiss="modal">Cancelar</button>
                    <button type="button" 
                        class="btn btn-primary ripple"
                        :class="'btn-' + form_color"
                        :disabled="form_loading"
                        v-on:click.stop="store()">
                        <i class="mdi mdi-check-all" v-if="!form_loading"></i>
                        <i class="mdi mdi-loading mdi-spin" v-else></i>
                        &nbsp;{{ form_okbtn_text }}
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!-- /.Modal Form -->

    <!-- Modal System delete -->
    <div class="modal fade" id="modal-system-delete" aria-hidden="true" role="dialog" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
        <div class="modal-header header-danger">
            <h4 class="modal-title">Confirmación</h4>
            <button type="button" ref="delClose" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body px-4">
            <div class="float-start" style="width: 70px"><i class="mdi mdi-chat-question mdi-48px"></i></div>
            <div class="float-start pt-3" style="width: 85%">
            <p>El Sistema "<strong>{{ delete_system }}</strong>" será Eliminado de la plataforma Semtinel.<br>Confirme que desea realizar esta operación.</p>
            </div>
        </div>
        <div class="modal-footer justify-content-between">
            <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
            <button type="button" 
                class="btn btn-danger ripple"
                :disabled="delete_loading"
                v-on:click="destroy()">
            <i class="mdi mdi-trash-can-outline"></i>&nbsp;{{ delete_text }}
            </button>
        </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
    </div>
    <!-- /.modal system delete -->
</template>