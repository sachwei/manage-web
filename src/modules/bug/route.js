/*
 * 路由.
 * @Author: 490232365@qq.com
 * @Date: 2018-06-2 16:18:51
 */

const bugList = (resolve) => { require.ensure([], () => resolve(require('@/modules/bug/pages/BugList.vue')), 'bugList') }
const bug = (resolve) => { require.ensure([], () => resolve(require('@/modules/bug/pages/Bug.vue')), 'bug') }
const bugAnalyse = (resolve) => { require.ensure([], () => resolve(require('@/modules/bug/pages/BugAnalyse.vue')), 'bug') }

const route = [
  { name: 'bugList',
    path: '/bug/list',
    component: bugList,
    children: [
      { name: 'editbug', path: 'detail', component: bug },
      { name: 'bugAnalyse', path: 'bugAnalyse', component: bugAnalyse }
    ]
  }
]

export default route
