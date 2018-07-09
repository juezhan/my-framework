<template lang="pug">
  div.login(data-logig)
    div.from-warpper
      div.form
        div.logo
        el-form.loginForm(v-bind:model="loginForm" v-bind:rules="rules" ref="loginForm"
        v-bind:show-message="false")
          div.error-message(v-if="error.flag") {{error.message}}
          el-form-item.kalix-form-item(prop="name")
            el-input(v-model="loginForm.name" placeholder="账号" ref="loginFormName")
              i.icon-user(slot="prefix")
          el-form-item.kalix-form-item(prop="pass")
            el-input(type="password" v-model="loginForm.pass" ref="loginFormPass" placeholder="密码" auto-complete="off")
              i.icon-lock(slot="prefix")
          el-form-item(label="")
            el-button.btn-submit(type="primary" v-on:click="onSubmit()" size="large") 登录


</template>

<script type="text/ecmascript-6">
  import {logoutUrl, loginUrl} from 'config/global.toml'

  export default {
    name: 'LoginForm',
    data() {
      return {
        loginForm: {
          name: '',
          pass: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 2, max: 8, message: '用户名长度在 2 到 8 个字符', trigger: 'blur'}
          ],
          pass: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        },
        error: {
          flag: false,
          message: ''
        }
      }
    },
    activated() {
      this.loginForm = {name: '', pass: ''}
    },
    mounted() {
      this.$http.get(logoutUrl)
        .then(res => {
          console.log('res', res)
        })
      this.tabInput()
    },
    methods: {
      onSubmit(formName) {
        if (this._validateForm()) {
          this.login()
        }
      },
      login() {
        //  登录
        let that = this
        this._remoteLogin({
          'username': that.loginForm.name,
          'password': that.loginForm.pass
        }).then(data => {
          if (data.success) {
            this.$KalixCatch.save('id', data.user.id)
            this.$KalixCatch.save('access_token', data.access_token)
            this.$KalixCatch.save('user_token', data.user.token)
            this.$KalixCatch.save('user_name', data.user.name)
            this.$KalixCatch.save('loginname', that.loginForm.name)
            // 在缓存中记录最后登录时间，处理单用户登录需求
            let now = new Date().getTime()
            this.$KalixCatch._saveLocal('lastLoginTime', now)
            this.$KalixCatch.save('lastLoginTime', now)
            this.$router.push({path: '/'})
          } else {
            this.$refs.loginFormName.focus()
            this.$KalixMessage.error(data.message)
          }
        }).catch(error => {
          console.log('login error ', error)
          this.$refs.loginFormName.focus()
          this.$KalixMessage.error(error.message)
        })
      },
      _validateForm() {
        //  验证表单
        for (let key in this.rules) {
          this.error.flag = false
          this.error.message = ''
          this.$refs.loginForm.validateField(key, errorMessage => {
            //  如果错误信息长度 > 0 表示验证不通过
            this.error.flag = errorMessage.length > 0
            this.error.message = errorMessage
          })
          if (this.error.flag) {
            return false
          }
        }
        return true
      },
      tabInput() {
        let ipts = document.getElementsByClassName('el-input__inner')
        for (let i = 0; i < ipts.length; i++) {
          ipts[i].addEventListener('keydown', e => {
            if (e.keyCode === 13) {
              if (ipts[i + 1]) {
                ipts[i + 1].focus()
              } else {
                document.getElementsByClassName('btn-submit')[0].focus()
              }
            }
          })
        }
      },
      listen() {
        this.error.flag = false
      },
      /**
       * 登录函数
       * @param _data 传递的登录数据
       * @returns {Promise.<TResult>|*}
       */
      _remoteLogin(_data) {
        console.log(`remote address is ${loginUrl}`)
        return this.$http.request({
          method: 'POST',
          url: loginUrl,
          transformRequest: [(data) => {
            // Do whatever you want to transform the data
            let ret = ''
            for (let it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
          }],
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: _data
        }).then((res) => {
          console.log('[kalix]-[login.js] remoteLogin function return data is: ', res.data)
          return Promise.resolve(res.data)
        })
      }
    },
    components: {},
    computed: {},
    watch: {
      loginForm: {
        handler: 'listen',
        // 深度观察
        deep: true
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
