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
      </div>
    </div>
  </div>
</section>
</template>