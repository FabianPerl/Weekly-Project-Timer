import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify/lib'

import VueLodash from 'vue-lodash'
import lodash from 'lodash'
import { store } from './store/store'

Vue.use(VueLodash, { lodash: lodash })
Vue.config.productionTip = false
Vue.use(Vuetify)

const vuetify = new Vuetify({
  theme: {
    themes: {
      primary: '#1976D2',
      secondary: '#424242',
      accent: '#82B1FF',
      error: '#FF5252',
      info: '#2196F3',
      success: '#4CAF50',
      warning: '#FFC107',
    },
  },
})

new Vue({
  vuetify,
  store,
  VueLodash,
  render: h => h(App)
}).$mount('#app')
