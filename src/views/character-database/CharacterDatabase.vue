<template>
  <div class="character-box">
    <div class="top">
      <div class="left">
        <div class="title">筛选</div>

        <div style="margin-right: 10px">
          <MySelect
            width="100px"
            placeholder="性别"
            :value="val1"
            :options="options1"
            @change="handleChange1"
          />
        </div>

        <div style="margin-right: 10px">
          <MySelect
            width="100px"
            placeholder="年龄"
            :value="val2"
            @change="handleChange2"
            :options="options2"
          />
        </div>

        <div style="margin-right: 10px">
          <MySelect
            width="130px"
            placeholder="使用场景"
            :value="val3"
            @change="handleChange3"
            :options="options3"
          />
        </div>

        <div style="margin-right: 10px">
          <MySelect
            width="150px"
            placeholder="领域专业度"
            :value="val4"
            @change="handleChange4"
            :options="options4"
          />
        </div>

        <div style="margin-right: 10px">
          <MySelect
            width="150px"
            placeholder="产品了解度"
            :value="val5"
            @change="handleChange5"
            :options="options5"
          />
        </div>

        <div style="margin-right: 10px">
          <MySelect
            width="150px"
            placeholder="目标清晰度"
            :value="val6"
            @change="handleChange6"
            :options="options6"
          />
        </div>

        <div style="margin-right: 10px">
          <MyBtn :show-icon="false" @click="handleReset" text="重置" />
        </div>
      </div>

      <div class="right">
        <div style="margin-right: 10px">
          <MyInput
            v-model="val7"
            placeholder="搜索角色"
            @search="handleSearch"
          />
        </div>
        <MyBtn @click="handleClick" text="新建角色" />
      </div>
    </div>

    <div class="card">
      <div v-for="(item, index) in dataList" :key="item.id" class="item">
        <Card :id="item.id" :data="item" @toggle="handleToggle" />
      </div>

      <!-- <Card /> -->
    </div>

    <div class="page">
      <MyPagination
        :total="total"
        :current-page="currentPage"
        :page-size="pageSize"
        @page-change="handlePageChange"
      />
    </div>

    <!-- <CardList :items="cardItems" /> -->

    <el-drawer destroy-on-close v-model="showAdd" title="角色设置">
      <AddCharacter @close="showAdd = false" @save="handleSave" />
    </el-drawer>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Card from "@/components/Card.vue";
import MySelect from "@/components/MySelect.vue";
import MyInput from "@/components/MyInput.vue";
import MyBtn from "@/components/MyBtn.vue";
import MyPagination from "@/components/MyPagination.vue";
import AddCharacter from "./AddCharacter.vue";

import { useCharacterStore } from "@/stores/character";

const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(8);

const characterStore = useCharacterStore();

const dataList = ref([]);

const tempData = ref(characterStore.data);

const cardItems = [
  { title: "卡片标题1", description: "这是第一个卡片的描述内容" },
  { title: "卡片标题2", description: "这是第二个卡片的描述内容" },
  { title: "卡片标题3", description: "这是第三个卡片的描述内容" },
];

const val1 = ref("");
const val7 = ref("");

const showAdd = ref(false);

const options1 = ref([
  {
    value: "男",
    label: "男",
  },
  {
    value: "女",
    label: "女",
  },
]);

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
  // 这里可以添加数据加载逻辑
  getPageData(characterStore.data);
};

const val2 = ref("");

const filteParams = ref({});

const handleReset = () => {
  val1.value = "";
  val2.value = "";
  val3.value = "";
  val4.value = "";
  val5.value = "";
  val6.value = "";
  val7.value = "";

  filteParams.value = {};
  getPageData(characterStore.data);
};

const handleClick = () => {
  console.log("点击了按钮");
  showAdd.value = true;
};

const options2 = ref([
  {
    value: "18-24",
    label: "18-24",
  },
  {
    value: "25-34",
    label: "25-34",
  },
  {
    value: "35-44",
    label: "35-44",
  },
  {
    value: "45-55",
    label: "45-55",
  },
  {
    value: "55+",
    label: "55+",
  },
]);

const val3 = ref("");

const options3 = ref([
  {
    value: "学习办公",
    label: "学习办公",
  },
  {
    value: "社交娱乐",
    label: "社交娱乐",
  },
]);

const val4 = ref("");

const options4 = ref([
  {
    value: "领域专业度高",
    label: "领域专业度高",
  },
  {
    value: "领域专业度低",
    label: "领域专业度低",
  },
]);

const val5 = ref("");

const options5 = ref([
  {
    value: "产品了解度高",
    label: "产品了解度高",
  },
  {
    value: "产品了解度低",
    label: "产品了解度低",
  },
]);

const val6 = ref("");

const options6 = ref([
  {
    value: "目标清晰度高",
    label: "目标清晰度高",
  },
  {
    value: "目标清晰度低",
    label: "目标清晰度低",
  },
]);

const handleSave = (data) => {
  const id = Math.random().toString(36).substring(2, 15);
  characterStore.setData({
    id,
    ...data,
  });
  showAdd.value = false;
};

const handleToggle = (data) => {
  console.log("点击了切换", data);
  characterStore.setActive(data);
};

function getPageData(data) {
  total.value = data.length;
  dataList.value = data.slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value
  );
  console.log("🚀 ~ getPageData ~ dataList.value:", dataList.value);
}

const handleSearch = (val) => {
  console.log("数据：", val);
  if (!val) {
    getPageData(characterStore.data);
    return;
  }
  filteParams.value.name = val;
  console.log("数据2", filteParams.value);
  getFilterData(filteParams.value, characterStore.data);
};

const handleChange1 = (val) => {
  val1.value = val;
  filteParams.value.gender = val;
  getFilterData(filteParams.value, characterStore.data);
};

const handleChange2 = (val) => {
  val2.value = val;
  filteParams.value.age = val;
  getFilterData(filteParams.value, characterStore.data);
};

const handleChange3 = (val) => {
  val3.value = val;
  filteParams.value.scene = val;
  getFilterData(filteParams.value, characterStore.data);
};
const handleChange4 = (val) => {
  val4.value = val;
  filteParams.value.expertise = val;
  getFilterData(filteParams.value, characterStore.data);
};

const handleChange5 = (val) => {
  val5.value = val;
  filteParams.value.productKnowledge = val;
  getFilterData(filteParams.value, characterStore.data);
};

const handleChange6 = (val) => {
  val6.value = val;
  filteParams.value.goalClarity = val;
  getFilterData(filteParams.value, characterStore.data);
};

// const getFilterData = (params, arr) => {
//   const list = arr.filter((item) => {
//     for (const key in params) {
//       if (item[key] !== params[key]) {
//         return false;
//       }
//     }
//     return true;
//   });

//   getPageData(list);
// };

function getFilterData(params, arr) {
  const list = arr.filter((item) => {
    for (const key in params) {
      if (!item[key].includes(params[key])) {
        return false;
      }
    }
    return true;
  });
  console.log("🚀 ~ list ~ list:", list);

  getPageData(list);
}

watch(
  () => characterStore.data,
  (newValue) => {
    tempData.value = newValue;

    getFilterData(filteParams.value, newValue);
    // getPageData(newValue);
  },
  {
    immediate: true,
    deep: true,
  }
);

onMounted(() => {
  getPageData(characterStore.data);
});
</script>

<style scoped lang="scss">
.character-box {
  width: 100%;
  display: flex;
  padding: 16px 24px;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;
  .top {
    display: flex;
    justify-content: space-between;
    .left {
      display: flex;
      align-items: center;
      .title {
        color: var(--text3, #72728b);
        /* 按钮文字 */
        font-family: "PingFang SC";
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px; /* 150% */
        margin-right: 10px;
      }
    }
    .right {
      display: flex;
    }
  }
  .card {
    margin-top: 30px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px 30px;
    .item {
      // width: 24%;
      // height: 180px;
      // margin-left: 1%;
    }
  }
  .page {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
