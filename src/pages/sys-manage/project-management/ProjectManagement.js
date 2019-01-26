export default {
  name: "ProjectManagement",
  data () {
    return{
      optionArea:[],
      projectCode:'',
      projectOption:[],
      tableData:[],
      Province_Code:'',
      City_Code:'',
      Area_Code:'',
      formManage:{
        project:'',
        manageUser:''
      },
      formOps:{
        project:'',
        opsUser:''
      },
      dialogFormVisibleManage:false,
      dialogFormVisibleOps:false,
      manageUser:true,
      opsUser:true,
      selectProject:[],
      selectOps:[],
      selectManage:[],
      errorTip:'',
      areaCode:[],

    }
  },
  methods: {
    //选择省市区
    selectArea (val) {
      console.log(val);
      if(val.length === 1){
        this.Province_Code = val[0]
      }else if(val.length === 2){
        this.Province_Code = val[0]
        this.City_Code = val[1]
      }else if(val.length === 3){
        this.Province_Code = val[0]
        this.City_Code = val[1]
        this.Area_Code = val[2]
      }
      this.$http.post('/Manage/ProjectUser/Index',{
        'User_Id':window.localStorage.getItem('userId'),
        'Province_Code':this.Province_Code,
        'City_Code':this.City_Code,
        'Area_Code':this.Area_Code
      }).then((data) => {
        console.log(data);
        this.projectOption = data.Data.data.projectList
        console.log(this.projectOption);
      })
    },
    //查询
    query () {
      this.$http.post('/Manage/ProjectUser/Index',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.projectCode,
        'Province_Code':this.Province_Code,
        'City_Code':this.City_Code,
        'Area_Code':this.Area_Code
      }).then((data) => {
        console.log(data);
        this.tableData = data.Data.data.projectRunList
      })
    },
    resetForm() {
      this.projectCode = ''
      this.areaCode = []
      this.$http.post('/Manage/ProjectUser/Index',{
        'User_Id':window.localStorage.getItem('userId'),
      }).then((data) => {
        this.tableData = data.Data.data.projectRunList
      })
    },
    //新建项目管理员
    createManage() {
      this.$http.post('/Manage/ProjectUser/Insert',{
        'User_Id':window.localStorage.getItem('userId'),
        'Related_User_Id':this.formManage.manageUser,
        'Project_Code':this.formManage.project
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
          console.log(this.errorTip);
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
    },
    //新建运维人员
    createOps() {
      this.$http.post('/Manage/ProjectUser/Insert',{
        'User_Id':window.localStorage.getItem('userId'),
        'Related_User_Id':this.formOps.opsUser,
        'Project_Code':this.formOps.project
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
        }else if(data.Data.code == 4){
          this.errorTip = '系统错误'
        }else if(data.Data.code == 0){
          //重新请求接口更新表格(不考虑选择框数据)
          this.$http.post('/Manage/ProjectUser/Index',{
            'User_Id':window.localStorage.getItem('userId'),
          }).then((data) => {
            console.log(data);
            this.tableData = data.Data.data.projectRunList
          })
          this.dialogFormVisibleOps = false
        }
      })
    },


    //删除项目管理员
    deleteManage(item){
      console.log(item);
      let sure = window.confirm('确认删除？')
      if(sure){
        this.$http.post('/Manage/ProjectUser/Remove',{
          'User_Id':window.localStorage.getItem('userId'),
          'Project_Code':item.Project_Code,
          'Related_User_Id':item.ProjectManagerUser[0].User_Id
        }).then((data) => {
          if(data.Data.code == 1){
            alert('删除错误')
          }else{
            //删除成功重新请求表格(不考虑选择框数据)
            this.$http.post('/Manage/ProjectUser/Index',{
              'User_Id':window.localStorage.getItem('userId'),
            }).then((data) => {
              this.tableData = data.Data.data.projectRunList
            })
          }
        })
      }
    },

    //删除运维人员
    deleteOps(item) {
      let sure = window.confirm('确认删除？')
      if(sure){
        this.$http.post('/Manage/ProjectUser/Remove',{
          'User_Id':window.localStorage.getItem('userId'),
          'Project_Code':item.Project_Code,
          'Related_User_Id':item.ProjectOPSUser[0].User_Id
        }).then((data) => {
          if(data.Data.code == 1){
            alert('删除错误')
          }else{
            //删除成功重新请求表格(不考虑选择框数据)
            this.$http.post('/Manage/ProjectUser/Index',{
              'User_Id':window.localStorage.getItem('userId'),
            }).then((data) => {
              this.tableData = data.Data.data.projectRunList
            })
          }
        })
      }
    },
    //关闭清除表单的值
    manageClose() {
      this.formManage.project = ''
      this.formManage.manageUser = ''
      this.errorTip = ''
    },
    opsClose() {
      this.formOps.project = ''
      this.formOps.opsUser = '',
        this.errorTip = ''
    },

    changeSelect(item) {
      this.$set(item, 'checked', !item.checked);
    }
  },
  mounted () {
    //面包屑
    const headerObj = this.$store.state.header.headData.find(item => item.Project_Code === this.$route.params.id);
    console.log(headerObj, 'headerObj');
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
    //省市区
    this.$http.post('/Manage/User/ThreeLevelLinkage',{
      User_Id:window.localStorage.getItem('userId')
    }).then( (data) => {
      //console.log(data.Data);
      this.optionArea = data.Data.threeLevelLinkage
      //console.log(this.optionArea);
    })
    //进入页面表格默认显示的数据
    this.$http.post('/Manage/ProjectUser/Index',{
      'User_Id':window.localStorage.getItem('userId'),
    }).then((data) => {
      console.log(data);
      this.tableData = data.Data.data.projectRunList
      this.howMany = data.Data.data.howMany

    })

    //项目与人员关联选项
    this.$http.post('/Manage/ProjectUser/BeforeInsert',{
      'User_Id':window.localStorage.getItem('userId'),
    }).then((data) => {
      console.log(data);
      // if(data.Data.data.RoleUserList.OPSuser.length != 0){
      //   this.opsUser = true
      //   this.manageUser = false
      // }else if(data.Data.data.RoleUserList.projectUser.length != 0){
      //   this.opsUser = false
      //   this.manageUser = true
      // }
      this.selectProject = data.Data.data.projectList
      this.selectOps = data.Data.data.RoleUserList.OPSuser
      this.selectManage = data.Data.data.RoleUserList.projectUser
    })

  }
}
