<template>
  <div id="overview">
    <div id="page-wrapper">
      <div id="page-inner" >
        <div class="row row-custom">
          <div class=" overview-left">
            <div class="panel panel-primary text-center no-border innerShadow2">
              <div class="col-md-6 borderRightDivide platform-info">
                <div class="panel-right" style="padding: 0 0; text-align: left;padding-left: 10px;">
                  <h5 class="customH5" style="padding: 28px 0 13px 0">平台版本：智慧城市 V2.0</h5>
                  <h5 class="customH5" style="padding: 18px 0 ">部署位置：{{location}}</h5>
                </div>
              </div>
              <div class="col-md-3 device-number">
                <div class="panel-right">
                  <h5 class="customH5">服务器 (台)</h5>
                  <h3 class="customH3">{{serversCount}}</h3>
                </div>
              </div>
              <div class="col-md-3 device-number">
                <div class="panel-right">
                  <h5 class="customH5">设备 (台)</h5>
                  <h3 class="customH3">{{deviceCount}}</h3>
                </div>
              </div>
            </div>
            <!-- 预警监控 -->
            <div class="panel panel-primary text-center no-border innerShadow2">
              <div class="showCase showCase3">
                <h5>已监控 (项)</h5>
                <h3>{{projectRuleMount}}</h3>
              </div>
              <div class="listTitle">
                <h5>预警事件</h5>
                <a style="cursor:pointer;" @click="more">更多</a>
              </div>
              <div class="divideLine"></div>
              <div class="eventCase" v-for="(item,i) in waring" :key="i">
                <div class="listTitle">
                  <span class="source-type">{{item.Source_Type_Name}}</span><h5>{{item.Message}}</h5>
                  <a style="cursor: pointer;" @click="toDetail(item)">查看</a>
                </div>
                <div class="detailCase">
                  <h6>{{item.Warning_Time | transformDate}}</h6>
                  <h6>{{item.Warning_Group_Name}}&nbsp;&nbsp;&nbsp;<span class="badge1" :class="[{disaster: +item.Level_Id === 1}, {serious: +item.Level_Id === 2}, {alert: +item.Level_Id === 3}, {info: +item.Level_Id === 4}]">{{item.Level_Name}}</span></h6>
                  <h6 style="float: right; margin-right: 0">&lt;{{item.Name}}&gt;</h6>
                  <h6 style="float: right">{{item.lastTime}}</h6>
                </div>
              </div>
              <!--<div class="eventCase">-->
                <!--<div class="listTitle">-->
                  <!--<h5>My SQL is down.</h5>-->
                  <!--<a>查看</a>-->
                <!--</div>-->
                <!--<div class="detailCase">-->
                  <!--<h6>2018-11-03&nbsp;&nbsp;&nbsp;09&nbsp;:&nbsp;00&nbsp;:&nbsp;00</h6>-->
                  <!--<h6>数据库&nbsp;&nbsp;&nbsp;<span class="badge1 disaster">灾难</span></h6>-->
                  <!--<h6 style="float: right; margin-right: 0">&lt;新晓&gt;</h6>-->
                  <!--<h6 style="float: right">剩52分钟</h6>-->
                <!--</div>-->
              <!--</div>-->


            </div>
          </div>
          <div class="col-md-6 overview-right">
            <div class="panel panel-primary text-center no-border innerShadow2">
              <div class="listTitle">
                <h5>实时监控</h5>
              </div>
              <div class="divideLine"></div>
              <div class="col-md-6 overview-chart1 chart-common">
                <!--<div id="cpuChart" style="width: 100%; height: 200px"></div>-->
                <div id="memoryChart" style="width: 100%; height: 200px"></div>
                <div style="position: absolute;" ref="complateTip" v-if="showTip"></div>
              </div>
              <div class="col-md-6 overview-chart2 chart-common">
                <div id="hardriveChart" style="width: 100%; height: 200px"></div>
              </div>
              <div class="col-md-7 overview-chart3 chart-common">
                <!--<div id="memoryChart" style="width: 100%; height: 200px; margin-bottom: 20px"></div>-->
                <div id="cpuChart" style="width: 100%; height: 200px"></div>
              </div>
              <div class="col-md-5 overview-chart4 chart-common">
                <div id="deviceOnlineChart" style="width: 100%; height: 200px; margin-bottom: 20px"></div>
              </div>
              <div class="col-md-12 overview-chart5 chart-common">
                <div id="databaseLinkChart" style="width: 100%; height: 300px; margin-bottom: 20px"></div>
              </div>
              <div class="overview-logs">
                <div class="overview-log">
                  <div class="flatBtn log-btn" style="cursor: pointer;" @click="toWarningLog">
                    <h5>预警日志</h5>
                    <a>{{notDoWarningLogMount}} 条未记录</a>
                  </div>
                </div>
                <div class="overview-log spacing" style="cursor: pointer;" @click="toErrorLog">
                  <div class="flatBtn log-btn">
                    <h5>错误日志</h5>
                    <a>今日记录 {{todayErroyLogMount}} 条</a>
                  </div>
                </div>
                <div class="overview-log" style="cursor: pointer;" @click="toSlowLog">
                  <div class="flatBtn log-btn">
                    <h5>慢日志</h5>
                    <a>今日记录 {{todaySlowLogMount}} 条</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 弹框 -->
          <el-dialog title="设备详情" :visible.sync="deviceShow" custom-class="editor innerShadow">
            <div>
              <div>
                <span class="device">设备名称</span>：
                <span class="device">{{deviceName}}</span>
              </div>
              <div>
                <span class="device">设备型号</span>：
                <span class="device">{{deviceType}}</span>
              </div>
              <div>
                <span class="device">设备状态</span>：
                <span class="device">{{deviceStatus}}</span>
              </div>

            </div>
            <div slot="footer" class="dialog-footer">
              <el-button type="cancel" @click="deviceShow = false">取 消</el-button>
            </div>
          </el-dialog>

          <!-- 弹框2 -->
          <el-dialog title="安全详情" :visible.sync="security" custom-class="editor innerShadow">
            <div>
              <div>
                <span class="device">安全信息</span>：
                <span class="device">{{securityMsg}}</span>
              </div>
              <div>
                <span class="device">安全操作时间</span>：
                <span class="device">{{securityTime | transformDate}}</span>
              </div>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button type="cancel" @click="security = false">取 消</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
      <!-- /. PAGE INNER  -->
    </div>
    <!--<div style="border: 1px solid; height: 500px;">-->
      <!--111-->
    <!--</div>-->
    <!--<div style="border: 1px solid; height: 500px;">-->
      <!--111-->
    <!--</div>-->
    <!--<div style="border: 1px solid; height: 500px;">-->
      <!--111-->
    <!--</div>-->
  </div>
</template>

<script src="./Overview.js">

</script>

<style scoped lang="scss" src="./Overview.scss">

</style>
