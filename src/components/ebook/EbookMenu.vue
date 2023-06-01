<template>
  <!-- 菜单栏 -->
  <div class="ebook-menu">
    <!-- <transition name="slide-up">
      <div class="menu-wrapper"
           v-show="menuVisible">
        <div class="icon-wrapper">
          <span class="icon-menu"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-progress"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-bright"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-A"></span>
        </div>
      </div>
    </transition> -->
    <transition name="slide-up">
      <!-- hide-box-shadow代表是否显示阴影，如果二级菜单显示就不显示阴影 -->
      <div class="menu-wrapper" :class="{ 'hide-box-shadow': settingVisible >= 0 || !menuVisible }" v-show="menuVisible">
        <div class="icon-wrapper" :class="{ 'selected': settingVisible === 3 }">
          <span class="icon-menu" @click="showSetting(3)"></span>
        </div>
        <div class="icon-wrapper" :class="{ 'selected': settingVisible === 2 }">
          <span class="icon-progress" @click="showSetting(2)"></span>
        </div>
        <div class="icon-wrapper" :class="{ 'selected': settingVisible === 1 }">
          <span class="icon-bright" @click="showSetting(1)"></span>
        </div>
        <div class="icon-wrapper" :class="{ 'selected': settingVisible === 0 }">
          <span class="icon-A" @click="showSetting(0)"></span>
        </div>
      </div>
    </transition>
    <ebook-set-font-size></ebook-set-font-size>
    <ebook-setting-font-popup></ebook-setting-font-popup>
    <ebook-setting-theme></ebook-setting-theme>
    <ebook-setting-progress></ebook-setting-progress>
    <ebook-slide></ebook-slide>
    <!-- <ebook-speaking-icon></ebook-speaking-icon> -->
  </div>
</template>

<script type="text/ecmascript-6">
import EbookSettingFontPopup from './EbookSettingFontPopup'
import EbookSettingTheme from './EbookSettingTheme'
import EbookSettingProgress from './EbookSettingProgress'
// import EbookSpeakingIcon from './EbookSpeakingIcon'

import EbookSlide from './EbookSlide'
import { ebookMixin } from '@/utils/mixin'
import EbookSetFontSize from './EbookSetFontSize.vue'

export default {
  mixins: [ebookMixin],
  components: {
    EbookSetFontSize,
    EbookSettingFontPopup,
    EbookSlide,
    EbookSettingProgress,
    // EbookSettingFont,
    EbookSettingTheme
    // EbookSpeakingIcon
  },
  methods: {
    showSetting (num) {
      this.setSettingVisible(num)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global.scss";

.menu-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 200;
  display: flex;
  width: 100%;
  height: px2rem(48);
  background: white;
  box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
  font-size: px2rem(20);

  &.hide-box-shadow {
    box-shadow: none;
  }

  .icon-wrapper {
    flex: 1;
    @include center;

    .icon-progress {
      font-size: px2rem(24);
    }

    .icon-bright {
      font-size: px2rem(22);
    }
  }
}</style>
