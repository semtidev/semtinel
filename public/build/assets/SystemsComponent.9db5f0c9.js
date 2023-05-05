import { o as openBlock, b as createElementBlock, i as createBaseVNode, L as withModifiers, f as normalizeClass, F as Fragment, I as renderList, v as toDisplayString, J as withDirectives, N as vModelText, j as createCommentVNode, H as createTextVNode } from "./vue.esm-bundler.ecfa1491.js";
import { _ as _export_sfc } from "./app.d5560dd0.js";
import { $ } from "./jquery.8baacbdb.js";
import "./jquery.dataTables.min.70653878.js";
const _sfc_main = {
  data: function() {
    return {
      systems: [],
      loading: true,
      form_title: "Nuevo Sistema",
      form_data: {
        id: "",
        name: "",
        active: 1
      },
      form_action: "",
      form_error: "",
      form_okbtn_text: "Aceptar",
      form_color: "green",
      form_loading: false,
      delete_text: "Eliminar",
      delete_id: "",
      delete_system: "",
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
    listReload: function() {
      this.getSystemsTable();
    },
    isValidForm: function() {
      if (this.form_data.name == null || this.form_data.name == "") {
        this.form_error = "Debe escribir un Nombre para el sistema.";
        return false;
      }
      return true;
    },
    async getSystemsTable() {
      let cmp = this;
      this.loading = true;
      let headers = {
        "User-Agent": "testing/1.0",
        "Accept": "application/json",
        "Authorization": "Bearer " + cmp.session.access_token
      };
      await fetch("http://localhost/semtinel/public/api/admin/systems", {
        method: "GET",
        headers
      }).then((response) => response.json()).then((data) => {
        cmp.systems = data;
        cmp.loading = false;
        if ($("#datatable").DataTable().destroy()) {
          setTimeout(() => {
            $("#datatable").DataTable({
              lengthMenu: [
                [10, 15, 25, 50, -1],
                [10, 15, 25, 50, "Todos"]
              ],
              pageLength: 10,
              order: [[1, "asc"]],
              "columnDefs": [{
                "targets": "no-sort",
                "orderable": false,
                "order": []
              }],
              "columns": [
                { "width": "5%" },
                null,
                { "width": "10%" },
                { "width": "10%" },
                { "width": "10%" }
              ],
              language: {
                "decimal": "",
                "emptyTable": "No hay informaci\xF3n",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ Registros",
                "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
                "infoFiltered": "(Filtrado de _MAX_ total registros)",
                "infoPostFix": "",
                "thousands": ",",
                "lengthMenu": "Mostrar _MENU_ Registros",
                "loadingRecords": "Cargando...",
                "processing": "Procesando...",
                "search": "Buscar: ",
                "zeroRecords": "Sin resultados encontrados",
                "paginate": {
                  "first": "Primero",
                  "last": "Ultimo",
                  "next": "Siguiente",
                  "previous": "Anterior"
                }
              }
            });
          });
        }
      }).catch((error) => {
        this.errorMessage = error;
        toastr.error("Error: " + error);
      });
    },
    create: function() {
      this.form_action = "create";
      this.form_error = "";
      this.form_title = "Nuevo Sistema";
      this.form_data.id = "";
      this.form_data.name = "";
      this.form_data.active = 1;
    },
    edit: function(id, name, active) {
      this.form_action = "edit";
      this.form_error = "";
      this.form_title = "Editar Sistema";
      this.form_data.id = id;
      this.form_data.name = name;
      this.form_data.active = active;
    },
    activeSystem: function() {
      if (this.form_data.active == 1)
        this.form_data.active = 0;
      else
        this.form_data.active = 1;
    },
    deleteDialog: function(id, system) {
      this.delete_id = id;
      this.delete_system = system;
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
      await axios.post("http://localhost/semtinel/public/api/admin/system", {
        "id": cmp.form_data.id,
        "name": cmp.form_data.name,
        "active": cmp.form_data.active
      }, {
        headers
      }).then(function(response) {
        if (response.data.success) {
          cmp.form_error = "";
          cmp.form_okbtn_text = "Aceptar";
          cmp.$refs.Close.click();
          if (cmp.form_action == "create") {
            toastr.success("El Sistema fue Agregado con \xE9xito.");
          } else if (cmp.form_action == "edit") {
            toastr.success("El Sistema fue Actualizado con \xE9xito.");
          }
          cmp.listReload();
        } else {
          cmp.form_error = "";
          cmp.form_okbtn_text = "Aceptar";
          toastr.error("Error al intentar realizar la operaci\xF3n.");
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
      await axios.delete("http://localhost/semtinel/public/api/admin/system/" + cmp.delete_id, {
        headers
      }, {}).then(function(response) {
        if (response.data.success) {
          cmp.delete_error = "";
          cmp.delete_loading = false;
          cmp.delete_text = "Eliminar";
          cmp.$refs.delClose.click();
          toastr.success("El Sistema fue Eliminado con \xE9xito.");
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
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    let cmp = this;
    if (!JSON.parse(sessionStorage.getItem("semtinel")).access_token) {
      sessionStorage.clear();
      window.document.location.href = "http://localhost/semtinel/public/login";
    }
    let headers = {
      "User-Agent": "testing/1.0",
      "Accept": "application/json",
      "Authorization": "Bearer " + cmp.session.access_token
    };
    fetch("http://localhost/semtinel/public/api/admin/systems", {
      method: "GET",
      headers
    }).then((response) => response.json()).then((data) => {
      cmp.systems = data;
      cmp.loading = false;
      setTimeout(() => {
        $("#datatable").DataTable({
          retrieve: true,
          lengthMenu: [
            [10, 15, 25, 50, -1],
            [10, 15, 25, 50, "Todos"]
          ],
          pageLength: 10,
          order: [[1, "asc"]],
          "columnDefs": [{
            "targets": "no-sort",
            "orderable": false,
            "order": []
          }],
          language: {
            "decimal": "",
            "emptyTable": "No hay informaci\xF3n",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ Registros",
            "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
            "infoFiltered": "(Filtrado de _MAX_ total registros)",
            "infoPostFix": "",
            "thousands": ",",
            "lengthMenu": "Mostrar _MENU_ Registros",
            "loadingRecords": "Cargando...",
            "processing": "Procesando...",
            "search": "Buscar: ",
            "zeroRecords": "Sin resultados encontrados",
            "paginate": {
              "first": "Primero",
              "last": "Ultimo",
              "next": "Siguiente",
              "previous": "Anterior"
            }
          }
        });
      });
    }).catch((error) => {
      this.errorMessage = error;
      toastr.error("Error: " + error);
    });
  }
};
const _hoisted_1 = { class: "container-fluid px-0" };
const _hoisted_2 = { class: "card" };
const _hoisted_3 = { class: "card-header" };
const _hoisted_4 = /* @__PURE__ */ createBaseVNode("h3", { class: "card-title" }, "Semtinel Apps", -1);
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
  /* @__PURE__ */ createBaseVNode("span", { class: "mdi mdi-loading mdi-spin mdi-36px" }, "\xA0Cargando sistemas...")
], -1);
const _hoisted_12 = [
  _hoisted_11
];
const _hoisted_13 = { class: "col-12" };
const _hoisted_14 = {
  id: "datatable",
  class: "table table-striped"
};
const _hoisted_15 = /* @__PURE__ */ createBaseVNode("thead", null, [
  /* @__PURE__ */ createBaseVNode("tr", null, [
    /* @__PURE__ */ createBaseVNode("th", {
      width: "5%",
      class: "text-center no-sort"
    }, "No."),
    /* @__PURE__ */ createBaseVNode("th", null, "Nombre"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "10%",
      class: "text-center no-sort"
    }, "Activo"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "10%",
      class: "text-center no-sort"
    }, "Modificar"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "10%",
      class: "text-center no-sort"
    }, "Eliminar")
  ])
], -1);
const _hoisted_16 = { class: "text-center" };
const _hoisted_17 = { class: "text-center" };
const _hoisted_18 = { class: "text-center" };
const _hoisted_19 = ["onClick"];
const _hoisted_20 = /* @__PURE__ */ createBaseVNode("span", { class: "mdi mdi-pencil mdi-18px text-orange" }, null, -1);
const _hoisted_21 = [
  _hoisted_20
];
const _hoisted_22 = { class: "text-center" };
const _hoisted_23 = ["onClick"];
const _hoisted_24 = /* @__PURE__ */ createBaseVNode("span", { class: "mdi mdi-trash-can-outline mdi-18px text-danger" }, null, -1);
const _hoisted_25 = [
  _hoisted_24
];
const _hoisted_26 = {
  class: "modal fade",
  id: "modal-system-form",
  "aria-hidden": "true",
  role: "dialog",
  "data-backdrop": "static",
  "data-keyboard": "false"
};
const _hoisted_27 = { class: "modal-dialog" };
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
const _hoisted_35 = { class: "col-md-12" };
const _hoisted_36 = { class: "form-group" };
const _hoisted_37 = /* @__PURE__ */ createBaseVNode("label", { for: "name" }, "Nombre:", -1);
const _hoisted_38 = { class: "row" };
const _hoisted_39 = { class: "col-md-12" };
const _hoisted_40 = { class: "form-check ml-1" };
const _hoisted_41 = ["checked"];
const _hoisted_42 = /* @__PURE__ */ createBaseVNode("label", {
  class: "form-check-label",
  for: "syst_active"
}, "Activo", -1);
const _hoisted_43 = {
  key: 0,
  class: "row pt-2"
};
const _hoisted_44 = { class: "col-12 text-center" };
const _hoisted_45 = { class: "form_error" };
const _hoisted_46 = { class: "modal-footer justify-content-between" };
const _hoisted_47 = /* @__PURE__ */ createBaseVNode("button", {
  type: "button",
  class: "btn btn-default ripple",
  "data-dismiss": "modal"
}, "Cancelar", -1);
const _hoisted_48 = ["disabled"];
const _hoisted_49 = {
  key: 0,
  class: "mdi mdi-check-all"
};
const _hoisted_50 = {
  key: 1,
  class: "mdi mdi-loading mdi-spin"
};
const _hoisted_51 = {
  class: "modal fade",
  id: "modal-system-delete",
  "aria-hidden": "true",
  role: "dialog",
  "data-backdrop": "static",
  "data-keyboard": "false"
};
const _hoisted_52 = { class: "modal-dialog modal-lg" };
const _hoisted_53 = { class: "modal-content" };
const _hoisted_54 = { class: "modal-header header-danger" };
const _hoisted_55 = /* @__PURE__ */ createBaseVNode("h4", { class: "modal-title" }, "Confirmaci\xF3n", -1);
const _hoisted_56 = {
  type: "button",
  ref: "delClose",
  class: "close",
  "data-dismiss": "modal",
  "aria-label": "Close"
};
const _hoisted_57 = /* @__PURE__ */ createBaseVNode("span", { "aria-hidden": "true" }, "\xD7", -1);
const _hoisted_58 = [
  _hoisted_57
];
const _hoisted_59 = { class: "modal-body px-4" };
const _hoisted_60 = /* @__PURE__ */ createBaseVNode("div", {
  class: "float-start",
  style: { "width": "70px" }
}, [
  /* @__PURE__ */ createBaseVNode("i", { class: "mdi mdi-chat-question mdi-48px" })
], -1);
const _hoisted_61 = {
  class: "float-start pt-3",
  style: { "width": "85%" }
};
const _hoisted_62 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_63 = { class: "modal-footer justify-content-between" };
const _hoisted_64 = /* @__PURE__ */ createBaseVNode("button", {
  type: "button",
  class: "btn btn-default",
  "data-dismiss": "modal"
}, "Cancelar", -1);
const _hoisted_65 = ["disabled"];
const _hoisted_66 = /* @__PURE__ */ createBaseVNode("i", { class: "mdi mdi-trash-can-outline" }, null, -1);
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(Fragment, null, [
    createBaseVNode("div", _hoisted_1, [
      createBaseVNode("div", _hoisted_2, [
        createBaseVNode("div", _hoisted_3, [
          _hoisted_4,
          createBaseVNode("div", _hoisted_5, [
            createBaseVNode("button", {
              type: "button",
              class: "btn btn-tool pr-2",
              "data-bs-toggle": "tooltip",
              title: "Recargar Listado",
              onClick: _cache[0] || (_cache[0] = withModifiers(($event) => $options.listReload(), ["stop"]))
            }, _hoisted_7),
            createBaseVNode("button", {
              type: "button",
              class: "btn btn-tool pl-0",
              "data-bs-toggle": "tooltip",
              title: "Nuevo Sistema",
              "data-toggle": "modal",
              "data-target": "#modal-system-form",
              onClick: _cache[1] || (_cache[1] = ($event) => $options.create())
            }, _hoisted_9)
          ])
        ]),
        createBaseVNode("div", _hoisted_10, [
          createBaseVNode("div", {
            class: normalizeClass(["row", _ctx.loading ? "" : "hidden"])
          }, _hoisted_12, 2),
          createBaseVNode("div", {
            class: normalizeClass(["row", _ctx.loading ? "hidden" : ""])
          }, [
            createBaseVNode("div", _hoisted_13, [
              createBaseVNode("table", _hoisted_14, [
                _hoisted_15,
                createBaseVNode("tbody", null, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.systems, (system, idx) => {
                    return openBlock(), createElementBlock("tr", {
                      key: system.id
                    }, [
                      createBaseVNode("td", _hoisted_16, toDisplayString(idx + 1), 1),
                      createBaseVNode("td", null, toDisplayString(system.name), 1),
                      createBaseVNode("td", _hoisted_17, [
                        createBaseVNode("span", {
                          class: normalizeClass(["mdi mdi-18px", system.active ? "mdi-checkbox-marked-circle" : "mdi-checkbox-blank-circle-outline"])
                        }, null, 2)
                      ]),
                      createBaseVNode("td", _hoisted_18, [
                        createBaseVNode("a", {
                          title: "Editar registro",
                          href: "javascript:void(0);",
                          class: "btn-semti-tool",
                          style: { "padding": "4px 5px" },
                          "data-toggle": "modal",
                          "data-target": "#modal-system-form",
                          onClick: ($event) => $options.edit(system.id, system.name, system.active)
                        }, _hoisted_21, 8, _hoisted_19)
                      ]),
                      createBaseVNode("td", _hoisted_22, [
                        createBaseVNode("a", {
                          title: "Eliminar registro",
                          href: "javascript:void(0);",
                          class: "btn-semti-tool",
                          style: { "padding": "4px 5px" },
                          "data-toggle": "modal",
                          "data-target": "#modal-system-delete",
                          onClick: ($event) => $options.deleteDialog(system.id, system.name)
                        }, _hoisted_25, 8, _hoisted_23)
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
          createBaseVNode("div", {
            class: normalizeClass(["modal-header", "header-" + _ctx.form_color])
          }, [
            createBaseVNode("h4", _hoisted_29, toDisplayString(_ctx.form_title), 1),
            createBaseVNode("button", _hoisted_30, _hoisted_32, 512)
          ], 2),
          createBaseVNode("div", _hoisted_33, [
            createBaseVNode("form", null, [
              withDirectives(createBaseVNode("input", {
                type: "hidden",
                name: "id_system",
                id: "id_system",
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => _ctx.form_data.id = $event)
              }, null, 512), [
                [vModelText, _ctx.form_data.id]
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
                      placeholder: "Nombre del sistema",
                      "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => _ctx.form_data.name = $event)
                    }, null, 512), [
                      [vModelText, _ctx.form_data.name]
                    ])
                  ])
                ])
              ]),
              createBaseVNode("div", _hoisted_38, [
                createBaseVNode("div", _hoisted_39, [
                  createBaseVNode("div", _hoisted_40, [
                    createBaseVNode("input", {
                      type: "checkbox",
                      class: "form-check-input",
                      id: "syst_active",
                      name: "syst_active",
                      checked: _ctx.form_data.active,
                      onChange: _cache[4] || (_cache[4] = ($event) => $options.activeSystem())
                    }, null, 40, _hoisted_41),
                    _hoisted_42
                  ])
                ])
              ]),
              _ctx.form_error != "" ? (openBlock(), createElementBlock("div", _hoisted_43, [
                createBaseVNode("div", _hoisted_44, [
                  createBaseVNode("h6", _hoisted_45, toDisplayString(_ctx.form_error), 1)
                ])
              ])) : createCommentVNode("", true)
            ])
          ]),
          createBaseVNode("div", _hoisted_46, [
            _hoisted_47,
            createBaseVNode("button", {
              type: "button",
              class: normalizeClass(["btn btn-primary ripple", "btn-" + _ctx.form_color]),
              disabled: _ctx.form_loading,
              onClick: _cache[5] || (_cache[5] = withModifiers(($event) => $options.store(), ["stop"]))
            }, [
              !_ctx.form_loading ? (openBlock(), createElementBlock("i", _hoisted_49)) : (openBlock(), createElementBlock("i", _hoisted_50)),
              createTextVNode(" \xA0" + toDisplayString(_ctx.form_okbtn_text), 1)
            ], 10, _hoisted_48)
          ])
        ])
      ])
    ]),
    createBaseVNode("div", _hoisted_51, [
      createBaseVNode("div", _hoisted_52, [
        createBaseVNode("div", _hoisted_53, [
          createBaseVNode("div", _hoisted_54, [
            _hoisted_55,
            createBaseVNode("button", _hoisted_56, _hoisted_58, 512)
          ]),
          createBaseVNode("div", _hoisted_59, [
            _hoisted_60,
            createBaseVNode("div", _hoisted_61, [
              createBaseVNode("p", null, [
                createTextVNode('El Sistema "'),
                createBaseVNode("strong", null, toDisplayString(_ctx.delete_system), 1),
                createTextVNode('" ser\xE1 Eliminado de la plataforma Semtinel.'),
                _hoisted_62,
                createTextVNode("Confirme que desea realizar esta operaci\xF3n.")
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_63, [
            _hoisted_64,
            createBaseVNode("button", {
              type: "button",
              class: "btn btn-danger ripple",
              disabled: _ctx.delete_loading,
              onClick: _cache[6] || (_cache[6] = ($event) => $options.destroy())
            }, [
              _hoisted_66,
              createTextVNode("\xA0" + toDisplayString(_ctx.delete_text), 1)
            ], 8, _hoisted_65)
          ])
        ])
      ])
    ])
  ], 64);
}
const SystemsComponent = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  SystemsComponent as default
};
