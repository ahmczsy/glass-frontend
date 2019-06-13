<template>
  <div class="app-container">
    <el-button type="warning" @click="returnDetail">返回订单详情</el-button>
    <el-button type="warning" @click="resetDialogData">重置数据</el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="规格">
        <template slot-scope="scope">
          {{ scope.row.format }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="宽度(mm)">
        <template slot-scope="scope">
          {{ scope.row.width }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="高度(mm)">
        <template slot-scope="scope">
          {{ scope.row.height }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="数量">
        <template slot-scope="scope">
          {{ scope.row.amount }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="面积(m²)">
        <template slot-scope="scope">
          {{ scope.row.area }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="单价(元)">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="manualSumbit">提交</el-button>
    </div>
  </div>
</template>

<script>
import { manualInput } from '@/api/order'
import { findAll as formatFindAll } from '@/api/format'

export default {
  data() {
    return {
      order: null,

    }
  },
  created() {
    this.order = this.$route.query.order
  },
  methods: {
    returnDetail() {
      this.$router.push({ path: '/order/detail', query: { order: this.order }})
    }

  }
}
</script>
