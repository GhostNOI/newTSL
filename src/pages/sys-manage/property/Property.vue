<template>
  <div id="property">
    <div id="page-wrapper">
      <div id="page-inner">
        <div class="row property-wrap">
          <div class="panel panel-primary no-border innerShadow2">
            <div class="panel-body">
              <div class="property-top">
              <div class="col-md-3 property-width3 left-right-padding">
                <div class="tableFliter">
                  <label for="projectId" class="property-label">项目ID</label>
                  <input class="form-control property-ipt" type="text"  id="projectId" placeholder="请输入" v-model="projectId">
                </div>
              </div>
              <div class="col-md-4 property-width4 left-right-padding">
                <div class="tableFliter">
                  <label  class="property-label">项目所在地</label>
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
                  <!--<el-select v-model="projectLocation" id="projectLocation" placeholder="请选择">-->
                    <!--<el-option>-->
                    <!--</el-option>-->
                  <!--</el-select>-->
                </div>
              </div>
              <div class="col-md-4 property-width4 left-right-padding">
                <div class="tableFliter">
                  <label for="projectName" class="property-label">项目名称</label>
                  <input class="form-control property-ipt" type="text" maxlength="20" id="projectName" placeholder="请输入" v-model="projectName">
                  <!--<el-select v-model="projectName" id="projectName" placeholder="请选择">-->
                    <!--<el-option>-->
                    <!--</el-option>-->
                  <!--</el-select>-->
                </div>
              </div>
              <div class="property-width1 left-right-padding" style="margin-top: -10px;">
                <div class="ctrlBtnPanel" style="padding: 10px 0 0 0; height: 44px">
                  <a class="  darkBtnPrimary no-border property-btn" @click="query" style="cursor: pointer;margin-bottom: 10px;">
                    <strong>查询</strong>
                  </a>
                  <a class="  darkBtnPrimary no-border property-btn" @click="resetForm" style="cursor: pointer;">
                    <strong>重置</strong>
                  </a>
                </div>
                <div class="ctrlBtnPanel" style="padding: 10px 0; height: 54px">
                  <!--<a class="  darkBtnPrimary no-border property-btn" @click="dialogFormVisible = true">-->
                    <!--<strong>新建</strong>-->
                  <!--</a>-->
                  <!-- 新建弹框 -->
                  <el-dialog title="新建" :visible.sync="dialogFormVisible" custom-class="editor innerShadow">

                    <div>
                      <div class="createOption">
                        <label>项目名称</label>
                        <input type="text" maxlength="20" class="create-ipt">
                      </div>
                      <div class="createOption">
                        <label>项目ID</label>
                        <input type="text" maxlength="20" class="create-ipt">
                      </div>
                      <div class="createOption">
                        <label>部署时间</label>
                        <div style="float: left;">
                          <el-date-picker
                            v-model="datePick"
                            type="date"
                            placeholder="选择日期">
                          </el-date-picker>
                        </div>

                      </div>
                    </div>

                    <div slot="footer" class="dialog-footer">
                      <el-button type="confirm" @click="createNewProject">创建项目</el-button>
                      <el-button type="cancel" @click="dialogFormVisible = false">取 消</el-button>
                    </div>
                  </el-dialog>
                </div>
              </div>
            </div>
              <div class="col-md-12 property-width12">
                <table class="table darkTable property-table">
                  <thead>
                  <tr>
                    <th style="width: 10%;text-align: left;padding-left: 5px;">项目ID</th>
                    <td style="width: 15%">项目名称</td>
                    <td style="width: 15%">部署地点</td>
                    <td style="width: 15%">部署时间</td>
                    <td style="width: 15%">监控时间</td>
                    <td style="width: 10%">设备总数</td>
                    <!--<td style="width: 10%">监控项</td>-->
                    <td style="width: 10%">预警规则</td>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item,i) in projectTable" :key="i">
                    <td style="word-wrap:break-word;word-break:break-all;">{{item.Project_Code}}</td>
                    <td style="word-wrap:break-word;word-break:break-all;">{{item.Project_Name}}</td>
                    <td style="word-wrap:break-word;word-break:break-all;">{{item.City_Name}}</td>
                    <td style="word-wrap:break-word;word-break:break-all;">{{item.Insert_Time | dateFilter}}</td>
                    <td style="word-wrap:break-word;word-break:break-all;">{{item.Update_Time | dateFilter}}</td>
                    <td style="word-wrap:break-word;word-break:break-all;"><a class="enabled" @click="toSmartDevice(item)">{{item.Device_Num}}</a></td>
                    <!--<td style="word-wrap:break-word;word-break:break-all;">{{item.Monitor_Num}}</td>-->
                    <td style="word-wrap:break-word;word-break:break-all;"><a class="enabled" @click="toWarningtrigger(item)">{{item.Warring_Num}}</a></td>
                  </tr>
                  <!--<tr>-->
                    <!--<th>62442</th>-->
                    <!--<td>启皓北京</td>-->
                    <!--<td>北京市</td>-->
                    <!--<td>2018-10-24</td>-->
                    <!--<td>2018-11-06</td>-->
                    <!--<td><a class="enabled">56</a></td>-->
                    <!--<td>99</td>-->
                    <!--<td><a class="enabled">34</a></td>-->
                  <!--</tr>-->



                  </tbody>
                </table>
                <!-- 分页 -->
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[10, 20, 30]"
                  :page-size="10"
                  layout="total, prev, pager, next, sizes, jumper"
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

<script src="./Property.js">

</script>

<style scoped lang="scss" src="./Property.scss">

</style>
