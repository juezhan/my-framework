import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Home from '@/view/Home'
import Login from '@/view/Login'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
        {path: '/:app', name: 'HelloWorld', component: HelloWorld},
        {path: '/:app/:fun', name: 'navigater', component: HelloWorld}
      ]
    }
  ]
})
