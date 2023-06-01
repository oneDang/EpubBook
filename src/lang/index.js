import Vue from 'vue'
import VueI18N from 'vue-i18n'
import en from './en'
import cn from './cn'
import { getLocale, saveLocale } from '../utils/localStorage'
// 介绍 Vue I18n 是 Vue.js 的国际化插件。它可以轻松地将一些本地化功能集成到你的 Vue.js 应用程序中
Vue.use(VueI18N)

const messages = {
  en,
  cn
}

let locale = getLocale()
if (!locale) {
  locale = 'cn'
  saveLocale(locale)
}

const i18n = new VueI18N({
  locale,
  messages
})

export default i18n
