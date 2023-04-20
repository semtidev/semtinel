import { t as createApp } from "./vue.esm-bundler.7d6bf7a6.js";
import { $ } from "./jquery.9b0ba2d7.js";
const login = createApp({
  data() {
    return {
      auth: {
        username: "",
        password: ""
      },
      form_processing: false,
      form_method: "auth",
      login_windows: "Iniciar con Windows",
      login_semtinel: "Iniciar con Semtinel",
      error_txt: ""
    };
  },
  watch: {
    ldap_processing: function(val) {
      this.form_processing = val;
    },
    auth_processing: function(val) {
      this.form_processing = val;
    }
  },
  methods: {
    validForm() {
      let cmp = this;
      if (cmp.auth.username == null || cmp.auth.username == "") {
        login.error_txt = "El campo Usuario es obligatorio.";
        return false;
      }
      if (cmp.auth.password == null || cmp.auth.password == "") {
        login.error_txt = "El campo Contrase\xF1a es obligatorio.";
        return false;
      }
      return true;
    },
    async login(method) {
      let cmp = this, path = method == "auth" ? "login/auth" : "login/ldap";
      if (!cmp.validForm()) {
        return;
      }
      cmp.form_processing = true;
      cmp.form_method = method;
      if (method == "ldap") {
        cmp.login_windows = "Validando usuario...";
      } else {
        cmp.login_semtinel = "Validando usuario...";
      }
      await axios.get("sanctum/csrf-cookie");
      await axios.post("api/" + path, this.auth).then(function(response) {
        if (response.data.success) {
          login.error_txt = "";
          let user = {
            id: response.data.user.id,
            email: response.data.user.email,
            username: response.data.user.username,
            first_name: response.data.user.first_name,
            last_name: response.data.user.last_name,
            access_token: response.data.access_token,
            systems: response.data.systems,
            permissions: response.data.permissions,
            warehouses: response.data.warehouses,
            roles: response.data.roles,
            poles: response.data.poles,
            projects: response.data.projects
          };
          sessionStorage.setItem("semtinel", JSON.stringify(user));
          window.document.location.href = response.data.redirect;
        }
      }).catch(function(error) {
        cmp.form_processing = false;
        if (method == "ldap") {
          cmp.login_windows = "Iniciar con Windows";
        } else {
          cmp.login_semtinel = "Iniciar con Semtinel";
        }
        login.error_txt = "Ha habido un error. Por favor, prueba nuevamente.";
        return;
      });
    }
  },
  mounted() {
    sessionStorage.removeItem("semtinel");
    $(".toggle-password").off().on("click", function() {
      $(this).toggleClass("fa-eye fa-eye-slash");
      var input = $($(this).attr("toggle"));
      if (input.attr("type") == "password") {
        input.attr("type", "text");
      } else {
        input.attr("type", "password");
      }
    });
  }
});
login.mount("#login");
login.mounted;
