/*
 * 路由.
 * @Author: 490232365@qq.com
 * @Date: 2018-05-19 16:18:51
 */

const productList = (resolve) => { require.ensure([], () => resolve(require('@/modules/product/pages/Product.vue')), 'product') }
const productMap = (resolve) => { require.ensure([], () => resolve(require('@/modules/product/pages/Map.vue')), 'productMap') }

const route = [
  { name: 'list', path: '/product/list', component: productList },
  { name: 'productMap', path: '/product/productMap', component: productMap }
]

export default route
