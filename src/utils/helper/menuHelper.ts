import {cloneDeep} from 'lodash-es'
import { treeMap, filter } from '../treeHelper'
import { isUrl } from '../is'
import { Menu } from '@/types/menu'
import {AppRouteRecordRaw} from '@/types/router'
// 路径处理
function joinParentPath(menus: Menu[], parentPath = '') {
    for (let index = 0; index < menus.length; index++) {
      const menu = menus[index]
      // https://next.router.vuejs.org/guide/essentials/nested-routes.html
      // 请注意，以 / 开头的嵌套路径将被视为根路径。
      // 这允许你利用组件嵌套，而无需使用嵌套 URL。
      if (!(menu.path.startsWith('/') || isUrl(menu.path))) {
        // path doesn't start with /, nor is it a url, join parent path
        // 路径不以 / 开头，也不是 url，加入父路径
        menu.path = `${parentPath}/${menu.path}`
      }
      if (menu?.children?.length) {
        joinParentPath(menu.children, menu.meta?.hidePathForChildren ? parentPath : menu.path)
      }
    }
  }
// 将路由转换成菜单
export function transformRouteToMenu(routeModList, routerMapping = false) {
    // 借助 lodash 深拷贝
    const cloneRouteModList = cloneDeep(routeModList)
    const routeList= []
    // 对路由项进行修改
    cloneRouteModList.forEach((item) => {
      if (routerMapping && item.meta.hideChildrenInMenu && typeof item.redirect === 'string') {
        item.path = item.redirect
      }
      if (item.meta?.single) {
        const realItem = item?.children?.[0]
        realItem && routeList.push(realItem)
      } else {
        routeList.push(item)
      }
    })
    // 提取树指定结构
    const list = filter(routeList, (route)=>{
        return route?.meta?.title
    })
    // 路径处理
    joinParentPath(list)
    return cloneDeep(list)
  }