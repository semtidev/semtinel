<script allowJs="true">
export default {    
    data: function () {
        return {
            app_name: 'logistics',
            page_active: 'home'
        };
    },
    watch: {
        $route(to, from) {
            this.page_active = this.$root.page_active
        }
    }
}
</script>

<template>
    <nav class="mt-2">
        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            <!-- Add icons to the links using the .nav-icon class
                with font-awesome or any other icon font library -->
            
            <li class="nav-header">RECEPCI&Oacute;N</li>
            <li class="nav-item">
                <router-link 
                    to="/semtinel/logistics/entry" 
                    class="nav-link" 
                    :class="(app_name == 'logistics' && page_active == 'entry') ? 'active' : ''">
                    <i class="nav-icon mdi mdi-truck-check-outline"></i>
                    <p class="text">Nueva Entrada</p>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link 
                    to="/semtinel/logistics/entries" 
                    class="nav-link" 
                    :class="(app_name == 'logistics' && page_active == 'entries') ? 'active' : ''">
                    <i class="nav-icon mdi mdi-format-list-bulleted-square"></i>
                    <p class="text">Todas las Entradas</p>
                </router-link>
            </li>
            <li class="nav-header">INVENTARIOS</li>
            <li class="nav-item">
                <router-link 
                    to="/semtinel/logistics/inventory" 
                    class="nav-link" 
                    :class="(app_name == 'logistics' && page_active == 'inventory') ? 'active' : ''">
                    <i class="nav-icon mdi mdi-inbox-full"></i>
                    <p class="text">Inventarios en obra</p>
                </router-link>
            </li>
            <li class="nav-header">DESPACHO</li>
            <li class="nav-item">
                <router-link 
                    to="/semtinel/logistics/output" 
                    class="nav-link" 
                    :class="(app_name == 'logistics' && page_active == 'output') ? 'active' : ''">
                    <i class="nav-icon mdi mdi-cart-arrow-right"></i>
                    <p class="text">Nueva Salida</p>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link 
                    to="/semtinel/logistics/outputs" 
                    class="nav-link" 
                    :class="(app_name == 'logistics' && page_active == 'outputs') ? 'active' : ''">
                    <i class="nav-icon mdi mdi-format-list-bulleted-square"></i>
                    <p class="text">Todas las Salidas</p>
                </router-link>
            </li>
            <li class="nav-header">NOTIFICACIONES</li>
            <li class="nav-item">
                <a href="#" class="nav-link">
                    <i class="nav-icon far fa-circle text-danger"></i>
                    <p class="text">Importante</p>
                </a>
            </li>
            <li class="nav-item">
                <a href="#" class="nav-link">
                    <i class="nav-icon far fa-circle text-warning"></i>
                    <p>Alerta</p>
                </a>
            </li>
            <li class="nav-item">
                <a href="#" class="nav-link">
                    <i class="nav-icon far fa-circle text-info"></i>
                    <p>Informatión</p>
                </a>
            </li>
        </ul>
    </nav>
</template>