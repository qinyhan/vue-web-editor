import Vue from 'vue'
import App from './App.vue'
import router from './router'
import message from "./utils/message";

/*rem*/
// import './utils/rem/rem-min'
/*初始化样式*/
import '../src/assets/css/reset.css'
import '../src/assets/css/style.css'
/*字体库图标*/
import './assets/font/iconfont.css'

Vue.prototype.$message = message

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')
