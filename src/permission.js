import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { judgeSide } from '@/utils/index'
import getPageTitle from '@/utils/get-page-title'
import wechatAuth from '@/plugins/wechatAuth'
import qs from 'qs'

// 设置APPID
wechatAuth.setAppId(process.env.VUE_APP_WECHAT_APPID)
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/index', '/logout', '/wx']

const wxWhiteList = ['/wx/index', '/wx_login', '/wx_bind']

router.beforeEach(async (to, from, next) => {
  // 页面定位到顶部
  // chrome
  document.body.scrollTop = 0
  // firefox
  document.documentElement.scrollTop = 0
  // safari
  window.pageYOffset = 0

  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)

  const side = judgeSide(to.path)

  if (side == 1) {
    if (whiteList.indexOf(to.path) !== -1 || to.path === '/') {
      next()
    } else {
      next(`/`)
      NProgress.done()
    }
  } else {
    // fix H5重复点击微信登录时code重复添加
    if (to.query.code) {
      if (to.query.code.length === 2) {
        to.query.code = to.query.code.pop()
      }
    }
    if (to.path === '/wx_bind') {
      // 微信端网页授权状态判断及跳转
      const { wxLoginStatus } = store.getters
      // 0未授权 1授权
      switch (Number(wxLoginStatus)) {
        case 0:
          // 获取跳转地址
          wechatAuth.redirect_uri = processUrl()
          await store.dispatch('user/setWxLoginStatus', 1)
          window.location.replace(wechatAuth.authUrl)
          break
        case 1:
          try {
            wechatAuth.returnFromWechat(window.location.href)
            const code = wechatAuth.code
            if (code != undefined) {
              // 通过code换取token
              await store.dispatch('user/getUserUnionid', code)
            }
            if (process.env.NODE_ENV !== 'development' && router.mode === 'hash') {
              window.location.href = window.location.origin + window.location.pathname + window.location.hash
            } else {
              next()
            }
          } catch (err) {
            await store.dispatch('user/setWxLoginStatus', 0)
            next('/wx')
          }
          break
        case 2:
          next()
          break
        default:
          break
      }
    }

    if (to.path === '/') {
      return next('/wx')
    }

    if (wxWhiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next({ path: '/wx_login', replace: true })
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

router.onError(error => {
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  const targetPath = router.history.pending.fullPath
  if (isChunkLoadFailed) {
    router.replace(targetPath)
  }
})

/**
 * 处理url链接
 * @returns {string}
 */
function processUrl() {
  // 本地环境拿code
  if (process.env.NODE_ENV === 'development') {
    // 中间授权页地址
    return `${process.env.VUE_APP_WECHAT_AUTH_URL}?backUrl=${window.location.href}`
  }
  const url = window.location.href
  // 解决多次登录url添加重复的code与state问题
  const urlParams = qs.parse(url.split('?')[1])
  let redirectUrl = url
  if (urlParams.code && urlParams.state) {
    delete urlParams.code
    delete urlParams.state
    const query = qs.stringify(urlParams)
    if (query.length) {
      redirectUrl = `${url.split('?')[0]}?${query}`
    } else {
      redirectUrl = `${url.split('?')[0]}`
    }
  }
  return redirectUrl
}
