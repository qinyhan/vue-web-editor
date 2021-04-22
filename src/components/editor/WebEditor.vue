<template>
    <div class="web-editor" ref="web_editor" :style="{ width: width ? width : '100%', height: height ? height : '100%' }">
        <!--<div class="web-editor-icons s_flex flex_wrap">
            <div v-for="(item, index) in menuIcons" :key="index" @click="is_show_icons = true, handleClickMenu(item)">
                <button>
                    <em class="iconfont" v-html="item.icon_name"></em>
                    <input type="file" accept="image/gif, image/jpeg, image/png" ref="editor_upload" v-if="item.type == 'image'" @change="uploadBefore">
                </button>
            </div>
        </div>-->
        <editor-menu :list="menuIcons" ref="menuIconsRef" @click-menu="handleListenMenuTap"></editor-menu>
        <div class="web-editor-content">
            <div class="web-editor-scanner" ref="web_editor_sanner" contenteditable="true" spellcheck="false" v-html="web_editor_desc" :data-content-before="editor_placeholder" v-focus @click="handleSelectText"></div>
            <div class="editor-btns s_flex flex_wrap" ref="editor_popover" v-if="is_show_icons">
                <template v-if="!menu_type">
                    <em v-for="(item, index) in menu_list" :key="index" @click="handleClickMenu(item)"><button class="iconfont" v-html="item.icon_name"></button></em>
                </template>
                <div class="" v-if="menu_type == 'fontSize'">
                    <em v-for="(item, index) in menu_list" :key="index" @click="execCommand('fontSize', item.value)"><button :style="{ fontSize: item.label + 'px' }">{{item.label}}</button></em>
                </div>
                <div class="" v-if="menu_type == 'fontName'">
                    <em v-for="(item, index) in menu_list" :key="index" @click="execCommand('fontName', item)"><button>{{item}}</button></em>
                </div>
                <div class="" v-if="menu_type == 'foreColor' || menu_type == 'backColor'">
                    <div class="editor-colors s_flex flex_wrap">
                        <p v-for="(item, index) in menu_list" :key="index">
                            <button :style="{ backgroundColor: item }" @click="execCommand(menu_type, item)"></button>
                        </p>
                    </div>
                </div>
                <div class="" v-if="menu_type == 'link'">
                    <div class="editor-link s_flex">
                        <input type="text" placeholder="请输入链接地址" v-model="link_url" v-focus>
                        <button @click="clickCreateLink">保存</button>
                    </div>
                </div>
            </div>
        </div>
        <!--图片上传按钮-->
        <input type="file" accept="image/gif, image/jpeg, image/png" ref="editor_upload" @change="uploadBeforeRead" style="display: none;">
        <!--图片操作-->
        <editor-dialog :visible.sync="showEditPhoto" title="修改图片">
            <div class="editor-form">
                <div class="editor-form-item">
                    <div class="s_flex">
                        <label>宽度</label>
                        <input type="text" :disabled="editorForm.disabled" v-model="photoConfigForm.width">
                    </div>
                </div>
                <div class="editor-form-item">
                    <div class="s_flex">
                        <label>高度</label>
                        <input type="text" v-model="photoConfigForm.height">
                    </div>
                </div>
                <div class="editor-form-item">
                    <div class="editor-form-btn s_flex">
                        <div class="editor-dialog-btn" @click="showEditPhoto = false">取消</div>
                        <div class="editor-dialog-btn primary" @click="clickEditPhotoInfo">确定</div>
                    </div>
                </div>
            </div>
        </editor-dialog>
        <!--右侧菜单-->
        <div class="editor-right">
            <div class="mark" v-if="is_right_menu" @click="is_right_menu = false"></div>
            <div class="editor-menu" :style="{ width: is_right_menu ? '16%' : '0' }">
                <template v-if="is_right_menu">
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
            </div>
        </div>
        <source-code-view :value="web_editor_desc" :options="sourceOptions" v-if="web_editor_html"></source-code-view>
    </div>
</template>

<script>
    import EditorDialog from '../../components/dialog/Dialog'
    import EditorMenu from '../../components/menu/Menu'
    import SourceCodeView from "../../components/source/SourceCodeView";

    export default {
        name: 'web-editor',
        data() {
            return {
                width: 'auto',
                height: '',
                //  富文本默认提示文案
                editor_placeholder: '请输入内容',
                menuIcons: [
                    {
                        icon_name: '&#xe963;',
                        class_name: 'iconeditor-font-size',
                        type: 'fontSize',
                        click: 0
                    },
                    {
                        icon_name: '&#xe962;',
                        class_name: 'iconeditor-font',
                        type: 'fontName',
                        click: 0
                    },
                    {
                        icon_name: '&#xe965;',
                        class_name: 'iconeditor-font-bold',
                        type: 'bold',
                        value: 'bold',
                        click: 1
                    },
                    {
                        icon_name: '&#xe966;',
                        class_name: 'iconeditor-italic',
                        type: 'italic',
                        click: 1
                    },
                    {
                        icon_name: '&#xe96c;',
                        class_name: 'iconeditor-underline',
                        type: 'underline',
                        click: 1
                    },
                    {
                        icon_name: '&#xe7fc;',
                        class_name: 'iconeditor-strikethrough',
                        type: 'strikeThrough',
                        click: 1
                    },
                    {
                        icon_name: '&#xe970;',
                        class_name: 'iconeditor-font-color',
                        type: 'foreColor',
                        click: 0
                    },
                    {
                        icon_name: '&#xe957;',
                        class_name: 'iconeditor-align-left',
                        type: 'justifyLeft',
                        click: 1
                    },
                    {
                        icon_name: '&#xe96d;',
                        class_name: 'iconeditor-align-center1',
                        type: 'justifyCenter',
                        click: 1
                    },
                    {
                        icon_name: '&#xe957;',
                        class_name: 'iconeditor-align-right',
                        type: 'justifyRight',
                        click: 1
                    },
                    {
                        icon_name: '&#xe968;',
                        class_name: 'iconeditor-list-order',
                        type: 'insertOrderedList',
                        click: 1
                    },
                    {
                        icon_name: '&#xe96a;',
                        class_name: 'iconeditor-list-disorder',
                        type: 'insertUnorderedList',
                        click: 1
                    },
                    {
                        icon_name: '&#xe95a;',
                        class_name: 'iconeditor-bgcolor',
                        type: 'backColor',
                        click: 0
                    },
                    {
                        icon_name: '&#xe600;',
                        class_name: 'iconeditor-attachment',
                        type: 'link',
                        click: 0
                    },
                    {
                        icon_name: '&#xe66c;',
                        class_name: 'iconmore',
                        type: 'more',
                        click: 0
                    }
                ],
                web_editor_desc: '附件<p>是</p>的开发<a href="http://www.com" title="img"><img src="https://cdn.toodudu.com/2019/11/12/Aa0rcemgQ6QyOmFyt70PyvvvmHPO9yZ9GntguLKg.png" alt=""></a>建设的克里夫<a href="http://www.com" title="精神科">精神科</a>大夫就是<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAApCAYAAABOScuyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo5N2UyN2ZhMy04MGU3LWRiNDgtYjQzOC01ZTA2YjNjYWQyNjIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTZFNUZDQTdCMzU2MTFFOUE0Qzc4OTk4NzMwQkRGREYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTZFNUZDQTZCMzU2MTFFOUE0Qzc4OTk4NzMwQkRGREYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjU4MmY2YTRmLTdmYzYtNjI0NC05NjRmLTc1ZGM0OTllOTVjZSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5N2UyN2ZhMy04MGU3LWRiNDgtYjQzOC01ZTA2YjNjYWQyNjIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4qDNc2AAAB2ElEQVR42mL8//8/w1ACTAxDDDAaGxurAOntQKyCRf4vED8E4t9ArD4A7gPZuxOIM4H4yZkzZxhYgAw/HI4FAWYgVkJyPDOdHcwKxD5ArAvEOkD8BZQkNgHxXSI0Mw9gSpAH4lhYGr4DDWFGLJgTiGcMkuSrQkym+wFKO4PEwZ+JLSWkB4mDnxPrYMVB4uAXxDpYeSiFMCM0hw6ZEBYHYjYo+99QcLDsIKnGPwDxL2IcITNIksNrYkNNbDBlOGIcLDFIHPyIWAdLDhIHPxu2SUJqMJXBxDhYhIB8NRCz42jpEYPZoWZQzcGEkkQPrHwkE4D0TqJWGgbVcLwEDCpBqgnJ7VHkkRLCLHgUCRNhUCsU0xL8AeJPxITwYCkhPhDbzRcZJA5+T6yDhQaJg98Q62C+QeLgS8Q6+NYgcCyoDT6BWAcfAeJjA+hY0KBfIRDfINbBIA1eQLwYiH/S0aGgYuwE1G6MSoWFgOaPQBwHxYMCMKIPt5qYmAy4o0CDfrjAkBtuJdSWmAjEb4H4HZTNRkW7yTIfXxruQmuYgNjfgbiCSg4my3x8IRyLRSyViiFMlvnDKg0vxiI2h4p2k2U+vjRcBu3GxCJZUEtFB5NlPuPotBeNAUCAAQCCb15WdSfi2gAAAABJRU5ErkJggg==">',
                // web_editor_html: "附件&lt;p&gt;是&lt;/p&gt;的开发&lt;a href='http://www.com' title='img'&gt;&lt;img src='https://cdn.toodudu.com/2019/11/12/Aa0rcemgQ6QyOmFyt70PyvvvmHPO9yZ9GntguLKg.png' alt='&gt;&lt;/a&gt;建设的克里夫&lt;a href='http://www.com' title='精神科'&gt;精神科&lt;/a&gt;大夫就是&lt;img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAApCAYAAABOScuyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo5N2UyN2ZhMy04MGU3LWRiNDgtYjQzOC01ZTA2YjNjYWQyNjIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTZFNUZDQTdCMzU2MTFFOUE0Qzc4OTk4NzMwQkRGREYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTZFNUZDQTZCMzU2MTFFOUE0Qzc4OTk4NzMwQkRGREYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjU4MmY2YTRmLTdmYzYtNjI0NC05NjRmLTc1ZGM0OTllOTVjZSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5N2UyN2ZhMy04MGU3LWRiNDgtYjQzOC01ZTA2YjNjYWQyNjIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4qDNc2AAAB2ElEQVR42mL8//8/w1ACTAxDDDAaGxurAOntQKyCRf4vED8E4t9ArD4A7gPZuxOIM4H4yZkzZxhYgAw/HI4FAWYgVkJyPDOdHcwKxD5ArAvEOkD8BZQkNgHxXSI0Mw9gSpAH4lhYGr4DDWFGLJgTiGcMkuSrQkym+wFKO4PEwZ+JLSWkB4mDnxPrYMVB4uAXxDpYeSiFMCM0hw6ZEBYHYjYo+99QcLDsIKnGPwDxL2IcITNIksNrYkNNbDBlOGIcLDFIHPyIWAdLDhIHPxu2SUJqMJXBxDhYhIB8NRCz42jpEYPZoWZQzcGEkkQPrHwkE4D0TqJWGgbVcLwEDCpBqgnJ7VHkkRLCLHgUCRNhUCsU0xL8AeJPxITwYCkhPhDbzRcZJA5+T6yDhQaJg98Q62C+QeLgS8Q6+NYgcCyoDT6BWAcfAeJjA+hY0KBfIRDfINbBIA1eQLwYiH/S0aGgYuwE1G6MSoWFgOaPQBwHxYMCMKIPt5qYmAy4o0CDfrjAkBtuJdSWmAjEb4H4HZTNRkW7yTIfXxruQmuYgNjfgbiCSg4my3x8IRyLRSyViiFMlvnDKg0vxiI2h4p2k2U+vjRcBu3GxCJZUEtFB5NlPuPotBeNAUCAAQCCb15WdSfi2gAAAABJRU5ErkJggg=='&gt;",
                web_editor_html: '',
                //  是否开启下拉
                is_open_down: false,
                menuDowns: [],
                font_name: ['serif', 'sans-serif', 'cursive', 'fantasy', 'monospace'],
                font_color: ['#ffffff', '#1d8ce0', '#41b883', '#ffa000', '#f60000', '#f0e02f', '#00dc77', '#e6e41c', '#e026a0', '#555555', '#324057', '#8492a6', '#99a9bf'],
                select_type: '',
                //  是否显示弹窗
                dialogVisible: false,
                editorForm: {
                    name: '',
                    url: ''
                },
                //  是否显示修改图片弹窗
                showEditPhoto: false,
                photoConfigForm: {},
                //  是否显示富文本框操作按钮
                is_show_icons: false,

                menu_list: [
                    {
                        icon_name: '&#xe963;',
                        class_name: 'iconeditor-font-size',
                        type: 'fontSize',
                        click: 0
                    },
                    {
                        icon_name: '&#xe962;',
                        class_name: 'iconeditor-font',
                        type: 'fontName',
                        click: 0
                    },
                    {
                        icon_name: '&#xe965;',
                        class_name: 'iconeditor-font-bold',
                        type: 'bold',
                        value: 'bold',
                        click: 1
                    },
                    {
                        icon_name: '&#xe966;',
                        class_name: 'iconeditor-italic',
                        type: 'italic',
                        click: 1
                    },
                    {
                        icon_name: '&#xe96c;',
                        class_name: 'iconeditor-underline',
                        type: 'underline',
                        click: 1
                    },
                    {
                        icon_name: '&#xe970;',
                        class_name: 'iconeditor-font-color',
                        type: 'fontColor',
                        click: 0
                    },
                    {
                        icon_name: '&#xe957;',
                        class_name: 'iconeditor-align-left',
                        type: 'justifyLeft',
                        click: 1
                    },
                    {
                        icon_name: '&#xe96d;',
                        class_name: 'iconeditor-align-center1',
                        type: 'justifyCenter',
                        click: 1
                    },
                    {
                        icon_name: '&#xe957;',
                        class_name: 'iconeditor-align-right',
                        type: 'justifyRight',
                        click: 1
                    },
                    {
                        icon_name: '&#xe968;',
                        class_name: 'iconeditor-list-order',
                        type: 'insertOrderedList',
                        click: 1
                    },
                    {
                        icon_name: '&#xe96a;',
                        class_name: 'iconeditor-list-disorder',
                        type: 'insertUnorderedList',
                        click: 1
                    },
                    {
                        icon_name: '&#xe95a;',
                        class_name: 'iconeditor-bgcolor',
                        type: 'backColor',
                        click: 0
                    },
                    {
                        icon_name: '&#xe967;',
                        class_name: 'iconeditor-image',
                        type: 'image',
                        click: 0
                    },
                    {
                        icon_name: '&#xe600;',
                        class_name: 'iconeditor-attachment',
                        type: 'link',
                        click: 0
                    },
                    {
                        icon_name: '&#xe964;',
                        class_name: 'iconeditor-html',
                        type: 'html',
                        click: 0
                    },
                    {
                        icon_name: '&#xea6c;',
                        class_name: 'iconeditor-time',
                        type: 'more',
                        click: 0
                    }
                ],
                menu_type: '',
                //  设置超链接地址
                link_url: '',
                //  是否显示右侧菜单
                is_right_menu: false,
                //  编辑器预览配置
                sourceOptions: {
                    // 默认的语法类型
                    mode: 'text/html',
                    // 主题，对应主题库 JS 需要提前引入
                    theme: 'darcula',
                    // 显示行号
                    lineNumbers: false,
                    //  代码折叠
                    lineWrapping: true,
                    //  自动缩进
                    smartIndent: true,
                    matchBrackets: true
                }
            }
        },
        /** 设置自定义指令 **/
        directives: {
            focus: {
                inserted: function (el) {
                    el.focus()
                }
            }
        },
        components: {
            EditorDialog,
            EditorMenu,
            SourceCodeView
        },
        methods: {
            /** 页面初始化设置，清除鼠标选中 **/
            initializePage (type) {
                this.menu_type = ''
                this.is_show_icons = false
                this.menu_list = []
                this.link_url = ''
                if (type && type == 'more') return false
                if (this.selection && !this.selection.isCollapsed) {
                    this.selection.empty()
                }
            },
            /** 监听菜单组件点击 **/
            handleListenMenuTap (value, item) {
                this.is_show_icons = value
                this.handleClickMenu(item)
            },
            /** 点击菜单操作 **/
            handleClickMenu (item) {
                if (item.click > 0) {
                    this.execCommand(item.type)
                } else {
                    item.type && (this.menu_type = item.type)
                    switch (item.type) {
                        case 'fontSize':
                            this.menu_list = [
                                {
                                    label: '12',
                                    value: 1
                                },
                                {
                                    label: '14',
                                    value: 2
                                },
                                {
                                    label: '16',
                                    value: 3
                                },
                                {
                                    label: '18',
                                    value: 4
                                },
                                {
                                    label: '24',
                                    value: 5
                                },
                                {
                                    label: '32',
                                    value: 6
                                },
                                {
                                    label: '48',
                                    value: 7
                                }
                            ]
                            break
                        case 'fontName':
                            this.menu_list = this.font_name
                            break
                        case 'foreColor':
                            this.menu_list = this.font_color
                            break
                        case 'backColor':
                            this.menu_list = this.font_color
                            break
                        case 'more':
                            this.is_right_menu = true
                            this.initializePage('more')
                            break
                    }
                }
            },
            /** 点击生成超链接文本 **/
            clickCreateLink () {
                let link
                let parent = this.range.commonAncestorContainer.parentElement.parentNode
                let elementName = this.range.commonAncestorContainer.parentElement.nodeName.toLowerCase()
                if (elementName == 'a') {
                    if (this.link_url) {
                        //  判断如果选中的节点为A(超链接)节点，则替换href属性值
                        this.range.commonAncestorContainer.parentElement.setAttribute('href', this.link_url)
                    } else {
                        let html = this.getChildElement(this.range.commonAncestorContainer.parentElement)
                        parent.removeChild(this.range.commonAncestorContainer.parentElement)
                        link = document.createElement('span')
                        link.innerHTML = html
                        this.range.insertNode(link)
                    }
                } else {
                    /*判断如果选中的节点不是A(超链接)节点，则先判断选中的内容中有没有“A”节点，
                     *  1、如果有：获取“A”节点的DOM，并删除“A”节点；
                     *  2、如果没有：
                     *      ①、先检查节点中是否还有节点(是否为文本节点，因为文本节点可以直接获取textContent)
                     *      ②、则直接获取鼠标选中的DOM，新创建“A”节点，将DOM添加到“A”节点中*/
                    let html = this.getChildElement(this.range)
                    if (this.link_url) {
                        if (this.range.commonAncestorContainer.nodeType != 3) {
                            this.range.extractContents()
                        } else {
                            parent.removeChild(this.range.commonAncestorContainer.parentElement)
                        }
                        link = document.createElement('a')
                        link.setAttribute('href', this.link_url)
                        link.innerHTML = html
                        this.range.insertNode(link)
                        let nodeName = link.nextElementSibling.nodeName.toLowerCase()
                        let nodeText = link.nextElementSibling.nodeValue
                        if (nodeName == 'a' && !nodeText) {
                            link.nextSibling.remove()
                        }
                    } else {
                        this.$message({type: 'error', text:'请输入链接地址'})
                    }
                }
                this.initializePage()
                this.link_url = ''
            },
            /** 获取子节点内容 **/
            getChildElement (range) {
                let list = []
                let element = typeof range.cloneContents == 'function' ? range.cloneContents() : range
                element.childNodes.forEach((item, index) => {
                    if (item.nodeName.toLowerCase() == 'a') {
                        list[index] = item.innerHTML
                    } else {
                        if (item.outerHTML) {
                            list[index] = item.outerHTML
                        } else {
                            list[index] = item.textContent
                        }
                    }
                })
                let html = list.join('')
                return html
            },
            /** 点击右侧菜单设置 **/
            clickRightMenuItem (type) {
                /*if (type == 'upload') {
                    //  触发上传图片的点击事件
                    this.$refs.editor_upload.dispatchEvent(new MouseEvent('click'))
                }*/
                switch (type) {
                    case 'upload':
                        //  触发上传图片的点击事件
                        this.$refs.editor_upload.dispatchEvent(new MouseEvent('click'))
                        break
                    case 'html':
                        this.web_editor_html = this.clickGetInnerhtml(this.web_editor_desc)
                }
            },
            /** 点击获取html **/
            clickGetInnerhtml (data) {
                let html = data.replace(/</g, '&lt;')
                html = html.replace(/>/g, '&gt;')
                /*html = html.replace(/&lt;/g, '<span>' + '<' + '<span class="tag-name">')
                html = html.replace(/&gt;/g, '</span>' + '>' + '</span>')*/
                return html
            },


            execCommand (commandName, valueArgument) {
                if (!valueArgument) {
                    valueArgument = null
                }
                document.execCommand('StyleWithCSS', true, true)
                document.execCommand(commandName, false, valueArgument)
                this.initializePage()
            },
            /** 图片上传中 **/
            uploadBeforeRead (event) {
                this.uploadBeforeSuccess(event)
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
                    this.range_upload && this.range_upload.surroundContents(element)
                    this.is_right_menu = false
                };
                reader.readAsDataURL(file);
            },
            /** 监听富文本编辑器鼠标点击 **/
            handleEditorClick (event) {
                if (event && event.target && event.target.tagName == 'IMG') {
                    this.showEditPhoto = true
                    this.$refs['web_editor_sanner'].blur()
                    this.el_event = event
                }
            },
            /** 点击修改图片尺寸 **/
            clickEditPhotoInfo () {
                if (this.el_event) {
                    this.el_event.target.width = this.photoConfigForm.width
                    this.el_event.target.height = this.photoConfigForm.height
                }
            },
            /** 监听鼠标选中 **/
            handleSelectText (event) {
                let selection = this.selection_upload = document.getSelection()
                let range = this.range_upload = selection.getRangeAt(0)
                if (range.endContainer.parentElement.nodeName == 'A' && range.endContainer.parentElement.attributes[0].nodeValue) {
                    this.link_url = range.endContainer.parentElement.attributes[0].nodeValue
                }
                if (!range.collapsed) {
                    this.selection = selection
                    this.range = range
                    this.is_show_icons = true
                    this.menu_list = this.menuIcons
                    this.$nextTick(() => {
                        this.$refs['editor_popover'].style.cssText = 'position: absolute; top: ' + (event.y - event.y / 3) + 'px; left: ' + event.x + 'px; z-index:100000000000000'
                        this.$refs.web_editor_sanner.focus()
                    })
                } else {
                    this.initializePage()
                }
            },
        },
        mounted() {
            this.editor = this.$refs.web_editor_sanner;
            this.editor.addEventListener('click', this.handleEditorClick);
        }
    }
</script>

<style lang="scss" scoped>
    .web-editor {
        padding: 20px; /*border: 1px solid #e5e5e6;*/ border-radius: 4px; box-sizing: border-box; position: relative;

        &-content { min-height: calc(100% - 40px); padding: 20px; text-align: left; border-radius: 6px; background-color: #ffffff; position: relative; }
        &-content &-scanner {
            height: 100%; outline: none;
            &:empty:before{ content: attr(data-content-before); color: #cccccc; }
            &:focus:before{ content: none; }
        }

        /*下拉设置*/
        &-down { width: 100%; transition: height 0.3s; background-color: #ffffff; border-radius: 0 0 20px 20px; position: absolute; left: 0; top: 0; overflow: hidden; z-index: 2; }
        &-down .editor-down-title { height: 40px; padding: 0 20px; align-items: center; justify-content: space-between; cursor: pointer; }
        &-down ul {  }
        &-icons .mark { width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.1); position: absolute; left: 0; top: 0; z-index: 1; }
        &-down ul { width: 100%; background-color: #ffffff; overflow-y: auto; }
        &-down .cell { display: flex; width: 100%; line-height: 30px; padding: 10px 16px; box-sizing: border-box; overflow: hidden; color: #323233; font-size: 14px; background-color: #fff; border-bottom: 1px solid #e5e5e5; cursor: pointer; position: relative; }
        &-down ul li.color { width: 50%; justify-content: center; }
        &-down .round { width: 40px; height: 40px; border-radius: 100%; border: 1px solid #e5e5e5; }

        /*表单设置*/
        .editor-form {
            .editor-form-item { margin-bottom: 20px; position: relative; }
            .editor-form-item label { width: 20%; text-align: right; vertical-align: middle; float: left; font-size: 14px; color: #606266; line-height: 40px; padding: 0 12px 0 0; box-sizing: border-box; }
            .editor-form-item input { width: 100%; height: 40px; line-height: 40px; padding: 0 15px; -webkit-appearance: none; background-color: #fff; background-image: none; border-radius: 4px; border: 1px solid #dcdfe6; box-sizing: border-box; color: #606266; display: inline-block; font-size: inherit; outline: none; transition: border-color .2s cubic-bezier(.645,.045,.355,1); }
            .editor-form-item span { line-height: 1; padding-top: 4px; color: #f56c6c; font-size: 12px; position: absolute; top: 100%; left: 17%; }
        }

        .editor-btns {
            display: flex; min-height: 40px; max-width: 440px; padding: 0 10px; align-items: center; /*justify-content: center;*/ border-radius: 4px; background-color: #ffffff; box-sizing: border-box; box-shadow: var(--deckgo-inline-editor-box-shadow, 0 0 8px 4px rgba(0, 0, 0, 0.1));
            em { padding: 5px 0; }
            input { height: 40px; line-height: 40px; padding: 0 15px; -webkit-appearance: none; background-color: #fff; background-image: none; border-radius: 4px; border: none; outline: none; box-sizing: border-box; color: #606266; display: inline-block; font-size: inherit; outline: none; transition: border-color .2s cubic-bezier(.645,.045,.355,1); }
            .editor-colors button { width: 28px; height: 28px; margin: 5px; border-radius: 100%; border: 1px solid #e5e5e5; }
        }

        /*右侧菜单设置*/
        .editor-right {
            .mark { width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); position: absolute; left: 0; top: 0; }
            .editor-menu { width: 0; width: 10%; height: 100%; background-color: #ffffff; transition: width 0.3s; position: absolute; top: 0; right: 0; z-index: 1; }
            .editor-menu-item { display: table; padding: 10px; margin: 10% auto; border: 1px solid #e5e5e5; border-radius: 100%; cursor: pointer; }
            .editor-menu-item em { display: block; font-size: 2em; }
        }
    }
</style>
