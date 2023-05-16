<template>
  <div class="container-fluid">
    <div class="row pb-3 border-bottom">
      <div class="col-md-6">
        <div class="btn-group" role="group" aria-label="Basic example">
          <button type="button" class="btn btn-primary" 
            style="font-weight: 600 !important; text-shadow: rgb(28, 56, 1) 0 1px !important;">
            Vista Kanban
          </button>
          <button type="button" class="btn btn-secondary">Vista Tabla</button>
        </div>
      </div>
      <div class="col-md-6 text-right">
        <button type="button" class="btn btn-warning">Nueva Mercanc&iacute;a</button>
      </div>
    </div>
    <div class="row pt-2">
      <section data-dragscroll v-for="(column, columnIndex) in boardsStore.getColumns" :key="columnIndex"
      class="col-md-3" @dragover.prevent>
        <div class="flex  mt-2 mb-3">
          <h6 class="text-bold text-uppercase text-gray-dark" style="font-size: 15px;">
            <i class="mdi mdi-circle mdi-16px" :style="'color:#'+column.color"></i> 
            {{ column.name }} ( {{ column.tasks.length }} )
          </h6>
        </div>
        <TransitionGroup tag="div" name="tasks" data-dragscroll class="flex flex-col gap-5">
          <div v-for="(task, taskIndex) in column?.tasks" :key="task.id">
            <BoardTask :task="task" @click="onClickTask(columnIndex, taskIndex)"
              @dragstart="onDragTask($event, task, columnIndex, taskIndex)"
              @dragenter="onDragEnterTask($event, task, columnIndex, taskIndex)" draggable="true"
              @dragend="onDragEnd($event)" @dragleave.prevent="onDragLeaveTask($event)"
              :class="[(tempTask?.taskIndex === taskIndex) && (tempTask?.columnIndex === columnIndex) ? tempTaskStyle : '', (draggedTask?.task?.id === task.id) ? 'opacity-50' : '']" />
          </div>
        </TransitionGroup>
        <div @dragenter="onDragEnterColumn(columnIndex)"  class="h-full mt-5" />
      </section>
    </div>
  </div>
</template>
<script setup>
import BoardTask from "@/components/logistics/goodsflow/board/Task.vue";
import { useBoardsStore } from '@/stores/boards.js';
import { useManagerStore } from '@/stores/manager';
import { ref } from "vue";

const managerStore = useManagerStore();
const boardsStore = useBoardsStore();
const draggedTask = ref(null)
let tempTaskStyle = ['border-main-purple', 'border-2']
const tempTask = ref(null) //For visual feedback
const onDragTask = (evt, task, columnIndex, taskIndex) => {
  managerStore.dragging = true
  draggedTask.value = {
    el: evt.target,
    task,
    columnIndex,
    taskIndex
  }
  boardsStore.getCurrentBoard.columns[columnIndex].tasks.splice(taskIndex, 1)
  evt.dataTransfer.dropEffect = 'move'
  evt.dataTransfer.effectAllowed = 'move'
}
const onDragEnterColumn = (columnIndex) => {
  removeTempTask()
  boardsStore.boards[boardsStore.selectedBoard].columns[columnIndex].tasks.push(draggedTask.value.task)
  tempTask.value = {
    columnIndex,
    taskIndex: boardsStore.boards[boardsStore.selectedBoard].columns[columnIndex].tasks.length - 1
  }
}
const test = () => {
  console.log("test")
}
const onDragEnterTask = (evt, task, columnIndex, taskIndex) => {
  if (draggedTask.value.task.id !== task.id) {
    removeTempTask()
    boardsStore.boards[boardsStore.selectedBoard].columns[columnIndex].tasks.splice(taskIndex, 0, draggedTask.value.task)
    tempTask.value = {
      columnIndex,
      taskIndex
    }
  }
}
const onDragLeaveTask = (evt) => {

}
const onDragEnd = (evt) => {
  if (tempTask.value) {
    const sameColumn = draggedTask.value?.columnIndex === tempTask.value?.columnIndex
    const isAbove = draggedTask.value?.taskIndex > tempTask.value?.taskIndex
  } else {
    boardsStore.getCurrentBoard.columns[draggedTask.value.columnIndex].tasks.splice(draggedTask.value.taskIndex, 0, draggedTask.value.task)
  }
  managerStore.dragging = false
  draggedTask.value = null
  tempTask.value = null
  boardsStore.boards = boardsStore.boards
}
const removeTempTask = () => {
  if (tempTask.value) {
    boardsStore.boards[boardsStore.selectedBoard].columns[tempTask.value.columnIndex].tasks.splice(tempTask.value.taskIndex, 1)
    tempTask.value = null
  }
}

const onClickTask = (column, task) => {
  boardsStore.selectedColumn = column
  boardsStore.selectedTask = task;
  managerStore.taskView = true;
  managerStore.overlay = true;
}
const bulletColors = (index) => {
  const color = [
    '#49C4E5',
    '#8471F2',
    '#67E2AE'
  ]
  if (color[index]) {
    return color[index]
  } else {
    let rand = Math.random();
    rand = Math.floor(rand * 360) + 1;
    const randomColor = `hsl(${rand}, 80%, 70%)`
    return randomColor
  }
}

</script>

<style>
.tasks-enter-from {
  opacity: 0;
  transform: scale(0.75);
}

.tasks-enter-to {
  opacity: 1;
  transform: scale(1);
}

.tasks-enter-active {
  transition: all 0.5s ease;

}
</style>