import { o as openBlock, b as createElementBlock, i as createBaseVNode, J as withDirectives, L as withModifiers, f as normalizeClass, F as Fragment, I as renderList, v as toDisplayString, N as vModelText, j as createCommentVNode, H as createTextVNode, G as createStaticVNode, K as resolveDirective } from "./vue.esm-bundler.ecfa1491.js";
import { _ as _export_sfc } from "./app.415296ed.js";
const _sfc_main = {
  data: function() {
    return {
      roles: [],
      role_permissions: [],
      permissions_loading: true,
      roles_loading: true,
      roles_empty: false,
      loading: true,
      form_title: "Nuevo Rol",
      form_data: {
        id: "",
        name: ""
      },
      form_action: "",
      form_error: "",
      form_okbtn_text: "Aceptar",
      form_color: "green",
      form_loading: false,
      delete_text: "Eliminar",
      delete_id: "",
      delete_role: "",
      delete_error: "",
      delete_loading: false,
      session: JSON.parse(sessionStorage.getItem("semtinel"))
    };
  },
  created() {
  },
  watch: {
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
    async getItemsTable() {
      let cmp = this;
      let headers = {
        "User-Agent": "testing/1.0",
        "Accept": "application/json",
        "Authorization": "Bearer " + cmp.session.access_token
      };
      cmp.roles_loading = true;
      fetch("http://localhost/semtinel/public/api/admin/roles", {
        method: "GET",
        headers
      }).then((response) => response.json()).then((data) => {
        cmp.roles = data;
        cmp.roles_loading = false;
        cmp.roles_empty = data.length > 0 ? false : true;
      }).catch((error) => {
        this.errorMessage = error;
        toastr.error("Error: " + error);
      });
    },
    activePermission: function(idx) {
      this.role_permissions[idx].active = !this.role_permissions[idx].active;
    },
    isValidForm: function() {
      if (this.form_data.name == null || this.form_data.name == "") {
        this.form_error = "Debe escribir un Nombre para el rol.";
        return false;
      }
      return true;
    },
    create: function() {
      let cmp = this;
      cmp.form_action = "create";
      cmp.form_error = "";
      cmp.form_title = "Nuevo Rol";
      cmp.form_data.id = "";
      cmp.form_data.name = "";
      if (cmp.role_permissions.length > 0) {
        cmp.role_permissions.forEach((value, key) => {
          value.active = false;
        });
      } else {
        cmp.permissions_loading = true;
        let headers = {
          "User-Agent": "testing/1.0",
          "Accept": "application/json",
          "Authorization": "Bearer " + cmp.session.access_token
        };
        fetch("http://localhost/semtinel/public/api/admin/role/permissions/0", {
          method: "GET",
          headers
        }).then((response) => response.json()).then((data) => {
          cmp.role_permissions = data;
          cmp.permissions_loading = false;
        }).catch((error) => {
          this.errorMessage = error;
          toastr.error("Error: " + error);
        });
      }
    },
    edit: function(id, name, owner, active) {
      let cmp = this;
      cmp.form_action = "edit";
      cmp.form_error = "";
      cmp.form_title = "Editar Rol";
      cmp.form_data.id = id;
      cmp.form_data.name = name;
      cmp.permissions_loading = true;
      let headers = {
        "User-Agent": "testing/1.0",
        "Accept": "application/json",
        "Authorization": "Bearer " + cmp.session.access_token
      };
      fetch("http://localhost/semtinel/public/api/admin/role/permissions/" + id, {
        method: "GET",
        headers
      }).then((response) => response.json()).then((data) => {
        cmp.role_permissions = data;
        cmp.permissions_loading = false;
      }).catch((error) => {
        this.errorMessage = error;
        toastr.error("Error: " + error);
      });
    },
    deleteDialog: function(id, role) {
      this.delete_id = id;
      this.delete_role = role;
    },
    async store() {
      let cmp = this;
      if (!cmp.isValidForm()) {
        return;
      }
      cmp.form_error = "";
      cmp.form_okbtn_text = "Procesando...";
      let headers = {
        "User-Agent": "testing/1.0",
        "Accept": "application/json",
        "Authorization": "Bearer " + cmp.session.access_token
      };
      await axios.post("http://localhost/semtinel/public/api/admin/role", {
        "id": cmp.form_data.id,
        "name": cmp.form_data.name,
        "permissions": this.role_permissions
      }, {
        headers
      }).then(function(response) {
        if (response.data.success) {
          cmp.form_error = "";
          cmp.form_okbtn_text = "Aceptar";
          cmp.$refs.Close.click();
          if (cmp.form_action == "create") {
            toastr.success("El Rol fue Agregado con \xE9xito.");
          } else if (cmp.form_action == "edit") {
            toastr.success("El Rol fue Actualizado con \xE9xito.");
          }
          cmp.listReload();
        } else {
          cmp.form_error = "";
          cmp.form_okbtn_text = "Aceptar";
          cmp.error("Error al intentar realizar la operaci\xF3n.");
        }
      }).catch(function(error) {
        cmp.form_error = "Ha ocurrido un error. Por favor, prueba nuevamente.";
        cmp.form_okbtn_text = "Aceptar";
        return;
      });
    },
    async destroy() {
      let cmp = this;
      cmp.delete_error = "";
      cmp.delete_loading = true;
      cmp.delete_text = "Procesando...";
      let headers = {
        "User-Agent": "testing/1.0",
        "Accept": "application/json",
        "Authorization": "Bearer " + cmp.session.access_token
      };
      await axios.delete("http://localhost/semtinel/public/api/admin/role/" + cmp.delete_id, {
        headers
      }, {}).then(function(response) {
        if (response.data.success) {
          cmp.delete_error = "";
          cmp.delete_loading = false;
          cmp.delete_text = "Eliminar";
          cmp.$refs.delClose.click();
          toastr.success("El Rol fue Eliminado con \xE9xito.");
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
    if (!JSON.parse(sessionStorage.getItem("semtinel")).access_token) {
      sessionStorage.clear();
      window.document.location.href = "http://localhost/semtinel/public/login";
    }
    this.getItemsTable();
  }
};
const _hoisted_1 = { class: "container-fluid px-0" };
const _hoisted_2 = { class: "card card-default" };
const _hoisted_3 = { class: "card-header" };
const _hoisted_4 = /* @__PURE__ */ createBaseVNode("h3", { class: "card-title" }, "Roles", -1);
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
    /* @__PURE__ */ createBaseVNode("span", { class: "mdi mdi-loading mdi-spin mdi-36px" }, "\xA0Cargando roles...")
  ])
], -1);
const _hoisted_12 = [
  _hoisted_11
];
const _hoisted_13 = /* @__PURE__ */ createBaseVNode("div", { class: "col-12 text-center empty-table" }, [
  /* @__PURE__ */ createBaseVNode("h6", null, "Ning\xFAn Rol encontrado")
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
    /* @__PURE__ */ createBaseVNode("th", {
      width: "100",
      class: "text-center no-sort"
    }, "Modificar"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "100",
      class: "text-center no-sort"
    }, "Eliminar")
  ])
], -1);
const _hoisted_18 = { class: "text-center" };
const _hoisted_19 = { class: "text-center" };
const _hoisted_20 = ["onClick"];
const _hoisted_21 = /* @__PURE__ */ createBaseVNode("span", { class: "mdi mdi-pencil mdi-18px text-orange" }, null, -1);
const _hoisted_22 = [
  _hoisted_21
];
const _hoisted_23 = { class: "text-center" };
const _hoisted_24 = ["onClick"];
const _hoisted_25 = /* @__PURE__ */ createBaseVNode("span", { class: "mdi mdi-trash-can-outline mdi-18px text-danger" }, null, -1);
const _hoisted_26 = [
  _hoisted_25
];
const _hoisted_27 = {
  class: "modal fade",
  id: "modal-role-form",
  "aria-hidden": "true",
  role: "dialog",
  "data-backdrop": "static",
  "data-keyboard": "false"
};
const _hoisted_28 = { class: "modal-dialog" };
const _hoisted_29 = { class: "modal-content" };
const _hoisted_30 = { class: "modal-title" };
const _hoisted_31 = {
  type: "button",
  ref: "Close",
  class: "close",
  "data-dismiss": "modal",
  "aria-label": "Close"
};
const _hoisted_32 = /* @__PURE__ */ createBaseVNode("span", { "aria-hidden": "true" }, "\xD7", -1);
const _hoisted_33 = [
  _hoisted_32
];
const _hoisted_34 = { class: "modal-body px-4" };
const _hoisted_35 = { class: "row" };
const _hoisted_36 = { class: "col-md-12" };
const _hoisted_37 = { class: "form-group" };
const _hoisted_38 = /* @__PURE__ */ createBaseVNode("label", { for: "name" }, "Nombre:", -1);
const _hoisted_39 = {
  key: 0,
  class: "row pt-2"
};
const _hoisted_40 = { class: "col-12 text-center" };
const _hoisted_41 = { class: "form_error" };
const _hoisted_42 = { class: "card card-default" };
const _hoisted_43 = /* @__PURE__ */ createStaticVNode('<div class="card-header"><h3 class="card-title">Permisos</h3><div class="card-tools"><button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button></div></div>', 1);
const _hoisted_44 = { class: "card-body" };
const _hoisted_45 = /* @__PURE__ */ createBaseVNode("div", { class: "col-12 text-center py-5 loading-table" }, [
  /* @__PURE__ */ createBaseVNode("h6", null, [
    /* @__PURE__ */ createBaseVNode("span", { class: "mdi mdi-loading mdi-spin mdi-36px" }, "\xA0Cargando permisos...")
  ])
], -1);
const _hoisted_46 = [
  _hoisted_45
];
const _hoisted_47 = { class: "col-12" };
const _hoisted_48 = { class: "table table-striped" };
const _hoisted_49 = /* @__PURE__ */ createBaseVNode("thead", null, [
  /* @__PURE__ */ createBaseVNode("tr", null, [
    /* @__PURE__ */ createBaseVNode("th", {
      width: "50",
      class: "text-center no-sort"
    }, "No."),
    /* @__PURE__ */ createBaseVNode("th", null, "Nombre"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "100",
      class: "text-center no-sort"
    }, "Permite")
  ])
], -1);
const _hoisted_50 = { class: "text-center" };
const _hoisted_51 = { class: "text-center" };
const _hoisted_52 = ["checked", "onChange"];
const _hoisted_53 = { class: "modal-footer justify-content-between" };
const _hoisted_54 = /* @__PURE__ */ createBaseVNode("button", {
  type: "button",
  class: "btn btn-default ripple",
  "data-dismiss": "modal"
}, "Cancelar", -1);
const _hoisted_55 = ["disabled"];
const _hoisted_56 = {
  key: 0,
  class: "mdi mdi-check-all"
};
const _hoisted_57 = {
  key: 1,
  class: "mdi mdi-loading mdi-spin"
};
const _hoisted_58 = {
  class: "modal fade",
  id: "modal-role-delete",
  "aria-hidden": "true",
  role: "dialog",
  "data-backdrop": "static",
  "data-keyboard": "false"
};
const _hoisted_59 = { class: "modal-dialog modal-lg" };
const _hoisted_60 = { class: "modal-content" };
const _hoisted_61 = { class: "modal-header header-danger" };
const _hoisted_62 = /* @__PURE__ */ createBaseVNode("h4", { class: "modal-title" }, "Confirmaci\xF3n", -1);
const _hoisted_63 = {
  type: "button",
  ref: "delClose",
  class: "close",
  "data-dismiss": "modal",
  "aria-label": "Close"
};
const _hoisted_64 = /* @__PURE__ */ createBaseVNode("span", { "aria-hidden": "true" }, "\xD7", -1);
const _hoisted_65 = [
  _hoisted_64
];
const _hoisted_66 = { class: "modal-body px-4" };
const _hoisted_67 = /* @__PURE__ */ createBaseVNode("div", {
  class: "float-start",
  style: { "width": "70px" }
}, [
  /* @__PURE__ */ createBaseVNode("i", { class: "mdi mdi-chat-question mdi-48px" })
], -1);
const _hoisted_68 = {
  class: "float-start pt-3",
  style: { "width": "85%" }
};
const _hoisted_69 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_70 = {
  key: 0,
  class: "row pt-2"
};
const _hoisted_71 = { class: "col-12 text-center" };
const _hoisted_72 = { class: "form_error" };
const _hoisted_73 = { class: "modal-footer justify-content-between" };
const _hoisted_74 = /* @__PURE__ */ createBaseVNode("button", {
  type: "button",
  class: "btn btn-default",
  "data-dismiss": "modal"
}, "Cancelar", -1);
const _hoisted_75 = ["disabled"];
const _hoisted_76 = /* @__PURE__ */ createBaseVNode("i", { class: "mdi mdi-trash-can-outline" }, null, -1);
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
              "data-target": "#modal-role-form",
              onClick: _cache[1] || (_cache[1] = ($event) => $options.create())
            }, _hoisted_9)), [
              [_directive_tooltip, "Nuevo Rol"]
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_10, [
          createBaseVNode("div", {
            class: normalizeClass(["row mt-3", _ctx.roles_loading ? "" : "hidden"])
          }, _hoisted_12, 2),
          createBaseVNode("div", {
            class: normalizeClass(["row mt-3", _ctx.roles_empty ? "" : "hidden"])
          }, _hoisted_14, 2),
          createBaseVNode("div", {
            class: normalizeClass(["row", !_ctx.roles_loading && !_ctx.roles_empty ? "" : "hidden"])
          }, [
            createBaseVNode("div", _hoisted_15, [
              createBaseVNode("table", _hoisted_16, [
                _hoisted_17,
                createBaseVNode("tbody", null, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.roles, (item, idx) => {
                    return openBlock(), createElementBlock("tr", {
                      key: item.id
                    }, [
                      createBaseVNode("td", _hoisted_18, toDisplayString(idx + 1), 1),
                      createBaseVNode("td", null, toDisplayString(item.name), 1),
                      createBaseVNode("td", _hoisted_19, [
                        withDirectives((openBlock(), createElementBlock("a", {
                          href: "javascript:void(0);",
                          class: "btn-semti-tool",
                          style: { "padding": "4px 5px" },
                          "data-toggle": "modal",
                          "data-target": "#modal-role-form",
                          onClick: ($event) => $options.edit(item.id, item.name, item.owner, item.active)
                        }, _hoisted_22, 8, _hoisted_20)), [
                          [_directive_tooltip, "Modificar este Rol"]
                        ])
                      ]),
                      createBaseVNode("td", _hoisted_23, [
                        withDirectives((openBlock(), createElementBlock("a", {
                          href: "javascript:void(0);",
                          class: "btn-semti-tool",
                          style: { "padding": "4px 5px" },
                          "data-toggle": "modal",
                          "data-target": "#modal-role-delete",
                          onClick: ($event) => $options.deleteDialog(item.id, item.name)
                        }, _hoisted_26, 8, _hoisted_24)), [
                          [_directive_tooltip, "Eliminar este Rol"]
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
    createBaseVNode("div", _hoisted_27, [
      createBaseVNode("div", _hoisted_28, [
        createBaseVNode("div", _hoisted_29, [
          createBaseVNode("div", {
            class: normalizeClass(["modal-header", "header-" + _ctx.form_color])
          }, [
            createBaseVNode("h4", _hoisted_30, toDisplayString(_ctx.form_title), 1),
            createBaseVNode("button", _hoisted_31, _hoisted_33, 512)
          ], 2),
          createBaseVNode("div", _hoisted_34, [
            createBaseVNode("form", null, [
              withDirectives(createBaseVNode("input", {
                type: "hidden",
                name: "id_role",
                id: "id_role",
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => _ctx.form_data.id = $event)
              }, null, 512), [
                [vModelText, _ctx.form_data.id]
              ]),
              createBaseVNode("div", _hoisted_35, [
                createBaseVNode("div", _hoisted_36, [
                  createBaseVNode("div", _hoisted_37, [
                    _hoisted_38,
                    withDirectives(createBaseVNode("input", {
                      type: "text",
                      class: "form-control",
                      id: "name",
                      name: "name",
                      placeholder: "Nombre del rol",
                      "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => _ctx.form_data.name = $event)
                    }, null, 512), [
                      [vModelText, _ctx.form_data.name]
                    ])
                  ])
                ])
              ]),
              _ctx.form_error != "" ? (openBlock(), createElementBlock("div", _hoisted_39, [
                createBaseVNode("div", _hoisted_40, [
                  createBaseVNode("h6", _hoisted_41, toDisplayString(_ctx.form_error), 1)
                ])
              ])) : createCommentVNode("", true),
              createBaseVNode("div", _hoisted_42, [
                _hoisted_43,
                createBaseVNode("div", _hoisted_44, [
                  createBaseVNode("div", {
                    class: normalizeClass(["row mt-3", _ctx.permissions_loading ? "" : "hidden"])
                  }, _hoisted_46, 2),
                  createBaseVNode("div", {
                    class: normalizeClass(["row", !_ctx.permissions_loading && _ctx.role_permissions.length > 0 ? "" : "hidden"])
                  }, [
                    createBaseVNode("div", _hoisted_47, [
                      createBaseVNode("table", _hoisted_48, [
                        _hoisted_49,
                        createBaseVNode("tbody", null, [
                          (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.role_permissions, (item, idx) => {
                            return openBlock(), createElementBlock("tr", {
                              key: item.id
                            }, [
                              createBaseVNode("td", _hoisted_50, toDisplayString(idx + 1), 1),
                              createBaseVNode("td", null, toDisplayString(item.name), 1),
                              createBaseVNode("td", _hoisted_51, [
                                createBaseVNode("input", {
                                  type: "checkbox",
                                  class: "form-check-input ml-0",
                                  id: "permission_active",
                                  name: "permission_active",
                                  checked: item.active,
                                  onChange: ($event) => $options.activePermission(idx)
                                }, null, 40, _hoisted_52)
                              ])
                            ]);
                          }), 128))
                        ])
                      ])
                    ])
                  ], 2)
                ])
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_53, [
            _hoisted_54,
            createBaseVNode("button", {
              type: "button",
              class: normalizeClass(["btn btn-primary ripple", "btn-" + _ctx.form_color]),
              disabled: _ctx.form_loading,
              onClick: _cache[4] || (_cache[4] = withModifiers(($event) => $options.store(), ["stop"]))
            }, [
              !_ctx.form_loading ? (openBlock(), createElementBlock("i", _hoisted_56)) : (openBlock(), createElementBlock("i", _hoisted_57)),
              createTextVNode(" \xA0" + toDisplayString(_ctx.form_okbtn_text), 1)
            ], 10, _hoisted_55)
          ])
        ])
      ])
    ]),
    createBaseVNode("div", _hoisted_58, [
      createBaseVNode("div", _hoisted_59, [
        createBaseVNode("div", _hoisted_60, [
          createBaseVNode("div", _hoisted_61, [
            _hoisted_62,
            createBaseVNode("button", _hoisted_63, _hoisted_65, 512)
          ]),
          createBaseVNode("div", _hoisted_66, [
            _hoisted_67,
            createBaseVNode("div", _hoisted_68, [
              createBaseVNode("p", null, [
                createTextVNode('El Rol "'),
                createBaseVNode("strong", null, toDisplayString(_ctx.delete_role), 1),
                createTextVNode('" ser\xE1 Eliminado de la plataforma Semtinel.'),
                _hoisted_69,
                createTextVNode("Confirme que desea realizar esta operaci\xF3n.")
              ])
            ]),
            _ctx.form_error != "" ? (openBlock(), createElementBlock("div", _hoisted_70, [
              createBaseVNode("div", _hoisted_71, [
                createBaseVNode("h6", _hoisted_72, toDisplayString(_ctx.form_error), 1)
              ])
            ])) : createCommentVNode("", true)
          ]),
          createBaseVNode("div", _hoisted_73, [
            _hoisted_74,
            createBaseVNode("button", {
              type: "button",
              class: "btn btn-danger ripple",
              disabled: _ctx.delete_loading,
              onClick: _cache[5] || (_cache[5] = ($event) => $options.destroy())
            }, [
              _hoisted_76,
              createTextVNode("\xA0" + toDisplayString(_ctx.delete_text), 1)
            ], 8, _hoisted_75)
          ])
        ])
      ])
    ])
  ], 64);
}
const RolesComponent = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  RolesComponent as default
};
