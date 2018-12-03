import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index-page',
      component: require('@/components/Index').default
    },
    {
      path: '/processingtimegraph',
      name: 'processingtimegraph-page',
      component: require('@/components/ProcessingTimeGraph').default
    },
    {
      path: '/recommend',
      name: 'recommend-page',
      component: require('@/components/Recommend').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
