import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import Layout from "@/components/Layout.vue";

// 预加载常用的页面组件
const SolutionAssessment = () =>
  import("@/views/solution-assessment/index.vue");
const IndicatorAssessment = () =>
  import("@/views/indicator-assessment/index.vue");

const routes = [
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/views/home/Home.vue"),
        meta: {
          title: "首页",
        },
      },
      {
        path: "/solution-assessment",
        name: "solution-assessment",
        component: SolutionAssessment,
        meta: {
          title: "方案智能评估",
        },
      },
      {
        path: "/character-database",
        name: "character-database",
        component: () =>
          import("@/views/character-database/CharacterDatabase.vue"),
        meta: {
          title: "角色库",
        },
      },

      {
        path: "/history-assessment",
        name: "history-assessment",
        component: () =>
          import("@/views/history-assessment/HistoryAssessment.vue"),
        meta: {
          title: "历史评估记录",
        },
      },

      {
        path: "/indicators-system",
        name: "indicators-system",
        component: () =>
          import("@/views/indicators-system/IndicatorsSystem.vue"),
        meta: {
          title: "指标体系库",
        },
      },

      {
        path: "/indicator-assessment",
        name: "indicator-assessment",
        component: IndicatorAssessment,
        meta: {
          title: "方案智能对比",
        },
      },

      {
        path: "/material-library",
        name: "material-library",
        component: () => import("@/views/material-library/MaterialLibrary.vue"),
        meta: {
          title: "素材库",
        },
      },

      {
        path: "/drew-board",
        name: "drew-board",
        component: () => import("@/views/drew-board/DrewBoard.vue"),
        meta: {
          title: "画板",
        },
      },
    ],
  },
  // 可以添加登录页等其他页面
  // {
  //   path: '/login',
  //   name: 'Login',
  //   component: () => import('@/views/Login.vue'),
  //   meta: {
  //     title: '登录',
  //     showInMenu: false
  //   }
  // }
];

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHashHistory(),
  routes,
});

// 预加载常用页面，减少跳转延迟
setTimeout(() => {
  SolutionAssessment();
  IndicatorAssessment();
}, 1000);

export default router;
