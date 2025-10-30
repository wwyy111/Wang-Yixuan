<template>
  <div class="progress-step">
    <!-- 左侧步骤 -->
    <div
      class="step step-left"
      :class="{ active: isLeftActive, inactive: !isLeftActive }"
      @click="activateLeft"
    >
      <div class="step-dot"></div>
      <div class="step-text">
        <slot name="left-text"></slot>
      </div>
    </div>

    <!-- 中间分隔线 -->
    <div class="divider"></div>

    <!-- 右侧步骤 -->
    <div
      class="step step-right"
      :class="{ active: isRightActive, inactive: !isRightActive }"
      @click="activateRight"
    >
      <div class="step-dot"></div>
      <div class="step-text">
        <slot name="right-text"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// 控制左右步骤的激活状态
const isLeftActive = ref(true);
const isRightActive = ref(false);

// 激活左侧步骤
const activateLeft = () => {
  isLeftActive.value = true;
  isRightActive.value = false;
};

// 激活右侧步骤
const activateRight = () => {
  isLeftActive.value = false;
  isRightActive.value = true;
};

// 暴露方法给父组件，允许外部控制步骤
defineExpose({
  nextStep: activateRight,
  prevStep: activateLeft,
});
</script>

<style lang="scss" scoped>
.progress-step {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  .step {
    display: flex;
    align-items: center;
    cursor: pointer;

    // 步骤圆点基础样式
    .step-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin: 0 8px;
    }

    // 步骤文本基础样式
    .step-text {
      font-size: 14px;
    }

    // 激活状态
    &.active {
      .step-dot {
        background-color: #605ce5; // 主色调
      }
      .step-text {
        color: #333; // 深色文字
        font-weight: 500;
      }
    }

    // 未激活状态
    &.inactive {
      .step-dot {
        background-color: #72728b; // 灰色
      }
      .step-text {
        color: #999; // 浅色文字
      }
    }
  }

  // 中间分隔线
  .divider {
    flex: 1;
    height: 1px;
    margin: 0 10px;
    border-top: 1px dashed #c0c4cc;
  }
}
</style>
