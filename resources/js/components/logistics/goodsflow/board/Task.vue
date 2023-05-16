<template>
  <article class="card bg-gray-300" style="cursor: pointer !important;"
    v-tooltip="'Haga click y arrastre para mover de columna'">
    <div class="card-body">
      <h5 class="card-title w-full float-none" style="color:#0c61b6; font-size: 15px;">
        {{ task.title }}
      </h5>
      <p class="text-xs text-medium-grey font-bold select-none pointer-events-none">{{ subtasksCompleted }} substasks</p>
    </div>
    
  </article>
</template>

<script setup>
import { computed } from 'vue';
import { useManagerStore } from '@/stores/manager';
const managerStore = useManagerStore()
const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const subtasksCompleted = computed(() => {
  const completed = props.task.subtasks.filter((sub) => sub.isCompleted).length;
  const total = props.task.subtasks.length;
  return `${completed} of ${total}`
})
</script>