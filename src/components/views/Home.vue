<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="18">
        <div class="card carousel-wrapper">
          <el-carousel trigger="click" height="150px">
            <el-carousel-item v-for="item in imgList" :key="item">
              <img class="carousel-img" :src="item" alt="">
            </el-carousel-item>
          </el-carousel>
        </div>

        <div class="card news">
          <div class="hd clearfix">
            <span>新闻动态</span>
            <span class="more" @click="navigateTo('/news')">more</span>
          </div>
          <ul class="card-con">
            <li class="clearfix" v-for="item in newsList" :key="item.id">
              <span>{{item.title}}</span>
              <span class="time">{{item.createDate}}</span>  
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="card">
          <div class="hd">
            <span>常用下载</span>
            <span class="more">more</span>
          </div>
          <ul class="card-con">
            <li><span>下载链接1</span></li>
            <li><span>下载链接2</span></li>
            <li><span>下载链接3</span></li>
            <li><span>下载链接4</span></li>
            <li><span>下载链接5</span></li>
            <li><span>下载链接6</span></li>
          </ul>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgList: [
        require('../../assets/imgs/a1.png'),
        require('../../assets/imgs/a2.png'),
        require('../../assets/imgs/a6.png')
      ],
      newsList: [
        { id: 1, title: '2019年全国大学生英语竞赛北京赛区初赛暨中国传媒大学2019年英语笔试竞赛报名通知', createDate: '2019/03/12' },
        { id: 2, title: '关于准备举办中国传媒大学第四届中国“互联网＋”大学生创新创业大赛校内选拔赛的通知', createDate: '2018/04/02' },
        { id: 3, title: '关于2017“外研社杯”英语阅读写作大赛线上初赛时间和地点的通知', createDate: '2017/10/11' },
        { id: 4, title: '关于举办北京市大学生英语演讲比赛预赛的通知', createDate: '2017/09/27' },
        { id: 5, title: '关于2017“外研社杯”全国阅读写作大赛官网信息认证的通知', createDate: '2017/09/25' },
        { id: 6, title: '关于举办中国传媒大学第三届中国“互联网＋”大学生创新创业大赛校内选拔赛的通知', createDate: '2017/05/11' },
        { id: 7, title: '2017年全国大学生英语竞赛初赛颁奖及经验交流会通知', createDate: '2017/04/21' },
      ]
    }
  },
  methods: {
    /**
     * 路由跳转
     */
    navigateTo(path) {
      this.$router.push(path)
    }
  }
}
</script>

<style scoped>
.carousel-img {
  width: 100%;
}
.card {
  border-radius: 4px;
  overflow: hidden;
  box-shadow:0px 4px 8px 0px rgba(0,0,0,0.15);
}
.card .hd .more {
  float: right;
  color: #9EACCF;
  font-weight: 600;
  line-height: 20px;
}
.card .hd .more:hover {
  cursor: pointer;
  color: #8a97b7;
}
.news {
  margin-top: 24px;
  height: 37vh;
}
.time {
  float: right;
  color: #666;
  font-weight: 500;
}
.time:hover {
  color: #181938;
  cursor: default;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
<style>
.carousel-wrapper .el-carousel__button {
  background-color: #FFA400 !important;
}
</style>

