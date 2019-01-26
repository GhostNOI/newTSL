// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from './common/http.js'
//引入jQuery
import $ from 'jquery'
//重置样式
import './assets/scss/reset.scss'
//引入bootsrtap
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap/dist/js/bootstrap.min'
//引入element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//引入自定义样式--修改element
import './assets/scss/custom-element.scss';
//引入自定义样式
import './assets/scss/custom-style.scss'
//引入echarts
import Echarts from 'echarts'
//引入font
import './assets/fontawesome5.5.0/css/all.css'
import store from "./store";
Vue.prototype.echarts = Echarts
Vue.use(Echarts)
Vue.use(ElementUI)


Vue.config.productionTip = false
Vue.prototype.$http = axios;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  components: { App },
  template: '<App/>'
})
