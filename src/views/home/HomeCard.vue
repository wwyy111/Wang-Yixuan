<template>
  <div
    class="content-card-wrapper"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- 右上角图标 -->
    <img
      v-if="cornerIcon"
      :src="cornerIcon"
      class="corner-icon"
      :class="{ hovered: isHovered }"
      alt="corner icon"
    />

    <!-- 卡片主体 -->
    <div
      class="content-card"
      :style="{ 'background-image': `url(${backgroundImage})` }"
      :class="{ hovered: isHovered }"
    >
      <!-- 卡片内容 -->
      <div class="card-content">
        <!-- 大标题 -->
        <h3 style="font-weight: bold" class="title">{{ title }}</h3>

        <!-- 描述内容 -->
        <p class="description">{{ description }}</p>

        <!-- 底部链接 -->
        <div class="footer">
          <span class="footer-text">{{ footerText }}</span>
          <!-- <img
            v-if="arrowIcon"
            :src="arrowIcon"
            class="arrow-icon"
            alt="arrow icon"
          /> -->
          <el-icon color="#605CE5" :size="14"><Right /></el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Right } from "@element-plus/icons-vue";
import { ref } from "vue";

const props = defineProps({
  backgroundImage: {
    type: String,
    required: true,
  },
  cornerIcon: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  footerText: {
    type: String,
    required: true,
  },
  arrowIcon: {
    type: String,
    default: "",
  },
});

const isHovered = ref(false);
</script>

<style lang="scss" scoped>
.content-card-wrapper {
  position: relative;
  width: 100%;
  padding-top: 15px;
  // 为向上拉伸留出空间
  padding-bottom: 40px; // 等于增加的height值
  cursor: pointer; // 添加鼠标指针样式
}

.content-card {
  position: relative;
  width: 100%;
  height: 151px; // 初始高度
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  // 向上拉伸效果
  &.hovered {
    height: 183px; // 增加的高度
    margin-top: -32px; // 向上移动的距离 = 增加的高度
  }

  // 标题左侧彩色条
  &.hovered .title::before {
    content: "";
    position: absolute;
    left: -20px;
    top: 0px;

    width: 4px;
    height: 30px;
    background: var(--fill1, #605ce5);
  }
}

.corner-icon {
  position: absolute;
  top: 18px;
  right: 15px;
  // width: 30px;
  // height: 30px;
  z-index: 10;
  transform: translateY(-30%);

  transition: all 0.3s ease-in-out;

  &.hovered {
    transform: translateY(-100%);
  }
}

.card-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease-in-out;
}

.title {
  position: relative;
  // margin: 0 0 15px 0;
  // font-size: 1.5rem;
  // font-weight: bold;
  // color: #333;

  color: var(--text1, #2b2b2b);
  font-family: "PingFang SC";
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 32px; /* 160% */
  margin-bottom: 6px;
  transition: all 0.3s ease-in-out;

  .content-card.hovered & {
    margin-top: 10px;
    margin-bottom: 20px;
  }
}

.description {
  color: var(--text3, #72728b);

  /* 卡片标题 */
  font-family: "PingFang SC";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px; /* 157.143% */
  transition: all 0.3s ease-in-out;

  .content-card.hovered & {
    // margin-bottom: 20px;
  }
}

.footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: auto;
  transition: all 0.3s ease-in-out;

  .content-card.hovered & {
    margin-top: 20px;
  }
}

.footer-text {
  // font-size: 0.9rem;
  // color: #333;
  // margin-right: 8px;

  margin-right: 6px;
  transition: all 0.3s ease-in-out;

  color: var(--fill1, #605ce5);
  font-family: var(--font-family-Font-1, "PingFang SC");
  font-size: 12.623px;
  font-style: normal;
  font-weight: var(--font-weight-400, 400);
  line-height: normal;
}

.arrow-icon {
  width: 16px;
  height: 16px;
}
</style>
