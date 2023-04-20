<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>{{ config('app.name') }} - @yield('title')</title>
        <link rel="shortcut icon" href="themes/semtinel/img/favicon.png" />
        <style>
            @page { margin: 110px 30px 150px 30px; }
            header {
                position: fixed;
                top: -100px;
                left: 0px;
                right: 0px;
                padding: 10px 0;
                height: 100px;
                vertical-align: middle;
            }
            footer {
                position: fixed;
                bottom: -150px;
                left: 0px;
                right: 0px;
                padding: 10px 0;
                height: 100px;
                vertical-align: middle;
            }
            main {
                padding: 0;
            }
            .pagenum {
                font-size: 12px;
                font-family: Verdana, Arial, Helvetica, sans-serif;
                width: auto;
            }
            .headpage {
                border-bottom: #999 1px solid;
            }
            /*.header-page { width: 100%; text-align: center; margin: 0; padding: 0;}*/
            p { page-break-after: always; }
            p:last-child { page-break-after: never; }
            .pagenum:after {
                content: counter(page);
            }
            hr { margin: 50px auto; border-color: #ccc; }
            .page-break {
                page-break-after: always;
            }
            .row-spacer {
                font-size: 10px;
            }
            .pole {
                font-family: Verdana, Arial, Helvetica, sans-serif; 
                font-size: 16px;
                font-weight: bold;
                padding: 5px 0;
            }
            .title-document {
                font-family: Verdana, Arial, Helvetica, sans-serif; 
                font-size: 17px;
                font-weight: 600;
                padding: 5px 0;
            }
            .doc-label {
                font-size: 12px;
                font-family: Verdana, Arial, Helvetica, sans-serif;
                width: auto;
                color: rgb(90, 97, 109);
            }
            .doc-value {
                font-family: Verdana, Arial, Helvetica, sans-serif; 
                font-size: 13px;
                font-weight: 700;
                padding: 5px 0;
            }
            .table-title {
                border-bottom: rgb(141, 150, 161) 1px solid;
                padding: 5px 7px; 
                text-align: center; 
                background-color: #EFF2F9
            }
            .table-params {
                padding: 3px 7px;
                border: 1px solid rgb(141, 150, 161);
            }
            .table-cell {
                padding: 5px 7px;
                border-bottom: rgb(141, 150, 161) 1px solid;
            }
        </style>

    </head>
    <body>
        <header>
            <table class="headpage" width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                    <td valign="bottom">
                        <div class="pagenum">Fecha: {{ date('d/m/Y') }}&nbsp;&nbsp;|&nbsp;&nbsp;P&aacute;gina </div>
                        <div class="pole">Polo {{ $pole['name'] }}</div>
                    </td>
                    <td align="right" valign="top">
                        <img src="{{ public_path('/themes/semtinel/img/pdf-header.jpg') }}"/>
                    </td>
                </tr>
                <tr><td class="row-spacer" colspan="3">&nbsp;</td></tr>
            </table>
        </header>
        <main style="width:100%">
            @yield('content')
        </main>
        <footer>
            {{--  CERTIFY  --}}
            <table width="100%" border="1" cellpadding="0" cellspacing="0" style="margin-top: 30px">
                <tr>
                    <td width="35%" class="table-params">
                        <span class="doc-label">Certifica (Nombre y Apellidos):</span><br>
                        <span style="font-size: 24px">&nbsp;</span>
                    </td>
                    <td width="35%" class="table-params">
                        <span class="doc-label">Cargo:</span><br>
                        <span style="font-size: 24px"">&nbsp;</span>
                    </td>
                    <td class="table-params">
                        <span class="doc-label">Firma:</span><br>
                        <span style="font-size: 24px">&nbsp;</span>
                    </td>
                </tr>
            </table>
        </footer>    
    </body>
</html>