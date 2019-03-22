<template>
  <div id="app">
    <el-container>
      <router-view/>
    </el-container>
    <div id="sys">
      <!--<el-dialog title="系统信息" :visible.sync="sysInfo" custom-class="editor innerShadow">-->

        <!--<div>-->
          <!--<div style="color: #fff;">{{sysContent}}</div>-->
          <!--<div style="color: #fff;">{{sysMessage}}</div>-->
        <!--</div>-->

        <!--<div slot="footer" class="dialog-footer">-->
          <!--<el-button type="confirm" @click="sysSure">确 定</el-button>-->
        <!--</div>-->
      <!--</el-dialog>-->
        <!--<div style="position: absolute;z-index:1000;top: 0;left: 0;bottom: 0;right: 0;margin: auto;" v-if="showAlert" @click="anyPosition">-->
          <div class="sysalert" v-if="showAlert">
            <p class="title">预警通知</p>
            <span class="close" @click="closeAlert">ｘ</span>
            <div class="d-line"></div>
            <div class="body">
              <!--<span class="time">{{date | transformDate}}</span>-->
              <span class="time">{{alertDate | transformDate}}</span> ⚠️<br />
              <!--<span class="detail">「｛第五中学｝」-｛预警类型｝（｛预警等级｝）：</span><br />-->
              <span class="detail">「{{projectName}}」-{{warningType}}（{{warningLevel}}）：</span><br />
              <!--<span class="detail">｛事件主体｝｛预警事件｝</span>-->
              <span class="detail">{{eventSub}}   {{warningEvent}}</span>
            </div>
            <div class="check">
              <span style="cursor:pointer;" @click="toWarningEvent">查看</span>
            </div>
          </div>
        <!--</div>-->
      </div>


  </div>
</template>

<script>
  import {setCookie,removeCookie,getCookie} from "./common/utils";
  import {transformDate} from "./common/filters"
  export default {
  name: 'App',
  data () {
    return{
      sysInfo: false,
      sysContent:'',
      sysMessage:'',
      sysId:'',
      timer:null,
      alertDate:'',
      projectName:'',
      warningType:'',
      warningLevel:'',
      eventSub:'',
      warningEvent:'',
      showAlert:false,
      obj:{}
    }
  },
    methods: {
      sysSure() {
        this.$http.post('/Manage/User/SysAlertUpdate',{
          User_Id:window.localStorage.getItem('userId'),
          Id:this.sysId
        }).then((data) => {
          // console.log(data);
          if(data.Data.code == 0){
            this.sysInfo = false
          }
        })
      },
      closeAlert() {
        this.showAlert = false
      },
      anyPosition() {
        this.showAlert = false
      },
      toWarningEvent(){
        console.log(this.obj)
        this.$http.post('/Manage/User/SysAlertUpdate',{
          User_Id:window.localStorage.getItem('userId'),
          Id:this.obj.Id
        }).then((data) => {
          if(+data.Data.code === 0){
            if(+this.obj.Warning_Group === 2){
              this.$router.push({
                path:`/project-index/${this.$route.params.id}/slowlog`,
                query:this.obj
              })
            }else if(+this.obj.Warning_Group === 3){
              this.$router.push({
                path:`/project-index/${this.$route.params.id}/errorLog`,
                query:this.obj
              })
            }else{
              this.$router.push({
                path:`/project-index/${this.obj.Project_Code}/warningevent`
              })
            }
            this.showAlert = false
          }else{
            window.alert('系统繁忙请稍后再试')
          }
        })
      }
    },
  mounted() {
    // 系统弹窗
    this.timer = setInterval(() => {
      if(window.localStorage.getItem('userId')){
        this.$http.post('/Manage/User/SysAlert',{
          User_Id: window.localStorage.getItem('userId')
        }).then((data) => {
          // console.log(data);
          if(data.Data.data){
            this.obj = data.Data.data.result[0]
            this.alertDate = data.Data.data.result[0].Warning_Time
            this.projectName = data.Data.data.result[0].Project_Name
            this.warningType = data.Data.data.result[0].Warning_Group_Name
            this.warningLevel = data.Data.data.result[0].Level_Name
            this.eventSub = data.Data.data.result[0].Source_Type_Name
            this.warningEvent = data.Data.data.result[0].Message
            this.showAlert = true
            // this.sysContent = data.Data.data.noticeTemple && data.Data.data.noticeTemple.length > 0 ? data.Data.data.noticeTemple[0].Template_Content : ''
            // this.sysMessage = data.Data.data.result && data.Data.data.result.length > 0 ? data.Data.data.result[0].Message : ''
            // this.sysId = data.Data.data.result && data.Data.data.result.length ? data.Data.data.result[0].Id : ''
            // if(data.Data.data.result.length > 0){
            //   this.sysInfo = true
            // }
            // if(window.localStorage.getItem('userId') === null){
            //   this.sysInfo = false
            // }
          }
        })
      }
    },90000)


  },
    filters : {
      transformDate : transformDate
    },
  destroyed() {
    removeCookie('tsl_token')
    if(this.timer){
      clearInterval(this.timer)
    }
  }
}
</script>

<style scoped>
  .sysalert{
    padding: 10px;
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 20%;
    height: 280px;
    border: 1px solid #ff6634;
    z-index: 9999;
    background: #100f16;
    -moz-box-shadow:0px 0px 40px 1px rgb(255,102,52) inset;
    -webkit-box-shadow:0px 0px 40px 1px rgb(255,102,52) inset;
    box-shadow:0px 0px 40px 1px rgb(255,102,52) inset;
  }
  .title{
    color: #ff6634;
    padding-left: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    float: left;
  }
  .d-line{
    border-top: 1px solid #24253a;
    float: left;
    width: 100%;
  }
  .body{
    padding-left: 20px;
    float: left;
    width: 78%;
  }
  .check{
    float: right;
    width: 10%;
    color: #ff6634;
    padding-top: 30px;
    padding-right: 10px;
  }
  .time{
    color: #fff;
  }
  .detail{
    color: #fff;
  }
  .close{
    float: right;
    color: #fff;
    cursor: pointer;
  }
</style>
