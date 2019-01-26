import {dateFilter} from "../../../common/filters";

export default {
  name: "Property",
  data () {
    return{
      projectLocation:'',
      projectName:'',
      projectId:'',
      optionArea:[],
      threeLevelLinkage:'',
      projectTable:'',
      currentPage:1,
      howMany:null,
      Province_Code:'',
      City_Code:'',
      Area_Code:'',
      Project_Code:'',
      dialogFormVisible:false,
      datePick:'',
      areaCode:[]

    }
  },
  methods:{
    //跳转到预警触发
    toWarningtrigger() {
      this.$router.push({
        path: '/warningtrigger',
        query: {
          id: 123,
          name: 'aaa'
        }
      })
    },
    //跳转到智能设备
    toSmartDevice(val) {
      console.log(val);
      this.$router.push(`/project-index/${val.Project_Code}/smartdevice`)
    },
    selectArea (val) {
      this.threeLevelLinkage = val
      if(this.threeLevelLinkage.length === 1){
        this.Province_Code = this.threeLevelLinkage[0]
      }else if(this.threeLevelLinkage.length === 2){
        this.Province_Code = this.threeLevelLinkage[0]
        this.City_Code = this.threeLevelLinkage[1]
      }else{
        this.Province_Code = this.threeLevelLinkage[0]
        this.City_Code = this.threeLevelLinkage[1]
        this.Area_Code = this.threeLevelLinkage[2]
      }
      console.log(this.threeLevelLinkage);
    },
    //查询
    query () {
      this.$http.post('/Manage/ProjectList/Index',{
        'User_Id':window.localStorage.getItem('userId'),
        'Province_Code':this.Province_Code,
        'City_Code':this.City_Code,
        'Area_Code':this.Area_Code,
        'Project_Code':this.projectId,
        'Project_Name':this.projectName
      }).then((data) => {
        console.log(data);
        this.projectTable = data.Data.data
        this.howMany = data.Data.howMany
      })
      console.log('aa');
    },
    //重置
    resetForm() {
      this.projectId = ''
      this.projectName = ''
      this.areaCode = []
      this.$http.post('/Manage/ProjectList/Index',{
        'User_Id':window.localStorage.getItem('userId'),
      }).then((data) => {
        console.log(data);
        this.projectTable = data.Data.data
        this.howMany = data.Data.howMany
      })
    },
    //分页按钮
    handleCurrentChange(val) {
      console.log(val);
      this.$http.post('/Manage/ProjectList/Index',{
        'User_Id':window.localStorage.getItem('userId'),
        'pageNum':val,
        'Province_Code':this.Province_Code,
        'City_Code':this.City_Code,
        'Area_Code':this.Area_Code
      }).then((data) => {
        this.projectTable = data.Data.data
        this.howMany = data.Data.howMany
      })
    },
    //每页多少条数据
    handleSizeChange(val){
      console.log(val);
      this.$http.post('/Manage/ProjectList/Index',{
        'User_Id':window.localStorage.getItem('userId'),
        'pageSize':val,
        'pageNum':1,
        'Province_Code':this.Province_Code,
        'City_Code':this.City_Code,
        'Area_Code':this.Area_Code
      }).then((data) => {
        this.projectTable = data.Data.data
        this.howMany = data.Data.howMany
      })
    },

    //新建按钮弹出弹框
    createNewProject(){

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
        title:'资产配置'
      }
    ])

    //进入页面默认显示表格数据
    this.$http.post('/Manage/ProjectList/Index',{
      'User_Id':window.localStorage.getItem('userId')
    }).then((data) => {
      console.log(data);
      this.projectTable = data.Data.data
      this.howMany = data.Data.howMany
      console.log(this.projectTable);
    })

    //选择项目所在地的省市区的三级联动
    this.$http.post('/Manage/User/ThreeLevelLinkage',{
      User_Id:window.localStorage.getItem('userId')
    }).then( (data) => {
      //console.log(data.Data);
      this.optionArea = data.Data.threeLevelLinkage
      //console.log(this.optionArea);
    })
  },
  filters: {
    dateFilter: dateFilter
  }
}
