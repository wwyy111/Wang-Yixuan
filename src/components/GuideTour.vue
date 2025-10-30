<template>
  <!-- 这个组件本身不渲染任何DOM，仅提供功能 -->
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import Driver from "driver.js";
// import "driver.js/dist/driver.min.css";

const props = defineProps({
  // 引导步骤配置
  steps: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(
        (step) =>
          typeof step.element === "string" &&
          typeof step.popover.title === "string" &&
          typeof step.popover.description === "string"
      );
    },
  },
  // 是否在组件挂载后自动开始引导
  autoStart: {
    type: Boolean,
    default: false,
  },
  // Driver.js 配置选项
  driverOptions: {
    type: Object,
    default: () => ({
      animate: true,
      opacity: 0.75,
      padding: 10,
      allowClose: true,
      overlayClickNext: false,
    }),
  },
  // 是否显示进度
  showProgress: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits([
  "start", // 引导开始时触发
  "next", // 进入下一步时触发
  "previous", // 返回上一步时触发
  "reset", // 引导重置时触发
  "close", // 引导关闭时触发
  "complete", // 引导完成时触发
]);

// Driver.js 实例引用
const driverInstance = ref(null);

// 当前步骤索引
const currentStepIndex = ref(-1);

// 初始化 Driver.js
const initDriver = () => {
  driverInstance.value = new Driver({
    ...props.driverOptions,
    onNext: (element) => {
      currentStepIndex.value = driverInstance.value.getActiveIndex();
      emit("next", { element, index: currentStepIndex.value });
    },
    onPrevious: (element) => {
      currentStepIndex.value = driverInstance.value.getActiveIndex();
      emit("previous", { element, index: currentStepIndex.value });
    },
    onReset: () => {
      currentStepIndex.value = -1;
      emit("reset");
    },
    onClose: (element) => {
      emit("close", { element, index: currentStepIndex.value });
    },
  });

  // 添加进度显示
  if (props.showProgress) {
    driverInstance.value.onHighlighted = (element) => {
      const steps = driverInstance.value.getSteps();
      const currentIndex = driverInstance.value.getActiveIndex();
      const popover = element.querySelector(".driver-popover");

      if (popover) {
        const progress = document.createElement("div");
        progress.className = "driver-progress";
        progress.textContent = `${currentIndex + 1}/${steps.length}`;

        const title = popover.querySelector(".driver-popover-title");
        if (title) {
          title.insertAdjacentElement("afterend", progress);
        }
      }
    };
  }
};

// 开始引导
const startTour = () => {
  if (!driverInstance.value) {
    initDriver();
  }

  driverInstance.value.defineSteps(props.steps);
  driverInstance.value.start();
  currentStepIndex.value = 0;
  emit("start");
};

// 跳转到指定步骤
const goToStep = (index) => {
  if (driverInstance.value && index >= 0 && index < props.steps.length) {
    driverInstance.value.moveTo(index);
    currentStepIndex.value = index;
  }
};

// 重置引导
const resetTour = () => {
  if (driverInstance.value) {
    driverInstance.value.reset();
    currentStepIndex.value = -1;
  }
};

// 组件挂载时初始化
onMounted(() => {
  initDriver();
  if (props.autoStart) {
    startTour();
  }
});

// 组件卸载前清理
onBeforeUnmount(() => {
  if (driverInstance.value) {
    driverInstance.value.reset();
  }
});

// 暴露方法供父组件调用
defineExpose({
  startTour,
  goToStep,
  resetTour,
  currentStepIndex,
});
</script>

<style lang="scss" scoped>
/* 组件本身不渲染DOM，无需样式 */
</style>
