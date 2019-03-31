/*
 * 功能页面路由
 * @Author: 490232365@qq.com
 * @Date: 2018-05-19 16:28:17
 */

import yearPlan from '../modules/yearPlan/route'
import product from '../modules/product/route'
import backlog from '../modules/backlog/route'
import sprint from '../modules/sprint/route'
import bug from '../modules/bug/route'
import todo from '../modules/todo/route'
import rushJob from '../modules/rushjob/route'
import personalBoard from '../modules/dashboard/route'
import analysize from '../modules/analysize/route'
import learn from '../modules/learn/route'
import team from '../modules/team/route'
import api from '../modules/api/route'
import test from '../modules/test/route'

const route = [].concat(learn, yearPlan, backlog, product, sprint, bug, todo, rushJob, personalBoard, analysize, team, api, test)

export default route
