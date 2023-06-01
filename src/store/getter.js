const book = {
  // 文件名
  fileName: state => state.book.fileName, // 模块book
  // 是否显示菜单
  menuVisible: state => state.book.menuVisible,
  // 显示菜单项，字号，主题等等
  settingVisible: state => state.book.settingVisible,
  // 设置默认样式
  defaultFontSize: state => state.book.defaultFontSize,
  defaultFontFamily: state => state.book.defaultFontFamily,
  fontFamilyVisible: state => state.book.fontFamilyVisible,
  defaultTheme: state => state.book.defaultTheme,
  // 进度条是否可用
  bookAvailable: state => state.book.bookAvailable,
  // 进度条数据
  progress: state => state.book.progress,
  // 当前章节的位置
  section: state => state.book.section,
  isPaginating: state => state.book.isPaginating,
  currentBook: state => state.book.currentBook,
  navigation: state => state.book.navigation,
  // 封面图片的路径
  cover: state => state.book.cover,
  // 书籍的基本信息
  metadata: state => state.book.metadata,
  // 扁平化后的目录
  paginate: state => state.book.paginate,
  pagelist: state => state.book.pagelist,
  offsetY: state => state.book.offsetY,
  isBookmark: state => state.book.isBookmark,
  /** 书城 */
  hotSearchOffsetY: state => state.store.hotSearchOffsetY,
  flapCardVisible: state => state.store.flapCardVisible,
  isEditMode: state => state.store.isEditMode,
  shelfList: state => state.store.shelfList,
  shelfSelected: state => state.store.shelfSelected,
  shelfTitleVisible: state => state.store.shelfTitleVisible,
  shelfCategory: state => state.store.shelfCategory,
  currentType: state => state.store.currentType,
  // 底部导航
  active: state => state.store.active,
  userPhoto: state => state.store.userPhoto
}
export default book
