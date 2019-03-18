import {transformDate} from '../../../../../common/filters.js'
export default {
  name: "Application",
  data (){
    return{
      //页面上部数据
      topData:[],
      tableData:[],
      warningNum:'',
      ifWaring:false,
      showLeft: false,
      showRight: false,
      scrollArea: null,
      distance: null, // 可移动距离,
      scrollCount: 100,
      timer:null,
    }
  },
  mounted() {
    //初始化面包屑
    this.getData();
    this.timer = setInterval(() => {
      this.getData()
    },300000)
  },
  destroyed() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    moveLeft() {
      this.scrollArea.style.left = this.scrollArea.offsetLeft - this.scrollCount + 'px';
      if (Math.abs(this.scrollArea.offsetLeft) >= this.distance) {
        this.scrollArea.style.left = -this.distance + 'px';
        this.showLeft = false;
      }
      this.showRight = true;
    },
    moveRight() {
      this.scrollArea.style.left = this.scrollArea.offsetLeft + this.scrollCount + 'px';
      if (this.scrollArea.offsetLeft >= 0) {
        this.scrollArea.style.left = 0 + 'px';
        this.showRight = false;
      }
      this.showLeft = true;
    },
    //是否显示预警标志
    waringShow() {
      if(this.warningNum != ''){
        this.ifWaring = true
      }else{
        this.ifWaring = false
      }
    },
    getData() {
      //面包屑
      const headerObj = this.$store.state.header.headData.find(item => item.Project_Code === this.$route.params.id);
      this.$store.commit('changeHeadTitle', [
        {
          url: `/project-index/${this.$route.params.id}`,
          title: headerObj.Project_Name
        },
        {
          url:'',
          title: '实时监控'
        },
        {
          url: '',
          title: '应用服务'
        }
      ])
      //获取上部数据
      this.$http.post('/Manage/ApplicationService/Index',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id
      }).then((data) => {
        // console.log(data);
        this.topData = data.Data.data.serviceListMount
        this.warningNum = data.Data.data.warningMount
        this.waringShow()
        // console.log(this.warningNum);
        this.$nextTick(() => {
          this.scrollArea = this.$refs.scrollArea;
          // 外层容器宽度
          const scrollWrapWidth = this.$refs.scrollWrap.offsetWidth;
          // 移动区域容器宽度
          const scrollAreaWidth = this.scrollArea.offsetWidth;
          this.distance = scrollAreaWidth - scrollWrapWidth;
          if(this.distance > 0) {
            this.showLeft = true;
          }
        });
      })
      //表格数据
      this.$http.post('/Manage/ApplicationService/WarningDetails',{
        'User_Id':window.localStorage.getItem('userId'),
        'Project_Code':this.$route.params.id
      }).then((data) => {
        // console.log(data);
        this.tableData = data.Data.data
      })
    },
    changeChecked(item) {
      this.$set(item, 'checked', !item.checked)
    }

  },
  watch: {
    $route(newVal) {
      this.getData();
    }
  },
  filters: {
    transformDate:transformDate
  }
}
