<template>
  <div class="home">
    <div class="title">Hi~欢迎使用本产品</div>

    <div class="sub-title">AI智能评估设计，简化您的工作流程</div>
    <div class="small-title">产品中心</div>
    <div class="card content-card11" style="width: 630px">
      <div style="width: 291px; height: 151px; margin-right: 24px">
        <HomeCard
          :background-image="bg1"
          :corner-icon="bg2"
          title="方案智能评估"
          description="评估单个设计方案，多维评分、明确问题"
          footer-text="开始评估"
          @click="goToSolutionAssessment"
        />
      </div>

      <div style="width: 291px; height: 151px">
        <HomeCard
          :background-image="bg3"
          :corner-icon="bg4"
          title="方案智能对比"
          description="对比多个设计方案，分析优劣、助力决策"
          footer-text="开始对比"
          @click="goToIndicatorAssessment"
        />
      </div>
    </div>
    <div class="recent">最近</div>
    <div class="recent-c">
      <div
        v-for="(item, index) in recentList"
        :key="index"
        style="width: 398px; margin-right: 16px; box-sizing: border-box"
      >
        <HomeCard2
          :image-url="item.imageUrl"
          :title="item.title"
          :tags="item.tags"
          :time="item.time"
        />
      </div>

      <!-- <div style="width: 384px; margin-right: 16px; box-sizing: border-box">
        <HomeCard2
          :image-url="img1"
          title="美团月付还款"
          :tags="tags2"
          :time="{
            hours: '10:30',
            date: '2023-05-15',
          }"
        />
      </div>

      <div style="width: 384px; margin-right: 16px; box-sizing: border-box">
        <HomeCard2
          :image-url="img1"
          title="这里是卡片标题"
          :tags="tags2"
          :time="{
            hours: '10:30',
            date: '2023-05-15',
          }"
        />
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import HomeCard from "./HomeCard.vue";
import HomeCard2 from "./HomeCard2.vue";

import img1 from "@/assets/assess/preview3.png";
import bg1 from "@/assets/bg1.png";
import bg2 from "@/assets/bg1-1.png";
import bg3 from "@/assets/bg2.png";
import bg4 from "@/assets/bg2-1.png";
import a1 from "@/assets/a1.png";
import a2 from "@/assets/a2.png";
import a3 from "@/assets/a3.png";

import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { onMounted } from "vue";

const flag = ref(localStorage.getItem("flag") || 1);

// const driverObj = driver();
const driverObj = driver({
  showProgress: true,
  steps: [
    {
      element: ".menu-item333",
      popover: {
        title: "创建评估角色",
        description: "配置用户画像，模拟不同用户视角，让评估更贴近预期反馈。",
      },
    },
    {
      element: ".menu-item222",
      popover: {
        title: "预设评估指标体系",
        description: "管理与导入评估指标集，自定义评估维度，打造专属分析体系。",
      },
    },

    {
      element: ".menu-item444",
      popover: {
        title: "准备评估素材",
        description:
          "编辑与管理设计素材，可标注组件或流程，精准指定评估内容，让分析更智能、更高效。",
      },
    },
    // {
    //   element: ".menu-item555",
    //   popover: { title: "Title", description: "Description" },
    // },
    {
      element: ".content-card11",
      popover: {
        title: "体验AI智能评估",
        description:
          "发起单个或多个方案的智能评估，获取结构化反馈与优劣排序，助你高效决策、精准优化。",
        side: "top",
        align: "start",
      },
    },
  ],
  nextBtnText: "下一步",
  prevBtnText: "上一步",
  doneBtnText: "好的",
  // onDestroyStarted: () => {
  //   if (!driverObj.hasNextStep() || confirm("Are you sure?")) {
  //     driverObj.destroy();
  //   }
  // },
});

onMounted(() => {
  if (flag.value == 1) {
    driverObj.drive();
    localStorage.setItem("flag", 2);
  }
});

const router = useRouter();

const recentList = ref([
  {
    imageUrl: a1,
    title: "文心智能体平台智能体商店",
    tags: ["界面一致性", "使用灵活性与效率", "视觉简洁性", "辅助信息支持度"],
    time: {
      hours: "10:21",
      date: "2025-03-12",
    },
  },

  {
    imageUrl: a2,
    title: "美团月付还款",
    tags: ["视觉风格统一性", "品牌识别度", "信息组织合理性", "用户补偿能力"],
    time: {
      hours: "14:28",
      date: "2025-03-23",
    },
  },

  // {
  //   imageUrl: a3,
  //   title: "微信关闭自动续费",
  //   tags: [
  //     "是否符合直觉与习惯用法",
  //     "界面元素清晰度",
  //     "信息、功能入口容易找到",
  //   ],
  //   time: {
  //     hours: "17:36",
  //     date: "2025-04-28",
  //   },
  // },
]);
const goToSolutionAssessment = () => {
  router.push("/solution-assessment");
};

const goToIndicatorAssessment = () => {
  router.push("/indicator-assessment");
};

const tags1 = ref([
  "界面一致性",
  "使用灵活性与效率",
  "视觉简洁性",
  "辅助信息支持度",
]);
const tags2 = ref([
  "视觉风格统一性",
  "品牌识别度",
  "信息组织合理性",
  "用户补偿能力",
]);
</script>

<style scoped lang="scss">
.home {
  .title {
    color: var(--fill1, #605ce5);
    font-family: "PingFang SC";
    font-size: 48px;
    font-style: normal;
    font-weight: 400;
    line-height: 56px; /* 116.667% */
    letter-spacing: 3.36px;
    margin-bottom: 24px;
    margin-top: 75px;
    margin-left: 24px;
    font-weight: bold;
  }
  .sub-title {
    color: var(--text1, #2b2b2b);
    font-family: "PingFang SC";
    font-size: 32px;
    font-style: normal;
    font-weight: 400;
    line-height: 40px; /* 125% */
    letter-spacing: 2.24px;
    margin-bottom: 40px;
    margin-left: 24px;
    font-weight: bold;
  }
  .small-title {
    color: var(--text2, #474667);

    /* 卡片标题 */
    font-family: "PingFang SC";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px; /* 157.143% */
    margin-bottom: 30px;
    margin-left: 24px;
  }
  .card {
    margin-left: 24px;
    display: flex;
  }
  .recent {
    color: var(--text2, #474667);

    /* 卡片标题 */
    font-family: "PingFang SC";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px; /* 157.143% */
    margin: 40px 0 16px 0;
    margin-left: 24px;
  }
  .recent-c {
    margin-left: 24px;
    display: flex;
  }
}
</style>
