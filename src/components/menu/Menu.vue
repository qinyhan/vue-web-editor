<template>
    <div class="web-editor-icons s_flex flex_wrap" ref="menuIconsRef">
        <div v-for="(item, index) in list" :key="index" @click="handleClickMenuItem(item)"><!-- @click="is_show_icons = true, clickEditMenu(item)"-->
            <button>
                <em class="iconfont" v-html="item.icon_name"></em>
                <input type="file" accept="image/gif, image/jpeg, image/png" ref="editor_upload" v-if="item.type == 'image'"><!-- @change="uploadBefore"-->
            </button>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            list: Array
        },
        data() {
            return {}
        },
        methods: {
            handleClickMenuItem (item) {
                this.$emit('click-menu', true, item)
            }
        },
        mounted() {
        }
    }
</script>

<style lang="scss" scoped>
    .web-editor-icons {
        min-height: 40px; padding: 0 20px; align-items: center; background-color: #fafbfc; box-sizing: border-box;
        button { margin: 10px 0; cursor: pointer; /*color: #858585;*/ position: relative; cursor: pointer; }
        button input { position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; cursor: pointer; opacity: 0; cursor: pointer; }
        &-content { min-height: calc(100% - 40px); padding: 20px; text-align: left; border-radius: 6px; background-color: #ffffff; position: relative; }
        &-content &-scanner {
            height: 100%; outline: none;
            &:empty:before{ content: attr(data-content-before); color: #cccccc; }
            &:focus:before{ content: none; }
        }
    }
</style>
