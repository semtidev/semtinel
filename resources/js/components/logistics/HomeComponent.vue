<script allowJs="true">
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery";

export default {
    data: function () {
      return {
        project: localStorage.getItem('stnel_logist_project'),
        session: JSON.parse(sessionStorage.getItem('semtinel'))
      };
    },
    watch: {
        
    },
    components: {
        
    },
    async created() {
        let cmp = this
        // Clear warehouse store
        localStorage.setItem('stnel_warehouses', '')
        // ---------------------------
        //   Create app local stores
        // ---------------------------
        let headers = {
            'User-Agent': 'testing/1.0',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + cmp.session.access_token
        }
        await fetch("http://localhost/semtinel/api/logistics/warehouses/" + cmp.project, {
                method: 'GET',
                headers: headers
            })
            .then((response) => response.json())
            .then((data) => {
                // Warehouses store
                localStorage.setItem('stnel_warehouses', JSON.stringify(data))
            });
        await fetch("http://localhost/semtinel/api/logistics/products_categories", {
                method: 'GET',
                headers: headers
            })
            .then((response) => response.json())
            .then((data) => {
                // Warehouses store
                localStorage.setItem('semtinel_products_categories', JSON.stringify(data))
            });
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
        <div class="app-subtitle">Sistema de Gesti&oacute;n de Pa&ntilde;oles</div>
    </div>
</template>