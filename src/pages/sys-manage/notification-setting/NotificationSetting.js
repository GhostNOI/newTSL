export default {
  name: "NotificationSetting",
  data() {
    return{
      activeName: 'first',
      tableData1:[],
      tableData2:[],
      tableData3:[],
      ipt:'',
      //通知方式设定弹框
      changeNoticeDialog:false,
      //通知模板设定弹框
      templateChange:false,
      //催办时间输入框
      changeTime:false,
      roleList:[],
      warningGroup:[],
      warningLevel:[],
      warningNoticeType:[],
      //通知模板-通知方式
      noticeTemplateType:'',
      noticeTemplateTem:'',
      Notice_Type:'',
      //更改事件等级
      noticeEventLevel:'',
      noticeEventTime:'',
      Warning_Level:'',
      //新建，修改v-model的取值
      eventType:[],
      eventLevel:[],
      noticeType:[],
      selectRole:'',
      title:'新建',
      selectEventType:false,
      selectEventTips:'',
      opType:'',
      noData:false
    }
  },
  methods:{
    handleOk() {
      // console.log(this.eventType);
      // return;
      //
      // const warningGroup = this.eventType.map(item => this.warningGroup.find(items => items.Warning_Group_Name === item).Warning_Type);
      // console.log(warningGroup.join(','));
      // console.log(this.selectRole);
      if(this.selectRole){
        if(this.eventType.length === 0){
          this.selectEventType = true
          this.selectEventTips = '请选择事件类型'
        }else if(this.eventLevel.length === 0){
          this.selectEventType = true
          this.selectEventTips = '请选择事件等级'
        }else if(this.noticeType.length === 0){
          this.selectEventType = true
          this.selectEventTips = '请选择通知方式'
        }else {
          this.$http.post('/Manage/NoticeSeting/Insert',{
            'User_Id':window.localStorage.getItem('userId'),
            'Role_Id':this.selectRole,
            'Warning_Type':this.eventType.join(","),
            'Warning_Level':this.eventLevel.join(","),
            'Notice_Type':this.noticeType.join(","),
            'type':this.opType
          }).then((data) => {
            // console.log(data);
            if(+data.Data.code === 2){
              this.selectEventTips = '人员类型已存在'
              this.selectEventType = true
            }else if(+data.Data.code === 0){
              this.$http.post('/Manage/NoticeSeting/Index',{
                'User_Id':window.localStorage.getItem('userId')
              }).then((data) => {
                // console.log(data);
                this.tableData1 = data.Data.data.resultList;
                if(data.Data.data.resultList.length === 0) {
                  this.noData = true
                }else {
                  this.noData = false
                }
              });
              this.changeNoticeDialog = false;
              this.selectRole = '';
              this.eventType = [];
              this.eventLevel = [];
              this.noticeType = []
            }
          })
        }

      }else {
        this.selectEventType = true
        this.selectEventTips = '请选择人员类型'
      }



    },
    //tab切换
    handleClick() {

    },
    //新建
    createNew () {
      this.title = '新建';
      this.opType = 'insert';
      this.changeNoticeDialog = true
    },
    //通知方式设定修改
    changeNotice(item) {
      // console.log(item);
      this.opType = 'update';
      this.title = '修改';
      this.selectRole = item.Role_Id;
      this.eventType= item.warningGroupList.map(items => items.Warning_Group);
      this.eventLevel = item.warningLevelList.map(items => items.Warning_Level);
      this.noticeType = item.roleWarningNoticeTypeList.map(items => items.Notice_Type);
      this.changeNoticeDialog = true
    },
    //通知方式修改--关闭弹框
    closeChangeNoticeType() {
      this.selectRole = '';
      this.eventType = [];
      this.eventLevel = [];
      this.noticeType = [];
      this.selectEventType = false
    },


    //通知模板弹框
    changeTemplate(val) {
      this.templateChange = true;
      // console.log(val);
      this.noticeTemplateType = val.Notice_type_Name;
      this.noticeTemplateTem = val.Template_Content;
      this.Notice_Type = val.Notice_Type
    },
    //修改通知模板
    confirmTemplate() {
      this.$http.post('/Manage/NoticeTemplateSeting/Update',{
        'User_Id':window.localStorage.getItem('userId'),
        'Notice_Type':this.Notice_Type,
        'Template_Content':this.noticeTemplateTem
      }).then((data) => {
        // console.log(data);
        if(data.Data.code == 0){
          this.templateChange = false;
          this.$http.post('/Manage/NoticeTemplateSeting/Index',{
            'User_Id':window.localStorage.getItem('userId')
          }).then((data) => {
            this.tableData2 = data.Data.data
          })
        }
      })
    },
    //关闭弹框
    noticeTemplate() {
      this.noticeTemplateType = '';
      this.noticeTemplateTem = ''
    },

    //修改更改时间输入框
    changeDealTime(item) {
      // console.log(item);
      this.noticeEventLevel = item.Level_Name;
      this.noticeEventTime = item.Processing_Time;
      this.Warning_Level = item.Warning_Level;
      this.changeTime = true

    },

    //修改更改事件
    confirmTime() {
      this.$http.post('/Manage/NoticeTimeSeting/Update',{
        'User_Id':window.localStorage.getItem('userId'),
        'Warning_Level':this.Warning_Level,
        'Processing_Time': this.noticeEventTime
      }).then((data) => {
        // console.log(data);
        if(data.Data.code == 0) {
          this.changeTime = false
          this.$http.post('/Manage/NoticeTimeSeting/Index',{
            'User_Id':window.localStorage.getItem('userId'),
          }).then((data) => {
            this.tableData3 = data.Data.data
          })
        }
      })
    }
  },
  mounted () {
    //面包屑
    const headerObj = this.$store.state.header.headData.find(item => item.Project_Code === this.$route.params.id);
    this.$store.commit('changeHeadTitle', [
      {
        url: '',
        title: '系统管理'
      },
      {
        url:'',
        title:'通知设置'
      }
    ])

    //通知方式设定表格
    this.$http.post('/Manage/NoticeSeting/Index',{
      'User_Id':window.localStorage.getItem('userId')
    }).then((data) => {
      // console.log(data);
      this.tableData1 = data.Data.data.resultList;
      this.roleList = data.Data.data.RoleList;
      this.warningGroup = data.Data.data.warningGroup;
      this.warningLevel = data.Data.data.warningLevel;
      this.warningNoticeType = data.Data.data.warningNoticeType;
      if(data.Data.data.resultList.length === 0) {
        this.noData = true
      }else {
        this.noData = false
      }
    });

    //通知模板表格
    this.$http.post('/Manage/NoticeTemplateSeting/Index',{
      'User_Id':window.localStorage.getItem('userId')
    }).then((data) => {
      // console.log(data);
      this.tableData2 = data.Data.data
    });


    //催办时间设定
    this.$http.post('/Manage/NoticeTimeSeting/Index',{
      'User_Id':window.localStorage.getItem('userId'),
    }).then((data) => {
      // console.log(data);
      this.tableData3 = data.Data.data
    })
  }
}
