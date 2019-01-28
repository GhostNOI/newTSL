<template>
  <div id="project-management">
    <div id="page-wrapper">
      <div id="page-inner">
        <div class="row project-management-wrap">
          <div class="panel panel-primary no-border innerShadow2">
            <div class="panel-body">
              <div class="project-query">
                <div class="col-md-4 project-width4">
                  <div class="tableFliter">
                    <label class="project-management-label">项目所在地</label>
                    <el-cascader
                      v-model="areaCode"
                      popper-class="head-map-cascader"
                      size="small"
                      id="head-cascader"
                      expand-trigger="hover"
                      placeholder="选择：省/市/区"
                      :options="optionArea"
                      filterable
                      change-on-select
                      @change="selectArea"
                    ></el-cascader>
                  </div>
                </div>
                <div class="col-md-4 project-width4">
                  <div class="tableFliter">
                    <label  class="project-management-label">项目名称</label>
                    <el-select v-model="projectCode"  placeholder="请选择">
                      <el-option value="">全部</el-option>
                      <el-option
                        v-for="(item,i) in projectOption"
                        :key="i"
                        :label="item.Project_Name"
                        :value="item.Project_Code"
                      >
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <div class="col-md-1 project-width2" >
                  <div class="ctrlBtnPanel" style="padding: 0px;width: 100%;overflow:hidden;">
                    <a class="darkBtnPrimary no-border project-query-btn" @click="query" style="cursor: pointer;margin-bottom: 20px;" >
                      <strong>查询</strong>
                    </a>
                    <a class="darkBtnPrimary no-border project-query-btn" @click="resetForm" style="cursor: pointer;margin-bottom: 20px;" >
                      <strong>重置</strong>
                    </a>
                    <a class="darkBtnPrimary no-border project-query-btn" @click="dialogFormVisibleManage = true" v-if="manageUser" style="cursor: pointer;float:left;margin-left: 18px;">
                      <strong>新建管理员</strong>
                    </a>
                    <a class="darkBtnPrimary no-border project-query-btn" @click="dialogFormVisibleOps = true" v-if="opsUser" style="cursor: pointer;float:left;margin-left: 18px;">
                      <strong>新建运维人员</strong>
                    </a>
                  </div>

                  <!-- 新建管理员弹框 -->
                  <el-dialog title="新建项目管理员" :visible.sync="dialogFormVisibleManage" custom-class="user-dialog innerShadow" @closed="manageClose">
                    <el-form :model="formManage">
                      <el-form-item label="选择项目" >
                        <el-select v-model="formManage.project" placeholder="请选择">
                          <el-option
                            v-for="(item,i) in selectProject"
                            :key="i"
                            :label="item.Project_Name"
                            :value="item.Project_Code"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="添加管理员" >
                        <el-select v-model="formManage.manageUser" placeholder="请选择">
                          <el-option
                          v-for="(item,i) in selectManage"
                          :key="i"
                          :label="item.Name"
                          :value="item.User_Id"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-form>
                    <div style="width: 100%;">
                      <span style="color: red;float: left; width: 100%; text-align: center">{{errorTip}}</span>
                    </div>
                    <div slot="footer" class="dialog-footer">
                      <el-button @click="dialogFormVisibleManage = false" type="cancel">取 消</el-button>
                      <el-button type="confirm" @click="createManage">确 定</el-button>
                    </div>
                  </el-dialog>


                  <!-- 新建运维人员 -->
                  <el-dialog title="新建运维人员" :visible.sync="dialogFormVisibleOps" custom-class="user-dialog innerShadow" @closed="opsClose">
                    <el-form :model="formOps">
                      <el-form-item label="选择项目" >
                        <el-select v-model="formOps.project" placeholder="请选择">
                          <el-option
                            v-for="(item,i) in selectProject"
                            :key="i"
                            :label="item.Project_Name"
                            :value="item.Project_Code"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="添加运维人员" >
                        <el-select v-model="formOps.opsUser" placeholder="请选择">
                          <el-option
                          v-for="(item,i) in selectOps"
                          :key="i"
                          :label="item.Name"
                          :value="item.User_Id"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-form>
                    <div style="width: 100%;">
                      <span style="color: red;float: left; width: 100%; text-align: center">{{errorTip}}</span>
                    </div>
                    <div slot="footer" class="dialog-footer">
                      <el-button @click="dialogFormVisibleOps = false" type="cancel">取 消</el-button>
                      <el-button type="confirm" @click="createOps">确 定</el-button>
                    </div>
                  </el-dialog>
                </div>
              </div>

              <!-- 显示表格 -->
              <div class="col-md-12 project-table-wrap">
                <table style="width: 100%;">
                  <thead class="project-table-head">
                  <tr>
                    <th class="project-table-width1"></th>
                    <th class="project-table-width2">项目名称</th>
                    <th class="project-table-width2">人员角色</th>
                    <th class="project-table-width3">人员</th>
                    <th class="project-table-width1">操作</th>
                  </tr>
                  </thead>
                  <tbody v-for="(item, i) in tableData" :key="i">
                  <tr>
                    <td class="project-table-open" @click="changeSelect(item)"><i class="iconfont">{{item.checked ? '-' : '+'}}</i></td>
                    <td>{{item.Project_Name}}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr class="project-table-extend" v-for="(innerItem1,innerIndex1) in item.ProjectManagerUser" :key="+innerIndex1+1000" v-if="item.checked">
                    <td></td>
                    <td></td>
                    <td>{{innerItem1.Role_Name}}</td>
                    <td>{{innerItem1.Name}}</td>
                    <td>
                      <el-tooltip class="item" effect="dark" content="删除" placement="top">
                        <span style="color: #4681FF; cursor: pointer;" @click="deleteManage(item)">删除</span>
                      </el-tooltip>
                    </td>
                  </tr>
                  <tr class="project-table-extend" v-for="(innerItem2,innerIndex2) in item.ProjectOPSUser" :key="+innerIndex2+10000" v-if="item.checked">
                    <td></td>
                    <td></td>
                    <td>{{innerItem2.Role_Name}}</td>
                    <td>{{innerItem2.Name}}</td>
                    <td>
                      <el-tooltip class="item" effect="dark" content="删除" placement="top">
                        <span style="color: #4681FF; cursor: pointer;" @click="deleteOps(item)">删除</span>
                      </el-tooltip>
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

<script src="./ProjectManagement.js">

</script>

<style scoped lang="scss" src="./ProjectManagement.scss">

</style>
