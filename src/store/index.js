import Vue from "vue";
import Vuex from "vuex";
import { login } from "@/api/api";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    get UserToken() {
      return localStorage.getItem("token"); // 获取token
    },
    set UserToken(value) {
      localStorage.setItem("token", value); // 设置token
    },
    get UserName() {
      return localStorage.getItem("name"); // 获取name
    },
    set UserName(value) {
      localStorage.setItem("name", value); // 设置name
    },
    sidebarMenu: [], // 导航菜单
    currentMenu: "", // 当前active导航菜单
    fold: false
  },
  mutations: {
    LOGIN_IN(state, token) {
      state.UserToken = token;
    },
    LOGIN_OUT(state) {
      state.UserToken = "";
      state.UserName = "";
    },
    SET_NAME(state, name) {
      state.UserName = name;
    },
    SET_MENU(state, menu) {
      if (state.sidebarMenu.length === 0) {
        state.sidebarMenu = menu
      } 
    },
    SET_CURRENTMENU(state, name) {
      state.currentMenu = name
    },
    SET_FOLD(state, b) {
      state.fold = b
    }
  },
  actions: {
    Set_Menu ({ commit }, data) {
      commit('SET_MENU', data)
    },
    // 登录
    Login ({ commit }, data) {
      return new Promise((resolve, reject) => {
        login(data)
          .then(res => {
            if (res.code === 200) {
              console.log(res)
              commit("LOGIN_IN", res.data.jwtToken);
              commit("SET_NAME", res.data.sysUser.realName);
              resolve(res);
            } else {
              reject(res);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }).catch(e => {
        console.log(e)
      });
    }
    // 退出登录
    // LoginOut({ commit }) {
    //   return new Promise((resolve, reject) => {
    //     loginOut()
    //       .then(res => {
    //         if (res.code === 200) {
    //           commit("LOGIN_OUT");
    //           resolve(res);
    //         } else {
    //           reject(res);
    //         }
    //       })
    //       .catch(error => {
    //         console.log(error);
    //       });
    //   });
    // },
    // // 前端登出
    // webLoginOut({ commit }) {
    //   return new Promise(resolve => {
    //     commit("LOGIN_OUT");
    //     resolve();
    //   });
    // }
  },
  modules: {}
});
