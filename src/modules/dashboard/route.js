/*
 * 路由.
 * @Author: 490232365@qq.com
 * @Date: 2018-06-16 16:18:51
 */

const personalBoard = (resolve) => { require.ensure([], () => resolve(require('@/modules/dashboard/pages/PersonalBoard.vue')), 'board') }

const route = [
  { name: 'board',
    path: '/dashboard/board',
    component: personalBoard
  }
]

export default route
