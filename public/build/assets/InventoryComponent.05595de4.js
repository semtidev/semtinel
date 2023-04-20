import { K as resolveDirective, o as openBlock, b as createElementBlock, i as createBaseVNode, v as toDisplayString, j as createCommentVNode, f as normalizeClass, F as Fragment, I as renderList, H as createTextVNode, L as withModifiers, J as withDirectives, q as createVNode, O as vModelSelect, N as vModelText, l as withKeys, h as resolveComponent } from "./vue.esm-bundler.7d6bf7a6.js";
import { $ } from "./jquery.9b0ba2d7.js";
import "./jquery.dataTables.min.5c722aa7.js";
import { _ as _export_sfc, P as PageHeader } from "./app.affc77e9.js";
import { _ as _imports_0, a as _imports_1, b as _imports_2 } from "./icon-jpg.b5720497.js";
const _sfc_main$1 = {
  props: {
    history: {
      type: Object,
      default: () => {
      }
    },
    history_loading: {
      type: Boolean,
      default: true
    },
    history_empty: {
      type: Boolean,
      default: true
    },
    description: {
      type: String,
      default: ""
    }
  },
  methods: {
    getDateTimeline: function(date) {
      const months = {
        1: "Ene.",
        2: "Feb.",
        3: "Mar.",
        4: "Abr.",
        5: "May.",
        6: "Jun.",
        7: "Jul.",
        8: "Ago.",
        9: "Sep.",
        10: "Oct.",
        11: "Nov.",
        12: "Dic."
      }, date_arr = date.split("-");
      return parseInt(date_arr[2]) + " " + months[parseInt(date_arr[1])] + " " + date_arr[0];
    },
    openScanner: function(path) {
      window.open("http://localhost/semtinel/storage/app/public/" + path, "_blank", "noreferrer");
    },
    docPdf: function(entry) {
      window.open("http://localhost/semtinel/public/api/logistics/pdf/entry/" + entry, "_blank", "noreferrer");
    }
  }
};
const _hoisted_1$1 = {
  key: 0,
  class: "row"
};
const _hoisted_2$1 = { class: "col-12 pt-2 pb-3" };
const _hoisted_3$1 = /* @__PURE__ */ createBaseVNode("div", { class: "col-12 text-center pt-2 pb-3 loading-table" }, [
  /* @__PURE__ */ createBaseVNode("span", { class: "mdi mdi-loading mdi-spin mdi-36px" }, "\xA0Cargando historial...")
], -1);
const _hoisted_4$1 = [
  _hoisted_3$1
];
const _hoisted_5$1 = /* @__PURE__ */ createBaseVNode("div", { class: "col-12 text-center pt-2 pb-3 empty-table" }, [
  /* @__PURE__ */ createBaseVNode("h6", null, "Ning\xFAna actividad encontrada en este periodo")
], -1);
const _hoisted_6$1 = [
  _hoisted_5$1
];
const _hoisted_7$1 = { class: "time-label" };
const _hoisted_8$1 = { class: "bg-gradient-orange px-2 text-white" };
const _hoisted_9$1 = { key: 0 };
const _hoisted_10$1 = /* @__PURE__ */ createBaseVNode("i", { class: "mdi mdi-truck-check mdi-18px bg-primary" }, null, -1);
const _hoisted_11$1 = { class: "timeline-item" };
const _hoisted_12$1 = { class: "time" };
const _hoisted_13$1 = /* @__PURE__ */ createBaseVNode("i", { class: "far fa-clock" }, null, -1);
const _hoisted_14$1 = {
  key: 0,
  class: "timeline-header timeline-gray-light"
};
const _hoisted_15$1 = /* @__PURE__ */ createBaseVNode("strong", null, "Entrada Creada", -1);
const _hoisted_16$1 = ["onClick"];
const _hoisted_17$1 = ["href"];
const _hoisted_18$1 = {
  key: 1,
  class: "timeline-header timeline-gray-light"
};
const _hoisted_19$1 = /* @__PURE__ */ createBaseVNode("strong", null, "Entrada Creada", -1);
const _hoisted_20$1 = ["onClick"];
const _hoisted_21$1 = ["href"];
const _hoisted_22$1 = { class: "timeline-body timeline-gray-light p-3" };
const _hoisted_23$1 = { class: "row invoice-info" };
const _hoisted_24$1 = { class: "col-sm-3 invoice-col" };
const _hoisted_25$1 = { class: "form-group" };
const _hoisted_26$1 = /* @__PURE__ */ createBaseVNode("label", { class: "mb-1" }, "Origen", -1);
const _hoisted_27$1 = { class: "p-0" };
const _hoisted_28$1 = { class: "form-group" };
const _hoisted_29$1 = /* @__PURE__ */ createBaseVNode("label", { class: "mb-1" }, "Orden de Compra", -1);
const _hoisted_30$1 = { class: "p-0" };
const _hoisted_31$1 = { class: "col-sm-3 invoice-col" };
const _hoisted_32$1 = { class: "form-group" };
const _hoisted_33$1 = /* @__PURE__ */ createBaseVNode("label", { class: "mb-1" }, "Destino", -1);
const _hoisted_34$1 = { class: "p-0" };
const _hoisted_35$1 = { class: "form-group" };
const _hoisted_36$1 = /* @__PURE__ */ createBaseVNode("label", { class: "mb-1" }, "Responsable", -1);
const _hoisted_37$1 = { class: "p-0" };
const _hoisted_38$1 = { class: "col-sm-3 invoice-col" };
const _hoisted_39$1 = { class: "form-group" };
const _hoisted_40$1 = /* @__PURE__ */ createBaseVNode("label", { class: "mb-1" }, "Estado", -1);
const _hoisted_41$1 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_42$1 = { class: "p-0" };
const _hoisted_43$1 = { class: "form-group" };
const _hoisted_44$1 = /* @__PURE__ */ createBaseVNode("label", { class: "mb-1" }, "Confirmada", -1);
const _hoisted_45$1 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_46$1 = { class: "p-0" };
const _hoisted_47$1 = { key: 1 };
const _hoisted_48$1 = /* @__PURE__ */ createBaseVNode("i", { class: "fas fa-trash-alt bg-danger" }, null, -1);
const _hoisted_49$1 = { class: "timeline-item" };
const _hoisted_50$1 = { class: "time" };
const _hoisted_51$1 = /* @__PURE__ */ createBaseVNode("i", { class: "far fa-clock" }, null, -1);
const _hoisted_52$1 = { class: "timeline-header timeline-gray-light border-0" };
const _hoisted_53$1 = /* @__PURE__ */ createBaseVNode("strong", null, "Entrada Cancelada", -1);
const _hoisted_54$1 = ["onClick"];
const _hoisted_55$1 = ["href"];
const _hoisted_56$1 = { key: 2 };
const _hoisted_57$1 = /* @__PURE__ */ createBaseVNode("i", { class: "fas fa-check bg-success" }, null, -1);
const _hoisted_58$1 = { class: "timeline-item" };
const _hoisted_59$1 = { class: "time" };
const _hoisted_60$1 = /* @__PURE__ */ createBaseVNode("i", { class: "far fa-clock" }, null, -1);
const _hoisted_61$1 = { class: "timeline-header timeline-gray-light border-0" };
const _hoisted_62$1 = /* @__PURE__ */ createBaseVNode("strong", null, "Entrada Confirmada", -1);
const _hoisted_63$1 = ["onClick"];
const _hoisted_64$1 = ["href"];
const _hoisted_65$1 = { key: 3 };
const _hoisted_66$1 = /* @__PURE__ */ createBaseVNode("i", { class: "fas fa-paperclip bg-purple" }, null, -1);
const _hoisted_67$1 = { class: "timeline-item" };
const _hoisted_68$1 = { class: "time" };
const _hoisted_69$1 = /* @__PURE__ */ createBaseVNode("i", { class: "far fa-clock" }, null, -1);
const _hoisted_70$1 = { class: "timeline-header timeline-gray-light border-0" };
const _hoisted_71$1 = /* @__PURE__ */ createBaseVNode("strong", null, "Archivo adjuntado", -1);
const _hoisted_72$1 = ["href"];
const _hoisted_73$1 = { class: "timeline-body timeline-gray-light px-3 pb-0" };
const _hoisted_74$1 = { class: "row invoice-info" };
const _hoisted_75$1 = { class: "col-12 invoice-col" };
const _hoisted_76$1 = { class: "form-group" };
const _hoisted_77$1 = /* @__PURE__ */ createBaseVNode("label", { class: "mb-1" }, "Click para Abrir", -1);
const _hoisted_78$1 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_79$1 = ["onClick"];
const _hoisted_80$1 = {
  src: _imports_0,
  alt: "Documento Escaneado"
};
const _hoisted_81$1 = ["onClick"];
const _hoisted_82$1 = {
  src: _imports_1,
  alt: "Documento Escaneado"
};
const _hoisted_83$1 = ["onClick"];
const _hoisted_84$1 = {
  src: _imports_2,
  alt: "Documento Escaneado"
};
const _hoisted_85$1 = { key: 4 };
const _hoisted_86$1 = /* @__PURE__ */ createBaseVNode("i", { class: "mdi mdi-plus mdi-18px bg-success" }, null, -1);
const _hoisted_87$1 = { class: "timeline-item" };
const _hoisted_88$1 = { class: "time" };
const _hoisted_89$1 = /* @__PURE__ */ createBaseVNode("i", { class: "far fa-clock" }, null, -1);
const _hoisted_90$1 = {
  key: 0,
  class: "timeline-header timeline-gray-light"
};
const _hoisted_91$1 = /* @__PURE__ */ createBaseVNode("strong", null, "Recepc\xF3n del Producto", -1);
const _hoisted_92$1 = ["onClick"];
const _hoisted_93$1 = ["href"];
const _hoisted_94$1 = {
  key: 1,
  class: "timeline-header timeline-gray-light"
};
const _hoisted_95$1 = /* @__PURE__ */ createBaseVNode("strong", null, "Recepci\xF3n del Producto", -1);
const _hoisted_96$1 = ["onClick"];
const _hoisted_97$1 = ["href"];
const _hoisted_98$1 = { class: "timeline-body timeline-gray-light p-3" };
const _hoisted_99$1 = { class: "row invoice-info" };
const _hoisted_100$1 = { class: "col-sm-6 invoice-col" };
const _hoisted_101$1 = { class: "form-group" };
const _hoisted_102$1 = /* @__PURE__ */ createBaseVNode("label", { class: "mb-1" }, "Origen", -1);
const _hoisted_103$1 = { class: "p-0" };
const _hoisted_104$1 = { class: "form-group" };
const _hoisted_105$1 = /* @__PURE__ */ createBaseVNode("label", { class: "mb-1" }, "Orden de Compra", -1);
const _hoisted_106$1 = { class: "p-0" };
const _hoisted_107$1 = { class: "form-group" };
const _hoisted_108$1 = /* @__PURE__ */ createBaseVNode("label", { class: "mb-1" }, "Unidad Medida", -1);
const _hoisted_109$1 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_110$1 = { class: "p-0" };
const _hoisted_111$1 = { class: "col-sm-6 invoice-col" };
const _hoisted_112$1 = { class: "form-group" };
const _hoisted_113$1 = /* @__PURE__ */ createBaseVNode("label", { class: "mb-1" }, "Destino", -1);
const _hoisted_114$1 = { class: "p-0" };
const _hoisted_115$1 = { class: "form-group" };
const _hoisted_116$1 = /* @__PURE__ */ createBaseVNode("label", { class: "mb-1" }, "Responsable", -1);
const _hoisted_117$1 = { class: "p-0" };
const _hoisted_118$1 = { class: "form-group" };
const _hoisted_119$1 = /* @__PURE__ */ createBaseVNode("label", { class: "mb-1" }, "Cantidad", -1);
const _hoisted_120$1 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_121$1 = { class: "p-0" };
const _hoisted_122$1 = /* @__PURE__ */ createBaseVNode("div", null, [
  /* @__PURE__ */ createBaseVNode("i", { class: "far fa-clock bg-gray" })
], -1);
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_tooltip = resolveDirective("tooltip");
  return openBlock(), createElementBlock(Fragment, null, [
    $props.description != "" ? (openBlock(), createElementBlock("div", _hoisted_1$1, [
      createBaseVNode("div", _hoisted_2$1, [
        createBaseVNode("h5", null, toDisplayString($props.description), 1)
      ])
    ])) : createCommentVNode("", true),
    createBaseVNode("div", {
      class: normalizeClass(["row", !$props.history_loading ? "hidden" : ""])
    }, _hoisted_4$1, 2),
    createBaseVNode("div", {
      class: normalizeClass(["row", $props.history_empty && !$props.history_loading ? "" : "hidden"])
    }, _hoisted_6$1, 2),
    !$props.history_empty ? (openBlock(), createElementBlock("div", {
      key: 1,
      class: normalizeClass(["timeline timeline-inverse", $props.history_loading ? "hidden" : ""])
    }, [
      (openBlock(true), createElementBlock(Fragment, null, renderList($props.history, (item, idx) => {
        return openBlock(), createElementBlock(Fragment, { key: idx }, [
          createBaseVNode("div", _hoisted_7$1, [
            createBaseVNode("span", _hoisted_8$1, toDisplayString($options.getDateTimeline(idx)), 1)
          ]),
          (openBlock(true), createElementBlock(Fragment, null, renderList(item, (node, node_idx) => {
            return openBlock(), createElementBlock(Fragment, { key: node_idx }, [
              node.node_type == "create-entry" ? (openBlock(), createElementBlock("div", _hoisted_9$1, [
                _hoisted_10$1,
                createBaseVNode("div", _hoisted_11$1, [
                  createBaseVNode("span", _hoisted_12$1, [
                    _hoisted_13$1,
                    createTextVNode(" " + toDisplayString(node.hour), 1)
                  ]),
                  node.attach_path != null && node.attach_path != "" ? (openBlock(), createElementBlock("h3", _hoisted_14$1, [
                    _hoisted_15$1,
                    createTextVNode(" desde el documento "),
                    createBaseVNode("a", {
                      href: "javascript:void(0);",
                      onClick: withModifiers(($event) => $options.openScanner(node.attach_path), ["stop"])
                    }, toDisplayString(node.document_number), 9, _hoisted_16$1),
                    createTextVNode(" por "),
                    createBaseVNode("strong", null, [
                      createBaseVNode("a", {
                        href: "mailto:" + node.created_by_email
                      }, toDisplayString(node.created_by_name), 9, _hoisted_17$1)
                    ])
                  ])) : (openBlock(), createElementBlock("h3", _hoisted_18$1, [
                    _hoisted_19$1,
                    createTextVNode(" desde el documento "),
                    createBaseVNode("a", {
                      href: "javascript:void(0);",
                      onClick: withModifiers(($event) => $options.docPdf(node.id), ["stop"])
                    }, toDisplayString(node.document_number), 9, _hoisted_20$1),
                    createTextVNode(" por "),
                    createBaseVNode("strong", null, [
                      createBaseVNode("a", {
                        href: "mailto:" + node.created_by_email
                      }, toDisplayString(node.created_by_name), 9, _hoisted_21$1)
                    ])
                  ])),
                  createBaseVNode("div", _hoisted_22$1, [
                    createBaseVNode("div", _hoisted_23$1, [
                      createBaseVNode("div", _hoisted_24$1, [
                        createBaseVNode("div", _hoisted_25$1, [
                          _hoisted_26$1,
                          createBaseVNode("h6", _hoisted_27$1, [
                            createBaseVNode("strong", null, toDisplayString(node.origin), 1)
                          ])
                        ]),
                        createBaseVNode("div", _hoisted_28$1, [
                          _hoisted_29$1,
                          createBaseVNode("h6", _hoisted_30$1, [
                            createBaseVNode("strong", null, toDisplayString(node.oc), 1)
                          ])
                        ])
                      ]),
                      createBaseVNode("div", _hoisted_31$1, [
                        createBaseVNode("div", _hoisted_32$1, [
                          _hoisted_33$1,
                          createBaseVNode("h6", _hoisted_34$1, [
                            createBaseVNode("strong", null, toDisplayString(node.warehouse_name), 1)
                          ])
                        ]),
                        createBaseVNode("div", _hoisted_35$1, [
                          _hoisted_36$1,
                          createBaseVNode("h6", _hoisted_37$1, [
                            createBaseVNode("strong", null, toDisplayString(node.warehouse_owner), 1)
                          ])
                        ])
                      ]),
                      createBaseVNode("div", _hoisted_38$1, [
                        createBaseVNode("div", _hoisted_39$1, [
                          _hoisted_40$1,
                          _hoisted_41$1,
                          createBaseVNode("h6", _hoisted_42$1, [
                            createBaseVNode("strong", null, "Entrega " + toDisplayString(node.status), 1)
                          ])
                        ]),
                        createBaseVNode("div", _hoisted_43$1, [
                          _hoisted_44$1,
                          _hoisted_45$1,
                          createBaseVNode("h6", _hoisted_46$1, [
                            createBaseVNode("strong", null, toDisplayString(node.confirm), 1)
                          ])
                        ])
                      ])
                    ])
                  ])
                ])
              ])) : createCommentVNode("", true),
              node.node_type == "cancel-entry" ? (openBlock(), createElementBlock("div", _hoisted_47$1, [
                _hoisted_48$1,
                createBaseVNode("div", _hoisted_49$1, [
                  createBaseVNode("span", _hoisted_50$1, [
                    _hoisted_51$1,
                    createTextVNode(" " + toDisplayString(node.hour), 1)
                  ]),
                  createBaseVNode("h3", _hoisted_52$1, [
                    _hoisted_53$1,
                    createTextVNode(" No. "),
                    createBaseVNode("a", {
                      href: "javascript:void(0);",
                      onClick: withModifiers(($event) => $options.openScanner(node.attach_path), ["stop"])
                    }, toDisplayString(node.document_number), 9, _hoisted_54$1),
                    createTextVNode(" por "),
                    createBaseVNode("strong", null, [
                      createBaseVNode("a", {
                        href: "mailto:" + node.cancel_by_email
                      }, toDisplayString(node.cancel_by_name), 9, _hoisted_55$1)
                    ])
                  ])
                ])
              ])) : createCommentVNode("", true),
              node.node_type == "confirm-entry" ? (openBlock(), createElementBlock("div", _hoisted_56$1, [
                _hoisted_57$1,
                createBaseVNode("div", _hoisted_58$1, [
                  createBaseVNode("span", _hoisted_59$1, [
                    _hoisted_60$1,
                    createTextVNode(" " + toDisplayString(node.hour), 1)
                  ]),
                  createBaseVNode("h3", _hoisted_61$1, [
                    _hoisted_62$1,
                    createTextVNode(" No. "),
                    createBaseVNode("a", {
                      href: "javascript:void(0);",
                      onClick: withModifiers(($event) => $options.openScanner(node.attach_path), ["stop"])
                    }, toDisplayString(node.document_number), 9, _hoisted_63$1),
                    createTextVNode(" por "),
                    createBaseVNode("strong", null, [
                      createBaseVNode("a", {
                        href: "mailto:" + node.confirm_by_email
                      }, toDisplayString(node.confirm_by_name), 9, _hoisted_64$1)
                    ])
                  ])
                ])
              ])) : createCommentVNode("", true),
              node.node_type == "attach-entry" ? (openBlock(), createElementBlock("div", _hoisted_65$1, [
                _hoisted_66$1,
                createBaseVNode("div", _hoisted_67$1, [
                  createBaseVNode("span", _hoisted_68$1, [
                    _hoisted_69$1,
                    createTextVNode(" " + toDisplayString(node.hour), 1)
                  ]),
                  createBaseVNode("h3", _hoisted_70$1, [
                    _hoisted_71$1,
                    createTextVNode(" a la Entrada "),
                    createBaseVNode("strong", null, toDisplayString(node.document_number), 1),
                    createTextVNode(" por "),
                    createBaseVNode("strong", null, [
                      createBaseVNode("a", {
                        href: "mailto:" + node.attach_by_email
                      }, toDisplayString(node.attach_by_name), 9, _hoisted_72$1)
                    ])
                  ]),
                  createBaseVNode("div", _hoisted_73$1, [
                    createBaseVNode("div", _hoisted_74$1, [
                      createBaseVNode("div", _hoisted_75$1, [
                        createBaseVNode("div", _hoisted_76$1, [
                          _hoisted_77$1,
                          _hoisted_78$1,
                          node.attach_path != "" && node.attach_path != null && node.attach_type == "pdf" ? (openBlock(), createElementBlock("a", {
                            key: 0,
                            href: "javascript:void(0);",
                            onClick: withModifiers(($event) => $options.openScanner(node.attach_path), ["stop"])
                          }, [
                            withDirectives(createBaseVNode("img", _hoisted_80$1, null, 512), [
                              [_directive_tooltip, "Click para abrir"]
                            ])
                          ], 8, _hoisted_79$1)) : node.attach_path != "" && node.attach_path != null && node.attach_type == "png" ? (openBlock(), createElementBlock("a", {
                            key: 1,
                            href: "javascript:void(0);",
                            onClick: withModifiers(($event) => $options.openScanner(node.attach_path), ["stop"])
                          }, [
                            withDirectives(createBaseVNode("img", _hoisted_82$1, null, 512), [
                              [_directive_tooltip, "Click para abrir"]
                            ])
                          ], 8, _hoisted_81$1)) : node.attach_path != "" && node.attach_path != null && (node.attach_type == "jpg" || node.attach_type == "jpeg") ? (openBlock(), createElementBlock("a", {
                            key: 2,
                            href: "javascript:void(0);",
                            onClick: withModifiers(($event) => $options.openScanner(node.attach_path), ["stop"])
                          }, [
                            withDirectives(createBaseVNode("img", _hoisted_84$1, null, 512), [
                              [_directive_tooltip, "Click para abrir"]
                            ])
                          ], 8, _hoisted_83$1)) : createCommentVNode("", true)
                        ])
                      ])
                    ])
                  ])
                ])
              ])) : createCommentVNode("", true),
              node.node_type == "product-add" ? (openBlock(), createElementBlock("div", _hoisted_85$1, [
                _hoisted_86$1,
                createBaseVNode("div", _hoisted_87$1, [
                  createBaseVNode("span", _hoisted_88$1, [
                    _hoisted_89$1,
                    createTextVNode(" " + toDisplayString(node.hour), 1)
                  ]),
                  node.attach_path != null && node.attach_path != "" ? (openBlock(), createElementBlock("h3", _hoisted_90$1, [
                    _hoisted_91$1,
                    createTextVNode(" en la Entrada "),
                    createBaseVNode("a", {
                      href: "javascript:void(0);",
                      onClick: withModifiers(($event) => $options.openScanner(node.attach_path), ["stop"])
                    }, toDisplayString(node.document_number), 9, _hoisted_92$1),
                    createTextVNode(" por "),
                    createBaseVNode("strong", null, [
                      createBaseVNode("a", {
                        href: "mailto:" + node.created_by_email
                      }, toDisplayString(node.created_by_name), 9, _hoisted_93$1)
                    ])
                  ])) : (openBlock(), createElementBlock("h3", _hoisted_94$1, [
                    _hoisted_95$1,
                    createTextVNode(" en la Entrada "),
                    createBaseVNode("a", {
                      href: "javascript:void(0);",
                      onClick: withModifiers(($event) => $options.docPdf(node.id), ["stop"])
                    }, toDisplayString(node.document_number), 9, _hoisted_96$1),
                    createTextVNode(" por "),
                    createBaseVNode("strong", null, [
                      createBaseVNode("a", {
                        href: "mailto:" + node.created_by_email
                      }, toDisplayString(node.created_by_name), 9, _hoisted_97$1)
                    ])
                  ])),
                  createBaseVNode("div", _hoisted_98$1, [
                    createBaseVNode("div", _hoisted_99$1, [
                      createBaseVNode("div", _hoisted_100$1, [
                        createBaseVNode("div", _hoisted_101$1, [
                          _hoisted_102$1,
                          createBaseVNode("h6", _hoisted_103$1, [
                            createBaseVNode("strong", null, toDisplayString(node.origin), 1)
                          ])
                        ]),
                        createBaseVNode("div", _hoisted_104$1, [
                          _hoisted_105$1,
                          createBaseVNode("h6", _hoisted_106$1, [
                            createBaseVNode("strong", null, toDisplayString(node.oc), 1)
                          ])
                        ]),
                        createBaseVNode("div", _hoisted_107$1, [
                          _hoisted_108$1,
                          _hoisted_109$1,
                          createBaseVNode("h6", _hoisted_110$1, [
                            createBaseVNode("strong", null, toDisplayString(node.um), 1)
                          ])
                        ])
                      ]),
                      createBaseVNode("div", _hoisted_111$1, [
                        createBaseVNode("div", _hoisted_112$1, [
                          _hoisted_113$1,
                          createBaseVNode("h6", _hoisted_114$1, [
                            createBaseVNode("strong", null, toDisplayString(node.warehouse_name), 1)
                          ])
                        ]),
                        createBaseVNode("div", _hoisted_115$1, [
                          _hoisted_116$1,
                          createBaseVNode("h6", _hoisted_117$1, [
                            createBaseVNode("strong", null, toDisplayString(node.warehouse_owner), 1)
                          ])
                        ]),
                        createBaseVNode("div", _hoisted_118$1, [
                          _hoisted_119$1,
                          _hoisted_120$1,
                          createBaseVNode("h6", _hoisted_121$1, [
                            createBaseVNode("strong", null, toDisplayString(node.received_quantity), 1)
                          ])
                        ])
                      ])
                    ])
                  ])
                ])
              ])) : createCommentVNode("", true)
            ], 64);
          }), 128))
        ], 64);
      }), 128)),
      _hoisted_122$1
    ], 2)) : createCommentVNode("", true)
  ], 64);
}
const Timeline = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1]]);
const _sfc_main = {
  data: function() {
    return {
      pole_name: "",
      project_name: "",
      tabactive: 1,
      store_products: [],
      products: [],
      products_filter: {},
      products_loading: true,
      lastproducts: [],
      lastproducts_empty: false,
      store_history: {},
      history: {},
      history_filter: {},
      history_loading: true,
      history_empty: false,
      history_description: "",
      history_product: {},
      history_product_loading: true,
      history_product_empty: false,
      period: "today",
      filter_apply: false,
      lastproducts_loading: true,
      session: JSON.parse(sessionStorage.getItem("semtinel")),
      pole: localStorage.getItem("stnel_logist_pole"),
      project: localStorage.getItem("stnel_logist_project"),
      warehouses: localStorage.getItem("stnel_warehouses").length > 0 ? JSON.parse(localStorage.getItem("stnel_warehouses")) : "",
      products_categories: JSON.parse(localStorage.getItem("semtinel_products_categories")),
      filter_productcategory: "all",
      filter_warehouse: "all",
      filter_oc: "",
      filter_product: "",
      item_details: {
        pole: "",
        project: "",
        oc: "",
        product_code: "",
        description: "",
        um: "",
        quantity: 0,
        warehouse_id: "-",
        warehouse_name: "",
        warehouse_owner: 0,
        stowage_card: ""
      },
      productcart: {
        id: 0,
        oc: "",
        desc: "",
        um: "",
        quantity: "",
        price_unit: "",
        price_total: "",
        warehouse: "",
        stowage_card: ""
      },
      productcart_form_loading: false,
      productcart_quantity: 1,
      productcart_warehouse: "",
      productcart_form_okbtn_text: "Aceptar",
      productcart_warehouse_error: "",
      show_details: false,
      cart_error: "",
      datatable_language: {
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
    };
  },
  watch: {
    period: function(val) {
      this.getLastProductsTable(val);
      this.getHistoryTimeline(val);
    },
    tabactive: function(val) {
      let cmp = this;
      if (val == 1) {
        if ($("#datatable-products").DataTable().destroy()) {
          setTimeout(() => {
            $("#datatable-products").DataTable({
              lengthMenu: [
                [10, 15, 25, 50, -1],
                [10, 15, 25, 50, "Todos"]
              ],
              pageLength: 10,
              order: [[0, "asc"]],
              "columnDefs": [{
                "targets": "no-sort",
                "orderable": false,
                "order": []
              }],
              "columns": [
                { "width": "12%" },
                { "width": "12%" },
                null,
                { "width": "10%" },
                { "width": "10%" },
                { "width": "10%" },
                { "width": "10%" },
                { "width": "10%" }
              ],
              language: cmp.datatable_language
            });
          });
        }
      }
    }
  },
  components: {
    "page-header": PageHeader,
    "timeline": Timeline
  },
  created() {
    let cmp = this;
    cmp.session.poles.map(function(value, key) {
      if (value.abbr == cmp.pole)
        cmp.pole_name = value.name;
    });
    cmp.session.projects.map(function(value, key) {
      if (value.id == cmp.project)
        cmp.project_name = value.name;
    });
  },
  methods: {
    listReload: function() {
    },
    addCart: function(idx, product) {
      let cmp = this;
      cmp.cart_error = "";
      cmp.productcart_warehouse_error = false;
      if (cmp.$root.cart_quantity == 0) {
        cmp.$root.cart_warehouse = "";
      }
      if (cmp.$root.cart_warehouse != "") {
        if (cmp.$root.cart_warehouse != product.warehouse_id) {
          cmp.productcart_warehouse_error = true;
          cmp.$refs.addCartClose.click();
          return;
        }
      }
      cmp.productcart = {
        id: product.id,
        oc: product.oc,
        id_inventory: idx,
        product_code: product.product_code,
        description: product.description,
        um: product.um,
        quantity: 1,
        available: product.available,
        price_unit: parseFloat(product.price_unit).toFixed(2),
        price_total: 1 * parseFloat(product.price_unit).toFixed(2),
        stowage_card: product.stowage_card
      };
      cmp.productcart_quantity = 1;
      cmp.productcart_warehouse = product.warehouse_id;
    },
    processAddCart: function() {
      let cmp = this, exists = false, total;
      if (cmp.productcart_quantity > cmp.productcart.available) {
        cmp.cart_error = "La cantidad solicitada no puede exceder a la disponible.";
        return;
      }
      cmp.$root.cart_items.map(function(product, idx) {
        if (product.id == cmp.productcart.id) {
          cmp.$root.cart_items[idx].quantity = cmp.productcart_quantity;
          total = cmp.productcart_quantity * parseFloat(cmp.$root.cart_items[idx].price_unit).toFixed(2);
          total = parseFloat(total).toFixed(2);
          cmp.$root.cart_items[idx].price_total = total;
          exists = true;
        }
      });
      cmp.productcart.quantity = cmp.productcart_quantity;
      cmp.productcart.price_total = cmp.productcart_quantity * parseFloat(cmp.productcart.price_unit).toFixed(2);
      cmp.productcart.price_total = parseFloat(cmp.productcart.price_total).toFixed(2);
      if (!exists) {
        cmp.$root.cart_items.push(cmp.productcart);
        cmp.$root.cart_quantity++;
      }
      if (cmp.$root.cart_warehouse == "") {
        cmp.$root.cart_warehouse = cmp.productcart_warehouse;
      }
      cmp.$refs.addCartClose.click();
    },
    filterApply: function() {
      let cmp = this;
      cmp.products_loading = true;
      cmp.products = cmp.store_products;
      cmp.history = cmp.store_history;
      cmp.filter_apply = false;
      cmp.products_filter = {}, cmp.history_filter = {}, cmp.history_loading = true;
      Object.keys(cmp.products).forEach((key) => {
        let idx = key, valid = true;
        if (cmp.filter_productcategory != "all" && cmp.products[key].category_name != cmp.filter_productcategory) {
          valid = false;
        }
        if (cmp.filter_warehouse != "all" && cmp.products[key].warehouse_id != cmp.filter_warehouse) {
          valid = false;
        }
        if (cmp.filter_oc != "" && cmp.filter_oc.length > 0 && cmp.products[key].oc != cmp.filter_oc) {
          valid = false;
        }
        if (cmp.filter_product != "" && cmp.filter_product.length > 0 && cmp.products[key].product_code != cmp.filter_product) {
          valid = false;
        }
        if (valid) {
          cmp.products_filter[idx] = cmp.products[key];
        }
      });
      if (Object.keys(cmp.products).length != Object.keys(cmp.products_filter).length) {
        cmp.products = cmp.products_filter;
        cmp.filter_apply = true;
      }
      if ($("#datatable-products").DataTable().destroy()) {
        setTimeout(() => {
          $("#datatable-products").DataTable({
            lengthMenu: [
              [10, 15, 25, 50, -1],
              [10, 15, 25, 50, "Todos"]
            ],
            pageLength: 10,
            order: [[0, "asc"]],
            "columnDefs": [{
              "targets": "no-sort",
              "orderable": false,
              "order": []
            }],
            "columns": [
              { "width": "12%" },
              { "width": "12%" },
              null,
              { "width": "10%" },
              { "width": "10%" },
              { "width": "10%" },
              { "width": "10%" },
              { "width": "10%" }
            ],
            language: cmp.datatable_language
          });
        });
      }
      cmp.products_loading = false;
    },
    filterClear: function() {
      let cmp = this;
      cmp.products_loading = true;
      cmp.filter_productcategory = "all";
      cmp.filter_warehouse = "all";
      cmp.filter_oc = "";
      cmp.filter_product = "";
      cmp.products = cmp.store_products;
      cmp.filter_apply = false;
      if ($("#datatable-products").DataTable().destroy()) {
        setTimeout(() => {
          $("#datatable-products").DataTable({
            lengthMenu: [
              [10, 15, 25, 50, -1],
              [10, 15, 25, 50, "Todos"]
            ],
            pageLength: 10,
            order: [[0, "asc"]],
            "columnDefs": [{
              "targets": "no-sort",
              "orderable": false,
              "order": []
            }],
            "columns": [
              { "width": "12%" },
              { "width": "12%" },
              null,
              { "width": "10%" },
              { "width": "10%" },
              { "width": "10%" },
              { "width": "10%" },
              { "width": "10%" }
            ],
            language: cmp.datatable_language
          });
        });
      }
      cmp.products_loading = false;
    },
    show: function(idx) {
      let cmp = this;
      cmp.item_details = {
        pole: cmp.products[idx].pole,
        project: cmp.products[idx].project,
        oc: cmp.products[idx].oc,
        product_code: cmp.products[idx].product_code,
        description: cmp.products[idx].description,
        um: cmp.products[idx].um,
        quantity: cmp.products[idx].quantity,
        warehouse_name: cmp.products[idx].warehouse_name,
        warehouse_owner: cmp.products[idx].warehouse_owner,
        stowage_card: cmp.products[idx].stowage_card
      };
      cmp.show_details = true;
    },
    productHistory: function(oc, description) {
      let cmp = this, period = cmp.period;
      cmp.history_description = description;
      if (cmp.tabactive == 1) {
        period = "all";
      }
      this.getProductHistoryTimeline(oc, description, period);
    },
    async getLastProductsTable(period = "today") {
      let cmp = this;
      cmp.lastproducts_loading = true;
      let headers = {
        "User-Agent": "testing/1.0",
        "Accept": "application/json",
        "Authorization": "Bearer " + cmp.session.access_token
      };
      axios.post("http://localhost/semtinel/public/api/logistics/inventory/lastproducts", {
        "pole": cmp.pole,
        "project": cmp.project,
        "period": cmp.period
      }, {
        headers
      }).then(function(response) {
        if (response.data.success) {
          cmp.lastproducts = response.data.products;
          cmp.lastproducts_loading = false;
          cmp.lastproducts_empty = Object.keys(response.data.products).length > 0 ? false : true;
        } else {
          toastr.error("Error al intentar cargar los datos.");
        }
      }).catch(function(error) {
        toastr.error("Error al intentar cargar los datos.");
        return;
      });
    },
    async getHistoryTimeline(period = "today") {
      let cmp = this;
      cmp.history_loading = true;
      let headers = {
        "User-Agent": "testing/1.0",
        "Accept": "application/json",
        "Authorization": "Bearer " + cmp.session.access_token
      };
      axios.post("http://localhost/semtinel/public/api/logistics/inventory/history", {
        "pole": cmp.pole,
        "project": cmp.project,
        "period": cmp.period,
        "description": ""
      }, {
        headers
      }).then(function(response) {
        if (response.data.success) {
          cmp.store_history = response.data.history;
          cmp.history = response.data.history;
          cmp.history_loading = false;
          cmp.history_empty = Object.keys(response.data.history).length > 0 ? false : true;
        } else {
          toastr.error("Error al intentar cargar los datos.");
        }
      }).catch(function(error) {
        toastr.error("Error al intentar cargar los datos.");
        return;
      });
    },
    async getProductHistoryTimeline(oc, description, period) {
      let cmp = this;
      cmp.history_product_loading = true;
      let headers = {
        "User-Agent": "testing/1.0",
        "Accept": "application/json",
        "Authorization": "Bearer " + cmp.session.access_token
      };
      axios.post("http://localhost/semtinel/public/api/logistics/inventory/history/" + oc, {
        "pole": cmp.pole,
        "project": cmp.project,
        "period": period,
        "description": description
      }, {
        headers
      }).then(function(response) {
        if (response.data.success) {
          cmp.history_product = response.data.history;
          cmp.history_product_loading = false;
          cmp.history_product_empty = Object.keys(response.data.history).length > 0 ? false : true;
        } else {
          toastr.error("Error al intentar cargar los datos.");
        }
      }).catch(function(error) {
        toastr.error("Error al intentar cargar los datos.");
        return;
      });
    }
  },
  mounted() {
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
    axios.post("http://localhost/semtinel/public/api/logistics/inventory/products", {
      "pole": cmp.pole,
      "project": cmp.project
    }, {
      headers
    }).then(function(response) {
      if (response.data.success) {
        cmp.store_products = response.data.products;
        cmp.products = response.data.products;
        cmp.products_loading = false;
        setTimeout(() => {
          $("#datatable-products").DataTable({
            retrieve: true,
            lengthMenu: [
              [10, 15, 25, 50, -1],
              [10, 15, 25, 50, "Todos"]
            ],
            pageLength: 10,
            order: [[0, "asc"]],
            "columnDefs": [{
              "targets": "no-sort",
              "orderable": false,
              "order": []
            }],
            "columns": [
              { "width": "12%" },
              { "width": "12%" },
              null,
              { "width": "10%" },
              { "width": "10%" },
              { "width": "10%" },
              { "width": "10%" },
              { "width": "10%" }
            ],
            language: cmp.datatable_language
          });
        });
      } else {
        toastr.error("Error al intentar cargar los datos.");
      }
    }).catch(function(error) {
      toastr.error("Error al intentar cargar los datos.");
      return;
    });
    axios.post("http://localhost/semtinel/public/api/logistics/inventory/lastproducts", {
      "pole": cmp.pole,
      "project": cmp.project,
      "period": cmp.period
    }, {
      headers
    }).then(function(response) {
      if (response.data.success) {
        cmp.store_lastproducts = response.data.products;
        cmp.lastproducts = response.data.products;
        cmp.lastproducts_loading = false;
        cmp.lastproducts_empty = Object.keys(response.data.products).length > 0 ? false : true;
      } else {
        toastr.error("Error al intentar cargar los datos.");
      }
    }).catch(function(error) {
      toastr.error("Error al intentar cargar los datos.");
      return;
    });
    axios.post("http://localhost/semtinel/public/api/logistics/inventory/history", {
      "pole": cmp.pole,
      "project": cmp.project,
      "period": cmp.period,
      "description": ""
    }, {
      headers
    }).then(function(response) {
      if (response.data.success) {
        cmp.history = response.data.history;
        cmp.history_loading = false;
        cmp.history_empty = Object.keys(response.data.history).length > 0 ? false : true;
      } else {
        toastr.error("Error al intentar cargar los datos.");
      }
    }).catch(function(error) {
      toastr.error("Error al intentar cargar los datos.");
      return;
    });
  }
};
const _hoisted_1 = {
  key: 0,
  class: "card card-default filters-panel"
};
const _hoisted_2 = { class: "card-header" };
const _hoisted_3 = { class: "card-title" };
const _hoisted_4 = { key: 0 };
const _hoisted_5 = /* @__PURE__ */ createBaseVNode("i", null, "Filtro aplicado", -1);
const _hoisted_6 = { class: "card-tools" };
const _hoisted_7 = {
  type: "button",
  class: "btn btn-tool",
  "data-card-widget": "collapse"
};
const _hoisted_8 = /* @__PURE__ */ createBaseVNode("i", { class: "fas fa-minus" }, null, -1);
const _hoisted_9 = [
  _hoisted_8
];
const _hoisted_10 = { class: "card-body" };
const _hoisted_11 = { class: "row" };
const _hoisted_12 = { class: "col-md-3" };
const _hoisted_13 = { class: "form-group" };
const _hoisted_14 = /* @__PURE__ */ createBaseVNode("label", { for: "filter_category" }, "Categor\xEDa", -1);
const _hoisted_15 = /* @__PURE__ */ createBaseVNode("option", { value: "all" }, "- Todas -", -1);
const _hoisted_16 = ["value"];
const _hoisted_17 = { class: "col-md-3" };
const _hoisted_18 = { class: "form-group" };
const _hoisted_19 = /* @__PURE__ */ createBaseVNode("label", { for: "filter_warehouse" }, "Pa\xF1ol", -1);
const _hoisted_20 = /* @__PURE__ */ createBaseVNode("option", { value: "all" }, "- Todos -", -1);
const _hoisted_21 = ["value"];
const _hoisted_22 = { class: "col-md-3" };
const _hoisted_23 = { class: "form-group" };
const _hoisted_24 = /* @__PURE__ */ createBaseVNode("label", { for: "filter_oc" }, "Orden Compra", -1);
const _hoisted_25 = { class: "col-md-3" };
const _hoisted_26 = { class: "form-group" };
const _hoisted_27 = /* @__PURE__ */ createBaseVNode("label", { for: "filter_product" }, "C\xF3digo Producto", -1);
const _hoisted_28 = { class: "card" };
const _hoisted_29 = { class: "card-header p-2" };
const _hoisted_30 = { class: "nav nav-pills float-start" };
const _hoisted_31 = { class: "nav-item" };
const _hoisted_32 = { class: "nav-item" };
const _hoisted_33 = { class: "nav-item" };
const _hoisted_34 = {
  key: 0,
  class: "inventory-period float-end pr-1"
};
const _hoisted_35 = /* @__PURE__ */ createBaseVNode("label", {
  for: "inventory_period",
  class: "float-left pt-2 text-right",
  style: { "width": "auto" }
}, "Mostrando:", -1);
const _hoisted_36 = /* @__PURE__ */ createBaseVNode("option", { value: "today" }, "Hoy", -1);
const _hoisted_37 = /* @__PURE__ */ createBaseVNode("option", { value: "currentweek" }, "Esta semana", -1);
const _hoisted_38 = /* @__PURE__ */ createBaseVNode("option", { value: "currentmonth" }, "Este mes", -1);
const _hoisted_39 = /* @__PURE__ */ createBaseVNode("option", { value: "currentyear" }, "Este a\xF1o", -1);
const _hoisted_40 = [
  _hoisted_36,
  _hoisted_37,
  _hoisted_38,
  _hoisted_39
];
const _hoisted_41 = { class: "card-body" };
const _hoisted_42 = { class: "tab-content" };
const _hoisted_43 = {
  class: "tab-pane active",
  id: "products"
};
const _hoisted_44 = /* @__PURE__ */ createBaseVNode("div", { class: "col-12 text-center py-5 loading-table" }, [
  /* @__PURE__ */ createBaseVNode("span", { class: "mdi mdi-loading mdi-spin mdi-36px" }, "\xA0Cargando productos...")
], -1);
const _hoisted_45 = [
  _hoisted_44
];
const _hoisted_46 = /* @__PURE__ */ createBaseVNode("thead", null, [
  /* @__PURE__ */ createBaseVNode("tr", null, [
    /* @__PURE__ */ createBaseVNode("th", { width: "12%" }, "Pa\xF1ol"),
    /* @__PURE__ */ createBaseVNode("th", { width: "12%" }, "Orden Compra"),
    /* @__PURE__ */ createBaseVNode("th", null, "Descripci\xF3n"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "10%",
      class: "text-center"
    }, "UM"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "10%",
      class: "text-center"
    }, "Existencia"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "10%",
      class: "text-center"
    }, "Reservado"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "10%",
      class: "text-center"
    }, "Disponible"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "10%",
      class: "text-right no-sort"
    })
  ])
], -1);
const _hoisted_47 = ["onClick"];
const _hoisted_48 = { class: "text-center" };
const _hoisted_49 = { class: "text-center" };
const _hoisted_50 = { class: "text-center" };
const _hoisted_51 = { class: "text-center" };
const _hoisted_52 = { class: "text-right" };
const _hoisted_53 = ["onClick"];
const _hoisted_54 = /* @__PURE__ */ createBaseVNode("span", { class: "mdi mdi-timeline-clock mdi-18px text-green" }, null, -1);
const _hoisted_55 = [
  _hoisted_54
];
const _hoisted_56 = ["onClick"];
const _hoisted_57 = /* @__PURE__ */ createBaseVNode("span", { class: "mdi mdi-cart mdi-18px text-orange" }, null, -1);
const _hoisted_58 = [
  _hoisted_57
];
const _hoisted_59 = {
  key: 1,
  class: "px-2"
};
const _hoisted_60 = {
  key: 0,
  class: "tab-pane",
  id: "timeline"
};
const _hoisted_61 = {
  key: 1,
  class: "tab-pane",
  id: "lastentries"
};
const _hoisted_62 = /* @__PURE__ */ createBaseVNode("div", { class: "col-12 text-center py-5 loading-table" }, [
  /* @__PURE__ */ createBaseVNode("span", { class: "mdi mdi-loading mdi-spin mdi-36px" }, "\xA0Cargando productos...")
], -1);
const _hoisted_63 = [
  _hoisted_62
];
const _hoisted_64 = /* @__PURE__ */ createBaseVNode("div", { class: "col-12 text-center empty-table" }, [
  /* @__PURE__ */ createBaseVNode("h6", null, "Ning\xFAn Producto encontrado")
], -1);
const _hoisted_65 = [
  _hoisted_64
];
const _hoisted_66 = /* @__PURE__ */ createBaseVNode("thead", null, [
  /* @__PURE__ */ createBaseVNode("tr", null, [
    /* @__PURE__ */ createBaseVNode("th", { width: "12%" }, "Orden Compra"),
    /* @__PURE__ */ createBaseVNode("th", { width: "12%" }, "C\xF3digo"),
    /* @__PURE__ */ createBaseVNode("th", null, "Descripci\xF3n"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "10%",
      class: "text-center"
    }, "UM"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "10%",
      class: "text-center"
    }, "Existencia"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "10%",
      class: "text-center"
    }, "Reservado"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "10%",
      class: "text-center"
    }, "Disponible"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "10%",
      class: "text-right no-sort"
    })
  ])
], -1);
const _hoisted_67 = ["onClick"];
const _hoisted_68 = { class: "text-center" };
const _hoisted_69 = { class: "text-center" };
const _hoisted_70 = { class: "text-center" };
const _hoisted_71 = { class: "text-center" };
const _hoisted_72 = { class: "text-right" };
const _hoisted_73 = ["onClick"];
const _hoisted_74 = /* @__PURE__ */ createBaseVNode("span", { class: "mdi mdi-timeline-clock mdi-18px text-green" }, null, -1);
const _hoisted_75 = [
  _hoisted_74
];
const _hoisted_76 = ["onClick"];
const _hoisted_77 = /* @__PURE__ */ createBaseVNode("span", { class: "mdi mdi-cart mdi-18px text-orange" }, null, -1);
const _hoisted_78 = [
  _hoisted_77
];
const _hoisted_79 = {
  key: 1,
  class: "px-2"
};
const _hoisted_80 = {
  class: "modal fade",
  id: "modal-item-details",
  "aria-hidden": "true",
  role: "dialog",
  "data-backdrop": "static",
  "data-keyboard": "false"
};
const _hoisted_81 = { class: "modal-dialog" };
const _hoisted_82 = { class: "modal-content" };
const _hoisted_83 = { class: "modal-header header-info" };
const _hoisted_84 = /* @__PURE__ */ createBaseVNode("h4", { class: "modal-title" }, "Detalles Producto", -1);
const _hoisted_85 = {
  type: "button",
  ref: "Close",
  class: "close",
  "data-dismiss": "modal",
  "aria-label": "Close"
};
const _hoisted_86 = /* @__PURE__ */ createBaseVNode("span", { "aria-hidden": "true" }, "\xD7", -1);
const _hoisted_87 = [
  _hoisted_86
];
const _hoisted_88 = { class: "modal-body px-4 rounded-bottom" };
const _hoisted_89 = { class: "row py-1" };
const _hoisted_90 = { class: "col-md-12" };
const _hoisted_91 = /* @__PURE__ */ createBaseVNode("span", { class: "detail-title" }, "Polo", -1);
const _hoisted_92 = { class: "detail-desc" };
const _hoisted_93 = { class: "row py-1" };
const _hoisted_94 = { class: "col-md-12" };
const _hoisted_95 = /* @__PURE__ */ createBaseVNode("span", { class: "detail-title" }, "Proyecto", -1);
const _hoisted_96 = { class: "detail-desc" };
const _hoisted_97 = { class: "row py-1" };
const _hoisted_98 = { class: "col-md-12" };
const _hoisted_99 = /* @__PURE__ */ createBaseVNode("span", { class: "detail-title" }, "C\xF3digo del Producto", -1);
const _hoisted_100 = { class: "detail-desc" };
const _hoisted_101 = { class: "row py-1" };
const _hoisted_102 = { class: "col-md-12" };
const _hoisted_103 = /* @__PURE__ */ createBaseVNode("span", { class: "detail-title" }, "Orden de Compra", -1);
const _hoisted_104 = { class: "detail-desc" };
const _hoisted_105 = { class: "row py-1" };
const _hoisted_106 = { class: "col-md-12" };
const _hoisted_107 = /* @__PURE__ */ createBaseVNode("span", { class: "detail-title" }, "Descripci\xF3n del Item", -1);
const _hoisted_108 = { class: "detail-desc" };
const _hoisted_109 = { class: "row py-1 mt-2" };
const _hoisted_110 = { class: "col-md-4" };
const _hoisted_111 = /* @__PURE__ */ createBaseVNode("div", { class: "text-center" }, [
  /* @__PURE__ */ createBaseVNode("span", { class: "detail-title" }, "UM")
], -1);
const _hoisted_112 = { class: "detail-desc text-center" };
const _hoisted_113 = { class: "col-md-4" };
const _hoisted_114 = /* @__PURE__ */ createBaseVNode("div", { class: "text-center" }, [
  /* @__PURE__ */ createBaseVNode("span", { class: "detail-title" }, "Cantidad")
], -1);
const _hoisted_115 = { class: "detail-desc text-center" };
const _hoisted_116 = { class: "col-md-4" };
const _hoisted_117 = /* @__PURE__ */ createBaseVNode("div", { class: "text-center" }, [
  /* @__PURE__ */ createBaseVNode("span", { class: "detail-title" }, "Tarjeta Estiba")
], -1);
const _hoisted_118 = { class: "detail-desc text-center" };
const _hoisted_119 = { class: "row py-1" };
const _hoisted_120 = { class: "col-md-6" };
const _hoisted_121 = /* @__PURE__ */ createBaseVNode("div", { class: "text-center" }, [
  /* @__PURE__ */ createBaseVNode("span", { class: "detail-title" }, "Pa\xF1ol")
], -1);
const _hoisted_122 = { class: "detail-desc text-center" };
const _hoisted_123 = { class: "col-md-6" };
const _hoisted_124 = /* @__PURE__ */ createBaseVNode("div", { class: "text-center" }, [
  /* @__PURE__ */ createBaseVNode("span", { class: "detail-title" }, "Responsable")
], -1);
const _hoisted_125 = { class: "detail-desc text-center" };
const _hoisted_126 = {
  class: "modal fade",
  id: "modal-item-history"
};
const _hoisted_127 = { class: "modal-dialog modal-lg" };
const _hoisted_128 = { class: "modal-content" };
const _hoisted_129 = { class: "modal-header header-info" };
const _hoisted_130 = /* @__PURE__ */ createBaseVNode("h4", { class: "modal-title" }, "Historial de Producto", -1);
const _hoisted_131 = {
  type: "button",
  ref: "Close",
  class: "close",
  "data-dismiss": "modal",
  "aria-label": "Close"
};
const _hoisted_132 = /* @__PURE__ */ createBaseVNode("span", { "aria-hidden": "true" }, "\xD7", -1);
const _hoisted_133 = [
  _hoisted_132
];
const _hoisted_134 = { class: "modal-body px-4 rounded-bottom" };
const _hoisted_135 = { class: "row py-1" };
const _hoisted_136 = { class: "col-12" };
const _hoisted_137 = {
  class: "modal fade",
  id: "modal-item-addcart"
};
const _hoisted_138 = { class: "modal-dialog" };
const _hoisted_139 = { class: "modal-content" };
const _hoisted_140 = { class: "modal-header header-green" };
const _hoisted_141 = /* @__PURE__ */ createBaseVNode("h4", { class: "modal-title" }, "Agregar Producto al carrito", -1);
const _hoisted_142 = {
  type: "button",
  ref: "addCartClose",
  class: "close",
  "data-dismiss": "modal",
  "aria-label": "Close"
};
const _hoisted_143 = /* @__PURE__ */ createBaseVNode("span", { "aria-hidden": "true" }, "\xD7", -1);
const _hoisted_144 = [
  _hoisted_143
];
const _hoisted_145 = { class: "modal-body px-4 rounded-bottom pb-2" };
const _hoisted_146 = {
  key: 0,
  class: "row pt-2 pb-4"
};
const _hoisted_147 = /* @__PURE__ */ createBaseVNode("div", {
  class: "float-start text-danger",
  style: { "width": "70px" }
}, [
  /* @__PURE__ */ createBaseVNode("i", { class: "mdi mdi-alert-circle mdi-48px" })
], -1);
const _hoisted_148 = /* @__PURE__ */ createBaseVNode("div", {
  class: "float-start form_error pt-3",
  style: { "width": "85%" }
}, [
  /* @__PURE__ */ createTextVNode("No puede seleccionar un Producto de otro Pa\xF1ol."),
  /* @__PURE__ */ createBaseVNode("br"),
  /* @__PURE__ */ createTextVNode("Por favor, revise los productos de su carrito.")
], -1);
const _hoisted_149 = [
  _hoisted_147,
  _hoisted_148
];
const _hoisted_150 = {
  key: 1,
  class: "row py-1"
};
const _hoisted_151 = { class: "col-12 pb-2" };
const _hoisted_152 = /* @__PURE__ */ createBaseVNode("span", { class: "detail-title" }, "Descripci\xF3n", -1);
const _hoisted_153 = { class: "detail-desc" };
const _hoisted_154 = {
  key: 2,
  class: "row"
};
const _hoisted_155 = { class: "col-md-4" };
const _hoisted_156 = { class: "form-group" };
const _hoisted_157 = /* @__PURE__ */ createBaseVNode("label", {
  for: "productcart_um",
  class: "detail-title mb-1"
}, "UM:", -1);
const _hoisted_158 = { class: "col-md-4" };
const _hoisted_159 = { class: "form-group" };
const _hoisted_160 = /* @__PURE__ */ createBaseVNode("label", {
  for: "productcart_quantity",
  class: "detail-title mb-1"
}, "Cantidad:", -1);
const _hoisted_161 = { class: "col-md-4 text-right" };
const _hoisted_162 = ["disabled"];
const _hoisted_163 = {
  key: 0,
  class: "mdi mdi-check-all"
};
const _hoisted_164 = {
  key: 1,
  class: "mdi mdi-loading mdi-spin"
};
const _hoisted_165 = {
  key: 3,
  class: "row py-2"
};
const _hoisted_166 = { class: "col-12 text-center" };
const _hoisted_167 = { class: "form_error" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_page_header = resolveComponent("page-header");
  const _component_timeline = resolveComponent("timeline");
  const _directive_tooltip = resolveDirective("tooltip");
  return openBlock(), createElementBlock(Fragment, null, [
    createVNode(_component_page_header, {
      pagetitle: "Inventario de productos en Pa\xF1oles",
      breadcrumbs: false,
      pole_project: true,
      pole: _ctx.pole_name,
      project: _ctx.project_name
    }, null, 8, ["pole", "project"]),
    _ctx.tabactive == 1 ? (openBlock(), createElementBlock("div", _hoisted_1, [
      createBaseVNode("div", _hoisted_2, [
        createBaseVNode("h3", _hoisted_3, [
          createBaseVNode("i", {
            class: normalizeClass(["fas fa-filter", _ctx.filter_apply ? "text-danger" : ""])
          }, null, 2),
          createTextVNode("\xA0Filtros "),
          _ctx.filter_apply ? (openBlock(), createElementBlock("small", _hoisted_4, [
            createTextVNode("("),
            _hoisted_5,
            createTextVNode(")")
          ])) : createCommentVNode("", true)
        ]),
        createBaseVNode("div", _hoisted_6, [
          withDirectives((openBlock(), createElementBlock("button", {
            type: "button",
            class: "btn btn-tool",
            onClick: _cache[0] || (_cache[0] = ($event) => $options.filterApply())
          }, [
            createTextVNode(" Aplicar Filtros ")
          ])), [
            [_directive_tooltip, "Click para aplicar los filtros a la tabla"]
          ]),
          withDirectives((openBlock(), createElementBlock("button", {
            type: "button",
            class: "btn btn-tool",
            onClick: _cache[1] || (_cache[1] = ($event) => $options.filterClear())
          }, [
            createTextVNode(" Limpiar Filtros ")
          ])), [
            [_directive_tooltip, "Click para quitar los filtros aplicados a la tabla"]
          ]),
          withDirectives((openBlock(), createElementBlock("button", _hoisted_7, _hoisted_9)), [
            [_directive_tooltip, "Contraer/Expandir"]
          ])
        ])
      ]),
      createBaseVNode("div", _hoisted_10, [
        createBaseVNode("div", _hoisted_11, [
          createBaseVNode("div", _hoisted_12, [
            createBaseVNode("div", _hoisted_13, [
              _hoisted_14,
              withDirectives(createBaseVNode("select", {
                class: "form-control",
                id: "filter_category",
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => _ctx.filter_productcategory = $event)
              }, [
                _hoisted_15,
                (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.products_categories, (option, index) => {
                  return openBlock(), createElementBlock("option", {
                    key: index,
                    value: index
                  }, toDisplayString(option), 9, _hoisted_16);
                }), 128))
              ], 512), [
                [vModelSelect, _ctx.filter_productcategory]
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_17, [
            createBaseVNode("div", _hoisted_18, [
              _hoisted_19,
              withDirectives(createBaseVNode("select", {
                id: "filter_warehouse",
                size: "1",
                class: "form-control",
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => _ctx.filter_warehouse = $event)
              }, [
                _hoisted_20,
                (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.warehouses, (option, index) => {
                  return openBlock(), createElementBlock("option", {
                    key: index,
                    value: option["id"]
                  }, toDisplayString(option["name"]), 9, _hoisted_21);
                }), 128))
              ], 512), [
                [vModelSelect, _ctx.filter_warehouse]
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_22, [
            createBaseVNode("div", _hoisted_23, [
              _hoisted_24,
              withDirectives(createBaseVNode("input", {
                type: "text",
                class: "form-control",
                id: "filter_oc",
                placeholder: "Orden de compra",
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => _ctx.filter_oc = $event)
              }, null, 512), [
                [vModelText, _ctx.filter_oc]
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_25, [
            createBaseVNode("div", _hoisted_26, [
              _hoisted_27,
              withDirectives(createBaseVNode("input", {
                type: "text",
                class: "form-control",
                id: "filter_product",
                placeholder: "C\xF3digo de producto",
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => _ctx.filter_product = $event)
              }, null, 512), [
                [vModelText, _ctx.filter_product]
              ])
            ])
          ])
        ])
      ])
    ])) : createCommentVNode("", true),
    createBaseVNode("div", _hoisted_28, [
      createBaseVNode("div", _hoisted_29, [
        createBaseVNode("ul", _hoisted_30, [
          createBaseVNode("li", _hoisted_31, [
            createBaseVNode("a", {
              class: "nav-link active",
              href: "#products",
              "data-toggle": "tab",
              onClick: _cache[6] || (_cache[6] = ($event) => _ctx.tabactive = 1)
            }, "Productos")
          ]),
          createBaseVNode("li", _hoisted_32, [
            createBaseVNode("a", {
              class: "nav-link",
              href: "#timeline",
              "data-toggle": "tab",
              onClick: _cache[7] || (_cache[7] = ($event) => _ctx.tabactive = 2)
            }, "Historial")
          ]),
          createBaseVNode("li", _hoisted_33, [
            createBaseVNode("a", {
              class: "nav-link",
              href: "#lastentries",
              "data-toggle": "tab",
              onClick: _cache[8] || (_cache[8] = ($event) => _ctx.tabactive = 3)
            }, "\xDAltimas entradas")
          ])
        ]),
        _ctx.tabactive == 2 || _ctx.tabactive == 3 ? (openBlock(), createElementBlock("div", _hoisted_34, [
          _hoisted_35,
          withDirectives(createBaseVNode("select", {
            name: "inventory_period",
            id: "inventory_period",
            class: "form-control float-end",
            style: { "width": "auto" },
            "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => _ctx.period = $event)
          }, _hoisted_40, 512), [
            [vModelSelect, _ctx.period]
          ])
        ])) : createCommentVNode("", true)
      ]),
      createBaseVNode("div", _hoisted_41, [
        createBaseVNode("div", _hoisted_42, [
          createBaseVNode("div", _hoisted_43, [
            createBaseVNode("div", {
              class: normalizeClass(["row", !_ctx.products_loading ? "hidden" : ""])
            }, _hoisted_45, 2),
            createBaseVNode("table", {
              id: "datatable-products",
              class: normalizeClass(["table table-striped w-100", _ctx.products_loading ? "hidden" : ""])
            }, [
              _hoisted_46,
              createBaseVNode("tbody", null, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.products, (item, idx) => {
                  return openBlock(), createElementBlock("tr", {
                    key: item.id
                  }, [
                    createBaseVNode("td", null, toDisplayString(item.warehouse_name), 1),
                    createBaseVNode("td", null, toDisplayString(item.oc), 1),
                    createBaseVNode("td", null, [
                      withDirectives((openBlock(), createElementBlock("a", {
                        class: "show-lnk",
                        href: "javascript:void(0);",
                        "data-toggle": "modal",
                        "data-target": "#modal-item-details",
                        onClick: ($event) => $options.show(idx)
                      }, [
                        createTextVNode(toDisplayString(item.description), 1)
                      ], 8, _hoisted_47)), [
                        [_directive_tooltip, "Click para Mostrar Detalles de este producto"]
                      ])
                    ]),
                    createBaseVNode("td", _hoisted_48, toDisplayString(item.um), 1),
                    createBaseVNode("td", _hoisted_49, toDisplayString(item.quantity), 1),
                    createBaseVNode("td", _hoisted_50, toDisplayString(item.reserved), 1),
                    createBaseVNode("td", _hoisted_51, toDisplayString(item.available), 1),
                    createBaseVNode("td", _hoisted_52, [
                      withDirectives((openBlock(), createElementBlock("a", {
                        href: "javascript:void(0);",
                        class: "btn-semti-tool",
                        style: { "padding": "4px 5px" },
                        "data-toggle": "modal",
                        "data-target": "#modal-item-history",
                        onClick: ($event) => $options.productHistory(item.oc, item.description)
                      }, _hoisted_55, 8, _hoisted_53)), [
                        [_directive_tooltip, "Historial de este producto"]
                      ]),
                      createTextVNode(" \xA0 "),
                      item.warehouse_id in _ctx.session.warehouses ? withDirectives((openBlock(), createElementBlock("a", {
                        key: 0,
                        href: "javascript:void(0);",
                        class: "btn-semti-tool",
                        style: { "padding": "4px 5px" },
                        "data-toggle": "modal",
                        "data-target": "#modal-item-addcart",
                        onClick: ($event) => $options.addCart(idx, item)
                      }, _hoisted_58, 8, _hoisted_56)), [
                        [_directive_tooltip, "Agregar al carrito"]
                      ]) : (openBlock(), createElementBlock("span", _hoisted_59, "\xA0\xA0\xA0"))
                    ])
                  ]);
                }), 128))
              ])
            ], 2)
          ]),
          _ctx.tabactive == 2 ? (openBlock(), createElementBlock("div", _hoisted_60, [
            createVNode(_component_timeline, {
              history: _ctx.history,
              history_loading: _ctx.history_loading,
              history_empty: _ctx.history_empty
            }, null, 8, ["history", "history_loading", "history_empty"])
          ])) : createCommentVNode("", true),
          _ctx.tabactive == 3 ? (openBlock(), createElementBlock("div", _hoisted_61, [
            createBaseVNode("div", {
              class: normalizeClass(["row", !_ctx.lastproducts_loading ? "hidden" : ""])
            }, _hoisted_63, 2),
            createBaseVNode("div", {
              class: normalizeClass(["row mt-3", _ctx.lastproducts_empty && !_ctx.lastproducts_loading ? "" : "hidden"])
            }, _hoisted_65, 2),
            createBaseVNode("table", {
              class: normalizeClass(["table table-striped table-responsive", _ctx.lastproducts_loading || _ctx.lastproducts_empty ? "hidden" : ""])
            }, [
              _hoisted_66,
              createBaseVNode("tbody", null, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.lastproducts, (item, idx) => {
                  return openBlock(), createElementBlock("tr", {
                    key: item.id
                  }, [
                    createBaseVNode("td", null, toDisplayString(item.oc), 1),
                    createBaseVNode("td", null, toDisplayString(item.product_code), 1),
                    createBaseVNode("td", null, [
                      withDirectives((openBlock(), createElementBlock("a", {
                        class: "show-lnk",
                        href: "javascript:void(0);",
                        "data-toggle": "modal",
                        "data-target": "#modal-item-details",
                        onClick: ($event) => $options.show(idx)
                      }, [
                        createTextVNode(toDisplayString(item.description), 1)
                      ], 8, _hoisted_67)), [
                        [_directive_tooltip, "Click para Mostrar Detalles de este producto"]
                      ])
                    ]),
                    createBaseVNode("td", _hoisted_68, toDisplayString(item.um), 1),
                    createBaseVNode("td", _hoisted_69, toDisplayString(item.quantity), 1),
                    createBaseVNode("td", _hoisted_70, toDisplayString(item.reserved), 1),
                    createBaseVNode("td", _hoisted_71, toDisplayString(item.available), 1),
                    createBaseVNode("td", _hoisted_72, [
                      withDirectives((openBlock(), createElementBlock("a", {
                        href: "javascript:void(0);",
                        class: "btn-semti-tool",
                        style: { "padding": "4px 5px" },
                        "data-toggle": "modal",
                        "data-target": "#modal-item-history",
                        onClick: ($event) => $options.productHistory(item.oc, item.description)
                      }, _hoisted_75, 8, _hoisted_73)), [
                        [_directive_tooltip, "Historial de este producto"]
                      ]),
                      createTextVNode(" \xA0 "),
                      item.warehouse_id in _ctx.session.warehouses ? withDirectives((openBlock(), createElementBlock("a", {
                        key: 0,
                        href: "javascript:void(0);",
                        class: "btn-semti-tool",
                        style: { "padding": "4px 5px" },
                        "data-toggle": "modal",
                        "data-target": "#modal-item-addcart",
                        onClick: ($event) => $options.addCart(idx, item)
                      }, _hoisted_78, 8, _hoisted_76)), [
                        [_directive_tooltip, "Agregar al carrito"]
                      ]) : (openBlock(), createElementBlock("span", _hoisted_79, "\xA0\xA0\xA0"))
                    ])
                  ]);
                }), 128))
              ])
            ], 2)
          ])) : createCommentVNode("", true)
        ])
      ])
    ]),
    createBaseVNode("div", _hoisted_80, [
      createBaseVNode("div", _hoisted_81, [
        createBaseVNode("div", _hoisted_82, [
          createBaseVNode("div", _hoisted_83, [
            _hoisted_84,
            createBaseVNode("button", _hoisted_85, _hoisted_87, 512)
          ]),
          createBaseVNode("div", _hoisted_88, [
            createBaseVNode("div", _hoisted_89, [
              createBaseVNode("div", _hoisted_90, [
                _hoisted_91,
                createBaseVNode("h6", _hoisted_92, toDisplayString(_ctx.item_details.pole.name), 1)
              ])
            ]),
            createBaseVNode("div", _hoisted_93, [
              createBaseVNode("div", _hoisted_94, [
                _hoisted_95,
                createBaseVNode("h6", _hoisted_96, toDisplayString(_ctx.item_details.project.name), 1)
              ])
            ]),
            createBaseVNode("div", _hoisted_97, [
              createBaseVNode("div", _hoisted_98, [
                _hoisted_99,
                createBaseVNode("h6", _hoisted_100, toDisplayString(_ctx.item_details.product_code), 1)
              ])
            ]),
            createBaseVNode("div", _hoisted_101, [
              createBaseVNode("div", _hoisted_102, [
                _hoisted_103,
                createBaseVNode("h6", _hoisted_104, toDisplayString(_ctx.item_details.oc), 1)
              ])
            ]),
            createBaseVNode("div", _hoisted_105, [
              createBaseVNode("div", _hoisted_106, [
                _hoisted_107,
                createBaseVNode("h6", _hoisted_108, toDisplayString(_ctx.item_details.description), 1)
              ])
            ]),
            createBaseVNode("div", _hoisted_109, [
              createBaseVNode("div", _hoisted_110, [
                _hoisted_111,
                createBaseVNode("h6", _hoisted_112, toDisplayString(_ctx.item_details.um), 1)
              ]),
              createBaseVNode("div", _hoisted_113, [
                _hoisted_114,
                createBaseVNode("h6", _hoisted_115, toDisplayString(_ctx.item_details.quantity), 1)
              ]),
              createBaseVNode("div", _hoisted_116, [
                _hoisted_117,
                createBaseVNode("h6", _hoisted_118, toDisplayString(_ctx.item_details.stowage_card), 1)
              ])
            ]),
            createBaseVNode("div", _hoisted_119, [
              createBaseVNode("div", _hoisted_120, [
                _hoisted_121,
                createBaseVNode("h6", _hoisted_122, toDisplayString(_ctx.item_details.warehouse_name), 1)
              ]),
              createBaseVNode("div", _hoisted_123, [
                _hoisted_124,
                createBaseVNode("h6", _hoisted_125, toDisplayString(_ctx.item_details.warehouse_owner), 1)
              ])
            ])
          ])
        ])
      ])
    ]),
    createBaseVNode("div", _hoisted_126, [
      createBaseVNode("div", _hoisted_127, [
        createBaseVNode("div", _hoisted_128, [
          createBaseVNode("div", _hoisted_129, [
            _hoisted_130,
            createBaseVNode("button", _hoisted_131, _hoisted_133, 512)
          ]),
          createBaseVNode("div", _hoisted_134, [
            createBaseVNode("div", _hoisted_135, [
              createBaseVNode("div", _hoisted_136, [
                createVNode(_component_timeline, {
                  description: _ctx.history_description,
                  history: _ctx.history_product,
                  history_loading: _ctx.history_product_loading,
                  history_empty: _ctx.history_product_empty
                }, null, 8, ["description", "history", "history_loading", "history_empty"])
              ])
            ])
          ])
        ])
      ])
    ]),
    createBaseVNode("div", _hoisted_137, [
      createBaseVNode("div", _hoisted_138, [
        createBaseVNode("div", _hoisted_139, [
          createBaseVNode("div", _hoisted_140, [
            _hoisted_141,
            createBaseVNode("button", _hoisted_142, _hoisted_144, 512)
          ]),
          createBaseVNode("div", _hoisted_145, [
            _ctx.productcart_warehouse_error ? (openBlock(), createElementBlock("div", _hoisted_146, _hoisted_149)) : createCommentVNode("", true),
            !_ctx.productcart_warehouse_error ? (openBlock(), createElementBlock("div", _hoisted_150, [
              createBaseVNode("div", _hoisted_151, [
                _hoisted_152,
                createBaseVNode("h6", _hoisted_153, toDisplayString(_ctx.productcart.description), 1)
              ])
            ])) : createCommentVNode("", true),
            !_ctx.productcart_warehouse_error ? (openBlock(), createElementBlock("div", _hoisted_154, [
              createBaseVNode("div", _hoisted_155, [
                createBaseVNode("div", _hoisted_156, [
                  _hoisted_157,
                  withDirectives(createBaseVNode("input", {
                    type: "text",
                    class: "form-control",
                    id: "productcart_um",
                    name: "productcart_um",
                    disabled: "true",
                    "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => _ctx.productcart.um = $event)
                  }, null, 512), [
                    [vModelText, _ctx.productcart.um]
                  ])
                ])
              ]),
              createBaseVNode("div", _hoisted_158, [
                createBaseVNode("div", _hoisted_159, [
                  _hoisted_160,
                  withDirectives(createBaseVNode("input", {
                    type: "number",
                    class: normalizeClass(["form-control", _ctx.cart_error != "" ? "border-error" : ""]),
                    id: "productcart_quantity",
                    name: "productcart_quantity",
                    step: ".01",
                    min: "1",
                    "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => _ctx.productcart_quantity = $event),
                    onKeyup: _cache[12] || (_cache[12] = withKeys(($event) => $options.processAddCart(), ["enter"]))
                  }, null, 34), [
                    [vModelText, _ctx.productcart_quantity]
                  ])
                ])
              ]),
              createBaseVNode("div", _hoisted_161, [
                createBaseVNode("button", {
                  type: "button",
                  class: "btn btn-primary btn-green ripple",
                  style: { "margin-top": "28px" },
                  disabled: _ctx.productcart_form_loading,
                  onClick: _cache[13] || (_cache[13] = withModifiers(($event) => $options.processAddCart(), ["stop"]))
                }, [
                  !_ctx.productcart_form_loading ? (openBlock(), createElementBlock("i", _hoisted_163)) : (openBlock(), createElementBlock("i", _hoisted_164)),
                  createTextVNode(" " + toDisplayString(_ctx.productcart_form_okbtn_text), 1)
                ], 8, _hoisted_162)
              ])
            ])) : createCommentVNode("", true),
            _ctx.cart_error != "" && !_ctx.productcart_warehouse_error ? (openBlock(), createElementBlock("div", _hoisted_165, [
              createBaseVNode("div", _hoisted_166, [
                createBaseVNode("h6", _hoisted_167, toDisplayString(_ctx.cart_error), 1)
              ])
            ])) : createCommentVNode("", true)
          ])
        ])
      ])
    ])
  ], 64);
}
const InventoryComponent = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  InventoryComponent as default
};
