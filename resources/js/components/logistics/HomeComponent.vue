<script allowJs="true">
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery";

export default {
    data: function () {
      return {
        project: sessionStorage.getItem('stnel_logist_project'),
        session: JSON.parse(sessionStorage.getItem('semtinel')),
        warehouses_load: false,
        categories_load: false
      };
    },
    watch: {
        warehouses_load: function (val) {
            if (val && this.categories_load) {
                this.$root.app_load = true
            }
        },
        categories_load: function (val) {
            if (val && this.warehouses_load) {
                this.$root.app_load = true
            }
        }
    },
    components: {
        
    },
    async created() {
        let cmp = this
        
        if (
            sessionStorage.getItem('stnel_logist_warehouses') && 
            sessionStorage.getItem('stnel_logist_warehouses') != '' &&
            sessionStorage.getItem('stnel_prod_categories') && 
            sessionStorage.getItem('stnel_prod_categories') != ''
        ) {
            cmp.warehouses_load = true
            cmp.categories_load = true
        }
        else {
            let headers = {
                'User-Agent': 'testing/1.0',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + cmp.session.access_token
            }
            await fetch("http://localhost/semtinel/public/api/logistics/warehouses/" + cmp.project, {
                    method: 'GET',
                    headers: headers
                })
                .then((response) => response.json())
                .then((data) => {
                    // Warehouses store
                    sessionStorage.setItem('stnel_logist_warehouses', JSON.stringify(data))
                    cmp.warehouses_load = true
                });
            await fetch("http://localhost/semtinel/public/api/logistics/products_categories", {
                    method: 'GET',
                    headers: headers
                })
                .then((response) => response.json())
                .then((data) => {
                    // Warehouses store
                    sessionStorage.setItem('stnel_prod_categories', JSON.stringify(data))
                    cmp.categories_load = true
                });
        }
<<<<<<< HEAD
=======
        /*await fetch("http://localhost/semtinel/public/api/logistics/warehouses/" + cmp.project, {
                method: 'GET',
                headers: headers
            })
            .then((response) => response.json())
            .then((data) => {
                // Warehouses store
                localStorage.setItem('stnel_warehouses', JSON.stringify(data))
            });*/
        await fetch("http://localhost/semtinel/public/api/logistics/products_categories", {
                method: 'GET',
                headers: headers
            })
            .then((response) => response.json())
            .then((data) => {
                // Warehouses store
                localStorage.setItem('semtinel_products_categories', JSON.stringify(data))
            });
>>>>>>> 83270e2175dbb7c560aae0254ff43869c130eb8f
    },
    methods: {
        
    },
    mounted() {
        
    },
};    
</script>

<template>
    <div class="h-100 text-center app_name">
        <div class="text-center"><i class="mdi mdi-truck-check mdi-72px text-success"></i></div>
        <div class="app-title">Semtinel - Logística</div>
        <div class="app-subtitle">Gesti&oacute;n y Control de Log&iacute;stica en obras</div>
    </div>
</template>