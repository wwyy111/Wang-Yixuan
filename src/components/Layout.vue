<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <aside :class="['sidebar', { 'sidebar-collapsed': isCollapsed }]">
      <div class="sidebar-top">
        <div class="logo-area" v-show="!isCollapsed">
          <!-- <img class="logo" src="@/assets/logo.png" alt="Logo" /> -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
          >
            <path
              d="M10.9982 2.3418L18.0696 6.4668V14.7168L10.9982 18.8418L3.92673 14.7168V6.4668L10.9982 2.3418Z"
              fill="#E6E7FF"
              stroke="#605CE5"
              stroke-width="1.75"
            />
            <path
              d="M11.001 6.27734L14.9296 8.43806V12.7595L11.001 14.9202L7.07245 12.7595V8.43806L11.001 6.27734Z"
              fill="#605CE5"
            />
          </svg>
          <span class="project-name">DesignEval</span>
        </div>
        <button
          :class="[
            'collapse-btn',
            {
              'collapse-btn-collapsed': isCollapsed,
            },
          ]"
          @click="toggleCollapse"
        >
          <!-- <i :class="['icon', isCollapsed ? 'icon-expand' : 'icon-collapse']"></i> -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
          >
            <path
              d="M17.5 15.2857C17.6126 15.2857 17.724 15.3079 17.828 15.3509C17.932 15.394 18.0265 15.4572 18.1061 15.5368C18.1857 15.6164 18.2488 15.7108 18.2919 15.8148C18.335 15.9188 18.3571 16.0303 18.3571 16.1429C18.3571 16.2554 18.335 16.3669 18.2919 16.4709C18.2488 16.5749 18.1857 16.6694 18.1061 16.7489C18.0265 16.8285 17.932 16.8917 17.828 16.9348C17.724 16.9778 17.6126 17 17.5 17H5.5C5.27267 17 5.05465 16.9097 4.89391 16.7489C4.73316 16.5882 4.64285 16.3702 4.64285 16.1429C4.64285 15.9155 4.73316 15.6975 4.89391 15.5368C5.05465 15.376 5.27267 15.2857 5.5 15.2857H17.5ZM17.5771 8.89571C17.6552 8.84859 17.7445 8.82308 17.8357 8.82181C17.9269 8.82053 18.0168 8.84354 18.0962 8.88847C18.1755 8.93339 18.2415 8.99862 18.2874 9.07747C18.3333 9.15631 18.3573 9.24594 18.3571 9.33715V12.6628C18.3573 12.7541 18.3333 12.8437 18.2874 12.9225C18.2415 13.0014 18.1755 13.0666 18.0962 13.1115C18.0168 13.1565 17.9269 13.1795 17.8357 13.1782C17.7445 13.1769 17.6552 13.1514 17.5771 13.1043L14.8069 11.4414C14.7305 11.3958 14.6673 11.3311 14.6234 11.2537C14.5795 11.1764 14.5565 11.0889 14.5565 11C14.5565 10.911 14.5795 10.8236 14.6234 10.7463C14.6673 10.6689 14.7305 10.6042 14.8069 10.5586L17.5771 8.89571ZM11.5 10.1429C11.7273 10.1429 11.9453 10.2332 12.1061 10.3939C12.2668 10.5547 12.3571 10.7727 12.3571 11C12.3571 11.2273 12.2668 11.4453 12.1061 11.6061C11.9453 11.7668 11.7273 11.8571 11.5 11.8571H5.5C5.27267 11.8571 5.05465 11.7668 4.89391 11.6061C4.73316 11.4453 4.64285 11.2273 4.64285 11C4.64285 10.7727 4.73316 10.5547 4.89391 10.3939C5.05465 10.2332 5.27267 10.1429 5.5 10.1429H11.5ZM17.5 5C17.7273 5 17.9453 5.09031 18.1061 5.25105C18.2668 5.4118 18.3571 5.62982 18.3571 5.85715C18.3571 6.08448 18.2668 6.3025 18.1061 6.46324C17.9453 6.62399 17.7273 6.7143 17.5 6.7143H5.5C5.27267 6.7143 5.05465 6.62399 4.89391 6.46324C4.73316 6.3025 4.64285 6.08448 4.64285 5.85715C4.64285 5.62982 4.73316 5.4118 4.89391 5.25105C5.05465 5.09031 5.27267 5 5.5 5H17.5Z"
              fill="#474667"
            />
          </svg>
        </button>
      </div>

      <div
        :class="[
          'small-title',
          {
            'small-title-collapsed': isCollapsed,
          },
        ]"
      >
        主导航
      </div>
      <div class="sidebar-menu">
        <MyMenu :isCollapsed="isCollapsed" />
      </div>

      <div class="menu-bottom">
        <div>
          <img style="width: 22px; height: 22px" :src="img1" />
        </div>
        <div v-show="!isCollapsed" class="txt">帮助与反馈</div>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 顶部导航 -->
      <header class="main-header">
        <div class="header-left">
          <div v-if="shouldShowBackButton" class="back-icon" @click="goBack">
            <img src="@/assets/assess/left.png" alt="返回" />
          </div>
          <h1 class="page-title">{{ currentPageTitle }}</h1>
          <!-- <h1 class="page-title">角色库</h1> -->
        </div>
        <div class="header-right">
          <img :src="img7" alt="通知" />
          <div class="user-avatar">
            <img :src="img6" alt="头像" />
            <!-- <span>用户头像</span> -->
          </div>
        </div>
      </header>

      <!-- 主内容 -->
      <div class="content-wrapper">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <div>
              <component :is="Component" />
            </div>
          </transition>
        </router-view>
      </div>
    </main>

    <!-- <GuideTour
      ref="guideTourRef"
      :steps="steps"
      :show-progress="true"
      @complete="onGuideComplete"
    /> -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import img1 from "@/assets/help.png";
import img6 from "@/assets/user.png";
import img7 from "@/assets/notification.png";

import MyMenu from "@/components/MyMenu.vue";
const isCollapsed = ref(false);

// 从路由配置中动态生成菜单
const route = useRoute();
const router = useRouter();

const menus = computed(() => {
  return router
    .getRoutes()
    .filter((route) => route.meta?.showInMenu)
    .map((route) => ({
      path: route.path,
      title: route.meta?.title || route.name,
      icon: route.meta?.icon || "icon-default",
    }));
});

const currentPageTitle = computed(() => {
  return route.meta?.title || route.name;
});

// 判断是否显示返回按钮
const shouldShowBackButton = computed(() => {
  return route.name === 'solution-assessment' || route.name === 'indicator-assessment' || route.name === 'character-database';
});

// 返回函数
const goBack = () => {
  if (route.name === 'character-database') {
    // 检查是否从指标评估页面跳转过来
    if (localStorage.getItem('returnToIndicatorAssessment') === 'true') {
      localStorage.removeItem('returnToIndicatorAssessment');
      router.push('/indicator-assessment');
      return;
    }
    // 检查是否从方案评估页面跳转过来
    if (localStorage.getItem('returnToAssessment') === 'true') {
      localStorage.removeItem('returnToAssessment');
      router.push('/solution-assessment');
      return;
    }
  }
  // 默认返回首页
  router.push('/');
};

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

//-------------------

// 引导步骤配置
const steps = ref([
  {
    element: "#btn-1",
    popover: {
      title: "主要按钮",
      description: "这是页面上的主要操作按钮",
      position: "bottom",
    },
  },
  {
    element: "#btn-2",
    popover: {
      title: "次要按钮",
      description: "这是页面上的次要操作按钮",
      position: "right",
    },
  },
  {
    element: "#card-1",
    popover: {
      title: "信息卡片",
      description: "这里显示重要信息",
      position: "left",
    },
  },
]);

const guideTourRef = ref(null);

const startGuide = () => {
  guideTourRef.value.startTour();
};

const onGuideComplete = () => {
  console.log("引导已完成");
};

onMounted(() => {
  // startGuide();
});
</script>

<style lang="scss" scoped>
/* 保持之前的样式不变，添加过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.layout-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 208px;
  height: 100%;
  background-color: #e6e7ff;
  color: #fff;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;

  &.sidebar-collapsed {
    width: 74px;

    .project-name,
    .sidebar-menu span {
      display: none;
    }
  }
}

.sidebar-top {
  // height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 17px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.small-title {
  color: #474667;
  font-size: 9px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 0.45px;
  text-transform: uppercase;
  margin-left: 16px;
  margin-bottom: 16px;
  margin-top: 12px;
  &.small-title-collapsed {
    margin-left: 20px;
  }
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo {
  width: 32px;
  height: 32px;
}

.project-name {
  color: #474667;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.collapse-btn {
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.3s;
  margin-top: 5px;
  // transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  &.collapse-btn-collapsed {
    transform: rotate(180deg);
  }
}

.sidebar-menu {
  flex: 1;
  overflow: hidden;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 4px;
  }

  a {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    color: rgba(255, 255, 255, 0.65);
    text-decoration: none;
    transition: all 0.3s;
    gap: 8px;

    &:hover {
      color: #fff;
      background-color: rgba(255, 255, 255, 0.1);
    }

    &.active {
      color: #fff;
      background-color: #1890ff;
    }
  }

  .menu-icon {
    font-size: 16px;
  }
}

.menu-bottom {
  margin: 0 0 21px 26px;
  display: flex;
  align-items: center;
  .txt {
    color: #474667;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px; /* 157.143% */
    margin-top: 3px;
    margin-left: 4px;
  }
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.main-header {
  height: 64px;
  background-color: #f7fafc;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 1;
}

.header-left {
  display: flex;
  align-items: center;
}

.back-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.page-title {
  font-size: 18px;
  margin: 0;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.settings-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #666;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f5f5f5;
  }
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  // background: red;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100px;
  background: linear-gradient(180deg, #a497fe 0%, #675ded 100%);

  img {
    width: 20px;
    height: 20px;
    object-fit: cover;
  }
}

.content-wrapper {
  flex: 1;
  // padding: 24px;
  overflow-y: auto;
  background-color: #f7fafc;
}
</style>
