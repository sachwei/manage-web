/*
 * 路由.
 * @Author: sachuangwei@ygsoft.com
 * @Date: 2018-06-2 16:18:51
 */

const rushJob = (resolve) => { require.ensure([], () => resolve(require('@/modules/rushjob/pages/RushJob.vue')), 'todo') }

const route = [
  { name: 'rushjob',
    path: '/my/rushjob',
    component: rushJob
  }
]

export default route
