<template lang="pug">
  div.welcome
    div Welcome
      b {{name}}
</template>

<script type="text/ecmascript-6">
  let baseLineChartUrl = ''

  export default {
    name: 'Welcome',
    data() {
      return {
        name: null,
        groupDataUrl: '',
        lineChartUrl: ''
      }
    },
    mounted() {
      this.fetchData()
    },
    watch: {'$route': 'fetchData'},
    methods: {
      fetchData() {
        if (this.$route.name === 'login' || this.$route.name === 'workflow') {
          return
        }
        this.name = this.$route.params.app || this.name
        this.getDict()
        // console.log(this.$route.params.name);
        // dashboard
        this.groupDataUrl = '/camel/rest/' + this.name + '/dashboard/panelGroup'
        baseLineChartUrl = '/camel/rest/' + this.name + '/dashboard/lineChart?chartKey='
        switch (this.name) {
          case 'admin':
            break
          case 'oa':
            break
          default:
            this.groupDataUrl = ''
            baseLineChartUrl = ''
            this.lineChartUrl = ''
            break
        }
      },
      /**
       * 获取数据字典
       */
      getDict() {
        if (this.name) {
          const DictURL = `/camel/rest/${this.name}/dicts`
          const DictKey = `${this.name.toUpperCase()}-DICT-KEY`
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
        }
      },
      handleGetDataComplete(key) {
        if (key) {
          this.lineChartUrl = baseLineChartUrl + key
        } else {
          this.lineChartUrl = ''
        }
      },
      handleSetLineChartData(key) {
        this.lineChartUrl = baseLineChartUrl + key
      }
    },
    components: {},
    computed: {}
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .welcome {
    padding: 32px;
    /*background-color: rgb(240, 242, 245);*/
    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }
</style>
