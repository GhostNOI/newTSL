<template>
  <div id="login">
    <div class="login-form-wrap">
      <div class="login-form">
        <div class="title">
          <span>登录</span>
        </div>
        <div class="form-input">
          <el-input
            placeholder="手机号"
            v-model="phoneNumber"

            @focus="phoneFocus"
            clearable>
          </el-input>
          <br/>
          <span v-if="flagPhone" style="color: red;display: inline-block;">请输入手机号</span>
          <span v-if="ifPhone" style="color: red;display: inline-block">请输入正确的手机号</span>

        </div>
        <div class="form-input">
          <el-input
            placeholder="密码"
            v-model="password"
            type="password"
            clearable>
          </el-input>
          <span v-if="isReal" style="color: red;display: inline-block">{{errorTip}}</span>
          <span v-if="flagPassword" style="color: red;">请输入密码</span>
          <span v-if="phoneLock" style="color: red;display: inline-block">帐号已锁定请选择“忘记密码”解锁</span>
        </div>
        <div class="login-btn-wrap">
          <button type="button" class="login-btn" @click="login">登录</button>
        </div>
        <br />
        <router-link to="/forget" style="float:left; color: #fff; margin-right: 100px;margin-top: -22px;">忘记密码?</router-link>


      </div>
    </div>
  </div>
</template>

<script src="./Login.js">

</script>

<style scoped lang="scss" src="./Login.scss">

</style>
