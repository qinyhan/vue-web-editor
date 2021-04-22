<template>
    <transition name="editor-message-fade">
        <div v-if="show" :class="[ 'editor-message', type? `editor-message-${ type }` : '']">
            <i v-if="type=='error'" class="iconfont editor-message-icon">&#xe62b;</i>
            <i v-if="type=='success'" class="iconfont editor-message-icon">&#xe66b;</i>
            <i v-if="type=='warning'" class="iconfont editor-message-icon">&#xe836;</i>
            <span class="editor-message-con">{{text}}</span>
        </div>
    </transition>
</template>

<script type="text/babel">
    export default {
        data() {
            return {
                show: false,
                text: '',
                type: ''
            };
        }
    };
</script>
<style lang="scss" rel="stylesheet/scss">
    .editor-message {
        min-width: 380px;
        box-sizing: border-box;
        border-radius: 4px;
        border: 1px solid #ebeef5;
        position: fixed;
        left: 50%;
        top: 20px;
        transform: translateX(-50%);
        background-color: #edf2fc;
        /*transition: opacity .3s,transform .4s,top .4s;*/
        transition: all .3s;
        overflow: hidden;
        padding: 15px 15px 15px 20px;
        display: flex;
        align-items: center;
    }

    .editor-message-success {
        background-color: #f0f9eb;
        border-color: #e1f3d8;
        .editor-message-icon, .editor-message-con { color: #67c23a; }
    }

    .editor-message-error {
        background-color: #fef0f0;
        border-color: #fde2e2;
        .editor-message-icon, .editor-message-con { color: #f56c6c; }
    }
    .editor-message-warning {
        background-color: #fdf6ec;
        border-color: #fdf6ec;
        .editor-message-icon, .editor-message-con { color: #e6a23c; }
    }

    .editor-message-warning {
        background-color: #ccc;
    }

    .editor-message-icon {
        display: inline-block;
        width: 16px;
        height: 16px;
        float: left;
    }

    .editor-message-con {
        line-height: 16px;
        height: 16px;
        display: inline-block;
        margin-left: 10px;
    }

    .editor-message-fade-enter-active {
        top: -100px;
        /*transition: top 0.3s linear;*/
    }

    .editor-message-fade-leave-active {
        top: -20px;
        /*transition: top 0.3s linear;*/
    }

    .editor-message-fade-enter, .editor-message-fade-leave-to
        /* .slide-fade-leave-active for below version 2.1.8 */
    {
        opacity: 0;
    }
</style>
