import {FormatDate} from "../../common/utils";
import {removeCookie} from "../../common/utils";

export default {
  name: "HeadMap",
  data () {
    return{
      tit:'',
      date: '',
      clock:'',
      value: '',
      optionArea:[],
      areaVal:[],
      projectList:[],
    }
  },
  methods:{
    areaChange(val){
      console.log(val);
      if(!val && this.areaVal.length>0){
        this.$http.post('/Manage/User/index',{
          User_Id :1,
          Province_Code: this.areaVal[0],
          City_Code: this.areaVal[1] ? this.areaVal[1] : null,
          Area_Code: this.areaVal[2] ? this.areaVal[2] : null,
        }).then((data) => {
          console.log(data);
          this.projectList = data.Data.data.projectList;
        })
      }
    },
    logout(){
      removeCookie('tsl_token')
      this.$router.push('/index')
    }
  },
  mounted () {
    let _this = this;

    setInterval(function () {
      _this.date = FormatDate((new Date()).getTime(),'HH:mm:ss')
    },1000)


    this.$http.post('/Manage/User/ThreeLevelLinkage',{
      User_Id:'1'
    }).then( (data) => {
      //console.log(data.Data);
      this.optionArea = data.Data.threeLevelLinkage
      //console.log(this.optionArea);
    })
  }
}
