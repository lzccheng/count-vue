import Vue from 'vue'
import Vant from 'vant'
import App from './App.vue'
import router from './router'
import store from './store'
import api from './api'
import 'vant/lib/index.css'

Vue.config.productionTip = false

Vue.use(Vant)

Vue.prototype.$api = api

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
