const _import = require('./config/_import_' + process.env.NODE_ENV)

const home = [
    {
        path: '/',
        name: 'index',
        component: _import('index/Home'),
        meta: {
            title: '首页'
        }
    }
]

export default home
