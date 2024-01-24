import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // 进度条样式
import { getToken } from "@/utils/auth"; // 从cookie获取令牌

const whiteList = ["/login", "/auth-redirect"]; // 白名单

// 全局路由监听
router.beforeEach(async (to, from, next) => {
  NProgress.start(); //开启进度条
  const hasToken = getToken(); //确定用户是否已登录
  if (hasToken) {
   
    if (to.path === "/login") {
      // 如果已登录，则重定向到主页
      next({ path: "/" });
      NProgress.done();
    } else {
      // 确定用户是否已通过getInfo获得其权限角色
      const hasRoles = store.getters.roles && store.getters.roles.length > 0;
      if (hasRoles) {
        next();
      } else {
        try {
          // 获取用户信息
          // 注意：角色必须是一个对象数组！例如：[‘admin’]或，[‘developer’，‘ditor’]
          const { roles } = await store.dispatch("user/getInfo");
          const accessRoutes = await store.dispatch(
            // 基于角色生成的可访问的异步路由
            "permission/generateRoutes",
            roles
          );
          // 动态添加可访问的路由
          for (const accessRoute of accessRoutes) {
            router.addRoute(accessRoute);
          }
          // 设置replace:true，这样导航就不会留下历史记录
          next({ ...to, replace: true }); //为什么展开to?
        } catch (error) {
          // 删除令牌并转到登录页面重新登录
          await store.dispatch("user/resetToken");
          Message.error(error || "Has Error");
          next(`/login?redirect=${to.path}`);
          Message.error(error || "Has Error");
        }
      }
    }
  } else {
    /* 未登录没有token*/
    

    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单中，直接进入
      next();
    } else {
      // 其他没有访问权限的页面会重定向到登录页面。
      next(`/login?redirect=${to.path}`); //redirect？
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
