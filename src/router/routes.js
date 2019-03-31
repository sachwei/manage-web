/*
 * 路由配置
 * @Author: 490232365@qq.com
 * @Date: 2018-05-01 14:46:10
 */

import appRoutes from './appRoutes'

const baseRoutes = [
  { name: 'user', path: '/sys/userList', component: (resolve) => { require.ensure([], () => resolve(require('@/modules/sys/User.vue')), 'user') } },
  { name: 'menu', path: '/sys/menuList', component: (resolve) => { require.ensure([], () => resolve(require('@/modules/sys/Menu.vue')), 'menuList') } },
  { name: 'role', path: '/sys/roleList', component: (resolve) => { require.ensure([], () => resolve(require('@/modules/sys/Role.vue')), 'role') } },
  { name: 'xtcs', path: '/sys/xtcs', component: (resolve) => { require.ensure([], () => resolve(require('@/modules/sys/Xtcs.vue')), 'xtcs') } },
  { name: 'org', path: '/sys/org', component: (resolve) => { require.ensure([], () => resolve(require('@/modules/sys/Org.vue')), 'org') } },
  { name: 'enum', path: '/sys/enum', component: (resolve) => { require.ensure([], () => resolve(require('@/modules/sys/Enum.vue')), 'enum') } },
  { name: 'pageNotFound', path: '*', component: (resolve) => { require.ensure([], () => resolve(require('@/components/404.vue')), 'pageNotFound') } }
]
const backlogView = (resolve) => { require.ensure([], () => resolve(require('@/modules/backlog/pages/BacklogView.vue')), 'backlogView') }

const homeChildrenRoute = [].concat(appRoutes, baseRoutes)

const routes = [
  { name: 'backlogView', path: '/backlog/view/:backlogId', component: backlogView },
  { name: 'login', path: '/login', component: (resolve) => { require.ensure([], () => resolve(require('@/modules/login/Login.vue')), 'login') } },
  { name: 'home',
    path: '/',
    component: (resolve) => { require.ensure([], () => resolve(require('@/modules/home/Home.vue')), 'home') },
    children: homeChildrenRoute
  },
  { name: 'notFound', path: '*', component: (resolve) => { require.ensure([], () => resolve(require('@/components/404.vue')), 'notFound') } }
]

export default routes
