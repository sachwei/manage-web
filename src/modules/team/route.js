/*
 * 路由.
 * @Author: 490232365@qq.com
 * @Date: 2018-08-2 16:18:51
 */

const buildMoney = (resolve) => { require.ensure([], () => resolve(require('@/modules/team/pages/BuildMoney.vue')), 'buildmoney') }

const route = [
  { name: 'buildMoney', path: '/team/buildmoney', component: buildMoney }
]

export default route
