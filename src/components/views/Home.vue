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
            <li class="clearfix" v-for="item in newsList" :key="item.id" @click="navigateTo('/news/detail',{ id: item.id })">
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
      newsList: []
    }
  },
  created() {
    this._initNewsData()
  },
  methods: {
    goToDetails() {
      
    },
    /**
     * 路由跳转
     */
    navigateTo(path, query) {
      if (query) {
        this.$router.push({
          path: path,
          query: query
        })
      } else {
        this.$router.push(path)
      }
    },
    _initNewsData() {
      this.newsList = []
      let params = {
        currentPage: 1,
        pageSize: 7
      }
      this.getNewsList(params)
    },
    getNewsList(params) {
      this.axios.get('/api/news', { params: params }).then(response => {
        let res = response.data
        if (res.status == 0) {
          let data = res.data.list
          this.totalCount = res.data.total
          _.forEach(data, item => {
            let obj = {}
            obj.id = item._id
            obj.title = item.title
            obj.createDate = item.create_date
            obj.content = item.content
            this.newsList.push(obj)
          })
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
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
}
.el-row:last-child {
  margin-bottom: 0;
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

