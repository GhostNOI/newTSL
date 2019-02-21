<template>
  <div id="index">
    <!-- top -->
    <div id="top" >
      <!--<v-head-map></v-head-map>-->
      <!-- 头部 -->
      <div id="top-side" class="navbar innerShadow ">
        <div class="logo">
          <img src="../../assets/img/terminus_logo.png" alt="" style="height:24px">
        </div>
        <!-- 时间 -->
        <p class="head-clock" style="color: #D6E4FF;">{{date}}</p>

        <div style="float:right;margin-top: 15px;margin-left: 15px;cursor: pointer;" @click="logout">
          <img style="width: 25px;height: 25px;" src="../../assets/img/logout.png" alt="">
        </div>

        <el-dropdown trigger="click" style="float: right;margin-top: 10px;">
          <p>
            <img src="../../assets/img/navSetting.png" style="width: 25px;height: 25px;margin-top: 5px;cursor: pointer;">
          </p>
          <el-dropdown-menu slot="dropdown">
            <router-link to="/property"><el-dropdown-item>资产配置</el-dropdown-item></router-link>
            <router-link to="/warningtrigger"><el-dropdown-item>预警触发</el-dropdown-item></router-link>
            <router-link to="/rolemanagement"><el-dropdown-item>角色管理</el-dropdown-item></router-link>
            <router-link to="/usermanagement"><el-dropdown-item>用户管理</el-dropdown-item></router-link>
            <!--<router-link to="/projectmanagement">-->
              <!--<el-dropdown-item>项目管理</el-dropdown-item>-->
            <!--</router-link>-->
            <router-link to="/projectmanage">
              <el-dropdown-item>项目管理</el-dropdown-item>
            </router-link>
            <router-link to="/notification"><el-dropdown-item>通知管理</el-dropdown-item></router-link>
            <router-link to="/notificationsetting"><el-dropdown-item>通知设置</el-dropdown-item></router-link>
            <router-link to="/operationlog"><el-dropdown-item>操作日志</el-dropdown-item></router-link>
            <!--<el-dropdown-item style="border-top: 1px solid #5b5d7f"><a @click="logout" style="display: inline-block;width: 100%;height: 100%;">注销</a></el-dropdown-item>-->
          </el-dropdown-menu>
        </el-dropdown>
        <el-select style="float: right; width: 200px; padding-top: 10px; padding-right: 20px;" v-model="value" placeholder="请选择项目" size="small" popper-class="head-select" class="custom-select" @change="changeProject">
          <el-option
            v-for="(item,i) in projectList1"
            :key="i"
            :label="item.Project_Name"
            :value="item.Project_Code"
          >
          </el-option>
        </el-select>

        <!-- 省市区选择 -->
        <div class="block">

          <el-cascader
            v-model="areaVal"
            popper-class="head-map-cascader"
            size="small"
            id="head-cascader"
            expand-trigger="hover"
            placeholder="选择：省/市/区"
            :options="optionArea"
            filterable
            change-on-select
            @visible-change="areaChange"
          ></el-cascader>
        </div>

      </div>
    </div>
    <!--左-->
    <div class="leftRow no-border innerShadow">
      <div class="showCase">
        <h5>项目总数</h5>
        <h3>{{projectAllCount}}</h3>
      </div>
      <div class="eventCase">
        <div id="projectDistChart" style="width: 100%; height: 200px"></div>
      </div>
      <div class="eventCase">
        <div id="projectClassChart" style="width: 100%; height: 200px"></div>
      </div>
      <div class="eventCase" style="border-bottom-width: 0">
        <div id="deviceNumChart" style="width: 100%; height: 200px"></div>
      </div>
    </div>
    <!--右-->
    <div class="rightRow no-border innerShadow">
      <div class="showCase">
        <h5>预警事件</h5>
        <h3>{{waringNum}} <span style="font-size: 14px">项</span></h3>
      </div>
      <div class="eventCase">
        <div class="row">
          <div class="col-md-3">
            <div class="panel-right" style="height: 60px">
              <h5>灾难</h5>
              <h3>{{waringMount[0] ? waringMount[0].num : '0'}}</h3>
            </div>
          </div>
          <div class="col-md-3">
            <div class="panel-right" style="height: auto">
              <h5>严重</h5>
              <h3>{{waringMount[1] ? waringMount[1].num : '0'}}</h3>
            </div>
          </div>
          <div class="col-md-3">
            <div class="panel-right" style="height: auto">
              <h5>警告</h5>
              <h3>{{waringMount[2] ? waringMount[2].num : '0'}}</h3>
            </div>
          </div>
          <div class="col-md-3">
            <div class="panel-right" style="height: auto">
              <h5>信息</h5>
              <h3>{{waringMount[3] ? waringMount[3].num : '0'}}</h3>
            </div>
          </div>
        </div>

      </div>

      <div class="eventCase" v-for="(item,i) in warningDetail" :key="i">
        <div class="listTitle">
          <h5>{{item.Message}}</h5>
        </div>
        <div class="detailCase">
          <h6><span class="alarm" :class="[{serious: +item.Level_Id === 1}, {info: +item.Level_Id === 2}, {disaster: +item.Level_Id === 3}, {alert: +item.Level_Id === 4}]" style="margin: 0">{{item.Level_Name}}</span></h6>
          <h6>{{item.Warning_Time | transformDate}}</h6>
          <h6 style="float: right; margin-right: 0">{{item.Project_Name}}</h6>
        </div>
      </div>



    </div>
    <!-- 地图 -->
    <div id="bottom">
      <div id="map" style="z-index: 1;"></div>
    </div>
    <button class="returnBtn" v-if="country" @click="toCountry">
      返回全国视图
    </button>

  </div>
</template>

<script src="./Index.js">

</script>

<style scoped lang="scss" src="./Index.scss">

</style>
