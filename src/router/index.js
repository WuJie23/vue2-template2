import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from "@/layout";

Vue.use(VueRouter)

export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {path:'/login',component:()=>import('@/views/login/index.vue')},
  {
    // 访问根路径
    path: "/",
    component: Layout, //展示Layout组件
    redirect: "/dashboard", //重定向到/dashboard
    children: [
      {
        path: "/dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        name: "Dashboard",
        meta: {
          title: "Dashboard",
          icon: "dashboard",
          affix: true,
          i18Key: "dashboard",
        },
      },
    ],
  },
  {
    path: "/documentation",
    component: Layout,
    children: [
      {
        path: "index",
        component: () => import("@/views/documentation/index.vue"),
        name: "Documentation",
        meta: { title: "Documentation", icon: "guide", affix: true,i18Key: "documentation", },
      },
    ],
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    hidden: true,
  },
]

export const asyncRoutes = [
  {
    path: "/guide",
    component: Layout,
    redirect: "/guide/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/guide/index.vue"),
        name: "Guide",
        meta: { title: "Guide", icon: "guide", noCache: true ,i18Key: "guide", roles: ['admin'] },
      },
    ],
  },
  { path: "*", redirect: "/404", hidden: true },
]

const createRouter = () => new VueRouter({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),//滚动行为
  routes: constantRoutes //注册不需要访问权限的路由
})

const router = createRouter()//调用创建路由router
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};

// 重置路由
export function resetRouter() {
  const newRouter = createRouter(); //新建路由
  router.matcher = newRouter.matcher; // 重置router 防止丢失login页面 和避免重置router时刷新页面
}
export default router//导出router
