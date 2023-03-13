<script allowJs="true">
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery";

export default {
    data: function () {
      return {
        session: JSON.parse(sessionStorage.getItem('semtinel'))
      };
    },
    watch: {
        
    },
    components: {
        
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
        await fetch("http://localhost/semtinel/api/logistics/warehouses", {
                method: 'GET',
                headers: headers
            })
            .then((response) => response.json())
            .then((data) => {
                // Warehouses store
                localStorage.setItem('semtinel_warehouses', JSON.stringify(data))
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
    <h1>I'm Home component</h1>
</template>