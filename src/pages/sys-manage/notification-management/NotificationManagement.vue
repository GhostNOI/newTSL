<template>
  <div id="notification">
    <div id="page-wrapper">
      <div id="page-inner">
        <div class="row">
          <div class="panel panel-primary no-border innerShadow2">
            <div class="panel-body">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <!--通知记录-->
                <el-tab-pane label="通知记录" name="first">

                  <div class="col-md-4 notification-width4">
                    <div class="tableFliter">
                      <label class="notification-label">通知时间</label>
                      <el-date-picker
                        align="center"
                        v-model="value"
                        popper-class="date-pick"
                        type="daterange"
                        range-separator="——"
                        value-format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"

                      >
                      </el-date-picker>
                    </div>
                    <div class="tableFliter">
                      <label class="notification-label">通知类型</label>
                      <el-select v-model="notificationClass" id="notificationType" placeholder="请选择">
                        <el-option value="">全部</el-option>
                        <el-option
                          v-for="(item,i) in noticeClass"
                          :key="i"
                          :label="item.Notice_Class_Name"
                          :value="item.Notice_Class"
                        >
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="col-md-4 notification-width4">
                    <div class="tableFliter" style="overflow: hidden;">
                      <label class="notification-label">所属项目</label>
                      <input type="text" class="notification-input" v-model="projectIpt">
                    </div>
                    <div class="tableFliter">
                      <label class="notification-label">通知方式</label>
                      <el-select v-model="notificationType" id="notificationMode" placeholder="请选择">
                        <el-option value="">全部</el-option>
                        <el-option
                          v-for="(item,i) in noticeType"
                          :key="i"
                          :label="item.Notice_type_Name"
                          :value="item.Notice_Type"
                        >
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="col-md-4 notification-width4">
                    <div class="tableFliter">
                      <label class="notification-label">接收人</label>
                      <el-select v-model="receiver" id="receiver" placeholder="请选择">
                        <el-option value="">全部</el-option>
                        <el-option
                          v-for="(item,i) in userList"
                          :key="i"
                          :label="item.Name"
                          :value="item.User_Id"
                        >
                        </el-option>
                      </el-select>
                    </div>
                    <div class="ctrlBtnPanel" style="padding: 10px 0 0 0; height: 88px">
                      <a class="darkBtnPrimary no-border notification-query-btn" style="cursor: pointer;margin-right: 10px;" @click="query">
                        <strong>查询</strong>
                      </a>
                      <a class="darkBtnPrimary no-border notification-query-btn" style="cursor: pointer;" @click="resetForm">
                        <strong>重置</strong>
                      </a>
                    </div>
                  </div>

                  <div class="notification-width12" style="padding: 20px 0 0 0">
                    <div class="table-responsive">
                      <table class="table darkTable notification-table">
                        <thead>
                        <tr>
                          <td style="width: 20%;padding-left: 5px;padding-right: 5px;">通知时间</td>
                          <td style="width: 20%;padding-left: 5px;padding-right: 5px;">预警事件</td>
                          <td style="width: 15%;padding-left: 5px;padding-right: 5px;">所属项目</td>
                          <td style="width: 15%;padding-left: 5px;padding-right: 5px;">接收人</td>
                          <td style="width: 15%;padding-left: 5px;padding-right: 5px;">通知类型</td>
                          <td style="width: 15%;padding-left: 5px;padding-right: 5px;">通知方式</td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item,i) in tableData" :key="i">
                          <td style="padding-left: 5px;padding-right: 5px;">{{item.Insert_Time | transformDate}}</td>
                          <td style="padding-left: 5px;padding-right: 5px;">{{item.Message}}</td>
                          <td style="padding-left: 5px;padding-right: 5px;">{{item.Project_Name}}</td>
                          <td style="padding-left: 5px;padding-right: 5px;">{{item.User_Name}}</td>
                          <td style="padding-left: 5px;padding-right: 5px;">{{item.Notice_Class | noticeClass}}</td>
                          <td style="padding-left: 5px;padding-right: 5px;">{{item.Notice_Type | noticeType}}</td>
                        </tr>
                        <!--<tr>-->
                          <!--<td>2018-09-17 09：00：00</td>-->
                          <!--<td>My SQL is down</td>-->
                          <!--<td>启皓北京</td>-->
                          <!--<td>新晓</td>-->
                          <!--<td>催办</td>-->
                          <!--<td>短信</td>-->
                        <!--</tr>-->
                        <!--<tr>-->
                          <!--<td>2018-09-17 09：00：00</td>-->
                          <!--<td>My SQL is down</td>-->
                          <!--<td>启皓北京</td>-->
                          <!--<td>新晓</td>-->
                          <!--<td>催办</td>-->
                          <!--<td>短信</td>-->
                        <!--</tr>-->

                        </tbody>
                      </table>

                      <el-pagination
                        @size-change="manageSizeChange"
                        @current-change="manageCurrentChange"
                        :current-page.sync="currentPage"
                        :page-sizes="[10, 20, 30]"
                        :page-size="10"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="howManyManage">
                      </el-pagination>
                    </div>
                  </div>

                </el-tab-pane>
                <!--通知人员设定-->
                <el-tab-pane label="通知人员设定" name="second">
                  <div class="panel-body" style="padding-top: 0;">
                    <div class="notification-width12" >
                      <div class="notification-new" style="text-align: center;">
                        <a class="darkBtnPrimary no-border notification-query-btn" style="width: 150px;cursor: pointer;" @click="createNew">
                          <strong>新建</strong>
                        </a>
                      </div>

                      <el-dialog :title="title" :visible.sync="dialogFormVisible" custom-class="editor innerShadow" @closed="closeDialog">
                        <div>
                          <el-form :model="form">
                            <el-form-item label="通知接收人" :label-width="formLabelWidth">
                              <el-input v-model="form.name" autocomplete="off" maxlength="10"></el-input>
                            </el-form-item>
                            <el-form-item label="人员类型" :label-width="formLabelWidth">
                              <el-select v-model="form.role">
                                <el-option
                                  v-for="(item,i) in roleList"
                                  :key="i"
                                  :label="item.Role_Name"
                                  :value="item.Role_Id"
                                >
                                </el-option>
                              </el-select>
                            </el-form-item>
                            <el-form-item label="所选项目" :label-width="formLabelWidth">
                              <el-select v-model="form.project" multiple >
                                <el-option
                                  v-for="(item,i) in projectList"
                                  :key="i"
                                  :label="item.Project_Name"
                                  :value="item.Project_Code"
                                >
                                </el-option>
                              </el-select>
                            </el-form-item>
                            <el-form-item label="事件类型" :label-width="formLabelWidth">
                              <el-checkbox v-for="(item,i) in warningGroup" :key="i" :label="item.Warning_Type" v-model="eventType">
                                {{item.Warning_Group_Name}}
                              </el-checkbox>
                            </el-form-item>
                            <el-form-item label="联系电话" :label-width="formLabelWidth">
                              <el-input v-model="form.phone" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="钉钉" :label-width="formLabelWidth">
                              <el-select v-model="form.isDingding" @change="changeDingding">
                                <el-option
                                  v-for="(item,i) in ifDingding"
                                  :key="i"
                                  :label="item.name"
                                  :value="item.value"
                                >
                                </el-option>
                              </el-select>
                            </el-form-item>
                            <el-form-item label="钉钉号" :label-width="formLabelWidth" v-if="dingdingIpt">
                              <el-input v-model="form.dingding" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="邮箱" :label-width="formLabelWidth">
                              <el-input v-model="form.email" autocomplete="off"></el-input>
                            </el-form-item>
                          </el-form>
                          <div style="text-align: center">
                            <span v-if="ifTips" style="color: red">{{tips}}</span>
                          </div>

                        </div>

                        <div slot="footer" class="dialog-footer">
                          <el-button type="confirm" @click="createOrModify">确 定</el-button>
                          <el-button type="cancel" @click="dialogFormVisible = false">取 消</el-button>
                        </div>
                      </el-dialog>

                    </div>
                    <div class="notification-width12" style="padding: 20px 0 0 0">
                      <div class="table-responsive">
                        <table class="table darkTable notification-table">
                          <thead>
                          <tr>
                            <td style="width: 10%;padding-left: 5px;">通知接收人</td>
                            <td style="width: 10%">人员类型</td>
                            <td style="width: 15%">所选项目</td>
                            <td style="width: 15%">事件类型</td>
                            <td style="width: 10%">联系电话</td>
                            <td style="width: 5%">钉钉</td>
                            <td style="width: 15%">钉钉号</td>
                            <td style="width: 10%">通知方式</td>
                            <td style="width: 10%">操作</td>
                          </tr>
                          </thead>
                          <tbody>
                          <tr v-for="(item,i) in tableData2" :key="i">
                            <td style="padding-left: 5px;">{{item.Name}}</td>
                            <td>{{item.Role_Name}}</td>
                            <td><span v-for="(proItem,proIndex) in item.warningProjectList" :key="proIndex">{{proItem.Project_Name}}　</span>　</td>
                            <td><span v-for="(typeItem,typeIndex) in item.warningGroupList" :key="typeIndex">{{typeItem.Warning_Group_Name}}　</span></td>
                            <td>{{item.Phone}}</td>
                            <td>{{item.DingDing ? '有' : '无'}}</td>
                            <td>{{item.DingDing}}</td>
                            <td><span v-for="(noticeItem,noticeIndex) in item.WarningNoticeTypeList":key="noticeIndex">{{noticeItem.Notice_type_Name}}　</span></td>
                            <td>
                              <span class="enabled" @click="changeNotice(item)">修改</span>
                              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                <span style="cursor: pointer;" @click="deleteNotice(item)">删除</span>
                              </el-tooltip>
                            </td>
                          </tr>
                          <!--<tr>-->
                            <!--<td>许久</td>-->
                            <!--<td>催办人</td>-->
                            <!--<td>所有</td>-->
                            <!--<td>服务器、数据库</td>-->
                            <!--<td>18677276665</td>-->
                            <!--<td>有</td>-->
                            <!--<td>18677276665</td>-->
                            <!--<td>钉钉、短信</td>-->
                            <!--<td>-->
                              <!--<a class="enabled changeModal">修改</a>-->
                              <!--<a class="enabled">删除</a>-->
                            <!--</td>-->
                          <!--</tr>-->
                          </tbody>
                        </table>
                        <!-- 分页 -->
                        <el-pagination
                          @size-change="setSizeChange"
                          @current-change="setCurrentChange"
                          :current-page.sync="setCurrentPage"
                          :page-sizes="[10, 20, 30]"
                          :page-size="10"
                          layout="total, sizes, prev, pager, next, jumper"
                          :total="howManySet">
                        </el-pagination>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>

          </div>
        </div>

      </div>
      <!-- /. PAGE INNER  -->
    </div>
  </div>
</template>

<script src="./NotificationManagement.js">

</script>

<style scoped lang="scss" src="./NotificationManagement.scss">

</style>
