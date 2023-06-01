<template>
    <div class="login">
        <van-nav-bar title="登录" v-if="IsLogin" />
        <van-nav-bar title="注册" v-else />
        <div>
            <!-- van-form整体表单组件
          @submit -> 自定义事件(提交事件)

          van-field 输入框(表单一项)
          1. 输入框name属性="用户名"
          表单整体提交时, 默认收集一个提交对象
          往后台发送的参数名就是name里值
          {"用户名": '页面值'}
          2. label属性输入框左侧文本
          3. rules属性配置检验规则
          :属性名="表达式"
          属性名="字符串"
         -->
            <van-form @submit="onSubmit">
                <!-- <van-field v-model="user.mobile" required name="mobile" label="手机号" placeholder="请输入11位手机号"
                    :rules="[{ required: true, message: '请填写正确手机号', pattern: /^1[3-9]\d{9}$/ }]" /> -->
                <van-field v-model="user.username" required name="username" label="账号"
                    :rules="[{ required: true, message: '请填写账号' }]" />
                <van-field v-model="user.password" required type="password" name="password" label="密码" placeholder="请输入6位密码"
                    :rules="[{ required: true, message: '请填写密码', pattern: /^\d{6}$/ }]" />
                <div style="margin: 16px">
                    <!-- round是否为圆形
                (1): 属性后面无值, 默认值为true
                block代表块级元素
                type代表类型(有默认颜色)
                native-type代表原生button的type属性
                代表这个van-button组件渲染的原生button标签type是submit提交整个表单功能的按钮
              -->
                    <van-button round block type="info" native-type="submit" :disabled="isLoading" :loading="isLoading"
                        loading-text="请等待ing...">{{ IsLogin ? '登录' : '注册' }}</van-button>

                </div>
            </van-form>
            <a class="title" @click="toRegist" v-if="IsLogin">没有账号？去注册一下</a>
        </div>
    </div>
</template>

<script>
// 写需求套路
// 1. html+css
// 2. 数据铺设, 数据绑定, 数据微调
// 3. js交互->事件/正则
// 4. 调用接口->后台交互

// 组件使用套路
// 找组件, 引组件, 用组件(标签和js复制), 读, 删, 改, 加

// 目标1: 实现顶部导航->自定义样式
// 目标2: 实现表单组件->读,改,加
// 目标3: 收集值以后, 调用接口->查看登录结果
// 目标4: 点击登录后给用户提示(正在登陆中~~~), 防止用户频繁的点击

import { loginAPI, registApi } from '@/api/store'
import { setToken } from '@/utils/token.js'
import Notify from '@/ui/Notify'

export default {
    data () {
        return {
            user: {
                username: 'zs', // 手机号
                password: '123456' // 密码
            },
            isLoading: false, // 登录按钮-加载状态
            IsLogin: true
        }
    },
    methods: {
        // 提交方法(form整体通过验证才会触发)
        async onSubmit (values) {
            // 可以直接用values(收集参数名和值)
            console.log('submit', values)
            console.log(this.user)

            // 状态设置true
            this.isLoading = true
            if (this.IsLogin) {
                const res = await loginAPI(this.user)
                console.log(res)
                if (res.data.status === 0) {
                    Notify({ type: 'success', message: '登录成功啦!!!' })
                    this.user.password = ''
                    setToken(res.data.token)
                    this.$router.push({ name: 'user' })
                } else {
                    Notify({ type: 'danger', message: '账号或密码错误' })
                }
            } else {
                const res = await registApi(this.user)
                console.log(res)
                if (res.data.status === 0) {
                    Notify({ type: 'success', message: '注册成功啦，请登录' })
                    this.IsLogin = true
                    this.user.password = ''
                } else {
                    Notify({ type: 'danger', message: res.data.message })
                }
            }

            // 跳转一定要写在最后->尽量最后执行
            // location.href -> 当前浏览器地址和要跳转的地址一样(不包含#后面锚点信息) -> 不会刷新网页
            // 地址改变, 就会导致网页刷新
            // this.$router.push() 压栈(会产生历史记录, 可以回退), this.$router.replace() 替换(不会产生历史记录)
            // this.$router.replace({
            //     path: this.$route.query.path || '/layout/home' // 因为我们路由规则里/layout里没有重定向, 所以直接在这里写全
            // })

            this.isLoading = false // 网络请求完成无论成功/报错, 把状态关掉
        },
        toRegist () {
            this.IsLogin = false
        }
        // 注册
        // Registfn () {
        //     // 状态设置true
        //     this.isLoading = true
        // }
    }
}
</script>

<style scoped lang="scss">
@import "@/assets/styles/global.scss";
/* 此类名是van-nav-bar组件内根标签 */
// .van-nav-bar {
//   background-color: #007bff;
// }

/* 此选择器名字是van-nav-bar组件内标签
  scoped尝试把此选择器后属性选择器匹配当前页面标签 (选不中组件内部的) */
// lang="less" 当前style标签内是less语法
// 用/deep/就不会被vscode标记红线
// /deep/ 会把属性选择器加到前面 (用后代选择器的方式往里找匹配的类名)
// 结论: 要修改组件内样式, 如果你用了scoped, 就需要在选择器前/deep/即可
// /deep/ .van-nav-bar__title {
//   color: white;
// }
.login {
    width: 100%;
    height: 100%;
    background-color: #fff;

    // background-color: #38d39f;
    // #38d39f
    .van-nav-bar {
        background-color: #007bff;
        // color: #fff;
    }

    /deep/ .van-nav-bar__title {
        color: white;
    }
}
</style>
