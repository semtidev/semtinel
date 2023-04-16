<script allowJs="true">
export default {
    props: {
        history: {
            type: Object,
            default: () => {},
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
            default: ''
        }
    },
    methods: {
      getDateTimeline: function (date) {
        const months = {
          1: 'Ene.',
          2: 'Feb.',
          3: 'Mar.',
          4: 'Abr.',
          5: 'May.',
          6: 'Jun.',
          7: 'Jul.',
          8: 'Ago.',
          9: 'Sep.',
          10: 'Oct.',
          11: 'Nov.',
          12: 'Dic.',
        },
        date_arr = date.split('-');
        return parseInt(date_arr[2]) + " " + months[parseInt(date_arr[1])] + " " + date_arr[0]; 
      },
      openScanner: function (path) {
          window.open('http://localhost/semtinel/storage/app/public/' + path, '_blank', 'noreferrer')
      },
      docPdf: function(entry) {
          window.open('http://localhost/semtinel/public/api/logistics/pdf/entry/' + entry, '_blank', 'noreferrer')
      },
    }
};
</script>
<template>
    <!-- The timeline -->
    <!-- Description -->
    <div class="row" v-if="description != ''">
        <div class="col-12 pt-2 pb-3">
            <h5>{{ description }}</h5>
        </div>
    </div>
    
    <!-- loading -->
    <div class="row" :class="!history_loading ? 'hidden' : ''">
        <div class="col-12 text-center pt-2 pb-3 loading-table">
            <span class="mdi mdi-loading mdi-spin mdi-36px">&nbsp;Cargando historial...</span>
        </div>
    </div>
    <div class="row" :class="(history_empty && !history_loading) ? '' : 'hidden'">
        <div class="col-12 text-center pt-2 pb-3 empty-table">
            <h6>Ning&uacute;na actividad encontrada en este periodo</h6>
        </div>
    </div>
    <div 
      class="timeline timeline-inverse"
      :class="history_loading ? 'hidden' : ''" 
      v-if="!history_empty">
        
        <!-- timeline time label -->
        <template v-for="(item, idx) in history" :key="idx">
          <div class="time-label">
              <span class="bg-gradient-orange px-2 text-white"> {{ getDateTimeline(idx) }} </span>
          </div>
          <!-- /.timeline-label -->
          <!-- timeline item -->
          <template v-for="(node, node_idx) in item" :key="node_idx">
            <div v-if="node.node_type == 'create-entry'">
              <i class="mdi mdi-truck-check mdi-18px bg-primary"></i>

              <div class="timeline-item">
                <span class="time"><i class="far fa-clock"></i> {{ node.hour }}</span>

                <h3 class="timeline-header timeline-gray-light" v-if="node.attach_path != null && node.attach_path != ''">
                    <strong>Entrada Creada</strong> desde el documento <a 
                                                href="javascript:void(0);" 
                                                v-on:click.stop="openScanner(node.attach_path)">
                                                {{ node.document_number }}
                                                </a> por <strong><a 
                                                                    :href="'mailto:' + node.created_by_email">
                                                                    {{ node.created_by_name }}</a></strong>
                </h3>
                <h3 class="timeline-header timeline-gray-light" v-else>
                    <strong>Entrada Creada</strong>  desde el documento <a 
                                                href="javascript:void(0);" 
                                                v-on:click.stop="docPdf(node.id)">{{ node.document_number }}
                                                </a> por <strong><a 
                                                                    :href="'mailto:' + node.created_by_email">
                                                                    {{ node.created_by_name }}</a></strong>
                </h3>

                <div class="timeline-body timeline-gray-light p-3">
                    <!-- info row -->
                    <div class="row invoice-info">
                        <div class="col-sm-3 invoice-col">
                            <div class="form-group">
                                <label class="mb-1">Origen</label>
                                <h6 class="p-0"><strong>{{ node.origin }}</strong></h6>
                            </div>
                            <div class="form-group">
                                <label class="mb-1">Orden de Compra</label>
                                <h6 class="p-0"><strong>{{ node.oc }}</strong></h6>
                            </div>
                        </div>
                        <!-- /.col -->
                        <div class="col-sm-3 invoice-col">
                            <div class="form-group">
                                <label class="mb-1">Destino</label>
                                <h6 class="p-0"><strong>{{ node.warehouse_name }}</strong></h6>
                            </div>
                            <div class="form-group">
                                <label class="mb-1">Responsable</label>
                                <h6 class="p-0"><strong>{{ node.warehouse_owner }}</strong></h6>
                            </div>
                        </div>
                        <!-- /.col -->
                        <div class="col-sm-3 invoice-col">
                            <div class="form-group">
                                <label class="mb-1">Estado</label><br>
                                <h6 class="p-0"><strong>Entrega {{ node.status }}</strong></h6>
                            </div>
                            <div class="form-group">
                                <label class="mb-1">Confirmada</label><br>
                                <h6 class="p-0"><strong>{{ node.confirm }}</strong></h6>
                            </div>
                        </div>
                        <!-- /.col -->
                    </div>
                    <!-- /.row -->
                </div>
              </div>
            </div>

            <div v-if="node.node_type == 'cancel-entry'">
              <i class="fas fa-trash-alt bg-danger"></i>

              <div class="timeline-item">
                  <span class="time"><i class="far fa-clock"></i> {{ node.hour }}</span>

                  <h3 class="timeline-header timeline-gray-light border-0">
                      <strong>Entrada Cancelada</strong> No. <a 
                                                  href="javascript:void(0);" 
                                                  v-on:click.stop="openScanner(node.attach_path)">{{ node.document_number }}
                                                  </a> por <strong><a 
                                                                    :href="'mailto:' + node.cancel_by_email">
                                                                    {{ node.cancel_by_name }}</a></strong>
                  </h3>
              </div>
            </div>

            <div v-if="node.node_type == 'confirm-entry'">
              <i class="fas fa-check bg-success"></i>

              <div class="timeline-item">
                  <span class="time"><i class="far fa-clock"></i> {{ node.hour }}</span>

                  <h3 class="timeline-header timeline-gray-light border-0">
                      <strong>Entrada Confirmada</strong> No. <a 
                                                  href="javascript:void(0);" 
                                                  v-on:click.stop="openScanner(node.attach_path)">{{ node.document_number }}
                                                  </a> por <strong><a 
                                                                    :href="'mailto:' + node.confirm_by_email">
                                                                    {{ node.confirm_by_name }}</a></strong>
                  </h3>
              </div>
            </div>

            <div v-if="node.node_type == 'attach-entry'">
              <i class="fas fa-paperclip bg-purple"></i>

              <div class="timeline-item">
                  <span class="time"><i class="far fa-clock"></i> {{ node.hour }}</span>

                  <h3 class="timeline-header timeline-gray-light border-0">
                      <strong>Archivo adjuntado</strong> a la Entrada <strong>{{ node.document_number }}</strong> por <strong><a 
                                                                    :href="'mailto:' + node.attach_by_email">
                                                                    {{ node.attach_by_name }}</a></strong>
                  </h3>

                  <div class="timeline-body timeline-gray-light px-3 pb-0">
                    <!-- info row -->
                    <div class="row invoice-info">
                        <div class="col-12 invoice-col">
                            <div class="form-group" >
                                <label class="mb-1">Click para Abrir</label><br>
                                <a href="javascript:void(0);" 
                                    v-if="node.attach_path != '' && node.attach_path != null && node.attach_type == 'pdf'"
                                    v-on:click.stop="openScanner(node.attach_path)">
                                    <img src="../../../../public/themes/semtinel/img/icon-pdf2.png" alt="Documento Escaneado" v-tooltip="'Click para abrir'"/>
                                </a>
                                <a href="javascript:void(0);" 
                                    v-else-if="node.attach_path != '' && node.attach_path != null && node.attach_type == 'png'"
                                    v-on:click.stop="openScanner(node.attach_path)">
                                    <img src="../../../../public/themes/semtinel/img/icon-png.png" alt="Documento Escaneado" v-tooltip="'Click para abrir'"/>
                                </a>
                                <a href="javascript:void(0);" 
                                    v-else-if="node.attach_path != '' && node.attach_path != null && (node.attach_type == 'jpg' || node.attach_type == 'jpeg')"
                                    v-on:click.stop="openScanner(node.attach_path)">
                                    <img src="../../../../public/themes/semtinel/img/icon-jpg.png" alt="Documento Escaneado" v-tooltip="'Click para abrir'"/>
                                </a>
                            </div>
                        </div>
                        <!-- /.col -->
                    </div>
                    <!-- /.row -->
                </div>
              </div>
            </div>

            <div v-if="node.node_type == 'product-add'">
              <i class="mdi mdi-plus mdi-18px bg-success"></i>

              <div class="timeline-item">
                <span class="time"><i class="far fa-clock"></i> {{ node.hour }}</span>

                <h3 class="timeline-header timeline-gray-light" v-if="node.attach_path != null && node.attach_path != ''">
                    <strong>Recepc&oacute;n del Producto</strong> en la Entrada <a 
                                                href="javascript:void(0);" 
                                                v-on:click.stop="openScanner(node.attach_path)">
                                                {{ node.document_number }}
                                                </a> por <strong><a 
                                                                    :href="'mailto:' + node.created_by_email">
                                                                    {{ node.created_by_name }}</a></strong>
                </h3>
                <h3 class="timeline-header timeline-gray-light" v-else>
                    <strong>Recepci&oacute;n del Producto</strong> en la Entrada <a 
                                                href="javascript:void(0);" 
                                                v-on:click.stop="docPdf(node.id)">{{ node.document_number }}
                                                </a> por <strong><a 
                                                                    :href="'mailto:' + node.created_by_email">
                                                                    {{ node.created_by_name }}</a></strong>
                </h3>

                <div class="timeline-body timeline-gray-light p-3">
                    <!-- info row -->
                    <div class="row invoice-info">
                        <div class="col-sm-6 invoice-col">
                            <div class="form-group">
                                <label class="mb-1">Origen</label>
                                <h6 class="p-0"><strong>{{ node.origin }}</strong></h6>
                            </div>
                            <div class="form-group">
                                <label class="mb-1">Orden de Compra</label>
                                <h6 class="p-0"><strong>{{ node.oc }}</strong></h6>
                            </div>
                            <div class="form-group">
                                <label class="mb-1">Unidad Medida</label><br>
                                <h6 class="p-0"><strong>{{ node.um }}</strong></h6>
                            </div>
                        </div>
                        <!-- /.col -->
                        <div class="col-sm-6 invoice-col">
                            <div class="form-group">
                                <label class="mb-1">Destino</label>
                                <h6 class="p-0"><strong>{{ node.warehouse_name }}</strong></h6>
                            </div>
                            <div class="form-group">
                                <label class="mb-1">Responsable</label>
                                <h6 class="p-0"><strong>{{ node.warehouse_owner }}</strong></h6>
                            </div>
                            <div class="form-group">
                                <label class="mb-1">Cantidad</label><br>
                                <h6 class="p-0"><strong>{{ node.received_quantity }}</strong></h6>
                            </div>
                        </div>
                        <!-- /.col -->
                    </div>
                    <!-- /.row -->
                </div>
              </div>
            </div>

          </template>
          <!-- END timeline item -->
        </template>
        
        <div>
            <i class="far fa-clock bg-gray"></i>
        </div>
    </div>
</template>
