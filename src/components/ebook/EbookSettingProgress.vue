<template>
  <transition name="slide-up">
    <!-- 显示阅读进度 -->
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 2">
      <div class="setting-progress">
        <!-- 阅读时间 -->
        <div class="read-time-wrapper">
          <span class="read-time-text">{{ getReadTimeText }}</span>
          <!-- <span class="read-time-text">阅读时间</span> -->
          <span class="icon-forward"></span>
        </div>
        <!-- 进度条 -->
        <div class="progress-wrapper">
          <!-- 上一页 -->
          <div class="progress-icon-wrapper" @click="prevSection()">
            <span class="icon-back"></span>
          </div>
          <!-- 进度条 -->
          <input class="progress" type="range" max="100" min="0" step="1" @change="onProgressChange($event.target.value)"
            @input="onProgressInput($event.target.value)" :value="progress" :disabled="!bookAvailable" ref="progress">
          <!-- 下一页 -->
          <div class="progress-icon-wrapper" @click="nextSection()">
            <span class="icon-forward"></span>
          </div>
        </div>
        <!-- 百分比 -->
        <div class="text-wrapper">
          <span class="progress-section-text">{{ getSectionName }}</span>
          <span>({{ bookAvailable ? progress + '%' : '加载中...' }})</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'

export default {
  mixins: [ebookMixin],

  methods: {
    onProgressChange (progress) {
      this.setProgress(progress).then(() => {
        this.displayProgress()
        this.updateProgressBg()
      })
    },
    onProgressInput (progress) {
      this.setProgress(progress).then(() => {
        this.displayProgress()
        this.displayProgress()
      })
    },
    displayProgress () {
      // ePub电子书通过百分比进行定位
      const cfi = this.currentBook.locations.cfiFromPercentage(this.progress / 100)
      // 根据cfi渲染电子书
      this.display(cfi)
      // this.currentBook.rendition.display(cfi)
    },
    // 设置进度条颜色
    updateProgressBg () {
      // this.$refs.progress.style.backgroundSize = `${this.progress}% 100%!important`
      this.$refs.progress.style.cssText = `background-size:${this.progress}% 100% !important`
    },
    // 上一章 section默认为0，第一章
    prevSection () {
      if (this.section > 0 && this.bookAvailable) {
        this.setSection(this.section - 1).then(() => {
          this.displaySection()
        })
      }
    },
    nextSection () {
      if (this.section < this.currentBook.spine.length - 1 && this.bookAvailable) {
        // 设置vuex中的章节
        this.setSection(this.section + 1).then(() => {
          this.displaySection()
        })
      }
    },
    // 根据章节序号获取章节信息
    displaySection () {
      const sectionInfo = this.currentBook.section(this.section)
      if (sectionInfo && sectionInfo.href) {
        this.display(sectionInfo.href)
      }
    }
  },
  updated () {
    this.updateProgressBg()
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";

.setting-wrapper {
  position: absolute;
  bottom: px2rem(48);
  left: 0;
  z-index: 160;
  width: 100%;
  height: px2rem(90);
  background: white;
  box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);

  .setting-progress {
    position: relative;
    width: 100%;
    height: 100%;

    .read-time-wrapper {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: px2rem(40);
      font-size: px2rem(12);
      @include center;
    }

    .progress-wrapper {
      width: 100%;
      height: 100%;
      @include center;
      padding: 0 px2rem(15);
      box-sizing: border-box;

      .progress-icon-wrapper {
        font-size: px2rem(20);
      }

      .progress {
        width: 100%;
        -webkit-appearance: none;
        /*清除系统默认样式*/
        height: px2rem(2);
        margin: 0 px2rem(10);
        background: -webkit-linear-gradient(#61bd12, #61bd12) no-repeat, #ddd;

        /*设置左边颜色为#61bd12，右边颜色为#ddd*/
        &:focus {
          outline: none;
        }

        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: px2rem(20);
          width: px2rem(20);
          border-radius: 50%;
          background: white;
          box-shadow: 0 4px 4px 0 rgba(0, 0, 0, .15);
          border: px2rem(1) solid #ddd;
        }
      }
    }

    .text-wrapper {
      position: absolute;
      left: 0;
      bottom: px2rem(10);
      width: 100%;
      color: #333;
      font-size: px2rem(12);
      padding: 0 px2rem(15);
      box-sizing: border-box;
      @include center;

      .progress-section-text {
        @include ellipsis;
      }
    }
  }
}
</style>
