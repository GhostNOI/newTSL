import {FormatDate} from '../../../../../common/utils.js'
import echarts from 'echarts'
export default {
  name: "Database",
  data () {
    return {
      connectionTotal:'',
      lastBackupTime:'',
      slowQueryCount:'',
      dialogFormVisible:false,
      databaseProject:[
        {
          title:'Database',
          content:[
            {id:1,code:'Connection_Total',name:'连接数',checked:true},
            {id:2,code:'IO_Thread',name:'线程连接率',checked:true},
            {id:3,code:'Proc_Numbers',name:'进程总数',checked:true},
            // {id:4,code:'',name:'活跃进程',checked:true},
            {id:5,code:'Copy_Delay',name:'复制延迟',checked:true},
            {id:6,code:'SQL_Thread',name:'SQL',checked:true}
          ]
        }
      ],
      daysPick:[
        {dayType:1,name:'近1天'},
        {dayType:3,name:'近3天'},
        {dayType:7,name:'近7天'}
      ],
      dayOptionIndex:0,
      databaseOptionIndex:0,
      checkedArr: [],
      btnArr:[],
      days:1,
      detialType:'Connection_Total',
      mainChart:'',
      waringNum:null,
      ifWarning:false,
      timer: null,
      concurrency:'',
      isNormalConnection:0,
      isNormalSlow:0
    }
  },
  methods: {
    getData() {
      //面包屑
      const headerObj = this.$store.state.header.headData.find(item => item.Project_Code === this.$route.params.id);
      const databaseListObj = headerObj.databaseList.find(item => item.DB_Code === this.$route.params.databaseId);

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
          title: '数据库'
        },
        {
          url: '',
          title: databaseListObj.DB_Name
        }
      ])
      //

      this.databaseOptionIndex = 0;
      this.dayOptionIndex = 0;
      this.days = 1
      this.$http.post('/Manage/Database/Index',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'DB_Code':this.$route.params.databaseId
      }).then((data) => {
        // console.log(data);
        this.connectionTotal = data.Data.data.connectionTotalAndProcNumbers.length > 0 ? data.Data.data.connectionTotalAndProcNumbers[0].Connection_Total.toLocaleString() : '';
        this.concurrency = data.Data.data.connectionTotalAndProcNumbers.length > 0 ? data.Data.data.connectionTotalAndProcNumbers[0].Proc_Numbers.toLocaleString() : '';
        // this.lastBackupTime = FormatDate(data.Data.data.lastBackupTime*1000,'YYYY-MM-DD HH:mm:ss')
        this.lastBackupTime = +data.Data.data.lastBackupTime === -1 ? '' : FormatDate(data.Data.data.lastBackupTime*1000,'YYYY-MM-DD HH:mm:ss');
        this.slowQueryCount = data.Data.data.slowQueryCount.toLocaleString();
        this.waringNum = data.Data.data.waringNum;
        this.isNormalConnection = data.Data.data.Connection_Total;
        this.isNormalSlow = data.Data.data.slowQueryCount;

        if(+this.waringNum > 0){
          this.ifWarning = true
        }else{
          this.ifWarning = false
        }
      });

      this.$http.post('/Manage/Database/DatabaseAllIndexDetial',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'DB_Code':this.$route.params.databaseId,
        'dayType':1,
        'detialType':'Connection_Total'
      }).then((data) => {
        // console.log(data);
        let total = [];
        let maxAveMin = [];
        total = data.Data.data.detial;
        maxAveMin = data.Data.data.maxAvgMin;
        let yAxisData = [];
        let time = [];
        // console.log(total);
        total.forEach((item,i) => {
          yAxisData.push(item.Connection_Total);
          time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'))
        });
        let displayYAxisData = [];
        let displayTime = [];
        for(let i=0;i<time.length;i++){
          displayYAxisData.push(yAxisData[i]);
          displayTime.push(time[i])
        }
        // console.log(maxAveMin.Connection_Total_MIN === null);
        //loading
        // this.mainChart.showLoading('default', {
        //   text: 'loading',
        //   color: '#1276FF',
        //   textColor: '#BAD616',
        //   maskColor: 'rgba(0,92,163,0)',
        //   zlevel: 0,
        //   series: []
        // });
        this.mainChart.setOption({
          title:[{
            // subtext: '最近值' + yAxisData[yAxisData.length-1] + '  ' + '最小值' + maxAveMin.Connection_Total_MIN  + '  ' + '平均值' + maxAveMin.Connection_Total_AVG + '  ' +'最大值' + maxAveMin.Connection_Total_MAX,
            subtext:`最近值${yAxisData[yAxisData.length-1] ? yAxisData[yAxisData.length-1] : ''} 最小值${maxAveMin.Connection_Total_MIN === null  ? '' : maxAveMin.Connection_Total_MIN === null ? '' : maxAveMin.Connection_Total_MIN} 平均值${maxAveMin.Connection_Total_AVG === null ? '' : maxAveMin.Connection_Total_AVG} 最大值${maxAveMin.Connection_Total_MAX === null ? '' : maxAveMin.Connection_Total_MAX}`
          }],
          tooltip: {
            formatter: "{b}<br />连接数: {c}",
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
          },
          xAxis:{
            data:displayTime
          },
          series:[{
            data:displayYAxisData
          }]
        })
      })
    },
    getBtn() {
      this.checkedArr = [];
      this.databaseProject.forEach(item=>{
        this.checkedArr = this.checkedArr.concat(item.content.filter(items => items.checked));
      });
      this.checkedArr.forEach((item,i) => {
        this.btnArr.push(item);
      })
    },
    changeCheckbox() {
      this.checkedArr = [];
      this.databaseProject.forEach(item => {
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
    sure() {
      this.btnArr = [];
      this.checkedArr.forEach((item,i)=>{
        this.btnArr.push(item)
      });
      this.dialogFormVisible = false
    },
    tap(val,i){
      val = val ? val : {code: this.detialType};
      // i = i == 'undefined' ? this.databaseOptionIndex : i
      if(i === undefined) {
        i = this.databaseOptionIndex
      }
      this.databaseOptionIndex = i;
      // console.log(this.databaseOptionIndex);
      // this.databaseOptionIndex = (i ? this.databaseOptionIndex : i)
      // console.log(this.databaseOptionIndex);
      this.detialType = val.code;
      this.$http.post('/Manage/Database/DatabaseAllIndexDetial',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'DB_Code':this.$route.params.databaseId,
        'dayType':this.days,
        'detialType':val.code
      }).then((data) => {
        let total = [];
        let maxAveMinVal = [];
        let displayMax = [];
        let displayAve = [];
        let displayMin = [];
        let displayLast =[];
        total = data.Data.data.detial;
        maxAveMinVal = data.Data.data.maxAvgMin;
        let yAxisData = [];
        let time = [];
        if(this.detialType === 'Connection_Total'){
          this.mainChart.setOption({
            tooltip: {
              formatter: "{b}<br />连接数: {c}",
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
            yAxisData.push(item.Connection_Total);
            time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'))
          });
          displayMax = maxAveMinVal.Connection_Total_MAX === 'undefined' ? '' : maxAveMinVal.Connection_Total_MAX;
          displayAve = maxAveMinVal.Connection_Total_AVG === 'undefined' ? '' : maxAveMinVal.Connection_Total_AVG;
          displayMin = maxAveMinVal.Connection_Total_MIN === 'undefined' ? '' : maxAveMinVal.Connection_Total_MIN;
          displayLast = yAxisData[yAxisData.length-1] ? yAxisData[yAxisData.length-1] : ''
        }else if(this.detialType === 'IO_Thread'){
          this.mainChart.setOption({
            tooltip: {
              formatter: "{b}<br />线程连接率: {c}%",
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
            yAxisData.push(Number(item.IO_Thread).toFixed(2))
            time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'))
          })

          displayMax = maxAveMinVal.IO_Thread_MAX === 'undefined' ? '' : (Number(maxAveMinVal.IO_Thread_MAX).toFixed(2) + '%');
          displayAve = maxAveMinVal.IO_Thread_AVG === 'undefined' ? '' : (Number(maxAveMinVal.IO_Thread_AVG).toFixed(2) + '%');
          displayMin = maxAveMinVal.IO_Thread_MIN === 'undefined' ? '' : (Number(maxAveMinVal.IO_Thread_MIN).toFixed(2) + '%');
          displayLast = yAxisData[yAxisData.length-1] ? (Number(yAxisData[yAxisData.length-1]).toFixed(2) + '%') : ''
        }else if(this.detialType === 'Proc_Numbers'){
          this.mainChart.setOption({
            tooltip: {
              formatter: "{b}<br />进程总数: {c}",
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
            yAxisData.push(item.Proc_Numbers)
            time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'))
          })
          displayMax = maxAveMinVal.Proc_Numbers_MAX === 'undefined' ? '' : maxAveMinVal.Proc_Numbers_MAX;
          displayAve = maxAveMinVal.Proc_Numbers_AVG === 'undefined' ? '' : maxAveMinVal.Proc_Numbers_AVG;
          displayMin = maxAveMinVal.Proc_Numbers_MIN === 'undefined' ? '' : maxAveMinVal.Proc_Numbers_MIN;
          displayLast = yAxisData[yAxisData.length-1] ? yAxisData[yAxisData.length-1] : ''
        }else if(this.detialType === 'Copy_Delay'){
          this.mainChart.setOption({
            tooltip: {
              formatter: "{b}<br />复制延迟: {c}",
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
            yAxisData.push(item.Copy_Delay);
            time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'))
          })
          displayMax = maxAveMinVal.Copy_Delay_MAX === 'undefined' ? '' : maxAveMinVal.Copy_Delay_MAX;
          displayAve = maxAveMinVal.Copy_Delay_AVG === 'undefined' ? '' : maxAveMinVal.Copy_Delay_AVG;
          displayMin = maxAveMinVal.Copy_Delay_MIN === 'undefined' ? '' : maxAveMinVal.Copy_Delay_MIN;
          displayLast = yAxisData[yAxisData.length-1] ? yAxisData[yAxisData.length-1] : ''
        }else if(this.detialType === 'SQL_Thread'){
          this.mainChart.setOption({
            tooltip: {
              formatter: "{b}<br />SQL: {c}",
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
            yAxisData.push(item.SQL_Thread)
            time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'))
          })
          displayMax = maxAveMinVal.SQL_Thread_MAX === 'undefined' ? '' : maxAveMinVal.SQL_Thread_MAX;
          displayAve = maxAveMinVal.SQL_Thread_AVG === 'undefined' ? '' : maxAveMinVal.SQL_Thread_AVG;
          displayMin = maxAveMinVal.SQL_Thread_MIN === 'undefined' ? '' : maxAveMinVal.SQL_Thread_MIN;
          displayLast = yAxisData[yAxisData.length-1] ? yAxisData[yAxisData.length-1] : ''
        }

        let displayYAxisData = []
        let displayTime = []
        if(+this.days === 1){
          for(let i=0;i<time.length;i++){
            displayYAxisData.push(yAxisData[i])
            displayTime.push(time[i])
          }
        }else if(+this.days === 3){
          for(let i=0;i<time.length;i++){
            // if(i % 36 === 0){
            //   displayTime.push(time[i])
            // }else {
            //   displayTime.push('')
            // }
            displayTime.push(time[i])
            displayYAxisData.push(yAxisData[i])

          }
        }if(+this.days === 7){
          for(let i=0;i<time.length;i++){
            // if(i % 72 === 0){
            //   displayTime.push(time[i])
            // }else {
            //   displayTime.push('')
            // }
            displayTime.push(time[i])
            displayYAxisData.push(yAxisData[i])
          }
        }
        this.mainChart.setOption({
          title:[
            {
              // subtext: '最近值' + displayLast + '  ' + '最小值' + displayMin + '  ' + '平均值' + displayAve + '  ' +'最大值' + displayMax,
              subtext:`最近值${displayLast} 最小值${displayMin === null ? '' : displayMin} 平均值${displayAve === null ? '' : displayAve} 最大值${displayMax ===  null ? '' : displayMax}`
            }
          ],
          xAxis:{
            data:displayTime
          },
          series:[{
            data:displayYAxisData
          }]
        })

      })
    },
    daysTab(val,i){
      this.dayOptionIndex = i;
      this.days = val.dayType
      this.$http.post('/Manage/Database/DatabaseAllIndexDetial',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'DB_Code':this.$route.params.databaseId,
        'dayType':val.dayType,
        'detialType':this.detialType
      }).then((data) => {
        let total = []
        let maxAveMinVal = [];
        let displayMax = [];
        let displayAve = [];
        let displayMin = [];
        let displayLast =[];
        total = data.Data.data.detial;
        maxAveMinVal = data.Data.data.maxAvgMin;
        let yAxisData = [];
        let time = [];
        if(this.detialType === 'Connection_Total'){
          this.mainChart.setOption({
            tooltip: {
              formatter: "{b}<br />连接数: {c}",
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
            yAxisData.push(item.Connection_Total)
            time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'))
          })
          displayMax = maxAveMinVal.Connection_Total_MAX === 'undefined' ? '' : maxAveMinVal.Connection_Total_MAX
          displayAve = maxAveMinVal.Connection_Total_AVG === 'undefined' ? '' : maxAveMinVal.Connection_Total_AVG
          displayMin = maxAveMinVal.Connection_Total_MIN === 'undefined' ? '' : maxAveMinVal.Connection_Total_MIN
          displayLast = yAxisData[yAxisData.length-1] ? yAxisData[yAxisData.length-1] : ''
        }else if(this.detialType === 'IO_Thread'){
          this.mainChart.setOption({
            tooltip: {
              formatter: "{b}<br />线程连接率: {c}%",
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
            yAxisData.push(item.IO_Thread)
            time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'))
          })
          displayMax = maxAveMinVal.IO_Thread_MAX === 'undefined' ? '' : (Number(maxAveMinVal.IO_Thread_MAX).toFixed(2) + '%');
          displayAve = maxAveMinVal.IO_Thread_AVG === 'undefined' ? '' : (Number(maxAveMinVal.IO_Thread_AVG).toFixed(2) + '%');
          displayMin = maxAveMinVal.IO_Thread_MIN === 'undefined' ? '' : (Number(maxAveMinVal.IO_Thread_MIN).toFixed(2) + '%');
          displayLast = yAxisData[yAxisData.length-1] ? (Number(yAxisData[yAxisData.length-1]) + '%') : ''
        }else if(this.detialType === 'Proc_Numbers'){
          this.mainChart.setOption({
            tooltip: {
              formatter: "{b}<br />进程总数: {c}",
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
            yAxisData.push(item.Proc_Numbers)
            time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'))
          })
          displayMax = maxAveMinVal.Proc_Numbers_MAX === 'undefined' ? '' : maxAveMinVal.Proc_Numbers_MAX;
          displayAve = maxAveMinVal.Proc_Numbers_AVG === 'undefined' ? '' : maxAveMinVal.Proc_Numbers_AVG;
          displayMin = maxAveMinVal.Proc_Numbers_MIN === 'undefined' ? '' : maxAveMinVal.Proc_Numbers_MIN;
          displayLast = yAxisData[yAxisData.length-1] ? yAxisData[yAxisData.length-1] : ''
        }else if(this.detialType === 'Copy_Delay'){
          this.mainChart.setOption({
            tooltip: {
              formatter: "{b}<br />复制延迟: {c}",
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
            yAxisData.push(item.Copy_Delay)
            time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'))
          })
          displayMax = maxAveMinVal.Copy_Delay_MAX === 'undefined' ? '' : maxAveMinVal.Copy_Delay_MAX;
          displayAve = maxAveMinVal.Copy_Delay_AVG === 'undefined' ? '' : maxAveMinVal.Copy_Delay_AVG;
          displayMin = maxAveMinVal.Copy_Delay_MIN === 'undefined' ? '' : maxAveMinVal.Copy_Delay_MIN;
          displayLast = yAxisData[yAxisData.length-1] ? yAxisData[yAxisData.length-1] : ''
        }else if(this.detialType === 'SQL_Thread'){
          this.mainChart.setOption({
            tooltip: {
              formatter: "{b}<br />SQL: {c}",
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
            yAxisData.push(item.SQL_Thread)
            time.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'))
          })
          displayMax = maxAveMinVal.SQL_Thread_MAX === 'undefined' ? '' : maxAveMinVal.SQL_Thread_MAX;
          displayAve = maxAveMinVal.SQL_Thread_AVG === 'undefined' ? '' : maxAveMinVal.SQL_Thread_AVG;
          displayMin = maxAveMinVal.SQL_Thread_MIN === 'undefined' ? '' : maxAveMinVal.SQL_Thread_MIN;
          displayLast = yAxisData[yAxisData.length-1] ? yAxisData[yAxisData.length-1] : ''
        }
        let displayYAxisData = [];
        let displayTime = [];
        if(+this.days === 1){
          for(let i=0;i<time.length;i++){
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
            displayTime.push(time[i])
            displayYAxisData.push(yAxisData[i]);
          }
        }if(+this.days === 7){
          for(let i=0;i<time.length;i++){
            // if(i % 72 === 0){
            //   displayTime.push(time[i])
            // }else {
            //   displayTime.push('')
            // }
            displayTime.push(time[i])
            displayYAxisData.push(yAxisData[i])
          }
        }
        this.mainChart.setOption({
          title:[
            {
              subtext:`最近值${displayLast} 最小值${displayMin === null ? '' : displayMin} 平均值${displayAve === null ? '' :displayAve} 最大值${displayMax ===  null ? '' : displayMax}`
            }
          ],
          xAxis:{
            data:displayTime
          },
          series:[{
            data:displayYAxisData
          }]
        })

      })
    },

    //点击角标跳转至预警事件
    toWarningEvent() {
      this.$router.push({
        path:`/project-index/${this.$route.params.id}/warningevent/`,
        query:{tapIndex:2,Warning_Group:2}
      })
    }
  },
  mounted () {
    //初始化echarts
    this.mainChart = echarts.init(document.getElementById('mainChart'),'dark')
    this.mainChart.setOption({
      backgroundColor: 'transparent',
      title: [{
        subtext: '',
        x: '3%',
        textAlign: 'left'
      }],
      tooltip: {
        formatter: "{b}<br />连接数: {c}%",
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
      series: [
        {
          name:'',
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
    });

    // console.log(this.$route.params);
    this.getBtn();
    //页面上部数据
    this.timer = setInterval(() => {
      // this.getData()
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
      this.getData()
    }
  }
}
