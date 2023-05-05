<script allowJs="true">
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/css/bootstrap.min.css";

export default {
    data: function () {
        return {
            permissions: [],
            permission_roles: [],
            roles_loading: true,
            permissions_loading: true,
            permissions_empty: false,
            loading: true,
            form_title: 'Nuevo Permiso',
            form_data: {
                id: '',
                name: ''
            },
            form_action: '',
            form_error: '',
            form_okbtn_text: 'Aceptar',
            form_color: 'green',
            form_loading: false,
            delete_text: 'Eliminar',
            delete_id: '',
            delete_permission: '',
            delete_error: '',
            delete_loading: false,
            session: JSON.parse(sessionStorage.getItem('semtinel'))
        };
    },
    created() {
        
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
            this.getItemsTable()
        },
        async getItemsTable () {
            let cmp = this
            let headers = {
                'User-Agent': 'testing/1.0',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + cmp.session.access_token
            }
            cmp.permissions_loading = true
            // Load permissions
            fetch("http://localhost/semtinel/public/api/admin/permissions", {
                    method: 'GET',
                    headers: headers
                })
                .then((response) => response.json())
                .then((data) => {
                    cmp.permissions = data;
                    cmp.permissions_loading = false
                    cmp.permissions_empty = (data.length > 0) ? false : true
                })
                .catch(error => {
                    this.errorMessage = error;
                    toastr.error("Error: " + error);
                });
        },
        activeRole: function (idx) {
            this.permission_roles[idx].active = !this.permission_roles[idx].active
        },
        isValidForm: function () {
            if (this.form_data.name == null || this.form_data.name == '') {
                this.form_error = 'Debe escribir un Nombre para el permiso.'
                return false
            }
            return true
        },
        create: function () {
            let cmp = this
            cmp.form_action       = 'create'
            cmp.form_error        = ''
            cmp.form_title        = 'Nuevo Permiso'
            cmp.form_data.id      = ''
            cmp.form_data.name    = ''
            // Load permission-roles
            if (cmp.permission_roles.length > 0) {
                cmp.permission_roles.forEach((value, key) => {
                    value.active = false
                })
            }
            else {
                cmp.roles_loading = true
                let headers = {
                    'User-Agent': 'testing/1.0',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + cmp.session.access_token
                }
                fetch("http://localhost/semtinel/public/api/admin/permission/roles/0", {
                        method: 'GET',
                        headers: headers
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        cmp.permission_roles = data;
                        cmp.roles_loading = false
                    })
                    .catch(error => {
                        this.errorMessage = error;
                        toastr.error("Error: " + error);
                    });
            }
        },
        edit: function (id, name) {
            let cmp = this
            cmp.form_action      = 'edit'
            cmp.form_error       = ''
            cmp.form_title       = 'Editar Permiso'
            cmp.form_data.id     = id
            cmp.form_data.name   = name
            // Load permission-roles
            cmp.roles_loading = true
            let headers = {
                'User-Agent': 'testing/1.0',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + cmp.session.access_token
            }
            fetch("http://localhost/semtinel/public/api/admin/permission/roles/" + id, {
                    method: 'GET',
                    headers: headers
                })
                .then((response) => response.json())
                .then((data) => {
                    cmp.permission_roles = data;
                    cmp.roles_loading = false
                })
                .catch(error => {
                    this.errorMessage = error;
                    toastr.error("Error: " + error);
                });
        },
        deleteDialog: function (id, permission) {
            this.delete_id         = id 
            this.delete_permission = permission
        },
        async store () {
            let cmp = this
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
            await axios.post('http://localhost/semtinel/public/api/admin/permission',{
                    'id' : cmp.form_data.id,
                    'name': cmp.form_data.name,
                    'roles': this.permission_roles
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
                            toastr.success('El Permiso fue Agregado con éxito.')
                        }
                        else if (cmp.form_action == 'edit') {
                            toastr.success('El Permiso fue Actualizado con éxito.')
                        }
                        // Reload table
                        cmp.listReload()
                    }
                    else {
                        cmp.form_error = ''
                        cmp.form_okbtn_text = 'Aceptar'
                        cmp.error('Error al intentar realizar la operación.')
                    }
                }).catch(function (error) {
                    cmp.form_error = 'Ha ocurrido un error. Por favor, prueba nuevamente.'
                    cmp.form_okbtn_text = 'Aceptar'
                    return;
                })
        },
        async destroy () {
            let cmp = this
            cmp.delete_error = ''
            cmp.delete_loading = true
            cmp.delete_text = 'Procesando...'
            let headers = {
                'User-Agent': 'testing/1.0',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + cmp.session.access_token
            }
            await axios.delete('http://localhost/semtinel/public/api/admin/permission/' + cmp.delete_id, {
                    headers: headers
                }, {}).then(function (response) {
                    if (response.data.success) {
                        cmp.delete_error = ''
                        cmp.delete_loading = false
                        cmp.delete_text = 'Eliminar'
                        // Hide modal
                        cmp.$refs.delClose.click();
                        // Notification
                        toastr.success('El Permiso fue Eliminado con éxito.')
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
        // Verify login active
        if (!JSON.parse(sessionStorage.getItem('semtinel')).access_token) {
            sessionStorage.clear()
            window.document.location.href = 'http://localhost/semtinel/public/login'
        }
        // Load init data
        this.getItemsTable()
    },
};
</script>

<template>
    <div class="container-fluid px-0">
        <!-- Permissions card -->
        <div class="card card-default">
            <!-- card-header -->
            <div class="card-header">
                <h3 class="card-title">Permisos</h3>
                <div class="card-tools">
                    <button type="button" 
                        class="btn btn-tool pl-0"
                        v-tooltip="'Recargar Listado'"
                        v-on:click.stop="listReload()">
                        <i class="mdi mdi-reload mdi-24px text-green"></i>
                    </button>
                    <button type="button" 
                        class="btn btn-tool pl-0"
                        v-tooltip="'Nuevo Permiso'" 
                        data-toggle="modal" 
                        data-target="#modal-permission-form"
                        v-on:click="create()">
                        <i class="mdi mdi-plus-circle mdi-24px text-green"></i>
                    </button>
                </div>
            </div>
            <!-- /.card-header -->
            <!-- card-body -->
            <div class="card-body">
                <div class="row mt-3" :class="permissions_loading ? '' : 'hidden'">
                    <div class="col-12 text-center py-5 loading-table">
                        <h6><span class="mdi mdi-loading mdi-spin mdi-36px">&nbsp;Cargando permisos...</span></h6>
                    </div>
                </div>
                <div class="row mt-3" :class="(permissions_empty) ? '' : 'hidden'">
                    <div class="col-12 text-center empty-table">
                        <h6>Ning&uacute;n Rol encontrado</h6>
                    </div>
                </div>
                <div class="row" :class="(!permissions_loading && !permissions_empty) ? '' : 'hidden'">
                    <div class="col-12">
                        <table class="table table-striped">
                            <thead>
                            <tr>
                                <th width="50" class="text-center no-sort">No.</th>
                                <th>Nombre</th>
                                <th width="100" class="text-center no-sort">Modificar</th>
                                <th width="100" class="text-center no-sort">Eliminar</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(item, idx) in permissions" :key="item.id">
                                <td class="text-center">{{ idx + 1 }}</td>
                                <td>{{ item.name }}</td>
                                <td class="text-center">
                                    <a href="javascript:void(0);"
                                        class="btn-semti-tool"
                                        style="padding: 4px 5px;"
                                        data-toggle="modal" 
                                        data-target="#modal-permission-form"
                                        v-tooltip="'Modificar este Permiso'"
                                        v-on:click="edit(item.id, item.name)">
                                        <span class="mdi mdi-pencil mdi-18px text-orange"></span>
                                    </a>
                                </td>
                                <td class="text-center">
                                    <a href="javascript:void(0);"
                                        class="btn-semti-tool"
                                        style="padding: 4px 5px;"
                                        data-toggle="modal" 
                                        data-target="#modal-permission-delete"
                                        v-tooltip="'Eliminar este Permiso'"
                                        v-on:click="deleteDialog(item.id, item.name)">
                                        <span class="mdi mdi-trash-can-outline mdi-18px text-danger"></span>
                                    </a>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <!-- /.card-body -->
        </div>
        <!-- /.card -->
    </div>

    <!-- Modal Form -->
    <div class="modal fade" id="modal-permission-form" aria-hidden="true" role="dialog" data-backdrop="static" data-keyboard="false">
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
                            name="id_permission" 
                            id="id_permission"
                            v-model="form_data.id">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label for="name">Nombre:</label>
                                    <input type="text" 
                                    class="form-control"
                                    id="name"
                                    name="name"
                                    placeholder="Nombre del permiso"
                                    v-model="form_data.name">
                                </div>
                            </div>
                        </div>
                        <div class="row pt-2" v-if="form_error != ''">
                            <div class="col-12 text-center">
                                <h6 class="form_error">{{ form_error }}</h6>
                            </div>
                        </div>

                        <!-- Roles card -->
                        <div class="card card-default">
                            <!-- card-header -->
                            <div class="card-header">
                                <h3 class="card-title">Roles</h3>
                                <div class="card-tools">
                                    <button type="button" class="btn btn-tool" data-card-widget="collapse">
                                        <i class="fas fa-minus"></i>
                                    </button>
                                </div>
                            </div>
                            <!-- /.card-header -->
                            <!-- card-body -->
                            <div class="card-body">
                                <div class="row mt-3" :class="roles_loading ? '' : 'hidden'">
                                    <div class="col-12 text-center py-5 loading-table">
                                        <h6><span class="mdi mdi-loading mdi-spin mdi-36px">&nbsp;Cargando roles...</span></h6>
                                    </div>
                                </div>
                                <div class="row" :class="(!roles_loading && permission_roles.length > 0) ? '' : 'hidden'">
                                    <div class="col-12">
                                        <table class="table table-striped">
                                            <thead>
                                            <tr>
                                                <th width="50" class="text-center no-sort">No.</th>
                                                <th>Nombre</th>
                                                <th width="130" class="text-center no-sort">Pertenece a</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="(item, idx) in permission_roles" :key="item.id">
                                                <td class="text-center">{{ idx + 1 }}</td>
                                                <td>{{ item.name }}</td>
                                                <td class="text-center">
                                                    <input 
                                                        type="checkbox" 
                                                        class="form-check-input ml-0" 
                                                        id="role_active" 
                                                        name="role_active" 
                                                        :checked="item.active"
                                                        v-on:change="activeRole(idx)">    
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <!-- /.card-body -->
                        </div>
                        <!-- /.card -->
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

    <!-- Modal Permission delete -->
    <div class="modal fade" id="modal-permission-delete" aria-hidden="true" role="dialog" data-backdrop="static" data-keyboard="false">
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
                <p>El Permiso "<strong>{{ delete_permission }}</strong>" será Eliminado de la plataforma Semtinel.<br>Confirme que desea realizar esta operación.</p>
            </div>
            <div class="row pt-2" v-if="form_error != ''">
                <div class="col-12 text-center">
                    <h6 class="form_error">{{ form_error }}</h6>
                </div>
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
    <!-- /.modal permission delete -->
</template>