<script allowJs="true">
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";

export default {
    data: function () {
      return {
        //store_poles: JSON.parse(localStorage.getItem('semtinel_poles')),
        //store_projects: JSON.parse(localStorage.getItem('semtinel_projects')),
        //store_warehouses: JSON.parse(localStorage.getItem('semtinel_warehouses')),
        pole: localStorage.getItem('stnel_logist_pole'),
        pole_name: '',
        project: localStorage.getItem('stnel_logist_project'),
        project_name: '',
        projects: [],
        warehouses: [],
        items: [],
        items_selected: 0,
        items_loading: true,
        search_loading: false,
        show_items: false,
        btnsearch: 'Cargar Renglones',
        table_oc: false,
        show_details: false,
        stowage_card_loading: false,
        origin_data: {
            origin: 'Despacho de Almacén',
            doctype_title: 'Tipo de Documento',
            doctype_value: 'Orden de Despacho',
            docnum_title: 'Orden de Despacho (últimos 5 dígitos)',
            docnum_value: '',
            ocnumber: '',            
            origin_field_options: [
                'Despacho de Almacén',
                'Tiro Directo Altec',
                'Tiro Directo Almest',
                'Tiro Directo Compras Locales',
                //'Transferencia de Pañol'
            ],
            doctype_field_options: [
                'Orden de Despacho',
                'Conduce',
                'Vale de Salida'
            ],
            error: {
                docnum: '',
                ocnumber: ''
            }
        },
        origin_warehouse: '',
        origin_warehouse_owner: '',
        item_details: {
            docnum: '',
            product_quantity: '',
            cod_product: '',
            oc: '',
            generic_descript: '',
            item_description: '',
            um: '',
            received_quantity: 0,
            stowage_card: '-',
            price_unit: '',
            price_total: 0,
            comment: ''
        },
        destiny_data: {
            pole: this.pole,
            project: this.project,
            warehouse: '',
            warehouse_name: '',
            warehouse_owner: '',
            comment: ''
        },
        item_form_data: {
            idx: '',
            number: '',
            received_quantity: '',
            stowage_card: '',
            has_stowage_card: false,
            warehouse: '',
            warehouse_name: '',
            warehouse_owner: '',
            comment: '',
            product_quantity: ''
        },
        item_form_error: {
            received_quantity: false,
            stowage_card: false,
            error_text: ''
        },
        item_form_loading: false,
        item_form_okbtn_text: 'Aceptar',
        session: JSON.parse(sessionStorage.getItem('semtinel')),
        entry_error: '',
        entry_status: 'parcial',
        entry_loading: false,
        entry_okbtn_text: 'Aceptar'
      };
    },
    watch: {
        btnsearch: function (val) {
            if (val == 'Loading')
                this.search_loading = true
            else
                this.search_loading = false
        },
        entry_loading: function (val) {
            if (val)
                this.entry_okbtn_text = 'Procesando...'
            else
                this.entry_okbtn_text = 'Aceptar'
        }
    },
    created() {
        let cmp = this
        cmp.session.poles.map(function(value, key) {
            if (value.abbr == cmp.pole)
                cmp.pole_name = value.name
        });
        cmp.session.projects.map(function(value, key) {
            if (value.id == cmp.project)
                cmp.project_name = value.name
        });
    },
    methods: {
        changeOrigin: function (origin) {
            this.show_items                 = false
            this.show_details               = false
            this.origin_data.origin         = origin
            this.origin_data.error.docnum   = ''
            this.origin_data.error.ocnumber = ''

            if (origin != 'Despacho de Almacén') {
                this.origin_data.doctype_title = 'Orden de Compra'
                this.origin_data.doctype_value = ''
                this.origin_data.docnum_title  = 'Documento'
                this.origin_data.docnum_value  = ''
                this.origin_data.ocnumber      = ''
                this.table_oc                  = true
            }
            else {
                this.origin_data.doctype_title = 'Tipo de Documento'
                this.origin_data.doctype_value = 'Orden de Despacho'
                this.origin_data.docnum_title  = 'Orden de Despacho (últimos 5 dígitos)'
                this.origin_data.docnum_value  = ''
                this.origin_data.ocnumber      = ''
                this.table_oc                  = false
            }
        },
        changeDoctype: function (doctype) {
            this.show_items                 = false
            this.show_details               = false
            this.origin_data.doctype_value  = doctype
            this.origin_data.error.docnum   = ''
            this.origin_data.error.ocnumber = ''

            if ( doctype == 'Orden de Despacho' ) {
                this.origin_data.docnum_title  = 'Orden de Despacho (últimos 5 dígitos)'
                this.table_oc                  = false
            }
            else if ( doctype == 'Vale de Salida' ) {
                this.origin_data.docnum_title  = 'Vale de Salida'
                this.table_oc                  = false
            }
            else {
                this.origin_data.docnum_title  = 'Conduce'
                this.table_oc                  = true
            }
        },
        changePole: function (pole_id, pole_abbr) {
            let cmp = this,
                projects = [],
                warehouses = []
            // Set pole
            cmp.destiny_data.pole = pole_abbr
            // Set projects and select the first
            cmp.session.projects.map(function(value, key) {
                if (value.id_pole == pole_id)
                    projects.push(value)
            })
            cmp.projects = projects
            cmp.destiny_data.project  = (projects.length > 0) ? projects[0]['id'] : ''
            // Set warehouses and select the first
            cmp.destiny_data.warehouse = ''
            if (cmp.destiny_data.project != '') {
                let object_warehouses = cmp.session.warehouses
                for (let key in object_warehouses) {
                    if (object_warehouses[key].id_project == cmp.destiny_data.project)
                        warehouses.push({
                            id: key,
                            id_project: object_warehouses[key].id_project,
                            name: object_warehouses[key].name,
                            owner: object_warehouses[key].owner
                        })               
                }
            }
            cmp.warehouses = warehouses
            cmp.destiny_data.warehouse = (warehouses.length > 0) ? warehouses[0]['id'] : ''
            cmp.destiny_data.warehouse_name = (warehouses.length > 0) ? warehouses[0]['name'] : ''
            cmp.destiny_data.warehouse_owner = (warehouses.length > 0) ? warehouses[0]['owner'] : ''
        },
        changeProject: function (project_id) {
            let cmp = this,
                warehouses = []
            cmp.destiny_data.project = project_id
            // Set warehouses and select the first
            cmp.destiny_data.warehouse = ''
            let object_warehouses = cmp.session.warehouses
            for (let key in object_warehouses) {
                if (object_warehouses[key].id_project == project_id)
                    warehouses.push({
                        id: key,
                        id_project: object_warehouses[key].id_project,
                        name: object_warehouses[key].name,
                        owner: object_warehouses[key].owner
                    })
            }
            cmp.warehouses = warehouses
            cmp.destiny_data.warehouse = (warehouses.length > 0) ? warehouses[0]['id'] : ''
            cmp.destiny_data.warehouse_name = (warehouses.length > 0) ? warehouses[0]['name'] : ''
            cmp.destiny_data.warehouse_owner = (warehouses.length > 0) ? warehouses[0]['owner'] : ''
        },
        changeWarehouse: function (warehouse_id, warehouse_name, warehouse_owner) {
            let cmp = this
            cmp.destiny_data.warehouse = warehouse_id
            cmp.destiny_data.warehouse_name = warehouse_name
            cmp.destiny_data.warehouse_owner = warehouse_owner
        },
        changeWarehouseOrigin: function (warehouse_id) {
            let cmp = this
            cmp.origin_warehouse = warehouse_id
        },
        itemsSelected: function () {
            let selected = 0;
            this.items.map(function (item, key) {
                if (item.received_quantity > 0) 
                selected++
            })
            return selected;
        },
        updateStatus: function () {
            let items_completed = 0, status;
            this.items.map(function (item, key) {
                if (parseFloat(item.received_quantity) == parseFloat(item.product_quantity)) 
                items_completed++
            })
            status = (this.items.length == items_completed) ? 'total' : 'parcial' 
            return status;
        },
        show: function (idx) {
            let cmp = this
            if (cmp.table_oc) {
                cmp.item_details = {
                    cod_product: cmp.items[idx].cod_product,
                    oc: cmp.items[idx].oc,
                    generic_descript: cmp.items[idx].generic_descript,
                    item_description: cmp.items[idx].item_description,
                    um: cmp.items[idx].um,
                    received_quantity: cmp.items[idx].received_quantity,
                    stowage_card: cmp.items[idx].stowage_card,
                    price_unit: cmp.items[idx].price_unit,
                    price_total: cmp.items[idx].price_total,
                    comment: cmp.items[idx].comment
                }
            }
            else {
                cmp.item_details = {
                    cod_product: cmp.items[idx].cod_product,
                    oc: cmp.items[idx].oc,
                    docnum: cmp.items[idx].docnum,
                    item_description: cmp.items[idx].item_description,
                    um: cmp.items[idx].um,
                    product_quantity: cmp.items[idx].product_quantity,
                    received_quantity: cmp.items[idx].received_quantity,
                    stowage_card: cmp.items[idx].stowage_card,
                    price_unit: cmp.items[idx].price_unit,
                    price_total: cmp.items[idx].price_total,
                    comment: cmp.items[idx].comment
                }
            }
            cmp.show_details = true
        },
        edit: function (idx, oc, item_description, received_quantity, stowage_card, comment, product_quantity = null) {
            let cmp = this
            cmp.form_error = ''
            cmp.item_form_data.idx = idx
            cmp.item_form_data.number = idx + 1
            cmp.item_form_data.received_quantity = received_quantity
            cmp.item_form_error.error_text = ''
            cmp.item_form_error.received_quantity = false
            cmp.item_form_error.stowage_card = false
            cmp.item_form_data.comment = comment
            if (product_quantity != null) {
                cmp.item_form_data.product_quantity = product_quantity
            }
            if (stowage_card != '-' && stowage_card != '') {
                cmp.item_form_data.stowage_card = stowage_card
            }
            else {
                cmp.item_form_data.stowage_card = ''
                cmp.stowage_card_loading = true
                let headers = {
                    'User-Agent': 'testing/1.0',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + cmp.session.access_token
                }            
                axios.post('http://localhost/semtinel/public/api/logistics/entry/item/stowage_card', {
                        'oc' : oc,
                        'item_desciption': item_description,
                    }, {
                        headers: headers
                    }).then(function (response) {
                        if (response.data.success) {
                            cmp.item_form_data.stowage_card = response.data.stowage_card
                            if (response.data.stowage_card != '') {
                                cmp.item_form_data.has_stowage_card = true
                            }
                            else {
                                cmp.item_form_data.has_stowage_card = false
                            }
                            if (response.data.warehouse != '') {
                                cmp.item_form_data.warehouse = response.data.warehouse
                                cmp.item_form_data.warehouse_name = response.data.warehouse_name,
                                cmp.item_form_data.warehouse_owner = response.data.warehouse_owner
                            }
                            cmp.stowage_card_loading = false
                        }
                        else {
                            cmp.item_form_data.stowage_card = ''
                            cmp.stowage_card_loading = false
                            toastr.error('Error al intentar cargar la tarjeta de estiba.')
                        }
                    }).catch(function (error) {
                        cmp.item_form_data.stowage_card = ''
                        cmp.stowage_card_loading = false
                        toastr.error('Error al intentar cargar la tarjeta de estiba.')
                        return;
                    })
            }
        },
        updateItem: function () {
            let cmp = this,
                idx = cmp.item_form_data.idx,
                received_quantity = cmp.item_form_data.received_quantity,
                total_import = 0,
                stowage_card = cmp.item_form_data.stowage_card,
                warehouse = cmp.item_form_data.warehouse,
                warehouse_name = cmp.item_form_data.warehouse_name,
                warehouse_owner = cmp.item_form_data.warehouse_owner,
                comment = cmp.item_form_data.comment

            cmp.item_form_error.error_text = ''
            cmp.item_form_error.received_quantity = false
            cmp.item_form_error.stowage_card = false

            // Validate quantity
            if (stowage_card != '-' && stowage_card != '' && (received_quantity == 0 || isNaN(received_quantity))) {
                cmp.item_form_error.error_text = 'Si asigna una tarjeta de estiba debe agregar una cantidad superior a cero'
                cmp.item_form_error.received_quantity = true
                return
            }
            if (cmp.item_form_data.product_quantity > 0 && cmp.item_form_data.product_quantity < received_quantity) {
                cmp.item_form_error.error_text = 'La cantidad recibida no debe ecceder a la cantidad despachada'
                cmp.item_form_error.received_quantity = true
                return
            }
            // Validate stowage card
            if ((stowage_card == '-' || stowage_card == '') && received_quantity > 0) {
                cmp.item_form_error.error_text = 'Si registra una cantidad recibida debe asignar una tarjeta de estiba de destino'
                cmp.item_form_error.stowage_card = true
                return
            }
            // Validate warehouse
            if (warehouse != '') {
                cmp.items.map(function (item, key) {
                    if (item.warehouse != '' && item.warehouse != warehouse) {
                        cmp.item_form_error.error_text = 'Los productos que reciba deben ser del mismo Pañol'
                        return
                    }                    
                })
                cmp.destiny_data.warehouse       = warehouse
                cmp.destiny_data.warehouse_name  = warehouse_name
                cmp.destiny_data.warehouse_owner = warehouse_owner
            }
            if (stowage_card != '-' && stowage_card != '') {
                cmp.items.map(function (item, key) {
                    if (idx != key && item.stowage_card == stowage_card) {
                        cmp.item_form_error.error_text = 'Ya registró otro renglón en esa Tarjeta de Estiba'
                        cmp.item_form_error.stowage_card = true
                    }
                })
                if (cmp.item_form_error.stowage_card)
                    return
            }
            if ((stowage_card == '-' || stowage_card == '') && (received_quantity == 0 || isNaN(received_quantity))) {
                received_quantity = 0
                stowage_card = '-'
            }

            // Update table and items array values
            $('#item-' + (idx + 1) + '-received').html(received_quantity)
            $('#item-' + (idx + 1) + '-stowagecard').html(stowage_card)
            $('#item-' + (idx + 1) + '-comment').html(comment)
            cmp.items[idx]['received_quantity'] = received_quantity
            cmp.items[idx]['stowage_card'] = stowage_card
            cmp.items[idx]['warehouse'] = (warehouse != '') ? warehouse : ''
            cmp.items[idx]['warehouse_name'] = (warehouse_name != '') ? warehouse_name : ''
            cmp.items[idx]['warehouse_owner'] = (warehouse_owner != '') ? warehouse_owner : ''
            cmp.items[idx]['comment'] = comment
            // Calc total price 
            if (received_quantity > 0) {
                total_import = received_quantity * cmp.items[idx]['price_unit']
                total_import = parseFloat(total_import).toFixed(2)
                $('#item-' + (idx + 1) + '-pricetotal').html(total_import)
                cmp.items[idx]['price_total'] = total_import
            }
            else {
                total_import = 0
                $('#item-' + (idx + 1) + '-pricetotal').html(total_import)
                cmp.items[idx]['price_total'] = total_import
            }

            // Recalc items selected
            cmp.items_selected = cmp.itemsSelected()

            // Update state
            cmp.entry_status = cmp.updateStatus()
            
            // Hide modal
            cmp.$refs.CloseEdit.click();
        },
        entryConfirm: function () {
            let cmp = this
            cmp.entry_error = ''
            if (cmp.items_selected == 0) {
                cmp.entry_error = 'No se ha registrado cantidad recibida en ningún renglón. Por favor, actualice la tabla de renglones con los valores que haya recibido, y luego repita esta operación.'
                return
            }
        },
        isValidOriginForm: function () {
            let isValid = true
            this.origin_data.error.docnum   = ''
            this.origin_data.error.ocnumber = ''

            if (this.origin_data.origin == 'Despacho de Almacén' && this.origin_data.doctype_value != 'Conduce') {
                if (this.origin_data.docnum_value == null || this.origin_data.docnum_value == '') {
                    this.origin_data.error.docnum = 'Este campo es obligatorio.'
                    isValid = false
                }
            }
            else {
                if (this.origin_data.ocnumber == null || this.origin_data.ocnumber == '') {
                    this.origin_data.error.ocnumber = 'Este campo es obligatorio.'
                    isValid = false
                }
                if (this.origin_data.docnum_value == null || this.origin_data.docnum_value == '') {
                    this.origin_data.error.docnum = 'Este campo es obligatorio.'
                    isValid = false;
                }
            }

            return isValid
        },
        async getEntryData () {
            let cmp = this
            if (!cmp.isValidOriginForm()) {
                return
            }
            cmp.btnsearch      = 'Loading'
            cmp.show_items     = true
            cmp.items_loading  = true
            cmp.items_selected = 0
            let headers = {
                'User-Agent': 'testing/1.0',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + cmp.session.access_token
            }
            await axios.post('http://localhost/semtinel/public/api/logistics/entry/data', {
                    'origin' : cmp.origin_data.origin,
                    'doctype': cmp.origin_data.doctype_value,
                    'ocnumber': cmp.origin_data.ocnumber,
                    'docnum': cmp.origin_data.docnum_value,
                    'project': localStorage.getItem('stnel_logist_project')
                }, {
                    headers: headers
                }).then(function (response) {
                    if (response.data.success) {
                        cmp.items = response.data.items
                        cmp.btnsearch = 'Cargar Renglones'
                        cmp.items_loading = false
                    }
                    else {
                        cmp.btnsearch = 'Cargar Renglones'
                        toastr.error('Error al intentar realizar la operación.')
                    }
                }).catch(function (error) {
                    cmp.btnsearch = 'Cargar Renglones'
                    toastr.error('Error al intentar realizar la operación.')
                    return;
                })
        },
        processEntry: function () {
            let cmp = this
            if (cmp.entry_error != '') {
                // Hide modal
                cmp.$refs.ConfirmClose.click()
                return
            }
            cmp.entry_loading = true
            let headers = {
                'User-Agent': 'testing/1.0',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + cmp.session.access_token
            }
            axios.post('http://localhost/semtinel/public/api/logistics/entry', {
                    'origin' : cmp.origin_data,
                    'items': cmp.items,
                    'destin': cmp.destiny_data,
                    'status': cmp.entry_status,
                    'user': cmp.session.id
                }, {
                    headers: headers
                }).then(function (response) {
                    if (response.data.success) {
                        // Hide modal
                        cmp.$refs.ConfirmClose.click()
                        cmp.entry_loading = false
                        if (parseInt(response.data.entry) > 0) {
                            window.open('http://localhost/semtinel/public/api/logistics/pdf/entry/' + response.data.entry, '_blank', 'noreferrer')
                        }                        
                        cmp.$router.push('/semtinel/logistics/entries')
                    }
                    else {
                        // Hide modal
                        cmp.$refs.ConfirmClose.click();
                        cmp.entry_loading = false
                        console.log(response.data.error)
                        toastr.error('Error al intentar realizar la operación.')
                    }
                }).catch(function (error) {
                    // Hide modal
                    cmp.$refs.ConfirmClose.click();
                    cmp.entry_loading = false
                    console.log('ERROR')
                    toastr.error('Error al intentar realizar la operación.')
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
        // Asign pole
        this.destiny_data.pole = this.session.poles[0]['abbr']
        // Asign proyects and select first
        this.changePole(this.session.poles[0]['id'], this.session.poles[0]['abbr'])
        // Asign first warehouse as destin
        //this.destiny_data.warehouse = this.warehouses[0].id
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
                            <label>Origen de la Mercancía</label>
                            <select 
                                name="origin" 
                                size="1" 
                                class="form-control"
                                :disabled="search_loading">
                                <option v-for="(option, index) in origin_data.origin_field_options" 
                                    :key="index"
                                    :value="index + 1"
                                    :selected="origin_data.origin === option"
                                    v-on:click.stop="changeOrigin(option)">
                                    {{ option }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-3 pl-1" v-if="origin_data.origin === 'Despacho de Almacén'">
                        <div class="form-group">
                            <label>{{ origin_data.doctype_title }}</label>
                            <select 
                                name="doctype" 
                                size="1" 
                                class="form-control"
                                :disabled="search_loading">
                                <option v-for="(option, index) in origin_data.doctype_field_options" 
                                    :key="index"
                                    :value="index + 1"
                                    :selected="origin_data.origin === option"
                                    v-on:click.stop="changeDoctype(option)">
                                    {{ option }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="pl-1" :class="(origin_data.origin !== 'Despacho de Almacén') ? 'col-md-3' : 'col-md-2'" 
                        v-if="origin_data.doctype_value === 'Conduce' || (origin_data.origin !== 'Despacho de Almacén' && origin_data.origin !== 'Transferencia de Pañol')">
                        <div class="form-group">
                            <label>Orden de Compra</label>
                            <input 
                                type="text" 
                                name="ocnumber" 
                                class="form-control"
                                :class="origin_data.error.ocnumber != '' ? 'border-error' : ''"
                                :disabled="search_loading" 
                                v-model="origin_data.ocnumber">
                            <span class="info-container" v-if="origin_data.error.ocnumber != ''">
                                <span class="form_error text-sm">{{ origin_data.error.ocnumber }}</span>
                            </span>
                        </div>
                    </div>
                    <div class="col-md-3 pl-1" v-if="origin_data.origin == 'Transferencia de Pañol'">
                        <div class="form-group">
                            <label>Pa&ntilde;ol</label>
                            <select 
                                name="origin" 
                                size="1" 
                                class="form-control">
                                <template v-for="(option, index) in warehouses" :key="index">
                                    <option
                                        :value="option['id']"
                                        v-on:click.stop="changeWarehouseOrigin(option['id'])">
                                        {{ option['name'] }}
                                    </option>
                                </template>
                            </select>
                        </div>
                    </div>
                    <div class="pl-1" :class="origin_data.doctype_value !== 'Conduce' ? 'col-md-3' : 'col-md-2'">
                        <div class="form-group">
                            <label>No. {{ origin_data.docnum_title }}</label>
                            <input 
                                type="text" 
                                name="docnumber" 
                                class="form-control"
                                :maxlength="(origin_data.origin == 'Despacho de Almacén') ? '5' : '20'"
                                :class="origin_data.error.docnum != '' ? 'border-error' : ''"
                                :disabled="search_loading" 
                                v-model="origin_data.docnum_value"
                                v-on:keyup.enter="getEntryData()">
                            <span class="info-container" v-if="origin_data.error.docnum != ''">
                                <span class="form_error text-sm">{{ origin_data.error.docnum }}</span>
                            </span>
                        </div>
                    </div>
                    <div :class="origin_data.doctype_value !== 'Conduce' ? 'col-md-3' : 'col-md-2'">
                        <button 
                            v-if="btnsearch != 'Loading'"
                            class="btn btn-primary ripple" 
                            style="margin-top: 30px;"
                            v-on:click="getEntryData()">
                            <span class='mdi mdi-magnify'></span> {{ btnsearch }}
                        </button>
                        <button 
                            v-else
                            disabled
                            class="btn btn-primary ripple" 
                            style="margin-top: 30px;">
                            <span class='mdi mdi-loading mdi-spin'>&nbsp;&nbsp;Cargando...</span>
                        </button>
                    </div>
                </div>
            </div>
            <!-- /.card-body -->
        </div>
        <!-- /.card -->

        <!-- Entry Details card -->
        <div class="card" v-if="show_items">
            <!-- card-header -->
            <div class="card-header">
                <h3 class="card-title float-left">Renglones Solicitados</h3>
                <span class="float-left ml-2 align-middle" style="margin-top: 2px;">({{ items_selected }} Recibidos en obra)</span>
                <div class="card-tools">
                    <button type="button" class="btn btn-tool" data-card-widget="collapse">
                        <i class="fas fa-minus"></i>
                    </button>
                </div>
            </div>
            <!-- /.card-header -->
            <!-- card-body -->
            <div class="card-body pt-1 pb-2">
                <!-- loading -->
                <div class="row" :class="!items_loading ? 'hidden' : ''">
                    <div class="col-12 text-center py-5 loading-table">
                        <span class="mdi mdi-loading mdi-spin mdi-36px">&nbsp;Cargando renglones...</span>
                    </div>
                </div>
                <!-- OC table -->
                <div class="row" :class="(items_loading || !table_oc) ? 'hidden' : ''">
                    <div class="col-12 table-responsive">
                        <table class="table table-striped">
                            <thead>
                            <tr>
                                <th width="50" class="text-center no-sort">No.</th>
                                <th>Descripción</th>
                                <th width="100" class="text-center no-sort">UM</th>
                                <th width="100" class="text-center no-sort">Ctdad Recibida</th>
                                <th width="100" class="text-right no-sort">Precio Unitario</th>
                                <th width="130" class="text-right no-sort">Importe Total</th>
                                <th width="150" class="text-center no-sort">Tarjeta Estiba</th>
                                <th width="200" class="no-sort">Comentario</th>
                                <th width="60" class="text-center no-sort">Recibir</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(item, idx) in items" :key="item.id">
                                <td class="text-center">{{ idx + 1 }}</td>
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
                                <td :id="'item-' + (idx + 1) + '-received'" class="text-center">{{ item.received_quantity }}</td>
                                <td class="text-right">{{ item.price_unit }}</td>
                                <td :id="'item-' + (idx + 1) + '-pricetotal'" class="text-right">{{ item.price_total }}</td>
                                <td :id="'item-' + (idx + 1) + '-stowagecard'" class="text-center">{{ item.stowage_card }}</td>
                                <td :id="'item-' + (idx + 1) + '-comment'">{{ item.comment }}</td>
                                <td class="text-center">
                                    <a href="javascript:void(0);"
                                        class="btn-semti-tool"
                                        style="padding: 4px 5px;"
                                        data-toggle="modal" 
                                        data-target="#modal-item-form"
                                        v-tooltip="'Anotar información de este Renglón'"
                                        v-on:click="edit(idx, item.oc, item.item_description, item.received_quantity, item.stowage_card, item.comment)">
                                        <span class="mdi mdi-pencil mdi-18px text-green"></span>
                                    </a>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <!-- picking table -->
                <div class="row" :class="(items_loading || table_oc) ? 'hidden' : ''">
                    <div class="col-12">
                        <table class="table table-striped">
                            <thead>
                            <tr>
                                <th width="50" class="text-center no-sort">No.</th>
                                <th>Descripción</th>
                                <th width="100" class="text-center no-sort">UM</th>
                                <th width="100" class="text-center no-sort">Ctdad Despachada</th>
                                <th width="100" class="text-center no-sort">Ctdad Recibida</th>
                                <th width="100" class="text-right no-sort">Precio Unitario</th>
                                <th width="130" class="text-right no-sort">Importe Total</th>
                                <th width="150" class="text-center no-sort">Tarjeta Estiba</th>
                                <th width="200" class="no-sort">Comentario</th>
                                <th width="60" class="text-center no-sort">Recibir</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(item, idx) in items" :key="item.id">
                                <td class="text-center">{{ idx + 1 }}</td>
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
                                <td class="text-center">{{ item.product_quantity }}</td>
                                <td :id="'item-' + (idx + 1) + '-received'" class="text-center">{{ item.received_quantity }}</td>
                                <td class="text-right">{{ item.price_unit }}</td>
                                <td :id="'item-' + (idx + 1) + '-pricetotal'" class="text-right">{{ item.price_total }}</td>
                                <td :id="'item-' + (idx + 1) + '-stowagecard'" class="text-center">{{ item.stowage_card }}</td>
                                <td :id="'item-' + (idx + 1) + '-comment'">{{ item.comment }}</td>
                                <td class="text-center">
                                    <a href="javascript:void(0);"
                                        class="btn-semti-tool"
                                        style="padding: 4px 5px;"
                                        data-toggle="modal" 
                                        data-target="#modal-item-form"
                                        v-tooltip="'Anotar información de este Renglón'"
                                        v-on:click="edit(idx, item.oc, item.item_description, item.received_quantity, item.stowage_card, item.comment, item.product_quantity)">
                                        <span class="mdi mdi-pencil mdi-18px text-green"></span>
                                    </a>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Entry destin card -->
        <div class="card card-default" v-if="show_items && !items_loading">
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
                    <div class="col-md-3 pl-md-3">
                        <div class="form-group">
                            <label>Polo</label>
                            <input 
                                type="text"
                                class="form-control"
                                :disabled="true"
                                v-model="pole_name" />
                            <!--<select 
                                name="entry_pole"
                                id="entry_pole" 
                                size="1" 
                                class="form-control">
                                <template v-for="(option, index) in store_poles" :key="index">
                                    <option 
                                        v-if="option['name'] != 'Todos'"
                                        :value="option['abbr']"
                                        v-on:click.stop="changePole(option['id'], option['abbr'])">
                                        {{ option['name'] }}
                                    </option>
                                </template>                                
                            </select>-->
                        </div>
                    </div>
                    <div class="col-md-3 pl-1">
                        <div class="form-group">
                            <label>Proyecto</label>
                            <input 
                                type="text"
                                class="form-control"
                                :disabled="true"
                                v-model="project_name" />
                            <!--<select 
                                name="project" 
                                size="1" 
                                class="form-control">
                                <template v-for="(option, index) in projects" :key="index">
                                    <option
                                        :value="option['id']"
                                        v-on:click.stop="changeProject(option['id'])">
                                        {{ option['name'] }}
                                    </option>
                                </template>                                
                            </select>-->
                        </div>
                    </div>
                    <div class="col-md-3 pl-1">
                        <div class="form-group">
                            <label>Pa&ntilde;ol</label>
                            <select 
                                name="origin" 
                                size="1" 
                                class="form-control"
                                v-model="destiny_data.warehouse">
                                <template v-for="(option, index) in warehouses" :key="index">
                                    <option
                                        :value="option['id']"
                                        v-on:click.stop="changeWarehouse(option['id'], option['name'], option['owner'])">
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
                                class="form-control"
                                :disabled="warehouses.length > 0 && destiny_data.warehouse_owner != ''"
                                v-model="destiny_data.warehouse_owner">
                        </div>
                    </div>                   
                </div>
                <div class="row">
                    <div class="col-12">
                        <div class="form-group">
                            <label>Comentario</label>
                            <textarea 
                                name="entry_comment" 
                                class="form-control"
                                v-model="destiny_data.comment">
                            </textarea>
                        </div>
                    </div>
                </div>
                <div class="row" v-if="origin_data.doctype_value === 'Conduce' || origin_data.origin !== 'Despacho de Almacén'">
                    <div class="form-group pt-2">
                        <label class="float-left mb-0 mt-1">Indique si la Entrada es Total o Parcial: </label>
                        <div class="form-check float-left ml-4">
                            <input 
                                class="form-check-input" 
                                type="radio" 
                                name="status" 
                                v-model="entry_status"
                                :value="'total'">
                            <label class="form-check-label">Total</label>
                        </div>
                        <div class="form-check float-left ml-4">
                            <input 
                                class="form-check-input" 
                                type="radio" 
                                name="status"
                                v-model="entry_status"
                                :value="'parcial'" 
                                :checked="true">
                            <label class="form-check-label">Parcial</label>
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
                    Registrar Entrada
                </button>
            </div>
        </div>
        <!-- /.card -->
    </div>

    <!-- Modal Form -->
    <div class="modal fade" id="modal-item-form" aria-hidden="true" role="dialog" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header header-green">
                    <h4 class="modal-title">Completar renglón recibido</h4>
                    <button type="button" 
                        ref="CloseEdit" 
                        class="close"
                        data-dismiss="modal" 
                        aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body px-4">
                    <form>
                        <input type="hidden" 
                            name="idx_item" 
                            id="idx_item"
                            v-model="item_form_data.idx">
                        <div class="row py-3">
                            <div class="col-md-12">
                                <h6 class="text-green">
                                    Está Actualizando la información del <strong>Renglón No. {{ item_form_data.number }}</strong>
                                </h6>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label for="received_quantity">Cantidad recibida:</label>
                                    <input type="number" 
                                        class="form-control"
                                        :class="item_form_error.received_quantity ? 'border-error' : ''"
                                        id="received_quantity"
                                        name="received_quantity"
                                        step=".01"
                                        min="0"
                                        v-model="item_form_data.received_quantity">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label for="stowage_card">Tarjeta de estiba destino:</label>
                                    <input 
                                        type="text" 
                                        class="form-control"
                                        :class="item_form_error.stowage_card ? 'border-error' : ''"
                                        :disabled="stowage_card_loading || item_form_data.has_stowage_card"
                                        id="stowage_card"
                                        name="stowage_card"
                                        :placeholder="stowage_card_loading ? 'Cargando Tarjeta de estiba...' : 'Introduzca el código de la tarjeta de estiba asignada'"
                                        v-model="item_form_data.stowage_card">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label for="stowage_card">Comentario:</label>
                                    <textarea 
                                        name="entry_comment" 
                                        class="form-control"
                                        v-model="item_form_data.comment">
                                    </textarea>
                                </div>
                            </div>
                        </div>
                        <div class="row pt-2" v-if="item_form_error.error_text != ''">
                            <div class="col-12 text-center">
                                <h6 class="form_error">{{ item_form_error.error_text }}</h6>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer justify-content-between">
                    <button type="button" class="btn btn-default ripple" data-dismiss="modal">Cancelar</button>
                    <button type="button" 
                    class="btn btn-primary btn-green ripple"
                    :disabled="item_form_loading || stowage_card_loading"
                    v-on:click.stop="updateItem()">
                        <i class="mdi mdi-check-all" v-if="!item_form_loading"></i>
                        <i class="mdi mdi-loading mdi-spin" v-else></i>
                        &nbsp;{{ item_form_okbtn_text }}
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!-- /.Modal Form -->

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
                            <span class="detail-title">Código del Producto</span>
                            <h6 class="detail-desc">{{ item_details.cod_product }}</h6>
                        </div>
                    </div>
                    <div class="row py-1">
                        <div class="col-md-12">
                            <span class="detail-title">Orden de Compra</span>
                            <h6 class="detail-desc">{{ item_details.oc }}</h6>
                        </div>
                    </div>
                    <div class="row py-1" v-if="table_oc && show_details">
                        <div class="col-md-12">
                            <span class="detail-title">Descripción del Producto</span>
                            <h6 class="detail-desc">{{ item_details.generic_descript.toUpperCase() }}</h6>
                        </div>
                    </div>
                    <div class="row py-1" v-if="!table_oc && show_details">
                        <div class="col-md-12">
                            <span class="detail-title">Documento</span>
                            <h6 class="detail-desc">{{ item_details.docnum }}</h6>
                        </div>
                    </div>
                    <div class="row py-1">
                        <div class="col-md-12">
                            <span class="detail-title">Descripción del Item</span>
                            <h6 class="detail-desc">{{ item_details.item_description.toUpperCase() }}</h6>
                        </div>
                    </div>
                    <div class="row py-1 mt-2">
                        <div :class="table_oc ? 'col-md-6' : 'col-md-4'">
                            <div class="text-center"><span class="detail-title">UM</span></div>
                            <h6 class="detail-desc text-center">{{ item_details.um }}</h6>
                        </div>
                        <div :class="table_oc ? 'col-md-6' : 'col-md-4'" v-if="!table_oc">
                            <div class="text-center"><span class="detail-title">Ctdad Despachada</span></div>
                            <h6 class="detail-desc text-center">{{ item_details.product_quantity }}</h6>
                        </div>
                        <div :class="table_oc ? 'col-md-6' : 'col-md-4'">
                            <div class="text-center"><span class="detail-title">Ctdad Recibida</span></div>
                            <h6 class="detail-desc text-center">{{ item_details.received_quantity }}</h6>
                        </div>
                    </div>
                    <div class="row py-1">
                        <div class="col-md-4">
                            <div class="text-center"><span class="detail-title">Precio Unitario</span></div>
                            <h6 class="detail-desc text-center">{{ item_details.price_unit }}</h6>
                        </div>
                        <div class="col-md-4">
                            <div class="text-center"><span class="detail-title">Importe Total</span></div>
                            <h6 class="detail-desc text-center">{{ item_details.price_total }}</h6>
                        </div>
                        <div class="col-md-4">
                            <div class="text-center"><span class="detail-title">Tarjeta de Estiba</span></div>
                            <h6 class="detail-desc text-center">{{ item_details.stowage_card }}</h6>
                        </div>
                    </div>
                    <div class="row py-1" v-if="item_details.comment != '' && item_details.comment != null">
                        <div class="col-md-12">
                            <span class="detail-title">Comentario</span>
                            <h6 class="detail-desc">{{ item_details.comment }}</h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- /.Modal Details -->

    <!-- Modal Entry confirm -->
    <div class="modal fade" id="modal-entry-confirm" aria-hidden="true" role="dialog" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
        <div class="modal-header">
            <h4 class="modal-title">Nueva entrada de mercancía en obra</h4>
            <button type="button" ref="ConfirmClose" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body px-4 pt-2 pb-4">
            <div v-if="entry_error == ''">
                <div class="float-start" style="width: 70px"><i class="mdi mdi-chat-question mdi-48px"></i></div>
                <div class="float-start pt-3" style="width: 85%">
                    <p>
                        Se registrará una nueva Entrada desde "<strong>{{ origin_data.origin }}</strong>" del documento No. "<strong>{{ origin_data.docnum_value }}</strong>", con la recepción de "<strong>{{ items_selected }} Renglones</strong>" en envío de mercancia a la obra, hacia el destino "<strong>{{ destiny_data.warehouse_name }}</strong>".<br>¿Confirma que desea realizar esta operación?
                    </p>
                </div>
            </div>
            <div class="row pt-2" v-if="entry_error != ''">
                <div class="float-start text-danger" style="width: 70px"><i class="mdi mdi-alert-circle mdi-48px"></i></div>
                <div class="float-start form_error pt-3" style="width: 85%">{{ entry_error }}</div>
            </div>
        </div>
        <div class="modal-footer justify-content-between">
            <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
            <button type="button" 
                class="btn ripple"
                :class="entry_error != '' ? 'btn-secondary' : 'btn-primary'"
                v-on:click.stop="processEntry()">
                <i class="mdi mdi-check-all" v-if="!entry_loading"></i>&nbsp;{{ entry_okbtn_text }}
            </button>
        </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
    </div>
    <!-- /.modal entry confirm -->
</template>