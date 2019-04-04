import {setCookie, getCookie, removeCookie} from "../../common/utils";
import axios from 'axios'
import {MOBILE,PASSWORD} from '../../common/pattern.js';


export default {
  name: "Forget",
  data () {
    return{
      phoneNumber:'',
      password:'',
      phoneTip:'',
      flagPhone:false,
      flagPassword:false,
      isReal:false,
      ifPhone:false,
      errorTip:'',
      showCode:true,
      showSetPwd:false,
      showSuccess:false,
      code:'',
      timer:null,
      timer2:null,
      count:60,
      getCode:true,
      reGetCode:false,
      ifTip:false,
      tips:'',
      phone:'',
      newPassword:'',
      confirmPassword:'',
      ifTipSetPwd:false,
      tipsSetPwd:''
    }
  },
  mounted() {
    if(getCookie('tsl_token')){
      this.$router.push('/index')
    }
  },
  methods:{

    phoneFocus () {
      this.flag = false;
      this.flagPhone = false;
      this.ifPhone = false;
      this.flagPassword = false;
      this.isReal = false;
      this.ifTipSetPwd = false;
      this.ifTip = false

    },
    login () {

    },
    next1 () {
      if(!MOBILE.test(this.phoneNumber)){
        this.ifTip = true;
        this.tips = '请输入正确格式的手机号';
      } else if (this.phoneNumber === '') {
        this.ifTip = true;
        this.tips = '请输入手机号'
      } else if(this.code === '') {
        this.ifTip = true;
        this.tips = '请填写验证码'
      } else {
        this.$http.post('/Manage/Login/CheckValidCode',{
          'Phone':this.phoneNumber,
          'ValidCode':this.code
        }).then((data) => {
          console.log(data);
          if(+data.Data.code === 0){
            this.phone = this.phoneNumber
            this.showCode = false;
            this.showSetPwd = true;
          }else {
            this.ifTip = true;
            this.tips = '手机号或验证码不正确'
          }
        })
      }
    },
    next2 () {
      if (this.newPassword === ''){
        this.ifTipSetPwd = true;
        this.tipsSetPwd = '请输入新密码'
      } else if(this.confirmPassword === ''){
        this.ifTipSetPwd = true;
        this.tipsSetPwd = '请输入确认密码'
      } else if(this.newPassword != this.confirmPassword){
        this.ifTipSetPwd = true;
        this.tipsSetPwd = '两次输入密码不一致'
      } else if(this.newPassword.length < 8 || this.newPassword.length > 20){
        this.ifTipSetPwd = true;
        this.tipsSetPwd = '请输入8-20位的密码'
      } else if(!PASSWORD.test(this.newPassword)){
        this.ifTipSetPwd = true;
        this.tipsSetPwd = '密码需包含大小写字母和数字'
      } else {
        this.$http.post('/Manage/Login/SetNewPassWord',{
          'Phone':this.phone,
          'NewPassword':this.newPassword
        }).then((data) => {
          if(+data.Data.code === 0) {
            this.showSetPwd = false;
            this.showSuccess = true
            this.timer2 = setInterval(() => {
              this.$router.push('/login')
            },3000)
          } else {
            this.ifTipSetPwd = true;
            this.tipsSetPwd = '修改密码失败'
          }
        })
      }

    },
    toLogin () {
      this.$router.push('/login');
    },
    //获取验证码
    getValidCode () {
      if(!MOBILE.test(this.phoneNumber)){
        this.ifTip = true;
        this.tips = '请输入正确格式的手机号';
      }else if (this.phoneNumber === ''){
        this.ifTip = true;
        this.tips = '请输入手机号'
      }else {
        this.$http.post('/Manage/Login/PasswdValicode',{
          'Phone':this.phoneNumber
        }).then((data) => {
          console.log(data);
          if(+data.Data.code === 0){
            this.getCode = false;
            this.reGetCode = true;
            this.timer = setInterval(() => {
              this.count --;
              if(this.count === 0) {
                this.getCode = true;
                this.reGetCode = false;
                this.count = 60;
                clearInterval(this.timer)
              }
            },1000)
          }else {
            this.ifTip = true;
            this.tips = '获取验证码失败'
          }
        })
      }
    }
  },
  destroyed () {
    if(this.timer){
      clearInterval(this.timer);
    }
    if(this.timer2) {
      clearInterval(this.timer2)
    }
  }
}
