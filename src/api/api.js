import request from '@/utils/request'

const login = (data) => {
  return request.get('/analog-data/login.json', data)
}

const dispatchList = (data) => {
  return request.get('/analog-data/dispatch-list.json', data)
}

export {
  login,
  dispatchList
}