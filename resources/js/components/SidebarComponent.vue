<template>
    <nav class="mt-2">
    <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
        <!-- Add icons to the links using the .nav-icon class
            with font-awesome or any other icon font library -->
        
        <li class="nav-header">CONFIGURACIÓN</li>
        <li class="nav-item">
            <a href="#" class="nav-link">
                <i class="nav-icon mdi mdi-application-brackets-outline"></i>
                <p class="text">Sistemas</p>
            </a>
        </li>
        <li class="nav-item" :class=" page_active == 'users' ? 'menu-is-opening menu-open' : '' ">
            <a href="#" class="nav-link">
              <i class="nav-icon mdi mdi-account-group-outline"></i>
              <p>
                Usuarios
                <i class="right fas fa-angle-left"></i>
              </p>
            </a>
            <ul class="nav nav-treeview">
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="nav-icon mdi mdi-account-multiple"></i>
                        <p class="text">Usuarios</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="nav-icon mdi mdi-account-star"></i>
                        <p class="text">Roles</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="nav-icon mdi mdi-account-key"></i>
                        <p class="text">Permisos</p>
                    </a>
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

<script setup>
    const url   = window.location.href
    const pages = [
            'tree_structures',
            'new_structure'
        ];
    let page_active = '';
    for (const key in pages) {
        if (url.toLowerCase().indexOf(pages[key]) >= 0)
        page_active = pages[key];
    }
    /*export default {
        mounted() {
            console.log('Component mounted.')
        }
    }*/
</script>
