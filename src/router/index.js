import Vue from 'vue';
import Router from 'vue-router';
import Landing from '@/components/Landing';
import Login from '@/components/Login';
import Admin from '@/components/Admin';
import Portfolio from '@/components/Portfolio';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing',
      component: Landing,
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/login/callback/:token',
      name: 'login-callback',
      component: Login,
    },
    {
      path: '/portfolio/:portfolio_id',
      name: 'portfolio',
      component: Portfolio,
    },
    { path: '*', redirect: '/' },
  ],
});
