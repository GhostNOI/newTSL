<template>
    <div id="database">
      <div id="page-wrapper">
        <div id="page-inner">
          <div class="row database-top">
            <div class="panel panel-primary text-center no-border innerShadow2">
              <div class="col-md-2 borderRightDivide width-float">
                <div class="serverPanel" style="text-align: center">
                  <button class="button button-primary button-rounded serverBtn"><div style="display: flex;justify-content: center;align-items: center;"><i class="fas fa-4x fa-database"></i></div></button>
                  <span class="serverBadge" style="float: none;cursor: pointer;" @click="toWarningEvent" v-if="ifWarning">4</span>
                </div>
              </div>
              <div class="col-md-2 borderRightDivide width-float">
                <div class="panel-right" >
                  <h5 class="customH5" style="margin-bottom: -10px">连接数</h5>
                  <h3 class="customH3">{{connectionTotal}}</h3>
                </div>
              </div>
              <div class="col-md-2 borderRightDivide width-float">
                <div class="panel-right">
                  <h5 class="customH5" style="margin-bottom: -10px">最大支持连接数</h5>
                  <h3 class="customH3">{{concurrency}}</h3>
                </div>
              </div>
              <div class="col-md-2 borderRightDivide width-float">
                <div class="panel-right">
                  <h5 class="customH5" style="margin-bottom: -10px">慢查询数</h5>
                  <h3 class="customH3 ">{{slowQueryCount}}</h3>
                </div>
              </div>
              <div class="col-md-4 backup" style="padding: 0 0">
                <div class="showCase2 right-left visible-info" >
                  <div class="col-md-6 manual-backup">
                    <h5 class="customH5-2" style="margin-top: 7px;">上次备份时间</h5>
                    <h5 class="customH5-2" id="lastBackup" style="cursor: default">{{lastBackupTime}}</h5>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <div class="row database-bottom">
            <div class="panel panel-primary no-border innerShadow2">
              <div class="panel-body">
                <div class="col-md-11 quota-btn">
                  <div id="defineBtnGroup">
                    <div class="button-group">
                      <!--<button id="chartBtn0" type="button" class="button button-border button-tiny btnLight active">-->
                        <!--<strong>连接数</strong>-->
                      <!--</button>-->
                      <button v-for="(item,i) in btnArr" type="button" @click="tap(item,i)" class="button-tiny btnLight" :class="{active:i==databaseOptionIndex}">
                        <strong>{{item.name}}</strong>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="col-md-1 quota-change">
                  <div style="cursor: pointer">
                    <a class="selectModal" style="color: #4681FF" @click="dialogFormVisible = true">编辑指标</a>
                  </div>
                  <el-dialog title="编辑指标(最多6个)" :visible.sync="dialogFormVisible" custom-class="editor innerShadow">

                    <div class="serverQuota" v-for="(item, i) in databaseProject" :key="i" :checked="item.checked">
                      <p>{{item.title}}</p>
                      <el-checkbox v-for="(items, index) in item.content" @change="changeCheckbox" :key="index" :disabled="checkboxDisabled(items)" v-model="items.checked">{{items.name}}</el-checkbox>

                      <!--<label @click="changeCheckbox($event, items)" v-for="(items, index) in item.content" :key="index"><input name="quota" type="checkbox" v-model="items.checked">{{items.name}}</label>-->
                    </div>
                    <div slot="footer" class="dialog-footer">
                      <el-button type="confirm" @click="sure">确 定</el-button>
                      <el-button type="cancel" @click="dialogFormVisible = false">取 消</el-button>
                    </div>
                  </el-dialog>
                </div>
                <div class="col-md-12 quota-date" style="margin-top:10px; z-index: 100">
                  <div class="button-group">
                    <!--<button type="button" class="button button-border button-tiny btnLight active">-->
                      <!--<strong>近1天</strong>-->
                    <!--</button>-->
                    <button v-for="(item,i) in daysPick" @click="daysTab(item,i)" type="button" class="button-tiny btnLight" :class="{active:i==dayOptionIndex}">
                      <strong>{{item.name}}</strong>
                    </button>
                  </div>
                </div>
                <div id="mainChart" style="width: 100%; height: 500px; margin-top: 50px; margin-bottom: 30px"></div>
              </div>
            </div>
          </div>

        </div>
        <!-- /. PAGE INNER  -->
      </div>
    </div>
</template>

<script src="./Database.js">

</script>

<style scoped lang="scss" src="./Database.scss">

</style>
