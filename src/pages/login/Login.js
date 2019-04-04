import {setCookie, getCookie, removeCookie} from "../../common/utils";
import axios from 'axios'
import {MOBILE} from '../../common/pattern.js';


export default {
  name: "Login",
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
      failNum:0,
      phoneLock:false
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
      this.phoneLock = false

    },
    login () {
      if(this.phoneNumber == ''){
        this.flagPhone = true
      }else if(this.password == ''){
        this.flagPassword = true
      }else if(!MOBILE.test(this.phoneNumber)){
        this.ifPhone = true
      }else{
        this.$http.post('/Manage/Login/Login',{
          Phone:this.phoneNumber,
          Password:this.password
        }).then( (data) => {
          // console.log(data);
          if(data.Data.code === 0){
            this.failNum = 0;
            let token = data.Data.data.token;
            setCookie(token);
            window.localStorage.setItem('roleId',data.Data.data.roleMsg[0].Role_Id);
            window.localStorage.setItem('userId',data.Data.data.User_Id);
            window.localStorage.setItem('insertTime',data.Data.data.toeknTime);
            window.localStorage.setItem('phone',this.phoneNumber);
            this.$router.push({path:'/index'})
          } else{
            this.isReal = true;
            this.errorTip = data.Data.msg;
            // this.failNum ++
            // if(this.failNum >= 5){
            //   this.phoneLock = true;
            //   this.flag = false;
            //   this.flagPhone = false;
            //   this.ifPhone = false;
            //   this.flagPassword = false;
            //   this.isReal = false;
            // }
          }
        })
      }
    },

  }
}
