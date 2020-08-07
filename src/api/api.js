import request from '@/utils/request'

const login = (data) => {
  return request.post('/v1/auth/login', data)
}

const dispatchList = (data) => {
  return request.post('/v1/task/person/query', data)
}

// 发送验证码
const sendCode = (phone) => {
  return request.post(`/v1/account/send?phone=${phone}`)
}

// 修改密码
const editPassword = (data) => {
  return request.post('/v1/account/password/edit', data)
}

// 查询账户额度
const postTotalQuery = (data) => {
  return request.post('/v1/admin/total/query', data)
}

// 查询分组列表
const postAccountQuery = (data) => {
  return request.post('/v1/account/group/query', data)
}

// 查询销售任务列表
const postTaskQuery = (data) => {
  return request.get('/analog-data/task-query.json', data)
}

// 过期任务总条数
const postTaskExpiration = (data) => {
  return request.post('/v1/task/expiration', data)
}

// 派单
const postTaskCreate = (data) => {
  return request.post('/v1/task/create', data)
}

// 新分组建
const postCroupCreate = (data) => {
  return request.post('/v1/account/group/create', data)
}

// 编辑分组
const postCroupEdit = (data) => {
  return request.post('/v1/account/group/edit', data)
}

// 删除分组
const postCroupDelete = (data) => {
  return request.post('/v1/account/group/delete', data)
}

// 新建账号
const postAccountCreate = (data) => {
  return request.post('/v1/account/create', data)
}

// 编辑账号
const postAccountEdit = (data) => {
  return request.post('/v1/account/edit', data)
}

// 查询账号列表
const postAccountList = (id) => {
  return request.post(`/v1/account/group/list?groupId=${id}`)
}

// 删除账号列表
const postAccountDelete = (data) => {
  return request.post('/v1/account/delete', data)
}

// 新建规则
const postRuleCreate = (data) => {
  return request.post('/v1/rule/create', data)
}

// 获取规则列表
const postRuleQuery = (data) => {
  return request.post('/v1/rule/query', data)
}

// 编辑规则
const postRuleEdit = (data) => {
  return request.post('/v1/rule/edit', data)
}

// 删除规则
const postRuleDelete = (data) => {
  return request.post('/v1/rule/delete', data)
}

// 查询客户列表
const postCustomerQuery = (data) => {
  return request.post('/v1/customer/query', data)
}

// 查询客户分级
const postCommonLevel = (data) => {
  return request.post('/v1/common/level', data)
}

// 查询客户所属行业
const postCommonIndustry = (data) => {
  return request.post('/v1/common/industry', data)
}

// 查询客户标签
const postCommonTag = (data) => {
  return request.post('/v1/common/tag', data)
}

// 添加客户标签
const postCommonTagAdd = (name) => {
  return request.post(`/v1/common/tag/add?tagName=${name}`)
}

// 新建客户
const postCommonCreate = (data) => {
  return request.post('/v1/customer/create', data)
}

// 编辑客户
const postCustomEdit = (data) => {
  return request.post('/v1/customer/edit', data)
}

// 删除客户
const postCustomDelete = (data) => {
  return request.post('/v1/customer/delete', data)
}

// 批量分配(客户管理)
const postCustomBtachGroup = (data) => {
  return request.post('/v1/customer/change', data)
}

// 查询账户总列表
const postAccountAllList = (data) => {
  return request.post('/v1/account/list', data)
}

// 查询账户总列表
const postAccountGroupChange = (data) => {
  return request.post('/v1/account/group/change', data)
}

// 查询客户职位列表
const postCommonPost = (data) => {
  return request.post('/v1/common/post', data)
}

// 图形展示-漏斗数据
const postTaskChartHopper = () => {
  return request.post('/v1/task/chart/hopper')
}

// 图形展示-折线展示
const postTaskChartPolygon = (type) => {
  return request.post(`/v1/task/chart/polygon?type=${type}`)
}

export {
  login,
  dispatchList,
  sendCode,
  editPassword,
  postTotalQuery,
  postAccountQuery,
  postTaskQuery,
  postTaskExpiration,
  postTaskCreate,
  postCroupCreate,
  postCroupEdit,
  postCroupDelete,
  postAccountCreate,
  postAccountEdit,
  postAccountList,
  postAccountDelete,
  postRuleCreate,
  postRuleQuery,
  postRuleEdit,
  postRuleDelete,
  postCustomerQuery,
  postCommonLevel,
  postCommonIndustry,
  postCommonTag,
  postCommonTagAdd,
  postCommonCreate,
  postCustomEdit,
  postCustomDelete,
  postCustomBtachGroup,
  postAccountAllList,
  postAccountGroupChange,
  postCommonPost,
  postTaskChartHopper,
  postTaskChartPolygon
}