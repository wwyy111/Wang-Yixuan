<template>
  <div
    class="switch-container"
    :class="{ 'is-active': modelValue }"
    @click="toggleSwitch"
  >
    <div class="switch-track">
      <div class="switch-thumb"></div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

// 定义组件接口
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

// 切换开关状态
const toggleSwitch = () => {
  emit("update:modelValue", !props.modelValue);
  // emit("change", !props.modelValue);
};
</script>

<style lang="scss" scoped>
.switch-container {
  // 容器样式，确保开关元素垂直堆叠
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  width: fit-content;
}

.switch-track {
  // 长条形轨道样式
  width: 24px;
  height: 6px;
  border-radius: 20px;
  background-color: #ccc; // 默认灰色背景
  position: relative;
  margin-top: 12px; // 为圆形thumb预留空间
  transition: background-color 0.2s ease;
}

.switch-thumb {
  // 圆形thumb样式
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: white;
  position: absolute;
  top: -8px; // 部分覆盖轨道
  left: -10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
}

// 激活状态样式
.switch-container.is-active {
  .switch-track {
    background-color: #605ce5; // 激活时的彩色背景
  }

  .switch-thumb {
    transform: translateX(24px); // 向右移动
  }
}
</style>
