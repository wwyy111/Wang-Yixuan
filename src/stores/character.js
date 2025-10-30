import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useCharacterStore = defineStore(
  "character",
  () => {
    const data = ref([]);
    function setData(item) {
      console.log("数据：", item);
      data.value.push({
        ...item,
        active: false,
      });
    }

    const setActive = (data1) => {
      data.value.forEach((item) => {
        if (item.id === data1.id) {
          item.active = data1.active;
        }
      });

      // setData(data1.value);
    };

    return { data, setData, setActive };
  },
  {
    persist: true,
  }
);
