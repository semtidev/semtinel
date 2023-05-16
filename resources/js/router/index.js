import { createRouter, createWebHistory } from 'vue-router';

// LOGISTICS
const LogisticsHomeComponent = () => import('../components/logistics/HomeComponent.vue');
const LogisticsEntryComponent = () => import('../components/logistics/EntryComponent.vue');
const LogisticsEntriesComponent = () => import('../components/logistics/EntriesComponent.vue');
const LogisticsInventoryComponent = () => import('../components/logistics/InventoryComponent.vue');
const LogisticsOutputComponent = () => import('../components/logistics/OutputComponent.vue');
const LogisticsOutputsComponent = () => import('../components/logistics/OutputsComponent.vue');
const LogisticsEntryDetailComponent = () => import('../components/logistics/EntryDetailComponent.vue');
const LogisticsOutputDetailComponent = () => import('../components/logistics/OutputDetailComponent.vue');
const LogisticsGoodsflowComponent = () => import("../components/logistics/goodsflow/GoodsflowComponent.vue");

// ADMINISTRATOR
const AdminComponent = () => import('../components/admin/HomeComponent.vue');
const AdminSystemsComponent = () => import('../components/admin/SystemsComponent.vue');
const AdminUsersComponent = () => import('../components/admin/UsersComponent.vue');
const AdminRolesComponent = () => import('../components/admin/RolesComponent.vue');
const AdminSecurityComponent = () => import('../components/admin/SecurityComponent.vue');
const AdminWarehousesComponent = () => import('../components/admin/WarehousesComponent.vue');

const routes = [
    {
        path: '/semtinel/public/admin',
        name: 'admin.home',
        component: AdminComponent
    },
    {
        path: '/semtinel/public/admin/systems',
        name: 'admin.systems',
        component: AdminSystemsComponent
    },
    {
        path: '/semtinel/public/admin/users',
        name: 'admin.users',
        component: AdminUsersComponent
    },
    {
        path: '/semtinel/public/admin/roles',
        name: 'admin.roles',
        component: AdminRolesComponent
    },
    {
        path: '/semtinel/public/admin/security',
        name: 'admin.security',
        component: AdminSecurityComponent
    },
    {
        path: '/semtinel/public/admin/warehouses',
        name: 'admin.warehouses',
        component: AdminWarehousesComponent
    },
    {
        path: '/semtinel/public/logistics',
        name: 'logistics.home',
        component: LogisticsHomeComponent
    },
    {
        path: '/semtinel/public/logistics/entry',
        name: 'logistics.entry',
        component: LogisticsEntryComponent
    },
    {
        path: '/semtinel/public/logistics/entries',
        name: 'logistics.entries',
        component: LogisticsEntriesComponent
    },
    {
        path: '/semtinel/public/logistics/inventory',
        name: 'logistics.inventory',
        component: LogisticsInventoryComponent
    },
    {
        path: '/semtinel/public/logistics/output',
        name: 'logistics.output',
        component: LogisticsOutputComponent
    },
    {
        path: '/semtinel/public/logistics/outputs',
        name: 'logistics.outputs',
        component: LogisticsOutputsComponent
    },
    {
        path: '/semtinel/public/logistics/entry.detail/:entry',
        name: 'logistics.entry.detail',
        component: LogisticsEntryDetailComponent,
        props: true
    },
    {
        path: '/semtinel/public/logistics/output.detail/:output',
        name: 'logistics.output.detail',
        component: LogisticsOutputDetailComponent,
        props: true
    },
    {
        path: '/semtinel/public/logistics/goodsflow',
        name: 'logistics.goodsflow',
        component: LogisticsGoodsflowComponent
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router