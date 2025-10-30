<template>
  <div class="indicators-system">
    <div class="box">
      <div class="left">
        <div class="left-top">
          <div class="left-t">我的指标系</div>
          <div class="left-r">
            <div>搜索</div>
            <div>
              <MyBtn
                @click="handleAddIS"
                type="info"
                :showIcon="false"
                text="新增指标系"
              />
            </div>
          </div>
        </div>

        <div class="left-bottom">
          <CardList :items="cardItems" />
        </div>
      </div>
      <div class="right">
        <div class="app-container">
          <h1>指标管理</h1>

          <div class="control-panel">
            <button @click="toggleEditMode" class="mode-toggle">
              {{ isEditMode ? "退出编辑" : "进入编辑" }}
            </button>
          </div>

          <IndicaTable
            :data="tableData"
            :is-edit-mode="isEditMode"
            @update:data="handleDataUpdate"
            @row-deleted="handleRowDeleted"
            @row-updated="handleRowUpdated"
            @row-added="handleRowAdded"
          />

          <div class="data-preview">
            <h3>当前数据预览：</h3>
            <pre>{{ JSON.stringify(tableData, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>

  <el-drawer
    destroy-on-close
    class="is-drawer"
    size="85%"
    v-model="showAddIS"
    direction="btt"
  >
    <template #header>
      <div class="add-is-title">新增指标体系</div>
    </template>

    <template #default>
      <div class="add-is-container">
        <div class="title-process">
          <div class="txt">文件上传</div>
          <div style="width: 500px">
            <ProcessBar ref="processBarRef">
              <template #left-text>第一步</template>
              <template #right-text>第二步</template>
            </ProcessBar>
          </div>
        </div>
        <template v-if="showComp === 'upload'">
          <AddIS @next-step="handleStepClick" />
        </template>
        <template v-else>
          <ConfirmContent />
        </template>
      </div>
    </template>

    <!-- <template #footer>
        <div class="add-is-footer">
          <MyBtn
            :showIcon="false"
            type="primary"
            @click="handleConfirmIS"
            text="确定"
          />
        </div>
      </template> -->
  </el-drawer>
</template>

<script setup>
import AddIS from "./AddIS.vue";
import ConfirmContent from "./ConfirmContent.vue";
const processBarRef = ref(null);
const showComp = ref("upload");
const cardItems = ref([
  {
    title: "指标系1",
    description: "指标系1的描述",
  },
  {
    title: "指标系2",
    description: "指标系2的描述",
  },
  {
    title: "指标系3",
    description: "指标系3的描述",
  },
  {
    title: "指标系4",
    description: "指标系4的描述",
  },
]);

// const tableData = ref([
//   {
//     id: 1,
//     primaryIndicator: "教学质量",
//     secondaryIndicators: [
//       {
//         id: 101,
//         name: "学生评价",
//         interpretation: "学生对教学质量的评价分数",
//       },
//       {
//         id: 102,
//         name: "同行评价",
//         interpretation: "教师之间的相互评价分数",
//       },
//     ],
//   },
//   // 更多数据...
// ]);

// 初始表格数据
const initialData = [
  {
    id: 1,
    primaryIndicator: "教学质量",
    secondaryIndicators: [
      {
        id: 101,
        name: "学生评价",
        interpretation: "学生对教学质量的评价分数",
      },
      {
        id: 102,
        name: "同行评价",
        interpretation: "教师之间的相互评价分数",
      },
    ],
  },
  {
    id: 2,
    primaryIndicator: "科研成果",
    secondaryIndicators: [
      {
        id: 201,
        name: "论文发表",
        interpretation: "SCI/SSCI论文发表数量",
      },
      {
        id: 202,
        name: "科研项目",
        interpretation: "国家级科研项目数量",
      },
      {
        id: 203,
        name: "专利授权",
        interpretation: "发明专利授权数量",
      },
    ],
  },
];

// 响应式数据
const tableData = ref(JSON.parse(JSON.stringify(initialData)));
const isEditMode = ref(false);

// 切换编辑模式
const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value;
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

const showAddIS = ref(false);
// 打开新增指标体系弹窗
const handleAddIS = () => {
  showAddIS.value = true;
  processBarRef.value?.prevStep();
  showComp.value = "upload";
};

const handleStepClick = () => {
  processBarRef.value?.nextStep();
  showComp.value = "confirm";
};
</script>

<style scoped lang="scss">
.indicators-system {
  width: 100%;
  padding: 21px 24px 28px 24px;
  box-sizing: border-box;

  .box {
    padding: 23px 21px;
    width: 100%;
    box-sizing: border-box;
    flex-shrink: 0;
    border-radius: 6px;
    background: var(--bg1, #fff);
    display: flex;

    .left {
      width: 392px;
      border-right: 1px solid #cac9d4;
      padding-right: 14px;
      box-sizing: border-box;
      .left-top {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .left-t {
          color: var(--text1, #2b2b2b);

          /* 主标题 */
          font-family: "PingFang SC";
          font-size: 20px;
          font-style: normal;
          font-weight: 400;
          line-height: 28px; /* 140% */
        }

        .left-r {
          display: flex;
        }
      }

      .left-bottom {
        margin-top: 37px;
      }
    }
    .right {
    }
  }
}

.add-is-title {
  color: var(--text1, #2b2b2b) !important;

  /* 主标题 */
  font-family: "PingFang SC";
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px; /* 140% */
}

.add-is-footer {
  width: 68px;
  margin: 0 auto;
}

.add-is-container {
  height: 100%;

  background: var(--bg1, #fff);
  .title-process {
    width: 100%;
    display: flex;
    align-items: center;
    height: 55px;
    border-bottom: 1px solid #e6e5eb;
    .txt {
      color: var(--text1, #2b2b2b);

      /* 按钮文字 */
      font-family: "PingFang SC";
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px; /* 150% */
    }
  }
}
</style>
