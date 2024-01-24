const state = {
  visitedViews: [], //储存所有tagview(不重复)
  cachedViews: [], //储存appmain需要被缓存的组件
};
const mutations = {
  ADD_VISITED_VIEW: (state, view) => {
    //添加visitedViews
    if (state.visitedViews.some((v) => v.path === view.path)) return; //visitedViews在satae有了就return
    state.visitedViews.push(
      Object.assign({}, view, {//浅拷贝，合并为一个对象
        title: view.meta.title || "no-name",
      })
    );
  },
  ADD_CACHED_VIEW: (state, view) => {//添加cachedViews
    if (state.cachedViews.includes(view.name)) return
    if (!view.meta.noCache) {//如果需要缓存就添加进储存
      state.cachedViews.push(view.name)
    }
  },
  UPDATE_VISITED_VIEW: (state, view) => {//更新tag,保持页面访问记录的最新状态。
    for (let v of state.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break//找到匹配的页面后结束循环
      }
    }
  },
  DEL_CACHED_VIEW: (state, view) => {//删除缓存组件
    const index = state.cachedViews.indexOf(view.name)
    index > -1 && state.cachedViews.splice(index, 1)
  },
  DEL_VISITED_VIEW: (state, view) => {//删除储存的 右击close的tagview
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews.splice(i, 1)
        break
      }
    }
  },
  DEL_ALL_VISITED_VIEWS: state => {
    // 保留固定 tags
    const affixTags = state.visitedViews.filter(tag => tag.meta.affix)
    state.visitedViews = affixTags
  },
  DEL_ALL_CACHED_VIEWS: state => {//删除所有缓存组件
    state.cachedViews = []
  },
};
const actions = {
  addView({ dispatch }, view) {
    //添加tagview
    dispatch("addVisitedView", view);
    dispatch("addCachedView", view);
  },
  addVisitedView({ commit }, view) {
    commit("ADD_VISITED_VIEW", view); //添加已访问视图
  },
  addCachedView({ commit }, view) {
    commit("ADD_CACHED_VIEW", view);
  },
  updateVisitedView({ commit }, view) {//查询路由不同时 更新tag选中
    commit('UPDATE_VISITED_VIEW', view)
  },
  delCachedView({ commit, state }, view) {////删除缓存组件
    return new Promise(resolve => {
      commit('DEL_CACHED_VIEW', view)
      resolve([...state.cachedViews])
    })
  },
  delView({ dispatch, state }, view) {//删除右击选中的tagview
    return new Promise(resolve => {
      dispatch('delVisitedView', view)
      dispatch('delCachedView', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delVisitedView({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_VISITED_VIEW', view)
      resolve([...state.visitedViews])
    })
  },
  delAllViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delAllVisitedViews', view)//删除除固定以外的所有tagview
      dispatch('delAllCachedViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delAllVisitedViews({ commit, state }) {
    return new Promise(resolve => {
      commit('DEL_ALL_VISITED_VIEWS')
      resolve([...state.visitedViews])
    })
  },
  delAllCachedViews({ commit, state }) {
    return new Promise(resolve => {
      commit('DEL_ALL_CACHED_VIEWS')
      resolve([...state.cachedViews])
    })
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
