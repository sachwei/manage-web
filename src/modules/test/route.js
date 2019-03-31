/*
 * 路由.
 * @Author: 490232365@qq.com
 * @Date: 2019-01-11 11:18:51
 */

const testSet = (resolve) => { require.ensure([], () => resolve(require('@/modules/test/pages/TestSet.vue')), 'testSet') }
const testCase = (resolve) => { require.ensure([], () => resolve(require('@/modules/test/pages/TestCase.vue')), 'testCase') }
const testPlan = (resolve) => { require.ensure([], () => resolve(require('@/modules/test/pages/TestPlan.vue')), 'testPlan') }
const testExcute = (resolve) => { require.ensure([], () => resolve(require('@/modules/test/pages/TestExcute.vue')), 'testExcute') }
const caseDetail = (resolve) => { require.ensure([], () => resolve(require('@/modules/test/pages/TestCaseDetail.vue')), 'caseDetail') }

const route = [
  { name: 'testSet',
    path: '/test/set',
    component: testSet
  },
  { name: 'testCase',
    path: '/test/case',
    component: testCase,
    children: [
      { name: 'caseDetail', path: 'detail', component: caseDetail }
    ]
  },
  { name: 'testPlan',
    path: '/test/plan',
    component: testPlan
  },
  { name: 'testExcute',
    path: '/test/excute',
    component: testExcute
  }
]

export default route
