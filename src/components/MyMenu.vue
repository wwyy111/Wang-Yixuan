<template>
  <div class="menu-box" :class="{ 'menu-box--isCollapsed': isCollapsed }">
    <!-- 菜单项循环 -->
    <div
      v-for="item in menuItems"
      :key="item.id"
      class="menu-item"
      :class="[
        { 'menu-item--isCollapsed': isCollapsed },
        { 'menu-item--active': activeItem === item.id },
        {
          'menu-item000': item.text === '首页',
          'menu-item111': item.text === '历史评估记录',
          'menu-item222': item.text === '角色库',
          'menu-item333': item.text === '指标体系库',
          'menu-item444': item.text === '素材库',
          'menu-item555': item.text === '使用手册',
        },
      ]"
      @click="selectItem(item)"
    >
      <!-- 图标部分 -->
      <span class="menu-item__icon">
        <img :src="item.icon" />
      </span>
      <!-- 文字部分 -->
      <span v-if="!isCollapsed" class="menu-item__text">{{ item.text }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
// 这里假设使用了一些图标组件，实际使用时请替换为您的图标组件
import icon1 from "@/assets/home.png";
import icon2 from "@/assets/history.png";
import icon3 from "@/assets/role.png";
import icon4 from "@/assets/target.png";
import icon5 from "@/assets/material.png";
import icon6 from "@/assets/use.png";

import icona from "@/assets/white/aa.png";
import iconb from "@/assets/white/bb.png";
import iconc from "@/assets/white/cc.png";
import icond from "@/assets/white/dd.png";
import icone from "@/assets/white/ee.png";
import iconf from "@/assets/white/ff.png";

import router from "@/router";

const route = useRoute();

const props = defineProps({
  isCollapsed: {
    type: Boolean,
    default: false,
  },
});

// 菜单项数据
const menuItems = ref([
  { id: "/", text: "首页", icon: icon1, path: "/" },
  {
    id: "/history-assessment",
    text: "历史评估记录",
    icon: icon2,
    path: "/history-assessment",
  },
  {
    id: "/indicators-system",
    text: "指标体系库",
    icon: icon4,
    path: "/indicators-system",
  },
  {
    id: "/character-database",
    text: "角色库",
    icon: icon3,
    path: "/character-database",
  },

  {
    id: "/material-library",
    text: "素材库",
    icon: icon5,
    path: "/material-library",
  },
  // { id: "/user-manual", text: "使用手册", icon: icon6, path: "/user-manual" },
]);
const path = route.path;
// 当前选中的菜单项
const activeItem = ref(path);

// 选择菜单项的方法
const selectItem = (item) => {
  activeItem.value = item.id;

  getIcon(activeItem.value);
  // 这里可以触发自定义事件或调用父组件传递的方法
  router.push(item.path);
};

function getIcon(path) {
  menuItems.value.forEach((item1) => {
    if (item1.id === path) {
      const id = path;
      if (id === "/") {
        item1.icon = icona;
        return;
      } else if (id === "/history-assessment") {
        item1.icon = iconb;
        return;
      } else if (id === "/character-database") {
        item1.icon = iconc;
        return;
      } else if (id === "/indicators-system") {
        item1.icon = icond;
        return;
      } else if (id === "/material-library") {
        item1.icon = icone;
        return;
      } else if (id === "/user-manual") {
        item1.icon = iconf;
      }
    } else {
      const id = item1.id;
      if (id === "/") {
        item1.icon = icon1;
        return;
      } else if (id === "/history-assessment") {
        item1.icon = icon2;
        return;
      } else if (id === "/character-database") {
        item1.icon = icon3;
        return;
      } else if (id === "/indicators-system") {
        item1.icon = icon4;
        return;
      } else if (id === "/material-library") {
        item1.icon = icon5;
        return;
      } else if (id === "/user-manual") {
        item1.icon = icon6;
      }
    }
  });
}

onMounted(() => {
  getIcon(activeItem.value);
});
</script>

<style lang="scss" scoped>
.menu-box {
  display: flex;
  flex-direction: column;
  width: 178px;
  margin: 0 auto;
  &.menu-box--isCollapsed {
    width: 44px;
    margin: 0 auto;
  }
}

.menu-item {
  display: flex;
  width: 178px;
  height: 44px;
  padding: 8px 10px;
  align-items: center;
  gap: 10px;
  border-radius: 6px; // 圆角矩形
  cursor: pointer;
  // transition: all 0.2s ease; // 平滑过渡效果
  margin-top: 4px;

  // 默认状态下的图标和文字样式
  &__icon,
  &__text {
    color: #333; // 黑色文字和图标
  }

  // 悬停状态
  &:hover {
    background-color: #a8a6ef;
  }

  &.menu-item--isCollapsed {
    width: 44px;
    height: 44px;
    padding: 8px 10px;
    gap: 10px;
    flex-shrink: 0;
    .menu-item__icon {
      margin-left: 4px;
    }
  }

  // 选中状态
  &--active {
    background-color: #605ce5; // 蓝色背景
    color: white;

    // 选中状态下的图标和文字样式
    .menu-item__icon,
    .menu-item__text {
      color: white;
    }
  }

  // 图标和文字的间距
  &__icon {
    display: flex; // 确保图标垂直居中
    margin-top: 3px;
  }

  &__text {
    font-size: 13px;
    font-weight: 400;
    color: #474667;
  }
}
</style>
