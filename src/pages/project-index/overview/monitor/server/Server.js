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
      runTimeChart:null,
      //echarts图表数据---点击事件用
      middleData:[],
      leftButtomData:[],
      rightButtomData:[],
      warningNum: null,
      ifWarning: false,
      interrupt:null,
      interruptdetail:[],
      //无数据隐藏进程图
      ifNoData:true,
      serverName:'',
      serverStatus:'',
      id:2,
      Network_Card_Name:'',
      networkCardList:[],
      selectNetworkCard:false,
      Network_Speed:'',
      isNormalCpu:0,
      isNormalMemory:0,
      isNormalDisk:0
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
    //切换网卡
    networkCard () {
      this.$http.post('/Manage/Service/ServerAllIndexDetial',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'Service_Code':this.$route.params.serverId,
        'dayType':this.days,
        'type':'Network',
        'detialType':this.Network_Speed,
        'Network_Card_Name':this.Network_Card_Name
      }).then((data) => {
        let type = [];
        let total = [];
        let maxAveMinVal = [];
        total = data.Data.data.detial;
        maxAveMinVal = data.Data.data.maxAvgMin;
        let displayMax = [];
        let displayAve = [];
        let displayMin = [];
        let displayLast =[];
        let yAxisData = [];
        let time = [];
        let name = '';
        if(this.Network_Speed === 'Network_Speed_In'){
          name = '流入流量';
          this.cpuChart.setOption({
            tooltip: {
              formatter: function (params) {
                return params[0].axisValue + '<br />' + '流入流量：'  + params[0].value
              },
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#6a7985'
                }
              }
            },
            yAxis:{
              axisLabel:{
                formatter:'{value}'
              }
            }
          });
          total.forEach((item,i) => {
            yAxisData.push(Number(item.Network_Speed_In).toFixed(2));
            time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'))
          });
          displayMax = maxAveMinVal[0].Network_Speed_In_MAX === ('null' || 'undefined') ? '' : Number(maxAveMinVal[0].Network_Speed_In_MAX).toFixed(2);
          displayAve = maxAveMinVal[0].Network_Speed_In_AVG === ('null' || 'undefined') ? '' : Number(maxAveMinVal[0].Network_Speed_In_AVG).toFixed(2);
          displayMin = maxAveMinVal[0].Network_Speed_In_MIN === ('null' || 'undefined') ? '' : Number(maxAveMinVal[0].Network_Speed_In_MIN).toFixed(2);
          displayLast = yAxisData[yAxisData.length-1] ? Number(yAxisData[yAxisData.length-1]).toFixed(2) : '';
        } else {
          name = '流出流量';
          this.cpuChart.setOption({
            tooltip: {
              formatter: function (params) {
                return params[0].axisValue + '<br />' + '流出流量：'  + params[0].value
              },
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#6a7985'
                }
              }
            },
            yAxis:{
              axisLabel:{
                formatter:'{value}'
              }
            }
          });
          total.forEach((item,i) => {
            yAxisData.push(Number(item.Network_Speed_Out).toFixed(2));
            time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'))
          });
          displayMax = maxAveMinVal[0].Network_Speed_Out_MAX === ('null' || 'undefined') ? '' : Number(maxAveMinVal[0].Network_Speed_Out_MAX).toFixed(2);
          displayAve = maxAveMinVal[0].Network_Speed_Out_AVG === ('null' || 'undefined') ? '' : Number(maxAveMinVal[0].Network_Speed_Out_AVG).toFixed(2);
          displayMin = maxAveMinVal[0].Network_Speed_Out_MIN === ('null' || 'undefined') ? '' : Number(maxAveMinVal[0].Network_Speed_Out_MIN).toFixed(2);
          displayLast = yAxisData[yAxisData.length-1] ? Number(yAxisData[yAxisData.length-1]).toFixed(2) : ''
        }
        let displayYAxisData = [];
        let displayTime = [];
        //判断天数
        if(+this.days === 1){
          for(let i=0;i<time.length;i+=1){
            displayYAxisData.push(yAxisData[i]);
            displayTime.push(time[i])
          }
        }else if(+this.days === 3){
          for(let i=0;i<time.length;i++){
            displayTime.push(time[i]);
            displayYAxisData.push(yAxisData[i])

          }
        }else if(+this.days === 7){
          for(let i=0;i<time.length;i++){
            displayTime.push(time[i]);
            displayYAxisData.push(yAxisData[i])
          }
        }
        // console.log(displayYAxisData);
        //改变图表数据
        this.cpuChart.setOption({
          title:[
            {
              subtext:`最近值${displayLast} 最小值${displayMin === null ? '' : displayMin} 平均值${displayAve === null ? '' : displayAve} 最大值${displayMax ===  null ? '' : displayMax}`
            }
          ],
          xAxis:{
            data:displayTime
          },
          series:[
            {
              name:name,
              data:displayYAxisData
            }
          ]
        })
      })
    },
    //点击切换指标
    tap(val,i){

      //页面上部数据
      this.$http.post('/Manage/Service/index',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'Service_Code':this.$route.params.serverId
      }).then((data) => {
        // console.log(data);
        this.isNormalCpu = data.Data.data.CPU_Load_Average;
        this.isNormalDisk = data.Data.data.Disk_Usage_Rate;
        this.isNormalMemory = data.Data.data.Memory_Usage_Rate;
        // console.log(data.Data.data.fourState[0].CPU_Load_Average);
        this.cpuLoadAve = data.Data.data.fourState[0].CPU_Load_Average ? (data.Data.data.fourState[0].CPU_Load_Average).toLocaleString() : '';
        this.memoryFree = data.Data.data.fourState[0].Memory_Usage_Rate ? (100 - Number(data.Data.data.fourState[0].Memory_Usage_Rate)).toFixed(2) : '';
        this.diskFree = data.Data.data.fourState[0] ? (100 - Number(data.Data.data.fourState[0].Disk_Usage_Rate)).toFixed(2) :'';
        this.network = data.Data.data.fourState[0] ? Number(data.Data.data.fourState[0].Network_Speed_In).toLocaleString() :'';
        this.warningNum = data.Data.data.waringNum.toLocaleString();
        this.interrupt = data.Data.data.offFinalResult.length.toLocaleString();
        // this.interruptdetail = data.Data.data.offFinalResult.slice(0,10);
        this.interruptdetail = data.Data.data.offFinalResult.reverse().slice(0,10);
        if(+this.warningNum > 0){
          // console.log(this.warningNum);
          this.ifWarning = true
        }else{
          this.ifWarning = false
        }
      });
      // console.log(val);
      val = val ? val : {code: this.serverType, type: this.type, id: this.id};
      // i = (i === 'undefined') ? this.serverOptionIndex : i;

      if(i === undefined){
        i = this.serverOptionIndex
      }
      this.serverOptionIndex = i;
      //服务器指标
      this.serverType = val.code;
      //服务器指标类型
      this.type = val.type;
      this.id = val.id
      if(val.id === 2){
        this.processVisible = true
      }else {
        this.processVisible = false
      }

      if(val.code === 'Network_Speed_In'){
        this.selectNetworkCard = true;
        this.Network_Speed = 'Network_Speed_In';
        this.$http.post('/Manage/Service/ServerAllIndexDetial',{
          'User_Id':window.localStorage.getItem('userId'),
          'Project_Code':this.$route.params.id,
          'Service_Code':this.$route.params.serverId,
          'dayType':this.days,
          'type':'Network',
          'detialType':this.Network_Speed,
          'Network_Card_Name':this.Network_Card_Name
        }).then((data) => {
          let type = [];
          let total = [];
          let maxAveMinVal = [];
          total = data.Data.data.detial;
          maxAveMinVal = data.Data.data.maxAvgMin;
          let displayMax = [];
          let displayAve = [];
          let displayMin = [];
          let displayLast = [];
          let yAxisData = [];
          let time = [];
          this.cpuChart.setOption({
            tooltip: {
              formatter: function (params) {
                return params[0].axisValue + '<br />' + '流入流量：'  + params[0].value
              },
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#6a7985'
                }
              }
            },
            yAxis:{
              axisLabel:{
                formatter:'{value}'
              }
            }
          });
          total.forEach((item,i) => {
            yAxisData.push(Number(item.Network_Speed_In).toFixed(2));
            time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'))
          });
          displayMax = maxAveMinVal[0].Network_Speed_In_MAX === ('null' || 'undefined') ? '' : Number(maxAveMinVal[0].Network_Speed_In_MAX).toFixed(2);
          displayAve = maxAveMinVal[0].Network_Speed_In_AVG === ('null' || 'undefined') ? '' : Number(maxAveMinVal[0].Network_Speed_In_AVG).toFixed(2);
          displayMin = maxAveMinVal[0].Network_Speed_In_MIN === ('null' || 'undefined') ? '' : Number(maxAveMinVal[0].Network_Speed_In_MIN).toFixed(2);
          displayLast = yAxisData[yAxisData.length-1] ? Number(yAxisData[yAxisData.length-1]).toFixed(2) : '';
          let displayYAxisData = [];
          let displayTime = [];
          //判断天数
          if(+this.days === 1){
            for(let i=0;i<time.length;i+=1){
              displayYAxisData.push(yAxisData[i]);
              displayTime.push(time[i])
            }
          }else if(+this.days === 3){
            for(let i=0;i<time.length;i++){
              displayTime.push(time[i]);
              displayYAxisData.push(yAxisData[i])

            }
          }else if(+this.days === 7){
            for(let i=0;i<time.length;i++){
              displayTime.push(time[i]);
              displayYAxisData.push(yAxisData[i])
            }
          }
          // console.log(displayYAxisData);
          //改变图表数据
          this.cpuChart.setOption({
            title:[
              {
                subtext:`最近值${displayLast} 最小值${displayMin === null ? '' : displayMin} 平均值${displayAve === null ? '' : displayAve} 最大值${displayMax ===  null ? '' : displayMax}`
              }
            ],
            xAxis:{
              data:displayTime
            },
            series:[
              {
                name:'流入流量',
                data:displayYAxisData
              }
            ]
          })
        })
      }else if(val.code === 'Network_Speed_Out'){
        this.selectNetworkCard = true;
        this.Network_Speed = 'Network_Speed_Out';
        this.$http.post('/Manage/Service/ServerAllIndexDetial',{
          'User_Id':window.localStorage.getItem('userId'),
          'Project_Code':this.$route.params.id,
          'Service_Code':this.$route.params.serverId,
          'dayType':this.days,
          'type':'Network',
          'detialType':this.Network_Speed,
          'Network_Card_Name':this.Network_Card_Name
        }).then((data) => {
          let type = [];
          let total = [];
          let maxAveMinVal = [];
          total = data.Data.data.detial;
          maxAveMinVal = data.Data.data.maxAvgMin;
          let displayMax = [];
          let displayAve = [];
          let displayMin = [];
          let displayLast = [];
          let yAxisData = [];
          let time = [];
          this.cpuChart.setOption({
            tooltip: {
              formatter: function (params) {
                return params[0].axisValue + '<br />' + '流出流量：'  + params[0].value
              },
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#6a7985'
                }
              }
            },
            yAxis:{
              axisLabel:{
                formatter:'{value}'
              }
            }
          });
          total.forEach((item,i) => {
            yAxisData.push(Number(item.Network_Speed_Out).toFixed(2));
            time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'))
          });
          displayMax = maxAveMinVal[0].Network_Speed_Out_MAX === ('null' || 'undefined') ? '' : Number(maxAveMinVal[0].Network_Speed_Out_MAX).toFixed(2);
          displayAve = maxAveMinVal[0].Network_Speed_Out_AVG === ('null' || 'undefined') ? '' : Number(maxAveMinVal[0].Network_Speed_Out_AVG).toFixed(2);
          displayMin = maxAveMinVal[0].Network_Speed_Out_MIN === ('null' || 'undefined') ? '' : Number(maxAveMinVal[0].Network_Speed_Out_MIN).toFixed(2);
          displayLast = yAxisData[yAxisData.length-1] ? Number(yAxisData[yAxisData.length-1]).toFixed(2) : '';
          let displayYAxisData = [];
          let displayTime = [];
          //判断天数
          if(+this.days === 1){
            for(let i=0;i<time.length;i+=1){
              displayYAxisData.push(yAxisData[i]);
              displayTime.push(time[i])
            }
          }else if(+this.days === 3){
            for(let i=0;i<time.length;i++){
              displayTime.push(time[i]);
              displayYAxisData.push(yAxisData[i])

            }
          }else if(+this.days === 7){
            for(let i=0;i<time.length;i++){
              displayTime.push(time[i]);
              displayYAxisData.push(yAxisData[i])
            }
          }
          // console.log(displayYAxisData);
          //改变图表数据
          this.cpuChart.setOption({
            title:[
              {
                subtext:`最近值${displayLast} 最小值${displayMin === null ? '' : displayMin} 平均值${displayAve === null ? '' : displayAve} 最大值${displayMax ===  null ? '' : displayMax}`
              }
            ],
            xAxis:{
              data:displayTime
            },
            series:[
              {
                name:'流出流量',
                data:displayYAxisData
              }
            ]
          })
        })
      }else {
        this.selectNetworkCard = false;
        this.$http.post('/Manage/Service/ServerAllIndexDetial',{
          'User_Id':window.localStorage.getItem('userId'),
          'Project_Code':this.$route.params.id,
          'Service_Code':this.$route.params.serverId,
          'dayType':this.days,
          'type':val.type,
          'detialType':val.code
        }).then((data) => {
          // console.log(data);
          //无数据时隐藏进程图
          if(data.Data.data.detial.length === 0){
            this.ifNoData = false
          }else{
            this.ifNoData = true
          }
          // if(data.Data.data.detial.length === 0){
          //   return
          // }
          this.middleData = data.Data.data.detial;
          let type = [];
          let total = [];
          let maxAveMinVal = [];
          total = data.Data.data.detial;
          maxAveMinVal = data.Data.data.maxAvgMin;
          let displayMax = [];
          let displayAve = [];
          let displayMin = [];
          let displayLast =[];
          let yAxisData = [];
          let time = [];
          //判断服务器指标
          if(this.serverType === 'CPU_Load_Average'){
            this.cpuChart.setOption({
              tooltip: {
                formatter: function (params) {
                  return params[0].axisValue + '<br />' + 'CPU平均负载：'  + params[0].value
                },
                trigger: 'axis',
                axisPointer: {
                  type: 'cross',
                  label: {
                    backgroundColor: '#6a7985'
                  }
                }
              },
              yAxis:{
                axisLabel:{
                  formatter:'{value}'
                }
              }
            });
            //CPU_Logs_Code字段用于进程top5传参，只有cpu类型有
            this.CPU_Logs_Code = data.Data.data.detial.length > 0 ? data.Data.data.detial[0].CPU_Logs_Code : '';
            total.forEach((item,i) => {
              yAxisData.push(Number(item.CPU_Load_Average).toFixed(2));
              time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'))
            });
            displayMax = maxAveMinVal[0].CPU_Load_Average_MAX === ('null' || 'undefined') ? '' : Number(maxAveMinVal[0].CPU_Load_Average_MAX).toFixed(2);
            displayAve = maxAveMinVal[0].CPU_Load_Average_AVG === ('null' || 'undefined') ? '' : Number(maxAveMinVal[0].CPU_Load_Average_AVG).toFixed(2);
            displayMin = maxAveMinVal[0].CPU_Load_Average_MIN === ('null' || 'undefined') ? '' : Number(maxAveMinVal[0].CPU_Load_Average_MIN).toFixed(2);
            displayLast = yAxisData[yAxisData.length-1] ? Number(yAxisData[yAxisData.length-1]).toFixed(2) : ''
          }else if(this.serverType === 'Maxproc'){
            this.cpuChart.setOption({
              tooltip: {
                formatter: function (params) {
                  return params[0].axisValue + '<br />' + 'CPU运行的进程数：'  + params[0].value
                },
                trigger: 'axis',
                axisPointer: {
                  type: 'cross',
                  label: {
                    backgroundColor: '#6a7985'
                  }
                }
              },
              yAxis:{
                axisLabel:{
                  formatter:'{value}'
                }
              }
            });
            this.CPU_Logs_Code = data.Data.data.detial.length > 0 ? data.Data.data.detial[0].CPU_Logs_Code : '';
            total.forEach((item,i) => {
              yAxisData.push(item.Maxproc);
              time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'))
            });
            displayMax = maxAveMinVal[0].CPU_Load_Average_MAX === ('null' || 'undefined') ? '' : maxAveMinVal[0].CPU_Load_Average_MAX;
            displayAve = maxAveMinVal[0].CPU_Load_Average_AVG === ('null' || 'undefined') ? '' : maxAveMinVal[0].CPU_Load_Average_AVG;
            displayMin = maxAveMinVal[0].CPU_Load_Average_MIN === ('null' || 'undefined') ? '' : maxAveMinVal[0].CPU_Load_Average_MIN;
            displayLast = yAxisData[yAxisData.length-1] ? yAxisData[yAxisData.length-1] : ''
          }else if(this.serverType === 'Proc_Total'){
            this.cpuChart.setOption({
              tooltip: {
                formatter: function (params) {
                  return params[0].axisValue + '<br />' + 'CPU进程总数：'  + params[0].value
                },
                trigger: 'axis',
                axisPointer: {
                  type: 'cross',
                  label: {
                    backgroundColor: '#6a7985'
                  }
                }
              },
              yAxis:{
                axisLabel:{
                  formatter:'{value}'
                }
              }
            });
            this.CPU_Logs_Code = data.Data.data.detial.length > 0 ? data.Data.data.detial[0].CPU_Logs_Code : '';
            total.forEach((item,i) => {
              yAxisData.push(item.Proc_Total);
              time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'))
            });
            displayMax = maxAveMinVal[0].Proc_Total_MAX === ('null' || 'undefined') ? '' : maxAveMinVal[0].Proc_Total_MAX;
            displayAve = maxAveMinVal[0].Proc_Total_AVG === ('null' || 'undefined') ? '' : maxAveMinVal[0].Proc_Total_AVG;
            displayMin = maxAveMinVal[0].Proc_Total_MIN === ('null' || 'undefined') ? '' : maxAveMinVal[0].Proc_Total_MIN;
            displayLast = yAxisData[yAxisData.length-1] ? yAxisData[yAxisData.length-1] : ''
          }else if(this.serverType === 'IO_Waiting_Time'){
            this.cpuChart.setOption({
              tooltip: {
                formatter: function (params) {
                  return params[0].axisValue + '<br />' + 'CPU-IO等待时间：'  + params[0].value + '%'
                },
                trigger: 'axis',
                axisPointer: {
                  type: 'cross',
                  label: {
                    backgroundColor: '#6a7985'
                  }
                }
              },
              yAxis:{
                axisLabel:{
                  formatter:'{value}%'
                }
              }
            });
            this.CPU_Logs_Code = data.Data.data.detial.length > 0 ? data.Data.data.detial[0].CPU_Logs_Code : '';
            total.forEach((item,i) => {
              yAxisData.push(Number(item.IO_Waiting_Time).toFixed(2));
              time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'))
            });
            displayMax = maxAveMinVal[0].IO_Waiting_Time_MAX === ('null' || 'undefined') ? '' : (Number(maxAveMinVal[0].IO_Waiting_Time_MAX).toFixed(2) + '%');
            displayAve = maxAveMinVal[0].IO_Waiting_Time_AVG === ('null' || 'undefined') ? '' : (Number(maxAveMinVal[0].IO_Waiting_Time_AVG).toFixed(2) + '%');
            displayMin = maxAveMinVal[0].IO_Waiting_Time_MIN === ('null' || 'undefined') ? '' : (Number(maxAveMinVal[0].IO_Waiting_Time_MIN).toFixed(2) + '%');
            displayLast = yAxisData[yAxisData.length-1] ? (Number(yAxisData[yAxisData.length-1]).toFixed(2) + '%') : ''
          }else if(this.serverType === 'Memory_Usage_Rate'){
            // console.log('Memory_Usage');
            this.cpuChart.setOption({
              tooltip: {
                formatter: function (params) {
                  return params[0].axisValue + '<br />' + '可用内存百分比：'  + params[0].value + '%'
                },
                trigger: 'axis',
                axisPointer: {
                  type: 'cross',
                  label: {
                    backgroundColor: '#6a7985'
                  }
                }
              },
              yAxis:{
                axisLabel:{
                  formatter:'{value}%'
                }
              }
            });
            total.forEach((item,i) => {
              yAxisData.push(Number(item.Memory_Usage_Rate).toFixed(2));
              time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'))
            });
            displayMax = maxAveMinVal[0].Memory_Usage_Rate_MAX === null ? '' : (Number(maxAveMinVal[0].Memory_Usage_Rate_MAX).toFixed(2) + '%');
            displayAve = maxAveMinVal[0].Memory_Usage_Rate_AVG === null ? '' : (Number(maxAveMinVal[0].Memory_Usage_Rate_AVG).toFixed(2) + '%');
            displayMin = maxAveMinVal[0].Memory_Usage_Rate_MIN === null ? '' : (Number(maxAveMinVal[0].Memory_Usage_Rate_MIN).toFixed(2) + '%');
            displayLast = yAxisData[yAxisData.length-1] ? (Number(yAxisData[yAxisData.length-1]).toFixed(2) + '%') : ''
          }else if(this.serverType === 'Disk_Usage_Rate'){
            this.cpuChart.setOption({
              tooltip: {
                formatter: function (params) {
                  return params[0].axisValue + '<br />' + '可用磁盘空间百分比：'  + params[0].value + '%'
                },
                trigger: 'axis',
                axisPointer: {
                  type: 'cross',
                  label: {
                    backgroundColor: '#6a7985'
                  }
                }
              },
              yAxis:{
                axisLabel:{
                  formatter:'{value}%'
                }
              }
            });
            total.forEach((item,i) => {
              yAxisData.push(Number(item.Disk_Usage_Rate).toFixed(2));
              time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'))
            });
            displayMax = maxAveMinVal[0].Disk_Usage_Rate_Over_MAX === ('null' || 'undefined') ? '' : (Number(maxAveMinVal[0].Disk_Usage_Rate_Over_MAX).toFixed(2) + '%');
            displayAve = maxAveMinVal[0].Disk_Usage_Rate_Over_AVG === ('null' || 'undefined') ? '' : (Number(maxAveMinVal[0].Disk_Usage_Rate_Over_AVG).toFixed(2) + '%');
            displayMin = maxAveMinVal[0].Disk_Usage_Rate_Over_MIN === ('null' || 'undefined') ? '' : (Number(maxAveMinVal[0].Disk_Usage_Rate_Over_MIN).toFixed(2) + '%');
            displayLast = yAxisData[yAxisData.length-1] ? (Number(yAxisData[yAxisData.length-1]).toFixed(2) + '%') : ''
          }else if(this.serverType === 'Network_Speed_In'){
            this.cpuChart.setOption({
              tooltip: {
                formatter: function (params) {
                  return params[0].axisValue + '<br />' + '流入流量：'  + params[0].value
                },
                trigger: 'axis',
                axisPointer: {
                  type: 'cross',
                  label: {
                    backgroundColor: '#6a7985'
                  }
                }
              },
              yAxis:{
                axisLabel:{
                  formatter:'{value}'
                }
              }
            });
            total.forEach((item,i) => {
              yAxisData.push(Number(item.Network_Speed_In).toFixed(2));
              time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'))
            });
            displayMax = maxAveMinVal[0].Network_Speed_In_MAX === ('null' || 'undefined') ? '' : Number(maxAveMinVal[0].Network_Speed_In_MAX).toFixed(2);
            displayAve = maxAveMinVal[0].Network_Speed_In_AVG === ('null' || 'undefined') ? '' : Number(maxAveMinVal[0].Network_Speed_In_AVG).toFixed(2);
            displayMin = maxAveMinVal[0].Network_Speed_In_MIN === ('null' || 'undefined') ? '' : Number(maxAveMinVal[0].Network_Speed_In_MIN).toFixed(2);
            displayLast = yAxisData[yAxisData.length-1] ? Number(yAxisData[yAxisData.length-1]).toFixed(2) : ''
          }else if(this.serverType === 'Network_Speed_Out'){
            this.cpuChart.setOption({
              tooltip: {
                formatter: function (params) {
                  return params[0].axisValue + '<br />' + '流出流量：'  + params[0].value
                },
                trigger: 'axis',
                axisPointer: {
                  type: 'cross',
                  label: {
                    backgroundColor: '#6a7985'
                  }
                }
              },
              yAxis:{
                axisLabel:{
                  formatter:'{value}'
                }
              }
            });
            total.forEach((item,i) => {
              yAxisData.push(Number(item.Network_Speed_Out).toFixed(2));
              time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'))
            });
            displayMax = maxAveMinVal[0].Network_Speed_Out_MAX === ('null' || 'undefined') ? '' : Number(maxAveMinVal[0].Network_Speed_Out_MAX).toFixed(2);
            displayAve = maxAveMinVal[0].Network_Speed_Out_AVG === ('null' || 'undefined') ? '' : Number(maxAveMinVal[0].Network_Speed_Out_AVG).toFixed(2);
            displayMin = maxAveMinVal[0].Network_Speed_Out_MIN === ('null' || 'undefined') ? '' : Number(maxAveMinVal[0].Network_Speed_Out_MIN).toFixed(2);
            displayLast = yAxisData[yAxisData.length-1] ? Number(yAxisData[yAxisData.length-1]).toFixed(2) : ''
          }else if(this.serverType === 'TCP_Link_Total'){
            this.cpuChart.setOption({
              tooltip: {
                formatter: function (params) {
                  return params[0].axisValue + '<br />' + 'TCP连接数：'  + params[0].value
                },
                trigger: 'axis',
                axisPointer: {
                  type: 'cross',
                  label: {
                    backgroundColor: '#6a7985'
                  }
                }
              },
              yAxis:{
                axisLabel:{
                  formatter:'{value}'
                }
              }
            });
            total.forEach((item,i) => {
              yAxisData.push(item.TCP_Link_Total)
              time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'))
            });
            displayMax = maxAveMinVal[0].TCP_Link_Total_MAX === ('null' || 'undefined') ? '' : maxAveMinVal[0].TCP_Link_Total_MAX;
            displayAve = maxAveMinVal[0].TCP_Link_Total_AVG === ('null' || 'undefined') ? '' : maxAveMinVal[0].TCP_Link_Total_AVG;
            displayMin = maxAveMinVal[0].TCP_Link_Total_MIN === ('null' || 'undefined') ? '' : maxAveMinVal[0].TCP_Link_Total_MIN;
            displayLast = yAxisData[yAxisData.length-1] ? yAxisData[yAxisData.length-1] : ''
          }
          let displayYAxisData = [];
          let displayTime = [];
          //判断天数
          if(+this.days === 1){
            for(let i=0;i<time.length;i+=1){
              displayYAxisData.push(yAxisData[i]);
              displayTime.push(time[i])
            }
          }else if(+this.days === 3){
            for(let i=0;i<time.length;i++){
              // if(i % 36 === 0){
              //   displayTime.push(time[i])
              // }else{
              //   displayTime.push('')
              // }
              displayTime.push(time[i]);
              displayYAxisData.push(yAxisData[i])

            }
          }else if(+this.days === 7){
            for(let i=0;i<time.length;i++){
              // if(i % 72 === 0){
              //   displayTime.push(time[i])
              // }else{
              //   displayTime.push('')
              // }
              displayTime.push(time[i]);
              displayYAxisData.push(yAxisData[i])
            }
          }
          //改变图表数据
          this.cpuChart.setOption({
            title:[
              {
                subtext:`最近值${displayLast} 最小值${displayMin === null ? '' : displayMin} 平均值${displayAve === null ? '' : displayAve} 最大值${displayMax ===  null ? '' : displayMax}`
              }
            ],
            xAxis:{
              data:displayTime
            },
            series:[
              {
                name:val.name,
                data:displayYAxisData
              }
            ]
          })
        })
      }



    },
    //点击切换近一天到近七天
    daysTab(val,i){
      this.dayOptionIndex = i;
      this.days = val.dayType;
      this.$http.post('/Manage/Service/ServerAllIndexDetial',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'Service_Code':this.$route.params.serverId,
        'dayType':this.days,
        'type':this.type,
        'detialType':this.serverType,
        'Network_Card_Name':this.Network_Card_Name
      }).then((data) => {
        //无数据时隐藏进程图
        if(data.Data.data.detial.length === 0){
          this.ifNoData = false
        }else{
          this.ifNoData = true
        }
        this.middleData = data.Data.data.detial;
        let type = [];
        let total = [];
        let maxAveMinVal = [];
        total = data.Data.data.detial;
        maxAveMinVal = data.Data.data.maxAvgMin;
        let displayMax = [];
        let displayAve = [];
        let displayMin = [];
        let displayLast =[];
        let yAxisData = [];
        let time = [];
        //判断服务器指标
        if(this.serverType === 'CPU_Load_Average'){
          this.cpuChart.setOption({
            tooltip: {
              formatter: function (params) {
                return params[0].axisValue + '<br />' + 'CPU平均负载：'  + params[0].value
              },
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#6a7985'
                }
              }
            },
            yAxis:{
              axisLabel:{
                formatter:'{value}'
              }
            }
          })
          total.forEach((item,i) => {
            yAxisData.push(Number(item.CPU_Load_Average).toFixed(2));
            time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'))
          })
          displayMax = maxAveMinVal[0].CPU_Load_Average_MAX === ('null' || 'undefined') ? '' : Number(maxAveMinVal[0].CPU_Load_Average_MAX).toFixed(2);
          displayAve = maxAveMinVal[0].CPU_Load_Average_AVG === ('null' || 'undefined') ? '' : Number(maxAveMinVal[0].CPU_Load_Average_AVG).toFixed(2);
          displayMin = maxAveMinVal[0].CPU_Load_Average_MIN === ('null' || 'undefined') ? '' : Number(maxAveMinVal[0].CPU_Load_Average_MIN).toFixed(2);
          displayLast = yAxisData[yAxisData.length-1] ? Number(yAxisData[yAxisData.length-1]).toFixed(2) : ''
        }else if(this.serverType === 'Maxproc'){
          this.cpuChart.setOption({
            tooltip: {
              formatter: function (params) {
                return params[0].axisValue + '<br />' + 'CPU运行的进程总数：'  + params[0].value
              },
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#6a7985'
                }
              }
            },
            yAxis:{
              axisLabel:{
                formatter:'{value}'
              }
            }
          })
          total.forEach((item,i) => {
            yAxisData.push(item.Maxproc)
            time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'))
          })
          displayMax = maxAveMinVal[0].CPU_Load_Average_MAX === ('null' || 'undefined') ? '' : maxAveMinVal[0].CPU_Load_Average_MAX;
          displayAve = maxAveMinVal[0].CPU_Load_Average_AVG === ('null' || 'undefined') ? '' : maxAveMinVal[0].CPU_Load_Average_AVG;
          displayMin = maxAveMinVal[0].CPU_Load_Average_MIN === ('null' || 'undefined') ? '' : maxAveMinVal[0].CPU_Load_Average_MIN;
          displayLast = yAxisData[yAxisData.length-1] ? yAxisData[yAxisData.length-1] : ''
        }else if(this.serverType === 'Proc_Total'){
          this.cpuChart.setOption({
            tooltip: {
              formatter: function (params) {
                return params[0].axisValue + '<br />' + 'CPU进程总数：'  + params[0].value
              },
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#6a7985'
                }
              }
            },
            yAxis:{
              axisLabel:{
                formatter:'{value}'
              }
            }
          })
          total.forEach((item,i) => {
            yAxisData.push(item.Proc_Total)
            time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'))
          })
          displayMax = maxAveMinVal[0].Proc_Total_MAX === ('null' || 'undefined') ? '' : maxAveMinVal[0].Proc_Total_MAX;
          displayAve = maxAveMinVal[0].Proc_Total_AVG === ('null' || 'undefined') ? '' : maxAveMinVal[0].Proc_Total_AVG;
          displayMin = maxAveMinVal[0].Proc_Total_MIN === ('null' || 'undefined') ? '' : maxAveMinVal[0].Proc_Total_MIN;
          displayLast = yAxisData[yAxisData.length-1] ? yAxisData[yAxisData.length-1] : ''
        }else if(this.serverType === 'IO_Waiting_Time'){
          this.cpuChart.setOption({
            yAxis:{
              tooltip: {
                formatter: function (params) {
                  return params[0].axisValue + '<br />' + 'CPU-IO等待时间：'  + params[0].value + '%'
                },
                trigger: 'axis',
                axisPointer: {
                  type: 'cross',
                  label: {
                    backgroundColor: '#6a7985'
                  }
                }
              },
              axisLabel:{
                formatter:'{value}%'
              }
            }
          })
          total.forEach((item,i) => {
            yAxisData.push(Number(item.IO_Waiting_Time).toFixed(2));
            time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'))
          })
          displayMax = maxAveMinVal[0].IO_Waiting_Time_MAX === ('null' || 'undefined') ? '' : (Number(maxAveMinVal[0].IO_Waiting_Time_MAX).toFixed(2) + '%');
          displayAve = maxAveMinVal[0].IO_Waiting_Time_AVG === ('null' || 'undefined') ? '' : (Number(maxAveMinVal[0].IO_Waiting_Time_AVG).toFixed(2) + '%');
          displayMin = maxAveMinVal[0].IO_Waiting_Time_MIN === ('null' || 'undefined') ? '' : (Number(maxAveMinVal[0].IO_Waiting_Time_MIN).toFixed(2) + '%');
          displayLast = yAxisData[yAxisData.length-1] ? (Number(yAxisData[yAxisData.length-1]).toFixed(2) + '%') : ''
        }else if(this.serverType === 'Memory_Usage_Rate'){
          this.cpuChart.setOption({
            yAxis:{
              tooltip: {
                formatter: function (params) {
                  return params[0].axisValue + '<br />' + '可用内存百分比：'  + params[0].value + '%'
                },
                trigger: 'axis',
                axisPointer: {
                  type: 'cross',
                  label: {
                    backgroundColor: '#6a7985'
                  }
                }
              },
              axisLabel:{
                formatter:'{value}%'
              }
            }
          })
          total.forEach((item,i) => {
            yAxisData.push(Number(item.Memory_Usage_Rate).toFixed(2));
            time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'))
          })
          displayMax = maxAveMinVal[0].Memory_Usage_Rate_MAX === ('null' || 'undefined') ? '' : (Number(maxAveMinVal[0].Memory_Usage_Rate_MAX).toFixed(2) + '%');
          displayAve = maxAveMinVal[0].Memory_Usage_Rate_AVG === ('null' || 'undefined') ? '' : (Number(maxAveMinVal[0].Memory_Usage_Rate_AVG).toFixed(2) + '%');
          displayMin = maxAveMinVal[0].Memory_Usage_Rate_MIN === ('null' || 'undefined') ? '' : (Number(maxAveMinVal[0].Memory_Usage_Rate_MIN).toFixed(2) + '%');
          displayLast = yAxisData[yAxisData.length-1] ? (Number(yAxisData[yAxisData.length-1]).toFixed(2) + '%') : ''
        }else if(this.serverType === 'Disk_Usage_Rate'){
          this.cpuChart.setOption({
            tooltip: {
              formatter: function (params) {
                return params[0].axisValue + '<br />' + '可用磁盘空间百分比：'  + params[0].value + '%'
              },
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#6a7985'
                }
              }
            },
            yAxis:{
              axisLabel:{
                formatter:'{value}%'
              }
            }
          })
          total.forEach((item,i) => {
            yAxisData.push(Number(item.Disk_Usage_Rate).toFixed(2));
            time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'));
            displayMax = maxAveMinVal[0].Disk_Usage_Rate_Over_MAX === ('null' || 'undefined') ? '' : (Number(maxAveMinVal[0].Disk_Usage_Rate_Over_MAX).toFixed(2) + '%');
            displayAve = maxAveMinVal[0].Disk_Usage_Rate_Over_AVG === ('null' || 'undefined') ? '' : (Number(maxAveMinVal[0].Disk_Usage_Rate_Over_AVG).toFixed(2) + '%');
            displayMin = maxAveMinVal[0].Disk_Usage_Rate_Over_MIN === ('null' || 'undefined') ? '' : (Number(maxAveMinVal[0].Disk_Usage_Rate_Over_MIN).toFixed(2) + '%');
            displayLast = yAxisData[yAxisData.length-1] ? (Number(yAxisData[yAxisData.length-1]).toFixed(2) + '%') : ''
          })
        }else if(this.serverType === 'Network_Speed_In'){
          this.cpuChart.setOption({
            tooltip: {
              formatter: function (params) {
                return params[0].axisValue + '<br />' + '流入流量：'  + params[0].value
              },
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#6a7985'
                }
              }
            },
            yAxis:{
              axisLabel:{
                formatter:'{value}'
              }
            }
          })
          total.forEach((item,i) => {
            yAxisData.push(Number(item.Network_Speed_In).toFixed(2));
            time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'));
            displayMax = maxAveMinVal[0].Network_Speed_In_MAX === ('null' || 'undefined') ? '' : Number(maxAveMinVal[0].Network_Speed_In_MAX).toFixed(2);
            displayAve = maxAveMinVal[0].Network_Speed_In_AVG === ('null' || 'undefined') ? '' : Number(maxAveMinVal[0].Network_Speed_In_AVG).toFixed(2);
            displayMin = maxAveMinVal[0].Network_Speed_In_MIN === ('null' || 'undefined') ? '' : Number(maxAveMinVal[0].Network_Speed_In_MIN).toFixed(2);
            displayLast = yAxisData[yAxisData.length-1] ? Number(yAxisData[yAxisData.length-1]).toFixed(2) : ''
          })
        }else if(this.serverType === 'Network_Speed_Out'){
          this.cpuChart.setOption({
            tooltip: {
              formatter: function (params) {
                return params[0].axisValue + '<br />' + '流出流量：'  + params[0].value
              },
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#6a7985'
                }
              }
            },
            yAxis:{
              axisLabel:{
                formatter:'{value}'
              }
            }
          })
          total.forEach((item,i) => {
            yAxisData.push(item.Network_Speed_Out)
            time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'))
            displayMax = maxAveMinVal[0].Network_Speed_Out_MAX === ('null' || 'undefined') ? '' : Number(maxAveMinVal[0].Network_Speed_Out_MAX).toFixed(2);
            displayAve = maxAveMinVal[0].Network_Speed_Out_AVG === ('null' || 'undefined') ? '' : Number(maxAveMinVal[0].Network_Speed_Out_AVG).toFixed(2);
            displayMin = maxAveMinVal[0].Network_Speed_Out_MIN === ('null' || 'undefined') ? '' : Number(maxAveMinVal[0].Network_Speed_Out_MIN).toFixed(2);
            displayLast = yAxisData[yAxisData.length-1] ? Number(yAxisData[yAxisData.length-1]).toFixed(2) : ''
          })
        }else if(this.serverType === 'TCP_Link_Total'){
          this.cpuChart.setOption({
            tooltip: {
              formatter: function (params) {
                return params[0].axisValue + '<br />' + 'TCP连接数：'  + params[0].value
              },
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#6a7985'
                }
              }
            },
            yAxis:{
              axisLabel:{
                formatter:'{value}'
              }
            }
          })
          total.forEach((item,i) => {
            yAxisData.push(item.TCP_Link_Total)
            time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'))
            displayMax = maxAveMinVal[0].TCP_Link_Total_MAX === ('null' || 'undefined') ? '' : maxAveMinVal[0].TCP_Link_Total_MAX;
            displayAve = maxAveMinVal[0].TCP_Link_Total_AVG === ('null' || 'undefined') ? '' : maxAveMinVal[0].TCP_Link_Total_AVG;
            displayMin = maxAveMinVal[0].TCP_Link_Total_MIN === ('null' || 'undefined') ? '' : maxAveMinVal[0].TCP_Link_Total_MIN;
            displayLast = yAxisData[yAxisData.length-1] ? yAxisData[yAxisData.length-1] : ''
          })
        }
        let displayYAxisData = [];
        let displayTime = [];
        //判断天数
        if(+this.days === 1){
          for(let i=0;i<time.length;i+=1){
            displayYAxisData.push(yAxisData[i]);
            displayTime.push(time[i])
          }
        }else if(+this.days === 3){
          for(let i=0;i<time.length;i++){
            // if(i % 36 === 0){
            //   displayTime.push(time[i])
            // }else {
            //   displayTime.push('')
            // }
            displayTime.push(time[i]);
            displayYAxisData.push(yAxisData[i])

          }
        }else if(+this.days === 7){
          for(let i=0;i<time.length;i++){
            // if(i % 72 === 0){
            //   displayTime.push(time[i])
            // }else{
            //   displayTime.push('')
            // }
            displayTime.push(time[i]);
            displayYAxisData.push(yAxisData[i])

          }
        }
        // console.log(displayMin === null);
        //改变图表数据
        this.cpuChart.setOption({
          title:[
            {
              subtext:`最近值${displayLast} 最小值${displayMin === null ? '' : displayMin} 平均值${displayAve === null ? '' : displayAve} 最大值${displayMax === null ? '' : displayMax}`
            }
            ],
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
      //面包屑
      const headerObj = this.$store.state.header.headData.find(item => item.Project_Code === this.$route.params.id);
      const serverListObj = headerObj.serverList.find(item => item.Server_Code === this.$route.params.serverId);
      // console.log(headerObj, 'headerObj');
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
      ]);
      this.serverName = serverListObj.Name;
      //

      this.serverOptionIndex = 0;
      this.dayOptionIndex = 0;
      this.type = 'CPU';
      this.serverType = 'CPU_Load_Average';
      //页面上部数据
      this.$http.post('/Manage/Service/index',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'Service_Code':this.$route.params.serverId
      }).then((data) => {
        // console.log(data);
        this.isNormalCpu = data.Data.data.CPU_Load_Average;
        this.isNormalDisk = data.Data.data.Disk_Usage_Rate;
        this.isNormalMemory = data.Data.data.Memory_Usage_Rate;
        // console.log(data.Data.data.fourState[0].CPU_Load_Average);
        this.cpuLoadAve = data.Data.data.fourState[0].CPU_Load_Average ? (data.Data.data.fourState[0].CPU_Load_Average).toLocaleString() : '';
        this.memoryFree = data.Data.data.fourState[0].Memory_Usage_Rate ? (100 - Number(data.Data.data.fourState[0].Memory_Usage_Rate)).toFixed(2) : '';
        this.diskFree = data.Data.data.fourState[0] ? (100 - Number(data.Data.data.fourState[0].Disk_Usage_Rate)).toFixed(2) :'';
        this.network = data.Data.data.fourState[0] ? Number(data.Data.data.fourState[0].Network_Speed_In).toLocaleString() :'';
        this.warningNum = data.Data.data.waringNum.toLocaleString();
        this.interrupt = data.Data.data.offFinalResult.length.toLocaleString();
        // this.interruptdetail = data.Data.data.offFinalResult.slice(0,10);
        this.interruptdetail = data.Data.data.offFinalResult.reverse().slice(0,10);
        if(+this.warningNum > 0){
          // console.log(this.warningNum);
          this.ifWarning = true
        }else{
          this.ifWarning = false
        }

      });


      //中间大图
      this.$http.post('/Manage/Service/ServerAllIndexDetial',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'Service_Code':this.$route.params.serverId,
        'dayType':'1',
        'type':'CPU',
        'detialType':'CPU_Load_Average'
      }).then((data) => {
        // console.log(data);
        this.networkCardList = data.Data.data.Network_Card_Name
        this.Network_Card_Name = this.networkCardList[0].Network_Card_Name
        let total = [];
        //无数据时隐藏进程图
        if(data.Data.data.detial.length === 0){
          this.ifNoData = false
        }else{
          this.ifNoData = true
        }
        //中间折线图获取到的数据
        this.middleData = data.Data.data.detial;
        // console.log(this.middleData);
        let maxAveMin = [];
        total = data.Data.data.detial;
        maxAveMin = data.Data.data.maxAvgMin;
        let cpuLoadAverage = [];
        let time = [];
        total.forEach((item,i) => {
          cpuLoadAverage.push(item.CPU_Load_Average);
          time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'))
        })
        let displayCpuLoadAverage = [];
        let displayTime = [];
        for(let i=0;i<time.length;i++){
          displayCpuLoadAverage.push(cpuLoadAverage[i]);
          displayTime.push(time[i])
        }
        //三个变量需要重新赋值
        // console.log(maxAveMin[0].CPU_Load_Average_MIN === null);
        let option = {
          log:['aa','bb'],
          backgroundColor: 'transparent',
          title:[
            {
              subtext:`最近值 ${cpuLoadAverage[cpuLoadAverage.length-1] ? cpuLoadAverage[cpuLoadAverage.length-1] : ''}  最小值 ${maxAveMin[0].CPU_Load_Average_MIN === null  ? '' : maxAveMin[0].CPU_Load_Average_MIN}  平均值 ${maxAveMin[0].CPU_Load_Average_AVG === null  ? '' : maxAveMin[0].CPU_Load_Average_AVG}  最大值${maxAveMin[0].CPU_Load_Average_MAX === null  ? '' : maxAveMin[0].CPU_Load_Average_MAX}`,
              x: '3%',
              textAlign: 'left',
              bottom:'3%'
            },

          ],
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
            bottom: '10%',
            top:'2%',
            containLabel: true
          },
          xAxis:{
            axisLabel:{
              rotate:0
            },
            type: 'category',
            boundaryGap: false,
            axisLine: {
              show: false
            },
            axisTick: {
              length: 0
            },
            data:displayTime,
          },
          yAxis: {
            type: 'value',
            axisLine: {
              show: false
            },
            axisTick: {
              length: 0
            },
            splitLine:{
              lineStyle:{
                type:'solid',
                opacity:0.8,
                color:['#24253a']
              }
            },
          },
          series:[
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
              data:displayCpuLoadAverage
            }
          ]
        };
        this.cpuChart.setOption(option,true);

        //中间大图点击事件
        // this.cpuChart.on('click', (params) => {
        //   this.middleClick(params)
        // })
        //进程占用top5进入页面默认展示
        this.$http.post('/Manage/Service/ServiceProTop5',{
          'User_Id':window.localStorage.getItem('userId'),
          'Project_Code':this.$route.params.id,
          'Service_Code':this.$route.params.serverId,
          // 'CPU_Logs_Code':this.CPU_Logs_Code
          'CPU_Logs_Code':this.middleData[this.middleData.length - 1] ? this.middleData[this.middleData.length - 1].CPU_Logs_Code : '',
          'Insert_Time':this.middleData[this.middleData.length - 1] ? this.middleData[this.middleData.length - 1].Insert_Time : ''
        }).then((data) => {
          // console.log(data);
          if (!data.Data) {
            this.processChart.setOption({
              yAxis:{data:''},
              series:[
                {data:''}
              ]
            });
            this.processLineChart.setOption({
              title:{subtext: ''},
              xAxis:{data:''},
              series:[{data:''}]
            });
          }
          this.leftButtomData = data.Data.data;
          let total = [];
          total = data.Data.data;
          // console.log(total);
          let displayProcessName = [];
          let displayProcessVal = [];
          total.forEach((item,i) => {
            displayProcessName.unshift(item.Proc_Name);
            displayProcessVal.unshift(item.CPU_Rate)
          });
          this.processChart.setOption({
            yAxis:{data:displayProcessName},
            series:[
              {data:displayProcessVal}
            ]
          });
          //进程占用top5点击事件
          this.processChart.on('click', (params) => {
            this.leftSideClick(params)
          });
          // console.log(total);
          //进程占用折线图
          this.$http.post('/Manage/Service/ServiceOneProDetial',{
            'User_Id':window.localStorage.getItem('userId'),
            'Project_Code':this.$route.params.id,
            'CPU_Logs_Code':total.length > 0 ? total[0].CPU_Logs_Code : '',
            'Proc_Name':total.length > 0 ? total[0].Proc_Name : '',
            'Server_Code':this.$route.params.serverId,
            'dayType':this.days
          }).then((data) =>{
            // console.log(data);
            if(+data.ErrorCode === -91){
              return
            };
            let total = [];
            let maxAvgMin = null;
            total = data.Data.data.pro.detial;
            maxAvgMin = data.Data.data.pro.maxAvgMin;
            let time = [];
            let processVal = [];
            total.forEach((item,i) => {
              time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'));
              processVal.push(item.CPU_Rate)
            });
            let displayTime = [];
            let displayProcessVal = [];
            for(let i=0;i<time.length;i+=10){
              displayProcessVal.push(processVal[i]);
              displayTime.push(time[i])
            }
            this.processLineChart.setOption({
              tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                  return params[0].axisValue + '<br />' + '进程占用率：' + params[0].value + '%'
                }
                // axisPointer: {
                //   formatter: function (params) {
                //     console.log(params);
                //     return params[0].axisValue + '<br />' + '进程占用率：'  + params[0].value + '%'
                //   },
                //   type: 'cross',
                //   label: {
                //     backgroundColor: '#6a7985'
                //   }
                // }
              },
              title:{
                subtext:`最近值${processVal.length > 0 ? processVal[processVal.length-1] : ''}% 最小值${maxAvgMin.CPU_Rate_MIN == 'null' ? '' : maxAvgMin.CPU_Rate_MIN}% 平均值${maxAvgMin.CPU_Rate_AVG == 'null' ? '' : maxAvgMin.CPU_Rate_AVG}% 最大值${maxAvgMin.CPU_Rate_MAX == 'null' ? '' : maxAvgMin.CPU_Rate_MAX}%`
              },
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
        // console.log(data);
        this.serverStatus = data.Data.data.offOnService;
        let runTime = data.Data.data.runTimeOffResult;
        // console.log(runTime);
        let runTimeData = [];
        runTimeData.push(runTime.continuousTime,runTime.addUpTime);
        this.runTimeChart.setOption({
          yAxis:{
            data:["累计运行："+data.Data.data.runTimeOffResult.continuousTimeStr,"连续运行："+data.Data.data.runTimeOffResult.addUpTimeStr]
          },
          series:[
            {data:runTimeData}
          ]
        })
      })
    },
    //中间大图点击事件
    middleClick(params) {
      // console.log(params);
      // console.log(this.middleData[params.dataIndex]);
      this.$http.post('/Manage/Service/ServiceProTop5',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'Service_Code':this.$route.params.serverId,
        'CPU_Logs_Code':this.middleData[params.dataIndex].CPU_Logs_Code,
        'Insert_Time':this.middleData[params.dataIndex].Insert_Time
      }).then((data) => {
        let total = [];
        total = data.Data.data;
        // console.log(total);
        this.leftButtomData = data.Data.data;
        let displayProcessName = [];
        let displayProcessVal = [];
        total.forEach((item,i) => {
          displayProcessName.unshift(item.Proc_Name);
          displayProcessVal.unshift(item.CPU_Rate)
        });
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
      // console.log(params);
      // console.log(this.leftButtomData);
      this.$http.post('/Manage/Service/ServiceOneProDetial',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'CPU_Logs_Code':this.leftButtomData[4 - params.dataIndex].CPU_Logs_Code,
        'Proc_Name':this.leftButtomData[4 - params.dataIndex].Proc_Name,
        'Server_Code':this.$route.params.serverId,
        'dayType':this.days
      }).then((data) =>{
        // console.log(data);
        let total = [];
        let maxAvgMin = null;
        total = data.Data.data.pro.detial;
        maxAvgMin = data.Data.data.pro.maxAvgMin;
        let time = [];
        let processVal = [];
        total.forEach((item,i) => {
          time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'));
          processVal.push(item.CPU_Rate)
        });
        let displayTime = [];
        let displayProcessVal = [];
        for(let i=0;i<time.length;i+=10){
          displayProcessVal.push(processVal[i]);
          displayTime.push(time[i])
        }
        this.processLineChart.setOption({
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              return params[0].axisValue + '<br />' + '进程占用率：' + params[0].value + '%'
            }
          },
          title:{
            // subtext: '最近值' + processVal[processVal.length-1] + '      ' + '最小值' + maxAvgMin.CPU_Rate_MIN + '      ' + '平均值' + maxAvgMin.CPU_Rate_AVG + '      ' +'最大值' + maxAvgMin.CPU_Rate_MAX,
            subtext:`最近值${processVal.length > 0 ? processVal[processVal.length-1] : ''}% 最小值${maxAvgMin.CPU_Rate_MIN == 'null' ? '' : maxAvgMin.CPU_Rate_MIN}% 平均值${maxAvgMin.CPU_Rate_AVG == 'null' ? '' : maxAvgMin.CPU_Rate_AVG}% 最大值${maxAvgMin.CPU_Rate_MAX == 'null' ? '' : maxAvgMin.CPU_Rate_MAX}%`
          },
          xAxis:{data:displayTime},
          series:[{data:displayProcessVal}]
        })
      })
    },
    //点击预警角标跳转预警事件页面
    toWarningEvent() {
      this.$router.push({
        path:`/project-index/${this.$route.params.id}/warningevent/`,
        query:{tapIndex:1,Warning_Group:1}
      })
    }

  },
  mounted () {

    // console.log(this.CPU_Logs_Code);

    let _this = this;
    //默认显示的服务器指标按钮
    this.getBtn();

    //服务器各项指标区域图表
      this.cpuChart = echarts.init(document.getElementById('mainChart'),'dark');
      this.cpuChart.setOption({
        log:['aa','bb'],
        backgroundColor: 'transparent',
        title: [{
          subtext: '',
          x: '3%',
          textAlign: 'left',
          bottom:'3%'
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
          axisLabel:{
            rotate:0
          },
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
          data: []
        },
        series: [
          {
            name: '占用百分比',
            type: 'bar',
            barWidth: 10,
            // label: {
            //   show: true,
            //   position: 'right',
            //   formatter: '{@[0]}'
            // },
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
      });

    //进程占用排行top5
      this.processChart = echarts.init(document.getElementById('processChart'),'dark')
      this.processChart.setOption({
        backgroundColor: 'transparent',
        color: ['#37A2DA', '#32C5E9', '#67E0E3', '#9FE6B8', '#FFDB5C','#ff9f7f', '#fb7293', '#E062AE', '#E690D1', '#e7bcf3', '#9d96f5', '#8378EA', '#96BFFF'],
        title: {
          text: '进程占用排行'
        },
        tooltip:{
          formatter:'{a}:{c}%',
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
      });
    //点击大图和点击左下角的点击事件
    this.cpuChart.on('click', (params) => {
      this.middleClick(params)
    });
    this.processChart.on('click', (params) => {
      this.leftSideClick(params)
    });
    //进程占用曲线
      this.processLineChart = echarts.init(document.getElementById('processLineChart'),"dark");
      this.processLineChart.setOption({
        backgroundColor: 'transparent',
        color: ['#37A2DA'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            },
            formatter: function (params) {
              return params[0].axisValue + '<br />' + '进程占用率：'  + params[0].value + '%'
            },
          }
        },
        title: {
          text: '进程占用率',
          subtext: '',
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
          },
          axisLabel:{
            formatter:'{value}%'
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
      });

    this.timer = setInterval(() => {
      this.tap()
    },300000);
    this.getData()

  },
  destroyed() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  watch: {
    $route(newVal) {
      // console.log(newVal.params);
      this.getData()
    }
  }
}
