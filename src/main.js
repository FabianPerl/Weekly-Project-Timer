import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueLodash from 'vue-lodash'
import lodash from 'lodash'
import { store } from './store/store'

Vue.use(VueLodash, { lodash: lodash })
Vue.config.productionTip = false

new Vue({
  vuetify,
  store,
  VueLodash,
  render: h => h(App)
}).$mount('#app')
