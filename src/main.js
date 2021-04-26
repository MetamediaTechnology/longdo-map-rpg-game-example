import Vue from 'vue'
import App from './App.vue'
import LongdoMap from 'longdo-map-vue'

Vue.config.productionTip = false

Vue.use(LongdoMap, {
  load: {
      apiKey: ''
  }
})

new Vue({
  render: h => h(App),
}).$mount('#app')
