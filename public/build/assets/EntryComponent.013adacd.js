import { o as openBlock, b as createElementBlock, q as createVNode, i as createBaseVNode, F as Fragment, K as renderList, N as withModifiers, v as toDisplayString, j as createCommentVNode, f as normalizeClass, L as withDirectives, P as vModelText, l as withKeys, J as createTextVNode, Q as vModelSelect, R as vModelRadio, m as withCtx, I as createStaticVNode, h as resolveComponent, M as resolveDirective } from "./vue.esm-bundler.4c64d56b.js";
import { _ as _export_sfc, P as PageHeader } from "./app.18088dbe.js";
import { $ } from "./jquery.55a3af33.js";
import "./jquery.dataTables.min.cf006e4f.js";
const _sfc_main = {
  data: function() {
    return {
      pole: localStorage.getItem("stnel_logist_pole"),
      pole_name: "",
      project: localStorage.getItem("stnel_logist_project"),
      project_name: "",
      projects: [],
      warehouses: [],
      items: [],
      items_selected: 0,
      items_loading: true,
      search_loading: false,
      show_items: false,
      btnsearch: "Cargar Renglones",
      table_oc: false,
      show_details: false,
      stowage_card_loading: false,
      origin_data: {
        origin: "Despacho de Almac\xE9n",
        doctype_title: "Tipo de Documento",
        doctype_value: "Orden de Despacho",
        docnum_title: "Orden de Despacho (\xFAltimos 5 d\xEDgitos)",
        docnum_value: "",
        ocnumber: "",
        origin_field_options: [
          "Despacho de Almac\xE9n",
          "Tiro Directo Altec",
          "Tiro Directo Almest",
          "Tiro Directo Compras Locales"
        ],
        doctype_field_options: [
          "Orden de Despacho",
          "Conduce",
          "Vale de Salida"
        ],
        error: {
          docnum: "",
          ocnumber: ""
        }
      },
      origin_warehouse: "",
      origin_warehouse_owner: "",
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
      destiny_data: {
        pole: this.pole,
        project: this.project,
        warehouse: "",
        warehouse_name: "",
        warehouse_owner: "",
        comment: ""
      },
      item_form_data: {
        idx: "",
        number: "",
        received_quantity: "",
        stowage_card: "",
        has_stowage_card: false,
        warehouse: "",
        warehouse_name: "",
        warehouse_owner: "",
        comment: "",
        product_quantity: ""
      },
      item_form_error: {
        received_quantity: false,
        stowage_card: false,
        error_text: ""
      },
      item_form_loading: false,
      item_form_okbtn_text: "Aceptar",
      session: JSON.parse(sessionStorage.getItem("semtinel")),
      entry_error: "",
      entry_status: "parcial",
      entry_loading: false,
      entry_okbtn_text: "Aceptar"
    };
  },
  watch: {
    btnsearch: function(val) {
      if (val == "Loading")
        this.search_loading = true;
      else
        this.search_loading = false;
    },
    entry_loading: function(val) {
      if (val)
        this.entry_okbtn_text = "Procesando...";
      else
        this.entry_okbtn_text = "Aceptar";
    }
  },
  components: {
    "page-header": PageHeader
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
    changeOrigin: function(origin) {
      this.show_items = false;
      this.show_details = false;
      this.origin_data.origin = origin;
      this.origin_data.error.docnum = "";
      this.origin_data.error.ocnumber = "";
      if (origin != "Despacho de Almac\xE9n") {
        this.origin_data.doctype_title = "Orden de Compra";
        this.origin_data.doctype_value = "";
        this.origin_data.docnum_title = "Documento";
        this.origin_data.docnum_value = "";
        this.origin_data.ocnumber = "";
        this.table_oc = true;
      } else {
        this.origin_data.doctype_title = "Tipo de Documento";
        this.origin_data.doctype_value = "Orden de Despacho";
        this.origin_data.docnum_title = "Orden de Despacho (\xFAltimos 5 d\xEDgitos)";
        this.origin_data.docnum_value = "";
        this.origin_data.ocnumber = "";
        this.table_oc = false;
      }
    },
    changeDoctype: function(doctype) {
      this.show_items = false;
      this.show_details = false;
      this.origin_data.doctype_value = doctype;
      this.origin_data.error.docnum = "";
      this.origin_data.error.ocnumber = "";
      if (doctype == "Orden de Despacho") {
        this.origin_data.docnum_title = "Orden de Despacho (\xFAltimos 5 d\xEDgitos)";
        this.table_oc = false;
      } else if (doctype == "Vale de Salida") {
        this.origin_data.docnum_title = "Vale de Salida";
        this.table_oc = false;
      } else {
        this.origin_data.docnum_title = "Conduce";
        this.table_oc = true;
      }
    },
    changePole: function(pole_id, pole_abbr) {
      let cmp = this, projects = [], warehouses = [];
      cmp.destiny_data.pole = pole_abbr;
      cmp.session.projects.map(function(value, key) {
        if (value.id_pole == pole_id)
          projects.push(value);
      });
      cmp.projects = projects;
      cmp.destiny_data.project = projects.length > 0 ? projects[0]["id"] : "";
      cmp.destiny_data.warehouse = "";
      if (cmp.destiny_data.project != "") {
        let object_warehouses = cmp.session.warehouses;
        for (let key in object_warehouses) {
          if (object_warehouses[key].id_project == cmp.destiny_data.project)
            warehouses.push({
              id: key,
              id_project: object_warehouses[key].id_project,
              name: object_warehouses[key].name,
              owner: object_warehouses[key].owner
            });
        }
      }
      cmp.warehouses = warehouses;
      cmp.destiny_data.warehouse = warehouses.length > 0 ? warehouses[0]["id"] : "";
      cmp.destiny_data.warehouse_name = warehouses.length > 0 ? warehouses[0]["name"] : "";
      cmp.destiny_data.warehouse_owner = warehouses.length > 0 ? warehouses[0]["owner"] : "";
    },
    changeProject: function(project_id) {
      let cmp = this, warehouses = [];
      cmp.destiny_data.project = project_id;
      cmp.destiny_data.warehouse = "";
      let object_warehouses = cmp.session.warehouses;
      for (let key in object_warehouses) {
        if (object_warehouses[key].id_project == project_id)
          warehouses.push({
            id: key,
            id_project: object_warehouses[key].id_project,
            name: object_warehouses[key].name,
            owner: object_warehouses[key].owner
          });
      }
      cmp.warehouses = warehouses;
      cmp.destiny_data.warehouse = warehouses.length > 0 ? warehouses[0]["id"] : "";
      cmp.destiny_data.warehouse_name = warehouses.length > 0 ? warehouses[0]["name"] : "";
      cmp.destiny_data.warehouse_owner = warehouses.length > 0 ? warehouses[0]["owner"] : "";
    },
    changeWarehouse: function(warehouse_id, warehouse_name, warehouse_owner) {
      let cmp = this;
      cmp.destiny_data.warehouse = warehouse_id;
      cmp.destiny_data.warehouse_name = warehouse_name;
      cmp.destiny_data.warehouse_owner = warehouse_owner;
    },
    changeWarehouseOrigin: function(warehouse_id) {
      let cmp = this;
      cmp.origin_warehouse = warehouse_id;
    },
    itemsSelected: function() {
      let selected = 0;
      this.items.map(function(item, key) {
        if (item.received_quantity > 0)
          selected++;
      });
      return selected;
    },
    updateStatus: function() {
      let items_completed = 0, status;
      this.items.map(function(item, key) {
        if (parseFloat(item.received_quantity) == parseFloat(item.product_quantity))
          items_completed++;
      });
      status = this.items.length == items_completed ? "total" : "parcial";
      return status;
    },
    show: function(idx) {
      let cmp = this;
      if (cmp.table_oc) {
        cmp.item_details = {
          cod_product: cmp.items[idx].cod_product,
          oc: cmp.items[idx].oc,
          generic_descript: cmp.items[idx].generic_descript,
          item_description: cmp.items[idx].item_description,
          um: cmp.items[idx].um,
          received_quantity: cmp.items[idx].received_quantity,
          stowage_card: cmp.items[idx].stowage_card,
          price_unit: cmp.items[idx].price_unit,
          price_total: cmp.items[idx].price_total,
          comment: cmp.items[idx].comment
        };
      } else {
        cmp.item_details = {
          cod_product: cmp.items[idx].cod_product,
          oc: cmp.items[idx].oc,
          docnum: cmp.items[idx].docnum,
          item_description: cmp.items[idx].item_description,
          um: cmp.items[idx].um,
          product_quantity: cmp.items[idx].product_quantity,
          received_quantity: cmp.items[idx].received_quantity,
          stowage_card: cmp.items[idx].stowage_card,
          price_unit: cmp.items[idx].price_unit,
          price_total: cmp.items[idx].price_total,
          comment: cmp.items[idx].comment
        };
      }
      cmp.show_details = true;
    },
    edit: function(idx, oc, item_description, received_quantity, stowage_card, comment, product_quantity = null) {
      let cmp = this;
      cmp.form_error = "";
      cmp.item_form_data.idx = idx;
      cmp.item_form_data.number = idx + 1;
      cmp.item_form_data.received_quantity = received_quantity;
      cmp.item_form_error.error_text = "";
      cmp.item_form_error.received_quantity = false;
      cmp.item_form_error.stowage_card = false;
      cmp.item_form_data.comment = comment;
      if (product_quantity != null) {
        cmp.item_form_data.product_quantity = product_quantity;
      }
      if (stowage_card != "-" && stowage_card != "") {
        cmp.item_form_data.stowage_card = stowage_card;
      } else {
        cmp.item_form_data.stowage_card = "";
        cmp.stowage_card_loading = true;
        let headers = {
          "User-Agent": "testing/1.0",
          "Accept": "application/json",
          "Authorization": "Bearer " + cmp.session.access_token
        };
        axios.post("http://localhost/semtinel/public/api/logistics/entry/item/stowage_card", {
          "oc": oc,
          "item_desciption": item_description
        }, {
          headers
        }).then(function(response) {
          if (response.data.success) {
            cmp.item_form_data.stowage_card = response.data.stowage_card;
            if (response.data.stowage_card != "") {
              cmp.item_form_data.has_stowage_card = true;
            } else {
              cmp.item_form_data.has_stowage_card = false;
            }
            if (response.data.warehouse != "") {
              cmp.item_form_data.warehouse = response.data.warehouse;
              cmp.item_form_data.warehouse_name = response.data.warehouse_name, cmp.item_form_data.warehouse_owner = response.data.warehouse_owner;
            }
            cmp.stowage_card_loading = false;
          } else {
            cmp.item_form_data.stowage_card = "";
            cmp.stowage_card_loading = false;
            toastr.error("Error al intentar cargar la tarjeta de estiba.");
          }
        }).catch(function(error) {
          cmp.item_form_data.stowage_card = "";
          cmp.stowage_card_loading = false;
          toastr.error("Error al intentar cargar la tarjeta de estiba.");
          return;
        });
      }
    },
    updateItem: function() {
      let cmp = this, idx = cmp.item_form_data.idx, received_quantity = cmp.item_form_data.received_quantity, total_import = 0, stowage_card = cmp.item_form_data.stowage_card, warehouse = cmp.item_form_data.warehouse, warehouse_name = cmp.item_form_data.warehouse_name, warehouse_owner = cmp.item_form_data.warehouse_owner, comment = cmp.item_form_data.comment;
      cmp.item_form_error.error_text = "";
      cmp.item_form_error.received_quantity = false;
      cmp.item_form_error.stowage_card = false;
      if (stowage_card != "-" && stowage_card != "" && (received_quantity == 0 || isNaN(received_quantity))) {
        cmp.item_form_error.error_text = "Si asigna una tarjeta de estiba debe agregar una cantidad superior a cero";
        cmp.item_form_error.received_quantity = true;
        return;
      }
      if (cmp.item_form_data.product_quantity > 0 && cmp.item_form_data.product_quantity < received_quantity) {
        cmp.item_form_error.error_text = "La cantidad recibida no debe ecceder a la cantidad despachada";
        cmp.item_form_error.received_quantity = true;
        return;
      }
      if ((stowage_card == "-" || stowage_card == "") && received_quantity > 0) {
        cmp.item_form_error.error_text = "Si registra una cantidad recibida debe asignar una tarjeta de estiba de destino";
        cmp.item_form_error.stowage_card = true;
        return;
      }
      if (warehouse != "") {
        cmp.items.map(function(item, key) {
          if (item.warehouse != "" && item.warehouse != warehouse) {
            cmp.item_form_error.error_text = "Los productos que reciba deben ser del mismo Pa\xF1ol";
            return;
          }
        });
        cmp.destiny_data.warehouse = warehouse;
        cmp.destiny_data.warehouse_name = warehouse_name;
        cmp.destiny_data.warehouse_owner = warehouse_owner;
      }
      if (stowage_card != "-" && stowage_card != "") {
        cmp.items.map(function(item, key) {
          if (idx != key && item.stowage_card == stowage_card) {
            cmp.item_form_error.error_text = "Ya registr\xF3 otro rengl\xF3n en esa Tarjeta de Estiba";
            cmp.item_form_error.stowage_card = true;
          }
        });
        if (cmp.item_form_error.stowage_card)
          return;
      }
      if ((stowage_card == "-" || stowage_card == "") && (received_quantity == 0 || isNaN(received_quantity))) {
        received_quantity = 0;
        stowage_card = "-";
      }
      $("#item-" + (idx + 1) + "-received").html(received_quantity);
      $("#item-" + (idx + 1) + "-stowagecard").html(stowage_card);
      $("#item-" + (idx + 1) + "-comment").html(comment);
      cmp.items[idx]["received_quantity"] = received_quantity;
      cmp.items[idx]["stowage_card"] = stowage_card;
      cmp.items[idx]["warehouse"] = warehouse != "" ? warehouse : "";
      cmp.items[idx]["warehouse_name"] = warehouse_name != "" ? warehouse_name : "";
      cmp.items[idx]["warehouse_owner"] = warehouse_owner != "" ? warehouse_owner : "";
      cmp.items[idx]["comment"] = comment;
      if (received_quantity > 0) {
        total_import = received_quantity * cmp.items[idx]["price_unit"];
        total_import = parseFloat(total_import).toFixed(2);
        $("#item-" + (idx + 1) + "-pricetotal").html(total_import);
        cmp.items[idx]["price_total"] = total_import;
      } else {
        total_import = 0;
        $("#item-" + (idx + 1) + "-pricetotal").html(total_import);
        cmp.items[idx]["price_total"] = total_import;
      }
      cmp.items_selected = cmp.itemsSelected();
      cmp.entry_status = cmp.updateStatus();
      cmp.$refs.CloseEdit.click();
    },
    entryConfirm: function() {
      let cmp = this;
      cmp.entry_error = "";
      if (cmp.items_selected == 0) {
        cmp.entry_error = "No se ha registrado cantidad recibida en ning\xFAn rengl\xF3n. Por favor, actualice la tabla de renglones con los valores que haya recibido, y luego repita esta operaci\xF3n.";
        return;
      }
    },
    isValidOriginForm: function() {
      let isValid = true;
      this.origin_data.error.docnum = "";
      this.origin_data.error.ocnumber = "";
      if (this.origin_data.origin == "Despacho de Almac\xE9n" && this.origin_data.doctype_value != "Conduce") {
        if (this.origin_data.docnum_value == null || this.origin_data.docnum_value == "") {
          this.origin_data.error.docnum = "Este campo es obligatorio.";
          isValid = false;
        }
      } else {
        if (this.origin_data.ocnumber == null || this.origin_data.ocnumber == "") {
          this.origin_data.error.ocnumber = "Este campo es obligatorio.";
          isValid = false;
        }
        if (this.origin_data.docnum_value == null || this.origin_data.docnum_value == "") {
          this.origin_data.error.docnum = "Este campo es obligatorio.";
          isValid = false;
        }
      }
      return isValid;
    },
    async getEntryData() {
      let cmp = this;
      if (!cmp.isValidOriginForm()) {
        return;
      }
      cmp.btnsearch = "Loading";
      cmp.show_items = true;
      cmp.items_loading = true;
      cmp.items_selected = 0;
      let headers = {
        "User-Agent": "testing/1.0",
        "Accept": "application/json",
        "Authorization": "Bearer " + cmp.session.access_token
      };
      await axios.post("http://localhost/semtinel/public/api/logistics/entry/data", {
        "origin": cmp.origin_data.origin,
        "doctype": cmp.origin_data.doctype_value,
        "ocnumber": cmp.origin_data.ocnumber,
        "docnum": cmp.origin_data.docnum_value,
        "project": localStorage.getItem("stnel_logist_project")
      }, {
        headers
      }).then(function(response) {
        if (response.data.success) {
          cmp.items = response.data.items;
          cmp.btnsearch = "Cargar Renglones";
          cmp.items_loading = false;
        } else {
          cmp.btnsearch = "Cargar Renglones";
          toastr.error("Error al intentar realizar la operaci\xF3n.");
        }
      }).catch(function(error) {
        cmp.btnsearch = "Cargar Renglones";
        toastr.error("Error al intentar realizar la operaci\xF3n.");
        return;
      });
    },
    processEntry: function() {
      let cmp = this;
      if (cmp.entry_error != "") {
        cmp.$refs.ConfirmClose.click();
        return;
      }
      cmp.entry_loading = true;
      let headers = {
        "User-Agent": "testing/1.0",
        "Accept": "application/json",
        "Authorization": "Bearer " + cmp.session.access_token
      };
      axios.post("http://localhost/semtinel/public/api/logistics/entry", {
        "origin": cmp.origin_data,
        "items": cmp.items,
        "destin": cmp.destiny_data,
        "status": cmp.entry_status,
        "user": cmp.session.id
      }, {
        headers
      }).then(function(response) {
        if (response.data.success) {
          cmp.$refs.ConfirmClose.click();
          cmp.entry_loading = false;
          if (parseInt(response.data.entry) > 0) {
            window.open("http://localhost/semtinel/public/api/logistics/pdf/entry/" + response.data.entry, "_blank", "noreferrer");
          }
          cmp.$router.push("/semtinel/public/logistics/entries");
        } else {
          cmp.$refs.ConfirmClose.click();
          cmp.entry_loading = false;
          console.log(response.data.error);
          toastr.error("Error al intentar realizar la operaci\xF3n.");
        }
      }).catch(function(error) {
        cmp.$refs.ConfirmClose.click();
        cmp.entry_loading = false;
        console.log("ERROR");
        toastr.error("Error al intentar realizar la operaci\xF3n.");
        return;
      });
    }
  },
  mounted() {
    if (!JSON.parse(sessionStorage.getItem("semtinel")).access_token) {
      sessionStorage.clear();
      window.document.location.href = "http://localhost/semtinel/public/login";
    }
    this.destiny_data.pole = this.session.poles[0]["abbr"];
    this.changePole(this.session.poles[0]["id"], this.session.poles[0]["abbr"]);
  }
};
const _hoisted_1 = { class: "container-fluid px-0" };
const _hoisted_2 = { class: "card card-default" };
const _hoisted_3 = /* @__PURE__ */ createStaticVNode('<div class="card-header"><h3 class="card-title">Origen de la Mercanc\xEDa</h3><div class="card-tools"><button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button></div></div>', 1);
const _hoisted_4 = { class: "card-body" };
const _hoisted_5 = { class: "row" };
const _hoisted_6 = { class: "col-md-3 pl-md-3" };
const _hoisted_7 = { class: "form-group" };
const _hoisted_8 = /* @__PURE__ */ createBaseVNode("label", null, "Origen de la Mercanc\xEDa", -1);
const _hoisted_9 = ["disabled"];
const _hoisted_10 = ["value", "selected", "onClick"];
const _hoisted_11 = {
  key: 0,
  class: "col-md-3 pl-1"
};
const _hoisted_12 = { class: "form-group" };
const _hoisted_13 = ["disabled"];
const _hoisted_14 = ["value", "selected", "onClick"];
const _hoisted_15 = { class: "form-group" };
const _hoisted_16 = /* @__PURE__ */ createBaseVNode("label", null, "Orden de Compra", -1);
const _hoisted_17 = ["disabled"];
const _hoisted_18 = {
  key: 0,
  class: "info-container"
};
const _hoisted_19 = { class: "form_error text-sm" };
const _hoisted_20 = {
  key: 2,
  class: "col-md-3 pl-1"
};
const _hoisted_21 = { class: "form-group" };
const _hoisted_22 = /* @__PURE__ */ createBaseVNode("label", null, "Pa\xF1ol", -1);
const _hoisted_23 = {
  name: "origin",
  size: "1",
  class: "form-control"
};
const _hoisted_24 = ["value", "onClick"];
const _hoisted_25 = { class: "form-group" };
const _hoisted_26 = ["maxlength", "disabled"];
const _hoisted_27 = {
  key: 0,
  class: "info-container"
};
const _hoisted_28 = { class: "form_error text-sm" };
const _hoisted_29 = /* @__PURE__ */ createBaseVNode("span", { class: "mdi mdi-magnify" }, null, -1);
const _hoisted_30 = {
  key: 1,
  disabled: "",
  class: "btn btn-primary ripple",
  style: { "margin-top": "30px" }
};
const _hoisted_31 = /* @__PURE__ */ createBaseVNode("span", { class: "mdi mdi-loading mdi-spin" }, "\xA0\xA0Cargando...", -1);
const _hoisted_32 = [
  _hoisted_31
];
const _hoisted_33 = {
  key: 0,
  class: "card"
};
const _hoisted_34 = { class: "card-header" };
const _hoisted_35 = /* @__PURE__ */ createBaseVNode("h3", { class: "card-title float-left" }, "Renglones Solicitados", -1);
const _hoisted_36 = {
  class: "float-left ml-2 align-middle",
  style: { "margin-top": "2px", "font-size": "15px" }
};
const _hoisted_37 = /* @__PURE__ */ createBaseVNode("strong", null, "[", -1);
const _hoisted_38 = /* @__PURE__ */ createBaseVNode("strong", null, "]", -1);
const _hoisted_39 = /* @__PURE__ */ createBaseVNode("div", { class: "card-tools" }, [
  /* @__PURE__ */ createBaseVNode("button", {
    type: "button",
    class: "btn btn-tool",
    "data-card-widget": "collapse"
  }, [
    /* @__PURE__ */ createBaseVNode("i", { class: "fas fa-minus" })
  ])
], -1);
const _hoisted_40 = { class: "card-body pt-1 pb-2" };
const _hoisted_41 = /* @__PURE__ */ createBaseVNode("div", { class: "col-12 text-center py-5 loading-table" }, [
  /* @__PURE__ */ createBaseVNode("span", { class: "mdi mdi-loading mdi-spin mdi-36px" }, "\xA0Cargando renglones...")
], -1);
const _hoisted_42 = [
  _hoisted_41
];
const _hoisted_43 = { class: "col-12 table-responsive" };
const _hoisted_44 = { class: "table table-striped" };
const _hoisted_45 = /* @__PURE__ */ createBaseVNode("thead", null, [
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
      width: "200",
      class: "no-sort"
    }, "Comentario"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "60",
      class: "text-center no-sort"
    }, "Recibir")
  ])
], -1);
const _hoisted_46 = { class: "text-center" };
const _hoisted_47 = ["onClick"];
const _hoisted_48 = { class: "text-center" };
const _hoisted_49 = ["id"];
const _hoisted_50 = { class: "text-right" };
const _hoisted_51 = ["id"];
const _hoisted_52 = ["id"];
const _hoisted_53 = ["id"];
const _hoisted_54 = { class: "text-center" };
const _hoisted_55 = ["onClick"];
const _hoisted_56 = /* @__PURE__ */ createBaseVNode("span", { class: "mdi mdi-pencil mdi-18px text-green" }, null, -1);
const _hoisted_57 = [
  _hoisted_56
];
const _hoisted_58 = { class: "col-12" };
const _hoisted_59 = { class: "table table-striped" };
const _hoisted_60 = /* @__PURE__ */ createBaseVNode("thead", null, [
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
    }, "Ctdad Despachada"),
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
      width: "200",
      class: "no-sort"
    }, "Comentario"),
    /* @__PURE__ */ createBaseVNode("th", {
      width: "60",
      class: "text-center no-sort"
    }, "Recibir")
  ])
], -1);
const _hoisted_61 = { class: "text-center" };
const _hoisted_62 = ["onClick"];
const _hoisted_63 = { class: "text-center" };
const _hoisted_64 = { class: "text-center" };
const _hoisted_65 = ["id"];
const _hoisted_66 = { class: "text-right" };
const _hoisted_67 = ["id"];
const _hoisted_68 = ["id"];
const _hoisted_69 = ["id"];
const _hoisted_70 = { class: "text-center" };
const _hoisted_71 = ["onClick"];
const _hoisted_72 = /* @__PURE__ */ createBaseVNode("span", { class: "mdi mdi-pencil mdi-18px text-green" }, null, -1);
const _hoisted_73 = [
  _hoisted_72
];
const _hoisted_74 = {
  key: 1,
  class: "card card-default"
};
const _hoisted_75 = /* @__PURE__ */ createStaticVNode('<div class="card-header"><h3 class="card-title">Destino de la Mercanc\xEDa</h3><div class="card-tools"><button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button></div></div>', 1);
const _hoisted_76 = { class: "card-body" };
const _hoisted_77 = { class: "row" };
const _hoisted_78 = { class: "col-md-3 pl-md-3" };
const _hoisted_79 = { class: "form-group" };
const _hoisted_80 = /* @__PURE__ */ createBaseVNode("label", null, "Polo", -1);
const _hoisted_81 = { class: "col-md-3 pl-1" };
const _hoisted_82 = { class: "form-group" };
const _hoisted_83 = /* @__PURE__ */ createBaseVNode("label", null, "Proyecto", -1);
const _hoisted_84 = { class: "col-md-3 pl-1" };
const _hoisted_85 = { class: "form-group" };
const _hoisted_86 = /* @__PURE__ */ createBaseVNode("label", null, "Pa\xF1ol", -1);
const _hoisted_87 = ["value", "onClick"];
const _hoisted_88 = { class: "col-md-3 pl-1" };
const _hoisted_89 = { class: "form-group" };
const _hoisted_90 = /* @__PURE__ */ createBaseVNode("label", null, "Responsable de Pa\xF1ol", -1);
const _hoisted_91 = ["disabled"];
const _hoisted_92 = { class: "row" };
const _hoisted_93 = { class: "col-12" };
const _hoisted_94 = { class: "form-group" };
const _hoisted_95 = /* @__PURE__ */ createBaseVNode("label", null, "Comentario", -1);
const _hoisted_96 = {
  key: 0,
  class: "row"
};
const _hoisted_97 = { class: "form-group pt-2" };
const _hoisted_98 = /* @__PURE__ */ createBaseVNode("label", { class: "float-left mb-0 mt-1" }, "Indique si la Entrada es Total o Parcial: ", -1);
const _hoisted_99 = { class: "form-check float-left ml-4" };
const _hoisted_100 = /* @__PURE__ */ createBaseVNode("label", { class: "form-check-label" }, "Total", -1);
const _hoisted_101 = { class: "form-check float-left ml-4" };
const _hoisted_102 = /* @__PURE__ */ createBaseVNode("label", { class: "form-check-label" }, "Parcial", -1);
const _hoisted_103 = {
  class: "card-footer",
  style: { "background-color": "#DEF4DB", "border-top": "0" }
};
const _hoisted_104 = /* @__PURE__ */ createBaseVNode("i", { class: "mdi mdi-check-all" }, null, -1);
const _hoisted_105 = {
  class: "modal fade",
  id: "modal-item-form",
  "aria-hidden": "true",
  role: "dialog",
  "data-backdrop": "static",
  "data-keyboard": "false"
};
const _hoisted_106 = { class: "modal-dialog" };
const _hoisted_107 = { class: "modal-content" };
const _hoisted_108 = { class: "modal-header header-green" };
const _hoisted_109 = /* @__PURE__ */ createBaseVNode("h4", { class: "modal-title" }, "Completar rengl\xF3n recibido", -1);
const _hoisted_110 = {
  type: "button",
  ref: "CloseEdit",
  class: "close",
  "data-dismiss": "modal",
  "aria-label": "Close"
};
const _hoisted_111 = /* @__PURE__ */ createBaseVNode("span", { "aria-hidden": "true" }, "\xD7", -1);
const _hoisted_112 = [
  _hoisted_111
];
const _hoisted_113 = { class: "modal-body px-4" };
const _hoisted_114 = { class: "row py-3" };
const _hoisted_115 = { class: "col-md-12" };
const _hoisted_116 = { class: "text-green" };
const _hoisted_117 = { class: "row" };
const _hoisted_118 = { class: "col-md-12" };
const _hoisted_119 = { class: "form-group" };
const _hoisted_120 = /* @__PURE__ */ createBaseVNode("label", { for: "received_quantity" }, "Cantidad recibida:", -1);
const _hoisted_121 = { class: "row" };
const _hoisted_122 = { class: "col-md-12" };
const _hoisted_123 = { class: "form-group" };
const _hoisted_124 = /* @__PURE__ */ createBaseVNode("label", { for: "stowage_card" }, "Tarjeta de estiba destino:", -1);
const _hoisted_125 = ["disabled", "placeholder"];
const _hoisted_126 = { class: "row" };
const _hoisted_127 = { class: "col-md-12" };
const _hoisted_128 = { class: "form-group" };
const _hoisted_129 = /* @__PURE__ */ createBaseVNode("label", { for: "stowage_card" }, "Comentario:", -1);
const _hoisted_130 = {
  key: 0,
  class: "row pt-2"
};
const _hoisted_131 = { class: "col-12 text-center" };
const _hoisted_132 = { class: "form_error" };
const _hoisted_133 = { class: "modal-footer justify-content-between" };
const _hoisted_134 = /* @__PURE__ */ createBaseVNode("button", {
  type: "button",
  class: "btn btn-default ripple",
  "data-dismiss": "modal"
}, "Cancelar", -1);
const _hoisted_135 = ["disabled"];
const _hoisted_136 = {
  key: 0,
  class: "mdi mdi-check-all"
};
const _hoisted_137 = {
  key: 1,
  class: "mdi mdi-loading mdi-spin"
};
const _hoisted_138 = {
  class: "modal fade",
  id: "modal-item-details",
  "aria-hidden": "true",
  role: "dialog",
  "data-backdrop": "static",
  "data-keyboard": "false"
};
const _hoisted_139 = { class: "modal-dialog" };
const _hoisted_140 = { class: "modal-content" };
const _hoisted_141 = { class: "modal-header header-info" };
const _hoisted_142 = /* @__PURE__ */ createBaseVNode("h4", { class: "modal-title" }, "Detalles Producto", -1);
const _hoisted_143 = {
  type: "button",
  ref: "Close",
  class: "close",
  "data-dismiss": "modal",
  "aria-label": "Close"
};
const _hoisted_144 = /* @__PURE__ */ createBaseVNode("span", { "aria-hidden": "true" }, "\xD7", -1);
const _hoisted_145 = [
  _hoisted_144
];
const _hoisted_146 = { class: "modal-body px-4 rounded-bottom" };
const _hoisted_147 = { class: "row py-1" };
const _hoisted_148 = { class: "col-md-12" };
const _hoisted_149 = /* @__PURE__ */ createBaseVNode("span", { class: "detail-title" }, "C\xF3digo del Producto", -1);
const _hoisted_150 = { class: "detail-desc" };
const _hoisted_151 = { class: "row py-1" };
const _hoisted_152 = { class: "col-md-12" };
const _hoisted_153 = /* @__PURE__ */ createBaseVNode("span", { class: "detail-title" }, "Orden de Compra", -1);
const _hoisted_154 = { class: "detail-desc" };
const _hoisted_155 = {
  key: 0,
  class: "row py-1"
};
const _hoisted_156 = { class: "col-md-12" };
const _hoisted_157 = /* @__PURE__ */ createBaseVNode("span", { class: "detail-title" }, "Descripci\xF3n del Producto", -1);
const _hoisted_158 = { class: "detail-desc" };
const _hoisted_159 = {
  key: 1,
  class: "row py-1"
};
const _hoisted_160 = { class: "col-md-12" };
const _hoisted_161 = /* @__PURE__ */ createBaseVNode("span", { class: "detail-title" }, "Documento", -1);
const _hoisted_162 = { class: "detail-desc" };
const _hoisted_163 = { class: "row py-1" };
const _hoisted_164 = { class: "col-md-12" };
const _hoisted_165 = /* @__PURE__ */ createBaseVNode("span", { class: "detail-title" }, "Descripci\xF3n del Item", -1);
const _hoisted_166 = { class: "detail-desc" };
const _hoisted_167 = { class: "row py-1 mt-2" };
const _hoisted_168 = /* @__PURE__ */ createBaseVNode("div", { class: "text-center" }, [
  /* @__PURE__ */ createBaseVNode("span", { class: "detail-title" }, "UM")
], -1);
const _hoisted_169 = { class: "detail-desc text-center" };
const _hoisted_170 = /* @__PURE__ */ createBaseVNode("div", { class: "text-center" }, [
  /* @__PURE__ */ createBaseVNode("span", { class: "detail-title" }, "Ctdad Despachada")
], -1);
const _hoisted_171 = { class: "detail-desc text-center" };
const _hoisted_172 = /* @__PURE__ */ createBaseVNode("div", { class: "text-center" }, [
  /* @__PURE__ */ createBaseVNode("span", { class: "detail-title" }, "Ctdad Recibida")
], -1);
const _hoisted_173 = { class: "detail-desc text-center" };
const _hoisted_174 = { class: "row py-1" };
const _hoisted_175 = { class: "col-md-4" };
const _hoisted_176 = /* @__PURE__ */ createBaseVNode("div", { class: "text-center" }, [
  /* @__PURE__ */ createBaseVNode("span", { class: "detail-title" }, "Precio Unitario")
], -1);
const _hoisted_177 = { class: "detail-desc text-center" };
const _hoisted_178 = { class: "col-md-4" };
const _hoisted_179 = /* @__PURE__ */ createBaseVNode("div", { class: "text-center" }, [
  /* @__PURE__ */ createBaseVNode("span", { class: "detail-title" }, "Importe Total")
], -1);
const _hoisted_180 = { class: "detail-desc text-center" };
const _hoisted_181 = { class: "col-md-4" };
const _hoisted_182 = /* @__PURE__ */ createBaseVNode("div", { class: "text-center" }, [
  /* @__PURE__ */ createBaseVNode("span", { class: "detail-title" }, "Tarjeta de Estiba")
], -1);
const _hoisted_183 = { class: "detail-desc text-center" };
const _hoisted_184 = {
  key: 2,
  class: "row py-1"
};
const _hoisted_185 = { class: "col-md-12" };
const _hoisted_186 = /* @__PURE__ */ createBaseVNode("span", { class: "detail-title" }, "Comentario", -1);
const _hoisted_187 = { class: "detail-desc" };
const _hoisted_188 = {
  class: "modal fade",
  id: "modal-entry-confirm",
  "aria-hidden": "true",
  role: "dialog",
  "data-backdrop": "static",
  "data-keyboard": "false"
};
const _hoisted_189 = { class: "modal-dialog modal-lg" };
const _hoisted_190 = { class: "modal-content" };
const _hoisted_191 = { class: "modal-header" };
const _hoisted_192 = /* @__PURE__ */ createBaseVNode("h4", { class: "modal-title" }, "Nueva entrada de mercanc\xEDa en obra", -1);
const _hoisted_193 = {
  type: "button",
  ref: "ConfirmClose",
  class: "close",
  "data-dismiss": "modal",
  "aria-label": "Close"
};
const _hoisted_194 = /* @__PURE__ */ createBaseVNode("span", { "aria-hidden": "true" }, "\xD7", -1);
const _hoisted_195 = [
  _hoisted_194
];
const _hoisted_196 = { class: "modal-body px-4 pt-2 pb-4" };
const _hoisted_197 = { key: 0 };
const _hoisted_198 = /* @__PURE__ */ createBaseVNode("div", {
  class: "float-start",
  style: { "width": "70px" }
}, [
  /* @__PURE__ */ createBaseVNode("i", { class: "mdi mdi-chat-question mdi-48px" })
], -1);
const _hoisted_199 = {
  class: "float-start pt-3",
  style: { "width": "85%" }
};
const _hoisted_200 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_201 = {
  key: 1,
  class: "row pt-2"
};
const _hoisted_202 = /* @__PURE__ */ createBaseVNode("div", {
  class: "float-start text-danger",
  style: { "width": "70px" }
}, [
  /* @__PURE__ */ createBaseVNode("i", { class: "mdi mdi-alert-circle mdi-48px" })
], -1);
const _hoisted_203 = {
  class: "float-start form_error pt-3",
  style: { "width": "85%" }
};
const _hoisted_204 = { class: "modal-footer justify-content-between" };
const _hoisted_205 = /* @__PURE__ */ createBaseVNode("button", {
  type: "button",
  class: "btn btn-default",
  "data-dismiss": "modal"
}, "Cancelar", -1);
const _hoisted_206 = ["disabled"];
const _hoisted_207 = {
  key: 0,
  class: "mdi mdi-check-all"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_page_header = resolveComponent("page-header");
  const _component_router_link = resolveComponent("router-link");
  const _directive_tooltip = resolveDirective("tooltip");
  return openBlock(), createElementBlock(Fragment, null, [
    createVNode(_component_page_header, { pagetitle: "Nueva Entrada de mercanc\xEDa en pa\xF1ol" }),
    createBaseVNode("div", _hoisted_1, [
      createBaseVNode("div", _hoisted_2, [
        _hoisted_3,
        createBaseVNode("div", _hoisted_4, [
          createBaseVNode("div", _hoisted_5, [
            createBaseVNode("div", _hoisted_6, [
              createBaseVNode("div", _hoisted_7, [
                _hoisted_8,
                createBaseVNode("select", {
                  name: "origin",
                  size: "1",
                  class: "form-control",
                  disabled: _ctx.search_loading
                }, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.origin_data.origin_field_options, (option, index) => {
                    return openBlock(), createElementBlock("option", {
                      key: index,
                      value: index + 1,
                      selected: _ctx.origin_data.origin === option,
                      onClick: withModifiers(($event) => $options.changeOrigin(option), ["stop"])
                    }, toDisplayString(option), 9, _hoisted_10);
                  }), 128))
                ], 8, _hoisted_9)
              ])
            ]),
            _ctx.origin_data.origin === "Despacho de Almac\xE9n" ? (openBlock(), createElementBlock("div", _hoisted_11, [
              createBaseVNode("div", _hoisted_12, [
                createBaseVNode("label", null, toDisplayString(_ctx.origin_data.doctype_title), 1),
                createBaseVNode("select", {
                  name: "doctype",
                  size: "1",
                  class: "form-control",
                  disabled: _ctx.search_loading
                }, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.origin_data.doctype_field_options, (option, index) => {
                    return openBlock(), createElementBlock("option", {
                      key: index,
                      value: index + 1,
                      selected: _ctx.origin_data.origin === option,
                      onClick: withModifiers(($event) => $options.changeDoctype(option), ["stop"])
                    }, toDisplayString(option), 9, _hoisted_14);
                  }), 128))
                ], 8, _hoisted_13)
              ])
            ])) : createCommentVNode("", true),
            _ctx.origin_data.doctype_value === "Conduce" || _ctx.origin_data.origin !== "Despacho de Almac\xE9n" && _ctx.origin_data.origin !== "Transferencia de Pa\xF1ol" ? (openBlock(), createElementBlock("div", {
              key: 1,
              class: normalizeClass(["pl-1", _ctx.origin_data.origin !== "Despacho de Almac\xE9n" ? "col-md-3" : "col-md-2"])
            }, [
              createBaseVNode("div", _hoisted_15, [
                _hoisted_16,
                withDirectives(createBaseVNode("input", {
                  type: "text",
                  name: "ocnumber",
                  class: normalizeClass(["form-control", _ctx.origin_data.error.ocnumber != "" ? "border-error" : ""]),
                  disabled: _ctx.search_loading,
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.origin_data.ocnumber = $event)
                }, null, 10, _hoisted_17), [
                  [vModelText, _ctx.origin_data.ocnumber]
                ]),
                _ctx.origin_data.error.ocnumber != "" ? (openBlock(), createElementBlock("span", _hoisted_18, [
                  createBaseVNode("span", _hoisted_19, toDisplayString(_ctx.origin_data.error.ocnumber), 1)
                ])) : createCommentVNode("", true)
              ])
            ], 2)) : createCommentVNode("", true),
            _ctx.origin_data.origin == "Transferencia de Pa\xF1ol" ? (openBlock(), createElementBlock("div", _hoisted_20, [
              createBaseVNode("div", _hoisted_21, [
                _hoisted_22,
                createBaseVNode("select", _hoisted_23, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.warehouses, (option, index) => {
                    return openBlock(), createElementBlock("option", {
                      key: index,
                      value: option["id"],
                      onClick: withModifiers(($event) => $options.changeWarehouseOrigin(option["id"]), ["stop"])
                    }, toDisplayString(option["name"]), 9, _hoisted_24);
                  }), 128))
                ])
              ])
            ])) : createCommentVNode("", true),
            createBaseVNode("div", {
              class: normalizeClass(["pl-1", _ctx.origin_data.doctype_value !== "Conduce" ? "col-md-3" : "col-md-2"])
            }, [
              createBaseVNode("div", _hoisted_25, [
                createBaseVNode("label", null, "No. " + toDisplayString(_ctx.origin_data.docnum_title), 1),
                withDirectives(createBaseVNode("input", {
                  type: "text",
                  name: "docnumber",
                  class: normalizeClass(["form-control", _ctx.origin_data.error.docnum != "" ? "border-error" : ""]),
                  maxlength: _ctx.origin_data.origin == "Despacho de Almac\xE9n" ? "5" : "20",
                  disabled: _ctx.search_loading,
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => _ctx.origin_data.docnum_value = $event),
                  onKeyup: _cache[2] || (_cache[2] = withKeys(($event) => $options.getEntryData(), ["enter"]))
                }, null, 42, _hoisted_26), [
                  [vModelText, _ctx.origin_data.docnum_value]
                ]),
                _ctx.origin_data.error.docnum != "" ? (openBlock(), createElementBlock("span", _hoisted_27, [
                  createBaseVNode("span", _hoisted_28, toDisplayString(_ctx.origin_data.error.docnum), 1)
                ])) : createCommentVNode("", true)
              ])
            ], 2),
            createBaseVNode("div", {
              class: normalizeClass(_ctx.origin_data.doctype_value !== "Conduce" ? "col-md-3" : "col-md-2")
            }, [
              _ctx.btnsearch != "Loading" ? (openBlock(), createElementBlock("button", {
                key: 0,
                class: "btn btn-primary ripple",
                style: { "margin-top": "30px" },
                onClick: _cache[3] || (_cache[3] = ($event) => $options.getEntryData())
              }, [
                _hoisted_29,
                createTextVNode(" " + toDisplayString(_ctx.btnsearch), 1)
              ])) : (openBlock(), createElementBlock("button", _hoisted_30, _hoisted_32))
            ], 2)
          ])
        ])
      ]),
      _ctx.show_items ? (openBlock(), createElementBlock("div", _hoisted_33, [
        createBaseVNode("div", _hoisted_34, [
          _hoisted_35,
          createBaseVNode("span", _hoisted_36, [
            _hoisted_37,
            createTextVNode(" " + toDisplayString(_ctx.items_selected) + " Recibido(s) en obra ", 1),
            _hoisted_38
          ]),
          _hoisted_39
        ]),
        createBaseVNode("div", _hoisted_40, [
          createBaseVNode("div", {
            class: normalizeClass(["row", !_ctx.items_loading ? "hidden" : ""])
          }, _hoisted_42, 2),
          createBaseVNode("div", {
            class: normalizeClass(["row", _ctx.items_loading || !_ctx.table_oc ? "hidden" : ""])
          }, [
            createBaseVNode("div", _hoisted_43, [
              createBaseVNode("table", _hoisted_44, [
                _hoisted_45,
                createBaseVNode("tbody", null, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.items, (item, idx) => {
                    return openBlock(), createElementBlock("tr", {
                      key: item.id
                    }, [
                      createBaseVNode("td", _hoisted_46, toDisplayString(idx + 1), 1),
                      createBaseVNode("td", null, [
                        withDirectives((openBlock(), createElementBlock("a", {
                          class: "show-lnk",
                          href: "javascript:void(0);",
                          "data-toggle": "modal",
                          "data-target": "#modal-item-details",
                          onClick: ($event) => $options.show(idx)
                        }, [
                          createTextVNode(toDisplayString(item.item_description), 1)
                        ], 8, _hoisted_47)), [
                          [_directive_tooltip, "Click para Mostrar Detalles de este producto"]
                        ])
                      ]),
                      createBaseVNode("td", _hoisted_48, toDisplayString(item.um), 1),
                      createBaseVNode("td", {
                        id: "item-" + (idx + 1) + "-received",
                        class: "text-center"
                      }, toDisplayString(item.received_quantity), 9, _hoisted_49),
                      createBaseVNode("td", _hoisted_50, toDisplayString(item.price_unit), 1),
                      createBaseVNode("td", {
                        id: "item-" + (idx + 1) + "-pricetotal",
                        class: "text-right"
                      }, toDisplayString(item.price_total), 9, _hoisted_51),
                      createBaseVNode("td", {
                        id: "item-" + (idx + 1) + "-stowagecard",
                        class: "text-center"
                      }, toDisplayString(item.stowage_card), 9, _hoisted_52),
                      createBaseVNode("td", {
                        id: "item-" + (idx + 1) + "-comment"
                      }, toDisplayString(item.comment), 9, _hoisted_53),
                      createBaseVNode("td", _hoisted_54, [
                        withDirectives((openBlock(), createElementBlock("a", {
                          href: "javascript:void(0);",
                          class: "btn-semti-tool",
                          style: { "padding": "4px 5px" },
                          "data-toggle": "modal",
                          "data-target": "#modal-item-form",
                          onClick: ($event) => $options.edit(idx, item.oc, item.item_description, item.received_quantity, item.stowage_card, item.comment)
                        }, _hoisted_57, 8, _hoisted_55)), [
                          [_directive_tooltip, "Anotar informaci\xF3n de este Rengl\xF3n"]
                        ])
                      ])
                    ]);
                  }), 128))
                ])
              ])
            ])
          ], 2),
          createBaseVNode("div", {
            class: normalizeClass(["row", _ctx.items_loading || _ctx.table_oc ? "hidden" : ""])
          }, [
            createBaseVNode("div", _hoisted_58, [
              createBaseVNode("table", _hoisted_59, [
                _hoisted_60,
                createBaseVNode("tbody", null, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.items, (item, idx) => {
                    return openBlock(), createElementBlock("tr", {
                      key: item.id
                    }, [
                      createBaseVNode("td", _hoisted_61, toDisplayString(idx + 1), 1),
                      createBaseVNode("td", null, [
                        withDirectives((openBlock(), createElementBlock("a", {
                          class: "show-lnk",
                          href: "javascript:void(0);",
                          "data-toggle": "modal",
                          "data-target": "#modal-item-details",
                          onClick: ($event) => $options.show(idx)
                        }, [
                          createTextVNode(toDisplayString(item.item_description), 1)
                        ], 8, _hoisted_62)), [
                          [_directive_tooltip, "Click para Mostrar Detalles de este producto"]
                        ])
                      ]),
                      createBaseVNode("td", _hoisted_63, toDisplayString(item.um), 1),
                      createBaseVNode("td", _hoisted_64, toDisplayString(item.product_quantity), 1),
                      createBaseVNode("td", {
                        id: "item-" + (idx + 1) + "-received",
                        class: "text-center"
                      }, toDisplayString(item.received_quantity), 9, _hoisted_65),
                      createBaseVNode("td", _hoisted_66, toDisplayString(item.price_unit), 1),
                      createBaseVNode("td", {
                        id: "item-" + (idx + 1) + "-pricetotal",
                        class: "text-right"
                      }, toDisplayString(item.price_total), 9, _hoisted_67),
                      createBaseVNode("td", {
                        id: "item-" + (idx + 1) + "-stowagecard",
                        class: "text-center"
                      }, toDisplayString(item.stowage_card), 9, _hoisted_68),
                      createBaseVNode("td", {
                        id: "item-" + (idx + 1) + "-comment"
                      }, toDisplayString(item.comment), 9, _hoisted_69),
                      createBaseVNode("td", _hoisted_70, [
                        withDirectives((openBlock(), createElementBlock("a", {
                          href: "javascript:void(0);",
                          class: "btn-semti-tool",
                          style: { "padding": "4px 5px" },
                          "data-toggle": "modal",
                          "data-target": "#modal-item-form",
                          onClick: ($event) => $options.edit(idx, item.oc, item.item_description, item.received_quantity, item.stowage_card, item.comment, item.product_quantity)
                        }, _hoisted_73, 8, _hoisted_71)), [
                          [_directive_tooltip, "Anotar informaci\xF3n de este Rengl\xF3n"]
                        ])
                      ])
                    ]);
                  }), 128))
                ])
              ])
            ])
          ], 2)
        ])
      ])) : createCommentVNode("", true),
      _ctx.show_items && !_ctx.items_loading ? (openBlock(), createElementBlock("div", _hoisted_74, [
        _hoisted_75,
        createBaseVNode("div", _hoisted_76, [
          createBaseVNode("div", _hoisted_77, [
            createBaseVNode("div", _hoisted_78, [
              createBaseVNode("div", _hoisted_79, [
                _hoisted_80,
                withDirectives(createBaseVNode("input", {
                  type: "text",
                  class: "form-control",
                  disabled: true,
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => _ctx.pole_name = $event)
                }, null, 512), [
                  [vModelText, _ctx.pole_name]
                ])
              ])
            ]),
            createBaseVNode("div", _hoisted_81, [
              createBaseVNode("div", _hoisted_82, [
                _hoisted_83,
                withDirectives(createBaseVNode("input", {
                  type: "text",
                  class: "form-control",
                  disabled: true,
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => _ctx.project_name = $event)
                }, null, 512), [
                  [vModelText, _ctx.project_name]
                ])
              ])
            ]),
            createBaseVNode("div", _hoisted_84, [
              createBaseVNode("div", _hoisted_85, [
                _hoisted_86,
                withDirectives(createBaseVNode("select", {
                  name: "origin",
                  size: "1",
                  class: "form-control",
                  "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => _ctx.destiny_data.warehouse = $event)
                }, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.warehouses, (option, index) => {
                    return openBlock(), createElementBlock("option", {
                      key: index,
                      value: option["id"],
                      onClick: withModifiers(($event) => $options.changeWarehouse(option["id"], option["name"], option["owner"]), ["stop"])
                    }, toDisplayString(option["name"]), 9, _hoisted_87);
                  }), 128))
                ], 512), [
                  [vModelSelect, _ctx.destiny_data.warehouse]
                ])
              ])
            ]),
            createBaseVNode("div", _hoisted_88, [
              createBaseVNode("div", _hoisted_89, [
                _hoisted_90,
                withDirectives(createBaseVNode("input", {
                  type: "text",
                  name: "resp_stock",
                  class: "form-control",
                  disabled: _ctx.warehouses.length > 0 && _ctx.destiny_data.warehouse_owner != "",
                  "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => _ctx.destiny_data.warehouse_owner = $event)
                }, null, 8, _hoisted_91), [
                  [vModelText, _ctx.destiny_data.warehouse_owner]
                ])
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_92, [
            createBaseVNode("div", _hoisted_93, [
              createBaseVNode("div", _hoisted_94, [
                _hoisted_95,
                withDirectives(createBaseVNode("textarea", {
                  name: "entry_comment",
                  class: "form-control",
                  "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => _ctx.destiny_data.comment = $event)
                }, "\r\n                            ", 512), [
                  [vModelText, _ctx.destiny_data.comment]
                ])
              ])
            ])
          ]),
          _ctx.origin_data.doctype_value === "Conduce" || _ctx.origin_data.origin !== "Despacho de Almac\xE9n" ? (openBlock(), createElementBlock("div", _hoisted_96, [
            createBaseVNode("div", _hoisted_97, [
              _hoisted_98,
              createBaseVNode("div", _hoisted_99, [
                withDirectives(createBaseVNode("input", {
                  class: "form-check-input",
                  type: "radio",
                  name: "status",
                  "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => _ctx.entry_status = $event),
                  value: "total"
                }, null, 512), [
                  [vModelRadio, _ctx.entry_status]
                ]),
                _hoisted_100
              ]),
              createBaseVNode("div", _hoisted_101, [
                withDirectives(createBaseVNode("input", {
                  class: "form-check-input",
                  type: "radio",
                  name: "status",
                  "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => _ctx.entry_status = $event),
                  value: "parcial",
                  checked: true
                }, null, 512), [
                  [vModelRadio, _ctx.entry_status]
                ]),
                _hoisted_102
              ])
            ])
          ])) : createCommentVNode("", true)
        ]),
        createBaseVNode("div", _hoisted_103, [
          createVNode(_component_router_link, {
            to: "/semtinel/public/logistics",
            class: "btn btn-default"
          }, {
            default: withCtx(() => [
              createTextVNode(" Cancelar ")
            ]),
            _: 1
          }),
          createBaseVNode("button", {
            class: "btn btn-primary float-end ripple",
            "data-toggle": "modal",
            "data-target": "#modal-entry-confirm",
            onClick: _cache[11] || (_cache[11] = ($event) => $options.entryConfirm())
          }, [
            _hoisted_104,
            createTextVNode("\xA0 Registrar Entrada ")
          ])
        ])
      ])) : createCommentVNode("", true)
    ]),
    createBaseVNode("div", _hoisted_105, [
      createBaseVNode("div", _hoisted_106, [
        createBaseVNode("div", _hoisted_107, [
          createBaseVNode("div", _hoisted_108, [
            _hoisted_109,
            createBaseVNode("button", _hoisted_110, _hoisted_112, 512)
          ]),
          createBaseVNode("div", _hoisted_113, [
            createBaseVNode("form", null, [
              withDirectives(createBaseVNode("input", {
                type: "hidden",
                name: "idx_item",
                id: "idx_item",
                "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => _ctx.item_form_data.idx = $event)
              }, null, 512), [
                [vModelText, _ctx.item_form_data.idx]
              ]),
              createBaseVNode("div", _hoisted_114, [
                createBaseVNode("div", _hoisted_115, [
                  createBaseVNode("h6", _hoisted_116, [
                    createTextVNode(" Est\xE1 Actualizando la informaci\xF3n del "),
                    createBaseVNode("strong", null, "Rengl\xF3n No. " + toDisplayString(_ctx.item_form_data.number), 1)
                  ])
                ])
              ]),
              createBaseVNode("div", _hoisted_117, [
                createBaseVNode("div", _hoisted_118, [
                  createBaseVNode("div", _hoisted_119, [
                    _hoisted_120,
                    withDirectives(createBaseVNode("input", {
                      type: "number",
                      class: normalizeClass(["form-control", _ctx.item_form_error.received_quantity ? "border-error" : ""]),
                      id: "received_quantity",
                      name: "received_quantity",
                      step: ".01",
                      min: "0",
                      "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => _ctx.item_form_data.received_quantity = $event)
                    }, null, 2), [
                      [vModelText, _ctx.item_form_data.received_quantity]
                    ])
                  ])
                ])
              ]),
              createBaseVNode("div", _hoisted_121, [
                createBaseVNode("div", _hoisted_122, [
                  createBaseVNode("div", _hoisted_123, [
                    _hoisted_124,
                    withDirectives(createBaseVNode("input", {
                      type: "text",
                      class: normalizeClass(["form-control", _ctx.item_form_error.stowage_card ? "border-error" : ""]),
                      disabled: _ctx.stowage_card_loading || _ctx.item_form_data.has_stowage_card,
                      id: "stowage_card",
                      name: "stowage_card",
                      placeholder: _ctx.stowage_card_loading ? "Cargando Tarjeta de estiba..." : "Introduzca el c\xF3digo de la tarjeta de estiba asignada",
                      "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => _ctx.item_form_data.stowage_card = $event)
                    }, null, 10, _hoisted_125), [
                      [vModelText, _ctx.item_form_data.stowage_card]
                    ])
                  ])
                ])
              ]),
              createBaseVNode("div", _hoisted_126, [
                createBaseVNode("div", _hoisted_127, [
                  createBaseVNode("div", _hoisted_128, [
                    _hoisted_129,
                    withDirectives(createBaseVNode("textarea", {
                      name: "entry_comment",
                      class: "form-control",
                      "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => _ctx.item_form_data.comment = $event)
                    }, "\r\n                                    ", 512), [
                      [vModelText, _ctx.item_form_data.comment]
                    ])
                  ])
                ])
              ]),
              _ctx.item_form_error.error_text != "" ? (openBlock(), createElementBlock("div", _hoisted_130, [
                createBaseVNode("div", _hoisted_131, [
                  createBaseVNode("h6", _hoisted_132, toDisplayString(_ctx.item_form_error.error_text), 1)
                ])
              ])) : createCommentVNode("", true)
            ])
          ]),
          createBaseVNode("div", _hoisted_133, [
            _hoisted_134,
            createBaseVNode("button", {
              type: "button",
              class: "btn btn-primary btn-green ripple",
              disabled: _ctx.item_form_loading || _ctx.stowage_card_loading,
              onClick: _cache[16] || (_cache[16] = withModifiers(($event) => $options.updateItem(), ["stop"]))
            }, [
              !_ctx.item_form_loading ? (openBlock(), createElementBlock("i", _hoisted_136)) : (openBlock(), createElementBlock("i", _hoisted_137)),
              createTextVNode(" \xA0" + toDisplayString(_ctx.item_form_okbtn_text), 1)
            ], 8, _hoisted_135)
          ])
        ])
      ])
    ]),
    createBaseVNode("div", _hoisted_138, [
      createBaseVNode("div", _hoisted_139, [
        createBaseVNode("div", _hoisted_140, [
          createBaseVNode("div", _hoisted_141, [
            _hoisted_142,
            createBaseVNode("button", _hoisted_143, _hoisted_145, 512)
          ]),
          createBaseVNode("div", _hoisted_146, [
            createBaseVNode("div", _hoisted_147, [
              createBaseVNode("div", _hoisted_148, [
                _hoisted_149,
                createBaseVNode("h6", _hoisted_150, toDisplayString(_ctx.item_details.cod_product), 1)
              ])
            ]),
            createBaseVNode("div", _hoisted_151, [
              createBaseVNode("div", _hoisted_152, [
                _hoisted_153,
                createBaseVNode("h6", _hoisted_154, toDisplayString(_ctx.item_details.oc), 1)
              ])
            ]),
            _ctx.table_oc && _ctx.show_details ? (openBlock(), createElementBlock("div", _hoisted_155, [
              createBaseVNode("div", _hoisted_156, [
                _hoisted_157,
                createBaseVNode("h6", _hoisted_158, toDisplayString(_ctx.item_details.generic_descript.toUpperCase()), 1)
              ])
            ])) : createCommentVNode("", true),
            !_ctx.table_oc && _ctx.show_details ? (openBlock(), createElementBlock("div", _hoisted_159, [
              createBaseVNode("div", _hoisted_160, [
                _hoisted_161,
                createBaseVNode("h6", _hoisted_162, toDisplayString(_ctx.item_details.docnum), 1)
              ])
            ])) : createCommentVNode("", true),
            createBaseVNode("div", _hoisted_163, [
              createBaseVNode("div", _hoisted_164, [
                _hoisted_165,
                createBaseVNode("h6", _hoisted_166, toDisplayString(_ctx.item_details.item_description.toUpperCase()), 1)
              ])
            ]),
            createBaseVNode("div", _hoisted_167, [
              createBaseVNode("div", {
                class: normalizeClass(_ctx.table_oc ? "col-md-6" : "col-md-4")
              }, [
                _hoisted_168,
                createBaseVNode("h6", _hoisted_169, toDisplayString(_ctx.item_details.um), 1)
              ], 2),
              !_ctx.table_oc ? (openBlock(), createElementBlock("div", {
                key: 0,
                class: normalizeClass(_ctx.table_oc ? "col-md-6" : "col-md-4")
              }, [
                _hoisted_170,
                createBaseVNode("h6", _hoisted_171, toDisplayString(_ctx.item_details.product_quantity), 1)
              ], 2)) : createCommentVNode("", true),
              createBaseVNode("div", {
                class: normalizeClass(_ctx.table_oc ? "col-md-6" : "col-md-4")
              }, [
                _hoisted_172,
                createBaseVNode("h6", _hoisted_173, toDisplayString(_ctx.item_details.received_quantity), 1)
              ], 2)
            ]),
            createBaseVNode("div", _hoisted_174, [
              createBaseVNode("div", _hoisted_175, [
                _hoisted_176,
                createBaseVNode("h6", _hoisted_177, toDisplayString(_ctx.item_details.price_unit), 1)
              ]),
              createBaseVNode("div", _hoisted_178, [
                _hoisted_179,
                createBaseVNode("h6", _hoisted_180, toDisplayString(_ctx.item_details.price_total), 1)
              ]),
              createBaseVNode("div", _hoisted_181, [
                _hoisted_182,
                createBaseVNode("h6", _hoisted_183, toDisplayString(_ctx.item_details.stowage_card), 1)
              ])
            ]),
            _ctx.item_details.comment != "" && _ctx.item_details.comment != null ? (openBlock(), createElementBlock("div", _hoisted_184, [
              createBaseVNode("div", _hoisted_185, [
                _hoisted_186,
                createBaseVNode("h6", _hoisted_187, toDisplayString(_ctx.item_details.comment), 1)
              ])
            ])) : createCommentVNode("", true)
          ])
        ])
      ])
    ]),
    createBaseVNode("div", _hoisted_188, [
      createBaseVNode("div", _hoisted_189, [
        createBaseVNode("div", _hoisted_190, [
          createBaseVNode("div", _hoisted_191, [
            _hoisted_192,
            createBaseVNode("button", _hoisted_193, _hoisted_195, 512)
          ]),
          createBaseVNode("div", _hoisted_196, [
            _ctx.entry_error == "" ? (openBlock(), createElementBlock("div", _hoisted_197, [
              _hoisted_198,
              createBaseVNode("div", _hoisted_199, [
                createBaseVNode("p", null, [
                  createTextVNode(' Se registrar\xE1 una nueva Entrada desde "'),
                  createBaseVNode("strong", null, toDisplayString(_ctx.origin_data.origin), 1),
                  createTextVNode('" del documento No. "'),
                  createBaseVNode("strong", null, toDisplayString(_ctx.origin_data.docnum_value), 1),
                  createTextVNode('", con la recepci\xF3n de "'),
                  createBaseVNode("strong", null, toDisplayString(_ctx.items_selected) + " Item(s)", 1),
                  createTextVNode('" en env\xEDo de mercancia a obra, hacia el destino "'),
                  createBaseVNode("strong", null, toDisplayString(_ctx.destiny_data.warehouse_name), 1),
                  createTextVNode('".'),
                  _hoisted_200,
                  createTextVNode("\xBFConfirma que desea realizar esta operaci\xF3n? ")
                ])
              ])
            ])) : createCommentVNode("", true),
            _ctx.entry_error != "" ? (openBlock(), createElementBlock("div", _hoisted_201, [
              _hoisted_202,
              createBaseVNode("div", _hoisted_203, toDisplayString(_ctx.entry_error), 1)
            ])) : createCommentVNode("", true)
          ]),
          createBaseVNode("div", _hoisted_204, [
            _hoisted_205,
            createBaseVNode("button", {
              type: "button",
              class: normalizeClass(["btn ripple", _ctx.entry_error != "" ? "btn-secondary" : "btn-primary"]),
              disabled: _ctx.entry_loading,
              onClick: _cache[17] || (_cache[17] = withModifiers(($event) => $options.processEntry(), ["stop"]))
            }, [
              !_ctx.entry_loading ? (openBlock(), createElementBlock("i", _hoisted_207)) : createCommentVNode("", true),
              createTextVNode("\xA0" + toDisplayString(_ctx.entry_okbtn_text), 1)
            ], 10, _hoisted_206)
          ])
        ])
      ])
    ])
  ], 64);
}
const EntryComponent = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  EntryComponent as default
};
