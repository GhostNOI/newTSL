import {triggerLevel,toChinese} from "../../../common/filters";
export default {
  name: "WarningTrigger",
  data () {
    return{
      projectLocation:'',
      projectCode:'',
      optionArea: [],
      projectOption:[],
      Province_Code:'',
      City_Code:'',
      Area_Code:'',
      tableData: [
        {
          a: 'CPU',
          b: '2项',
          c: '3项',
          detail: [
            {
              monitor: '平均负载 (1min)',
              monitorName: 'Processor load (1 min average per core)',
              trigger: '{TemplateOSLinux:system.cpu.load[percpu,avg1].avg(5m)}>5',
              triggerLevel: '严重',
              duration: '1min',
            },
            {
              monitor: '平均负载 (1min)',
              monitorName: 'Processor load (1 min average per core)',
              trigger: '{TemplateOSLinux:system.cpu.load[percpu,avg1].avg(5m)}>5',
              triggerLevel: '严重',
              duration: '1min',
            }
          ]
        },
        {
          a: 'CPU',
          b: '2项',
          c: '3项',
          detail: [
            {
              monitor: '平均负载 (1min)',
              monitorName: 'Processor load (1 min average per core)',
              trigger: '{TemplateOSLinux:system.cpu.load[percpu,avg1].avg(5m)}>5',
              triggerLevel: '1',
              duration: '1min',
            },
            {
              monitor: '平均负载 (1min)',
              monitorName: 'Processor load (1 min average per core)',
              trigger: '{TemplateOSLinux:system.cpu.load[percpu,avg1].avg(5m)}>5',
              triggerLevel: '2',
              duration: '1min',
            }
          ]
        },
      ],
      levelArr: [
        {id:1 ,name: '不严重'},
        {id:2 ,name: '严重'},
        {id:3 ,name: '很严重'},
        {id:4 ,name: '炸了'}
      ],
      tableData1:[],
      waringLevel:[],
      waringLevelChange:'',
      areaCode:[],
      projectName:'',
      defaultIpt:true
    }
  },
  methods:{
    selectArea(val){
      // console.log(val);
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

      this.$http.post('/Manage/WarningSeting/ProjectList',{
        'User_Id':window.localStorage.getItem('userId'),
        'Province_Code':this.Province_Code,
        'City_Code':this.City_Code,
        'Area_Code':this.Area_Code
      }).then((data) => {
        // console.log(data);
        this.projectOption = data.Data.data
        // console.log(this.projectOption);
      })
      this.projectOption = []
    },
    changeSelect(item) {
      this.$set(item, 'checked', !item.checked);
    },
    changeLevel(item) {
      if(item.changed){
        this.$http.post('/Manage/WarningSeting/Update',{
          'User_Id':window.localStorage.getItem('userId'),
          'id':item.Id,
          'Project_Code':item.Project_Code,
          'Condition':item.Condition,
          'Warning_Level':this.waringLevelChange,
          'Description':item.Description
        }).then((data) => {
          // console.log(data);
          this.$http.post('/Manage/WarningSeting/Index',{
            'User_Id':window.localStorage.getItem('userId'),
            'Project_Code':this.projectCode
          }).then((data) => {
            this.waringLevel = data.Data.data.warning_Level;
            this.$set(item,item.Warning_Level,this.waringLevel);
            this.$set(item, 'changed', !item.changed);
          })
        })
      } else {
        this.$set(item, 'changed', !item.changed);
      }
    },

    //点击查询按钮
    query(){
      this.$http.post('/Manage/WarningSeting/Index',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.projectCode,
      }).then((data) => {
        if(+data.ErrorCode === -91){
          return ;
        }else if(data.Data.data.result.length > 0){
          this.defaultIpt = false
        }
        console.log(data);
        this.tableData1 = data.Data.data.result
        this.waringLevel = data.Data.data.warning_Level
        // console.log(this.waringLevel);
      })
    },
    //重置（无意义）
    resetForm() {
      // this.projectCode = ''
      // this.areaCode = []
      // this.$http.post('/Manage/WarningSeting/Index',{
      //   'User_Id':window.localStorage.getItem('userId'),
      //   'Project_Code':this.projectCode,
      // }).then((data) => {
      //   console.log(data);
      //   this.tableData1 = data.Data.data.result
      //   this.waringLevel = data.Data.data.warning_Level
      //   console.log(this.waringLevel);
      // })
    },
    changeVal(val,item){
      // console.log(val);
      // console.log(item);
      this.waringLevelChange = val
    },
    //切换项目之后更改项目名称
    getName(val){
      let name = {}
      name = this.projectOption.find(item => {
        return item.Project_Code === val
      })
      this.projectName = name.Project_Name
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
        title:'预警规则'
      }
    ])
    if(this.$route.query){
      this.projectName = this.$route.query.Project_Name
    }
//选择项目所在地的省市区的三级联动
    this.$http.post('/Manage/User/ThreeLevelLinkage',{
      User_Id:window.localStorage.getItem('userId')
    }).then( (data) => {
      //console.log(data.Data);
      this.optionArea = data.Data.threeLevelLinkage
      //console.log(this.optionArea);
    })
    this.projectCode = this.$route.query === {} ? '' : this.$route.query.Project_Code
    //表格数据
    // console.log(this.projectCode);
    this.$http.post('/Manage/WarningSeting/Index',{
      'User_Id':window.localStorage.getItem('userId'),
      'Project_Code':this.projectCode
    }).then((data) => {
      console.log(data);
      if(+data.ErrorCode === -91){
        this.defaultIpt = true
        return
      }else if(data.Data.data.result.length > 0){
        this.defaultIpt = false
      }
      this.tableData1 = data.Data.data.result
      this.waringLevel = data.Data.data.warning_Level
      this.projectCode = ''
    })
  },
  filters : {
    triggerLevel:triggerLevel,
    toChinese: toChinese
  }
}
