import axios from 'axios'
import echarts from 'echarts'
import {FormatDate} from '../../../../../common/utils.js'
import {transformDate,formatSec} from "../../../../../common/filters";

export default {
  name: "Server",
  data () {
    return{
      timer:null,
      cpuChart:null,
      processChart:null,
      processLineChart:null,
      serverOptionIndex:0,
      dayOptionIndex:0,
      daysPick:[
        {dayType:1,name:'近1天'},
        {dayType:3,name:'近3天'},
        {dayType:7,name:'近7天'}
      ],
      cpuLoadAve:'',
      memoryFree:'',
      diskFree:'',
      network:'',
      dialogFormVisible:false,
      form:{},
      quota:['cpu1','cpu5','cpu15','cpuProcess','cpuRunProcess','cpuIo'],
      //定义checkbox区域的数组
      serverQuota:[
        {
          title:'CPU',
          content:[
            // {id:1,type:'CPU',code:'CPU_Load_Average_1',name:'CPU平均负载(1min)',checked:false},
            {id:2,type:'CPU',code:'CPU_Load_Average',name:'CPU平均负载(5min)',checked:true},
            // {id:3,type:'CPU',code:'CPU_Load_Average_15',name:'CPU平均负载(15min)',checked:false},
            {id:4,type:'CPU',code:'Proc_Total',name:'CPU进程总数',checked:false},
            // {id:5,type:'CPU',code:'Maxproc',name:'CPU运行的进程数',checked:false},
            {id:6,type:'CPU',code:'IO_Waiting_Time',name:'CPU-IO等待时间',checked:false}
          ]
        },
        {
          title:'内存',
          content:[
            {id:7,type:'Memory',code:'Memory_Usage_Rate',name:'可用内存百分比',checked:true},
            // {id:8,type:'Memory',code:'Swap_Space_Rate',name:'空闲交换空间百分比',checked:false}
          ]
        },
        {
          title:'磁盘',
          content:[
            {id:9,type:'Disk',code:'Disk_Usage_Rate',name:'可用磁盘空间百分比',checked:true},
            // {id:10,type:'Disk',code:'Disk_Free_Sector',name:'可用扇形空间百分比',checked:false},
            // {id:11,type:'Disk',code:'Disk_Switch',name:'磁盘空闲交换空间百分比',checked:false}
          ]
        },
        {
          title:'网络',
          content:[
            {id:12,type:'Network',code:'Network_Speed_In',name:'流入流量',checked:true},
            {id:13,type:'Network',code:'Network_Speed_Out',name:'流出流量',checked:false}
          ]
        },
        {
          title:'TCP连接数',
          content:[
            {id:14,type:'TCP',code:'TCP_Link_Total',name:'TCP连接数',checked:false}
          ]
        }
      ],
      //定义数组，保存点击之后的数据
      checkedArr: [],
      btnArr:[],
      //中间折线图区域所有数据
      echartsAreaCpu:'',
      //定义所有指标变量
      cpuLoadAve5min:'',
      maxAveMin:'',
      //保存服务器指标和天数以及服务器指标类型
      serverType:'CPU_Load_Average',
      type:'CPU',
      days:1,
      CPU_Logs_Code:'',
      processVisible:true,
      timer: null,
      runTimeChart:null,
      //echarts图表数据---点击事件用
      middleData:[],
      leftButtomData:[],
      rightButtomData:[],
      warningNum: null,
      ifWarning: false,
      interrupt:null,
      interruptdetail:[],
    }
  },
  filters: {
    transformDate : transformDate,
    formatSec: formatSec
  },
  methods:{
    getBtn() {
      this.checkedArr = [];
      this.serverQuota.forEach(item=>{
        this.checkedArr = this.checkedArr.concat(item.content.filter(items => items.checked));
      });
      this.checkedArr.forEach((item,i) => {
        this.btnArr.push(item);
      })
    },
    changeCheckbox() {
      this.checkedArr = [];
      this.serverQuota.forEach(item => {
        //把checked的值为true的保存到数组里
        this.checkedArr = this.checkedArr.concat(item.content.filter(items => items.checked));
        // this.checkedArr = [...this.checkedArr, ...item.content.filter(items => items.checked)];
      });
      //console.log(this.checkedArr);
      // console.log(e);
      // console.log(JSON.parse(JSON.stringify(this.checkboxArr)));
    },
    //判断disabled，大于6个禁用，小于1个禁用,返回true为禁用，返回false为不禁用
    checkboxDisabled(items) {
      if (this.checkedArr.length === 6 && !items.checked) {
        return true;
      }
      if (this.checkedArr.length === 1 && items.checked) {
        return true;
      }
      return false;
    },
    confirm() {
      this.btnArr = [];
      this.checkedArr.forEach((item,i)=>{
        this.btnArr.push(item)
      });
      this.dialogFormVisible = false
    },
    //点击切换指标
    tap(val,i){
      console.log(val);
      val = val ? val : {code: this.serverType, type: this.type};
      i = i ? i : this.serverOptionIndex;
      this.serverOptionIndex = i
      //服务器指标
      this.serverType = val.code
      //服务器指标类型
      this.type = val.type
      switch (val.type){
        case 'CPU':
          this.processVisible = true;
          break;
        case 'Memory':
        case 'Disk':
        case 'Network':
        case 'TCP':
          this.processVisible = false;
          break;
      }
      this.$http.post('/Manage/Service/ServerAllIndexDetial',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'Service_Code':this.$route.params.serverId,
        'dayType':this.days,
        'type':val.type,
        'detialType':val.code
      }).then((data) => {
        console.log(data);
        let type = []
        let total = []
        let maxAveMinVal = []
        total = data.Data.data.detial
        maxAveMinVal = data.Data.data.maxAvgMin
        let displayMax = []
        let displayAve = []
        let displayMin = []
        let displayLast =[]
        let yAxisData = []
        let time = []
        //判断服务器指标
        if(this.serverType === 'CPU_Load_Average'){
          this.CPU_Logs_Code = data.Data.data.detial[0].CPU_Logs_Code
          total.forEach((item,i) => {
            yAxisData.push(item.CPU_Load_Average)
            time.push(FormatDate(item.Insert_Time*1000,'HH:mm'))
          })
          displayMax = maxAveMinVal[0].CPU_Load_Average_MAX
          displayAve = maxAveMinVal[0].CPU_Load_Average_AVG
          displayMin = maxAveMinVal[0].CPU_Load_Average_MIN
          displayLast = yAxisData[yAxisData.length-1]
        }else if(this.serverType === 'Maxproc'){
          this.CPU_Logs_Code = data.Data.data.detial[0].CPU_Logs_Code
          total.forEach((item,i) => {
            yAxisData.push(item.Maxproc)
            time.push(FormatDate(item.Insert_Time*1000,'HH:mm'))
          })
          displayMax = maxAveMinVal[0].CPU_Load_Average_MAX
          displayAve = maxAveMinVal[0].CPU_Load_Average_AVG
          displayMin = maxAveMinVal[0].CPU_Load_Average_MIN
          displayLast = yAxisData[yAxisData.length-1]
        }else if(this.serverType === 'Proc_Total'){
          this.CPU_Logs_Code = data.Data.data.detial[0].CPU_Logs_Code
          total.forEach((item,i) => {
            yAxisData.push(item.Proc_Total)
            time.push(FormatDate(item.Insert_Time*1000,'HH:mm'))
          })
          displayMax = maxAveMinVal[0].Maxproc_MAX
          displayAve = maxAveMinVal[0].Maxproc_AVG
          displayMin = maxAveMinVal[0].Maxproc_MIN
          displayLast = yAxisData[yAxisData.length-1]
        }else if(this.serverType === 'IO_Waiting_Time'){
          this.CPU_Logs_Code = data.Data.data.detial[0].CPU_Logs_Code
          total.forEach((item,i) => {
            yAxisData.push(item.IO_Waiting_Time)
            time.push(FormatDate(item.Insert_Time*1000,'HH:mm'))
          })
          displayMax = maxAveMinVal[0].IO_Waiting_Time_MAX
          displayAve = maxAveMinVal[0].IO_Waiting_Time_AVG
          displayMin = maxAveMinVal[0].IO_Waiting_Time_MIN
          displayLast = yAxisData[yAxisData.length-1]
        }else if(this.serverType === 'Memory_Usage_Rate'){
          console.log('Memory_Usage');
          total.forEach((item,i) => {
            yAxisData.push(item.Memory_Usage_Rate)
            time.push(FormatDate(item.Insert_Time*1000,'HH:mm'))
          })
          displayMax = maxAveMinVal[0].Memory_Usage_Rate_MAX
          displayAve = maxAveMinVal[0].Memory_Usage_Rate_AVG
          displayMin = maxAveMinVal[0].Memory_Usage_Rate_MIN
          displayLast = yAxisData[yAxisData.length-1]
        }else if(this.serverType === 'Disk_Usage_Rate'){
          total.forEach((item,i) => {
            yAxisData.push(item.Disk_Usage_Rate)
            time.push(FormatDate(item.Insert_Time*1000,'HH:mm'))
            displayMax = maxAveMinVal[0].Disk_Usage_Rate_Over_MAX
            displayAve = maxAveMinVal[0].Disk_Usage_Rate_Over_AVG
            displayMin = maxAveMinVal[0].Disk_Usage_Rate_Over_MIN
          })
        }else if(this.serverType === 'Network_Speed_In'){
          total.forEach((item,i) => {
            yAxisData.push(item.Network_Speed_In)
            time.push(FormatDate(item.Insert_Time*1000,'HH:mm'))
            displayMax = maxAveMinVal[0].Network_Speed_In_MAX
            displayAve = maxAveMinVal[0].Network_Speed_In_AVG
            displayMin = maxAveMinVal[0].Network_Speed_In_MIN
          })
        }else if(this.serverType === 'Network_Speed_Out'){
          total.forEach((item,i) => {
            yAxisData.push(item.Network_Speed_Out)
            time.push(FormatDate(item.Insert_Time*1000,'HH:mm'))
            displayMax = maxAveMinVal[0].Network_Speed_Out_MAX
            displayAve = maxAveMinVal[0].Network_Speed_Out_AVG
            displayMin = maxAveMinVal[0].Network_Speed_Out_MIN
          })
        }else if(this.serverType === 'TCP_Link_Total'){
          total.forEach((item,i) => {
            yAxisData.push(item.TCP_Link_Total)
            time.push(FormatDate(item.Insert_Time*1000,'HH:mm'))
            displayMax = maxAveMinVal[0].TCP_Link_Total_MAX
            displayAve = maxAveMinVal[0].TCP_Link_Total_AVG
            displayMin = maxAveMinVal[0].TCP_Link_Total_MIN
          })
        }
        let displayYAxisData = []
        let displayTime = []
        //判断天数
        if(+this.days === 1){
          for(let i=0;i<time.length;i+=1){
            displayYAxisData.push(yAxisData[i])
            displayTime.push(time[i])
          }
        }else if(+this.days === 3){
          for(let i=0;i<time.length;i+=36){
            displayYAxisData.push(yAxisData[i])
            displayTime.push(time[i])
          }
        }else if(+this.days === 7){
          for(let i=0;i<time.length;i+=72){
            displayYAxisData.push(yAxisData[i])
            displayTime.push(time[i])
          }
        }
        //改变图表数据
        this.cpuChart.setOption({
          title:[{subtext: '最近值' + displayLast + '      ' + '最小值' + displayMin + '      ' + '平均值' + displayAve + '      ' +'最大值' + displayMax}],
          xAxis:{
            data:displayTime
          },
          series:[
            {data:displayYAxisData}
          ]
        })
      })

    },
    //点击切换近一天到近七天
    daysTab(val,i){
      this.dayOptionIndex = i
      console.log(i);
      console.log(val);
      this.days = val.dayType
      this.$http.post('/Manage/Service/ServerAllIndexDetial',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'Service_Code':this.$route.params.serverId,
        'dayType':this.days,
        'type':this.type,
        'detialType':this.serverType
      }).then((data) => {
        let type = []
        let total = []
        let maxAveMinVal = []
        total = data.Data.data.detial
        maxAveMinVal = data.Data.data.maxAvgMin
        let displayMax = []
        let displayAve = []
        let displayMin = []
        let displayLast =[]
        let yAxisData = []
        let time = []
        //判断服务器指标
        if(this.serverType === 'CPU_Load_Average'){
          total.forEach((item,i) => {
            yAxisData.push(item.CPU_Load_Average)
            time.push(FormatDate(item.Insert_Time*1000,'HH:mm'))
          })
          displayMax = maxAveMinVal[0].CPU_Load_Average_MAX
          displayAve = maxAveMinVal[0].CPU_Load_Average_AVG
          displayMin = maxAveMinVal[0].CPU_Load_Average_MIN
          displayLast = yAxisData[yAxisData.length-1]
        }else if(this.serverType === 'Maxproc'){
          total.forEach((item,i) => {
            yAxisData.push(item.Maxproc)
            time.push(FormatDate(item.Insert_Time*1000,'HH:mm'))
          })
          displayMax = maxAveMinVal[0].CPU_Load_Average_MAX
          displayAve = maxAveMinVal[0].CPU_Load_Average_AVG
          displayMin = maxAveMinVal[0].CPU_Load_Average_MIN
          displayLast = yAxisData[yAxisData.length-1]
        }else if(this.serverType === 'Proc_Total'){
          total.forEach((item,i) => {
            yAxisData.push(item.Proc_Total)
            time.push(FormatDate(item.Insert_Time*1000,'HH:mm'))
          })
          displayMax = maxAveMinVal[0].Maxproc_MAX
          displayAve = maxAveMinVal[0].Maxproc_AVG
          displayMin = maxAveMinVal[0].Maxproc_MIN
          displayLast = yAxisData[yAxisData.length-1]
        }else if(this.serverType === 'IO_Waiting_Time'){
          total.forEach((item,i) => {
            yAxisData.push(item.IO_Waiting_Time)
            time.push(FormatDate(item.Insert_Time*1000,'HH:mm'))
          })
          displayMax = maxAveMinVal[0].IO_Waiting_Time_MAX
          displayAve = maxAveMinVal[0].IO_Waiting_Time_AVG
          displayMin = maxAveMinVal[0].IO_Waiting_Time_MIN
          displayLast = yAxisData[yAxisData.length-1]
        }else if(this.serverType === 'Memory_Usage_Rate'){
          total.forEach((item,i) => {
            yAxisData.push(item.Memory_Usage_Rate)
            time.push(FormatDate(item.Insert_Time*1000,'HH:mm'))
          })
          displayMax = maxAveMinVal[0].Memory_Usage_Rate_MAX
          displayAve = maxAveMinVal[0].Memory_Usage_Rate_AVG
          displayMin = maxAveMinVal[0].Memory_Usage_Rate_MIN
          displayLast = yAxisData[yAxisData.length-1]
        }else if(this.serverType === 'Disk_Usage_Rate'){
          total.forEach((item,i) => {
            yAxisData.push(item.Disk_Usage_Rate)
            time.push(FormatDate(item.Insert_Time*1000,'HH:mm'))
            displayMax = maxAveMinVal[0].Disk_Usage_Rate_Over_MAX
            displayAve = maxAveMinVal[0].Disk_Usage_Rate_Over_AVG
            displayMin = maxAveMinVal[0].Disk_Usage_Rate_Over_MIN
          })
        }else if(this.serverType === 'Network_Speed_In'){
          total.forEach((item,i) => {
            yAxisData.push(item.Network_Speed_In)
            time.push(FormatDate(item.Insert_Time*1000,'HH:mm'))
            displayMax = maxAveMinVal[0].Network_Speed_In_MAX
            displayAve = maxAveMinVal[0].Network_Speed_In_AVG
            displayMin = maxAveMinVal[0].Network_Speed_In_MIN
          })
        }else if(this.serverType === 'Network_Speed_Out'){
          total.forEach((item,i) => {
            yAxisData.push(item.Network_Speed_Out)
            time.push(FormatDate(item.Insert_Time*1000,'HH:mm'))
            displayMax = maxAveMinVal[0].Network_Speed_Out_MAX
            displayAve = maxAveMinVal[0].Network_Speed_Out_AVG
            displayMin = maxAveMinVal[0].Network_Speed_Out_MIN
          })
        }else if(this.serverType === 'TCP_Link_Total'){
          total.forEach((item,i) => {
            yAxisData.push(item.TCP_Link_Total)
            time.push(FormatDate(item.Insert_Time*1000,'HH:mm'))
            displayMax = maxAveMinVal[0].TCP_Link_Total_MAX
            displayAve = maxAveMinVal[0].TCP_Link_Total_AVG
            displayMin = maxAveMinVal[0].TCP_Link_Total_MIN
          })
        }
        let displayYAxisData = []
        let displayTime = []
        //判断天数
        if(+this.days === 1){
          for(let i=0;i<time.length;i+=1){
            displayYAxisData.push(yAxisData[i])
            displayTime.push(time[i])
          }
        }else if(+this.days === 3){
          for(let i=0;i<time.length;i+=36){
            displayYAxisData.push(yAxisData[i])
            displayTime.push(time[i])
          }
        }else if(+this.days === 7){
          for(let i=0;i<time.length;i+=72){
            displayYAxisData.push(yAxisData[i])
            displayTime.push(time[i])
          }
        }
        //改变图表数据
        this.cpuChart.setOption({
          title:[{subtext: '最近值' + displayLast + '      ' + '最小值' + displayMin + '      ' + '平均值' + displayAve + '      ' +'最大值' + displayMax}],
          xAxis:{
            data:displayTime
          },
          series:[
            {data:displayYAxisData}
          ]
        })
      })

    },
    getData(){
      //页面上部数据
      this.$http.post('/Manage/Service/index',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'Service_Code':this.$route.params.serverId
      }).then((data) => {
        console.log(data);
        // console.log(data.Data.data.fourState[0].CPU_Load_Average);
        this.cpuLoadAve = data.Data.data.fourState[0] ? data.Data.data.fourState[0].CPU_Load_Average : ''
        this.memoryFree = data.Data.data.fourState[0] ? data.Data.data.fourState[0].Memory_Usage : ''
        this.diskFree = data.Data.data.fourState[0] ? data.Data.data.fourState[0].Disk_Usage_Rate :''
        this.network = data.Data.data.fourState[0] ? data.Data.data.fourState[0].Network_Speed_In :''
        this.warningNum = data.Data.data.waringNum
        this.interrupt = data.Data.data.offFinalResult.length
        this.interruptdetail = data.Data.data.offFinalResult
        if(+this.warningNum > 0){
          console.log(this.warningNum);
          this.ifWarning = true
        }else{
          this.ifWarning = false
        }
      })

      //中间大图
      this.$http.post('/Manage/Service/ServerAllIndexDetial',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'Service_Code':this.$route.params.serverId,
        'dayType':'1',
        'type':this.type,
        'detialType':this.serverType
      }).then((data) => {
        console.log(data);
        let total = []
        //中间折线图获取到的数据
        this.middleData = data.Data.data.detial
        console.log(this.middleData);
        let maxAveMin = []
        total = data.Data.data.detial
        maxAveMin = data.Data.data.maxAvgMin
        let cpuLoadAverage = []
        let time = []
        total.forEach((item,i) => {
          cpuLoadAverage.push(item.CPU_Load_Average)
          time.push(FormatDate(item.Insert_Time*1000,'HH:mm'))
        })
        let displayCpuLoadAverage = []
        let displayTime = []
        for(let i=0;i<time.length;i++){
          displayCpuLoadAverage.push(cpuLoadAverage[i])
          displayTime.push(time[i])
        }

        //三个变量需要重新赋值
        this.cpuChart.setOption({
          title:[{subtext: '最近值' +  cpuLoadAverage[cpuLoadAverage.length-1] + '      ' + '最小值' +  maxAveMin[0].CPU_Load_Average_MIN + '      ' + '平均值' +  maxAveMin[0].CPU_Load_Average_AVG + '      ' +'最大值' +  maxAveMin[0].CPU_Load_Average_MAX}],
          xAxis:{
            data:displayTime,
          },
          series:[
            {data:displayCpuLoadAverage}
          ]
        })

        //中间大图点击事件
        this.cpuChart.on('click', (params) => {
          this.middleClick(params)
        })
        //进程占用top5进入页面默认展示
        this.$http.post('/Manage/Service/ServiceProTop5',{
          'User_Id':window.localStorage.getItem('userId'),
          'Project_Code':this.$route.params.id,
          'Service_Code':this.$route.params.serverId,
          // 'CPU_Logs_Code':this.CPU_Logs_Code
          'CPU_Logs_Code':this.middleData[this.middleData.length - 1] ? this.middleData[this.middleData.length - 1].CPU_Logs_Code : ''
        }).then((data) => {
          console.log(data);
          if (!data.Data) {
            this.processChart.setOption({
              yAxis:{data:''},
              series:[
                {data:''}
              ]
            })
            this.processLineChart.setOption({
              title:{subtext: ''},
              xAxis:{data:''},
              series:[{data:''}]
            })
            return;
          }
          this.leftButtomData = data.Data.data
          let total = []
          total = data.Data.data
          console.log(total);
          let displayProcessName = []
          let displayProcessVal = []
          total.forEach((item,i) => {
            displayProcessName.unshift(item.Proc_Name)
            displayProcessVal.unshift(item.CPU_Rate)
          })
          this.processChart.setOption({
            yAxis:{data:displayProcessName},
            series:[
              {data:displayProcessVal}
            ]
          })
          //进程占用top5点击事件
          this.processChart.on('click', (params) => {
            this.leftSideClick(params)
          })

          //进程占用折线图
          this.$http.post('/Manage/Service/ServiceOneProDetial',{
            'User_Id':window.localStorage.getItem('userId'),
            'Project_Code':this.$route.params.id,
            'CPU_Logs_Code':total[total.length-1].CPU_Logs_Code,
            'Proc_Name':total[total.length-1].Proc_Name,
            'Server_Code':this.$route.params.serverId,
            'dayType':this.days
          }).then((data) =>{
            console.log(data);
            let total = []
            let maxAvgMin =[]
            total = data.Data.data.pro.detial
            maxAvgMin = data.Data.data.pro.maxAvgMin
            let time = []
            let processVal = []
            total.forEach((item,i) => {
              time.push(FormatDate(item.Insert_Time*1000,'HH:mm'))
              processVal.push(item.CPU_Rate)
            })
            let displayTime = []
            let displayProcessVal = []
            for(let i=0;i<time.length;i+=10){
              displayProcessVal.push(processVal[i])
              displayTime.push(time[i])
            }
            this.processLineChart.setOption({
              title:{subtext: '最近值' + processVal[processVal.length-1] + '      ' + '最小值' + maxAvgMin.CPU_Rate_MIN + '      ' + '平均值' + maxAvgMin.CPU_Rate_AVG + '      ' +'最大值' + maxAvgMin.CPU_Rate_MAX,},
              xAxis:{data:displayTime},
              series:[{data:displayProcessVal}]
            })
          })
        })
      })

      //服务器上部数据
      this.$http.post('/Manage/Service/index', {
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'Service_Code':this.$route.params.serverId
      }).then( (data) => {
        console.log(data);
        let runTime = data.Data.data.runTimeOffResult
        // console.log(runTime);
        let runTimeData = []
        runTimeData.push(runTime.continuousTime,runTime.addUpTime)
        this.runTimeChart.setOption({
          series:[
            {data:runTimeData}
          ]
        })
      })
    },
    //中间大图点击事件
    middleClick(params) {
      console.log(params);
      console.log(this.middleData[params.dataIndex]);
      this.$http.post('/Manage/Service/ServiceProTop5',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'Service_Code':this.$route.params.serverId,
        'CPU_Logs_Code':this.middleData[params.dataIndex].CPU_Logs_Code
      }).then((data) => {
        let total = []
        total = data.Data.data
        console.log(total);
        let displayProcessName = []
        let displayProcessVal = []
        total.forEach((item,i) => {
          displayProcessName.unshift(item.Proc_Name)
          displayProcessVal.unshift(item.CPU_Rate)
        })
        this.processChart.setOption({
          yAxis:{data:displayProcessName},
          series:[
            {data:displayProcessVal}
          ]
        })
      })
    },

    //左下角柱状图点击事件
    leftSideClick(params) {
      console.log(params);
      console.log(this.leftButtomData);
      this.$http.post('/Manage/Service/ServiceOneProDetial',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'CPU_Logs_Code':this.leftButtomData.reverse()[params.dataIndex].CPU_Logs_Code,
        'Proc_Name':this.leftButtomData.reverse()[params.dataIndex].Proc_Name,
        'Server_Code':this.$route.params.serverId,
        'dayType':this.days
      }).then((data) =>{
        // console.log(data);
        let total = []
        let maxAvgMin =[]
        total = data.Data.data.pro.detial
        maxAvgMin = data.Data.data.pro.maxAvgMin
        let time = []
        let processVal = []
        total.forEach((item,i) => {
          time.push(FormatDate(item.Insert_Time*1000,'HH:mm'))
          processVal.push(item.CPU_Rate)
        })
        let displayTime = []
        let displayProcessVal = []
        for(let i=0;i<time.length;i+=10){
          displayProcessVal.push(processVal[i])
          displayTime.push(time[i])
        }
        this.processLineChart.setOption({
          title:{subtext: '最近值' + processVal[processVal.length-1] + '      ' + '最小值' + maxAvgMin.CPU_Rate_MIN + '      ' + '平均值' + maxAvgMin.CPU_Rate_AVG + '      ' +'最大值' + maxAvgMin.CPU_Rate_MAX,},
          xAxis:{data:displayTime},
          series:[{data:displayProcessVal}]
        })
      })
    },
    //点击预警角标跳转预警事件页面
    toWarningEvent() {
      this.$router.push(`/project-index/${this.$route.params.id}/warningevent/`)
    }

  },
  mounted () {
    //面包屑
    const headerObj = this.$store.state.header.headData.find(item => item.Project_Code === this.$route.params.id);
    const serverListObj = headerObj.serverList.find(item => item.Server_Code === this.$route.params.serverId);
    console.log(headerObj, 'headerObj');
    this.$store.commit('changeHeadTitle', [
      {
        url: `/project-index/${this.$route.params.id}`,
        title: headerObj.Project_Name
      },
      {
        url: '',
        title: '实时监控'
      },
      {
        url: '',
        title: '服务器'
      },
      {
        url: '',
        title: serverListObj.Name
      }
    ])
    // console.log(this.CPU_Logs_Code);

    let _this = this
    //默认显示的服务器指标按钮
    this.getBtn()

    //服务器各项指标区域图表
      this.cpuChart = echarts.init(document.getElementById('mainChart'),'dark')
      this.cpuChart.setOption({
        log:['aa','bb'],
        backgroundColor: 'transparent',
        title: [{
          subtext: '最近值' + '0.08' + '      ' + '最小值' + '0.04' + '      ' + '平均值' + '0.13' + '      ' +'最大值' + '0.4',
          x: '3%',
          textAlign: 'left'
        }],
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
          data: [],
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
        series: [
          {
            name:'CPU平均负载',
            type:'line',
            smooth: true,
            itemStyle:{
              color: 'rgb(169, 110, 246)'
            },
            lineStyle: {
              width: 3,
              color: 'rgb(169, 110, 246)'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(138, 76, 220, 0.8)'
              }, {
                offset: 0.5,
                color: 'rgba(102, 143, 255, 0.4)'
              },{
                offset: 1,
                color: 'rgba(102, 143, 255, 0)'
              }])
            },
            data:[]
          },
        ]
      })
    //服务器运行时间柱状图
      this.runTimeChart = echarts.init(document.getElementById('runTimeChart'), 'dark')
      this.runTimeChart.setOption({
        backgroundColor: 'transparent',
        grid: {
          left: '3%',
          right: '8%',
          top: 0,
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
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
          type: 'category',
          axisLine: {
            show: false
          },
          axisTick: {
            length: 0
          },
          data: ['连续运行 (h)','累计运行 (h)']
        },
        series: [
          {
            name: '占用百分比',
            type: 'bar',
            barWidth: 10,
            label: {
              show: true,
              position: 'right',
              formatter: '{@[0]}'
            },
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                offset: 0,
                color: 'rgb(138, 76, 220)'
              },{
                offset: 1,
                color: 'rgb(102, 143, 255)'
              }])
            },
            data: []
          }
        ]
      })

    //进程占用排行top5
      this.processChart = echarts.init(document.getElementById('processChart'),'dark')
      this.processChart.setOption({
        backgroundColor: 'transparent',
        color: ['#37A2DA', '#32C5E9', '#67E0E3', '#9FE6B8', '#FFDB5C','#ff9f7f', '#fb7293', '#E062AE', '#E690D1', '#e7bcf3', '#9d96f5', '#8378EA', '#96BFFF'],
        title: {
          text: '进程占用排行'
        },
        tooltip:{
          trigger: 'axis',
          axisPointer : {
            type : 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '8%',
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
          type: 'category',
          axisLine: {
            show: false
          },
          axisTick: {
            length: 0
          },
          data: [],
        },
        series: [
          {
            name: '占用百分比',
            type: 'bar',
            barWidth: 10,
            label: {
              show: true,
              position: 'right',
              formatter: '{@[0]}%'
            },
            barGap:'-100%',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                offset: 0,
                color: 'rgb(138, 76, 220)'
              },{
                offset: 1,
                color: 'rgb(102, 143, 255)'
              }])
            },
            data: []
          }
        ]
      })

    //进程占用曲线
      this.processLineChart = echarts.init(document.getElementById('processLineChart'),"dark")
      this.processLineChart.setOption({
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
          text: '进程一变化曲线',
          subtext: '最近值' + '0.08' + '      ' + '最小值' + '0.04' + '      ' + '平均值' + '0.13' + '      ' +'最大值' + '0.4',
          textAlign: 'left'
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
        series: [{
          name: '进程变化',
          data: [],
          type: 'line',
          smooth: true,
          itemStyle:{
            color: 'rgb(102, 143, 255)'
          },
          lineStyle: {
            width: 3,
            color: 'rgb(102, 143, 255)'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(102, 143, 255, 0.4)'
            },{
              offset: 1,
              color: 'rgba(102, 143, 255, 0)'
            }])
          },
        }]
      })

    this.timer = setInterval(() => {
      // this.getData()
      this.tap()
    },300000)
    this.getData()

  },
  destroyed() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  watch: {
    $route(newVal) {
      console.log(newVal.params);
      this.getData()
    }
  }
}
