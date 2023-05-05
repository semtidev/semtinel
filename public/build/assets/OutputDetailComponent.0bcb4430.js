import { _ as _export_sfc, P as PageHeader } from "./app.d5560dd0.js";
import { o as openBlock, b as createElementBlock, q as createVNode, i as createBaseVNode, H as createTextVNode, v as toDisplayString, J as withDirectives, j as createCommentVNode, f as normalizeClass, L as withModifiers, F as Fragment, I as renderList, N as vModelText, h as resolveComponent, K as resolveDirective } from "./vue.esm-bundler.ecfa1491.js";
import { _ as _imports_0, a as _imports_1, b as _imports_2 } from "./icon-jpg.b5720497.js";
const _sfc_main = {
  data: function() {
    return {
      output: {},
      pagetitle: "",
      upload_id: "",
      upload_output: "",
      upload_file: "",
      upload_form_error: {
        error_text: ""
      },
      upload_form_loading: false,
      upload_form_okbtn_text: "Adjuntar",
      table_oc: true,
      show_details: false,
      item_details: {
        pole: "",
        project: "",
        warehouse: "",
        warehouse_owner: "",
        cod_product: "",
        item_description: "",
        um: "",
        quantity: 0,
        price_unit: 0,
        price_total: 0
      },
      confirm_loading: false,
      cancel_loading: false,
      confirm_text: "Confirmar",
      session: JSON.parse(sessionStorage.getItem("semtinel")),
      pole: localStorage.getItem("stnel_logist_pole"),
      project: localStorage.getItem("stnel_logist_project")
    };
  },
  created() {
    this.output = JSON.parse(this.$route.params.output);
    this.pagetitle = this.output["code"];
    if (this.output["confirm"] == 1)
      this.confirm_text = "Confirmada";
    else
      this.confirm_text = "Confirmar";
  },
  watch: {
    upload_form_loading: function(val) {
      if (val)
        this.upload_form_okbtn_text = "Procesando...";
      else
        this.upload_form_okbtn_text = "Adjuntar";
    }
  },
  components: {
    "page-header": PageHeader
  },
  methods: {
    openScanner: function(path) {
      window.open("http://localhost/semtinel/storage/app/public/" + path, "_blank", "noreferrer");
    },
    docPdf: function(output) {
      window.open("http://localhost/semtinel/public/api/logistics/pdf/output/" + output, "_blank", "noreferrer");
    },
    show: function(idx) {
      let cmp = this;
      cmp.item_details = {
        pole: cmp.output["pole_name"],
        project: cmp.output["project_name"],
        warehouse: cmp.output["warehouse_name"],
        warehouse_owner: cmp.output["warehouse_owner"],
        cod_product: cmp.output["items"][idx].product_code,
        item_description: cmp.output["items"][idx].item_description,
        um: cmp.output["items"][idx].um,
        quantity: cmp.output["items"][idx].quantity,
        price_unit: cmp.output["items"][idx].price_unit,
        price_total: cmp.output["items"][idx].price_total
      };
      cmp.show_details = true;
    },
    attachFile: function(id, code) {
      this.$refs.uploadFile.value = null;
      this.upload_form_error.error_text = "";
      this.upload_id = id;
      this.upload_output = code;
    },
    onChangeFile(e) {
      this.upload_file = e.target.files[0];
      this.upload_form_error.error_text = "";
    },
    uploadDoc: function() {
      let cmp = this;
      cmp.upload_form_loading = true;
      if (cmp.$refs.uploadFile.value == "") {
        cmp.upload_form_error.error_text = "Debe seleccionar el archivo que desea adjuntar.";
        cmp.upload_form_loading = false;
        return;
      }
      cmp.upload_form_error.error_text = "";
      let data = new FormData(), headers = {
        "content-type": "multipart/form-data",
        "Authorization": "Bearer " + cmp.session.access_token
      };
      data.append("id", cmp.upload_id);
      data.append("output", cmp.upload_output);
      data.append("file", cmp.upload_file);
      data.append("user", cmp.session.id);
      data.append("pole", cmp.pole);
      data.append("project", cmp.project);
      axios.post("http://localhost/semtinel/public/api/logistics/output/upload", data, {
        headers
      }).then(function(response) {
        if (response.data.success) {
          cmp.$refs.CloseUpload.click();
          cmp.upload_form_loading = false;
          cmp.output.attach_path = response.data.path;
          let path_arr = cmp.output.attach_path.split(".");
          cmp.output.attach_type = path_arr[1];
          toastr.success("El archivo fue adjuntado con \xE9xito.");
        } else {
          cmp.$refs.CloseUpload.click();
          cmp.upload_form_loading = false;
          toastr.error("Error al intentar realizar la operaci\xF3n.");
        }
      }).catch(function(error) {
        cmp.$refs.CloseUpload.click();
        cmp.upload_form_loading = false;
        toastr.error("Error al intentar realizar la operaci\xF3n.");
        return;
      });
    },
    confirmOutput: function() {
      let cmp = this;
      cmp.confirm_loading = true;
      let headers = {
        "User-Agent": "testing/1.0",
        "Accept": "application/json",
        "Authorization": "Bearer " + cmp.session.access_token
      };
      axios.post("http://localhost/semtinel/public/api/logistics/output/confirm", {
        "output": cmp.output.id,
        "user": cmp.session.id,
        "pole": cmp.pole,
        "project": cmp.project
      }, {
        headers
      }).then(function(response) {
        if (response.data.success) {
          cmp.confirm_loading = false;
          cmp.output.confirm = 1;
          cmp.confirm_text = "Confirmada";
          toastr.success("La Salida fue Confirmada con \xE9xito.");
        } else {
          cmp.confirm_loading = false;
          toastr.error("Error al intentar realizar la operaci\xF3n.");
        }
      }).catch(function(error) {
        cmp.confirm_loading = false;
        toastr.error("Error al intentar realizar la operaci\xF3n.");
        return;
      });
    },
    cancelOutput: function() {
      let cmp = this;
      cmp.cancel_loading = true;
      let headers = {
        "User-Agent": "testing/1.0",
        "Accept": "application/json",
        "Authorization": "Bearer " + cmp.session.access_token
      };
      axios.post("http://localhost/semtinel/public/api/logistics/output/cancel", {
        "output": cmp.output.id,
        "user": cmp.session.id,
        "pole": cmp.pole,
        "project": cmp.project
      }, {
        headers
      }).then(function(response) {
        if (response.data.success) {
          cmp.cancel_loading = false;
          toastr.success("La Salida fue Cancelada con \xE9xito.");
          cmp.$router.push("/semtinel/public/logistics/outputs");
        } else {
          cmp.cancel_loading = false;
          toastr.error("Error al intentar realizar la operaci\xF3n.");
        }
      }).catch(function(error) {
        cmp.cancel_loading = false;
        toastr.error("Error al intentar realizar la operaci\xF3n.");
        return;
      });
    }
  }
};
const _hoisted_1 = { class: "invoice p-3 mb-3" };
const _hoisted_2 = { class: "row" };
const _hoisted_3 = { class: "col-sm-6" };
const _hoisted_4 = /* @__PURE__ */ createBaseVNode("i", { class: "mdi mdi-cart-arrow-right mdi-36px align-middle" }, null, -1);
const _hoisted_5 = { class: "col-sm-6 text-right" };
const _hoisted_6 = /* @__PURE__ */ createBaseVNode("i", { class: "fas fa-file-pdf" }, null, -1);
const _hoisted_7 = /* @__PURE__ */ createBaseVNode("i", { class: "fas fa-paperclip" }, null, -1);
const _hoisted_8 = { class: "row invoice-info" };
const _hoisted_9 = { class: "col-sm-3 invoice-col" };
const _hoisted_10 = { class: "form-group" };
const _hoisted_11 = /* @__PURE__ */ createBaseVNode("label", { class: "mb-1" }, "Polo", -1);
const _hoisted_12 = { class: "p-0" };
const _hoisted_13 = { class: "form-group" };
const _hoisted_14 = /* @__PURE__ */ createBaseVNode("label", { class: "mb-1" }, "Proyecto", -1);
const _hoisted_15 = { class: "p-0" };
const _hoisted_16 = { class: "form-group" };
const _hoisted_17 = /* @__PURE__ */ createBaseVNode("label", { class: "mb-1" }, "Origen", -1);
const _hoisted_18 = { class: "p-0" };
const _hoisted_19 = { class: "form-group" };
const _hoisted_20 = /* @__PURE__ */ createBaseVNode("label", { class: "mb-1" }, "Responsable", -1);
const _hoisted_21 = { class: "p-0" };
const _hoisted_22 = { class: "col-sm-3 invoice-col" };
const _hoisted_23 = { class: "form-group" };
const _hoisted_24 = /* @__PURE__ */ createBaseVNode("label", { class: "mb-1" }, "Tipo", -1);
const _hoisted_25 = { class: "p-0" };
const _hoisted_26 = { class: "form-group" };
const _hoisted_27 = /* @__PURE__ */ createBaseVNode("label", { class: "mb-1" }, "Destino", -1);
const _hoisted_28 = { class: "p-0" };
const _hoisted_29 = {
  key: 0,
  class: "form-group"
};
const _hoisted_30 = /* @__PURE__ */ createBaseVNode("label", { class: "mb-1" }, "Autorizado", -1);
const _hoisted_31 = { class: "p-0" };
const _hoisted_32 = {
  key: 1,
  class: "form-group"
};
const _hoisted_33 = /* @__PURE__ */ createBaseVNode("label", { class: "mb-1" }, "Responsable", -1);
const _hoisted_34 = { class: "p-0" };
const _hoisted_35 = { class: "form-group" };
const _hoisted_36 = /* @__PURE__ */ createBaseVNode("label", { class: "mb-1" }, "Autoriza", -1);
const _hoisted_37 = { class: "p-0" };
const _hoisted_38 = { class: "col-sm-3 invoice-col" };
const _hoisted_39 = { class: "form-group" };
const _hoisted_40 = /* @__PURE__ */ createBaseVNode("label", { class: "mb-1" }, "Estado", -1);
const _hoisted_41 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_42 = { class: "form-group" };
const _hoisted_43 = /* @__PURE__ */ createBaseVNode("label", { class: "mb-1" }, "Documento escaneado", -1);
const _hoisted_44 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_45 = {
  src: _imports_0,
  alt: "Documento Escaneado"
};
const _hoisted_46 = {
  src: _imports_1,
  alt: "Documento Escaneado"
};
const _hoisted_47 = {
  src: _imports_2,
  alt: "Documento Escaneado"
};
const _hoisted_48 = {
  key: 0,
  class: "badge badge-danger"
};
const _hoisted_49 = { class: "row pt-4" };
const _hoisted_50 = { class: "col-12 table-responsive" };
const _hoisted_51 = { class: "table table-striped" };
const _hoisted_52 = /* @__PURE__ */ createBaseVNode("thead", null, [
  /* @__PURE__ */ createBaseVNode("tr", null, [
    /* @__PURE__ */ createBaseVNode("th", {
      width: "150",
      class: "text-center"
    }, "C\xF3digo"),
    /* @__PURE__ */ createBaseVNode("th", null, "Descripci\xF3n"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "100",
      class: "text-center"
    }, "UM"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "100",
      class: "text-center"
    }, "Ctdad"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "100",
      class: "text-right"
    }, "Precio Unitario"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "130",
      class: "text-right"
    }, "Precio Total")
  ])
], -1);
const _hoisted_53 = { class: "text-center" };
const _hoisted_54 = { class: "text-center" };
const _hoisted_55 = { class: "text-center" };
const _hoisted_56 = { class: "text-right" };
const _hoisted_57 = { class: "text-right" };
const _hoisted_58 = /* @__PURE__ */ createBaseVNode("td", {
  colspan: "5",
  class: "text-right"
}, [
  /* @__PURE__ */ createBaseVNode("strong", null, "Costo Total:")
], -1);
const _hoisted_59 = { class: "text-right" };
const _hoisted_60 = {
  class: "modal fade",
  id: "modal-upload-form",
  "aria-hidden": "true",
  role: "dialog",
  "data-backdrop": "static",
  "data-keyboard": "false"
};
const _hoisted_61 = { class: "modal-dialog" };
const _hoisted_62 = { class: "modal-content" };
const _hoisted_63 = { class: "modal-header header-green" };
const _hoisted_64 = /* @__PURE__ */ createBaseVNode("h4", { class: "modal-title" }, "Adjuntar documento escaneado", -1);
const _hoisted_65 = {
  type: "button",
  ref: "CloseUpload",
  class: "close",
  "data-dismiss": "modal",
  "aria-label": "Close"
};
const _hoisted_66 = /* @__PURE__ */ createBaseVNode("span", { "aria-hidden": "true" }, "\xD7", -1);
const _hoisted_67 = [
  _hoisted_66
];
const _hoisted_68 = { class: "modal-body px-4" };
const _hoisted_69 = { enctype: "multipart/form-data" };
const _hoisted_70 = { class: "row pt-3 pb-1" };
const _hoisted_71 = { class: "col-md-12" };
const _hoisted_72 = { class: "text-green" };
const _hoisted_73 = { class: "row" };
const _hoisted_74 = { class: "col-md-12" };
const _hoisted_75 = { class: "form-group" };
const _hoisted_76 = /* @__PURE__ */ createBaseVNode("span", { class: "info-container" }, [
  /* @__PURE__ */ createBaseVNode("span", { class: "text-sm text-muted" }, "Seleccione solo archivos con extensiones PDF, JPG, JPEG, PNG")
], -1);
const _hoisted_77 = {
  key: 0,
  class: "row pt-2"
};
const _hoisted_78 = { class: "col-12 text-center" };
const _hoisted_79 = { class: "form_error" };
const _hoisted_80 = { class: "modal-footer justify-content-between" };
const _hoisted_81 = /* @__PURE__ */ createBaseVNode("button", {
  type: "button",
  class: "btn btn-default ripple",
  "data-dismiss": "modal"
}, "Cancelar", -1);
const _hoisted_82 = ["disabled"];
const _hoisted_83 = {
  key: 0,
  class: "mdi mdi-paperclip"
};
const _hoisted_84 = {
  key: 1,
  class: "mdi mdi-loading mdi-spin"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_page_header = resolveComponent("page-header");
  const _directive_tooltip = resolveDirective("tooltip");
  return openBlock(), createElementBlock(Fragment, null, [
    createVNode(_component_page_header, {
      pagetitle: "Detalle de la Salida No. " + _ctx.pagetitle,
      breadcrumbs: true,
      navbar: [
        {
          page: "Salidas",
          link: "/semtinel/public/logistics/outputs",
          tooltip: "Click para regresar al listado de Salidas",
          active: false
        },
        {
          page: "Detalle de Salida",
          link: "",
          tooltip: "",
          active: true
        }
      ]
    }, null, 8, ["pagetitle"]),
    createBaseVNode("div", _hoisted_1, [
      createBaseVNode("div", _hoisted_2, [
        createBaseVNode("div", _hoisted_3, [
          createBaseVNode("h5", null, [
            _hoisted_4,
            createTextVNode("\xA0\xA0Fecha de la salida: " + toDisplayString(_ctx.output.created_at), 1)
          ])
        ]),
        createBaseVNode("div", _hoisted_5, [
          withDirectives((openBlock(), createElementBlock("a", {
            href: "javascript:void(0);",
            class: "btn btn-app system",
            onClick: _cache[0] || (_cache[0] = ($event) => $options.docPdf(_ctx.output.id))
          }, [
            _hoisted_6,
            createTextVNode(" Documento ")
          ])), [
            [_directive_tooltip, "Generar documento PDF"]
          ]),
          "logistics.api.upload.output" in _ctx.$root.session.permissions ? withDirectives((openBlock(), createElementBlock("a", {
            key: 0,
            href: "javascript:void(0);",
            class: "btn btn-app system",
            "data-toggle": "modal",
            "data-target": "#modal-upload-form",
            onClick: _cache[1] || (_cache[1] = ($event) => $options.attachFile(_ctx.output.id, _ctx.output.code))
          }, [
            _hoisted_7,
            createTextVNode(" Adjuntar ")
          ])), [
            [_directive_tooltip, "Adjuntar documento escaneado"]
          ]) : createCommentVNode("", true),
          _ctx.output.type == "Despacho a Obra" && "logistics.api.cofirm.output" in _ctx.$root.session.permissions ? withDirectives((openBlock(), createElementBlock("a", {
            key: 1,
            href: "javascript:void(0);",
            class: normalizeClass(["btn btn-app success", _ctx.output.confirm == 1 ? "disabled" : ""]),
            onClick: _cache[2] || (_cache[2] = withModifiers(($event) => $options.confirmOutput(), ["stop"]))
          }, [
            createBaseVNode("i", {
              class: normalizeClass(["fas", _ctx.confirm_loading ? "fa-spinner fa-pulse" : "fa-check"])
            }, null, 2),
            createTextVNode(" " + toDisplayString(_ctx.confirm_text), 1)
          ], 2)), [
            [_directive_tooltip, "Confirmar salida"]
          ]) : createCommentVNode("", true),
          _ctx.output.confirm != 1 && (_ctx.session.id == _ctx.output.created_by || "Responsable de Especialidad" in _ctx.$root.session.roles && _ctx.output.warehouse in _ctx.session.warehouses) ? withDirectives((openBlock(), createElementBlock("a", {
            key: 2,
            href: "javascript:void(0);",
            class: "btn btn-app danger",
            onClick: _cache[3] || (_cache[3] = withModifiers(($event) => $options.cancelOutput(), ["stop"]))
          }, [
            createBaseVNode("i", {
              class: normalizeClass(["fas", _ctx.cancel_loading ? "fa-spinner fa-pulse" : "fa-times"])
            }, null, 2),
            createTextVNode(" Cancelar ")
          ])), [
            [_directive_tooltip, "Cancelar salida"]
          ]) : createCommentVNode("", true)
        ])
      ]),
      createBaseVNode("div", _hoisted_8, [
        createBaseVNode("div", _hoisted_9, [
          createBaseVNode("div", _hoisted_10, [
            _hoisted_11,
            createBaseVNode("h6", _hoisted_12, [
              createBaseVNode("strong", null, toDisplayString(_ctx.output.pole_name), 1)
            ])
          ]),
          createBaseVNode("div", _hoisted_13, [
            _hoisted_14,
            createBaseVNode("h6", _hoisted_15, [
              createBaseVNode("strong", null, toDisplayString(_ctx.output.project_name), 1)
            ])
          ]),
          createBaseVNode("div", _hoisted_16, [
            _hoisted_17,
            createBaseVNode("h6", _hoisted_18, [
              createBaseVNode("strong", null, toDisplayString(_ctx.output.warehouse_name), 1)
            ])
          ]),
          createBaseVNode("div", _hoisted_19, [
            _hoisted_20,
            createBaseVNode("h6", _hoisted_21, [
              createBaseVNode("strong", null, toDisplayString(_ctx.output.warehouse_owner), 1)
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_22, [
          createBaseVNode("div", _hoisted_23, [
            _hoisted_24,
            createBaseVNode("h6", _hoisted_25, [
              createBaseVNode("strong", null, toDisplayString(_ctx.output.type), 1)
            ])
          ]),
          createBaseVNode("div", _hoisted_26, [
            _hoisted_27,
            createBaseVNode("h6", _hoisted_28, [
              createBaseVNode("strong", null, toDisplayString(_ctx.output.destin), 1)
            ])
          ]),
          _ctx.output.type == "Despacho a Obra" ? (openBlock(), createElementBlock("div", _hoisted_29, [
            _hoisted_30,
            createBaseVNode("h6", _hoisted_31, [
              createBaseVNode("strong", null, toDisplayString(_ctx.output.authorized), 1)
            ])
          ])) : (openBlock(), createElementBlock("div", _hoisted_32, [
            _hoisted_33,
            createBaseVNode("h6", _hoisted_34, [
              createBaseVNode("strong", null, toDisplayString(_ctx.output.destin_warehouse_owner), 1)
            ])
          ])),
          createBaseVNode("div", _hoisted_35, [
            _hoisted_36,
            createBaseVNode("h6", _hoisted_37, [
              createBaseVNode("strong", null, toDisplayString(_ctx.output.authorizing), 1)
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_38, [
          createBaseVNode("div", _hoisted_39, [
            _hoisted_40,
            _hoisted_41,
            createBaseVNode("span", {
              class: normalizeClass(["badge", _ctx.output.status == "Creada" ? "badge-warning" : "badge-dark"])
            }, " Salida " + toDisplayString(_ctx.output.status), 3)
          ]),
          createBaseVNode("div", _hoisted_42, [
            _hoisted_43,
            _hoisted_44,
            _ctx.output.attach_path != "" && _ctx.output.attach_path != null && _ctx.output.attach_type == "pdf" ? (openBlock(), createElementBlock("a", {
              key: 0,
              href: "javascript:void(0);",
              onClick: _cache[4] || (_cache[4] = withModifiers(($event) => $options.openScanner(_ctx.output.attach_path), ["stop"]))
            }, [
              withDirectives(createBaseVNode("img", _hoisted_45, null, 512), [
                [_directive_tooltip, "Click para abrir"]
              ])
            ])) : _ctx.output.attach_path != "" && _ctx.output.attach_path != null && _ctx.output.attach_type == "png" ? (openBlock(), createElementBlock("a", {
              key: 1,
              href: "javascript:void(0);",
              onClick: _cache[5] || (_cache[5] = withModifiers(($event) => $options.openScanner(_ctx.output.attach_path), ["stop"]))
            }, [
              withDirectives(createBaseVNode("img", _hoisted_46, null, 512), [
                [_directive_tooltip, "Click para abrir"]
              ])
            ])) : _ctx.output.attach_path != "" && _ctx.output.attach_path != null && _ctx.output.attach_type == "jpg" ? (openBlock(), createElementBlock("a", {
              key: 2,
              href: "javascript:void(0);",
              onClick: _cache[6] || (_cache[6] = withModifiers(($event) => $options.openScanner(_ctx.output.attach_path), ["stop"]))
            }, [
              withDirectives(createBaseVNode("img", _hoisted_47, null, 512), [
                [_directive_tooltip, "Click para abrir"]
              ])
            ])) : (openBlock(), createElementBlock(Fragment, { key: 3 }, [
              _ctx.output.attach_path == "" || _ctx.output.attach_path == null ? (openBlock(), createElementBlock("span", _hoisted_48, " No se ha adjuntado el documento escaneado a\xFAn. ")) : createCommentVNode("", true)
            ], 64))
          ])
        ])
      ]),
      createBaseVNode("div", _hoisted_49, [
        createBaseVNode("div", _hoisted_50, [
          createBaseVNode("table", _hoisted_51, [
            _hoisted_52,
            createBaseVNode("tbody", null, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.output["items"], (item, idx) => {
                return openBlock(), createElementBlock("tr", {
                  key: item["id"]
                }, [
                  createBaseVNode("td", _hoisted_53, toDisplayString(item["product_code"]), 1),
                  createBaseVNode("td", null, toDisplayString(item["item_description"]), 1),
                  createBaseVNode("td", _hoisted_54, toDisplayString(item["um"]), 1),
                  createBaseVNode("td", _hoisted_55, toDisplayString(item["quantity"]), 1),
                  createBaseVNode("td", _hoisted_56, toDisplayString(item["price_unit"]), 1),
                  createBaseVNode("td", _hoisted_57, toDisplayString(item["price_total"]), 1)
                ]);
              }), 128))
            ]),
            createBaseVNode("tfoot", null, [
              createBaseVNode("tr", null, [
                _hoisted_58,
                createBaseVNode("td", _hoisted_59, [
                  createBaseVNode("strong", null, toDisplayString(_ctx.output.price_total), 1)
                ])
              ])
            ])
          ])
        ])
      ])
    ]),
    createBaseVNode("div", _hoisted_60, [
      createBaseVNode("div", _hoisted_61, [
        createBaseVNode("div", _hoisted_62, [
          createBaseVNode("div", _hoisted_63, [
            _hoisted_64,
            createBaseVNode("button", _hoisted_65, _hoisted_67, 512)
          ]),
          createBaseVNode("div", _hoisted_68, [
            createBaseVNode("form", _hoisted_69, [
              withDirectives(createBaseVNode("input", {
                type: "hidden",
                name: "upload_id_output",
                id: "upload_id_output",
                "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => _ctx.upload_id = $event)
              }, null, 512), [
                [vModelText, _ctx.upload_id]
              ]),
              createBaseVNode("div", _hoisted_70, [
                createBaseVNode("div", _hoisted_71, [
                  createBaseVNode("h6", _hoisted_72, [
                    createTextVNode(" Salida No. "),
                    createBaseVNode("strong", null, toDisplayString(_ctx.upload_output), 1)
                  ])
                ])
              ]),
              createBaseVNode("div", _hoisted_73, [
                createBaseVNode("div", _hoisted_74, [
                  createBaseVNode("div", _hoisted_75, [
                    createBaseVNode("input", {
                      id: "uploadFile",
                      ref: "uploadFile",
                      class: "form-control",
                      type: "file",
                      accept: ".jpg,.jpeg,.png,.pdf",
                      onChange: _cache[8] || (_cache[8] = (...args) => $options.onChangeFile && $options.onChangeFile(...args))
                    }, null, 544),
                    _hoisted_76
                  ])
                ])
              ]),
              _ctx.upload_form_error.error_text != "" ? (openBlock(), createElementBlock("div", _hoisted_77, [
                createBaseVNode("div", _hoisted_78, [
                  createBaseVNode("h6", _hoisted_79, toDisplayString(_ctx.upload_form_error.error_text), 1)
                ])
              ])) : createCommentVNode("", true)
            ])
          ]),
          createBaseVNode("div", _hoisted_80, [
            _hoisted_81,
            createBaseVNode("button", {
              type: "button",
              class: "btn btn-primary btn-green ripple",
              disabled: _ctx.upload_form_loading,
              onClick: _cache[9] || (_cache[9] = withModifiers(($event) => $options.uploadDoc(), ["stop"]))
            }, [
              !_ctx.upload_form_loading ? (openBlock(), createElementBlock("i", _hoisted_83)) : (openBlock(), createElementBlock("i", _hoisted_84)),
              createTextVNode(" " + toDisplayString(_ctx.upload_form_okbtn_text), 1)
            ], 8, _hoisted_82)
          ])
        ])
      ])
    ])
  ], 64);
}
const OutputDetailComponent = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  OutputDetailComponent as default
};
