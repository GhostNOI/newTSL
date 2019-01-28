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
                    <el-dialog :title="title" :visible.sync="dialogFormVisible" custom-class="editor innerShadow" @closed="closeModel">
                      <div class="modal-content">
                        <div class="modal-content-title">
                          <label class="role-label" style="margin-top: 5px;margin-right: 30px;">角色名称</label>
                          <el-select v-model="roleName">
                            <el-option
                              v-for="(item,i) in roleList"
                              :key="i"
                              :label="item.Role_Name"
                              :value="item.Role_Id"
                            >
                            </el-option>
                          </el-select>
                        </div>
                        <div class="modal-content-detail">
                          <label class="role-label" style="float:left;">权限划分</label>
                          <!--<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" >全选</el-checkbox>-->
                          <!--<div>-->
                            <!--<el-checkbox-group v-for="(item,i) in pageList" :key="i" v-model="pages">-->
                              <!--<el-checkbox v-for="(childItem,childIndex) in item.child" :label="childItem.Page_Id" :key="childIndex">{{childItem.Page_Name}}</el-checkbox>-->
                            <!--</el-checkbox-group>-->
                          <!--</div>-->
                          <div class="page-detail">
                            <div v-for="(item,i) in pageList" :key="i">
                              <p class="page-title">{{item.Father_Page_Name}}</p>
                              <el-checkbox v-for="(childItem,childIndex) in item.child" :label="childItem.Page_Id" v-model="pages" >{{childItem.Page_Name}}</el-checkbox>
                            </div>
                          </div>

                        </div>
                        <span style="color: red;" v-if="ifTips">{{tips}}</span>
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
                    <th style="width: 10%;padding-left: 5px;text-align: left;">角色名称</th>
                    <td style="width: 83%;padding-left: 5px;">功能管线</td>
                    <td style="width: 7%;padding-left: 5px;">操作</td>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item,i) in tableData" :key="i">
                    <td style="padding-left: 5px;">{{item.Role_Name}}</td>
                    <td style="padding-left: 5px;padding-right: 5px;"><span v-for="(pageItem,pageIndex) in item.pageList" :key="pageIndex+1000">{{pageItem.Page_Name}}　</span></td>
                    <td>
                      <a class="enabled" @click="modifyRole(item)">编辑</a>
                      <a class="enabled" @click="deleteRole(item)">删除</a>
                    </td>
                  </tr>
                  <!--<tr>-->
                    <!--<th>超级管理员</th>-->
                    <!--<td>所有页面</td>-->
                    <!--<td>-->
                      <!--<a class="disabled">编辑</a>-->
                      <!--<a class="disabled">删除</a>-->
                    <!--</td>-->
                  <!--</tr>-->
                  <!--<tr>-->
                    <!--<th>项目管理员</th>-->
                    <!--<td>实时监控、预警管理、服务日志、一键检测、资产配置、预警触发、用户管理、通知管理、操作日志、修改密码</td>-->
                    <!--<td>-->
                      <!--<a class="enabled">编辑</a>-->
                      <!--<a class="enabled">删除</a>-->
                    <!--</td>-->
                  <!--</tr>-->
                  <!--<tr>-->
                    <!--<th>运维人员</th>-->
                    <!--<td>实时监控、预警管理、服务日志、一键检测、操作日志、修改密码</td>-->
                    <!--<td>-->
                      <!--<a class="enabled">编辑</a>-->
                      <!--<a class="enabled">删除</a>-->
                    <!--</td>-->
                  <!--</tr>-->
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
