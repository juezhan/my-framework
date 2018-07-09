import Cache from './cache'
import GlobalConfig from '../config/global.toml'
import EventBus from './eventbus'
import * as Util from './util'

export {
  Cache,
  Util
}
export default {
  install: function (Vue, opts) {
    Vue.prototype.$KalixCatch = Cache
    Vue.prototype.$KalixEventBus = EventBus

    // Toml配置加载
    Vue.prototype.$KalixGlobalConfig = GlobalConfig
  }
}
