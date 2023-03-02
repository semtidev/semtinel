<script allowJs="true">
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";
import PageHeader from "../layouts/HeaderComponent.vue";
import Timeline from "../common/TimelineComponent.vue";

export default {
    data: function () {
      return {
        pole_name: '',
        project_name: '',
        tabactive: 1,
        store_products: [],
        products: [],
        products_filter: {},
        products_loading: true,
        lastproducts: [],
        lastproducts_empty: false,
        history: {},
        history_loading: true,
        history_empty: false,
        history_product: {},
        history_product_loading: true,
        history_product_empty: false,
        period: 'today',
        filter_apply: false,
        lastproducts_loading: true,
        session: JSON.parse(sessionStorage.getItem('semtinel')),
        poles: JSON.parse(localStorage.getItem('semtinel_poles')),
        projects: JSON.parse(localStorage.getItem('semtinel_projects')),
        pole: localStorage.getItem('stnel_logist_pole'),
        project: localStorage.getItem('stnel_logist_project'),
        warehouses: JSON.parse(localStorage.getItem('semtinel_warehouses')),
        products_categories: JSON.parse(localStorage.getItem('semtinel_products_categories')),
        filter_productcategory: 'all',
        filter_warehouse: 'all',
        filter_oc: '',
        filter_product: '',
        item_details: {
            pole: '',
            project: '',
            oc: '',
            product_code: '',
            description: '',
            um: '',
            quantity: 0,
            warehouse_id: '-',
            warehouse_name: '',
            warehouse_owner: 0,
            stowage_card: ''
        },
        show_details: false,
        datatable_language: {
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
      };
    },
    watch: {
        period: function(val) {
            this.getLastProductsTable(val)
            this.getHistoryTimeline(val)
        }
    },
    components: {
        'page-header': PageHeader,
        'timeline': Timeline
    },
    created() {
        let cmp = this
        cmp.poles.map(function(value, key) {
            if (value.abbr == cmp.pole)
                cmp.pole_name = value.name
        });
        cmp.projects.map(function(value, key) {
            if (value.id == cmp.project)
                cmp.project_name = value.name
        });
    },
    methods: {
        listReload: function () {
            //this.getEntriesTable(true)
        },
        filterApply: function () {
            let cmp = this
            cmp.products_loading = true
            cmp.products = cmp.store_products
            cmp.filter_apply = false
            cmp.products_filter = {}
            // Filter products
            Object.keys(cmp.products).forEach(key => {
                let idx = key, valid = true
                if (cmp.filter_productcategory != 'all' && cmp.products[key].category_name != cmp.filter_productcategory) {
                    valid = false
                }
                if (cmp.filter_warehouse != 'all' && cmp.products[key].warehouse_id != cmp.filter_warehouse) {
                    valid = false
                }
                if (cmp.filter_oc != '' && cmp.filter_oc.length > 0 && cmp.products[key].oc != cmp.filter_oc) {
                    valid = false
                }
                if (cmp.filter_product != '' && cmp.filter_product.length > 0 && cmp.products[key].product_code != cmp.filter_product) {
                    valid = false
                }
                if (valid) {
                    cmp.products_filter[idx] = cmp.products[key]
                }                    
            })
            if (Object.keys(cmp.products).length != Object.keys(cmp.products_filter).length) {
                cmp.products = cmp.products_filter
                cmp.filter_apply = true
            }
            if ($("#datatable-products").DataTable().destroy()) {
                setTimeout(() => {
                    $("#datatable-products").DataTable({
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
                            { "width": "15%" },
                            { "width": "15%" },
                            null,
                            { "width": "10%" },
                            { "width": "10%" },
                            { "width": "10%" },
                            { "width": "10%" }
                        ],
                        language: cmp.datatable_language
                    });
                });
            }
            cmp.products_loading = false
        },
        filterClear: function () {
            let cmp = this
            cmp.products_loading = true
            cmp.filter_productcategory = 'all'
            cmp.filter_warehouse = 'all'
            cmp.filter_oc = ''
            cmp.filter_product = ''
            cmp.products = cmp.store_products
            cmp.filter_apply = false
            if ($("#datatable-products").DataTable().destroy()) {
                setTimeout(() => {
                    $("#datatable-products").DataTable({
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
                            { "width": "15%" },
                            { "width": "15%" },
                            null,
                            { "width": "10%" },
                            { "width": "10%" },
                            { "width": "10%" },
                            { "width": "10%" }
                        ],
                        language: cmp.datatable_language
                    });
                });
            }
            cmp.products_loading = false
        },
        show: function (idx) {
            let cmp = this
            cmp.item_details = {
                pole: cmp.products[idx].pole,
                project: cmp.products[idx].project,
                oc: cmp.products[idx].oc,
                product_code: cmp.products[idx].product_code,
                description: cmp.products[idx].description,
                um: cmp.products[idx].um,
                quantity: cmp.products[idx].quantity,
                warehouse_name: cmp.products[idx].warehouse_name,
                warehouse_owner: cmp.products[idx].warehouse_name,
                stowage_card: cmp.products[idx].stowage_card
            }
            cmp.show_details = true
        },
        productHistory: function (entry, product) {
            let cmp = this, period = cmp.period
            if (cmp.tabactive == 1) {
                period = 'all'
            }
            this.getProductHistoryTimeline(entry, product, period);
        },
        async getLastProductsTable (period = 'today') {
            let cmp = this
            cmp.lastproducts_loading = true
            let headers = {
                'User-Agent': 'testing/1.0',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + cmp.session.access_token
            }
            axios.post('http://localhost/semtinel/public/api/logistics/inventory/lastproducts', {
                    'pole' : cmp.pole,
                    'project': cmp.project,
                    'period': cmp.period
                }, {
                    headers: headers
                }).then(function (response) {
                    if (response.data.success) {
                        cmp.lastproducts = response.data.products
                        cmp.lastproducts_loading = false
                        cmp.lastproducts_empty = (Object.keys(response.data.products).length > 0) ? false : true
                    }
                    else {
                        toastr.error('Error al intentar cargar los datos.')
                    }
                }).catch(function (error) {
                    toastr.error('Error al intentar cargar los datos.')
                    return;
                })
        },
        async getHistoryTimeline (period = 'today') {
            let cmp = this
            cmp.history_loading = true
            let headers = {
                'User-Agent': 'testing/1.0',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + cmp.session.access_token
            }
            axios.post('http://localhost/semtinel/public/api/logistics/inventory/history', {
                    'pole' : cmp.pole,
                    'project': cmp.project,
                    'period': cmp.period
                }, {
                    headers: headers
                }).then(function (response) {
                    if (response.data.success) {
                        cmp.history = response.data.history
                        cmp.history_loading = false
                        cmp.history_empty = (Object.keys(response.data.history).length > 0) ? false : true
                    }
                    else {
                        toastr.error('Error al intentar cargar los datos.')
                    }
                }).catch(function (error) {
                    toastr.error('Error al intentar cargar los datos.')
                    return;
                })
        },
        async getProductHistoryTimeline (entry, product, period) {
            let cmp = this
            cmp.history_product_loading = true
            let headers = {
                'User-Agent': 'testing/1.0',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + cmp.session.access_token
            }
            axios.post('http://localhost/semtinel/public/api/logistics/inventory/history/' + entry + '/' + product, {
                    'pole' : cmp.pole,
                    'project': cmp.project,
                    'period': period
                }, { 
                    headers: headers
                }).then(function (response) {
                    if (response.data.success) {
                        cmp.history_product = response.data.history
                        cmp.history_product_loading = false
                        cmp.history_product_empty = (Object.keys(response.data.history).length > 0) ? false : true
                    }
                    else {
                        toastr.error('Error al intentar cargar los datos.')
                    }
                }).catch(function (error) {
                    toastr.error('Error al intentar cargar los datos.')
                    return;
                })
        }
    },
    mounted() {
        let cmp = this
        // Verify login active
        if (!JSON.parse(sessionStorage.getItem('semtinel')).access_token) {
            sessionStorage.clear()
            window.document.location.href = 'http://localhost/semtinel/login'
        }
        let headers = {
                'User-Agent': 'testing/1.0',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + cmp.session.access_token
            }
        axios.post('http://localhost/semtinel/public/api/logistics/inventory/products', {
                'pole' : cmp.pole,
                'project': cmp.project
            }, {
                headers: headers
            }).then(function (response) {
                if (response.data.success) {
                    cmp.store_products = response.data.products
                    cmp.products = response.data.products
                    cmp.products_loading = false
                    setTimeout(() => {
                        $("#datatable-products").DataTable({
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
                            "columns": [
                                { "width": "15%" },
                                { "width": "15%" },
                                null,
                                { "width": "10%" },
                                { "width": "10%" },
                                { "width": "10%" },
                                { "width": "10%" }
                            ],
                            language: cmp.datatable_language
                        });
                    });
                }
                else {
                    toastr.error('Error al intentar cargar los datos.')
                }
            }).catch(function (error) {
                toastr.error('Error al intentar cargar los datos.')
                return;
            })

        axios.post('http://localhost/semtinel/public/api/logistics/inventory/lastproducts', {
                'pole' : cmp.pole,
                'project': cmp.project,
                'period': cmp.period
            }, {
                headers: headers
            }).then(function (response) {
                if (response.data.success) {
                    cmp.store_lastproducts = response.data.products
                    cmp.lastproducts = response.data.products
                    cmp.lastproducts_loading = false
                    cmp.lastproducts_empty = (Object.keys(response.data.products).length > 0) ? false : true
                }
                else {
                    toastr.error('Error al intentar cargar los datos.')
                }
            }).catch(function (error) {
                toastr.error('Error al intentar cargar los datos.')
                return;
            })

        axios.post('http://localhost/semtinel/public/api/logistics/inventory/history', {
                'pole' : cmp.pole,
                'project': cmp.project,
                'period': cmp.period
            }, {
                headers: headers
            }).then(function (response) {
                if (response.data.success) {
                    cmp.history = response.data.history
                    cmp.history_loading = false
                    cmp.history_empty = (Object.keys(response.data.history).length > 0) ? false : true
                }
                else {
                    toastr.error('Error al intentar cargar los datos.')
                }
            }).catch(function (error) {
                toastr.error('Error al intentar cargar los datos.')
                return;
            })
    },
};
</script>

<template>
    <page-header 
        :pagetitle="'Inventarios de productos en obra'"
        :breadcrumbs="false"
        :pole_project="true"
        :pole="pole_name"
        :project="project_name">
    </page-header>

    <div class="card card-default" v-if="tabactive == 1">
        <div class="card-header">
            <h3 class="card-title">
                <i class="fas fa-filter" :class="(filter_apply) ? 'text-green' : ''"></i>&nbsp;Filtros
                <small v-if="filter_apply">(<i>Filtro aplicado</i>)</small>
            </h3>
            <div class="card-tools">
                <button type="button" class="btn btn-tool" 
                    v-tooltip="'Click para aplicar los filtros a la tabla'"
                    v-on:click="filterApply()">
                    Aplicar Filtros
                </button>
                <button type="button" class="btn btn-tool" 
                    v-tooltip="'Click para quitar los filtros aplicados a la tabla'"
                    v-on:click="filterClear()">
                    Limpiar Filtros
                </button>
                <button type="button" class="btn btn-tool" data-card-widget="collapse" 
                    v-tooltip="'Contraer/Expandir'">
                    <i class="fas fa-minus"></i>
                </button>
            </div>
        </div>
        <!-- /.card-header -->
        <div class="card-body">
            <div class="row">
                <div class="col-md-3">
                    <div class="form-group">
                        <label for="filter_category">Categoría</label>
                        <select 
                            class="form-control" 
                            id="filter_category"
                            v-model="filter_productcategory">
                            <option value="all">- Todas -</option>
                            <template v-for="(option, index) in products_categories" :key="index">
                                <option
                                    :value="index">
                                    {{ option }}
                                </option>
                            </template>
                        </select>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="form-group">
                        <label for="filter_warehouse">Pa&ntilde;ol</label>
                        <select 
                            id="filter_warehouse" 
                            size="1" 
                            class="form-control"
                            v-model="filter_warehouse">
                            <option value="all">- Todos -</option>
                            <template v-for="(option, index) in warehouses" :key="index">
                                <option
                                    :value="option['id']">
                                    {{ option['name'] }}
                                </option>
                            </template>
                        </select> 
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="form-group">
                        <label for="filter_oc">Orden Compra</label>
                        <input 
                            type="text" 
                            class="form-control" 
                            id="filter_oc" 
                            placeholder="Orden de compra"
                            v-model="filter_oc">
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="form-group">
                        <label for="filter_product">Código Producto</label>
                        <input 
                            type="text" 
                            class="form-control" 
                            id="filter_product" 
                            placeholder="Código de producto"
                            v-model="filter_product">
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="card">
        <div class="card-header p-2">
            <ul class="nav nav-pills float-start">
                <li class="nav-item">
                    <a class="nav-link active" href="#products" data-toggle="tab"
                        @click="tabactive = 1">Productos</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#lastentries" data-toggle="tab"
                        @click="tabactive = 2">Últimas entradas</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#timeline" data-toggle="tab"
                        @click="tabactive = 3">Historial</a>
                </li>
            </ul>
            <div class="inventory-period float-end pr-1" v-if="tabactive == 2 || tabactive == 3">
                <label for="inventory_period" class="float-left pt-2 text-right" style="width: auto;">Motrando:</label>
                <select 
                    name="inventory_period" 
                    id="inventory_period" 
                    class="form-control float-end" 
                    style="width: auto;" 
                    v-model="period">
                    <option value="today">Hoy</option>
                    <option value="currentweek">Esta semana</option>
                    <option value="currentmonth">Este mes</option>
                    <option value="currentyear">Este a&ntilde;o</option>
                </select>
            </div>
        </div><!-- /.card-header -->
        <div class="card-body">
        <div class="tab-content">
            
            <div class="tab-pane active" id="products">
                
                <!-- loading -->
                <div class="row" :class="!products_loading ? 'hidden' : ''">
                    <div class="col-12 text-center py-5 loading-table">
                        <span class="mdi mdi-loading mdi-spin mdi-36px">&nbsp;Cargando productos...</span>
                    </div>
                </div>
                <!-- Products table -->
                <table id="datatable-products" class="table table-striped" :class="products_loading ? 'hidden' : ''">
                    <thead>
                    <tr>
                        <th width="15%">Orden Compra</th>
                        <th width="15%">Código</th>
                        <th>Descripción</th>
                        <th width="10%" class="text-center">UM</th>
                        <th width="10%" class="text-center">Existencia</th>
                        <th width="10%" class="text-center">Disponible</th>
                        <th width="10%" class="text-right no-sort"></th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, idx) in products" :key="item.id">
                            <td>{{ item.oc }}</td>
                            <td>{{ item.product_code }}</td>
                            <td>
                                <a class="show-lnk" 
                                href="javascript:void(0);"
                                v-tooltip="'Click para Mostrar Detalles de este producto'"
                                data-toggle="modal" 
                                data-target="#modal-item-details"
                                v-on:click="show(idx)">
                                    {{ item.description }}
                                </a>
                            </td>
                            <td class="text-center">{{ item.um }}</td>
                            <td class="text-center">{{ item.quantity }}</td>
                            <td class="text-center">&nbsp;</td>
                            <td class="text-right">
                                <a href="javascript:void(0);"
                                    class="btn-semti-tool"
                                    style="padding: 4px 5px;"
                                    data-toggle="modal" 
                                    data-target="#modal-item-history"
                                    v-tooltip="'Historial de este producto'"
                                    v-on:click="productHistory(item.id_receipt, item.id)">
                                    <span class="mdi mdi-timeline-clock mdi-18px text-green"></span>
                                </a> &nbsp;
                                <a href="javascript:void(0);"
                                    class="btn-semti-tool"
                                    style="padding: 4px 5px;"
                                    data-toggle="modal" 
                                    data-target="#modal-item-form"
                                    v-tooltip="'Agregar al carrito'">
                                    <span class="mdi mdi-cart mdi-18px text-danger"></span>
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!--  / Products table -->

            </div>
            <!-- /.tab-pane -->

            <div class="tab-pane" id="lastentries" v-if="tabactive == 2">
                
                <!-- loading -->
                <div class="row" :class="!lastproducts_loading ? 'hidden' : ''">
                    <div class="col-12 text-center py-5 loading-table">
                        <span class="mdi mdi-loading mdi-spin mdi-36px">&nbsp;Cargando productos...</span>
                    </div>
                </div>
                <!-- Products table -->
                <div class="row mt-3" :class="(lastproducts_empty && !lastproducts_loading) ? '' : 'hidden'">
                    <div class="col-12 text-center empty-table">
                        <h6>Ning&uacute;n Producto encontrado</h6>
                    </div>
                </div>
                <table class="table table-striped" :class="(lastproducts_loading || lastproducts_empty) ? 'hidden' : ''">
                    <thead>
                    <tr>
                        <th width="15%">Orden Compra</th>
                        <th width="15%">Código</th>
                        <th>Descripción</th>
                        <th width="10%" class="text-center">UM</th>
                        <th width="10%" class="text-center">Existencia</th>
                        <th width="10%" class="text-center">Disponible</th>
                        <th width="10%" class="text-right no-sort"></th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, idx) in lastproducts" :key="item.id">
                            <td>{{ item.oc }}</td>
                            <td>{{ item.product_code }}</td>
                            <td>
                                <a class="show-lnk" 
                                href="javascript:void(0);"
                                v-tooltip="'Click para Mostrar Detalles de este producto'"
                                data-toggle="modal" 
                                data-target="#modal-item-details"
                                v-on:click="show(idx)">
                                    {{ item.description }}
                                </a>
                            </td>
                            <td class="text-center">{{ item.um }}</td>
                            <td class="text-center">{{ item.quantity }}</td>
                            <td class="text-center">&nbsp;</td>
                            <td class="text-right">
                                <a href="javascript:void(0);"
                                    class="btn-semti-tool"
                                    style="padding: 4px 5px;"
                                    data-toggle="modal" 
                                    data-target="#modal-item-history"
                                    v-tooltip="'Historial de este producto'"
                                    v-on:click="productHistory(item.id_receipt, item.id)">
                                    <span class="mdi mdi-timeline-clock mdi-18px text-green"></span>
                                </a> &nbsp;
                                <a href="javascript:void(0);"
                                    class="btn-semti-tool"
                                    style="padding: 4px 5px;"
                                    data-toggle="modal" 
                                    data-target="#modal-item-form"
                                    v-tooltip="'Agregar al carrito'">
                                    <span class="mdi mdi-cart mdi-18px text-danger"></span>
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!--  / Products table -->

            </div>
            <!-- /.tab-pane -->

            <div class="tab-pane" id="timeline" v-if="tabactive == 3">
                <timeline
                    :history="history"
                    :history_loading="history_loading"
                    :history_empty="history_empty">
                </timeline>
            </div>
            <!-- /.tab-pane -->

        </div>
        <!-- /.tab-content -->
        </div><!-- /.card-body -->
    </div>

    <!-- Modal Details -->
    <div class="modal fade" id="modal-item-details" aria-hidden="true" role="dialog" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header header-info">
                    <h4 class="modal-title">Detalles Producto</h4>
                    <button type="button" 
                        ref="Close" 
                        class="close"
                        data-dismiss="modal" 
                        aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body px-4 rounded-bottom">
                    <div class="row py-1">
                        <div class="col-md-12">
                            <span class="detail-title">Polo</span>
                            <h6 class="detail-desc">{{ item_details.pole.name }}</h6>
                        </div>
                    </div>
                    <div class="row py-1">
                        <div class="col-md-12">
                            <span class="detail-title">Proyecto</span>
                            <h6 class="detail-desc">{{ item_details.project.name }}</h6>
                        </div>
                    </div>
                    <div class="row py-1">
                        <div class="col-md-12">
                            <span class="detail-title">Código del Producto</span>
                            <h6 class="detail-desc">{{ item_details.product_code }}</h6>
                        </div>
                    </div>
                    <div class="row py-1">
                        <div class="col-md-12">
                            <span class="detail-title">Orden de Compra</span>
                            <h6 class="detail-desc">{{ item_details.oc }}</h6>
                        </div>
                    </div>
                    <div class="row py-1">
                        <div class="col-md-12">
                            <span class="detail-title">Descripción del Item</span>
                            <h6 class="detail-desc">{{ item_details.description }}</h6>
                        </div>
                    </div>
                    <div class="row py-1 mt-2">
                        <div class="col-md-4">
                            <div class="text-center"><span class="detail-title">UM</span></div>
                            <h6 class="detail-desc text-center">{{ item_details.um }}</h6>
                        </div>
                        <div class="col-md-4">
                            <div class="text-center"><span class="detail-title">Cantidad</span></div>
                            <h6 class="detail-desc text-center">{{ item_details.quantity }}</h6>
                        </div>
                        <div class="col-md-4">
                            <div class="text-center"><span class="detail-title">Tarjeta Estiba</span></div>
                            <h6 class="detail-desc text-center">{{ item_details.stowage_card }}</h6>
                        </div>
                    </div>
                    <div class="row py-1">
                        <div class="col-md-6">
                            <div class="text-center"><span class="detail-title">Pa&ntilde;ol</span></div>
                            <h6 class="detail-desc text-center">{{ item_details.warehouse_name }}</h6>
                        </div>
                        <div class="col-md-6">
                            <div class="text-center"><span class="detail-title">Responsable</span></div>
                            <h6 class="detail-desc text-center">{{ item_details.warehouse_owner }}</h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- /.Modal Details -->

    <!-- Modal History -->
    <div class="modal fade" id="modal-item-history">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header header-info">
                    <h4 class="modal-title">Historial de Producto</h4>
                    <button type="button" 
                        ref="Close" 
                        class="close"
                        data-dismiss="modal" 
                        aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body px-4 rounded-bottom">
                    <div class="row py-1">
                        <div class="col-12">
                            <timeline
                                :history="history_product"
                                :history_loading="history_product_loading"
                                :history_empty="history_product_empty">
                            </timeline>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- /.Modal History -->
</template>