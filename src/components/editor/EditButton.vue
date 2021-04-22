<template>
    <div class="web-editor-icons s_flex">
        <div class="iconfont flex_1" v-for="(item, index) in menu_icons" :key="index" :class="item.class_name" @click="execCommand('bold', '<ul>')"></div>
    </div>
</template>

<script>
    export default {
        // name: "EditButton",
        props: ['menu_icons'],
        data() {
            return {}
        },
        methods: {
            execCommand (commandName, valueArgument) {
                console.log(123)
                if (!valueArgument) {
                    valueArgument = null
                }
                document.execCommand(commandName, false, valueArgument)
            }
        },
        mounted() {
        }
    }
</script>

<style scoped>

</style>
