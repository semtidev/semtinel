<script>
export default {
    data: function () {
        return {
            app_name: 'admin',
            page_active: 'home'
        };
    },
    watch: {
        $route(to, from) {
            this.page_active = this.$root.page_active
        }
    },
};
</script>

<template>
    <nav class="mt-2">
    <ul class="nav nav-pills nav-sidebar flex-column nav-child-indent" data-widget="treeview" role="menu" data-accordion="false">
        <!-- Add icons to the links using the .nav-icon class
            with font-awesome or any other icon font library -->
        <li class="nav-header">SEMTINEL</li>
        <li class="nav-item">
            <a href="#" 
                class="nav-link" 
                :class="(page_active == 'systems' || page_active == 'users' || page_active == 'roles' || page_active == 'security') ? 'active' : ''">
              <i class="nav-icon mdi mdi-cog"></i>
              <p>
                Configuraci&oacute;n
                <i class="right fas fa-angle-left"></i>
              </p>
            </a>
            <ul class="nav nav-treeview">
                <li class="nav-item">
                    <router-link 
                        to="/semtinel/public/admin/systems" 
                        class="nav-link"
                        :class="(app_name == 'admin' && page_active == 'systems') ? 'active' : ''">
                        <i class="nav-icon mdi mdi-application-brackets-outline"></i>
                        <p class="text">Sistemas</p>
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link 
                        to="/semtinel/public/admin/users" 
                        class="nav-link"
                        :class="(app_name == 'admin' && page_active == 'users') ? 'active' : ''">
                        <i class="nav-icon mdi mdi-account-multiple"></i>
                        <p class="text">Usuarios</p>
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link 
                        to="/semtinel/public/admin/roles" 
                        class="nav-link"
                        :class="(app_name == 'admin' && page_active == 'roles') ? 'active' : ''">
                        <i class="nav-icon mdi mdi-badge-account-horizontal"></i>
                        <p class="text">Roles</p>
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link 
                        to="/semtinel/public/admin/security" 
                        class="nav-link"
                        :class="(app_name == 'admin' && page_active == 'security') ? 'active' : ''">
                        <i class="nav-icon mdi mdi-account-key"></i>
                        <p class="text">Permisos</p>
                    </router-link>
                </li>
            </ul>
        </li>       
        <li class="nav-item" :class=" page_active == 'tree_structures' ? 'menu-is-opening menu-open' : '' ">
            <a href="#" class="nav-link">
                <i class="nav-icon mdi mdi-file-tree"></i>
                <p>
                    Estructuras
                    <i class="right fas fa-angle-left"></i>
                </p>
            </a>
            <ul class="nav nav-treeview">
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="mdi mdi-plus-network nav-icon"></i>
                        <p>OBES</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a id="lnk-tree-structures" href="tree_structures" class="nav-link" :class=" page_active == 'tree_structures' ? 'active' : '' ">
                        <i class="mdi mdi-plus-network nav-icon"></i>
                        <p>Proyectos</p>
                    </a>
                </li>
            </ul>
        </li>
        <li class="nav-item">
            <a href="#" class="nav-link" :class="(page_active == 'warehouse') ? 'active' : ''">
                <i class="nav-icon mdi mdi-truck-check"></i>
                <p>
                    Log&iacute;stica
                    <i class="right fas fa-angle-left"></i>
                </p>
            </a>
            <ul class="nav nav-treeview">
                <li class="nav-item">
                    <router-link 
                        to="/semtinel/public/admin/warehouses" 
                        class="nav-link"
                        :class="(app_name == 'admin' && page_active == 'warehouse') ? 'active' : ''">
                        <i class="mdi mdi-warehouse nav-icon"></i>
                        <p>Almacenes</p>
                    </router-link>
                </li>
            </ul>
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