<script allowJs="true">
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import apiClient from "../../services/api"

export default {
    data: function () {
        return {            
            users: [],
            roles:[],
            systems:[],
            projects:[],
            poles:[],            
            role_permissions: [],
            roles_loading: true,
            projects_loading: false,
            poles_loading: true,
            users_loading: true,
            users_empty: false,
            loading: true,
            form_title: 'Nuevo Usuario',
            systems_loading: true,            
            id: '',
            name: '',
            last_name: '',
            username: '',
            email:'',
            password:'',
            repassword:'',
            selected_roles:[],
            selected_systems:[],
            selected_projects:[],
            selected_pole:'',            
            form_action: '',
            form_error: '',
            form_okbtn_text: 'Aceptar',
            form_color: 'green',
            form_loading: false,
            delete_text: 'Eliminar',
            delete_id: '',
            delete_user: '',
            delete_error: '',
            delete_loading: false,
            session: JSON.parse(sessionStorage.getItem('semtinel')),
            
            
        };
    },
    computed: {
    classValid() {
        let cmp = this 
        return {
            'is-invalid': cmp.password !== cmp.repassword
        }
    }
    },
    watch: {
        selected_pole: function (newPole){
            this.projects_loading = true;
            if (newPole === "") {
                this.projects = [];
                this.projects_loading = false;
            } else {
            apiClient.get("/projectsbypole/"+newPole, {headers: this.headers})
            .then((response) => {   
                this.projects = response.data;
                this.projects_loading = false;                
            })
            .catch((error) => {
                this.errorMessage = error;
                toastr.error("Error: " + error);
            });
            }
        },
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
        getItemsTable () {
            let cmp = this;
            cmp.users_loading = true;
            apiClient.get("/admin/users", {headers: this.headers})
            .then((response) => {                
                cmp.users = response.data;
                cmp.users_loading = false;
                cmp.users_empty = (response.data.length > 0) ? false : true
            })
            .catch((error) => {
                this.errorMessage = error;
                toastr.error("Error: " + error);
            });
        },
        isValidForm: function () {
            if (this.name == null || this.name == '') {
                this.form_error = 'Debe escribir un Nombre.'
                return false
            }
            return true
        },
        getRoles: function() {
            this.roles_loading = true;
            apiClient.get("/admin/roles", {headers: this.headers})
            .then((response) => {   
                this.roles = response.data;
                this.roles_loading = false;
            })
            .catch((error) => {
                this.errorMessage = error;
                toastr.error("Error: " + error);
            });   
        },
        getAsignedRoles: function(user_id) {
            //primero carga todos los roles
            apiClient.get("/admin/roles", {headers: this.headers})
            .then((response) => {   //luego de que ha cargado los roles carga los del usuario
                this.roles = response.data;
                apiClient.get("/admin/user/roles/"+user_id, {headers: this.headers})// cargar roles del usuario     
                .then((response) => {
                    let arr = response.data.map((item)=>{return item.id});//tomar los ids de los roles 
                    this.selected_roles = [...arr];
                    this.roles_loading = false;
                })
                .catch(error => {
                    this.errorMessage = error;
                    toastr.error("Error: " + error);
                });
            })
            .catch((error) => {
                this.errorMessage = error;
                toastr.error("Error: " + error);
            }); 
            
        },
        
        getSystems: function() {
            apiClient.get("/admin/systems", {headers: this.headers})//It load Just active systems
            .then((response) => {   
                let active_systems = response.data.filter((item)=>{
                    return item.active === 1;                    
                });
                this.systems = active_systems;
                this.systems_loading = false
            })
            .catch((error) => {
                this.errorMessage = error;
                toastr.error("Error: " + error);
            });
        },
        getPoles: function() {
            apiClient.get("/poles", {headers: this.headers})//Just the actived Poles
            .then((response) => {
                let active_poles = response.data.filter((item)=>{
                    return item.active === 1;                    
                });
                this.poles = active_poles;
                this.poles_loading = false;
            })
            .catch((error) => {
                this.errorMessage = error;
                toastr.error("Error: " + error);
            });   
        }, 
        getAsignedSystems: function(user_id) {
            apiClient.get("/admin/systems", {headers: this.headers})//Cargar solo los Systems activos
            .then((response) => {   
                let active_systems = response.data.filter((item)=>{
                    return item.active === 1;                    
                });
                this.systems = active_systems;
                apiClient.get("/admin/user/systems/"+user_id, {headers: this.headers})     
                .then((response) => {
                    let arr = response.data.map((item)=>{return item.id});
                    this.selected_systems = [...arr];
                    this.systems_loading = false;
                })
                .catch(error => {
                    this.errorMessage = error;
                    toastr.error("Error: " + error);
                });
            })
            .catch((error) => {
                this.errorMessage = error;
                toastr.error("Error: " + error);
            });
            
        },
        getAsignedProjects: function(user_id,pole_id) {
            apiClient.get("/poles", {headers: this.headers})//carga todos los Polos activos
            .then((response) => {
                let active_poles = response.data.filter((item)=>{
                    return item.active === 1;                    
                });
                this.poles = active_poles;
                apiClient.get("/admin/user/projects/"+user_id, {headers: this.headers})//carga los proyectos de ese usuario
                .then((response) => {
                    let arr = response.data.map((item)=>{return item.id});//para guardar solo los ids de los proyectos
                    this.selected_projects = [...arr];
                    this.selected_pole = pole_id;
                    this.projects_loading = false;
                })
                .catch(error => {
                    this.errorMessage = error;
                    toastr.error("Error: " + error);
                });
            })
            .catch((error) => {
                this.errorMessage = error;
                toastr.error("Error: " + error);
            });  
            
        },
        create: function () {//Este es llamado cuando se da al boton "crear nuevo suario" 
            let cmp = this
            cmp.form_action       = 'create'
            cmp.form_error        = ''
            cmp.form_title        = 'Nuevo Usuario'
            cmp.id                = ''
            cmp.name              = ''
            cmp.last_name         = ''
            cmp.username          = ''
            cmp.email             = ''
            cmp.password          = ''
            cmp.repassword        = ''
            cmp.selected_pole     = ''
            cmp.selected_projects = []
            cmp.selected_systems  = []
            cmp.selected_roles    = [] 
            this.getRoles()
            this.getSystems()
            this.getPoles()
        },
        edit: function (user) {
            let cmp = this
            cmp.form_action      = 'edit'
            cmp.form_error       = ''
            cmp.form_title       = 'Editar Usuario'
            console.log(user);
            // Cargar la información del usuario
            cmp.id = user.id;
            cmp.name = user.first_name;
            cmp.last_name = user.last_name;
            cmp.username = user.username;
            cmp.email = user.email;
            
            this.getAsignedRoles(user.id);//los roles que tiene asignado
            this.getAsignedSystems(user.id);
            this.getAsignedProjects(user.id,user.pole_id)
            
        },
        deleteDialog: function (id, user) {
            this.delete_id   = id;
            this.delete_user = user;
        },
        store: function () {
            let cmp = this           
            cmp.form_error = ''
            cmp.form_okbtn_text = 'Procesando...'
            apiClient.post("/user/register",{ //insertar usuario
                first_name: cmp.name,
                last_name: cmp.last_name,
                email: cmp.email,
                username: cmp.username,
                password: cmp.password,
                syst_pole_id: cmp.selected_pole,
                roles: cmp.selected_roles,
                systems: cmp.selected_systems,
                projects: cmp.selected_projects
            },         
            {headers: this.headers})
            .then((response) => {   
                cmp.form_okbtn_text = 'Aceptar';
                toastr.success('El Usuario fue creado con éxito.');
                cmp.$refs.Close.click();
                cmp.listReload();

            })
            .catch((error) => {
                this.errorMessage = error;
                toastr.error("Error: " + error);
            }); 
        },
        update: function () {
            let cmp = this           
            cmp.form_error = ''
            cmp.form_okbtn_text = 'Procesando...'
            apiClient.put("/user",{ //insertar usuario
                id: cmp.id,
                first_name: cmp.name,
                last_name: cmp.last_name,
                email: cmp.email,
                username: cmp.username,
                password: cmp.password,
                syst_pole_id: cmp.selected_pole,
                roles: cmp.selected_roles,
                systems: cmp.selected_systems,
                projects: cmp.selected_projects
            },         
            {headers: this.headers})
            .then((response) => {   
                cmp.form_okbtn_text = 'Aceptar';
                toastr.success('El usuario fue actualizado con éxito.');
                cmp.$refs.Close.click();
                cmp.listReload();

            })
            .catch((error) => {
                this.errorMessage = error;
                toastr.error("Error: " + error);
            }); 
        }, 
        submitHandler: function() {  //Salvar la informacion del usuario en la BD
           if(this.form_action === 'create') {
              this.store();
           } else {
              this.update();
           }           
        },      
        destroy: function() {
            let cmp = this
            cmp.delete_error = ''
            cmp.delete_loading = true
            cmp.delete_text = 'Procesando...'            
            apiClient.delete('/user/' + cmp.delete_id, {headers: this.headers}, {})
            .then((response) => {
                    if (response.data.success) {
                        cmp.delete_error = ''
                        cmp.delete_loading = false
                        cmp.delete_text = 'Eliminar'
                        // Hide modal
                        cmp.$refs.delClose.click();
                        // Notification
                        toastr.success('El usuario fue Eliminado con éxito.')
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
        const bearer_token = JSON.parse(sessionStorage.getItem('semtinel')).access_token
        if (!bearer_token) {
            sessionStorage.clear()
            window.document.location.href = 'http://localhost/semtinel/login'
        }
        // Load init data
        // A not reactive variable
        this.headers = {'Authorization': 'Bearer ' + bearer_token}
        this.getItemsTable()
    },
};
</script>

<template>
    <div class="container-fluid px-0">
        <!-- Roles card -->
        <div class="card card-default">
            <!-- card-header -->
            <div class="card-header">
                <h3 class="card-title">Usuarios</h3>
                <div class="card-tools">
                    <button type="button" 
                        class="btn btn-tool pl-0"
                        v-tooltip="'Recargar Listado'"
                        v-on:click.stop="listReload()">
                        <i class="mdi mdi-reload mdi-24px text-green"></i>
                    </button>
                    <button type="button" 
                        class="btn btn-tool pl-0" 
                        v-tooltip="'Nuevo Usuario'" 
                        data-toggle="modal" 
                        data-target="#modal-user-form"
                        v-on:click="create()">
                        <i class="mdi mdi-plus-circle mdi-24px text-green"></i>
                    </button>
                </div>
            </div>
            <!-- /.card-header -->
            <!-- card-body -->
            <div class="card-body">
                <div class="row mt-3" :class="users_loading ? '' : 'hidden'">
                    <div class="col-12 text-center py-5 loading-table">
                        <h6><span class="mdi mdi-loading mdi-spin mdi-36px">&nbsp;Cargando usuarios...</span></h6>
                    </div>
                </div>
                <div class="row mt-3" :class="(users_empty) ? '' : 'hidden'">
                    <div class="col-12 text-center empty-table">
                        <h6>Ning&uacute;n usuario encontrado</h6>
                    </div>
                </div>
                <div class="row" :class="(!users_loading && !users_empty) ? '' : 'hidden'">
                    <div class="col-12">
                        <table class="table table-striped">
                            <thead>
                            <tr>
                                <th width="50" class="text-center no-sort">No.</th>
                                <th>Nombre</th>
                                <th>Apellidos</th>
                                <th>Email</th>
                                <th>Usuario</th>
                                <th width="100" class="text-center no-sort">Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, idx) in users" :key="item.id">
                                    <td class="text-center">{{ idx + 1 }}</td>
                                    <td>{{ item.first_name }}</td>
                                    <td>{{ item.last_name }}</td>
                                    <td>{{ item.email }}</td>
                                    <td>{{ item.username }}</td>
                                    <td class="text-center">
                                        <a href="javascript:void(0);"
                                            class="btn-semti-tool mr-2"
                                            style="padding: 4px 5px;"
                                            data-toggle="modal" 
                                            data-target="#modal-user-form"
                                            v-tooltip="'Modificar este usuario'"
                                            @click="edit(item)"
                                            >
                                            <span class="mdi mdi-pencil mdi-18px text-orange"></span>
                                        </a>
                                        <a href="javascript:void(0);"
                                            class="btn-semti-tool"
                                            style="padding: 4px 5px;"
                                            data-toggle="modal" 
                                            data-target="#modal-role-delete"
                                            v-tooltip="'Eliminar este usuario'"
                                            @click="deleteDialog(item.id, item.username)"
                                            >
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
    <div class="modal fade" id="modal-user-form" aria-hidden="true" role="dialog" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <form @submit.prevent="submitHandler">
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
                        <input type="hidden" 
                            name="id_role" 
                            id="id_role"
                            v-model="id">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="name">Nombre:</label>
                                    <input type="text" 
                                    class="form-control"
                                    id="name"
                                    name="name"
                                    required
                                    placeholder="Nombre del usuario"
                                    v-model="name">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="name">Apellidos:</label>
                                    <input type="text" 
                                    class="form-control"
                                    id="name"
                                    name="name"
                                    required
                                    placeholder="Apellido del usuario"
                                    v-model="last_name">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="name">Usuario:</label>
                                    <input type="text" 
                                    class="form-control"
                                    id="username"
                                    name="username"
                                    autocomplete="off"
                                    required
                                    placeholder="Identificador de usuario"
                                    v-model="username">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="name">Email:</label>
                                    <input
                                    class="form-control"
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="Correo electrónico"
                                    v-model="email">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="password">Contraseña:</label>
                                    <div v-if="form_action==='edit'">Si no desea cambiar Contraseña deje el campo en blanco</div>
                                    <input type="password" 
                                    class="form-control"
                                    id="password"
                                    :required="form_action === 'create' ? true : false"
                                    autocomplete="off"
                                    name="password"
                                    placeholder="Escribe una contraseña"
                                    v-model="password">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="re-password">Repetir Contraseña:</label>
                                    <input type="password" 
                                    class="form-control"
                                    :class="classValid"
                                    id="re-password"
                                    :required="form_action === 'create' ? true : false"
                                    autocomplete="off"
                                    name="re-password"
                                    placeholder="Repetir la contraseña"
                                    v-model="repassword">
                                    <div class="invalid-feedback">
                                        No coincide la contraseña
                                    </div>
                                </div>
                            </div>
                        </div>                        

                        <!-- Roles card -->
                        <div class="card card-default mt-3">
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
                                        <h6><span class="mdi mdi-loading mdi-spin mdi-36px">&nbsp;Cargando Roles...</span></h6>
                                    </div>
                                </div>
                                <div class="row" :class="(!roles_loading > 0) ? '' : 'hidden'">
                                    <div class="col-12">
                                        <table class="table table-striped">
                                            <thead>
                                            <tr>                                                
                                                <th>Nombre</th>
                                                <th width="130" class="text-center no-sort">Pertenece a</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="(item, idx) in roles" :key="item.id">                                                
                                                <td>{{ item.name }}</td>
                                                <td class="text-center">
                                                    <input 
                                                        type="checkbox" 
                                                        class="form-check-input ml-0"
                                                        :id="item.id" 
                                                        :value="item.id"
                                                        v-model="selected_roles">
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

                        <!-- Systems card -->
                        <div class="card card-default">
                            <!-- card-header -->
                            <div class="card-header">
                                <h3 class="card-title">Sistemas</h3>
                                <div class="card-tools">
                                    <button type="button" class="btn btn-tool" data-card-widget="collapse">
                                        <i class="fas fa-minus"></i>
                                    </button>
                                </div>
                            </div>
                            <!-- /.card-header -->
                            <!-- card-body -->
                            <div class="card-body">
                                <div class="row mt-3" :class="systems_loading ? '' : 'hidden'">
                                    <div class="col-12 text-center py-5 loading-table">
                                        <h6><span class="mdi mdi-loading mdi-spin mdi-36px">&nbsp;Cargando Sistemas...</span></h6>
                                    </div>
                                </div>
                                <div class="row" :class="(!systems_loading > 0) ? '' : 'hidden'">
                                    <div class="col-12">
                                        <table class="table table-striped">
                                            <thead>
                                            <tr>                                                
                                                <th>Nombre</th>
                                                <th width="130" class="text-center no-sort">Accede a</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="(item, idx) in systems" :key="item.id">                                                
                                                <td>{{ item.name }}</td>
                                                <td class="text-center">
                                                    <input 
                                                        type="checkbox" 
                                                        class="form-check-input ml-0"
                                                        :id="item.id" 
                                                        :value="item.id"
                                                        v-model="selected_systems">
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
                        <!-- Poles -->
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label for="name">Polos:</label>
                                    <select 
                                    class="form-select" 
                                    aria-label="Selecionar Polo"
                                    name="pole"
                                    v-model="selected_pole">
                                    <option disable value="">Selecciona un Polo</option>
                                    <option v-for="(option, index) in poles" 
                                        :key="index"
                                        :value="option.id">
                                        {{ option.name }}
                                    </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <!-- /.poles -->

                        <!-- Projects card -->
                        <div class="card card-default">
                            <!-- card-header -->
                            <div class="card-header">
                                <h3 class="card-title">Proyectos</h3>
                                <div class="card-tools">
                                    <button type="button" class="btn btn-tool" data-card-widget="collapse">
                                        <i class="fas fa-minus"></i>
                                    </button>
                                </div>
                            </div>
                            <!-- /.card-header -->
                            <!-- card-body -->
                            <div class="card-body">
                                <div class="row mt-3" :class="projects_loading ? '' : 'hidden'">
                                    <div class="col-12 text-center py-5 loading-table">
                                        <h6><span class="mdi mdi-loading mdi-spin mdi-36px">&nbsp;Cargando Proyectos...</span></h6>
                                    </div>
                                </div>
                                <div class="row" :class="(!projects_loading > 0) ? '' : 'hidden'">
                                    <div class="col-12">
                                        <table class="table table-striped">
                                            <thead>
                                            <tr>                                                
                                                <th>Nombre</th>
                                                <th width="130" class="text-center no-sort">Accede a</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="(item, idx) in projects" :key="item.id">                                                
                                                <td>{{ item.name }}</td>
                                                <td class="text-center">
                                                    <input 
                                                        type="checkbox" 
                                                        class="form-check-input ml-0"
                                                        :id="item.id" 
                                                        :value="item.id"
                                                        v-model="selected_projects">
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
                <div class="modal-footer justify-content-between">
                    <button type="button" class="btn btn-default ripple" data-dismiss="modal">Cancelar</button>
                    <button type="submit"
                    class="btn btn-primary ripple"
                    :class="'btn-' + form_color"
                    :disabled="form_loading">
                        <i class="mdi mdi-check-all" v-if="!form_loading"></i>
                        <i class="mdi mdi-loading mdi-spin" v-else></i>
                        &nbsp;{{ form_okbtn_text }}
                    </button>
                </div>
                </form>                
            </div>
        </div>
    </div>
    <!-- /.Modal Form -->

    <!-- Modal Role delete -->
    <div class="modal fade" id="modal-role-delete" aria-hidden="true" role="dialog" data-backdrop="static" data-keyboard="false">
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
                <p>El usuario "<strong>{{ delete_user }}</strong>" será Eliminado de la plataforma Semtinel.<br>Confirme que desea realizar esta operación.</p>
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
    <!-- /.modal role delete -->
</template>