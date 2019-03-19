/*
 * 路由.
 * @Author: sachuangwei@ygsoft.com
 * @Date: 2018-08-2 16:18:51
 */

const share = (resolve) => { require.ensure([], () => resolve(require('@/modules/learn/pages/Share.vue')), 'share') }
const addShare = (resolve) => { require.ensure([], () => resolve(require('@/modules/learn/pages/AddShare.vue')), 'addShare') }
const shareDetail = (resolve) => { require.ensure([], () => resolve(require('@/modules/learn/pages/ShareDetail.vue')), 'shareDetail') }

const route = [
  { name: 'share',
    path: '/learn/share',
    component: share,
    children: [
      { name: 'shareEdit', path: 'edit', component: addShare },
      { name: 'addShare', path: 'add', component: addShare },
      { name: 'shareDetail', path: 'detail', component: shareDetail }
    ]
  }
]

export default route
