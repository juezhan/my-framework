import Vue from 'vue'
import Router from 'vue-router'
import {Cache} from '../lib'
import HelloWorld from '@/components/HelloWorld'
import Home from '@/view/Home'
import Login from '@/view/Login'

Vue.use(Router)

const router = new Router({
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

router.beforeEach((to, from, next) => {
  if (Cache.get('id') === null && to.name !== 'login') {
    next({path: '/login'})
  }
  next()
})

export default router
