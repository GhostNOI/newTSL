import echarts from 'echarts'
import {FormatDate} from "../../../common/utils";
import {transformDate} from '../../../common/filters.js'
export default {
  name: "Overview",
  data(){
    return{
      location:'',
      deviceCount:'',
      serversCount:'',
      deviceOnlineRate:'',
      memoryChart:'',
      hardriveChart:'',
      cpuChart:'',
      deviceOnlineChart:'',
      databaseLinkChart:'',
      waring:[],
      todayErroyLogMount:'',
      todaySlowLogMount:'',
      notDoWarningLogMount:'',
      timer: null,
      security:false,
      deviceShow:false,
      securityMsg:'',
      securityTime:'',
      deviceStatus:'',
      deviceType:'',
      deviceName:'',
      projectRuleMount:'',

    }
  },
  destroyed() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  filters: {
    transformDate : transformDate
  },
  mounted() {
    const headerObj = this.$store.state.header.headData.find(item => item.Project_Code === this.$route.params.id);
    this.$store.commit('changeHeadTitle', [
      {
        url: `/project-index/${this.$route.params.id}`,
        title: headerObj.Project_Name
      },
    ])
    //内存占用率
    this.memoryChart = echarts.init(document.getElementById('memoryChart'),'dark');
    this.memoryChart.setOption({
      backgroundColor: 'transparent',
      title:{
        subtext:'内存占用率',
        subtextStyle:{
          color: '#fff'
        },
        left:'3%'
      },
      tooltip:{
        trigger: 'axis',
        showContent:false,
        axisPointer: {
          type: 'none'
        }
      },
      grid:{
        left: '3%',
        right: '14%',
        top: 40,
        bottom: '3%',
        containLabel: true
      },
      xAxis:{
        type: 'value',
        boundaryGap: [0,0.01],
        max: 100,
        axisLine:{
          show: false
        },
        axisTick:{
          length: 0
        },
        axisLabel:{
          show: false
        },
        splitLine: {
          show: false
        }
      },

      yAxis:{
        type: 'category',
        axisLine: {
          show: false
        },
        axisTick: {
          length: 0
        },
        data:[]
      },
      // series:[
      //   {
      //     name:'background',
      //     type:'bar',
      //     barWidth: 10,
      //     itemStyle: {
      //       color:['#1D223D'],
      //     },
      //     data:[100,100,100,100,100]
      //   },
      //   {
      //     name:'Linux 1',
      //     type:'bar',
      //     barWidth: 10,
      //     barGap:'-100%',
      //     label:{
      //       show:true,
      //       position:'right',
      //       formatter: '{@[0]}%'
      //     },
      //     itemStyle: {
      //       color: ['#9A54F5'],
      //     },
      //     data:[[20,'Linux 1']]
      //
      //   },
      //   {
      //     name: 'Linux 2',
      //     type: 'bar',
      //     barWidth: 10,
      //     label: {
      //       show: true,
      //       position: 'right',
      //       formatter: '{@[0]}%'
      //     },
      //     itemStyle: {
      //       color: ['#4681FF'],
      //     },
      //     data: [[45,'Linux 2']]
      //   },
      //   {
      //     name: 'Linux 3',
      //     type: 'bar',
      //     barWidth: 10,
      //     label: {
      //       show: true,
      //       position: 'right',
      //       formatter: '{@[0]}%'
      //     },
      //     itemStyle: {
      //       color: ['#0BB9FF'],
      //     },
      //     data: [[30,'Linux 3']]
      //   },
      //   {
      //     name: 'Linux 4',
      //     type: 'bar',
      //     barWidth: 10,
      //     label: {
      //       show: true,
      //       position: 'right',
      //       formatter: '{@[0]}%'
      //     },
      //     itemStyle: {
      //       color: ['#46FFB9'],
      //     },
      //     data: [[80,'Linux 4']]
      //   },
      //   {
      //     name: 'Linux 5',
      //     type: 'bar',
      //     barWidth: 10,
      //     label: {
      //       show: true,
      //       position: 'right',
      //       formatter: '{@[0]}%'
      //     },
      //     itemStyle: {
      //       color: ['#F6EB69'],
      //     },
      //     data: [[35,'Linux 5']]
      //   }
      // ]
    });


    //磁盘占用率
    this.hardriveChart = echarts.init(document.getElementById('hardriveChart'),'dark');
    this.hardriveChart.setOption({
      backgroundColor:'transparent',
        title:{
        subtext:'磁盘占用率',
        subtextStyle:{
          color: '#fff'
        },
        left:'3%',
      },
      tooltip:{
        trigger: 'axis',
        showContent: false,
        axisPointer : {
          type : 'none'
        }
      },
      grid: {
        left: '3%',
        right: '14%',
        top: 40,
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        max: 100,
        axisLine: {
          show: false
        },
        axisTick: {
          length: 0
        },
        axisLabel: {
          show: false
        },
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'category',
        axisLine: {
          show: false
        },
        axisTick: {
          length: 0
        },
        data: []
      },
      series: []
     });

    // cpu平均负载
    this.cpuChart = echarts.init(document.getElementById('cpuChart'),'dark')
    this.cpuChart.setOption({
      backgroundColor: 'transparent',
      title: {
        subtext: 'CPU平均负载',
        subtextStyle:{
          color: '#fff'
        },
        left:'3%'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      grid: {
        left: '3%',
        right: '10%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLine: {
          show: false
        },
        axisTick: {
          length: 0
        },
        data: []
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        axisTick: {
          length: 0
        }
      },
      legend: {
        data: [],
        top: '10%',
        right: '4%'
      },
      series:[
        // {
        //   name:'linux1',
        //   type:'line',
        //   smooth: true,
        //   itemStyle:{
        //     color: 'rgb(154, 84, 245)'
        //   },
        //   lineStyle: {
        //     width: 3,
        //     color: 'rgb(154, 84, 245)'
        //   },
        //   areaStyle: {
        //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
        //       offset: 0,
        //       color: 'rgba(154, 84, 245, 0.8)'
        //     },{
        //       offset: 1,
        //       color: 'rgba(154, 84, 245, 0)'
        //     }])
        //   },
        //   data:[0.08, 0.25, 0.1, 0.11, 0.05, 0.07, 0.08]
        // },
        // {
        //   name:'linux2',
        //   type:'line',
        //   smooth: true,
        //   itemStyle:{
        //     color: 'rgb(70, 129, 255)'
        //   },
        //   lineStyle: {
        //     width: 3,
        //     color: 'rgb(70, 129, 255)'
        //   },
        //   areaStyle: {
        //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
        //       offset: 0,
        //       color: 'rgba(70, 129, 255, 0.8)'
        //     }, {
        //       offset: 1,
        //       color: 'rgba(70, 129, 255, 0)'
        //     }])
        //   },
        //   data:[0.12, 0.09, 0.21, 0.03, 0.12, 0.20, 0.14]
        // },
        // {
        //   name:'linux3',
        //   type:'line',
        //   smooth: true,
        //   itemStyle:{
        //     color: 'rgb(11, 185, 255)'
        //   },
        //   lineStyle: {
        //     width: 3,
        //     color: 'rgb(11, 185, 255)'
        //   },
        //   areaStyle: {
        //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
        //       offset: 0,
        //       color: 'rgba(11, 185, 255, 0.8)'
        //     }, {
        //       offset: 1,
        //       color: 'rgba(11, 185, 255, 0)'
        //     }])
        //   },
        //   data:[0.19, 0.01, 0.11, 0.23, 0.03, 0.13, 0.08]
        // },
        // {
        //   name:'linux4',
        //   type:'line',
        //   smooth: true,
        //   itemStyle:{
        //     color: 'rgb(70, 255, 185)'
        //   },
        //   lineStyle: {
        //     width: 3,
        //     color: 'rgb(70, 255, 185)'
        //   },
        //   areaStyle: {
        //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
        //       offset: 0,
        //       color: 'rgba(70, 255, 185, 0.8)'
        //     }, {
        //       offset: 1,
        //       color: 'rgba(70, 255, 185, 0)'
        //     }])
        //   },
        //   data:[0.02, 0.12, 0.07, 0.13, 0.02, 0.18, 0.04]
        // },
        // {
        //   name: 'linux5',
        //   type: 'line',
        //   smooth: true,
        //   itemStyle: {
        //     color: 'rgb(246, 235, 105)'
        //   },
        //   lineStyle: {
        //     width: 3,
        //     color: 'rgb(246, 235, 105)'
        //   },
        //   areaStyle: {
        //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
        //       offset: 0,
        //       color: 'rgba(246, 235, 105, 0.8)'
        //     }, {
        //       offset: 1,
        //       color: 'rgba(246, 235, 105, 0)'
        //     }])
        //   },
        //   data: [0.06, 0.24, 0.11, 0.23, 0.06, 0.13, 0.10]
        // }
      ]
    })


    //设备在线率
    this.deviceOnlineChart = echarts.init(document.getElementById('deviceOnlineChart'),'dark')
    this.deviceOnlineChart.setOption({
      backgroundColor: 'transparent',
      title:{
        subtext: '设备在线率',
        subtextStyle:{
          color: '#fff',
          fontWeight: 800
        },
        left: 'left'
      },
      series:[

      ]
    })

    // 数据库连接
    this.databaseLinkChart = echarts.init(document.getElementById('databaseLinkChart'),'dark')
    this.databaseLinkChart.setOption({
      backgroundColor: 'transparent',
      color: ['#37A2DA'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      title: {
        subtext: '数据库连接数',
        subtextStyle:{
          color: '#fff'
        },
        left:'3%'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLine: {
          show: false
        },
        axisTick: {
          length: 0
        },
        data: []
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        axisTick: {
          length: 0
        }
      },
      series:[
        {
          name: '进程变化',
          data: [],
          type: 'line',
          smooth: true,
          itemStyle:{
            color: 'rgb(70, 129, 255)'
          },
          lineStyle: {
            width: 3,
            color: 'rgb(70, 129, 255)'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(70, 129, 255, 0.8)'
            },{
              offset: 1,
              color: 'rgba(70, 129, 255, 0)'
            }])
          },
        }
      ]
    })
    this.timer = setInterval(() => {
      this.getData(this.$route.params.id);
    },300000)

    this.getData(this.$route.params.id);

    // Date.prototype.toLocaleString = function () {
    //   return this.getHours() + ':' + this.getMinutes()
    // }
    // var date = new Date()
    // console.log(date.toLocaleString());
    // console.log('1544716800'.toLocaleString());

    this.hardriveChart.on('click', () => {
      this.$router.push({path:'/tendency'})
    })
  },
  watch: {
    $route(newVal) {
      this.getData(newVal.params.id);
    }
  },
  methods: {
    //更多
    more() {
      this.$router.push(`/project-index/${this.$route.params.id}/warningevent`)
    },
    getData(Project_Code) {
      const headerObj = this.$store.state.header.headData.find(item => item.Project_Code === this.$route.params.id);
      this.$store.commit('changeHeadTitle', [
        {
          url: `/project-index/${this.$route.params.id}`,
          title: headerObj.Project_Name
        },
      ])

      //请求接口，处理数据，正式测试要把setinterval加上
      this.$http.post('/Manage/Project/Index',{
        User_Id:window.localStorage.getItem('userId'),
        Project_Code: Project_Code
      }).then((data) => {
        console.log(data);
        // console.log(data.Data);
        //设备数量以及平台部署位置
        //预警赋值
        this.waring = data.Data.data.waringEventList
        //日志相关
        this.todayErroyLogMount = data.Data.data.todayErroyLogMount
        this.todaySlowLogMount = data.Data.data.todaySlowLogMount
        this.notDoWarningLogMount = data.Data.data.notDoWarningLogMount
        this.deviceCount = data.Data.data.deviceCount
        this.serversCount = data.Data.data.serversCount
        this.deviceOnlineRate = data.Data.data.deviceOnlineRate
        if(data.Data.data.projectDetial.Area_Name == null){
          this.location = data.Data.data.projectDetial.Province_Name + data.Data.data.projectDetial.City_Name
        }else{
          this.location = data.Data.data.projectDetial.Province_Name + data.Data.data.projectDetial.City_Name + data.Data.data.projectDetial.Area_Name
        }
        let offLineRate = 100 - Number(data.Data.data.deviceOnlineRate)
        //内存
        let memoryData = data.Data.data.serversMemoryUsageRate
        //CPU
        let cpuData = data.Data.data.serversCPULoadAverage;
        //数据库
        let database = data.Data.data.databaseConnectionTotal;
        //磁盘占用率数据
        //定义一个变量保存磁盘占用率数据
        let disk = data.Data.data.ServersDiskUsageRate
        // console.log(disk);
        //磁盘占用率数据
        //已监控项
        this.projectRuleMount = data.Data.data.projectRuleMount
        let hardrive = [];
        let yAxisHardrive = [];
        let color = ['#9A54F5','#4681FF','#0BB9FF','#46FFB9','#F6EB69']
        let diskRate = [];
        let diskData = []
        for (let i in disk) {
          hardrive.push(disk[i])
          yAxisHardrive.push(disk[i].Server_Name)
          diskRate.push(disk[i].Disk_Usage_Rate)
        }
        // for(let j = 0; j<disk.length;j++){
        //   diskData.push(100)
        // }
        // let diskSeries = [
        //   {
        //     name: 'background',
        //     type: 'bar',
        //     barWidth: 10,
        //     itemStyle: {
        //       color: ['#1D223D'],
        //     },
        //     data: diskData
        //   }
        // ]
        let diskSeries = []
        for(let k in hardrive){
          diskSeries.push(
            {
              name: hardrive[k].Server_Code,
              type: 'bar',
              barWidth: 10,
              barGap:'-100%',
              label: {
                show: true,
                position: 'right',
                formatter: '{@[0]}%'
              },
              itemStyle: {
                color: [color[k]],
              },
              data: [[hardrive[k].Disk_Usage_Rate,hardrive[k].Server_Code]]
            }
          )
        }
        this.hardriveChart.setOption({
          yAxis:{
            data:yAxisHardrive
          },
          series:diskSeries
        })
//设备在线率数据
        this.deviceOnlineChart.setOption({
          series:[
            {
              name:'在线设备',
              type:'pie',
              radius: ['62%', '70%'],
              center:['50%','60%'],
              avoidLabelOverlap: false,
              labelLine: {
                normal: {
                  show: false
                }
              },
              data:[
                {
                  value:data.Data.data.deviceOnlineRate,
                  itemStyle:{color:'#46FFB9'},
                  label:{
                    show: true,
                    position: 'center',
                    formatter: '{d}%',
                    color: '#fff',
                    fontSize: '20'
                  },
                },
                {
                  value:offLineRate,
                  itemStyle:{color:'#1D223D'}
                },
              ]
            }
          ]
        })


//内存占用率数据
        // 修改yAxis中的data
        let memoryDeviceName = []
        // 修改series
        //定义series中的第一个对象中的data数量
        let memoryDeviceNumber = []
        for(let j; j<memoryData.length; j++){
          memoryDeviceNumber.push(100)
        }
        let memorySeries = [
          {
            name:'background',
            type:'bar',
            barWidth: 10,
            itemStyle: {
              color:['#1D223D'],
            },
            data:memoryDeviceNumber
          }
        ]
        for(let i in memoryData){
          memoryDeviceName.push(memoryData[i].Server_Name)
          memorySeries.push(
            {
              name: memoryData[i].Server_Name,
              type: 'bar',
              barWidth: 10,
              barGap:'-100%',
              label: {
                show: true,
                position: 'right',
                formatter: '{@[0]}%'
              },
              itemStyle: {
                color: color[i],
              },
              data: [[memoryData[i].Memory_Usage_Rate,memoryData[i].Server_Name]]
            }
          )
        }

        this.memoryChart.setOption({
          yAxis:{
            data:memoryDeviceName
          },
          series:memorySeries
        })


//CPU平均负载
        //修改xAxis中的data,这里data是时间
        // console.log(cpuData);
        let cpuDetail = []
        //数组保存时间轴
        let cpuDate = []
        cpuData.forEach((value) =>{
          cpuDetail.push(value.detial)
        })
        // console.log(cpuDetail);
        //时间坐标轴数据
        let cpuTime = []
        cpuTime = cpuDetail[0] ? cpuDetail[0] : [];
        // console.log(cpuTime);
        let displayTime = []
        cpuTime.forEach((item,i) => {
          displayTime.push(FormatDate(item.Insert_Time*1000,'HH:mm'))
        })
        //xAxis中的data改成displaytime
        //series中的data需替换，几条折线就是几个数据，需要把数组结构push进去
        //color数值需要改，渐变，总共需要三个数组循环遍历color的值
        //图表折线颜色
        let cpuColor = ['154, 84, 245','70, 129, 255','11, 185, 255','70, 255, 185','246, 235, 105']
        let cpuColorChange1 = ['154, 84, 245, 0.8','70, 129, 255, 0.8','11, 185, 255, 0.8','70, 255, 185 ,0.8','246, 235, 105 ,0.8']
        let cpuColorChange2 = ['154, 84, 245, 0','70, 129, 255, 0','11, 185, 255 ,0','70, 255, 185 ,0','246, 235, 105 ,0']
        let cpuSeriesData = []
        let cpuDisplayData = []
        let serverName = []
        cpuData.forEach((item,i) => {
          //cpuDisplayData保存[{},{}]
          cpuDisplayData.push(item.detial)
          serverName.push(item.Name)
          cpuSeriesData.push(
            {
              name:item.Name,
              type:'line',
              smooth: true,
              itemStyle:{
                color: 'rgb('+ cpuColor[i] +')'
              },
              lineStyle: {
                width: 1,
                color: 'rgb('+ cpuColor[i] +')'
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba('+ cpuColorChange1[i] +')'
                },{
                  offset: 1,
                  color: 'rgba('+ cpuColorChange2[i] +')'
                }])
              },
              // data:cpuDisplayData,
              data:cpuDisplayData[i].map((item,i) => {
                return item.CPU_Load_Average
              })
            }
          )
        })
        // console.log(serverName);
        //cpuSeriesData的结果打印
        // console.log(cpuSeriesData);
        this.cpuChart.setOption({
          xAxis:{data:displayTime},
          legend:{data:serverName},
          series:cpuSeriesData
        })
// 数据库连接数
//       console.log(database);
        //需要替换的数据有xAxis中的data和series，series中的数据是通过push放进去的数组的元素
        //时间
        let databaseTime = [];
        if (database[0]) {
          database[0].detial.forEach((item,i) => {
            databaseTime.push(FormatDate(item.Insert_Time*1000,'HH:mm'))
          })
        }
        let databaseData =[]
        let databaseDisplayData = []
        //数据处理，合成echarts最终需要的数据格式
        database.forEach((item,i) => {
          databaseDisplayData.push(item.detial)
          databaseData.push(
            {
              name: item.DB_Name,
              type: 'line',
              smooth: true,
              itemStyle:{
                color: 'rgb('+ cpuColor[i] +')'
              },
              lineStyle: {
                width: 1,
                color: 'rgb('+ cpuColor[i] +')'
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba('+ cpuColorChange1[i] +')'
                },{
                  offset: 1,
                  color: 'rgba('+ cpuColorChange2[i] +')'
                }])
              },
              data: databaseDisplayData[i].map((item) => {
                return item.Connection_Total
              })
            }
          )
        })
        // 替换数据
        // console.log(databaseData);
        this.databaseLinkChart.setOption({
          xAxis:{data:databaseTime},
          series:databaseData
        })
      })


    },
    toDetail(val){
      console.log(val);
      if(val.Warning_Group == '1'){
        //服务器跳转到走势图
        this.$router.push({
          path:'tendency',
          query:val
        })
      }else if(val.Warning_Group == '2'){
        //数据库，跳转到慢日志
        this.$router.push({
          path:'slowlog',
          query:val
        })
      }else if(val.Warning_Group == '3'){
        //应用服务，跳转到错误日志
        this.$router.push({
          path:'errorLog',
          query:val
        })
      }else if(val.Warning_Group == '4'){
        //智能设备，打开弹框
        if(val.CameraMsg.length > 0){
          this.deviceName = val.CameraMsg[0].Name
          this.deviceType = val.Source_Type_Name
          this.deviceStatus = val.CameraMsg[0].IsOnline_Name
        }else if(val.LockMsg.length > 0){
          this.deviceName = val.LockMsg[0].Name
          this.deviceType = val.Source_Type_Name
          this.deviceStatus = val.LockMsg[0].IsOnline_Name
        }else if(val.SmokeMsg.length > 0){
          this.deviceName = val.SmokeMsg[0].Name
          this.deviceType = val.Source_Type_Name
          this.deviceStatus = val.SmokeMsg[0].IsOnline_Name
        }
        this.deviceShow = true
      } else{
        //安全，打开弹框
        this.security = true
        this.securityTime = val.Warning_Time
        this.securityMsg = val.Security_Msg
      }
    },
    toWarningLog() {
      this.$router.push(`/project-index/${this.$route.params.id}/warninglog`)
    },
    toErrorLog() {
      this.$router.push(`/project-index/${this.$route.params.id}/errorlog`)
    },
    toSlowLog() {
      this.$router.push(`/project-index/${this.$route.params.id}/slowlog`)
    }
  }
}
