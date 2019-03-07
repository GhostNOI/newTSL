import {getCookie} from "../../../../../common/utils";
import axios from "axios/index";
import {transformDate,formatSec} from "../../../../../common/filters";

export default {
  name: "WarningLog",
  data () {
    return{
      eventLevel:'',
      eventType:'',
      dealUser:'',
      selectDate:[],
      warningLevel:[],
      warningGroup:[],
      userList:[],
      //表格数据
      warningLogListCount:[],
      howMany: null,
      currentPage:1,
      pageSize:10,
      pageNum:1,
      dialogFormVisible:false,
      //导出记录
      waringLevel:'',
      dayType:'',
      selectDateExport:[],
      user:'',
      waringType:'',
      //修改弹框
      alertEvent:'',
      description:'',
      changeUser:'',
      changeAlertEvent:false,
      id:'',
      tips:'',
      ifTips:false,
      changeTipShow:false,
      changeTip:''
    }
  },
  methods:{
    radioChange(val) {
      // console.log(val);
      if(val != 0){
        this.selectDateExport = []
      }
      // console.log(this.selectDateExport);
    },
    getData() {
      this.$http.post('/Manage/WaringLogs/Index',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id
      }).then((data) => {
        // console.log(data);
        this.warningLevel = data.Data.data.warningLevel
        this.warningGroup = data.Data.data.warningGroup
        this.userList = data.Data.data.userList
        this.warningLogListCount = data.Data.data.warningLogListCount
        this.howMany = data.Data.data.howMany
      })
    },

    handleCurrentChange(val) {
      //页码切换
      this.pageNum = val
      this.$http.post('/Manage/WaringLogs/Index',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'startTime':this.selectDate[0] ? this.selectDate[0] : '',
        'endTime':this.selectDate[1] ? this.selectDate[1] : '',
        'Warning_Type':this.eventType,
        'Warning_Level':this.eventLevel,
        'Do_User_Id':this.dealUser,
        'pageSize':this.pageSize,
        'pageNum':val
      }).then((data) => {
        // console.log(data);
        this.warningLogListCount = data.Data.data.warningLogListCount
        this.howMany = data.Data.data.howMany
      })
    },
    handleSizeChange(val){
      //表格一页数据多少切换
      this.pageSize = val
      this.$http.post('/Manage/WaringLogs/Index',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'startTime':this.selectDate[0] ? this.selectDate[0] : '',
        'endTime':this.selectDate[1] ? this.selectDate[1] : '',
        'Warning_Type':this.eventType,
        'Warning_Level':this.eventLevel,
        'Do_User_Id':this.dealUser,
        'pageSize':val,
        'pageNum':this.pageNum
      }).then((data) => {
        // console.log(data);
        this.warningLogListCount = data.Data.data.warningLogListCount
        this.howMany = data.Data.data.howMany
      })
    },
    //查询
    query() {
      // console.log(this.selectDate);
      this.$http.post('/Manage/WaringLogs/Index',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'startTime':this.selectDate[0] ? this.selectDate[0] : '',
        'endTime':this.selectDate[1] ? this.selectDate[1] : '',
        'Warning_Type':this.eventType,
        'Warning_Level':this.eventLevel,
        'Do_User_Id':this.dealUser,
      }).then((data) => {
        // console.log(data);
        this.warningLogListCount = data.Data.data.warningLogListCount
        this.howMany = data.Data.data.howMany
      })
    },
    //重置
    resetForm() {
      this.selectDate = []
      this.eventType = ''
      this.eventLevel = ''
      this.dealUser = ''
      this.$http.post('/Manage/WaringLogs/Index',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
      }).then((data) => {
        // console.log(data);
        this.warningLogListCount = data.Data.data.warningLogListCount
        this.howMany = data.Data.data.howMany
      })
    },
    //导出记录
    exportRecord() {
      let params = new URLSearchParams()
      params.append('User_Id',window.localStorage.getItem('userId'))
      params.append('Project_Code',this.$route.params.id)
      params.append('startTime',this.selectDateExport[0] ? this.selectDateExport[0] : '')
      params.append('endTime',this.selectDateExport[1] ? this.selectDateExport[1] : '')
      params.append('Warning_Type',this.waringType)
      params.append('Warning_Level',this.waringLevel)
      params.append('Do_User_Id',this.user)
      params.append('dayType',this.dayType)
      // console.log(window.localStorage.getItem('userId'));
      axios({
        method:'POST',
        url:'http://118.31.172.237:9031/api/Manage/WaringLogs/ExportNotes',
        data:params,
        headers:{
          'Authorization':'Bearer' +' '+ getCookie('tsl_token')
        },
        responseType:'blob'
      }).then(response => {
        // console.log(response);
        this.download(response.data)
        this.dialogFormVisible = false
      })
    },
    closedExoprt() {
      this.selectDateExport = []
      this.dayType = ''
      this.user = ''
      this.waringType = ''
      this.waringLevel = ''
    },
    download (data) {
      if (!data) {
        return
      }
      let url = window.URL.createObjectURL(new Blob([data]))
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', 'excel.xlsx')
      document.body.appendChild(link)
      link.click()
    },
    //修改预警事件
    changeEvent(val) {
      this.changeAlertEvent = true
      // console.log(val);
      this.alertEvent = val.Message
      this.description = val.Desc
      this.changeUser = val.Name
      this.id = val.Id
    },
    changeEventSure() {
      if(!this.changeUser){
        this.changeTipShow = true
        this.changeTip = '请选择处理人'
      }else if(!this.description){
        this.changeTipShow = true
        this.changeTip = '请输入描述'
      }else {
        this.$http.post('/Manage/WaringLogs/Update',{
          'User_Id':window.localStorage.getItem('userId'),
          'Project_Code':this.$route.params.id,
          'Id':this.id,
          'Do_User_Id':this.changeUser,
          'Desc':this.description
        }).then((data) => {
          console.log(data);
          if(+data.Data.code === 1){
            this.tips = '事件处理完毕，不能修改'
            this.ifTips = true
          }
          if(+data.Data.code === 0){
            this.changeAlertEvent = false
            this.$http.post('/Manage/WaringLogs/Index',{
              'User_Id':window.localStorage.getItem('userId'),
              'Project_Code':this.$route.params.id,
              'startTime':this.selectDate[0] ? this.selectDate[0] : '',
              'endTime':this.selectDate[1] ? this.selectDate[1] : '',
              'Warning_Type':this.eventType,
              'Warning_Level':this.eventLevel,
              'Do_User_Id':this.dealUser,
              'pageSize':this.pageSize,
              'pageNum':this.pageNum
            }).then((data) => {
              // console.log(data);
              this.warningLogListCount = data.Data.data.warningLogListCount
              this.howMany = data.Data.data.howMany
            })
          }
        })
      }

    },
    //修改弹窗关闭
    closeChange() {
      this.alertEvent = ''
      this.description = ''
      this.changeUser = ''
      this.id = ''
      this.tips = ''
      this.ifTips = ''
      this.changeTipShow = false
      this.changeTip = ''
    },
    changeDateExport() {
      if(this.selectDateExport[0]){
        this.dayType = ''
      }
    }
  },
  mounted () {
    //面包屑
    const headerObj = this.$store.state.header.headData.find(item => item.Project_Code === this.$route.params.id);
    // console.log(headerObj, 'headerObj');
    this.$store.commit('changeHeadTitle', [
      {
        url: `/project-index/${this.$route.params.id}`,
        title: headerObj.Project_Name
      },
      {
        url:'',
        title:'预警管理'
      },
      {
        url:'',
        title:'预警日志'
      }
    ])

    this.getData()
  },
  filters: {
    transformDate: transformDate,
    formatSec: formatSec
  },
  watch: {
    $route(newVal) {
      this.getData();
    }
  }
}
