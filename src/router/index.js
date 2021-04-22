import Vue from 'vue'
import Router from 'vue-router'
import home from './home'

// const _import = require('./config/_import_' + process.env.NODE_ENV)
Vue.use(Router)

const router = new Router({
    routes: [
        ...home
    ],
    mode: 'history'
})

export default router
