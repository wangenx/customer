import axios from "axios";
import { Message } from "element-ui";
import store from "../store";
import router from "../router";

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
      config.headers["Authorization"] = "Bearer " + store.state.UserToken; // 让每一个请求携带自定义token 请根据实际情况自行修改
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
    if (response.data.code === 317) { // 登录失效或者未登录
      Message({
        message: response.data.msg,
        type: 'error',
        duration: 5 * 1000
      })
      store.dispatch('webLoginOut').then(() => {
        router.push('/')
      })
    } else if (response.data.code === 323) {
      Message({
        message: '该ip未授权或者ip不在白名单',
        type: 'error',
        duration: 5 * 1000
      })
      store.dispatch('webLoginOut').then(() => {
        router.push('/')
      })
    } else if (response.data.code === 200) {
      if (response.data == null && response.config.responseType === 'json' && response.request.responseText != null) {
        try {
          response.data = JSON.parse(response.request.responseText);
        } catch(e) {
          console.log(e)
        }
      } 
      return response.data;
    } else {
      Message({
        message: response.data.msg,
        type: 'error',
        duration: 5 * 1000
      })
      return response.data;
    }
  },
  error => {
    if (error.response.status === 401) {
      Message({
        message: error.response.data.msg,
        type: "error",
        duration: 5 * 1000
      });
      store
        .dispatch("webLoginOut")
        .then(() => {
          router.push("/");
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      Message({
        message: "出错啦，请稍后再试",
        type: "error",
        duration: 5 * 1000
      });
    }
    return Promise.reject(error);
  }
);

export default service;
