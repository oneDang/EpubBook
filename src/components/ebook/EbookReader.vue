<template>
  <!-- 入口文件 -->
  <div class="ebook-reader">
    <div id="reader"></div>
    <!-- 蒙层touchmove是移动端触摸，mousedown是pc端 .left意味着是鼠标左键-->
    <div class="ebook-reader-mask" @click="onMaskClick" @touchmove="move" @touchend="moveEnd"
      @mousedown.left="onMouseEnter" @mousemove.left="onMouseMove" @mouseup.left="onMouseEnd">
    </div>
  </div>
</template>

<script>
import Epub from 'epubjs'
import { ebookMixin } from '@/utils/mixin'
import { getFontFamily, saveFontFamily, getFontSize, saveFontSize, getTheme, saveTheme, getLocation } from '@/utils/localStorage'
import { flatten } from '@/utils/book'
global.epub = Epub
export default {
  name: 'VueWebappEbookReader',
  mixins: [ebookMixin],
  data () {
    return {

    }
  },
  computed: {

  },
  methods: {
    // 1 - 鼠标进入
    // 2 - 鼠标进入后的移动
    // 3 - 鼠标从移动状态松手
    // 4 - 鼠标还原
    // 鼠标移动触发onMouseMove，点击触发onMouseEnter、onMouseMove、onMouseEnd
    onMouseEnter (e) {
      // console.log('enter')
      this.mouseState = 1
      // 用于解决鼠标点击之后，轻微移动造成判断错误
      this.mouseStartTime = e.timeStamp
      e.preventDefault()
      e.stopPropagation()
    },
    onMouseMove (e) {
      // console.log('move')
      if (this.mouseState === 1) {
        this.mouseState = 2
      } else if (this.mouseState === 2) {
        let offsetY = 0
        if (this.firstOffsetY) {
          offsetY = e.clientY - this.firstOffsetY
          this.setOffsetY(offsetY)
        } else {
          this.firstOffsetY = e.clientY
        }
      }
      e.preventDefault()
      e.stopPropagation()
    },

    onMouseEnd (e) {
      if (this.mouseState === 2) {
        this.setOffsetY(0)
        this.firstOffsetY = null
        this.mouseState = 3
      } else {
        this.mouseState = 4
      }
      const time = e.timeStamp - this.mouseStartTime
      if (time < 100) {
        this.mouseState = 4
      }
      e.preventDefault()
      e.stopPropagation()
    },
    // 鼠标触摸移动
    move (e) {
      let offsetY = 0
      if (this.firstOffsetY) {
        offsetY = e.changedTouches[0].clientY - this.firstOffsetY
        this.setOffsetY(offsetY)
      } else {
        this.firstOffsetY = e.changedTouches[0].clientY
      }
      e.preventDefault()// 防止微信端，下拉出现由...网页提供的字样
      e.stopPropagation()
    },
    // 触摸结束的时候调用
    moveEnd (e) {
      this.setOffsetY(0)
      this.firstOffsetY = null
    },
    // 点击
    onMaskClick (e) {
      const offsetX = e.offsetX
      const width = window.innerWidth
      if (offsetX > 0 && offsetX < width * 0.3) {
        this.prevPage()
      } else if (offsetX > 0 && offsetX > width * 0.7) {
        this.nextPage()
      } else {
        this.toggleTitleMenu()
      }
    },
    // 显示菜单
    toggleTitleMenu () {
      if (this.menuVisible) {
        // 设置菜单不显示项目
        this.setSettingVisible(-1)
        // 设置字体样式弹框隐藏
        this.setFontFamilyVisible(false)
      }
      // 设置菜单隐藏
      this.setMenuVisible(!this.menuVisible)
    },
    // 上一页
    prevPage () {
      this.rendition?.prev().then(() => {
        this.refreshLocation()
      })
      this.hideTitleAndMenu()
    },
    // 下一页
    nextPage () {
      this.rendition?.next().then(() => {
        this.refreshLocation()
      })
      this.hideTitleAndMenu()
    },
    // 初始化字体样式
    initFontFamily () {
      const font = getFontFamily(this.fileName)
      // 如果浏览器存在字体样式
      if (!font) {
        saveFontFamily(this.fileName, this.defaultFontFamily)
        // 如果不存在字体样式
      } else {
        this.rendition.themes.font(font)
        this.setDefaultFontFamily(font)
      }
    },

    // 初始化字体大小
    initFontSize () {
      const fontSize = getFontSize(this.fileName)
      // 如果浏览器存在字体样式
      if (!fontSize) {
        saveFontSize(this.fileName, this.defaultFontSize)
        // 如果不存在字体样式
      } else {
        this.rendition.themes.fontSize(fontSize)
        this.setDefaultFontSize(fontSize)
      }
    },
    // 初始化主题
    initThemes () {
      // 获取主题名称
      let defaultTheme = getTheme(this.fileName)
      if (!defaultTheme) {
        defaultTheme = this.themeList[0].name
        // 保存主题
        saveTheme(this.fileName, defaultTheme)
      }
      // 给vuex赋值
      this.setDefaultTheme(defaultTheme)
      // 注册主题
      this.themeList.forEach(theme => {
        this.rendition.themes.register(theme.name, theme.style)
      })
      // 设置主题
      this.rendition.themes.select(defaultTheme)
    },
    // 初始化rendition
    initRendition () {
      // 通过Book.renderTo生成Rendition对象,并进行渲染，Rendition对象是epub中展示书本的对象
      this.rendition = this.book.renderTo('reader', {
        width: window.innerWidth,
        height: window.innerHeight,
        method: 'default' // 兼容微信浏览器
        // flow:'scrolled' 滚动条
      })
      console.log('window.innerWidth', window.innerWidth)
      // 渲染出来 this.display是mixin里面的方法,getLocation从内存中取出这个定位
      const locations = getLocation(this.fileName)
      console.log(locations)
      this.display(locations, () => {
        this.initFontFamily()
        this.initFontSize()
        this.initThemes()
        // 初始化样式
        this.initGlobalStyle()
      })
      // 因为电子书是iframe标签，所以采用此方法引入字体样式
      this.rendition.hooks.content.register(contents => {
        Promise.all([
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
        ]).then(() => {
        })
      })
    },
    // 解析电子书
    parseBook () {
      // 表示封面加载阶段
      this.book.loaded.cover.then(cover => {
        // cover为相对路径
        // url获取图片链接
        this.book.archive.createUrl(cover).then(url => {
          this.setCover(url)
        })
      })
      // 书籍的基本信息
      this.book.loaded.metadata.then(metadata => {
        this.setMetadata(metadata)
      })
      // 获取图书的目录
      this.book.loaded.navigation.then(nav => {
        const navItem = flatten(nav.toc)
        // 给每级目录加上一个level属性，以此来确定属性
        function find (item, level = 0) {
          return !item.parent ? level : find(navItem.filter(parentItem => parentItem.id === item.parent)[0], ++level)
        }

        navItem.forEach(item => {
          item.level = find(item)
        })
        this.setNavigation(navItem)
      })
    },
    // 初始化电子书
    initEpub () {
      // nginx服务器的地址
      //   http://localhost:8080/#/ebook/History|2017_Book_ExecutingMagicInTheModernEra
      const baseUrl = 'http://localhost:8088/epub/'
      const url = baseUrl + this.fileName + '.epub'
      console.log(this.fileName, url)
      //   实例化电子书
      this.book = new Epub(url)
      this.setCurrentBook(this.book)
      this.initRendition()
      this.parseBook()
      // Book对象的钩子函数ready，book对象解析完成之后调用
      this.book.ready.then(() => {
        // 页数，简单的分页算法
        return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16))
      }).then(() => {
        this.setBookAvailable(true)
        this.refreshLocation()
      })
      // // 监听触摸开始事件
      // this.rendition.on('touchstart', (event) => {
      //   this.touchStartX = event.changedTouches[0].clientX
      //   this.touchStartTime = event.timeStamp
      // })
      // // 监听触摸结束事件
      // this.rendition.on('touchend', (event) => {
      //   // changedTouches代表触摸的手指的数量，如果是一只手指就有一个数据
      //   const offsetX = event.changedTouches[0].clientX - this.touchStartX
      //   // timeStamp代表触摸的时间
      //   const time = event.timeStamp - this.touchStartTime
      //   console.log(offsetX, time)
      //   // 如果时间和滑动幅度符合条件的话
      //   if (time < 500 && offsetX > 40) {
      //     // 上一页
      //     this.prevPage()
      //   } else if (time < 500 && offsetX < -40) {
      //     // 下一页
      //     this.nextPage()
      //   } else {
      //     // 显示菜单
      //     this.toggleTitleMenu()
      //   }
      //   // event.preventDefault()
      //   event.stopPropagation()
      // })
    }
  },
  mounted () {
    console.log(this.$route.params)
    const fileName = this.$route.params.fileName.split('|').join('/')
    this.setFileName(fileName).then(() => {
      this.initEpub()
    })
    window.onresize = () => {
      if (this.currentBook) {
        this.currentBook.rendition.resize(window.innerWidth, window.innerHeight)
      }
    }
  }

}
</script>

<style lang="scss"  scoped>
@import "../../assets/styles/global.scss";

.ebook-reader {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .ebook-reader-mask {
    position: absolute;
    top: 0;
    left: 0;
    background: transparent;
    z-index: 150;
    width: 100%;
    height: 100%;
  }
}
</style>
