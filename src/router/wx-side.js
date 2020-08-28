const constantWxRoutes = [
  {
    path: '/wx',
    redirect: '/wx_login'
  },
  {
    path: '/wx_login',
    component: () => import('@/views/wx-side/login'),
    meta: { title: '用户登录' }
  },
  {
    path: '/wx/index',
    component: () => import('@/views/wx-side/home'),
    meta: { title: '首页' }
  },
  {
    path: '/wx_bind',
    component: () => import('@/views/wx-side/bind/wxBind'),
    meta: { title: '扫码登录' }
  }
]

export default constantWxRoutes
