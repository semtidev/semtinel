<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-12">
                <div v-dragscroll:nochilddrag>
                    <div data-dragscroll class="mx-auto w-11/12 pt-6 pb-24">
                        <div data-dragscroll class="flex">
                            <Board data-dragscroll />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
 </template>
  
  <script setup>
  //import EmptyBoard from "./board/Empty.vue";
  import Board from "./board/Board.vue";
  /*import HeaderVue from "./components/Header.vue";
  import bgOverlay from "./components/bgOverlay.vue";
  import TaskView from "./components/manager/TaskView.vue";
  import TaskForm from "./components/manager/TaskForm.vue";
  import Delete from "./components/manager/Delete.vue";
  import BoardForm from "./components/manager/BoardForm.vue";
  import SideBar from "./components/manager/Sidebar.vue";
  import SidebarMobile from "./components/manager/SidebarMobile.vue";
  import ShowSidebar from "./components/manager/sidebar/ShowSidebar.vue";*/
  
  import { onMounted } from "vue";
  import { useBoardsStore } from "@/stores/boards.js";
  import { useManagerStore } from "@/stores/manager.js";
  //import NoBoards from "./board/NoBoards.vue";
  //import AddNewColumn from "./components/board/AddNewColumn.vue";
  
  const boardsStore = useBoardsStore();
  const managerStore = useManagerStore();
  
  onMounted(async () => {
    //INIT STORAGE
    boardsStore.$subscribe((mutations, state) => {
      sessionStorage.setItem("boards", JSON.stringify(state));
      console.log("eaea");
    });
    const storageData = sessionStorage.getItem("boards");
    if (storageData === null) {
      const jsonData = await import("@/json/data.json");
      boardsStore.boards = jsonData.boards;
    } else {
      boardsStore.$state = JSON.parse(storageData);
    }
  });
  </script>
  