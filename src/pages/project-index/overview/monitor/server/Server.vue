<template>
  <div id="server" v-if="$store.state.header.headData.length > 0">
    <div id="page-wrapper">
      <div id="page-inner">
        <div class="row server-info-wrap strange left-right">
          <div class="col-md-12 server-info strange">
            <div class="panel panel-primary text-center no-border innerShadow2 server-height strange">
              <div class="col-md-2 server-btn strange">
                <div class="serverPanel">
                  <button class="  serverBtn"><div style="display: flex;align-items: center;justify-content: center;"><i  class="fas fa-4x fa-server"></i></div></button>
                  <span class=" serverBadge" v-if="ifWarning" @click="toWarningEvent" style="cursor: pointer;">{{warningNum}}</span>
                </div>
              </div>
              <div class="col-md-6 server-action">
                <div class="showCase2" id="runTimeChart" style="background-color: transparent"></div>
              </div>
              <div class="col-md-4 interrupt" style="padding: 0 0">
                <div class="showCase2">
                  <div class="showCase strange" style="margin: 10px 0;position: relative;">
                    <h5>累计中断</h5>
                    <h3 id="countBreak" style="cursor: default; font-size: 40px">{{interrupt}}<span style="font-size: 14px">次</span></h3>
                    <ul class="server-break innerShadow">
                      <li v-for="(item,i) in interruptdetail" :key="i">中断时间　{{item.offTime | transformDate}}　持续时间　{{item.continuedTime | formatSec}}</li>
                    </ul>
                  </div>

                </div>
              </div>
              <div class="col-md-12 divideLine"></div>
              <div class="col-md-3 server-cpu-per">
                <div class="panel-right">
                  <h5 class="customH5">CPU平均负载 (5min)</h5>
                  <h3 class="customH3">{{cpuLoadAve}}%</h3>
                </div>
              </div>
              <div class="col-md-3 server-memory-per">
                <div class="panel-right">
                  <h5 class="customH5">可用内存百分比</h5>
                  <h3 class="customH3">{{memoryFree}}%</h3>
                </div>
              </div>
              <div class="col-md-3 server-disk-per">
                <div class="panel-right">
                  <h5 class="customH5">磁盘可用空间占比</h5>
                  <h3 class="customH3">{{diskFree}}%</h3>
                </div>
              </div>
              <div class="col-md-3 server-network">
                <div class="panel-right">

                  <h5 class="customH5">网络流入流量</h5>
                  <h3 class="customH3">{{network}}M</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row chart left-right">
          <div class="col-md-12">
            <div class="panel panel-primary no-border innerShadow2">
              <div class="panel-body">
                <div class="col-md-11 quota-btn left-right">
                  <div id="defineBtnGroup">
                    <div class="button-group">
                      <!--<button  type="button" class="  button-tiny btnLight  active">-->
                        <!--<strong>CPU平均负载(15min)</strong>-->
                      <!--</button>-->
                      <!-- 服务器指标按钮 -->
                      <button v-for="(item,i) in btnArr" type="button" @click="tap(item,i)" class="button-tiny btnLight" :class="{active:i==serverOptionIndex}">
                        <strong>{{item.name}}</strong>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="col-md-1 quota-change">
                  <div style="cursor: pointer">
                    <a class="" style="color: #4681FF" @click="dialogFormVisible = true">编辑指标</a>
                  </div>
                  <!-- 弹框编辑指标 -->
                  <el-dialog title="编辑指标(最多6个)" :visible.sync="dialogFormVisible" custom-class="editor innerShadow">
                    <div class="serverQuota" v-for="(item, i) in serverQuota" :key="i" :checked="item.checked">
                      <p>{{item.title}}</p>
                      <el-checkbox v-for="(items, index) in item.content" @change="changeCheckbox" :key="index" :disabled="checkboxDisabled(items)" v-model="items.checked">{{items.name}}</el-checkbox>

                      <!--<label @click="changeCheckbox($event, items)" v-for="(items, index) in item.content" :key="index"><input name="quota" type="checkbox" v-model="items.checked">{{items.name}}</label>-->
                    </div>
                    <div slot="footer" class="dialog-footer">
                      <el-button type="confirm" @click="confirm">确 定</el-button>
                      <el-button type="cancel" @click="dialogFormVisible = false">取 消</el-button>
                    </div>
                  </el-dialog>
                </div>
                <div class="col-md-12 quota-date" style="margin-top:10px; z-index: 100;padding-left:15px">
                  <div class="">
                    <!--<button type="button" class=" button-tiny btnLight active">-->
                      <!--<strong>近1天</strong>-->
                    <!--</button>-->
                    <button v-for="(item,i) in daysPick" @click="daysTab(item,i)" type="button" class="button-tiny btnLight" :class="{active:i==dayOptionIndex}">
                      <strong>{{item.name}}</strong>
                    </button>

                  </div>
                </div>
                <div id="mainChart" ref="mainchart" style="width: 100%; height: 500px; margin-top: 50px; margin-bottom: 30px"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="row chart" v-show="processVisible" v-if="ifNoData">
          <div class="col-md-6 process-ranking">
            <div class="panel panel-primary no-border innerShadow2">
              <div class="panel-body" style="padding: 10px 10px">
                <div id="processChart" style="width: 100%; height: 300px"></div>
              </div>
            </div>
          </div>
          <div class="col-md-6 process-change">
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

<script src="./Server.js">

</script>

<style scoped src="./Server.scss" lang="scss">

</style>
