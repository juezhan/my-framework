import Vue from 'vue'
import VueAxios from 'vue-axios'
import App from './App'
import router from './router'
import axios from './config/axios'
import lib from './lib'
import './Theme'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.use(lib)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
