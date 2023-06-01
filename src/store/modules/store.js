const store = {
  // 书城首页
  state: {
    // 热门搜索
    hotSearchOffsetY: 0,
    // 翻转卡片
    flapCardVisible: false,
    isEditMode: false, // 是否进入编辑模式
    shelfList: [], // 图书列表
    shelfSelected: [], // 选中的列表
    shelfTitleVisible: true, // 数据标题的显示状态
    shelfCategory: [], // 书架分类列表数据
    currentType: 1, // 书架列表为1，书架分类列表为2
    active: 1, // 底部导航栏激活的index
// 头像地址(默认值)
    userPhoto: 'https://img1.baidu.com/it/u=852527378,739232243&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
  },
  mutations: {
    SET_HOT_SEARCH_OFFSETY (state, y) {
      state.hotSearchOffsetY = y
    },
    SET_FLAP_CARD_VISIBLE (state, visible) {
      state.flapCardVisible = visible
    },
    SET_IS_EDIT_MODE (state, isEditMode) {
      state.isEditMode = isEditMode
    },
    SET_SHELF_LIST (state, list) {
      state.shelfList = list
    },
    SET_SHELF_SELECTED (state, selected) {
      state.shelfSelected = selected
    },
    SET_SHELF_TITLE_VISIBLE (state, visible) {
      state.shelfTitleVisible = visible
    },
    SET_SHELF_CATEGORY (state, category) {
      state.shelfCategory = category
    },
    SET_CURRENT_TYPE (state, type) {
      state.currentType = type
    },
    SET_ACTIVE (state, active) {
      state.active = active
    },
     // 编码风格, mutations最好大写(区分)
    SET_USERPHOTO (state, value) {
      state.userPhoto = value
    }
  }
}

export default store
