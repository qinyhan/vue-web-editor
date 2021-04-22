import Vue from 'vue'
import messageVue from '../components/message/Message'

const defaults = {
    show: false,
    text: '',
    duration: '3000',
    type: ''
};
const messageVueConstructor = Vue.extend(messageVue);
messageVueConstructor.prototype.close = function() {
    let vm = this;
    this.$on('after-leave', () => {
        if (vm.$el && vm.$el.parentNode) {
            vm.$el.parentNode.removeChild(vm.$el);
        }
        this.$destroy();
    });
    vm.show = false;

};
const message = (options = {}) => {
    if (Vue.prototype.$isServer) return;
    options = Object.assign({}, defaults, options);
    let parent = document.body ;
    let instance = new messageVueConstructor({
        el: document.createElement('div'),
        data: options
    });
    parent.appendChild(instance.$el);
    Vue.nextTick(() => {
        instance.show = true;
        setTimeout(() => {
            instance.close();
        }, options.duration)
    });


    return instance;
};

export default message;
