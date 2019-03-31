/*
 * 系统所有请求地址
 * @Author: 490232365@qq.com
 * @Date: 2018-05-05 16:44:19
 */

const CONTEXT = ''

let apiUrl = {}

apiUrl.LOGIN = CONTEXT + '/login'
apiUrl.LOGOUT = CONTEXT + 'logout'

// 增删改查baseUrl
apiUrl.BASE_FIND_ALL = CONTEXT + '/data/findAll/'
apiUrl.BASE_FIND = CONTEXT + '/data/find/'
apiUrl.BASE_SAVE = CONTEXT + '/data/save/'
apiUrl.BASE_SAVE_DOCS = CONTEXT + '/data/saveDocs/'
apiUrl.BASE_FIND_PAGE = CONTEXT + '/data/findPage/'
apiUrl.BASE_UPDATE = CONTEXT + '/data/update/'
apiUrl.BASE_DELETE_ID = CONTEXT + '/data/delete/'
apiUrl.BASE_DELETE = CONTEXT + '/data/deleteDocs/'
apiUrl.BASE_GROUP = CONTEXT + '/data/group/'
apiUrl.BASE_FIND_TOPONE = CONTEXT + '/data/findTopOne/'

// 保存图片
apiUrl.SYS_SAVE_IMAGE = CONTEXT + '/data/save/imgs'
apiUrl.SYS_FIND_IMAGE = CONTEXT + '/data/find/imgs/'

// 用户管理
apiUrl.SYS_ALL_USER = CONTEXT + '/data/findAll/users'
apiUrl.SYS_USER_COUNT = CONTEXT + '/data/findCount/users'
apiUrl.SYS_USER_PAGE = CONTEXT + '/data/findPage/users'
apiUrl.SYS_UPDATE_USER = CONTEXT + '/data/update/users/'

// 菜单管理
apiUrl.SYS_ALL_MENU = CONTEXT + '/data/findAll/menus'
apiUrl.SYS_FIND_MENU = CONTEXT + '/data/find/menus'
apiUrl.SYS_SAVE_MENU = CONTEXT + '/data/save/menus'
apiUrl.SYS_UPDATE_MENU = CONTEXT + '/data/update/menus/'
apiUrl.SYS_DELETE_MENU = CONTEXT + '/data/delete/menus/'

// 角色管理
apiUrl.SYS_ALL_ROLE = CONTEXT + '/data/findAll/roles'
apiUrl.SYS_SAVE_ROLE = CONTEXT + '/data/save/roles'
apiUrl.SYS_UPDATE_ROLE = CONTEXT + '/data/update/roles/'
apiUrl.SYS_DELETE_ROLE = CONTEXT + '/data/delete/roles/'
apiUrl.SYS_ALL_ROLEMENU = CONTEXT + '/data/findAll/roleMenus'
apiUrl.SYS_FIND_ROLEMENU = CONTEXT + '/data/find/roleMenus'
apiUrl.SYS_SAVE_ROLEMENU = CONTEXT + '/data/save/roleMenus'
apiUrl.SYS_DELETE_ROLEMENU = CONTEXT + '/data/delete/roleMenus/'

// 系统参数
apiUrl.SYS_FIND_XTCS = CONTEXT + '/data/find/xtcs'
apiUrl.SYS_ALL_XTCS = CONTEXT + '/data/findAll/xtcs'
apiUrl.SYS_SAVE_XTCS = CONTEXT + '/data/save/xtcs'
apiUrl.SYS_UPDATE_XTCS = CONTEXT + '/data/update/xtcs/'
apiUrl.SYS_DELETE_XTCS = CONTEXT + '/data/delete/xtcs/'

// 组织管理
apiUrl.SYS_ALL_ORG = '/data/findAll/orgs'
apiUrl.SYS_SAVE_ORG = CONTEXT + '/data/save/orgs'
apiUrl.SYS_UPDATE_ORG = CONTEXT + '/data/update/orgs/'
apiUrl.SYS_DELETE_ORG = '/data/delete/orgs/'
apiUrl.SYS_FIND_ORG = '/data/find/orgs'

// 系统枚举
apiUrl.SYS_ALL_ENUMTYPE = '/data/findAll/enumTypes'
apiUrl.SYS_SAVE_ENUMTYPE = CONTEXT + '/data/save/enumTypes'
apiUrl.SYS_UPDATE_ENUMTYPE = CONTEXT + '/data/update/enumTypes/'
apiUrl.SYS_DELETE_ENUMTYPE = '/data/delete/enumTypes/'
apiUrl.SYS_FIND_ENUMTYPE = '/data/find/enumTypes'

apiUrl.SYS_ALL_ENUM = '/data/findAll/enums'
apiUrl.SYS_SAVE_ENUM = CONTEXT + '/data/save/enums'
apiUrl.SYS_UPDATE_ENUM = CONTEXT + '/data/update/enums/'
apiUrl.SYS_DELETE_ENUM = '/data/delete/enums/'
apiUrl.SYS_FIND_ENUM = '/data/find/enums'

// 计划管理
apiUrl.WORK_ALL_PLAN = '/data/findAll/plans'
apiUrl.WORK_SAVE_PLAN = '/data/save/plans'
apiUrl.WORK_UPDATE_PLAN = CONTEXT + '/data/update/plans/'

// 产品管理
apiUrl.WORK_UPDATE_PRODUCT = CONTEXT + '/data/update/products/'
apiUrl.WORK_SAVE_PRODUCT = '/data/save/products'
apiUrl.WORK_FIND_PRODUCT = '/data/find/products'

// backlog
apiUrl.WORK_SAVE_BACKLOG = CONTEXT + '/data/save/backlogs'
apiUrl.WORK_UPDATE_BACKLOG = CONTEXT + '/data/update/backlogs/'
apiUrl.WORK_DELETE_BACKLOG = '/data/delete/backlogs/'
apiUrl.WORK_FIND_BACKLOG = CONTEXT + '/data/find/backlogs'
apiUrl.WORK_GROUP_BACKLOG = CONTEXT + '/data/group/backlogs'

export default apiUrl
