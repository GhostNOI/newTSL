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
            <p class="title">预警通知 <span v-if="num > 0">（{{num}}）</span></p>
            <span class="close" @click="closeAlert">ｘ</span>
            <div class="d-line"></div>
            <!--<div class="body">-->
              <!--&lt;!&ndash;<span class="time">{{date | transformDate}}</span>&ndash;&gt;-->
              <!--<span class="time">{{alertDate | transformDate}}</span> ⚠️<br />-->
              <!--&lt;!&ndash;<span class="detail">「｛第五中学｝」-｛预警类型｝（｛预警等级｝）：</span><br />&ndash;&gt;-->
              <!--<span class="detail">「{{projectName}}」-{{warningType}}（{{warningLevel}}）：</span><br />-->
              <!--&lt;!&ndash;<span class="detail">｛事件主体｝｛预警事件｝</span>&ndash;&gt;-->
              <!--<span class="detail">{{eventSub}}   {{warningEvent}}</span>-->
            <!--</div>-->
            <div class="wrap" style="width: 100%;">
              <div class="body" v-for="(item,i) in obj" :key="i">
                <div class="info">
                  <span class="time">{{item.Warning_Time | transformDate}}</span> ⚠️<br />
                  <span class="detail">「{{item.Project_Name}}」-{{item.Warning_Group_Name}}（{{item.Level_Name}}）：</span><br />
                  <span class="detail">{{item.Source_Type_Name}}   {{item.Message}}</span>
                </div>
                <div class="check">
                  <span style="cursor:pointer;" @click="toWarningEvent(item)">查看</span>
                </div>
              </div>
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
      obj:{},
      num:0,
      Id:[]
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
        //更新接口
        // return
        this.$http.post('/Manage/User/SysAlertUpdate',{
          User_Id:window.localStorage.getItem('userId'),
          Id:this.Id.join(",")
        })
      },
      anyPosition() {
        this.showAlert = false
      },
      toWarningEvent(item){
        console.log(item);
        this.$router.push({
          path:`/project-index/${item.Project_Code}/warningevent`
        });
        this.showAlert = false
        // this.$http.post('/Manage/User/SysAlertUpdate',{
        //   User_Id:window.localStorage.getItem('userId'),
        //   Id:this.obj.Id
        // }).then((data) => {
        //   if(+data.Data.code === 0){
        //     if(+this.obj.Warning_Group === 2){
        //       this.$router.push({
        //         path:`/project-index/${this.$route.params.id}/slowlog`,
        //         query:this.obj
        //       })
        //     }else if(+this.obj.Warning_Group === 3){
        //       this.$router.push({
        //         path:`/project-index/${this.$route.params.id}/errorLog`,
        //         query:this.obj
        //       })
        //     }else{
        //       this.$router.push({
        //         path:`/project-index/${this.obj.Project_Code}/warningevent`
        //       })
        //     }
        //     this.showAlert = false
        //   }else{
        //     window.alert('系统繁忙请稍后再试')
        //   }
        // })
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
            data.Data.data.result.forEach(item => {
              this.Id.push(item.Id)
            });
            this.obj = data.Data.data.result;
            this.num = data.Data.data.result.length;
            if(data.Data.data.result.length > 0){
              this.showAlert = true
              //更新接口
              // return
              // this.$http.post('/Manage/User/SysAlertUpdate',{
              //   User_Id:window.localStorage.getItem('userId'),
              //   Id:Id.join(",")
              // })
            } else {
              this.showAlert = false
            }
            // this.obj = data.Data.data.result[0]
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
      }else{
        this.showAlert = false
      }
    },90000)
    // },10000)

  },
  filters : {
    transformDate : transformDate
  },
  watch : {
    $route (newVal) {
      if(newVal.path === '/login'){
        this.showAlert = false
      }
    }
  },
  destroyed() {
    removeCookie('tsl_token');
    if(this.timer){
      clearInterval(this.timer)
    }
  },

}
</script>

<style scoped>
  .sysalert{
    padding: 10px;
    position: absolute;
    bottom: 20px;
    right: 20px;
    /*width: 25%;*/
    width: 400px;
    height: 280px;
    border: 1px solid #ff6634;
    z-index: 9999;
    background: #100f16;
    -moz-box-shadow:0px 0px 40px 1px rgb(255,102,52) inset;
    -webkit-box-shadow:0px 0px 40px 1px rgb(255,102,52) inset;
    box-shadow:0px 0px 40px 1px rgb(255,102,52) inset;
  }
  .info{
    float: left;
    width: 300px;
  }
  .wrap{
    overflow-y: auto;
    float: left;
    height: 220px;
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
    width: 90%;
    margin-bottom: 20px;
  }
  .check{
    float: right;
    width: 50px;
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
