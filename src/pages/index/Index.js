
import AMap from 'AMap'
import echarts from 'echarts'
import {FormatDate, removeCookie} from "../../common/utils";
import {transformDate} from '../../common/filters.js'
import {PASSWORD} from "../../common/pattern";

export default {
  name: "Home",
  data () {
    return{
      //
      tit:'',
      date: '',
      clock:'',
      value: '',
      optionArea:[],
      areaVal:[],
      projectList1:[],
      //
      projectDistChart:'',
      projectClassChart:'',
      deviceNumChart:'',
      warningDetail:null,
      projectAllCount:'',
      projectList:'',
      provinceListResult:'',
      zoom:5,
      //地图角度
      pitch:0,
      iconNormnal2:'',
      iconAlert2:'',
      infoWindowProvince:'',
      country:false,
      _this : this,
      warningList:[],
      waringMount:[],
      waringNum:null,
      waringMountOld:[
        {
          Level_Id:1,
          Level_Name:'灾难',
          num:0
        },
        {
          Level_Id:2,
          Level_Name:'严重',
          num:0
        },
        {
          Level_Id:3,
          Level_Name:'警告',
          num:0
        },
        {
          Level_Id:4,
          Level_Name:'信息',
          num:0
        }
      ],
      projectManage:true,
      ifOps:true,
      deviceTotalNumber:null,
      indexTimer:null,
      changePass:false,
      oldPassword:'',
      newPassword:'',
      confirmPassword:'',
      ifTips:false,
      tips:'',
      phone:window.localStorage.getItem('phone')
    }
  },
  filters:{
    transformDate:transformDate
  },
  methods:{
    warningListShow() {

    },
    closeDialog () {
      this.tips = '';
      this.ifTips = '';
      this.oldPassword = '';
      this.newPassword = '';
      this.confirmPassword = ''
    },
    changePassowrd () {
      if(this.oldPassword === ''){
        this.ifTips = true;
        this.tips = '请输入旧密码'
      } else if(this.newPassword === ''){
        this.ifTips = true;
        this.tips = '请输入新密码'
      } else if(this.confirmPassword === ''){
        this.ifTips = true;
        this.tips = '请输入确认密码'
      } else if(this.newPassword.length < 8 || this.newPassword.length > 20) {
        this.ifTips = true;
        this.tips = '请输入8-20位的密码'
      } else if(this.confirmPassword != this.newPassword){
        this.ifTips = true;
        this.tips = '两次输入的新密码不一致'
      } else if(!PASSWORD.test(this.newPassword)){
        this.ifTips = true;
        this.tips = '密码需包含大小写字母和数字'
      } else {
        this.$http.post('/Manage/Login/UpdatePassword',{
          'User_Id':window.localStorage.getItem('userId'),
          'Phone':window.localStorage.getItem('phone'),
          'Password':this.newPassword,
          'OldPassword':this.oldPassword
        }).then((data) => {
          // console.log(data);
          if(+data.Data.code === 0){
            this.changePass = false
          }else if(+data.Data.code === 2){
            this.ifTips = true;
            this.tips = '旧密码不正确'
          } else{
            this.ifTips = true;
            this.tips = '修改密码失败'
          }
        })
      }
    },
    //切换项目
    changeProject() {
      let _this = this
      this.$http.post('/Manage/Project/ProjectLoLa',{
        User_Id: window.localStorage.getItem('userId'),
        Project_Code: this.value
      }).then((data) => {
        this.country = true
        // console.log(data);
        //更改首页echarts和右侧预警
        //预警数量
        let waringMountOld = [
          {
            Level_Id:1,
            Level_Name:'灾难',
            num:0
          },
          {
            Level_Id:2,
            Level_Name:'严重',
            num:0
          },
          {
            Level_Id:3,
            Level_Name:'警告',
            num:0
          },
          {
            Level_Id:4,
            Level_Name:'信息',
            num:0
          }
        ];
        data.Data.projectDetial[0].waringMount.forEach((newItem,newIndex) => {
          waringMountOld.forEach((item,i) => {
            if(+newItem.Level_Id === +item.Level_Id){
              waringMountOld[i].num = newItem.num.toLocaleString()
            }
          })
        });
        this.waringMount = waringMountOld;
        this.waringNum = data.Data.warningNum.toLocaleString();
        this.warningDetail = data.Data.indexWaringDetial;
        let projectList = data.Data.projectDetial;
        var map = new AMap.Map('map', {
          zoom:9,//级别
          mapStyle: 'amap://styles/ecbddbc275fcc6efbc8a1eecaf8fe2c9',
          center: [projectList[0].Longitude, projectList[0].Latitude],//中心点坐标
          viewMode:'3D',//使用3D视图
          pitch: 50
        });
        //创建提示框
        let infoWindowProvince = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
        //创建marker
        let markers = [];
        let warningNumber = 0;
        for(let i=0;i<projectList.length;i++){
          if(projectList[i].waringMount.length == 0){
            var marker2 = new AMap.Marker({
              position: new AMap.LngLat(projectList[i].Longitude, projectList[i].Latitude),
              icon: _this.iconNormnal2,
              offset: new AMap.Pixel(-34, -34),
              extData: {
                id: i + 1
              }
            });
            marker2.content = `
              <div style="height: 30px;color: #fff;">
                <span style="height: 30px;float:left;">${projectList[i].Project_Name}</span><span style="float: right;">运行正常</span>
              </div>
            `;
            marker2.on('mouseover', markerOverProvince);
            marker2.on('mouseout',markerOutProvince);
          }else{
            var marker2 = new AMap.Marker({
              position: new AMap.LngLat(projectList[i].Longitude, projectList[i].Latitude),
              icon: this.iconAlert2,
              offset: new AMap.Pixel(-34, -34),
              extData: {
                id: i + 1
              }
            })

            projectList[i].waringMount.forEach(item => {
              warningNumber += Number(item.num)
            })
            let levelName = ''
            let levelNum = ''
            let width = null
            if(projectList[i].waringMount.length == 1){
              width = 100
            }else if(projectList[i].waringMount.length ==2) {
              width = 50
            }else if(projectList[i].waringMount.length == 3) {
              width = 33.3
            }else{
              width = 25
            }
            projectList[i].waringMount.forEach(item => {
              levelName += `<span style="width:${width}%;float:left;text-align:center">${item.Level_Name}</span>`
              levelNum += `<span style="width:${width}%;float:left;text-align:center">${item.num}</span>`
            })
            marker2.content=`
            <div class="out">
              <div style="height: 30px;">
                </span>　<span class="fo-color" style="display:inline-block;margin-top:4px">${projectList[i].Project_Name}</span></span>
                
                <span  class="warningNumber" style="float:right;color:#fa541c;font-size:28px;">${warningNumber}</span>
                <span style="color:#FFF;font-weight:300;float:right;display:inline-block;margin-top:4px">预警事件数量</span>
              </div>
              <div>
              <div style="overflow: hidden;line-height:30px;width:250px;height:30px;text-align:center;color:#fff">
                ${levelName}
              </div>
              <div style="overflow:hidden;line-height:20px;width:250px;height:30px;text-align:center;color:#fff">
               ${levelNum}
              </div>
               
              </div>
          </div>
          `
            // marker2.on('mouseover', markerOverProvince);
            // marker2.on('mouseout',markerOutProvince);
          }
          infoWindowProvince.setContent(marker2.content);
          infoWindowProvince.open(map, marker2.getPosition());
          //点击省级地图中项目marker，跳转到项目首页
          marker2.on('click',() => {
            toProject(projectList[i])
          });
          markers.push(marker2);
        }
        var overlayGroups = new AMap.OverlayGroup(markers);
        map.add(overlayGroups);
        function markerOverProvince(e) {
          // console.log(e);
          infoWindowProvince.setContent(e.target.content);
          infoWindowProvince.open(map, e.target.getPosition());
        }
        function  markerOutProvince(e) {
          infoWindowProvince.close(map, e.target.getPosition());
        }
        // toProject = (e) => {
        //   console.log(e);
        //   this.$router.push({path:`/project-index/${e.Project_Code}`})
        // }
        function toProject(e) {
          // console.log(e);
          _this.$router.push({path:`/project-index/${e.Project_Code}`})
        }
      })
    },

    toCountry(){
      if(this.indexTimer){
        clearInterval(this.indexTimer)
      }
      this.indexTimer = setInterval(() => {
        this.$http.post('/Manage/User/index',{
          'User_Id':window.localStorage.getItem('userId'),
        }).then((data) => {
          // console.log(data);
          this.warningDetail = data.Data.data.indexWaringDetial
        })
      },300000);
      this.country = false
      let _this = this
      this.areaVal = []
      this.value = ''
      let map = new AMap.Map('map', {
        zoom:this.zoom,//级别
        mapStyle: 'amap://styles/ecbddbc275fcc6efbc8a1eecaf8fe2c9',
        center: [108, 38],//中心点坐标
        viewMode:'3D',//使用3D视图
        pitch:this.pitch
      });

      //定义正常标记
      let iconNormnal = new AMap.Icon({
        size: new AMap.Size(68, 68),
        image: 'http://47.96.70.222:8080/image/normalMark.png',
        imageSize: new AMap.Size(68, 68),
      });

      //定义异常标记
      let iconAlert = new AMap.Icon({
        size: new AMap.Size(68, 68),
        image: 'http://47.96.70.222:8080/image/alertMark.png',
        imageSize: new AMap.Size(68, 68),
      });

      // 定义正常的标记Marker
      this.iconNormnal2 = new AMap.Icon({
        size: new AMap.Size(28, 36),
        image: 'http://47.96.70.222:8080/image/normalPin.png',
        imageSize: new AMap.Size(28, 36),
      });

      // 定义异常的标记Marker
      this.iconAlert2 = new AMap.Icon({
        size: new AMap.Size(28, 36),
        image: 'http://47.96.70.222:8080/image/alertPin.png',
        imageSize: new AMap.Size(28, 36),
      });

//请求接口获得地图标记的数据
      this.$http.post('/Manage/User/index',{
        'User_Id':window.localStorage.getItem('userId')
      }).then((data) => {
        //项目列表
        // console.log(data);
        this.provinceListResult = data.Data.data.provinceListResult
        // console.log(this.provinceListResult);

        //创建提示框
        var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
        //创建Mark实例
        let lnglats = data.Data.data.provinceListResult
        // console.log(lnglats);
        var markers = [];
        for (let i = 0; i < lnglats.length; i++) {
          let lnglat = lnglats[i];
          if(lnglats[i].waringMount == 0){
            var marker = new AMap.Marker({
              position: new AMap.LngLat(lnglats[i].Longitude, lnglats[i].Latitude),
              icon: iconNormnal,
              offset: new AMap.Pixel(-34, -34),
              extData: {
                id: i + 1
              }
            });
            marker.content = `
            <div class="out">
              <div style="height: 50px;line-height:50px;overflow:hidden;">
                <span class="fo-color fo-sizeN areaName">${lnglats[i].Name}</span>
                <span style="float:right"><span class="fo-color fo-sizeN" >项目数</span>　<span class="fo-color fo-sizeB">${lnglats[i].projectList.length}</span></span>
              </div>
              <div style="margin-bottom:10px">
                <span style="color:#FFF">预警事件数量</span>
                <span>${lnglats[i].warningNum}</span>
              </div>
          </div>
          `;
            marker.on('mouseover', markerOver);
            marker.on('mouseout',markerOut);

          }else{
            var marker = new AMap.Marker({
              position: new AMap.LngLat(lnglats[i].Longitude, lnglats[i].Latitude),
              icon: iconAlert,
              offset: new AMap.Pixel(-34, -34),
              extData: {
                id: i + 1
              }
            });
            marker.content = `
              <div class="out">
              <div style="height: 50px;">
              <span class="fo-color fo-sizeN areaName">${lnglats[i].Name}</span>
              <span style="float:right"><span class="fo-color fo-sizeN" >项目数</span>　<span class="fo-color fo-sizeB">${lnglats[i].projectList.length}</span></span>
            </div>
            <div>
            <span style="color:#FFF;font-weight:300">预警事件数量</span>
              <span style="float:right;color:#E44d1a;font-size:20px">${lnglats[i].warningNum}</span>
              </div>
              </div>
                `;
            marker.on('mouseover', markerOver);
            marker.on('mouseout',markerOut)
          }
          marker.on('click',() => {
            toProvince(lnglats[i])
          });
          // marker.on('click',toProvince.bind(null,123))

          markers.push(marker);
        }
        //生成marker
        var overlayGroups = new AMap.OverlayGroup(markers);
        map.add(overlayGroups);
        //生成弹框
        function markerOver(e) {
          infoWindow.setContent(e.target.content);
          infoWindow.open(map, e.target.getPosition());
        }
        function markerOut(e) {
          infoWindow.close(map, e.target.getPosition());
        }


        //点击跳转省级地图
        function toProvince(a) {
          if(_this.indexTimer){
            clearInterval(_this.indexTimer)
          }
          _this.indexTimer = setInterval(() => {
            _this.$http.post('/Manage/User/index',{
              'User_Id':window.localStorage.getItem('userId'),
              'Province_Code':a.AreaCode
            }).then((data) => {
              // console.log(data);
              _this.warningDetail = data.Data.data.indexWaringDetial
            })
          },300000);
          _this.country = true
          // console.log(a);
          //echarts重新赋值
          _this.$http.post('/Manage/User/index',{
            'User_Id':window.localStorage.getItem('userId'),
            'Province_Code':a.AreaCode
          }).then((data) => {
            console.log(data);
            //项目总数
            _this.projectAllCount = data.Data.data.projectAllCount.toLocaleString();
            //城市top5
            let cityTop5 = [];
            cityTop5 = data.Data.data.projectTop5City;
            //city top5背景色
            let backgroundData = [];
            //项目分类
            let projectClass = [];
            projectClass = data.Data.data.projectClass;
            //设备总数
            let deviceTotal = [];
            _this.deviceTotalNumber = data.Data.data.deviceAllCount.total.toLocaleString();
            deviceTotal = data.Data.data.deviceAllCount;
            // console.log(deviceTotal);
            //预警详情
            _this.warningDetail = data.Data.data.indexWaringDetial;
            // console.log(this.warningDetail);
            //预警列表
            _this.warningList = data.Data.data.waringMount;
            //预警项
            let waringMountOld = [
              {
                Level_Id:1,
                Level_Name:'灾难',
                num:0
              },
              {
                Level_Id:2,
                Level_Name:'严重',
                num:0
              },
              {
                Level_Id:3,
                Level_Name:'警告',
                num:0
              },
              {
                Level_Id:4,
                Level_Name:'信息',
                num:0
              }
            ];
            data.Data.data.waringMount.forEach((newItem,newIndex) => {
              waringMountOld.forEach((item,i) => {
                if(+newItem.Level_Id === +item.Level_Id){
                  waringMountOld[i].num = newItem.num
                }
              })
            });
            _this.waringMount = waringMountOld;
            // this.waringNum = this.waringMount.length
            _this.waringNum = null;
            _this.waringMount.forEach((item,i) => {
              _this.waringNum += +item.num
            });
            _this.waringNum = _this.waringNum.toLocaleString();
            _this.warningListShow();
            //城市top5
            let displayCity = [];
            let displayNum = [];
            cityTop5.forEach((item,i) => {
              displayCity.unshift(item.Name);
              displayNum.unshift(item.num);
              backgroundData.push(cityTop5[0].num)
            });
            // console.log(displayNum);
            // console.log(displayCity);
            let colorCity =['#F6EB69','#46FFB9','#0BB9FF','#4681FF','#9A54F5'];

            let seriesData = [
              {
                name: 'background',
                type: 'bar',
                barWidth: 10,
                itemStyle: {
                  color: ['#1D223D'],
                },
                data: backgroundData
              },
            ];
            for(let i in displayNum){
              seriesData.push(
                {
                  name: displayCity[i],
                  type: 'bar',
                  barWidth: 10,
                  barGap:'-100%',
                  label: {
                    show: true,
                    position: 'right',
                    formatter: '{@[0]}'
                  },
                  itemStyle: {
                    color: colorCity[i],
                  },
                  data: [[displayNum[i],displayCity[i]]]
                }
              )
            }
            _this.projectDistChart.setOption({
              yAxis:{data:displayCity},
              series:seriesData
            });
            //项目分类
            let projectName = [];
            let projectNum = [];
            projectClass.forEach((item,i) => {
              projectName.push(item.PLatfrom_Type_Name + ' ' + 'V' + item.Version)
              projectNum.push(item.num)
            });
            _this.projectClassChart.setOption({
              xAxis:{data:projectName},
              series:[{data:projectNum}]
            });

            //设备数量
            //计算项目总数
            //displayDeviceNum替换subtext中的数据
            //legendData替换legend中的data
            let displayDeviceNum = null;
            let legendData = [];
            let displayDeviceSeries = [];
            let colorDeviceCount =['#46FFB9','#4681FF','#9A54F5'];
            //百分比
            let percent = [['32%','38%'],['48%','54%'],['64%','70%']];
            displayDeviceNum = deviceTotal.total;
            deviceTotal.list.forEach((item,i) => {
              legendData.unshift({name:item.type,icon:'circle'});
              displayDeviceSeries.push(
                {
                  type:'pie',
                  center: ['25%','60%'],
                  radius: percent[i],
                  avoidLabelOverlap: false,
                  label:{show:false},
                  labelLine:{show: false},
                  data:[
                    {
                      name:item.type,
                      value:item.pre,
                      num:item.num,
                      itemStyle:{color:colorDeviceCount[i]}
                    },
                    {
                      name:'',
                      value:1-item.pre,
                      num:'',
                      itemStyle:{color:'#1D223D'}
                    },
                  ]
                }
              )
            });
            _this.deviceNumChart.setOption({
              tooltip: {
                trigger: 'item',
                formatter: function(name){
                  if(name.data.name != ''){
                    return name.data.name + '：' + name.data.num
                  }else {
                    return null
                  }
                }
              },
              title:{subtext:displayDeviceNum},
              legend:{
                data:legendData,
                formatter: function(name){
                  for(let i in deviceTotal.list){
                    if(name == deviceTotal.list[i].type) var num = deviceTotal.list[i].num
                  }
                  return name + '      ' +num;
                }
              },
              series:displayDeviceSeries
            })
          });
          _this.$http.post('/Manage/User/ProviceProjectList',{
            'User_Id':window.localStorage.getItem('userId'),
            'Province_Code':a.AreaCode
          }).then((data) => {
            // console.log(data);
            let projectList = data.Data.data.projectList;
            var map = new AMap.Map('map', {
              zoom:9,//级别
              mapStyle: 'amap://styles/ecbddbc275fcc6efbc8a1eecaf8fe2c9',
              center: [a.Longitude, a.Latitude],//中心点坐标
              viewMode:'3D',//使用3D视图
              pitch: 50
            });
            //创建提示框
            let infoWindowProvince = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
            //创建marker
            let markers = [];
            let warningNumber = 0;
            for(let i=0;i<projectList.length;i++){
              // console.log(projectList[i].waringMount.length);
              if(projectList[i].waringMount.length == 0){
                var marker2 = new AMap.Marker({
                  position: new AMap.LngLat(projectList[i].Longitude, projectList[i].Latitude),
                  icon: _this.iconNormnal2,
                  offset: new AMap.Pixel(-34, -34),
                  extData: {
                    id: i + 1
                  }
                });
                marker2.content = `
              <div style="height: 30px;color: #fff;">
                <span style="height: 30px;float:left;">${projectList[i].Project_Name}</span><span style="float: right;">运行正常</span>
              </div>
            `;
                marker2.on('mouseover', markerOverProvince);
                marker2.on('mouseout',markerOutProvince);
              }else{
                var marker2 = new AMap.Marker({
                  position: new AMap.LngLat(projectList[i].Longitude, projectList[i].Latitude),
                  icon: _this.iconAlert2,
                  offset: new AMap.Pixel(-34, -34),
                  extData: {
                    id: i + 1
                  }
                })

                let levelName = '';
                let levelNum = '';
                let width = null;
                if(projectList[i].waringMount.length == 1){
                  width = 100
                }else if(projectList[i].waringMount.length ==2) {
                  width = 50
                }else if(projectList[i].waringMount.length == 3) {
                  width = 33.3
                }else{
                  width = 25
                }
                projectList[i].waringMount.forEach(item => {
                  levelName += `<span style="width:${width}%;float:left;text-align:center">${item.Level_Name}</span>`
                  levelNum += `<span style="width:${width}%;float:left;text-align:center">${item.num}</span>`
                });
                projectList[i].waringMount.forEach(item => {
                  warningNumber += Number(item.num)
                });
                marker2.content =`
            <div class="out">
              <div style="height: 30px;">
                </span>　<span class="fo-color" style="display:inline-block;margin-top:4px">${projectList[i].Project_Name}</span></span>
                
                <span  class="warningNumber" style="float:right;color:#fa541c;font-size:28px;">${warningNumber}</span>
                <span style="color:#FFF;font-weight:300;float:right;display:inline-block;margin-top:4px">预警事件数量</span>
              </div>
              <div>
              <div style="overflow: hidden;line-height:30px;width:250px;height:30px;text-align:center;color:#fff">
                ${levelName}
              </div>
              <div style="overflow:hidden;line-height:20px;width:250px;height:30px;text-align:center;color:#fff">
               ${levelNum}
              </div>
               
              </div>
          </div>
          `;
                marker2.on('mouseover', markerOverProvince);
                marker2.on('mouseout',markerOutProvince);
              }
              //点击省级地图中项目marker，跳转到项目首页
              marker2.on('click',() => {
                toProject(projectList[i])
              });
              markers.push(marker2);
            }
            var overlayGroups = new AMap.OverlayGroup(markers);
            map.add(overlayGroups);

            function markerOverProvince(e) {
              infoWindowProvince.setContent(e.target.content);
              infoWindowProvince.open(map, e.target.getPosition());
            }
            function  markerOutProvince(e) {
              infoWindowProvince.close(map, e.target.getPosition());
            }
            function toProject (e) {
              _this.$router.push({path:`/project-index/${e.Project_Code}`})
            }
          })

        }

        //echarts重新赋值
        this.projectAllCount = data.Data.data.projectAllCount
        //城市top5
        let cityTop5 = []
        cityTop5 = data.Data.data.projectTop5City
        //city top5背景色
        let backgroundData = []
        //项目分类
        let projectClass = []
        projectClass = data.Data.data.projectClass
        //设备总数
        this.deviceTotalNumber = data.Data.data.deviceAllCount.total.toLocaleString()
        let deviceTotal = []
        deviceTotal = data.Data.data.deviceAllCount
        // console.log(deviceTotal);
        //预警详情
        this.warningDetail = data.Data.data.indexWaringDetial
        // console.log(this.warningDetail);
        //预警列表
        this.warningList = data.Data.data.waringMount
        //预警项
        let waringMountOld = [
          {
            Level_Id:1,
            Level_Name:'灾难',
            num:0
          },
          {
            Level_Id:2,
            Level_Name:'严重',
            num:0
          },
          {
            Level_Id:3,
            Level_Name:'警告',
            num:0
          },
          {
            Level_Id:4,
            Level_Name:'信息',
            num:0
          }
        ];
        data.Data.data.waringMount.forEach((newItem,newIndex) => {
          waringMountOld.forEach((item,i) => {
            if(+newItem.Level_Id === +item.Level_Id){
              waringMountOld[i].num = newItem.num
            }
          })
        });
        this.waringMount = waringMountOld;
        // this.waringNum = this.waringMount.length
        this.waringNum = null;
        this.waringMount.forEach((item,i) => {
          this.waringNum += +item.num
        });
        this.waringNum = this.waringNum.toLocaleString();
        this.warningListShow();
        //城市top5
        let displayCity = [];
        let displayNum = [];
        cityTop5.forEach((item,i) => {
          displayCity.unshift(item.Province_Name);
          displayNum.unshift(item.num);
          backgroundData.push(cityTop5[0].num)
        });
        // console.log(displayNum);
        // console.log(displayCity);
        let colorCity =['#F6EB69','#46FFB9','#0BB9FF','#4681FF','#9A54F5'];

        let seriesData = [
          {
            name: 'background',
            type: 'bar',
            barWidth: 10,
            itemStyle: {
              color: ['#1D223D'],
            },
            data: backgroundData
          },
        ];
        for(let i in displayNum){
          seriesData.push(
            {
              name: displayCity[i],
              type: 'bar',
              barWidth: 10,
              barGap:'-100%',
              label: {
                show: true,
                position: 'right',
                formatter: '{@[0]}'
              },
              itemStyle: {
                color: colorCity[i],
              },
              data: [[displayNum[i],displayCity[i]]]
            }
          )
        }
        // console.log(seriesData);
        this.projectDistChart.setOption({
          yAxis:{data:displayCity},
          series:seriesData
        });
        //项目分类
        let projectName = [];
        let projectNum = [];
        projectClass.forEach((item,i) => {
          projectName.push(item.PLatfrom_Type_Name + ' ' + 'V' + item.Version);
          projectNum.push(item.num)
        });
        this.projectClassChart.setOption({
          xAxis:{data:projectName},
          series:[{data:projectNum}]
        });

        //设备数量
        //计算项目总数
        //displayDeviceNum替换subtext中的数据
        //legendData替换legend中的data
        let displayDeviceNum = null;
        let legendData = [];
        let displayDeviceSeries = [];
        let colorDeviceCount =['#46FFB9','#4681FF','#9A54F5'];
        //百分比
        let percent = [['32%','38%'],['48%','54%'],['64%','70%']];
        displayDeviceNum = deviceTotal.total;
        deviceTotal.list.forEach((item,i) => {
          legendData.unshift({name:item.type,icon:'circle'});
          displayDeviceSeries.push(
            {
              type:'pie',
              center: ['25%','60%'],
              radius: percent[i],
              avoidLabelOverlap: false,
              label:{show:false},
              labelLine:{show: false},
              data:[
                {
                  name:item.type,
                  value:item.pre,
                  num:item.num,
                  itemStyle:{color:colorDeviceCount[i]}
                },
                {
                  name:'',
                  value:1-item.pre,
                  num:'',
                  itemStyle:{color:'#1D223D'}
                },
              ]
            }
          )
        });
        // console.log(displayDeviceSeries);
        this.deviceNumChart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: function(name){
              if(name.data.name != ''){
                return name.data.name + '：' + name.data.num
              }else {
                return null
              }
            }
          },
          title:{subtext:displayDeviceNum},
          legend:{
            data:legendData,
            formatter: function(name){
              for(let i in deviceTotal.list){
                if(name == deviceTotal.list[i].type) var num = deviceTotal.list[i].num
              }
              return name + '      ' +num;
            }
          },
          series:displayDeviceSeries
        })

      })
    },


    //切换项目
    areaChange(val){
      // console.log(val);
      if(!val && this.areaVal.length>0){
        this.$http.post('/Manage/User/index',{
          User_Id :window.localStorage.getItem('userId'),
          Province_Code: this.areaVal[0],
          City_Code: this.areaVal[1] ? this.areaVal[1] : null,
          Area_Code: this.areaVal[2] ? this.areaVal[2] : null,
        }).then((data) => {
          // console.log(data);
          this.projectList1 = data.Data.data.projectList;
        })
      }
      this.value = ''
    },
    logout(){
      this.$http.post('/Manage/Login/LoginOut',{
        'User_Id':window.localStorage.getItem('userId')
      }).then((data) => {
        // console.log(data);
        if(+data.Data.code === 0){
          removeCookie('tsl_token');
          window.localStorage.removeItem('userId');
          window.localStorage.removeItem('insertTime');
          this.$router.push('/login')
        }else {
          window.alert('系统繁忙，请稍后再试')
        }
      })
    }
  },
  mounted () {
    //轮询接口
    this.indexTimer = setInterval(() => {
      this.$http.post('/Manage/User/index',{
        'User_Id':window.localStorage.getItem('userId')
      }).then((data) => {
        this.warningDetail = data.Data.data.indexWaringDetial
      })
    },300000);

    let _this = this;
    //原头部组件
    setInterval(function () {
      _this.date = FormatDate((new Date()).getTime(),'HH : mm : ss')
    },1000);

    //权限判断
    if(+window.localStorage.getItem('roleId') === 253){
      this.projectManage = false
    }else if(+window.localStorage.getItem('roleId') === 254){
      this.projectManage = false;
      this.ifOps = false
    }else{
      this.projectManage = true;
      this.ifOps = true
    }

    this.$http.post('/Manage/User/ThreeLevelLinkage',{
      User_Id:window.localStorage.getItem('userId')
    }).then( (data) => {
      //console.log(data.Data);
      this.optionArea = data.Data.threeLevelLinkage
      //console.log(this.optionArea);
    })
//map
    //生成地图
    let map = new AMap.Map('map', {
      zoom:this.zoom,//级别
      mapStyle: 'amap://styles/ecbddbc275fcc6efbc8a1eecaf8fe2c9',
      center: [108, 38],//中心点坐标
      viewMode:'3D',//使用3D视图
      pitch:this.pitch
    });

    //定义正常标记
    let iconNormnal = new AMap.Icon({
      size: new AMap.Size(68, 68),
      image: 'http://47.96.70.222:8080/image/normalMark.png',
      imageSize: new AMap.Size(68, 68),
    });

    //定义异常标记
    let iconAlert = new AMap.Icon({
      size: new AMap.Size(68, 68),
      image: 'http://47.96.70.222:8080/image/alertMark.png',
      imageSize: new AMap.Size(68, 68),
    });

    // 定义正常的标记Marker
    this.iconNormnal2 = new AMap.Icon({
      size: new AMap.Size(28, 36),
      image: 'http://47.96.70.222:8080/image/normalPin.png',
      imageSize: new AMap.Size(28, 36),
    });

    // 定义异常的标记Marker
    this.iconAlert2 = new AMap.Icon({
      size: new AMap.Size(28, 36),
      image: 'http://47.96.70.222:8080/image/alertPin.png',
      imageSize: new AMap.Size(28, 36),
    });

//请求接口获得地图标记的数据
//     console.log(window.localStorage.getItem('userId'));
    this.$http.post('/Manage/User/index',{
      'User_Id':window.localStorage.getItem('userId')
    }).then((data) => {
      //项目列表
      // console.log(data);
      this.provinceListResult = data.Data.data.provinceListResult;
      // console.log(this.provinceListResult);

      //创建提示框
      var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
      //创建Mark实例
      let lnglats = data.Data.data.provinceListResult;
      // console.log(lnglats);
      var markers = [];
      for (let i = 0; i < lnglats.length; i++) {
        let lnglat = lnglats[i];
        if(lnglats[i].waringMount == 0){
          var marker = new AMap.Marker({
            position: new AMap.LngLat(lnglats[i].Longitude, lnglats[i].Latitude),
            icon: iconNormnal,
            offset: new AMap.Pixel(-34, -34),
            extData: {
              id: i + 1
            }
          });
          marker.content = `<div class="out"><h5>${lnglats[i].Name}</h5><h3><span style="font-size: 14px">项目数</span>　${lnglats[i].projectList.length}</h3></div>`;
          marker.on('mouseover', markerOver);
          marker.on('mouseout',markerOut);

        }else{
          var marker = new AMap.Marker({
            position: new AMap.LngLat(lnglats[i].Longitude, lnglats[i].Latitude),
            icon: iconAlert,
            offset: new AMap.Pixel(-34, -34),
            extData: {
              id: i + 1
            }
          });
          marker.content = `
            <div class="out">
              <div style="height: 50px;">
                <span class="fo-color fo-sizeN areaName">${lnglats[i].Name}</span>
                <span style="float:right"><span class="fo-color fo-sizeN" >项目数</span>　<span class="fo-color fo-sizeB">${lnglats[i].projectList.length}</span></span>
              </div>
              <div style="margin-bottom:10px">
                <span style="color:#FFF;font-weight:300">预警事件数量</span>
                <span style="float:right;color:#E44d1a;font-size:20px">${lnglats[i].warningNum}</span>
              </div>
          </div>
          `;
          marker.on('mouseover', markerOver);
          marker.on('mouseout',markerOut)
        }
        marker.on('click',() => {
          toProvince(lnglats[i])
        });
        // marker.on('click',toProvince.bind(null,123))

        markers.push(marker);
      }
      //生成marker
      var overlayGroups = new AMap.OverlayGroup(markers);
      map.add(overlayGroups);
      //生成弹框
      function markerOver(e) {
        infoWindow.setContent(e.target.content);
        infoWindow.open(map, e.target.getPosition());
      }
      function markerOut(e) {
        infoWindow.close(map, e.target.getPosition());
      }


      //点击跳转省级地图
      function toProvince(a) {
        if(_this.indexTimer){
          clearInterval(_this.indexTimer)
        }
        _this.indexTimer = setInterval(() => {
          _this.$http.post('/Manage/User/index',{
            'User_Id':window.localStorage.getItem('userId'),
            'Province_Code':a.AreaCode
          }).then((data) => {
            // console.log(data);
            _this.warningDetail = data.Data.data.indexWaringDetial
          })
        },300000);
        _this.country = true
        // console.log(a);
        _this.$http.post('/Manage/User/ProviceProjectList',{
          'User_Id':window.localStorage.getItem('userId'),
          'Province_Code':a.AreaCode
        }).then((data) => {
          // console.log(data);
          let projectList = data.Data.data.projectList
          var map = new AMap.Map('map', {
            zoom:9,//级别
            mapStyle: 'amap://styles/ecbddbc275fcc6efbc8a1eecaf8fe2c9',
            center: [a.Longitude, a.Latitude],//中心点坐标
            viewMode:'3D',//使用3D视图
            pitch: 50
          });
          //创建提示框
          let infoWindowProvince = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
          //创建marker
          let markers = []
          for(let i=0;i<projectList.length;i++){
            // console.log(projectList[i].waringMount.length);
            if(projectList[i].waringMount.length == 0){
              var marker2 = new AMap.Marker({
                position: new AMap.LngLat(projectList[i].Longitude, projectList[i].Latitude),
                icon: _this.iconNormnal2,
                offset: new AMap.Pixel(-34, -34),
                extData: {
                  id: i + 1
                }
              })
              marker2.content = `
              <div style="height: 30px;color: #fff;">
                <span style="height: 30px;float:left;">${projectList[i].Project_Name}</span><span style="float: right;">运行正常</span>
              </div>
            `;
              marker2.on('mouseover', markerOverProvince);
              marker2.on('mouseout',markerOutProvince);
            }else{
              var marker2 = new AMap.Marker({
                position: new AMap.LngLat(projectList[i].Longitude, projectList[i].Latitude),
                icon: _this.iconAlert2,
                offset: new AMap.Pixel(-34, -34),
                extData: {
                  id: i + 1
                }
              })


              let levelName = ''
              let levelNum = ''
              let width = null
              if(projectList[i].waringMount.length == 1){
                width = 100
              }else if(projectList[i].waringMount.length ==2) {
                width = 50
              }else if(projectList[i].waringMount.length == 3) {
                width = 33.3
              }else{
                width = 25
              }
              projectList[i].waringMount.forEach(item => {
                levelName += `<span style="width:${width}%;float:left;text-align:center">${item.Level_Name}</span>`
                levelNum += `<span style="width:${width}%;float:left;text-align:center">${item.num}</span>`
              })
              marker2.content=`
            <div class="out">
              <div style="height: 30px;">
                </span>　<span class="fo-color" style="display:inline-block;margin-top:4px">${projectList[i].Project_Name}</span></span>
                
                <span class="warningNumber" style="float:right;color:#fa541c;font-size:28px;">${projectList[i].warningNum}</span>
                <span style="color:#FFF;font-weight:300;float:right;display:inline-block;margin-top:4px">预警事件数量</span>
              </div>
              <div>
              <div style="overflow: hidden;line-height:30px;width:250px;height:30px;text-align:center;color:#fff">
                ${levelName}
              </div>
              <div style="overflow:hidden;line-height:20px;width:250px;height:30px;text-align:center;color:#fff">
               ${levelNum}
              </div>
               
              </div>
          </div>
          `
              marker2.on('mouseover', markerOverProvince);
              marker2.on('mouseout',markerOutProvince);
            }
            //点击省级地图中项目marker，跳转到项目首页
            marker2.on('click',() => {
              toProject(projectList[i])
            });
            markers.push(marker2);
          }
          var overlayGroups = new AMap.OverlayGroup(markers);
          map.add(overlayGroups);

          function markerOverProvince(e) {
            infoWindowProvince.setContent(e.target.content);
            infoWindowProvince.open(map, e.target.getPosition());
          }
          function  markerOutProvince(e) {
            infoWindowProvince.close(map, e.target.getPosition());
          }
          function toProject(e) {
            // console.log(e);
            _this.$router.push({path:`/project-index/${e.Project_Code}`})
          }
        })

        //echarts重新赋值
        _this.$http.post('/Manage/User/index',{
          'User_Id':window.localStorage.getItem('userId'),
          'Province_Code':a.AreaCode
        }).then((data) => {
          // console.log(data);
          //项目总数
          _this.projectAllCount = data.Data.data.projectAllCount.toLocaleString();
          //城市top5
          let cityTop5 = [];
          cityTop5 = data.Data.data.projectTop5City;
          //city top5背景色
          let backgroundData = [];
          //项目分类
          let projectClass = [];
          projectClass = data.Data.data.projectClass;
          //设备总数
          _this.deviceTotalNumber = data.Data.data.deviceAllCount.total.toLocaleString();
          let deviceTotal = [];
          deviceTotal = data.Data.data.deviceAllCount;
          // console.log(deviceTotal);
          //预警详情
          _this.warningDetail = data.Data.data.indexWaringDetial;
          // console.log(this.warningDetail);
          //预警列表
          _this.warningList = data.Data.data.waringMount;
          //预警项
          let waringMountOld = [
            {
              Level_Id:1,
              Level_Name:'灾难',
              num:0
            },
            {
              Level_Id:2,
              Level_Name:'严重',
              num:0
            },
            {
              Level_Id:3,
              Level_Name:'警告',
              num:0
            },
            {
              Level_Id:4,
              Level_Name:'信息',
              num:0
            }
          ];
          data.Data.data.waringMount.forEach((newItem,newIndex) => {
            waringMountOld.forEach((item,i) => {
              if(+newItem.Level_Id === +item.Level_Id){
                waringMountOld[i].num = newItem.num
              }
            })
          });
          _this.waringMount = waringMountOld;
          // this.waringNum = this.waringMount.length
          _this.waringNum = null;
          _this.waringMount.forEach((item,i) => {
            _this.waringNum += +item.num
          });
          _this.waringNum = _this.waringNum.toLocaleString()
          _this.warningListShow();
          //城市top5
          let displayCity = [];
          let displayNum = [];
          cityTop5.forEach((item,i) => {
            displayCity.unshift(item.Province_Name);
            displayNum.unshift(item.num);
            backgroundData.push(cityTop5[0].num)
          });
          // console.log(displayNum);
          // console.log(displayCity);
          let colorCity =['#F6EB69','#46FFB9','#0BB9FF','#4681FF','#9A54F5'];

          let seriesData = [
            {
              name: 'background',
              type: 'bar',
              barWidth: 10,
              itemStyle: {
                color: ['#1D223D'],
              },
              data: backgroundData
            },
          ];
          for(let i in displayNum){
            seriesData.push(
              {
                name: displayCity[i],
                type: 'bar',
                barWidth: 10,
                barGap:'-100%',
                label: {
                  show: true,
                  position: 'right',
                  formatter: '{@[0]}'
                },
                itemStyle: {
                  color: colorCity[i],
                },
                data: [[displayNum[i],displayCity[i]]]
              }
            )
          }
          _this.projectDistChart.setOption({
            yAxis:{data:displayCity},
            series:seriesData
          });
          //项目分类
          let projectName = [];
          let projectNum = [];
          projectClass.forEach((item,i) => {
            projectName.push(item.PLatfrom_Type_Name + ' ' + 'V' + item.Version);
            projectNum.push(item.num)
          });
          _this.projectClassChart.setOption({
            xAxis:{data:projectName},
            series:[{data:projectNum}]
          });

          //设备数量
          //计算项目总数
          //displayDeviceNum替换subtext中的数据
          //legendData替换legend中的data
          let displayDeviceNum = null;
          let legendData = [];
          let displayDeviceSeries = [];
          let colorDeviceCount =['#46FFB9','#4681FF','#9A54F5'];
          //百分比
          let percent = [['32%','38%'],['48%','54%'],['64%','70%']];
          displayDeviceNum = deviceTotal.total;
          deviceTotal.list.forEach((item,i) => {
            legendData.unshift({name:item.type,icon:'circle'});
            displayDeviceSeries.push(
              {
                type:'pie',
                center: ['25%','60%'],
                radius: percent[i],
                avoidLabelOverlap: false,
                label:{show:false},
                labelLine:{show: false},
                data:[
                  {
                    name:item.type,
                    value:item.pre,
                    num:item.num,
                    itemStyle:{color:colorDeviceCount[i]}
                  },
                  {
                    name:'',
                    value:1-item.pre,
                    num:'',
                    itemStyle:{color:'#1D223D'}
                  },
                ]
              }
            )
          });
          _this.deviceNumChart.setOption({
            tooltip: {
              trigger: 'item',
              formatter: function(name){
                if(name.data.name != ''){
                  return name.data.name + '：' + name.data.num
                }else {
                  return null
                }
              }
            },
            title:{subtext:displayDeviceNum},
            legend:{
              data:legendData,
              formatter: function(name){
                for(let i in deviceTotal.list){
                  if(name == deviceTotal.list[i].type) var num = deviceTotal.list[i].num
                }
                return name + '      ' +num;
              }
            },
            series:displayDeviceSeries
          })
        })
      }


    });




//echarts
  //项目分部top5
    this.projectDistChart = echarts.init(document.getElementById('projectDistChart'),'dark');
    this.projectDistChart.setOption({
      backgroundColor: 'transparent',
      title: {
        text: '项目分布TOP 5',
        textStyle:{
          color: '#fff'
        },
        left:'0',
      },
      tooltip:{
        trigger: 'axis',
        showContent: false,
        axisPointer : {
          type : 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        top: 40,
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
      series: [
        // {
        //   name: 'background',
        //   type: 'bar',
        //   barWidth: 10,
        //   itemStyle: {
        //     color: ['#1D223D'],
        //   },
        //   data: [600,600,600,600,600]
        // },
        // {
        //   name: '上海',
        //   type: 'bar',
        //   barWidth: 10,
        //   barGap:'-100%',
        //   label: {
        //     show: true,
        //     position: 'right',
        //     formatter: '{@[0]}'
        //   },
        //   itemStyle: {
        //     color: ['#9A54F5'],
        //   },
        //   data: [[600,'上海']]
        // },
        // {
        //   name: '北京',
        //   type: 'bar',
        //   barWidth: 10,
        //   label: {
        //     show: true,
        //     position: 'right',
        //     formatter: '{@[0]}'
        //   },
        //   itemStyle: {
        //     color: ['#4681FF'],
        //   },
        //   data: [[505,'北京']]
        // },
        // {
        //   name: '重庆',
        //   type: 'bar',
        //   barWidth: 10,
        //   label: {
        //     show: true,
        //     position: 'right',
        //     formatter: '{@[0]}'
        //   },
        //   itemStyle: {
        //     color: ['#0BB9FF'],
        //   },
        //   data: [[320,'重庆']]
        // },
        // {
        //   name: '武汉',
        //   type: 'bar',
        //   barWidth: 10,
        //   label: {
        //     show: true,
        //     position: 'right',
        //     formatter: '{@[0]}'
        //   },
        //   itemStyle: {
        //     color: ['#46FFB9'],
        //   },
        //   data: [[200,'武汉']]
        // },
        // {
        //   name: '南京',
        //   type: 'bar',
        //   barWidth: 10,
        //   label: {
        //     show: true,
        //     position: 'right',
        //     formatter: '{@[0]}'
        //   },
        //   itemStyle: {
        //     color: ['#F6EB69'],
        //   },
        //   data: [[100,'南京']]
        // }
      ]
    })
  //项目分类
    this.projectClassChart = echarts.init(document.getElementById('projectClassChart'),'dark');
    this.projectClassChart.setOption({
      backgroundColor: 'transparent',
      title: {
        text: '项目分类',
        textStyle:{
          color: '#fff'
        },
        left:'0',
      },
      tooltip:{
        trigger: 'axis',
        axisPointer : {
          type : 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        top: 40,
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        axisLabel:{
          //名称过长截取
          formatter: function (name) {
            return (name.length > 7 ? (name.slice(0,7)+"...") : name );
          },
        },
        type: 'category',
        boundaryGap: [0, 0.01],
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
        splitLine:{
          lineStyle:{
            type:'solid',
            opacity:0.8,
            color:['#24253a']
          }
        }
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          barWidth: 10,
          barGap:'-100%',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
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
  //设备总数
    this.deviceNumChart = echarts.init(document.getElementById('deviceNumChart'),'dark');
    this.deviceNumChart.setOption({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
      },
      title: {
        text: '',
        textStyle:{
          color: '#fff'
        },
        left:'0',
        subtext: '',
        subtextStyle:{
          color: '#red',
          fontSize: 20,
          align: 'right'
        }
      },
      legend: {
        selectedMode:false,
        type: 'plain',
        orient: 'vertical',
        right: 10,
        top: 60,
        bottom: 20,
        itemGap: 30,
        data: [],
        textStyle: {
          fontWeight: 800
        },
        formatter: function(name){
          // if(name=='摄像头') var num = 6786;
          // if(name=='门禁') var num = 1263;
          // if(name=='其他') var num = 678;
          // return name + '      ' +num;
        }
      },
      series: [

      ]
    })

//数据请求
    this.$http.post('/Manage/User/index',{
      'User_Id':window.localStorage.getItem('userId'),
    }).then((data) => {
      // console.log(data);
      //项目总数
      this.projectAllCount = data.Data.data.projectAllCount.toLocaleString();
      //城市top5
      let cityTop5 = [];
      cityTop5 = data.Data.data.projectTop5City;
      //city top5背景色
      let backgroundData = [];
      //项目分类
      let projectClass = [];
      projectClass = data.Data.data.projectClass;
      //设备总数
      this.deviceTotalNumber = data.Data.data.deviceAllCount.total.toLocaleString();
      let deviceTotal = [];
      deviceTotal = data.Data.data.deviceAllCount;
      // console.log(deviceTotal);
      //预警详情
      this.warningDetail = data.Data.data.indexWaringDetial;
      // console.log(this.warningDetail);
      //预警列表
      this.warningList = data.Data.data.waringMount;
      //预警项
      let waringMountOld = [
        {
          Level_Id:1,
          Level_Name:'灾难',
          num:0
        },
        {
          Level_Id:2,
          Level_Name:'严重',
          num:0
        },
        {
          Level_Id:3,
          Level_Name:'警告',
          num:0
        },
        {
          Level_Id:4,
          Level_Name:'信息',
          num:0
        }
      ];
      data.Data.data.waringMount.forEach((newItem,newIndex) => {
        waringMountOld.forEach((item,i) => {
          if(+newItem.Level_Id === +item.Level_Id){
            waringMountOld[i].num = newItem.num
          }
        })
      });
      this.waringMount = waringMountOld;
      // this.waringNum = this.waringMount.length
      this.waringNum = null;
      this.waringMount.forEach((item,i) => {
        this.waringNum += +item.num
      });
      this.waringNum = this.waringNum.toLocaleString();
      this.warningListShow();
      //城市top5
      let displayCity = [];
      let displayNum = [];
      cityTop5.forEach((item,i) => {
        displayCity.unshift(item.Province_Name);
        displayNum.unshift(item.num);
        backgroundData.push(cityTop5[0].num)
      });
      // console.log(displayNum);
      // console.log(displayCity);
      let colorCity =['#F6EB69','#46FFB9','#0BB9FF','#4681FF','#9A54F5'];

      let seriesData = [
        {
          name: 'background',
          type: 'bar',
          barWidth: 10,
          itemStyle: {
            color: ['#1D223D'],
          },
          data: backgroundData
        },
      ];
      for(let i in displayNum){
        seriesData.push(
          {
            name: displayCity[i],
            type: 'bar',
            barWidth: 10,
            barGap:'-100%',
            label: {
              show: true,
              position: 'right',
              formatter: '{@[0]}'
            },
            itemStyle: {
              color: colorCity[i],
            },
            data: [[displayNum[i],displayCity[i]]]
          }
        )
      }
      // console.log(seriesData);
      this.projectDistChart.setOption({
        yAxis:{data:displayCity},
        series:seriesData
      });
      //项目分类
      let projectName = [];
      let projectNum = [];
      projectClass.forEach((item,i) => {
        projectName.push(item.PLatfrom_Type_Name + ' ' + 'V' + item.Version);
        projectNum.push(item.num)
      });
      this.projectClassChart.setOption({
        xAxis:{data:projectName},
        series:[{data:projectNum}]
      });

      //设备数量
      //计算项目总数
      //displayDeviceNum替换subtext中的数据
      //legendData替换legend中的data
      let displayDeviceNum = null;
      let legendData = [];
      let displayDeviceSeries = [];
      let colorDeviceCount =['#46FFB9','#4681FF','#9A54F5'];
      //百分比
      let percent = [['32%','38%'],['48%','54%'],['64%','70%']];
      displayDeviceNum = deviceTotal.total;
      deviceTotal.list.forEach((item,i) => {
        legendData.unshift({name:item.type,icon:'circle'});
        displayDeviceSeries.push(
          {
            type:'pie',
            center: ['25%','60%'],
            radius: percent[i],
            avoidLabelOverlap: false,
            label:{show:false},
            labelLine:{show: false},
            data:[
              {
                name:item.type,
                value:item.pre,
                num:item.num,
                itemStyle:{color:colorDeviceCount[i]}
              },
              {
                name:'',
                value:1-item.pre,
                num:'',
                itemStyle:{color:'#1D223D'}
              },
            ]
          }
        )
      });
      // console.log(displayDeviceSeries);
      this.deviceNumChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: function(name){
            if(name.data.name != ''){
              return name.data.name + '：' + name.data.num
            }else {
              return null
            }
          }
        },
        title:{subtext:displayDeviceNum},
        legend:{
          data:legendData,
          formatter: function(name){
            for(let i in deviceTotal.list){
              if(name == deviceTotal.list[i].type) var num = deviceTotal.list[i].num
            }
            return name + ' ' +num;
          }
        },
        series:displayDeviceSeries
      })
    })
  },
  destroyed () {
    if(this.indexTimer) {
      clearInterval(this.indexTimer)
    }
  }


}
