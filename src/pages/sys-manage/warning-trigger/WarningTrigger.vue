<template>
    <div id="warning-trigger">
      <div id="page-wrapper">
        <div id="page-inner">
          <div class="row warning-trigger-wrap">
            <div class="panel panel-primary no-border innerShadow2">
              <div class="panel-body">
                <div class="warning-query">
                  <div class=" warning-width4">
                    <div class="tableFliter">
                      <label class="warning-trigger-label">项目所在地</label>
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
                  <div class=" warning-width4">
                    <div class="tableFliter">
                      <label  class="warning-trigger-label">项目名称</label>
                      <el-select v-model="projectCode"  placeholder="请选择" @change="getName">
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
                  <div class=" warning-width2" >
                    <div class="ctrlBtnPanel" style="padding: 0px;height: 38px;">
                      <a class="darkBtnPrimary no-border warning-query-btn" @click="query" style="cursor: pointer;margin-right: 30px;">
                        <strong>查询</strong>
                      </a>
                      <a class="darkBtnPrimary no-border warning-query-btn" @click="resetForm" style="cursor: pointer;">
                        <strong>重置</strong>
                      </a>
                    </div>
                  </div>
                </div>


                <!-- 显示表格 -->
                <div class="col-md-12 warning-table-wrap">
                  <div style="color: #fff;">项目名称：{{projectName}}</div>
                 <table style="width: 100%">
                   <thead class="warning-table-head">
                   <tr>
                     <th style="width: 5%;"></th>
                     <th style="width: 5%;">监控项</th>
                     <th style="width: 30%;">监控项名称</th>
                     <th style="width: 25%;">触发器</th>
                     <th style="width: 20%;">预警值</th>
                     <th style="width: 10%;">触发等级</th>
                     <!--<th>采集间隔</th>-->
                     <th style="width: 5%;">操作</th>
                     <th style="width: 5%;"></th>
                   </tr>
                   </thead>
                   <tbody v-for="(item, i) in tableData1" :key="i">
                   <tr>
                     <td class="warning-table-open" @click="changeSelect(item)"><i class="iconfont">{{item.checked ? '-' : '+'}}</i></td>
                     <td>{{item.name | toChinese}}</td>
                     <td>{{item.warningNameMount}}项</td>
                     <td>{{item.RuleMount}}项</td>
                     <td></td>
                     <td></td>
                     <td></td>
                   </tr>
                   <tr class="warning-table-extend" v-for="(innerItem, innerIndex) in item.detial" :key="innerIndex" v-if="item.checked">
                     <td></td>
                     <td></td>
                     <td>{{innerItem.Name}}</td>
                     <td>{{innerItem.Description}}{{innerItem.Operator}}{{+innerItem.Rule_Id === 2 || +innerItem.Rule_Id === 4 || +innerItem.Rule_Id === 5 || +innerItem.Rule_Id === 7 ? +innerItem.Condition*100 : innerItem.Condition}}{{innerItem.Company}}</td>
                     <td>
                       <!-- 修改预警值 -->
                       <span v-if="!innerItem.changed">{{innerItem.Condition | threshold}}</span>
                       <input class="warning-ipt" type="text" v-if="innerItem.changed" v-model="threshold">
                     </td>
                     <td>
                       <!-- 修改预警等级 -->
                       <span v-if="!innerItem.changed">{{innerItem.Warning_Level | triggerLevel}}</span>
                       <el-select v-model="innerItem.Warning_Level" placeholder="请选择触发等级" v-if="innerItem.changed" @change="changeVal">
                         <el-option
                           v-for="(levelItem, levelIndex) in waringLevel"
                           :key="levelIndex"
                           :label="levelItem.Level_Name"
                           :value="levelItem.Warning_Level">
                         </el-option>
                       </el-select>
                     </td>
                     <!--<td></td>-->
                     <td style="color: #447cf4; cursor: pointer" @click="changeLevel(innerItem,innerIndex)">{{innerItem.changed ? '保存' : '修改'}}</td>
                   </tr>
                   </tbody>
                 </table>

                  <div class="default-tip" v-if="defaultIpt">
                    请选择项目并搜索
                  </div>



                  <!--<table class="table darkTable warning-table">-->
                    <!--<thead>-->
                    <!--<tr>-->
                      <!--<th style="width: 5%"></th>-->
                      <!--<td style="width: 15%">监控项</td>-->
                      <!--<td style="width: 20%">监控项名称</td>-->
                      <!--<td style="width: 30%">触发器</td>-->
                      <!--<td style="width: 10%">触发等级</td>-->
                      <!--<td style="width: 10%">采集间隔</td>-->
                      <!--<td style="width: 10%">编辑</td>-->
                    <!--</tr>-->
                    <!--</thead>-->
                    <!--<tbody>-->
                    <!--<tr>-->
                      <!--<th><i class="far fa-plus-square"></i></th>-->
                      <!--<td>系统</td>-->
                      <!--<td>5项</td>-->
                      <!--<td>2项</td>-->
                      <!--<td></td>-->
                      <!--<td></td>-->
                      <!--<td></td>-->
                    <!--</tr>-->
                    <!--<tr>-->
                      <!--<th><i class="far fa-minus-square"></i></th>-->
                      <!--<td>CPU</td>-->
                      <!--<td>3项</td>-->
                      <!--<td>2项</td>-->
                      <!--<td></td>-->
                      <!--<td></td>-->
                      <!--<td></td>-->
                    <!--</tr>-->
                    <!--<tr class="subTd">-->
                      <!--<th></th>-->
                      <!--<td>平均负载 (1min)</td>-->
                      <!--<td>Processor load (1 min average per core)</td>-->
                      <!--<td>{TemplateOSLinux:system.cpu.load[percpu,avg1].avg(5m)}>5</td>-->
                      <!--<td><span class="badge badgeSerious">严重</span></td>-->
                      <!--<td>1min</td>-->
                      <!--<td><a class="enabled">修改</a></td>-->
                    <!--</tr>-->
                    <!--<tr class="subTd">-->
                      <!--<th></th>-->
                      <!--<td>服务占用的CPU时间</td>-->
                      <!--<td>CPU steal time</td>-->
                      <!--<td></td>-->
                      <!--<td></td>-->
                      <!--<td>1min</td>-->
                      <!--<td></td>-->
                    <!--</tr>-->
                    <!--<tr class="subTd">-->
                      <!--<th></th>-->
                      <!--<td>软中断消耗时间</td>-->
                      <!--<td>CPU softirq time</td>-->
                      <!--<td></td>-->
                      <!--<td></td>-->
                      <!--<td>1min</td>-->
                      <!--<td></td>-->
                    <!--</tr>-->
                    <!--<tr>-->
                      <!--<th><i class="far fa-plus-square"></i></th>-->
                      <!--<td>内存</td>-->
                      <!--<td>5项</td>-->
                      <!--<td>2项</td>-->
                      <!--<td></td>-->
                      <!--<td></td>-->
                      <!--<td></td>-->
                    <!--</tr>-->
                    <!--<tr>-->
                      <!--<th><i class="far fa-plus-square"></i></th>-->
                      <!--<td>磁盘</td>-->
                      <!--<td>5项</td>-->
                      <!--<td>2项</td>-->
                      <!--<td></td>-->
                      <!--<td></td>-->
                      <!--<td></td>-->
                    <!--</tr>-->
                    <!--<tr>-->
                      <!--<th><i class="far fa-plus-square"></i></th>-->
                      <!--<td>自动发现</td>-->
                      <!--<td>5项</td>-->
                      <!--<td>2项</td>-->
                      <!--<td></td>-->
                      <!--<td></td>-->
                      <!--<td></td>-->
                    <!--</tr>-->
                    <!--</tbody>-->
                  <!--</table>-->
                </div>
              </div>
            </div>
          </div>

        </div>
        <!-- /. PAGE INNER  -->
      </div>
    </div>
</template>

<script src="./WarningTrigger.js">

</script>

<style scoped lang="scss" src="./WarningTrigger.scss">

</style>
