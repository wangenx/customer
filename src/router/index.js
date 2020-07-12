import Vue from "vue";
import VueRouter from "vue-router";

// 解决两次访问相同路由地址报错
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err);
};

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: () => import("@/components/login/index.vue")
  },
  {
    path: "/home",
    name: "Home",
    redirect: '/home/dispatch',
    component: () => import("@/components/layout/index.vue"),
    children: [
      {
        path: 'dispatch',
        name: 'Dispatch',
        component: () => import('@/views/dispatch/index'),
        meta: {
          name: '派单管理',
          icon: '../../../assets/images/dispatch-icon.png'
        }
      },
      {
        path: 'account',
        name: 'Account',
        component: () => import('@/views/account/index'),
        meta: {
          name: '账号管理',
          icon: '../../../assets/images/account-icon.png'
        }
      },
      {
        path: 'rule',
        name: 'Rule',
        component: () => import('@/views/rule/index'),
        meta: {
          name: '规则管理',
          icon: '../../../assets/images/rule-icon.png'
        }
      },
      {
        path: 'customer',
        name: 'Customer',
        component: () => import('@/views/customer/index'),
        meta: {
          name: '客户管理',
          icon: '../../../assets/images/customer-icon.png'
        }
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
