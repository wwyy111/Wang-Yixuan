<template>
  <div class="card-list">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="card-item"
      :class="{ 'is-active': activeIndex === item.id }"
      @click="handleSelect(item.id)"
    >
      <div class="card-number">
        {{ formatNumber(index + 1) }}
      </div>
      <div class="card-content">
        <h3 class="card-title">{{ item.title }}</h3>
        <p class="card-description">{{ item.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  // 卡片数据数组，每个对象应包含 title 和 description 属性
  items: {
    type: Array,
    required: true,
    validator: (value) => {
      // 验证数组中的每个对象是否包含必要的属性
      return value.every((item) => item.title && item.description);
    },
  },
  // 初始选中的卡片索引
  initialActiveIndex: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["select"]);
// 当前选中的卡片索引
const activeIndex = ref(props.initialActiveIndex);

watch(
  () => props.initialActiveIndex,
  (newValue) => {
    activeIndex.value = newValue;
  },
  {
    immediate: true,
  }
);

// 格式化编号，确保两位数显示
const formatNumber = (num) => {
  return num < 10 ? `0${num}` : num;
};

// 处理卡片选择事件
const handleSelect = (id) => {
  console.log("🚀 ~ handleSelect ~ id:", id);
  activeIndex.value = id;
  emit("select", id);
};

// 暴露方法，允许父组件获取当前选中项
defineExpose({
  getActiveIndex: () => activeIndex.value,
});
</script>

<style lang="scss" scoped>
.card-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.card-item {
  // display: flex;
  // gap: 18px;
  // padding: 16px;
  // border-radius: 8px;
  // background-color: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s ease;

  display: flex;
  width: 377px;
  padding: 7px 10px;
  box-sizing: border-box;
  align-items: center;
  gap: 7px;
  border-radius: 6px;
  background: #fff;

  &:hover {
    background: var(--fill4, #f3f2fd);
  }

  &.is-active {
    background-color: #f3f2fd;
    // border-left: 3px solid #0d6efd;
  }
}

.card-number {
  // font-size: 18px;
  // font-weight: bold;
  // color: #6c757d;
  // min-width: 24px;

  color: var(--fill1, #605ce5);

  /* 16/CN-Medium */
  font-family: "PingFang SC";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
  margin-right: 10px;
}

.card-content {
  display: flex;
  flex-direction: column;
  // gap: 8px;
}

.card-title {
  // margin: 0;
  // font-size: 16px;
  // font-weight: 600;
  // color: #212529;

  color: var(--text1, #2b2b2b);

  /* 16/CN-Medium */
  font-family: "PingFang SC";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
}

.card-description {
  // margin: 0;
  // font-size: 14px;
  // color: #6c757d;
  // line-height: 1.5;

  color: var(--text3, #72728b);

  /* 12/CN-Medium */
  font-family: "PingFang SC";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 166.667% */
}
</style>
