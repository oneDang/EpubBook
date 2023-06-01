import { mapGetters, mapActions } from 'vuex'
import { themeList, addCss, removeAllCss, getReadTimeByMinute } from './book'
import { getBookmark, saveLocation, getBookShelf, saveBookShelf } from './localStorage'
import { gotoBookDetail, appendAddToShelf, computeId, removeAddFromShelf } from './store'
import { shelf } from '../api/store'
// 阅读器
export const ebookMixin = {
  computed: {
    ...mapGetters([
      // 电子书文件名
      'fileName',
      //   是否显示菜单
      'menuVisible',
      // 设置菜单选项，字号，主题等等
      'settingVisible',
      // 默认字体大小
      'defaultFontSize',
      // 字体样式
      'defaultFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      // 电子书是否加载完毕
      'bookAvailable',
      // 进度
      'progress',
      // 章节 ,默认是 0
      'section',
      'isPaginating',
      'currentBook',
      'navigation',
      'cover',
      'metadata',
      'paginate',
      'pagelist',
      'offsetY',
      'isBookmark'
    ]),
    // 主题列表
    themeList () {
      return themeList(this)
    },
    // 获取章节名
    getSectionName () {
      // 可以获取二级目录
      return this.section ? this.navigation[this.section].label : ''
      // 只能获取一级目录
      // if (this.section) {
      //   // 获取当前章节信息
      //   const sectionInfo = this.currentBook.section(this.section)
      //   if (sectionInfo && sectionInfo.href) {
      //     // 获取当前的目录
      //     return this.currentBook.navigation?.get(sectionInfo.href).label
      //   }
      // }
    },
    getReadTimeText () {
      return this.$t('book.haveRead').replace('$1', getReadTimeByMinute(this.fileName))
    }
  },
  methods: {
    ...mapActions([
      'setFileName',
      'setMenuVisible',
      'setSettingVisible',
      'setDefaultFontSize',
      'setDefaultFontFamily',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setBookAvailable',
      'setProgress',
      'setSection',
      'setIsPaginating',
      'setCurrentBook',
      'setNavigation',
      'setCover',
      'setMetadata',
      'setPaginate',
      'setPagelist',
      'setOffsetY',
      'setIsBookmark'
    ]),
    initGlobalStyle () {
      removeAllCss()
      switch (this.defaultTheme) {
        case 'Default':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
        case 'Eye':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
          break
        case 'Gold':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
          break
        case 'Night':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
          break
        default:
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
      }
    },
    // 刷新当前位置，给当前位置的进度数值，章节index 等 赋值,并且保存当前进度到浏览器
    refreshLocation () {
      // 获取当前页的信息
      const currentLocation = this.currentBook.rendition.currentLocation()
      console.log(currentLocation, 'pre')
      if (currentLocation && currentLocation.start) {
        const startCfi = currentLocation.start.cfi
        // 获取进度百分比
        const progress = this.currentBook.locations.percentageFromCfi(startCfi)
        console.log(progress, 'old')
        // 把阅读进度存储到浏览器里
        this.setProgress(Math.floor(progress * 100))
        // 设置章节
        this.setSection(currentLocation.start.index)
        // 保存当前页
        saveLocation(this.fileName, startCfi)
        // 书签列表
        const bookmark = getBookmark(this.fileName)
        // 判断当前页是否在书签列表中
        if (bookmark) {
          if (bookmark.some(item => item.cfi === startCfi)) {
            this.setIsBookmark(true)
          } else {
            this.setIsBookmark(false)
          }
          // console.log(bookmark)
          // bookmark.has(startCfi) ? this.setIsBookmark(true) : this.setIsBookmark(false)
        } else {
          this.setIsBookmark(false)
        }
        if (this.pagelist) {
          const totalPage = this.pagelist.length
          const currentPage = currentLocation.start.location
          if (currentPage && currentPage > 0) {
            this.setPaginate(currentPage + ' / ' + totalPage)
          } else {
            this.setPaginate('')
          }
        } else {
          this.setPaginate('')
        }
      }
    },
    // 展示内容
    display (target, cb) {
      if (target) {
        // 根据章节信息显示当前章节的内容
        this.currentBook.rendition.display(target).then(() => {
          // 展示完成之后，进度条并没有渲染，需要获取当前定位刷新进度条
          this.refreshLocation()
          if (cb) cb()
        })
      } else {
        this.currentBook.rendition.display().then(() => {
          this.refreshLocation()
          if (cb) cb()
        })
      }
    },
    // 隐藏菜单，如果是点击上一页或者下一页时可以隐藏
    hideTitleAndMenu () {
      this.setSettingVisible(-1)
      this.setMenuVisible(false)
      this.setFontFamilyVisible(false)
    }
  }
}
// 书城首页
export const storeHomeMixin = {
  computed: {
    ...mapGetters([
      'offsetY',
      'hotSearchOffsetY',
      'flapCardVisible'
    ])
  },
  methods: {
    ...mapActions([
      'setOffsetY',
      'setHotSearchOffsetY',
      'setFlapCardVisible'
    ]),
    showBookDetail (book) {
      gotoBookDetail(this, book)
    }
  }
}
// 书架列表
export const storeShelfMixin = {
  computed: {
    ...mapGetters([
      'isEditMode',
      'shelfList',
      'shelfSelected',
      'shelfTitleVisible',
      'offsetY',
      'shelfCategory',
      'currentType'
    ])
  },
  methods: {
    ...mapActions([
      'setIsEditMode',
      'setShelfList',
      'setShelfSelected',
      'setShelfTitleVisible',
      'setOffsetY',
      'setShelfCategory',
      'setCurrentType'
    ]),
    showBookDetail (book) {
      gotoBookDetail(this, book)
    },
    getCategoryList (title) {
      this.getShelfList().then(() => {
        const categoryList = this.shelfList.filter(book => book.type === 2 && book.title === title)[0]
        this.setShelfCategory(categoryList)
      })
    },
    getShelfList () {
      let shelfList = getBookShelf()
      if (!shelfList) {
        shelf().then(response => {
          if (response.status === 200 && response.data && response.data.bookList) {
            shelfList = appendAddToShelf(response.data.bookList)
            saveBookShelf(shelfList)
            return this.setShelfList(shelfList)
          }
        })
      } else {
        return this.setShelfList(shelfList)
      }
    },
    moveOutOfGroup (f) {
      this.setShelfList(this.shelfList.map(book => {
        if (book.type === 2 && book.itemList) {
          book.itemList = book.itemList.filter(subBook => !subBook.selected)
        }
        return book
      })).then(() => {
        const list = computeId(appendAddToShelf([].concat(
          removeAddFromShelf(this.shelfList), ...this.shelfSelected)))
        this.setShelfList(list).then(() => {
          this.simpleToast(this.$t('shelf.moveBookOutSuccess'))
          if (f) f()
        })
      })
    }
  }
}
