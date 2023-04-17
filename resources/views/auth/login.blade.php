<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Semtinel') }}</title>
    <link rel="shortcut icon" href="themes/semtinel/img/favicon.png" />

    <!-- Font Awesome -->
    <link rel="stylesheet" href="themes/semtinel/vendor/fas-620/css/all.min.css">
    <!-- Material Design Icons -->
    <link rel="stylesheet" href="themes/semtinel/vendor/mdi-6.9/css/materialdesignicons.min.css">
    <!-- icheck bootstrap -->
    <link rel="stylesheet" href="themes/adminlte320/plugins/icheck-bootstrap/icheck-bootstrap.min.css">
    <!-- Scripts -->
    @vite(['resources/sass/app.scss', 'resources/js/login.js'],'build')
    <!-- Theme style -->
    <link rel="stylesheet" href="themes/adminlte320/dist/css/adminlte.min.css">

    <!-- App style -->
    <link rel="stylesheet" href="themes/semtinel/css/login.css">

</head>
<body class="hold-transition login-page particle-network-animation">
    <div id="app" style="position: absolute;">
        <div class="container pr-0 h-100">
            <div class="row pr-0 h-100">
                <div class="col-12 pr-0 h-100 aligns-items-center justify-content-end">

                    <div id="login">
                        <div class="login-box float-end">
                            <div class="login-logo">
                                <a href="{{ route('app') }}"><b>Semtinel</b></a>
                            </div>
                            <!-- /.login-logo -->
                            <div class="card p-2">
                                <div class="card-body login-card-body">
                                    <p class="login-box-icon text-center">
                                        <img src="themes/semtinel/img/semtinel.png" alt="Login" width="72">
                                    </p>
                                    <p class="login-box-msg">Plataforma de Gestión Empresarial</p>

                                    <h5 class="error text-center" 
                                        v-show="error_txt != ''" 
                                        v-html="error_txt">
                                    </h5>
                
                                    <form id="login-form" method="POST" action="{{ route('login') }}">
                                    @csrf
                                    <div class="input-group mb-3">
                                    <input id="username" name="username" type="text"  
                                        class="form-control @error('username') is-invalid @enderror" 
                                        v-model="auth.username" 
                                        placeholder="Usuario" 
                                        required autofocus>
                                    <div class="input-group-append">
                                        <div class="input-group-text">
                                        <span class="fas fa-user"></span>
                                        </div>
                                    </div>
                                    </div>
                                    @error('username')
                                        <span class="invalid-feedback" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                    <div class="input-group mb-3">
                                    <input id="password" name="password" type="password" 
                                        class="form-control @error('password') is-invalid @enderror" 
                                        v-model="auth.password"
                                        placeholder="Contrase&ntilde;a" 
                                        v-on:keyup.enter="login('ldap')"
                                        required>
                                    <div class="input-group-append">
                                        <div class="input-group-text">
                                        <span class="fas fa-lock"></span>
                                        </div>
                                    </div>
                                    </div>
                                    @error('password')
                                        <span class="invalid-feedback" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                
                                    <div class="text-center mb-3 mt-4">
                                        <button type="button" class="btn btn-block btn-primary mb-2"
                                            :disabled="form_processing" @click="login('ldap')">
                                            <i class="mdi mdi-microsoft-windows mr-2"></i> @{{ login_windows }}
                                        </button>
                                        <button type="button" class="btn btn-block btn-secondary" 
                                            :disabled="form_processing" @click="login('auth')">
                                            <i class="fas fa-street-view mr-2"></i> @{{ login_semtinel }}
                                        </button>
                                    </div>
                                    </form>
                
                                @if (Route::has('password.request'))
                                <p class="mb-1">
                                    <a href="{{ route('password.request') }}" class="primary">Olvid&eacute; mi contrase&ntilde;a</a>
                                </p>
                                @endif

                                <p class="login-copyright text-center pt-4 pb-0 mb-0">
                                    <span>Asociación Económica Internacional</span><br>
                                    UCM - BBI
                                </p>

                                </div>
                                <!-- /.login-card-body -->
                            </div>
                        </div>
                        <!-- /.login-box -->
                    </div>

                </div>
            </div>
        </div>        
    </div>

    <div id="nodes-animation">
        <canvas id="nodes"></canvas>
    </div>

<!-- jQuery -->
<script src="themes/adminlte320/plugins/jquery/jquery.min.js"></script>
<!-- AdminLTE App -->
<script src="themes/adminlte320/dist/js/adminlte.min.js"></script>
<!-- Nodes animation -->
<script src="themes/semtinel/vendor/nodes/nodes.js"></script>
<script type="text/javascript">
var nodesjs = new NodesJs({
    id: 'nodes',
    width: window.innerWidth,
    height: window.innerHeight,
    particleSize: 2,
    lineSize: 1,
    particleColor: [255, 255, 255, 0.3],
    lineColor: [255, 255, 255],
    backgroundFrom: [10, 25, 100],
    backgroundTo: [25, 50, 150],
    backgroundDuration: 4000,
    nobg: true,
    number: window.hasOwnProperty('orientation') ? 30: 100,
    speed: 10
});
window.onresize = function () {
    nodesjs.setWidth(window.innerWidth);
    nodesjs.setHeight(window.innerHeight);
};
</script>
    
</body>
</html>