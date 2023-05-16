// IMPORTS

// Vendor
import './bootstrap';
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import FloatingVue from 'floating-vue'
import { createApp, ref, computed, watch } from 'vue';
import { createPinia } from "pinia";
import router from './router';
import VueDragscroll from "vue-dragscroll";


// App
import AppSidebarComponent from './components/SidebarComponent.vue';
import TreestructuresComponent from './components/TreestructuresComponent.vue';
import HeaderComponent from './components/layouts/HeaderComponent.vue';
import ControlSidebarComponent from './components/layouts/ControlSidebarComponent.vue';
// Admin
import AdminSidebarComponent from './components/admin/SidebarComponent.vue';
// Logistics
import LogisticsSidebarComponent from './components/logistics/SidebarComponent.vue';

const app = createApp({
    data() {
        return {
            appurl: '',
            apps: {
                'admin': 'systems,users,roles,security,warehouse',
                'logistics': 'entry,entries,inventory,output,outputs,goodsflow'
            },
            app_name: 'semtinel',
            page_active: 'home',
            cart_items: [],
            cart_quantity: 0,
            cart_warehouse: '',
            cart_totals: {
                price_total: 0
            },
            session: JSON.parse(sessionStorage.getItem('semtinel'))
        };
    },
    async created() {
        /*let cmp = this
        // ---------------------------
        //   Create app local stores
        // ---------------------------
        let headers = {
            'User-Agent': 'testing/1.0',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + cmp.session.access_token
        }
        await fetch("http://localhost/semtinel/api/poles", {
                method: 'GET',
                headers: headers
            })
            .then((response) => response.json())
            .then((data) => {
                // Poles store
                localStorage.setItem('semtinel_poles', JSON.stringify(data))
            });*/
        /*await fetch("http://localhost/semtinel/api/projects", {
                method: 'GET',
                headers: headers
            })
            .then((response) => response.json())
            .then((data) => {
                // Projects store
                localStorage.setItem('semtinel_projects', JSON.stringify(data))
            });*/
    },
    mounted() {
        // Start bootstrap tooltips
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        });
    },
    watch: {
        $route(to, from) {
            this.setAppActive(to.fullPath)
        }
    },
    methods: {
        
        /**
         *  Main App
         */

        setAppActive: function (url = 'home') {
            const cmp = this
            if (url == 'home') {
                cmp.app_name = 'semtinel'
                cmp.page_active = 'home'
            }
            else {
                cmp.appurl = url
                let url_parts = url.split('/'), app_name_assigned = false, page_active_assigned = false
                for (const appname in cmp.apps) {
                    const pages = cmp.apps[appname].split(',')
                    for (const key_page in pages) {
                        for (const key_part in url_parts) {
                            if (url_parts[key_part] == appname) {
                                cmp.app_name = appname
                                app_name_assigned = true
                            }
                            if (url_parts[key_part] == pages[key_page]) {
                                cmp.page_active = pages[key_page]
                                page_active_assigned = true
                            }
                        }
                    }
                }
                if (app_name_assigned && !page_active_assigned) {
                    cmp.page_active = 'home'
                }
            }
        },
        changeAppActive: function() {
            LogisticsSidebarComponent.data.page_active = 'home'
        },

        /**
         *  Logistic App
         */

        goToInventory: function () {
            this.$refs.CartClose.click()
            this.$router.push('/semtinel/public/logistics/inventory')
        },
        goToOutput: function () {
            this.$refs.CartClose.click()
            this.$router.push('/semtinel/public/logistics/output')
        },
        calcTotalsCart: function () {
            let cmp = this
            if (cmp.cart_quantity == 0) {
                cmp.cart_warehouse = ''
                return;
            }
            // initialize quantities
            cmp.cart_totals.price_total = 0
            cmp.cart_items.map(function(product) {
                cmp.cart_totals.price_total += parseFloat(product.price_total)
            });
        },
        removeFromCart: function (idx) {
            let cmp = this
            cmp.cart_items.splice(idx, 1)
            cmp.cart_quantity -= 1
            cmp.calcTotalsCart()
        }
    }
});


// COMPONENTS

// App
app.component('sidebar-component', AppSidebarComponent);
app.component('tree-structures', TreestructuresComponent);
app.component('header-content', HeaderComponent);
app.component('control-sidebar', ControlSidebarComponent);
// Admin
app.component('admin-sidebar', AdminSidebarComponent);
// Logistics
app.component('logistics-sidebar', LogisticsSidebarComponent);

// Pinia
const pinia = createPinia();
app.use(pinia);

// Router
app.use(router);

// Dragscroll
app.use(VueDragscroll);

// FloatingVue
app.use(FloatingVue)

app.mount('#app');
app.mounted
