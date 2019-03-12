import {transformDate,noticeType,noticeClass,isOrNot} from "../../../common/filters";
import {IS_MAIL} from "../../../common/pattern";
import {MOBILE} from "../../../common/pattern";

export default {
  name: "NotificationManagement",
  data () {
    return{
      activeName: 'first',
      value:'',
      notificationType:'',
      receiver:'',
      notificationClass:"",
      //所属项目
      projectIpt:'',
      datepick:[],
      //接收人
      userList:[],
      //通知类型
      noticeClass:[],
      //通知方式
      noticeType:[],
      //表格数据
      tableData:[],
      tableData2:[],
      dialogFormVisible:false,
      form:{
        name:'',
        role:'',
        project:[],
        phone:'',
        //钉钉号
        dingding:'',
        //有无钉钉
        isDingding:null,
        email:''
      },
      formLabelWidth:'120px',
      warningGroup:[],
      ifDingding:[
        {name:'有',value:1},
        {name:'无',value:0}
      ],
      dingdingIpt:false,
      roleList:[],
      applation:[],
      projectList:[],
      howManyManage:null,
      currentPage:1,
      managePageSize:10,
      setCurrentPage:1,
      howManySet:null,
      //通知人员设定
      //页码
      setPageNum:1,
      //每页数据条数
      setPageSize:10,
      //修改通知人id
      noticeId:'',
      eventType:[],
      isCreate:false,
      title:'新建',
      tips:'',
      ifTips:false,

    }
  },
  methods:{
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    //日期选择器


    //查询按钮
    query() {
      // console.log(this.value);
      this.$http.post('/Manage/NoticeHistoryLogs/Index',{
        'User_Id':window.localStorage.getItem('userId'),
        'Operate_user_Id':this.receiver,
        'Notice_Class':this.notificationClass,
        'Notice_Type':this.notificationType,
        'Project_Name':this.projectIpt,
        'startTime':this.value[0] ? this.value[0] : '',
        'endTime':this.value[1] ? this.value[1] : '',
      }).then((data) => {
        // console.log(data);
        this.tableData = data.Data.data.noticeHistoryLogs
        this.howManyManage = data.Data.data.howMany
      })
    },
    //重置
    resetForm() {
      this.receiver = ''
      this.notificationClass = ''
      this.notificationType = ''
      this.projectIpt = ''
      this.projectIpt = ''
      this.value = []
      this.$http.post('/Manage/NoticeHistoryLogs/Index',{
        'User_Id':window.localStorage.getItem('userId'),
      }).then((data) => {
        // console.log(data);
        this.tableData = data.Data.data.noticeHistoryLogs
        this.howManyManage = data.Data.data.howMany
      })
    },
    manageCurrentChange(val) {
      //通知管理页码切换(不完整)
      // console.log(val);
      this.$http.post('/Manage/NoticeHistoryLogs/Index',{
        'User_Id':window.localStorage.getItem('userId'),
        'Operate_user_Id':this.receiver,
        'Notice_Class':this.notificationClass,
        'Notice_Type':this.notificationType,
        'Project_Name':this.projectIpt,
        'startTime':this.value[0] ? this.value[0] : '',
        'endTime':this.value[1] ? this.value[1] : '',
        'pageNum':val,
        'pageSize':this.managePageSize
      }).then((data) => {
        // console.log(data);
        this.tableData = data.Data.data.noticeHistoryLogs
        this.howManyManage = data.Data.data.howMany
      })
    },
    manageSizeChange(val){
      //通知管理表格一页数据多少切换
      this.$http.post('/Manage/NoticeHistoryLogs/Index',{
        'User_Id':window.localStorage.getItem('userId'),
        'Operate_user_Id':this.receiver,
        'Notice_Class':this.notificationClass,
        'Notice_Type':this.notificationType,
        'Project_Name':this.projectIpt,
        'startTime':this.value[0] ? this.value[0] : '',
        'endTime':this.value[1] ? this.value[1] : '',
        'pageSize':val
      }).then((data) => {
        // console.log(data);
        this.tableData = data.Data.data.noticeHistoryLogs
        this.howManyManage = data.Data.data.howMany
      })
    },
    //新建或修改
    createOrModify () {
      if(!this.isCreate){
        if(!MOBILE.test(this.form.phone)){
          this.tips = '请输入正确的手机号'
          this.ifTips = true
        }else if(this.form.email){
          if(!IS_MAIL){
            this.tips = '请输入正确的邮箱号'
            this.ifTips = true
          }else{
            this.$http.post('/Manage/NoticeOtherSeting/Update',{
              'User_Id':window.localStorage.getItem('userId'),
              'Id':this.noticeId,
              'Phone' :this.form.phone,
              'Name' :this.form.name,
              'Notice_Type' :this.form.isDingding,
              'Role_Id' :this.form.role,
              'Project_Code' :this.form.project.join(","),
              'DingDing' :this.form.dingding,
              'Warning_Type':this.eventType.join(",")
            }).then((data) => {
              // console.log(data);
              if(+data.ErrorCode === -91){
                this.tips = '操作失败'
                this.ifTips = true
                return ;
              }
              if(data.Data.code == 0){
                this.dialogFormVisible = false
                this.$http.post('/Manage/NoticeOtherSeting/Index',{
                  'User_Id':window.localStorage.getItem('userId'),
                  'pageNum':this.pageNum,
                  'pageSize':this.setPageSize
                }).then((data) => {
                  this.tableData2 = data.Data.data.resultList
                  this.howManySet = data.Data.data.howMany
                })
              }
            })
          }
        }else{
          this.$http.post('/Manage/NoticeOtherSeting/Update',{
            'User_Id':window.localStorage.getItem('userId'),
            'Id':this.noticeId,
            'Phone' :this.form.phone,
            'Name' :this.form.name,
            'Notice_Type' :this.form.isDingding,
            'Role_Id' :this.form.role,
            'Project_Code' :this.form.project.join(","),
            'DingDing' :this.form.dingding,
            'Warning_Type':this.this.eventType.join(",")
          }).then((data) => {
            // console.log(data);
            if(data.Data.code == 0){
              this.dialogFormVisible = false
              this.$http.post('/Manage/NoticeOtherSeting/Index',{
                'User_Id':window.localStorage.getItem('userId'),
                'pageNum':this.pageNum,
                'pageSize':this.setPageSize
              }).then((data) => {
                this.tableData2 = data.Data.data.resultList
                this.howManySet = data.Data.data.howMany
              })
            }
          })
        }
      }else{
        if(this.form.name === ''){
          this.tips = '请输入姓名'
          this.ifTips = true
          return ;
        }else if(this.form.role === ''){
          this.tips = '请选择人员类型'
          this.ifTips = true
          return ;
        }else if(this.form.project === ''){
          this.tips = '请选择项目'
          this.ifTips = true
          return ;
        }else if(this.eventType === ''){
          this.tips = '请选择项目'
          this.ifTips = true
          return ;
        }else if(this.form.phone === ''){
          this.tips = '请输入手机号'
          this.ifTips = true
          return ;
        }else if(this.form.email === ''){
          this.tips = '请输入邮箱'
          this.ifTips = true
          return ;
        }
        if(!MOBILE.test(this.form.phone)){
          this.tips = '请输入正确的手机号'
          this.ifTips = true
        }else if(this.form.email){
          if(!IS_MAIL.test(this.form.email)){
            this.tips = '请输入正确的邮箱号'
            this.ifTips = true
          }else{
            this.$http.post('/Manage/NoticeOtherSeting/Insert',{
              'User_Id':window.localStorage.getItem('userId'),
              'Name':this.form.name,
              'Phone':this.form.phone,
              'Notice_Type':this.form.isDingding,
              'Role_Id':this.form.role,
              'Warning_Type':this.eventType.join(","),
              'Project_Code':this.form.project.join(","),
              'DingDing':this.form.dingding,
              'Email':this.form.email
            }).then((data) => {
              // console.log(data);
              if(data.Data.code == 0){
                // this.dingdingIpt = false
                this.dialogFormVisible = false
                this.$http.post('/Manage/NoticeOtherSeting/Index',{
                  'User_Id':window.localStorage.getItem('userId'),
                  'pageNum':this.setPageNum,
                  'pageSize':this.setPageSize
                }).then((data) => {
                  // console.log(data);
                  this.tableData2 = data.Data.data.resultList
                  this.howManySet = data.Data.data.howMany
                })
              }

            })
          }
        }else{
          this.$http.post('/Manage/NoticeOtherSeting/Insert',{
            'User_Id':window.localStorage.getItem('userId'),
            'Name':this.form.name,
            'Phone':this.form.phone,
            'Notice_Type':this.form.isDingding,
            'Role_Id':this.form.role,
            'Warning_Type':this.eventType.join(","),
            'Project_Code':this.form.project.join(","),
            'DingDing':this.form.dingding,
            'Email':this.form.email
          }).then((data) => {
            // console.log(data);
            if(data.Data.code == 0){
              // this.dingdingIpt = false
              this.dialogFormVisible = false
              this.$http.post('/Manage/NoticeOtherSeting/Index',{
                'User_Id':window.localStorage.getItem('userId'),
                'pageNum':this.setPageNum,
                'pageSize':this.setPageSize
              }).then((data) => {
                // console.log(data);
                this.tableData2 = data.Data.data.resultList
                this.howManySet = data.Data.data.howMany
              })
            }

          })
        }

      }

    },
    //复选框筛选 applation选中的选框
    // checkedChange () {
    //   this.applation = this.warningGroup.filter(item => item.checked)
    //   console.log(this.applation);
    // },
    //关闭弹框
    closeDialog() {
      this.form.name = ''
      this.form.phone = ''
      this.form.isDingding = ''
      this.form.role = ''
      this.form.project = ''
      this.form.dingding = ''
      this.form.email = ''
      this.eventType = []
      this.tips = ''
      this.ifTips = false
      this.dingdingIpt = false
      this.title = '新建'
    },

    //钉钉有无
    changeDingding (val) {
      // console.log(val);
      if(+val === 1){
        this.dingdingIpt = true
      }else if(+val === 0){
        this.dingdingIpt = false
      }
    },


    //通知人员设定

    setSizeChange(val) {
      //一页显示多少条数据
      this.setPageSize = val
      this.$http.post('/Manage/NoticeOtherSeting/Index',{
        'User_Id':window.localStorage.getItem('userId'),
        'pageSize':val
      }).then((data) => {
        // console.log(data);
        this.tableData2 = data.Data.data.resultList
        this.howManySet = data.Data.data.howMany
      })
    },
    setCurrentChange(val) {
      //页码切换
      this.setPageNum = val
      this.$http.post('/Manage/NoticeOtherSeting/Index',{
        'User_Id':window.localStorage.getItem('userId'),
        'pageNum':val,
        'pageSize':this.setPageSize
      }).then((data) => {
        // console.log(data);
        this.tableData2 = data.Data.data.resultList
        this.howManySet = data.Data.data.howMany
      })
    },
    //新建
    createNew() {
      this.dialogFormVisible = true
      this.title = '新建'
      this.isCreate = true
      this.form.isDingding = 0
    },
    //修改通知人员设定
    changeNotice (val) {
      // console.log(val);
      if(val.DingDing) {
        this.form.isDingding = 1
        this.dingdingIpt = true
      } else {
        this.form.isDingding = 0
      }
      this.title = '修改'
      this.form.name = val.Name
      this.form.role = val.Role_Id
      this.form.project = val.warningProjectList.map(item => {
        return item.Project_Code
      })
      this.form.phone = val.Phone
      this.form.dingding = val.DingDing
      this.form.email = val.Email
      this.noticeId = val.Id
      // this.eventType = val.warningGroupList
      this.dialogFormVisible = true
      val.warningGroupList.forEach((item,i) => {
        this.eventType.push(item.Warning_Group)
      })
      this.isCreate = false
    },

    //删除通知人
    deleteNotice(val) {
      // console.log(val);
      let sure = window.confirm('确认删除？')
      if(sure){
        this.$http.post('/Manage/NoticeOtherSeting/Delete',{
          'User_Id':window.localStorage.getItem('userId'),
          'Id':val.Id
        }).then((data) => {
          // console.log(data);
          if(data.Data.code == 0) {
            this.$http.post('/Manage/NoticeOtherSeting/Index',{
              'User_Id':window.localStorage.getItem('userId'),
              'pageNum':this.setPageNum,
              'pageSize':this.setPageSize
            }).then((data) => {
              // console.log(data);
              this.tableData2 = data.Data.data.resultList
              this.howManySet = data.Data.data.howMany
            })
          }
        })
      }
    }
  },
  filters: {
    transformDate: transformDate,
    noticeType: noticeType,
    noticeClass: noticeClass,
    isOrNot: isOrNot
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
        title:'通知管理'
      }
    ])
    //初始化表格通知记录
    this.$http.post('/Manage/NoticeHistoryLogs/Index',{
      'User_Id':window.localStorage.getItem('userId')
    }).then((data) => {
      // console.log(data);
      this.userList = data.Data.data.userList
      this.noticeClass = data.Data.data.noticeClass
      this.noticeType = data.Data.data.noticeType
      this.tableData = data.Data.data.noticeHistoryLogs
      this.howManyManage = data.Data.data.howMany
    })

    //通知人员设定
    this.$http.post('/Manage/NoticeOtherSeting/Index',{
      'User_Id':window.localStorage.getItem('userId')
    }).then((data) => {
      // console.log(data);
      this.tableData2 = data.Data.data.resultList
      this.roleList = data.Data.data.roleList
      this.warningGroup = data.Data.data.warningGroup
      this.projectList = data.Data.data.projectList
      this.howManySet = data.Data.data.howMany
    })
  }
}
