<template>
  <div class="popover-menu" ref="popoverRef">
    <div
      v-for="item in items"
      :key="item.id"
      class="menu-item"
      @click.stop="handleSelect(item.id)"
    >
      <img
        style="margin-right: 6px"
        v-if="item.icon"
        :src="item.icon"
        alt="icon"
      />
      {{ item.label }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["select", "close"]);
const popoverRef = ref(null);

// 点击外部检测逻辑
const clickOutsideHandler = (event) => {
  if (popoverRef.value && !popoverRef.value.contains(event.target)) {
    emit("close");
  }
};

// 生命周期处理
onMounted(() => {
  document.addEventListener("click", clickOutsideHandler);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", clickOutsideHandler);
});

const handleSelect = (action) => {
  emit("select", action);
  emit("close");
};
</script>

<style lang="scss" scoped>
.popover-menu {
  /* 原有样式保持不变 */
  position: absolute;
  right: 0;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  min-width: 120px;
  z-index: 100;

  .menu-item {
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;
    text-align: left;

    &:hover {
      background: #f5f5f5;
    }
  }
}
</style>
