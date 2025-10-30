<template>
  <article class="content-card">
    <!-- 图片部分 -->
    <div class="content-card__image">
      <img :src="imageUrl" alt="img" />
    </div>

    <!-- 内容部分 -->
    <div class="content-card__content">
      <!-- 大标题 -->
      <h2 class="content-card__title">{{ title }}</h2>

      <!-- Tags 标签区域 -->
      <div v-if="tags && tags.length" class="content-card__tags">
        <span
          v-for="(tag, index) in tags"
          :key="index"
          class="content-card__tag"
        >
          {{ tag }}
        </span>
      </div>

      <!-- 时间显示 -->
      <div class="content-card__time">
        <span class="content-card__time-hours">{{ time.hours }}</span>
        <span class="content-card__time-date">{{ time.date }}</span>
      </div>
    </div>
  </article>
</template>

<script setup>
// 定义组件 props
const props = defineProps({
  // 图片 URL
  imageUrl: {
    type: String,
    required: true,
  },
  // 标题文本
  title: {
    type: String,
    required: true,
  },
  // 标签数组
  tags: {
    type: Array,
    default: () => [],
  },
  // 时间对象
  time: {
    type: Object,
    required: true,
    validator: (value) => {
      // 验证时间对象是否包含必要的属性
      return "hours" in value && "date" in value;
    },
  },
});
</script>

<style lang="scss" scoped>
.content-card {
  display: flex;
  width: 100%;
  // height: 100%;
  padding: 16px;
  box-sizing: border-box;
  cursor: pointer;

  background: white;
  border-radius: 7px;
  background: var(--bg1, #fff);
  box-shadow: 0px 4px 12px 0px rgba(95, 82, 193, 0.06);

  &__image {
    flex: 0 0 100px;
    width: 100px;
    height: 100px;
    flex-shrink: 0;
    aspect-ratio: 1/1;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  &__content {
    flex: 1;
    // padding: 16px;
    display: flex;
    flex-direction: column;
    margin-left: 14px;
  }

  &__title {
    margin: 0 0 16px 0;
    color: var(--text1, #2b2b2b);

    /* 卡片标题 */
    font-family: "PingFang SC";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px; /* 157.143% */
  }

  &__tags {
    margin-bottom: 4px;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  &__tag {
    padding: 0px 8px;
    background: #f3f2fd;
    border-radius: 2px;
    color: var(--fill1, #605ce5);

    /* 标签文字 */
    font-family: "PingFang SC";
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px; /* 166.667% */
  }

  &__time {
    display: flex;
    justify-content: space-between;
    color: var(--text3, #72728b);
    text-align: center;

    /* EN注释文字 */
    font-family: "Nunito Sans";
    font-size: 10px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px; /* 180% */
  }
}
</style>
