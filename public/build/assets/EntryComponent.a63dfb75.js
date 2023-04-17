import{_ as j}from"./app.523dd8ec.js";import{$ as C}from"./jquery.70db95b2.js";import"./jquery.dataTables.min.aec3f10c.js";import{o as r,e as d,j as e,F as g,J as b,M as v,x as i,k as m,h,K as u,N as y,m as E,I as p,O as D,s as S,q as A,H as q,i as O,L as N}from"./vue.esm-bundler.5523ad96.js";const R={data:function(){return{store_poles:JSON.parse(localStorage.getItem("semtinel_poles")),store_projects:JSON.parse(localStorage.getItem("semtinel_projects")),store_warehouses:JSON.parse(localStorage.getItem("semtinel_warehouses")),projects:[],warehouses:[],items:[],items_selected:0,items_loading:!0,search_loading:!1,show_items:!1,btnsearch:"Cargar Renglones",table_oc:!1,show_details:!1,origin_data:{origin:"Despacho de Almacen",doctype_title:"Tipo de Documento",doctype_value:"Orden de Despacho",docnum_title:"Orden de Despacho (\xFAltimos 5 d\xEDgitos)",docnum_value:"",ocnumber:"",origin_field_options:["Despacho de Almacen","Tiro Directo Altec","Tiro Directo Almest","Tiro Directo Compras Locales"],doctype_field_options:["Orden de Despacho","Conduce","Vale de Salida"],error:{docnum:"",ocnumber:""}},item_details:{docnum:"",product_quantity:"",cod_product:"",oc:"",generic_descript:"",item_description:"",um:"",received_quantity:0,stowage_card:"-",price_unit:"",price_total:0,comment:""},destiny_data:{pole:"",project:"",warehouse:"",warehouse_name:"",warehouse_owner:"",comment:""},item_form_data:{idx:"",number:"",received_quantity:"",stowage_card:"",comment:""},item_form_error:{received_quantity:!1,stowage_card:!1,error_text:""},item_form_loading:!1,item_form_okbtn_text:"Aceptar",session:JSON.parse(sessionStorage.getItem("semtinel")),entry_error:"",entry_status:"parcial",entry_loading:!1,entry_okbtn_text:"Aceptar"}},watch:{btnsearch:function(t){t=="Loading"?this.search_loading=!0:this.search_loading=!1},entry_loading:function(t){t?this.entry_okbtn_text="Procesando...":this.entry_okbtn_text="Aceptar"}},methods:{changeOrigin:function(t){this.show_items=!1,this.show_details=!1,this.origin_data.origin=t,this.origin_data.error.docnum="",this.origin_data.error.ocnumber="",t!="Despacho de Almacen"?(this.origin_data.doctype_title="Orden de Compra",this.origin_data.doctype_value="",this.origin_data.docnum_title="Documento",this.origin_data.docnum_value="",this.origin_data.ocnumber="",this.table_oc=!0):(this.origin_data.doctype_title="Tipo de Documento",this.origin_data.doctype_value="Orden de Despacho",this.origin_data.docnum_title="Orden de Despacho (\xFAltimos 5 d\xEDgitos)",this.origin_data.docnum_value="",this.origin_data.ocnumber="",this.table_oc=!1)},changeDoctype:function(t){this.show_items=!1,this.show_details=!1,this.origin_data.doctype_value=t,this.origin_data.error.docnum="",this.origin_data.error.ocnumber="",t=="Orden de Despacho"?(this.origin_data.docnum_title="Orden de Despacho (\xFAltimos 5 d\xEDgitos)",this.table_oc=!1):t=="Vale de Salida"?(this.origin_data.docnum_title="Vale de Salida",this.table_oc=!1):(this.origin_data.docnum_title="Conduce",this.table_oc=!0)},changePole:function(t,s){let a=this,c=[],n=[];a.destiny_data.pole=s,a.store_projects.map(function(_,k){_.id_pole==t&&c.push(_)}),a.projects=c,a.destiny_data.project=c.length>0?c[0].id:"",a.destiny_data.warehouse="",a.destiny_data.project!=""&&a.store_warehouses.map(function(_,k){_.id_project==a.destiny_data.project&&n.push(_)}),a.warehouses=n,a.destiny_data.warehouse=n.length>0?n[0].id:"",a.destiny_data.warehouse_name=n.length>0?n[0].name:"",a.destiny_data.warehouse_owner=n.length>0?n[0].owner:""},changeProject:function(t){let s=this,a=[];s.destiny_data.project=t,s.destiny_data.warehouse="",s.store_warehouses.map(function(c,n){c.id_project==t&&a.push(c)}),s.warehouses=a,s.destiny_data.warehouse=a.length>0?a[0].id:"",s.destiny_data.warehouse_name=a.length>0?a[0].name:"",s.destiny_data.warehouse_owner=a.length>0?a[0].owner:""},changeWarehouse:function(t,s,a){let c=this;c.destiny_data.warehouse=t,c.destiny_data.warehouse_name=s,c.destiny_data.warehouse_owner=a},itemsSelected:function(){let t=0;return this.items.map(function(s,a){s.received_quantity>0&&t++}),t},updateStatus:function(){let t=0,s;return this.items.map(function(a,c){parseFloat(a.received_quantity)==parseFloat(a.product_quantity)&&t++}),s=this.items.length==t?"total":"parcial",s},show:function(t){let s=this;s.table_oc?s.item_details={cod_product:s.items[t].cod_product,oc:s.items[t].oc,generic_descript:s.items[t].generic_descript,item_description:s.items[t].item_description,um:s.items[t].um,received_quantity:s.items[t].received_quantity,stowage_card:s.items[t].stowage_card,price_unit:s.items[t].price_unit,price_total:s.items[t].price_total,comment:s.items[t].comment}:s.item_details={cod_product:s.items[t].cod_product,oc:s.items[t].oc,docnum:s.items[t].docnum,item_description:s.items[t].item_description,um:s.items[t].um,product_quantity:s.items[t].product_quantity,received_quantity:s.items[t].received_quantity,stowage_card:s.items[t].stowage_card,price_unit:s.items[t].price_unit,price_total:s.items[t].price_total,comment:s.items[t].comment},s.show_details=!0},edit:function(t,s,a,c){let n=this;n.form_error="",n.item_form_data.idx=t,n.item_form_data.number=t+1,n.item_form_data.received_quantity=s,n.item_form_data.stowage_card=a!="-"&&a!=""?a:"",n.item_form_error.error_text="",n.item_form_error.received_quantity=!1,n.item_form_error.stowage_card=!1,n.item_form_data.comment=c},updateItem:function(){let t=this,s=t.item_form_data.idx,a=t.item_form_data.received_quantity,c=0,n=t.item_form_data.stowage_card,_=t.item_form_data.comment;if(t.item_form_error.error_text="",t.item_form_error.received_quantity=!1,t.item_form_error.stowage_card=!1,n!="-"&&n!=""&&(a==0||isNaN(a))){t.item_form_error.error_text="Si asigna una tarjeta de estiba debe agregar una cantidad superior a cero",t.item_form_error.received_quantity=!0;return}if((n=="-"||n=="")&&a>0){t.item_form_error.error_text="Si registra una cantidad recibida debe asignar una tarjeta de estiba de destino",t.item_form_error.stowage_card=!0;return}n!="-"&&n!=""&&(t.items.map(function(k,w){s!=w&&k.stowage_card==n&&(t.item_form_error.error_text="Ya registr\xF3 otro rengl\xF3n en esa Tarjeta de Estiba",t.item_form_error.stowage_card=!0)}),t.item_form_error.stowage_card)||((n=="-"||n=="")&&(a==0||isNaN(a))&&(a=0,n="-"),C("#item-"+(s+1)+"-received").html(a),C("#item-"+(s+1)+"-stowagecard").html(n),C("#item-"+(s+1)+"-comment").html(_),t.items[s].received_quantity=a,t.items[s].stowage_card=n,t.items[s].comment=_,a>0?(c=a*t.items[s].price_unit,c=parseFloat(c).toFixed(2),C("#item-"+(s+1)+"-pricetotal").html(c),t.items[s].price_total=c):(c=0,C("#item-"+(s+1)+"-pricetotal").html(c),t.items[s].price_total=c),t.items_selected=t.itemsSelected(),t.entry_status=t.updateStatus(),t.$refs.CloseEdit.click())},entryConfirm:function(){let t=this;if(t.entry_error="",t.items_selected==0){t.entry_error="No se ha registrado cantidad recibida en ning\xFAn rengl\xF3n. Por favor, actualice la tabla de renglones con los valores que haya recibido, y luego repita esta operaci\xF3n.";return}},isValidOriginForm:function(){let t=!0;return this.origin_data.error.docnum="",this.origin_data.error.ocnumber="",this.origin_data.origin=="Despacho de Almacen"&&this.origin_data.doctype_value!="Conduce"?(this.origin_data.docnum_value==null||this.origin_data.docnum_value=="")&&(this.origin_data.error.docnum="Este campo es obligatorio.",t=!1):((this.origin_data.ocnumber==null||this.origin_data.ocnumber=="")&&(this.origin_data.error.ocnumber="Este campo es obligatorio.",t=!1),(this.origin_data.docnum_value==null||this.origin_data.docnum_value=="")&&(this.origin_data.error.docnum="Este campo es obligatorio.",t=!1)),t},async getEntryData(){let t=this;if(!t.isValidOriginForm())return;t.btnsearch="Loading",t.show_items=!0,t.items_loading=!0,t.items_selected=0;let s={"User-Agent":"testing/1.0",Accept:"application/json",Authorization:"Bearer "+t.session.access_token};await axios.post("http://localhost/semtinel/public/api/logistics/entry/data",{origin:t.origin_data.origin,doctype:t.origin_data.doctype_value,ocnumber:t.origin_data.ocnumber,docnum:t.origin_data.docnum_value,project:localStorage.getItem("stnel_logist_project")},{headers:s}).then(function(a){a.data.success?(t.items=a.data.items,t.btnsearch="Cargar Renglones",t.items_loading=!1):(t.btnsearch="Cargar Renglones",toastr.error("Error al intentar realizar la operaci\xF3n."))}).catch(function(a){t.btnsearch="Cargar Renglones",toastr.error("Error al intentar realizar la operaci\xF3n.")})},processEntry:function(){let t=this;if(t.entry_error!=""){t.$refs.ConfirmClose.click();return}t.entry_loading=!0;let s={"User-Agent":"testing/1.0",Accept:"application/json",Authorization:"Bearer "+t.session.access_token};axios.post("http://localhost/semtinel/public/api/logistics/entry",{origin:t.origin_data,items:t.items,destin:t.destiny_data,status:t.entry_status,user:t.session.id},{headers:s}).then(function(a){a.data.success?(t.$refs.ConfirmClose.click(),t.entry_loading=!1,parseInt(a.data.entry)>0&&window.open("http://localhost/semtinel/public/api/logistics/pdf/entry/"+a.data.entry,"_blank","noreferrer"),t.$router.push("/semtinel/logistics/entries")):(t.$refs.ConfirmClose.click(),t.entry_loading=!1,console.log(a.data.error),toastr.error("Error al intentar realizar la operaci\xF3n."))}).catch(function(a){t.$refs.ConfirmClose.click(),t.entry_loading=!1,console.log("ERROR"),toastr.error("Error al intentar realizar la operaci\xF3n.")})}},mounted(){JSON.parse(sessionStorage.getItem("semtinel")).access_token||(sessionStorage.clear(),window.document.location.href="http://localhost/semtinel/login"),this.destiny_data.pole=this.store_poles[0].abbr,this.changePole(this.store_poles[0].id,this.store_poles[0].abbr)}},V={class:"container-fluid px-0"},U={class:"card card-default"},P=q('<div class="card-header"><h3 class="card-title">Origen de la Mercanc\xEDa</h3><div class="card-tools"><button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button></div></div>',1),T={class:"card-body"},I={class:"row"},z={class:"col-md-3 pl-md-3"},M={class:"form-group"},$=e("label",null,"Origen de la Mercanc\xEDa",-1),F=["disabled"],B=["value","selected","onClick"],J={key:0,class:"col-md-3 pl-1"},L={class:"form-group"},K=["disabled"],W=["value","selected","onClick"],H={class:"form-group"},Y=e("label",null,"Orden de Compra",-1),G=["disabled"],Q={key:0,class:"info-container"},X={class:"form_error text-sm"},Z={class:"form-group"},x=["maxlength","disabled"],ee={key:0,class:"info-container"},te={class:"form_error text-sm"},se=e("span",{class:"mdi mdi-magnify"},null,-1),oe={key:1,disabled:"",class:"btn btn-primary ripple",style:{"margin-top":"30px"}},ae=e("span",{class:"mdi mdi-loading mdi-spin"},"\xA0\xA0Cargando...",-1),ie=[ae],re={key:0,class:"card"},de={class:"card-header"},ne=e("h3",{class:"card-title float-left"},"Renglones Solicitados",-1),le={class:"float-left ml-2 align-middle",style:{"margin-top":"2px"}},ce=e("div",{class:"card-tools"},[e("button",{type:"button",class:"btn btn-tool","data-card-widget":"collapse"},[e("i",{class:"fas fa-minus"})])],-1),_e={class:"card-body pt-1 pb-2"},me=e("div",{class:"col-12 text-center py-5 loading-table"},[e("span",{class:"mdi mdi-loading mdi-spin mdi-36px"},"\xA0Cargando renglones...")],-1),he=[me],ue={class:"col-12 table-responsive"},pe={class:"table table-striped"},ge=e("thead",null,[e("tr",null,[e("th",{width:"50",class:"text-center no-sort"},"No."),e("th",null,"Descripci\xF3n"),e("th",{width:"100",class:"text-center no-sort"},"UM"),e("th",{width:"100",class:"text-center no-sort"},"Ctdad Recibida"),e("th",{width:"100",class:"text-right no-sort"},"Precio Unitario"),e("th",{width:"130",class:"text-right no-sort"},"Importe Total"),e("th",{width:"150",class:"text-center no-sort"},"Tarjeta Estiba"),e("th",{width:"200",class:"no-sort"},"Comentario"),e("th",{width:"60",class:"text-center no-sort"},"Recibir")])],-1),fe={class:"text-center"},ye=["onClick"],be={class:"text-center"},ve=["id"],we={class:"text-right"},ke=["id"],Ce=["id"],De=["id"],qe={class:"text-center"},je=["onClick"],Ee=e("span",{class:"mdi mdi-pencil mdi-18px text-green"},null,-1),Se=[Ee],Ae={class:"col-12"},Oe={class:"table table-striped"},Ne=e("thead",null,[e("tr",null,[e("th",{width:"50",class:"text-center no-sort"},"No."),e("th",null,"Descripci\xF3n"),e("th",{width:"100",class:"text-center no-sort"},"UM"),e("th",{width:"100",class:"text-center no-sort"},"Ctdad Despachada"),e("th",{width:"100",class:"text-center no-sort"},"Ctdad Recibida"),e("th",{width:"100",class:"text-right no-sort"},"Precio Unitario"),e("th",{width:"130",class:"text-right no-sort"},"Importe Total"),e("th",{width:"150",class:"text-center no-sort"},"Tarjeta Estiba"),e("th",{width:"200",class:"no-sort"},"Comentario"),e("th",{width:"60",class:"text-center no-sort"},"Recibir")])],-1),Re={class:"text-center"},Ve=["onClick"],Ue={class:"text-center"},Pe={class:"text-center"},Te=["id"],Ie={class:"text-right"},ze=["id"],Me=["id"],$e=["id"],Fe={class:"text-center"},Be=["onClick"],Je=e("span",{class:"mdi mdi-pencil mdi-18px text-green"},null,-1),Le=[Je],Ke={key:1,class:"card card-default"},We=q('<div class="card-header"><h3 class="card-title">Destino de la Mercanc\xEDa</h3><div class="card-tools"><button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button></div></div>',1),He={class:"card-body"},Ye={class:"row"},Ge={class:"col-md-3 pl-md-3"},Qe={class:"form-group"},Xe=e("label",null,"Polo",-1),Ze={name:"entry_pole",id:"entry_pole",size:"1",class:"form-control"},xe=["value","onClick"],et={class:"col-md-3 pl-1"},tt={class:"form-group"},st=e("label",null,"Proyecto",-1),ot={name:"project",size:"1",class:"form-control"},at=["value","onClick"],it={class:"col-md-3 pl-1"},rt={class:"form-group"},dt=e("label",null,"Pa\xF1ol",-1),nt={name:"origin",size:"1",class:"form-control"},lt=["value","onClick"],ct={class:"col-md-3 pl-1"},_t={class:"form-group"},mt=e("label",null,"Responsable de Pa\xF1ol",-1),ht=["disabled"],ut={class:"row"},pt={class:"col-12"},gt={class:"form-group"},ft=e("label",null,"Comentario",-1),yt={key:0,class:"row"},bt={class:"form-group pt-2"},vt=e("label",{class:"float-left mb-0 mt-1"},"Indique si la Entrada es Total o Parcial: ",-1),wt={class:"form-check float-left ml-4"},kt=e("label",{class:"form-check-label"},"Total",-1),Ct={class:"form-check float-left ml-4"},Dt=e("label",{class:"form-check-label"},"Parcial",-1),qt={class:"card-footer",style:{"background-color":"#DEF4DB","border-top":"0"}},jt=e("i",{class:"mdi mdi-check-all"},null,-1),Et={class:"modal fade",id:"modal-item-form","aria-hidden":"true",role:"dialog","data-backdrop":"static","data-keyboard":"false"},St={class:"modal-dialog"},At={class:"modal-content"},Ot={class:"modal-header header-green"},Nt=e("h4",{class:"modal-title"},"Completar rengl\xF3n recibido",-1),Rt={type:"button",ref:"CloseEdit",class:"close","data-dismiss":"modal","aria-label":"Close"},Vt=e("span",{"aria-hidden":"true"},"\xD7",-1),Ut=[Vt],Pt={class:"modal-body px-4"},Tt={class:"row py-3"},It={class:"col-md-12"},zt={class:"text-green"},Mt={class:"row"},$t={class:"col-md-12"},Ft={class:"form-group"},Bt=e("label",{for:"received_quantity"},"Cantidad recibida:",-1),Jt={class:"row"},Lt={class:"col-md-12"},Kt={class:"form-group"},Wt=e("label",{for:"stowage_card"},"Tarjeta de estiba destino:",-1),Ht={class:"row"},Yt={class:"col-md-12"},Gt={class:"form-group"},Qt=e("label",{for:"stowage_card"},"Comentario:",-1),Xt={key:0,class:"row pt-2"},Zt={class:"col-12 text-center"},xt={class:"form_error"},es={class:"modal-footer justify-content-between"},ts=e("button",{type:"button",class:"btn btn-default ripple","data-dismiss":"modal"},"Cancelar",-1),ss=["disabled"],os={key:0,class:"mdi mdi-check-all"},as={key:1,class:"mdi mdi-loading mdi-spin"},is={class:"modal fade",id:"modal-item-details","aria-hidden":"true",role:"dialog","data-backdrop":"static","data-keyboard":"false"},rs={class:"modal-dialog"},ds={class:"modal-content"},ns={class:"modal-header header-info"},ls=e("h4",{class:"modal-title"},"Detalles Producto",-1),cs={type:"button",ref:"Close",class:"close","data-dismiss":"modal","aria-label":"Close"},_s=e("span",{"aria-hidden":"true"},"\xD7",-1),ms=[_s],hs={class:"modal-body px-4 rounded-bottom"},us={class:"row py-1"},ps={class:"col-md-12"},gs=e("span",{class:"detail-title"},"C\xF3digo del Producto",-1),fs={class:"detail-desc"},ys={class:"row py-1"},bs={class:"col-md-12"},vs=e("span",{class:"detail-title"},"Orden de Compra",-1),ws={class:"detail-desc"},ks={key:0,class:"row py-1"},Cs={class:"col-md-12"},Ds=e("span",{class:"detail-title"},"Descripci\xF3n del Producto",-1),qs={class:"detail-desc"},js={key:1,class:"row py-1"},Es={class:"col-md-12"},Ss=e("span",{class:"detail-title"},"Documento",-1),As={class:"detail-desc"},Os={class:"row py-1"},Ns={class:"col-md-12"},Rs=e("span",{class:"detail-title"},"Descripci\xF3n del Item",-1),Vs={class:"detail-desc"},Us={class:"row py-1 mt-2"},Ps=e("div",{class:"text-center"},[e("span",{class:"detail-title"},"UM")],-1),Ts={class:"detail-desc text-center"},Is=e("div",{class:"text-center"},[e("span",{class:"detail-title"},"Ctdad Despachada")],-1),zs={class:"detail-desc text-center"},Ms=e("div",{class:"text-center"},[e("span",{class:"detail-title"},"Ctdad Recibida")],-1),$s={class:"detail-desc text-center"},Fs={class:"row py-1"},Bs={class:"col-md-4"},Js=e("div",{class:"text-center"},[e("span",{class:"detail-title"},"Precio Unitario")],-1),Ls={class:"detail-desc text-center"},Ks={class:"col-md-4"},Ws=e("div",{class:"text-center"},[e("span",{class:"detail-title"},"Importe Total")],-1),Hs={class:"detail-desc text-center"},Ys={class:"col-md-4"},Gs=e("div",{class:"text-center"},[e("span",{class:"detail-title"},"Tarjeta de Estiba")],-1),Qs={class:"detail-desc text-center"},Xs={key:2,class:"row py-1"},Zs={class:"col-md-12"},xs=e("span",{class:"detail-title"},"Comentario",-1),eo={class:"detail-desc"},to={class:"modal fade",id:"modal-entry-confirm","aria-hidden":"true",role:"dialog","data-backdrop":"static","data-keyboard":"false"},so={class:"modal-dialog modal-lg"},oo={class:"modal-content"},ao={class:"modal-header"},io=e("h4",{class:"modal-title"},"Nueva entrada de mercanc\xEDa en obra",-1),ro={type:"button",ref:"ConfirmClose",class:"close","data-dismiss":"modal","aria-label":"Close"},no=e("span",{"aria-hidden":"true"},"\xD7",-1),lo=[no],co={class:"modal-body px-4 pt-2 pb-4"},_o={key:0},mo=e("div",{class:"float-start",style:{width:"70px"}},[e("i",{class:"mdi mdi-chat-question mdi-48px"})],-1),ho={class:"float-start pt-3",style:{width:"85%"}},uo=e("br",null,null,-1),po={key:1,class:"row pt-2"},go=e("div",{class:"float-start text-danger",style:{width:"70px"}},[e("i",{class:"mdi mdi-alert-circle mdi-48px"})],-1),fo={class:"float-start form_error pt-3",style:{width:"85%"}},yo={class:"modal-footer justify-content-between"},bo=e("button",{type:"button",class:"btn btn-default","data-dismiss":"modal"},"Cancelar",-1),vo={key:0,class:"mdi mdi-check-all"};function wo(t,s,a,c,n,_){const k=O("router-link"),w=N("tooltip");return r(),d(g,null,[e("div",V,[e("div",U,[P,e("div",T,[e("div",I,[e("div",z,[e("div",M,[$,e("select",{name:"origin",size:"1",class:"form-control",disabled:t.search_loading},[(r(!0),d(g,null,b(t.origin_data.origin_field_options,(o,l)=>(r(),d("option",{key:l,value:l+1,selected:t.origin_data.origin===o,onClick:v(f=>_.changeOrigin(o),["stop"])},i(o),9,B))),128))],8,F)])]),t.origin_data.origin==="Despacho de Almacen"?(r(),d("div",J,[e("div",L,[e("label",null,i(t.origin_data.doctype_title),1),e("select",{name:"doctype",size:"1",class:"form-control",disabled:t.search_loading},[(r(!0),d(g,null,b(t.origin_data.doctype_field_options,(o,l)=>(r(),d("option",{key:l,value:l+1,selected:t.origin_data.origin===o,onClick:v(f=>_.changeDoctype(o),["stop"])},i(o),9,W))),128))],8,K)])])):m("",!0),t.origin_data.doctype_value==="Conduce"||t.origin_data.origin!=="Despacho de Almacen"?(r(),d("div",{key:1,class:h(["pl-1",t.origin_data.origin!=="Despacho de Almacen"?"col-md-3":"col-md-2"])},[e("div",H,[Y,u(e("input",{type:"text",name:"ocnumber",class:h(["form-control",t.origin_data.error.ocnumber!=""?"border-error":""]),disabled:t.search_loading,"onUpdate:modelValue":s[0]||(s[0]=o=>t.origin_data.ocnumber=o)},null,10,G),[[y,t.origin_data.ocnumber]]),t.origin_data.error.ocnumber!=""?(r(),d("span",Q,[e("span",X,i(t.origin_data.error.ocnumber),1)])):m("",!0)])],2)):m("",!0),e("div",{class:h(["pl-1",t.origin_data.doctype_value!=="Conduce"?"col-md-3":"col-md-2"])},[e("div",Z,[e("label",null,"No. "+i(t.origin_data.docnum_title),1),u(e("input",{type:"text",name:"docnumber",class:h(["form-control",t.origin_data.error.docnum!=""?"border-error":""]),maxlength:t.origin_data.origin=="Despacho de Almacen"?"5":"20",disabled:t.search_loading,"onUpdate:modelValue":s[1]||(s[1]=o=>t.origin_data.docnum_value=o),onKeyup:s[2]||(s[2]=E(o=>_.getEntryData(),["enter"]))},null,42,x),[[y,t.origin_data.docnum_value]]),t.origin_data.error.docnum!=""?(r(),d("span",ee,[e("span",te,i(t.origin_data.error.docnum),1)])):m("",!0)])],2),e("div",{class:h(t.origin_data.doctype_value!=="Conduce"?"col-md-3":"col-md-2")},[t.btnsearch!="Loading"?(r(),d("button",{key:0,class:"btn btn-primary ripple",style:{"margin-top":"30px"},onClick:s[3]||(s[3]=o=>_.getEntryData())},[se,p(" "+i(t.btnsearch),1)])):(r(),d("button",oe,ie))],2)])])]),t.show_items?(r(),d("div",re,[e("div",de,[ne,e("span",le,"("+i(t.items_selected)+" Recibidos en obra)",1),ce]),e("div",_e,[e("div",{class:h(["row",t.items_loading?"":"hidden"])},he,2),e("div",{class:h(["row",t.items_loading||!t.table_oc?"hidden":""])},[e("div",ue,[e("table",pe,[ge,e("tbody",null,[(r(!0),d(g,null,b(t.items,(o,l)=>(r(),d("tr",{key:o.id},[e("td",fe,i(l+1),1),e("td",null,[u((r(),d("a",{class:"show-lnk",href:"javascript:void(0);","data-toggle":"modal","data-target":"#modal-item-details",onClick:f=>_.show(l)},[p(i(o.item_description),1)],8,ye)),[[w,"Click para Mostrar Detalles de este producto"]])]),e("td",be,i(o.um),1),e("td",{id:"item-"+(l+1)+"-received",class:"text-center"},i(o.received_quantity),9,ve),e("td",we,i(o.price_unit),1),e("td",{id:"item-"+(l+1)+"-pricetotal",class:"text-right"},i(o.price_total),9,ke),e("td",{id:"item-"+(l+1)+"-stowagecard",class:"text-center"},i(o.stowage_card),9,Ce),e("td",{id:"item-"+(l+1)+"-comment"},i(o.comment),9,De),e("td",qe,[u((r(),d("a",{href:"javascript:void(0);",class:"btn-semti-tool",style:{padding:"4px 5px"},"data-toggle":"modal","data-target":"#modal-item-form",onClick:f=>_.edit(l,o.received_quantity,o.stowage_card,o.comment)},Se,8,je)),[[w,"Anotar informaci\xF3n de este Rengl\xF3n"]])])]))),128))])])])],2),e("div",{class:h(["row",t.items_loading||t.table_oc?"hidden":""])},[e("div",Ae,[e("table",Oe,[Ne,e("tbody",null,[(r(!0),d(g,null,b(t.items,(o,l)=>(r(),d("tr",{key:o.id},[e("td",Re,i(l+1),1),e("td",null,[u((r(),d("a",{class:"show-lnk",href:"javascript:void(0);","data-toggle":"modal","data-target":"#modal-item-details",onClick:f=>_.show(l)},[p(i(o.item_description),1)],8,Ve)),[[w,"Click para Mostrar Detalles de este producto"]])]),e("td",Ue,i(o.um),1),e("td",Pe,i(o.product_quantity),1),e("td",{id:"item-"+(l+1)+"-received",class:"text-center"},i(o.received_quantity),9,Te),e("td",Ie,i(o.price_unit),1),e("td",{id:"item-"+(l+1)+"-pricetotal",class:"text-right"},i(o.price_total),9,ze),e("td",{id:"item-"+(l+1)+"-stowagecard",class:"text-center"},i(o.stowage_card),9,Me),e("td",{id:"item-"+(l+1)+"-comment"},i(o.comment),9,$e),e("td",Fe,[u((r(),d("a",{href:"javascript:void(0);",class:"btn-semti-tool",style:{padding:"4px 5px"},"data-toggle":"modal","data-target":"#modal-item-form",onClick:f=>_.edit(l,o.received_quantity,o.stowage_card,o.comment)},Le,8,Be)),[[w,"Anotar informaci\xF3n de este Rengl\xF3n"]])])]))),128))])])])],2)])])):m("",!0),t.show_items&&!t.items_loading?(r(),d("div",Ke,[We,e("div",He,[e("div",Ye,[e("div",Ge,[e("div",Qe,[Xe,e("select",Ze,[(r(!0),d(g,null,b(t.store_poles,(o,l)=>(r(),d(g,{key:l},[o.name!="Todos"?(r(),d("option",{key:0,value:o.abbr,onClick:v(f=>_.changePole(o.id,o.abbr),["stop"])},i(o.name),9,xe)):m("",!0)],64))),128))])])]),e("div",et,[e("div",tt,[st,e("select",ot,[(r(!0),d(g,null,b(t.projects,(o,l)=>(r(),d("option",{key:l,value:o.id,onClick:v(f=>_.changeProject(o.id),["stop"])},i(o.name),9,at))),128))])])]),e("div",it,[e("div",rt,[dt,e("select",nt,[(r(!0),d(g,null,b(t.warehouses,(o,l)=>(r(),d("option",{key:l,value:o.id,onClick:v(f=>_.changeWarehouse(o.id,o.name,o.owner),["stop"])},i(o.name),9,lt))),128))])])]),e("div",ct,[e("div",_t,[mt,u(e("input",{type:"text",name:"resp_stock",class:"form-control",disabled:t.warehouses.length>0&&t.destiny_data.warehouse_owner!="","onUpdate:modelValue":s[4]||(s[4]=o=>t.destiny_data.warehouse_owner=o)},null,8,ht),[[y,t.destiny_data.warehouse_owner]])])])]),e("div",ut,[e("div",pt,[e("div",gt,[ft,u(e("textarea",{name:"entry_comment",class:"form-control","onUpdate:modelValue":s[5]||(s[5]=o=>t.destiny_data.comment=o)},`\r
                            `,512),[[y,t.destiny_data.comment]])])])]),t.origin_data.doctype_value==="Conduce"||t.origin_data.origin!=="Despacho de Almacen"?(r(),d("div",yt,[e("div",bt,[vt,e("div",wt,[u(e("input",{class:"form-check-input",type:"radio",name:"status","onUpdate:modelValue":s[6]||(s[6]=o=>t.entry_status=o),value:"total"},null,512),[[D,t.entry_status]]),kt]),e("div",Ct,[u(e("input",{class:"form-check-input",type:"radio",name:"status","onUpdate:modelValue":s[7]||(s[7]=o=>t.entry_status=o),value:"parcial",checked:!0},null,512),[[D,t.entry_status]]),Dt])])])):m("",!0)]),e("div",qt,[S(k,{to:"/semtinel/logistics",class:"btn btn-default"},{default:A(()=>[p(" Cancelar ")]),_:1}),e("button",{class:"btn btn-primary float-end ripple","data-toggle":"modal","data-target":"#modal-entry-confirm",onClick:s[8]||(s[8]=o=>_.entryConfirm())},[jt,p("\xA0 Registrar Entrada ")])])])):m("",!0)]),e("div",Et,[e("div",St,[e("div",At,[e("div",Ot,[Nt,e("button",Rt,Ut,512)]),e("div",Pt,[e("form",null,[u(e("input",{type:"hidden",name:"idx_item",id:"idx_item","onUpdate:modelValue":s[9]||(s[9]=o=>t.item_form_data.idx=o)},null,512),[[y,t.item_form_data.idx]]),e("div",Tt,[e("div",It,[e("h6",zt,[p(" Est\xE1 Actualizando la informaci\xF3n del "),e("strong",null,"Rengl\xF3n No. "+i(t.item_form_data.number),1)])])]),e("div",Mt,[e("div",$t,[e("div",Ft,[Bt,u(e("input",{type:"number",class:h(["form-control",t.item_form_error.received_quantity?"border-error":""]),id:"received_quantity",name:"received_quantity",step:".01",min:"0","onUpdate:modelValue":s[10]||(s[10]=o=>t.item_form_data.received_quantity=o)},null,2),[[y,t.item_form_data.received_quantity]])])])]),e("div",Jt,[e("div",Lt,[e("div",Kt,[Wt,u(e("input",{type:"text",class:h(["form-control",t.item_form_error.stowage_card?"border-error":""]),id:"stowage_card",name:"stowage_card",placeholder:"C\xF3digo de la tarjeta de estiba asignada","onUpdate:modelValue":s[11]||(s[11]=o=>t.item_form_data.stowage_card=o)},null,2),[[y,t.item_form_data.stowage_card]])])])]),e("div",Ht,[e("div",Yt,[e("div",Gt,[Qt,u(e("textarea",{name:"entry_comment",class:"form-control","onUpdate:modelValue":s[12]||(s[12]=o=>t.item_form_data.comment=o)},`\r
                                    `,512),[[y,t.item_form_data.comment]])])])]),t.item_form_error.error_text!=""?(r(),d("div",Xt,[e("div",Zt,[e("h6",xt,i(t.item_form_error.error_text),1)])])):m("",!0)])]),e("div",es,[ts,e("button",{type:"button",class:"btn btn-primary btn-green ripple",disabled:t.item_form_loading,onClick:s[13]||(s[13]=v(o=>_.updateItem(),["stop"]))},[t.item_form_loading?(r(),d("i",as)):(r(),d("i",os)),p(" \xA0"+i(t.item_form_okbtn_text),1)],8,ss)])])])]),e("div",is,[e("div",rs,[e("div",ds,[e("div",ns,[ls,e("button",cs,ms,512)]),e("div",hs,[e("div",us,[e("div",ps,[gs,e("h6",fs,i(t.item_details.cod_product),1)])]),e("div",ys,[e("div",bs,[vs,e("h6",ws,i(t.item_details.oc),1)])]),t.table_oc&&t.show_details?(r(),d("div",ks,[e("div",Cs,[Ds,e("h6",qs,i(t.item_details.generic_descript.toUpperCase()),1)])])):m("",!0),!t.table_oc&&t.show_details?(r(),d("div",js,[e("div",Es,[Ss,e("h6",As,i(t.item_details.docnum),1)])])):m("",!0),e("div",Os,[e("div",Ns,[Rs,e("h6",Vs,i(t.item_details.item_description.toUpperCase()),1)])]),e("div",Us,[e("div",{class:h(t.table_oc?"col-md-6":"col-md-4")},[Ps,e("h6",Ts,i(t.item_details.um),1)],2),t.table_oc?m("",!0):(r(),d("div",{key:0,class:h(t.table_oc?"col-md-6":"col-md-4")},[Is,e("h6",zs,i(t.item_details.product_quantity),1)],2)),e("div",{class:h(t.table_oc?"col-md-6":"col-md-4")},[Ms,e("h6",$s,i(t.item_details.received_quantity),1)],2)]),e("div",Fs,[e("div",Bs,[Js,e("h6",Ls,i(t.item_details.price_unit),1)]),e("div",Ks,[Ws,e("h6",Hs,i(t.item_details.price_total),1)]),e("div",Ys,[Gs,e("h6",Qs,i(t.item_details.stowage_card),1)])]),t.item_details.comment!=""&&t.item_details.comment!=null?(r(),d("div",Xs,[e("div",Zs,[xs,e("h6",eo,i(t.item_details.comment),1)])])):m("",!0)])])])]),e("div",to,[e("div",so,[e("div",oo,[e("div",ao,[io,e("button",ro,lo,512)]),e("div",co,[t.entry_error==""?(r(),d("div",_o,[mo,e("div",ho,[e("p",null,[p(' Se registrar\xE1 una nueva Entrada desde "'),e("strong",null,i(t.origin_data.origin),1),p('" del documento No. "'),e("strong",null,i(t.origin_data.docnum_value),1),p('", con la recepci\xF3n de "'),e("strong",null,i(t.items_selected)+" Renglones",1),p('" en env\xEDo de mercancia a la obra, hacia el destino "'),e("strong",null,i(t.destiny_data.warehouse_name),1),p('".'),uo,p("\xBFConfirma que desea realizar esta operaci\xF3n? ")])])])):m("",!0),t.entry_error!=""?(r(),d("div",po,[go,e("div",fo,i(t.entry_error),1)])):m("",!0)]),e("div",yo,[bo,e("button",{type:"button",class:h(["btn ripple",t.entry_error!=""?"btn-secondary":"btn-primary"]),onClick:s[14]||(s[14]=v(o=>_.processEntry(),["stop"]))},[t.entry_loading?m("",!0):(r(),d("i",vo)),p("\xA0"+i(t.entry_okbtn_text),1)],2)])])])])],64)}const jo=j(R,[["render",wo]]);export{jo as default};
