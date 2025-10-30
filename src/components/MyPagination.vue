<template>
  <div class="pagination-container">
    <!-- 总条数显示 -->
    <span class="total-items">共{{ total }}条</span>

    <!-- 翻页控制区域 -->
    <div class="pagination-controls">
      <!-- 上一页按钮 -->
      <button
        class="page-button prev-button"
        :disabled="currentPage <= 1"
        @click="handlePageChange(currentPage - 1)"
      >
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
        </svg>
      </button>

      <!-- 当前页码显示（可点击触发跳转） -->
      <button class="page-button current-page" @click="handlePageInput">
        {{ currentPage }}
      </button>

      <!-- 下一页按钮 -->
      <button
        class="page-button next-button"
        :disabled="currentPage >= totalPages"
        @click="handlePageChange(currentPage + 1)"
      >
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  // 总数据条数
  total: {
    type: Number,
    required: true,
    validator: (value) => value >= 0,
  },
  // 当前页码
  currentPage: {
    type: Number,
    required: true,
    validator: (value) => value >= 1,
  },
  // 每页显示条数
  pageSize: {
    type: Number,
    required: true,
    validator: (value) => value >= 1,
  },
});

const emit = defineEmits(["page-change"]);

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(props.total / props.pageSize);
});

/**
 * 处理页码变更事件
 * @param {number} newPage - 新的页码
 */
const handlePageChange = (newPage) => {
  // 确保新页码在有效范围内
  const validatedPage = Math.max(1, Math.min(newPage, totalPages.value));

  // 只有当页码确实变化时才触发事件
  if (validatedPage !== props.currentPage) {
    emit("page-change", validatedPage);
  }
};

/**
 * 处理当前页码点击事件
 * 这里可以扩展为弹出页码输入框，当前简单实现为跳转到第一页
 */
const handlePageInput = () => {
  // 简单实现：点击页码跳转到第一页
  // 实际项目中可以扩展为弹出页码输入框
  handlePageChange(1);
};
</script>

<style lang="scss" scoped>
.pagination-container {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.total-items {
  color: #666;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    border-color: #605ce5;
    color: #605ce5;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.current-page {
  font-weight: bold;
  border-color: #605ce5;
  color: #605ce5;
}

svg {
  fill: currentColor;
}
</style>
