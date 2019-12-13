


import Vue from 'vue';
import NUI from '@nsea/n-ui';
import '@nsea/n-ui/lib/styles/n-ui.css'
Vue.use(NUI);
// import App from './app';
import App from './grid';
// import './style/main.scss';
// import './style/style.scss';
const app = new Vue(App);
app.$mount('#app');
