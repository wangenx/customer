import request from '@/utils/request'

const login = (data) => {
  return request.get('/analog-data/login.json', data)
}

const dispatchList = (data) => {
  return request.get('/analog-data/dispatch-list.json', data)
}

// 发送验证码
const sendCode = (data) => {
  return request.get('/analog-data/send-code.json', data)
}

// 修改密码
const editPassword = (data) => {
  return request.get('/analog-data/edit-password.json', data)
}

// 修改密码
const postTotalQuery = (data) => {
  return request.get('/analog-data/total-query.json', data)
}

// 查询分组列表
const postAccountQuery = (data) => {
  return request.get('/analog-data/account-query.json', data)
}

// 查询销售任务列表
const postTaskQuery = (data) => {
  return request.get('/analog-data/task-query.json', data)
}

// 查询销售任务列表
const postTaskExpiration = (data) => {
  return request.get('/analog-data/task-expiration.json', data)
}

// 派单
const postTaskCreate = (data) => {
  return request.get('/analog-data/task-create.json', data)
}

// 新分组建
const postCroupCreate = (data) => {
  return request.get('/analog-data/group-create.json', data)
}

// 编辑分组
const postCroupEdit = (data) => {
  return request.get('/analog-data/group-edit.json', data)
}

// 删除分组
const postCroupDelete = (data) => {
  return request.get('/analog-data/group-delete.json', data)
}

// 新建账号
const postAccountCreate = (data) => {
  return request.get('/analog-data/account-create.json', data)
}

// 编辑账号
const postAccountEdit = (data) => {
  return request.get('/analog-data/account-edit.json', data)
}

// 查询账号列表
const postAccountList = (data) => {
  return request.get('/analog-data/account-list.json', data)
}

// 查询账号列表
const postAccountDelete = (data) => {
  return request.get('/analog-data/account-delete.json', data)
}

// 新建规则
const postRuleCreate = (data) => {
  return request.get('/analog-data/rule-create.json', data)
}

// 获取规则列表
const postRuleQuery = (data) => {
  return request.get('/analog-data/rule-query.json', data)
}

// 新建规则
const postRuleEdit = (data) => {
  return request.get('/analog-data/rule-edit.json', data)
}

// 删除规则
const postRuleDelete = (data) => {
  return request.get('/analog-data/rule-delete.json', data)
}

// 查询客户列表
const postCustomerQuery = (data) => {
  return request.get('/analog-data/customer-query.json', data)
}

// 查询客户分级
const postCommonLevel = (data) => {
  return request.get('/analog-data/common-level.json', data)
}

// 查询客户所属行业
const postCommonIndustry = (data) => {
  return request.get('/analog-data/common-industry.json', data)
}

// 查询客户标签
const postCommonTag = (data) => {
  return request.get('/analog-data/common-tag.json', data)
}

// 添加客户标签
const postCommonTagAdd = (data) => {
  return request.get('/analog-data/common-tag-add.json', data)
}

// 新建客户
const postCommonCreate = (data) => {
  return request.get('/analog-data/common-create.json', data)
}

// 编辑客户
const postCustomEdit = (data) => {
  return request.get('/analog-data/custom-edit.json', data)
}

// 删除客户
const postCustomDelete = (data) => {
  return request.get('/analog-data/custom-delete.json', data)
}

// 批量分配(客户管理)
const postCustomBtachGroup = (data) => {
  return request.get('/analog-data/custom-batch-group.json', data)
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
  postCustomBtachGroup
}