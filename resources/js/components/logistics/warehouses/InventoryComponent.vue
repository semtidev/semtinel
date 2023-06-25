<script allowJs="true">
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";
import 'datatables.net-select';
import 'datatables.net-buttons';
import 'datatables.net-buttons/js/buttons.html5';
import jszip from 'jszip';
import pdfmake from 'pdfmake';
import PageHeader from "../../layouts/HeaderComponent.vue";
import Timeline from "../../common/TimelineComponent.vue";

export default {
    data: function () {
      return {
        pole_name: '',
        project_name: '',
        tabactive: 1,
        inventory_cost: 0,
        store_products: [],
        products: [],
        products_filter: {},
        products_loading: true,
        lastproducts: [],
        lastproducts_empty: false,
        store_history: {},
        history: {},
        history_filter: {},
        history_loading: true,
        history_empty: false,
        history_description: '',
        history_product: {},
        history_product_loading: true,
        history_product_empty: false,
        period: 'all',
        filter_apply: false,
        lastproducts_loading: true,
        session: JSON.parse(sessionStorage.getItem('semtinel')),
        pole: sessionStorage.getItem('stnel_logist_pole'),
        project: sessionStorage.getItem('stnel_logist_project'),
        warehouses: (sessionStorage.getItem('stnel_logist_warehouses').length > 0) ? JSON.parse(sessionStorage.getItem('stnel_logist_warehouses')) : '',
        products_categories: JSON.parse(sessionStorage.getItem('stnel_prod_categories')),
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
        productcart: {
            id: 0,
            oc: '',
            desc: '',
            um: '',
            quantity: '',
            price_unit: '',
            price_total: '',
            warehouse: '',
            stowage_card: ''
        },
        productcart_form_loading: false,
        productcart_quantity: 1,
        productcart_warehouse: '',
        productcart_form_okbtn_text: 'Aceptar',
        productcart_warehouse_error: '',
        show_details: false,
        cart_error: ''
      };
    },
    watch: {
        /*period: function(val) {
            this.getLastProductsTable(val)
            this.getHistoryTimeline(val)
        }*/
    },
    components: {
        'page-header': PageHeader,
        'timeline': Timeline
    },
    created() {
        let cmp = this
        // Set pole name
        cmp.session.poles.map(function(value, key) {
            if (value.id == cmp.pole)
                cmp.pole_name = value.name
        });
        // Set projects name & filter warehouse
        cmp.session.projects.map(function(value, key) {
            if (value.id == cmp.project) {
                cmp.project_name = value.name
            }
            if (
                sessionStorage.getItem('stnel_logist_inv_warehouse') && 
                sessionStorage.getItem('stnel_logist_inv_warehouse') != ''
            ) {
                cmp.filter_warehouse = parseInt(sessionStorage.getItem('stnel_logist_inv_warehouse'));
            }
            else {
                cmp.filter_warehouse = cmp.warehouses[0].id;
                sessionStorage.setItem('stnel_logist_inv_warehouse', cmp.warehouses[0].id);
            }
        });
        // Set warehouse name
        cmp.warehouses.map(function(value, key) {
            if (value.id == cmp.filter_warehouse)
                cmp.warehouse_name = value.name
                cmp.warehouse_owner = value.owner
        });
    },
    methods: {
        createDataTable: function () {
            let cmp = this
            $("#dt_products").DataTable({
                retrieve: true,
                "responsive": true, "lengthChange": false, "autoWidth": false,
                "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"],
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
                    null,
                    { "width": "10%" },
                    { "width": "10%" },
                    { "width": "10%" },
                    { "width": "7%" },
                    { "width": "7%" },
                    { "width": "7%" },
                    { "width": "5%" }
                ],
                language: cmp.$root.dataTableLanguage
            }).buttons().container().appendTo('#products_wrapper .col-md-6:eq(0)');
        },
        inventoryCost: function () {
            let cmp = this,
                cost = 0;
            cmp.products.map(function(product, key) {
                cost += Number(product.price_total);
            });
            cmp.inventory_cost = Math.floor(cost * 100) / 100;
        },
        activeTab: function (tab) {
            let cmp = this
            cmp.tabactive = tab;
            if (tab == 1) {
                cmp.products_loading = true
                if ($("#dt_products").DataTable().destroy()) {
                    setTimeout(() => {
                        cmp.createDataTable();
                    });
                }
                cmp.products_loading = false    
            }                   
        },
        getProducts: function () {
            let cmp = this,
                headers = {
                'User-Agent': 'testing/1.0',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + cmp.session.access_token
            }
            cmp.products_loading = true;
            $("#dt_products").DataTable().destroy();
            axios.post('http://localhost/semtinel/public/api/logistics/inventory/products', {
                    'warehouse' : cmp.filter_warehouse
                }, {
                    headers: headers
                }).then(function (response) {
                    if (response.data.success) {
                        cmp.store_products = response.data.products;
                        cmp.products = response.data.products;
                        sessionStorage.setItem('stnel_logist_inventory', JSON.stringify(response.data.products));
                        cmp.products_loading = false;
                        setTimeout(() => {
                            cmp.createDataTable();
                        });
                        // Set inventory cost
                        cmp.inventoryCost();
                    }
                    else {
                        toastr.error('Error al intentar cargar los datos.')
                    }
                }).catch(function (error) {
                    toastr.error('Error al intentar cargar los datos.')
                    return;
                });
        },
        changeWarehouse: function () {
            let cmp = this;
            sessionStorage.setItem('stnel_logist_inv_warehouse', cmp.filter_warehouse);
            // Clear filters
            cmp.filter_productcategory = 'all'
            cmp.period = 'all'
            cmp.filter_oc = ''
            cmp.filter_product = ''
            cmp.filter_apply = false
            // Load products
            cmp.getProducts();
        },
        addCart: function (idx, product) {
            let cmp = this
            cmp.cart_error = ''
            cmp.productcart_warehouse_error = false
            if (cmp.$root.cart_quantity == 0) {
                cmp.$root.cart_warehouse = ''
            }
            if (cmp.$root.cart_warehouse != '') {
                if (cmp.$root.cart_warehouse != product.warehouse_id) {
                    cmp.productcart_warehouse_error = true
                    cmp.$refs.addCartClose.click()
                    return;
                }
            }
            
            cmp.productcart = {
                id: product.id,
                oc: product.oc,
                id_inventory: idx,
                product_code: product.product_code,
                description: product.item_description,
                um: product.um,
                quantity: 1,
                available: product.available,
                price_unit: parseFloat(product.price_unit).toFixed(2),
                price_total: 1 * parseFloat(product.price_unit).toFixed(2),
                stowage_card: product.stowage_card
            }
            cmp.productcart_quantity = 1
            cmp.productcart_warehouse = product.warehouse_id
        },
        processAddCart: function () {
            let cmp = this, exists = false, total
            if (cmp.productcart_quantity > cmp.productcart.available) {
                cmp.cart_error = 'La cantidad solicitada no puede exceder a la disponible.'
                return;
            }
            cmp.$root.cart_items.map(function(product, idx) {
                if (product.id == cmp.productcart.id) {
                    cmp.$root.cart_items[idx].quantity = cmp.productcart_quantity
                    total = cmp.productcart_quantity * parseFloat(cmp.$root.cart_items[idx].price_unit).toFixed(2)
                    total = parseFloat(total).toFixed(2)
                    cmp.$root.cart_items[idx].price_total = total
                    exists = true
                }
            })
            cmp.productcart.quantity = cmp.productcart_quantity
            cmp.productcart.price_total = cmp.productcart_quantity * parseFloat(cmp.productcart.price_unit).toFixed(2)
            cmp.productcart.price_total = parseFloat(cmp.productcart.price_total).toFixed(2)
            if (!exists) {
                cmp.$root.cart_items.push(cmp.productcart)
                cmp.$root.cart_quantity++
            }
            if (cmp.$root.cart_warehouse == '') {
                cmp.$root.cart_warehouse = cmp.productcart_warehouse
            }
            cmp.$refs.addCartClose.click()
        },
        filterApply: function () {
            let cmp = this
            cmp.products_loading = true
            cmp.products = cmp.store_products
            //cmp.history = cmp.store_history
            cmp.filter_apply = false
            cmp.products_filter = {},
            //cmp.history_filter = {},
            //cmp.history_loading = true
            // Filter products
            Object.keys(cmp.products).forEach(key => {
                let idx = key, valid = true
                // Filter product category
                if (cmp.filter_productcategory != 'all' && cmp.products[key].category_name != cmp.filter_productcategory) {
                    valid = false
                }
                // Filter period
                if (cmp.period != 'all') {
                    if (cmp.period == 'today') {
                        let today_date   = new Date(),
                            product_date = cmp.products[key].updated_at.split('T')[0];
                        today_date = today_date.toISOString().split('T')[0];
                        if (today_date != product_date)
                            valid = false
                    }
                    if (cmp.period == 'currentweek') {
                        let today_date   = new Date(),
                            first_date   = new Date(today_date.setDate(today_date.getDate() - today_date.getDay() )),
                            last_date    = new Date(today_date.setDate(today_date.getDate() - today_date.getDay() + 7)),
                            product_date = new Date(cmp.products[key].updated_at.split('T')[0]);
                        if (!(product_date > first_date && product_date < last_date))
                            valid = false
                    }
                    if (cmp.period == 'currentmonth') {
                        let today_date   = new Date(),
                            product_date = new Date(cmp.products[key].updated_at.split('T')[0]);
                        if (today_date.getMonth() != product_date.getMonth())
                            valid = false
                    }
                    if (cmp.period == 'currentyear') {
                        let today_date   = new Date(),
                            product_date = new Date(cmp.products[key].updated_at.split('T')[0]);
                        if (today_date.getYear() != product_date.getYear())
                            valid = false
                    }
                }
                // Filter OC
                if (cmp.filter_oc != '' && cmp.filter_oc.length > 0 && cmp.products[key].oc.indexOf(cmp.filter_oc) === -1) {
                    valid = false
                }
                // Filter product
                if (cmp.filter_product != '' && cmp.filter_product.length > 0 && cmp.products[key].product_code.indexOf(cmp.filter_product) === -1 ) {
                    valid = false
                }
                // Filter apply
                if (valid) {
                    cmp.products_filter[idx] = cmp.products[key]
                }                    
            })
            if (Object.keys(cmp.products).length != Object.keys(cmp.products_filter).length) {
                cmp.products = cmp.products_filter
                cmp.filter_apply = true
            }
            if ($("#dt_products").DataTable().destroy()) {
                setTimeout(() => {
                    cmp.createDataTable();
                });
            }
            cmp.products_loading = false
        },
        filterClear: function () {
            let cmp = this
            cmp.products_loading = true
            //cmp.history_loading = true
            cmp.filter_productcategory = 'all'
            cmp.period = 'all'
            cmp.filter_oc = ''
            cmp.filter_product = ''
            cmp.products = cmp.store_products
            //cmp.history = cmp.store_history
            cmp.filter_apply = false
            if ($("#dt_products").DataTable().destroy()) {
                setTimeout(() => {
                    cmp.createDataTable();
                });
            }
            cmp.products_loading = false
            //cmp.history_loading = false
        },
        show: function (idx) {
            let cmp = this
            cmp.item_details = {
                pole: cmp.pole_name,
                project: cmp.project_name,
                oc: cmp.products[idx].oc,
                product_code: cmp.products[idx].product_code,
                description: cmp.products[idx].item_description,
                um: cmp.products[idx].um,
                quantity: cmp.products[idx].stock,
                warehouse_name: cmp.warehouse_name,
                warehouse_owner: cmp.warehouse_owner,
                stowage_card: cmp.products[idx].stowage_card
            }
            cmp.show_details = true
        },
        productHistory: function (oc, description) {
            let cmp = this, period = cmp.period
            cmp.history_description = description
            if (cmp.tabactive == 1) {
                period = 'all'
            }
            this.getProductHistoryTimeline(oc, description, period);
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
                    'period': cmp.period,
                    'description': ''
                }, {
                    headers: headers
                }).then(function (response) {
                    if (response.data.success) {
                        cmp.store_history = response.data.history
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
        async getProductHistoryTimeline (oc, description, period) {
            let cmp = this
            cmp.history_product_loading = true
            let headers = {
                'User-Agent': 'testing/1.0',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + cmp.session.access_token
            }
            axios.post('http://localhost/semtinel/public/api/logistics/inventory/history/' + oc, {
                    'pole' : cmp.pole,
                    'project': cmp.project,
                    'period': period,
                    'description': description
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
            window.document.location.href = 'http://localhost/semtinel/public/login'
        }
        // Load from session storage
        if (sessionStorage.getItem('stnel_logist_inventory') && sessionStorage.getItem('stnel_logist_inventory') != '') {
            cmp.store_products = JSON.parse(sessionStorage.getItem('stnel_logist_inventory'));
            cmp.products = cmp.store_products;
            if ($("#dt_products").DataTable().destroy()) {
                setTimeout(() => {
                    cmp.createDataTable();
                });
            }
            cmp.products_loading = false;
            // Set inventory cost
            cmp.inventoryCost();
        }
        else {
            cmp.getProducts();
        }

        /*axios.post('http://localhost/semtinel/public/api/logistics/inventory/history', {
                'pole' : cmp.pole,
                'project': cmp.project,
                'period': cmp.period,
                'description': ''
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
            });*/
    },
};
</script>

<template>
    <page-header 
        :pagetitle="'Inventarios en pañol'"
        :breadcrumbs="false"
        :pole_project="true"
        :pole="pole_name"
        :project="project_name"
        :inventory_cost="inventory_cost">
    </page-header>

    <div class="card card-default filters-panel mb-4">
        <div class="card-header">
            <h4 class="card-title">
                <i class="fas fa-filter" :class="(filter_apply) ? 'text-danger' : ''"></i>&nbsp;Filtros
                <small v-if="filter_apply">(<i>Filtro aplicado</i>)</small>
            </h4>
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
                        <label for="filter_category">Categoría Producto</label>
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
                        <label for="inventory_period">Periodo de Entradas:</label>
                        <select 
                            name="inventory_period" 
                            id="inventory_period" 
                            class="form-control" 
                            v-model="period">
                            <option value="all">- Todas -</option>
                            <option value="today">Hoy</option>
                            <option value="currentweek">Esta semana</option>
                            <option value="currentmonth">Este mes</option>
                            <option value="currentyear">Este a&ntilde;o</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="form-group">
                        <label for="filter_oc">Orden de Compra</label>
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
                        v-on:click="activeTab(1)">Productos</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#timeline" data-toggle="tab"
                        v-on:click="activeTab(2)">Historial</a>
                </li>
            </ul>
            <div class="inventory-tools float-end pr-1" v-if="tabactive == 1">
                <button type="button" 
                    class="btn btn-tool float-end pr-2"
                    v-tooltip="'Recargar Listado'"
                    v-on:click.stop="getProducts()">
                    <i class="mdi mdi-file-pdf-box mdi-24px text-green"></i>
                </button>
                <button type="button" 
                    class="btn btn-tool float-end pr-2"
                    v-tooltip="'Recargar Listado'"
                    v-on:click.stop="getProducts()">
                    <i class="mdi mdi-reload mdi-24px text-green"></i>
                </button>
                <label for="inventory_period" class="float-left pt-2 mr-2 text-left" style="width: auto;">
                    Mostrando Pa&ntilde;ol:
                </label>
                <select 
                    id="filter_warehouse" 
                    size="1" 
                    class="form-control float-start"
                    style="width: auto;"
                    v-model="filter_warehouse">
                    <template v-for="(option, index) in warehouses" :key="index">
                        <option
                            :value="option['id']"
                            v-on:click.stop="changeWarehouse()">
                            {{ option['name'] }}
                        </option>
                    </template>
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
                <table id="dt_products" class="table table-striped w-100" :class="products_loading ? 'hidden' : ''">
                    <thead>
                    <tr>
                        <th>Descripción</th>
                        <th width="10%" class="text-center no-sort">UM</th>
                        <th width="10%" class="text-right no-sort">Precio Unit.</th>
                        <th width="10%" class="text-right no-sort">Precio Total</th>
                        <th width="7%" class="text-right no-sort">Stock</th>
                        <th width="7%" class="text-right no-sort">Reserv.</th>
                        <th width="7%" class="text-right no-sort">Disp.</th>
                        <th width="5%" class="text-right no-sort"></th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, idx) in products" :key="item.id">
                            <td>
                                <a class="show-lnk" 
                                href="javascript:void(0);"
                                v-tooltip="'Click para Mostrar Detalles de este producto'"
                                data-toggle="modal" 
                                data-target="#modal-item-details"
                                v-on:click="show(idx)">
                                    {{ item.item_description }}
                                </a>
                            </td>
                            <td class="text-center">{{ item.um }}</td>
                            <td class="text-right">{{ item.price_unit }}</td>
                            <td class="text-right">{{ item.price_total }}</td>
                            <td class="text-right">{{ item.stock }}</td>
                            <td class="text-right">{{ item.reserved }}</td>
                            <td class="text-right">{{ item.available }}</td>
                            <td class="text-right">
                                <!--<a href="javascript:void(0);"
                                    class="btn-semti-tool"
                                    style="padding: 4px 5px;"
                                    data-toggle="modal" 
                                    data-target="#modal-item-history"
                                    v-tooltip="'Historial de este producto'"
                                    v-on:click="productHistory(item.oc, item.description)">
                                    <span class="mdi mdi-timeline-clock mdi-18px text-green"></span>
                                </a> &nbsp;-->
                                <a href="javascript:void(0);"
                                    v-if="item.warehouse in session.warehouses"
                                    class="btn-semti-tool"
                                    style="padding: 4px 5px;"
                                    data-toggle="modal" 
                                    data-target="#modal-item-addcart"
                                    v-tooltip="'Agregar al carrito'"
                                    v-on:click="addCart(idx, item)">
                                    <span class="mdi mdi-cart mdi-18px text-orange"></span>
                                </a>
                                <span class="px-2" v-else>&nbsp;&nbsp;&nbsp;</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!--  / Products table -->
            </div>
            <!-- /.tab-pane -->

            <div class="tab-pane" id="timeline" v-if="tabactive == 2">
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
                        <div class="col-md-6">
                            <span class="detail-title">Polo</span>
                            <h6 class="detail-desc">{{ item_details.pole }}</h6>
                        </div>
                        <div class="col-md-6">
                            <span class="detail-title">Proyecto</span>
                            <h6 class="detail-desc">{{ item_details.project }}</h6>
                        </div>
                    </div>
                    <div class="row py-1">
                        <div class="col-md-6">
                            <span class="detail-title">Código del Producto</span>
                            <h6 class="detail-desc">{{ item_details.product_code }}</h6>
                        </div>
                        <div class="col-md-6">
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
                                :description="history_description"
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

    <!-- Modal Add Cart -->
    <div class="modal fade" id="modal-item-addcart">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header header-green">
                    <h4 class="modal-title">Agregar Producto al carrito</h4>
                    <button type="button" 
                        ref="addCartClose" 
                        class="close"
                        data-dismiss="modal" 
                        aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body px-4 rounded-bottom pb-2">
                    <div class="row pt-2 pb-4" v-if="productcart_warehouse_error">
                        <div class="float-start text-danger" style="width: 70px"><i class="mdi mdi-alert-circle mdi-48px"></i></div>
                        <div class="float-start form_error pt-3" style="width: 85%">No puede seleccionar un Producto de otro Pañol.<br>Por favor, revise los productos de su carrito.</div>
                    </div>
                    <div class="row py-1" v-if="!productcart_warehouse_error">
                        <div class="col-12 pb-2">
                            <span class="detail-title">Descripción</span>
                            <h6 class="detail-desc">{{ productcart.description }}</h6>
                        </div>
                    </div>
                    <div class="row" v-if="!productcart_warehouse_error">
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="productcart_um" class="detail-title mb-1">UM:</label>
                                <input type="text" 
                                    class="form-control"
                                    id="productcart_um"
                                    name="productcart_um"
                                    disabled="true"
                                    v-model="productcart.um">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="productcart_quantity" class="detail-title mb-1">Cantidad:</label>
                                <input type="number" 
                                    class="form-control"
                                    :class="cart_error != '' ? 'border-error' : ''"
                                    id="productcart_quantity"
                                    name="productcart_quantity"
                                    step=".01"
                                    min="1"
                                    v-model="productcart_quantity"
                                    v-on:keyup.enter="processAddCart()">
                            </div>
                        </div>
                        <div class="col-md-4 text-right">
                            <button type="button" 
                                class="btn btn-primary btn-green ripple"
                                style="margin-top: 28px;"
                                :disabled="productcart_form_loading"
                                v-on:click.stop="processAddCart()">
                                <i class="mdi mdi-check-all" v-if="!productcart_form_loading"></i>
                                <i class="mdi mdi-loading mdi-spin" v-else></i>
                                {{ productcart_form_okbtn_text }}
                            </button>
                        </div>
                    </div>
                    <div class="row py-2" v-if="cart_error != '' && !productcart_warehouse_error">
                        <div class="col-12 text-center">
                            <h6 class="form_error">{{ cart_error }}</h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- /.Modal Add Cart -->
</template>