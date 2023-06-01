import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/styles/icon.css'
import './assets/fonts/daysOne.css'
import i18n from './lang'
// import './mock'
import './utils/boost'
import './utils/create-api'
import directiveObj from './utils/directive'

import { Tabbar, TabbarItem, Icon, Cell, CellGroup, Tag, NavBar, Dialog, Image as VanImage, Form, Field, Button } from 'vant'
/**
mock不支持blob对象格式下载，它只支持text格式，当点击阅读电子书的时候，它会根据url名称自动下
这个电子书来解析
*/
Vue.use(directiveObj) // 执行目标对象里install方法并传入Vue类
Vue.config.productionTip = false
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(Tag)
Vue.use(Icon)
Vue.use(NavBar)
// 全局注册
Vue.use(Dialog)
Vue.use(VanImage)
Vue.use(Form)
Vue.use(Field)
Vue.use(Button)
document.addEventListener('DOMContentLoaded', () => {
  resize()
})
function resize () {
  const html = document.querySelector('html')
  const fontSize = window.innerWidth / 10 > 50 ? 50 : window.innerWidth / 10
  html.style.fontSize = fontSize + 'px'
  console.log(html.style.fontSize)
}
window.addEventListener('resize', resize)
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
