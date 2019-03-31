/*
 * 常量替代 Mutation 事件类型
 * 用不用常量取决于你——在需要多人协作的大型项目中，这会很有帮助。但如果你不喜欢，你完全可以不这样做
 * @Author: 490232365@qq.com
 * @Date: 2018-05-02 17:40:18
 */

const mutationTypes = {
  // 设置用户信息
  SET_USER_INFO: 'SET_USER_INFO',

  // 切换侧边栏
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',

  // 切换头部
  TOGGLE_HEADER: 'TOGGLE_HEADER'
}

export default mutationTypes
