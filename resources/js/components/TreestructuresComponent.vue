<script>
  import { ref } from 'vue'
  export default {
    async setup() {
      const tree = ref({})

    await axios.get('api/tree_structures').then(function (response) {
          if (response.data.success) {
              tree.value = response.data.tree
              console.log(tree.value)
              //post.value.title = response.data.test
          }
      }).catch(function (error) {
        error_txt = "Ha ocurrido un error. Por favor, prueba nuevamente.";
          return;
      })

      return { tree }
    }
  }
</script>

<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">
        Polos activos
      </h3>
    </div>
    <!-- /.card-header -->
    <div class="card-body">
      <ul id="structures-tree">
        <li 
          v-for="(pole, index) in tree"
          :key="index"
          :id="`p${pole.id}`">
          <a href="#">
            <i class="fas fa-map-marker-alt"></i>&nbsp;&nbsp;{{ pole.name }}
          </a>
        </li>  
      </ul>
    </div>
    <!-- /.card-body -->
  </div>
</template>