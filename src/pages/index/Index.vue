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
            <router-link to="/property" v-if="ifOps">
              <el-dropdown-item>资产配置</el-dropdown-item>
            </router-link>
            <router-link to="/warningtrigger" v-if="ifOps">
              <el-dropdown-item>预警规则</el-dropdown-item>
            </router-link>
            <!--<router-link to="/rolemanagement"><el-dropdown-item>角色管理</el-dropdown-item></router-link>-->
            <router-link to="/usermanagement" v-if="ifOps">
              <el-dropdown-item>用户管理</el-dropdown-item>
            </router-link>
            <!--<router-link to="/projectmanagement">-->
              <!--<el-dropdown-item>项目管理</el-dropdown-item>-->
            <!--</router-link>-->
            <router-link to="/projectmanage" v-if="ifOps">
              <el-dropdown-item>项目管理</el-dropdown-item>
            </router-link>
            <router-link to="/notification">
              <el-dropdown-item>通知管理</el-dropdown-item>
            </router-link>
            <router-link to="/notificationsetting" v-if="projectManage">
              <el-dropdown-item>通知设置</el-dropdown-item>
            </router-link>
            <router-link to="/operationlog">
              <el-dropdown-item>操作日志</el-dropdown-item>
            </router-link>
            <span class="change" @click="changePass = true">修改密码</span>
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
    <!-- 修改密码 -->
    <div id="changePassword">
      <el-dialog title="修改密码" :visible.sync="changePass" custom-class="editor innerShadow" @closed="closeDialog">
        <div class="changePassowrd-wrap">
          <label class="userName">用户名：</label>
          <span class="userName">{{phone}}</span>
          <br />
          <input style="margin-top:30px" class="changePassword" type="text" v-model="oldPassword" placeholder="旧密码"><br />
          <input class="changePassword" maxlength="20" type="text" v-model="newPassword" placeholder="新密码（请输入8-20位字符，包含大小写字母与数字）"><br />
          <input class="changePassword" maxlength="20" type="text" v-model="confirmPassword" placeholder="确认密码（请输入8-20位字符，包含大小写字母与数字）">
          <div style="text-align: center">
            <span v-if="ifTips" style="color: red">{{tips}}</span>
          </div>
          <el-button class="darkBtnPrimary no-border btn" type="confirm" @click="changePassowrd">确 定</el-button>
        </div>
        <!--<div slot="footer" class="dialog-footer">-->
        <!---->
        <!--</div>-->
      </el-dialog>
    </div>
    <!-- 修改密码 -->
    <!--左-->
    <div class="leftRow no-border innerShadow">
      <div class="showCase1">
        <h5>项目总数</h5>
        <h3>{{projectAllCount}}</h3>
      </div>
      <div class="eventCase" style="border-bottom: none;">
        <div id="projectDistChart" style="width: 100%; height: 200px"></div>
      </div>
      <div class="eventCase" style="border-bottom: none;">
        <div id="projectClassChart" style="width: 100%; height: 200px"></div>
      </div>
      <div class="eventCase" style="border-bottom-width: 0">
        <div style="overflow: hidden;">
          <p style="float:left; font-size: 18px; color: #fff; font-weight: 700;">设备总数</p>
          <span style="float:right; font-size: 24px; color: #fff; font-weight: 900; margin-right: 10px;">{{deviceTotalNumber}}</span>
        </div>
        <div id="deviceNumChart" style="width: 100%; height: 200px"></div>
      </div>
    </div>
    <!--右-->
    <div class="rightRow no-border innerShadow">
      <div class="showCase3">
        <h5>预警事件</h5>
        <h3>{{waringNum}} <span style="font-size: 14px;font-weight: 100;color: #cfdcf6;">项</span></h3>
      </div>
      <div class="eventCase">
        <div class="row">
          <div class="col-md-3">
            <div class="panel-right" style="height: 60px">
              <h5 class="warning-level">灾难</h5>
              <h3 class="warning-num">{{waringMount[0] ? waringMount[0].num : '0'}}</h3>
            </div>
          </div>
          <div class="col-md-3">
            <div class="panel-right" style="height: auto">
              <h5 class="warning-level">严重</h5>
              <h3 class="warning-num">{{waringMount[1] ? waringMount[1].num : '0'}}</h3>
            </div>
          </div>
          <div class="col-md-3">
            <div class="panel-right" style="height: auto">
              <h5 class="warning-level">警告</h5>
              <h3 class="warning-num">{{waringMount[2] ? waringMount[2].num : '0'}}</h3>
            </div>
          </div>
          <div class="col-md-3">
            <div class="panel-right" style="height: auto">
              <h5 class="warning-level">信息</h5>
              <h3 class="warning-num">{{waringMount[3] ? waringMount[3].num : '0'}}</h3>
            </div>
          </div>
        </div>

      </div>

      <div class="eventCase" v-for="(item,i) in warningDetail" :key="i">
        <div class="listTitle">
          <h5>{{item.Message}}　　</h5>
          <h5>{{item.Source_Type_Name}}</h5>
        </div>
        <div class="detailCase">
          <h6><span class="alarm" :class="[{serious: +item.Level_Id === 2}, {info: +item.Level_Id === 4}, {disaster: +item.Level_Id === 1}, {alert: +item.Level_Id === 3}]" style="margin: 0;margin-right: 5px;">{{item.Level_Name}}</span></h6>
          <h6 style="font-size: 12px">{{item.Warning_Time | transformDate}}</h6>
          <h6 style="float: right; margin-right: 0;font-size: 12px;">{{item.Project_Name}}</h6>
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
