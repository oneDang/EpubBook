import axios from 'axios'
import { setLocalForage } from '../utils/localForage'
import { getToken } from '@/utils/token'

export function flatList () {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/api/book/flat-list`
  })
}

export function shelf () {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/api/book/shelf`
  })
}

export function home () {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/api/book/home`
  })
}

export function detail (book) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/api/book/detail`,
    params: {
      fileName: book.fileName
    }
  })
}

export function list () {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/api/book/list`
  })
}

export function download (book, onSucess, onError, onProgress) {
  if (onProgress == null) {
    onProgress = onError
    onError = null
  }
  return axios.create({
    baseURL: process.env.VUE_APP_EPUB_URL,
    method: 'get',
    responseType: 'blob',
    timeout: 180 * 1000,
    // axios查看进度的
    onDownloadProgress: progressEvent => {
      if (onProgress) onProgress(progressEvent)
    }
  }).get(`${book.categoryText}/${book.fileName}.epub`)
    .then(res => {
      const blob = new Blob([res.data])
      setLocalForage(book.fileName, blob,
        () => onSucess(book),
        err => onError(err))
    }).catch(err => {
      if (onError) onError(err)
    })
}
// 登录
export function loginAPI (data) {
  return axios({
    method: 'post',
    url: `${process.env.VUE_APP_BOOK_URL}/api/login`,
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
// 注册
export function registApi (data) {
  return axios({
    method: 'post',
    url: `${process.env.VUE_APP_BOOK_URL}/api/reguser`,
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
// 我的
export function getUserInfoAPI () {
  const token = getToken()
  console.log(token)
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/my/userinfo`,
    headers: {
      Authorization: token
    }
  })
}
// 用户 - 更新头像
// export const updateUserPhotoAPI = (fd) => axios({
//   // url: '/v1_0/user/photo',
//   method: 'PATCH',
//   data: fd // fd外面一会儿传进来的new FormData() 表单对象

//   // 如果你的请求体直接是FormData表单对象, 你也不用自己添加
//   // Content-Type, axios发现数据请求体是表单对象, 它也不会转换成json字符串
//   // 也不会带Content-Type: application/json, 而是交给浏览器, 浏览器发现请求体是formData会自己携带Content-Type

//   // Content-Type: application/json; axios携带的, 前提: data请求体是对象 -> json字符串 -> 发给后台
//   // Content-Type: multipart/form-data; 浏览器携带的, 前提: data请求体必须FormData类型对象
// })
// 用户 - 更新基本资料
export const updateUserProfileAPI = (dataObj) => {
  // 判断, 有值才带参数名给后台, 无值参数名不携带
  // 写法1: 解构赋值, 4个判断, 往空对象上添加有值的加上去(以前做过)
  // 写法2: 外面想传几对象key+value, 就直接传入交给后台
  // 写法3: 上面写法不够语义化, 我看不出obj里有什么
  const token = getToken()
  console.log(token)
  return axios({
    url: `${process.env.VUE_APP_BOOK_URL}/my/userinfo`,
    method: 'post',
    data: dataObj,
    headers: {
      Authorization: token,
      'Content-Type': 'application/x-www-form-urlencoded'
    }

  })
}
// 用户 - 更新头像
export const updateUserPhotoAPI = (data) => {
  const token = getToken()
  console.log(token)
  return axios({
    url: `${process.env.VUE_APP_BOOK_URL}/my/update/avatar`,
    method: 'post',
    data,
    headers: {
      Authorization: token,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
