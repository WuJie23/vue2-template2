import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import 'normalize.css/normalize.css'
import './styles/element-variables.scss'
import './icons'//引入icon
import '@/styles/index.scss'
import Cookies from "js-cookie";
import './permission' 
import i18n from './lang' 
Vue.use(Element,{ size: Cookies.get('size') || 'medium', // set element-ui default size
i18n: (key, value) => i18n.t(key, value)
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
