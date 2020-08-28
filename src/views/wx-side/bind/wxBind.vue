<template>
  <div class="tip-box">
    <div class="tip">
      <div v-if="bindResult">
        <van-icon v-if="!err" name="passed" size="60" color="#07c160" />
        <van-icon v-else name="close" size="60" color="#ee0a24" />
      </div>
      <van-loading v-else type="spinner" size="24px" />
      <div class="txt">{{msg}}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getUnionid, bindUnionid, addUnionid } from '@/api/user'
export default {
  computed: {
    ...mapGetters(['user'])
  },
  data() {
    return {
      msg: '加载中，请稍候...',
      unionid: '',
      err: false,
      bindResult: false
    }
  },
  created() {
    let code = this.$route.query.code || ''
    let uuid = this.$route.query.uuid || ''

    if (code != undefined && code != '') {
      this.unionid = this.user.base.unionid
      let nickname = this.user.base.nickname
      let openid = this.user.base.openid
      let avatar = this.user.base.avatar

      let params = { unionid: this.unionid }
      if (uuid != undefined) {
        params.uuid = uuid
      }
      if (nickname != undefined) {
        params.nickname = nickname
      }
      if (openid != undefined) {
        params.openid = openid
      }
      if (avatar != undefined) {
        params.avatar = avatar
      }

      addUnionid(params)
        .then(res => {
          this.msg = '扫码成功'
          this.bindResult = true
          this.$store.dispatch('user/setWxLoginStatus', 0)
        })
        .catch(err => {
          let e = err.toString()
          this.err = true
          this.msg = e.split(':')[1]
          this.bindResult = true
          this.$store.dispatch('user/setWxLoginStatus', 0)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.tip-box {
  padding: 30% 0;
  background: #fff;
  height: 100%;
  .tip {
    text-align: center;
    .txt {
      margin-top: 15px;
      font-size: 18px;
      font-weight: bold;
    }
  }
}
</style>