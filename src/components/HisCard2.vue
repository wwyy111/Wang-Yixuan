<template>
  <div class="content-card">
    <!-- 左侧内容区 -->
    <div class="content-left">
      <div class="image-area" v-for="(item, index) in data.images" :key="index">
        <img :src="item" class="img" alt="img" />
      </div>
      <div class="text-content">
        <h3 class="title">{{ data.title }}</h3>
        <div class="tags">
          <span v-for="(tag, index) in data.tags" :key="index" class="tag">
            {{ tag }}
          </span>
        </div>
      </div>
    </div>

    <!-- 右侧操作区 -->
    <div class="content-right">
      <!-- 评分模块 -->
      <div class="rating">
        <div class="icon">
          <img v-if="data.images.length === 1" :src="star" alt="star" />
        </div>
        <span class="rating-value">{{ data.rating }}</span>
      </div>

      <!-- 时间显示 -->
      <div class="time">{{ formattedTime }}</div>

      <!-- 操作按钮及弹窗 -->
      <div class="actions">
        <button class="menu-button" @click.stop="togglePopover">...</button>
        <PopoverMenu
          v-if="showPopover"
          :items="menuItems"
          @close="closePopover"
          @select="handleMenuSelect"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import PopoverMenu from "./PopoverMenu.vue";
import star from "@/assets/star.png";
import his1 from "@/assets/his1.png";
import his2 from "@/assets/his2.png";
import his3 from "@/assets/his3.png";

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      images: [],
      title: "",
      tags: [],
      rating: 0,
      timestamp: 0,
    }),
  },
});

// 弹窗控制逻辑
const showPopover = ref(false);
const togglePopover = () => {
  showPopover.value = !showPopover.value;
};
const closePopover = () => {
  showPopover.value = false;
};

// 时间格式化
const formattedTime = computed(() => {
  return new Date(props.data.timestamp).toLocaleDateString();
});

// 菜单配置
const menuItems = [
  { id: "rename", label: "重命名", icon: his1 },
  // { id: "export", label: "导出", icon: his2 },
  { id: "delete", label: "删除", icon: his3 },
];

// 菜单选择处理
const emit = defineEmits(["menu-select"]);
const handleMenuSelect = (action) => {
  emit("menu-select", action);
  closePopover();
};
</script>

<style lang="scss" scoped>
.content-card {
  width: 100%;
  height: 50px;
  border-bottom: 1px solid #f2f2f5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 40px;

  .content-left {
    width: 50%;
    display: flex;
    align-items: center;
    // flex-grow: 1;
    min-width: 0;
  }
  .image-area {
    width: 50px;
    height: 50px;
    // display: flex;
    // gap: 4px;
    // height: 93px;
    overflow: hidden;
    border-radius: 4px;
    margin-right: 17px;

    .img {
      width: 100%;
      height: 93px;
      flex-shrink: 0;
      border-radius: 4px;
      background-color: #e0e0e0;
      border-radius: 4px;
      img {
        object-fit: fill;
      }
    }
  }

  .content-image {
    width: 50px;
    height: 50px;
    border-radius: 4px;
    object-fit: cover;
    margin-right: 16px;
  }

  .text-content {
    flex: 1;
    min-width: 0;
  }

  .title {
    font-size: 16px;
    margin: 0 0 8px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tags {
    display: flex;

    align-items: center;
    gap: 10px;
  }

  .tag {
    padding: 0px 8px;
    border-radius: 2px;
    background: var(--fill4, #f3f2fd);
    color: var(--fill1, #605ce5);

    /* 标签文字 */
    font-family: "PingFang SC";
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px; /* 166.667% */
  }

  .content-right {
    display: flex;
    align-items: center;
    // gap: 24px;
    // margin-left: 16px;
    width: 50%;
  }

  .rating {
    display: flex;
    align-items: center;
    gap: 4px;
    width: 34%;
    justify-content: center;

    .icon {
      margin-bottom: 4px;
    }
    .rating-value {
      color: var(--5, #009a29);

      /* 标签文字 */
      font-family: "PingFang SC";
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px; /* 166.667% */
      margin-left: 3px;
    }
  }

  .time {
    width: 33%;
    color: var(--text1, #2b2b2b);
    text-align: center;

    /* 正文文字 */
    font-family: "PingFang SC";
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 21px; /* 161.538% */
  }

  .actions {
    width: 33%;
    text-align: end;
  }

  .menu-button {
    background: none;
    border: none;
    padding: 8px;
    cursor: pointer;
    font-size: 20px;
    color: #666;
    margin-bottom: 12px;
    text-align: left;

    &:hover {
      background: #f5f5f5;
      border-radius: 4px;
    }
  }
}
</style>
