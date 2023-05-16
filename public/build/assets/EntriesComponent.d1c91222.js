import { o as openBlock, b as createElementBlock, q as createVNode, i as createBaseVNode, L as withDirectives, N as withModifiers, f as normalizeClass, F as Fragment, K as renderList, v as toDisplayString, J as createTextVNode, h as resolveComponent, M as resolveDirective } from "./vue.esm-bundler.4c64d56b.js";
import { _ as _export_sfc, P as PageHeader } from "./app.18088dbe.js";
import { $ } from "./jquery.55a3af33.js";
import "./jquery.dataTables.min.cf006e4f.js";
const _sfc_main = {
  data: function() {
    return {
      entries: [],
      loading: true,
      session: JSON.parse(sessionStorage.getItem("semtinel"))
    };
  },
  methods: {
    newEntry: function() {
      this.$router.push("/semtinel/public/logistics/entry");
    },
    listReload: function() {
      this.getEntriesTable(true);
    },
    entryDetail: function(entry) {
      this.$router.push({
        name: "logistics.entry.detail",
        params: {
          entry: JSON.stringify(entry)
        }
      });
    },
    async getEntriesTable(reload = false) {
      let cmp = this, pole = localStorage.getItem("stnel_logist_pole"), project = localStorage.getItem("stnel_logist_project");
      this.loading = true;
      let headers = {
        "User-Agent": "testing/1.0",
        "Accept": "application/json",
        "Authorization": "Bearer " + cmp.session.access_token
      };
      await fetch("http://localhost/semtinel/public/api/logistics/entries/" + pole + "/" + project + "/" + reload, {
        method: "GET",
        headers
      }).then((response) => response.json()).then((data) => {
        cmp.entries = data;
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
  components: {
    "page-header": PageHeader
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
    fetch("http://localhost/semtinel/public/api/logistics/entries/" + pole + "/" + project + "/true", {
      method: "GET",
      headers
    }).then((response) => response.json()).then((data) => {
      cmp.entries = data;
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
const _hoisted_4 = /* @__PURE__ */ createBaseVNode("h3", { class: "card-title" }, "Entradas de mercanc\xEDa", -1);
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
  /* @__PURE__ */ createBaseVNode("span", { class: "mdi mdi-loading mdi-spin mdi-36px" }, "\xA0Cargando entradas...")
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
    /* @__PURE__ */ createBaseVNode("th", null, "Entrada"),
    /* @__PURE__ */ createBaseVNode("th", { width: "15%" }, "Origen"),
    /* @__PURE__ */ createBaseVNode("th", { width: "15%" }, "Orden Compra"),
    /* @__PURE__ */ createBaseVNode("th", { width: "15%" }, "Destino"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "10%",
      class: "text-center"
    }, "Fecha"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "10%",
      class: "no-sort text-center"
    }, "Estado"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "8%",
      class: "no-sort text-center"
    }, "Confirmada")
  ])
], -1);
const _hoisted_16 = { class: "text-center" };
const _hoisted_17 = ["onClick"];
const _hoisted_18 = { class: "text-center" };
const _hoisted_19 = { class: "text-center" };
const _hoisted_20 = { class: "text-center" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_page_header = resolveComponent("page-header");
  const _directive_tooltip = resolveDirective("tooltip");
  return openBlock(), createElementBlock(Fragment, null, [
    createVNode(_component_page_header, { pagetitle: "Listado de Entradas de mercanc\xEDa" }),
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
              onClick: _cache[1] || (_cache[1] = ($event) => $options.newEntry())
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
                  (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.entries, (entry, idx) => {
                    return openBlock(), createElementBlock("tr", {
                      key: entry.id
                    }, [
                      createBaseVNode("td", _hoisted_16, toDisplayString(idx + 1), 1),
                      createBaseVNode("td", null, [
                        withDirectives(createBaseVNode("span", {
                          class: normalizeClass(["fas fa-paperclip", entry.attach_path == "" || entry.attach_path == null ? "icon-noexists" : "icon-exists"])
                        }, null, 2), [
                          [_directive_tooltip, entry.attach_path == "" || entry.attach_path == null ? "Sin arhivo adjunto" : "Archivo adjunto"]
                        ]),
                        createTextVNode("\xA0 "),
                        withDirectives((openBlock(), createElementBlock("a", {
                          class: "show-lnk",
                          href: "javascript:void(0);",
                          onClick: ($event) => $options.entryDetail(entry)
                        }, [
                          createTextVNode(toDisplayString(entry.code), 1)
                        ], 8, _hoisted_17)), [
                          [_directive_tooltip, "Click para Mostrar Detalles de esta Entrada"]
                        ])
                      ]),
                      createBaseVNode("td", null, toDisplayString(entry.origin), 1),
                      createBaseVNode("td", null, toDisplayString(entry.oc), 1),
                      createBaseVNode("td", null, toDisplayString(entry.warehouse_name), 1),
                      createBaseVNode("td", _hoisted_18, toDisplayString(entry.created_at), 1),
                      createBaseVNode("td", _hoisted_19, [
                        createBaseVNode("span", {
                          class: normalizeClass(["badge", entry.status == "Parcial" ? "badge-warning" : "badge-dark"])
                        }, toDisplayString(entry.status), 3)
                      ]),
                      createBaseVNode("td", _hoisted_20, [
                        withDirectives(createBaseVNode("i", {
                          class: normalizeClass(["mdi mdi-18px", entry.confirm == 1 ? "mdi-radiobox-marked icon-exists" : "mdi-checkbox-blank-circle-outline icon-noexists"])
                        }, null, 2), [
                          [_directive_tooltip, entry.confirm == 1 ? "Confirmada" : "Sin Confirmar"]
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
    ])
  ], 64);
}
const EntriesComponent = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  EntriesComponent as default
};
