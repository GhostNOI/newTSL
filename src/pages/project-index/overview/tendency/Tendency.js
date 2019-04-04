import echarts from 'echarts'
import {FormatDate, neighborTime} from "../../../../common/utils";
export default {
  name: "tendency",
  data () {
    return {
      value4:'',
      mainChart:'',
      processChart:'',
      processLineChart:'',
      startTime:'',
      endTime:'',
      leftButtomData:[],
      middleData:[],
      timer:null,
    }
  },
  methods:{
    getData(){
      //中间大折线图

      // console.log(FormatDate(neighborTime(this.$route.query.Warning_Time*1000), 'HH:mm'));
      const newDate = FormatDate(neighborTime(this.$route.query.Warning_Time*1000), 'HH:mm');
      let message = this.$route.query.Message;
      let displayMessage = `{c} {b}: ${message}.`;
      this.$http.post('/Manage/TrendMap/ServerCpuDetial',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'Service_Code':this.$route.query.Server_Code,
        'Timestamp':this.$route.query.Warning_Time,
        'WaringName':this.$route.query.Message
      }).then((data) => {
        // console.log(data);
        if(+data.ErrorCode === -91){
          return
        }
        this.startTime = FormatDate((data.Data.data.cpu.startTime)*1000,'YYYY-MM-DD HH:mm:ss');
        this.endTime = FormatDate((data.Data.data.cpu.endTime)*1000,'YYYY-MM-DD HH:mm:ss');
        //保存所有数据
        this.middleData = data.Data.data.cpu.detial;
        let total = [];
        total = data.Data.data.cpu.detial;
        //x轴的time
        let time = [];
        //所有的指标
        let CPU_Load_Average = [];
        let IO_Waiting_Time = [];
        let Maxproc = [];
        let Proc_Total = [];
        let Usage_Rate = [];
        total.forEach((item,i) => {
          time.push(FormatDate(item.Insert_Time*1000,'HH:mm'));
          CPU_Load_Average.push(item.CPU_Load_Average);
          IO_Waiting_Time.push(item.IO_Waiting_Time);
          Maxproc.push(item.Maxproc);
          Proc_Total.push(item.Proc_Total);
          Usage_Rate.push(item.Usage_Rate)
        });
        this.mainChart.setOption({
          xAxis:{data:time},
          legend: {
            top:'4%',
            right:'4%',
            data: ['CPU_Load_Average', 'IO_Waiting_Time', 'Maxproc', 'Proc_Total', 'Usage_Rate'],
          },
          series:[
            {
              data:CPU_Load_Average,
              markLine:{
                label:{
                  formatter: displayMessage
                },
                data: [{
                  xAxis: newDate
                }]
              },
            },
            {data:IO_Waiting_Time},
            {data:Maxproc},
            {data:Proc_Total},
            {data:Usage_Rate}
          ]
        });
        // let datas = data.Data.data.cpu.detial
        // console.log(datas);
        // let Usage_Rate = []
        // let time = []
        // datas.forEach((item,i) => {
        //   Usage_Rate.push(item.Usage_Rate)
        //   time.push(FormatDate(item.Insert_Time*1000,"HH:mm"))
        // })
        // this.mainChart.setOption({
        //   xAxis:{
        //     data:time
        //   },
        //   series:[
        //     {data:Usage_Rate}
        //   ]
        // })

        //进程占用top5,默认展示

        this.$http.post('/Manage/Service/ServiceProTop5',{
          'User_Id':window.localStorage.getItem('userId'),
          'Project_Code':this.$route.params.id,
          'Service_Code':total[total.length-1] ? total[total.length-1].Server_Code : '',
          'CPU_Logs_Code':total[total.length-1] ? total[total.length-1].CPU_Logs_Code : '',
          'Insert_Time':total[total.length-1] ? total[total.length-1].Insert_Time : ''
        }).then((data) => {
          // console.log(data);
          if(data.ErrorCode == 0 && data.Data.code == 0){
            let total = [];
            total = data.Data.data;
            this.leftButtomData = total;
            // console.log(this.leftButtomData);
            let displayProcessName = [];
            let displayProcessVal = [];
            total.forEach((item,i) => {
              displayProcessName.unshift(item.Proc_Name);
              displayProcessVal.unshift(item.CPU_Rate)
            });
            this.processChart.setOption({
              yAxis:{data:displayProcessName},
              series:[
                {},
                {data:displayProcessVal}
              ]
            });

            //进程占用折线图
            // console.log(total[0].CPU_Logs_Code);
            // console.log(total[0].Proc_Name);
            // console.log(this.$route.query.Server_Code);
            this.$http.post('/Manage/Service/ServiceOneProDetial',{
              'User_Id':window.localStorage.getItem('userId'),
              'Project_Code':this.$route.params.id,
              'CPU_Logs_Code':total[0] ? total[0].CPU_Logs_Code : '',
              'Proc_Name':total[0] ? total[0].Proc_Name : '',
              'Server_Code':this.$route.query.Server_Code,
            }).then((data) => {
              // console.log(data);
              if(+data.ErrorCode === 0 && +data.Data.code === 0){
                let total = [];
                let maxAvgMin =[];
                total = data.Data.data.pro.detial;
                maxAvgMin = data.Data.data.pro.maxAvgMin;
                let time = [];
                let processVal = [];
                total.forEach((item,i) => {
                  time.push(FormatDate(item.Insert_Time*1000,'HH:mm'));
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
                    // subtext: '最近值' + processVal[processVal.length-1] + ' ' + '最小值' + maxAvgMin.CPU_Rate_MIN + ' ' + '平均值' + maxAvgMin.CPU_Rate_AVG + ' ' +'最大值' + maxAvgMin.CPU_Rate_MAX,
                    subtext:`最近值${processVal[processVal.length-1]}% 最小值${maxAvgMin.CPU_Rate_MIN}% 平均值${maxAvgMin.CPU_Rate_AVG}% 最大值${maxAvgMin.CPU_Rate_MAX}%`
                  },
                  xAxis:{data:displayTime},
                  series:[{data:displayProcessVal}]
                })
              }
            })

          }


        });

        //点击到左下角
        this.mainChart.on('click',(params) => {
          this.tabProcess(params)
        });
        this.processChart.on('click',(params) => {
          this.leftButtomClick(params)
        })
      })
    },

    //进程top5
    tabProcess(params){
      // console.log(params);
      // console.log(this.middleData[params.dataIndex]);
      //进程占用top5
      this.$http.post('/Manage/Service/ServiceProTop5',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.middleData[4 - params.dataIndex].Project_Code,
        'Service_Code':this.middleData[4 - params.dataIndex].Server_Code,
        'CPU_Logs_Code':this.middleData[4 - params.dataIndex].CPU_Logs_Code,
        'Insert_Time':this.middleData[4 - params.dataIndex].Insert_Time
      }).then((data) => {
        // console.log(data);
        let total = [];
        total = data.Data.data;
        this.leftButtomData = total;
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
            {},
            {data:displayProcessVal}
          ]
        })
      })
    },

    //点击进程top5切换折线图
    leftButtomClick(params) {
      //进程占用折线图
      // console.log(this.leftButtomData);
      // console.log(params.dataIndex);
      this.$http.post('/Manage/Service/ServiceOneProDetial',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.leftButtomData[4 - params.dataIndex].Project_Code,
        'CPU_Logs_Code':this.leftButtomData[4 - params.dataIndex].CPU_Logs_Code,
        'Proc_Name':this.leftButtomData[4 - params.dataIndex].Proc_Name,
        'Server_Code':this.leftButtomData[4 - params.dataIndex].Server_Code,
      }).then((data) => {
        // console.log(data);
        let total = [];
        let maxAvgMin =[];
        total = data.Data.data.pro.detial;
        maxAvgMin = data.Data.data.pro.maxAvgMin;
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
          title:{
            // subtext: '最近值' + processVal[processVal.length-1] + '%' + ' ' + '最小值' + maxAvgMin.CPU_Rate_MIN + '%' + ' ' + '平均值' + maxAvgMin.CPU_Rate_AVG + '%' + ' ' +'最大值' + maxAvgMin.CPU_Rate_MAX + '%',
            subtext:`最近值${processVal[processVal.length-1]}% 最小值${maxAvgMin.CPU_Rate_MIN}% 平均值${maxAvgMin.CPU_Rate_AVG}% 最大值${maxAvgMin.CPU_Rate_MAX}% `
          },
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              return params[0].axisValue + '<br />' + '进程占用率：' + params[0].value + '%'
            }
          },
          xAxis:{data:displayTime},
          series:[{data:displayProcessVal}]
        })
      })
    }
  },
  mounted () {
    //面包屑
    const headerObj = this.$store.state.header.headData.find(item => item.Project_Code === this.$route.params.id);
    this.$store.commit('changeHeadTitle', [
      {
        url: `/project-index/${this.$route.params.id}`,
        title: headerObj.Project_Name
      },
      {
        url: '',
        title: '走势图'
      }
    ])
    // console.log(this.$route.query);
    // console.log(this.$route.params);
    this.getData()
    this.timer = setInterval(() => {
      this.getData()
    },300000)
    this.mainChart = echarts.init(document.getElementById('mainChart'),'dark')
    this.mainChart.setOption({
      backgroundColor: 'transparent',
      title: {
        subtext: '走势图',
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
        right: '3%',
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
        top: '0%',
        right: '4%'
      },
      series: [
        {
          name:'CPU_Load_Average',
          markLine: {
            label:{
              position: 'end',
              borderColor: '#4681FF',
              fontSize: 15,
              borderWidth: 1,
              padding: 4,
              backgroundColor: '#000',
              formatter: '{c} {b}: My SQL is down.'
            },
            symbol: 'none',
            lineStyle: {
              color: '#ff4c4c',
              width:2
            },
            data: [{
              name: '预警事件',
              xAxis: ''
            }]
          },
          type:'line',
          smooth: true,
          itemStyle:{
            color: 'rgb(154, 84, 245)'
          },
          lineStyle: {
            width: 3,
            color: 'rgb(154, 84, 245)'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(154, 84, 245, 0.8)'
            },{
              offset: 1,
              color: 'rgba(154, 84, 245, 0)'
            }])
          },
          data:[]
        },{
          name:'IO_Waiting_Time',
          type:'line',
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
            }, {
              offset: 1,
              color: 'rgba(70, 129, 255, 0)'
            }])
          },
          data:[]
        },{
          name:'Maxproc',
          type:'line',
          smooth: true,
          itemStyle:{
            color: 'rgb(11, 185, 255)'
          },
          lineStyle: {
            width: 3,
            color: 'rgb(11, 185, 255)'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(11, 185, 255, 0.8)'
            }, {
              offset: 1,
              color: 'rgba(11, 185, 255, 0)'
            }])
          },
          data:[]
        },{
          name:'Proc_Total',
          type:'line',
          smooth: true,
          itemStyle:{
            color: 'rgb(70, 255, 185)'
          },
          lineStyle: {
            width: 3,
            color: 'rgb(70, 255, 185)'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(70, 255, 185, 0.8)'
            }, {
              offset: 1,
              color: 'rgba(70, 255, 185, 0)'
            }])
          },
          data:[]
        },{
          name:'Usage_Rate',
          type:'line',
          smooth: true,
          itemStyle:{
            color: 'rgb(246, 235, 105)'
          },
          lineStyle: {
            width: 3,
            color: 'rgb(246, 235, 105)'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(246, 235, 105, 0.8)'
            }, {
              offset: 1,
              color: 'rgba(246, 235, 105, 0)'
            }])
          },
          data:[]
        }
      ]
    })

//test
      // this.mainChart.setOption({
      //   backgroundColor: 'transparent',
      //   title: [{
      //     subtext: '最近值' + '0.08' + '      ' + '最小值' + '0.04' + '      ' + '平均值' + '0.13' + '      ' +'最大值' + '0.4',
      //     x: '3%',
      //     textAlign: 'left'
      //   }],
      //   tooltip: {
      //     trigger: 'axis',
      //     axisPointer: {
      //       type: 'cross',
      //       label: {
      //         backgroundColor: '#6a7985'
      //       }
      //     }
      //   },
      //   grid: {
      //     left: '3%',
      //     right: '4%',
      //     bottom: '3%',
      //     containLabel: true
      //   },
      //   xAxis: {
      //     type: 'category',
      //     boundaryGap: false,
      //     axisLine: {
      //       show: false
      //     },
      //     axisTick: {
      //       length: 0
      //     },
      //     data: ['09:00','09:05','09:10','09:15','09:20','09:20','09:25']
      //   },
      //   yAxis: {
      //     type: 'value',
      //     axisLine: {
      //       show: false
      //     },
      //     axisTick: {
      //       length: 0
      //     },
      //   },
      //   series: [
      //     {
      //       name:'CPU平均负载',
      //       type:'line',
      //       smooth: true,
      //       markPoint: {
      //         symbol: 'circle',
      //         symbolSize: 15,
      //         itemStyle: {
      //           color: {
      //             type: 'radial',
      //             x: 0.5,
      //             y: 0.5,
      //             r: 0.5,
      //             colorStops: [{
      //               offset: 0, color: 'rgb(0, 0, 0)'
      //             }, {
      //               offset: 0.59, color: 'rgb(0, 0, 0)'
      //             }, {
      //               offset: 0.6, color: 'rgb(255, 0, 0)'
      //             },{
      //               offset: 1, color: 'rgba(255, 0, 0, 0)'
      //             }],
      //             globalCoord: false
      //           }
      //         },
      //         // label:{
      //         //   position: 'top',
      //         //   borderColor: '#4681FF',
      //         //   fontSize: 15,
      //         //   borderWidth: 1,
      //         //   padding: 4,
      //         //   backgroundColor: '#000',
      //         //   formatter: '{c} {b}: My SQL is down.'
      //         // },
      //         // data:[{
      //         //   name: '预警事件',
      //         //   value: '09:15',
      //         //   coord: ['09:15', '0.11']
      //         // }]
      //       },
      //       // markLine: {
      //       //   symbol: 'none',
      //       //   lineStyle: {
      //       //     color: '#D6E4FF'
      //       //   },
      //       //   label:{
      //       //     show: false
      //       //   },
      //       //   data: [{
      //       //     name: '预警事件',
      //       //     xAxis: '09:15'
      //       //   }]
      //       // },
      //       itemStyle:{
      //         color: 'rgb(169, 110, 246)'
      //       },
      //       lineStyle: {
      //         width: 3,
      //         color: 'rgb(169, 110, 246)'
      //       },
      //       areaStyle: {
      //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
      //           offset: 0,
      //           color: 'rgba(138, 76, 220, 0.8)'
      //         }, {
      //           offset: 0.5,
      //           color: 'rgba(102, 143, 255, 0.4)'
      //         },{
      //           offset: 1,
      //           color: 'rgba(102, 143, 255, 0)'
      //         }])
      //       },
      //       data:[0.08, 0.25, 0.1, 0.11, 0.05, 0.07, 0.08]
      //     },
      //   ]
      // })

    //进程排行
    this.processChart = echarts.init(document.getElementById('processChart'),'dark')
    this.processChart.setOption({
      backgroundColor: 'transparent',
      color: ['#37A2DA', '#32C5E9', '#67E0E3', '#9FE6B8', '#FFDB5C','#ff9f7f', '#fb7293', '#E062AE', '#E690D1', '#e7bcf3', '#9d96f5', '#8378EA', '#96BFFF'],
      title: {
        text: '进程占用排行'
      },
      tooltip:{
        // trigger: 'axis',
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
          // name: 'background',
          type: 'bar',
          barWidth: 10,
          itemStyle: {
            color: ['#1D223D'],
          },
          data: []
        },
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

    this.processLineChart = echarts.init(document.getElementById('processLineChart'),'dark')
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
        subtext: '',
        textAlign: 'left'
      },
      legend: {
        data: ['进程变化']
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
        axisLine: {
          show: false
        },
        axisTick: {
          length: 0
        },
        axisLabel:{
          formatter:'{value}%'
        },
        type: 'value'
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

  },
  watch: {
    $route(newVal) {
      // console.log(newVal.params);
      this.getData()
    }
  },
  destroyed() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
}
