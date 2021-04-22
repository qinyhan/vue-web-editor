<template>
    <!--右侧菜单-->
    <div class="editor-right">
        <div class="mark" v-if="is_show" @click="is_show = false"></div>
        <div class="editor-menu" :style="{ width: is_show ? '16%' : '0' }">
            <template v-if="is_show">
                <div class="s_flex flex_wrap">
                    <div class="editor-menu-item" @click="clickRightMenuItem('upload')">
                        <em class="iconfont" title="iconfont">&#xe967;</em>
                    </div>
                    <div class="editor-menu-item" @click="clickRightMenuItem('html')">
                        <em class="iconfont" title="html">&#xe964;</em>
                    </div>
                    <div class="editor-menu-item">
                        <em class="iconfont" title="html">&#xe964;</em>
                    </div>
                </div>
            </template>
            <!--图片上传按钮-->
            <input type="file" accept="image/gif, image/jpeg, image/png" ref="editor_upload" @change="uploadBeforeRead" style="display: none;">
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            //  是否显示右侧菜单
            is_show: {
                type: Boolean,
                default: false
            },
            //
            range: Object
        },
        data() {
            return {
            }
        },
        methods: {
            /** 点击右侧菜单设置 **/
            clickRightMenuItem (type) {
                /*if (type == 'upload') {
                    //  触发上传图片的点击事件
                    this.$refs.editor_upload.dispatchEvent(new MouseEvent('click'))
                }*/
                switch (type) {
                    case 'upload':
                        //  触发上传图片的点击事件
                        console.log(this.$refs.editor_upload)
                        this.$refs.editor_upload.dispatchEvent(new MouseEvent('click'))
                        break
                    case 'html':
                        // this.web_editor_html = this.clickGetInnerhtml(this.web_editor_desc)
                }
            },
            /** 图片上传中 **/
            uploadBeforeRead (event) {
                // console.log(event)
                let reader = new FileReader();
                let file = event.target.files[0];
                this.uploadBeforeRead(event)
                console.log(reader)
                console.log(file)
            },
            /** 图片上传成功 **/
            uploadBeforeSuccess (event) {
                let reader = new FileReader();
                let file = event.target.files[0];
                reader.onload = () => {
                    let base64Img = reader.result
                    let element = document.createElement('IMG')
                    element.style.maxWidth = '100%'
                    element.setAttribute('src', base64Img)
                    /*if (this.range) {
                        this.range.surroundContents(element)
                    } else {
                        this.$refs['web_editor_sanner'].focus()
                        let selection = document.getSelection()
                        selection.focusOffset
                        /!*let range = selection.getRangeAt(0)
                        range.setStartAfter()*!/
                        return
                    }*/
                    this.range && this.range.surroundContents(element)
                    this.is_show = false
                    this.$emit('upload-success', this.is_show)
                };
                reader.readAsDataURL(file);
            }
        },
        mounted() {
        }
    }
</script>

<style lang="scss" scoped>
    /*右侧菜单设置*/
    .editor-right {
        .mark { width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); position: absolute; left: 0; top: 0; }
        .editor-menu { width: 0; width: 10%; height: 100%; background-color: #ffffff; transition: width 0.3s; position: absolute; top: 0; right: 0; z-index: 1; }
        .editor-menu-item { display: table; padding: 10px; margin: 10% auto; border: 1px solid #e5e5e5; border-radius: 100%; cursor: pointer; }
        .editor-menu-item em { display: block; font-size: 2em; }
    }
</style>
