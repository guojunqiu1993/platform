import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
import 'static/css/iconfont.css'
import "babel-polyfill";

Vue.use(ElementUI, { size: 'small' });
import $ from 'jquery'

import echarts from 'echarts'
Vue.prototype.$echarts = echarts

axios.defaults.withCredentials=true
Vue.prototype.$axios = axios
// axios.defaults.baseURL = 'http://192.168.2.165:8081'
axios.defaults.headers['Access-Control-Allow-Origin']='*'

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    const role = sessionStorage.getItem('access_token')
    let barer_token = 'Bearer ' + window.sessionStorage.getItem('access_token')
    window.sessionStorage.setItem('access_token',role)
    axios.defaults.headers.Authorization=barer_token
    const url = sessionStorage.getItem('url')
    axios.defaults.baseURL = url
    if(!role && to.path !== '/login'){
        next('/login');

    }else if(to.meta.permission){
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/403');
    }else{
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if(navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor'){
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        }else{
            next();
        }
    }
})



new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
