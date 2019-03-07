<template>
  <div id="notification-setting">
    <div id="page-wrapper">
      <div id="page-inner">
        <div class="row">
          <div class="panel panel-primary no-border innerShadow2">
            <div class="panel-body" style="min-height: 700px">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="通知方式设定" name="first">
                  <div class="col-md-12 notification-width12" style="padding: 20px 0 0 0">
                    <div class="table-responsive">
                      <div>
                        <a class="darkBtnPrimary no-border user-management-btn" @click="createNew">
                          <strong type="text" >新建</strong>
                        </a>
                      </div>
                      <table class="table darkTable notification-setting-table" style="width: 100%;">
                        <thead>
                        <tr>
                          <td style="width: 15%;padding-left: 5px;padding-right: 5px;">人员类型</td>
                          <td style="width: 20%;padding-left: 5px;padding-right: 5px;">事件类型</td>
                          <td style="width: 25%;padding-left: 5px;padding-right: 5px;">事件等级</td>
                          <td style="width: 25%;padding-left: 5px;padding-right: 5px;">通知方式</td>
                          <td style="width: 10%;padding-left: 5px;padding-right: 5px;">操作</td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item,i) in tableData1" :key="i">
                          <td style="padding-left: 5px;padding-right: 5px;">{{item.Role_Name}}</td>
                          <td style="padding-left: 5px;padding-right: 5px;"><span v-for="(typeItem,typeIndex) in item.warningGroupList" :key="typeIndex">{{typeItem.Warning_Group_Name}}　</span></td>
                          <td style="padding-left: 5px;padding-right: 5px;"><span v-for="(levelItem,levelIndex) in item.warningLevelList" :key="levelIndex">{{levelItem.Level_Name}}　</span></td>
                          <td style="padding-left: 5px;padding-right: 5px;"><span v-for="(noticeItem,noticeIndex) in item.roleWarningNoticeTypeList" :key="noticeIndex">{{noticeItem.Notice_type_Name}}　</span></td>
                          <td style="padding-left: 5px;padding-right: 5px;"><span style="color: rgb(70, 129, 255);cursor: pointer; " @click="changeNotice(item)" >修改</span></td>
                        </tr>
                        <!--<tr>-->
                          <!--<td>超级管理员</td>-->
                          <!--<td>所有</td>-->
                          <!--<td>所有</td>-->
                          <!--<td>平台弹窗、钉钉、短信、邮箱</td>-->
                          <!--<td><a class="enabled changeModal">修改</a></td>-->
                        <!--</tr>-->
                        </tbody>
                      </table>
                      <!-- 弹框 -->
                      <el-dialog :title="title" :visible.sync="changeNoticeDialog" custom-class="editor innerShadow" @closed="closeChangeNoticeType">

                        <div>
                          <div class="roleType cus-height">
                            <label class="noticeLabel">人员类型</label>
                            <el-select v-model="selectRole" placeholder="请选择">
                              <el-option
                                v-for="(item,i) in roleList"
                                :key="i"
                                :label="item.Role_Name"
                                :value="item.Role_Id"
                              >
                              </el-option>
                            </el-select>
                          </div>
                          <div class="eventType cus-height">
                            <label class="noticeLabel" style="float: left;">事件类型</label>
                            <el-checkbox-group v-model="eventType">
                              <el-checkbox
                                v-for="(item,i) in warningGroup"
                                :key="i"
                                :label="item.Warning_Type"
                              >
                                {{item.Warning_Group_Name}}
                              </el-checkbox>
                            </el-checkbox-group>


                            <!--<el-checkbox-group v-model="eventType" style="float: left;" >-->
                              <!--<el-checkbox v-for="(item,i) in warningGroup" :label="item.Warning_Group_Name" :key="i"></el-checkbox>-->
                            <!--</el-checkbox-group>-->

                          </div>

                          <div class="eventLevel cus-height">
                            <label class="noticeLabel" style="float: left;">事件等级</label>
                            <el-checkbox
                              v-for="(item,i) in warningLevel"
                              :key="i"
                              v-model="eventLevel"
                              :label="item.Warning_Level"
                            >
                              {{item.Level_Name}}
                            </el-checkbox>
                            <!--<el-checkbox-group v-model="eventLevel" style="float: left;">-->
                              <!--<el-checkbox v-for="(item,i) in warningLevel" :key="i" :label="item.Warning_Level">{{item.Level_Name}}</el-checkbox>-->
                            <!--</el-checkbox-group>-->
                          </div>

                          <div class="noticeType cus-height">
                            <label class="noticeLabel">通知方式</label>
                            <el-checkbox
                              v-for="(item,i) in warningNoticeType"
                              :key="i"
                              :label="item.Notice_Type"
                              v-model="noticeType"
                            >
                              {{item.Notice_type_Name}}
                            </el-checkbox>
                          </div>

                        </div>
                        <div style="text-align: center;">
                          <span style="color: red;" v-if="selectRoleType">请选择人员类型</span>
                          <span style="color: red;" v-if="selectEventType">{{selectEventTips}}</span>
                        </div>
                        <div slot="footer" class="dialog-footer">
                          <el-button type="confirm" @click="handleOk">确 定</el-button>
                          <el-button type="cancel" @click="changeNoticeDialog = false">取 消</el-button>
                        </div>
                      </el-dialog>
                    </div>
                  </div>

                </el-tab-pane>
                <!--<el-tab-pane label="通知模板设定" name="second">-->

                  <!--<div class="col-md-12 notification-width12" style="padding: 20px 0 0 0">-->
                    <!--<div class="table-responsive">-->
                      <!--<table class="table darkTable notification-setting-table" style="width: 100%;">-->
                        <!--<thead>-->
                        <!--<tr>-->
                          <!--<td style="width: 20%;padding-left: 5px;padding-right: 5px;">通知方式</td>-->
                          <!--<td style="width: 70%;padding-left: 5px;padding-right: 5px;">通知模版</td>-->
                          <!--<td style="width: 10%;padding-left: 5px;padding-right: 5px;">操作</td>-->
                        <!--</tr>-->
                        <!--</thead>-->
                        <!--<tbody>-->
                        <!--<tr v-for="(item,i) in tableData2" :key="i">-->
                          <!--<td style="padding-left: 5px;padding-right: 5px;">{{item.Notice_type_Name}}</td>-->
                          <!--<td style="padding-left: 5px;padding-right: 5px;">{{item.Template_Content}}</td>-->
                          <!--<td style="padding-left: 5px;padding-right: 5px;"><span class="enabled" @click="changeTemplate(item)">修改</span></td>-->
                        <!--</tr>-->
                        <!--</tbody>-->
                      <!--</table>-->
                      <!--<el-dialog title="修改" :visible.sync="templateChange" custom-class="editor innerShadow" @closed="noticeTemplate">-->

                        <!--<div>-->
                          <!--<div class="noticeTemType cus-height">-->
                            <!--<label class="noticeLabel">通知方式</label>-->
                            <!--<input type="text" class="ipt" v-model="noticeTemplateType" >-->
                          <!--</div>-->
                          <!--<div>-->
                            <!--<label class="noticeLabel" style="float: left;">通知模板</label>-->
                            <!--<textarea class="ipt" cols="50" rows="10" style="resize: none;" v-model="noticeTemplateTem"></textarea>-->
                          <!--</div>-->
                        <!--</div>-->
                        <!--<div slot="footer" class="dialog-footer">-->
                          <!--<el-button type="confirm" @click="confirmTemplate">确 定</el-button>-->
                          <!--<el-button type="cancel" @click="templateChange = false">取 消</el-button>-->
                        <!--</div>-->
                      <!--</el-dialog>-->
                    <!--</div>-->
                  <!--</div>-->
                <!--</el-tab-pane>-->
                <el-tab-pane label="处理时间设置" name="third">
                  <div class="panel-body" style="min-height: 700px">
                    <div class="col-md-12 notification-width12" style="padding: 20px 0 0 0">
                      <table class="table darkTable notification-setting-table" style="width: 100%;">
                        <thead>
                        <tr>
                          <td style="width: 25%;padding-left: 5px;padding-right: 5px;">事件类型</td>
                          <td style="width: 25%;padding-left: 5px;padding-right: 5px;">灾难</td>
                          <td style="width: 25%;padding-left: 5px;padding-right: 5px;">严重</td>
                          <td style="width: 25%;padding-left: 5px;padding-right: 5px;">警告</td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                          <td style="padding-left: 5px;padding-right: 5px;">可处理时间</td>
                          <td v-for="(item,i) in tableData3" :key="i">
                            <span v-if="!changeTime">{{item.Processing_Time}}h</span>
                            <span class="enabled" @click="changeDealTime(item)">修改</span>
                          </td>
                        </tr>
                        <!--<tr>-->
                          <!--<td>可处理时间</td>-->
                          <!--<td>1h</td>-->
                          <!--<td>2h</td>-->
                          <!--<td>4h</td>-->
                          <!--<td><a class="enabled">修改</a></td>-->
                        <!--</tr>-->
                        </tbody>
                      </table>
                      <!-- 弹框 -->
                      <el-dialog title="修改" :visible.sync="changeTime" custom-class="editor innerShadow" @closed="noticeTemplate">

                        <div>
                          <div class="noticeTemType cus-height">
                            <label class="noticeLabel">事件等级</label>
                            <input type="text" class="ipt" v-model="noticeEventLevel" disabled>
                          </div>
                          <div>
                            <label class="noticeLabel" style="float: left;margin-top: 5px;">修改时间</label>
                            <!--<input type="number" class="ipt" v-model="noticeEventTime">-->
                            <select name="" id="" v-model="noticeEventTime" style="margin-left: 10px;height: 35px;">
                              <option style="background: #100f16;color: #fff" value="1">1</option>
                              <option style="background: #100f16;color: #fff" value="2">2</option>
                              <option style="background: #100f16;color: #fff" value="3">3</option>
                              <option style="background: #100f16;color: #fff" value="4">4</option>
                              <option style="background: #100f16;color: #fff" value="5">5</option>
                              <option style="background: #100f16;color: #fff" value="6">6</option>
                              <option style="background: #100f16;color: #fff" value="7">7</option>
                              <option style="background: #100f16;color: #fff" value="8">8</option>
                              <option style="background: #100f16;color: #fff" value="9">9</option>
                              <option style="background: #100f16;color: #fff" value="10">10</option>
                            </select>
                          </div>
                        </div>
                        <div slot="footer" class="dialog-footer">
                          <el-button type="confirm" @click="confirmTime">确 定</el-button>
                          <el-button type="cancel" @click="changeTime = false">取 消</el-button>
                        </div>
                      </el-dialog>
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

<script src="./NotificationSetting.js">

</script>

<style scoped src="./NotificationSetting.scss">

</style>
