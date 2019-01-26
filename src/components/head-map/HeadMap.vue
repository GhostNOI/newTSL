<template>
  <div id="head-map">

    <div id="top-side" class="navbar innerShadow ">
      <div class="logo">
        <img src="../../assets/img/terminus_logo.png" alt="" style="height:24px">
      </div>
      <!-- 时间 -->
      <p class="head-clock" >{{date}}</p>

      <el-dropdown trigger="click" style="float: right;margin-top: 10px;">
        <p style="cursor: pointer;">
          <img src="../../assets/img/navSetting.png" style="width: 34px;height: 34px"><i class="el-icon-arrow-down el-icon--right"></i>
        </p>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item><router-link to="/property">资产配置</router-link></el-dropdown-item>
          <el-dropdown-item><router-link to="/warningtrigger">预警触发</router-link></el-dropdown-item>
          <el-dropdown-item><router-link to="/rolemanagement">角色管理</router-link></el-dropdown-item>
          <el-dropdown-item><router-link to="/usermanagement">用户管理</router-link></el-dropdown-item>
          <el-dropdown-item><router-link to="/notification">通知管理</router-link></el-dropdown-item>
          <el-dropdown-item><router-link to="/notificationsetting">通知设置</router-link></el-dropdown-item>
          <el-dropdown-item><router-link to="/operationlog">操作日志</router-link></el-dropdown-item>
          <el-dropdown-item style="border-top: 1px solid">修改密码</el-dropdown-item>
          <el-dropdown-item><a @click="logout">注销</a></el-dropdown-item>

        </el-dropdown-menu>
      </el-dropdown>
      <el-select style="float: right; width: 200px; padding-top: 10px; padding-right: 20px;" v-model="value" placeholder="请选择项目" size="small" popper-class="head-select" class="custom-select">
        <el-option
          v-for="(item,i) in projectList"
          :key="i"
          :label="item.Project_Name"
          :value="item.Project_Code">
        </el-option>
      </el-select>


      <!-- 省市区选择 -->
      <div class="block">
        <label for="head-cascader" style="color: #d2e0fa">请选择：省/市/区</label>
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
</template>

<script src="./HeadMap.js">

</script>

<style scoped lang="scss" src="./HeadMap.scss">

</style>
