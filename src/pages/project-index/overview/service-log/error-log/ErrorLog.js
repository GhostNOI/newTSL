import echarts from "echarts";
import {FormatDate} from '../../../../../common/utils.js'
import {transformDate} from "../../../../../common/filters";

export default {
  name: "ErrorLog",
  data () {
    return{
      tableData1:[],
      mainChart:'',
      dayType:1,
      datePick:[],
      howMany:null,
      currentPage:1,
      pageSize:10,
      pageNum:'',
      displayTime:'',
      displayTime2:'',
      noData:false,
    }
  },
  methods:{
    handleCurrentChange(val) {
      //页码切换
      this.pageNum = val
      this.$http.post('/Manage/ErrorLog/Index',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'startTime':this.datePick ? this.datePick[0] : '',
        'endTime': this.datePick ? this.datePick[1] : '',
        'dayType':this.dayType,
        'pageNum':val,
        'pageSize': this.pageSize
      }).then((data) => {
        this.tableData1 = data.Data.data.allErrorDetial
        this.howMany = data.Data.data.howMany
      })
    },
    handleSizeChange(val){
      //表格一页数据多少切换
      this.pageSize = val
      this.$http.post('/Manage/ErrorLog/Index',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'startTime':this.datePick ? this.datePick[0] : '',
        'endTime': this.datePick ? this.datePick[1] : '',
        'dayType':this.dayType,
        'pageNum': this.pageNum,
        'pageSize': val
      }).then((data) => {
        this.tableData1 = data.Data.data.allErrorDetial
        this.howMany = data.Data.data.howMany
      })
    },
    //查询
    query(){
      this.currentPage = 1
      this.noData = true
      this.$http.post('/Manage/ErrorLog/Index',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'startTime':this.datePick ? this.datePick[0] : '',
        'endTime': this.datePick ? this.datePick[1] : '',
        'dayType':this.dayType
      }).then((data) => {
        // console.log(data);
        this.tableData1 = data.Data.data.allErrorDetial
        this.howMany = data.Data.data.howMany
        this.noData = true
        //echarts图表数据
        let time = [];
        time = data.Data.data.allErrorTimeMount;
        // console.log(time);
        let formatTime = [];
        let number = []
        time.forEach((item,i)=>{
          formatTime.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'))
          number.push(item.num)
        })
        // console.log(formatTime,number);
        this.mainChart.setOption({
          xAxis:{
            data:formatTime
          },
          series:[{
            data:number
          }]
        })
      })
    },
    //重置
    resetForm() {
      this.currentPage = 1
      this.datePick = []
      this.dayType = ''
      this.$http.post('/Manage/ErrorLog/Index',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
      }).then((data) => {
        // console.log(data);
        this.tableData1 = data.Data.data.allErrorDetial
        this.howMany = data.Data.data.howMany
        if(data.Data.data.allErrorDetial.length){
          this.noData = true
        }else{
          this.noData = false
        }
        //echarts图表数据
        let time = [];
        time = data.Data.data.allErrorTimeMount;
        // console.log(time);
        let formatTime = [];
        let number = []
        time.forEach((item,i)=>{
          formatTime.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'))
          number.push(item.num)
        })
        // console.log(formatTime,number);
        this.mainChart.setOption({
          xAxis:{
            data:formatTime
          },
          series:[{
            data:number
          }]
        })
      })
    },
    changeTime() {
      this.dayType = ''
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
        url:'',
        title:'服务日志'
      },
      {
        url:'',
        title:'错误日志'
      }
    ])

    let _this = this;
      this.mainChart = echarts.init(document.getElementById('mainChart'),'dark')
      this.mainChart.setOption({
        backgroundColor: 'transparent',
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
        },
        series: [
          {
            markPoint: {
              symbol: 'circle',
              symbolSize: 15,
              itemStyle: {
                color: {
                  type: 'radial',
                  x: 0.5,
                  y: 0.5,
                  r: 0.5,
                  colorStops: [{
                    offset: 0, color: 'rgb(0, 0, 0)'
                  }, {
                    offset: 0.59, color: 'rgb(0, 0, 0)'
                  }, {
                    offset: 0.6, color: 'rgb(255, 0, 0)'
                  },{
                    offset: 1, color: 'rgba(255, 0, 0, 0)'
                  }],
                  globalCoord: false
                }
              },
              label:{
                position: 'top',
                borderColor: '#4681FF',
                fontSize: 15,
                borderWidth: 1,
                padding: 4,
                backgroundColor: '#000',
                align: 'left',
                // formatter: '2018-11-30 {c} \n 25次'
              },
              // data:[{
              //   name: '预警事件',
              //   value: '09:15',
              //   coord: ['09:15', '7']
              // }]
            },
            markLine: {
              symbol: 'none',
              lineStyle: {
                color: '#D6E4FF'
              },
              label:{
                show: false
              },
              data: [{
                name: '预警事件',
                xAxis: '09:15'
              }]
            },
            name:'错误日志',
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

    let formatDate = null
    if(this.$route.query.Warning_Time){
      formatDate = FormatDate(this.$route.query.Warning_Time*1000,'YYYY-MM-DD')
      this.displayTime = FormatDate(this.$route.query.Warning_Time*1000,'YYYY-MM-DD HH:mm')
      this.displayTime2 = FormatDate(this.$route.query.Warning_Time*1000,'YYYY-MM-DD HH:mm')
      // console.log(formatDate);
    }
      this.$http.post('/Manage/ErrorLog/Index',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'startTime':formatDate ? formatDate : ''
      }).then((data) => {
        // console.log(data);
        this.tableData1 = data.Data.data.allErrorDetial
        this.howMany = data.Data.data.howMany
        if(data.Data.data.allErrorDetial.length){
          this.noData = true
        }else{
          this.noData = false
        }
        let time = [];
        time = data.Data.data.allErrorTimeMount;
        // console.log(time);
        let formatTime = [];
        let number = []
        time.forEach((item,i)=>{
          formatTime.push(FormatDate(item.Insert_Time*1000,'YYYY-MM-DD HH:mm'))
          number.push(item.num)
        })
        // console.log(formatTime,number);
        this.mainChart.setOption({
          xAxis:{
            data:formatTime
          },
          series:[{
            // markPoint:{
            //   data:[{
            //     name: '预警事件',
            //     coord: [this.displayTime, this.$route.query.LogMount]
            //   }],
            //   label:{
            //     formatter: `${this.displayTime2} \n ${this.$route.query.LogMount}次`
            //   },
            // },
            // markLine:{
            //   data: [{
            //     name: '预警事件',
            //     xAxis: this.displayTime
            //   }]
            // },
            data:number
          }]
        })
      })


    // this.$http.post('/Manage/ErrorLog/Index',{
    //   'User_Id':window.localStorage.getItem('userId'),
    //   'Project_Code':this.$route.params.id,
    // }).then((data) => {
    //   console.log(data);
    //   // this.tableData = data.Data.data.allErrorDetial
    //   // this.tableData1 = data.Data.data.allErrorDetial
    //   console.log(this.tableData1);
    // })
  },
  filters: {
    transformDate: transformDate
  },
  destroyed() {
    this.noData = false
  }
}
