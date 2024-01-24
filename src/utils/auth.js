import Cookies from "js-cookie";

const TokenKey = "Admin-Token";

export function getToken() {
  //获取Token
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  //设置Token
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  //删除token
  return Cookies.remove(TokenKey);
}
