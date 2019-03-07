<template>
    <div id="smart-device">
      <div id="page-wrapper">
        <div id="page-inner">
          <div class="row smart-wrap">
            <div class="panel panel-primary text-center no-border innerShadow2">
              <div class="col-md-3 borderRightDivide smart-btn">
                <div class="serverPanel" style="text-align: center">
                  <button class="button button-primary button-rounded serverBtn"><i class="fas fa-4x fa-lock"></i></button>
                  <span class="badge1 serverBadge" style="float: none;cursor: pointer;" v-if="ifWarning" @click="toWarningEvent">{{warningNum}}</span>
                </div>
              </div>
              <div class="col-md-2 borderRightDivide smart-item">
                <div class="panel-right" >
                  <h5 class="customH5">设备总数 (项)</h5>
                  <h3 class="customH3">{{deviceTotal}}<span class="onlineRateTag normalText">在线{{deviceTotalPercent}}%</span></h3>
                </div>
              </div>
              <div class="col-md-2 borderRightDivide smart-item">
                <div class="panel-right">
                  <h5 class="customH5">智能门禁 (项)</h5>
                  <h3 class="customH3">{{lock}}<span class="onlineRateTag normalText">在线{{lockPercent}}%</span></h3>
                </div>
              </div>
              <div class="col-md-2 borderRightDivide smart-item">
                <div class="panel-right">
                  <h5 class="customH5">摄像头 (项)</h5>
                  <h3 class="customH3">{{camera}}<span class="onlineRateTag normalText">在线{{cameraPercent}}%</span></h3>
                </div>
              </div>
              <div class="col-md-2 smart-item">
                <div class="panel-right">
                  <h5 class="customH5">烟感 (项)</h5>
                  <h3 class="customH3">{{smoke}}<span class="onlineRateTag normalText">在线{{smokePercent}}%</span></h3>
                </div>
              </div>
              <div class="col-md-1 smart-right">
                <div class="panel-right">
                  <embed src="http://47.96.70.222:8080/image/angleRight.svg" width="20" height="131" type="image/svg+xml"/>
                </div>
              </div>
            </div>
          </div>

          <div class="row smart-bottom">
            <div class="panel panel-primary no-border innerShadow2">
              <div class="panel-body">
                <!-- tab1 通行设备 -->
                <el-tabs v-model="activeName" @tab-click="handleClick">
                  <el-tab-pane label="通行设备" name="first">
                    <div class="smart-filter">
                      <div class=" smart-query-input">
                        <div class="tableFliter smart-width">
                          <label  class="smart-query-label">设备名称</label>
                          <input  class="form-control" type="text" v-model="lockName" placeholder="请输入">
                        </div>
                        <div class="tableFliter smart-width">
                          <label  class="smart-query-label">MAC地址</label>
                          <input  class="form-control" type="text" v-model="lockMAC" placeholder="请输入">
                        </div>
                        <div class="tableFliter smart-width">
                          <label  class="smart-query-label">所属社区</label>
                          <el-select v-model="lockVillage"  placeholder="请选择">
                            <el-option value="">全部</el-option>
                            <el-option
                              v-for="(item,i) in lockVillageData"
                              :key="i"
                              :label="item.Village_Name"
                              :value="item.Village_Id"
                            >
                            </el-option>
                          </el-select>
                        </div>

                        <div class="tableFliter smart-width">
                          <label  class="smart-query-label">设备状态</label>
                          <el-select v-model="lockType"  placeholder="请选择">
                            <el-option value="">全部</el-option>
                            <el-option
                              v-for="(item,i) in typeData"
                              :key="i"
                              :label="item.name"
                              :value="item.isOnline"
                            >
                            </el-option>
                          </el-select>
                        </div>
                        <div class="ctrlBtnPanel smart-width" style="padding: 0 0 0 0; height: 88px">
                          <a class="ctrlBtn darkBtnPrimary no-border fliterBtn query-btn" style="cursor: pointer;"  @click="lockQuery">
                            <strong>查询</strong>
                          </a>
                          <a class="ctrlBtn darkBtnPrimary no-border fliterBtn query-btn" style="cursor: pointer;"  @click="lockReset">
                            <strong>重置</strong>
                          </a>
                        </div>
                      </div>

                  </div>
                    <div class="col-md-12" style="padding: 20px 0 0 0">
                      <div class="table-responsive">
                        <table style="width: 100%;">
                          <thead>
                          <tr style="height: 50px;">
                            <th style="width: 10%;">序号</th>
                            <th style="width: 15%;">设备名称</th>
                            <th style="width: 15%;">所属社区</th>
                            <th style="width: 20%;">MAC地址</th>
                            <!--<th style="width: 15%;">设备类型</th>-->
                            <th style="width: 10%;">设备状态</th>
                            <th style="width: 15%;">安装时间</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr style="height: 50px;" v-for="(item,i) in lockTableData" :key="i">
                            <td>{{(lockCountPage - 1) * lockPageSize + i + 1}}</td>
                            <td>{{item.Name}}</td>
                            <td>{{item.Village_Name}}</td>
                            <td>{{item.MacAddress}}</td>
                            <!--<td>{{item.Camera_Type}}</td>-->
                            <td><span @click="checkDetail(item)" class="enabled" :class="[{onLine:item.IsOnline == 1},{notOnLine:item.IsOnline == 0}]">{{item.IsOnline | isOnline(item.IsOnline)}}</span></td>
                            <td>{{item.Insert_Time | transformDate}}</td>
                          </tr>
                          </tbody>
                          <tfoot v-if="lockNoData">
                          <tr style="width: 100%; text-align: center;">
                            <td colspan="6" style="font-size: 16px;">暂无数据</td>
                          </tr>
                          </tfoot>
                        </table>
                        <!-- 分页 -->
                        <el-pagination
                          @size-change="handleSizeChangeLock"
                          @current-change="handleCurrentChangeLock"
                          :current-page="currentPageLock"
                          :page-sizes="[10, 20, 50]"
                          :page-size="10"
                          layout="total, sizes, prev, pager, next, jumper"
                          :total="lockHowMany">
                        </el-pagination>
                      </div>
                    </div>
                  </el-tab-pane>

                  <!-- tab2 监控设备 -->
                  <el-tab-pane label="监控设备" name="second">
                    <div class="smart-filter">
                      <div class="col-md-3 smart-query-input">
                        <div class="tableFliter smart-width">
                          <label  class="smart-query-label">设备名称</label>
                          <input  class="form-control" type="text" v-model="cameraName" placeholder="请输入">
                        </div>
                        <div class="tableFliter smart-width">
                          <label  class="smart-query-label">IP地址</label>
                          <input  class="form-control" type="text" v-model="IPAddress" placeholder="请输入">
                        </div>
                        <div class="tableFliter smart-width">
                          <label  class="smart-query-label">所属社区</label>
                          <el-select v-model="cameraVillage"  placeholder="请选择">
                            <el-option value="">全部</el-option>
                            <el-option
                              v-for="(item,i) in cameraVillageData"
                              :key="i"
                              :label="item.Village_Name"
                              :value="item.Village_Id"
                            >
                            </el-option>
                          </el-select>
                        </div>
                        <div class="tableFliter smart-width">
                          <label  class="smart-query-label">设备状态</label>
                          <el-select v-model="cameraType"  placeholder="请选择">
                            <el-option value="">全部</el-option>
                            <el-option
                              v-for="(item,i) in typeData"
                              :key="i"
                              :label="item.name"
                              :value="item.isOnline"
                            >
                            </el-option>
                          </el-select>
                        </div>
                        <div class="ctrlBtnPanel smart-width" style="padding: 0 0 0 0; height: 88px">
                          <a class=" ctrlBtn darkBtnPrimary no-border fliterBtn query-btn" style="cursor: pointer;"  @click="cameraQuery">
                            <strong>查询</strong>
                          </a>
                          <a class=" ctrlBtn darkBtnPrimary no-border fliterBtn query-btn" style="cursor: pointer;"  @click="cameraReset">
                            <strong>重置</strong>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-12" style="padding: 20px 0 0 0">
                      <div class="table-responsive">
                        <table style="width: 100%;">
                          <thead>
                          <tr style="height: 50px;">
                            <th style="width: 10%;">序号</th>
                            <th style="width: 15%;">设备名称</th>
                            <th style="width: 15%;">所属社区</th>
                            <th style="width: 20%;">MAC地址</th>
                            <th style="width: 15%;">设备类型</th>
                            <th style="width: 10%;">设备状态</th>
                            <th style="width: 15%;">安装时间</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr style="height: 50px;" v-for="(item,i) in cameraTableData" :key="i">
                            <td>{{(cameraPageNum - 1) * cameraPageSize + i + 1}}</td>
                            <td>{{item.Name}}</td>
                            <td>{{item.Village_Name}}</td>
                            <td>{{item.MacAddress}}</td>
                            <td>{{item.Camera_Type | deviceType}}</td>
                            <td><span @click="checkDetail(item)" class="enabled" :class="[{onLine:item.IsOnline == 1},{notOnLine:item.IsOnline == 0}]">{{item.IsOnline | isOnline(item.IsOnline)}}</span></td>
                            <td>{{item.Insert_Time | transformDate}}</td>
                          </tr>
                          </tbody>
                          <tfoot v-if="cameraNoData">
                          <tr style="width: 100%; text-align: center;">
                            <td colspan="6" style="font-size: 16px;">暂无数据</td>
                          </tr>
                          </tfoot>
                        </table>
                        <!-- 分页 -->
                        <el-pagination
                          @size-change="handleSizeChangeCamera"
                          @current-change="handleCurrentChangeCamera"
                          :current-page="currentPageCamera"
                          :page-sizes="[10, 20, 50]"
                          :page-size="10"
                          layout="total, sizes, prev, pager, next, jumper"
                          :total="cameraHowMany">
                        </el-pagination>
                      </div>
                    </div>
                  </el-tab-pane>

                  <!-- tab3 烟感设备 -->
                  <el-tab-pane label="烟感设备" name="third">
                    <div class="smart-filter">
                      <div class="col-md-3 smart-query-input">
                        <div class="tableFliter smart-width">
                          <label  class="smart-query-label">设备名称</label>
                          <input  class="form-control" type="text" v-model="smokeName" placeholder="请输入">
                        </div>
                        <div class="tableFliter smart-width">
                          <label  class="smart-query-label">MAC地址</label>
                          <input class="form-control" type="text" placeholder="请输入">
                        </div>
                        <div class="tableFliter smart-width">
                          <label  class="smart-query-label">所属社区</label>
                          <el-select v-model="smokeVillage" id="community" placeholder="请选择">
                            <el-option value="">全部</el-option>
                            <el-option
                              v-for="(item,i) in smokeVillageData"
                              :key="i"
                              :label="item.Village_Name"
                              :value="item.Village_Id"
                            >
                            </el-option>
                          </el-select>
                        </div>
                        <div class="tableFliter smart-width">
                          <label  class="smart-query-label">设备状态</label>
                          <el-select v-model="smokeType" id="deviceStatus" placeholder="请选择">
                            <el-option value="">全部</el-option>
                            <el-option
                              v-for="(item,i) in typeData"
                              :key="i"
                              :label="item.name"
                              :value="item.isOnline"
                            >
                            </el-option>
                          </el-select>
                        </div>
                        <div class="ctrlBtnPanel smart-width" style="padding: 0 0 0 0; height: 88px">
                          <a class="ctrlBtn darkBtnPrimary no-border fliterBtn query-btn" style="cursor: pointer;"  @click="smokeQuery">
                            <strong>查询</strong>
                          </a>
                          <a class="ctrlBtn darkBtnPrimary no-border fliterBtn query-btn" style="cursor: pointer;"  @click="smokeReset">
                            <strong>重置</strong>
                          </a>
                        </div>
                      </div>


                    </div>
                    <div class="col-md-12" style="padding: 20px 0 0 0">
                      <div class="table-responsive">
                        <table style="width: 100%;">
                          <thead>
                          <tr style="height: 50px;">
                            <th style="width: 10%;">序号</th>
                            <th style="width: 15%;">设备名称</th>
                            <th style="width: 15%;">所属社区</th>
                            <th style="width: 20%;">MAC地址</th>

                            <th style="width: 10%;">设备状态</th>
                            <th style="width: 15%;">安装时间</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr style="height: 50px;" v-for="(item,i) in smokeTableData" :key="i">
                            <td>{{(smokePageNum - 1) * smokePageSize + i + 1}}</td>
                            <td>{{item.Name}}</td>
                            <td>{{item.Village_Name}}</td>
                            <td>{{item.MacAddress}}</td>

                            <td><span @click="checkDetail(item)" class="enabled" :class="[{onLine:item.IsOnline == 1},{notOnLine:item.IsOnline == 0}]">{{item.IsOnline | isOnline(item.IsOnline)}}</span></td>
                            <td>{{item.Insert_Time | transformDate}}</td>
                          </tr>
                          </tbody>
                          <tfoot v-if="smokeNoData">
                          <tr style="width: 100%; text-align: center;">
                            <td colspan="6" style="font-size: 16px;">暂无数据</td>
                          </tr>
                          </tfoot>
                        </table>
                        <!-- 分页 -->
                        <el-pagination
                          @size-change="handleSizeChangeSmoke"
                          @current-change="handleCurrentChangeSmoke"
                          :current-page="currentPageSmoke"
                          :page-sizes="[10, 20, 50]"
                          :page-size="10"
                          layout="total, sizes, prev, pager, next, jumper"
                          :total="smokeHowMany">
                        </el-pagination>
                      </div>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </div>
          </div>

          <!-- 弹框 -->
          <el-dialog title="设备详情" :visible.sync="deviceDetail" custom-class="editor innerShadow">

            <div>
              <div>
                <span class="model-item">设备名称</span>　<span class="model-item1">{{deviceName}}</span>
              </div>
              <div>
                <span class="model-item">安装位置</span>　<span class="model-item1">{{installLocation}}</span>
              </div>
              <div>
                <span class="model-item">MAC地址</span>　<span class="model-item1">{{MACAddress}}</span>
              </div>
              <div>
                <span class="model-item">设备类型</span>　<span class="model-item1">{{deviceType}}</span>
              </div>
              <div>
                <span class="model-item">当前状态</span>　<span class="model-item1">{{status | isOnline(status)}}</span>
              </div>
              <div>
                <span class="model-item">安装时间</span>　<span class="model-item1">{{installTime | transformDate}}</span>
              </div>
            </div>

            <div slot="footer" class="dialog-footer">
              <el-button type="cancel" @click="deviceDetail = false">确定</el-button>
            </div>
          </el-dialog>

        </div>
        <!-- /. PAGE INNER  -->
      </div>
    </div>
</template>

<script src="./SmartDevice.js">

</script>

<style scoped lang="scss" src="./SmartDevice.scss">

</style>
