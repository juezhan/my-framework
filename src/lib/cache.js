/**
 * Created by sunlf on 2017/7/21.
 * 封装本地缓存
 */
export default {
  save: (key, data) => {
    sessionStorage.setItem(key, data)
  },
  get: (key) => sessionStorage.getItem(key),
  remove: (key) => {
    sessionStorage.removeItem(key)
  },
  clear: () => {
    sessionStorage.clear()
  },
  _saveLocal: (key, data) => {
    localStorage.setItem(key, data)
  },
  _getLocal: (key) => localStorage.getItem(key),
  _removeLocal: (key) => {
    localStorage.removeItem(key)
  },
  _clearLocal: () => {
    localStorage.clear()
  }
}
