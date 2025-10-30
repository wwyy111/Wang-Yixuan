<template>
  <div class="complex-table-container">
    <!-- 操作按钮区域 -->
    <!-- <div class="table-actions" v-if="isEditMode">
      <button @click="handleAddNewRow" class="action-button">
        新增一级指标
      </button>
    </div> -->

    <!-- 表格区域 -->
    <table class="complex-table">
      <!-- 表头 -->
      <thead>
        <tr>
          <th>指标名称</th>
          <th>二级指标名称</th>
          <th>指标解读</th>
          <th v-if="isEditMode">操作</th>
        </tr>
      </thead>

      <!-- 表格内容 -->
      <tbody>
        <template v-for="(row, rowIndex) in tableData" :key="row.id">
          <tr>
            <!-- 一级指标单元格 -->
            <td
              :rowspan="row.secondaryIndicators.length"
              class="primary-indicator-cell"
            >
              <template v-if="row.editing">
                <input v-model="row.primaryIndicator" class="edit-input" />
              </template>
              <template v-else>
                {{ row.primaryIndicator }}
                <div
                  v-if="isEditMode && !row.editing"
                  @click="handleAddSecondary(rowIndex)"
                  class="add-secondary-btn"
                >
                  <img :src="img1" />
                </div>
              </template>
            </td>

            <!-- 二级指标单元格（第一个二级指标） -->
            <td>
              <template v-if="row.secondaryIndicators[0].editing">
                <input
                  v-model="row.secondaryIndicators[0].name"
                  class="edit-input"
                />
              </template>
              <template v-else>
                {{ row.secondaryIndicators[0].name }}
              </template>
            </td>

            <!-- 指标解读单元格（第一个二级指标对应的解读） -->
            <td>
              <template v-if="row.secondaryIndicators[0].editing">
                <input
                  v-model="row.secondaryIndicators[0].interpretation"
                  class="edit-input"
                />
              </template>
              <template v-else>
                {{ row.secondaryIndicators[0].interpretation }}
              </template>
            </td>

            <!-- 操作单元格（第一个二级指标对应的操作） -->
            <td v-if="isEditMode" class="action-cell">
              <template v-if="row.secondaryIndicators[0].editing">
                <button
                  @click="handleSaveRow(rowIndex, 0)"
                  class="action-button"
                >
                  完成
                </button>
              </template>
              <template v-else>
                <div
                  style="display: inline-block"
                  @click="handleEditRow(rowIndex, 0)"
                  class="action-button"
                >
                  <img :src="editIcon" />
                </div>
                <div
                  style="display: inline-block"
                  @click="handleDeleteRow(rowIndex, 0)"
                  class="action-button"
                >
                  <img :src="deleteIcon" />
                </div>
              </template>
            </td>
          </tr>

          <!-- 其他二级指标行 -->
          <tr
            v-for="(secondary, secIndex) in row.secondaryIndicators.slice(1)"
            :key="secondary.id"
          >
            <!-- 二级指标单元格 -->
            <td>
              <template v-if="secondary.editing">
                <input v-model="secondary.name" class="edit-input" />
              </template>
              <template v-else>
                {{ secondary.name }}
              </template>
            </td>

            <!-- 指标解读单元格 -->
            <td>
              <template v-if="secondary.editing">
                <input v-model="secondary.interpretation" class="edit-input" />
              </template>
              <template v-else>
                {{ secondary.interpretation }}
              </template>
            </td>

            <!-- 操作单元格 -->
            <td v-if="isEditMode" class="action-cell">
              <template v-if="secondary.editing">
                <button
                  @click="handleSaveRow(rowIndex, secIndex + 1)"
                  class="action-button"
                >
                  完成
                </button>
              </template>
              <template v-else>
                <div
                  style="display: inline-block"
                  @click="handleEditRow(rowIndex, secIndex + 1)"
                  class="action-button"
                >
                  <img :src="editIcon" />
                </div>
                <div
                  style="display: inline-block"
                  @click="handleDeleteRow(rowIndex, secIndex + 1)"
                  class="action-button"
                >
                  <img :src="deleteIcon" />
                </div>
              </template>
            </td>
          </tr>
        </template>

        <!-- 新增行（编辑模式） -->
        <tr v-if="isEditMode && addingNewRow" class="new-row">
          <td>
            <input
              v-model="newRow.primaryIndicator"
              class="edit-input"
              placeholder="一级指标"
            />
          </td>
          <td>
            <input
              v-model="newRow.secondaryIndicators[0].name"
              class="edit-input"
              placeholder="二级指标"
            />
          </td>
          <td>
            <input
              v-model="newRow.secondaryIndicators[0].interpretation"
              class="edit-input"
              placeholder="指标解读"
            />
          </td>
          <td class="action-cell">
            <button @click="handleSaveNewRow" class="action-button">
              完成
            </button>
            <button @click="addingNewRow = false" class="action-button">
              取消
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import img1 from "@/assets/plus.png";
import deleteIcon from "@/assets/delete.png";
import editIcon from "@/assets/edit2.png";

// 定义props
const props = defineProps({
  // 表格数据
  data: {
    type: Array,
    required: true,
    default: () => [],
  },
  // 是否处于编辑模式
  isEditMode: {
    type: Boolean,
    default: false,
  },
});

// 定义emit事件
const emit = defineEmits([
  "update:data",
  "row-deleted",
  "row-updated",
  "row-added",
]);

// 克隆原始数据并添加编辑状态
const tableData = ref(
  props.data.map((item) => ({
    ...item,
    editing: false,
    secondaryIndicators: item.secondaryIndicators.map((sec) => ({
      ...sec,
      editing: false,
    })),
  }))
);

watch(
  () => props.data,
  (newData) => {
    tableData.value = newData.map((item) => ({
      ...item,
      editing: false,
      secondaryIndicators: item.secondaryIndicators.map((sec) => ({
        ...sec,
        editing: false,
      })),
    }));
  },
  {
    deep: true,
  }
);

// 新增行相关状态
const addingNewRow = ref(false);
const newRow = ref({
  id: null,
  primaryIndicator: "",
  editing: true,
  secondaryIndicators: [
    {
      id: null,
      name: "",
      interpretation: "",
      editing: true,
    },
  ],
});

// 生成唯一ID
let idCounter =
  Math.max(
    0,
    ...props.data.flatMap((d) => [
      d.id,
      ...d.secondaryIndicators.map((s) => s.id),
    ])
  ) + 1;

const initMaxId = () => {
  let maxId = 0;

  // 遍历所有现有数据
  props.data.forEach((item) => {
    maxId = Math.max(maxId, item.id);
    item.secondaryIndicators.forEach((sec) => {
      maxId = Math.max(maxId, sec.id);
    });
  });

  return maxId + 1;
};

// 使用闭包保持ID状态
const createIdGenerator = (initialValue) => {
  let counter = initialValue;
  return () => counter++;
};

// const generateId = () => idCounter++;

const idGenerator = createIdGenerator(initMaxId());

const generateUniqueId = () => idGenerator();

/**
 * 处理编辑行
 * @param {number} rowIndex - 一级指标行索引
 * @param {number} secIndex - 二级指标索引
 */
const handleEditRow = (rowIndex, secIndex) => {
  // 重置所有行的编辑状态
  resetAllEditingStates();

  // 设置当前行编辑状态
  tableData.value[rowIndex].secondaryIndicators[secIndex].editing = true;
};

/**
 * 处理保存行
 * @param {number} rowIndex - 一级指标行索引
 * @param {number} secIndex - 二级指标索引
 */
const handleSaveRow = (rowIndex, secIndex) => {
  tableData.value[rowIndex].secondaryIndicators[secIndex].editing = false;
  emit("row-updated", {
    primaryId: tableData.value[rowIndex].id,
    secondaryId: tableData.value[rowIndex].secondaryIndicators[secIndex].id,
  });
  emit("update:data", tableData.value);
};

/**
 * 处理删除行
 * @param {number} rowIndex - 一级指标行索引
 * @param {number} secIndex - 二级指标索引
 */
const handleDeleteRow = (rowIndex, secIndex) => {
  const primaryId = tableData.value[rowIndex].id;
  const secondaryId =
    tableData.value[rowIndex].secondaryIndicators[secIndex].id;

  // 如果是一级指标的最后一个二级指标，则删除整个一级指标
  if (tableData.value[rowIndex].secondaryIndicators.length === 1) {
    tableData.value.splice(rowIndex, 1);
  } else {
    tableData.value[rowIndex].secondaryIndicators.splice(secIndex, 1);
  }

  emit("row-deleted", { primaryId, secondaryId });
  emit("update:data", tableData.value);
};

/**
 * 处理添加新的二级指标
 * @param {number} rowIndex - 一级指标行索引
 */
const handleAddSecondary = (rowIndex) => {
  resetAllEditingStates();

  const newSecondary = {
    id: generateUniqueId(),
    name: "",
    interpretation: "",
    editing: true,
  };

  tableData.value[rowIndex].secondaryIndicators.push(newSecondary);
};

/**
 * 处理添加新的一级指标行
 */
const handleAddNewRow = () => {
  resetAllEditingStates();
  addingNewRow.value = true;
  newRow.value = {
    id: generateUniqueId(),
    primaryIndicator: "",
    editing: true,
    secondaryIndicators: [
      {
        id: generateUniqueId(),
        name: "",
        interpretation: "",
        editing: true,
      },
    ],
  };
};

/**
 * 处理保存新增的行
 */
const handleSaveNewRow = () => {
  if (
    !newRow.value.primaryIndicator.trim() ||
    !newRow.value.secondaryIndicators[0].name.trim()
  ) {
    return; // 简单验证
  }

  tableData.value.push({
    id: newRow.value.id,
    primaryIndicator: newRow.value.primaryIndicator,
    editing: false,
    secondaryIndicators: [
      {
        id: newRow.value.secondaryIndicators[0].id,
        name: newRow.value.secondaryIndicators[0].name,
        interpretation: newRow.value.secondaryIndicators[0].interpretation,
        editing: false,
      },
    ],
  });

  addingNewRow.value = false;
  emit("row-added", {
    primaryId: newRow.value.id,
    secondaryId: newRow.value.secondaryIndicators[0].id,
  });
  emit("update:data", tableData.value);
};

/**
 * 重置所有编辑状态
 */
const resetAllEditingStates = () => {
  tableData.value.forEach((row) => {
    row.editing = false;
    row.secondaryIndicators.forEach((sec) => {
      sec.editing = false;
    });
  });
  addingNewRow.value = false;
};

defineExpose({
  handleAddNewRow,
});
</script>

<style lang="scss" scoped>
.complex-table-container {
  width: 100%;
  overflow-x: auto;
}

.table-actions {
  margin-bottom: 1rem;
  text-align: right;
}

.complex-table {
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 0.75rem;
    padding-right: 26px;
    border: 1px solid #ddd;
    text-align: left;
  }

  th {
    background-color: #f5f5f5;
    font-weight: bold;
  }

  tr:hover {
    background-color: #f9f9f9;
  }

  table,
  th,
  td {
    border: none;
  }
}

.primary-indicator-cell {
  position: relative;

  .add-secondary-btn {
    position: absolute;
    right: 0.5rem;
    top: 48%;
    transform: translateY(-50%);
    // width: 1.5rem;
    // height: 1.5rem;
    // border-radius: 50%;
    // border: none;
    // background-color: #4caf50;
    // color: white;
    cursor: pointer;
    // display: flex;
    // align-items: center;
    // justify-content: center;
    // font-size: 1rem;
    // line-height: 1;

    // &:hover {
    //   background-color: #45a049;
    // }
  }
}

.edit-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.action-cell {
  white-space: nowrap;

  .action-button {
    padding: 0.25rem 0.5rem;
    margin-right: 0.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      opacity: 0.8;
    }
  }
}

.new-row {
  background-color: #f0f8ff;
}
</style>
