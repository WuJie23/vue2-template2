import { login } from "@/api/user";
import { getInfo,logout } from "@/api/user";
import { setToken, getToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

const state = {
  token: getToken(),
  roles: [], //用户权限角色
  name: "",
  avatar: "",
};
const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction;
  },
  
};
const actions = {
  //用户登陆
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then((response) => {
          //等待异步返回Token
          const { data } = response;
          commit("SET_TOKEN", data.token);
          setToken(data.token);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then((response) => {
        const { data } = response;
        if (!data) {
          reject("Verification failed, please Login again.");
        }
        const { roles, name, avatar, introduction } = data;
        // 角色必须是非空数组
        if (!roles || roles.length <= 0) {
          reject("getInfo: roles must be a non-null array!");
        }
        commit("SET_ROLES", roles);
        /*SET_ROLES: (state, roles) => {
           state.roles = roles}*/
        commit("SET_NAME", name);
        commit("SET_AVATAR", avatar);//svg
        commit("SET_INTRODUCTION", introduction);
        resolve(data);
      });
    });
  },
  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit("SET_TOKEN", "");
      commit("SET_ROLES", []);
      removeToken();
      resolve();
    });
  },
  // 退出登录方法
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      // 引入调用退出登录方法API
      logout(state.token)
        .then(() => {
          //成功回调
          commit("SET_TOKEN", "");
          commit("SET_ROLES", []);
          removeToken();
          resetRouter();
          // 重置访问的视图和缓存的视图
          // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
          dispatch("tagsView/delAllViews", null, { root: true });
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
