<template>
  <div id="user-management">
    <div id="page-wrapper">
      <div id="page-inner">
        <div class="row user-management-wrap">
          <div class="panel panel-primary no-border innerShadow2">
            <div class="panel-body">

              <div class="user-management-top">
                <div class="col-md-3 user-management-width3">
                  <div class="tableFliter">
                    <label for="name" class="user-management-label">姓名</label>
                    <input type="text" id="name" placeholder="请输入" class="form-control" v-model="iptName" style="text-indent: 10px;">
                  </div>
                  <!--<div class="tableFliter">-->
                    <!--<label for="projectManagement" class="user-management-label">项目管理</label>-->
                    <!--<el-select v-model="projectManagement" id="projectManagement" placeholder="请选择">-->
                      <!--<el-option>-->
                      <!--</el-option>-->
                    <!--</el-select>-->
                  <!--</div>-->
                </div>
                <div class="col-md-3 user-management-width3">
                  <div class="tableFliter">
                    <label for="phone" class="user-management-label">手机号</label>
                    <input type="text" id="phone" placeholder="请输入" class="form-control" v-model="iptPhone" style="text-indent: 10px;">
                  </div>
                </div>
                <div class="col-md-4 user-management-width4">
                  <div class="tableFliter">
                    <label for="rolePower" class="user-management-label">角色权限</label>
                    <el-select v-model="rolePower" id="rolePower" placeholder="请选择">
                      <el-option value="">全部</el-option>
                      <el-option
                        v-for="(item,i) in roleList"
                        :key="i"
                        :label="item.Role_Name"
                        :value="item.Role_Id"
                      >
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <div class="col-md-2 user-management-width2" style="padding-right: 0">
                  <div class="ctrlBtnPanel">
                    <a class="darkBtnPrimary no-border user-management-btn" @click="query">
                      <strong>查询</strong>
                    </a>
                    <a class="darkBtnPrimary no-border user-management-btn" @click="resetForm">
                      <strong>重置</strong>
                    </a>
                  </div>
                  <div class="ctrlBtnPanel">
                    <a class="darkBtnPrimary no-border user-management-btn" @click="createNewUser">
                      <strong type="text" >新建</strong>
                    </a>
                    <a class=" user-management-btn" >
                      <!-- 站位按钮 -->
                    </a>
                    <!--弹窗-->
                    <el-dialog title="新建" :visible.sync="dialogFormVisible" custom-class="user-dialog innerShadow" @closed="quit">
                      <el-form :model="form">
                        <el-form-item label="姓名" :label-width="formLabelWidth">
                          <el-input v-model="form.name" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号" :label-width="formLabelWidth">
                          <el-input v-model="form.phone" autocomplete="off" :disabled="ifNewCreate"></el-input>
                        </el-form-item>
                        <el-form-item label="初始密码" :label-width="formLabelWidth" v-if="pwd">
                          <el-input v-model="form.password" disabled value="123456" placeholder="123456"></el-input>
                        </el-form-item>
                        <el-form-item label="角色权限" :label-width="formLabelWidth">
                          <el-select v-model="form.permissions" placeholder="请选择">
                            <el-option
                              v-for="(item,i) in roleList"
                              :key="i"
                              :label="item.Role_Name"
                              :value="item.Role_Id"
                            >
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="钉钉" :label-width="formLabelWidth">
                          <el-select v-model="form.dingding" placeholder="请选择" @change="changeDingDing">
                            <el-option label="有" value="1"></el-option>
                            <el-option label="无" value="0"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="钉钉号" :label-width="formLabelWidth" v-if="isDingDing">
                          <el-input v-model="form.dingdingNumber" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" :label-width="formLabelWidth">
                          <el-input v-model="form.email" autocomplete="off"></el-input>
                        </el-form-item>
                      </el-form>
                      <div style="color: red;text-align: center;" v-if="ifTips">
                        {{tips}}
                      </div>
                      <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false" type="cancel">取 消</el-button>
                        <el-button type="confirm" @click="sureCreate">确 定</el-button>
                      </div>
                    </el-dialog>
                  </div>
                </div>
              </div>

              <div class="user-management-table-wrap" style="padding: 0 ">
                <table class="table darkTable user-management-table">
                  <thead>
                  <tr>
                    <th style="width: 10%">姓名</th>
                    <td style="width: 15%">手机号</td>
                    <td style="width: 10%">角色权限</td>
                    <td style="width: 5%">钉钉</td>
                    <td style="width: 15%">钉钉号</td>
                    <td style="width: 15%">邮箱</td>
                    <td style="width: 10%">账号状态</td>
                    <td style="width: 20%">操作</td>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item,i) in tableData" :key="i">
                    <th>{{item.Name}}</th>
                    <td>{{item.Phone}}</td>
                    <td>{{item.Role_Name}}</td>
                    <td>{{item.DingDing ? '有' : '无'}}</td>
                    <td>{{item.DingDing}}</td>
                    <td>{{item.Email}}</td>
                    <td><span :class="[{proEnable : item.Status == 1},{proDisable : item.Status == 0}]">{{item.Status == 1 ? '启用中' : '禁用中'}}</span></td>
                    <td>
                      <a class="enabled changeModal" @click="modify(item)">修改</a>
                      <a :class="[{active:item.Status == 1},{notActive:item.Status == 0}]" @click="changeStatus(item)">{{item.Status == 1 ? '禁用' : '启用'}}</a>
                    </td>
                  </tr>
                  <!--<tr>-->
                    <!--<th>新晓</th>-->
                    <!--<td>18872672827</td>-->
                    <!--<td>超级管理员</td>-->
                    <!--<td>有</td>-->
                    <!--<td>18872672827</td>-->
                    <!--<td>5677868789@123.com</td>-->
                    <!--<td><span class="badge badgeActive">启用中</span></td>-->
                    <!--<td>-->
                      <!--<a class="enabled changeModal">修改</a>-->
                      <!--<a class="enabled">禁用</a>-->
                    <!--</td>-->
                  <!--</tr>-->

                  </tbody>
                </table>
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[10, 20, 30]"
                  :page-size="10"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="howMany">
                </el-pagination>
              </div>


            </div>
          </div>
        </div>

      </div>
      <!-- /. PAGE INNER  -->
    </div>
  </div>
</template>

<script src="./UserManagement.js">

</script>

<style scoped lang="scss" src="./UserManagement.scss">

</style>
