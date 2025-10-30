<template>
  <div class="material-library">
    <div class="top">
      <div class="top-title">
        <div class="t-left">
          <div class="t1">设计稿处理</div>
          <div class="t2">为设计方案添加标注，让结果精准有效</div>
        </div>
        <div class="t-right">
          <img :src="img1" />
        </div>
      </div>
    </div>

    <div class="bottom">
      <div class="title">所有图片</div>
      <div class="filter">
        <div style="margin-right: 16px">
          <MyInput
            v-model="searchText"
            placeholder="搜索图片"
            @search="handleSearch"
          />
        </div>
        <div style="margin-right: 16px">
          <MySelect
            width="150px"
            placeholder="所有图片"
            :value="val1"
            @change="handleChange1"
            :options="options1"
          />
        </div>
        <div style="margin-right: 16px">
          <MySelect
            width="150px"
            placeholder="排序方式"
            :value="val2"
            @change="handleChange2"
            :options="options2"
          />
        </div>

        <div style="margin-right: 10px">
          <MyBtn :show-icon="false" @click="handleReset" text="重置" />
        </div>
      </div>

      <div class="content">
        <div
          @click="handleClick"
          class="item"
          v-for="(item, index) in hisData"
          :key="index"
        >
          <div class="item-top">
            <div class="img">
              <img :src="item.img" />
              <div class="tag">{{ item.type }}</div>
            </div>
          </div>

          <div class="item-bottom">
            <div class="item-title">{{ item.name }}</div>
            <div class="item-desc">{{ item.time }}</div>
          </div>
        </div>
      </div>
      <div
        class="page"
        style="
          margin-top: 16px;
          display: flex;
          justify-content: flex-end;
          width: 100%;
          padding-bottom: 20px;
        "
      >
        <MyPagination
          style="margin-right: 20px"
          :total="total"
          :current-page="currentPage"
          :page-size="pageSize"
          @page-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import titleImg from "@/assets/material-t.png";
import img1 from "@/assets/m-icon.png";
import a from "@/assets/sucai/a.png";
import b from "@/assets/sucai/b.png";
import c from "@/assets/sucai/c.png";
import d from "@/assets/sucai/d.png";
import e from "@/assets/sucai/e.png";
import f from "@/assets/sucai/f.png";

const router = useRouter();

const val1 = ref("");
const val2 = ref("");

const searchText = ref("");

const initData = [
  {
    id: 1,
    img: a,
    name: "文心智能体平台智能体商店",
    time: "2025-01-01 10:20:00",
    type: "界面截图",
  },
  {
    id: 2,
    img: b,
    name: "wink首页",
    time: "2025-02-01 08:00:00",
    type: "界面截图",
  },
  {
    id: 3,
    img: c,
    name: "微信-关闭续费",
    time: "2025-02-05 10:00:00",
    type: "流程图",
  },
  {
    id: 4,
    img: d,
    name: "支付宝-关闭续费",
    time: "2025-03-01 14:00:00",
    type: "流程图",
  },
  {
    id: 5,
    img: e,
    name: "AppStore-关闭续费",
    time: "2025-04-04 20:05:00",
    type: "流程图",
  },
  {
    id: 6,
    img: f,
    name: "美团月付还款",
    time: "2025-05-01 19:08:00",
    type: "流程图",
  },
];

const hisData = ref(initData);

const total = ref(6);
const currentPage = ref(1);
const pageSize = ref(16);

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
  // 这里可以添加数据加载逻辑
  // getPageData(characterStore.data);
};

const handleSearch = (val) => {
  // filteParams.value.name = val;
  // getFilterData2(filteParams.value, characterStore.data);
  if (!val) {
    hisData.value = initData;
    return;
  }
  hisData.value = initData.filter((item) => item.name.includes(val));
  total.value = hisData.value.length;
};
const handleChange1 = (val) => {
  console.log("🚀 ~ handleChange1 ~ val111:", val);
  val1.value = val;
  hisData.value = initData.filter((item) => {
    console.log("🚀 ~ handleChange1 ~ item:222", item);
    console.log("🚀 ~ handleChange1 ~ item:2223333", val);

    return item.type === val;
  });
  console.log("🚀 ~ handleChange1 ~ hisData.value:888888", hisData.value);
  console.log("🚀 ~ handleChange1 ~ hisData.value:8888888888", initData);
  total.value = hisData.value.length;
};
const handleClick = () => {
  router.push("drew-board");
};
const options1 = [
  {
    label: "界面截图",
    value: "界面截图",
  },
  {
    label: "流程图",
    value: "流程图",
  },
];
const handleChange2 = (val) => {
  val2.value = val;
  // hisData.value = initData.filter((item) => item.type === val);
  val === "时间正序"
    ? (hisData.value = sortByDateAsc(initData))
    : (hisData.value = sortByDateDesc(initData));
  total.value = hisData.value.length;
};
const options2 = [
  {
    label: "时间正序",
    value: "时间正序",
  },
  {
    label: "时间倒序",
    value: "时间倒序",
  },
];

const handleReset = () => {
  val1.value = "";
  val2.value = "";
  searchText.value = "";
  hisData.value = initData;
  total.value = hisData.value.length;
};
const handleSearchImg = () => {
  console.log("handleSearchImg");
};

function sortByDateAsc(array, dateKey = "time") {
  const arrayCopy = [...array];
  return arrayCopy.sort((a, b) => {
    const dateA = new Date(a[dateKey]);
    const dateB = new Date(b[dateKey]);
    return dateA - dateB;
  });
}

function sortByDateDesc(array, dateKey = "time") {
  const arrayCopy = [...array];
  return arrayCopy.sort((a, b) => {
    const dateA = new Date(a[dateKey]);
    const dateB = new Date(b[dateKey]);
    return dateB - dateA;
  });
}
</script>

<style scoped lang="scss">
.material-library {
  width: 100%;
  padding: 24px;
  padding-top: 0px;
  box-sizing: border-box;

  .top {
    margin-bottom: 21px;
    .top-title {
      width: 354px;
      height: 106px;
      background-image: url("@/assets/material-t.png");
      background-size: cover;
      background-position: center;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .t-left {
        margin-left: 25px;
        .t1 {
          color: var(--text1, #2b2b2b);
          font-size: 16px;
          font-style: normal;
          font-weight: 400;
          line-height: 24px; /* 150% */
          margin-bottom: 10px;
        }
        .t2 {
          color: var(--text3, #72728b);
          font-size: 13px;
          font-style: normal;
          font-weight: 400;
          line-height: 21px; /* 161.538% */
        }
      }
      .t-right {
        margin-right: 19px;
      }
    }
  }
  .bottom {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    background-color: #fff;
    .title {
      display: flex;
      width: 100%;
      padding: 16px;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 16px;
      border-bottom: 1px solid #e6e5eb;
    }
    .filter {
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }
    .content {
      width: 100%;
      padding: 15px 16px 20px 16px;
      box-sizing: border-box;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 30px 50px;
      .item {
        width: 100%;
        .item-top {
          .img {
            border: 1px solid #f3f2fd;
            width: 100%;
            height: 176px;
            flex-shrink: 0;
            border-radius: 8px;
            background: #d9d9d9;
            position: relative;
            background-image: url("@/assets/material-t.png");
            background-size: cover;
            background-position: center;
            cursor: pointer;
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            .tag {
              position: absolute;
              left: 5px;
              bottom: 13px;
              display: inline-flex;
              padding: 0px 8px;
              align-items: center;
              gap: 10px;
              color: var(--fill1, #605ce5);

              /* 标签文字 */
              font-family: "PingFang SC";
              font-size: 12px;
              font-style: normal;
              font-weight: 400;
              line-height: 20px; /* 166.667% */
              border-radius: 2px;
              background: var(--fill4, #f3f2fd);
            }
          }
        }
        .item-bottom {
          width: 100%;
          margin-top: 9px;
          display: flex;
          justify-content: space-between;
          .item-title {
            color: var(--text1, #2b2b2b);

            /* 卡片标题 */
            font-family: "PingFang SC";
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px; /* 157.143% */
          }
          .item-desc {
            color: var(--text3, #72728b);

            /* EN注释文字 */
            font-family: "Nunito Sans";
            font-size: 10px;
            font-style: normal;
            font-weight: 400;
            line-height: 18px; /* 180% */
          }
        }
      }

      .page {
        margin-top: 16px;
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
