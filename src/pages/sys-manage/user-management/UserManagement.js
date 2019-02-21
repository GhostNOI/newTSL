import {MOBILE} from "../../../common/pattern";
import {IS_MAIL} from "../../../common/pattern";

export default {
  name: "UserManagement",
  data () {
    return{
      rolePower:'',
      projectManagement:'',
      pwd:true,
      //用户输入用户名和手机号进行查询
      iptName:'',
      iptPhone:'',
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        password:'',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        initialPassword:'',
        permissions:'',
        project:'',
        phone:'',
        dingding:'',
        dingdingNumber:'',
        email:''
      },
      formLabelWidth: '120px',
      //角色权限
      roleList:[],
      //表格数据
      tableData:[],
      //分页
      currentPage:1,
      howMany:null,
      pageSize:10,
      pageNum:1,
      //更改用户id修改接口使用
      updateUserId:'',
      tips:'',
      ifTips:false,
      isDingDing:false,
      ifNewCreate:false
    }
  },
  methods:{
    //查询按钮
    query () {
      this.$http.post('/Manage/UserRun/Index',{
        'User_Id':window.localStorage.getItem('userId'),
        'Name':this.iptName,
        'Phone':this.iptPhone,
        'Role_Id':this.rolePower
      }).then((data) => {
        this.tableData = data.Data.data.userList
        this.howMany = data.Data.data.howMany
      })
    },
    //重置
    resetForm() {
      this.iptName = ''
      this.iptPhone = ''
      this.rolePower = ''
      this.$http.post('/Manage/UserRun/Index',{
        'User_Id':window.localStorage.getItem('userId'),
      }).then((data) => {
        this.tableData = data.Data.data.userList
        this.howMany = data.Data.data.howMany
      })
    },
    //分页
    handleCurrentChange(val) {
      //页码切换
      this.pageNum = val
      this.$http.post('/Manage/UserRun/Index',{
        'User_Id':window.localStorage.getItem('userId'),
        'Name':this.iptName,
        'Phone':this.iptPhone,
        'Role_Id':this.rolePower,
        // 'pageSize':this.pageSize,
        'pageNum':val
      }).then((data) => {
        // console.log(data);
        this.tableData = data.Data.data.userList
        this.howMany = data.Data.data.howMany
      })
    },
    handleSizeChange(val){
      //表格一页数据多少切换
      this.pageSize = val
      this.$http.post('/Manage/UserRun/Index',{
        'User_Id':window.localStorage.getItem('userId'),
        'Name':this.iptName,
        'Phone':this.iptPhone,
        'Role_Id':this.rolePower,
        'pageSize':val,
        'pageNum':1
      }).then((data) => {
        this.tableData = data.Data.data.userList
        this.howMany = data.Data.data.howMany
      })
    },
    //新建
    createNewUser() {
      this.dialogFormVisible = true
      this.ifNewCreate = false
    },
    //新建项目确认
    sureCreate() {
      if(this.pwd){
        this.ifNewCreate = false
        if(this.form.name === ''){
          this.ifTips = true
          this.tips = '请输入用户名';
        }else if(this.form.phone === ''){
          this.ifTips = true
          this.tips = '请输入手机号';
        }else if(this.form.permissions === ''){
          this.ifTips = true
          this.tips = '请选择角色';
        }else if(this.form.dingding === ''){
          this.ifTips = true
          this.tips = '请选择是否有钉钉'
        }else if(this.form.email === ''){
          this.ifTips = true
          this.tips = '请输入邮箱'
        }else if(+this.form.dingding === 1){
          if(!MOBILE.test(this.form.dingdingNumber)){
            this.ifTips = true
            this.tips = '请输入正确的钉钉号'
          }else{
            if(!MOBILE.test(this.form.phone)){
              this.ifTips = true
              this.tips = '请输入正确的手机号'
            }else if(!IS_MAIL.test(this.form.email)){
              this.ifTips = true
              this.tips = '请输入正确的邮箱号'
              // console.log('aa');
            }else {
              this.$http.post('/Manage/Login/Register',{
                'User_Id':window.localStorage.getItem('userId'),
                'Name':this.form.name,
                'Phone':this.form.phone,
                'Password':123456,
                'RoleId':this.form.permissions,
                'email':this.form.email,
                'dingding':this.form.dingdingNumber
              }).then((data) => {
                // console.log(data);
                if(data.Data.code == -7){
                  this.tips = '该用户已存在';
                  this.ifTips = true
                }else if(data.Data.code == -4){
                  this.tips = '请重新登录';
                  this.ifTips = true
                }else if(data.Data.code == -5 || data.Data.code == -6){
                  this.tips = '角色错误';
                  this.ifTips = true
                }else if(data.Data.code == -8){
                  this.tips = '系统错误';
                  this.ifTips = true
                }else if (data.Data.code == 0){
                  //更新表格数据
                  this.dialogFormVisible = false
                  this.$http.post('/Manage/UserRun/Index',{
                    'User_Id':window.localStorage.getItem('userId'),
                    'pageSize':this.pageSize,
                    'pageNum':this.pageNum
                  }).then((data) => {
                    this.tableData = data.Data.data.userList
                    this.howMany = data.Data.data.howMany
                  })
                }
              })
            }
          }
        }else if(!MOBILE.test(this.form.phone)){
          this.ifTips = true
          this.tips = '请输入正确的手机号'
        }else if(this.form.email){
          if(!IS_MAIL.test(this.form.email)){
            this.ifTips = true
            this.tips = '请输入正确的邮箱号'
          }else {
            this.$http.post('/Manage/Login/Register',{
              'User_Id':window.localStorage.getItem('userId'),
              'Name':this.form.name,
              'Phone':this.form.phone,
              'Password':123456,
              'RoleId':this.form.permissions,
              'email':this.form.email,
              'dingding':this.form.dingdingNumber
            }).then((data) => {
              // console.log(data);
              if(data.Data.code == -7){
                this.tips = '该用户已存在';
                this.ifTips = true
              }else if(data.Data.code == -4){
                this.tips = '请重新登录';
                this.ifTips = true
              }else if(data.Data.code == -5 || data.Data.code == -6){
                this.tips = '角色错误';
                this.ifTips = true
              }else if(data.Data.code == -8){
                this.tips = '系统错误';
                this.ifTips = true
              }else if (data.Data.code == 0){
                //更新表格数据
                this.dialogFormVisible = false
                this.$http.post('/Manage/UserRun/Index',{
                  'User_Id':window.localStorage.getItem('userId'),
                  'pageSize':this.pageSize,
                  'pageNum':this.pageNum
                }).then((data) => {
                  this.tableData = data.Data.data.userList
                  this.howMany = data.Data.data.howMany
                })
              }
            })
          }
        }else{
          this.$http.post('/Manage/Login/Register',{
            'User_Id':window.localStorage.getItem('userId'),
            'Name':this.form.name,
            'Phone':this.form.phone,
            'Password':123456,
            'RoleId':this.form.permissions,
            'email':this.form.email,
            'dingding':this.form.dingdingNumber
          }).then((data) => {
            // console.log(data);
            if(data.Data.code === -7){
              this.tips = '该用户已存在';
              this.ifTips = true
            }else if(data.Data.code === -4){
              this.tips = '请重新登录';
              this.ifTips = true
            }else if(data.Data.code === -5 || data.Data.code == -6){
              this.tips = '角色错误';
              this.ifTips = true
            }else if(data.Data.code === -8){
              this.tips = '系统错误';
              this.ifTips = true
            }else if (data.Data.code === 0){
              //更新表格数据
              this.dialogFormVisible = false
              this.$http.post('/Manage/UserRun/Index',{
                'User_Id':window.localStorage.getItem('userId'),
                'pageSize':this.pageSize,
                'pageNum':this.pageNum
              }).then((data) => {
                this.tableData = data.Data.data.userList
                this.howMany = data.Data.data.howMany
              })
            }
          })
        }
      }else{
        // console.log(this.form.permissions);
        this.$http.post('/Manage/User/UpdateUser',{
          'User_Id':window.localStorage.getItem('userId'),
          'Update_User_Id':this.updateUserId,
          'Name':this.form.name,
          'Email':this.form.email,
          'DingDing':this.form.dingdingNumber,
          'RoleId':this.form.permissions
        }).then((data) => {
          // console.log(data);
          this.$http.post('/Manage/UserRun/Index',{
            'User_Id':window.localStorage.getItem('userId'),
            'pageSize':this.pageSize,
            'pageNum':this.pageNum
          }).then((data) => {
            this.tableData = data.Data.data.userList
            this.howMany = data.Data.data.howMany
          })
          this.dialogFormVisible = false
        })
      }
      //关闭弹框
      // this.dialogFormVisible = false
    },

    //修改
    modify(item) {
      // console.log(item);
      this.dialogFormVisible = true
      //隐藏掉修改密码
      this.pwd = false
      this.form.name = item.Name
      this.form.phone = item.Phone
      this.form.dingdingNumber = item.DingDing
      this.form.email = item.Email
      this.updateUserId = item.User_Id
      this.form.permissions = item.Role_Id
      this.ifNewCreate = true
    },
    //退出弹框
    quit(){
      //设置密码框出现
      this.pwd = true
      this.form.name = ''
      this.form.phone = ''
      this.form.dingdingNumber = ''
      this.form.email = ''
      this.tips = ''
      this.form.password = ''
      this.form.permissions = ''
      this.ifTips = false
    },

    //启用禁用
    changeStatus(val) {
      // console.log(val);
      let userStatus = ''
      if(val.Status == 0){
        userStatus = 1
      }else{
        userStatus = 0
      }
      this.$http.post('/Manage/User/UpdateUserStatus',{
        'User_Id':window.localStorage.getItem('userId'),
        'Status':userStatus,
        'Update_User_Id':val.User_Id
      }).then((data) => {
        // console.log(this.pageSize);
        // console.log(this.pageNum);
        this.$http.post('/Manage/UserRun/Index',{
          'User_Id':window.localStorage.getItem('userId'),
          // 'pageSize':this.pageSize,
          'pageNum':this.pageNum
        }).then((data) => {
          // console.log(data);
          this.tableData = data.Data.data.userList
          this.howMany = data.Data.data.howMany
        })
      })
    },
    //判断有没有钉钉
    changeDingDing(val) {
      if(+val === 0){
        this.isDingDing = false
      }else{
        this.isDingDing = true
      }
    }
  },
  mounted () {
    //面包屑
    const headerObj = this.$store.state.header.headData.find(item => item.Project_Code === this.$route.params.id);
    // console.log(headerObj, 'headerObj');
    this.$store.commit('changeHeadTitle', [
      {
        url: '',
        title: '系统管理'
      },
      {
        url:'',
        title:'用户管理'
      }
    ])
    this.$http.post('/Manage/UserRun/Index',{
      'User_Id':window.localStorage.getItem('userId'),
    }).then((data) => {
      // console.log(data);
      this.roleList = data.Data.data.roleList
      this.tableData = data.Data.data.userList
      this.howMany = data.Data.data.howMany
    })
  }
}
