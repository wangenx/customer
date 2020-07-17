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

export {
  login,
  dispatchList,
  sendCode,
  editPassword,
  postTotalQuery,
  postAccountQuery,
  postTaskQuery,
  postTaskExpiration,
  postTaskCreate
}