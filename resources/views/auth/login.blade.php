<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Semtinel') }}</title>
    <link rel="shortcut icon" href="public/themes/semtinel/img/favicon.png" />

    <!-- Font Awesome -->
    <link rel="stylesheet" href="public/themes/semtinel/vendor/fas-620/css/all.min.css">
    <!-- Material Design Icons -->
    <link rel="stylesheet" href="public/themes/semtinel/vendor/mdi-6.9/css/materialdesignicons.min.css">
    <!-- Scripts -->
    @vite(['resources/js/login.js'])
    <link rel="stylesheet" href="public/themes/semtinel/vendor/bootstrap-lib/bootstrap4.min.css">
    <!-- App style -->
    <link rel="stylesheet" href="public/themes/semtinel/css/login.css">

</head>
<body class="img js-fullheight" style="background-image: url(public/themes/semtinel/img/login.png);">
	<div id="login">
        <section class="ftco-section" style="position: absolute;">
            <div class="container h-100 aligns-items-center">
                <div class="row h-100 justify-content-center">
                    <div class="col-md-6 text-center h-100 mb-5">
                        <h2 class="heading-section">
                            <img src="public/themes/semtinel/img/logo-white.png" alt="">
                            <span>Semtinel</span>
                        </h2>
                    </div>
                </div>
                <div class="row justify-content-center">
                    <div class="col-md-6 col-lg-4">
                        <div class="login-wrap p-0">
                            <h3 class="mb-4 text-center">Inicie Sesi&oacute;n para acceder</h3>

                            <h5 class="error text-center" 
                                v-show="error_txt != ''" 
                                v-html="error_txt">
                            </h5>

                            <form id="login-form" method="POST" action="{{ route('login') }}">
                                @csrf
                                <div class="form-group">
                                    <input type="text" 
                                        class="form-control" 
                                        placeholder="Usuario"
                                        v-model="auth.username" 
                                        required>
                                </div>
                                <div class="form-group mt-3">
                                    <input type="password" 
                                        id="password-field" 
                                        class="form-control" 
                                        placeholder="Contrase&ntilde;a"
                                        v-model="auth.password"
                                        v-on:keyup.enter="login('auth')" 
                                        required>
                                    <span toggle="#password-field" class="fa fa-fw fa-eye field-icon toggle-password"></span>
                                </div>
                                <div class="form-group mt-4">
                                    <button type="button" class="form-control btn btn-primary px-3"
                                        :disabled="form_processing" @click="login('ldap')">
                                        <i class="mdi mdi-loading mdi-spin" v-if="form_processing && form_method == 'ldap'"></i>&nbsp;&nbsp;
                                        <i class="mdi mdi-microsoft-windows" v-else></i>&nbsp;&nbsp;
                                        @{{ login_windows }}
                                    </button>
                                    <button type="button" class="form-control btn btn-secondary px-3 mt-3"
                                        :disabled="form_processing" @click="login('auth')">
                                        <i class="mdi mdi-loading mdi-spin" v-if="form_processing && form_method == 'auth'"></i>&nbsp;&nbsp;
                                        <i class="fas fa-street-view" v-else></i>&nbsp;&nbsp;
                                        @{{ login_semtinel }}
                                    </button>
                                </div>
                            </form>
                            <p class="w-100 text-center mt-5">&copy; A.E.I. UCM - BBI&nbsp;&nbsp;/&nbsp;&nbsp;Servicios Inform&aacute;ticos {{ date('Y') }}</p>          
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>

    <script src="public/themes/semtinel/vendor/bootstrap-lib/jquery.min.js"></script>
    <script src="public/themes/semtinel/vendor/bootstrap-lib/popper.js"></script>
    <script src="public/themes/semtinel/vendor/bootstrap-lib/bootstrap.min.js"></script>
    <script src="public/themes/semtinel/js/login.js"></script>
    
</body>
</html>