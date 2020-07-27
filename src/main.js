import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

import {
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Form,
  FormItem,
  Input,
  Button,
  Select,
  Col,
  Option,
  DatePicker,
  Table,
  TableColumn,
  Tooltip,
  Pagination,
  Container,
  Header,
  Aside,
  Main,
  Radio,
  RadioGroup,
  Row,
  Dialog,
  Message,
  Breadcrumb,
  BreadcrumbItem,
  CheckboxGroup,
  Checkbox,
  Loading,
  Tree,
  RadioButton,
  Popconfirm,
  Popover,
  Tag
} from "element-ui";

Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);
Vue.use(Select);
Vue.use(Col);
Vue.use(Option);
Vue.use(DatePicker);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Tooltip);
Vue.use(Pagination);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Row);
Vue.use(Dialog);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(CheckboxGroup);
Vue.use(Checkbox);
Vue.use(Loading);
Vue.use(Tree);
Vue.use(RadioButton);
Vue.use(Popconfirm);
Vue.use(Popover);
Vue.use(Tag);
Vue.prototype.$message = Message;
import "@/styles/index.stylus";

// router.beforeEach((to, from, next) => {
//   if (!store.state.UserToken) {
//     next('/')
//   }
// })

router.beforeEach((to, from, next) => {
  /* 必须调用 `next` */
  router.options.routes.forEach(item => {
    if (item.path === '/home') {
      store.dispatch('Set_Menu', item.children)
    }
  })
  store.commit('SET_CURRENTMENU', to.path.slice(6))
  next()
})




new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
