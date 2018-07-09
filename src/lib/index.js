import Cache from './cache'

export default {
  install: function (Vue, opts) {
    Vue.prototype.$KalixCatch = Cache
  }
}
