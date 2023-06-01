<template>
    <div class="login">
        <img src="@/img/wave.png" class="wave">
        <div class="container">
            <div class="img">
                <img src="@/img/bg.svg" alt="">
            </div>
            <div class="login-content">
                <form action="index.html">
                    <img src="@/img/avatar.svg" alt="">
                    <h2 class="title">{{ IsLogin ? '欢迎' : '注册' }}</h2>
                    <van-form @submit="onSubmit">
                        <div class="input-div one">
                            <div class="i">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="div">
                                <h5>用户名</h5>
                                <input type="text" class="input" v-model="user.username" />
                                <!-- <van-field v-model="user.username" required name="username"
                                    :rules="[{ required: true, message: '请填写账号' }]" /> -->
                            </div>
                        </div>
                        <div class="input-div pass">
                            <div class="i">
                                <i class="fas fa-lock"></i>
                            </div>
                            <div class="div">
                                <h5>密码</h5>
                                <input type="password" class="input" v-model="user.password">
                                <!-- <van-field v-model="user.password" required type="password" name="password"
                                    placeholder="请输入6位密码"
                                    :rules="[{ required: true, message: '请填写密码', pattern: /^\d{6}$/ }]" /> -->
                            </div>
                        </div>

                        <a href="#" @click="toRegist" v-if="IsLogin">没有账号？去注册一下</a>
                        <a href="#" @click="toRegist" v-else>返回登录</a>
                        <!-- <input type="submit" class="btn" value="登录"> -->
                        <van-button class="btn" round block type="info" native-type="submit" :disabled="isLoading"
                            :loading="isLoading" loading-text="请等待ing...">{{ IsLogin ? '登录' : '注册' }}</van-button>
                    </van-form>

                </form>
            </div>
        </div>
    </div>
</template>

<script>
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
                username: '', // 手机号
                password: '' // 密码
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
            if (this.IsLogin) { // 登录
                const res = await loginAPI(this.user)
                console.log(res)
                if (res.data.status === 0) {
                    Notify({ type: 'success', message: '登录成功啦!!!' })
                    this.user.password = ''
                    setToken(res.data.token)
                    this.$router.push({ name: 'user' })
                } else {
                    Notify({ type: 'danger', message: res.data.message })
                }
            } else { // 注册
                const res = await registApi(this.user)
                console.log(res)
                if (res.data.status === 0) {
                    Notify({ type: 'success', message: '注册成功啦，去登录吧' })
                    this.IsLogin = true
                    this.user.password = ''
                } else {
                    if (res.data.status === 1) {
                        Notify({ type: 'danger', message: '账号或密码格式错误' })
                    } else {
                        Notify({ type: 'danger', message: res.data.message })
                    }
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
            this.IsLogin = !this.IsLogin
        }
        // 注册
        // Registfn () {
        //     // 状态设置true
        //     this.isLoading = true
        // }
    },
    mounted () {
        // const script = document.createElement('script')
        // script.type = 'text/javascript'
        // script.src = 'https://kit.fontawesome.com/64d58efce2.js'
        // document.body.appendChild(script)

        const inputs = document.querySelectorAll('.input')

        function addcl () {
            const parent = this.parentNode.parentNode
            parent.classList.add('focus')
        }

        function remcl () {
            const parent = this.parentNode.parentNode
            if (this.value === '') {
                parent.classList.remove('focus')
            }
        }
        inputs.forEach(input => {
            input.addEventListener('focus', addcl)
            input.addEventListener('blur', remcl)
        })
        document.documentElement.style.fontSize = 16 + 'px'
        function resize () {
            document.documentElement.style.fontSize = 16 + 'px'
            // console.log(html.style.fontSize)
        }
        window.addEventListener('resize', resize)
    },
    // 生命周期销毁
    beforeDestroy () {
        resize()
        function resize () {
            const html = document.querySelector('html')
            const fontSize = window.innerWidth / 10 > 50 ? 50 : window.innerWidth / 10
            html.style.fontSize = fontSize + 'px'
            console.log(html.style.fontSize)
        }
        window.addEventListener('resize', resize)
    }
}
</script>

<style scoped lang="scss">
/* @import url("https://fonts.googleapis.com/css?family=Poppins:600&display=swap"); */

/* 初始化 */
* {
    padding: 0;
    margin: 0;
    /* 标准盒子 */
    box-sizing: border-box;
    // background-color: #fff;
}

.login {
    width: 100%;
    height: 100%;
    background-color: #fff;
}

body {
    /* 引入字体 */
    font-family: "Poppins", sans-serif;
    /* 溢出隐藏 */
    overflow: hidden;
}

.wave {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 100%;
    /* 让他当作一个背景 */
    z-index: -1;
}

.container {
    width: 100vw;
    height: 100vh;
    /* 网格布局 */
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 7rem;
    padding: 0 2rem;
}

.img {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.login-content {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    /* 文字居中 */
    text-align: center;
}

.img img {
    width: 500px;
}

form {
    width: 360px;
}

.login-content img {
    height: 100px;
}

.login-content h2 {
    margin: 15px 0;
    color: #333;
    text-transform: uppercase;
    font-size: 2.9rem;
}

.login-content .input-div {
    /* 相对定位 */
    position: relative;
    display: grid;
    grid-template-columns: 7% 93%;
    margin: 25px 0;
    padding: 5px 0;
    border-bottom: 2px solid #d9d9d9;
}

.login-content .input-div.one {
    margin-top: 0;
}

.i {
    color: #d9d9d9;
    /* 弹性布局 水平 垂直居中 */
    display: flex;
    justify-content: center;
    align-items: center;
}

.i i {
    transition: .3s;
}

.input-div>div {
    /* 相对定位 */
    position: relative;
    height: 45px;
}

.input-div>div>h5 {
    /* 绝对定位 */
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
    font-size: 18px;
    transition: .3s;
}

.input-div::before,
.input-div::after {
    content: "";
    /* 绝对定位 */
    position: absolute;
    bottom: -2px;
    width: 0%;
    height: 2px;
    background-color: #007bff;
    transition: .4s;
}

.input-div::before {
    right: 50%;
}

.input-div::after {
    left: 50%;
}

.input-div.focus::before,
.input-div.focus::after {
    width: 50%;
}

.input-div.focus>div>h5 {
    top: -5px;
    font-size: 15px;
}

.input-div.focus>.i>i {
    color: #007bff;
}

.input-div>div>input {
    /* 绝对定位 */
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border: none;
    /* 点击输入框的边框也消失 */
    outline: none;
    padding: 0.5rem 0.7rem;
    background: none;
    font-size: 1.2rem;
    color: #555;
    font-family: 'position', sans-serif;
}

.input-div.pass {
    margin-bottom: 4px;
}

a {
    display: block;
    text-align: right;
    /* 下划线消失 */
    text-decoration: none;
    color: #999;
    font-size: 0.9rem;
    transition: .3s;
}

a:hover {
    color: #007bff;
}

.btn {
    display: block;
    width: 100%;
    height: 50px;
    border-radius: 25px;
    outline: none;
    border: none;
    background-image: linear-gradient(to right, #0f59d8, #2b6db4, #007bff);
    background-size: 200%;
    font-size: 1.2rem;
    color: #fff;
    font-family: 'Poppins', sans-serif;
    text-transform: uppercase;
    margin: 1rem 0;
    /* 鼠标放上变小手 */
    cursor: pointer;
    transition: .5s;
}

.btn:hover {
    background-position: right;
}

@media screen and (max-width: 1050px) {
    .container {
        grid-gap: 5rem;
    }
}

@media screen and (max-width: 1000px) {
    form {
        width: 290px;
    }

    .login-content h2 {
        font-size: 2.4rem;
        margin: 8px 0;
    }

    .img img {
        width: 400px;
    }
}

@media screen and (max-width: 900px) {
    .container {
        grid-template-columns: 1fr;
    }

    .img {
        display: none;
    }

    .wave {
        display: none;
    }

    .login-content {
        justify-content: center;
    }
}
</style>
