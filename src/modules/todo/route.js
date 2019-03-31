/*
 * 路由.
 * @Author: 490232365@qq.com
 * @Date: 2018-06-2 16:18:51
 */

const todo = (resolve) => { require.ensure([], () => resolve(require('@/modules/todo/pages/Todo.vue')), 'todo') }
const bug = (resolve) => { require.ensure([], () => resolve(require('@/modules/bug/pages/Bug.vue')), 'bug') }

const route = [
  { name: 'todo',
    path: '/todo/list',
    component: todo,
    children: [
      { name: 'viewtbug', path: 'detail', component: bug }
    ]
  }
]

export default route
