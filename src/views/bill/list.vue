<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 10px">
      <el-button v-if="!isAll" type="warning" @click="returnDetail">返回订单详情</el-button>
    </div>
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
      v-if="isAll"
      background
      layout="prev, pager, next,jumper"
      :current-page.sync="pageQuery.curPage"
      :page-size.sync="pageQuery.capacity"
      :page-count="9999"
      style=" padding: 32px 16px;"
      @current-change="fetchData"
    />
  </div>
</template>

<script>
import { findAll, findByOrderId } from '@/api/bill'

export default {
  filters: {},
  data() {
    return {
      list: null,
      listLoading: true,
      pageQuery: {
        curPage: 1,
        capacity: 15
      },
      isAll: null,
      order: null
    }
  },
  created() {
    const text = this.$route.query.order || ''
    if (text === '') {
      this.isAll = true
    } else {
      this.order = JSON.parse(text)
      this.isAll = false
    }
    if (this.isAll) {
      this.fetchData()
    } else {
      this.fetchDataByOrderId()
    }
  },
  methods: {
    fetchData() {
      this.listLoading = true
      findAll(this.pageQuery).then(response => {
        this.listLoading = false
        this.list = response.data
      })
    },
    fetchDataByOrderId() {
      this.listLoading = true
      findByOrderId({ 'orderId': this.order.orderId }).then(res => {
        this.listLoading = false
        this.list = res.data
      })
    },
    returnDetail() {
      this.$router.push({ path: '/order/detail', query: { order: JSON.stringify(this.order) }})
    }
  }
}
</script>
