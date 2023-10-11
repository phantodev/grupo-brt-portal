<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useMyBudgetsStore } from '../../stores/MyBudgetsStore';
import { useDateFormatter } from '../../composables/useDateFormatter';
const { removeHour } = useDateFormatter();
const myBudgetsStore = useMyBudgetsStore();
onBeforeMount(() => {
  myBudgetsStore.getAllBudgets();
});
const COLORS_STATUS = {
  created: { colorBg: 'bg-lime-100', textColor: 'text-lime-700' },
  cancelled: { colorBg: 'bg-red-100', textColor: 'text-red-700' },
  email_sent: { colorBg: 'bg-orange-100', textColor: 'text-orange-700' },
  finished: { colorBg: 'bg-green-100', textColor: 'text-green-700' },
  paid: { colorBg: 'bg-blue-100', textColor: 'text-blue-700' },
  partially_cancelled: {
    colorBg: 'bg-pink-100',
    textColor: 'text-pink-700',
  },
  partially_reserved: {
    colorBg: 'bg-emerald-100',
    textColor: 'text-emerald-700',
  },
  reserved: { colorBg: 'bg-yellow-100', textColor: 'text-yellow-700' },
  waiting_payment: { colorBg: 'bg-fuchsia-100', textColor: 'text-fuchsia-700' },
};
function getStatusClasses(statusName: string) {
  return (
    COLORS_STATUS[statusName as keyof typeof COLORS_STATUS] || {
      colorBg: 'bg-gray-100',
      textColor: 'text-gray-700',
    }
  );
}
</script>
<template>
  <table
    class="w-full mt-6 shadow-lg rounded-lg overflow-hidden"
    v-if="myBudgetsStore.myBudgets?.data.length !== 0"
  >
    <thead>
      <tr class="text-xs bg-blue-800 text-white">
        <th class="w-20">ID</th>
        <th>Agência</th>
        <th>Consultor</th>
        <th class="w-36">Status</th>
        <th class="w-36">Data</th>
        <th class="w-20">Actions</th>
      </tr>
    </thead>
    <tbody class="text-xs">
      <tr
        v-for="(item, index) in myBudgetsStore?.myBudgets?.data"
        :key="index"
        :class="index % 2 === 0 ? 'bg-white' : 'bg-blue-50'"
      >
        <td class="w-20">{{ item.id }}</td>
        <td>{{ item.client }}</td>
        <td class="w-72">{{ item.consultant }}</td>
        <td class="w-40">
          <div
            :class="[
              getStatusClasses(item.status.name).colorBg,
              getStatusClasses(item.status.name).textColor,
            ]"
            class="py-1 text-[10px] rounded-full"
          >
            {{ item.status.description }}
          </div>
        </td>
        <td class="w-36">{{ removeHour(item.created_at) }}</td>
        <td class="w-20 flex gap-4 justify-center mt-1">
          <button @click="navigateTo(`/budget/${item.id}`)">
            <Icon
              name="material-symbols:edit-outline-sharp"
              color="#114e8c"
              size="1rem"
            />
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<style scoped>
td {
  @apply text-center py-3;
}
th {
  @apply text-center py-3;
}
</style>
../../stores/MyBudgetsStore-OLD
