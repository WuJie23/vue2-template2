const getters = {
  roles: (state) => state.user.roles, //获取用户权限角色
  permission_routes: (state) => state.permission.routes, //获取用户所有路由（渲染sidebar侧边栏）
  sidebar: (state) => state.app.sidebar, //
  size: (state) => state.app.size,
  device: (state) => state.app.device,
  avatar: (state) => state.user.avatar,
  language: (state) => state.app.language,
};
export default getters;
