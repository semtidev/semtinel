@extends('layouts.app')

@inject('treestructure', 'App\Services\TreeService')

@section('level_css')
<link rel="stylesheet" href="{{ asset('themes/semtinel/css/tree.css') }}">
@endsection

@section('content-header')
<section class="content-header">
    <div class="container-fluid">
      <div class="row mb-2">
        <div class="col-sm-6">
          <h1>Arbol de estructuras</h1>
        </div>
        <div class="col-sm-6">
          <ol class="breadcrumb float-sm-right">
            <li class="breadcrumb-item"><a href="{{ url('/') }}">Inicio</a></li>
            <li class="breadcrumb-item active">Arbol de estructuras</li>
          </ol>
        </div>
      </div>
    </div><!-- /.container-fluid -->
</section>
@endsection

@section('content')
<div class="row">
  <div class="col-md-6">
    {{--<tree-structures></tree-structures>--}}
    <!-- Default box -->
    <div class="card card-default">
      <div class="card-header">
        <h3 class="card-title">
          Polos productivos
        </h3>
      </div>
      <!-- /.card-header -->
      <div class="card-body">
        <ul id="structures-tree">
          {{-- POLES --}}
          @foreach ($tree as $pole)
          <li id="p{{ $pole['id'] }}">
            <a href="javascript:void(0);" 
              v-on:click="setDataForm('pole', 0,  'Polos', {{ $pole['id'] }}, '{{ $pole['name'] }}', '{{ $pole['abbr'] }}', {{ $pole['active'] }})">
              <i class="fas fa-map-marker-alt mr-2"></i>{{ $pole['name'] }}
            </a>
            {{-- PROJECTS --}}
            @isset($pole['projects'])
            <ul id="ul-p{{ $pole['id'] }}">
              @foreach ($pole['projects'] as $project)
              <li id="pj{{ $project['id'] }}">
                <a href="javascript:void(0);" 
                  v-on:click="setDataForm('project', {{ $pole['id'] }}, '{{ $pole['name'] }}', {{ $project['id'] }}, '{{ $project['name'] }}', '{{ $project['abbr'] }}', {{ $project['active'] }})">
                  <i class="fas fa-hotel mr-2"></i>{{ $project['name'] }}
                </a>
                {{-- ZONES --}}
                @isset($project['zones'])
                <ul id="ul-pj{{ $project['id'] }}">
                  @foreach ($project['zones'] as $zone)
                  <li id="zn{{ $zone['id'] }}">
                    <a href="javascript:void(0);" 
                      v-on:click="setDataForm('zone', {{ $project['id'] }}, '{{ $pole['name'] . ' / ' . $project['name'] }}', {{ $zone['id'] }}, '{{ $zone['name'] }}', '{{ $zone['abbr'] }}', {{ $zone['active'] }})">
                      <i class="mdi mdi-map-check mdi-18px mr-2"></i>{{ $zone['name'] }}
                    </a>
                    {{-- OBJECTS --}}
                    @isset($zone['objects'])
                    <ul id="ul-zn{{ $zone['id'] }}">
                      @foreach ($zone['objects'] as $object)
                      <li id="ob{{ $object['id'] }}">
                        <a href="javascript:void(0);" 
                          v-on:click="setDataForm('object', {{ $zone['id'] }}, '{{ $pole['name'] . ' / ' . $project['name'] . ' / ' . $zone['name'] }}', {{ $object['id'] }}, '{{ $object['name'] }}', '{{ $object['abbr'] }}', {{ $object['active'] }})">
                          <i class="mdi mdi-flag mdi-18px mr-2"></i>{{ $object['name'] }}
                        </a>
                        {{-- PARTS --}}
                        @isset($object['parts'])
                        <ul id="ul-ob{{ $object['id'] }}">
                          @foreach ($object['parts'] as $part)
                          <li id="pt{{ $part['id'] }}">
                            <a href="javascript:void(0);" 
                                v-on:click="setDataForm('part', {{ $object['id'] }},  '{{ $pole['name'] . ' / ' . $project['name'] . ' / ' . $zone['name'] . ' / ' . $object['name'] }}', {{ $part['id'] }}, '{{ $part['name'] }}', '{{ $part['abbr'] }}', {{ $part['active'] }})">
                              <i class="mdi mdi-adjust mdi-18px mr-2"></i>{{ $part['name'] }}
                            </a>
                            {{--  SUB-PARTS  --}}
                            @isset($part['childrens'])
                            @if (count($part['childrens']) > 0)
                              {!! $treestructure->getStructuresViewSubparts($part['id'], $part['name']) !!}
                            @endif
                            @endisset
                          </li>
                          @endforeach
                        </ul>
                        @endisset
                      </li>
                      @endforeach
                    </ul>
                    @endisset
                  </li>
                  @endforeach
                </ul>
                @endisset
              </li>
              @endforeach
            </ul>
            @endisset
          </li>  
          @endforeach
        </ul>
      </div>
      <!-- /.card-body -->
    </div>
    <!-- /.card -->
  </div>
  <div class="col-md-6">
    <div class="card card-default">
      <div class="card-header">
        <h3 class="card-title">Estructura</h3>
      </div>
      <!-- /.card-header -->
      <!-- form start -->
      <form>
        <input type="hidden" 
          name="node_type" 
          id="node_type"
          v-model="treeStructure.node_type">
        <input type="hidden" 
          name="parent_id" 
          id="parent_id"
          v-model="treeStructure.parent_id">
        <input type="hidden" 
          name="structure_id" 
          id="structure_id"
          v-model="treeStructure.structure_id">
        <div class="card-body">
          <div class="form-group">
            <label for="parent">Pertenece a:</label>
            <input type="text" 
              class="form-control" 
              id="parent" 
              name="parent" 
              placeholder="Nombre del nodo padre"
              v-model="treeStructure.parent_name"
              disabled>
          </div>
          <div class="form-group">
            <label for="name">Nombre:</label>
            <input type="text" 
              class="form-control" 
              id="name"
              name="name"
              placeholder="Nombre de la estructura"
              v-model="treeStructure.structure_name">
          </div>
          <div class="form-group">
            <label for="abbr">Abreviatura:</label>
            <input type="text" 
              class="form-control" 
              id="abbr" 
              name="abbr" 
              placeholder="Abreviatura del nombre"
              v-model="treeStructure.structure_abbr">
          </div>
          <div class="form-check ml-1">
            <input type="checkbox" class="form-check-input" id="activa" name="activa" :checked="treeStructure.active">
            <label class="form-check-label" for="activa">Activa</label>
          </div>
        </div>
        <!-- /.card-body -->
  
        <div class="card-footer">
          <button type="button" 
            class="btn btn-primary mr-2"
            :disabled="treeStructure.invalid_form"
            v-on:click="updateStructure()">
            <i class="mdi mdi-check-all"></i>&nbsp;@{{ treeStructure.save_text }}
          </button>
          <div class="btn-group">
            <button type="button" 
              class="btn btn-success"
              :disabled="treeStructure.invalid_form"
              v-on:click="createStructure()">
              <i class="mdi mdi-plus"></i>&nbsp;Nueva estructura
            </button>
            <button type="button" 
              class="btn btn-success dropdown-toggle" 
              data-toggle="dropdown" 
              aria-expanded="false"
              :disabled="treeStructure.invalid_form">
              <span class="sr-only">Toggle Dropdown</span>
            </button>
            <div class="dropdown-menu" role="menu" style="">
              <a class="dropdown-item" 
                href="javascript:void(0);"
                v-on:click="createSon()">
                Nuevo hijo
              </a>
              <a class="dropdown-item" 
                href="javascript:void(0);"
                v-on:click="createPole()">
                Nuevo polo
              </a>
            </div>
          </div>
          
          {{--<button type="button" 
            class="btn btn-secondary mr-2"
            :disabled="treeStructure.invalid_form"
            v-on:click="createStructure()">
            <i class="mdi mdi-plus"></i>&nbsp;Nueva Estructura
          </button>--}}
          <button type="button" 
            class="btn btn-danger float-end"
            :disabled="treeStructure.invalid_form"
            data-toggle="modal" data-target="#modal-treestructure-delete">
            <i class="mdi mdi-trash-can-outline"></i>&nbsp;Eliminar
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

<!-- Modal tree structure delete -->
<div class="modal fade" id="modal-treestructure-delete" aria-hidden="true" role="dialog" data-backdrop="static" data-keyboard="false">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">Confirmación</h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body px-4">
        <div class="float-start" style="width: 15%"><i class="mdi mdi-chat-question mdi-48px"></i></div>
        <div class="float-start pt-3" style="width: 85%">
          <p>Esta Estructura será Eliminada del sistema. Confirme que desea realizar esta operación.</p>
        </div>
      </div>
      <div class="modal-footer justify-content-between">
        <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
        <button type="button" 
          class="btn btn-danger"
          v-on:click="deleteStructure()">
          <i class="mdi mdi-trash-can-outline"></i>&nbsp;@{{ treeStructure.delete_text }}
        </button>
      </div>
    </div>
    <!-- /.modal-content -->
  </div>
  <!-- /.modal-dialog -->
</div>
<!-- /.modal tree structure delete -->

@endsection

@section('level_js')
<script>
  document.addEventListener('DOMContentLoaded', function () {
    NavTree.createBySelector("#structures-tree", {
      searchable: false,
      showEmptyGroups: true,

      groupOpenIconClass: "fas",
      groupOpenIcon: "fa-chevron-down",

      groupCloseIconClass: "fas",
      groupCloseIcon: "fa-chevron-right",

      linkIconClass: "hidden",
      linkIcon: "hidden",

      searchPlaceholderText: "Search",

      iconPlace: "start"
    });
  });
</script>
<script src="{{ asset('themes/semtinel/js/tree.js') }}"></script>
@endsection
