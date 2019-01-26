import echarts from 'echarts'
import {transformDate,eventType} from "../../../../../common/filters";

export default {
  name: "WraningEvent",
  data () {
    return{
      eventTypeChart:null,
      eventRankingChart:null,
      //表格数据环比
      ringRatio:[],
      //表格数据预警事件排名
      eventRank:[],
      peiChartsDate:[
        {name:'今日',code:'1'},
        {name:'本周',code:'7'},
        {name:'本月',code:'30'}
      ],
      histogramDate:[
        {name:'今日',code:'1'},
        {name:'本周',code:'7'},
        {name:'本月',code:'30'}
      ],
      pei:1,
      histogram:1,
      type:[
        {name:'全部',code:'all'},
        {name:'服务器',code:'server'},
        {name:'数据库',code:'database'},
        {name:'应用服务',code:'application'},
        {name:'智能设备',code:'smartDevice'},
        {name:'安全',code:'security'}
      ],
      typeIndex:0,
      waringEventList:'',
    //  分页
      currentPage:1,
      howMany:null,
      //设备弹框
      deviceShow:false,
      deviceName:'',
      deviceType:'',
      deviceStatus:'',
      //安全弹框
      security:false,
      securityTime:'',
      securityMsg:'',
      pageSize:10,
      pageNum:1,
      delive:'1',
    }
  },


  methods:{
    //倒计时
    countDown(val) {
      console.log(val);
      this.$http.post('/Manage/WaringEvent/WaringEventList',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'warning_Id':val.Id
      }).then((data) => {
        console.log(data);
        if(data.Data.waringEventList){
          if(data.Data.waringEventList[0].lastTime === ''){
            this.delive = `已催办给${data.Data.waringEventList[0].other_Name}`
          }else{
            this.delive = `倒计时${waringEventList[0].lastTime}秒`
          }
        }
      })
    },
//饼图点击天数切换数据
    daysOptionPei(val,i){
      this.pei = i
      this.$http.post('/Manage/WaringEvent/Index',{
        'User_Id':window.localStorage.getItem('userId'),
        'dayType':val.code,
        'Project_Code':this.$route.params.id
      }).then((data) => {
        // console.log(data);
        let total = []
        total = data.Data.data.waringPiechart
        let chartData = []
        let color=['#9A54F5','#4681FF','#46FFB9','#FF806D','#D7438A']
        let displayData = []
        let legendData = []
        total.forEach((item,i) => {
          chartData.push(item)
          displayData.push(
            {name:item.Waring_Type,value:item.perc,itemStyle:{color:color[i]}}
          )
          legendData.push(
            {name:item.Waring_Type,icon:'circle'}
          )
        })
        this.eventTypeChart.setOption({
          legend:{
            data:legendData,
            formatter: function (name) {
              for(let i in chartData){
                if(name == chartData[i].Waring_Type) var per = (+chartData[i].perc*100).toFixed(0) + '%'
              }
              return name +''+ per
            }
          },
          series:[
            {data:displayData}
          ]
        })
      })
    },
//柱状图点击切换数据
    daysHistogram(val,i){
      this.histogram = i
      this.$http.post('/Manage/WaringEvent/WaringEventRank',{
        'User_Id':window.localStorage.getItem('userId'),
        'dayType':val.code,
        'Project_Code':this.$route.params.id
      }).then((data) => {
        console.log(data);
        let eventRank = []
        eventRank = data.Data.waringPiechart
        console.log(eventRank);
        let eventNum = []
        this.ringRatio = []
        this.eventRank = []
        eventRank.forEach((item,i) => {
          eventNum.unshift(item.num)
          this.ringRatio.push(item.waringRingRatio)
          this.eventRank.push(item)
        })
        console.log(this.ringRatio);
        this.eventRankingChart.setOption({
          series:[
            {data:eventNum}
          ]
        })
      })
    },


    //点击切换预警类型
    tabChange(val,i){
      this.typeIndex = i
      console.log(i);
      if(this.typeIndex === 0){
        this.$http.post('/Manage/WaringEvent/WaringEventList',{
          'User_Id':window.localStorage.getItem('userId'),
          'Project_Code':this.$route.params.id,
        }).then((data) => {
          console.log(data);
          this.waringEventList = data.Data.waringEventList
          this.howMany = data.Data.howMany
        })
      }else if(this.typeIndex === 1){
        this.$http.post('/Manage/WaringEvent/WaringEventList',{
          'User_Id':window.localStorage.getItem('userId'),
          'Project_Code':this.$route.params.id,
          'Warning_Group':1
        }).then((data) => {
          console.log(data);
          this.waringEventList = data.Data.waringEventList
          this.howMany = data.Data.howMany
        })
      }else if(this.typeIndex ===2){
        this.$http.post('/Manage/WaringEvent/WaringEventList',{
          'User_Id':window.localStorage.getItem('userId'),
          'Project_Code':this.$route.params.id,
          'Warning_Group':2
        }).then((data) => {
          console.log(data);
          this.waringEventList = data.Data.waringEventList
          this.howMany = data.Data.howMany
        })
      }else if(this.typeIndex === 3){
        this.$http.post('/Manage/WaringEvent/WaringEventList',{
          'User_Id':window.localStorage.getItem('userId'),
          'Project_Code':this.$route.params.id,
          'Warning_Group':3
        }).then((data) => {
          console.log(data);
          this.waringEventList = data.Data.waringEventList
          this.howMany = data.Data.howMany
        })
      }else if(this.typeIndex === 4) {
        this.$http.post('/Manage/WaringEvent/WaringEventList',{
          'User_Id':window.localStorage.getItem('userId'),
          'Project_Code':this.$route.params.id,
          'Warning_Group':4
        }).then((data) => {
          console.log(data);
          this.waringEventList = data.Data.waringEventList
          this.howMany = data.Data.howMany
        })
      }else if(this.typeIndex === 5) {
        this.$http.post('/Manage/WaringEvent/WaringEventList',{
          'User_Id':window.localStorage.getItem('userId'),
          'Project_Code':this.$route.params.id,
          'Warning_Group':4
        }).then((data) => {
          console.log(data);
          this.waringEventList = data.Data.waringEventList
          this.howMany = data.Data.howMany
        })
      }


    },

    //表格中查看按钮
    see(val){
      console.log(val);
      // return
      // if(+val.Warning_Group === 1){
      //   this.$router.push('/tendency')
      // }else if(+val.Warning_Group === 2){
      //   this.$router.push('/errorlog')
      // }else if(+val.Warning_Group === 3){
      //   this.$router.push('/slowlog')
      // }else if(+val.Warning_Group ===4){
      //   //弹出弹窗1
      // }else if(+val.Warning_Group ===5){
      //   //弹出弹窗2
      // }
      if(val.Warning_Group == '1'){
        //服务器跳转到走势图
        this.$router.push({
          path: `/project-index/${this.$route.params.id}/tendency`,
          query:val
        })
      }else if(val.Warning_Group == '2'){
        //数据库，跳转到慢日志
        this.$router.push({
          path:`/project-index/${this.$route.params.id}/slowlog`,
          query:val
        })
      }else if(val.Warning_Group == '3'){
        //应用服务，跳转到错误日志
        this.$router.push({
          path:`/project-index/${this.$route.params.id}/errorLog`,
          query:val
        })
      }else if(val.Warning_Group == '4'){
        //智能设备，打开弹框
        if(val.CameraMsg.length > 0){
          this.deviceName = val.CameraMsg[0].Name
          this.deviceType = val.Source_Type_Name
          this.deviceStatus = val.CameraMsg[0].IsOnline_Name
        }else if(val.LockMsg.length > 0){
          this.deviceName = val.CameraMsg[0].Name
          this.deviceType = val.Source_Type_Name
          this.deviceStatus = val.CameraMsg[0].IsOnline_Name
        }else if(val.SmokeMsg.length > 0){
          this.deviceName = val.CameraMsg[0].Name
          this.deviceType = val.Source_Type_Name
          this.deviceStatus = val.CameraMsg[0].IsOnline_Name
        }
        this.deviceShow = true
      } else{
        //安全，打开弹框
        this.security = true
        this.securityTime = val.Warning_Time
        this.securityMsg = val.Security_Msg
      }
    },

    //分页按钮
    handleSizeChange(val) {
      this.pageSize = val
      if(this.typeIndex === 1){
        this.$http.post('/Manage/WaringEvent/WaringEventList',{
          'User_Id':window.localStorage.getItem('userId'),
          'Project_Code':this.$route.params.id,
          'Warning_Group':1,
          'pageNum':this.pageNum,
          'pageSize':val
        }).then((data) => {
          console.log(data);
          this.waringEventList = data.Data.waringEventList
          this.howMany = data.Data.howMany
        })
      }else if(this.typeIndex === 2) {
        this.$http.post('/Manage/WaringEvent/WaringEventList',{
          'User_Id':window.localStorage.getItem('userId'),
          'Project_Code':this.$route.params.id,
          'Warning_Group':2,
          'pageNum':this.pageNum,
          'pageSize':val
        }).then((data) => {
          console.log(data);
          this.waringEventList = data.Data.waringEventList
          this.howMany = data.Data.howMany
        })
      }else if(this.typeIndex === 3) {
        this.$http.post('/Manage/WaringEvent/WaringEventList',{
          'User_Id':window.localStorage.getItem('userId'),
          'Project_Code':this.$route.params.id,
          'Warning_Group':3,
          'pageNum':this.pageNum,
          'pageSize':val
        }).then((data) => {
          console.log(data);
          this.waringEventList = data.Data.waringEventList
          this.howMany = data.Data.howMany
        })
      }else if(this.typeIndex === 4) {
        this.$http.post('/Manage/WaringEvent/WaringEventList',{
          'User_Id':window.localStorage.getItem('userId'),
          'Project_Code':this.$route.params.id,
          'Warning_Group':4,
          'pageNum':this.pageNum,
          'pageSize':val
        }).then((data) => {
          console.log(data);
          this.waringEventList = data.Data.waringEventList
          this.howMany = data.Data.howMany
        })
      }else if(this.typeIndex === 5) {
        this.$http.post('/Manage/WaringEvent/WaringEventList',{
          'User_Id':window.localStorage.getItem('userId'),
          'Project_Code':this.$route.params.id,
          'Warning_Group':5,
          'pageNum':this.pageNum,
          'pageSize':val
        }).then((data) => {
          console.log(data);
          this.waringEventList = data.Data.waringEventList
          this.howMany = data.Data.howMany
        })
      }else if(this.typeIndex === 0) {    //默认全部
        this.$http.post('/Manage/WaringEvent/WaringEventList',{
          'User_Id':window.localStorage.getItem('userId'),
          'Project_Code':this.$route.params.id,
          'pageNum':this.pageNum,
          'pageSize':val
        }).then((data) => {
          console.log(data);
          this.waringEventList = data.Data.waringEventList
          this.howMany = data.Data.howMany
        })
      }
    },
    handleCurrentChange(val) {
      console.log(val);
      this.pageNum = val
      if(this.typeIndex === 1){
        this.$http.post('/Manage/WaringEvent/WaringEventList',{
          'User_Id':window.localStorage.getItem('userId'),
          'Project_Code':this.$route.params.id,
          'Warning_Group':1,
          'pageNum':val,
          'pageSize':this.pageSize
        }).then((data) => {
          console.log(data);
          this.waringEventList = data.Data.waringEventList
          this.howMany = data.Data.howMany
        })
      }else if(this.typeIndex === 2) {
        this.$http.post('/Manage/WaringEvent/WaringEventList',{
          'User_Id':window.localStorage.getItem('userId'),
          'Project_Code':this.$route.params.id,
          'Warning_Group':2,
          'pageNum':val,
          'pageSize':this.pageSize
        }).then((data) => {
          console.log(data);
          this.waringEventList = data.Data.waringEventList
          this.howMany = data.Data.howMany
        })
      }else if(this.typeIndex === 3) {
        this.$http.post('/Manage/WaringEvent/WaringEventList',{
          'User_Id':window.localStorage.getItem('userId'),
          'Project_Code':this.$route.params.id,
          'Warning_Group':3,
          'pageNum':val,
          'pageSize':this.pageSize
        }).then((data) => {
          console.log(data);
          this.waringEventList = data.Data.waringEventList
          this.howMany = data.Data.howMany
        })
      }else if(this.typeIndex === 4) {
        this.$http.post('/Manage/WaringEvent/WaringEventList',{
          'User_Id':window.localStorage.getItem('userId'),
          'Project_Code':this.$route.params.id,
          'Warning_Group':4,
          'pageNum':val,
          'pageSize':this.pageSize
        }).then((data) => {
          console.log(data);
          this.waringEventList = data.Data.waringEventList
          this.howMany = data.Data.howMany
        })
      }else if(this.typeIndex === 5) {
        this.$http.post('/Manage/WaringEvent/WaringEventList',{
          'User_Id':window.localStorage.getItem('userId'),
          'Project_Code':this.$route.params.id,
          'Warning_Group':5,
          'pageNum':val,
          'pageSize':this.pageSize
        }).then((data) => {
          console.log(data);
          this.waringEventList = data.Data.waringEventList
          this.howMany = data.Data.howMany
        })
      }else if(this.typeIndex === 0) {    //默认全部
        this.$http.post('/Manage/WaringEvent/WaringEventList',{
          'User_Id':window.localStorage.getItem('userId'),
          'Project_Code':this.$route.params.id,
          'pageNum':val,
          'pageSize':this.pageSize
        }).then((data) => {
          console.log(data);
          this.waringEventList = data.Data.waringEventList
          this.howMany = data.Data.howMany
        })
      }

    }
  },
  mounted () {
    //面包屑
    const headerObj = this.$store.state.header.headData.find(item => item.Project_Code === this.$route.params.id);
    console.log(headerObj, 'headerObj');
    this.$store.commit('changeHeadTitle', [
      {
        url: `/project-index/${this.$route.params.id}`,
        title: headerObj.Project_Name
      },
      {
        url:'',
        title:'预警管理'
      },
      {
        url:'',
        title: '预警事件'
      }
    ])


    // 浮点数精度丢失转换
    // Math.formatFloat = function (f, digit) {
    //   var m = Math.pow(10, digit);
    //   return Math.round(f * m, 10) / m;
    // }
    //预警事件类型饼图
    this.eventTypeChart = echarts.init(document.getElementById('eventTypeChart'),'dark')
    this.eventTypeChart.setOption({
      backgroundColor: 'transparent',
      legend: {
        type: 'plain',
        orient: 'vertical',
        right: 10,
        top: 20,
        bottom: 20,
        itemGap: 30,
        data: [
          // {
          //   name: "服务器",
          //   icon: 'circle',
          // },
          // {
          //   name: "应用服务",
          //   icon: 'circle',
          // },
          // {
          //   name: "数据库",
          //   icon: 'circle',
          // },
          // {
          //   name: "智能设备",
          //   icon: 'circle',
          // },
          // {
          //   name: "接口",
          //   icon: 'circle',
          // },
        ],
        formatter: function(name){
          // if(name=='服务器') var per = '15%';
          // if(name=='应用服务') var per = '15%';
          // if(name=='数据库') var per = '6%';
          // if(name=='智能设备') var per = '28%';
          // if(name=='接口') var per = '38%';
          // return name + '      ' + per;
        }
      },
      tooltip:{
        trigger: 'item',
        formatter: '{b} : {d}%'
      },
      series: [
        {
          name:'预警事件类型',
          type:'pie',
          center: ['40%','50%'],
          radius: ['65%', '80%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            formatter: '{b}:{d}%',
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          data:[
            // {
            //   name: "服务器",
            //   value:0.15,
            //   itemStyle:{color:'#9A54F5'},
            // },
            // {
            //   name: "应用服务",
            //   value:0.15,
            //   itemStyle:{color:'#4681FF'}
            // },
            // {
            //   name: "数据库",
            //   value:0.06,
            //   itemStyle:{color:'#46FFB9'}
            // },
            // {
            //   name: "智能设备",
            //   value:0.28,
            //   itemStyle:{color:'#FF806D'}
            // },
            // {
            //   name: "接口",
            //   value:0.36,
            //   itemStyle:{color:'#D7438A'}
            // }
          ]
        }
      ]
    })

//预警事件排名柱状图
    this.eventRankingChart = echarts.init(document.getElementById('eventRankingChart'),'dark')
    this.eventRankingChart.setOption({
      backgroundColor: 'transparent',
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        containLabel: false
      },
      xAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        axisTick: {
          length: 0
        },
        splitLine: {
          show: false
        }
      },
      yAxis: {
        show:false,
        type: 'category',
        axisLine: {
          show: false
        },
        axisTick: {
          length: 0
        },
      },
      series: [
        {
          type: 'bar',
          barWidth: 10,
          barCategoryGap: '300%',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
              offset: 0,
              color: 'rgb(138, 76, 220)'
            },{
              offset: 1,
              color: 'rgb(102, 143, 255)'
            }])
          },
          data: [],

        }
      ]
    })


//请求接口替换数据
    //饼图
    this.$http.post('/Manage/WaringEvent/Index',{
      'User_Id':window.localStorage.getItem('userId'),
      'dayType':7,
      'Project_Code':this.$route.params.id
    }).then((data) => {
      // console.log(data);
      let total = []
      total = data.Data.data.waringPiechart
      let chartData = []
      let color=['#9A54F5','#4681FF','#46FFB9','#FF806D','#D7438A']
      let displayData = []
      let legendData = []
      total.forEach((item,i) => {
        chartData.push(item)
        displayData.push(
          {name:item.Waring_Type,value:item.perc,itemStyle:{color:color[i]}}
        )
        legendData.push(
          {name:item.Waring_Type,icon:'circle'}
        )
      })
      // console.log(displayData);
      this.eventTypeChart.setOption({
        legend:{
          data:legendData,
          formatter: function (name) {
            for(let i in chartData){
              if(name == chartData[i].Waring_Type) var per = (+chartData[i].perc*100).toFixed(0) + '%'
            }
            return name +''+ per
          }
        },
        series:[
          {data:displayData}
        ]
      })

    })

    //柱状图
    this.$http.post('/Manage/WaringEvent/WaringEventRank',{
      'User_Id':window.localStorage.getItem('userId'),
      'dayType':7,
      'Project_Code':this.$route.params.id
    }).then((data) => {
      console.log(data);
      let eventRank = []
      eventRank = data.Data.waringPiechart
      // console.log(eventRank);
      let eventNum = []
      this.ringRatio = []
      this.eventRank = []
      eventRank.forEach((item,i) => {
        eventNum.unshift(item.num)
        this.ringRatio.push(item.waringRingRatio)
        this.eventRank.push(item)
      })
      console.log(this.ringRatio);
      this.eventRankingChart.setOption({
        series:[
          {data:eventNum}
        ]
      })
    })

    // console.log(this.eventRank);
//表格数据
    this.$http.post('/Manage/WaringEvent/WaringEventList',{
      'User_Id':window.localStorage.getItem('userId'),
      'Project_Code':this.$route.params.id,
      // 'Project_Code':'cc5b7135fb814c5ea32d1815a1385163',
    }).then((data) => {
      console.log(data);
      this.waringEventList = data.Data.waringEventList
      this.howMany = data.Data.howMany
      // console.log(this.waringEventList);
    })
  },
  filters : {
    transformDate : transformDate,
    eventType : eventType
  }
}
