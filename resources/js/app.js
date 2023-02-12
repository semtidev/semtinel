// IMPORTS

// Vendor
import './bootstrap';
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import FloatingVue from 'floating-vue'
import { createApp, ref, computed, watch } from 'vue';
import router from './router';
import { useRoute } from 'vue-router';

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
                'logistics': 'entry,entries,inventory,output,outputs'
            },
            app_name: 'semtinel',
            page_active: 'home',
            session: JSON.parse(sessionStorage.getItem('semtinel'))
        };
    },
    async created() {
        let cmp = this
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
            });
        await fetch("http://localhost/semtinel/api/projects", {
                method: 'GET',
                headers: headers
            })
            .then((response) => response.json())
            .then((data) => {
                // Projects store
                localStorage.setItem('semtinel_projects', JSON.stringify(data))
            });
        await fetch("http://localhost/semtinel/api/logistics/warehouses", {
                method: 'GET',
                headers: headers
            })
            .then((response) => response.json())
            .then((data) => {
                // Warehouses store
                localStorage.setItem('semtinel_warehouses', JSON.stringify(data))
            });
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
        setAppActive: function (url = 'home') {
            const cmp = this
            if (url == 'home') {
                cmp.app_name = 'semtinel'
                cmp.page_active = 'home'
            }
            else {
                cmp.appurl = url
                let url_parts = url.split('/')
                for (const appname in cmp.apps) {
                    const pages = cmp.apps[appname].split(',')
                    for (const key_page in pages) {
                        for (const key_part in url_parts) {
                            if (url_parts[key_part] == appname) {
                                cmp.app_name = appname
                            }
                            if (url_parts[key_part] == pages[key_page]) {
                                cmp.page_active = pages[key_page]
                            }
                        }
                    }
                }
            }
        },
        changeAppActive: function() {
            LogisticsSidebarComponent.data.page_active = 'home'
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

app.use(router);
app.use(FloatingVue)
app.mount('#app');
app.mounted
