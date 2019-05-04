<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      stripe
      highlight-current-row
    >
      <el-table-column label="送货单ID" align="center" width="90">
        <template slot-scope="scope">
          {{ scope.row.billId }}
        </template>
      </el-table-column>
      <el-table-column label="收货单位" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.billAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="总面积">
        <template slot-scope="scope">
          <span>{{ scope.row.billArea }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="总金额">
        <template slot-scope="scope">
          <span>{{ scope.row.billTotal }}</span>
        </template>
      </el-table-column>
      <el-table-column label="送货日期" align="center">
        <template slot-scope="scope">
          {{ scope.row.billDate }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <router-link :to="'/bill/detail?id='+scope.row.billId">
            <el-button type="primary" size="small" icon="el-icon-edit">查看详情</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :current-page.sync="pageQuery.curPage"
      :page-size.sync="pageQuery.capacity"
      :page-count="50"
      style=" padding: 32px 16px;"
      @current-change="fetchData"
    />
  </div>
</template>

<script>
import { findAll } from '@/api/bill'

export default {
  filters: {},
  data() {
    return {
      list: null,
      listLoading: true,
      pageQuery: {
        curPage: 1,
        capacity: 15
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      findAll(this.pageQuery).then(response => {
        this.listLoading = false
        this.list = response.data
      })
    }
  }
}
</script>
