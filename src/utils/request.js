import axios from "axios";
import { Message } from "element-ui";
import store from "../store";
import router from "../router";
// import router from "../router";

// 创建axios实例
const service = axios.create({
  baseURL:
  process.env.NODE_ENV === "development" ? "" : process.env.VUE_APP_BASEURL,
  timeout: 8000, // 请求超时时间
  retry: 3, // 全局请求次数，请求间隙
  retryDelay: 300
});

// request拦截器
service.interceptors.request.use(
  config => {
    if (store.state.UserToken) {
      config.headers["Authorization"] = 'Bearer ' + store.state.UserToken; // 让每一个请求携带自定义token 请根据实际情况自行修改
    } else {
      router.push({ path: '/' })
    }
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

// response拦截器
service.interceptors.response.use(
  response => {
    if (response.data.code === 200) { // 登录失效或者未登录
      return response.data;
    } else if (response.data.code === 200001) {
      // router.push('/')
      Message.error(response.data.msg)
      store.dispatch('webLoginOut').then(() => {
        router.push({ name: 'Login' })
      })
    } else {
      Message({
        message: response.data.msg,
        type: 'error',
        duration: 5 * 1000
      })
      return response.data
      // store.dispatch('webLoginOut').then(() => {
      //   router.push('/')
      // })
    }
  },
  error => {
    return Promise.reject(error);
  }
);

export default service;
