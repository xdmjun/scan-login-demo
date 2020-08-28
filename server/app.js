const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()
const bodyParser = require('koa-bodyparser')
const rp = require('request-promise')
const config = require('./config.js')
const ModelDb = require('./db')
const moment = require('moment')

app.use(bodyParser())

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.body = {
      code: -1,
      data: ctx.data,
      msg: ctx.msg || err.message || '服务开小差了，请稍后再试',
      etime: Date.now()
    }
  }
})

app.use(async (ctx, next) => {
  await next()
  ctx.set('Content-Type', 'application/json')
  if (!ctx.body) {
    ctx.body = {
      code: ctx.code || 0,
      data: ctx.data,
      msg: ctx.msg || 'success',
      etime: Date.now()
    }
  }
})

router.get('/', async (ctx, next) => {
  ctx.data = 'demo api'
  await next()
})

router.get('/uuid', async (ctx, next) => {
  let uuid = ctx.query.uuid
  let data = await ModelDb.query({ uuid: uuid })
  let unionid = data[0] ? data[0].unionid : ''
  let nickname = data[0] ? data[0].nickname : ''
  let avatar = data[0] ? data[0].avatar : ''
  let openid = data[0] ? data[0].openid : ''
  ctx.data = { unionid: unionid, nickname: nickname, avatar: avatar, openid: openid }
  await next()
})

router.post('/login', async (ctx, next) => {
  let unionid = ctx.request.body.unionid
  let record = await ModelDb.query({ unionid: unionid })
  let nickname = record[0] ? record[0].nickname : '',
    openid = record[0] ? record[0].openid : ''

  let opts = {
    url:
      'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' +
      config.appId +
      '&secret=' +
      config.appSecret
  }

  let res = await rp(opts)
  res = JSON.parse(res)
  let token = res.access_token

  let params = {
    touser: openid,
    template_id: config.template_id,
    url: config.url,
    data: {
      first: {
        value: '您已成功登录',
        color: '#173177'
      },
      keyword1: {
        value: nickname,
        color: '#173177'
      },
      keyword2: {
        value: moment().format('YYYY-MM-DD HH:mm:ss'),
        color: '#173177'
      },
      remark: {
        value: '如非本人操作，请尽快联系管理员！',
        color: '#173177'
      }
    }
  }

  ctx.data = await rp({
    method: 'POST',
    url: `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${token}`,
    body: JSON.stringify(params)
  })
  await next()
})

router.post('/unionid/add', async (ctx, next) => {
  let { uuid, unionid, nickname, openid, avatar } = ctx.request.body
  ctx.data = await ModelDb.save({ uuid: uuid, unionid: unionid, openid: openid, nickname: nickname, avatar: avatar })
  await next()
})

router.get('/unionid', async (ctx, next) => {
  try {
    let grant_type = 'authorization_code'
    let appid = config.appId
    let secret = config.appSecret
    let code = ctx.query.code
    console.log('req code: ', code)
    let opts = {
      url:
        'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' +
        appid +
        '&secret=' +
        secret +
        '&code=' +
        code +
        '&grant_type=' +
        grant_type
    }
    let res = await rp(opts)
    res = JSON.parse(res)
    let openid = res.openid
    let token = res.access_token

    let unionidOpts = {
      url: `https://api.weixin.qq.com/sns/userinfo?access_token=${token}&openid=${openid}&lang=zh_CN`
    }
    let data = await rp(unionidOpts)
    data = JSON.parse(data)
    ctx.data = { unionid: data.unionid, nickname: data.nickname, openid: data.openid, avatar: data.headimgurl }
  } catch (e) {
    console.log(e)
  }
  await next()
})

app.use(router.routes())
app.use(router.allowedMethods())

let server = app.listen(2000, function() {
  let host = server.address().address
  let port = server.address().port
  console.log('应用实例，访问地址为 http://localhost:%s', port)
})
