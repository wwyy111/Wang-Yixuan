<template>
  <div class="indicators-system">
    <div class="box">
      <div class="left">
        <div class="left-top">
          <div class="left-t" style="font-weight: bold">我的指标体系</div>
          <div class="left-r">
            <!-- <div class="icon">
              <img :src="img1" />
            </div> -->
            <div>
              <MyBtn
                @click="handleAddIS"
                type="info"
                :showIcon="false"
                text="新增指标体系"
              />
            </div>
          </div>
        </div>

        <div class="left-bottom">
          <CardList
            :items="cardItems"
            :initialActiveIndex="curId"
            @select="handleSelect"
          />
        </div>
      </div>
      <div class="right">
        <div class="top">
          <div class="title" style="font-weight: bold">指标详情</div>
          <div class="right-tr">
            <!-- <div>
              <MyInput v-model="searchVal" placeholder="搜索项目" />
            </div> -->
            <div class="btn">
              <MyBtn
                type="info"
                :showIcon="false"
                text="编辑"
                @click="handleEditIndic"
                class="mode-toggle"
              />
            </div>
          </div>
        </div>

        <div class="right-b"></div>
        <IndicaTable
          :data="tableData"
          :is-edit-mode="isEditMode"
          @update:data="handleDataUpdate"
          @row-deleted="handleRowDeleted"
          @row-updated="handleRowUpdated"
          @row-added="handleRowAdded"
        />

        <!-- <div class="data-preview">
            <h3>当前数据预览：</h3>
            <pre>{{ JSON.stringify(tableData, null, 2) }}</pre>
          </div> -->
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
          <div class="process-bar-box">
            <ProcessBar ref="processBarRef">
              <template #left-text>文件上传</template>
              <template #right-text>确认内容</template>
            </ProcessBar>
          </div>
        </div>
        <template v-if="showComp === 'upload'">
          <UploadIS @next-step="handleStepClick" />
        </template>
        <template v-else>
          <ConfirmContent
            @confirm-close="handleConfirmCloseAdd"
            :data="testData"
          />
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

  <el-drawer
    class="is-drawer"
    v-model="showEditIndic"
    size="85%"
    direction="btt"
    destroy-on-close
  >
    <template #header>
      <div class="add-is-title">编辑指标体系</div>
    </template>

    <template #default>
      <div class="add-is-container">
        <EditIS @confirm-close="confirmClose" :curId="curId" />
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import MyInput from "@/components/MyInput.vue";
import UploadIS from "./UploadIS.vue";
import EditIS from "./EditIS.vue";
import ConfirmContent from "./ConfirmContent.vue";
import { useIndicatorsStore } from "@/stores/indicators";
import { initData } from "./initData";
import img1 from "@/assets/search.png";
console.log("🚀 ~ initData:", initData);

const testData = {
  id: "p6",
  title: "用户体验APEC模型",
  description:
    "适用于交互路径与用户感知反馈耦合分析场景，侧重审美、认知、情感与实用性维度对用户行为的影响。",
  children: [
    {
      id: 2231,
      primaryIndicator: "界面吸引力",
      pid: "p6",
      secondaryIndicators: [
        {
          id: 2235,
          name: "/",
          interpretation:
            "系统在视觉呈现方面应具备统一性与吸引力，通过图形语言强化品牌认知与界面印象，提升用户第一感知体验。",
        },
      ],
    },
    {
      id: 2232,
      primaryIndicator: "用户愉悦程度",
      pid: "p6",
      secondaryIndicators: [
        {
          id: 2236,
          name: "/",
          interpretation:
            "系统在交互中应引发用户的积极情绪反应，减少挫败感和冷漠反馈。",
        },
      ],
    },
    {
      id: 2233,
      primaryIndicator: "信息处理流畅性",
      pid: "p6",
      secondaryIndicators: [
        {
          id: 2237,
          name: "/",
          interpretation:
            "系统在展示信息或提示内容时，应确保表达清晰、层级合理，使用户能快速理解界面含义并做出正确决策。",
        },
      ],
    },
    {
      id: 2234,
      primaryIndicator: "功能达成效率",
      pid: "p6",
      secondaryIndicators: [
        {
          id: 2238,
          name: "/",
          interpretation:
            "系统在功能设计上应突出操作核心，避免无效步骤与冗余元素，以支持高效完成任务目标。",
        },
      ],
    },
  ],
};

const searchVal = ref("");

const indicatorsStore = useIndicatorsStore();
console.log("🚀 ~ indicatorsStore:", indicatorsStore);

const processBarRef = ref(null);
const showComp = ref("upload");

const curId = ref("");
const cardItems = ref([]);

// 响应式数据
const tableData = ref([]);
const isEditMode = ref(false);

const showEditIndic = ref(false);

const handleConfirmCloseAdd = () => {
  showAddIS.value = false;
};

const confirmClose = () => {
  showEditIndic.value = false;
};

// 切换编辑模式
const handleEditIndic = () => {
  // isEditMode.value = !isEditMode.value;

  showEditIndic.value = true;
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

const handleSelect = (id) => {
  console.log("🚀 ~ handleSelect ~ id:", id);
  console.log("🚀 ~ handleSelect ~ id2:", indicatorsStore.data);
  const list = indicatorsStore.data.filter((item) => item.id === id);
  console.log("🚀 ~ handleSelect ~ list:", list);
  tableData.value = list[0]?.children;
  curId.value = id;
};

watch(
  [() => indicatorsStore.data, curId],
  ([newValue, newValue2]) => {
    console.log("🚀 ~ newValue:", newValue);
    console.log("🚀 ~ newValue:", newValue2);
    // if (newValue?.length) {
    tableData.value = newValue.find((item) => item.id === newValue2)?.children;
    cardItems.value = newValue;
    // }
  },
  {
    immediate: true,
    deep: true,
  }
);

onMounted(() => {
  let arrList = initData;
  if (localStorage.getItem("indicators")) {
    arrList = JSON.parse(localStorage.getItem("indicators")).data;
  }
  indicatorsStore.setData(arrList);
  curId.value = indicatorsStore.data[0]?.id;
  console.log("🚀 ~ onMounted ~ curId.value:", curId.value);
  // tableData.value = indicatorsStore.data[0]?.children;
});
</script>

<style scoped lang="scss">
.indicators-system {
  width: 100%;
  padding: 21px 24px 28px 24px;
  box-sizing: border-box;
  overflow: hidden;

  .box {
    padding: 23px 21px;
    width: 100%;
    box-sizing: border-box;
    flex-shrink: 0;
    border-radius: 6px;
    background: var(--bg1, #fff);
    display: flex;
    height: calc(100vh - 140px);

    .left {
      width: 393px;
      height: 100%;
      border-right: 1px solid #cac9d4;
      padding-right: 14px;
      box-sizing: border-box;
      overflow: auto;
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
          .icon {
            cursor: pointer;
            margin-right: 15px;
          }
        }
      }

      .left-bottom {
        margin-top: 37px;
      }
    }
    .right {
      width: calc(100% - 393px);
      padding-left: 32px;
      height: 100%;
      overflow: auto;

      .top {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 36px;
        .title {
          color: var(--text1, #2b2b2b);

          /* 主标题 */
          font-family: "PingFang SC";
          font-size: 20px;
          font-style: normal;
          font-weight: 400;
          line-height: 28px; /* 140% */
        }
        .right-tr {
          display: flex;
          align-items: center;
          .btn {
            width: 68px;
            margin-left: 16px;
          }
        }
      }
      .right-b {
        width: 100%;
      }
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
  height: calc(100% - 40px);
  overflow: auto;
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
      margin-left: 30px;
    }
    .process-bar-box {
      width: 36%;
      margin-left: calc(34% - 94px);
    }
  }
}
</style>
