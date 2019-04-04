<template>
  <div class="footer-wrapper flex-center">
    <div class="con">
      <p>Copyright © 2019 中国传媒大学. All rights reserved.</p>
      <p class="contact">技术支持：erbuiii@163.com</p>
      <img class="bg-ft" src="../../assets/imgs/problem_solving.svg">
    </div>
  </div>  
</template>

<script>
export default {

}
</script>

<style>
.footer-wrapper {
  width: 100%;
  height: 76px;
  font-size: 14px;
  color: #333;
  box-shadow: 0 -4px 5px -3px #eee; 
}
.footer-wrapper .con {
  position: relative;
  text-align: center;
}
.footer-wrapper .contact {
  font-size: 12px;
  line-height: 24px;
}
.footer-wrapper .bg-ft {
  position: absolute;
  top: -8px;
  left: -160px;
  width: 64px;
}
</style>
