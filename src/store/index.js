import Vue from 'vue'
import Vuex from 'vuex'
import book from './modules/book'
import store from './modules/store'
import getters from './getter'
import actions from './action'
Vue.use(Vuex)

export default new Vuex.Store({

  getters,
  modules: {
    book,
    store
  },
  actions
})
