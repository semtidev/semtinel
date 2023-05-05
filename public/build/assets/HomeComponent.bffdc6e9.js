import { o as openBlock, b as createElementBlock, i as createBaseVNode } from "./vue.esm-bundler.ecfa1491.js";
import { _ as _export_sfc } from "./app.cab0b5fe.js";
import "./jquery.8baacbdb.js";
const _sfc_main = {
  data: function() {
    return {
      project: localStorage.getItem("stnel_logist_project"),
      session: JSON.parse(sessionStorage.getItem("semtinel"))
    };
  },
  watch: {},
  components: {},
  async created() {
    let cmp = this;
    localStorage.setItem("stnel_warehouses", "");
    let headers = {
      "User-Agent": "testing/1.0",
      "Accept": "application/json",
      "Authorization": "Bearer " + cmp.session.access_token
    };
    await fetch("http://localhost/semtinel/public/api/logistics/warehouses/" + cmp.project, {
      method: "GET",
      headers
    }).then((response) => response.json()).then((data) => {
      localStorage.setItem("stnel_warehouses", JSON.stringify(data));
    });
    await fetch("http://localhost/semtinel/public/api/logistics/products_categories", {
      method: "GET",
      headers
    }).then((response) => response.json()).then((data) => {
      localStorage.setItem("semtinel_products_categories", JSON.stringify(data));
    });
  },
  methods: {},
  mounted() {
  }
};
const _hoisted_1 = { class: "h-100 text-center app_name" };
const _hoisted_2 = /* @__PURE__ */ createBaseVNode("div", { class: "text-center" }, [
  /* @__PURE__ */ createBaseVNode("i", { class: "mdi mdi-truck-check mdi-72px text-success" })
], -1);
const _hoisted_3 = /* @__PURE__ */ createBaseVNode("div", { class: "app-title" }, "Semtinel - Log\xEDstica", -1);
const _hoisted_4 = /* @__PURE__ */ createBaseVNode("div", { class: "app-subtitle" }, "Sistema de Gesti\xF3n de Pa\xF1oles", -1);
const _hoisted_5 = [
  _hoisted_2,
  _hoisted_3,
  _hoisted_4
];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1, _hoisted_5);
}
const HomeComponent = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  HomeComponent as default
};
