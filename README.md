# wx-login-demo
基于网页授权的微信扫码登录Demo

## 使用技术
- vue:2.6.11
- vuex:3.1.2
- vue-router:3.1.5
- vue-qr:2.2.1
- element-ui:2.13.0
- vant:2.5.3
- koa:2.11.0
- mongodb:3.6.0

## Demo演示
<http://scancode.xuedingmiao.com>

## 安装

### web端
env配置
```
ENV = 'development'
VUE_APP_BASE_API = 'http://localhost:2000'

#appid 可填入申请的测试公众号id或者其它准备好的ID
VUE_APP_WECHAT_APPID=''

#authUrl 网页授权中间页
VUE_APP_WECHAT_AUTH_URL='自己的域名/auth.html'
```
项目部署到服务器上之后可访问auth.html(即public目录下的auth.html)

安装依赖
```
npm install
```

开发
```
npm run serve
```

访问
```
http://localhost:9555
```
web端默认使用9555端口

### 公众号配置(不要忘记)
- 授权回调页面域名
    - 项目基于网页授权实现的扫码登录，所以需要在公众号管理后台修改网页授权获取用户基本信息的 **[授权回调页面域名](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html)** 
- 模板消息
    - 如果需要发送登录模板消息则要添加下可用的登录提醒模板

### 服务端
- koa
- mongodb(阿里云公开镜像)  

执行```run-mongo.sh```脚本完成mongodb容器启动  
创建数据库runoob(可使用adminmongo图形化界面操作)

安装依赖
```
cd server
npm install
```

配置公众号，复制一份config.sample.js重命名为config.js填好如下配置  
```js
module.exports = {
  db: '', // mongodb的连接地址
  url: '', // 模板消息点击跳转地址
  template_id: '', // 模板消息ID
  appId: '', // 公众号appid
  appSecret: '' // 公众号secrect
}
```

启动服务
```
node app.js
```

访问地址
```
http://localhost:2000
```
服务端接口使用2000端口

![](https://visitor-badge.glitch.me/badge?page_id=xuedingmiaojun.scan-login-demo)

