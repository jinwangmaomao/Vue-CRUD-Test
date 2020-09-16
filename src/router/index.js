import Vue from 'vue'
import Router from 'vue-router'
import Home from "../components/Home";
import Add from "../components/Add";

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', component: Home},
        {path: '/add', component: Add}

  ]
})
