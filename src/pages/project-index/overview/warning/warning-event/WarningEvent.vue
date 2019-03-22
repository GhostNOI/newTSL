<template>
  <div id="warning-event">
    <div id="page-wrapper">
      <div id="page-inner">
        <div class="row warning-event-top">
          <div class="col-md-6 warning-event-top-left" style="padding: 0 15px 0 0">
            <div class="panel panel-primary text-center no-border innerShadow2">
              <div class="listTitle">
                <h5>预警事件类型</h5>
                <div class="button-group" style="float: right">
                  <button v-for="(item,i) in peiChartsDate" :key="i" @click="daysOptionPei(item,i)" class="button-tiny btnLight" :class="{active:i==pei}">
                    <strong>{{item.name}}</strong>
                  </button>
                  <!--<button type="button" class="button-tiny btnLight">-->
                    <!--<strong>今日</strong>-->
                  <!--</button>-->
                </div>
              </div>
              <div class="panel-body">
                <div id="eventTypeChart" style="width: 100%; height: 250px; margin-bottom: 20px"></div>
              </div>
            </div>
          </div>
          <div class="col-md-6 warning-event-top-right" style="padding: 0 0 0 15px">
            <div class="panel panel-primary text-center no-border innerShadow2 ranking-height">
              <div class="listTitle">
                <h5>预警事件排名</h5>
                <div class="button-group" style="float: right">
                  <button type="button" v-for="(item,i) in histogramDate" @click="daysHistogram(item,i)" class="button-tiny btnLight" :class="{active:i==histogram}" :key="i">
                    <strong>{{item.name}}</strong>
                  </button>
                  <!--<button type="button" class="button button-border button-tiny btnLight">-->
                    <!--<strong>今日</strong>-->
                  <!--</button>-->
                  <!--<button type="button" class="button button-border button-tiny btnLight active">-->
                    <!--<strong>本周</strong>-->
                  <!--</button>-->
                  <!--<button type="button" class="button button-border button-tiny btnLight">-->
                    <!--<strong>本月</strong>-->
                  <!--</button>-->
                </div>
              </div>
              <div class="panel-body">
                <div style="width: 10%; float: left;">
                  <table style="width: 100%;color: rgb(214, 228, 255);">
                    <tr>
                      <td style="padding-bottom: 8px;">排名</td>
                    </tr>
                    <tr v-for="(item,i) in sNumber" :key="i">
                      <td class="warning-event-rank"><span class="warning-event-num" :class="[{ff: item === 0},{bb: item ===1},{cc: item ===2},{dd: item ===3},{ee: item ===4}]">{{item + 1}}</span></td>
                    </tr>
                    <!--<tr>-->
                      <!--<td class="warning-event-rank"><span class="warning-event-num" style="background: #E74C3C;">1</span></td>-->
                    <!--</tr>-->
                    <!--<tr>-->
                      <!--<td class="warning-event-rank"><span class="warning-event-num" style="background: #D35400;">2</span></td>-->
                    <!--</tr>-->
                    <!--<tr>-->
                      <!--<td class="warning-event-rank"><span class="warning-event-num" style="background: #F39C12;">3</span></td>-->
                    <!--</tr>-->
                    <!--<tr>-->
                      <!--<td class="warning-event-rank"><span class="warning-event-num" style="background: #2980B9;">4</span></td>-->
                    <!--</tr>-->
                    <!--<tr>-->
                      <!--<td class="warning-event-rank"><span class="warning-event-num" style="background: #2980B9;">5</span></td>-->
                    <!--</tr>-->
                  </table>
                </div>
                <div class="col-md-5 ranking" style="padding: 0">
                  <table class="table darkTable2" style="width: 100%;">
                    <thead>
                    <tr>
                      <td style="width: 60%;padding-bottom:8px">预警事件</td>
                      <td style="width: 20%;padding-bottom:8px">次数</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,i) in eventRank" :key="i">
                      <td class="warning-event-rank" style="white-space: nowrap; overflow: hidden;  text-overflow: ellipsis;">{{item.Name}}</td>
                      <td class="warning-event-rank">{{item.num}}</td>
                    </tr>
                    <!--<tr>-->
                      <!--&lt;!&ndash;<th class="warning-event-rank"><span class=" ">1</span></th>&ndash;&gt;-->
                      <!--<td class="warning-event-rank">服务器宕机</td>-->
                      <!--<td class="warning-event-rank">50</td>-->
                    <!--</tr>-->
                    </tbody>
                  </table>
                </div>
                <div class="col-md-5 ranking-chart" style="padding: 0;margin-top: 40px;height: 210px;">
                  <div id="eventRankingChart" style="width: 100%; height: 210px"></div>
                </div>
                <div class="col-md-2 up-down">
                  <table class="table darkTable2" style="width: 100%;">
                    <thead>
                    <tr>
                      <td style="padding-bottom: 5px;">环比</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,i) in ringRatio" :key="i">
                      <td class="warning-event-rank">{{item}}</td>
                    </tr>

                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row warning-event-bottom">
          <div class="panel panel-primary no-border innerShadow2">
            <div class="panel-body">
              <div id="defineBtnGroup">
                <div class="button-group">
                  <button v-for="(item,i) in type" :key="i" @click="tabChange(item,i)" class="button-tiny btnLight" :class="{active:i==typeIndex}">
                    <strong>{{item.name}}</strong>
                  </button>
                  <!--<button type="button" class="button-tiny btnLight active">-->
                    <!--<strong>全部</strong>-->
                  <!--</button>-->
                </div>
              </div>
              <div class="col-md-12" style="padding: 20px 0 0 0">
                <div class="table-responsive">
                  <table class="darkTable warning-event-bottom-table">
                    <thead>
                    <tr>
                      <td style="width: 20%;text-indent: 10px;">发生时间</td>
                      <td style="width: 8%">事件类型</td>
                      <td style="width: 8%">预警等级</td>
                      <td style="width: 10%">主体</td>
                      <td style="width: 26%">事件</td>
                      <td style="width: 10%">已派发</td>
                      <td style="width: 9%">状态</td>
                      <td style="width: 9%">操作</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,i) in waringEventList" :key="i">
                      <td style="text-indent: 10px;">{{item.Warning_Time | transformDate}}</td>
                      <td>{{item.Warning_Group | eventType}}</td>
                      <td><span class="badge1" :class="[{disaster: +item.Level_Id === 1}, {serious: +item.Level_Id === 2}, {alert: +item.Level_Id === 3}, {info: +item.Level_Id === 4}]">{{item.Level_Name}}</span></td>
                      <td>{{item.Source_Type_Name}}</td>
                      <td>{{item.Message}}</td>
                      <td>{{item.Name}}</td>
                      <td>
                        <el-popover placement="bottom"  :content="delive" width="30" trigger="hover"  @show="countDown(item)">
                          <span slot="reference">{{item.State_Name}}</span>
                        </el-popover>
                      </td>
                      <td><span @click="see(item)" class="enabled">查看</span></td>
                    </tr>
                    <!--<tr>-->
                      <!--<td>2018-10-13&nbsp;&nbsp;&nbsp;09&nbsp;:&nbsp;00&nbsp;:&nbsp;43</td>-->
                      <!--<td>数据库</td>-->
                      <!--<td><span class="badge badgeDisaster">灾难</span></td>-->
                      <!--<td>My SQL</td>-->
                      <!--<td>My SQL is down</td>-->
                      <!--<td>新晓</td>-->
                      <!--<td><a class="enabled" data-toggle="tooltip" data-placement="bottom"  title="超出可处理时间，已催办“宇庆”">处理中</a></td>-->
                      <!--<td><a class="enabled">查看</a></td>-->
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
              </div>

              <!-- 弹框 -->
              <el-dialog title="设备详情" :visible.sync="deviceShow" custom-class="editor innerShadow">
                <div>
                  <div>
                    <span class="device" style="color: #fff;">设备名称</span>：
                    <span class="device" style="color: #fff;">{{deviceName}}</span>
                  </div>
                  <div>
                    <span class="device" style="color: #fff;">设备型号</span>：
                    <span class="device" style="color: #fff;">{{deviceType}}</span>
                  </div>
                  <div>
                    <span class="device" style="color: #fff;">设备状态</span>：
                    <span class="device" style="color: #fff;">{{deviceStatus}}</span>
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
                    <span class="device" style="color: #fff;">安全信息</span>：
                    <span class="device" style="color: #fff;">{{securityMsg}}</span>
                  </div>
                  <div>
                    <span class="device" style="color: #fff;">安全操作时间</span>：
                    <span class="device" style="color: #fff;">{{securityTime | transformDate}}</span>
                  </div>
                </div>
                <div slot="footer" class="dialog-footer">
                  <el-button type="cancel" @click="security = false">取 消</el-button>
                </div>
              </el-dialog>
              <!-- 弹框3服务器离线时间 -->
              <div id="serverOffline">
                <el-dialog :visible.sync="serverOffline" custom-class="editor innerShadow">
                  <div>
                    <ul>
                      <li v-for="(item,i) in offOnline" :key="i" style="color: #fff;font-size: 14px;">中断时间 {{item.offTime | transformDate}} 持续时间 {{item.continuedTime | formatSec}}</li>
                    </ul>
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

<script src="./WarningEvent.js">

</script>

<style scoped src="./WarningEvent.scss">

</style>
