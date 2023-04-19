<script>
export default {    
    data: function () {
        return {
            //store_poles: JSON.parse(localStorage.getItem('semtinel_poles')),
            //store_projects: JSON.parse(localStorage.getItem('semtinel_projects')),
            session: JSON.parse(sessionStorage.getItem('semtinel')),
            pole: '',
            pole_name: '',
            projects: [],
            project: '',
            project_name: ''
        };
    },
    watch: {

    },
    methods: {
        changePole: function (pole_id, pole_abbr, pole_name) {
            let cmp = this,
                projects = [],
                warehouses = []
            // Set pole
            cmp.pole = pole_abbr
            cmp.pole_name = pole_name
            // Set projects and select the first
            cmp.session.projects.map(function(value, key) {
                if (value.id_pole == pole_id)
                    projects.push(value)
            })
            cmp.projects = projects
            cmp.project  = cmp.projects[0]['id']
            cmp.project_name = cmp.projects[0]['name']
            localStorage.setItem('stnel_logist_pole', cmp.pole)
            localStorage.setItem('stnel_logist_project', cmp.project)
            cmp.$router.push('/semtinel/logistics')
        },
        changeProject: function (project_id, project_name) {
            let cmp = this
            cmp.project = project_id
            cmp.project_name = project_name
            localStorage.setItem('stnel_logist_project', cmp.project)
            cmp.$router.push('/semtinel/logistics')
        }
    },
    created() {
        // Asign pole
        this.pole = this.session.poles[0]['abbr']
        // Asign proyects and select first
        this.changePole(this.session.poles[0]['id'], this.session.poles[0]['abbr'], this.session.poles[0]['name'])
    }
}
</script>
<template>
<section class="content-sidebar">   
    <div class="sidebar-header">
      <h5>Configuración</h5>
    </div>
    <div class="sidebar-config">
      <div class="config-header">POLO</div>
      <div class="config-item">
          <select 
              name="app_pole" 
              size="1" 
              class="form-control mb-2"
              v-tooltip="'Polo ' + pole_name">
              <template v-for="(option, index) in session.poles" :key="index">
                  <option 
                      v-if="option['name'] != 'Todos'"
                      :value="option['abbr']"                      
                      v-on:click.stop="changePole(option['id'], option['abbr'], option['name'])">
                      {{ option['name'] }}
                  </option>
              </template> 
          </select>
      </div>
    </div>
    <div class="sidebar-config">
      <div class="config-header">PROYECTO</div>
      <div class="config-item">
          <select 
              name="app_pole" 
              size="1" 
              class="form-control mb-2"
              v-tooltip="'Obra ' + project_name">
              <template v-for="(option, index) in projects" :key="index">
                  <option
                      :value="option['id']"
                      v-on:click.stop="changeProject(option['id'], option['name'])">
                      {{ option['name'] }}
                  </option>
              </template> 
          </select>
      </div>
    </div>
</section>
</template>