import {formatTime,deviceType,dateFilter,isOnline} from '../../../../../common/filters.js'


export default {
  name: "SmartDevice",
  data () {
    return  {
      waringNum:null,
      ifWarning:false,
      //通行设备
      lockVillageData:[],
      currentPageLock:1,
      lockTableData:[],
      lockHowMany:null,
      lockCountPage:1,
      lockPageSize:10,
      lockPageNum:1,
      //获取查询参数
      lockVillage:'',
      lockType:'',
      lockName:'',
      lockMAC:'',


      //监控设备
      cameraVillageData:[],
      currentPageCamera:1,
      cameraTableData:[],
      cameraHowMany:null,
      cameraPageSize:10,
      cameraPageNum:1,
      IPAddress:'',
      //获取查询参数
      cameraType:'',
      cameraVillage:'',
      cameraName:'',
      cameraIP:'',


      //烟感设备
      smokeVillageData:[],
      currentPageSmoke:1,
      smokeHowMany:null,
      smokePageSize:10,
      smokePageNum:1,
      //获取查询参数
      smokeType:'',
      smokeVillage:'',
      smokeName:'',
      smokeMAC:'',
      //设备状态
      typeData:[
        {isOnline:1,name:'在线'},
        {isOnline:0,name:'离线'}
      ],
      deviceTotal:'',
      deviceTotalPercent:'',
      lock:'',
      camera:'',
      smoke:'',
      totalPercent:'',
      lockPercent:'',
      cameraPercent:'',
      smokePercent:'',
      smokeTableData:[],
      activeName:'first',
      tableData:'',
      pageTotalLock:null,
      pageTotalSmoke:null,
      pageSize:[],
      deviceDetail:false,
      deviceName:'',
      installLocation:'',
      MACAddress:'',
      deviceType:'',
      status:'',
      installTime:''
    }
  },
  methods:{
    //查询按钮
    //通行设备
    lockQuery() {
      this.$http.post('/Manage/Device/DeviceDetails',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'DeviceType':'lock',
        'Village_Id':this.lockVillage,
        'IsOnline':this.lockType,
        'Name':this.lockName,
        'MacAddress':this.lockMAC
      }).then((data) => {
        console.log(data);
        this.lockTableData = data.Data.data
        this.lockHowMany = data.Data.howMany
      })
    },
    lockReset() {
      this.lockVillage = ''
      this.lockName = ''
      this.lockMAC = ''
      this.lockType = ''
      this.$http.post('/Manage/Device/DeviceDetails',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'DeviceType':'lock'
      }).then((data) => {
        console.log(data);
        this.lockTableData = data.Data.data
        this.lockHowMany = data.Data.howMany
      })
    },
    //监控设备
    cameraQuery () {
      this.$http.post('/Manage/Device/DeviceDetails',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'DeviceType':'camera',
        'Village_Id':this.cameraVillage,
        'IsOnline':this.cameraType,
        'Name':this.cameraName
      }).then((data) => {
        console.log(data);
        this.cameraTableData = data.Data.data
        this.cameraHowMany = data.Data.howMany
      })
    },
    cameraReset() {
      this.cameraVillage = ''
      this.cameraType = ''
      this.cameraName = ''
      this.$http.post('/Manage/Device/DeviceDetails',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'DeviceType':'camera'
      }).then((data) => {
        console.log(data);
        this.cameraTableData = data.Data.data
        this.cameraHowMany = data.Data.howMany
      })
    },
    //烟感设备
    smokeQuery() {
      this.$http.post('/Manage/Device/DeviceDetails',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'DeviceType':'smoke',
        'Village_Id':this.smokeVillage,
        'IsOnline':this.smokeType,
        'Name':this.smokeName
      }).then((data) => {
        console.log(data);
        this.smokeTableData = data.Data.data
        this.smokeHowMany = data.Data.howMany
      })
    },
    smokeReset() {
      this.smokeVillage = ''
      this.smokeType = ''
      this.smokeName = ''
      this.$http.post('/Manage/Device/DeviceDetails',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'DeviceType':'smoke'
      }).then((data) => {
        console.log(data);
        this.smokeTableData = data.Data.data
        this.smokeHowMany = data.Data.howMany
      })
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },

    //通行设备
    handleSizeChangeLock(val){
      //一页多少条数据
      console.log(val);
      this.lockPageSize = val
      this.$http.post('/Manage/Device/DeviceDetails',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'DeviceType':'lock',
        'pageSize': val,
        'pageNum': this.lockPageNum
      }).then((data) => {
        console.log(data);
        this.lockTableData = data.Data.data
      })
    },
    handleCurrentChangeLock(val){
      //页码切换
      console.log(val);
      this.lockPageNum = val
      this.$http.post('/Manage/Device/DeviceDetails',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'DeviceType':'lock',
        'pageNum':val,
        'pageSize':this.lockPageSize
      }).then((data) => {
        console.log(data);
        this.lockTableData = data.Data.data
      })
    },

    //监控设备
    handleSizeChangeCamera(val){
      console.log(val);
      this.cameraPageSize = val
      this.$http.post('/Manage/Device/DeviceDetails',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'DeviceType':'camera',
        'pageNum':this.cameraPageNum,
        'pageSize':val,
      }).then((data) => {
        console.log(data);
        this.cameraTableData = data.Data.data
        this.cameraHowMany = data.Data.howMany
      })
    },
    handleCurrentChangeCamera(val){
      console.log(val);
      this.cameraPageNum = val
      this.$http.post('/Manage/Device/DeviceDetails',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'DeviceType':'camera',
        'pageNum':val,
        'pageSize': this.cameraPageSize
      }).then((data) => {
        console.log(data);
        this.cameraTableData = data.Data.data
        this.cameraHowMany = data.Data.howMany

      })
    },




    //烟感设备
    handleSizeChangeSmoke(val){
      console.log(val);
      this.smokePageSize = val
      this.$http.post('/Manage/Device/DeviceDetails',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'DeviceType':'smoke',
        'pageNum':this.smokePageNum,
        'pageSize':val
      }).then((data) => {
        console.log(data);
        this.smokeTableData = data.Data.data
        this.smokeHowMany = data.Data.howMany
      })
    },
    handleCurrentChangeSmoke(val){
      console.log(val);
      this.smokePageNum = val
      this.$http.post('/Manage/Device/DeviceDetails',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id,
        'DeviceType':'smoke',
        'pageNum':val,
        'pageSize':this.smokePageSize
      }).then((data) => {
        console.log(data);
        this.smokeTableData = data.Data.data
        this.smokeHowMany = data.Data.howMany
      })
    },
    //点击弹出弹框
    checkDetail(val) {
      console.log(val);
      this.deviceDetail = true

      this.deviceName = val.Name
      this.MACAddress = val.MacAddress
      this.deviceType = val.Camera_Type
      this.status = val.IsOnline
      this.installTime = val.Insert_Time


    },
    toWarningEvent() {
      this.$router.push(`/project-index/${this.$route.params.id}/warningevent/`)
    }

  },
  filters: {
    formatTime:formatTime,
    dateFilter:dateFilter,
    isOnline:isOnline,
    deviceType:deviceType
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
        url: '',
        title: '智能设备'
      }
    ])

    let _this = this;
    // this.$http.post('/Manage/Device/DeviceDetails',{
    //   'User_Id':window.localStorage.getItem('userId'),
    //   'Project_Code':'pr5b7135fb814c5ea32d1815a1385001',
    // }).then((data) => {
    //   console.log(data);
    //   this.tableData = data.Data.data
    // })
    this.$http.post('/Manage/Device/index',{
      'User_Id':window.localStorage.getItem('userId'),
      'Project_Code':this.$route.params.id
    }).then((data) => {
      console.log(data);
      let device = 0
      device = Number(data.Data.data.camera.cameraNum) + Number(data.Data.data.lock.lockNum) + Number(data.Data.data.smoke.smokeNum)
      this.deviceTotal = device
      this.lock = Number(data.Data.data.lock.lockNum)
      this.camera = Number(data.Data.data.camera.cameraNum)
      this.smoke = Number(data.Data.data.smoke.smokeNum)
      let lockOnline = Number(data.Data.data.lock.lockOnlineNum)
      let cameraOnline = Number(data.Data.data.camera.cameraOnlineNum)
      let smokeOnline = Number(data.Data.data.smoke.smokeOnlineNum)
      this.deviceTotalPercent = ((lockOnline + cameraOnline + smokeOnline) / this.deviceTotal * 100).toFixed(2)
      this.lockPercent = Number(lockOnline / this.lock * 100).toFixed(2)
      this.cameraPercent = Number(cameraOnline / this.camera * 100).toFixed(2)
      this.smokePercent = Number(smokeOnline / this.smoke *100).toFixed(2)
      this.waringNum = data.Data.data.waringNum
      if(this.warningNum > 0){
        this.ifWarning = true
      }else{
        this.ifWarning = false
      }
    })

    //通行设备
    this.$http.post('/Manage/Device/DeviceDetails',{
      'User_Id':window.localStorage.getItem('userId'),
      'Project_Code':this.$route.params.id,
      'DeviceType':'lock',
    }).then((data) => {
      // console.log(data);
      this.lockTableData = data.Data.data
      this.lockHowMany = data.Data.howMany
      console.log(this.pageTotalLock);
    })
    //监控设备
    this.$http.post('/Manage/Device/DeviceDetails',{
      'User_Id':window.localStorage.getItem('userId'),
      'Project_Code':this.$route.params.id,
      'DeviceType':'camera'
    }).then((data) =>{
      console.log(data);
      this.cameraTableData = data.Data.data
      this.cameraHowMany = data.Data.howMany
      this.cameraVillageData = data.Data.village_Date
    })
    //烟感设备
    this.$http.post('/Manage/Device/DeviceDetails',{
      'User_Id':window.localStorage.getItem('userId'),
      'Project_Code':this.$route.params.id,
      'DeviceType':'smoke'
    }).then((data) =>{
      console.log(data);
      this.smokeTableData = data.Data.data
      this.smokeHowMany = data.Data.howMany
      this.smokeVillageData = data.Data.village_Date
    })

  }
}
