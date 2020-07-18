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
  postAccountDelete
}