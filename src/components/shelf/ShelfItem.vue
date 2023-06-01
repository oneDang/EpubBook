<template>
  <div class="shelf-item" :class="{ 'shelf-item-shadow': datas.type === 1 || datas.type === 2 }" @click="onItemClick">
    <component class="shelf-item-comp" :class="{ 'is-edit': isEditMode && datas.type === 2 }" :is="item" :data="datas">
    </component>
    <div class="icon-selected" :class="{ 'is-selected': datas.selected }" v-show="isEditMode && datas.type === 1"></div>
  </div>
</template>

<script>
import { storeShelfMixin, storeHomeMixin } from '../../utils/mixin'
import ShelfBook from './ShelfItemBook'
import ShelfCategory from './ShelfItemCategory'
import ShelfAdd from './ShelfItemAdd'
import { gotoStoreHome } from '../../utils/store'

export default {
  mixins: [storeShelfMixin, storeHomeMixin],
  components: {
  },
  props: {
    data: Object
  },
  computed: {
    // // 书架列表为1，书架分类列表为2
    item () {
      return this.datas.type === 1 ? this.book : (this.datas.type === 2 ? this.category : this.add)
    },
    datas () {
      return this.data
    }
  },
  data () {
    return {
      book: ShelfBook,
      category: ShelfCategory,
      add: ShelfAdd,
      show: false
    }
  },
  methods: {
    cancelFn () {
      console.log('cancelFn')
      this.show = false
    },
    // 点击书架中的图书
    onItemClick () {
      // 是否是编辑模式
      if (this.isEditMode && this.datas) {
        this.datas.selected = !this.datas.selected
        if (this.datas.selected) {
          // 添加不重复的书籍数据
          this.shelfSelected.pushWithoutDuplicate(this.datas)
        } else {
          this.setShelfSelected(this.shelfSelected.filter(item => item.id !== this.datas.id))
        }
      } else {
        // 书架列表为1，书架分类列表为2
        if (this.datas.type === 1) {
          // 私密阅读
          // if (this.datas.private === true) {
          //   this.show = true
          // } else {
          this.showBookDetail(this.datas)
          // }
        } else if (this.datas.type === 2) {
          this.$router.push({
            path: '/store/category',
            query: {
              title: this.datas.title
            }
          })
        } else {
          gotoStoreHome(this)
          this.setFlapCardVisible(false)
        }
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";

.shelf-item {
  position: relative;
  width: 100%;
  height: 100%;

  &.shelf-item-shadow {
    box-shadow: px2rem(2) px2rem(2) px2rem(6) px2rem(2) rgba(200, 200, 200, .3);
  }

  .shelf-item-comp {
    opacity: 1;

    &.is-edit {
      opacity: .5;
    }
  }

  .icon-selected {
    position: absolute;
    bottom: px2rem(2);
    right: px2rem(2);
    font-size: px2rem(18);
    color: rgba(0, 0, 0, .4);

    &.is-selected {
      color: $color-blue;
    }
  }
}
</style>
