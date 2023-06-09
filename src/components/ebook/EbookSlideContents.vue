<template>
  <!-- 目录内容 -->
  <div class="ebook-slide-contents">
    <!-- 上方搜索框 -->
    <div class="slide-contents-search-wrapper">
      <div class="slide-contents-search-input-wrapper">
        <div class="slide-contents-search-icon">
          <span class="icon-search"></span>
        </div>
        <!-- .exact放在shift和回车一起按也触发的现象 -->
        <input class="slide-contents-search-input" type="text" v-model="searchText" :placeholder="$t('book.searchHint')"
          @keyup.enter.exact="search()" @click="showSearchPage">
      </div>
      <!-- 取消按钮 -->
      <div class="slide-contents-search-cancel" v-if="searchVisible" @click="hideSearchPage()">{{ $t('book.cancel') }}
      </div>
    </div>
    <!-- 图书内容信息 -->
    <div class="slide-contents-book-wrapper" v-show="!searchVisible">
      <!-- 封面图片 -->
      <div class="slide-contents-book-img-wrapper">
        <img :src="cover" class="slide-contents-book-img">
      </div>
      <!-- 图书信息 -->
      <div class="slide-contents-book-info-wrapper">
        <!-- 图书标题 -->
        <div class="slide-contents-book-title">
          <span class="slide-contents-book-title-text">{{ metadata.title }}</span>
        </div>
        <!-- 作者 -->
        <div class="slide-contents-book-author">
          <span class="slide-contents-book-author-text">{{ metadata.creator }}</span>
        </div>
      </div>
      <!-- 进度和阅读时间 -->
      <div class="slide-contents-book-progress-wrapper">
        <!-- 阅读进度 -->
        <div class="slide-contents-book-progress">
          <span class="progress">{{ progress + '%' }}</span>
          <span class="progress-text">{{ $t('book.haveRead2') }}</span>
        </div>
        <!-- 阅读时间 放在mixin-->
        <div class="slide-contents-book-time">{{ getReadTimeText }}</div>
      </div>
    </div>
    <scroll class="slide-contents-list" :top="156" :bottom="48" v-show="!searchVisible">
      <div class="slide-contents-item" v-for="(item, index) in navigation" :key="index">
        <!-- 判断vuex中的章节section是否和index相等 -->
        <span class="slide-contents-item-label" :class="{ 'selected': section === index }" :style="contentItemStyle(item)"
          @click="displayContent(item.href)">{{ item.label }}</span>
        <span class="slide-contents-item-page">{{ item.page }}</span>
      </div>
    </scroll>
    <scroll class="slide-search-list" :top="66" :bottom="48" v-show="searchVisible">
      <div class="slide-search-item" v-for="(item, index) in searchList" :key="index" v-html="item.excerpt"
        @click="displayContent(item.cfi, true)"></div>
    </scroll>
  </div>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'
import Scroll from '../common/Scroll'
import { px2rem } from '../../utils/utils'

export default {
  mixins: [ebookMixin],
  components: {
    Scroll
  },
  data () {
    return {
      // 是否显示取消按钮
      searchVisible: false,
      // 搜索列表
      searchList: null,
      searchText: ''
    }
  },
  methods: {
    search () {
      if (this.searchText && this.searchText.length > 0) {
        this.doSearch(this.searchText).then(list => {
          this.searchList = list
          this.searchList.map(item => {
            // 给关键字加上颜色
            item.excerpt = item.excerpt.replace(this.searchText, `<span class="content-search-text">${this.searchText}</span>`)
            return item
          })
        })
      }
    },
    // epub.js官方提供的全局搜索方法
    doSearch (q) {
      return Promise.all(
        this.currentBook.spine.spineItems.map( // this.currentBook.spine.spineItems获得section的值
          section => section.load(this.currentBook.load.bind(this.currentBook))
            .then(section.find.bind(section, q))
            .finally(section.unload.bind(section)))
      )
        // 二维数组变成一维数组
        .then(results => Promise.resolve([].concat.apply([], results)))
    },
    displayContent (target, highlight = false) {
      this.display(target, () => {
        // console.log('tar', target)
        this.hideTitleAndMenu()
        if (highlight) {
          // 文章高亮显示传入的参数
          this.currentBook.rendition.annotations.highlight(target)
          setTimeout(() => {
            console.log('highlight')
            // 删除高亮
            this.currentBook.rendition.annotations.remove(target, 'highlight')
          }, 1500)
        }
      })
    },
    contentItemStyle (item) {
      return {
        marginLeft: `${px2rem(item.level * 15)}rem`
      }
    },
    showSearchPage () {
      this.searchVisible = true
    },
    hideSearchPage () {
      this.searchVisible = false
      this.searchText = ''
      this.searchList = null
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";

.ebook-slide-contents {
  width: 100%;
  // 清除空格
  font-size: 0;

  .slide-contents-search-wrapper {
    display: flex;
    width: 100%;
    height: px2rem(36);
    margin: px2rem(20) 0 px2rem(10) 0;
    padding: 0 px2rem(15);
    box-sizing: border-box;

    .slide-contents-search-input-wrapper {
      flex: 1;
      @include center;

      .slide-contents-search-icon {
        flex: 0 0 px2rem(28);
        font-size: px2rem(12);
        @include center;
      }

      .slide-contents-search-input {
        flex: 1;
        width: 100%;
        height: px2rem(32);
        font-size: px2rem(14);
        background: transparent;
        border: none;

        &:focus {
          outline: none;
        }
      }
    }

    .slide-contents-search-cancel {
      flex: 0 0 px2rem(50);
      font-size: px2rem(14);
      @include right;
    }
  }

  .slide-contents-book-wrapper {
    display: flex;
    width: 100%;
    height: px2rem(90);
    padding: px2rem(10) px2rem(15) px2rem(20) px2rem(15);
    box-sizing: border-box;

    .slide-contents-book-img-wrapper {
      flex: 0 0 px2rem(45);

      .slide-contents-book-img {
        width: px2rem(45);
        height: px2rem(60);
      }
    }

    .slide-contents-book-info-wrapper {
      flex: 1;
      padding: 0 px2rem(10);
      box-sizing: border-box;

      .slide-contents-book-title {
        // width: px2rem(153.75);
        font-size: px2rem(14);
        line-height: px2rem(16);
        @include left;

        .slide-contents-book-title-text {
          @include ellipsis2(3);
        }
      }

      .slide-contents-book-author {
        // width: px2rem(153.75);
        font-size: px2rem(12);
        line-height: px2rem(14);
        margin-top: px2rem(5);
        @include left;

        .slide-contents-book-author-text {
          // 多行省略
          @include ellipsis2(1);
        }
      }
    }

    .slide-contents-book-progress-wrapper {
      flex: 0 0 px2rem(70);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;

      .slide-contents-book-progress {
        .progress {
          font-size: px2rem(14);
        }

        .progress-text {
          font-size: px2rem(12);
        }
      }

      .slide-contents-book-time {
        font-size: px2rem(12);
        margin-top: px2rem(5);
      }
    }
  }

  .slide-contents-list {
    padding: 0 px2rem(15);
    box-sizing: border-box;

    .slide-contents-item {
      display: flex;
      padding: px2rem(20) 0;
      box-sizing: border-box;

      .slide-contents-item-label {
        flex: 1;
        font-size: px2rem(14);
        line-height: px2rem(16);
        @include ellipsis;
      }

      .slide-contents-item-page {
        flex: 0 0 px2rem(30);
        font-size: px2rem(10);
        @include right;
      }
    }
  }

  .slide-search-list {
    width: 100%;
    padding: 0 px2rem(15);
    box-sizing: border-box;

    .slide-search-item {
      font-size: px2rem(14);
      line-height: px2rem(16);
      padding: px2rem(20) 0;
      box-sizing: border-box;
    }
  }
}
</style>
