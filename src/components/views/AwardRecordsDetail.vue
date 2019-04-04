<template>
  <div class="flex-center">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>获奖详情</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
      </div>
      <!-- <div v-for="o in 4" :key="o" class="text item">
        {{'列表内容 ' + o }}
      </div>-->
      <div class="col-sm-4">
        <div class="table-responsive">
          <table class="table">
            <tbody>
              <tr>
                <th style="width:30%">赛事名称:</th>
                <td>首届全国大学生大数据技能竞赛</td>
              </tr>
              <tr>
                <th>主办单位:</th>
                <td>中国大数据技术与应用联盟</td>
              </tr>
              <tr>
                <th>级别:</th>
                <td>国家学会级</td>
              </tr>
              <tr>
                <th>校赛承办:</th>
                <td>信息工程学院</td>
              </tr>
              <tr>
                <th>获奖时间:</th>
                <td>2018-12-08</td>
              </tr>
              <tr>
                <th>获奖学生:</th>
                <td>信息工程学院-小张(1621*****42)
                  <br>
                </td>
              </tr>
              <tr>
                <th>指导老师:</th>
                <td>信息工程学院-刘老师(00****37)
                  <br>信息工程学院-王老师(00****39)
                  <br>
                </td>
              </tr>
              <tr>
                <th>获奖证书:</th>
                <td><a href="http://www.fsfl.gov.cn/zwgk_1028934/ywdd/201512/W020151203598335847846.jpg">201510213048-小张.jpg</a>
                  <br>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 960px;
  margin-top: 100px;
}
</style>
