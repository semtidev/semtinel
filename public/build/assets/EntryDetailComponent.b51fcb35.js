import { _ as _export_sfc, P as PageHeader } from "./app.cab0b5fe.js";
import { o as openBlock, b as createElementBlock, q as createVNode, i as createBaseVNode, H as createTextVNode, v as toDisplayString, J as withDirectives, j as createCommentVNode, f as normalizeClass, L as withModifiers, F as Fragment, I as renderList, N as vModelText, h as resolveComponent, K as resolveDirective } from "./vue.esm-bundler.ecfa1491.js";
import { _ as _imports_0, a as _imports_1, b as _imports_2 } from "./icon-jpg.b5720497.js";
const _sfc_main = {
  data: function() {
    return {
      entry: {},
      pagetitle: "",
      upload_id: "",
      upload_entry: "",
      upload_file: "",
      upload_form_error: {
        error_text: ""
      },
      upload_form_loading: false,
      upload_form_okbtn_text: "Adjuntar",
      upload_entry: "",
      table_oc: true,
      show_details: false,
      item_details: {
        docnum: "",
        product_quantity: "",
        cod_product: "",
        oc: "",
        generic_descript: "",
        item_description: "",
        um: "",
        received_quantity: 0,
        stowage_card: "-",
        price_unit: "",
        price_total: 0,
        comment: ""
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
    this.entry = JSON.parse(this.$route.params.entry);
    this.pagetitle = this.entry["code"];
    if (this.entry["type"] == "oc")
      this.table_oc = true;
    else
      this.table_oc = false;
    if (this.entry["confirm"] == 1)
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
      window.open("http://localhost/semtinel/public/storage/app/public/" + path, "_blank", "noreferrer");
    },
    docPdf: function(entry) {
      window.open("http://localhost/semtinel/public/api/logistics/pdf/entry/" + entry, "_blank", "noreferrer");
    },
    show: function(idx) {
      let cmp = this;
      if (cmp.table_oc) {
        cmp.item_details = {
          cod_product: cmp.entry["items"][idx].product_code,
          oc: cmp.entry["oc"],
          generic_descript: cmp.entry["items"][idx].product_description,
          item_description: cmp.entry["items"][idx].item_description,
          um: cmp.entry["items"][idx].um,
          received_quantity: cmp.entry["items"][idx].received_quantity,
          stowage_card: cmp.entry["items"][idx].stowage_card,
          price_unit: cmp.entry["items"][idx].price_unit,
          price_total: cmp.entry["items"][idx].price_total,
          comment: cmp.entry["items"][idx].comment == "" ? "-" : cmp.entry["items"][idx].comment
        };
      } else {
        cmp.item_details = {
          cod_product: cmp.entry["items"][idx].product_code,
          oc: cmp.entry["items"][idx].oc,
          docnum: cmp.entry["origin"] != "Transferencia de Pa\xF1ol" ? cmp.entry["items"][idx].docnum : cmp.entry.document_number,
          item_description: cmp.entry["items"][idx].item_description,
          um: cmp.entry["items"][idx].um,
          product_quantity: cmp.entry["origin"] != "Transferencia de Pa\xF1ol" ? cmp.entry["items"][idx].product_quantity : cmp.entry["items"][idx].received_quantity,
          received_quantity: cmp.entry["items"][idx].received_quantity,
          stowage_card: cmp.entry["items"][idx].stowage_card,
          price_unit: cmp.entry["items"][idx].price_unit,
          price_total: cmp.entry["items"][idx].price_total,
          comment: cmp.entry["items"][idx].comment == "" ? "-" : cmp.entry["items"][idx].comment
        };
      }
      cmp.show_details = true;
    },
    attachFile: function(id, entry) {
      this.$refs.uploadFile.value = null;
      this.upload_form_error.error_text = "";
      this.upload_id = id;
      this.upload_entry = entry;
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
      data.append("entry", cmp.upload_entry);
      data.append("file", cmp.upload_file);
      data.append("user", cmp.session.id);
      data.append("pole", cmp.pole);
      data.append("project", cmp.project);
      axios.post("http://localhost/semtinel/public/api/logistics/entry/upload", data, {
        headers
      }).then(function(response) {
        if (response.data.success) {
          cmp.$refs.CloseUpload.click();
          cmp.upload_form_loading = false;
          cmp.entry.attach_path = response.data.path;
          let path_arr = cmp.entry.attach_path.split(".");
          cmp.entry.attach_type = path_arr[1];
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
    confirmEntry: function() {
      let cmp = this;
      cmp.confirm_loading = true;
      let headers = {
        "User-Agent": "testing/1.0",
        "Accept": "application/json",
        "Authorization": "Bearer " + cmp.session.access_token
      };
      axios.post("http://localhost/semtinel/public/api/logistics/entry/confirm", {
        "entry": cmp.entry.id,
        "user": cmp.session.id,
        "pole": cmp.pole,
        "project": cmp.project,
        "transfer": cmp.entry.transfer,
        "code": cmp.entry.code
      }, {
        headers
      }).then(function(response) {
        if (response.data.success) {
          cmp.confirm_loading = false;
          cmp.entry.confirm = 1;
          cmp.confirm_text = "Confirmada";
          toastr.success("La Entrada fue Confirmada con \xE9xito.");
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
    cancelEntry: function() {
      let cmp = this;
      cmp.cancel_loading = true;
      let headers = {
        "User-Agent": "testing/1.0",
        "Accept": "application/json",
        "Authorization": "Bearer " + cmp.session.access_token
      };
      axios.post("http://localhost/semtinel/public/api/logistics/entry/cancel", {
        "entry": cmp.entry.id,
        "user": cmp.session.id,
        "pole": cmp.pole,
        "project": cmp.project
      }, {
        headers
      }).then(function(response) {
        if (response.data.success) {
          cmp.cancel_loading = false;
          toastr.success("La Entrada fue Cancelada con \xE9xito.");
          cmp.$router.push("/semtinel/public/logistics/entries");
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
const _hoisted_4 = /* @__PURE__ */ createBaseVNode("i", { class: "mdi mdi-truck-check-outline mdi-36px align-middle" }, null, -1);
const _hoisted_5 = { class: "col-sm-6 text-right" };
const _hoisted_6 = /* @__PURE__ */ createBaseVNode("i", { class: "fas fa-file-pdf" }, null, -1);
const _hoisted_7 = /* @__PURE__ */ createBaseVNode("i", { class: "fas fa-paperclip" }, null, -1);
const _hoisted_8 = { class: "row invoice-info" };
const _hoisted_9 = { class: "col-sm-3 invoice-col" };
const _hoisted_10 = { class: "form-group" };
const _hoisted_11 = /* @__PURE__ */ createBaseVNode("label", { class: "mb-1" }, "Origen", -1);
const _hoisted_12 = { class: "p-0" };
const _hoisted_13 = { class: "form-group" };
const _hoisted_14 = /* @__PURE__ */ createBaseVNode("label", { class: "mb-1" }, "Tipo de documento", -1);
const _hoisted_15 = { class: "p-0" };
const _hoisted_16 = { class: "form-group" };
const _hoisted_17 = /* @__PURE__ */ createBaseVNode("label", { class: "mb-1" }, "No. documento", -1);
const _hoisted_18 = { class: "p-0" };
const _hoisted_19 = { class: "form-group" };
const _hoisted_20 = /* @__PURE__ */ createBaseVNode("label", { class: "mb-1" }, "Orden de Compra", -1);
const _hoisted_21 = { class: "p-0" };
const _hoisted_22 = { class: "col-sm-3 invoice-col" };
const _hoisted_23 = { class: "form-group" };
const _hoisted_24 = /* @__PURE__ */ createBaseVNode("label", { class: "mb-1" }, "Destino", -1);
const _hoisted_25 = { class: "p-0" };
const _hoisted_26 = { class: "form-group" };
const _hoisted_27 = /* @__PURE__ */ createBaseVNode("label", { class: "mb-1" }, "Responsable", -1);
const _hoisted_28 = { class: "p-0" };
const _hoisted_29 = { class: "form-group" };
const _hoisted_30 = /* @__PURE__ */ createBaseVNode("label", { class: "mb-1" }, "Polo", -1);
const _hoisted_31 = { class: "p-0" };
const _hoisted_32 = { class: "form-group" };
const _hoisted_33 = /* @__PURE__ */ createBaseVNode("label", { class: "mb-1" }, "Proyecto", -1);
const _hoisted_34 = { class: "p-0" };
const _hoisted_35 = { class: "col-sm-3 invoice-col" };
const _hoisted_36 = { class: "form-group" };
const _hoisted_37 = /* @__PURE__ */ createBaseVNode("label", { class: "mb-1" }, "Estado", -1);
const _hoisted_38 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_39 = { class: "form-group" };
const _hoisted_40 = /* @__PURE__ */ createBaseVNode("label", { class: "mb-1" }, "Documento escaneado", -1);
const _hoisted_41 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_42 = {
  src: _imports_0,
  alt: "Documento Escaneado"
};
const _hoisted_43 = {
  src: _imports_1,
  alt: "Documento Escaneado"
};
const _hoisted_44 = {
  src: _imports_2,
  alt: "Documento Escaneado"
};
const _hoisted_45 = {
  key: 0,
  class: "badge badge-danger"
};
const _hoisted_46 = /* @__PURE__ */ createBaseVNode("label", { class: "pt-3 mb-0" }, "LISTADO DE PRODUCTOS RECIBIDOS:", -1);
const _hoisted_47 = { class: "col-12 table-responsive" };
const _hoisted_48 = { class: "table table-striped" };
const _hoisted_49 = /* @__PURE__ */ createBaseVNode("thead", null, [
  /* @__PURE__ */ createBaseVNode("tr", null, [
    /* @__PURE__ */ createBaseVNode("th", {
      width: "50",
      class: "text-center no-sort"
    }, "No."),
    /* @__PURE__ */ createBaseVNode("th", null, "Descripci\xF3n"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "100",
      class: "text-center no-sort"
    }, "UM"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "100",
      class: "text-center no-sort"
    }, "Ctdad Recibida"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "100",
      class: "text-right no-sort"
    }, "Precio Unitario"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "130",
      class: "text-right no-sort"
    }, "Importe Total"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "150",
      class: "text-center no-sort"
    }, "Tarjeta Estiba"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "300",
      class: "no-sort"
    }, "Comentario")
  ])
], -1);
const _hoisted_50 = { class: "text-center" };
const _hoisted_51 = ["onClick"];
const _hoisted_52 = { class: "text-center" };
const _hoisted_53 = ["id"];
const _hoisted_54 = { class: "text-right" };
const _hoisted_55 = ["id"];
const _hoisted_56 = ["id"];
const _hoisted_57 = ["id"];
const _hoisted_58 = { class: "col-12 table-responsive" };
const _hoisted_59 = { class: "table table-striped" };
const _hoisted_60 = /* @__PURE__ */ createBaseVNode("th", {
  width: "50",
  class: "text-center no-sort"
}, "No.", -1);
const _hoisted_61 = /* @__PURE__ */ createBaseVNode("th", null, "Descripci\xF3n", -1);
const _hoisted_62 = /* @__PURE__ */ createBaseVNode("th", {
  width: "100",
  class: "text-center no-sort"
}, "UM", -1);
const _hoisted_63 = {
  key: 0,
  width: "100",
  class: "text-center no-sort"
};
const _hoisted_64 = /* @__PURE__ */ createBaseVNode("th", {
  width: "100",
  class: "text-center no-sort"
}, "Ctdad Recibida", -1);
const _hoisted_65 = /* @__PURE__ */ createBaseVNode("th", {
  width: "100",
  class: "text-right no-sort"
}, "Precio Unitario", -1);
const _hoisted_66 = /* @__PURE__ */ createBaseVNode("th", {
  width: "130",
  class: "text-right no-sort"
}, "Importe Total", -1);
const _hoisted_67 = /* @__PURE__ */ createBaseVNode("th", {
  width: "150",
  class: "text-center no-sort"
}, "Tarjeta Estiba", -1);
const _hoisted_68 = {
  key: 1,
  width: "300",
  class: "no-sort"
};
const _hoisted_69 = { class: "text-center" };
const _hoisted_70 = ["onClick"];
const _hoisted_71 = { class: "text-center" };
const _hoisted_72 = {
  key: 0,
  class: "text-center"
};
const _hoisted_73 = ["id"];
const _hoisted_74 = { class: "text-right" };
const _hoisted_75 = ["id"];
const _hoisted_76 = ["id"];
const _hoisted_77 = ["id"];
const _hoisted_78 = {
  class: "modal fade",
  id: "modal-upload-form",
  "aria-hidden": "true",
  role: "dialog",
  "data-backdrop": "static",
  "data-keyboard": "false"
};
const _hoisted_79 = { class: "modal-dialog" };
const _hoisted_80 = { class: "modal-content" };
const _hoisted_81 = { class: "modal-header header-green" };
const _hoisted_82 = /* @__PURE__ */ createBaseVNode("h4", { class: "modal-title" }, "Adjuntar documento escaneado", -1);
const _hoisted_83 = {
  type: "button",
  ref: "CloseUpload",
  class: "close",
  "data-dismiss": "modal",
  "aria-label": "Close"
};
const _hoisted_84 = /* @__PURE__ */ createBaseVNode("span", { "aria-hidden": "true" }, "\xD7", -1);
const _hoisted_85 = [
  _hoisted_84
];
const _hoisted_86 = { class: "modal-body px-4" };
const _hoisted_87 = { enctype: "multipart/form-data" };
const _hoisted_88 = { class: "row pt-3 pb-1" };
const _hoisted_89 = { class: "col-md-12" };
const _hoisted_90 = { class: "text-green" };
const _hoisted_91 = { class: "row" };
const _hoisted_92 = { class: "col-md-12" };
const _hoisted_93 = { class: "form-group" };
const _hoisted_94 = /* @__PURE__ */ createBaseVNode("span", { class: "info-container" }, [
  /* @__PURE__ */ createBaseVNode("span", { class: "text-sm text-muted" }, "Seleccione solo archivos con extensiones PDF, JPG, JPEG, PNG")
], -1);
const _hoisted_95 = {
  key: 0,
  class: "row pt-2"
};
const _hoisted_96 = { class: "col-12 text-center" };
const _hoisted_97 = { class: "form_error" };
const _hoisted_98 = { class: "modal-footer justify-content-between" };
const _hoisted_99 = /* @__PURE__ */ createBaseVNode("button", {
  type: "button",
  class: "btn btn-default ripple",
  "data-dismiss": "modal"
}, "Cancelar", -1);
const _hoisted_100 = ["disabled"];
const _hoisted_101 = {
  key: 0,
  class: "mdi mdi-paperclip"
};
const _hoisted_102 = {
  key: 1,
  class: "mdi mdi-loading mdi-spin"
};
const _hoisted_103 = {
  class: "modal fade",
  id: "modal-item-details",
  "aria-hidden": "true",
  role: "dialog",
  "data-backdrop": "static",
  "data-keyboard": "false"
};
const _hoisted_104 = { class: "modal-dialog" };
const _hoisted_105 = { class: "modal-content" };
const _hoisted_106 = { class: "modal-header header-info" };
const _hoisted_107 = /* @__PURE__ */ createBaseVNode("h4", { class: "modal-title" }, "Detalles Producto", -1);
const _hoisted_108 = {
  type: "button",
  ref: "Close",
  class: "close",
  "data-dismiss": "modal",
  "aria-label": "Close"
};
const _hoisted_109 = /* @__PURE__ */ createBaseVNode("span", { "aria-hidden": "true" }, "\xD7", -1);
const _hoisted_110 = [
  _hoisted_109
];
const _hoisted_111 = { class: "modal-body px-4 rounded-bottom" };
const _hoisted_112 = { class: "row py-1" };
const _hoisted_113 = { class: "col-md-12" };
const _hoisted_114 = /* @__PURE__ */ createBaseVNode("span", { class: "detail-title" }, "C\xF3digo del Producto", -1);
const _hoisted_115 = { class: "detail-desc" };
const _hoisted_116 = { class: "row py-1" };
const _hoisted_117 = { class: "col-md-12" };
const _hoisted_118 = /* @__PURE__ */ createBaseVNode("span", { class: "detail-title" }, "Orden de Compra", -1);
const _hoisted_119 = { class: "detail-desc" };
const _hoisted_120 = {
  key: 0,
  class: "row py-1"
};
const _hoisted_121 = { class: "col-md-12" };
const _hoisted_122 = /* @__PURE__ */ createBaseVNode("span", { class: "detail-title" }, "Descripci\xF3n del Producto", -1);
const _hoisted_123 = { class: "detail-desc" };
const _hoisted_124 = {
  key: 1,
  class: "row py-1"
};
const _hoisted_125 = { class: "col-md-12" };
const _hoisted_126 = /* @__PURE__ */ createBaseVNode("span", { class: "detail-title" }, "Documento", -1);
const _hoisted_127 = { class: "detail-desc" };
const _hoisted_128 = { class: "row py-1" };
const _hoisted_129 = { class: "col-md-12" };
const _hoisted_130 = /* @__PURE__ */ createBaseVNode("span", { class: "detail-title" }, "Descripci\xF3n del Item", -1);
const _hoisted_131 = { class: "detail-desc" };
const _hoisted_132 = { class: "row py-1 mt-2" };
const _hoisted_133 = /* @__PURE__ */ createBaseVNode("div", { class: "text-center" }, [
  /* @__PURE__ */ createBaseVNode("span", { class: "detail-title" }, "UM")
], -1);
const _hoisted_134 = { class: "detail-desc text-center" };
const _hoisted_135 = /* @__PURE__ */ createBaseVNode("div", { class: "text-center" }, [
  /* @__PURE__ */ createBaseVNode("span", { class: "detail-title" }, "Ctdad Despachada")
], -1);
const _hoisted_136 = { class: "detail-desc text-center" };
const _hoisted_137 = /* @__PURE__ */ createBaseVNode("div", { class: "text-center" }, [
  /* @__PURE__ */ createBaseVNode("span", { class: "detail-title" }, "Ctdad Recibida")
], -1);
const _hoisted_138 = { class: "detail-desc text-center" };
const _hoisted_139 = { class: "row py-1" };
const _hoisted_140 = { class: "col-md-4" };
const _hoisted_141 = /* @__PURE__ */ createBaseVNode("div", { class: "text-center" }, [
  /* @__PURE__ */ createBaseVNode("span", { class: "detail-title" }, "Precio Unitario")
], -1);
const _hoisted_142 = { class: "detail-desc text-center" };
const _hoisted_143 = { class: "col-md-4" };
const _hoisted_144 = /* @__PURE__ */ createBaseVNode("div", { class: "text-center" }, [
  /* @__PURE__ */ createBaseVNode("span", { class: "detail-title" }, "Importe Total")
], -1);
const _hoisted_145 = { class: "detail-desc text-center" };
const _hoisted_146 = { class: "col-md-4" };
const _hoisted_147 = /* @__PURE__ */ createBaseVNode("div", { class: "text-center" }, [
  /* @__PURE__ */ createBaseVNode("span", { class: "detail-title" }, "Tarjeta de Estiba")
], -1);
const _hoisted_148 = { class: "detail-desc text-center" };
const _hoisted_149 = {
  key: 2,
  class: "row py-1"
};
const _hoisted_150 = { class: "col-md-12" };
const _hoisted_151 = /* @__PURE__ */ createBaseVNode("span", { class: "detail-title" }, "Comentario", -1);
const _hoisted_152 = { class: "detail-desc" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_page_header = resolveComponent("page-header");
  const _directive_tooltip = resolveDirective("tooltip");
  return openBlock(), createElementBlock(Fragment, null, [
    createVNode(_component_page_header, {
      pagetitle: "Detalle de la entrada: " + _ctx.pagetitle,
      breadcrumbs: true,
      navbar: [
        {
          page: "Entradas",
          link: "/semtinel/public/logistics/entries",
          tooltip: "Click para regresar al listado de Entradas",
          active: false
        },
        {
          page: "Detalle de entrada",
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
            createTextVNode("\xA0\xA0Fecha de la entrada: " + toDisplayString(_ctx.entry.created_at), 1)
          ])
        ]),
        createBaseVNode("div", _hoisted_5, [
          withDirectives((openBlock(), createElementBlock("a", {
            href: "javascript:void(0);",
            class: "btn btn-app system",
            onClick: _cache[0] || (_cache[0] = ($event) => $options.docPdf(_ctx.entry.id))
          }, [
            _hoisted_6,
            createTextVNode(" Documento ")
          ])), [
            [_directive_tooltip, "Generar documento PDF"]
          ]),
          "logistics.api.upload.entry" in _ctx.$root.session.permissions ? withDirectives((openBlock(), createElementBlock("a", {
            key: 0,
            href: "javascript:void(0);",
            class: "btn btn-app system",
            "data-toggle": "modal",
            "data-target": "#modal-upload-form",
            onClick: _cache[1] || (_cache[1] = ($event) => $options.attachFile(_ctx.entry.id, _ctx.entry.code))
          }, [
            _hoisted_7,
            createTextVNode(" Adjuntar ")
          ])), [
            [_directive_tooltip, "Adjuntar documento escaneado"]
          ]) : createCommentVNode("", true),
          "logistics.api.cofirm.entry" in _ctx.$root.session.permissions ? withDirectives((openBlock(), createElementBlock("a", {
            key: 1,
            href: "javascript:void(0);",
            class: normalizeClass(["btn btn-app success", _ctx.entry.confirm == 1 ? "disabled" : ""]),
            onClick: _cache[2] || (_cache[2] = withModifiers(($event) => $options.confirmEntry(), ["stop"]))
          }, [
            createBaseVNode("i", {
              class: normalizeClass(["fas", _ctx.confirm_loading ? "fa-spinner fa-pulse" : "fa-check"])
            }, null, 2),
            createTextVNode(" " + toDisplayString(_ctx.confirm_text), 1)
          ], 2)), [
            [_directive_tooltip, "Confirmar entrada"]
          ]) : createCommentVNode("", true),
          _ctx.entry.confirm != 1 && _ctx.entry.transfer != 1 && (_ctx.session.id == _ctx.entry.created_by || "Responsable de Especialidad" in _ctx.$root.session.roles && _ctx.entry.warehouse in _ctx.session.warehouses) ? withDirectives((openBlock(), createElementBlock("a", {
            key: 2,
            href: "javascript:void(0);",
            class: "btn btn-app danger",
            onClick: _cache[3] || (_cache[3] = withModifiers(($event) => $options.cancelEntry(), ["stop"]))
          }, [
            createBaseVNode("i", {
              class: normalizeClass(["fas", _ctx.cancel_loading ? "fa-spinner fa-pulse" : "fa-times"])
            }, null, 2),
            createTextVNode(" Cancelar ")
          ])), [
            [_directive_tooltip, "Cancelar entrada"]
          ]) : createCommentVNode("", true)
        ])
      ]),
      createBaseVNode("div", _hoisted_8, [
        createBaseVNode("div", _hoisted_9, [
          createBaseVNode("div", _hoisted_10, [
            _hoisted_11,
            createBaseVNode("h6", _hoisted_12, [
              createBaseVNode("strong", null, toDisplayString(_ctx.entry.origin), 1)
            ])
          ]),
          createBaseVNode("div", _hoisted_13, [
            _hoisted_14,
            createBaseVNode("h6", _hoisted_15, [
              createBaseVNode("strong", null, toDisplayString(_ctx.entry.document_type), 1)
            ])
          ]),
          createBaseVNode("div", _hoisted_16, [
            _hoisted_17,
            createBaseVNode("h6", _hoisted_18, [
              createBaseVNode("strong", null, toDisplayString(_ctx.entry.document_number), 1)
            ])
          ]),
          createBaseVNode("div", _hoisted_19, [
            _hoisted_20,
            createBaseVNode("h6", _hoisted_21, [
              createBaseVNode("strong", null, toDisplayString(_ctx.entry.oc), 1)
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_22, [
          createBaseVNode("div", _hoisted_23, [
            _hoisted_24,
            createBaseVNode("h6", _hoisted_25, [
              createBaseVNode("strong", null, toDisplayString(_ctx.entry.warehouse_name), 1)
            ])
          ]),
          createBaseVNode("div", _hoisted_26, [
            _hoisted_27,
            createBaseVNode("h6", _hoisted_28, [
              createBaseVNode("strong", null, toDisplayString(_ctx.entry.warehouse_owner), 1)
            ])
          ]),
          createBaseVNode("div", _hoisted_29, [
            _hoisted_30,
            createBaseVNode("h6", _hoisted_31, [
              createBaseVNode("strong", null, toDisplayString(_ctx.entry.pole_name), 1)
            ])
          ]),
          createBaseVNode("div", _hoisted_32, [
            _hoisted_33,
            createBaseVNode("h6", _hoisted_34, [
              createBaseVNode("strong", null, toDisplayString(_ctx.entry.project_name), 1)
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_35, [
          createBaseVNode("div", _hoisted_36, [
            _hoisted_37,
            _hoisted_38,
            createBaseVNode("span", {
              class: normalizeClass(["badge", _ctx.entry.status == "Parcial" ? "badge-warning" : "badge-dark"])
            }, " Entrega " + toDisplayString(_ctx.entry.status), 3)
          ]),
          createBaseVNode("div", _hoisted_39, [
            _hoisted_40,
            _hoisted_41,
            _ctx.entry.attach_path != "" && _ctx.entry.attach_path != null && _ctx.entry.attach_type == "pdf" ? (openBlock(), createElementBlock("a", {
              key: 0,
              href: "javascript:void(0);",
              onClick: _cache[4] || (_cache[4] = withModifiers(($event) => $options.openScanner(_ctx.entry.attach_path), ["stop"]))
            }, [
              withDirectives(createBaseVNode("img", _hoisted_42, null, 512), [
                [_directive_tooltip, "Click para abrir"]
              ])
            ])) : _ctx.entry.attach_path != "" && _ctx.entry.attach_path != null && _ctx.entry.attach_type == "png" ? (openBlock(), createElementBlock("a", {
              key: 1,
              href: "javascript:void(0);",
              onClick: _cache[5] || (_cache[5] = withModifiers(($event) => $options.openScanner(_ctx.entry.attach_path), ["stop"]))
            }, [
              withDirectives(createBaseVNode("img", _hoisted_43, null, 512), [
                [_directive_tooltip, "Click para abrir"]
              ])
            ])) : _ctx.entry.attach_path != "" && _ctx.entry.attach_path != null && _ctx.entry.attach_type == "jpg" ? (openBlock(), createElementBlock("a", {
              key: 2,
              href: "javascript:void(0);",
              onClick: _cache[6] || (_cache[6] = withModifiers(($event) => $options.openScanner(_ctx.entry.attach_path), ["stop"]))
            }, [
              withDirectives(createBaseVNode("img", _hoisted_44, null, 512), [
                [_directive_tooltip, "Click para abrir"]
              ])
            ])) : (openBlock(), createElementBlock(Fragment, { key: 3 }, [
              _ctx.entry.attach_path == "" || _ctx.entry.attach_path == null ? (openBlock(), createElementBlock("span", _hoisted_45, " No se ha adjuntado el documento escaneado a\xFAn. ")) : createCommentVNode("", true)
            ], 64))
          ])
        ])
      ]),
      _hoisted_46,
      createBaseVNode("div", {
        class: normalizeClass(["row pt-3", !_ctx.table_oc ? "hidden" : ""])
      }, [
        createBaseVNode("div", _hoisted_47, [
          createBaseVNode("table", _hoisted_48, [
            _hoisted_49,
            createBaseVNode("tbody", null, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.entry["items"], (item, idx) => {
                return openBlock(), createElementBlock("tr", {
                  key: item["id"]
                }, [
                  createBaseVNode("td", _hoisted_50, toDisplayString(idx + 1), 1),
                  createBaseVNode("td", null, [
                    withDirectives((openBlock(), createElementBlock("a", {
                      class: "show-lnk",
                      href: "javascript:void(0);",
                      "data-toggle": "modal",
                      "data-target": "#modal-item-details",
                      onClick: ($event) => $options.show(idx)
                    }, [
                      createTextVNode(toDisplayString(item["item_description"]), 1)
                    ], 8, _hoisted_51)), [
                      [_directive_tooltip, "Click para Mostrar Detalles de este producto"]
                    ])
                  ]),
                  createBaseVNode("td", _hoisted_52, toDisplayString(item["um"]), 1),
                  createBaseVNode("td", {
                    id: "item-" + (idx + 1) + "-received",
                    class: "text-center"
                  }, toDisplayString(item["received_quantity"]), 9, _hoisted_53),
                  createBaseVNode("td", _hoisted_54, toDisplayString(item["price_unit"]), 1),
                  createBaseVNode("td", {
                    id: "item-" + (idx + 1) + "-pricetotal",
                    class: "text-right"
                  }, toDisplayString(item["price_total"]), 9, _hoisted_55),
                  createBaseVNode("td", {
                    id: "item-" + (idx + 1) + "-stowagecard",
                    class: "text-center"
                  }, toDisplayString(item["stowage_card"]), 9, _hoisted_56),
                  createBaseVNode("td", {
                    id: "item-" + (idx + 1) + "-comment"
                  }, toDisplayString(item["comment"]), 9, _hoisted_57)
                ]);
              }), 128))
            ])
          ])
        ])
      ], 2),
      createBaseVNode("div", {
        class: normalizeClass(["row pt-3", _ctx.table_oc ? "hidden" : ""])
      }, [
        createBaseVNode("div", _hoisted_58, [
          createBaseVNode("table", _hoisted_59, [
            createBaseVNode("thead", null, [
              createBaseVNode("tr", null, [
                _hoisted_60,
                _hoisted_61,
                _hoisted_62,
                _ctx.entry["origin"] != "Transferencia de Pa\xF1ol" ? (openBlock(), createElementBlock("th", _hoisted_63, "Ctdad Despachada")) : createCommentVNode("", true),
                _hoisted_64,
                _hoisted_65,
                _hoisted_66,
                _hoisted_67,
                _ctx.entry["origin"] != "Transferencia de Pa\xF1ol" ? (openBlock(), createElementBlock("th", _hoisted_68, "Comentario")) : createCommentVNode("", true)
              ])
            ]),
            createBaseVNode("tbody", null, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.entry["items"], (item, idx) => {
                return openBlock(), createElementBlock("tr", {
                  key: item["id"]
                }, [
                  createBaseVNode("td", _hoisted_69, toDisplayString(idx + 1), 1),
                  createBaseVNode("td", null, [
                    withDirectives((openBlock(), createElementBlock("a", {
                      class: "show-lnk",
                      href: "javascript:void(0);",
                      "data-toggle": "modal",
                      "data-target": "#modal-item-details",
                      onClick: ($event) => $options.show(idx)
                    }, [
                      createTextVNode(toDisplayString(item["item_description"]), 1)
                    ], 8, _hoisted_70)), [
                      [_directive_tooltip, "Click para Mostrar Detalles de este producto"]
                    ])
                  ]),
                  createBaseVNode("td", _hoisted_71, toDisplayString(item["um"]), 1),
                  _ctx.entry["origin"] != "Transferencia de Pa\xF1ol" ? (openBlock(), createElementBlock("td", _hoisted_72, toDisplayString(item["product_quantity"]), 1)) : createCommentVNode("", true),
                  createBaseVNode("td", {
                    id: "item-" + (idx + 1) + "-received",
                    class: "text-center"
                  }, toDisplayString(item["received_quantity"]), 9, _hoisted_73),
                  createBaseVNode("td", _hoisted_74, toDisplayString(item["price_unit"]), 1),
                  createBaseVNode("td", {
                    id: "item-" + (idx + 1) + "-pricetotal",
                    class: "text-right"
                  }, toDisplayString(item["price_total"]), 9, _hoisted_75),
                  createBaseVNode("td", {
                    id: "item-" + (idx + 1) + "-stowagecard",
                    class: "text-center"
                  }, toDisplayString(item["stowage_card"]), 9, _hoisted_76),
                  _ctx.entry["origin"] != "Transferencia de Pa\xF1ol" ? (openBlock(), createElementBlock("td", {
                    key: 1,
                    id: "item-" + (idx + 1) + "-comment"
                  }, toDisplayString(item["comment"]), 9, _hoisted_77)) : createCommentVNode("", true)
                ]);
              }), 128))
            ])
          ])
        ])
      ], 2)
    ]),
    createBaseVNode("div", _hoisted_78, [
      createBaseVNode("div", _hoisted_79, [
        createBaseVNode("div", _hoisted_80, [
          createBaseVNode("div", _hoisted_81, [
            _hoisted_82,
            createBaseVNode("button", _hoisted_83, _hoisted_85, 512)
          ]),
          createBaseVNode("div", _hoisted_86, [
            createBaseVNode("form", _hoisted_87, [
              withDirectives(createBaseVNode("input", {
                type: "hidden",
                name: "upload_id_entry",
                id: "upload_id_entry",
                "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => _ctx.upload_id = $event)
              }, null, 512), [
                [vModelText, _ctx.upload_id]
              ]),
              createBaseVNode("div", _hoisted_88, [
                createBaseVNode("div", _hoisted_89, [
                  createBaseVNode("h6", _hoisted_90, [
                    createTextVNode(" Entrada No. "),
                    createBaseVNode("strong", null, toDisplayString(_ctx.upload_entry), 1)
                  ])
                ])
              ]),
              createBaseVNode("div", _hoisted_91, [
                createBaseVNode("div", _hoisted_92, [
                  createBaseVNode("div", _hoisted_93, [
                    createBaseVNode("input", {
                      id: "uploadFile",
                      ref: "uploadFile",
                      class: "form-control",
                      type: "file",
                      accept: ".jpg,.jpeg,.png,.pdf",
                      onChange: _cache[8] || (_cache[8] = (...args) => $options.onChangeFile && $options.onChangeFile(...args))
                    }, null, 544),
                    _hoisted_94
                  ])
                ])
              ]),
              _ctx.upload_form_error.error_text != "" ? (openBlock(), createElementBlock("div", _hoisted_95, [
                createBaseVNode("div", _hoisted_96, [
                  createBaseVNode("h6", _hoisted_97, toDisplayString(_ctx.upload_form_error.error_text), 1)
                ])
              ])) : createCommentVNode("", true)
            ])
          ]),
          createBaseVNode("div", _hoisted_98, [
            _hoisted_99,
            createBaseVNode("button", {
              type: "button",
              class: "btn btn-primary btn-green ripple",
              disabled: _ctx.upload_form_loading,
              onClick: _cache[9] || (_cache[9] = withModifiers(($event) => $options.uploadDoc(), ["stop"]))
            }, [
              !_ctx.upload_form_loading ? (openBlock(), createElementBlock("i", _hoisted_101)) : (openBlock(), createElementBlock("i", _hoisted_102)),
              createTextVNode(" " + toDisplayString(_ctx.upload_form_okbtn_text), 1)
            ], 8, _hoisted_100)
          ])
        ])
      ])
    ]),
    createBaseVNode("div", _hoisted_103, [
      createBaseVNode("div", _hoisted_104, [
        createBaseVNode("div", _hoisted_105, [
          createBaseVNode("div", _hoisted_106, [
            _hoisted_107,
            createBaseVNode("button", _hoisted_108, _hoisted_110, 512)
          ]),
          createBaseVNode("div", _hoisted_111, [
            createBaseVNode("div", _hoisted_112, [
              createBaseVNode("div", _hoisted_113, [
                _hoisted_114,
                createBaseVNode("h6", _hoisted_115, toDisplayString(_ctx.item_details.cod_product), 1)
              ])
            ]),
            createBaseVNode("div", _hoisted_116, [
              createBaseVNode("div", _hoisted_117, [
                _hoisted_118,
                createBaseVNode("h6", _hoisted_119, toDisplayString(_ctx.item_details.oc), 1)
              ])
            ]),
            _ctx.table_oc && _ctx.show_details ? (openBlock(), createElementBlock("div", _hoisted_120, [
              createBaseVNode("div", _hoisted_121, [
                _hoisted_122,
                createBaseVNode("h6", _hoisted_123, toDisplayString(_ctx.item_details.generic_descript.toUpperCase()), 1)
              ])
            ])) : createCommentVNode("", true),
            !_ctx.table_oc && _ctx.show_details ? (openBlock(), createElementBlock("div", _hoisted_124, [
              createBaseVNode("div", _hoisted_125, [
                _hoisted_126,
                createBaseVNode("h6", _hoisted_127, toDisplayString(_ctx.item_details.docnum), 1)
              ])
            ])) : createCommentVNode("", true),
            createBaseVNode("div", _hoisted_128, [
              createBaseVNode("div", _hoisted_129, [
                _hoisted_130,
                createBaseVNode("h6", _hoisted_131, toDisplayString(_ctx.item_details.item_description.toUpperCase()), 1)
              ])
            ]),
            createBaseVNode("div", _hoisted_132, [
              createBaseVNode("div", {
                class: normalizeClass(_ctx.table_oc ? "col-md-6" : "col-md-4")
              }, [
                _hoisted_133,
                createBaseVNode("h6", _hoisted_134, toDisplayString(_ctx.item_details.um), 1)
              ], 2),
              !_ctx.table_oc ? (openBlock(), createElementBlock("div", {
                key: 0,
                class: normalizeClass(_ctx.table_oc ? "col-md-6" : "col-md-4")
              }, [
                _hoisted_135,
                createBaseVNode("h6", _hoisted_136, toDisplayString(_ctx.item_details.product_quantity), 1)
              ], 2)) : createCommentVNode("", true),
              createBaseVNode("div", {
                class: normalizeClass(_ctx.table_oc ? "col-md-6" : "col-md-4")
              }, [
                _hoisted_137,
                createBaseVNode("h6", _hoisted_138, toDisplayString(_ctx.item_details.received_quantity), 1)
              ], 2)
            ]),
            createBaseVNode("div", _hoisted_139, [
              createBaseVNode("div", _hoisted_140, [
                _hoisted_141,
                createBaseVNode("h6", _hoisted_142, toDisplayString(_ctx.item_details.price_unit), 1)
              ]),
              createBaseVNode("div", _hoisted_143, [
                _hoisted_144,
                createBaseVNode("h6", _hoisted_145, toDisplayString(_ctx.item_details.price_total), 1)
              ]),
              createBaseVNode("div", _hoisted_146, [
                _hoisted_147,
                createBaseVNode("h6", _hoisted_148, toDisplayString(_ctx.item_details.stowage_card), 1)
              ])
            ]),
            _ctx.item_details.comment != "" && _ctx.item_details.comment != null ? (openBlock(), createElementBlock("div", _hoisted_149, [
              createBaseVNode("div", _hoisted_150, [
                _hoisted_151,
                createBaseVNode("h6", _hoisted_152, toDisplayString(_ctx.item_details.comment), 1)
              ])
            ])) : createCommentVNode("", true)
          ])
        ])
      ])
    ])
  ], 64);
}
const EntryDetailComponent = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  EntryDetailComponent as default
};
