<template>
  <div
    class="content-card"
    @mouseenter="showActions = true"
    @mouseleave="handleMouseLeave"
  >
    <!-- 头部 - 标题和评分 -->
    <div class="card-header">
      <h3 class="title">{{ data.title }}</h3>
      <div class="rating">
        <div class="star">
          <img v-if="data.images.length === 1" :src="star" alt="star" />
        </div>
        <span class="text">{{ data.rating }}</span>
      </div>
    </div>

    <!-- 标签区域 -->
    <div class="tags">
      <span v-for="(tag, index) in data.tags" :key="index" class="tag">{{
        tag
      }}</span>
    </div>

    <!-- 图片区域 -->
    <div class="image-area">
      <div
        class="img"
        :style="{
          width: data.images.length > 1 ? `124px` : '252px',
        }"
        v-for="(item, index) in data.images"
        :key="index"
      >
        <img :src="item" alt="img" />
      </div>
    </div>

    <!-- 底部 - 时间或操作按钮 -->
    <div
      class="card-footer"
      :class="{
        'card-footer2': showActions,
      }"
    >
      <template v-if="!showActions">
        <span class="time">{{ formattedTime }}</span>
        <span class="date">{{ formattedDate }}</span>
      </template>
      <template v-else>
        <div class="action-btn edit" @click="handleEdit">
          <!-- <img :src="edit" alt="Edit" /> -->
        </div>
        <div class="more-actions">
          <button class="action-btn more" @click="toggleMoreActions">
            ...
          </button>
          <ul v-if="showMoreActions" class="action-list">
            <li @click="handleAction('rename')"><img :src="his1" />重命名</li>
            <!-- <li @click="handleAction('export')"><img :src="his2" />导出</li> -->
            <li @click="handleAction('delete')"><img :src="his3" />删除</li>
          </ul>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import star from "@/assets/star.png";
import edit from "@/assets/edit.png";
import his1 from "@/assets/his1.png";
import his2 from "@/assets/his2.png";
import his3 from "@/assets/his3.png";

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      title: "默认标题",
      rating: 3,
      tags: ["标签1", "标签2", "标签3"],
      timestamp: Date.now(),
      images: [star, star, star],
    }),
    validator: (data) => {
      // 验证 rating 在 1-5 之间
      if (data.rating < 1 || data.rating > 5) return false;
      // 验证 tags 是数组
      if (!Array.isArray(data.tags)) return false;
      // 验证 timestamp 是有效的时间戳
      return !isNaN(new Date(data.timestamp).getTime());
    },
  },
});

const emit = defineEmits(["edit", "action"]);

// 控制操作按钮显示
const showActions = ref(false);
// 控制更多操作菜单显示
const showMoreActions = ref(false);

// 格式化时间显示
const formattedTime = computed(() => {
  const date = new Date(props.data.timestamp);
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
});

// 格式化日期显示
const formattedDate = computed(() => {
  const date = new Date(props.data.timestamp);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
});

// 切换更多操作菜单
const toggleMoreActions = () => {
  showMoreActions.value = !showMoreActions.value;
};

// 处理编辑操作
const handleEdit = () => {
  emit("edit");
};

// 处理更多操作菜单中的操作
const handleAction = (action) => {
  showMoreActions.value = false;
  emit("action", action);
};

const handleMouseLeave = () => {
  showActions.value = false;
  showMoreActions.value = false; // 新增这行重置更多操作状态
};
</script>

<style lang="scss" scoped>
.content-card {
  width: 100%;
  display: flex;
  padding: 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  border-radius: 6px;
  background: var(--bg1, #fff);
}

.card-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title {
    color: var(--text1, #2b2b2b);

    /* 卡片标题 */
    font-family: "PingFang SC";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px; /* 157.143% */
  }

  .rating {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;

    .star {
      margin-right: 3px;
    }
    .text {
      color: var(--5, #009a29);

      /* 标签文字 */
      font-family: "PingFang SC";
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px; /* 166.667% */
    }
  }
}

.tags {
  display: flex;
  flex-wrap: wrap;
  height: 46px;
  gap: 6px;

  .tag {
    padding: 2px 6px;
    background-color: #f0f0f0;
    border-radius: 4px;
    font-size: 12px;
    height: 20px;
    box-sizing: border-box;

    display: flex;
    // width: 45px;
    padding: 0px 8px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    color: var(--fill1, #605ce5);

    /* 标签文字 */
    font-family: "PingFang SC";
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px; /* 166.667% */
  }
}

.image-area {
  width: 252px;
  height: 93px;
  display: flex;
  gap: 4px;
  height: 93px;
  overflow: hidden;

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

.card-footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 20px;

  .time,
  .date {
    color: var(--text3, #72728b);

    /* EN注释文字 */
    font-family: "Nunito Sans";
    font-size: 10px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px; /* 180% */
  }

  .action-btn {
    padding: 4px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &.more {
      background-color: transparent;
      font-size: 16px;
      line-height: 1;
      padding: 0 8px;
    }
  }

  .more-actions {
    position: relative;
  }

  .action-list {
    position: absolute;
    right: 0;
    bottom: 100%;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 4px 0;
    margin: 0;
    list-style: none;
    min-width: 80px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 10;

    display: flex;
    width: 136px;
    padding: 8px 9px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;

    li {
      padding: 4px 12px;
      cursor: pointer;
      color: var(--text1, #2b2b2b);

      /* 按钮文字小 */
      font-family: "PingFang SC";
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px; /* 157.143% */
      img {
        margin-right: 12px;
      }
      &:hover {
        background-color: #f5f5f5;
      }
    }
  }
}
.card-footer2 {
  justify-content: space-around;
}
</style>
