import WebEditor from "./components/editor/WebEditor";
// import _Vue from 'vue'

//  声明install函数被执行 Vue.use()
WebEditor.install = Vue => Vue.component(WebEditor.name, WebEditor)

export default WebEditor
