<template>
  <div
    :style="{
      width: width,
    }"
    class="dropdown-container"
    v-click-outside="closeDropdown"
  >
    <!-- 下拉框触发器 -->
    <div
      class="dropdown-trigger"
      :class="{ 'dropdown-trigger-open': isOpen }"
      @click="toggleDropdown"
    >
      <span
        :class="[
          'selected-option',
          {
            'sel-color': selectedOption,
          },
        ]"
      >
        {{ selectedOption || placeholder }}
      </span>
      <el-icon v-if="isOpen" color="#605CE5" :size="14"><ArrowDown /></el-icon>
      <el-icon v-else color="#605CE5" :size="14"><ArrowUp /></el-icon>
    </div>

    <!-- 下拉选项 -->
    <transition name="dropdown">
      <div v-show="isOpen" class="dropdown-options">
        <div
          v-for="(option, index) in options"
          :key="index"
          class="dropdown-option"
          @click="selectOption(option)"
        >
          {{ option.label || option }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ArrowDown, ArrowUp } from "@element-plus/icons-vue";

// 定义组件属性
const props = defineProps({
  options: {
    type: Array,
    required: true,
    validator: (value) => {
      // 验证 options 是否为非空数组
      return Array.isArray(value) && value.length > 0;
    },
  },
  placeholder: {
    type: String,
    default: "请选择",
  },
  value: {
    type: [String, Number, Object],
    default: null,
  },
  width: {
    type: String,
    default: "",
  },
});

// 定义组件事件
const emit = defineEmits(["change"]);

// 组件状态
const isOpen = ref(false);
const selectedOption = ref(props.value);

watch(
  () => props.value,
  (newValue) => {
    selectedOption.value = newValue;
  }
);

// 切换下拉框状态
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

// 关闭下拉框
const closeDropdown = () => {
  isOpen.value = false;
};

// 选择选项
const selectOption = (option) => {
  selectedOption.value = option.label || option;
  isOpen.value = false;
  // emit("update:modelValue", option.value || option);
  emit("change", option.value || option);
};

// 点击外部区域关闭下拉框的指令
const vClickOutside = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value();
      }
    };
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener("click", el.clickOutsideEvent);
  },
};
</script>

<style lang="scss" scoped>
.dropdown-container {
  position: relative;
  // width: 100%;
  // max-width: 300px;
  user-select: none;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;

  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 32px;
  padding: 5px 8px;

  border-radius: 2px;
  border: 1px solid var(--border3, #e6e5eb);

  &:hover {
    border-color: #b3b3b3;
  }

  &.dropdown-trigger-open {
    border-color: #605ce5;
    // box-shadow: 0 0 0 1px #4a90e2;
  }
}

.selected-option {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  color: var(--text3, #72728b);
  font-size: 12px;
  font-weight: 400;
  line-height: 20px; /* 166.667% */
  margin-right: 4px;
}

.sel-color {
  color: #605ce5;
}

.dropdown-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  color: #666;
  transition: transform 0.2s ease;

  .dropdown-trigger-open & {
    transform: rotate(180deg);
    color: #4a90e2;
  }
}

.dropdown-options {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.dropdown-option {
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: var(--text1, #2b2b2b);
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  height: 32px;
  padding: 0px 8px;
  line-height: 32px;

  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }

  &:hover {
    background-color: #f5f5f5;
  }

  &:active {
    background-color: #ebebeb;
  }
}

/* 下拉动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
  transform-origin: top center;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scaleY(0.95);
}
</style>
