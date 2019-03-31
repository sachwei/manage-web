/*
 * 路由.
 * @Author: 490232365@qq.com
 * @Date: 2018-05-23 16:18:51
 */

const sprintList = (resolve) => { require.ensure([], () => resolve(require('@/modules/sprint/pages/SprintList.vue')), 'sprintList') }
const sprintDetail = (resolve) => { require.ensure([], () => resolve(require('@/modules/sprint/pages/SprintDetail.vue')), 'sprintDetail') }
const sprintBoard = (resolve) => { require.ensure([], () => resolve(require('@/modules/sprint/pages/SprintBoard.vue')), 'sprintBoard') }
const sprintChart = (resolve) => { require.ensure([], () => resolve(require('@/modules/sprint/pages/SprintChart.vue')), 'sprintChart') }
const sprintBug = (resolve) => { require.ensure([], () => resolve(require('@/modules/bug/pages/Bug.vue')), 'sprintBug') }
const backlogDetail = (resolve) => { require.ensure([], () => resolve(require('@/modules/backlog/pages/BacklogDetail.vue')), 'backlogDetail') }
const backlogList = (resolve) => { require.ensure([], () => resolve(require('@/modules/sprint/pages/BacklogList.vue')), 'backlogList') }
const sprintTeam = (resolve) => { require.ensure([], () => resolve(require('@/modules/sprint/pages/SprintTeam.vue')), 'sprintTeam') }
const sprintBugList = (resolve) => { require.ensure([], () => resolve(require('@/modules/bug/pages/BugList.vue')), 'sprintBugList') }
const sprintAnalyse = (resolve) => { require.ensure([], () => resolve(require('@/modules/sprint/pages/SprintAnalyse.vue')), 'sprintAnalyse') }

const route = [
  { name: 'sprintList',
    path: '/sprint/list',
    component: sprintList,
    children: [
      { name: 'sprintDetail', path: 'detail', component: sprintDetail },
      { name: 'backlogList',
        path: 'backlogList',
        component: backlogList,
        children: [
          { name: 'backlogDetail1', path: 'edit', component: backlogDetail }
        ]
      },
      { name: 'sprintTeam', path: 'sprintTeam', component: sprintTeam },
      { name: 'sprintBugList', path: 'buglist', component: sprintBugList },
      { name: 'sprintAnalyse', path: 'analyse', component: sprintAnalyse }
    ]
  },
  { name: 'sprintBoard',
    path: '/sprint/board',
    component: sprintBoard,
    children: [
      { name: 'sprintChart', path: 'sprintChart', component: sprintChart },
      { name: 'sprintBug', path: 'sprintBug', component: sprintBug },
      { name: 'backlogDetail2', path: 'edit', component: backlogDetail }
    ]
  }
]

export default route
