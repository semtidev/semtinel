/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

import './bootstrap';
import { createApp, ref } from 'vue';

/**
 * Next, we will create a fresh Vue application instance. You may then begin
 * registering components with the application instance so they are ready
 * to use in your application's views. An example is included for you.
 */

const app = createApp({
    data() {
        return {
            treeStructure: {
                node_type: "pole",
                parent_id: "",
                parent_name: "Polos",
                structure_id: "",
                structure_name: "",
                structure_abbr: "",
                active: true,
                invalid_form: true,
                save_text: "Guardar",
                delete_text: "Eliminar"
            },
            form_processing: false,
            ldap_processing: false,
            auth_processing: false,
            error_txt: ""
        };
    },
    watch: {
        ldap_processing: function(val){
            this.form_processing = val
        },
        auth_processing: function(val){
            this.form_processing = val
        },
    },
    methods: {
        setDataForm(node_type, parent_id, parent_name, structure_id, structure_name, structure_abbr, active) {
            this.treeStructure.node_type      = node_type
            this.treeStructure.parent_id      = parent_id
            this.treeStructure.parent_name    = parent_name
            this.treeStructure.structure_id   = structure_id
            this.treeStructure.structure_name = structure_name
            this.treeStructure.structure_abbr = structure_abbr
            this.treeStructure.active         = active
            this.treeStructure.invalid_form   = false
        },
        createStructure() {
            let cmp = this, ul = "";
            cmp.treeStructure.structure_id   = ""
            cmp.treeStructure.structure_name = ""
            cmp.treeStructure.structure_abbr = ""
            cmp.treeStructure.active         = true

            switch (cmp.treeStructure.node_type) {
                case 'pole':
                    ul = document.getElementById('structures-tree')
                    break;
                case 'project':
                    ul = document.getElementById('ul-p' + cmp.treeStructure.parent_id)
                    break;
                case 'zone':
                    ul = document.getElementById('ul-pj' + cmp.treeStructure.parent_id)
                    break;
                case 'object':
                    ul = document.getElementById('ul-zn' + cmp.treeStructure.parent_id)
                    break;
                default:
                    ul = document.getElementById('ul-ob' + cmp.treeStructure.parent_id)
                    break;
            }

            // Delete current li focus
            ul.querySelectorAll("li").forEach((li) => li.classList.remove("active"));
            ul.querySelectorAll("a").forEach((a) => {
                a.classList.remove("active")
                a.classList.remove("node-selected")
            });
            document.getElementById('name').focus()
        },
        createSon() {
            let cmp = this, ul = "";
            if (cmp.treeStructure.node_type == 'pole') {
                ul = document.getElementById('structures-tree');
                cmp.treeStructure.node_type = 'project';
            }
            else if (cmp.treeStructure.node_type == 'project') {
                ul = document.getElementById('ul-p' + cmp.treeStructure.parent_id);
                cmp.treeStructure.node_type = 'zone';
            }
            else if (cmp.treeStructure.node_type == 'zone') {                
                ul = document.getElementById('ul-pj' + cmp.treeStructure.parent_id);
                cmp.treeStructure.node_type = 'object';
            }
            else if (cmp.treeStructure.node_type == 'object') {
                ul = document.getElementById('ul-zn' + cmp.treeStructure.parent_id);
                cmp.treeStructure.node_type = 'part';
            }
            else {
                ul = document.getElementById('ul-ob' + cmp.treeStructure.parent_id);
            }
            
            cmp.treeStructure.parent_id      = cmp.treeStructure.structure_id
            cmp.treeStructure.parent_name    = cmp.treeStructure.parent_name + ' / ' + cmp.treeStructure.structure_name
            cmp.treeStructure.structure_id   = ""
            cmp.treeStructure.structure_name = ""
            cmp.treeStructure.structure_abbr = ""
            cmp.treeStructure.active         = true

            document.getElementById('name').focus();
            
            // Delete current li focus
            ul.querySelectorAll("li").forEach((li) => li.classList.remove("active"));
            ul.querySelectorAll("a").forEach((a) => {
                a.classList.remove("active")
                a.classList.remove("node-selected")
            });            
        },
        createPole() {
            let cmp = this, ul = "";
            if (cmp.treeStructure.node_type == 'pole') {
                ul = document.getElementById('structures-tree');
                cmp.treeStructure.node_type = 'project';
            }
            else if (cmp.treeStructure.node_type == 'project') {
                ul = document.getElementById('ul-p' + cmp.treeStructure.parent_id);
                cmp.treeStructure.node_type = 'zone';
            }
            else if (cmp.treeStructure.node_type == 'zone') {                
                ul = document.getElementById('ul-pj' + cmp.treeStructure.parent_id);
                cmp.treeStructure.node_type = 'object';
            }
            else if (cmp.treeStructure.node_type == 'object') {
                ul = document.getElementById('ul-zn' + cmp.treeStructure.parent_id);
                cmp.treeStructure.node_type = 'part';
            }
            else {
                ul = document.getElementById('ul-ob' + cmp.treeStructure.parent_id);
            }
            
            cmp.treeStructure.node_type      = "pole"
            cmp.treeStructure.parent_id      = 0
            cmp.treeStructure.parent_name    = "Polos"
            cmp.treeStructure.structure_id   = ""
            cmp.treeStructure.structure_name = ""
            cmp.treeStructure.structure_abbr = ""
            cmp.treeStructure.active         = true

            document.getElementById('name').focus();
            
            // Delete current li focus
            ul.querySelectorAll("li").forEach((li) => li.classList.remove("active"));
            ul.querySelectorAll("a").forEach((a) => {
                a.classList.remove("active")
                a.classList.remove("node-selected")
            });            
        },
        async updateStructure() {
            var cmp = this, icon = "", ul = "", lid = "";             
            cmp.treeStructure.invalid_form = true
            cmp.treeStructure.save_text = "Procesando..."

            if (cmp.treeStructure.node_type == 'pole') {
                icon = "<i class='fas fa-map-marker-alt'></i>";
                ul   = document.getElementById('structures-tree');
                lid  = 'p';
            }
            else if (cmp.treeStructure.node_type == 'project') {
                icon = "<i class='fas fa-hotel'></i>";
                ul   = document.getElementById('ul-p' + cmp.treeStructure.parent_id);
                lid  = 'pj';
            }
            else if (cmp.treeStructure.node_type == 'zone') {
                icon = "<i class='mdi mdi-map-check mdi-18px'></i>";
                ul   = document.getElementById('ul-pj' + cmp.treeStructure.parent_id);
                lid  = 'zn';
            }
            else if (cmp.treeStructure.node_type == 'object') {
                icon = "<i class='mdi mdi-flag mdi-18px'></i>";
                ul   = document.getElementById('ul-zn' + cmp.treeStructure.parent_id);
                lid  = 'ob';
            }
            else {
                icon = "<i class='mdi mdi-adjust mdi-18px'></i>";
                ul   = document.getElementById('ul-ob' + cmp.treeStructure.parent_id);
                lid  = 'pt';
            }
            
            //await axios.get('sanctum/csrf-cookie')
            await axios.put('api/structure',{
                    'node_type': cmp.treeStructure.node_type,
                    'parent_id': cmp.treeStructure.parent_id,
                    'parent_name': cmp.treeStructure.parent_name,
                    'structure_id': cmp.treeStructure.structure_id,
                    'structure_name': cmp.treeStructure.structure_name,
                    'structure_abbr': cmp.treeStructure.structure_abbr,
                    'active': cmp.treeStructure.active
                }).then(function (response) {
                    if (response.data.success) {
                        cmp.error_txt = "";
                        cmp.treeStructure.invalid_form = false
                        cmp.treeStructure.save_text = "Guardar"
                        if (cmp.treeStructure.structure_id == '' || cmp.treeStructure.structure_id == null) {
                            toastr.success('Estructura Creada con éxito.')
                            window.document.location.reload()
                            // Delete current li focus
                            /*ul.querySelectorAll("li").forEach((li) => li.classList.remove("active"));
                            ul.querySelectorAll("a").forEach((a) => a.classList.remove("node-selected"));
                            // Build new li node and focused
                            let li    = document.createElement('li'),
                                div   = document.createElement('div'),
                                span1 = document.createElement('span'),
                                span2 = document.createElement('span'),
                                tgg_a = document.createElement('a'),
                                aicon = document.createElement('i'),
                                lnk_a = document.createElement('a'),
                                lnk_i = document.createElement('li');
                            span1.classList.add("prefix");
                            span1.classList.add("d-flex");
                            span1.classList.add("flex-row");
                            span1.classList.add("align-items-center");
                            span2.classList.add("mx-1");
                            tgg_a.classList.add("nav-link");
                            tgg_a.classList.add("flex-grow-1");
                            tgg_a.classList.add("text-break");
                            tgg_a.classList.add("px-1");
                            tgg_a.setAttribute("href", "javascript:void(0);");
                            aicon.classList.add("hidden");
                            lnk_a.classList.add("nav-link");
                            lnk_a.classList.add("flex-grow-1");
                            lnk_a.classList.add("text-break");
                            lnk_a.classList.add("node-selected");
                            lnk_a.setAttribute("href", "javascript:void(0);");
                            lnk_i.classList.add("fas");
                            lnk_i.classList.add("fa-map-marker-alt");
                            lnk_i.classList.add("mr-2");
                            lnk_a.appendChild(lnk_i);
                            lnk_a.appendChild(document.createTextNode(cmp.treeStructure.structure_name));
                            tgg_a.appendChild(aicon);
                            span2.appendChild(tgg_a);
                            span1.appendChild(span2);
                            div.classList.add("d-flex");
                            div.appendChild(span1);
                            div.appendChild(lnk_a);
                            li.appendChild(div);
                            li.setAttribute("id", lid + response.data.fields.structure_id);
                            li.classList.add("nav-item");
                            li.classList.add("d-flex");
                            li.classList.add("flex-column");
                            li.classList.add("nt-li");
                            li.classList.add("active");
                            ul.appendChild(li);

                            cmp.treeStructure.structure_id = response.data.fields.structure_id;
                            cmp.treeStructure.invalid_form = false;
                            cmp.treeStructure.save_text = "Guardar"*/
                        }
                        else {
                            toastr.success('Estructura Actualizada con éxito.')
                            cmp.treeStructure.invalid_form = false;
                            cmp.treeStructure.save_text = "Guardar"
                            document.getElementsByClassName('node-selected')[0].innerHTML = icon + "&nbsp;&nbsp;" + cmp.treeStructure.structure_name
                        }
                    }
                    else {
                        cmp.treeStructure.invalid_form = false;
                        cmp.treeStructure.save_text = "Guardar"
                        toastr.error('Error al intentar realizar la operación.');
                    }
                }).catch(function (error) {
                    cmp.treeStructure.invalid_form = false;
                    cmp.treeStructure.save_text = "Guardar"
                    cmp.error_txt = "Ha habido un error. Por favor, prueba nuevamente.";
                    return;
                })
        },
        async deleteStructure() {
            var cmp = this, ul = "", lid = "";
            cmp.treeStructure.invalid_form = true
            cmp.treeStructure.delete_text = "Procesando..."

            if (cmp.treeStructure.node_type == 'pole') {
                ul   = document.getElementById('structures-tree');
                lid  = 'p';
            }
            else if (cmp.treeStructure.node_type == 'project') {
                ul   = document.getElementById('ul-p' + cmp.treeStructure.parent_id);
                lid  = 'pj';
            }
            else if (cmp.treeStructure.node_type == 'zone') {
                ul   = document.getElementById('ul-pj' + cmp.treeStructure.parent_id);
                lid  = 'zn';
            }
            else if (cmp.treeStructure.node_type == 'object') {
                ul   = document.getElementById('ul-zn' + cmp.treeStructure.parent_id);
                lid  = 'ob';
            }
            else {
                ul   = document.getElementById('ul-ob' + cmp.treeStructure.parent_id);
                lid  = 'pt';
            }
            
            await axios.get('sanctum/csrf-cookie')
            await axios.post('api/structure/delete',{
                    'node_type': cmp.treeStructure.node_type,
                    'structure_id': cmp.treeStructure.structure_id
                }).then(function (response) {
                    if (response.data.success) {
                        cmp.error_txt = "";
                        cmp.treeStructure.invalid_form = false
                        cmp.treeStructure.delete_text = "Eliminar"
                        // Hide modal
                        let modalEl = document.getElementById('modal-treestructure-delete'),
                            modalsBackdrops = document.getElementsByClassName('modal-backdrop'),
                            liEl = document.getElementById(lid + cmp.treeStructure.structure_id);
                        modalEl.classList.remove('show');
                        modalEl.setAttribute('aria-hidden', 'true');
                        modalEl.setAttribute('style', 'display: none');
                        for(let i=0; i<modalsBackdrops.length; i++) {
                            document.body.removeChild(modalsBackdrops[i]);
                        }
                        /*// Delete li node
                        ul.removeChild(liEl);
                        cmp.treeStructure.node_type      = "pole"
                        cmp.treeStructure.parent_id      = "",
                        cmp.treeStructure.parent_name    = "Polos",
                        cmp.treeStructure.structure_id   = ""
                        cmp.treeStructure.structure_name = ""
                        cmp.treeStructure.structure_abbr = ""
                        cmp.treeStructure.active         = true*/
                        toastr.success('Estructura Eliminada con éxito.')
                        window.document.location.reload()
                    }
                    else {
                        cmp.treeStructure.invalid_form = false;
                        cmp.treeStructure.delete_text = "Eliminar";
                        // Hide modal
                        let modalEl = document.getElementById('modal-treestructure-delete'),
                            modalsBackdrops = document.getElementsByClassName('modal-backdrop'),
                            liEl = document.getElementById(lid + cmp.treeStructure.structure_id);
                        modalEl.classList.remove('show');
                        modalEl.setAttribute('aria-hidden', 'true');
                        modalEl.setAttribute('style', 'display: none');
                        for(let i=0; i<modalsBackdrops.length; i++) {
                            document.body.removeChild(modalsBackdrops[i]);
                        }
                        toastr.error(response.data.error);
                    }
                }).catch(function (error) {
                    cmp.treeStructure.invalid_form = false;
                    cmp.treeStructure.save_text = "Eliminar"
                    cmp.error_txt = "Ha habido un error. Por favor, prueba nuevamente.";
                    return;
                })
        },
    },
});

import SidebarComponent from './components/SidebarComponent.vue';
import TreestructuresComponent from './components/TreestructuresComponent.vue';

app.component('sidebar-component', SidebarComponent);
app.component('tree-structures', TreestructuresComponent);

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// Object.entries(import.meta.glob('./**/*.vue', { eager: true })).forEach(([path, definition]) => {
//     app.component(path.split('/').pop().replace(/\.\w+$/, ''), definition.default);
// });

/**
 * Finally, we will attach the application instance to a HTML element with
 * an "id" attribute of "app". This element is included with the "auth"
 * scaffolding. Otherwise, you will need to add an element yourself.
 */

app.mount('#app');
