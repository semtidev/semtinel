<script allowJs="true">
  // import the component
  import Treeselect from 'vue3-treeselect'
  // import the styles
  import 'vue3-treeselect/dist/vue3-treeselect.css'

  export default {
    // register the component
    components: { Treeselect },
    props: {
        tree: {
            type: Array,
            default: () => []
        }
    },
    data() {
      return {
        // define the default value
        value: null,
        // define options
        /*options: [ {
          id: 'a',
          label: 'a',
          children: [ {
            id: 'aa',
            label: 'aa',
          }, {
            id: 'ab',
            label: 'ab',
          } ],
        }, {
          id: 'b',
          label: 'b',
        }, {
          id: 'c',
          label: 'c',
        } ],*/
      }
    },
  }
</script>

<template>
    <treeselect 
        v-model="value" 
        :searchable="true"
        :multiple="false" 
        :options="tree"
        :disabled="false"
        :close-on-select="true"
        placeholder="Seleccione un objeto de obra..." />
</template>