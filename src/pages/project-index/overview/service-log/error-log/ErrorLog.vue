<template>
  <div id="error-log">
    <div id="page-wrapper">
      <div id="page-inner">

        <div class="row errorlog-wrap">
          <div class="col-md-12">
            <div class="panel panel-primary no-border innerShadow2">
              <div class="panel-body">
                <div class="tableFliter" style="overflow:hidden;">
                  <div class="data-pick-fixed" style="width: 7%;float: left;">
                    <span class="title">时间</span>
                    <!--<input type="radio" v-model="dayType" class="date-pick-radio" id="one" value="1" name="data-pick" checked>-->
                    <!--<label class="date-pick-label" for="one">近1天</label>-->
                    <!--<input type="radio" v-model="dayType" class="date-pick-radio" id="seven" value="7" name="data-pick">-->
                    <!--<label class="date-pick-label" for="seven">近7天</label>-->
                    <!--<input type="radio" v-model="dayType" class="date-pick-radio" id="thirty" value="30" name="data-pick">-->
                    <!--<label class="date-pick-label" for="thirty">近30天</label>-->
                  </div>
                  <div class="date-pick" style="width: 40%; float: left;">
                    <el-date-picker
                      @change="changeTime"
                      v-model="datePick"
                      popper-class="date-pick"
                      type="daterange"
                      value-format="yyyy-MM-dd"
                      range-separator="——"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                  </div>

                  <div class="ctrlBtnPanel" style="width: 30%;float: right;">
                    <a class=" ctrlBtn darkBtnPrimary no-border query-btn" style="cursor: pointer;" @click="query"><strong>查询</strong></a>
                    <a class=" ctrlBtn darkBtnPrimary no-border query-btn" style="cursor: pointer;" @click="resetForm"><strong>重置</strong></a>
                  </div>
                </div>
                <!--<div id="mainChart" style="width: 100%; height: 500px; margin-top: 50px; margin-bottom: 30px"></div>-->
                <div class="" style="width: 100%; overflow: hidden;">
                  <table style="width: 100%;">
                    <thead>
                    <tr>
                      <th style="width: 10%;">time</th>
                      <th style="width: 10%;">ClientIp</th>
                      <th style="width: 5%;">ErrorCode</th>
                      <th style="width: 10%;">Host</th>
                      <th style="width: 20%;">Post</th>
                      <th style="width: 10%;">RequestId</th>
                      <th style="width: 25%;">Response</th>
                      <th style="width: 10%;">URI</th>
                    </tr>
                    </thead>
                    <tbody style="width: 100%;">
                    <tr v-for="(item,i) in tableData1" :key="i" style="height: 50px;">
                      <td style="word-wrap:break-word;word-break:break-all;width: 10%;">{{item.Insert_Time | transformDate}}</td>
                      <td style="word-wrap:break-word;word-break:break-all;width: 10%">{{item.ClientIp}}</td>
                      <td style="word-wrap:break-word;word-break:break-all;width: 5%">{{item.ErrorCode}}</td>
                      <td style="word-wrap:break-word;word-break:break-all;width: 10%">{{item.Host}}</td>
                      <td style="word-wrap:break-word;word-break:break-all;width: 20%"><span class="post" :title="item.Post">{{item.Post}}</span></td>
                      <td style="word-wrap:break-word;word-break:break-all;width: 10%">{{item.RequestId}}</td>
                      <td style="width: 25%;"><span class="response" :title="item.Response">{{item.Response}}</span></td>
                      <td style="word-wrap:break-word;word-break:break-all;width: 10%;">{{item.URI}}</td>
                    </tr>
                    </tbody>
                  </table>
                  <div style="text-align: center;color: #fff;font-size: 20px;margin-top: 20px"  v-if="noData">
                    暂无数据
                  </div>

                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
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

      </div>
      <!-- /. PAGE INNER  -->
    </div>
  </div>
</template>

<script src="./ErrorLog.js">

</script>

<style scoped lang="scss" src="./ErrorLog.scss">

</style>
