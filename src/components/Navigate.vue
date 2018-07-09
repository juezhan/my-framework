<template lang="pug">
  div.kalix-navigate(v-bind:class="{'small':menuChk}")
    ul.bd.bg(v-if="!menuChk")
      li(v-for="item in treeData" v-bind:key="item.id" v-bind:class="{'active':item.isShow}")
        div.s-flex.tit.tit-txt(@click="showTree(item,$event)")
          div.s-flex_item
            i.tit_icon(:class="bindClass(item.iconCls)")
            span.txt {{item.text}}
          div.arrow
            i(v-bind:class="showIcon(item.isShow)")
        el-collapse-transition
          div.mn(v-show="item.isShow")
            ul
              li(v-for="item in item.children" v-bind:key="item.id")
                div.tit(v-on:click="selectItem(item)" v-bind:class="currentCls(item)")
                  i.tit_icon(:class="bindClass(item.iconCls)")
                  | {{item.text}}
    ul.bd.samll(v-if="menuChk")
      li(v-for="item in treeData")
        div.s-flex.tit(v-bind:class="{'active':item.isShow}")
          i.tit_icon(:class="bindClass(item.iconCls)")
          div.mn
            div.txt {{item.text}}
            ul
              li.tit(v-for="item in item.children"
              v-bind:key="item.id"
              v-on:click="selectItem(item)")
                i.tit_icon(v-bind:class="bindClass(item.iconCls)")
                | {{item.text}}
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'KalixNavigate',
    props: {
      cacheTime: {
        type: Number,
        default: ''
      },
      url: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        name: 'kalixNav',
        currApp: '',
        currFun: '',
        activeName: '1',
        obj: {'name': 'aa'},
        treeData: [],
        clickedNode: null,
        flag: true,
        menuChk: false
      }
    },
    activated() {
      // this.$KalixEventBus.$on('HeaderOnSmall', (e) => {
      //   this.menuChk = e
      // })
      this.fetchData()
    },
    mounted() {
    },
    watch: {
      '$route'(to, from) {
        if (to.path !== '/' && to.path !== '/login') {
          this.fetchData()
        }
      }
    },
    methods: {
      fetchData() {
        this.treeData = []
        if (this.$route.name === 'login') {
          return
        }
        let d = new Date()
        let cd = d.getTime()
        let treeListData = {}
        this.currApp = this.$route.params.app
        this.currFun = this.$route.params.fun || ''
        if (this.$KalixCatch.get('treeListData')) {
          treeListData = JSON.parse(this.$KalixCatch.get('treeListData'))
        }
        if (treeListData.createDate && (treeListData.createDate - cd) < this.cacheTime && treeListData[this.currApp]) {
          this.treeData = treeListData[this.currApp]
          this.setItemShow()
        } else {
          const data = {_dc: cd, node: 'root'}
          if (this.flag) {
            this.flag = false
            this.$http.get(
              this.url + this.currApp,
              {
                params: data
              }).then(response => {
              this.flag = true
              let nowDate = new Date()
              if (response.data && response.data.code !== 401) {
                this.treeData = response.data
                if (this.treeData.length) {
                  this.treeData.forEach(e => {
                    this.$set(e, 'isShow', false)
                  })
                  treeListData[this.currApp] = this.treeData
                  treeListData.createDate = nowDate.getTime()
                  this.setItemShow()
                  this.$KalixCatch.save('treeListData', JSON.stringify(treeListData))
                }
              }
            })
          }
        }
      },
      setItemShow() {
        let routeName = this.currFun.toLowerCase()
        this.treeData.forEach((item) => {
          item.isShow = false
          let temp = item.children.find(function (e) {
            let routeId = e.routeId.split('/').pop()
            return routeId.toLowerCase() === routeName
          })
          if (temp) {
            item.isShow = true
          }
        })
      },
      bindClass(e) {
        return e
      },
      showTree(e) {
        this.clickedNode = e
        this.treeData.forEach((item) => {
          if (item !== e) {
            item.isShow = false
          } else {
            item.isShow = !item.isShow
          }
        })
      },
      showIcon(e) {
        return e ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
      },
      selectItem(item) {
        this.$router.push({path: `/${this.currApp}/${item.routeId.split('/').pop()}`})
        this.$KalixCatch.save('currentTreeListItem', JSON.stringify(item))
      },
      currentCls(item) {
        return item.routeId.split('/').pop().toLowerCase() === this.currFun.toLowerCase() ? 'active' : ''
      }
    },
    components: {}
  }
</script>
