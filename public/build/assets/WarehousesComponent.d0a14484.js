import { o as openBlock, b as createElementBlock, i as createBaseVNode, j as createCommentVNode, F as Fragment, I as renderList, L as withModifiers, v as toDisplayString, J as withDirectives, f as normalizeClass, N as vModelText, H as createTextVNode, G as createStaticVNode, K as resolveDirective } from "./vue.esm-bundler.7d6bf7a6.js";
import { _ as _export_sfc } from "./app.affc77e9.js";
const _sfc_main = {
  data: function() {
    return {
      poles: [],
      store_projects: [],
      store_warehouses: [],
      projects: [],
      warehouses: {
        pole: "",
        project: "",
        items: []
      },
      poles_loading: true,
      projects_loading: true,
      warehouses_loading: true,
      warehouses_empty: false,
      loading: true,
      form_title: "Nuevo Pa\xF1ol",
      form_data: {
        id: "",
        name: "",
        owner: "",
        active: 1
      },
      form_action: "",
      form_error: "",
      form_okbtn_text: "Aceptar",
      form_color: "green",
      form_loading: false,
      delete_text: "Eliminar",
      delete_id: "",
      delete_warehouse: "",
      delete_error: "",
      delete_loading: false,
      session: JSON.parse(sessionStorage.getItem("semtinel"))
    };
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
    changePole: function(pole_id, pole_abbr) {
      let cmp = this, projects = [], warehouses = [];
      cmp.warehouses.pole = pole_abbr;
      cmp.projects_loading = true;
      cmp.store_projects.map(function(value, key) {
        if (value.id_pole == pole_id)
          projects.push(value);
      });
      cmp.projects = projects;
      cmp.projects_loading = false;
      if (cmp.projects.length > 0) {
        cmp.warehouses.project = cmp.projects[0].id;
        cmp.warehouses_empty = false;
      } else {
        cmp.warehouses.project = "";
        cmp.warehouses_empty = true;
      }
      cmp.store_warehouses.map(function(value, key) {
        if (value.id_project == cmp.warehouses.project)
          warehouses.push(value);
      });
      cmp.warehouses.items = warehouses;
      if (cmp.warehouses.items.length == 0) {
        this.warehouses_empty = true;
      }
      cmp.warehouses_loading = false;
    },
    changeProject: function(project_abbr) {
      let cmp = this;
      cmp.warehouses.project = project_abbr;
    },
    listReload: function() {
      this.getItemsTable();
    },
    async getItemsTable() {
      let cmp = this, warehouses = [];
      cmp.warehouses_loading = true;
      let headers = {
        "User-Agent": "testing/1.0",
        "Accept": "application/json",
        "Authorization": "Bearer " + cmp.session.access_token
      };
      await fetch("http://localhost/semtinel/public/api/logistics/warehouses", {
        method: "GET",
        headers
      }).then((response) => response.json()).then((data) => {
        cmp.store_warehouses = data;
        cmp.store_warehouses.map(function(value, key) {
          if (value.id_project == cmp.warehouses.project)
            warehouses.push(value);
        });
        cmp.warehouses.items = warehouses;
        if (cmp.warehouses.items.length == 0) {
          this.warehouses_empty = true;
        }
        cmp.warehouses_loading = false;
      }).catch((error) => {
        this.errorMessage = error;
        toastr.error("Error: " + error);
      });
    },
    isValidForm: function() {
      if (this.form_data.name == null || this.form_data.name == "") {
        this.form_error = "Debe escribir un Nombre para el pa\xF1ol.";
        return false;
      }
      if (this.form_data.owner == null || this.form_data.owner == "") {
        this.form_error = "Debe escribir un Responsable del pa\xF1ol.";
        return false;
      }
      return true;
    },
    create: function() {
      this.form_action = "create";
      this.form_error = "";
      this.form_title = "Nuevo Pa\xF1ol";
      this.form_data.id = "";
      this.form_data.name = "";
      this.form_data.owner = "";
      this.form_data.active = 1;
    },
    edit: function(id, name, owner, active) {
      this.form_action = "edit";
      this.form_error = "";
      this.form_title = "Editar Pa\xF1ol";
      this.form_data.id = id;
      this.form_data.name = name;
      this.form_data.owner = owner;
      this.form_data.active = active;
    },
    activeWarehouse: function() {
      if (this.form_data.active == 1)
        this.form_data.active = 0;
      else
        this.form_data.active = 1;
    },
    deleteDialog: function(id, warehouse) {
      this.delete_id = id;
      this.delete_warehouse = warehouse;
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
      await axios.post("http://localhost/semtinel/public/api/logistics/warehouse", {
        "id": cmp.form_data.id,
        "project": cmp.warehouses.project,
        "name": cmp.form_data.name,
        "owner": cmp.form_data.owner,
        "active": cmp.form_data.active
      }, {
        headers
      }).then(function(response) {
        if (response.data.success) {
          cmp.form_error = "";
          cmp.form_okbtn_text = "Aceptar";
          cmp.$refs.Close.click();
          if (cmp.form_action == "create") {
            toastr.success("El Pa\xF1ol fue Agregado con \xE9xito.");
          } else if (cmp.form_action == "edit") {
            toastr.success("El Pa\xF1ol fue Actualizado con \xE9xito.");
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
      await axios.delete("http://localhost/semtinel/public/api/logistics/warehouse/" + cmp.delete_id, {
        headers
      }, {}).then(function(response) {
        if (response.data.success) {
          cmp.delete_error = "";
          cmp.delete_loading = false;
          cmp.delete_text = "Eliminar";
          cmp.$refs.delClose.click();
          toastr.success("El Pa\xF1ol fue Eliminado con \xE9xito.");
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
    let headers = {
      "User-Agent": "testing/1.0",
      "Accept": "application/json",
      "Authorization": "Bearer 2|hRRNHI6VGAYQnUefCadsTzH6YrYYwodOVx8oMUTr"
    };
    fetch("http://localhost/semtinel/public/api/logistics/warehouses", {
      method: "GET",
      headers
    }).then((response) => response.json()).then((data) => {
      this.store_warehouses = data;
      fetch("http://localhost/semtinel/public/api/projects", {
        method: "GET",
        headers
      }).then((response) => response.json()).then((data2) => {
        this.store_projects = data2;
        fetch("http://localhost/semtinel/public/api/poles", {
          method: "GET",
          headers
        }).then((response) => response.json()).then((data3) => {
          this.poles = data3;
          this.changePole(data3[0].id, data3[0].abbr);
          this.poles_loading = false;
        }).catch((error) => {
          this.errorMessage = error;
          toastr.error("Error: " + error);
        });
      }).catch((error) => {
        this.errorMessage = error;
        toastr.error("Error: " + error);
      });
    }).catch((error) => {
      this.errorMessage = error;
      toastr.error("Error: " + error);
    });
  }
};
const _hoisted_1 = { class: "container-fluid px-0" };
const _hoisted_2 = { class: "card card-default" };
const _hoisted_3 = /* @__PURE__ */ createStaticVNode('<div class="card-header"><h3 class="card-title">Polo &amp; Proyecto</h3><div class="card-tools"><button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button></div></div>', 1);
const _hoisted_4 = { class: "card-body" };
const _hoisted_5 = { class: "row" };
const _hoisted_6 = { class: "col-md-3" };
const _hoisted_7 = { class: "form-group" };
const _hoisted_8 = /* @__PURE__ */ createBaseVNode("label", null, "Polo", -1);
const _hoisted_9 = ["disabled"];
const _hoisted_10 = { key: 0 };
const _hoisted_11 = ["value", "selected", "onClick"];
const _hoisted_12 = { class: "col-md-3" };
const _hoisted_13 = { class: "form-group" };
const _hoisted_14 = /* @__PURE__ */ createBaseVNode("label", null, "Proyecto", -1);
const _hoisted_15 = ["disabled"];
const _hoisted_16 = { key: 0 };
const _hoisted_17 = ["value", "selected", "onClick"];
const _hoisted_18 = { class: "card card-default" };
const _hoisted_19 = { class: "card-header" };
const _hoisted_20 = /* @__PURE__ */ createBaseVNode("h3", { class: "card-title" }, "Almacenes", -1);
const _hoisted_21 = { class: "card-tools" };
const _hoisted_22 = /* @__PURE__ */ createBaseVNode("i", { class: "mdi mdi-reload mdi-24px text-green" }, null, -1);
const _hoisted_23 = [
  _hoisted_22
];
const _hoisted_24 = /* @__PURE__ */ createBaseVNode("i", { class: "mdi mdi-plus-circle mdi-24px text-green" }, null, -1);
const _hoisted_25 = [
  _hoisted_24
];
const _hoisted_26 = { class: "card-body" };
const _hoisted_27 = /* @__PURE__ */ createBaseVNode("div", { class: "col-12 text-center py-5 loading-table" }, [
  /* @__PURE__ */ createBaseVNode("h6", null, [
    /* @__PURE__ */ createBaseVNode("span", { class: "mdi mdi-loading mdi-spin mdi-36px" }, "\xA0Cargando pa\xF1oles...")
  ])
], -1);
const _hoisted_28 = [
  _hoisted_27
];
const _hoisted_29 = /* @__PURE__ */ createBaseVNode("div", { class: "col-12 text-center empty-table" }, [
  /* @__PURE__ */ createBaseVNode("h6", null, "Ning\xFAn Pa\xF1ol encontrado")
], -1);
const _hoisted_30 = [
  _hoisted_29
];
const _hoisted_31 = { class: "col-12" };
const _hoisted_32 = {
  id: "datatable",
  class: "table table-striped"
};
const _hoisted_33 = /* @__PURE__ */ createBaseVNode("thead", null, [
  /* @__PURE__ */ createBaseVNode("tr", null, [
    /* @__PURE__ */ createBaseVNode("th", {
      width: "50",
      class: "text-center no-sort"
    }, "No."),
    /* @__PURE__ */ createBaseVNode("th", null, "Nombre"),
    /* @__PURE__ */ createBaseVNode("th", null, "Responsable"),
    /* @__PURE__ */ createBaseVNode("th", { class: "text-center no-sort" }, "Activo"),
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
const _hoisted_34 = { class: "text-center" };
const _hoisted_35 = { class: "text-center" };
const _hoisted_36 = { class: "text-center" };
const _hoisted_37 = ["onClick"];
const _hoisted_38 = /* @__PURE__ */ createBaseVNode("span", { class: "mdi mdi-pencil mdi-18px text-orange" }, null, -1);
const _hoisted_39 = [
  _hoisted_38
];
const _hoisted_40 = { class: "text-center" };
const _hoisted_41 = ["onClick"];
const _hoisted_42 = /* @__PURE__ */ createBaseVNode("span", { class: "mdi mdi-trash-can-outline mdi-18px text-danger" }, null, -1);
const _hoisted_43 = [
  _hoisted_42
];
const _hoisted_44 = {
  class: "modal fade",
  id: "modal-warehouse-form",
  "aria-hidden": "true",
  role: "dialog",
  "data-backdrop": "static",
  "data-keyboard": "false"
};
const _hoisted_45 = { class: "modal-dialog" };
const _hoisted_46 = { class: "modal-content" };
const _hoisted_47 = { class: "modal-title" };
const _hoisted_48 = {
  type: "button",
  ref: "Close",
  class: "close",
  "data-dismiss": "modal",
  "aria-label": "Close"
};
const _hoisted_49 = /* @__PURE__ */ createBaseVNode("span", { "aria-hidden": "true" }, "\xD7", -1);
const _hoisted_50 = [
  _hoisted_49
];
const _hoisted_51 = { class: "modal-body px-4" };
const _hoisted_52 = { class: "row" };
const _hoisted_53 = { class: "col-md-12" };
const _hoisted_54 = { class: "form-group" };
const _hoisted_55 = /* @__PURE__ */ createBaseVNode("label", { for: "name" }, "Nombre:", -1);
const _hoisted_56 = { class: "row" };
const _hoisted_57 = { class: "col-md-12" };
const _hoisted_58 = { class: "form-group" };
const _hoisted_59 = /* @__PURE__ */ createBaseVNode("label", { for: "name" }, "Responsable:", -1);
const _hoisted_60 = { class: "row" };
const _hoisted_61 = { class: "col-md-12" };
const _hoisted_62 = { class: "form-check ml-1" };
const _hoisted_63 = ["checked"];
const _hoisted_64 = /* @__PURE__ */ createBaseVNode("label", {
  class: "form-check-label",
  for: "wh_active"
}, "Activo", -1);
const _hoisted_65 = {
  key: 0,
  class: "row pt-2"
};
const _hoisted_66 = { class: "col-12 text-center" };
const _hoisted_67 = { class: "form_error" };
const _hoisted_68 = { class: "modal-footer justify-content-between" };
const _hoisted_69 = /* @__PURE__ */ createBaseVNode("button", {
  type: "button",
  class: "btn btn-default ripple",
  "data-dismiss": "modal"
}, "Cancelar", -1);
const _hoisted_70 = ["disabled"];
const _hoisted_71 = {
  key: 0,
  class: "mdi mdi-check-all"
};
const _hoisted_72 = {
  key: 1,
  class: "mdi mdi-loading mdi-spin"
};
const _hoisted_73 = {
  class: "modal fade",
  id: "modal-warehouse-delete",
  "aria-hidden": "true",
  role: "dialog",
  "data-backdrop": "static",
  "data-keyboard": "false"
};
const _hoisted_74 = { class: "modal-dialog modal-lg" };
const _hoisted_75 = { class: "modal-content" };
const _hoisted_76 = { class: "modal-header header-danger" };
const _hoisted_77 = /* @__PURE__ */ createBaseVNode("h4", { class: "modal-title" }, "Confirmaci\xF3n", -1);
const _hoisted_78 = {
  type: "button",
  ref: "delClose",
  class: "close",
  "data-dismiss": "modal",
  "aria-label": "Close"
};
const _hoisted_79 = /* @__PURE__ */ createBaseVNode("span", { "aria-hidden": "true" }, "\xD7", -1);
const _hoisted_80 = [
  _hoisted_79
];
const _hoisted_81 = { class: "modal-body px-4" };
const _hoisted_82 = /* @__PURE__ */ createBaseVNode("div", {
  class: "float-start",
  style: { "width": "70px" }
}, [
  /* @__PURE__ */ createBaseVNode("i", { class: "mdi mdi-chat-question mdi-48px" })
], -1);
const _hoisted_83 = {
  class: "float-start pt-3",
  style: { "width": "85%" }
};
const _hoisted_84 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_85 = { class: "modal-footer justify-content-between" };
const _hoisted_86 = /* @__PURE__ */ createBaseVNode("button", {
  type: "button",
  class: "btn btn-default",
  "data-dismiss": "modal"
}, "Cancelar", -1);
const _hoisted_87 = ["disabled"];
const _hoisted_88 = /* @__PURE__ */ createBaseVNode("i", { class: "mdi mdi-trash-can-outline" }, null, -1);
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_tooltip = resolveDirective("tooltip");
  return openBlock(), createElementBlock(Fragment, null, [
    createBaseVNode("div", _hoisted_1, [
      createBaseVNode("div", _hoisted_2, [
        _hoisted_3,
        createBaseVNode("div", _hoisted_4, [
          createBaseVNode("div", _hoisted_5, [
            createBaseVNode("div", _hoisted_6, [
              createBaseVNode("div", _hoisted_7, [
                _hoisted_8,
                createBaseVNode("select", {
                  name: "pole",
                  size: "1",
                  class: "form-control",
                  disabled: _ctx.poles_loading
                }, [
                  _ctx.poles_loading ? (openBlock(), createElementBlock("option", _hoisted_10, "Cargando polos...")) : createCommentVNode("", true),
                  (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.poles, (option, index) => {
                    return openBlock(), createElementBlock("option", {
                      key: index,
                      value: option.abbr,
                      selected: _ctx.warehouses.pole === option.abbr,
                      onClick: withModifiers(($event) => $options.changePole(option.id, option.abbr), ["stop"])
                    }, toDisplayString(option.name), 9, _hoisted_11);
                  }), 128))
                ], 8, _hoisted_9)
              ])
            ]),
            createBaseVNode("div", _hoisted_12, [
              createBaseVNode("div", _hoisted_13, [
                _hoisted_14,
                createBaseVNode("select", {
                  name: "project",
                  size: "1",
                  class: "form-control",
                  disabled: _ctx.projects_loading
                }, [
                  _ctx.projects_loading ? (openBlock(), createElementBlock("option", _hoisted_16, "Cargando proyectos...")) : createCommentVNode("", true),
                  (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.projects, (option, index) => {
                    return openBlock(), createElementBlock("option", {
                      key: index,
                      value: option.abbr,
                      selected: _ctx.warehouses.project === option.abbr,
                      onClick: withModifiers(($event) => $options.changeProject(option.abbr), ["stop"])
                    }, toDisplayString(option.name), 9, _hoisted_17);
                  }), 128))
                ], 8, _hoisted_15)
              ])
            ])
          ])
        ])
      ]),
      createBaseVNode("div", _hoisted_18, [
        createBaseVNode("div", _hoisted_19, [
          _hoisted_20,
          createBaseVNode("div", _hoisted_21, [
            withDirectives((openBlock(), createElementBlock("button", {
              type: "button",
              class: "btn btn-tool pl-0",
              onClick: _cache[0] || (_cache[0] = withModifiers(($event) => $options.listReload(), ["stop"]))
            }, _hoisted_23)), [
              [_directive_tooltip, "Recargar Listado"]
            ]),
            withDirectives((openBlock(), createElementBlock("button", {
              type: "button",
              class: "btn btn-tool pl-0",
              "data-toggle": "modal",
              "data-target": "#modal-warehouse-form",
              onClick: _cache[1] || (_cache[1] = ($event) => $options.create())
            }, _hoisted_25)), [
              [_directive_tooltip, "Nuevo Pa\xF1ol"]
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_26, [
          createBaseVNode("div", {
            class: normalizeClass(["row mt-3", _ctx.warehouses_loading ? "" : "hidden"])
          }, _hoisted_28, 2),
          createBaseVNode("div", {
            class: normalizeClass(["row mt-3", _ctx.warehouses_empty ? "" : "hidden"])
          }, _hoisted_30, 2),
          createBaseVNode("div", {
            class: normalizeClass(["row", !_ctx.warehouses_loading && !_ctx.warehouses_empty ? "" : "hidden"])
          }, [
            createBaseVNode("div", _hoisted_31, [
              createBaseVNode("table", _hoisted_32, [
                _hoisted_33,
                createBaseVNode("tbody", null, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.warehouses.items, (item, idx) => {
                    return openBlock(), createElementBlock("tr", {
                      key: item.id
                    }, [
                      createBaseVNode("td", _hoisted_34, toDisplayString(idx + 1), 1),
                      createBaseVNode("td", null, toDisplayString(item.name), 1),
                      createBaseVNode("td", null, toDisplayString(item.owner), 1),
                      createBaseVNode("td", _hoisted_35, [
                        createBaseVNode("span", {
                          class: normalizeClass(["mdi mdi-18px", item.active ? "mdi-checkbox-marked-circle" : "mdi-checkbox-blank-circle-outline"])
                        }, null, 2)
                      ]),
                      createBaseVNode("td", _hoisted_36, [
                        withDirectives((openBlock(), createElementBlock("a", {
                          href: "javascript:void(0);",
                          class: "btn-semti-tool",
                          style: { "padding": "4px 5px" },
                          "data-toggle": "modal",
                          "data-target": "#modal-warehouse-form",
                          onClick: ($event) => $options.edit(item.id, item.name, item.owner, item.active)
                        }, _hoisted_39, 8, _hoisted_37)), [
                          [_directive_tooltip, "Modificar este Pa\xF1ol"]
                        ])
                      ]),
                      createBaseVNode("td", _hoisted_40, [
                        withDirectives((openBlock(), createElementBlock("a", {
                          href: "javascript:void(0);",
                          class: "btn-semti-tool",
                          style: { "padding": "4px 5px" },
                          "data-toggle": "modal",
                          "data-target": "#modal-warehouse-delete",
                          onClick: ($event) => $options.deleteDialog(item.id, item.name)
                        }, _hoisted_43, 8, _hoisted_41)), [
                          [_directive_tooltip, "Eliminar este Pa\xF1ol"]
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
    createBaseVNode("div", _hoisted_44, [
      createBaseVNode("div", _hoisted_45, [
        createBaseVNode("div", _hoisted_46, [
          createBaseVNode("div", {
            class: normalizeClass(["modal-header", "header-" + _ctx.form_color])
          }, [
            createBaseVNode("h4", _hoisted_47, toDisplayString(_ctx.form_title), 1),
            createBaseVNode("button", _hoisted_48, _hoisted_50, 512)
          ], 2),
          createBaseVNode("div", _hoisted_51, [
            createBaseVNode("form", null, [
              withDirectives(createBaseVNode("input", {
                type: "hidden",
                name: "id_system",
                id: "id_system",
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => _ctx.form_data.id = $event)
              }, null, 512), [
                [vModelText, _ctx.form_data.id]
              ]),
              createBaseVNode("div", _hoisted_52, [
                createBaseVNode("div", _hoisted_53, [
                  createBaseVNode("div", _hoisted_54, [
                    _hoisted_55,
                    withDirectives(createBaseVNode("input", {
                      type: "text",
                      class: "form-control",
                      id: "name",
                      name: "name",
                      placeholder: "Nombre del sistema",
                      "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => _ctx.form_data.name = $event)
                    }, null, 512), [
                      [vModelText, _ctx.form_data.name]
                    ])
                  ])
                ])
              ]),
              createBaseVNode("div", _hoisted_56, [
                createBaseVNode("div", _hoisted_57, [
                  createBaseVNode("div", _hoisted_58, [
                    _hoisted_59,
                    withDirectives(createBaseVNode("input", {
                      type: "text",
                      class: "form-control",
                      id: "owner",
                      name: "owner",
                      placeholder: "Responsable del pa\xF1ol",
                      "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => _ctx.form_data.owner = $event)
                    }, null, 512), [
                      [vModelText, _ctx.form_data.owner]
                    ])
                  ])
                ])
              ]),
              createBaseVNode("div", _hoisted_60, [
                createBaseVNode("div", _hoisted_61, [
                  createBaseVNode("div", _hoisted_62, [
                    createBaseVNode("input", {
                      type: "checkbox",
                      class: "form-check-input",
                      id: "wh_active",
                      name: "wh_active",
                      checked: _ctx.form_data.active,
                      onChange: _cache[5] || (_cache[5] = ($event) => $options.activeWarehouse())
                    }, null, 40, _hoisted_63),
                    _hoisted_64
                  ])
                ])
              ]),
              _ctx.form_error != "" ? (openBlock(), createElementBlock("div", _hoisted_65, [
                createBaseVNode("div", _hoisted_66, [
                  createBaseVNode("h6", _hoisted_67, toDisplayString(_ctx.form_error), 1)
                ])
              ])) : createCommentVNode("", true)
            ])
          ]),
          createBaseVNode("div", _hoisted_68, [
            _hoisted_69,
            createBaseVNode("button", {
              type: "button",
              class: normalizeClass(["btn btn-primary ripple", "btn-" + _ctx.form_color]),
              disabled: _ctx.form_loading,
              onClick: _cache[6] || (_cache[6] = withModifiers(($event) => $options.store(), ["stop"]))
            }, [
              !_ctx.form_loading ? (openBlock(), createElementBlock("i", _hoisted_71)) : (openBlock(), createElementBlock("i", _hoisted_72)),
              createTextVNode(" \xA0" + toDisplayString(_ctx.form_okbtn_text), 1)
            ], 10, _hoisted_70)
          ])
        ])
      ])
    ]),
    createBaseVNode("div", _hoisted_73, [
      createBaseVNode("div", _hoisted_74, [
        createBaseVNode("div", _hoisted_75, [
          createBaseVNode("div", _hoisted_76, [
            _hoisted_77,
            createBaseVNode("button", _hoisted_78, _hoisted_80, 512)
          ]),
          createBaseVNode("div", _hoisted_81, [
            _hoisted_82,
            createBaseVNode("div", _hoisted_83, [
              createBaseVNode("p", null, [
                createTextVNode('El Pa\xF1ol "'),
                createBaseVNode("strong", null, toDisplayString(_ctx.delete_warehouse), 1),
                createTextVNode('" ser\xE1 Eliminado de la plataforma Semtinel.'),
                _hoisted_84,
                createTextVNode("Confirme que desea realizar esta operaci\xF3n.")
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_85, [
            _hoisted_86,
            createBaseVNode("button", {
              type: "button",
              class: "btn btn-danger ripple",
              disabled: _ctx.delete_loading,
              onClick: _cache[7] || (_cache[7] = ($event) => $options.destroy())
            }, [
              _hoisted_88,
              createTextVNode("\xA0" + toDisplayString(_ctx.delete_text), 1)
            ], 8, _hoisted_87)
          ])
        ])
      ])
    ])
  ], 64);
}
const WarehousesComponent = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  WarehousesComponent as default
};
