<script allowJs="true">
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";
import PageHeader from "../layouts/HeaderComponent.vue"

export default {
    data: function () {
      return {
        inventory: [],
        loading: true,
        session: JSON.parse(sessionStorage.getItem('semtinel'))
      };
    },
    components: {
        'page-header': PageHeader
    },
    methods: {
        listReload: function () {
            //this.getEntriesTable(true)
        },
        /*async getEntriesTable (reload = false) {
            let cmp = this,
                pole = localStorage.getItem('stnel_logist_pole'),
                project = localStorage.getItem('stnel_logist_project')
            this.loading = true
            let headers = {
                'User-Agent': 'testing/1.0',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + cmp.session.access_token
            }
            await fetch("http://localhost/semtinel/public/api/logistics/entries/" + pole + "/" + project + "/" + reload, {
                        method: 'GET',
                        headers: headers
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        cmp.entries = data
                        cmp.loading = false
                        if ($("#datatable").DataTable().destroy()) {
                            setTimeout(() => {
                                $("#datatable").DataTable({
                                    lengthMenu: [
                                        [10, 15, 25, 50, -1],
                                        [10, 15, 25, 50, "Todos"],
                                    ],
                                    pageLength: 10,
                                    //order: [[5, 'asc']],
                                    "columnDefs": [{
                                        "targets": 'no-sort',
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
                                        "emptyTable": "No hay información",
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
                    })
                    .catch(error => {
                        this.errorMessage = error;
                        toastr.error("Error: " + error);
                    });
        }*/
    },
    mounted() {
        let cmp = this
        // Verify login active
        if (!JSON.parse(sessionStorage.getItem('semtinel')).access_token) {
            sessionStorage.clear()
            window.document.location.href = 'http://localhost/semtinel/login'
        }
        /*let pole = localStorage.getItem('stnel_logist_pole'),
            project = localStorage.getItem('stnel_logist_project'),
            headers = {
            'User-Agent': 'testing/1.0',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + cmp.session.access_token
        }
        let user = JSON.parse(sessionStorage.getItem('semtinel'))
        fetch("http://localhost/semtinel/public/api/logistics/entries/" + pole + "/" + project + "/true", {
                method: 'GET',
                headers: headers
            })
            .then((response) => response.json())
            .then((data) => {
                cmp.entries = data;
                cmp.loading = false;
                setTimeout(() => {
                    $("#datatable").DataTable({
                        retrieve: true,
                        lengthMenu: [
                            [10, 15, 25, 50, -1],
                            [10, 15, 25, 50, "Todos"],
                        ],
                        pageLength: 10,
                        //order: [[5, 'asc']],
                        "columnDefs": [{
                            "targets": 'no-sort',
                            "orderable": false,
                            "order": []
                        }],
                        language: {
                            "decimal": "",
                            "emptyTable": "No hay información",
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
            })
            .catch(error => {
                this.errorMessage = error;
                toastr.error("Error: " + error);
            });*/
    },
};
</script>

<template>
    <page-header 
        :pagetitle="'Inventarios en obra'"
        :breadcrumbs="false">
    </page-header>

    <div class="card">
        <div class="card-header p-2">
        <ul class="nav nav-pills">
            <li class="nav-item"><a class="nav-link active" href="#products" data-toggle="tab">Productos</a></li>
            <li class="nav-item"><a class="nav-link" href="#timeline" data-toggle="tab">Línea de tiempo</a></li>
            <li class="nav-item"><a class="nav-link" href="#lastentries" data-toggle="tab">Últimas entradas</a></li>
        </ul>
        </div><!-- /.card-header -->
        <div class="card-body">
        <div class="tab-content">
            <div class="tab-pane active" id="products">
                
                


                <!-- Products table -->
                
                <table id="datatable" class="table table-striped">
                    <thead>
                    <tr>
                        <th width="5%" class="text-center no-sort">No.</th>
                        <th>Descripción</th>
                        <th width="15%">Origen</th>
                        <th width="15%">Orden Compra</th>
                        <th width="15%">Destino</th>
                        <th width="10%" class="text-center">Fecha</th>
                        <th width="10%" class="no-sort text-center">Estado</th>
                        <th width="8%" class="no-sort text-center">Confirmada</th>
                    </tr>
                    </thead>
                    <tbody>
                    
                    </tbody>
                </table>
                <!--  / Products table -->




            </div>
            <!-- /.tab-pane -->

            <div class="tab-pane" id="timeline">
                <!-- The timeline -->
                <div class="timeline timeline-inverse">
                    <!-- timeline time label -->
                    <div class="time-label">
                    <span class="bg-danger">
                        10 Feb. 2014
                    </span>
                    </div>
                    <!-- /.timeline-label -->
                    <!-- timeline item -->
                    <div>
                    <i class="fas fa-envelope bg-primary"></i>

                    <div class="timeline-item">
                        <span class="time"><i class="far fa-clock"></i> 12:05</span>

                        <h3 class="timeline-header"><a href="#">Support Team</a> sent you an email</h3>

                        <div class="timeline-body">
                        Etsy doostang zoodles disqus groupon greplin oooj voxy zoodles,
                        weebly ning heekya handango imeem plugg dopplr jibjab, movity
                        jajah plickers sifteo edmodo ifttt zimbra. Babblely odeo kaboodle
                        quora plaxo ideeli hulu weebly balihoo...
                        </div>
                        <div class="timeline-footer">
                        <a href="#" class="btn btn-primary btn-sm">Read more</a>
                        <a href="#" class="btn btn-danger btn-sm">Delete</a>
                        </div>
                    </div>
                    </div>
                    <!-- END timeline item -->
                    <!-- timeline item -->
                    <div>
                    <i class="fas fa-user bg-info"></i>

                    <div class="timeline-item">
                        <span class="time"><i class="far fa-clock"></i> 5 mins ago</span>

                        <h3 class="timeline-header border-0"><a href="#">Sarah Young</a> accepted your friend request
                        </h3>
                    </div>
                    </div>
                    <!-- END timeline item -->
                    <!-- timeline item -->
                    <div>
                    <i class="fas fa-comments bg-warning"></i>

                    <div class="timeline-item">
                        <span class="time"><i class="far fa-clock"></i> 27 mins ago</span>

                        <h3 class="timeline-header"><a href="#">Jay White</a> commented on your post</h3>

                        <div class="timeline-body">
                        Take me to your leader!
                        Switzerland is small and neutral!
                        We are more like Germany, ambitious and misunderstood!
                        </div>
                        <div class="timeline-footer">
                        <a href="#" class="btn btn-warning btn-flat btn-sm">View comment</a>
                        </div>
                    </div>
                    </div>
                    <!-- END timeline item -->
                    <!-- timeline time label -->
                    <div class="time-label">
                    <span class="bg-success">
                        3 Jan. 2014
                    </span>
                    </div>
                    <!-- /.timeline-label -->
                    <!-- timeline item -->
                    <div>
                    <i class="fas fa-camera bg-purple"></i>

                    <div class="timeline-item">
                        <span class="time"><i class="far fa-clock"></i> 2 days ago</span>

                        <h3 class="timeline-header"><a href="#">Mina Lee</a> uploaded new photos</h3>

                        <div class="timeline-body">
                        <img src="https://placehold.it/150x100" alt="...">
                        <img src="https://placehold.it/150x100" alt="...">
                        <img src="https://placehold.it/150x100" alt="...">
                        <img src="https://placehold.it/150x100" alt="...">
                        </div>
                    </div>
                    </div>
                    <!-- END timeline item -->
                    <div>
                    <i class="far fa-clock bg-gray"></i>
                    </div>
                </div>
            </div>
            <!-- /.tab-pane -->
        </div>
        <!-- /.tab-content -->
        </div><!-- /.card-body -->
    </div>
</template>