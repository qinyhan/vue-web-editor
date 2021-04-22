<template>
    <transition name="dialog-fade">
        <div class="editor-dialog" v-if="visible">
            <div class="mark"></div>
            <div class="editor-dialog-box">
                <div class="editor-dialog-header s_flex">
                    <label>{{title}}</label>
                    <em class="iconfont" @click="handleClickCloseDialog">&#xe960;</em>
                </div>
                <div class="editor-dialog-body">
                    <slot></slot>
                </div>
                <!--<div class="editor-dialog-footer s_flex">
                    <div class="editor-dialog-btn">取消</div>
                    <div class="editor-dialog-btn primary">确定</div>
                </div>-->
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                default: '提示'
            },
            visible: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {}
        },
        methods: {
            handleClickCloseDialog () {
                this.$emit('update:visible', false);
            }
        },
        mounted() {
        }
    }
</script>

<style lang="scss" scoped>
    /*弹窗设置*/
    .editor-dialog {
        width: 100%; position: fixed; top: 15%;
        .mark { position: fixed; top: 0; right: 0; bottom: 0; left: 0; overflow: auto; margin: 0; background-color: rgba(0, 0, 0, 0.5); }
        .editor-dialog-box { width: 30%; padding: 20px; text-align: left; position: relative; margin: 0 auto 50px; margin-top: 15vh; background-color: #ffffff; border-radius: 2px; box-shadow: 0 1px 3px rgb(0 0 0 / 30%); box-sizing: border-box; }
        .editor-dialog-box .editor-dialog-header { line-height: 24px; padding: 20px 20px 10px; justify-content: space-between; font-size: 18px; color: #303133; }
        .editor-dialog-box .editor-dialog-body { padding: 30px 20px 0; color: #606266; font-size: 14px; word-break: break-all; }
        .editor-dialog-box .editor-dialog-footer { justify-content: flex-end; }
        .editor-dialog-box .editor-dialog-footer .editor-dialog-btn { display: inline-block; line-height: 1; margin-left: 20px; white-space: nowrap; cursor: pointer; background: #fff; border: 1px solid #dcdfe6; color: #606266; -webkit-appearance: none; text-align: center; box-sizing: border-box; outline: none; transition: .1s; font-weight: 500; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; padding: 12px 20px; font-size: 14px; border-radius: 4px; }
        .editor-dialog-box .editor-dialog-footer .editor-dialog-btn.primary { color: #ffffff; background-color: #409eff; border-color: #409eff; }
    }
</style>
