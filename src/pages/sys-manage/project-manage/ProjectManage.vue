<template>
  <div id="project-management">
    <div id="page-wrapper">
      <div id="page-inner">
        <div class="row project-management-wrap">
          <div class="panel panel-primary no-border innerShadow2">
            <div class="panel-body">
              <div class="project-query">
                <div class="project-width3">
                  <div class="tableFliter">
                    <label class="project-management-label">项目ID</label>
                    <input class="project-ipt" type="text" v-model="projectId" >
                  </div>
                </div>
                <div class=" project-width3">
                  <div class="tableFliter">
                    <label  class="project-management-label">项目名称</label>
                    <input class="project-ipt" type="text" v-model="projectName" >
                  </div>
                </div>
                <div class=" project-width3">
                  <div class="tableFliter">
                    <label  class="project-management-label">项目管理员</label>
                    <input class="project-ipt" type="text" v-model="projectManage" >
                  </div>
                </div>
                <div class=" project-width3">
                  <div class="tableFliter">
                    <label  class="project-management-label">运维人员</label>
                    <input class="project-ipt" type="text" v-model="projectOps" >
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
                  </div>

                  <!-- 新建管理员弹框 -->
                  <el-dialog title="修改" :visible.sync="dialogFormVisibleManage" custom-class="user-dialog innerShadow" @closed="manageClose">
                    <el-form >
                      <div class="change">
                        <label class="change-project">项目ID</label><span style="color: #fff;">{{projectCode}}</span>
                      </div>
                      <div class="change">
                        <label class="change-project">项目名称</label><span style="color: #fff;">{{projectNames}}</span>
                      </div>
                      <el-form-item label="项目管理员"  v-if="manageUser">
                        <el-select v-model="manageSelect" placeholder="请选择">
                          <el-option
                            v-for="(item,i) in selectManage"
                            :key="i"
                            :label="item.Name"
                            :value="item.User_Id"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="运维人员" v-if="opsUser">
                        <el-select v-model="opsSelect" placeholder="请选择" multiple class="mul-select">
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
                      <el-button @click="dialogFormVisibleManage = false" type="cancel">取 消</el-button>
                      <el-button type="confirm" @click="createManage">确 定</el-button>
                    </div>
                  </el-dialog>

                </div>
              </div>

              <!-- 显示表格 -->
              <div class="col-md-12 project-table-wrap">
                <table style="width: 100%;">
                  <thead class="project-table-head">
                  <tr>
                    <th class="project-table-width1 project-spacing">项目ID</th>
                    <th class="project-table-width1 project-spacing">项目名称</th>
                    <th class="project-table-width2 project-spacing">项目管理员</th>
                    <th class="project-table-width4 project-spacing">运维人员</th>
                    <th class="project-table-width2 project-spacing">操作</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item,i) in tableData" :key="i">
                    <td class="project-table-width1 new-line" style="padding-left: 12px; padding-right: 12px;">{{item.Project_Code}}</td>
                    <td class="project-table-width1 new-line" style="padding-left: 12px; padding-right: 12px;">{{item.Project_Name}}</td>
                    <td class="project-table-width2 new-line" style="padding-left: 12px; padding-right: 12px;"><span v-for="(manItem,manIndex) in item.ProjectManagerUser" :key="manIndex+9000">{{manItem.Name}}　</span></td>
                    <td class="project-table-width4 new-line" style="padding-left: 12px; padding-right: 12px;"><span v-for="(opsItem,opsIndex) in item.ProjectOPSUser" :key="opsIndex+1000">{{opsItem.Name}}　</span></td>
                    <td class="project-table-width2 new-line" style="padding-left: 12px; padding-right: 12px;"><span class="enabled" @click="changeManage(item)">修改</span></td>
                  </tr>
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

<script src="./ProjectManage.js">

</script>

<style scoped lang="scss" src="./ProjectManage.scss">

</style>
