import 'babel-polyfill';
import Vue from 'vue';
import Vuetify from 'vuetify';

import 'vuetify/dist/vuetify.min.css';

import './style.css';
import App from './App';
import router from './router';

Vue.use(Vuetify);

Vue.config.productionTip = false;

if (localStorage.version !== '1.2.1') {
  localStorage.version = '1.2.1';
  window.location.reload(true);
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App,
  },
});
