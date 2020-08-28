<template>
  <div class="app-container">
    <van-form @submit="onSubmit">
      <van-field
        v-model.trim="mobile"
        name="mobile"
        class="field"
        label-width="50"
        label-class="label"
        maxlength="11"
        label="+86"
        placeholder="请输入账号的手机号码"
        :rules="[
          { required: true, message: '手机号码不得为空' },
          { validator: mobileValidator, message: '手机号码格式不正确' }
        ]"
      />

      <van-field
        v-model.trim="pwd"
        name="pwd"
        type="password"
        class="field"
        label-width="50"
        label-class="label"
        label="密码"
        placeholder="请输入密码"
        :rules="[
          { required: true, message: '密码不得为空' }
        ]"
      >
        <template #button>
          <span class="forget-pwd">忘记密码</span>
        </template>
      </van-field>

      <van-button
        block
        type="info"
        native-type="submit"
        class="mt20 br5 submit-btn"
        :disabled="loading"
        :loading="loading"
        loading-type="spinner"
        loading-text="请求中..."
      >登录</van-button>
    </van-form>

    <div class="other-op">
      <div>
        <span>注册账号</span>
      </div>
      <div>
        <span>激活账号</span>
      </div>
    </div>

    <div class="other-login">
      <div class="title">其他方式登录</div>
      <router-link to="/wx_bind">
        <img src="@/assets/wx-login.png" class="wx-logo" alt="微信登录" />
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Toast } from 'vant'
export default {
  components: {},
  data() {
    return {
      mobile: '',
      pwd: '',
      loading: false
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    mobileValidator(val) {
      return /^1\d{10}$/.test(val)
    },
    onSubmit() {
      this.loading = true
      Toast({ message: '假的，不用点了' })
    }
  },
  created() {
    this.$store.dispatch('user/setWxLoginStatus', 0)
    let code = this.$route.query.code || ''
    if (code != '') {
      Toast({ message: '快捷登录中，请稍候...', duration: 0 })
      this.$store.dispatch('user/getUserUnionid', code).then(() => {
        Toast.clear()
        let unionid = this.user.base.unionid
        if (unionid) {
          this.$router.replace('/wx/index')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .van-field__control::placeholder {
  color: #b6bbc0;
}
.app-container {
  padding: 20px 15px;
  background: #fff;
  height: 100%;
  .field {
    padding: 15px 0;
    background-color: transparent;
    border-bottom: 1px solid #f0f1f2;
    &::after {
      display: none;
    }
    /deep/ .label {
      color: #444;
    }
  }
  .forget-pwd {
    color: #649cee;
  }
  .other-op {
    margin-top: 20px;
    display: flex;
    align-items: center;
    font-size: 14px;
    > div {
      flex: 1;
      padding: 0 15px;
      color: #649cee;
      &:first-child {
        text-align: right;
        position: relative;
        &::after {
          content: '';
          background: #dcdfe6;
          position: absolute;
          right: 0;
          width: 1px;
          height: 100%;
          display: inline-block;
        }
      }
      &:last-child {
        text-align: left;
      }
    }
  }
  .other-login {
    position: fixed;
    bottom: 30px;
    text-align: center;
    margin: 0 -15px;
    padding: 0 15px;
    width: 100%;
    .title {
      color: #dcdfe6;
      position: relative;
      font-size: 14px;
      &:before {
        position: absolute;
        left: 0;
        top: 50%;
        content: '';
        width: 100px;
        height: 1px;
        background: #dcdfe6;
        display: inline-block;
      }
      &:after {
        position: absolute;
        right: 0;
        top: 50%;
        content: '';
        width: 100px;
        height: 1px;
        background: #dcdfe6;
        display: inline-block;
      }
    }
    .wx-logo {
      margin-top: 20px;
      width: 36px;
      height: 36px;
      border-radius: 100%;
      cursor: pointer;
    }
  }
}
</style>