/*
 * 路由.
 * @Author: 490232365@qq.com
 * @Date: 2018-06-16 16:18:51
 */

const apidoc = (resolve) => { require.ensure([], () => resolve(require('@/modules/api/pages/ApiList.vue')), 'apilist') }

const route = [
  { name: 'apidoc',
    path: '/apidoc',
    component: apidoc
  }
]

export default route
