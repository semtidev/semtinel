import { o as openBlock, b as createElementBlock, q as createVNode, i as createBaseVNode, J as withDirectives, L as withModifiers, f as normalizeClass, F as Fragment, I as renderList, v as toDisplayString, H as createTextVNode, h as resolveComponent, K as resolveDirective } from "./vue.esm-bundler.ecfa1491.js";
import { _ as _export_sfc, P as PageHeader } from "./app.d5560dd0.js";
import { $ } from "./jquery.8baacbdb.js";
import "./jquery.dataTables.min.70653878.js";
const _sfc_main = {
  data: function() {
    return {
      outputs: [],
      loading: true,
      session: JSON.parse(sessionStorage.getItem("semtinel"))
    };
  },
  components: {
    "page-header": PageHeader
  },
  methods: {
    newOutput: function() {
      this.$router.push("/semtinel/public/logistics/output");
    },
    listReload: function() {
      this.getOutputsTable(true);
    },
    outputDetail: function(output) {
      let price_total = 0;
      output.items.map(function(value, key) {
        price_total += parseFloat(value.price_total);
      });
      output.price_total = price_total;
      this.$router.push({
        name: "logistics.output.detail",
        params: {
          output: JSON.stringify(output)
        }
      });
    },
    async getOutputsTable(reload = false) {
      let cmp = this, pole = localStorage.getItem("stnel_logist_pole"), project = localStorage.getItem("stnel_logist_project");
      this.loading = true;
      let headers = {
        "User-Agent": "testing/1.0",
        "Accept": "application/json",
        "Authorization": "Bearer " + cmp.session.access_token
      };
      await fetch("http://localhost/semtinel/public/api/logistics/outputs/" + pole + "/" + project + "/" + reload, {
        method: "GET",
        headers
      }).then((response) => response.json()).then((data) => {
        cmp.outputs = data;
        cmp.loading = false;
        if ($("#datatable").DataTable().destroy()) {
          setTimeout(() => {
            $("#datatable").DataTable({
              lengthMenu: [
                [10, 15, 25, 50, -1],
                [10, 15, 25, 50, "Todos"]
              ],
              pageLength: 10,
              "columnDefs": [{
                "targets": "no-sort",
                "orderable": false,
                "order": []
              }],
              "columns": [
                { "width": "5%" },
                null,
                { "width": "15%" },
                { "width": "15%" },
                { "width": "15%" },
                { "width": "10%" },
                { "width": "10%" },
                { "width": "8%" }
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
    }
  },
  mounted() {
    let cmp = this;
    if (!JSON.parse(sessionStorage.getItem("semtinel")).access_token) {
      sessionStorage.clear();
      window.document.location.href = "http://localhost/semtinel/public/login";
    }
    let pole = localStorage.getItem("stnel_logist_pole"), project = localStorage.getItem("stnel_logist_project"), headers = {
      "User-Agent": "testing/1.0",
      "Accept": "application/json",
      "Authorization": "Bearer " + cmp.session.access_token
    };
    JSON.parse(sessionStorage.getItem("semtinel"));
    fetch("http://localhost/semtinel/public/api/logistics/outputs/" + pole + "/" + project + "/true", {
      method: "GET",
      headers
    }).then((response) => response.json()).then((data) => {
      cmp.outputs = data;
      cmp.loading = false;
      setTimeout(() => {
        $("#datatable").DataTable({
          retrieve: true,
          lengthMenu: [
            [10, 15, 25, 50, -1],
            [10, 15, 25, 50, "Todos"]
          ],
          pageLength: 10,
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
const _hoisted_4 = /* @__PURE__ */ createBaseVNode("h3", { class: "card-title" }, "Salidas de mercanc\xEDa", -1);
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
  /* @__PURE__ */ createBaseVNode("span", { class: "mdi mdi-loading mdi-spin mdi-36px" }, "\xA0Cargando salidas...")
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
    /* @__PURE__ */ createBaseVNode("th", null, "Documento"),
    /* @__PURE__ */ createBaseVNode("th", { width: "15%" }, "Pa\xF1ol"),
    /* @__PURE__ */ createBaseVNode("th", { width: "15%" }, "Responsable"),
    /* @__PURE__ */ createBaseVNode("th", { width: "15%" }, "Autoriz\xF3"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "10%",
      class: "text-center"
    }, "Fecha"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "10%",
      class: "no-sort text-center"
    }, "Estado")
  ])
], -1);
const _hoisted_16 = { class: "text-center" };
const _hoisted_17 = ["onClick"];
const _hoisted_18 = { class: "text-center" };
const _hoisted_19 = { class: "text-center" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_page_header = resolveComponent("page-header");
  const _directive_tooltip = resolveDirective("tooltip");
  return openBlock(), createElementBlock(Fragment, null, [
    createVNode(_component_page_header, { pagetitle: "Listado de Salidas de mercanc\xEDa de pa\xF1oles" }),
    createBaseVNode("div", _hoisted_1, [
      createBaseVNode("div", _hoisted_2, [
        createBaseVNode("div", _hoisted_3, [
          _hoisted_4,
          createBaseVNode("div", _hoisted_5, [
            withDirectives((openBlock(), createElementBlock("button", {
              type: "button",
              class: "btn btn-tool pr-2",
              onClick: _cache[0] || (_cache[0] = withModifiers(($event) => $options.listReload(), ["stop"]))
            }, _hoisted_7)), [
              [_directive_tooltip, "Recargar Listado"]
            ]),
            withDirectives((openBlock(), createElementBlock("button", {
              type: "button",
              class: "btn btn-tool pl-0",
              "data-toggle": "modal",
              "data-target": "#modal-system-form",
              onClick: _cache[1] || (_cache[1] = ($event) => $options.newOutput())
            }, _hoisted_9)), [
              [_directive_tooltip, "Nueva Entrada"]
            ])
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
                  (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.outputs, (output, idx) => {
                    return openBlock(), createElementBlock("tr", {
                      key: output.id
                    }, [
                      createBaseVNode("td", _hoisted_16, toDisplayString(idx + 1), 1),
                      createBaseVNode("td", null, [
                        withDirectives(createBaseVNode("span", {
                          class: normalizeClass(["fas fa-paperclip", output.attach_path == "" || output.attach_path == null ? "icon-noexists" : "icon-exists"])
                        }, null, 2), [
                          [_directive_tooltip, output.attach_path == "" || output.attach_path == null ? "Sin arhivo adjunto" : "Archivo adjunto"]
                        ]),
                        createTextVNode("\xA0 "),
                        withDirectives((openBlock(), createElementBlock("a", {
                          class: "show-lnk",
                          href: "javascript:void(0);",
                          onClick: ($event) => $options.outputDetail(output)
                        }, [
                          createTextVNode(toDisplayString(output.code), 1)
                        ], 8, _hoisted_17)), [
                          [_directive_tooltip, "Click para Mostrar Detalles de esta Salida"]
                        ])
                      ]),
                      createBaseVNode("td", null, toDisplayString(output.warehouse_name), 1),
                      createBaseVNode("td", null, toDisplayString(output.warehouse_owner), 1),
                      createBaseVNode("td", null, toDisplayString(output.authorizing), 1),
                      createBaseVNode("td", _hoisted_18, toDisplayString(output.created_at), 1),
                      createBaseVNode("td", _hoisted_19, [
                        createBaseVNode("span", {
                          class: normalizeClass(["badge", output.status == "Creada" ? "badge-warning" : "badge-dark"])
                        }, toDisplayString(output.status), 3)
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
  ], 64);
}
const OutputsComponent = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  OutputsComponent as default
};
