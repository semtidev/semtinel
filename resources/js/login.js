/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

import './bootstrap';
import { createApp } from 'vue';

/**
 * Next, we will create a fresh Vue application instance. You may then begin
 * registering components with the application instance so they are ready
 * to use in your application's views. An example is included for you.
 */

var login = createApp({
    data() {
        return {
            auth: {
                username: "",
                password: ""
            },
            form_processing: false,
            login_windows: "Iniciar con Windows",
            login_semtinel: "Iniciar con Semtinel", 
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
        async login(method){
            let cmp = this,
                path = (method == 'auth') ? 'login/auth' : 'login/ldap';
            cmp.form_processing = true
            if (method == 'ldap') {
                cmp.login_windows = "Validando usuario..."
            }
            else {
                cmp.login_semtinel = "Validando usuario..."
            }
            await axios.get('sanctum/csrf-cookie')
            await axios.post('api/' + path, this.auth).then(function (response) {
                if (response.data.success) {
                    login.error_txt = ""
                    let user = {
                        id: response.data.user.id,
                        email: response.data.user.email,
                        username: response.data.user.username,
                        first_name: response.data.user.first_name,
                        last_name: response.data.user.last_name,
                        access_token: response.data.access_token
                    }
                    sessionStorage.setItem('semtinel', JSON.stringify(user))
                    window.document.location.href = response.data.redirect
                }
            }).catch(function (error) {
                cmp.form_processing = false
                if (method == 'ldap') {
                    cmp.login_windows = "Iniciar con Windows"
                }
                else {
                    cmp.login_semtinel = "Iniciar con Semtinel"
                }
                login.error_txt = "Ha habido un error. Por favor, prueba nuevamente."
                return
            })
        },
    },
    mounted() {
        sessionStorage.removeItem('semtinel')
    }
}).mount('#login');
