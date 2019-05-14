<template>
  <div>
    <el-header class="clearfix">
      <h3 class="title">{{title}}</h3>
      <span class="label float-r">发布时间：{{createTime}}</span>
    </el-header>
    <el-main>
      <div v-html="content">
        {{content}}
      </div>
    </el-main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      content: '',
      createTime: ''
    }
  },
  activated() {
    this.getNewsDetails()
  },
  deactivated() {
    this.reset()
  },
  methods: {
    getNewsDetails() {
      let id = this.$route.query.id
      this.axios.get(`/api/news/${id}`, {}).then(response => {
        let res = response.data
        if (res.status == 0) {
          this.title = res.data.title
          this.content = res.data.content
          this.createTime = res.data.create_date
        } else {
          this.$message.error(res.msg)
        }
      }).catch(res => {
        console.log(res)
      })
    },
    reset() {
      this.title = ''
      this.content = ''
      this.createTime = ''
    },
  }
}
</script>

<style scoped>
.title {
  color: #303133;
  text-align: center;
}
.label {
  color: #909399;
  font-size: 14px;
}
</style>
