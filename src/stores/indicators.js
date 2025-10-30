import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useIndicatorsStore = defineStore(
  "indicators",
  () => {
    const data = ref([]);

    const setData = (data1) => {
      data.value = data1;
    };

    const setDataById = (id, newData) => {
      console.log("🚀 ~ setDataById ~ id:", id);
      console.log("🚀 ~ setDataById ~ newData:", newData);
      data.value.forEach((item) => {
        if (item.id === id) {
          item.children = newData;
        }
      });
    };

    const addNewData = (val) => {
      data.value.push(val);
    };

    return { data, setData, setDataById, addNewData };
  },
  {
    persist: true,
  }
);
