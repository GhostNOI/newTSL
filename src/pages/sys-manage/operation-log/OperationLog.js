import {transformDate} from "../../../common/filters";

export default {
  name: "OperationLog",
  data () {
    return{
      value:[],
      projectName:'',
      userList:[],
      tableData :[],
      howMany:null,
      countPage:null,
      userId:'',
      currentPage:1,
      pageNum:'',
      pageSize:10,
      operate:''
    }
  },
  methods:{
    //查询
    query(){
      this.currentPage = 1
      this.$http.post('/Manage/OperateLogs/Index',{
        'User_Id':window.localStorage.getItem('userId'),
        'Operate_user_Id':this.userId,
        'Api_Desc':this.operate,
        'startTime':this.value[0] ? this.value[0] : '',
        'endTime':this.value[1] ? this.value[1] : '',
        'pageSize':this.pageSize
      }).then((data) => {
        // console.log(data);
        this.tableData = data.Data.data.operateLogsList
        this.howMany = data.Data.data.howMany
        this.countPage = data.Data.data.countPage
      })
    },
    //重置
    resetForm() {
      this.currentPage = 1;
      this.value = [];
      this.userId = '';
      this.operate = '';
      this.$http.post('/Manage/OperateLogs/Index',{
        'User_Id':window.localStorage.getItem('userId'),
      }).then((data) => {
        // console.log(data);
        this.tableData = data.Data.data.operateLogsList
        this.howMany = data.Data.data.howMany
      })
    },
    //分页
    handleCurrentChange(val) {
      //页码切换
      this.pageNum = val
      // console.log(val);
      // console.log(this.pageSize);
      this.$http.post('/Manage/OperateLogs/Index',{
        'User_Id':window.localStorage.getItem('userId'),
        'Operate_user_Id':this.userId,
        'Api_Desc':this.operate,
        // 'startTime':'',
        // 'endTime':''
        'startTime':this.value[0] ? this.value[0] : '',
        'endTime':this.value[1] ? this.value[1] : '',
        'pageNum':val,
        'pageSize':this.pageSize
      }).then((data) => {
        // console.log(data);
        this.tableData = data.Data.data.operateLogsList
        this.howMany = data.Data.data.howMany
        this.countPage = data.Data.data.countPage
      })
    },
    handleSizeChange(val){
      //表格一页数据多少切换
      this.pageSize = val
      this.$http.post('/Manage/OperateLogs/Index',{
        'User_Id':window.localStorage.getItem('userId'),
        'Operate_user_Id':this.userId,
        'Api_Desc':this.operate,
        // 'startTime':'',
        // 'endTime':''
        'startTime':this.value[0] ? this.value[0] : '',
        'endTime':this.value[1] ? this.value[1] : '',
        'pageNum':this.pageNum,
        'pageSize':val
      }).then((data) => {
        this.tableData = data.Data.data.operateLogsList
        this.howMany = data.Data.data.howMany
        this.countPage = data.Data.data.countPage
      })
    }
  },
  filters: {
    transformDate: transformDate
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
        title:'操作日志'
      }
    ])
    //初始表格
    this.$http.post('/Manage/OperateLogs/Index',{
      'User_Id':window.localStorage.getItem('userId'),
    }).then((data) => {
      console.log(data);
      this.userList = data.Data.data.userList
      this.tableData = data.Data.data.operateLogsList
      this.howMany = data.Data.data.howMany
      this.countPage = data.Data.data.countPage
    })
  }
}
