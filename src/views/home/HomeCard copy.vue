<template>
  <div
    class="card-container"
    :class="{ 'box-hover': isHovered }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- 背景 SVG -->
    <div v-if="isHovered" class="card-background" v-html="backgroundSvg"></div>
    <div v-else class="card-background" v-html="backgroundSvg2"></div>

    <!-- 卡片内容 -->
    <div class="card-content">
      <!-- 右上角图标（使用绝对定位溢出） -->
      <div class="corner-icon" v-html="cornerIconSvg"></div>

      <!-- 主内容区域 -->
      <div class="main-content">
        <h2 class="title">{{ title }}</h2>
        <p class="description">{{ description }}</p>
        <div class="footer">
          <span class="footer-text">{{ footerText }}</span>
          <el-icon color="#605CE5" :size="14"><Right /></el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 定义组件 props
import { Right } from "@element-plus/icons-vue";

const isHovered = ref(false);
const props = defineProps({
  // 背景 SVG 字符串
  backgroundSvg: {
    type: String,
    required: true,
    default:
      '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"><rect width="100" height="100" fill="#f5f5f5" rx="10" ry="10"/></svg>',
  },
  backgroundSvg2: {
    type: String,
    required: true,
    default:
      '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"><rect width="100" height="100" fill="#f5f5f5" rx="10" ry="10"/></svg>',
  },
  // 右上角图标 SVG 字符串
  cornerIconSvg: {
    type: String,
    required: true,
    default:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
  },
  // 标题文本
  title: {
    type: String,
    required: true,
    default: "卡片标题",
  },
  // 描述文本
  description: {
    type: String,
    required: true,
    default: "这里是卡片的描述内容，可以包含多行文本。",
  },
  // 底部文本
  footerText: {
    type: String,
    required: true,
    default: "查看更多",
  },
  // 底部图标 SVG 字符串
  footerIconSvg: {
    type: String,
    required: true,
    default:
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>',
  },
  // 右上角图标溢出距离（新增 prop）
  cornerIconOffset: {
    type: String,
    default: "-10px",
  },
});
</script>

<style lang="scss" scoped>
.card-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  overflow: visible; // 改为 visible 让图标可以溢出

  // 背景样式
  .card-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    border-radius: inherit; // 继承父元素的圆角
    overflow: hidden; // 背景保持圆角裁剪

    // 确保 SVG 背景填充整个容器
    svg {
      width: 100%;
      height: 100%;
    }
  }

  // 内容容器
  .card-content {
    position: relative;
    z-index: 1;
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;

    // 右上角图标（绝对定位溢出）
    .corner-icon {
      position: absolute;
      top: -12px;
      right: 52px;
      width: 24px;
      height: 24px;

      // 确保 SVG 图标正确显示
      svg {
        display: block;
        width: 100%;
        height: 100%;
      }
    }

    // 主内容区域
    .main-content {
      flex-grow: 1;
      display: flex;
      flex-direction: column;

      // 标题样式
      .title {
        color: var(--text1, #2b2b2b);
        font-family: "PingFang SC";
        font-size: 20px;
        font-style: normal;
        font-weight: 400;
        line-height: 32px; /* 160% */
        margin-bottom: 6px;
      }

      // 描述文本样式
      .description {
        // margin: 0 0 auto 0;
        // line-height: 1.5;

        color: var(--text3, #72728b);

        /* 卡片标题 */
        font-family: "PingFang SC";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
      }

      // 底部区域
      .footer {
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        // 底部文本
        .footer-text {
          margin-right: 6px;

          color: var(--fill1, #605ce5);
          font-family: var(--font-family-Font-1, "PingFang SC");
          font-size: 12.623px;
          font-style: normal;
          font-weight: var(--font-weight-400, 400);
          line-height: normal;
        }

        // 底部图标
        .footer-icon {
          display: inline-flex;
          align-items: center;

          svg {
            display: block;
          }
        }
      }
    }
  }
}
.box-hover {
  .card-background {
    height: 120%;
    // background-color: red;
    margin-top: -30px;
    svg {
      height: 120%;
    }
  }
  .card-content {
    .main-content {
      .title::after {
        content: "";
        position: absolute;
        top: 36px;
        left: 0;
        transform: translateY(-50%);
        width: 4px;
        height: 30px;
        background: var(--fill1, #605ce5);
      }
    }
  }
}
</style>
