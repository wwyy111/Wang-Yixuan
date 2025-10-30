<template>
  <div class="his">
    <div class="top">
      <div class="top-l">
        <div
          style="cursor: pointer"
          :class="[
            'icon',
            'icon1',
            {
              active: layout === 'card',
            },
          ]"
          @click="handleChangeLayout('card')"
        >
          <img v-if="layout === 'card'" :src="img1" />
          <img v-else :src="img3" />
        </div>
        <div
          :class="[
            'icon',
            'icon2',
            {
              active: layout === 'list',
            },
          ]"
          class="icon icon2"
          @click="handleChangeLayout('list')"
        >
          <img v-if="layout === 'card'" :src="img2" />
          <img v-else :src="img4" />
        </div>
      </div>

      <div class="top-r" style="display: flex">
        <div style="margin-right: 16px">
          <MyInput
            v-model="searchText"
            placeholder="搜索项目"
            @search="handleSearch"
          />
        </div>
        <div style="margin-right: 16px">
          <MySelect
            width="120px"
            placeholder="所有项目"
            :value="val1"
            :options="options1"
            @change="handleChange1"
          />
        </div>

        <div>
          <MySelect
            width="100px"
            placeholder="排列方式"
            :value="val2"
            @change="handleChange2"
            :options="options2"
          />
        </div>

        <div style="margin-left: 10px">
          <MyBtn :show-icon="false" @click="handleReset" text="重置" />
        </div>
      </div>
    </div>

    <div v-if="layout === 'card'" class="card-list card-list1">
      <div class="item" v-for="item in hisData" :key="item.id">
        <HisCard
          :data="item"
          @edit="handleEdit(item)"
          @action="handleAction(item)"
        />
      </div>
    </div>
    <div v-else class="card-list card-list2">
      <!-- <HisCard2 :item="cardData2" @select="handleAction2" /> -->

      <div class="header">
        <div class="text">文件</div>
        <div class="text-r">
          <div class="text1 text1-1">结果</div>
          <div class="text1 text1-2">上次打开时间</div>
          <div class="text1 text1-3">操作</div>
        </div>
      </div>
      <div class="item2" v-for="item2 in hisData" :key="item2.id">
        <HisCard2 :data="item2" @edit="handleEdit2(item)" />
      </div>
    </div>

    <div style="margin-top: 16px; display: flex; justify-content: flex-end">
      <MyPagination
        :total="total"
        :current-page="currentPage"
        :page-size="pageSize"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import img1 from "@/assets/c.png";
import img3 from "@/assets/c-1.svg";
import img2 from "@/assets/l.png";
import img4 from "@/assets/l-1.svg";
import a1 from "@/assets/a1.png";
import a2 from "@/assets/a2.png";
import a3 from "@/assets/a3.png";
import a4 from "@/assets/a4.png";
import a5 from "@/assets/a5.png";
import a6 from "@/assets/a6.png";
import a7 from "@/assets/a7.png";
import a8 from "@/assets/a8.png";

const initData = ref([
  {
    id: 0,
    title: "文心智能体平台智能体商店",
    rating: 3.8,
    tags: ["界面一致性", "使用灵活性与效率", "视觉简洁性", "辅助信息支持度"],
    timestamp: "2025-03-03 09:30",
    images: [a1],
    type: "方案智能评估",
  },
  {
    id: 1,
    title: "美团月付还款",
    rating: 4.2,
    tags: ["视觉风格统一性", "品牌识别度", "信息组织合理性", "用户补偿能力"],
    timestamp: "2025-03-11 14:45",
    images: [a2],
    type: "方案智能评估",
  },
  {
    id: 2,
    title: "微信关闭自动续费",
    rating: 3.6,
    tags: [
      "是否符合直觉与习惯用法",
      "界面元素清晰度",
      "信息、功能入口容易找到",
    ],
    timestamp: "2025-03-12 11:20",
    images: [a3],
    type: "方案智能评估",
  },
  {
    id: 3,
    title: "wink首页",
    rating: 4,
    tags: [
      "文案信息的易理解性",
      "界面元素清晰度",
      "界面布局合理性",
      "信息、功能入口容易找到",
    ],
    timestamp: "2025-04-01 16:10",
    images: [a4],
    type: "方案智能评估",
  },
  {
    id: 4,
    title: "醒图调节功能",
    rating: 4.5,
    tags: [
      "文案信息的易理解性",
      "界面元素清晰度",
      "界面布局合理性",
      "信息、功能入口容易找到",
    ],
    timestamp: "2025-04-21 10:30",
    images: [a5],
    type: "方案智能评估",
  },
  {
    id: 5,
    title: "微信、支付宝关闭自动续费",
    rating: "",
    tags: ["操作的复杂性", "完成任务的效率", "是否符合直觉与习惯用法"],
    timestamp: "2025-04-23 13:15",
    images: [a6, a7],
    type: "方案智能对比",
  },
  {
    id: 6,
    title: "飞书移动端工作台",
    rating: 4.2,
    tags: ["界面元素清晰度", "界面布局合理性", "信息、功能入口容易找到"],
    timestamp: "2025-05-01 15:50",
    images: [a8],
    type: "方案智能评估",
  },
]);

const hisData = ref(initData.value);

const layout = ref("card");

const searchText = ref("");

const val1 = ref("");
const options1 = ref([
  {
    label: "方案智能评估",
    value: "方案智能评估",
  },
  {
    label: "方案智能对比",
    value: "方案智能对比",
  },
]);

const options2 = ref([
  {
    label: "时间正序",
    value: "时间正序",
  },
  {
    label: "时间倒序",
    value: "时间倒序",
  },
]);
const val2 = ref("");

const handleChangeLayout = (val) => {
  console.log(val);
  layout.value = val;
};

const handleEdit = () => {
  console.log("编辑操作");
};

const handleAction = (action) => {
  console.log("执行操作:", action);
};

const handleEdit2 = () => {
  console.log("编辑操作");
};

const total = ref(7);
const currentPage = ref(1);
const pageSize = ref(16);
const handlePageChange = (newPage) => {
  // currentPage.value = newPage;
  // // 这里可以添加数据加载逻辑
  // getPageData(characterStore.data);
};

const handleSearch = (val) => {
  // filteParams.value.name = val;
  // getFilterData2(filteParams.value, characterStore.data);
  if (!val) {
    hisData.value = initData.value;
    return;
  }
  hisData.value = initData.value.filter((item) => item.title.includes(val));
  total.value = hisData.value.length;
};
const handleChange1 = (val) => {
  val1.value = val;
  hisData.value = initData.value.filter((item) => item.type === val);
  total.value = hisData.value.length;
};
const handleChange2 = (val) => {
  val2.value = val;
  // hisData.value = initData.value.filter((item) => item.type === val);
  val === "时间正序"
    ? (hisData.value = sortByDateAsc(initData.value))
    : (hisData.value = sortByDateDesc(initData.value));
  total.value = hisData.value.length;
};
const handleReset = () => {
  val1.value = "";
  val2.value = "";
  searchText.value = "";
  hisData.value = initData.value;
  total.value = hisData.value.length;
};
function sortByDateAsc(array, dateKey = "timestamp") {
  const arrayCopy = [...array];
  return arrayCopy.sort((a, b) => {
    const dateA = new Date(a[dateKey]);
    const dateB = new Date(b[dateKey]);
    return dateA - dateB;
  });
}

function sortByDateDesc(array, dateKey = "timestamp") {
  const arrayCopy = [...array];
  return arrayCopy.sort((a, b) => {
    const dateA = new Date(a[dateKey]);
    const dateB = new Date(b[dateKey]);
    return dateB - dateA;
  });
}
</script>

<style scoped lang="scss">
.his {
  width: 100%;
  padding: 16px 24px;
  .top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    .top-l {
      display: flex;
      align-items: center;
      .icon {
        display: flex;
        width: 32px;
        height: 32px;
        padding: 7.5px 8px;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        // border: 1px solid var(--fill1, #605ce5);
        background: #fff;
      }
      .icon1 {
        margin-right: 20px;
      }
      .icon1.active {
        background: var(--fill1, #605ce5);
      }
      .icon2.active {
        background: var(--fill1, #605ce5);
      }
    }
    .top-r {
    }
  }
  .card-list {
    width: 100%;
  }
  .card-list1 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
  }
  .card-list2 {
    display: flex;
    width: 100%;
    padding: 12px 22px;
    flex-direction: column;
    align-items: flex-start;
    gap: 18px;
    border-radius: 6px;
    background: var(--bg1, #fff);
    .header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      .text {
        width: 50%;
        color: var(--text3, #72728b);
        text-align: left;

        /* 13/CN-Medium */
        font-family: "PingFang SC";
        font-size: 13px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 169.231% */
      }
      .text-r {
        display: flex;
        width: 50%;
        .text1 {
          color: var(--text3, #72728b);
          text-align: center;

          /* 13/CN-Medium */
          font-family: "PingFang SC";
          font-size: 13px;
          font-style: normal;
          font-weight: 400;
          line-height: 22px; /* 169.231% */
        }
        .text1-1 {
          width: 34%;
        }
        .text1-2 {
          width: 33%;
        }
        .text1-3 {
          width: 33%;
          text-align: end;
        }
      }
    }
    .item2 {
      width: 100%;
      height: 68px;
    }
  }
}
</style>
