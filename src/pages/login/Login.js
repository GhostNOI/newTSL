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
      ifPhone:false
    }
  },
  mounted() {
    if(getCookie('tsl_token')){
      this.$router.push('/index')
    }
  },
  methods:{

    phoneFocus () {
      this.flag = false
      this.flagPhone = false
      this.ifPhone = false
      this.flagPassword = false
      this.isReal = false

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
          if(data.Data.code === '-3'){
            this.isReal = true
          }else if(data.Data.code === '-4'){
            this.isReal = true
          }else if(data.Data.code === 0){
            let token = data.Data.data.token
            setCookie(token);
            window.localStorage.setItem('roleId',data.Data.data.roleMsg[0].Role_Id)
            window.localStorage.setItem('userId',data.Data.data.User_Id)
            window.localStorage.setItem('insertTime',data.Data.data.toeknTime)
            this.$router.push({path:'/index'})
          }
        })
      }
    },

  }
}
