<template>
  <div class="search-container">
    <!-- 搜索图标 -->
    <span class="search-icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </span>

    <!-- 输入框 -->
    <input
      v-model="searchQuery"
      class="search-input"
      type="text"
      :placeholder="placeholder"
      @keyup.enter="handleSearch"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// 定义组件props
const props = defineProps({
  // 输入框占位文本
  placeholder: {
    type: String,
    default: "搜索...",
  },
  modelValue: String,
});

// 定义组件emits
const emit = defineEmits(["search", "update:modelValue"]);

// 搜索查询文本
const searchQuery = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

/**
 * 处理搜索事件
 * 当用户按下回车键时触发
 */
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    emit("search", searchQuery.value);
  } else {
    emit("search", "");
  }
};
</script>

<style lang="scss" scoped>
.search-container {
  display: flex;
  align-items: center;
  width: 215px;
  height: 32px;
  padding: 0px 10px;
  padding: 0 12px;
  border-radius: 4px;
  border: 1px solid var(--border3, #e6e5eb);
  background: var(--bg1, #fff);
  transition: border-color 0.3s ease;

  // 悬停和聚焦时的样式
  &:hover,
  &:focus-within {
    border-color: #b0b0b0; // 加深边框颜色
  }
}

.search-icon {
  display: flex;
  align-items: center;
  margin-right: 8px;
  color: #757575; // 图标颜色
}

.search-input {
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  font-size: 14px;
  color: #333;
  background-color: transparent;

  // 占位文本样式
  &::placeholder {
    color: var(--text4, rgba(43, 43, 43, 0.4));

    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px; /* 166.667% */
  }
}
</style>
