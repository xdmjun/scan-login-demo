<template>
  <div class="page">
    <div class="content">
      <img :src="require('@/assets/tip.png')" alt />
      <div class="tip">{{user.base.nickname?user.base.nickname:''}}您已登录成功</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {}
  },
  name: 'home',
  components: {},
  computed: {
    ...mapGetters(['user'])
  },

  methods: {},
  created() {}
}
</script>

<style lang="less" scoped>
.page {
  height: 100%;
  background: #fff;
}
.content {
  padding-top: 60px;
  text-align: center;
  .tip {
    margin-top: 5px;
  }
}
</style>