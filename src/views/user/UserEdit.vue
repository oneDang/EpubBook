<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()" fixed />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image round class="avatar" :src="profileObj.user_pic" @click="imageClickFn" />
          <!-- file 选择框 -->
          <!-- 视觉上隐藏, 标签还在DOM树上, 还可以触发功能 -->
          <input type="file" ref="iptFile" v-show="false" accept="image/*" @change="onFileChange" />
        </template>
      </van-cell>
      <van-cell title="名称" is-link :value="profileObj.nickname" @click="nameClickFn" />
      <van-cell title="邮箱" is-link :value="profileObj.email" @click="EmailShow = true" />
      <!-- <van-cell title="生日" is-link :value="profileObj.birthday" @click="birthdayClickFn" /> -->
    </van-cell-group>

    <!-- 姓名修改弹窗 -->
    <van-dialog v-model="show" title="昵称修改" show-cancel-button :before-close="beforeCloseFn">
      <input type="text" v-fofo v-model="profileObj.nickname" placeholder="请输入昵称" class="input-name" />
    </van-dialog>
    <!-- 邮箱修改弹窗 -->
    <van-dialog v-model="EmailShow" title="请输入邮箱" show-cancel-button :before-close="beforeCloseFn">
      <input type="text" v-fofo v-model="profileObj.email" />
    </van-dialog>

    <!-- 时间选择器 -->
    <!-- 组件可以自己搭配使用 -->
    <!-- <van-popup round v-model="dateTimePickerShow" position="bottom" :style="{ height: '50%' }">
      <van-datetime-picker v-model="currentDate" type="date" title="选择年月日" :min-date="minDate" :max-date="maxDate"
        @cancel="dateCancelFn" @confirm="confirmFn" />
    </van-popup> -->
  </div>
</template>

<script>
import {
  getUserInfoAPI,
  updateUserPhotoAPI,
  updateUserProfileAPI
} from '@/api/store'
import Notify from '@/ui/Notify'
import { mapMutations } from 'vuex'
// import dayjs from 'dayjs'
export default {
  name: 'UserEdit',
  data () {
    return {
      profileObj: {
        user_pic: '',
        nickname: '',
        email: ''
      }, // 用户基本资料
      show: false, // 控制姓名修改输入框出现/隐藏
      // inputUserName: '', // 修改名字-弹出框输入框绑定值
      // inputEmail: '',
      minDate: new Date(1920, 0, 1), // 最小范围
      maxDate: new Date(), // 最大范围 (默认获取系统日期-今日)
      currentDate: new Date(), // 当前时间
      dateTimePickerShow: false, // 日期选择器-弹出层显示/隐藏
      EmailShow: false
    }
  },
  async created () {
    const res = await getUserInfoAPI()
    console.log(res)
    this.profileObj = res.data.data
    if (!this.profileObj.user_pic) {
      this.profileObj.user_pic = this.$store.state.store.userPhoto
    }
  },
  methods: {
    ...mapMutations(['SET_USERPHOTO']),
    // 文件选择改变 - 事件
    // 先选一个从无到有(input[type=file])那个标签本身
    // 再次打开不选直接取消, 从有到无触发change事件
    onFileChange (e) {
      if (e.target.files.length === 0) return Notify({ type: 'warning', message: '请选择照片' }) // 用户可能没有选择图片文件阻止代码往下
      console.log(e.target.files[0]) // (用户选中文件对象) 数组其实是一个特殊的对象
      const file = e.target.files[0]
      // 将file文件转换成URL路径
      const imgURL = URL.createObjectURL(file)
      this.profileObj.user_pic = imgURL
      this.fileToBase64(file).then(async res => {
        // console.log(res)
        const result = await updateUserPhotoAPI({ avatar: res })
        console.log(result)
        if (result.data.status === 0) {
          Notify({ type: 'success', message: result.data.message })
        }
      })

      // 创建FormData对象
      // const theFd = new FormData()
      // theFd.append('photo', e.target.files[0]) // 请求体里加入一对参数名和值

      // const res = await updateUserPhotoAPI()
      // console.log(res)
      // this.profileObj.user_pic = res.data.data.user_pic
      // this.SET_USERPHOTO(res.data.data.photo) // 更新成功后, 同步到vuex中
    },
    // 图片 - 点击事件
    imageClickFn () {
      this.$refs.iptFile.click() // JS模拟标签的事件触发, 为了让input[file]文件选择窗口出现
    },
    // file转换成Base64格式
    fileToBase64 (file) {
      return new Promise((resolve, reject) => {
        // 创建一个新的 FileReader 对象
        const reader = new FileReader()
        // 读取 File 对象
        reader.readAsDataURL(file)
        // 加载完成后
        reader.onload = function () {
          // console.log(reader.result)
          // 将读取的数据转换为 base64 编码的字符串
          const base64String = reader.result
          // 解析为 Promise 对象，并返回 base64 编码的字符串
          resolve(base64String)
        }

        // 加载失败时
        reader.onerror = function () {
          reject(new Error('Failed to load file'))
        }
      })
    },

    // 姓名 - 点击事件
    nameClickFn () {
      this.show = true
      // this.inputUserName = this.profileObj.name
      // this.inputEmail = this.profileObj.name
    },
    // 姓名 - 确认框 - 关闭前回调函数
    async beforeCloseFn (action, done) {
      if (action === 'confirm') {
        // 点确定
        // 计算机中, 对字符(文字)有多种编码方式
        // 计算机眼中只有0和1, -> 编码成 一种表现形式
        // utf-8 编码成 我们认识的 中文字符
        // url 编码 %E4%BB%8A%E6%99%9A
        // unicode 编码 \u4eca\u665a
        // \u4e00   ->   一
        // \u9fa5   ->   龥 yu(4声)
        const reg = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,7}$/
        if (reg.test(this.profileObj.nickname) === true) {
          // 通过了校验
          const { data: res } = await updateUserProfileAPI({
            nickname: this.profileObj.nickname,
            email: this.profileObj.email,
            id: this.profileObj.id
          })
          console.log(res)
          if (res.status === 0) {
            Notify({ type: 'success', message: res.message })
            done()
          } else {
            // 没通过校验, 给用户提示
            Notify({ type: 'warning', message: res.message })
            done(false)
          }
          // this.profileObj.name = this.inputUserName // 更新成功 - 回显到页面上
        } else {
          // 没通过校验, 给用户提示
          Notify({ type: 'warning', message: '用户名只能是1-7位中英数字组合' })
          done(false)
        }
      } else {
        // 点取消
        done() // 让弹窗关闭
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.user-edit-container {
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding-top: 46px;

  .avatar {
    width: 50px;
    height: 50px;
  }
}

::v-deep .van-dialog__content {
  text-align: center;

  input {
    padding: 10px;
    outline: none;
    border: none;
    text-align: center;
  }
}

.van-nav-bar {
  background-color: #007bff;

  ::v-deep .van-nav-bar__title {
    color: #fff;
  }

  ::v-deep .van-icon {
    color: #fff;
  }

}

::v-deep .van-nav-bar__left .van-nav-bar .van-icon {
  color: #fff;
}
</style>
