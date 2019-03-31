/*
 * 路由.
 * @Author: 490232365@qq.com
 * @Date: 2018-05-19 16:18:51
 */

const backlog = (resolve) => { require.ensure([], () => resolve(require('@/modules/backlog/pages/Backlog.vue')), 'backlog') }
const backlogSearch = (resolve) => { require.ensure([], () => resolve(require('@/modules/backlog/pages/BacklogSearch.vue')), 'backlogSearch') }
const backlogDetail = (resolve) => { require.ensure([], () => resolve(require('@/modules/backlog/pages/BacklogDetail.vue')), 'backlogDetail') }
const imageView = (resolve) => { require.ensure([], () => resolve(require('@/components/image-view/image-view.vue')), 'imageView') }
const estimate = (resolve) => { require.ensure([], () => resolve(require('@/modules/backlog/pages/Estimate.vue')), 'estimate') }

const route = [
  { name: 'backlog',
    path: '/product/backlog',
    component: backlog,
    children: [
      { name: 'backlogDetail',
        path: 'detail',
        component: backlogDetail,
        children: [
          { name: 'imageView', path: 'imageView', component: imageView },
          { name: 'estimate', path: 'estimate', component: estimate }
        ]
      }
    ]
  },
  { name: 'backlogSearch',
    path: '/product/backlog/search',
    component: backlogSearch,
    children: [
      { name: 'backlogDetail1', path: 'edit', component: backlogDetail }
    ]
  }
]

export default route
