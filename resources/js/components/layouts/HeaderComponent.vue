<script allowJs="true">
export default {
  props: {
    pagetitle: {
      type: String,
      default: 'Título',
      required: true
    },
    breadcrumbs: {
      type: Boolean,
      default: false
    },
    navbar: {
      type: Array,
      default: () => [{page: '', link: '', tooltip: '', active:false}]
    },
    pole_project: {
      type: Boolean,
      default: false,
      required: false
    },
    pole: {
      type: String,
      default: 'Polo',
      required: false
    },
    project: {
      type: String,
      default: 'Proyecto',
      required: false
    }
  }
};
</script>
<template>
  <section class="content-header px-0 py-1">   
    <div class="container-fluid">
      <div class="row mb-2">
        <div class="col-md-6 px-2">
          <h4>{{ pagetitle }}</h4>
        </div>
        <div class="col-sm-6 px-2">
            <!-- BREADCRUMBS -->
            <ol class="breadcrumb float-sm-right" v-if="breadcrumbs">
              <template v-for="(item, idx) in navbar" :key="idx">
                <li class="breadcrumb-item" :class="(item['active']) ? 'active' : ''">
                  <router-link 
                    :to="item['link']" 
                    class="page-nav" 
                    v-tooltip="item['tooltip']"
                    v-if="!item['active']">
                    {{ item['page'] }}
                  </router-link>
                  <span v-if="item['active']">{{ item['page'] }}</span>
                </li>
              </template>
            </ol>
            <!-- \ BREADCRUMBS -->

            <!-- POLE & PROJECT -->
            <div v-if="pole_project">
              <h6 class="text-right"><span>Polo:</span> {{ pole }}, <span>Proyecto:</span> {{ project }}</h6> 
            </div>
            <!-- \ BREADCRUMBS -->
        </div>
      </div>
    </div>
  </section>
</template>