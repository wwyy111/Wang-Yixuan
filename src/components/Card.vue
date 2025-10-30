<template>
  <div class="card-container">
    <!-- 卡片上半部分 -->
    <div class="card-top">
      <!-- 标题部分 -->
      <div class="title-section">
        <h2 class="title">{{ title }}</h2>
      </div>

      <div class="des">
        <p class="des">{{ des }}</p>
      </div>

      <!-- 标签部分 -->
      <div class="tags-section">
        <span v-for="(tag, index) in tags" :key="index" class="tag">
          {{ tag }}
        </span>
      </div>
    </div>

    <!-- 分割线 -->
    <!-- <div class="divider"></div> -->

    <!-- 卡片下半部分 - Switch 切换 -->
    <div class="card-bottom">
      <!-- <label class="switch">
        <input type="checkbox" v-model="isActive" @change="handleToggle" />
        <span class="slider"></span>
      </label> -->
      <MySwitch :modelValue="isActive" @update:modelValue="handleToggle" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["toggle"]);

// 定义组件props
const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  // title: {
  //   type: String,
  //   default: "卡片标题",
  // },
  // tags: {
  //   type: Array,
  //   default: () => [
  //     "男",
  //     "设计师",
  //     "24-33岁",
  //     "xxx",
  //     "男",
  //     "设计师",
  //     "24-33岁",
  //     "xxx",
  //   ],
  // },
  // // 初始激活状态
  // active: {
  //   type: Boolean,
  //   default: false,
  // },
  data: {
    type: Object,
    default: () => {},
  },
});

const tags = computed(() => {
  const arr = [
    props.data.age,
    props.data.gender,
    props.data.scene,
    props.data.expertise,
    props.data.productKnowledge,
    props.data.goalClarity,
  ];
  return arr;
});

const title = computed(() => {
  return props.data?.name;
});

const des = computed(() => {
  return props.data?.des;
});

// 开关状态
const isActive = computed(() => {
  return props.data?.active;
});
const handleToggle = (val) => {
  // isActive.value = !isActive.value;
  // 触发父组件的toggle事件
  emit("toggle", {
    id: props.id,
    active: val,
  });
};
</script>

<style lang="scss" scoped>
// 卡片容器样式
.card-container {
  border-radius: 6px;
  background: linear-gradient(180deg, #efebfc 0%, #f6fbff 100%);
  box-shadow: 0px 4px 10px 0px rgba(71, 70, 103, 0.1);

  display: flex;
  flex-direction: column;
  // gap: 16px;

  width: 100%;
  height: 100%;
}

// 卡片上半部分样式
.card-top {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

// 标题样式
.title-section {
  display: flex;
  width: 273px;
  padding: 10px 16px;
  align-items: center;
  gap: 10px;
  // margin-bottom: 28px;
  .title {
    color: var(--text1, #2b2b2b);

    /* 大标题 */
    font-family: "PingFang SC";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 150% */
  }
}

.des {
  color: var(--text3, #72728b);
  font-family: "PingFang SC";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 166.667% */
  // margin-bottom: 10px;
  margin-left: 10px;
}

// 标签区域样式
.tags-section {
  display: flex;
  width: 100%;
  padding: 10px 16px;
  align-items: flex-start;
  align-content: flex-start;
  gap: 6px;
  flex-wrap: wrap;
  border-bottom: 1px solid #e6e5eb;

  .tag {
    padding: 4px 10px;
    background-color: #ffffff;
    border-radius: 2px;
    color: var(--fill1, #605ce5);

    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px; /* 166.667% */
  }
}

// 卡片下半部分样式
.card-bottom {
  display: flex;
  justify-content: flex-end;
  margin: 10px 24px 20px 0;
  .switch {
    margin-right: 12px;
  }
}

// Switch开关样式
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;

  input {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .slider {
      background-color: #d3d2d6;

      &:before {
        transform: translateX(24px);
      }
    }
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #605ce5;
    transition: 0.4s;
    border-radius: 34px;

    &:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: 0.4s;
      border-radius: 50%;
    }
  }
}
</style>
