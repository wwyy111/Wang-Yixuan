<template>
  <div class="edit-is">
    <div class="top" style="margin-bottom: 20px">
      <div style="width: 116px">
        <MyBtn @click="handleAddNewRowFn" type="info" text="添加指标" />
      </div>
    </div>

    <div class="table-container">
      <IndicaTable
        ref="tableRef"
        :data="tableData"
        :is-edit-mode="isEditMode"
        @update:data="handleDataUpdate"
        @row-deleted="handleRowDeleted"
        @row-updated="handleRowUpdated"
        @row-added="handleRowAdded"
      />
    </div>
    <div class="btn">
      <MyBtn
        :showIcon="false"
        type="primary"
        @click="handleConfirmIS"
        text="确认修改并关闭"
      />
    </div>
  </div>
</template>

<script setup>
import { useIndicatorsStore } from "@/stores/indicators";

const props = defineProps({
  data: {
    type: Object,
    default: () => null,
  },
});

const emit = defineEmits(["confirm-close"]);

const indicatorsStore = useIndicatorsStore();
const tableData = ref([]);

const isEditMode = ref(true);

const tableRef = ref(null);

const newIs = ref(null);

const handleAddNewRowFn = () => {
  tableRef.value.handleAddNewRow();
};

// 处理数据更新
const handleDataUpdate = (newData) => {
  console.log("数据更新:", newData);
  tableData.value = newData;
};

// 处理行删除
const handleRowDeleted = ({ primaryId, secondaryId }) => {
  console.log(`删除了行 - 一级ID: ${primaryId}, 二级ID: ${secondaryId}`);
};

// 处理行更新
const handleRowUpdated = ({ primaryId, secondaryId }) => {
  console.log(`更新了行 - 一级ID: ${primaryId}, 二级ID: ${secondaryId}`);
};

// 处理行添加
const handleRowAdded = ({ primaryId, secondaryId }) => {
  console.log(`添加了新行 - 一级ID: ${primaryId}, 二级ID: ${secondaryId}`);
};
const handleConfirmIS = () => {
  //   indicatorsStore.setDataById(props.curId, tableData.value);

  newIs.value.children = tableData.value;
  console.log("🚀 ~ handleConfirmIS ~ tableData.value:", tableData.value);
  console.log("🚀 ~ handleConfirmIS ~ newIs.value:", newIs.value);
  indicatorsStore.addNewData(newIs.value);
  emit("confirm-close");
};

watch(
  () => props.data,
  (newValue) => {
    console.log("🚀 ~ newValue:8888888", newValue);
    if (newValue) {
      //   const is = indicatorsStore.data.find((item) => item.id === newValue);
      //   console.log("🚀 ~ indicatorsStore.data:", indicatorsStore.data);
      //   if (is) {
      //     tableData.value = is.children;
      //   }

      newIs.value = newValue;
      tableData.value = newValue.children;
    }
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss" scoped>
.edit-is {
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  //   background-color: red;
  margin: 0 auto;
  .top {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }
  .table-container {
    width: 100%;
  }
  .btn {
    width: 146px;
    position: fixed;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
