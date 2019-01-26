<template>
  <div id="role-management">
    <div id="page-wrapper">
      <div id="page-inner">
        <div class="row role-management-wrap">
          <div class="panel panel-primary no-border innerShadow2">
            <div class="panel-body" style="min-height: 700px">
              <div class="role-management-top">
                <div class="new-build" style="padding-right: 0">
                  <div class="ctrlBtnPanel" style="padding-top: 5px;">
                    <a class="button-primary ctrlBtn darkBtnPrimary no-border role-management-btn" @click="dialogFormVisible = true">
                      <strong>新建</strong>
                    </a>
                    <el-dialog title="新建" :visible.sync="dialogFormVisible" custom-class="editor innerShadow">

                      <div class="modal-content">
                        <div class="modal-content-title">
                          <label>角色名称</label>
                          <input type="text">
                        </div>
                        <div class="modal-content-detail">
                          <label>权限划分</label>
                          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                          <div style="margin: 15px 0;"></div>
                          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                            <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                      </div>
                      <!-- dialogFooter -->
                      <div slot="footer" class="dialog-footer">
                        <el-button type="confirm" @click="createRole">确 定</el-button>
                        <el-button type="cancel" @click="dialogFormVisible = false">取 消</el-button>
                      </div>
                    </el-dialog>

                  </div>
                </div>
              </div>

              <div class="col-md-12 role-management-table-wrap" >
                <table class="table darkTable role-management-table">
                  <thead>
                  <tr>
                    <th style="width: 15%">角色名称</th>
                    <td style="width: 70%">功能管线</td>
                    <td style="width: 15%">操作</td>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <th>超级管理员</th>
                    <td>所有页面</td>
                    <td>
                      <a class="disabled">编辑</a>
                      <a class="disabled">删除</a>
                    </td>
                  </tr>
                  <tr>
                    <th>项目管理员</th>
                    <td>实时监控、预警管理、服务日志、一键检测、资产配置、预警触发、用户管理、通知管理、操作日志、修改密码</td>
                    <td>
                      <a class="enabled">编辑</a>
                      <a class="enabled">删除</a>
                    </td>
                  </tr>
                  <tr>
                    <th>运维人员</th>
                    <td>实时监控、预警管理、服务日志、一键检测、操作日志、修改密码</td>
                    <td>
                      <a class="enabled">编辑</a>
                      <a class="enabled">删除</a>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>
      <!-- /. PAGE INNER  -->
    </div>
  </div>
</template>

<script src="./RoleManagement.js">

</script>

<style scoped lang="scss" src="./RoleManagement.scss">

</style>
