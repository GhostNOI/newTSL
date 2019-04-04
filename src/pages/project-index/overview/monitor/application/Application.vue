<template>
    <div id="application">
      <div id="page-wrapper">
        <div id="page-inner">
          <div class="row application-top">
            <div class="panel panel-primary text-center no-border innerShadow2">
              <div class="col-md-3 borderRightDivide application-btn">
                <div class="serverPanel" style="text-align: center">
                  <!--图片-->
                  <!--<button class="button button-primary button-rounded serverBtn"><div style="display: flex;justify-content: center;align-items: center;"><i class="fas fa-4x fa-cube"></i></div></button>-->
                  <img src="../../../../../assets/img/applactionicon.png">
                  <span class="serverBadge" style="float: none; cursor: pointer;" v-if="+warningNum > 0" @click="toWaringEvent">{{warningNum}}</span>
                </div>
              </div>
              <!--<div class="scroll-wrap">-->
                <!--<div class="left-arrow" v-if="" @click="moveLeft"><img style="width: 20px;" src="http://47.96.70.222:8080/image/angleLeft.svg"></div>-->
                <!--<div class="right-arrow" v-if="" @click="moveRight"><img style="width: 20px;" src="http://47.96.70.222:8080/image/angleRight.svg"></div>-->
                <!--<div  ref="scrollWrap">-->
              <div class="wrap" ref="scrollWrap">
                <!--<div class="left-arrow" v-if="showLeft" @click="moveLeft"><img style="width: 20px;" src="http://47.96.70.222:8080/image/angleLeft.svg"></div>-->
                <!--<div class="right-arrow" v-if="showRight" @click="moveRight"><img style="width: 20px;" src="http://47.96.70.222:8080/image/angleRight.svg"></div>-->
                <!--<div class="left-arrow" @click="moveLeft"><img style="width: 20px;" src="http://47.96.70.222:8080/image/angleLeft.svg"></div>-->
                <!--<div class="right-arrow" @click="moveRight"><img style="width: 20px;" src="http://47.96.70.222:8080/image/angleRight.svg"></div>-->
                <div class="left-arrow" @click="moveRight"><img style="width: 20px;" src="http://47.96.70.222:8080/image/angleLeft.svg"></div>
                <div class="right-arrow" @click="moveLeft"><img style="width: 20px;" src="http://47.96.70.222:8080/image/angleRight.svg"></div>
                <div class="scroll-wrap" >
                  <div class="item-wrap" ref="scrollArea">
                    <div class=" borderRightDivide application-item scroll-item" v-for="(item,i) in topData" :key="i">
                      <div class="panel-right">
                        <h5 class="customH5" style="padding:0;height:38px;line-height: 38px;margin-top: 30px;">
                          {{item.Containers_Type_Name}}(项)</h5>
                        <h3 class="customH3" style="height: 30px;line-height: 30px;margin-top: 10px;">{{item.num}}</h3>
                      </div>
                    </div>
                    <!--<div class=" borderRightDivide application-item scroll-item" v-for="(item,i) in topData" :key="i+100">-->
                      <!--<div class="panel-right">-->
                        <!--<h5 class="customH5" style="padding:0;height:38px;line-height: 38px;margin-top: 30px;">-->
                          <!--{{item.Containers_Type_Name}}(项)</h5>-->
                        <!--<h3 class="customH3" style="height: 30px;line-height: 30px;margin-top: 10px;">{{item.num}}</h3>-->
                      <!--</div>-->
                    <!--</div>-->
                  </div>
                </div>
              </div>

              <!--</div>-->



            </div>
          </div>

          <div class="row application-bottom">
            <div class="panel panel-primary no-border innerShadow2">
              <div class="panel-body">
                <div class="table-responsive">
                  <table style="width: 100%;color:#D6E4FF;">
                    <thead>
                    <tr>
                      <td style="width: 10%;"></td>
                      <td style="width: 20%;">监控项</td>
                      <td style="width: 50%;">运行状态</td>
                      <td style="width: 20%;"></td>
                    </tr>
                    </thead>
                    <tbody v-for="(item,i) in tableData" :key="i">
                    <tr @click="changeChecked(item)">
                      <td></td>
                      <td style=" font-weight: 100;color: #c8d5ef;">{{item.Services_Type_Name}}</td>
                      <td><span class="extend" :class="[{normal:item.list.length !== 0},{abnormal:item.list.length === 0}]">{{item.list.length ? '异常' : '正常'}}</span></td>
                      <td></td>
                    </tr>
                    <tr v-for="(listItem,listIndex) in item.list" :key="listIndex" v-if="item.checked" class="tableII">
                      <td></td>
                      <td></td>
                      <td>{{listItem.Message}}</td>
                      <td>{{listItem.Warning_Time | transformDate}}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>


              </div>
            </div>
          </div>

        </div>
        <!-- /. PAGE INNER  -->
      </div>
    </div>
</template>

<script src="./Application.js">

</script>

<style scoped lang="scss" src="./Application.scss">

</style>
