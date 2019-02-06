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
      path: '/eachquality',
      name: 'each-quality-page',
      component: require('@/components/EachQuality').default
    },
    {
      path: '/quality',
      name: 'quality-page',
      component: require('@/components/QualityGraph').default
    },
    {
      path: '/lasteval',
      name: 'last-eval',
      component: require('@/components/LastEval').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
