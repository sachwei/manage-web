/*
 * 路由.
 * @Author: 490232365@qq.com
 * @Date: 2018-05-19 16:18:51
 */

const yearPlan = (resolve) => { require.ensure([], () => resolve(require('@/modules/yearPlan/YearPlan.vue')), 'yearPlan') }
const route = [
  { name: 'yearPlan', path: '/work/yearPlan', component: yearPlan }
]

export default route
