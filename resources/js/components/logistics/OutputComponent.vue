<script allowJs="true">
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";

import TreeselectEopComponent from '../common/TreeselectEopComponent.vue';

export default {
    data: function () {
      return {
        store_poles: JSON.parse(localStorage.getItem('semtinel_poles')),
        store_projects: JSON.parse(localStorage.getItem('semtinel_projects')),
        store_warehouses: JSON.parse(localStorage.getItem('semtinel_warehouses')),
        pole: localStorage.getItem('stnel_logist_pole'),
        project: localStorage.getItem('stnel_logist_project'),
        session: JSON.parse(sessionStorage.getItem('semtinel')),
        warehouse_owner: '',
        eop: null,
        tree_eop: []
      };
    },
    watch: {
        
    },
    async created() {
        let cmp = this
        let headers = {
            'User-Agent': 'testing/1.0',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + cmp.session.access_token
        }
        await fetch("http://localhost/semtinel/api/eop/" + cmp.project, {
                method: 'GET',
                headers: headers
            })
            .then((response) => response.json())
            .then((data) => {
                cmp.tree_eop = data
            });
    },
    components: {
        'treeselect': TreeselectEopComponent
    },
    methods: {
        
    },
    mounted() {
        // Verify login active
        if (!JSON.parse(sessionStorage.getItem('semtinel')).access_token) {
            sessionStorage.clear()
            window.document.location.href = 'http://localhost/semtinel/login'
        }
    }
}
</script>

<template>
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
                            <select 
                                name="entry_pole"
                                id="entry_pole" 
                                size="1" 
                                class="form-control">
                                <template v-for="(option, index) in store_poles" :key="index">
                                    <option 
                                        v-if="option['name'] != 'Todos'"
                                        :value="option['abbr']"
                                        v-on:click.stop="">
                                        {{ option['name'] }}
                                    </option>
                                </template>                                
                            </select>
                        </div>
                    </div>
                    <div class="col-md-3 pl-1">
                        <div class="form-group">
                            <label>Proyecto</label>
                            <select 
                                name="project" 
                                size="1" 
                                class="form-control">
                                <template v-for="(option, index) in store_projects" :key="index">
                                    <option
                                        :value="option['id']"
                                        v-on:click.stop="">
                                        {{ option['name'] }}
                                    </option>
                                </template>                                
                            </select>
                        </div>
                    </div>
                    <div class="col-md-3 pl-1">
                        <div class="form-group">
                            <label>Pa&ntilde;ol</label>
                            <select 
                                name="origin" 
                                size="1" 
                                class="form-control">
                                <template v-for="(option, index) in store_warehouses" :key="index">
                                    <option
                                        :value="option['id']"
                                        v-on:click.stop="">
                                        {{ option['name'] }}
                                    </option>
                                </template>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-3 pl-1">
                        <div class="form-group">
                            <label>Responsable de Pa&ntilde;ol</label>
                            <input 
                                type="text" 
                                name="resp_stock" 
                                class="form-control">
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
                              <td><strong>TOTAL</strong></td>
                              <td></td>
                              <td class="text-center"><strong>{{ $root.cart_totals.quantity }}</strong></td>
                              <td></td>
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
                    <div class="col-md-4 pl-md-3">
                        <div class="form-group">
                            <label>Objeto de Obra</label>
                            <treeselect
                                :tree="tree_eop"
                                v-model="eop"></treeselect>
                        </div>
                    </div>
                    <div class="col-md-4 pl-1">
                        <div class="form-group">
                            <label>Autorizado</label>
                            <input 
                                type="text" 
                                name="resp_stock" 
                                class="form-control">
                        </div>
                    </div>
                    <div class="col-md-4 pl-1">
                        <div class="form-group">
                            <label>Autoriza</label>
                            <input 
                                type="text" 
                                name="resp_stock" 
                                class="form-control">
                        </div>
                    </div>
                </div>
            </div>
            <!-- /.card-body -->
            <!-- card-footer -->
            <div class="card-footer" style="background-color: #DEF4DB; border-top: 0;">
                <router-link 
                    to="/semtinel/logistics" 
                    class="btn btn-default">
                    Cancelar
                </router-link>
                <button 
                    class="btn btn-primary float-end ripple"
                        data-toggle="modal" 
                        data-target="#modal-entry-confirm"
                        v-on:click="entryConfirm()">
                    <i class="mdi mdi-check-all"></i>&nbsp;
                    Registrar Salida
                </button>
            </div>
        </div>
        <!-- /. destin card -->
    </div>
</template>