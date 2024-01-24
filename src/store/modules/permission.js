import { asyncRoutes, constantRoutes } from "@/router";

/**
 * 
 * @param roles 用户权限角色
 * @param route 递归出来的每一个异步路由
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta.roles.includes(role));//使用meta.role确定当前用户是否具有权限访问此条路由
  } else {
    //没有route.meta && route.meta.roles 说明没有权限要求 都可以访问
    return true;
  }
}

/**
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  //通过递归筛选asyncRoutes异步路由表 匹配出对应roles角色的路由表
  const res = [];

  routes.forEach((route) => {
    const tmp = { ...route };//解构route信息
    if (hasPermission(roles, tmp)) {
      //用户角色有权限访问此条路由
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles);
      }
      res.push(tmp); //添加进路由表
    }
  });

  return res;
}

const state = {
    addRoutes: [],//储存用户可访的异步问路由
    routes: [],//用户总的路由
};
const mutations = {
    SET_ROUTES:(state, routes)=>{//向state储存用户可访的异步问路由和用户总的路由
        state.addRoutes = routes
        state.routes = constantRoutes.concat(routes)
    }
};
const actions = {
  // 通过用户角色权限获取可访问路由
  generateRoutes({ commit }, roles) {
    return new Promise((resolve) => {
      let accessedRoutes; //可访问路由
      if (roles.includes("admin")) {
        //如果是admin asyncRoutes路由添加
        accessedRoutes = asyncRoutes || [];
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
      }
      commit('SET_ROUTES', accessedRoutes)//去state中储存用户可访的异步问路由
      resolve(accessedRoutes)
    });
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
