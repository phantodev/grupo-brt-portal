<script setup lang="ts">
import { ref } from 'vue';
const onClickHandler = (page: number) => {
  myBudgetsStore.page = page;
};
const currentPage = ref(1);
import { useMyBudgetsStore } from '../../stores/MyBudgetsStore';
const myBudgetsStore = useMyBudgetsStore();
</script>

<template>
  <section class="my-10 flex justify-between">
    <div class="flex items-center">
      <p class="text-sm text-gray-700">
        Mostrando
        <span class="font-bold text-blue-800">{{
          myBudgetsStore.myBudgets?.meta.from
        }}</span>
        até
        <span class="font-bold text-blue-800">{{
          myBudgetsStore.myBudgets?.meta.to
        }}</span>
        de
        <span class="font-bold text-blue-800">{{
          myBudgetsStore.myBudgets?.meta.total
        }}</span>
        resultados
      </p>
    </div>
    <vue-awesome-paginate
      :total-items="myBudgetsStore.myBudgets?.meta.total"
      :items-per-page="myBudgetsStore.myBudgets?.meta.per_page"
      :max-pages-shown="5"
      v-model="currentPage"
      :on-click="onClickHandler"
    >
      <template #prev-button>
        <span>
          <Icon
            name="ic:round-keyboard-arrow-left"
            size="1rem"
            color="#000000"
          />
        </span>
      </template>
      <template #next-button>
        <span>
          <Icon
            name="ic:round-keyboard-arrow-right"
            size="1rem"
            color="#000000"
          />
        </span>
      </template>
    </vue-awesome-paginate>
  </section>
</template>

<style>
.pagination-container {
  display: flex;
  column-gap: 10px;
}
.paginate-buttons {
  height: 40px;
  width: 40px;
  border-radius: 20px;
  cursor: pointer;
  background-color: rgb(242, 242, 242);
  border: 1px solid rgb(217, 217, 217);
  color: black;
}
.paginate-buttons:hover {
  background-color: #d8d8d8;
}
.active-page {
  background-color: rgb(30 64 175);
  border: 1px solid rgb(30 64 175);
  color: white;
}
.active-page:hover {
  background-color: rgb(30 64 175);
}
</style>
../../stores/MyBudgetsStore-OLD
