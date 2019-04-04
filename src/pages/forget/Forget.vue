<template>
  <div id="login">

    <!-- 发送验证码验证手机号 -->
    <div v-if="showCode" class="login-form-wrap">
      <div class="login-form">
        <div class="title">
          <span>验证手机号</span>
        </div>
        <div class="form-input">
          <el-input
            placeholder="手机号"
            v-model="phoneNumber"
            @focus="phoneFocus"
            clearable>
          </el-input>
          <span v-if="flagPhone" style="color: red; display: inline-block;">请输入手机号</span>
          <span v-if="ifPhone" style="color: red; display: inline-block">请输入正确的手机号</span>
        </div>
        <div class="form-input">
          <div class="code">
            <el-input
              placeholder="验证码"
              v-model="code"
              type="text"
              clearable>
            </el-input>
            <span v-if="getCode" style="float:left;line-height: 36px;color: #437bf2;cursor: pointer;" @click="getValidCode">获取验证码</span>
            <span v-if="reGetCode" style="float:left;line-height: 36px;color: #ccc;cursor: no-drop;">{{count}}秒后重新获取</span>
          </div>
          <span v-if="isReal" style="color: red;display: inline-block">{{errorTip}}</span>
          <span v-if="flagPassword" style="color: red;">请输入验证码</span>
        </div>
        <span v-if="ifTip" style="color: red;float:left;width: 100%;margin-bottom: 20px;">{{tips}}</span>
        <div class="login-btn-wrap">
          <button type="button" class="login-btn" @click="next1">下一步</button>
        </div>

      </div>
    </div>

    <!-- 设置密码 -->
    <div class="login-form-wrap" v-if="showSetPwd">
      <div class="login-form">
        <div class="title">
          <span>设置密码</span>
        </div>
        <div class="form-input">
          <el-input
            maxlength="20"
            placeholder="设置新密码（请输入8-20位字符，包含大小写字母与数字）"
            type="password"
            v-model="newPassword"
            @focus="phoneFocus"
            clearable>
          </el-input>

        </div>
        <div class="form-input">
          <el-input
            maxlength="20"
            placeholder="确认新密码（请输入8-20位字符，包含大小写字母与数字）"
            v-model="confirmPassword"
            type="password"
            clearable>
          </el-input>
          <span v-if="isReal" style="color: red;display: inline-block">{{errorTip}}</span>
          <span v-if="flagPassword" style="color: red;">请输入密码</span>
        </div>
        <span v-if="ifTipSetPwd" style="color: red;float:left;width: 100%;margin-bottom: 20px;">{{tipsSetPwd}}</span>
        <div class="login-btn-wrap">
          <button type="button" class="login-btn" @click="next2">下一步</button>
        </div>
      </div>
    </div>

    <!-- 成功设置密码 -->
    <div class="login-form-wrap" v-if="showSuccess">
      <div class="login-form">
        <div class="title">
          <span>设置密码</span>
        </div>
        <div style="margin-bottom: 30px;margin-left: 20px;margin-top: 30px;">
          <img src="../../assets/img/forget_password.png" alt="">
        </div>
        <div class="login-btn-wrap">
          <button type="button" class="login-btn" @click="toLogin">立即登录</button>
        </div>
      </div>
    </div>




  </div>
</template>

<script src="./Forget.js">

</script>

<style scoped lang="scss" src="./Forget.scss">

</style>
