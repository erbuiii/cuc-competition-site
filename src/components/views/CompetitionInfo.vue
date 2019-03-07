<template>
  <div>
    <div>
      <el-table
        :data="compList"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="竞赛名称"
          width="280">
        </el-table-column>
        <el-table-column
          prop="organizer"
          label="承办单位/部门"
        >
        </el-table-column>
        <el-table-column
          prop="level"
          label="级别">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="100"
          :filters="[{ text: '未开始', value: '未开始' }, { text: '申报中', value: '申报中' }, { text: '进行中', value: '进行中' }, { text: '已结束', value: '已结束' }]"
          :filter-method="filterTag"
          filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status === '已结束' ? 'primary' : 'success'"
              disable-transitions>{{scope.row.status}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">详情</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">参加</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="flex-row">
      <el-pagination
        :page-size="15"
        :pager-count="11"
        layout="prev, pager, next"
        :total="150">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      compList: [
        {name: '中国“互联网+”大学生创新创业大赛', organizer: '信息工程学院', level: '国家级', status: '未开始'}, // status:0未开始 1申报中 2进行中 3已结束
        {name: '中国“互联网+”大学生创新创业大赛', organizer: '信息工程学院', level: '国家级', status: '未开始'},
        {name: '中国“互联网+”大学生创新创业大赛', organizer: '信息工程学院', level: '国家级', status: '申报中'},
        {name: '中国“互联网+”大学生创新创业大赛', organizer: '信息工程学院', level: '国家级', status: '未开始'},
        {name: '中国“互联网+”大学生创新创业大赛', organizer: '信息工程学院', level: '国家级', status: '进行中'},
        {name: '中国“互联网+”大学生创新创业大赛', organizer: '信息工程学院', level: '国家级', status: '未开始'},
        {name: '中国“互联网+”大学生创新创业大赛', organizer: '信息工程学院', level: '国家级', status: '未开始'},
        {name: '中国“互联网+”大学生创新创业大赛', organizer: '信息工程学院', level: '国家级', status: '已结束'}
      ]
    }
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },

    resetDateFilter() {
      this.$refs.filterTable.clearFilter('date');
    },
    clearFilter() {
      this.$refs.filterTable.clearFilter();
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.status === value;
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    }
  }
}
</script>

<style>

</style>
