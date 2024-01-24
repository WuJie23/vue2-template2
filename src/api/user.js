// import request from "@/utils/request";
export function login(data) {
  // return request({
  //   url: '/vue-element-admin/user/login',
  //   method: 'post',
  data;
  if (data.username === "admin") {
    return Promise.resolve({ data: { token: "xxx-xxx-xxx-xxx" } });
  } else if (data.username === "editor") {
    return Promise.resolve({ data: { token: "ppp-ppp-ppp-ppp" } });
  }
  // })
}

export function getInfo(token) {
  //根据token返回用户信息
  // return request({
  //   url: "/vue-element-admin/user/info",
  //   method: "get",
  //   params: { token },
  // });
  token;
  console.log(token, " editor");
  if (token === "xxx-xxx-xxx-xxx") {
    return Promise.resolve({
      data: {
        roles: ["admin"],
        name: "admin",
        avatar:
          "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
        introduction: undefined,
      },
    });
  } else if (token === "ppp-ppp-ppp-ppp") {
    return Promise.resolve({
      data: {
        roles: ["editor"],
        name: "editor",
        avatar:
          "https://hbimg.b0.upaiyun.com/8ec79f834d223a99a838a435ada87ad74f1907c582787-uHfd2q_fw658",
        introduction: undefined,
      },
    });
  }
}

export function logout() {
  return Promise.resolve();
}
