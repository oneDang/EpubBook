<template>
    <div class="user-container">
        <!-- 用户基本信息面板 -->
        <div class="user-card">
            <!-- 用户头像、姓名 -->
            <van-cell v-if="userObj != null">
                <!-- 使用 title 插槽来自定义标题 -->
                <template #icon>
                    <img :src="userObj.user_pic" alt="" class="avatar">
                </template>
                <template #title>
                    <span class="username">{{ userObj.nickname }}</span>
                </template>
                <template #label>
                    <van-tag color="#fff" text-color="#007bff">您还没有设置个性签名哦~</van-tag>
                    <!-- <span>您还没有设置个性签名哦~</span> -->
                </template>
            </van-cell>
            <!-- 动态、关注、粉丝 -->
            <!-- <div class="user-data">
                <div class="user-data-item">
                    <van-icon name="like" />
                    <span>我的书架</span>
                </div>
                <div class="user-data-item">
                    <span>{{ userObj.follow_count }}</span>
                    <span>关注</span>
                </div>
                <div class="user-data-item">
                    <span>{{ userObj.fans_count }}</span>
                    <span>粉丝</span>
                </div>
            </div> -->
        </div>

        <!-- 操作面板 -->
        <van-cell-group class="action-card">
            <van-cell icon="edit" title="编辑资料" is-link to="/user_edit" />
            <van-cell icon="like" title="我的书架" is-link to="/store/shelf" />
            <van-cell icon="chat-o" title="上传喜爱书籍" is-link @click="UpBook" />
            <van-cell icon="warning-o" title="退出登录" is-link @click="quitFn" />
        </van-cell-group>
        <div style="display: none">
            <input type="file" id="file" @change="fileChange($event, 1)">
        </div>
    </div>
</template>

<script>
// import {  mapMutations } from 'vuex'
import { Dialog } from 'vant'
import { getUserInfoAPI } from '@/api/store'
import { removeToken } from '@/utils/token'
import bookDb from '../../utils/bookDb2'
import { getCoverURL } from '../../utils/bookUtil'
import Epub from 'epubjs'
export default {
    name: 'VueWebappUser',

    data () {
        return {
            userObj: null, // 用户对象
            book: null,
            meta: null
        }
    },
    computed: {
        // ...mapGetters([
        //     'userPhoto'
        // ])
    },
    async mounted () {
        const res = await getUserInfoAPI()
        const photo = 'https://img1.baidu.com/it/u=852527378,739232243&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
        this.userObj = res.data.data
        // this.$store.commit('SET_USERPHOTO', this.userObj.photo)
        if (!this.userObj.user_pic) {
            this.userObj.user_pic = photo
            // this.SET_USERPHOTO(photo)
        }
    },
    methods: {
        // ...mapMutations(['SET_USERPHOTO']),
        // 退出方法
        quitFn () {
            Dialog.confirm({
                title: '是否退出登录',
                message: '这就走了?确定退出吗？'
            }).then(() => { // 用户点击"确认"选项 -> 内部resolve触发then
                // 业务(思路/方向)
                removeToken()
                this.$router.replace('/login')
                // on confirm
            }).catch(() => { // 用户点击"取消"选项 -> 内部reject触发catch
                // on cancel
            })
        },
        // 上传书籍
        UpBook () {
            document.getElementById('file').click()
        },
        fileChange (e) {
            const files = e.target.files
            if (!files.length) {
                return
            }
            const file = e.target.files[0]
            console.log(file.name)
            const reader = new FileReader()
            reader.readAsArrayBuffer(file)
            reader.onload = e => {
                const content = e.target.result
                console.log(content)
                this.book = new Epub(content)
                // console.log(this.book.loaded.metadata)
                this.book.ready.then(() => {
                    this.book.loaded.metadata.then(meta => {
                        this.meta = meta
                        console.log('getMetadata')
                        console.log(meta)
                        getCoverURL(this.book, cover => {
                            console.log('首页封面')
                            console.log(cover)
                            bookDb.init(() => {
                                bookDb.addBook({
                                    id: '' + new Date().getTime(),
                                    name: meta.bookTitle,
                                    author: meta.creator,
                                    content: content,
                                    cover: cover
                                }, () => {
                                    bookDb.getBooks(data => {
                                        console.log('获取所有书籍')
                                        this.books = data
                                        console.log(data)
                                    })
                                })
                            })
                        })
                    })
                })
            }
        }
    }
}
// 主动退出 -> 用户点击退出, 清空token, 强制replace切换登录页
// 被动退出 -> 把token值传后台, 后台返回401 -> 响应拦截器发现401状态证明你身份过期 -> 强制进登录页
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global.scss";

.user-container {
    font-size: px2rem(14);

    .user-card {
        background-color: #007bff;
        color: white;
        padding-top: 20px;

        .van-cell {
            background: #007bff;
            color: white;
            padding: px2rem(10) px2rem(16);

            &::after {
                display: none;
            }

            .avatar {
                width: 60px;
                height: 60px;
                background-color: #fff;
                border-radius: 50%;
                margin-right: 10px;
            }

            .username {
                font-size: 14px;
                font-weight: bold;
            }
        }
    }

    .user-data {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        font-size: 14px;
        padding: 30px 0;

        .user-data-item {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 33.33%;
        }
    }
}
</style>
