<template>
  <div id="notfound">
    <div id="page-wrapper">
      <div id="page-inner">
        <div style="width: 500px; display: table; margin: auto; color: #D6E4FF; padding-top: 200px">
          <img src="../../assets/img/404error.png" style="width: 500px">
          <h4 style="text-align: center; margin-top: 20px">很抱歉，没有找到您要访问的页面！</h4>
          <h5 style="font-weight: 200; text-align: center; margin-top: 20px"><span id="countTimer">{{date}}</span> 秒后自动返回首页</h5>
          <button @click="toIndex" class="button-primary button-small btn" style="display: table; margin: auto; margin-top: 20px"><strong>返回首页</strong></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./Notfound.js">

</script>

<style scoped lang="scss" src="./Notfound.scss">

</style>
