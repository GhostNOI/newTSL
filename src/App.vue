<template>
  <div id="app">
    <el-container>
      <router-view/>
    </el-container>
    <div id="sys">
      <el-dialog title="系统信息" :visible.sync="sysInfo" custom-class="editor innerShadow">

        <div>
          <div style="color: #fff;">{{sysContent}}</div>
          <div style="color: #fff;">{{sysMessage}}</div>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button type="confirm" @click="sysSure">确 定</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
  import {setCookie,removeCookie,getCookie} from "./common/utils";

  export default {
  name: 'App',
  data () {
    return{
      sysInfo: false,
      sysContent:'',
      sysMessage:'',
      sysId:'',
      timer:null
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
      }
    },
  mounted() {

    // 系统弹窗
    if(window.localStorage.getItem('userId')){
      this.timer = setInterval(() => {
        this.$http.post('/Manage/User/SysAlert',{
          User_Id: window.localStorage.getItem('userId')
        }).then((data) => {
          // console.log(data);
          this.sysContent = data.Data.data.noticeTemple[0].Template_Content
          this.sysMessage = data.Data.data.result[0] ? data.Data.data.result[0].Message : ''
          this.sysId = data.Data.data.result[0] ? data.Data.data.result[0].Id : ''
          if(data.Data.data.result.length > 0){
            this.sysInfo = true
          }
        })
      },90000)
    }



    // this.$http.post('/Manage/Device/index', {User_Id: '1', Project_Code: 'pr5b7135fb814c5ea32d1815a1385001'})
    //   .then((data) => {
    //     console.log(data);
    //   })


    // const http1 = this.$http.post('/Manage/Device/index', {User_Id: '1', Project_Code: 'pr5b7135fb814c5ea32d1815a1385001'});
    // const http2 = this.$http.post('/Manage/Device/DeviceDetails', {User_Id: '1', Project_Code: 'pr5b7135fb814c5ea32d1815a1385001'});
    // this.$http.all(http1, http2).then(data => {
    //
    // })

  },
  destroyed() {
    removeCookie('tsl_token')
    if(this.timer){
      clearInterval(this.timer)
    }
  }
}
</script>

<style>

</style>
