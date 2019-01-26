<template>
  <div id="tendency">
    <div id="page-wrapper">
      <div id="page-inner">
        <div class="row diagram">
          <div class="col-md-12">
            <div class="panel panel-primary no-border innerShadow2">
              <div class="panel-body">
                <div class="listTitle" style="margin-top: 0">
                  <div class="block">
                    <!--<el-date-picker-->
                      <!--v-model="value4"-->
                      <!--popper-class="date-pick"-->
                      <!--type="datetimerange"-->
                      <!--range-separator="——"-->
                      <!--start-placeholder="开始日期"-->
                      <!--end-placeholder="结束日期">-->
                    <!--</el-date-picker>-->
                  </div>
                  <div class="tendency-date">
                    <span>{{startTime}}</span> — <span>{{endTime}}</span>
                  </div>
                </div>
                <div class="divideLine"></div>
                <div id="mainChart" style="width: 100%; height: 500px; margin-top: 10px; margin-bottom: 30px"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="row diagram strange" style="width: 100%;">
          <div class="col-md-6 process-ranking strange">
            <div class="panel panel-primary no-border innerShadow2">
              <div class="pandl-body" style="padding: 10px 10px">
                <div id="processChart" style="width: 100%; height: 300px"></div>
              </div>
            </div>
          </div>
          <div class="col-md-6 process-change strange">
            <div class="panel panel-primary no-border innerShadow2">
              <div class="panel-body" style="padding: 10px 10px">
                <div id="processLineChart" style="width: 100%; height: 300px"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <!-- /. PAGE INNER  -->
    </div>
  </div>
</template>

<script src="./Tendency.js">

</script>

<style scoped lang="scss" src="./Tendency.scss">

</style>
