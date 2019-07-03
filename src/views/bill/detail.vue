<template>
  <div class="app-container">
    <el-container>
      <el-header style="  line-height: 60px;">
        <el-row :gutter="20" type="flex" justify="space-between">
          <el-col :span="15">收货单位：{{ bill.billAddress }}</el-col>
          <el-col :span="5">送货日期：{{ bill.billDate }}</el-col>
        </el-row>
      </el-header>
      <el-table
        v-loading="listLoading"
        :data="billDetails"
        element-loading-text="Loading"
        border
        fit
        stripe
        show-summary
        highlight-current-row
        :summary-method="getSummaries"
      >
        <el-table-column align="center" label="楼号">
          <template slot-scope="scope">
            {{ scope.row.buildNo }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="规格">
          <template slot-scope="scope">
            {{ scope.row.format }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="宽">
          <template slot-scope="scope">
            {{ scope.row.width }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="高">
          <template slot-scope="scope">
            {{ scope.row.height }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="数量">
          <template slot-scope="scope">
            {{ scope.row.amount }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="面积">
          <template slot-scope="scope">
            {{ scope.row.area }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="总面积">
          <template slot-scope="scope">
            {{ scope.row.totalArea }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="单价">
          <template slot-scope="scope">
            {{ scope.row.unitPrice }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="金额">
          <template slot-scope="scope">
            {{ scope.row.totalPrice }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注">
          <template slot-scope="scope">
            {{ scope.row.remark }}
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="space-between" style="margin-top: 15px;margin-left: 20px">
        <el-col :span="24">备注：{{ bill.billRemark }}</el-col>
      </el-row>
    </el-container>
  </div>
</template>

<script>
import { findDetailByBillId } from '@/api/bill'

export default {
  filters: {},
  data() {
    return {
      billDetails: null,
      bill: {
        billAddress: '',
        billDate: ''
      },
      listLoading: true,
      dialogFormVisible: false
    }
  },
  created() {
    this.loadData(this.$route.query.id)
  },
  methods: {
    loadData(billId) {
      this.listLoading = true
      findDetailByBillId({ billId: billId }).then(res => {
        this.bill = res.data.bill
        this.billDetails = res.data.detail
        this.bill.others.map(item => {
          this.billDetails.push({ format: '其他费用', totalPrice: item.price, remark: item.desc })
        })
        this.listLoading = false
      })
    },
    getSummaries(param) {
      if (this.bill === null) {
        return []
      }
      const sums = []
      sums[1] = '合计'
      sums[4] = this.bill.billAmount
      sums[6] = this.bill.billArea
      sums[8] = this.bill.billTotal
      return sums
    }
  }
}
</script>

