<template lang="pug">
  div.kalix-header
    div.s-flex.bd
      div.logo
        img(src="/static/images/logo_oa_horizontal.png")
      div.s-flex_item.s-flex.mn
        label.s-check__label.link-btn(for="menuChk")
          input.s-check(type="checkbox" id="menuChk"
          v-on:change="menuChkChange" v-model="headerMenuChk")
          i(v-bind:class="{'el-icon-d-arrow-left':!menuChk,'el-icon-d-arrow-right':menuChk}")
        div.s-flex_item
          div.s-flex.menu-main(v-bind:class="{'open':menuIsOpen}" v-on:mouseover="onOpenMenu(true)"  v-on:mouseout="onOpenMenu(false)")
            ul.menu(ref="ulMenu")
              li(v-for="item in menuList")
                router-link.link-btn(tag="div" v-bind:to="{path:'/'+item.id}")
                  i(:class="bindClass(item.iconCls)")
                  | {{item.text}}
            div.aside-btn(v-if="isShowAsideBtn")
              div.line
              div.arrow
                div.arrow-mn
        div.line
          ul.aside
            li(v-if="isShowMessage")
              el-badge(v-if="msgCount > 0" v-bind:value="msgCount")
                el-button(icon="el-icon-message" v-on:click="onMsgClick") 消息
              el-button(v-else icon="el-icon-message" v-on:click="onMsgClick" style="margin-top:10px;") 消息
            li(v-if="isFlowCommand")
              el-dropdown(v-on:command="onFlowCommand" style="margin-top:10px;")
                el-button
                  | 待办工作
                  i.el-icon-arrow-down.el-icon--right
                el-dropdown-menu(slot="dropdown")
                  el-dropdown-item 待办流程
            li
              el-dropdown(v-on:command="handleCommand" style="min-width:120px")
                div.s-flex.el-dropdown-link
                  div.avatar-wrapper
                    div.avatar(v-bind:style="styleObject")
                    div.user-name {{userName}}
                  i.el-icon-caret-bottom.el-icon--right
                el-dropdown-menu(slot="dropdown")
                  el-dropdown-item(command="changeInfo") 修改个人信息
                  el-dropdown-item(command="changePwd") 修改密码
                  el-dropdown-item(command="logout") 退出
</template>

<script type="text/ecmascript-6">
  import {Util} from '../lib'

  export default {
    name: 'KalixHeader',
    data() {
      return {
        menuChk: false,
        isReceiveMsg: false, // 是否进行消息接收
        userName: '',
        menuList: [],
        singleLogin: true,
        headerMenuChk: this.menuChk,
        themeValue: '',
        msgCount: 0,
        menuIsOpen: false,
        isShowAsideBtn: false,
        isShowMessage: false,
        isFlowCommand: false
      }
    },
    props: {
      reqUrl: {
        type: String,
        default: ''
      },
      params: {
        type: Object,
        default() {
          return {
            _dc: (new Date()).getTime(),
            page: 1,
            start: 0,
            limit: 25
          }
        }
      },
      loginUrl: {
        type: String,
        default: ''
      },
      logoutUrl: {
        type: String,
        default: ''
      }
    },
    mounted() {
      console.log('KalixHeader mounted')
      // this.initMenu()
      window.onresize = () => {
        this._setAsideBtn()
      }
    },
    activated() {
      this.userName = this.$KalixCatch.get('user_name')
      this.initMenu()
      if (this.singleLogin) {
        this.checkLogin()
      }
    },
    methods: {
      /**
       * 初始化栏目
       */
      initMenu() {
        let toolListData = {}
        if (this.$KalixCatch.get('toolListData')) {
          toolListData = JSON.parse(this.$KalixCatch.get('toolListData'))
        }
        if (!Util.isEmptyObject(toolListData)) {
          this.menuList = toolListData
          this._urlTransmit(toolListData)
          this._setAsideBtn()
          this._setTopBtns()
          if (toolListData.length > 0) {
            if (toolListData.length > 0) {
              this.$router.push({path: `/${toolListData[0].id}`})
            }
          }
        } else {
          if (this.reqUrl.length) {
            this.$http.get(this.reqUrl, {
              params: this.params
            }).then(response => {
              if (response && response.data) {
                console.log('[toolListData] data:', response.data)
                toolListData = response.data
                this.menuList = toolListData
                this.$KalixCatch.save('toolListData', JSON.stringify(toolListData))
                this._setAsideBtn()
                this._setTopBtns()
                this._urlTransmit(toolListData)
                // this._goToFirstColumn()
              }
            })
          } else {
            console.log(' ===== this.reqUrl is Null! ===== ')
          }
        }
      },
      /**
       * Url跳转，默认到第一个栏目
       * @private
       */
      _urlTransmit(data) {
        console.log('data.length:', data.length)
        console.log('data[0].id:', data[0].id)
        if (data.length && data[0].id) {
          this.$router.push({
            path: `/${data[0].id}/`
          })
        }
      },
      bindClass(e) {
        return e
      },
      setTheme(theme) {
        if (theme) {
          this.themeValue = theme
        }
      },
      onFlowCommand(command) {
        console.log(' ===== 代办流程 ===== ')
        // 代办流程
        this.$router.push({path: `/oa/Task`})
      },
      onMsgClick() {
        this.$router.push({path: `/common/receiver`})
      },
      doLogout() {
        this.msgCount = 0
        this.$http.get(this.logoutUrl, {})
          .then(response => {
            console.log('Logout:', response)
            if (this.isReceiveMsg && typeof (this.over) === 'function') {
              this.over()
            }
            this.$KalixCatch.clear()
            this.$KalixCatch._clearLocal()
            this.$router.push({path: this.loginUrl})
          })
          .catch(err => {
            console.log(' ===== err ===== ', err)
            if (this.isReceiveMsg && typeof (this.over) === 'function') {
              this.over()
            }
            this.$KalixCatch.clear()
            this.$KalixCatch._clearLocal()
            this.$router.push({path: this.loginUrl})
          })
      },
      handleCommand(command) {
        switch (command) {
          case 'changeInfo' :
            this.$emit('onClickUpdateUserInfo')
            break
          case 'changePwd':
            this.$emit('onClickChangePwd', '')
            break
          case 'logout' :
            this.doLogout()
            break
        }
      },
      checkLogin() {
        clearInterval(this.islogin)
        this.islogin = setInterval(() => {
          let lastLoginTime = this.$KalixCatch._getLocal('lastLoginTime')
          let sessionLatLoginTime = this.$KalixCatch.get('lastLoginTime')
          if (lastLoginTime !== null && sessionLatLoginTime !== lastLoginTime) {
            clearInterval(this.islogin)
            this.doLogout()
          }
        }, 3000)
      },
      styleObject() {
        console.log('this.formModel1', this.icon)
        let style = {}
        if (this.icon) {
          style = {
            backgroundImage: `url('${this.icon}')`
          }
        }
        return style
      },
      menuChkChange() {
        this.$KalixEventBus.$emit('HeaderOnSmall', this.headerMenuChk)
      },
      // 展开导航按钮
      onOpenMenu(flag) {
        this.isShowAsideBtn && (this.menuIsOpen = flag)
      },
      // 计算 ulMenu 高度，决定 menu 是否带有展开功能
      _setAsideBtn() {
        setTimeout(() => {
          console.log(' ===== this.$refs.ulMenu.clientHeight ===== ', this.$refs.ulMenu.clientHeight)
          this.isShowAsideBtn = (this.$refs.ulMenu.clientHeight > 64)
        }, 20)
      },
      // 判断是否显示快捷按钮
      _setTopBtns() {
        // 是否显示 消息 按钮
        this.isShowMessage = this._chkShortcutBtn('common')
        this.isReceiveMsg = this.isShowMessage

        // 是否显示 待办工作 按钮
        this.isFlowCommand = this._chkShortcutBtn('oa')

        // 建立websocket连接，接收服务器消息
        if (this.isReceiveMsg) {
          try {
            this.websocket()
          } catch (e) {
            console.error(e)
          }
        }
      },
      _chkShortcutBtn(_itemId) {
        let items = this.menuList.filter(item => {
          return item.id === _itemId
        })
        this._getDict(_itemId)
        return (items.length > 0)
      },
      // 获取快捷按钮对应的数据字典
      _getDict(_id) {
        const DictURL = `/camel/rest/${_id}/dicts`
        const DictKey = `${_id.toUpperCase()}-DICT-KEY`
        if (!this.$KalixCatch.get(DictKey)) {
          const data = {
            page: 1,
            start: 0,
            limit: 200,
            sort: '[{\'property\': \'value\', \'direction\': \'ASC\'}]'
          }
          this.axios.get(DictURL, {
            params: data
          }).then(response => {
            if (response.data) {
              this.$KalixCatch.save(DictKey, JSON.stringify(response.data.data))
              console.log(`dict cached under key ${DictKey}`, response.data)
            }
          })
        }
      },
      // 使用websocket，用于客户端与服务器消息的传递
      websocket() {
        if ('WebSocket' in window) {
          let socketUrl = this.$KalixGlobalConfig.baseWsURL + '?loginname=' + this.$KalixCatch.get('loginname') + '&wsMessage=CommonMessage'
          let ws = new WebSocket(socketUrl)
          ws.onopen = () => {
            // Web Socket 已连接上，使用 send() 方法发送数据
          }
          ws.onmessage = evt => {
            //  获取消息数量
            let data = JSON.parse(evt.data)
            if (data && data.msgCount) {
              this.msgCount = data.msgCount
            } else {
              this.msgCount = 0
            }
            //  获取最新消息
            if (data && data.msgTag && data.msgTag.length) {
              let msg = JSON.parse(data.msgTag)
              let headerNotif = this.$notify({
                title: msg.title,
                message: msg.content,
                type: 'success',
                duration: 10000,
                onClick: () => {
                  this.$router.push({path: `/common/receiver`})
                  headerNotif.close()
                }
              })
            }
          }
          ws.onclose = function () {
            // 关闭 websocket
            console.log('连接已关闭...')
          }
          // 组件销毁时调用，中断websocket链接
          this.over = () => {
            ws.close()
          }
        } else {
          this.$KalixMessage.info('您当前使用的浏览器不支持WebSocket，无法接收服务器消息！')
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
