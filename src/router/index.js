import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  {
    path: '/order',
    component: Layout,
    name: '订单',
    meta: { title: '订单管理', icon: 'list' },
    children: [
      {
        path: 'list',
        name: '订单列表',
        component: () => import('@/views/order/list'),
        meta: { title: '订单列表', icon: 'list' },

      },
      {
        hidden: true,
        path: 'manualAdd',
        name: '手动录入订单详情',
        component: () => import('@/views/order/addDetail/manualAdd'),
        meta: { title: '手动录入订单详情', icon: 'table' }
      },
      {
        hidden: true,
        path: 'createDelivery',
        name: '创建送货单',
        component: () => import('@/views/order/createDelivery'),
        meta: { title: '创建送货单', icon: 'table' }
      },
      {
        path: 'detail',
        name: '订单详情',
        hidden: true,
        component: () => import('@/views/order/detail'),
        meta: { title: '订单详情', icon: 'table' }
      }
    ]
  },
  {
    path: '/bill',
    component: Layout,
    name: '送货单',
    children: [
      {
        path: 'list',
        name: '送货单列表',
        component: () => import('@/views/bill/list'),
        meta: { title: '送货单列表', icon: 'form' }
      },
      {
        path: 'detail',
        name: '送货单详情',
        hidden: true,
        component: () => import('@/views/bill/detail'),
        meta: { title: '送货单详情', icon: 'table' }
      }
    ]
  },
  {
    path: '/customer',
    component: Layout,
    name: '客户管理',
    meta: { title: '客户管理', icon: 'table' },
    children: [
      {
        path: 'list',
        name: '客户列表',
        component: () => import('@/views/customer/list'),
        meta: { title: '客户列表', icon: 'user' }
      }
    ]
  },
  {
    path: '/dic',
    component: Layout,
    name: '字典管理',
    meta: { title: '字典管理', icon: 'table' },
    children: [
      {
        path: 'format',
        name: '规格管理',
        component: () => import('@/views/format/list'),
        meta: { title: '规格管理', icon: 'user' }
      }, {
        path: 'qita',
        name: '其他管理',
        component: () => import('@/views/format/list'),
        meta: { title: '其他管理', icon: 'user' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
