
export default {
  name: "RoleManagement",
  data () {
    return{
      dialogFormVisible:false,
      checkAll: false,
      isIndeterminate: true,
      tableData:[],
      roleName:'',
      pageList:[],
      pages:[],
      roleList:[],
      tips:'',
      ifTips:false,
      modify:false,
      title:'新建'
    }
  },
  methods:{
    //新建
    createRole() {
      if(this.roleName === ''){
        this.tips = '请选择角色'
        this.ifTips = true
      }else{
        this.$http.post('/Manage/RoleManagement/Update',{
          'User_Id':window.localStorage.getItem('userId'),
          'Role_Id':this.roleName,
          'Page_Id':this.pages.join(',')
        }).then((data) => {
          // console.log(data);
          if(+data.Data.code === 0){
            this.dialogFormVisible = false
            //更改成功调用首页接口更新表格
            this.$http.post('/Manage/RoleManagement/Index',{
              'User_Id':window.localStorage.getItem('userId')
            }).then((data) => {
              // console.log(data);
              if(data.Data.result.length){
                this.tableData = data.Data.result
              }
            })

          }
        })
      }
    },
    //关闭弹框
    closeModel() {
      this.tips = ''
      this.ifTips = false
      this.pages = []
      this.roleName = ''
      this.title = '新建'
    },
    //修改
    modifyRole(val) {
      if (+val.Role_Id != 252) {
        // console.log(val);
        this.dialogFormVisible = true
        this.roleName = val.Role_Id
        val.pageList.forEach(item => {
          this.pages.push(item.Page_Id)
        })
        this.title = '修改'
      }

    },
    //删除
    deleteRole(val){
      // console.log(val);
      if(+val.Role_Id != 252){
        let sure = window.confirm('确认删除？')
        if(sure){
          this.$http.post('/Manage/RoleManagement/Rmove',{
            'User_Id':window.localStorage.getItem('userId'),
            'Role_Id':val.Role_Id
          }).then((data) => {
            // console.log(data);
            if(+data.Data.code === 0){
              this.$http.post('/Manage/RoleManagement/Index',{
                'User_Id':window.localStorage.getItem('userId')
              }).then((data) => {
                // console.log(data);
                if(data.Data.result.length){
                  this.tableData = data.Data.result
                }
              })
            }
          })
        }
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
        title:'角色管理'
      }
    ])

    this.$http.post('/Manage/RoleManagement/Index',{
      'User_Id':window.localStorage.getItem('userId')
    }).then((data) => {
      // console.log(data);
      if(data.Data.result.length){
        this.tableData = data.Data.result
        this.pageList = data.Data.pageList
        this.roleList = data.Data.roleList
      }
    })
  }
}
