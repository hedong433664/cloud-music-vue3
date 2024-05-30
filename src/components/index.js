import SongTable from './SongTable.vue'
import PlayerIcon from './PlayerIcon.vue'
import ContextMenu from './ContextMenu.vue'
import CardItem from './CardItem.vue'
import SearchTable from './SearchTable.vue'
import SearchCardList from './SearchCardList.vue'
import Comment from './Comment.vue'
import Pagination from './Pagination.vue'

// 挂载全局组件
export default {
  install(app){
    app.component('SongTable', SongTable)
    app.component('PlayerIcon', PlayerIcon)
    app.component('ContextMenu', ContextMenu)
    app.component('CardItem', CardItem)
    app.component('SearchTable', SearchTable)
    app.component('SearchCardList', SearchCardList)
    app.component('Comment', Comment)
    app.component('Pagination', Pagination)
  },
}
