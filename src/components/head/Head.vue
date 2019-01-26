<template>
  <div id="head">

    <div id="top-side" class="navbar innerShadow ">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="item.url ? {path: item.url} : null" v-for="(item, i) in headTitle" :key="i">{{item.title}}</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 时间 -->

      <p class="head-clock">{{date}}</p>
      <div style="float:right;margin-top: 15px;margin-left: 15px;cursor: pointer;" @click="logOut">
        <img style="width: 25px;height: 25px;" src="../../assets/img/logout.png" alt="">
      </div>
      <el-dropdown trigger="click" style="float: right;margin-top: 10px;">
        <p>
          <img src="../../assets/img/navSetting.png" style="width: 25px;height: 25px;margin-top: 5px;cursor: pointer;">
        </p>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/property">
            <el-dropdown-item>资产配置</el-dropdown-item>
          </router-link>
          <router-link to="/warningtrigger">
            <el-dropdown-item>预警触发</el-dropdown-item>
          </router-link>
          <!--<router-link to="/rolemanagement">-->
            <!--<el-dropdown-item>角色管理</el-dropdown-item>-->
          <!--</router-link>-->
          <router-link to="/usermanagement">
            <el-dropdown-item>用户管理</el-dropdown-item>
          </router-link>
          <router-link to="/projectmanagement">
            <el-dropdown-item>项目管理</el-dropdown-item>
          </router-link>
          <router-link to="/notification">
            <el-dropdown-item>通知管理</el-dropdown-item>
          </router-link>
          <router-link to="/notificationsetting">
            <el-dropdown-item>通知设置</el-dropdown-item>
          </router-link>
          <router-link to="/operationlog">
            <el-dropdown-item>操作日志</el-dropdown-item>
          </router-link>
          <!--<el-dropdown-item style="border-top: 1px solid #5B5D7F"><span  style="display: inline-block;width: 100%;height: 100%;">注销</span></el-dropdown-item>-->
        </el-dropdown-menu>
      </el-dropdown>



    </div>

  </div>
</template>

<script src="./Head.js">

</script>

<style scoped lang="scss" src="./Head.scss">

</style>
