/*
 * 路由.
 * @Author: sachuangwei@ygsoft.com
 * @Date: 2018-06-16 16:18:51
 */

const analysize = (resolve) => { require.ensure([], () => resolve(require('@/modules/analysize/pages/Analysize.vue')), 'analysize') }

const route = [
  { name: 'analysize',
    path: '/work/analysize',
    component: analysize
  }
]

export default route
