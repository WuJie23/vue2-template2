
export function validUsername(str) {//名称验证规则
    const valid_map = ['admin', 'editor']
    return valid_map.indexOf(str.trim()) >= 0
  }

  export function isExternal(path) {//判断是否是外部引入
    return /^(https?:|mailto:|tel:)/.test(path)
  }

 