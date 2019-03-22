export default {
  name: "ProjectManage",
  data () {
    return{
      optionArea:[],
      projectOption:[],
      tableData:[],
      manageSelect:'',
      opsSelect:[],
      dialogFormVisibleManage:false,
      dialogFormVisibleOps:false,
      manageUser:true,
      opsUser:true,
      selectProject:[],
      selectOps:[],
      selectManage:[],
      errorTip:'',
      currentPage:1,
      howMany:0,
      projectId:'',
      projectName:'',
      projectManage:'',
      projectOps:'',
      projectCode:'',
      projectNames:'',
      pageNum:null,
      pageSize:null
    }
  },
  methods: {
    //查询
    query () {
      this.$http.post('/Manage/ProjectUser/Index',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.projectId,
        'Project_Name':this.projectName,
        'OPS_User_Name':this.projectOps,
        'Related_User_Name':this.projectManage
      }).then((data) => {
        console.log(data);
        this.tableData = data.Data.data.projectRunList
        this.howMany = data.Data.data.howMany
        console.log(this.tableData);
      })
    },
    resetForm() {
      this.projectId = ''
      this.projectName = ''
      this.projectManage = ''
      this.projectOps = ''
      this.$http.post('/Manage/ProjectUser/Index',{
        'User_Id':window.localStorage.getItem('userId'),
      }).then((data) => {
        this.tableData = data.Data.data.projectRunList
        this.howMany = data.Data.data.howMany
      })
    },
    //修改项目管理员或者运维人员
    changeManage (val) {
      console.log(val);
      this.projectCode = val.Project_Code
      this.projectNames = val.Project_Name
      this.manageSelect = val.ProjectManagerUser[0] ? val.ProjectManagerUser[0].User_Id : ''
      // this.manageSelect = val.ProjectManagerUser[0].Name ? val.ProjectManagerUser[0].Name : ''
      if(val.ProjectOPSUser.length){
        this.opsSelect = val.ProjectOPSUser.map(item => {
          return item.User_Id
        })
      }
      this.dialogFormVisibleManage = true
    },
    //新建项目管理员
    createManage() {
      if(this.manageUser){
        this.$http.post('/Manage/ProjectUser/Insert',{
          'User_Id':window.localStorage.getItem('userId'),
          'Related_User_Id':this.manageSelect,
          'Project_Code':this.projectCode,
          'OPS_User_Id':this.opsSelect.join(',')
        }).then((data) => {
          console.log(data);
          if(data.Data.code == -1){
            this.errorTip = '请重新登录'
          }else if(data.Data.code == 1){
            this.errorTip = '不存在该用户'
          }else if(data.Data.code == 2){
            this.errorTip = '不存在该项目'
          }else if(data.Data.code == 3){
            this.errorTip = '该用户已关联该项目'
            // console.log(this.errorTip);
          }else if(data.Data.code == 4){
            this.errorTip = '系统错误'
          }else if(data.Data.code == 0){
            //重新请求接口更新表格(不考虑选择框数据)
            this.$http.post('/Manage/ProjectUser/Index',{
              'User_Id':window.localStorage.getItem('userId'),
            }).then((data) => {
              this.tableData = data.Data.data.projectRunList
            })
            this.dialogFormVisibleManage = false
          }
        })
      }else{
        this.$http.post('/Manage/ProjectUser/Insert',{
          'User_Id':window.localStorage.getItem('userId'),
          'OPS_User_Id':this.opsSelect.join(','),
          'Project_Code':this.projectCode
        }).then((data) => {
          // console.log(data);
          if(data.Data.code == -1){
            this.errorTip = '请重新登录'
          }else if(data.Data.code == 1){
            this.errorTip = '不存在该用户'
          }else if(data.Data.code == 2){
            this.errorTip = '不存在该项目'
          }else if(data.Data.code == 3){
            this.errorTip = '该用户已关联该项目'
            // console.log(this.errorTip);
          }else if(data.Data.code == 4){
            this.errorTip = '系统错误'
          }else if(data.Data.code == 0){
            //重新请求接口更新表格(不考虑选择框数据)
            this.$http.post('/Manage/ProjectUser/Index',{
              'User_Id':window.localStorage.getItem('userId'),
            }).then((data) => {
              this.tableData = data.Data.data.projectRunList
            })
            this.dialogFormVisibleManage = false
          }
        })
      }
    },


    //关闭清除表单的值
    manageClose() {
      this.projectCode = ''
      this.projectNames = ''
      this.errorTip = ''
      this.manageSelect = ''
      this.opsSelect = []
    },
    changeSelect(item) {
      this.$set(item, 'checked', !item.checked);
    },
    //分页
    handleSizeChange (val) {
      this.pageSize = val
      this.$http.post('/Manage/ProjectUser/Index',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.projectId,
        'Project_Name':this.projectName,
        'OPS_User_Name':this.projectOps,
        'Related_User_Name':this.projectManage,
        'pageSize':val,
        'pageNum':1
      }).then((data) => {
        this.tableData = data.Data.data.projectRunList
        this.howMany = data.Data.data.howMany
      })
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.$http.post('/Manage/ProjectUser/Index',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.projectId,
        'Project_Name':this.projectName,
        'OPS_User_Name':this.projectOps,
        'Related_User_Name':this.projectManage,
        'pageSize':this.pageSize,
        'pageNum':val
      }).then((data) => {
        this.tableData = data.Data.data.projectRunList
        this.howMany = data.Data.data.howMany
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
        title:'项目管理'
      }
    ])

    //进入页面表格默认显示的数据
    this.$http.post('/Manage/ProjectUser/Index',{
      'User_Id':window.localStorage.getItem('userId'),
    }).then((data) => {

      this.tableData = data.Data.data.projectRunList

      this.howMany = data.Data.data.howMany
    })

    //项目与人员关联选项
    this.$http.post('/Manage/ProjectUser/BeforeInsert',{
      'User_Id':window.localStorage.getItem('userId'),
    }).then((data) => {
      if(+data.Data.isAdmin === 1){
        this.manageUser = true
        this.opsUser = true
      }else if(+data.Data.isAdmin === 2){
        this.manageUser = false
        this.opsUser = true
      }if(+data.Data.isAdmin === 0){
        return;
      }
      this.selectOps = data.Data.data.RoleUserList.OPSuser
      this.selectManage = data.Data.data.RoleUserList.projectUser
    })

  }
}
