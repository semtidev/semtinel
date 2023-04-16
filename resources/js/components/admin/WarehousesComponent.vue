<script allowJs="true">
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/css/bootstrap.min.css";

export default {
    data: function () {
        return {
            poles: [],
            store_projects: [],
            store_warehouses: [],
            projects: [],
            warehouses: {
                pole: '',
                project: '',
                items: []
            },
            poles_loading: true,
            projects_loading: true,
            warehouses_loading: true,
            warehouses_empty: false,
            loading: true,
            form_title: 'Nuevo Pañol',
            form_data: {
                id: '',
                name: '',
                owner: '',
                active: 1
            },
            form_action: '',
            form_error: '',
            form_okbtn_text: 'Aceptar',
            form_color: 'green',
            form_loading: false,
            delete_text: 'Eliminar',
            delete_id: '',
            delete_warehouse: '',
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
        changePole: function (pole_id, pole_abbr) {
            let cmp = this,
                projects = [],
                warehouses = []
            // Set pole
            cmp.warehouses.pole = pole_abbr
            // Set projects and select first
            cmp.projects_loading = true;
            cmp.store_projects.map(function(value, key) {
                if (value.id_pole == pole_id)
                    projects.push(value)
            })
            cmp.projects = projects
            cmp.projects_loading = false;
            if (cmp.projects.length > 0) {
                cmp.warehouses.project = cmp.projects[0].id
                cmp.warehouses_empty = false
            }
            else {
                cmp.warehouses.project = ''
                cmp.warehouses_empty = true
            }
            // Set warehouses
            cmp.store_warehouses.map(function(value, key) {
                if (value.id_project == cmp.warehouses.project)
                    warehouses.push(value)
            })
            cmp.warehouses.items = warehouses
            if (cmp.warehouses.items.length == 0) {
                this.warehouses_empty = true
            }
            cmp.warehouses_loading = false
        },
        changeProject: function (project_abbr) {
            let cmp = this
            cmp.warehouses.project = project_abbr
        },
        listReload: function () {
            this.getItemsTable()
        },
        async getItemsTable () {
            let cmp = this, warehouses = []
            cmp.warehouses_loading = true
            let headers = {
                'User-Agent': 'testing/1.0',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + cmp.session.access_token
            }
            await fetch("http://localhost/semtinel/public/api/logistics/warehouses", {
                        method: 'GET',
                        headers: headers
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        cmp.store_warehouses = data
                        // Set warehouses
                        cmp.store_warehouses.map(function(value, key) {
                            if (value.id_project == cmp.warehouses.project)
                                warehouses.push(value)
                        })
                        cmp.warehouses.items = warehouses
                        if (cmp.warehouses.items.length == 0) {
                            this.warehouses_empty = true
                        }
                        cmp.warehouses_loading = false                            
                    })
                    .catch(error => {
                        this.errorMessage = error;
                        toastr.error("Error: " + error);
                    });
        },
        isValidForm: function () {
            if (this.form_data.name == null || this.form_data.name == '') {
                this.form_error = 'Debe escribir un Nombre para el pañol.'
                return false
            }
            if (this.form_data.owner == null || this.form_data.owner == '') {
                this.form_error = 'Debe escribir un Responsable del pañol.'
                return false
            }
            return true
        },
        create: function () {
            this.form_action       = 'create'
            this.form_error        = ''
            this.form_title        = 'Nuevo Pañol'
            this.form_data.id      = ''
            this.form_data.name    = ''
            this.form_data.owner   = ''
            this.form_data.active  = 1
        },
        edit: function (id, name, owner, active) {
            this.form_action      = 'edit'
            this.form_error       = ''
            this.form_title       = 'Editar Pañol'
            this.form_data.id     = id
            this.form_data.name   = name
            this.form_data.owner  = owner
            this.form_data.active = active
        },
        activeWarehouse: function () {
            if (this.form_data.active == 1)
                this.form_data.active = 0
            else
                this.form_data.active = 1
        },
        deleteDialog: function (id, warehouse) {
            this.delete_id        = id 
            this.delete_warehouse = warehouse
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
            await axios.post('http://localhost/semtinel/public/api/logistics/warehouse',{
                    'id' : cmp.form_data.id,
                    'project': cmp.warehouses.project,
                    'name': cmp.form_data.name,
                    'owner': cmp.form_data.owner,
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
                            toastr.success('El Pañol fue Agregado con éxito.')
                        }
                        else if (cmp.form_action == 'edit') {
                            toastr.success('El Pañol fue Actualizado con éxito.')
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
            let cmp = this;
            cmp.delete_error = ''
            cmp.delete_loading = true
            cmp.delete_text = 'Procesando...'
            let headers = {
                'User-Agent': 'testing/1.0',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + cmp.session.access_token
            }
            await axios.delete('http://localhost/semtinel/public/api/logistics/warehouse/' + cmp.delete_id, {
                    headers: headers
                }, {}).then(function (response) {
                    if (response.data.success) {
                        cmp.delete_error = ''
                        cmp.delete_loading = false
                        cmp.delete_text = 'Eliminar'
                        // Hide modal
                        cmp.$refs.delClose.click();
                        // Notification
                        toastr.success('El Pañol fue Eliminado con éxito.')
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
            window.document.location.href = 'http://localhost/semtinel/login'
        }
        let headers = {
            'User-Agent': 'testing/1.0',
            'Accept': 'application/json',
            'Authorization': 'Bearer 2|hRRNHI6VGAYQnUefCadsTzH6YrYYwodOVx8oMUTr'
        }
        // Load warehouse
        fetch("http://localhost/semtinel/public/api/logistics/warehouses", {
                method: 'GET',
                headers: headers
            })
            .then((response) => response.json())
            .then((data) => {
                this.store_warehouses = data;
                // Load store projects
                fetch("http://localhost/semtinel/public/api/projects", {
                        method: 'GET',
                        headers: headers
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        this.store_projects = data;
                        // load poles
                        fetch("http://localhost/semtinel/public/api/poles", {
                                method: 'GET',
                                headers: headers
                            })
                            .then((response) => response.json())
                            .then((data) => {
                                this.poles = data;
                                this.changePole(data[0].id, data[0].abbr)
                                this.poles_loading = false;
                            })
                            .catch(error => {
                                this.errorMessage = error;
                                toastr.error("Error: " + error);
                            });
                    })
                    .catch(error => {
                        this.errorMessage = error;
                        toastr.error("Error: " + error);
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
        <!-- Project card -->
        <div class="card card-default">
            <!-- card-header -->
            <div class="card-header">
                <h3 class="card-title">Polo & Proyecto</h3>
                <div class="card-tools">
                    <button type="button" class="btn btn-tool" data-card-widget="collapse">
                        <i class="fas fa-minus"></i>
                    </button>
                </div>
            </div>
            <!-- /.card-header -->
            <!-- card-body -->
            <div class="card-body">
                <div class="row">
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>Polo</label>
                            <select 
                                name="pole" 
                                size="1" 
                                class="form-control"
                                :disabled="poles_loading">
                                <option v-if="poles_loading">Cargando polos...</option>
                                <option v-for="(option, index) in poles" 
                                    :key="index"
                                    :value="option.abbr"
                                    :selected="warehouses.pole === option.abbr"
                                    v-on:click.stop="changePole(option.id, option.abbr)">
                                    {{ option.name }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>Proyecto</label>
                            <select 
                                name="project" 
                                size="1" 
                                class="form-control"
                                :disabled="projects_loading">
                                <option v-if="projects_loading">Cargando proyectos...</option>
                                <option v-for="(option, index) in projects" 
                                    :key="index"
                                    :value="option.abbr"
                                    :selected="warehouses.project === option.abbr"
                                    v-on:click.stop="changeProject(option.abbr)">
                                    {{ option.name }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /.card-body -->
        </div>
        <!-- /.card -->

        <!-- Warehouse card -->
        <div class="card card-default">
            <!-- card-header -->
            <div class="card-header">
                <h3 class="card-title">Almacenes</h3>
                <div class="card-tools">
                    <button type="button" 
                        class="btn btn-tool pl-0"
                        v-tooltip="'Recargar Listado'"
                        v-on:click.stop="listReload()">
                        <i class="mdi mdi-reload mdi-24px text-green"></i>
                    </button>
                    <button type="button" 
                        class="btn btn-tool pl-0"
                        v-tooltip="'Nuevo Pañol'"
                        data-toggle="modal" 
                        data-target="#modal-warehouse-form"
                        v-on:click="create()">
                        <i class="mdi mdi-plus-circle mdi-24px text-green"></i>
                    </button>
                </div>
            </div>
            <!-- /.card-header -->
            <!-- card-body -->
            <div class="card-body">
                <div class="row mt-3" :class="warehouses_loading ? '' : 'hidden'">
                    <div class="col-12 text-center py-5 loading-table">
                        <h6><span class="mdi mdi-loading mdi-spin mdi-36px">&nbsp;Cargando pañoles...</span></h6>
                    </div>
                </div>
                <div class="row mt-3" :class="(warehouses_empty) ? '' : 'hidden'">
                    <div class="col-12 text-center empty-table">
                        <h6>Ning&uacute;n Pañol encontrado</h6>
                    </div>
                </div>
                <div class="row" :class="(!warehouses_loading && !warehouses_empty) ? '' : 'hidden'">
                    <div class="col-12">
                        <table id="datatable" class="table table-striped">
                            <thead>
                            <tr>
                                <th width="50" class="text-center no-sort">No.</th>
                                <th>Nombre</th>
                                <th>Responsable</th>
                                <th class="text-center no-sort">Activo</th>
                                <th width="100" class="text-center no-sort">Modificar</th>
                                <th width="100" class="text-center no-sort">Eliminar</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(item, idx) in warehouses.items" :key="item.id">
                                <td class="text-center">{{ idx + 1 }}</td>
                                <td>{{ item.name }}</td>
                                <td>{{ item.owner }}</td>
                                <td class="text-center">
                                    <span 
                                        class="mdi mdi-18px" 
                                        :class="(item.active) ? 'mdi-checkbox-marked-circle' : 'mdi-checkbox-blank-circle-outline'">
                                    </span>    
                                </td>
                                <td class="text-center">
                                    <a href="javascript:void(0);"
                                        class="btn-semti-tool"
                                        style="padding: 4px 5px;"
                                        data-toggle="modal" 
                                        data-target="#modal-warehouse-form"
                                        v-tooltip="'Modificar este Pañol'"
                                        v-on:click="edit(item.id, item.name, item.owner, item.active)">
                                        <span class="mdi mdi-pencil mdi-18px text-orange"></span>
                                    </a>
                                </td>
                                <td class="text-center">
                                    <a href="javascript:void(0);"
                                        class="btn-semti-tool"
                                        style="padding: 4px 5px;"
                                        data-toggle="modal" 
                                        data-target="#modal-warehouse-delete"
                                        v-tooltip="'Eliminar este Pañol'"
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
    <div class="modal fade" id="modal-warehouse-form" aria-hidden="true" role="dialog" data-backdrop="static" data-keyboard="false">
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
                                <div class="form-group">
                                    <label for="name">Responsable:</label>
                                    <input type="text" 
                                    class="form-control"
                                    id="owner"
                                    name="owner"
                                    placeholder="Responsable del pañol"
                                    v-model="form_data.owner">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-check ml-1">
                                    <input 
                                        type="checkbox" 
                                        class="form-check-input" 
                                        id="wh_active" 
                                        name="wh_active" 
                                        :checked="form_data.active"
                                        v-on:change="activeWarehouse()">
                                    <label class="form-check-label" for="wh_active">Activo</label>
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

    <!-- Modal Warehouse delete -->
    <div class="modal fade" id="modal-warehouse-delete" aria-hidden="true" role="dialog" data-backdrop="static" data-keyboard="false">
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
            <p>El Pa&ntilde;ol "<strong>{{ delete_warehouse }}</strong>" será Eliminado de la plataforma Semtinel.<br>Confirme que desea realizar esta operación.</p>
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
    <!-- /.modal warehouse delete -->
</template>