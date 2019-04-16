import Vue from 'vue'
import axios from 'axios'
axios.defaults.withCredentials=true;
Vue.prototype.$axios = axios;
axios.defaults.baseURL = 'http://192.168.2.162:8080';
let barer_token = 'Bearer ' + window.sessionStorage.getItem('access_token')
axios.defaults.headers.Authorization=barer_token
