import { o as openBlock, b as createElementBlock, i as createBaseVNode, J as withDirectives, L as withModifiers, f as normalizeClass, F as Fragment, I as renderList, v as toDisplayString, N as vModelText, j as createCommentVNode, U as vModelCheckbox, O as vModelSelect, H as createTextVNode, G as createStaticVNode, K as resolveDirective } from "./vue.esm-bundler.7d6bf7a6.js";
import { _ as _export_sfc } from "./app.affc77e9.js";
const apiClient = axios.create({
  baseURL: "http://localhost/semtinel/public/api/",
  withCredentials: false
});
const _sfc_main = {
  data: function() {
    return {
      users: [],
      roles: [],
      systems: [],
      projects: [],
      poles: [],
      role_permissions: [],
      roles_loading: true,
      projects_loading: false,
      poles_loading: true,
      users_loading: true,
      users_empty: false,
      loading: true,
      form_title: "Nuevo Usuario",
      systems_loading: true,
      id: "",
      name: "",
      last_name: "",
      username: "",
      email: "",
      password: "",
      repassword: "",
      selected_roles: [],
      selected_systems: [],
      selected_projects: [],
      selected_pole: "",
      form_action: "",
      form_error: "",
      form_okbtn_text: "Aceptar",
      form_color: "green",
      form_loading: false,
      delete_text: "Eliminar",
      delete_id: "",
      delete_user: "",
      delete_error: "",
      delete_loading: false,
      session: JSON.parse(sessionStorage.getItem("semtinel"))
    };
  },
  computed: {
    classValid() {
      let cmp = this;
      return {
        "is-invalid": cmp.password !== cmp.repassword
      };
    }
  },
  watch: {
    selected_pole: function(newPole) {
      this.projects_loading = true;
      if (newPole === "") {
        this.projects = [];
        this.projects_loading = false;
      } else {
        apiClient.get("/projectsbypole/" + newPole, { headers: this.headers }).then((response) => {
          this.projects = response.data;
          this.projects_loading = false;
        }).catch((error) => {
          this.errorMessage = error;
          toastr.error("Error: " + error);
        });
      }
    },
    form_okbtn_text: function(val) {
      if (val == "Aceptar")
        this.form_loading = false;
      else
        this.form_loading = true;
    },
    form_action: function(val) {
      switch (val) {
        case "create":
          this.form_color = "green";
          break;
        case "edit":
          this.form_color = "orange";
          break;
        default:
          this.form_color = "danger";
          break;
      }
    }
  },
  methods: {
    listReload: function() {
      this.getItemsTable();
    },
    getItemsTable() {
      let cmp = this;
      cmp.users_loading = true;
      apiClient.get("/admin/users", { headers: this.headers }).then((response) => {
        cmp.users = response.data;
        cmp.users_loading = false;
        cmp.users_empty = response.data.length > 0 ? false : true;
      }).catch((error) => {
        this.errorMessage = error;
        toastr.error("Error: " + error);
      });
    },
    isValidForm: function() {
      if (this.name == null || this.name == "") {
        this.form_error = "Debe escribir un Nombre.";
        return false;
      }
      return true;
    },
    getRoles: function() {
      this.roles_loading = true;
      apiClient.get("/admin/roles", { headers: this.headers }).then((response) => {
        this.roles = response.data;
        this.roles_loading = false;
      }).catch((error) => {
        this.errorMessage = error;
        toastr.error("Error: " + error);
      });
    },
    getAsignedRoles: function(user_id) {
      apiClient.get("/admin/roles", { headers: this.headers }).then((response) => {
        this.roles = response.data;
        apiClient.get("/admin/user/roles/" + user_id, { headers: this.headers }).then((response2) => {
          let arr = response2.data.map((item) => {
            return item.id;
          });
          this.selected_roles = [...arr];
          this.roles_loading = false;
        }).catch((error) => {
          this.errorMessage = error;
          toastr.error("Error: " + error);
        });
      }).catch((error) => {
        this.errorMessage = error;
        toastr.error("Error: " + error);
      });
    },
    getSystems: function() {
      apiClient.get("/admin/systems", { headers: this.headers }).then((response) => {
        let active_systems = response.data.filter((item) => {
          return item.active === 1;
        });
        this.systems = active_systems;
        this.systems_loading = false;
      }).catch((error) => {
        this.errorMessage = error;
        toastr.error("Error: " + error);
      });
    },
    getPoles: function() {
      apiClient.get("/poles", { headers: this.headers }).then((response) => {
        let active_poles = response.data.filter((item) => {
          return item.active === 1;
        });
        this.poles = active_poles;
        this.poles_loading = false;
      }).catch((error) => {
        this.errorMessage = error;
        toastr.error("Error: " + error);
      });
    },
    getAsignedSystems: function(user_id) {
      apiClient.get("/admin/systems", { headers: this.headers }).then((response) => {
        let active_systems = response.data.filter((item) => {
          return item.active === 1;
        });
        this.systems = active_systems;
        apiClient.get("/admin/user/systems/" + user_id, { headers: this.headers }).then((response2) => {
          let arr = response2.data.map((item) => {
            return item.id;
          });
          this.selected_systems = [...arr];
          this.systems_loading = false;
        }).catch((error) => {
          this.errorMessage = error;
          toastr.error("Error: " + error);
        });
      }).catch((error) => {
        this.errorMessage = error;
        toastr.error("Error: " + error);
      });
    },
    getAsignedProjects: function(user_id, pole_id) {
      apiClient.get("/poles", { headers: this.headers }).then((response) => {
        let active_poles = response.data.filter((item) => {
          return item.active === 1;
        });
        this.poles = active_poles;
        apiClient.get("/admin/user/projects/" + user_id, { headers: this.headers }).then((response2) => {
          let arr = response2.data.map((item) => {
            return item.id;
          });
          this.selected_projects = [...arr];
          this.selected_pole = pole_id;
          this.projects_loading = false;
        }).catch((error) => {
          this.errorMessage = error;
          toastr.error("Error: " + error);
        });
      }).catch((error) => {
        this.errorMessage = error;
        toastr.error("Error: " + error);
      });
    },
    create: function() {
      let cmp = this;
      cmp.form_action = "create";
      cmp.form_error = "";
      cmp.form_title = "Nuevo Usuario";
      cmp.id = "";
      cmp.name = "";
      cmp.last_name = "";
      cmp.username = "";
      cmp.email = "";
      cmp.password = "";
      cmp.repassword = "";
      cmp.selected_pole = "";
      cmp.selected_projects = [];
      cmp.selected_systems = [];
      cmp.selected_roles = [];
      this.getRoles();
      this.getSystems();
      this.getPoles();
    },
    edit: function(user) {
      let cmp = this;
      cmp.form_action = "edit";
      cmp.form_error = "";
      cmp.form_title = "Editar Usuario";
      console.log(user);
      cmp.id = user.id;
      cmp.name = user.first_name;
      cmp.last_name = user.last_name;
      cmp.username = user.username;
      cmp.email = user.email;
      this.getAsignedRoles(user.id);
      this.getAsignedSystems(user.id);
      this.getAsignedProjects(user.id, user.pole_id);
    },
    deleteDialog: function(id, user) {
      this.delete_id = id;
      this.delete_user = user;
    },
    store: function() {
      let cmp = this;
      cmp.form_error = "";
      cmp.form_okbtn_text = "Procesando...";
      apiClient.post(
        "/user/register",
        {
          first_name: cmp.name,
          last_name: cmp.last_name,
          email: cmp.email,
          username: cmp.username,
          password: cmp.password,
          syst_pole_id: cmp.selected_pole,
          roles: cmp.selected_roles,
          systems: cmp.selected_systems,
          projects: cmp.selected_projects
        },
        { headers: this.headers }
      ).then((response) => {
        cmp.form_okbtn_text = "Aceptar";
        toastr.success("El Usuario fue creado con \xE9xito.");
        cmp.$refs.Close.click();
        cmp.listReload();
      }).catch((error) => {
        this.errorMessage = error;
        toastr.error("Error: " + error);
      });
    },
    update: function() {
      let cmp = this;
      cmp.form_error = "";
      cmp.form_okbtn_text = "Procesando...";
      apiClient.put(
        "/user",
        {
          id: cmp.id,
          first_name: cmp.name,
          last_name: cmp.last_name,
          email: cmp.email,
          username: cmp.username,
          password: cmp.password,
          syst_pole_id: cmp.selected_pole,
          roles: cmp.selected_roles,
          systems: cmp.selected_systems,
          projects: cmp.selected_projects
        },
        { headers: this.headers }
      ).then((response) => {
        cmp.form_okbtn_text = "Aceptar";
        toastr.success("El usuario fue actualizado con \xE9xito.");
        cmp.$refs.Close.click();
        cmp.listReload();
      }).catch((error) => {
        this.errorMessage = error;
        toastr.error("Error: " + error);
      });
    },
    submitHandler: function() {
      if (this.form_action === "create") {
        this.store();
      } else {
        this.update();
      }
    },
    destroy: function() {
      let cmp = this;
      cmp.delete_error = "";
      cmp.delete_loading = true;
      cmp.delete_text = "Procesando...";
      apiClient.delete("/user/" + cmp.delete_id, { headers: this.headers }, {}).then((response) => {
        if (response.data.success) {
          cmp.delete_error = "";
          cmp.delete_loading = false;
          cmp.delete_text = "Eliminar";
          cmp.$refs.delClose.click();
          toastr.success("El usuario fue Eliminado con \xE9xito.");
          cmp.listReload();
        } else {
          cmp.delete_error = "";
          cmp.delete_loading = false;
          cmp.delete_text = "Eliminar";
          toastr.error("Error al intentar realizar la operaci\xF3n.");
        }
      }).catch(function(error) {
        cmp.delete_error = "Ha ocurrido un error. Por favor, prueba nuevamente.";
        cmp.form_okbtn_text = "Eliminar";
        cmp.delete_loading = false;
        return;
      });
    }
  },
  mounted() {
    const bearer_token = JSON.parse(sessionStorage.getItem("semtinel")).access_token;
    if (!bearer_token) {
      sessionStorage.clear();
      window.document.location.href = "http://localhost/semtinel/public/login";
    }
    this.headers = { "Authorization": "Bearer " + bearer_token };
    this.getItemsTable();
  }
};
const _hoisted_1 = { class: "container-fluid px-0" };
const _hoisted_2 = { class: "card card-default" };
const _hoisted_3 = { class: "card-header" };
const _hoisted_4 = /* @__PURE__ */ createBaseVNode("h3", { class: "card-title" }, "Usuarios", -1);
const _hoisted_5 = { class: "card-tools" };
const _hoisted_6 = /* @__PURE__ */ createBaseVNode("i", { class: "mdi mdi-reload mdi-24px text-green" }, null, -1);
const _hoisted_7 = [
  _hoisted_6
];
const _hoisted_8 = /* @__PURE__ */ createBaseVNode("i", { class: "mdi mdi-plus-circle mdi-24px text-green" }, null, -1);
const _hoisted_9 = [
  _hoisted_8
];
const _hoisted_10 = { class: "card-body" };
const _hoisted_11 = /* @__PURE__ */ createBaseVNode("div", { class: "col-12 text-center py-5 loading-table" }, [
  /* @__PURE__ */ createBaseVNode("h6", null, [
    /* @__PURE__ */ createBaseVNode("span", { class: "mdi mdi-loading mdi-spin mdi-36px" }, "\xA0Cargando usuarios...")
  ])
], -1);
const _hoisted_12 = [
  _hoisted_11
];
const _hoisted_13 = /* @__PURE__ */ createBaseVNode("div", { class: "col-12 text-center empty-table" }, [
  /* @__PURE__ */ createBaseVNode("h6", null, "Ning\xFAn usuario encontrado")
], -1);
const _hoisted_14 = [
  _hoisted_13
];
const _hoisted_15 = { class: "col-12" };
const _hoisted_16 = { class: "table table-striped" };
const _hoisted_17 = /* @__PURE__ */ createBaseVNode("thead", null, [
  /* @__PURE__ */ createBaseVNode("tr", null, [
    /* @__PURE__ */ createBaseVNode("th", {
      width: "50",
      class: "text-center no-sort"
    }, "No."),
    /* @__PURE__ */ createBaseVNode("th", null, "Nombre"),
    /* @__PURE__ */ createBaseVNode("th", null, "Apellidos"),
    /* @__PURE__ */ createBaseVNode("th", null, "Email"),
    /* @__PURE__ */ createBaseVNode("th", null, "Usuario"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "100",
      class: "text-center no-sort"
    }, "Acciones")
  ])
], -1);
const _hoisted_18 = { class: "text-center" };
const _hoisted_19 = { class: "text-center" };
const _hoisted_20 = ["onClick"];
const _hoisted_21 = /* @__PURE__ */ createBaseVNode("span", { class: "mdi mdi-pencil mdi-18px text-orange" }, null, -1);
const _hoisted_22 = [
  _hoisted_21
];
const _hoisted_23 = ["onClick"];
const _hoisted_24 = /* @__PURE__ */ createBaseVNode("span", { class: "mdi mdi-trash-can-outline mdi-18px text-danger" }, null, -1);
const _hoisted_25 = [
  _hoisted_24
];
const _hoisted_26 = {
  class: "modal fade",
  id: "modal-user-form",
  "aria-hidden": "true",
  role: "dialog",
  "data-backdrop": "static",
  "data-keyboard": "false"
};
const _hoisted_27 = { class: "modal-dialog modal-lg" };
const _hoisted_28 = { class: "modal-content" };
const _hoisted_29 = { class: "modal-title" };
const _hoisted_30 = {
  type: "button",
  ref: "Close",
  class: "close",
  "data-dismiss": "modal",
  "aria-label": "Close"
};
const _hoisted_31 = /* @__PURE__ */ createBaseVNode("span", { "aria-hidden": "true" }, "\xD7", -1);
const _hoisted_32 = [
  _hoisted_31
];
const _hoisted_33 = { class: "modal-body px-4" };
const _hoisted_34 = { class: "row" };
const _hoisted_35 = { class: "col-md-6" };
const _hoisted_36 = { class: "form-group" };
const _hoisted_37 = /* @__PURE__ */ createBaseVNode("label", { for: "name" }, "Nombre:", -1);
const _hoisted_38 = { class: "col-md-6" };
const _hoisted_39 = { class: "form-group" };
const _hoisted_40 = /* @__PURE__ */ createBaseVNode("label", { for: "name" }, "Apellidos:", -1);
const _hoisted_41 = { class: "row" };
const _hoisted_42 = { class: "col-md-6" };
const _hoisted_43 = { class: "form-group" };
const _hoisted_44 = /* @__PURE__ */ createBaseVNode("label", { for: "name" }, "Usuario:", -1);
const _hoisted_45 = { class: "col-md-6" };
const _hoisted_46 = { class: "form-group" };
const _hoisted_47 = /* @__PURE__ */ createBaseVNode("label", { for: "name" }, "Email:", -1);
const _hoisted_48 = { class: "row" };
const _hoisted_49 = { class: "col-md-6" };
const _hoisted_50 = { class: "form-group" };
const _hoisted_51 = /* @__PURE__ */ createBaseVNode("label", { for: "password" }, "Contrase\xF1a:", -1);
const _hoisted_52 = { key: 0 };
const _hoisted_53 = ["required"];
const _hoisted_54 = { class: "col-md-6" };
const _hoisted_55 = { class: "form-group" };
const _hoisted_56 = /* @__PURE__ */ createBaseVNode("label", { for: "re-password" }, "Repetir Contrase\xF1a:", -1);
const _hoisted_57 = ["required"];
const _hoisted_58 = /* @__PURE__ */ createBaseVNode("div", { class: "invalid-feedback" }, " No coincide la contrase\xF1a ", -1);
const _hoisted_59 = { class: "card card-default mt-3" };
const _hoisted_60 = /* @__PURE__ */ createStaticVNode('<div class="card-header"><h3 class="card-title">Roles</h3><div class="card-tools"><button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button></div></div>', 1);
const _hoisted_61 = { class: "card-body" };
const _hoisted_62 = /* @__PURE__ */ createBaseVNode("div", { class: "col-12 text-center py-5 loading-table" }, [
  /* @__PURE__ */ createBaseVNode("h6", null, [
    /* @__PURE__ */ createBaseVNode("span", { class: "mdi mdi-loading mdi-spin mdi-36px" }, "\xA0Cargando Roles...")
  ])
], -1);
const _hoisted_63 = [
  _hoisted_62
];
const _hoisted_64 = { class: "col-12" };
const _hoisted_65 = { class: "table table-striped" };
const _hoisted_66 = /* @__PURE__ */ createBaseVNode("thead", null, [
  /* @__PURE__ */ createBaseVNode("tr", null, [
    /* @__PURE__ */ createBaseVNode("th", null, "Nombre"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "130",
      class: "text-center no-sort"
    }, "Pertenece a")
  ])
], -1);
const _hoisted_67 = { class: "text-center" };
const _hoisted_68 = ["id", "value"];
const _hoisted_69 = { class: "card card-default" };
const _hoisted_70 = /* @__PURE__ */ createStaticVNode('<div class="card-header"><h3 class="card-title">Sistemas</h3><div class="card-tools"><button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button></div></div>', 1);
const _hoisted_71 = { class: "card-body" };
const _hoisted_72 = /* @__PURE__ */ createBaseVNode("div", { class: "col-12 text-center py-5 loading-table" }, [
  /* @__PURE__ */ createBaseVNode("h6", null, [
    /* @__PURE__ */ createBaseVNode("span", { class: "mdi mdi-loading mdi-spin mdi-36px" }, "\xA0Cargando Sistemas...")
  ])
], -1);
const _hoisted_73 = [
  _hoisted_72
];
const _hoisted_74 = { class: "col-12" };
const _hoisted_75 = { class: "table table-striped" };
const _hoisted_76 = /* @__PURE__ */ createBaseVNode("thead", null, [
  /* @__PURE__ */ createBaseVNode("tr", null, [
    /* @__PURE__ */ createBaseVNode("th", null, "Nombre"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "130",
      class: "text-center no-sort"
    }, "Accede a")
  ])
], -1);
const _hoisted_77 = { class: "text-center" };
const _hoisted_78 = ["id", "value"];
const _hoisted_79 = { class: "row" };
const _hoisted_80 = { class: "col-md-12" };
const _hoisted_81 = { class: "form-group" };
const _hoisted_82 = /* @__PURE__ */ createBaseVNode("label", { for: "name" }, "Polos:", -1);
const _hoisted_83 = /* @__PURE__ */ createBaseVNode("option", {
  disable: "",
  value: ""
}, "Selecciona un Polo", -1);
const _hoisted_84 = ["value"];
const _hoisted_85 = { class: "card card-default" };
const _hoisted_86 = /* @__PURE__ */ createStaticVNode('<div class="card-header"><h3 class="card-title">Proyectos</h3><div class="card-tools"><button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button></div></div>', 1);
const _hoisted_87 = { class: "card-body" };
const _hoisted_88 = /* @__PURE__ */ createBaseVNode("div", { class: "col-12 text-center py-5 loading-table" }, [
  /* @__PURE__ */ createBaseVNode("h6", null, [
    /* @__PURE__ */ createBaseVNode("span", { class: "mdi mdi-loading mdi-spin mdi-36px" }, "\xA0Cargando Proyectos...")
  ])
], -1);
const _hoisted_89 = [
  _hoisted_88
];
const _hoisted_90 = { class: "col-12" };
const _hoisted_91 = { class: "table table-striped" };
const _hoisted_92 = /* @__PURE__ */ createBaseVNode("thead", null, [
  /* @__PURE__ */ createBaseVNode("tr", null, [
    /* @__PURE__ */ createBaseVNode("th", null, "Nombre"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "130",
      class: "text-center no-sort"
    }, "Accede a")
  ])
], -1);
const _hoisted_93 = { class: "text-center" };
const _hoisted_94 = ["id", "value"];
const _hoisted_95 = { class: "modal-footer justify-content-between" };
const _hoisted_96 = /* @__PURE__ */ createBaseVNode("button", {
  type: "button",
  class: "btn btn-default ripple",
  "data-dismiss": "modal"
}, "Cancelar", -1);
const _hoisted_97 = ["disabled"];
const _hoisted_98 = {
  key: 0,
  class: "mdi mdi-check-all"
};
const _hoisted_99 = {
  key: 1,
  class: "mdi mdi-loading mdi-spin"
};
const _hoisted_100 = {
  class: "modal fade",
  id: "modal-role-delete",
  "aria-hidden": "true",
  role: "dialog",
  "data-backdrop": "static",
  "data-keyboard": "false"
};
const _hoisted_101 = { class: "modal-dialog modal-lg" };
const _hoisted_102 = { class: "modal-content" };
const _hoisted_103 = { class: "modal-header header-danger" };
const _hoisted_104 = /* @__PURE__ */ createBaseVNode("h4", { class: "modal-title" }, "Confirmaci\xF3n", -1);
const _hoisted_105 = {
  type: "button",
  ref: "delClose",
  class: "close",
  "data-dismiss": "modal",
  "aria-label": "Close"
};
const _hoisted_106 = /* @__PURE__ */ createBaseVNode("span", { "aria-hidden": "true" }, "\xD7", -1);
const _hoisted_107 = [
  _hoisted_106
];
const _hoisted_108 = { class: "modal-body px-4" };
const _hoisted_109 = /* @__PURE__ */ createBaseVNode("div", {
  class: "float-start",
  style: { "width": "70px" }
}, [
  /* @__PURE__ */ createBaseVNode("i", { class: "mdi mdi-chat-question mdi-48px" })
], -1);
const _hoisted_110 = {
  class: "float-start pt-3",
  style: { "width": "85%" }
};
const _hoisted_111 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_112 = {
  key: 0,
  class: "row pt-2"
};
const _hoisted_113 = { class: "col-12 text-center" };
const _hoisted_114 = { class: "form_error" };
const _hoisted_115 = { class: "modal-footer justify-content-between" };
const _hoisted_116 = /* @__PURE__ */ createBaseVNode("button", {
  type: "button",
  class: "btn btn-default",
  "data-dismiss": "modal"
}, "Cancelar", -1);
const _hoisted_117 = ["disabled"];
const _hoisted_118 = /* @__PURE__ */ createBaseVNode("i", { class: "mdi mdi-trash-can-outline" }, null, -1);
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_tooltip = resolveDirective("tooltip");
  return openBlock(), createElementBlock(Fragment, null, [
    createBaseVNode("div", _hoisted_1, [
      createBaseVNode("div", _hoisted_2, [
        createBaseVNode("div", _hoisted_3, [
          _hoisted_4,
          createBaseVNode("div", _hoisted_5, [
            withDirectives((openBlock(), createElementBlock("button", {
              type: "button",
              class: "btn btn-tool pl-0",
              onClick: _cache[0] || (_cache[0] = withModifiers(($event) => $options.listReload(), ["stop"]))
            }, _hoisted_7)), [
              [_directive_tooltip, "Recargar Listado"]
            ]),
            withDirectives((openBlock(), createElementBlock("button", {
              type: "button",
              class: "btn btn-tool pl-0",
              "data-toggle": "modal",
              "data-target": "#modal-user-form",
              onClick: _cache[1] || (_cache[1] = ($event) => $options.create())
            }, _hoisted_9)), [
              [_directive_tooltip, "Nuevo Usuario"]
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_10, [
          createBaseVNode("div", {
            class: normalizeClass(["row mt-3", _ctx.users_loading ? "" : "hidden"])
          }, _hoisted_12, 2),
          createBaseVNode("div", {
            class: normalizeClass(["row mt-3", _ctx.users_empty ? "" : "hidden"])
          }, _hoisted_14, 2),
          createBaseVNode("div", {
            class: normalizeClass(["row", !_ctx.users_loading && !_ctx.users_empty ? "" : "hidden"])
          }, [
            createBaseVNode("div", _hoisted_15, [
              createBaseVNode("table", _hoisted_16, [
                _hoisted_17,
                createBaseVNode("tbody", null, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.users, (item, idx) => {
                    return openBlock(), createElementBlock("tr", {
                      key: item.id
                    }, [
                      createBaseVNode("td", _hoisted_18, toDisplayString(idx + 1), 1),
                      createBaseVNode("td", null, toDisplayString(item.first_name), 1),
                      createBaseVNode("td", null, toDisplayString(item.last_name), 1),
                      createBaseVNode("td", null, toDisplayString(item.email), 1),
                      createBaseVNode("td", null, toDisplayString(item.username), 1),
                      createBaseVNode("td", _hoisted_19, [
                        withDirectives((openBlock(), createElementBlock("a", {
                          href: "javascript:void(0);",
                          class: "btn-semti-tool mr-2",
                          style: { "padding": "4px 5px" },
                          "data-toggle": "modal",
                          "data-target": "#modal-user-form",
                          onClick: ($event) => $options.edit(item)
                        }, _hoisted_22, 8, _hoisted_20)), [
                          [_directive_tooltip, "Modificar este usuario"]
                        ]),
                        withDirectives((openBlock(), createElementBlock("a", {
                          href: "javascript:void(0);",
                          class: "btn-semti-tool",
                          style: { "padding": "4px 5px" },
                          "data-toggle": "modal",
                          "data-target": "#modal-role-delete",
                          onClick: ($event) => $options.deleteDialog(item.id, item.username)
                        }, _hoisted_25, 8, _hoisted_23)), [
                          [_directive_tooltip, "Eliminar este usuario"]
                        ])
                      ])
                    ]);
                  }), 128))
                ])
              ])
            ])
          ], 2)
        ])
      ])
    ]),
    createBaseVNode("div", _hoisted_26, [
      createBaseVNode("div", _hoisted_27, [
        createBaseVNode("div", _hoisted_28, [
          createBaseVNode("form", {
            onSubmit: _cache[13] || (_cache[13] = withModifiers((...args) => $options.submitHandler && $options.submitHandler(...args), ["prevent"]))
          }, [
            createBaseVNode("div", {
              class: normalizeClass(["modal-header", "header-" + _ctx.form_color])
            }, [
              createBaseVNode("h4", _hoisted_29, toDisplayString(_ctx.form_title), 1),
              createBaseVNode("button", _hoisted_30, _hoisted_32, 512)
            ], 2),
            createBaseVNode("div", _hoisted_33, [
              withDirectives(createBaseVNode("input", {
                type: "hidden",
                name: "id_role",
                id: "id_role",
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => _ctx.id = $event)
              }, null, 512), [
                [vModelText, _ctx.id]
              ]),
              createBaseVNode("div", _hoisted_34, [
                createBaseVNode("div", _hoisted_35, [
                  createBaseVNode("div", _hoisted_36, [
                    _hoisted_37,
                    withDirectives(createBaseVNode("input", {
                      type: "text",
                      class: "form-control",
                      id: "name",
                      name: "name",
                      required: "",
                      placeholder: "Nombre del usuario",
                      "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => _ctx.name = $event)
                    }, null, 512), [
                      [vModelText, _ctx.name]
                    ])
                  ])
                ]),
                createBaseVNode("div", _hoisted_38, [
                  createBaseVNode("div", _hoisted_39, [
                    _hoisted_40,
                    withDirectives(createBaseVNode("input", {
                      type: "text",
                      class: "form-control",
                      id: "name",
                      name: "name",
                      required: "",
                      placeholder: "Apellido del usuario",
                      "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => _ctx.last_name = $event)
                    }, null, 512), [
                      [vModelText, _ctx.last_name]
                    ])
                  ])
                ])
              ]),
              createBaseVNode("div", _hoisted_41, [
                createBaseVNode("div", _hoisted_42, [
                  createBaseVNode("div", _hoisted_43, [
                    _hoisted_44,
                    withDirectives(createBaseVNode("input", {
                      type: "text",
                      class: "form-control",
                      id: "username",
                      name: "username",
                      autocomplete: "off",
                      required: "",
                      placeholder: "Identificador de usuario",
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => _ctx.username = $event)
                    }, null, 512), [
                      [vModelText, _ctx.username]
                    ])
                  ])
                ]),
                createBaseVNode("div", _hoisted_45, [
                  createBaseVNode("div", _hoisted_46, [
                    _hoisted_47,
                    withDirectives(createBaseVNode("input", {
                      class: "form-control",
                      id: "email",
                      name: "email",
                      type: "email",
                      required: "",
                      placeholder: "Correo electr\xF3nico",
                      "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => _ctx.email = $event)
                    }, null, 512), [
                      [vModelText, _ctx.email]
                    ])
                  ])
                ])
              ]),
              createBaseVNode("div", _hoisted_48, [
                createBaseVNode("div", _hoisted_49, [
                  createBaseVNode("div", _hoisted_50, [
                    _hoisted_51,
                    _ctx.form_action === "edit" ? (openBlock(), createElementBlock("div", _hoisted_52, "Si no desea cambiar Contrase\xF1a deje el campo en blanco")) : createCommentVNode("", true),
                    withDirectives(createBaseVNode("input", {
                      type: "password",
                      class: "form-control",
                      id: "password",
                      required: _ctx.form_action === "create" ? true : false,
                      autocomplete: "off",
                      name: "password",
                      placeholder: "Escribe una contrase\xF1a",
                      "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => _ctx.password = $event)
                    }, null, 8, _hoisted_53), [
                      [vModelText, _ctx.password]
                    ])
                  ])
                ]),
                createBaseVNode("div", _hoisted_54, [
                  createBaseVNode("div", _hoisted_55, [
                    _hoisted_56,
                    withDirectives(createBaseVNode("input", {
                      type: "password",
                      class: normalizeClass(["form-control", $options.classValid]),
                      id: "re-password",
                      required: _ctx.form_action === "create" ? true : false,
                      autocomplete: "off",
                      name: "re-password",
                      placeholder: "Repetir la contrase\xF1a",
                      "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => _ctx.repassword = $event)
                    }, null, 10, _hoisted_57), [
                      [vModelText, _ctx.repassword]
                    ]),
                    _hoisted_58
                  ])
                ])
              ]),
              createBaseVNode("div", _hoisted_59, [
                _hoisted_60,
                createBaseVNode("div", _hoisted_61, [
                  createBaseVNode("div", {
                    class: normalizeClass(["row mt-3", _ctx.roles_loading ? "" : "hidden"])
                  }, _hoisted_63, 2),
                  createBaseVNode("div", {
                    class: normalizeClass(["row", !_ctx.roles_loading > 0 ? "" : "hidden"])
                  }, [
                    createBaseVNode("div", _hoisted_64, [
                      createBaseVNode("table", _hoisted_65, [
                        _hoisted_66,
                        createBaseVNode("tbody", null, [
                          (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.roles, (item, idx) => {
                            return openBlock(), createElementBlock("tr", {
                              key: item.id
                            }, [
                              createBaseVNode("td", null, toDisplayString(item.name), 1),
                              createBaseVNode("td", _hoisted_67, [
                                withDirectives(createBaseVNode("input", {
                                  type: "checkbox",
                                  class: "form-check-input ml-0",
                                  id: item.id,
                                  value: item.id,
                                  "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => _ctx.selected_roles = $event)
                                }, null, 8, _hoisted_68), [
                                  [vModelCheckbox, _ctx.selected_roles]
                                ])
                              ])
                            ]);
                          }), 128))
                        ])
                      ])
                    ])
                  ], 2)
                ])
              ]),
              createBaseVNode("div", _hoisted_69, [
                _hoisted_70,
                createBaseVNode("div", _hoisted_71, [
                  createBaseVNode("div", {
                    class: normalizeClass(["row mt-3", _ctx.systems_loading ? "" : "hidden"])
                  }, _hoisted_73, 2),
                  createBaseVNode("div", {
                    class: normalizeClass(["row", !_ctx.systems_loading > 0 ? "" : "hidden"])
                  }, [
                    createBaseVNode("div", _hoisted_74, [
                      createBaseVNode("table", _hoisted_75, [
                        _hoisted_76,
                        createBaseVNode("tbody", null, [
                          (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.systems, (item, idx) => {
                            return openBlock(), createElementBlock("tr", {
                              key: item.id
                            }, [
                              createBaseVNode("td", null, toDisplayString(item.name), 1),
                              createBaseVNode("td", _hoisted_77, [
                                withDirectives(createBaseVNode("input", {
                                  type: "checkbox",
                                  class: "form-check-input ml-0",
                                  id: item.id,
                                  value: item.id,
                                  "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => _ctx.selected_systems = $event)
                                }, null, 8, _hoisted_78), [
                                  [vModelCheckbox, _ctx.selected_systems]
                                ])
                              ])
                            ]);
                          }), 128))
                        ])
                      ])
                    ])
                  ], 2)
                ])
              ]),
              createBaseVNode("div", _hoisted_79, [
                createBaseVNode("div", _hoisted_80, [
                  createBaseVNode("div", _hoisted_81, [
                    _hoisted_82,
                    withDirectives(createBaseVNode("select", {
                      class: "form-select",
                      "aria-label": "Selecionar Polo",
                      name: "pole",
                      "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => _ctx.selected_pole = $event)
                    }, [
                      _hoisted_83,
                      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.poles, (option, index) => {
                        return openBlock(), createElementBlock("option", {
                          key: index,
                          value: option.id
                        }, toDisplayString(option.name), 9, _hoisted_84);
                      }), 128))
                    ], 512), [
                      [vModelSelect, _ctx.selected_pole]
                    ])
                  ])
                ])
              ]),
              createBaseVNode("div", _hoisted_85, [
                _hoisted_86,
                createBaseVNode("div", _hoisted_87, [
                  createBaseVNode("div", {
                    class: normalizeClass(["row mt-3", _ctx.projects_loading ? "" : "hidden"])
                  }, _hoisted_89, 2),
                  createBaseVNode("div", {
                    class: normalizeClass(["row", !_ctx.projects_loading > 0 ? "" : "hidden"])
                  }, [
                    createBaseVNode("div", _hoisted_90, [
                      createBaseVNode("table", _hoisted_91, [
                        _hoisted_92,
                        createBaseVNode("tbody", null, [
                          (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.projects, (item, idx) => {
                            return openBlock(), createElementBlock("tr", {
                              key: item.id
                            }, [
                              createBaseVNode("td", null, toDisplayString(item.name), 1),
                              createBaseVNode("td", _hoisted_93, [
                                withDirectives(createBaseVNode("input", {
                                  type: "checkbox",
                                  class: "form-check-input ml-0",
                                  id: item.id,
                                  value: item.id,
                                  "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => _ctx.selected_projects = $event)
                                }, null, 8, _hoisted_94), [
                                  [vModelCheckbox, _ctx.selected_projects]
                                ])
                              ])
                            ]);
                          }), 128))
                        ])
                      ])
                    ])
                  ], 2)
                ])
              ])
            ]),
            createBaseVNode("div", _hoisted_95, [
              _hoisted_96,
              createBaseVNode("button", {
                type: "submit",
                class: normalizeClass(["btn btn-primary ripple", "btn-" + _ctx.form_color]),
                disabled: _ctx.form_loading
              }, [
                !_ctx.form_loading ? (openBlock(), createElementBlock("i", _hoisted_98)) : (openBlock(), createElementBlock("i", _hoisted_99)),
                createTextVNode(" \xA0" + toDisplayString(_ctx.form_okbtn_text), 1)
              ], 10, _hoisted_97)
            ])
          ], 32)
        ])
      ])
    ]),
    createBaseVNode("div", _hoisted_100, [
      createBaseVNode("div", _hoisted_101, [
        createBaseVNode("div", _hoisted_102, [
          createBaseVNode("div", _hoisted_103, [
            _hoisted_104,
            createBaseVNode("button", _hoisted_105, _hoisted_107, 512)
          ]),
          createBaseVNode("div", _hoisted_108, [
            _hoisted_109,
            createBaseVNode("div", _hoisted_110, [
              createBaseVNode("p", null, [
                createTextVNode('El usuario "'),
                createBaseVNode("strong", null, toDisplayString(_ctx.delete_user), 1),
                createTextVNode('" ser\xE1 Eliminado de la plataforma Semtinel.'),
                _hoisted_111,
                createTextVNode("Confirme que desea realizar esta operaci\xF3n.")
              ])
            ]),
            _ctx.form_error != "" ? (openBlock(), createElementBlock("div", _hoisted_112, [
              createBaseVNode("div", _hoisted_113, [
                createBaseVNode("h6", _hoisted_114, toDisplayString(_ctx.form_error), 1)
              ])
            ])) : createCommentVNode("", true)
          ]),
          createBaseVNode("div", _hoisted_115, [
            _hoisted_116,
            createBaseVNode("button", {
              type: "button",
              class: "btn btn-danger ripple",
              disabled: _ctx.delete_loading,
              onClick: _cache[14] || (_cache[14] = ($event) => $options.destroy())
            }, [
              _hoisted_118,
              createTextVNode("\xA0" + toDisplayString(_ctx.delete_text), 1)
            ], 8, _hoisted_117)
          ])
        ])
      ])
    ])
  ], 64);
}
const UsersComponent = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  UsersComponent as default
};
