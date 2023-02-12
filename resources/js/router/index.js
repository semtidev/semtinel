import { createRouter, createWebHistory } from 'vue-router';

// LOGISTICS
const LogisticsHomeComponent = () => import('../components/logistics/HomeComponent.vue');
const LogisticsEntryComponent = () => import('../components/logistics/EntryComponent.vue');
const LogisticsEntriesComponent = () => import('../components/logistics/EntriesComponent.vue');
const LogisticsInventoryComponent = () => import('../components/logistics/InventoryComponent.vue');
const LogisticsOutputComponent = () => import('../components/logistics/OutputComponent.vue');
const LogisticsOutputsComponent = () => import('../components/logistics/OutputsComponent.vue');
const LogisticsEntryDetailComponent = () => import('../components/logistics/EntryDetailComponent.vue');

// ADMINISTRATOR
const AdminComponent = () => import('../components/admin/HomeComponent.vue');
const AdminSystemsComponent = () => import('../components/admin/SystemsComponent.vue');
const AdminUsersComponent = () => import('../components/admin/UsersComponent.vue');
const AdminRolesComponent = () => import('../components/admin/RolesComponent.vue');
const AdminSecurityComponent = () => import('../components/admin/SecurityComponent.vue');
const AdminWarehousesComponent = () => import('../components/admin/WarehousesComponent.vue');

const routes = [
    {
        path: '/semtinel/admin',
        name: 'admin.home',
        component: AdminComponent
    },
    {
        path: '/semtinel/admin/systems',
        name: 'admin.systems',
        component: AdminSystemsComponent
    },
    {
        path: '/semtinel/admin/users',
        name: 'admin.users',
        component: AdminUsersComponent
    },
    {
        path: '/semtinel/admin/roles',
        name: 'admin.roles',
        component: AdminRolesComponent
    },
    {
        path: '/semtinel/admin/security',
        name: 'admin.security',
        component: AdminSecurityComponent
    },
    {
        path: '/semtinel/admin/warehouses',
        name: 'admin.warehouses',
        component: AdminWarehousesComponent
    },
    {
        path: '/semtinel/logistics',
        name: 'logistics.home',
        component: LogisticsHomeComponent
    },
    {
        path: '/semtinel/logistics/entry',
        name: 'logistics.entry',
        component: LogisticsEntryComponent
    },
    {
        path: '/semtinel/logistics/entries',
        name: 'logistics.entries',
        component: LogisticsEntriesComponent
    },
    {
        path: '/semtinel/logistics/inventory',
        name: 'logistics.inventory',
        component: LogisticsInventoryComponent
    },
    {
        path: '/semtinel/logistics/output',
        name: 'logistics.output',
        component: LogisticsOutputComponent
    },
    {
        path: '/semtinel/logistics/outputs',
        name: 'logistics.outputs',
        component: LogisticsOutputsComponent
    },
    {
        path: '/semtinel/logistics/entry.detail/:entry',
        name: 'logistics.entry.detail',
        component: LogisticsEntryDetailComponent,
        props: true
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router