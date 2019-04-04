import Head from '../../components/head/Head.vue'
import {PASSWORD} from '../../common/pattern.js'

export default {
  name: "ProjectIndex",
  data() {
    return {
      projectList: [],
      defaultOpeneds: [],
      changePass:false,
      newPassword:'',
      confirmPassword:'',
      phone:window.localStorage.getItem('phone'),
      ifTips:false,
      tips:'',
      oldPassword:''
    }
  },
  mounted(){
    this.defaultOpeneds = [this.$route.params.id];
    this.$http.post('/Manage/User/index', {
      'User_Id':window.localStorage.getItem('userId')
    }).then((data) => {
      // console.log(data);
      this.projectList = data.Data.data.projectList ? data.Data.data.projectList : []
      this.$store.commit('changeHeadData', this.projectList);
    })
  },
  methods: {
    handleOpen(key, keyPath) {
      //console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      //console.log(key, keyPath);
    },
    showFarme (val) {
      // console.log(val);
      this.changePass = val
    },
    changePassowrd () {
      if(this.oldPassword === ''){
        this.ifTips = true;
        this.tips = '请输入旧密码'
      } else if(this.newPassword === ''){
        this.ifTips = true;
        this.tips = '请输入新密码'
      } else if(this.confirmPassword === ''){
        this.ifTips = true;
        this.tips = '请输入确认密码'
      } else if(this.newPassword.length < 8 || this.newPassword > 20){
        this.ifTips = true;
        this.tips = '请输入8-20位的密码'
      } else if(this.confirmPassword != this.newPassword){
        this.ifTips = true;
        this.tips = '两次输入的新密码不一致'
      } else if(!PASSWORD.test(this.newPassword)){
        this.ifTips = true;
        this.tips = '密码需包含大小写字母和数字'
      } else {
        this.$http.post('/Manage/Login/UpdatePassword',{
          'User_Id':window.localStorage.getItem('userId'),
          'Phone':window.localStorage.getItem('phone'),
          'Password':this.newPassword,
          'OldPassword':this.oldPassword
        }).then((data) => {
          // console.log(data);
          if(+data.Data.code === 0){
            this.changePass = false
          }else if(+data.Data.code === 2){
            this.ifTips = true;
            this.tips = '旧密码不正确'
          } else{
            this.ifTips = true;
            this.tips = '修改密码失败'
          }
        })
      }
    },
    //关闭弹框
    closeDialog () {
      this.tips = '';
      this.ifTips = '';
      this.oldPassword = '';
      this.newPassword = '';
      this.confirmPassword = ''
    }
  },
  components:{
    'v-head':Head
  }

}
