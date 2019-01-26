import {FormatDate} from '../../common/utils.js'
import {removeCookie} from "../../common/utils";
export default {
  name: "Head",
  data(){
    return{
      tit:'',
      date: '',
      clock:'',
      options: [{
        value: '选项1',
        label: '启皓北京'
      }, {
        value: '选项2',
        label: '平安金融中心'
      }, {
        value: '选项3',
        label: '京城大厦'
      }],
        value: '',
      optionArea:[]
      }
  },
  computed: {
    headTitle() {
      return this.$store.state.header.headTitle
    }
  },
  mounted() {
    // console.log(this.$store.state.header.headTitle, 'this.$store');
    let _this = this;
    setInterval(function () {
      _this.date = FormatDate((new Date()).getTime(),'HH:mm:ss')
    },1000)


  },
  methods: {
    aaa(){
      console.log('aa');
    },
    logOut() {
      console.log('aa');
      this.$http.post('/Manage/Login/LoginOut', {
        'User_Id': window.localStorage.getItem('userId')
      }).then((data) => {
        console.log(data);
        removeCookie('tsl_token')
        window.localStorage.removeItem('userId')
        window.localStorage.removeItem('insertTime')
        this.$router.push('/login')
      })
    }

  }


}
