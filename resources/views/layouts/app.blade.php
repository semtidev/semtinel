<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- CSRF Token -->
  <meta name="csrf-token" content="{{ csrf_token() }}">

  <title>{{ config('app.name', 'Semtinel') }}</title>
  <link rel="shortcut icon" href="themes/semtinel/img/favicon.png" />
    
  <!-- Vendor CSS Files -->
  <link href="themes/semtinel/vendor/aos/aos.css" rel="stylesheet">
  <link href="themes/semtinel/vendor/bootstrap-lib/bootstrap.min.css" rel="stylesheet">
  <link href="themes/semtinel/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">

  <!-- Template Main CSS File -->
  <link href="themes/semtinel/css/style.css" rel="stylesheet">

  @yield('level_css')

</head>
<body>
  
  <!-- ======= Header ======= -->
  <header id="header" class="header fixed-top">
    <div class="container-fluid container-xl d-flex align-items-center justify-content-between">

      <a href="index.html" class="logo d-flex align-items-center">
        <img src="themes/semtinel/img/logo-white.png" alt="">
        <span>Semtinel</span>
      </a>

      <nav id="navbar" class="navbar">
        <ul>
          <li><a class="nav-link active" href="{{ url('/') }}">Portal</a></li>
          @if (array_key_exists('Logística', $_SESSION['semtinel']['systems']))
          <li><a class="nav-link" href="{{ url('/logistics') }}">Log&iacute;stica</a></li>
          @endif
          <li class="dropdown">
            <a href="javascript:void(0);">
              <span>
                @isset($_SESSION['semtinel'])
                  @php
                      echo $_SESSION['semtinel']['user']['first_name'] . ' ' . $_SESSION['semtinel']['user']['last_name'];
                  @endphp
                @endisset
              </span>&nbsp;<i class="bi bi-chevron-down mt-1"></i>
            </a>
            <ul>
              <li><a href="logout">Cerrar Sesi&oacute;n</a></li>
              @can('app.web.admin')
              <li><a href="admin">Administraci&oacute;n</a></li>
              @endcan
            </ul>
          </li>
        </ul>
        <i class="bi bi-list mobile-nav-toggle"></i>
      </nav><!-- .navbar -->

    </div>
  </header><!-- End Header -->
  
  <main>
      @yield('content')
  </main>

  <a href="#" class="back-to-top d-flex align-items-center justify-content-center">
    <i class="bi bi-arrow-up-short"></i>
  </a>

  <!-- Vendor JS Files -->
  <script src="themes/semtinel/vendor/aos/aos.js"></script>
  <script src="themes/semtinel/vendor/bootstrap-lib/bootstrap.bundle.min.js"></script>

  <!-- Template Main JS File -->
  <script src="themes/semtinel/js/main.js"></script>

  @yield('level_js')

</body>
</html>
