<script allowJs="true">
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";
import PageHeader from "../../layouts/HeaderComponent.vue";

import TreeselectEopComponent from '../../common/TreeselectEopComponent.vue';

export default {
    data: function () {
      return {
        //store_poles: JSON.parse(sessionStorage.getItem('semtinel_poles')),
        //store_projects: JSON.parse(sessionStorage.getItem('semtinel_projects')),
        //store_warehouses: (sessionStorage.getItem('semtinel_warehouses') != '') ? JSON.parse(sessionStorage.getItem('semtinel_warehouses')) : null,
        pole: sessionStorage.getItem('stnel_logist_pole'),
        pole_name: '',
        project: sessionStorage.getItem('stnel_logist_project'),
        project_name: '',
        session: JSON.parse(sessionStorage.getItem('semtinel')),
        warehouse_id: '',
        warehouse_name: '',
        warehouse_owner: '',
        warehouse_destin: {
            id: '',
            owner: ''
        },
        eop: null,
        tree_eop: [],
        authorized: '',
        authorizing: '',
        comment: '',
        output_warehouse: '',
        output_warehouse_name: '',
        output_warehouse_owner: '',
        output_type: 'towork',
        output_error: '',
        output_okbtn_text: 'Aceptar',
        output_loading: false
      };
    },
    watch: {
        output_loading: function (val) {
            if (val)
                this.output_okbtn_text = 'Procesando...'
            else
                this.output_okbtn_text = 'Aceptar'
        }
    },
    async created() {
        let cmp = this
        cmp.session.poles.map(function(value, key) {
            if (value.id == cmp.pole)
                cmp.pole_name = value.name
        });
        cmp.session.projects.map(function(value, key) {
            if (value.id == cmp.project)
                cmp.project_name = value.name
        });
        let headers = {
            'User-Agent': 'testing/1.0',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + cmp.session.access_token
        }
        await fetch("http://localhost/semtinel/public/api/eop/" + cmp.project, {
                method: 'GET',
                headers: headers
            })
            .then((response) => response.json())
            .then((data) => {
                cmp.tree_eop = data
            });
    },
    components: {
        'treeselect': TreeselectEopComponent,
        'page-header': PageHeader
    },
    methods: {
        goToInventory: function () {
            let cmp = this
            // Hide modal
            cmp.$refs.ConfirmClose.click()
            cmp.$root.goToInventory()
        },
        changeWarehouse: function (warehouse_id, warehouse_name, warehouse_owner) {
            let cmp = this
            cmp.warehouse_id = warehouse_id
            cmp.warehouse_name = warehouse_name
            cmp.warehouse_owner = warehouse_owner
        },
        changeWarehouseDestin: function (warehouse_id, warehouse_owner) {
            let cmp = this
            cmp.warehouse_destin.id = warehouse_id
            cmp.warehouse_destin.owner = warehouse_owner
        },
        outputConfirm: function () {
            let cmp = this
            cmp.output_error = ''
            if (cmp.$root.cart_items.length == 0) {
                cmp.output_error = 'No se ha agregado ningún producto al carrito. Para agregar productos al carrito diríjase al Inventario para seleccionar los que desee.'
                return
            }
        },
        processOutput: function () {
            let cmp = this,
                cart_items = cmp.$root.cart_items
            if (cmp.output_error != '') {
                // Hide modal
                cmp.$refs.ConfirmClose.click();
                return
            }
            cmp.output_loading = true
            let headers = {
                'User-Agent': 'testing/1.0',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + cmp.session.access_token
            }
            axios.post('http://localhost/semtinel/public/api/logistics/output', {
                    'pole' : cmp.pole,
                    'project': cmp.project,
                    'warehouse': cmp.output_warehouse,
                    'warehouse_owner': cmp.output_warehouse_owner,
                    'cart_items': cart_items,
                    'type': cmp.output_type,
                    'destin': (cmp.output_type == 'towork') ? cmp.eop : cmp.warehouse_destin,
                    'authorized': cmp.authorized,
                    'authorizing': cmp.authorizing,
                    'destin_warehouse': cmp.warehouse_destin.id,
                    'destin_warehouse_owner': cmp.warehouse_destin.owner,
                    'comment': cmp.comment,
                    'user': cmp.session.id
                }, {
                    headers: headers
                }).then(function (response) {
                    if (response.data.success) {
                        // Hide modal
                        cmp.$refs.ConfirmClose.click()
                        cmp.output_loading = false
                        cmp.$root.cart_items = []
                        cmp.$root.cart_quantity = 0
                        cmp.cart_warehouse = ''                  
                        cmp.$router.push('/semtinel/public/logistics/outputs')
                    }
                    else {
                        // Hide modal
                        cmp.$refs.ConfirmClose.click();
                        cmp.output_loading = false
                        //console.log(response.data.error)
                        toastr.error('Error al intentar realizar la operación.')
                    }
                }).catch(function (error) {
                    // Hide modal
                    cmp.$refs.ConfirmClose.click();
                    cmp.output_loading = false
                    //console.log('ERROR')
                    toastr.error('Error al intentar realizar la operación.')
                    return;
                })
        }
    },
    mounted() {
        let cmp = this
        // Verify login active
        if (!JSON.parse(sessionStorage.getItem('semtinel')).access_token) {
            sessionStorage.clear()
            window.document.location.href = 'http://localhost/semtinel/public/login'
        }
        // Asign warehouse
        let object_warehouses = cmp.session.warehouses
        for (let key in object_warehouses) {
            if (key == cmp.$root.cart_warehouse) {
                cmp.output_warehouse = cmp.$root.cart_warehouse
                cmp.output_warehouse_name = object_warehouses[key].name
                cmp.output_warehouse_owner = object_warehouses[key].owner
                cmp.warehouse_id = cmp.$root.cart_warehouse
                cmp.warehouse_name = object_warehouses[key].name
                cmp.warehouse_owner = object_warehouses[key].owner
                // Asign destin warehouse default
                cmp.changeWarehouseDestin(key, object_warehouses[key].owner)
            }
        }     
    }
}
</script>

<template>
    <page-header 
        :pagetitle="'Nueva Salida de mercancía de pañol'">
    </page-header>
    <div class="container-fluid px-0">
        <!-- Data Search card -->
        <div class="card card-default">
            <!-- card-header -->
            <div class="card-header">
                <h3 class="card-title">Origen de la Mercancía</h3>
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
                    <div class="col-md-3 pl-md-3">
                        <div class="form-group">
                            <label>Polo</label>
                            <input 
                                type="text"
                                name="output_pole"
                                id="output_pole" 
                                class="form-control"
                                :disabled="true"
                                v-model="pole_name" />
                        </div>
                    </div>
                    <div class="col-md-3 pl-1">
                        <div class="form-group">
                            <label>Proyecto</label>
                            <input 
                                type="text"
                                name="output_project"
                                id="output_project" 
                                class="form-control"
                                :disabled="true"
                                v-model="project_name" />
                        </div>
                    </div>
                    <div class="col-md-3 pl-1">
                        <div class="form-group">
                            <label>Pañol</label>
                            <input 
                                type="text"
                                class="form-control"
                                :disabled="true"
                                v-model="output_warehouse_name" />
                            <!--<select 
                                name="origin" 
                                size="1" 
                                class="form-control">
                                <template v-for="(option, index) in store_warehouses" :key="index">
                                    <option
                                        :value="option['id']"
                                        v-on:click.stop="changeWarehouse(option['id'], option['name'], option['owner'])">
                                        {{ option['name'] }}
                                    </option>
                                </template>
                            </select>-->
                        </div>
                    </div>
                    <div class="col-md-3 pl-1">
                        <div class="form-group">
                            <label>Responsable de Pañol</label>
                            <input 
                                type="text" 
                                class="form-control"
                                :disabled="true"
                                v-model="output_warehouse_owner">
                        </div>
                    </div>
                </div>
            </div>
            <!-- /.card-body -->
        </div>
        <!-- /.card origin -->

        <!-- Products Cart card -->
        <div class="card">
            <!-- card-header -->
            <div class="card-header">
                <h3 class="card-title float-left"><span class="mdi mdi-cart"></span> Carrito de productos</h3>
                <div class="card-tools">
                    <button type="button" class="btn btn-tool" data-card-widget="collapse">
                        <i class="fas fa-minus"></i>
                    </button>
                </div>
            </div>
            <!-- /.card-header -->
            <!-- card-body -->
            <div class="card-body pt-1 pb-2">
                <!-- Products table -->
                <div class="row">
                    <div class="col-md-12 table-responsive">
                        <div class="col-12 py-5 text-center empty-table" v-show="$root.cart_quantity == 0">
                          <h5 class="text-navy">
                            Ning&uacute;n producto ha sido agregado al carrito.
                          </h5>
                          <h6>
                            Para agregar productos al carrito diríjase al Inventario para seleccionar los que desee.
                          </h6>
                          <br>
                          <a 
                            href="javascript:void(0);" 
                            class="btn btn-secondary"
                            v-on:click.stop="$root.goToInventory()">Ir al Inventario de Productos</a>
                        </div>
                        <table class="table table-striped" v-show="$root.cart_quantity > 0">
                          <thead>
                          <tr>
                              <th>Descripci&oacute;n</th>
                              <th width="100" class="text-center">UM</th>
                              <th width="90" class="text-center">Ctdad</th>
                              <th width="100" class="text-right">Precio</th>
                              <th width="100" class="text-right">Total</th>
                              <th width="70"></th>
                          </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(item, idx) in $root.cart_items" :key="item.id">
                              <td>{{ item.description }}</td>
                              <td class="text-center">{{ item.um }}</td>
                              <td class="text-center">{{ item.quantity }}</td>
                              <td class="text-right">{{ item.price_unit }}</td>
                              <td class="text-right">{{ item.price_total }}</td>
                              <td class="text-right">
                                  <a href="javascript:void(0);"
                                      class="btn-semti-tool"
                                      style="padding: 4px 5px;"
                                      v-tooltip="'Eliminar este producto del carrito'"
                                      v-on:click.stop="$root.removeFromCart(idx)">
                                      <span class="mdi mdi-trash-can-outline mdi-18px text-danger"></span>
                                  </a>
                              </td>
                            </tr>
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colspan="4"><strong>TOTAL</strong></td>
                              <td class="text-right"><strong>${{ parseFloat($root.cart_totals.price_total).toFixed(2) }}</strong></td>
                              <td></td>
                            </tr>
                          </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <!-- /.card products cart -->

        <!-- Destin card -->
        <div class="card card-default">
            <!-- card-header -->
            <div class="card-header">
                <h3 class="card-title">Destino de la Mercancía</h3>
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
                    <div class="form-group pt-2">
                        <label class="float-left mb-0 mt-1">Indique el <strong>Tipo de Salida</strong>: </label>
                        <div class="form-check float-left ml-4">
                            <input 
                                class="form-check-input" 
                                type="radio" 
                                name="status" 
                                v-model="output_type"
                                :value="'towork'" 
                                :checked="true">
                            <label class="form-check-label">Despacho a Obra</label>
                        </div>
                        <div class="form-check float-left ml-4">
                            <input 
                                class="form-check-input" 
                                type="radio" 
                                name="status"
                                v-model="output_type"
                                :value="'transfer'">
                            <label class="form-check-label">Transferencia de Pa&ntilde;ol</label>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4 pl-md-3" v-if="output_type == 'towork'">
                        <div class="form-group">
                            <label>Objeto de Obra</label>
                            <treeselect
                                :tree="tree_eop"
                                v-model="eop"></treeselect>
                        </div>
                    </div>
                    <div class="col-md-4 pl-md-3" v-if="output_type == 'transfer'">
                        <div class="form-group">
                            <label>Pañol</label>
                            <select 
                                name="origin" 
                                size="1" 
                                class="form-control">
                                <template v-for="(option, index) in store_warehouses" :key="index">
                                    <option
                                        :value="option['id']"
                                        v-on:click.stop="changeWarehouseDestin(option['id'], option['owner'])">
                                        {{ option['name'] }}
                                    </option>
                                </template>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-4 pl-1" v-if="output_type == 'transfer'">
                        <div class="form-group">
                            <label>Responsable de Pañol</label>
                            <input 
                                type="text" 
                                class="form-control"
                                :disabled="true"
                                v-model="warehouse_destin.owner">
                        </div>
                    </div>
                    <div class="col-md-4 pl-1" v-if="output_type == 'towork'">
                        <div class="form-group">
                            <label>Autorizado a recibir mercancía</label>
                            <input 
                                type="text" 
                                name="authorized" 
                                class="form-control"
                                placeholder="Nombre y Apellidos"
                                v-model="authorized">
                        </div>
                    </div>
                    <div class="col-md-4 pl-1">
                        <div class="form-group">
                            <label>Especialista que Autoriza</label>
                            <input 
                                type="text" 
                                name="authorizing" 
                                class="form-control"
                                placeholder="Nombre y Apellidos"
                                v-model="authorizing">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <div class="form-group">
                            <label>Comentario</label>
                            <textarea 
                                name="comment" 
                                class="form-control"
                                v-model="comment">
                            </textarea>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /.card-body -->
            <!-- card-footer -->
            <div class="card-footer" style="background-color: #DEF4DB; border-top: 0;">
                <router-link 
                    to="/semtinel/public/logistics" 
                    class="btn btn-default">
                    Cancelar
                </router-link>
                <button 
                    class="btn btn-primary float-end ripple"
                        data-toggle="modal" 
                        data-target="#modal-output-confirm"
                        v-on:click="outputConfirm()">
                    <i class="mdi mdi-check-all"></i>&nbsp;
                    Registrar Salida
                </button>
            </div>
        </div>
        <!-- /. destin card -->
    </div>

    <!-- Modal Output confirm -->
    <div class="modal fade" id="modal-output-confirm" aria-hidden="true" role="dialog" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
        <div class="modal-header">
            <h4 class="modal-title">Nueva Salida de mercancia desde pañol</h4>
            <button type="button" ref="ConfirmClose" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body px-4 pt-2 pb-4">
            <div v-if="output_error == ''">
                <div class="float-start" style="width: 70px"><i class="mdi mdi-chat-question mdi-48px"></i></div>
                <div class="float-start pt-3" style="width: 85%">
                    <p>
                        Se registrará una Nueva Salida de productos del pañol.<br>¿Confirma que desea realizar esta operación?
                    </p>
                </div>
            </div>
            <div class="row pt-2" v-if="output_error != ''">
                <div class="float-start text-danger" style="width: 70px"><i class="mdi mdi-alert-circle mdi-48px"></i></div>
                <div class="float-start form_error pt-3" style="width: 85%">{{ output_error }}</div>
            </div>
        </div>
        <div class="modal-footer justify-content-between">
            <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
            <button 
                v-if="output_error != ''"
                class="btn btn-secondary"
                v-on:click.stop="goToInventory()">Ir al Inventario de Productos</button>
            <button type="button" 
                v-if="output_error == ''"
                class="btn ripple btn-primary"
                :disabled="output_loading"
                v-on:click.stop="processOutput()">
                <i class="mdi mdi-check-all" v-if="!output_loading"></i>&nbsp;{{ output_okbtn_text }}
            </button>
        </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
    </div>
    <!-- /.modal output confirm -->
</template>