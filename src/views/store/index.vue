<template>
    <div class="store">
        <div class="home_container">
            <keep-alive include="StoreHome">
                <router-view></router-view>
            </keep-alive>
        </div>
        <!-- 下面底部导航 -->
        <div class="tabbar title" v-if="showTab">
            <van-tabbar v-model="active" route @change="tabChange">
                <!-- <van-tabbar-item icon="edit" to="/store/shelf">书架</van-tabbar-item> -->
                <van-tabbar-item icon="home-o" to="/store/home">书城</van-tabbar-item>
                <van-tabbar-item icon="setting-o" to="/store/user">我的</van-tabbar-item>
            </van-tabbar>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    name: 'WebappIndex',

    data () {
        return {
            showTab: true
        }
    },
    computed: {
        active: {
            get () {
                return this.$store.state.store.active
            },
            set (val) {
                this.$store.commit('SET_ACTIVE', val)
            }
        }

    },
    watch: {
        $route: function (to, form) {
            // 根据子路由的 meta 信息判断是否显示底部栏
            this.showTab = to.meta.showTab !== false
        }

    },
    mounted () {
        console.log(this.$store.state.store.active)
        this.showTab = this.$route.meta.showTab
    },

    methods: {
        ...mapActions([
            'setActive'
        ]),
        tabChange (active) {
            console.log(active)

            // this.setActive(active)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global.scss";

.store {
    width: 100%;
    height: 100%;
    background-color: #fff;

    .home_container {
        padding-bottom: 50px;
    }

    ::v-deep .van-tabbar {
        z-index: 999;
    }
}
</style>
