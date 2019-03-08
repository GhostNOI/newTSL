<template>
  <div id="warning-log">
    <div id="page-wrapper">
      <div id="page-inner">
        <div class="row warning-log-content">
          <div class="panel panel-primary no-border innerShadow2">
            <div class="panel-body">

              <div class="warning-top">
                <div class="col-md-4 warning-log-width">
                  <div class="tableFliter">
                    <label class="warning-query-label">事件等级</label>
                    <el-select v-model="eventLevel" id="eventLevel" placeholder="请选择">
                      <el-option value="">全部</el-option>
                      <el-option
                        v-for="(item,i) in warningLevel"
                        :key="i"
                        :label="item.Level_Name"
                        :value="item.Warning_Level"
                      >
                      </el-option>
                    </el-select>
                  </div>
                  <div class="tableFliter">
                    <label class="warning-query-label">发生时间</label>
                    <el-date-picker
                      align="center"
                      v-model="selectDate"
                      popper-class="date-pick"
                      type="daterange"
                      range-separator="——"
                      value-format="yyyy-MM-dd"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    >
                    </el-date-picker>

                  </div>
                </div>
                <div class="col-md-4 warning-log-width">
                  <div class="tableFliter">
                    <div>
                      <label class="warning-query-label">预警类型</label>
                      <el-select v-model="eventType" id="warningType" placeholder="请选择">
                        <el-option value="">全部</el-option>
                        <el-option
                          v-for="(item,i) in warningGroup"
                          :key="i"
                          :label="item.Warning_Group_Name"
                          :value="item.Warning_Type"
                        >
                        </el-option>
                      </el-select>
                    </div>
                    <div class="ctrlBtnPanel warning-query-btn" >
                      <a class="darkBtnPrimary no-border warning-btn" @click="query" style="cursor: pointer;">
                        <strong>查询</strong>
                      </a>
                      <a class="darkBtnPrimary no-border warning-btn" @click="resetForm" style="cursor: pointer;">
                        <strong>重置</strong>
                      </a>
                    </div>
                  </div>
                </div>
                <div class="col-md-4 warning-log-width">
                  <div class="tableFliter">
                    <label  class="warning-query-label">处理人</label>
                    <el-select v-model="dealUser" id="handle" placeholder="请选择">
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

                </div>
                <div class="export-record">
                  <div class="ctrlBtnPanel">
                    <a class="darkBtnPrimary no-border warning-btn" style="cursor: pointer;"  @click="dialogFormVisible = true">
                      <strong>导出记录</strong>
                    </a>
                    <!--弹框-->
                    <el-dialog title="导出记录" :visible.sync="dialogFormVisible" custom-class="editor innerShadow" @closed="closedExoprt">
                      <div>
                        <div class="modelArea">
                          <label class="modelLabel">选择时间</label>
                          <div style="float:right;margin-right: 72px;margin-bottom: 10px;">
                            <el-radio-group v-model="dayType" @change="radioChange">
                              <el-radio label="1">近一天</el-radio>
                              <el-radio label="7">近一周</el-radio>
                              <el-radio label="30">近一月</el-radio>
                              <el-radio label="0">自定义</el-radio>
                            </el-radio-group>
                          </div>
                          <div style="margin-left: 200px">
                            <el-date-picker
                              align="center"
                              :disabled="dayType !== '0'"
                              v-model="selectDateExport"
                              popper-class="date-pick"
                              type="daterange"
                              range-separator="——"
                              value-format="yyyy-MM-dd"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              @change="changeDateExport"
                            >
                            </el-date-picker>
                          </div>
                        </div>
                        <div class="modelArea">
                          <label class="modelLabel">预警等级</label>
                          <el-select v-model="waringLevel" id="eventLevel" placeholder="请选择">
                            <el-option value="">全部</el-option>
                            <el-option
                              v-for="(item,i) in warningLevel"
                              :key="i"
                              :label="item.Level_Name"
                              :value="item.Warning_Level"
                            >
                            </el-option>
                          </el-select>
                        </div>

                        <div class="modelArea">
                          <label class="modelLabel">预警类型</label>
                          <el-select v-model="waringType" id="warningType" placeholder="请选择">
                            <el-option value="">全部</el-option>
                            <el-option
                              v-for="(item,i) in warningGroup"
                              :key="i"
                              :label="item.Warning_Group_Name"
                              :value="item.Warning_Type"
                            >
                            </el-option>
                          </el-select>
                        </div>

                        <div class="modelArea">
                          <label class="modelLabel">处理人</label>
                          <el-select v-model="user" id="handle" placeholder="请选择">
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
                      </div>

                      <div slot="footer" class="dialog-footer">
                        <el-button type="confirm" @click="exportRecord">确 定</el-button>
                        <el-button type="cancel" @click="dialogFormVisible = false">取 消</el-button>
                      </div>
                    </el-dialog>

                  </div>
                </div>
              </div>

              <div class="col-md-12 warning-bottom-table" style="padding: 20px 0 0 0">
                <div class="table-responsive">
                  <table class="table darkTable warning-table">
                    <thead>
                    <tr>
                      <td style="width: 15%;padding-left: 5px;">发生时间</td>
                      <td style="width: 8%">事件类型</td>
                      <td style="width: 8%">预警等级</td>
                      <td style="width: 10%">预警主体</td>
                      <td style="width: 17%">事件</td>
                      <td style="width: 10%">耗时</td>
                      <td style="width: 10%">处理人</td>
                      <td style="width: 15%">处理详情</td>
                      <td style="width: 7%">编辑</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="subTd" v-for="(item,i) in warningLogListCount" :key="i">
                      <td style="padding-left: 5px;padding-right: 5px;">{{item.Warning_Time | transformDate}}</td>
                      <td>{{item.Warning_Group_Name}}</td>
                      <td><span class="badge1" :class="[{disaster: +item.Level_Id === 1}, {serious: +item.Level_Id === 2}, {alert: +item.Level_Id === 3}, {info: +item.Level_Id === 4}]">{{item.Level_Name}}</span></td>
                      <td>{{item.Source_Type_Name}}</td>
                      <td>{{item.Message}}</td>
                      <td>{{item.timeConsuming | formatSec}}</td>
                      <td>{{item.Name}}</td>
                      <td>{{item.Desc}}</td>
                      <td><span class="enabled" @click="changeEvent(item)">修改</span></td>
                    </tr>
                    <!--<tr class="subTd">-->
                      <!--<td>2018-10-13&nbsp;&nbsp;&nbsp;09&nbsp;:&nbsp;00&nbsp;:&nbsp;43</td>-->
                      <!--<td>数据库</td>-->
                      <!--<td><span class="badge badgeDisaster">灾难</span></td>-->
                      <!--<td>My SQL</td>-->
                      <!--<td>My SQL is down</td>-->
                      <!--<td></td>-->
                      <!--<td></td>-->
                      <!--<td></td>-->
                      <!--<td><a class="enabled addModal" style="color: #3FF88F">添加</a></td>-->
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
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="howMany">
                  </el-pagination>
                </div>

                <!-- 修改弹框 -->
                <el-dialog title="修改" :visible.sync="changeAlertEvent" custom-class="editor innerShadow" @closed="closeChange">
                  <div>
                    <div class="modelArea">
                      <label class="modelLabel">预警事件</label>
                      <span style="color: #fff;">{{alertEvent}}</span>
                    </div>
                    <div class="modelArea">
                      <label class="modelLabel">处理人</label>
                      <el-select v-model="changeUser" id="handle" placeholder="请选择">
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
                    <div class="modelArea">
                      <label class="modelLabel" style="float: left;width: 105px;">详情</label>
                      <textarea class="textA" cols="30" rows="10" style="resize: none;background: #100f16;color: #fff;text-indent: 12px;" v-model="description"></textarea>
                    </div>
                    <div v-if="ifTips" style="color: red;text-align: center;">{{tips}}</div>

                  </div>
                  <div style="text-align: center;" v-if="changeTipShow">
                    <span style="color: red;">{{changeTip}}</span>
                  </div>
                  <div slot="footer" class="dialog-footer">
                    <el-button type="confirm" @click="changeEventSure">确 定</el-button>
                    <el-button type="cancel" @click="changeAlertEvent = false">取 消</el-button>
                  </div>
                </el-dialog>
              </div>

            </div>
          </div>
        </div>

      </div>
      <!-- /. PAGE INNER  -->
    </div>
  </div>
</template>

<script src='./WarningLog.js'>

</script>

<style scoped lang="scss" src='./WarningLog.scss'>

</style>
