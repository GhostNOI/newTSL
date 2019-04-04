import {FormatDate} from '../../../../../common/utils.js'
import echarts from 'echarts'
import {transformDate} from "../../../../../common/filters";

export default {
  name: "SlowLog",
  data(){
    return{
      value4: '',
      tableData: [],
      tableData1: [],
      mainChart: null,
      //选择时间类型
      dayType: 1,
      datePick: [],
      howMany: null,
      currentPage: 1,
      pageSize: 10,
      pageNum: 1,
      displayTime: '',
      displayTime2: '',
      noData:false
    }
  },
  mounted(){
    //面包屑
    const headerObj = this.$store.state.header.headData.find(item => item.Project_Code === this.$route.params.id);
    this.$store.commit('changeHeadTitle', [
      {
        url: `/project-index/${this.$route.params.id}`,
        title: headerObj.Project_Name
      },
      {
        url:'',
        title:'服务日志'
      },
      {
        url:'',
        title:'慢日志'
      }
    ])

    //折线图
    //   this.mainChart = echarts.init(document.getElementById('mainChart'),'dark')
    //   this.mainChart.setOption({
    //     backgroundColor: 'transparent',
    //     tooltip: {
    //       trigger: 'axis',
    //       axisPointer: {
    //         type: 'cross',
    //         label: {
    //           backgroundColor: '#6a7985'
    //         }
    //       }
    //     },
    //     grid: {
    //       left: '3%',
    //       right: '4%',
    //       bottom: '3%',
    //       containLabel: true
    //     },
    //     xAxis: {
    //       type: 'category',
    //       boundaryGap: false,
    //       axisLine: {
    //         show: false
    //       },
    //       axisTick: {
    //         length: 0
    //       },
    //       data: []
    //     },
    //     yAxis: {
    //       type: 'value',
    //       axisLine: {
    //         show: false
    //       },
    //       axisTick: {
    //         length: 0
    //       },
    //     },
    //     series: [
    //       {
    //         markPoint: {
    //           symbol: 'circle',
    //           symbolSize: 15,
    //           itemStyle: {
    //             color: {
    //               type: 'radial',
    //               x: 0.5,
    //               y: 0.5,
    //               r: 0.5,
    //               colorStops: [{
    //                 offset: 0, color: 'rgb(0, 0, 0)'
    //               }, {
    //                 offset: 0.59, color: 'rgb(0, 0, 0)'
    //               }, {
    //                 offset: 0.6, color: 'rgb(255, 0, 0)'
    //               },{
    //                 offset: 1, color: 'rgba(255, 0, 0, 0)'
    //               }],
    //               globalCoord: false
    //             }
    //           },
    //           label:{
    //             position: 'top',
    //             borderColor: '#4681FF',
    //             fontSize: 15,
    //             borderWidth: 1,
    //             padding: 4,
    //             backgroundColor: '#000',
    //             align: 'left',
    //             // formatter: '2018-11-30 {c} \n 25次'
    //           },
    //           data:[{
    //             name: '预警事件',
    //             value: '09:15',
    //             coord: ['09:15', '7']
    //           }]
    //         },
    //         markLine: {
    //           symbol: 'none',
    //           lineStyle: {
    //             color: '#D6E4FF'
    //           },
    //           label:{
    //             show: false
    //           },
    //           data: [{
    //             name: '预警事件',
    //             xAxis: '09:15'
    //           }]
    //         },
    //         name:'慢日志',
    //         type:'line',
    //         smooth: true,
    //
    //         itemStyle:{
    //           color: 'rgb(169, 110, 246)'
    //         },
    //         lineStyle: {
    //           width: 3,
    //           color: 'rgb(169, 110, 246)'
    //         },
    //         areaStyle: {
    //           color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
    //             offset: 0,
    //             color: 'rgba(138, 76, 220, 0.8)'
    //           }, {
    //             offset: 0.5,
    //             color: 'rgba(102, 143, 255, 0.4)'
    //           },{
    //             offset: 1,
    //             color: 'rgba(102, 143, 255, 0)'
    //           }])
    //         },
    //         data:[]
    //       },
    //     ]
    //   })

    this.getData()

  },
  methods: {
    getData() {
      //表格数据
      // this.$http.post('/Manage/ErrorLog/Slow',{
      //   'User_Id':window.localStorage.getItem('userId'),
      //   'Project_Code':this.$route.params.id,
      // }).then((data) => {
      //   console.log(data);
      //   this.tableData1 = data.Data.data.allErrorDetial
      //   console.log(this.tableData);
      // })
      let formatDate = null
      if(this.$route.query.Warning_Time){
        formatDate = FormatDate(this.$route.query.Warning_Time*1000,'YYYY-MM-DD')
        // this.displayTime = FormatDate(this.$route.query.Warning_Time*1000,'YYYY-MM-DD HH:mm')
        // this.displayTime2 = FormatDate(this.$route.query.Warning_Time*1000,'YYYY-MM-DD HH:mm')
        // console.log(formatDate);
      }
      this.$http.post('/Manage/ErrorLog/Slow',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'startTime':formatDate ? formatDate : ''
      }).then((data) => {
        // console.log(data);
        if(data.Data.data.allSlowErrorDetial.length){
          this.noData = false
        }else{
          this.noData = true
        }
        // let times = data.Data.data.allSlowErrorTimeMount
        this.tableData1 = data.Data.data.allSlowErrorDetial
        this.howMany = +data.Data.data.howMany
        // let formatTime = [];
        // let number = []
        // times.forEach((item,i) => {
        //   formatTime.push(FormatDate(item.Insert_Time*1000,'HH:mm'))
        //   number.push(item.num)
        // })
        // this.mainChart.setOption({
        //   xAxis:{
        //     data:formatTime
        //   },
        //   series:[{
        //     markPoint:{
        //       data:[{
        //         name: '预警事件',
        //         coord: [this.displayTime, this.$route.query.LogMount]
        //       }],
        //       label:{
        //         formatter: `${this.displayTime2} \n ${this.$route.query.LogMount}次`
        //       },
        //     },
        //     markLine:{
        //       data: [{
        //         name: '预警事件',
        //         xAxis: this.displayTime
        //       }]
        //     },
        //     data:number
        //   }]
        //
        // })

      })
    },

    //表格分页
    handleCurrentChange(val) {
      //页码切换
      this.pageNum = val
      // console.log(val);
      this.$http.post('/Manage/ErrorLog/Slow',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'startTime':this.datePick ? this.datePick[0] : '',
        'endTime': this.datePick ? this.datePick[1] : '',
        'dayType':this.dayType,
        'pageSize':this.pageSize,
        'pageNum':val
      }).then((data) => {
        this.tableData1  = data.Data.data.allSlowErrorDetial;
        this.howMany = +data.Data.data.howMany
      })
    },
    handleSizeChange(val){
      // console.log(val);
      //表格一页数据多少切换
      this.pageSize = val
      this.$http.post('/Manage/ErrorLog/Slow',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'startTime':this.datePick ? this.datePick[0] : '',
        'endTime': this.datePick ? this.datePick[1] : '',
        'dayType':this.dayType,
        'pageSize':val,
        'pageNum':this.pageNum
      }).then((data) => {
        this.tableData1  = data.Data.data.allSlowErrorDetial
        this.howMany = +data.Data.data.howMany
      })
    },
    query(){
      this.currentPage = 1;
      if(this.datePick.length > 0){
        this.dayType = ''
      }else{
        this.datePick = ''
      }
      this.$http.post('/Manage/ErrorLog/Slow',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'startTime':this.datePick ? this.datePick[0] : '',
        'endTime': this.datePick ? this.datePick[1] : '',
        'dayType':this.dayType
      }).then((data) => {
        // console.log(data);
        if(data.Data.data.allSlowErrorDetial.length){
          this.noData = false
        }else{
          this.noData = true
        }
        this.tableData1  = data.Data.data.allSlowErrorDetial;
        this.howMany = +data.Data.data.howMany;
        // let times = data.Data.data.allSlowErrorTimeMount;
        // console.log(times);
        // let formatTime = [];
        // let number = [];
        // times.forEach((item,i) => {
        //   formatTime.push(FormatDate(item.Insert_Time*1000,'HH:mm'));
        //   number.push(item.num)
        // });
        // this.mainChart.setOption({
        //   xAxis:{
        //     data:formatTime
        //   },
        //   series:[{
        //     data:number
        //   }]
        //
        // })
      })
    },
    //重置
    resetForm() {
      this.currentPage = 1;
      this.dayType = '';
      this.datePick = [];
      this.$http.post('/Manage/ErrorLog/Slow',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
      }).then((data) => {
        // console.log(data);
        if(data.Data.data.allSlowErrorDetial.length){
          this.noData = false
        }else{
          this.noData = true
        }
        this.tableData1  = data.Data.data.allSlowErrorDetial;
        this.howMany = +data.Data.data.howMany;
        // let times = data.Data.data.allSlowErrorTimeMount;
        // let formatTime = [];
        // let number = []
        // times.forEach((item,i) => {
        //   formatTime.push(FormatDate(item.Insert_Time*1000,'HH:mm'));
        //   number.push(item.num)
        // });
        // this.mainChart.setOption({
        //   xAxis:{
        //     data:formatTime
        //   },
        //   series:[{
        //     data:number
        //   }]
        // })
      })
    },
    dateSelect(val){
      // console.log(val);
      // console.log(this.value4);
    }
  },
  filters: {
    transformDate: transformDate
  },
  destroyed() {
    this.noData = true
  }
}
