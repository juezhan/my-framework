import Vue from 'vue'
import VueAxios from 'vue-axios'
import App from './App'
import router from './router'
import axios from './config/axios'
import lib from './lib'
import MyVueLib from 'my-vue-lib'
import MyVueBiz from 'my-vue-biz'
import MyVueAdmin from 'my-vue-admin'
import MyVueCommon from 'my-vue-common'
import './Theme'
import '@/assets/css/fa-font.css'
import '@/assets/css/icon-font.css'
import '@/assets/stylus/base.styl'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.use(MyVueLib)
Vue.use(lib)
Vue.use(MyVueBiz)
Vue.use(MyVueAdmin)
Vue.use(MyVueCommon)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
