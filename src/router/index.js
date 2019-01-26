import Vue from 'vue'
import Router from 'vue-router'
import ProjectIndex from './project-index.js'
import Login from "../pages/login/Login.vue";
// 路由懒加载
const Index = () => import('../pages/index/Index.vue');
const routes = [
  {
    path: '/index',
    component: Index,
  },
  {
    path:'/login',
    component:Login
  },
  {
    path:'',
    redirect:'login'
  },
  ...ProjectIndex,
]

const router = new Router({
  mode: 'history',
  routes
})
Vue.use(Router)

export default router;
