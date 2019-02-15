<template>
  <div class="wrapper flexbox">
    <div class="logo"></div>
    <h2 class="title">学科竞赛管理系统</h2>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.wrapper {
  height: 150px;
  padding: 0 20px;
  background: #667db6;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #667db6, #0082c8, #0082c8, #667db6);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #667db6, #0082c8, #0082c8, #667db6); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.wrapper .title {
  padding-left: 10px;
  color: #fff;
  font-weight: 400;
  letter-spacing: 1px;
}
.wrapper .logo {
  width: 288px;
  height: 63px;
  background: url('../../assets/imgs/logo-top.png') no-repeat;
}
</style>
