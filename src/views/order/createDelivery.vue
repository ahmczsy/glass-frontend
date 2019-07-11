<template>
  <div class="app-container">
    <el-button type="warning" @click="returnDetail">返回订单详情</el-button>
    <el-table
      :data="billItem"
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
      <el-table-column align="center" label="选择">
        <template slot-scope="scope">
          <el-select v-model="currentOrderId" placeholder="请选择" @change="orderDetailChange">
            <el-option
              v-for="item in detailOption"
              :key="item.orderDetailId"
              :label="item.show"
              :value="item.orderDetailId"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="maxAmount |showAmount">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.amount" :min="1" :max="maxAmount" label="描述文字" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="楼号">
        <template slot-scope="scope">
          <el-input v-model="scope.row.buildNo" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <el-button type="primary" plain @click="addBill">添加</el-button>
      </el-table-column>
    </el-table>

    <div style="margin-top: 50px">
      <el-button type="primary" @click="dialogOther=true">添加送货单其他费用</el-button>
    </div>
    <div style="margin-top: 5px;width: 50%">
      <el-form ref="addressForm" label-width="80px" :rules="addressRule" :model="deliveryData">
        <el-form-item label="送货地址" required prop="address">
          <el-input v-model="deliveryData.address" placeholder="送货地址" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="deliveryData.remark" placeholder="送货单的总备注" />
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="deliveryData.item"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="left" label="送货单列表:">

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
        <el-table-column align="center" label="送货数量">
          <template slot-scope="scope">
            {{ scope.row.amount }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="总面积(m²)">
          <template slot-scope="scope">
            {{ scope.row.totalArea }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="单价(元)">
          <template slot-scope="scope">
            {{ scope.row.unitPrice }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="总价(元)">
          <template slot-scope="scope">
            {{ scope.row.totalPrice }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注">
          <template slot-scope="scope">
            {{ scope.row.remark }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="120px">
          <template slot-scope="scope">
            <el-button type="danger" plain @click="deleteBill(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>

    <el-row style="margin-top: 20px" type="flex" justify="end">
      <el-table
        :data="deliveryData.other"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        width="100%"
      >
        <el-table-column align="left" label="其他费用:">
          <el-table-column align="center" label="价格" width="90px">
            <template slot-scope="scope">
              {{ scope.row.price }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="说明">
            <template slot-scope="scope">
              {{ scope.row.desc }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="120px">
            <template slot-scope="scope">
              <el-button type="danger" plain @click="deleteOther(scope)">删除</el-button>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </el-row>

    <el-row type="flex" justify="center" style="margin-top: 20px;">
      <el-table
        :data="statisticsData"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        width="100%"
      >
        <el-table-column align="left" label="统计信息:">
          <el-table-column align="center" label="玻璃费用">
            <template slot-scope="scope">
              {{ scope.row.glassPrice }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="其他费用">
            <template slot-scope="scope">
              {{ scope.row.otherPrice }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="总费用">
            <template slot-scope="scope">
              {{ scope.row.totalPrice }}
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </el-row>

    <el-row type="flex" justify="end" style="margin-top: 20px;">
      <el-button type="primary" @click="submit">提交</el-button>
    </el-row>

    <el-dialog :visible.sync="dialogOther" title="添加其他费用">
      <el-form ref="otherForm" :rules="otherRules" :model="tempOtherItem">
        <el-form-item label="价格" prop="price" required>
          <!--<el-input v-model="tempOtherItem.price" placeholder="价格" />-->
          <el-input-number v-model="tempOtherItem.price" :min="1" :max="999999" />
        </el-form-item>
        <el-form-item label="说明" prop="desc" required>
          <el-input v-model="tempOtherItem.desc" placeholder="详细说明" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogOther = false">取消</el-button>
        <el-button type="primary" @click="addOther">提交</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { createByManual } from '@/api/bill'

export default {
  filters: {
    showAmount(maxAmount) {
      return '送货数量(最多:' + maxAmount + ')'
    }
  },
  data() {
    return {
      dialogOther: false,
      billItem: [{}],
      maxAmount: 9999,
      currentOrderId: null,
      currentOrderDetail: null,
      order: null,
      orderDetailList: null,
      selectedOrderDetailList: [],
      detailOption: null,
      sumitBillItem: [],
      deliveryData: {
        orderId: null,
        customerId: null,
        address: '',
        item: [],
        other: [],
        remark: null
      },
      tempOtherItem: {},
      otherRules: {
        desc: [{ required: true, message: '请输入说明' }],
        price: [{ required: true, message: '请输入价格' }]
      },
      addressRule: {
        address: [{ required: true, message: '请输入送货地址' }]
      },
      statisticsData: [{
        glassPrice: 0,
        totalPrice: 0,
        otherPrice: 0
      }]

    }
  },
  watch: {
    'deliveryData.item': function() {
      this.calculateTotal()
    },
    'deliveryData.other': function() {
      this.calculateTotal()
    }

  },
  created() {
    this.order = JSON.parse(this.$route.query.order)
    this.orderDetailList = []
    JSON.parse(this.$route.query.orderDetailList).map(item => {
      const leftAmount = item.amount - item.deliveredAmount
      if (leftAmount > 0) {
        item.leftAmount = leftAmount
        this.orderDetailList.push(item)
      }
    })
    this.resetBillItem()
    this.buildDetailOption()
  },
  methods: {
    addBill() {
      let msg = null
      const data = this.billItem[0]
      if (data.buildNo === null || data.buildNo.trim() === '') {
        msg = '请输入楼号'
      }
      if (data.amount === null || data.amount === 0) {
        msg = '请输入送货数量'
      }
      if (data.orderDetailId === null || data.orderDetailId === 0) {
        msg = '请选择玻璃尺寸'
      }
      if (msg !== null) {
        this.$message({
          message: msg,
          type: 'warning',
          duration: 5 * 1000
        })
        return
      }
      // 验证通过
      data.totalArea = parseFloat((data.height * data.width * data.amount / 1000000).toFixed(2))
      data.totalPrice = parseFloat((data.unitPrice * data.totalArea).toFixed(2))
      this.deliveryData.item.push(data)

      // 从orderDetailList，detailOption移除，添加到selectedOrderDetailList中
      const detail = this.findDetailById(data.orderDetailId)
      this.selectedOrderDetailList.push(detail)
      this.orderDetailList = this.orderDetailList.filter(item => {
        return item.orderDetailId !== detail.orderDetailId
      })
      this.buildDetailOption()
      // 清空
      this.currentOrderDetail = null
      this.currentOrderId = null
      this.maxAmount = 9999
      this.resetBillItem()
    },
    deleteBill(row) {
      const orderDetailId = row.orderDetailId

      const orderDetail = this.selectedOrderDetailList.find(item => {
        return item.orderDetailId === orderDetailId
      })

      this.orderDetailList.push(orderDetail)
      this.buildDetailOption()
      this.selectedOrderDetailList = this.selectedOrderDetailList.filter(item => {
        return item.orderDetailId !== orderDetailId
      })

      this.deliveryData.item = this.deliveryData.item.filter(item => {
        return item.orderDetailId !== orderDetailId
      })
    },
    submit() {
      this.$refs['addressForm'].validate(valid => {
        if (!valid) {
          return
        }
        if (this.deliveryData.item.length === 0) {
          this.$message({
            message: '送货单不能为空',
            type: 'warning',
            duration: 5 * 1000
          })
          return
        }
        // 提交
        this.deliveryData.customerId = this.order.orderCustomerId
        this.deliveryData.orderId = this.order.orderId
        createByManual(this.deliveryData).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.$router.back(-1)
        })
      })
    },
    orderDetailChange(orderDetailId) {
      const orderDetail = this.findDetailById(orderDetailId)
      this.currentOrderDetail = orderDetail
      this.maxAmount = orderDetail.leftAmount
      this.billItem[0].orderDetailId = orderDetail.orderDetailId
      this.billItem[0].height = orderDetail.height
      this.billItem[0].width = orderDetail.width
      this.billItem[0].format = orderDetail.format
      this.billItem[0].unitPrice = orderDetail.price
    },
    returnDetail() {
      this.$router.push({ path: '/order/detail', query: { order: JSON.stringify(this.order) }})
    },
    findDetailById(id) {
      return this.orderDetailList.find(item => {
        return item.orderDetailId === id
      })
    },
    buildDetailOption() {
      this.detailOption = this.orderDetailList.map((item, index) => {
        return {
          show: item.format + '   ' + item.height + '×' + item.width,
          orderDetailId: item.orderDetailId
        }
      })
    },
    resetBillItem() {
      this.billItem[0] = {
        orderDetailId: null,
        height: null,
        width: null,
        amount: null,
        buildNo: null,
        remark: null,
        format: null,
        unitPrice: null
      }
    },
    addOther() {
      this.$refs['otherForm'].validate(valid => {
        if (!valid) {
          return
        }
        // 通过验证
        this.deliveryData.other.push(this.tempOtherItem)
        this.tempOtherItem = {}
        this.dialogOther = false
      })
    },
    deleteOther(scope) {
      const index = scope.$index
      this.deliveryData.other.splice(index, 1)
    },
    calculateTotal() {
      let glassPrice = 0
      let otherPrice = 0
      this.deliveryData.item.map(item => {
        glassPrice += item.totalPrice
      })
      this.deliveryData.other.map(item => {
        otherPrice += item.price
      })
      this.statisticsData[0].glassPrice = glassPrice
      this.statisticsData[0].otherPrice = otherPrice
      this.statisticsData[0].totalPrice = glassPrice + otherPrice
    }

  }
}
</script>
