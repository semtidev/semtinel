<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- CSRF Token -->
  <meta name="csrf-token" content="{{ csrf_token() }}">

  <title>{{ config('app.name', 'Semtinel') }} - Logística</title>
  <link rel="shortcut icon" href="public/themes/semtinel/img/favicon.png" />
  
  <!-- Scripts -->
  @vite(['public/themes/semtinel/css/app.css', 'resources/js/app.js'])
  
  <!-- Font Awesome -->
  <link rel="stylesheet" href="public/themes/semtinel/vendor/fas-620/css/all.min.css">
  <!-- Material Design Icons -->
  <link rel="stylesheet" href="public/themes/semtinel/vendor/mdi-6.9/css/materialdesignicons.min.css">
  <!-- Select2 Plugin -->
  <link rel="stylesheet" href="public/themes/adminlte320/plugins/select2/css/select2.min.css">
  <link rel="stylesheet" href="public/themes/adminlte320/plugins/select2-bootstrap4-theme/select2-bootstrap4.min.css">
  <!-- Floating Vue -->
  <link rel="stylesheet" href="node_modules/floating-vue/dist/style.css">
  <!-- adminlte-->
  <link rel="stylesheet" href="public/themes/adminlte320/dist/css/adminlte.min.css">
  <!-- Toastr -->
  <link rel="stylesheet" href="public/themes/adminlte320/plugins/toastr/toastr.min.css">
  <!-- App style-->
  <link rel="stylesheet" href="public/themes/semtinel/css/app.css">

  @yield('level_css')

</head>
<body class="hold-transition sidebar-mini layout-fixed layout-navbar-fixed">
  
  <!-- App container -->
  <div id="app">
    <!-- App wrapper -->
    <div class="wrapper">
      <!-- Navbar -->
      <nav class="main-header navbar navbar-expand navbar-white navbar-light">
        <!-- Left navbar links -->
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
          </li>
          <li class="nav-item d-none d-sm-inline-block">
            <a href="{{ url('/') }}" class="nav-link align-middle">AEI UCM - BBI</a>
          </li>
          <li class="nav-item d-none d-sm-inline-block">
            <router-link 
              to="/semtinel/logistics" 
              class="nav-link align-middle active"
              v-on:click="setAppActive()">Logística</router-link>
          </li>
        </ul>

        <!-- Right navbar links -->
        <ul class="navbar-nav ml-auto">

          <!-- User Dropdown Menu -->
          <li class="nav-item dropdown">
            <a class="nav-link" data-toggle="dropdown">
              @isset($_SESSION['semtinel'])
                @php
                    echo $_SESSION['semtinel']['user']['first_name'] . ' ' . $_SESSION['semtinel']['user']['last_name'];
                @endphp
              @endisset
            </a>
            <div class="dropdown-menu dropdown-menu-right" style="left: inherit; right: 0px;">
              
              <a href="logout" class="dropdown-item">
                <i class="mdi mdi-power-plug-off"></i>&nbsp;Desconectar
              </a>

              <a href="admin" class="dropdown-item">
                <i class="mdi mdi-cog"></i>&nbsp;Administrador
              </a>
              
            </div>
          </li>
          
          <li class="nav-item">
            <a class="nav-link" data-widget="fullscreen" href="#" role="button" v-tooltip="'Pantalla Completa'">
              <i class="fas fa-expand-arrows-alt"></i>
            </a>
          </li>

          <li class="nav-item">
            <a 
              class="nav-link" 
              href="javascript:void(0);" 
              role="button"
              data-toggle="modal" 
              data-target="#modal-role-cart"
              v-tooltip="'Carrito de Productos'"
              v-on:click="$root.calcTotalsCart()">
              <i class="fas fa-shopping-cart"></i>
              <span class="badge badge-warning navbar-badge" v-if="$root.cart_quantity > 0">@{{ $root.cart_quantity }}</span>
            </a>
          </li>

          <li class="nav-item">
            <a 
              class="nav-link" 
              data-widget="control-sidebar" 
              data-controlsidebar-slide="true" 
              href="#" 
              role="button"
              v-tooltip="'Configuración'">
              <i class="fas fa-cog"></i>
            </a>
          </li>
        </ul>
      </nav>
      <!-- /.navbar -->

      <!-- Main Sidebar Container -->
      <aside class="main-sidebar sidebar-dark-primary elevation-4">
        <!-- Brand Logo -->
        <a href="{{ url('/') }}" class="brand-link">
          <img src="public/themes/semtinel/img/semtinel.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-1">
          <span class="brand-text font-weight-light">Semtinel</span>&nbsp;<span class="logo-app-version">v1.0</span>
        </a>

        <!-- Sidebar -->
        <div class="sidebar" style="overflow-y: auto;">

          <!-- Sidebar Menu -->
          <logistics-sidebar></logistics-sidebar>
          <!-- /.sidebar-menu -->
        </div>
        <!-- /.sidebar -->
      </aside>

      <!-- Content Wrapper. Contains page content -->
      <div class="content-wrapper px-2">
        <!-- Content Header (Page header) -->
        @yield('content-header')

        <!-- Main content -->
        <section class="content">

            <main class="py-3">
                @yield('content')
            </main>

        </section>
        <!-- /.content -->
      </div>
      <!-- /.content-wrapper -->

      <footer class="main-footer">
        <div class="float-right d-none d-sm-block">
          Plataforma de Gesti&oacute;n Empresarial <b>Semtinel - Logística</b> v1.0
        </div>
        Copyright &copy; {{ date('Y') }} <b>A.E.I. UCM</b> - <b>BBI</b>. Servicios Informáticos.
      </footer>

      <!-- Control Sidebar -->
      <aside class="control-sidebar control-sidebar-dark">
        <!-- Control sidebar content goes here -->
        <control-sidebar></control-sidebar>
      </aside>
      <!-- /.control-sidebar -->
    </div>
    <!-- ./wrapper -->

    <!-- Modal Cart -->
    <div class="modal fade" id="modal-role-cart">
      <div class="modal-dialog modal-lg">
          <div class="modal-content">
              <div class="modal-header header-info">
                  <h4 class="modal-title"><span class="mdi mdi-cart"></span> Carrito de Productos</h4>
                  <button type="button" 
                      ref="CartClose" 
                      class="close"
                      data-dismiss="modal" 
                      aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                  </button>
              </div>
              <div class="modal-body rounded-bottom py-1 px-3">
                  <div class="row">
                      <div class="col-md-12">
                        <div class="col-12 py-5 text-center empty-table" v-show="$root.cart_quantity == 0">
                          <h5 class="text-navy">
                            Ning&uacute;n producto ha sido agregado al carrito.
                          </h5>
                          <h6>
                            Para agregar productos al carrito diríjase al Inventario para seleccionar los que desee.
                          </h6>
                          <br>
                          <a 
                            href="javascript:void(0);" 
                            class="btn btn-secondary"
                            v-on:click.stop="$root.goToInventory()">Ir al Inventario de Productos</a>
                        </div>
                        <table class="table table-striped" v-show="$root.cart_quantity > 0">
                          <thead>
                          <tr>
                              <th>Descripci&oacute;n</th>
                              <th width="80" class="text-center">UM</th>
                              <th width="70" class="text-center">Ctdad</th>
                              <th width="80" class="text-right">Precio</th>
                              <th width="80" class="text-right">Total</th>
                              <th width="50"></th>
                          </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(item, idx) in $root.cart_items" :key="item.id">
                              <td>@{{ item.description }}</td>
                              <td class="text-center">@{{ item.um }}</td>
                              <td class="text-center">@{{ item.quantity }}</td>
                              <td class="text-right">@{{ item.price_unit }}</td>
                              <td class="text-right">@{{ item.price_total }}</td>
                              <td class="text-right">
                                  <a href="javascript:void(0);"
                                      class="btn-semti-tool"
                                      style="padding: 4px 5px;"
                                      v-tooltip="'Eliminar este producto del carrito'"
                                      v-on:click.stop="$root.removeFromCart(idx)">
                                      <span class="mdi mdi-trash-can-outline mdi-18px text-danger"></span>
                                  </a>
                              </td>
                            </tr>
                          </tbody>
                          <tfoot>
                            <tr>
                              <td><strong>TOTAL</strong></td>
                              <td></td>
                              <td class="text-center"><strong>@{{ $root.cart_totals.quantity }}</strong></td>
                              <td></td>
                              <td class="text-right"><strong>$@{{ parseFloat($root.cart_totals.price_total).toFixed(2) }}</strong></td>
                              <td></td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                  </div>
                </div>
              <div class="modal-footer justify-content-between" v-show="$root.cart_quantity > 0">
                  <button type="button" class="btn btn-default ripple" data-dismiss="modal">Cancelar</button>
                  <button type="button" 
                    class="btn btn-primary ripple btn-secondary"
                    v-on:click.stop="$root.goToOutput()">
                      <i class="mdi mdi-cart-arrow-right"></i>
                      &nbsp;Crear Salida
                  </button>
              </div>
          </div>
      </div>
    </div>
    <!-- /.Modal Cart -->

  </div>

  <!-- jQuery -->
  <script src="public/themes/adminlte320/plugins/jquery/jquery.min.js"></script>
  <!-- Bootstrap 4 -->
  <script src="public/themes/adminlte320/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
  <!-- Select2 Plugin -->
  <script src="public/themes/adminlte320/plugins/select2/js/select2.full.min.js"></script>
  <!-- AdminLTE App -->
  <script src="public/themes/adminlte320/dist/js/adminlte.min.js"></script>
  <!-- Toastr -->
  <script src="public/themes/adminlte320/plugins/toastr/toastr.min.js"></script>
  <!-- App Script -->
  <script src="public/themes/semtinel/js/app.js"></script>
  <script src="public/themes/semtinel/js/buttons-ripple.js"></script>

  @yield('level_js')

</body>
</html>
