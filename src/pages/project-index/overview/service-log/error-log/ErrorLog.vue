<template>
  <div id="error-log">
    <div id="page-wrapper">
      <div id="page-inner">

        <div class="row errorlog-wrap">
          <div class="col-md-12">
            <div class="panel panel-primary no-border innerShadow2">
              <div class="panel-body">
                <div class="tableFliter" style="overflow:hidden;">
                  <div class="data-pick-fixed" style="width: 25%;float: left;">
                    <span class="title">时间</span>
                    <input type="radio" v-model="dayType" class="date-pick-radio" id="one" value="1" name="data-pick"><label class="date-pick-label" for="one">近1天</label>
                    <input type="radio" v-model="dayType" class="date-pick-radio" id="seven" value="7" name="data-pick"><label class="date-pick-label" for="seven">近7天</label>
                    <input type="radio" v-model="dayType" class="date-pick-radio" id="thirty" value="30" name="data-pick"><label class="date-pick-label" for="thirty">近30天</label>
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
                <div id="mainChart" style="width: 100%; height: 500px; margin-top: 50px; margin-bottom: 30px"></div>
                <div class="" style="width: 100%; overflow: hidden;" v-if="noData">
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
                    <tbody>
                    <tr v-for="(item,i) in tableData1" :key="i" style="height: 50px;">
                      <td style="word-wrap:break-word;word-break:break-all;">{{item.Insert_Time | transformDate}}</td>
                      <td style="word-wrap:break-word;word-break:break-all;">{{item.ClientIp}}</td>
                      <td style="word-wrap:break-word;word-break:break-all;">{{item.ErrorCode}}</td>
                      <td style="word-wrap:break-word;word-break:break-all;">{{item.Host}}</td>
                      <td style="word-wrap:break-word;word-break:break-all;">{{item.Post}}</td>
                      <td style="word-wrap:break-word;word-break:break-all;">{{item.RequestId}}</td>
                      <td style="word-wrap:break-word;word-break:break-all;">{{item.Response}}</td>
                      <td style="word-wrap:break-word;word-break:break-all;">{{item.URI}}</td>
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

      </div>
      <!-- /. PAGE INNER  -->
    </div>
  </div>
</template>

<script src="./ErrorLog.js">

</script>

<style scoped lang="scss" src="./ErrorLog.scss">

</style>
