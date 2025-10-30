<template>
  <div
    :class="[
      'rounded-button',
      {
        'rounded-button-primary': type === 'primary',
        'rounded-button-info': type === 'info',
      },
    ]"
    @click="handleClick"
  >
    <span class="button-content">
      <span
        v-if="showIcon"
        :class="[
          'plus-icon',
          {
            'plus-icon-primary': type === 'primary',
            'plus-icon-info': type === 'info',
          },
        ]"
        >+</span
      >
      <span class="button-text">{{ text }}</span>
    </span>
  </div>
</template>

<script setup>
// 定义组件props
const props = defineProps({
  // 按钮显示的文字
  text: {
    type: String,
    default: "按钮",
  },
  showIcon: {
    type: Boolean,
    default: true,
  },
  type: {
    type: String,
    default: "primary",
  },
});

// 定义组件事件
const emit = defineEmits(["click"]);

/**
 * 处理按钮点击事件
 * 触发父组件的click事件
 */
const handleClick = (event) => {
  emit("click", event);
};
</script>

<style lang="scss" scoped>
.rounded-button {
  display: flex;
  height: 32px;
  padding: 5px 16px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 6px;

  cursor: pointer;

  .button-content {
    display: flex;
    align-items: center;
    gap: 0.5rem; // 图标和文字之间的间距
  }

  .plus-icon {
    font-size: 1.2rem;
    font-weight: bold;
  }
  .plus-icon-info {
    color: #2b2b2b;
  }
  .plus-icon-primary {
    color: #fff;
  }

  .button-text {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px; /* 157.143% */
  }
}

.rounded-button-primary {
  background: var(--fill1, #605ce5);
  .button-text {
    color: var(--bg1, #fff);
  }
}
.rounded-button-info {
  background: var(--fill2, #ffffff);
  border: 1px solid var(--border2, #cac9d4);
  .button-text {
    color: var(--text2, #474667);
  }
}
</style>
